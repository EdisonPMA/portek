import { useState, useEffect } from "react";
import { getAll, patch, remove } from "../../services/api";
import PageHeader from "../components/PageHeader";
import { FaEnvelopeOpen, FaEnvelope } from "react-icons/fa";
import { useAppSettings } from "../../context/AppSettingsContext";

export default function MessagesPage() {
  const { t } = useAppSettings();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAll("/messages");
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id, isRead = true) => {
    await patch(`/messages/${id}/read`, { is_read: isRead });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin.deleteConfirm"))) return;
    await remove("/messages", id);
    setSelected(null);
    load();
  };

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.is_read;
    if (filter === "read") return m.is_read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <PageHeader
        title={t("admin.messages")}
        subtitle={`${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`}
      >
        <div className="flex gap-2">
          {["all", "unread", "read"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-portek-green text-portek-bg"
                  : "border border-portek-border text-portek-muted hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </PageHeader>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="w-8 h-8 border-2 border-portek-green/30 border-t-portek-green rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-2 max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-portek-border bg-portek-card p-8 text-center text-portek-muted text-sm">
                No messages found.
              </div>
            ) : (
              filtered.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => {
                    setSelected(msg);
                    if (!msg.is_read) markRead(msg.id);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selected?.id === msg.id
                      ? "border-portek-green/50 bg-portek-green/5"
                      : "border-portek-border bg-portek-card hover:border-portek-green/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">
                        {msg.name}
                      </p>
                      <p className="text-portek-muted text-xs truncate">{msg.email}</p>
                    </div>
                    {msg.is_read ? (
                      <FaEnvelopeOpen className="text-portek-muted shrink-0" />
                    ) : (
                      <FaEnvelope className="text-portek-green shrink-0" />
                    )}
                  </div>
                  <p className="text-white/80 text-sm mt-2 truncate">
                    {msg.subject || t("common.noSubject")}
                  </p>
                  <p className="text-portek-muted text-xs mt-1">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>

          <div className="lg:col-span-3">
            {selected ? (
              <div className="rounded-2xl border border-portek-border bg-portek-card p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                    <p className="text-portek-green text-sm">{selected.email}</p>
                    <p className="text-portek-muted text-xs mt-1">
                      {new Date(selected.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => markRead(selected.id, !selected.is_read)}
                      className="px-3 py-1.5 rounded-lg border border-portek-border text-xs text-portek-muted hover:text-white"
                    >
                      {selected.is_read ? t("admin.markUnread") : t("admin.markRead")}
                    </button>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {selected.subject && (
                  <p className="font-semibold text-white mb-3">{selected.subject}</p>
                )}
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-portek-border bg-portek-card p-12 text-center text-portek-muted">
                {t("admin.selectMessage")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
