import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaDownload,
  FaCode,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaRocket,
  FaCheckCircle,
  FaSmile,
} from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { getAll } from "../services/api";
import { useAppSettings } from "../context/AppSettingsContext";
import fallbackPhoto from "../assets/hero.png";

const DEFAULT_PROFILE = {
  profession: "Full Stack Developer",
  bio: "I specialize in developing responsive websites and web applications using React, Node.js, Express and MySQL. My goal is to build secure, scalable and user-friendly software that solves real-world problems.",
  about:
    "I'm a passionate Full Stack Software Developer dedicated to building modern, scalable and high-performance web applications. I enjoy transforming ideas into real digital products.",
  photo: null,
  phone: "",
  location: "",
  years_experience: 2,
  projects_completed: 20,
  happy_clients: 15,
  technologies_count: 10,
  availability_status: "Available",
};

const FALLBACK_SKILLS = [
  { id: 1, name: "React", category: "Frontend", level: "Expert", percentage: 90 },
  { id: 2, name: "Node.js", category: "Backend", level: "Advanced", percentage: 85 },
  { id: 3, name: "MySQL", category: "Database", level: "Advanced", percentage: 80 },
  { id: 4, name: "JavaScript", category: "Language", level: "Expert", percentage: 92 },
  { id: 5, name: "Tailwind CSS", category: "Frontend", level: "Advanced", percentage: 88 },
];

function formatStat(value) {
  if (value === null || value === undefined || value === "") return "0+";
  return `${value}+`;
}

function isUploadedIcon(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatYearRange(start, end, current) {
  if (current) return `${start || "?"} – Present`;
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
}

function SkillIcon({ skill }) {
  if (isUploadedIcon(skill.icon)) {
    return (
      <img
        src={skill.icon}
        alt={skill.name}
        className="w-10 h-10 object-contain"
      />
    );
  }
  return <FaCode className="w-8 h-8 text-portek-green" />;
}

export default function About() {
  const { t } = useAppSettings();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAboutData() {
      try {
        const [profiles, skillsData, expData, eduData, certData, resumeData] =
          await Promise.all([
            getAll("/profiles"),
            getAll("/skills"),
            getAll("/experiences"),
            getAll("/education"),
            getAll("/certifications"),
            getAll("/resume"),
          ]);

        if (profiles?.length > 0) {
          setProfile((prev) => ({ ...prev, ...profiles[0] }));
        }
        setSkills(skillsData?.length ? skillsData : FALLBACK_SKILLS);
        setExperiences(expData || []);
        setEducation(eduData || []);
        setCertifications(certData || []);
        if (resumeData?.length > 0) {
          setResume(resumeData[0]);
        }
      } catch {
        setSkills(FALLBACK_SKILLS);
      }
      setLoading(false);
    }
    loadAboutData();
  }, []);

  const photoSrc = profile.photo || fallbackPhoto;
  const isAvailable = profile.availability_status === "Available";

  const stats = [
    { icon: FaRocket, value: formatStat(profile.years_experience), label: t("common.yearsExperience") },
    { icon: FaCheckCircle, value: formatStat(profile.projects_completed), label: t("common.projectsCompleted") },
    { icon: FaSmile, value: formatStat(profile.happy_clients), label: t("common.happyClients") },
    { icon: FaCode, value: formatStat(profile.technologies_count), label: t("common.technologies") },
  ];

  const infoCards = [
    { label: t("common.name"), value: profile.full_name, icon: FaUser },
    { label: t("common.experience"), value: `${formatStat(profile.years_experience)} ${t("common.years")}`, icon: FaBriefcase },
    { label: t("common.email"), value: profile.email, icon: FaEnvelope },
    { label: t("common.location"), value: profile.location, icon: FaMapMarkerAlt },
  ];

  const skillCategories = [...new Set(skills.map((s) => s.category).filter(Boolean))];

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
            {t("about.title")}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t("home.whoIAm")}{" "}
            <span className="text-portek-green">{t("home.hireMeQuestion")}</span>
          </h1>
          <p className="mt-4 text-portek-muted text-sm sm:text-base leading-relaxed">
            {profile.about}
          </p>
        </div>
      </section>

      {/* Profile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-4 hero-glow rounded-3xl opacity-60" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-portek-green/30 shadow-[0_0_50px_rgba(0,209,102,0.15)]">
                <img
                  src={photoSrc}
                  alt={profile.full_name}
                  className="w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-[4/5] object-cover object-top"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-portek-card/90 backdrop-blur-sm border border-portek-border rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isAvailable ? "bg-portek-green animate-pulse" : "bg-yellow-500"
                      }`}
                    />
                    <span className="text-white text-sm font-medium">
                      {isAvailable ? t("common.openToOpportunities") : t("common.currentlyBusy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {profile.profession}
            </h2>
            <p className="mt-4 text-portek-muted leading-relaxed text-sm sm:text-base">
              {profile.bio}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {infoCards.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-portek-card border border-portek-border rounded-xl p-4 hover:border-portek-green/30 transition-colors"
                >
                  <div className="flex items-center gap-2 text-portek-muted text-xs">
                    <Icon className="w-3.5 h-3.5 text-portek-green" />
                    {label}
                  </div>
                  <p className="font-semibold text-white mt-1.5 text-sm truncate">
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>

            {profile.phone && (
              <p className="mt-4 flex items-center gap-2 text-portek-muted text-sm">
                <FaPhone className="text-portek-green w-3.5 h-3.5" />
                {profile.phone}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-8">
              {resume?.file_url ? (
                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-portek-green text-portek-bg px-6 py-3 rounded-full font-semibold text-sm hover:bg-portek-green-dim transition-colors"
                >
                  Download CV
                  <FaDownload className="w-4 h-4" />
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 bg-portek-border text-portek-muted px-6 py-3 rounded-full font-semibold text-sm cursor-not-allowed"
                >
                  Download CV
                  <FaDownload className="w-4 h-4" />
                </button>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-portek-border text-white px-6 py-3 rounded-full font-semibold text-sm hover:border-portek-green hover:text-portek-green transition-colors"
              >
                Get In Touch
                <HiArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-portek-card border border-portek-border rounded-2xl grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-portek-border overflow-hidden">
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

      {/* Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        <div className="text-center mb-10">
          <p className="text-portek-green text-xs font-semibold tracking-[0.2em] uppercase">
            Expertise
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
            Technologies I Use
          </h2>
        </div>

        {skillCategories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {skillCategories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-1.5 rounded-full border border-portek-border text-portek-muted text-xs"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id || skill.name}
              className="bg-portek-card border border-portek-border rounded-2xl p-5 text-center hover:border-portek-green/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-center mb-3 h-10">
                <SkillIcon skill={skill} />
              </div>
              <h3 className="font-semibold text-white text-sm">{skill.name}</h3>
              {skill.level && (
                <p className="text-portek-muted text-xs mt-1">{skill.level}</p>
              )}
              {skill.percentage != null && (
                <div className="mt-3">
                  <div className="h-1.5 bg-portek-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-portek-green rounded-full transition-all"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                  <p className="text-portek-green text-xs mt-1">{skill.percentage}%</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
          <div className="text-center mb-10">
            <p className="text-portek-green text-xs font-semibold tracking-[0.2em] uppercase">
              Career
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Work Experience
            </h2>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="relative pl-8 border-l-2 border-portek-green/30 pb-2"
              >
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-portek-green border-4 border-portek-bg" />
                <div className="bg-portek-card border border-portek-border rounded-2xl p-5 sm:p-6 hover:border-portek-green/30 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      {exp.company_logo && (
                        <img
                          src={exp.company_logo}
                          alt={exp.company}
                          className="w-12 h-12 rounded-lg object-contain bg-white/5 border border-portek-border"
                        />
                      )}
                      <div>
                        <h3 className="font-bold text-white">{exp.position}</h3>
                        <p className="text-portek-green text-sm">{exp.company}</p>
                      </div>
                    </div>
                    <span className="text-portek-muted text-xs whitespace-nowrap">
                      {exp.current_job
                        ? `${formatDate(exp.start_date)} – Present`
                        : `${formatDate(exp.start_date)}${exp.end_date ? ` – ${formatDate(exp.end_date)}` : ""}`}
                    </span>
                  </div>
                  {(exp.location || exp.employment_type) && (
                    <p className="text-portek-muted text-xs mt-2">
                      {[exp.employment_type, exp.location].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {exp.description && (
                    <p className="text-portek-muted text-sm mt-3 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      {(education.length > 0 || certifications.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-10">
            {education.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-portek-green/10 flex items-center justify-center">
                    <FaGraduationCap className="text-portek-green" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Education</h2>
                </div>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="bg-portek-card border border-portek-border rounded-xl p-5 hover:border-portek-green/30 transition-colors"
                    >
                      <h3 className="font-semibold text-white">{edu.degree || edu.institution}</h3>
                      <p className="text-portek-green text-sm mt-0.5">{edu.institution}</p>
                      {edu.field && (
                        <p className="text-portek-muted text-xs mt-1">{edu.field}</p>
                      )}
                      <p className="text-portek-muted text-xs mt-2">
                        {formatYearRange(edu.start_year, edu.end_year)}
                      </p>
                      {edu.description && (
                        <p className="text-portek-muted text-sm mt-2">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-portek-green/10 flex items-center justify-center">
                    <FaCertificate className="text-portek-green" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Certifications</h2>
                </div>
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-portek-card border border-portek-border rounded-xl p-5 hover:border-portek-green/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {cert.certificate_image && (
                          <img
                            src={cert.certificate_image}
                            alt={cert.title}
                            className="w-14 h-14 rounded-lg object-cover border border-portek-border"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-white">{cert.title}</h3>
                          {cert.issuer && (
                            <p className="text-portek-green text-sm mt-0.5">{cert.issuer}</p>
                          )}
                          {cert.issue_date && (
                            <p className="text-portek-muted text-xs mt-1">
                              Issued {formatDate(cert.issue_date)}
                            </p>
                          )}
                          {cert.credential_url && (
                            <a
                              href={cert.credential_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-portek-green text-xs mt-2 hover:underline"
                            >
                              View credential
                              <HiArrowUpRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="rounded-3xl border border-portek-green/20 bg-portek-green/5 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to work together?
          </h2>
          <p className="text-portek-muted mt-3 max-w-lg mx-auto text-sm sm:text-base">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-6 bg-portek-green text-portek-bg px-8 py-3 rounded-full font-semibold text-sm hover:bg-portek-green-dim transition-colors"
          >
            Let&apos;s Talk
            <HiArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
