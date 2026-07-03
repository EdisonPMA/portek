import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaUser,
  FaCode,
  FaBriefcase,
  FaRocket,
  FaCheckCircle,
  FaSmile,
} from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { getAll } from "../services/api";
import { getFirstName } from "../utils/profile";
import { useAppSettings } from "../context/AppSettingsContext";
import fallbackPhoto from "../assets/hero.png";

const SOCIAL_ICONS = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  x: FaTwitter,
  email: FaEnvelope,
};

const DEFAULT_PROFILE = {
  profession: "Full Stack Developer",
  headline: "I build modern web experiences",
  bio: "I help businesses and individuals bring their ideas to life with clean, scalable and high-performing web applications.",
  about:
    "I'm a passionate Full Stack Developer who loves turning complex problems into simple, beautiful and intuitive solutions.",
  bio_card:
    "I'm a dedicated Full Stack Developer with a strong foundation in modern technologies. I enjoy learning, building and improving every day.",
  work_card:
    "I build responsive, fast and scalable web applications using the MERN stack. From frontend UI to backend APIs, I handle it all.",
  hire_card:
    "I focus on delivering high-quality work, on time, with clean code and great communication. Your success is my priority.",
  photo: null,
  availability_status: "Available",
  years_experience: 2,
  projects_completed: 20,
  happy_clients: 15,
  technologies_count: 10,
};

const DEFAULT_SOCIALS = [
  { platform: "GitHub", url: "#", icon: "github" },
  { platform: "LinkedIn", url: "#", icon: "linkedin" },
  { platform: "Twitter", url: "#", icon: "twitter" },
];

const TYPING_FALLBACK = [
  "Full Stack Developer",
  "MERN Stack Expert",
  "UI/UX Enthusiast",
  "Problem Solver",
];

function formatStat(value) {
  if (value === null || value === undefined || value === "") return "0+";
  return `${value}+`;
}

function isUploadedIcon(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function resolveSocialIcon(link) {
  if (isUploadedIcon(link.icon)) return null;
  const key = (link.platform || "").toLowerCase();
  return SOCIAL_ICONS[key] || FaEnvelope;
}

function renderHeadline(headline) {
  const text = headline || DEFAULT_PROFILE.headline;
  const highlight = "web experiences";

  if (text.toLowerCase().includes(highlight)) {
    const parts = text.split(new RegExp(`(${highlight})`, "i"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight ? (
        <span key={i} className="text-portek-green">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  return text;
}

export default function Home() {
  const { t } = useAppSettings();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [socials, setSocials] = useState(DEFAULT_SOCIALS);
  const [loading, setLoading] = useState(true);

  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const typingPhrases = profile.profession
    ? [profile.profession, ...TYPING_FALLBACK.filter((p) => p !== profile.profession)]
    : TYPING_FALLBACK;

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [profiles, links] = await Promise.all([
          getAll("/profiles"),
          getAll("/social-links"),
        ]);

        if (profiles?.length > 0) {
          setProfile((prev) => ({ ...prev, ...profiles[0] }));
        }
        if (links?.length > 0) {
          setSocials(links);
        } else if (profiles?.[0]?.email) {
          setSocials([
            {
              platform: "Email",
              url: `mailto:${profiles[0].email}`,
              icon: "email",
            },
          ]);
        }
      } catch {
        /* use defaults */
      }
      setLoading(false);
    }
    loadHomeData();
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = typingPhrases[loopIndex % typingPhrases.length];
      if (isDeleting) {
        setText(currentPhrase.substring(0, text.length - 1));
        setTypingSpeed(50);
      } else {
        setText(currentPhrase.substring(0, text.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && text === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopIndex(loopIndex + 1);
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopIndex, typingSpeed, typingPhrases]);

  const firstName = getFirstName(profile.full_name);
  const greetingName = firstName || profile.full_name;
  const photoSrc = profile.photo || fallbackPhoto;
  const isAvailable = profile.availability_status === "Available";

  const aboutSentences =
    profile.about?.split(/(?<=[.!?])\s+/).filter(Boolean) || [];

  const aboutCards = [
    {
      icon: FaUser,
      title: t("home.whoAmI"),
      text: aboutSentences[0] || DEFAULT_PROFILE.bio_card,
    },
    {
      icon: FaCode,
      title: t("home.whatDoIDo"),
      text: profile.profession
        ? `I work as a ${profile.profession}, building responsive, fast and scalable web applications. From frontend UI to backend APIs, I handle it all.`
        : t("home.workCard"),
    },
    {
      icon: FaBriefcase,
      title: t("home.whyHireMe"),
      text: aboutSentences.slice(1).join(" ") || t("home.hireCard"),
    },
  ];

  const stats = [
    { icon: FaRocket, value: formatStat(profile.years_experience), label: t("common.yearsExperience") },
    { icon: FaCheckCircle, value: formatStat(profile.projects_completed), label: t("common.projectsCompleted") },
    { icon: FaSmile, value: formatStat(profile.happy_clients), label: t("common.happyClients") },
    { icon: FaCode, value: formatStat(profile.technologies_count), label: t("common.technologies") },
  ];

  if (loading) {
    return (
      <div className="bg-portek-bg min-h-[60vh] flex items-center justify-center">
        <span className="w-10 h-10 border-2 border-portek-green/30 border-t-portek-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-portek-bg">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div>
            {greetingName && (
              <span className="inline-flex items-center gap-2 bg-portek-card border border-portek-border rounded-full px-4 py-2 text-sm text-portek-muted">
                <span>👋</span> {t("home.greeting", { name: greetingName })}
              </span>
            )}

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.15]">
              {renderHeadline(profile.headline)}
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-white/90">
              {t("home.imA")}{" "}
              <span className="text-portek-green font-medium">
                {text}
                <span className="cursor-blink text-portek-green">|</span>
              </span>
            </p>

            <p className="mt-4 text-portek-muted text-sm sm:text-base max-w-xl leading-relaxed">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-portek-green text-portek-bg px-6 py-3 rounded-full font-semibold text-sm hover:bg-portek-green-dim transition-colors"
              >
                {t("common.hireMe")}
                <HiArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-full font-semibold text-sm hover:border-portek-green hover:text-portek-green transition-colors"
              >
                <FaBriefcase className="w-3.5 h-3.5" />
                {t("common.viewMyWork")}
              </Link>
            </div>

            <div className="flex items-center gap-3 mt-8">
              {socials.map((link) => {
                const Icon = resolveSocialIcon(link);
                const uploadedIcon = isUploadedIcon(link.icon);

                return (
                  <a
                    key={link.id || link.platform}
                    href={link.url}
                    target={link.url?.startsWith("http") ? "_blank" : undefined}
                    rel={link.url?.startsWith("http") ? "noreferrer" : undefined}
                    aria-label={link.platform}
                    className="w-10 h-10 rounded-full border border-portek-border flex items-center justify-center text-portek-muted hover:text-portek-green hover:border-portek-green/50 transition-colors overflow-hidden"
                  >
                    {uploadedIcon ? (
                      <img
                        src={link.icon}
                        alt={link.platform}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      Icon && <Icon className="w-4 h-4" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 hero-glow rounded-full scale-90" />
              <div className="absolute inset-4 rounded-full border border-dashed border-portek-green/20" />
              <div className="absolute inset-8 rounded-full border border-dashed border-portek-green/15" />
              <div className="absolute inset-12 rounded-full border border-dashed border-portek-green/10" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-2 border-portek-green/30 shadow-[0_0_60px_rgba(0,209,102,0.25)]">
                  <img
                    src={photoSrc}
                    alt={`${profile.full_name} - ${profile.profession}`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="absolute bottom-4 right-0 sm:right-4 bg-portek-card/90 backdrop-blur-sm border border-portek-border rounded-xl px-4 py-3 max-w-[220px] shadow-lg">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvailable ? "bg-portek-green animate-pulse" : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-white text-sm font-medium">
                    {isAvailable ? t("common.availableForWork") : t("common.currentlyBusy")}
                  </span>
                </div>
                <p className="text-portek-muted text-xs mt-1 leading-relaxed">
                  {t("home.letsBuild")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-portek-green text-xs font-semibold tracking-[0.2em] uppercase">
            {t("home.aboutMe")}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
            {t("home.whoIAm")}{" "}
            <span className="text-portek-green">{t("home.hireMeQuestion")}</span>
          </h2>
          <p className="mt-4 text-portek-muted text-sm sm:text-base leading-relaxed">
            {profile.about}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mt-12">
          {aboutCards.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-portek-card border border-portek-border rounded-2xl p-6 text-center hover:border-portek-green/30 transition-colors"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-portek-green/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-portek-green" />
              </div>
              <h3 className="mt-4 font-bold text-white text-base">{title}</h3>
              <p className="text-portek-muted text-sm mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-portek-card border border-portek-border rounded-2xl grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-portek-border overflow-hidden">
          {stats.map(({ icon: Icon, value, label }, index) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center py-8 px-4 ${
                index >= 2 ? "border-t lg:border-t-0 border-portek-border" : ""
              }`}
            >
              <Icon className="w-5 h-5 text-portek-green mb-2" />
              <p className="text-2xl sm:text-3xl font-extrabold text-portek-green">{value}</p>
              <p className="text-portek-muted text-xs sm:text-sm mt-1 text-center">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
