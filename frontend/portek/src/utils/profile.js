export function getFirstName(fullName) {
  if (!fullName?.trim()) return "";
  return fullName.trim().split(/\s+/)[0];
}

export function getDisplayName(profile) {
  if (!profile) return "";
  return profile.full_name?.trim() || "";
}

export function buildAiGreeting(profile) {
  const name = getDisplayName(profile);
  const hireTarget = name || "me";
  return `Hi! I'm the Portek AI assistant. Ask me about services, skills, projects, or how to hire ${hireTarget}. How can I help you today?`;
}

export function buildAiErrorMessage(profile) {
  const name = getDisplayName(profile);
  const reachTarget = name || "me";
  return `Sorry, I'm having trouble right now. Please use the contact form to reach ${reachTarget} directly.`;
}
