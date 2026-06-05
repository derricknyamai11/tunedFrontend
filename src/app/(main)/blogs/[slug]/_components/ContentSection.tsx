"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { extractToc } from "../utils";
import { TableOfContents } from "./TOC";
import { MobileTableOfContents } from "./MobileTOC";
import { useTableOfContents } from "../_hooks/useTOC";
import type { BlogContentProps } from "../_props/post.prop";
import { ShareButton } from "./ShareBtn";

export function BlogContent({ post }: BlogContentProps) {
  const tocItems = extractToc(post.content);
  const { activeId } = useTableOfContents(tocItems);

  return (
    <div className="flex gap-8">
      {tocItems.length >= 2 && (
        <aside
          className="hidden xl:block w-56 shrink-0"
          aria-label="Article navigation"
        >
          <div className="sticky top-24">
            <TableOfContents items={tocItems} activeId={activeId} />
          </div>
        </aside>
      )}

      <article className="min-w-0 flex-1" itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="headline" content={post.title} />
        <meta itemProp="author" content={post.author} />
        <meta itemProp="datePublished" content={post.publishedAt} />

        <div className="xl:hidden">
          <MobileTableOfContents items={tocItems} />
        </div>

        <div
          itemProp="articleBody"
          className={cn(
            "prose prose-slate max-w-none",
            // Typography
            "prose-headings:font-bold prose-headings:text-slate-800 prose-headings:scroll-mt-24",
            "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4",
            "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
            "prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-base",
            "prose-strong:text-slate-700 prose-strong:font-semibold",
            "prose-a:text-emerald-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
            // Lists
            "prose-ul:text-slate-600 prose-ol:text-slate-600",
            "prose-li:my-1",
            // Code
            "prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-slate-700 prose-code:font-medium prose-code:before:content-none prose-code:after:content-none",
            "prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg",
            // Blockquote
            "prose-blockquote:border-l-4 prose-blockquote:border-emerald-400 prose-blockquote:bg-emerald-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic",
            "prose-blockquote:text-slate-600",
            // HR
            "prose-hr:border-slate-200",
            // Images
            "prose-img:rounded-xl prose-img:shadow-md",
            // Tables
            "prose-table:text-sm",
            "prose-th:bg-slate-50 prose-th:text-slate-700 prose-th:font-semibold",
            "prose-td:text-slate-600"
          )}
          /* Security: post.content is passed through sanitizeHtml() in utils.ts
             (strips scripts, event handlers, dangerous URI schemes, iframes)
             before reaching this component via toBlogPostViewModel(). */
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-12 pt-8 border-t border-slate-200">
          {post.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1">
                Tags:
              </span>
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blogs?tag=${tag.slug}`}
                  className={cn(
                    "rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600",
                    "hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  )}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className={cn(
            "flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5",
            "shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          )}>
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
                "bg-emerald-500 text-white text-lg font-bold ring-4 ring-emerald-50"
              )}
              aria-hidden="true"
            >
              {post.authorInitials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800">{post.author}</p>
              <p className="text-sm text-slate-400 mt-0.5">
                <BookOpen size={12} className="inline mr-1 mb-0.5" aria-hidden="true" />
                {post.readTimeMinutes} min read · {post.publishedAt}
              </p>
            </div>
            <div className="ml-auto shrink-0">
              <ShareButton title={post.title} slug={post.slug} />
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}