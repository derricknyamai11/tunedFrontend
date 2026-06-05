"use client";

import { cn } from "@/lib/utils";
import type { BlogCardProps } from "../_props";
import { TagChip } from "./TagChip";
import { formatPublishedDate } from "../_mappers";
import { MoveRight, Clock, User, Tag as TagIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { placeholderImage } from "@/lib/utils";

export function BlogCard({ post, isPrimary }: BlogCardProps) {
  const [imgError, setImgError] = useState(false);

  const backgroundImage = imgError || !post.featuredImage
    ? placeholderImage(post.title.slice(0, 20))
    : post.featuredImage;

  const firstTag = post.tags[0] ?? null;

  return (
    <Link
      href={{ pathname: `/blogs/${post.slug}` }} // /blogs/${post.slug}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-2xl w-full h-full",
        "bg-slate-900 bg-opacity-80 text-white",
        "transition-transform duration-300 hover:scale-[0.985] hover:rotate-[0.2deg]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
        isPrimary ? "min-h-[340px] md:min-h-0" : "min-h-[240px] md:min-h-0"
      )}
      aria-label={`Read blog post: ${post.title}`}
    >
      <Image
        src={backgroundImage}
        alt="blog image"
        fill
        className="object-cover object-center absolute inset-0 -z-10"
        onError={() => setImgError(true)}
        sizes={isPrimary ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        priority={isPrimary}
      />

      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-slate-900 transition-opacity duration-500",
          isPrimary
            ? "opacity-30 group-hover:opacity-40"
            : "opacity-35 group-hover:opacity-45"
        )}
      />

      <article className="relative z-10 flex items-end gap-3 p-5 md:p-6">
        <div className="flex flex-1 flex-col gap-2">

          {firstTag && (
            <div className="flex items-center gap-1.5">
              <TagIcon size={11} className="text-emerald-300" aria-hidden="true" />
              <TagChip name={firstTag.name} slug={firstTag.slug} variant="outline" />
            </div>
          )}

          <h3
            className={cn(
              "font-bold leading-snug text-white",
              isPrimary
                ? "text-2xl sm:text-3xl md:text-4xl"
                : "text-lg sm:text-xl md:text-2xl"
            )}
          >
            {post.title}
          </h3>

          {isPrimary && (
            <p className="mt-1 hidden sm:block text-sm text-white opacity-75 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-white opacity-70">
              <User size={11} aria-hidden="true" />
              {post.author}
            </span>
            <span className="flex items-center gap-1 text-xs text-white opacity-70">
              <Clock size={11} aria-hidden="true" />
              {post.readTimeMinutes} min read
            </span>
            <span className="text-xs text-white opacity-50">
              {post.publishedAt ? formatPublishedDate(post.publishedAt) : ""}
            </span>
          </div>
        </div>

        <MoveRight
          className="shrink-0 transition-transform duration-300 group-hover:translate-x-1.5"
          aria-hidden="true"
          size={isPrimary ? 36 : 28}
          strokeWidth={1.5}
        />
      </article>
    </Link>
  );
}
