import { useState, useEffect, useRef } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { getAll, sendMessage, sendChat } from "../services/api";
import { buildAiGreeting, buildAiErrorMessage } from "../utils/profile";
import { useAppSettings } from "../context/AppSettingsContext";

const SOCIAL_ICONS = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  x: FaTwitter,
  email: FaEnvelope,
};

const DEFAULT_PROFILE = {
  email: "",
  phone: "",
  location: "",
  availability_status: "Available",
};

const inputClass =
  "w-full mt-1 bg-portek-bg border border-portek-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-portek-green/50 focus:ring-1 focus:ring-portek-green/30 placeholder:text-portek-muted/50";

function isUploadedIcon(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

export default function Contact() {
  const { t } = useAppSettings();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    async function loadContactData() {
      try {
        const [profiles, links] = await Promise.all([
          getAll("/profiles"),
          getAll("/social-links"),
        ]);
        if (profiles?.length > 0) setProfile((p) => ({ ...p, ...profiles[0] }));
        if (links?.length > 0) setSocials(links);
      } catch {
        /* defaults */
      }
      setLoading(false);
    }
    loadContactData();
  }, []);

  useEffect(() => {
    if (loading) return;
    setChatMessages((prev) => {
      if (prev.some((msg) => msg.role === "user")) return prev;
      return [
        {
          role: "assistant",
          content: buildAiGreeting(profile),
        },
      ];
    });
  }, [loading, profile?.full_name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");

    try {
      await sendMessage(form);
      setFormSuccess(t("contact.success"));
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setFormError(err.response?.data?.message || t("contact.error"));
    }
    setFormLoading(false);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = { role: "user", content: chatInput.trim() };
    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await sendChat(nextMessages);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: buildAiErrorMessage(profile),
        },
      ]);
    }
    setChatLoading(false);
  };

  const isAvailable = profile.availability_status === "Available";

  if (loading) {
    return (
      <div className="bg-portek-bg min-h-[60vh] flex items-center justify-center">
        <span className="w-10 h-10 border-2 border-portek-green/30 border-t-portek-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-portek-bg">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 lg:pt-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-portek-green text-xs font-semibold tracking-[0.2em] uppercase">
            {t("footer.contact")}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t("contact.title")}
          </h1>
          <p className="mt-4 text-portek-muted text-sm sm:text-base leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Left — Form & info */}
          <div className="space-y-6">
            {/* Contact info cards */}
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: FaEnvelope, label: t("common.email"), value: profile.email },
                { icon: FaPhone, label: t("common.phone"), value: profile.phone },
                { icon: FaMapMarkerAlt, label: t("common.location"), value: profile.location },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-portek-card border border-portek-border rounded-xl p-4 text-center"
                >
                  <Icon className="w-5 h-5 text-portek-green mx-auto mb-2" />
                  <p className="text-portek-muted text-[10px] uppercase tracking-wide">{label}</p>
                  <p className="text-white text-xs font-medium mt-1 truncate">{value || "—"}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-portek-card border border-portek-border">
              <span
                className={`w-2 h-2 rounded-full ${isAvailable ? "bg-portek-green animate-pulse" : "bg-yellow-500"}`}
              />
              <span className="text-sm text-white">
                {isAvailable ? t("contact.availableNew") : t("contact.busyReachOut")}
              </span>
            </div>

            {/* Contact form */}
            <div className="bg-portek-card border border-portek-border rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-1">{t("contact.sendMessage")}</h2>
              <p className="text-portek-muted text-sm mb-6">
                {t("contact.sendMessageDesc")}
              </p>

              {formError && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="mb-4 rounded-xl border border-portek-green/30 bg-portek-green/10 px-4 py-3 text-sm text-portek-green">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white/90">{t("common.name")} *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder={t("contact.yourName")}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/90">{t("common.email")} *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="you@example.com"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/90">{t("contact.subject")}</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleFormChange}
                    placeholder={t("contact.subjectPlaceholder")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/90">{t("contact.message")} *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleFormChange}
                    rows={5}
                    placeholder={t("contact.messagePlaceholder")}
                    className={inputClass}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-portek-green text-portek-bg py-3 rounded-full font-semibold text-sm hover:bg-portek-green-dim transition-colors disabled:opacity-70"
                >
                  {formLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-portek-bg/30 border-t-portek-bg rounded-full animate-spin" />
                      {t("contact.sending")}
                    </>
                  ) : (
                    <>
                      {t("contact.sendBtn")}
                      <FaPaperPlane className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Social links */}
            {socials.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-portek-muted text-sm">Follow:</span>
                {socials.map((link) => {
                  const Icon = SOCIAL_ICONS[(link.platform || "").toLowerCase()] || FaEnvelope;
                  if (isUploadedIcon(link.icon)) {
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-full border border-portek-border flex items-center justify-center hover:border-portek-green/50 transition-colors"
                      >
                        <img src={link.icon} alt={link.platform} className="w-4 h-4 object-contain" />
                      </a>
                    );
                  }
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.platform}
                      className="w-9 h-9 rounded-full border border-portek-border flex items-center justify-center text-portek-muted hover:text-portek-green hover:border-portek-green/50 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right — AI Assistant */}
          <div className="bg-portek-card border border-portek-border rounded-2xl flex flex-col h-[600px] lg:h-auto lg:min-h-[640px] overflow-hidden">
            <div className="px-5 py-4 border-b border-portek-border flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-portek-green/10 border border-portek-green/30 flex items-center justify-center">
                <FaRobot className="w-5 h-5 text-portek-green" />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">{t("contact.aiAssistant")}</h2>
                <p className="text-portek-muted text-xs">Ask about services, skills, or hiring</p>
              </div>
              <span className="ml-auto flex items-center gap-1.5 text-portek-green text-xs">
                <span className="w-2 h-2 rounded-full bg-portek-green animate-pulse" />
                Online
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === "user"
                        ? "bg-portek-green/20 text-portek-green"
                        : "bg-portek-bg border border-portek-border text-portek-green"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <FaUser className="w-3.5 h-3.5" />
                    ) : (
                      <FaRobot className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-portek-green/10 text-white border border-portek-green/20 rounded-tr-sm"
                        : "bg-portek-bg text-portek-muted border border-portek-border rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-portek-bg border border-portek-border flex items-center justify-center">
                    <FaRobot className="w-3.5 h-3.5 text-portek-green" />
                  </div>
                  <div className="bg-portek-bg border border-portek-border rounded-2xl rounded-tl-sm px-4 py-3">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 bg-portek-green/50 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-portek-green/50 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-2 h-2 bg-portek-green/50 rounded-full animate-bounce [animation-delay:0.3s]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleChatSubmit}
              className="p-4 border-t border-portek-border shrink-0"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t("contact.aiPlaceholder")}
                  className="flex-1 bg-portek-bg border border-portek-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-portek-green/50 placeholder:text-portek-muted"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="shrink-0 w-11 h-11 rounded-xl bg-portek-green text-portek-bg flex items-center justify-center hover:bg-portek-green-dim transition-colors disabled:opacity-50"
                >
                  <HiArrowUpRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-portek-muted text-[10px] mt-2 text-center">
                AI responses are informational. For project inquiries, use the contact form.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
