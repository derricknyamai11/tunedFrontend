"use client";

import { placeholderImage, formatWordCount } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, FileText, Tag as TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TagChip } from "./TagChip";
import type {
  SampleCardProps,
} from "../_props";

export function SampleCard({ sample }: SampleCardProps) {
  const [imgError, setImgError] = useState(false);

  const imgSrc = imgError || !sample.image
    ? placeholderImage(sample.title.slice(0, 20))
    : sample.image;

  const firstTag  = sample.tags[0] ?? null;
  const extraTags = sample.tags.slice(1, 3);

  return (
    <Link
      href={{pathname:`/samples/${sample.slug}`}} ///samples/${sample.slug}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white",
        "shadow-sm ring-1 transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
        sample.isFeatured
          ? "ring-emerald-200"
          : "ring-slate-100"
      )}
      aria-label={`View sample: ${sample.title}`}
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={sample.title}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {sample.isFeatured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
            Featured
          </span>
        )}

        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-slate-900 bg-opacity-75 px-2.5 py-0.5 text-xs font-medium text-white">
          <FileText size={10} aria-hidden="true" />
          {formatWordCount(sample.wordCount)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 md:p-5">

        {(firstTag || extraTags.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5">
            <TagIcon size={11} className="text-slate-400 shrink-0" aria-hidden="true" />
            {firstTag && (
              <TagChip name={firstTag.name} slug={firstTag.slug} variant="muted" />
            )}
            {extraTags.map((tag) => (
              <TagChip key={tag.id} name={tag.name} slug={tag.slug} variant="muted" />
            ))}
          </div>
        )}

        <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-emerald-700 transition-colors duration-150 line-clamp-2">
          {sample.title}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
          {sample.excerpt}
        </p>

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
            <BookOpen size={12} aria-hidden="true" />
            {formatWordCount(sample.wordCount)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:gap-2 transition-all duration-200">
            View sample
            <ChevronRight size={13} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}