const mysqlConnect = require("../config/conn");

let cachedOwnerName = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000;

function firstName(fullName) {
  if (!fullName?.trim()) return "";
  return fullName.trim().split(/\s+/)[0];
}

async function getOwnerName() {
  const now = Date.now();
  if (cachedOwnerName && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedOwnerName;
  }

  try {
    const conn = await mysqlConnect();
    const [rows] = await conn.execute(
      "SELECT full_name FROM profiles ORDER BY id ASC LIMIT 1"
    );
    cachedOwnerName = rows[0]?.full_name?.trim() || "the developer";
  } catch {
    cachedOwnerName = "the developer";
  }

  cacheTimestamp = now;
  return cachedOwnerName;
}

function buildSystemPrompt(ownerName) {
  const ownerFirst = firstName(ownerName) || ownerName;
  return `You are Portek AI Assistant on ${ownerName}'s portfolio website. You help visitors learn about:
- Full stack web development services (React, Node.js, MySQL)
- Hiring ${ownerFirst} for freelance or contract work
- Projects, skills, and experience on the portfolio
- How to send a contact message or get a quote

Be professional, friendly, and concise (2-4 sentences unless more detail is needed).
If asked something unrelated to web development or the portfolio, politely redirect to how you can help with their project needs.`;
}

function buildFallbackReplies(ownerName) {
  const ownerFirst = firstName(ownerName) || ownerName;
  return [
    {
      keys: ["hello", "hi", "hey", "good morning", "good evening"],
      reply: `Hello! I'm the Portek AI assistant. I can help you learn about ${ownerFirst}'s development services, projects, or how to get in touch. What would you like to know?`,
    },
    {
      keys: ["hire", "freelance", "work together", "available", "project"],
      reply: `${ownerFirst} is available for freelance and contract web development projects. You can use the contact form on this page to describe your project, or email directly. Typical services include full-stack apps, APIs, and portfolio sites.`,
    },
    {
      keys: ["skill", "tech", "stack", "react", "node", "mysql"],
      reply: `${ownerFirst} specializes in the MERN-adjacent stack: React, Node.js, Express, and MySQL, plus Tailwind CSS, REST APIs, and Cloudinary for media. Check the Skills page for a full breakdown.`,
    },
    {
      keys: ["price", "cost", "rate", "budget", "quote"],
      reply: `Pricing depends on project scope, timeline, and complexity. Share your requirements via the contact form and ${ownerFirst} will respond with a tailored quote.`,
    },
    {
      keys: ["contact", "email", "reach", "message"],
      reply:
        "Use the contact form on this page with your name, email, and message. You can also find social links in the footer. Messages are saved and emailed directly.",
    },
    {
      keys: ["experience", "background", "who"],
      reply: `${ownerName} is a Full Stack Developer with experience building responsive web apps for businesses and individuals. Visit the About and Experience pages for full details.`,
    },
  ];
}

function fallbackReply(userMessage, ownerName) {
  const ownerFirst = firstName(ownerName) || ownerName;
  const replies = buildFallbackReplies(ownerName);
  const lower = userMessage.toLowerCase();

  for (const item of replies) {
    if (item.keys.some((k) => lower.includes(k))) {
      return item.reply;
    }
  }

  return `Thanks for your message! ${ownerFirst} builds modern web applications with React and Node.js. Tell me about your project idea, or use the contact form to send a detailed inquiry.`;
}

async function getAiReply(messages) {
  const ownerName = await getOwnerName();
  const ownerFirst = firstName(ownerName) || ownerName;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    return {
      reply: fallbackReply(lastUser?.content || "", ownerName),
      provider: "fallback",
    };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "system", content: buildSystemPrompt(ownerName) }, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    return {
      reply: fallbackReply(lastUser?.content || "", ownerName),
      provider: "fallback",
    };
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();

  return {
    reply:
      reply ||
      `I'm here to help! Ask me about services, skills, or how to contact ${ownerFirst}.`,
    provider: "openai",
  };
}

module.exports = { getAiReply };
