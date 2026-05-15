import { buildAnalysisPrompt, systemPrompt } from "@/lib/claudePrompt";

async function analyzeWithAnthropic(original, revised, apiKey) {
  console.log("🤖 Trying Anthropic Claude API...");
  const prompt = buildAnalysisPrompt(original, revised);

  const payload = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    system: systemPrompt,
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    timeout: 30000,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Anthropic error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function analyzeWithOpenRouter(original, revised, apiKey) {
  console.log("🤖 Trying OpenRouter API...");
  const prompt = buildAnalysisPrompt(original, revised);

  const payload = {
    model: "deepseek/deepseek-chat",
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
    max_tokens: 4096,
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    timeout: 30000,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(req) {
  console.log("📥 Incoming POST request to /api/Chat/Analyze");

  try {
    const body = await req.json();
    const { original, revised } = body;

    if (!original || !revised) {
      return new Response(
        JSON.stringify({ error: "Both original and revised documents are required" }),
        { status: 400 }
      );
    }

    console.log("📄 Original doc length:", original.length);
    console.log("📄 Revised doc length:", revised.length);

    // Try available API keys in order
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTERS_API_KEY;

    let responseText;
    let apiUsed = null;
    let lastError = null;

    // Try Anthropic first
    if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY.includes("sk-")) {
      try {
        console.log("🤖 Trying Anthropic Claude API...");
        responseText = await analyzeWithAnthropic(original, revised, ANTHROPIC_API_KEY);
        apiUsed = "Anthropic Claude";
        console.log("✅ Anthropic API succeeded");
      } catch (error) {
        console.error("⚠️ Anthropic API failed:", error.message);
        lastError = error;
      }
    }

    // Fallback to OpenRouter if Anthropic failed or unavailable
    if (!responseText && OPENROUTER_API_KEY && OPENROUTER_API_KEY.includes("sk-or")) {
      try {
        console.log("🤖 Trying OpenRouter API (DeepSeek)...");
        responseText = await analyzeWithOpenRouter(original, revised, OPENROUTER_API_KEY);
        apiUsed = "OpenRouter (DeepSeek)";
        console.log("✅ OpenRouter API succeeded");
      } catch (error) {
        console.error("⚠️ OpenRouter API failed:", error.message);
        lastError = error;
      }
    }

    // If both failed, return error
    if (!responseText) {
      console.error("❌ All APIs failed. Last error:", lastError?.message);
      return new Response(
        JSON.stringify({
          error: "We could not connect to our servers, but app must work. No valid API keys configured. Please add ANTHROPIC_API_KEY or OPENROUTERS_API_KEY to .env",
          details: process.env.NODE_ENV === "development" ? lastError?.message : undefined,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse JSON response
    let analysisResult;
    try {
      console.log("📝 Parsing response from", apiUsed);
      // Try to extract JSON from the response (in case of preamble/explanation)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        analysisResult = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error("❌ Failed to parse JSON response:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid response format from analysis service",
          details: process.env.NODE_ENV === "development" ? parseError.message : undefined,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
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
    console.error("❌ Request parsing error:", error);
    return new Response(
      JSON.stringify({
        error: "We could not connect to our servers, but app must work.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
