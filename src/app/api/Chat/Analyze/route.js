import { buildAnalysisPrompt, systemPrompt } from "@/lib/claudePrompt";

// Fallback demo key - Replace with your actual key in .env.local
const DEMO_KEY = "sk-ant-demo-key-for-development-only";

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

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || DEMO_KEY;
    const isDemo = !process.env.ANTHROPIC_API_KEY;

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

    console.log("🧠 Sending request to Anthropic Claude API", isDemo ? "(DEMO MODE)" : "");

    try {
      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        timeout: 30000,
      });

      if (!anthropicRes.ok) {
        const errorData = await anthropicRes.json().catch(() => ({}));
        console.error("❌ Anthropic API error:", errorData);
        throw new Error(
          errorData.error?.message || `API error: ${anthropicRes.status}`
        );
      }

      const anthropicData = await anthropicRes.json();
      console.log("✅ Received response from Anthropic");

      // Extract text content from response
      const responseText = anthropicData.content[0].text;
      console.log("📝 Raw response:", responseText.substring(0, 200) + "...");

      // Parse JSON from response
      let analysisResult;
      try {
        // Try to extract JSON from the response (in case of preamble/explanation)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
        } else {
          analysisResult = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("❌ Failed to parse JSON response:", parseError);
        throw new Error("Invalid JSON response from analysis");
      }

      console.log("✅ Successfully parsed analysis result");
      console.log("📊 Changes detected:", analysisResult.changes.length);

      return new Response(JSON.stringify(analysisResult), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (apiError) {
      console.error("❌ API Error:", apiError.message);

      // Return user-friendly error message
      return new Response(
        JSON.stringify({
          error:
            isDemo && apiError.message.includes("401")
              ? "We could not connect to our servers, but your app is working. Please add your ANTHROPIC_API_KEY to .env.local to enable contract analysis."
              : "We could not connect to our servers, but app must work. Please try again or contact support.",
          demo: isDemo,
          details: process.env.NODE_ENV === "development" ? apiError.message : undefined,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("❌ Request parsing error:", error);
    return new Response(
      JSON.stringify({
        error: "We could not connect to our servers, but app must work.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
