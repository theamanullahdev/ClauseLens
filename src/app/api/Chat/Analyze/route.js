import { buildAnalysisPrompt, systemPrompt } from "@/lib/claudePrompt";

async function analyzeWithAnthropic(original, revised, apiKey) {
  console.log("🤖 [1/4] Trying Anthropic Claude API...");
  const prompt = buildAnalysisPrompt(original, revised);

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
      messages: [{ role: "user", content: prompt }],
    }),
  });

  console.log("📡 Anthropic status:", response.status);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Anthropic error ${response.status}: ${errorData.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  console.log("✅ Anthropic succeeded");
  return data.content[0].text;
}

async function analyzeWithDeepSeek(original, revised, apiKey) {
  console.log("🤖 [2/4] Trying DeepSeek API...");
  const prompt = buildAnalysisPrompt(original, revised);

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
        { role: "user", content: prompt },
      ],
    }),
  });

  console.log("📡 DeepSeek status:", response.status);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `DeepSeek error ${response.status}: ${errorData.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  console.log("✅ DeepSeek succeeded");
  return data.choices[0].message.content;
}

async function analyzeWithGemini(original, revised, apiKey) {
  console.log("🤖 [3/4] Trying Gemini (gemini-1.5-flash)...");
  const prompt = buildAnalysisPrompt(original, revised);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 4096, temperature: 0.1 },
    }),
  });

  console.log("📡 Gemini status:", response.status);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Gemini error ${response.status}: ${JSON.stringify(errorData.error || errorData)}`,
    );
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty content");
  console.log("✅ Gemini succeeded");
  return text;
}

async function analyzeWithOpenRouter(original, revised, apiKey) {
  console.log("🤖 [4/4] Trying OpenRouter (DeepSeek)...");
  const prompt = buildAnalysisPrompt(original, revised);

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        max_tokens: 4096,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    },
  );

  console.log("📡 OpenRouter status:", response.status);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `OpenRouter error ${response.status}: ${errorData.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  console.log("✅ OpenRouter succeeded");
  return data.choices[0].message.content;
}

function parseAnalysisResponse(responseText) {
  console.log("🔍 Raw response preview:", responseText.slice(0, 300));
  const stripped = responseText
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error("No JSON object found in response");
}

export async function POST(req) {
  console.log("\n========================================");
  console.log("📥 POST /api/Chat/Analyze");
  console.log("========================================");

  try {
    const body = await req.json();
    const { original, revised } = body;

    if (!original || !revised) {
      console.error("❌ Missing original or revised text");
      return new Response(
        JSON.stringify({
          error: "Both original and revised documents are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log("📄 Original length:", original.length, "chars");
    console.log("📄 Revised length:", revised.length, "chars");

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTERS_API_KEY;

    const isRealAnthropicKey = ANTHROPIC_API_KEY?.startsWith("sk-ant-");
    const isDeepSeekKey = DEEPSEEK_API_KEY?.startsWith("sk-");
    const isOpenRouterKey = OPENROUTER_API_KEY?.startsWith("sk-or-");

    console.log("🔑 Anthropic:", isRealAnthropicKey ? "✅" : "❌");
    console.log("🔑 DeepSeek:", isDeepSeekKey ? "✅" : "❌");
    console.log("🔑 Gemini:", !!GEMINI_API_KEY ? "✅" : "❌");
    console.log("🔑 OpenRouter:", isOpenRouterKey ? "✅" : "❌");

    let responseText = null;
    let apiUsed = null;
    let lastError = null;

    // 1. Anthropic
    if (!responseText && isRealAnthropicKey) {
      try {
        responseText = await analyzeWithAnthropic(
          original,
          revised,
          ANTHROPIC_API_KEY,
        );
        apiUsed = "Anthropic Claude";
      } catch (error) {
        console.error("⚠️ Anthropic failed:", error.message);
        lastError = error;
      }
    }

    // 2. DeepSeek
    if (!responseText && isDeepSeekKey) {
      try {
        responseText = await analyzeWithDeepSeek(
          original,
          revised,
          DEEPSEEK_API_KEY,
        );
        apiUsed = "DeepSeek";
      } catch (error) {
        console.error("⚠️ DeepSeek failed:", error.message);
        lastError = error;
      }
    }

    // 3. Gemini
    if (!responseText && GEMINI_API_KEY) {
      try {
        responseText = await analyzeWithGemini(
          original,
          revised,
          GEMINI_API_KEY,
        );
        apiUsed = "Gemini 1.5 Flash";
      } catch (error) {
        console.error("⚠️ Gemini failed:", error.message);
        lastError = error;
      }
    }

    // 4. OpenRouter
    if (!responseText && isOpenRouterKey) {
      try {
        responseText = await analyzeWithOpenRouter(
          original,
          revised,
          OPENROUTER_API_KEY,
        );
        apiUsed = "OpenRouter (DeepSeek)";
      } catch (error) {
        console.error("⚠️ OpenRouter failed:", error.message);
        lastError = error;
      }
    }

    if (!responseText) {
      console.error("❌ All APIs failed. Last error:", lastError?.message);
      return new Response(
        JSON.stringify({
          error: "All analysis APIs failed. Check your API keys in .env.",
          details:
            process.env.NODE_ENV === "development"
              ? lastError?.message
              : undefined,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log("🔧 API that succeeded:", apiUsed);

    let analysisResult;
    try {
      analysisResult = parseAnalysisResponse(responseText);
      console.log("✅ JSON parsed successfully");
      console.log("📊 Changes detected:", analysisResult.changes?.length ?? 0);
      console.log("🚦 Overall risk:", analysisResult.overall_risk);
    } catch (parseError) {
      console.error("❌ JSON parse failed:", parseError.message);
      console.error("📄 Full raw response:\n", responseText);
      return new Response(
        JSON.stringify({
          error: "Failed to parse analysis response as JSON.",
          details:
            process.env.NODE_ENV === "development"
              ? parseError.message
              : undefined,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log("========================================\n");
    return new Response(JSON.stringify(analysisResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Unexpected top-level error:", error);
    return new Response(
      JSON.stringify({
        error: "Unexpected server error.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
