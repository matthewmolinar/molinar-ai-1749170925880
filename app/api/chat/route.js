import { sendOpenAi } from "@/libs/gpt";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const answer = await sendOpenAi(messages, null);
    if (!answer) {
      return new Response(JSON.stringify({ error: "No response from OpenAI" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}