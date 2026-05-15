import { buildAnalysisPrompt, systemPrompt } from "@/lib/claudePrompt";

async function analyzeWithAnthropic(original, revised, apiKey) {
  console.log("🤖 Trying Anthropic Claude API...");
  const prompt = buildAnalysisPrompt(original, revised);

  const payload = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Anthropic error ${response.status}: ${errorData.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  return data.content[0].text;
}

async function analyzeWithDeepSeek(original, revised, apiKey) {
  console.log("🤖 Trying DeepSeek API...");
  const prompt = buildAnalysisPrompt(original, revised);

  const payload = {
    model: "deepseek-chat",
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `DeepSeek error ${response.status}: ${errorData.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function analyzeWithOpenRouter(original, revised, apiKey) {
  console.log("🤖 Trying OpenRouter API...");
  const prompt = buildAnalysisPrompt(original, revised);

  const payload = {
    model: "deepseek/deepseek-chat",
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `OpenRouter error ${response.status}: ${errorData.error?.message || response.statusText}`,
    );
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function parseAnalysisResponse(responseText) {
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return JSON.parse(responseText);
}

export async function POST(req) {
  console.log("📥 Incoming POST request to /api/Chat/Analyze");

  try {
    const body = await req.json();
    const { original, revised } = body;

    if (!original || !revised) {
      return new Response(
        JSON.stringify({
          error: "Both original and revised documents are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log("📄 Original doc length:", original.length);
    console.log("📄 Revised doc length:", revised.length);

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTERS_API_KEY;

    // Detect key type by prefix
    const isRealAnthropicKey = ANTHROPIC_API_KEY?.startsWith("sk-ant-");
    const isDeepSeekKey =
      ANTHROPIC_API_KEY?.startsWith("sk-") && !isRealAnthropicKey;
    const isOpenRouterKey = OPENROUTER_API_KEY?.startsWith("sk-or-");

    let responseText = null;
    let apiUsed = null;
    let lastError = null;

    // 1. Try real Anthropic key
    if (isRealAnthropicKey) {
      try {
        responseText = await analyzeWithAnthropic(
          original,
          revised,
          ANTHROPIC_API_KEY,
        );
        apiUsed = "Anthropic Claude";
        console.log("✅ Anthropic API succeeded");
      } catch (error) {
        console.error("⚠️ Anthropic API failed:", error.message);
        lastError = error;
      }
    }

    // 2. Try DeepSeek key directly
    if (!responseText && isDeepSeekKey) {
      try {
        responseText = await analyzeWithDeepSeek(
          original,
          revised,
          ANTHROPIC_API_KEY,
        );
        apiUsed = "DeepSeek";
        console.log("✅ DeepSeek API succeeded");
      } catch (error) {
        console.error("⚠️ DeepSeek API failed:", error.message);
        lastError = error;
      }
    }

    // 3. Fallback to OpenRouter
    if (!responseText && isOpenRouterKey) {
      try {
        responseText = await analyzeWithOpenRouter(
          original,
          revised,
          OPENROUTER_API_KEY,
        );
        apiUsed = "OpenRouter (DeepSeek)";
        console.log("✅ OpenRouter API succeeded");
      } catch (error) {
        console.error("⚠️ OpenRouter API failed:", error.message);
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

    let analysisResult;
    try {
      console.log("📝 Parsing response from", apiUsed);
      analysisResult = parseAnalysisResponse(responseText);
    } catch (parseError) {
      console.error("❌ Failed to parse JSON response:", parseError);
      console.error("Raw response:", responseText.slice(0, 500));
      return new Response(
        JSON.stringify({
          error: "Invalid response format from analysis service",
          details:
            process.env.NODE_ENV === "development"
              ? parseError.message
              : undefined,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log("✅ Successfully parsed analysis result");
    console.log("📊 Changes detected:", analysisResult.changes?.length || 0);
    console.log("🔧 API Used:", apiUsed);

    return new Response(JSON.stringify(analysisResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
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
