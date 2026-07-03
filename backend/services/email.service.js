const nodemailer = require("nodemailer");

function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendContactEmail({ name, email, subject, message }) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP not configured — skipping email notification.");
    return { sent: false, reason: "SMTP not configured" };
  }

  const mailTo = process.env.MAIL_TO || process.env.SMTP_USER;
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"Portek Portfolio" <${mailFrom}>`,
    to: mailTo,
    replyTo: email,
    subject: subject ? `[Portek Contact] ${subject}` : `[Portek Contact] Message from ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#00d166">New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <hr/>
        <p style="white-space:pre-wrap;line-height:1.6">${message}</p>
      </div>
    `,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "N/A"}\n\n${message}`,
  });

  return { sent: true };
}

module.exports = { sendContactEmail };
