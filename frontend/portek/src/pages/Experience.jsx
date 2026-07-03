import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaMapMarkerAlt,
  FaBuilding,
  FaDownload,
  FaRocket,
  FaClock,
} from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { getAll } from "../services/api";
import { useAppSettings } from "../context/AppSettingsContext";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatYearRange(start, end) {
  if (start && end) return `${start} – ${end}`;
  if (start) return `${start} – Present`;
  return end || "";
}

function calcDuration(startDate, endDate, current) {
  if (!startDate) return null;
  const start = new Date(startDate);
  const end = current ? new Date() : endDate ? new Date(endDate) : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  if (months < 1) return "< 1 mo";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} mo`;
  if (rem === 0) return `${years} yr${years > 1 ? "s" : ""}`;
  return `${years} yr${years > 1 ? "s" : ""} ${rem} mo`;
}

function ExperienceTimeline({ experiences }) {
  if (experiences.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl border border-portek-border bg-portek-card max-w-3xl mx-auto">
        <FaBriefcase className="w-12 h-12 text-portek-muted mx-auto mb-4" />
        <p className="text-white font-medium">No work experience added yet</p>
        <p className="text-portek-muted text-sm mt-1">
          Experience entries will appear here once added from the admin dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-portek-green/20" />

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative pl-12 sm:pl-16">
            <span
              className={`absolute left-2.5 sm:left-4 top-6 w-4 h-4 rounded-full border-4 border-portek-bg ${
                exp.current_job ? "bg-portek-green animate-pulse" : "bg-portek-green/60"
              }`}
            />

            <div className="bg-portek-card border border-portek-border rounded-2xl p-5 sm:p-6 hover:border-portek-green/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,209,102,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  {exp.company_logo ? (
                    <img
                      src={exp.company_logo}
                      alt={exp.company}
                      className="w-14 h-14 rounded-xl object-contain bg-white/5 border border-portek-border shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-portek-green/10 border border-portek-green/20 flex items-center justify-center shrink-0">
                      <FaBuilding className="w-6 h-6 text-portek-green" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white text-lg">{exp.position}</h3>
                      {exp.current_job && (
                        <span className="px-2 py-0.5 rounded-full bg-portek-green/10 text-portek-green border border-portek-green/30 text-[10px] font-bold uppercase">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-portek-green font-medium text-sm mt-0.5">{exp.company}</p>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-portek-muted text-xs">
                      {exp.employment_type && (
                        <span className="inline-flex items-center gap-1">
                          <FaBriefcase className="w-3 h-3 text-portek-green" />
                          {exp.employment_type}
                        </span>
                      )}
                      {exp.location && (
                        <span className="inline-flex items-center gap-1">
                          <FaMapMarkerAlt className="w-3 h-3 text-portek-green" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <p className="text-white text-sm font-medium">
                    {exp.current_job
                      ? `${formatDate(exp.start_date)} – Present`
                      : `${formatDate(exp.start_date)}${exp.end_date ? ` – ${formatDate(exp.end_date)}` : ""}`}
                  </p>
                  {calcDuration(exp.start_date, exp.end_date, exp.current_job) && (
                    <p className="text-portek-muted text-xs mt-1 inline-flex items-center gap-1 sm:justify-end">
                      <FaClock className="w-3 h-3" />
                      {calcDuration(exp.start_date, exp.end_date, exp.current_job)}
                    </p>
                  )}
                </div>
              </div>

              {exp.description && (
                <p className="text-portek-muted text-sm mt-4 leading-relaxed border-t border-portek-border pt-4">
                  {exp.description}
                </p>
              )}

              {index === 0 && exp.current_job && (
                <div className="mt-4 flex items-center gap-2 text-portek-green text-xs">
                  <span className="w-2 h-2 rounded-full bg-portek-green animate-pulse" />
                  Currently working here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  const { t } = useAppSettings();
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExperienceData() {
      try {
        const [expData, eduData, certData, profiles, resumeData] = await Promise.all([
          getAll("/experiences"),
          getAll("/education"),
          getAll("/certifications"),
          getAll("/profiles"),
          getAll("/resume"),
        ]);

        setExperiences(Array.isArray(expData) ? expData : []);
        setEducation(Array.isArray(eduData) ? eduData : []);
        setCertifications(Array.isArray(certData) ? certData : []);
        if (profiles?.length > 0) setProfile(profiles[0]);
        if (resumeData?.length > 0) setResume(resumeData[0]);
      } catch {
        setError("Failed to load experience data. Please try again later.");
      }
      setLoading(false);
    }
    loadExperienceData();
  }, []);

  const currentJob = useMemo(
    () => experiences.find((e) => e.current_job),
    [experiences]
  );

  const totalYears = profile?.years_experience ?? 0;

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
            {t("experience.subtitle")}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t("experience.titleMain")}{" "}
            <span className="text-portek-green">{t("experience.titleAccent")}</span>
          </h1>
          <p className="mt-4 text-portek-muted text-sm sm:text-base leading-relaxed">
            {profile?.about}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 max-w-3xl mx-auto">
          {[
            { label: t("common.yearsExperience"), value: totalYears > 0 ? `${totalYears}+` : "0", icon: FaRocket },
            { label: t("common.positions"), value: experiences.length, icon: FaBriefcase },
            { label: t("common.education"), value: education.length, icon: FaGraduationCap },
            { label: t("common.certifications"), value: certifications.length, icon: FaCertificate },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-portek-card border border-portek-border rounded-xl p-4 text-center"
            >
              <Icon className="w-5 h-5 text-portek-green mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-portek-muted text-[10px] sm:text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center">
            {error}
          </div>
        </div>
      )}

      {/* Current role highlight */}
      {currentJob && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="max-w-3xl mx-auto rounded-2xl border border-portek-green/30 bg-portek-green/5 p-6 sm:p-8">
            <p className="text-portek-green text-xs font-semibold uppercase tracking-wide">
              Current Role
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
              {currentJob.position}
            </h2>
            <p className="text-portek-muted mt-1">
              at <span className="text-white font-medium">{currentJob.company}</span>
              {currentJob.location && ` · ${currentJob.location}`}
            </p>
            {currentJob.description && (
              <p className="text-portek-muted text-sm mt-4 leading-relaxed line-clamp-3">
                {currentJob.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Work timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        <div className="text-center mb-10">
          <p className="text-portek-green text-xs font-semibold tracking-[0.2em] uppercase">
            Timeline
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
            Professional Experience
          </h2>
        </div>
        <ExperienceTimeline experiences={experiences} />
      </section>

      {/* Education & Certifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-portek-green/10 border border-portek-green/20 flex items-center justify-center">
                <FaGraduationCap className="text-portek-green w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Education</h2>
                <p className="text-portek-muted text-xs">Academic background</p>
              </div>
            </div>

            <div className="space-y-4">
              {education.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-portek-border bg-portek-card">
                  <FaGraduationCap className="w-10 h-10 text-portek-muted mx-auto mb-3" />
                  <p className="text-portek-muted text-sm">No education entries yet</p>
                </div>
              ) : (
              education.map((edu) => (
                <div
                  key={edu.id}
                  className="relative bg-portek-card border border-portek-border rounded-2xl p-5 sm:p-6 hover:border-portek-green/30 transition-colors overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-portek-green/50 rounded-l-2xl" />
                  <h3 className="font-bold text-white pl-2">
                    {edu.degree || "Degree"}
                  </h3>
                  <p className="text-portek-green text-sm mt-1 pl-2">{edu.institution}</p>
                  {edu.field && (
                    <p className="text-portek-muted text-xs mt-1 pl-2">{edu.field}</p>
                  )}
                  <p className="text-portek-muted text-xs mt-3 pl-2 font-medium">
                    {formatYearRange(edu.start_year, edu.end_year)}
                  </p>
                  {edu.description && (
                    <p className="text-portek-muted text-sm mt-3 pl-2 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))
              )}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-portek-green/10 border border-portek-green/20 flex items-center justify-center">
                <FaCertificate className="text-portek-green w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Certifications</h2>
                <p className="text-portek-muted text-xs">Credentials & achievements</p>
              </div>
            </div>

            <div className="space-y-4">
              {certifications.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-portek-border bg-portek-card">
                  <FaCertificate className="w-10 h-10 text-portek-muted mx-auto mb-3" />
                  <p className="text-portek-muted text-sm">No certifications added yet</p>
                </div>
              ) : (
              certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-portek-card border border-portek-border rounded-2xl p-5 sm:p-6 hover:border-portek-green/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {cert.certificate_image ? (
                      <img
                        src={cert.certificate_image}
                        alt={cert.title}
                        className="w-16 h-16 rounded-xl object-cover border border-portek-border shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-portek-green/10 border border-portek-green/20 flex items-center justify-center shrink-0">
                        <FaCertificate className="w-7 h-7 text-portek-green" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white">{cert.title}</h3>
                      {cert.issuer && (
                        <p className="text-portek-green text-sm mt-0.5">{cert.issuer}</p>
                      )}
                      {cert.issue_date && (
                        <p className="text-portek-muted text-xs mt-2">
                          Issued {formatDate(cert.issue_date)}
                        </p>
                      )}
                      {cert.credential_url && cert.credential_url !== "#" && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-portek-green text-xs mt-3 font-medium hover:underline"
                        >
                          Verify credential
                          <HiArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Resume & CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="rounded-3xl border border-portek-green/20 bg-portek-green/5 p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Interested in my full background?
              </h2>
              <p className="text-portek-muted mt-3 text-sm sm:text-base">
                Download my resume for a complete overview of my experience,
                skills, and qualifications.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              {resume?.file_url ? (
                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-portek-green text-portek-bg px-8 py-3 rounded-full font-semibold text-sm hover:bg-portek-green-dim transition-colors"
                >
                  Download Resume
                  <FaDownload className="w-4 h-4" />
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 bg-portek-border text-portek-muted px-8 py-3 rounded-full font-semibold text-sm cursor-not-allowed"
                >
                  Download Resume
                  <FaDownload className="w-4 h-4" />
                </button>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-portek-border text-white px-8 py-3 rounded-full font-semibold text-sm hover:border-portek-green hover:text-portek-green transition-colors"
              >
                Contact Me
                <HiArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
