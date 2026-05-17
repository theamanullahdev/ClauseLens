// app/api/Chat/Analyze/route.js
import { buildAnalysisPrompt, systemPrompt } from "@/lib/claudePrompt";
import { createHash } from "crypto";

// ─────────────────────────────────────────────────────────────────────────────
// IN-MEMORY CACHE  (survives across requests in the same server process)
// key = sha256(original + revised), TTL = 1 hour
// ─────────────────────────────────────────────────────────────────────────────
const cache = new Map(); // key → { result, ts }
const CACHE_TTL_MS = 60 * 60 * 1000;

function getCacheKey(original, revised) {
  return createHash("sha256")
    .update(original + "|||" + revised)
    .digest("hex");
}

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.result;
}

function cacheSet(key, result) {
  // keep cache bounded — evict oldest if > 50 entries
  if (cache.size >= 50) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  cache.set(key, { result, ts: Date.now() });
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
const MAX_CHARS = 40_000;

function cleanText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+$/gm, "")
    .trim();
}

function parseAnalysisResponse(responseText) {
  if (!responseText || typeof responseText !== "string") {
    throw new Error("Empty or non-string response");
  }
  const stripped = responseText
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object found in response");

  const parsed = JSON.parse(jsonMatch[0]);

  // structural validation — must have these fields
  if (!Array.isArray(parsed.changes)) throw new Error("Missing changes array");
  if (!parsed.overall_risk) throw new Error("Missing overall_risk");
  if (!parsed.summary) throw new Error("Missing summary");

  return parsed;
}

function withTimeout(promise, ms, name) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`${name} timed out after ${ms / 1000}s`)),
      ms,
    );
  });
  return Promise.race([promise, timeout]).finally(() =>
    clearTimeout(timeoutId),
  );
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDERS
// Each throws on any failure (auth, quota, parse, timeout).
// Each validates the JSON before returning — so Promise.any only resolves
// on a genuinely usable result.
// ─────────────────────────────────────────────────────────────────────────────

async function analyzeWithAnthropic(original, revised, apiKey) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        { role: "user", content: buildAnalysisPrompt(original, revised) },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err.error?.message || response.statusText;
    // 401 = bad key, 429 = rate limit, 402 = billing — no point retrying
    throw new Error(`Anthropic ${response.status}: ${msg}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error("Anthropic returned empty content");
  return { parsed: parseAnalysisResponse(text), api: "Anthropic Claude" };
}

async function analyzeWithDeepSeek(original, revised, apiKey) {
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: 4096,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: buildAnalysisPrompt(original, revised) },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `DeepSeek ${response.status}: ${err.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("DeepSeek returned empty content");
  return { parsed: parseAnalysisResponse(text), api: "DeepSeek" };
}

async function analyzeWithGemini(original, revised, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: buildAnalysisPrompt(original, revised) }] }],
      generationConfig: { maxOutputTokens: 4096, temperature: 0.1 },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    // Extract a clean message from Gemini's verbose error
    const msg = err.error?.message?.split("\n")[0] || response.statusText;
    throw new Error(`Gemini ${response.status}: ${msg}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty content");
  return { parsed: parseAnalysisResponse(text), api: "Gemini 2.0 Flash" };
}

async function analyzeWithOpenRouter(original, revised, apiKey) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://clauselens.app",
        "X-Title": "ClauseLens",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        max_tokens: 4096,
        temperature: 0.1,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: buildAnalysisPrompt(original, revised) },
        ],
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `OpenRouter ${response.status}: ${err.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenRouter returned empty content");
  return { parsed: parseAnalysisResponse(text), api: "OpenRouter (DeepSeek)" };
}

// OpenRouter with a faster model as an extra fallback
async function analyzeWithOpenRouterFast(original, revised, apiKey) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://clauselens.app",
        "X-Title": "ClauseLens",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001", // faster via OpenRouter
        max_tokens: 4096,
        temperature: 0.1,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: buildAnalysisPrompt(original, revised) },
        ],
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `OpenRouter/Gemini ${response.status}: ${err.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenRouter/Gemini returned empty content");
  return {
    parsed: parseAnalysisResponse(text),
    api: "OpenRouter (Gemini Flash)",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER CONFIG
// timeout: how long to wait before giving up on this specific provider
// Slow providers (OpenRouter/DeepSeek) get more time since they're often
// the only working key. Fast providers get cut off early so they don't
// block Promise.any from settling.
// ─────────────────────────────────────────────────────────────────────────────
function buildCandidates(original, revised, env) {
  const {
    ANTHROPIC_API_KEY,
    DEEPSEEK_API_KEY,
    GEMINI_API_KEY,
    OPENROUTERS_API_KEY,
  } = env;

  const providers = [];

  if (ANTHROPIC_API_KEY?.startsWith("sk-ant-")) {
    providers.push({
      name: "Anthropic",
      fn: analyzeWithAnthropic,
      key: ANTHROPIC_API_KEY,
      timeout: 30_000,
    });
  }
  if (GEMINI_API_KEY) {
    providers.push({
      name: "Gemini",
      fn: analyzeWithGemini,
      key: GEMINI_API_KEY,
      timeout: 20_000,
    });
  }
  if (DEEPSEEK_API_KEY?.startsWith("sk-")) {
    providers.push({
      name: "DeepSeek",
      fn: analyzeWithDeepSeek,
      key: DEEPSEEK_API_KEY,
      timeout: 45_000,
    });
  }
  if (OPENROUTERS_API_KEY?.startsWith("sk-or-")) {
    providers.push({
      name: "OpenRouter/Gemini",
      fn: analyzeWithOpenRouterFast,
      key: OPENROUTERS_API_KEY,
      timeout: 30_000,
    });
    providers.push({
      name: "OpenRouter/DeepSeek",
      fn: analyzeWithOpenRouter,
      key: OPENROUTERS_API_KEY,
      timeout: 90_000,
    });
  }

  return providers.map(({ name, fn, key, timeout }) =>
    withTimeout(fn(original, revised, key), timeout, name)
      .then((r) => {
        console.log(`✅ ${name} succeeded`);
        return r;
      })
      .catch((e) => {
        console.log(`❌ ${name} failed: ${e.message}`);
        throw e;
      }),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req) {
  const startTime = Date.now();
  const reqId = Math.random().toString(36).slice(2, 8).toUpperCase();

  console.log(`\n${"=".repeat(48)}`);
  console.log(`📥 POST /api/Chat/Analyze  [${reqId}]`);
  console.log(`${"=".repeat(48)}`);

  // ── 1. Parse body ──────────────────────────────────────────────────────────
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (!body?.original || !body?.revised) {
    return jsonResponse(
      { error: "Both original and revised documents are required" },
      400,
    );
  }

  // ── 2. Clean & validate size ───────────────────────────────────────────────
  const original = cleanText(body.original);
  const revised = cleanText(body.revised);

  console.log(`📄 Original : ${original.length.toLocaleString()} chars`);
  console.log(`📄 Revised  : ${revised.length.toLocaleString()} chars`);

  if (original.length > MAX_CHARS || revised.length > MAX_CHARS) {
    return jsonResponse(
      {
        error: `Document too large. Max ${MAX_CHARS.toLocaleString()} characters per document. Got ${Math.max(original.length, revised.length).toLocaleString()}.`,
      },
      400,
    );
  }

  if (original.length < 50 || revised.length < 50) {
    return jsonResponse(
      { error: "Documents too short to analyze (min 50 characters)." },
      400,
    );
  }

  // ── 3. Cache check ─────────────────────────────────────────────────────────
  const cacheKey = getCacheKey(original, revised);
  const cached = cacheGet(cacheKey);
  if (cached) {
    console.log(`⚡ Cache hit [${reqId}] — returning instantly`);
    return jsonResponse({
      ...cached,
      _meta: { ...cached._meta, cached: true },
    });
  }

  // ── 4. Build candidates ────────────────────────────────────────────────────
  const env = {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    OPENROUTERS_API_KEY: process.env.OPENROUTERS_API_KEY,
  };

  // Log which keys are actually configured (not just present)
  console.log(
    `🔑 Anthropic  : ${env.ANTHROPIC_API_KEY?.startsWith("sk-ant-") ? "✅" : "❌"}`,
  );
  console.log(
    `🔑 DeepSeek   : ${env.DEEPSEEK_API_KEY?.startsWith("sk-") ? "✅" : "❌"}`,
  );
  console.log(`🔑 Gemini     : ${env.GEMINI_API_KEY ? "✅" : "❌"}`);
  console.log(
    `🔑 OpenRouter : ${env.OPENROUTERS_API_KEY?.startsWith("sk-or-") ? "✅" : "❌"}`,
  );

  const candidates = buildCandidates(original, revised, env);

  if (candidates.length === 0) {
    return jsonResponse(
      { error: "No valid API keys configured. Add at least one key to .env." },
      500,
    );
  }

  console.log(`🚀 Firing ${candidates.length} provider(s) in parallel…`);

  // ── 5. Race providers ──────────────────────────────────────────────────────
  let winner;
  try {
    winner = await Promise.any(candidates);
  } catch (aggregateError) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const messages = aggregateError.errors?.map((e) => e.message) ?? [];

    // Categorize failures for a cleaner user-facing message
    const hasAuth = messages.some((m) =>
      /401|invalid.*key|unauthorized/i.test(m),
    );
    const hasQuota = messages.some((m) =>
      /402|429|quota|balance|rate.?limit/i.test(m),
    );
    const hasTimeout = messages.some((m) => /timed out/i.test(m));

    let userMessage = "All analysis providers failed.";
    if (hasAuth && !hasQuota) userMessage += " Check your API keys.";
    if (hasQuota && !hasAuth)
      userMessage += " API quota or balance exhausted — add credits.";
    if (hasAuth && hasQuota)
      userMessage += " Some keys are invalid, others have no balance.";
    if (hasTimeout) userMessage += " Providers took too long to respond.";

    console.error(
      `❌ All ${candidates.length} providers failed after ${elapsed}s`,
    );
    messages.forEach((m, i) => console.error(`   [${i + 1}] ${m}`));
    console.log(`${"=".repeat(48)}\n`);

    return jsonResponse(
      {
        error: userMessage,
        details: process.env.NODE_ENV === "development" ? messages : undefined,
      },
      502,
    );
  }

  // ── 6. Build final response ────────────────────────────────────────────────
  const elapsed = Date.now() - startTime;
  const finalResult = {
    ...winner.parsed,
    _meta: {
      api: winner.api,
      elapsedMs: elapsed,
      cached: false,
      reqId,
    },
  };

  console.log(`🔧 Winner    : ${winner.api}`);
  console.log(`📊 Changes   : ${winner.parsed.changes?.length ?? 0}`);
  console.log(`🚦 Risk      : ${winner.parsed.overall_risk}`);
  console.log(`⏱  Elapsed   : ${(elapsed / 1000).toFixed(1)}s`);
  console.log(`${"=".repeat(48)}\n`);

  // ── 7. Cache & return ──────────────────────────────────────────────────────
  cacheSet(cacheKey, finalResult);
  return jsonResponse(finalResult);
}
