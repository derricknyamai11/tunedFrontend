import type { TocItem } from "./_props/post.prop";
import type {
  BlogPost, BlogPostViewModel,
  OptimisticAction, BlogComment
} from "./_types/post.type";

const WORDS_PER_MINUTE = 238;
const MIN_READ_TIME_MINUTES = 1;

const TOC_HEADING_LEVELS = new Set<string>(["2", "3"]);
const HEADING_WITH_ID_RE =
  /<h([23])[^>]*\sid="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/gi;

/** Matches h2/h3 tags regardless of id presence. */
// const HEADING_ANY_RE = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
const STRIP_TAGS_RE = /<[^>]*>/g;
const WHITESPACE_RE = /\s+/g;
const NON_ALNUM_RE = /[^a-z0-9]+/g;
const TRIM_HYPHENS_RE = /^-+|-+$/g;

const SANITISE_PATTERNS: ReadonlyArray<readonly [RegExp, string]> = [
  // Remove <script> blocks entirely
  [/<script\b[\s\S]*?<\/script\s*>/gi, ""],
  // Remove inline event handlers (onclick, onerror, onload, etc.)
  [/\s+on[a-z]{1,30}\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, ""],
  // Block javascript: and vbscript: URI schemes in any attribute
  [/(?:href|src|action|data|xlink:href)\s*=\s*["']?\s*(?:javascript|vbscript|livescript|data)\s*:/gi, 'href="#"'],
  // Block data:text/html URIs
  [/data\s*:\s*(?:text\/html|application\/javascript|text\/javascript)/gi, "data:blocked"],
  // Remove dangerous elements
  [/<\/?(?:iframe|object|embed|applet|link|import|template)\b[^>]*>/gi, ""],
  // Remove <base> tags (can redirect all relative URLs)
  [/<base\s[^>]*>/gi, ""],
  // Remove meta refresh tags
  [/<meta[^>]+http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi, ""],
  // Remove form elements
  [/<\/?\s*form\s*[^>]*>/gi, ""],
  // Remove SVG event attributes (SVG XSS vector)
  [/<svg\b[^>]*>/gi, "<svg>"],
  [/<animate\b[^>]*>/gi, ""],
  [/<set\b[^>]*>/gi, ""],
  // Block CSS expression() attacks
  [/expression\s*\(/gi, "blocked("],
  // Block srcdoc attribute (iframe variant)
  [/\bsrcdoc\s*=/gi, "data-blocked="],
  // Neutralise HTML entities that encode 'javascript'
  [/&#(?:0*106|x0*6[aA]);?(?:&#(?:0*97|x0*61);?){0,1}/gi, "blocked"],
  // Remove XML processing instructions
  [/<\?[\s\S]*?\?>/g, ""],
];

export function calculateReadTime(htmlContent: string): number {
  if (!htmlContent) return MIN_READ_TIME_MINUTES;
  const text = htmlContent
    .replace(STRIP_TAGS_RE, " ")
    .replace(WHITESPACE_RE, " ")
    .trim();
  const wordCount = text ? text.split(" ").length : 0;
  return Math.max(
    MIN_READ_TIME_MINUTES,
    Math.ceil(wordCount / WORDS_PER_MINUTE)
  );
}

export function getAuthorInitials(name: string): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts && parts.length === 1) return parts[0]![0]!.toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

const PUBLISHED_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

const COMMENT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

const RELATIVE_THRESHOLDS = {
  minute: 60,
  hour: 3_600,
  day: 86_400,
  week: 604_800,
  month: 2_592_000, // ~30 days
} as const;

export function formatPublishedDate(isoString: string): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat("en-US", PUBLISHED_DATE_FORMAT).format(date);
  } catch {
    return isoString;
  }
}

export function formatCommentDate(isoString: string): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";

    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSeconds < 0) return "Just now"; // clock skew guard
    if (diffSeconds < RELATIVE_THRESHOLDS.minute) return "Just now";
    if (diffSeconds < RELATIVE_THRESHOLDS.hour) {
      const m = Math.floor(diffSeconds / RELATIVE_THRESHOLDS.minute);
      return `${m} ${m === 1 ? "minute" : "minutes"} ago`;
    }
    if (diffSeconds < RELATIVE_THRESHOLDS.day) {
      const h = Math.floor(diffSeconds / RELATIVE_THRESHOLDS.hour);
      return `${h} ${h === 1 ? "hour" : "hours"} ago`;
    }
    if (diffSeconds < RELATIVE_THRESHOLDS.week) {
      const d = Math.floor(diffSeconds / RELATIVE_THRESHOLDS.day);
      return `${d} ${d === 1 ? "day" : "days"} ago`;
    }
    if (diffSeconds < RELATIVE_THRESHOLDS.month) {
      const w = Math.floor(diffSeconds / RELATIVE_THRESHOLDS.week);
      return `${w} ${w === 1 ? "week" : "weeks"} ago`;
    }
    return new Intl.DateTimeFormat("en-US", COMMENT_DATE_FORMAT).format(date);
  } catch {
    return "";
  }
}

function textToHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(STRIP_TAGS_RE, "")
    .replace(/[^\w\s-]/g, "")
    .replace(WHITESPACE_RE, "-")
    .replace(NON_ALNUM_RE, "-")
    // .replace(HEADING_ANY_RE, "")      // remove heading tags
    .replace(TRIM_HYPHENS_RE, "")
    .slice(0, 80);
}

export function injectHeadingIds(html: string): string {
  if (!html) return "";

  const seenIds = new Map<string, number>();

  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attrs, inner) => {
      const existingIdMatch = /\sid="([^"]*)"/i.exec(attrs);
      if (existingIdMatch) {
        const existingId = existingIdMatch[1]!;
        seenIds.set(existingId, (seenIds.get(existingId) ?? 0) + 1);
        return match;
      }

      const baseId = textToHeadingId(inner.replace(STRIP_TAGS_RE, ""));
      if (!baseId) return match; // Empty heading — leave alone

      const count = seenIds.get(baseId) ?? 0;
      const finalId = count === 0 ? baseId : `${baseId}-${count}`;
      seenIds.set(baseId, count + 1);

      return `<h${level}${attrs} id="${finalId}">${inner}</h${level}>`;
    }
  );
}

export function extractToc(html: string): TocItem[] {
  if (!html) return [];

  const items: TocItem[] = [];
  const regex = new RegExp(HEADING_WITH_ID_RE.source, "gi");
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const level = match[1]!;
    const id = match[2]?.trim();
    const rawText = match[3];

    if (!TOC_HEADING_LEVELS.has(level) || !id) continue;

    const text = rawText?.replace(STRIP_TAGS_RE, "").replace(WHITESPACE_RE, " ").trim();
    if (!text) continue;

    items.push({ id, text, level: parseInt(level, 10) as 2 | 3 });
  }

  return items;
}

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return SANITISE_PATTERNS.reduce(
    (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
    html
  );
}

export function sanitizePlainText(text: string): string {
  if (!text) return "";
  return text
    .replace(STRIP_TAGS_RE, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const TRUSTED_AVATAR_ORIGINS = new Set([
  "https://images.unsplash.com",
  "https://avatars.githubusercontent.com",
  "https://lh3.googleusercontent.com",
  "https://secure.gravatar.com",
]);

export function validateAvatarUrl(
  url: string | null | undefined,
  allowedOrigins: ReadonlySet<string> = TRUSTED_AVATAR_ORIGINS
): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    const origin = `${parsed.protocol}//${parsed.host}`;
    return allowedOrigins.has(origin) ? url : null;
  } catch {
    return null;
  }
}

export function toBlogPostViewModel(post: BlogPost): BlogPostViewModel {
  const sanitised = sanitizeHtml(post.content);
  const withIds = injectHeadingIds(sanitised);

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: withIds,
    author: post.author,
    authorInitials: getAuthorInitials(post.author),
    category: post.category ?? null,
    tags: post.tags,
    featuredImage:
      post.featured_image ||
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1400&q=80",
    publishedAt: formatPublishedDate(post.published_at),
    readTimeMinutes: calculateReadTime(post.content),
    isFeatured: post.is_featured,
    commentCount: post.comments.length,
    comments: post.comments,
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
}

const AVATAR_COLOUR_CLASSES = [
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-600",
  "bg-sky-600",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-lime-600",
] as const;

export type AvatarColourClass = (typeof AVATAR_COLOUR_CLASSES)[number];

export function getAvatarColour(name: string): AvatarColourClass {
  if (!name) return AVATAR_COLOUR_CLASSES[0];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLOUR_CLASSES[hash % AVATAR_COLOUR_CLASSES.length]!;
}

export function commentsReducer(
  state: readonly BlogComment[],
  action: OptimisticAction
): readonly BlogComment[] {
  switch (action.type) {
    case "ADD":
      return [action.comment, ...state];

    case "UPDATE_REACTION":
      return state.map((c) =>
        c.id === action.commentId
          ? {
              ...c,
              total_likes: action.likes,
              total_dislikes: action.dislikes,
            }
          : c
      );

    case "REMOVE":
      return state.filter((c) => c.id !== action.id);

    default:
      return state;
  }
}

export const generateFallbackComments = (postId: string): BlogComment[] => [
  {
    id: "fallback-1",
    post_id: postId,
    content: "This is a brilliantly written article! I learned a lot from the insights shared here.",
    name: "Alex Doe",
    email: "alex@example.com",
    user_id: null,
    approved: true,
    reactions: [],
    total_likes: 12,
    total_dislikes: 0,
  },
  {
    id: "fallback-2",
    post_id: postId,
    content: "Could you expand more on the technical methodology you used in the second section?",
    name: "Jamie Smith",
    email: "jamie@example.com",
    user_id: null,
    approved: true,
    reactions: [],
    total_likes: 4,
    total_dislikes: 1,
  }
];