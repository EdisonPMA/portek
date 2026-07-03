const { getAiReply } = require("../services/ai.service");

async function chat(req, res) {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Messages array is required",
      });
    }

    const sanitized = messages
      .filter((m) => m.role && m.content)
      .slice(-12)
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content).slice(0, 2000),
      }));

    if (!sanitized.length) {
      return res.status(400).json({
        success: false,
        message: "Valid messages required",
      });
    }

    const result = await getAiReply(sanitized);

    res.status(200).json({
      success: true,
      reply: result.reply,
      provider: result.provider,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "AI assistant unavailable. Please use the contact form.",
    });
  }
}

module.exports = { chat };
