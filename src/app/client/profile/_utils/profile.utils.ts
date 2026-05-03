export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const maskedLocal = `${local[0] ?? ""}***`;
  const parts = domain.split(".");
  const maskedDomain = `${parts[0]?.[0] ?? ""}***${parts.length > 1 ? "." + parts.slice(1).join(".") : ""}`;
  return `${maskedLocal}@${maskedDomain}`;
}

export function formatLastSeen(isoDate: string | null): string {
  if (!isoDate) return "Never signed in";
  const ms = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(isoDate).toLocaleDateString();
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "U";
}

export function formatGender(gender: string | null): string {
  if (!gender || gender === "unknown") return "Prefer not to say";
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export function formatFailedLogins(count: number): string {
  if (count === 0) return "No suspicious activity";
  return `${count} failed login attempt${count === 1 ? "" : "s"}`;
}

export function formatRelativeDate(isoDate: string | null): string {
  if (!isoDate) return "—";
  return new Date(isoDate).toLocaleString();
}
