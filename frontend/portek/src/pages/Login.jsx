import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaCode,
  FaRocket,
  FaCheckCircle,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { useAppSettings } from "../context/AppSettingsContext";

const highlights = [
  {
    icon: FaCode,
    titleKey: "login.modernStack",
    textKey: "login.modernStackDesc",
  },
  {
    icon: FaRocket,
    titleKey: "login.fastDelivery",
    textKey: "login.fastDeliveryDesc",
  },
  {
    icon: FaCheckCircle,
    titleKey: "login.provenResults",
    textKey: "login.provenResultsDesc",
  },
];

export default function Login() {
  const { t } = useAppSettings();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        const res = await axios.post(
          "https://portek-backend.onrender.com/api/login",
          {
            email: form.email,
            password: form.password,
          }
        );

        localStorage.setItem("token", res.data.token);

        setMessage(t("login.loginSuccess"));

        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1000);
      } else {
        const res = await axios.post(
          "https://portek-backend.onrender.com/api/register",
          form
        );

        setMessage(res.data.message);

        setIsLogin(true);

        setForm({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        t("login.somethingWrong")
      );
    }

    setLoading(false);
  };

  const switchMode = (login) => {
    setIsLogin(login);
    setError("");
    setMessage("");
  };

  const inputClass =
    "w-full mt-2 bg-portek-bg border border-portek-border rounded-xl px-4 py-3 text-white placeholder:text-portek-muted/60 outline-none focus:border-portek-green/50 focus:ring-1 focus:ring-portek-green/30 transition-colors";

  return (
    <div className="bg-portek-bg min-h-[calc(100vh-8rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Site content */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl border border-portek-border bg-portek-card p-8 sm:p-10 lg:p-12">
              <div className="absolute -top-24 -right-24 w-64 h-64 hero-glow rounded-full opacity-80" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 hero-glow rounded-full opacity-50" />

              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-md bg-portek-green/15 border border-portek-green/40 flex items-center justify-center">
                    <span className="w-3 h-3 bg-portek-green rotate-45 rounded-sm" />
                  </span>
                  <span className="text-2xl font-bold text-white">Portek</span>
                </div>

                <p className="mt-6 text-portek-green text-xs font-semibold tracking-[0.2em] uppercase">
                  {t("login.adminPortal")}
                </p>

                <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {t("login.manageTitle")}{" "}
                  <span className="text-portek-green">{t("login.confidence")}</span>
                </h1>

                <p className="mt-4 text-portek-muted leading-relaxed max-w-lg">
                  {t("login.manageDesc")}
                </p>

                <div className="mt-8 space-y-4">
                  {highlights.map(({ icon: Icon, titleKey, textKey }) => (
                    <div
                      key={titleKey}
                      className="flex gap-4 p-4 rounded-2xl bg-portek-bg/60 border border-portek-border"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-portek-green/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-portek-green" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">
                          {t(titleKey)}
                        </h3>
                        <p className="text-portek-muted text-sm mt-0.5">
                          {t(textKey)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-3 p-4 rounded-2xl border border-portek-green/20 bg-portek-green/5">
                  <FaShieldAlt className="w-5 h-5 text-portek-green shrink-0" />
                  <p className="text-sm text-portek-muted">
                    {t("login.secureNote")}
                  </p>
                </div>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 mt-8 text-portek-muted hover:text-portek-green transition-colors text-sm font-medium"
                >
                  {t("login.backToPortfolio")}
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="order-1 lg:order-2">
            <div className="w-full max-w-md mx-auto lg:max-w-none lg:ml-auto">
              <div className="rounded-3xl border border-portek-border bg-portek-card p-8 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {isLogin ? t("login.welcomeBack") : t("login.createAccount")}
                  </h2>
                  <p className="text-portek-muted mt-2 text-sm">
                    {isLogin
                      ? t("login.signInDesc")
                      : t("login.registerDesc")}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-5 text-sm">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="bg-portek-green/10 border border-portek-green/30 text-portek-green rounded-xl p-3 mb-5 text-sm">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div>
                      <label className="text-sm font-medium text-white/90">
                        {t("login.fullName")}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t("login.fullNamePlaceholder")}
                        className={inputClass}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-white/90">
                      {t("common.email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white/90">
                      {t("login.password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder={t("login.passwordPlaceholder")}
                        className={`${inputClass} pr-12`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 text-portek-muted hover:text-portek-green transition-colors"
                        aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="w-4 h-4" />
                        ) : (
                          <FaEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-portek-green text-portek-bg py-3 rounded-full font-semibold hover:bg-portek-green-dim transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-portek-bg/30 border-t-portek-bg rounded-full animate-spin" />
                        {t("common.pleaseWait")}
                      </>
                    ) : isLogin ? (
                      <>
                        {t("login.login")}
                        <HiArrowUpRight className="w-4 h-4" />
                      </>
                    ) : (
                      t("login.createAccount")
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-portek-border text-center text-sm">
                  {isLogin ? (
                    <p className="text-portek-muted">
                      {t("login.noAccount")}{" "}
                      <button
                        type="button"
                        onClick={() => switchMode(false)}
                        className="text-portek-green font-semibold hover:underline"
                      >
                        {t("login.register")}
                      </button>
                    </p>
                  ) : (
                    <p className="text-portek-muted">
                      {t("login.haveAccount")}{" "}
                      <button
                        type="button"
                        onClick={() => switchMode(true)}
                        className="text-portek-green font-semibold hover:underline"
                      >
                        {t("login.login")}
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
