export async function POST(req) {
  console.log("📥 Incoming POST request to /api/Chat/Cover");

  try {
    const body = await req.json();
    console.log("🧾 Parsed body from client:", body);

    const OPENROUTER_API_KEY = process.env.OPENROUTERS_API_KEY;
    if (!OPENROUTER_API_KEY) {
      console.error("❌ Missing OPENROUTERS_API_KEY in env");
      return new Response(JSON.stringify({ error: "Missing API Key" }), {
        status: 401,
      });
    }

    const prompt = `Generate a ${body.length}, ${body.tone} cover letter in ${body.language}, using this style: ${body.style}. 
Here is the job description:\n${body.jobDescription}\n
And here is my CV:\n${body.cvText}\n
User prompt: ${body.prompt}`;

    console.log("🧠 Constructed prompt for OpenRouter:\n", prompt);
 const systemPrompt =
  "You are an expert cover letter writer. Your task is to write complete, polished, and tailored cover letters using the job description, the user's CV, and their input prompt.\n\nDO NOT hallucinate personal information like name, email, phone, or location. The user's full CV is provided in plain text. Use that data directly to:\n- Address the user by their real name\n- Include their actual contact details if available\n- Highlight relevant education, skills, tools, and experience\n\nIf any of this info is not found in the CV, check the user prompt. If still unavailable, use placeholders like [NAME], [EMAIL], [PHONE]. Do not mix real data and placeholders — stay consistent.\n\nAvoid fluff or repeating the full CV. Instead, highlight only the most relevant, impressive, and matching elements for the job role. Do not invent job titles, timelines, achievements, or names of hiring managers. Use “Dear Hiring Manager” if no name is given.\n\nAnalyze the job description to detect the **industry, job type, and seniority level**. Based on that, you are allowed to strategically include **industry-relevant keywords and terminology that are known to help with Applicant Tracking Systems (ATS)** — even if not explicitly mentioned in the CV — **as long as they reasonably apply to the user's experience**.\n\nExamples: If the user is a developer, you may include terms like “Agile development,” “version control,” or “responsive UI” even if the CV doesn’t say it word-for-word — as long as it aligns with their actual background. Do not fabricate tools or certifications the user clearly doesn’t have.\n\nIf the job description is vague or missing, generate a general-purpose cover letter aligned with the user’s background and prompt.\n\nMatch the requested tone, style, and length. If not specified, default to concise, professional, and focused. The final output should be a ready-to-send cover letter — no system messages, notes, or explanations.";


    const payload = {
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: prompt },
      ],
    };

    console.log("📦 Sending payload to OpenRouter:", payload);

    const openrouterRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("⏳ Awaiting response from OpenRouter...");

    if (!openrouterRes.ok) {
      const errorText = await openrouterRes.text();
      console.error("❌ OpenRouter API error response:", errorText);
      return new Response(
        JSON.stringify({ error: "OpenRouter Error", detail: errorText }),
        { status: 500 }
      );
    }

    const result = await openrouterRes.json();
    console.log("✅ OpenRouter response received:", result);

    const aiMessage =
      result.choices?.[0]?.message?.content || "⚠️ No content in response";

    console.log("📝 Extracted AI message:", aiMessage);

    return new Response(JSON.stringify({ aiMessage }), {
      status: 200,
    });
  } catch (error) {
    console.error("🔥 Server error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong", detail: error.message }),
      { status: 500 }
    );
  }
}
