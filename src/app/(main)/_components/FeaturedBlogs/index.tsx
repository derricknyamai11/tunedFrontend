"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../SectionHeader";
import type {
  FeaturedBlogsProps
} from "../../_props";
import type { BlogPostResponse } from "../../_types";
import { toBlogPostViewModels } from "../../_mappers";
import { FALLBACK_BLOGS } from "../../_fallback/featured.fallback";
import { BlogCard } from "../BlogCard";

function EmptyBlogs() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
      <span className="text-5xl mb-4" aria-hidden="true">📰</span>
      <p className="text-base font-medium">No blog posts available yet.</p>
      <p className="text-sm mt-1">Check back soon for expert writing tips.</p>
    </div>
  );
}

export function FeaturedBlogs({
  blogs,
  title             = "From Our Blogs",
  description       = "Expert insights on academic writing, research strategies, and professional development from our team of writers and editors.",
  backgroundLabel   = "BLOG",
  backgroundPosition = "right",
  className,
}: FeaturedBlogsProps) {
  const source: readonly BlogPostResponse[] =
    blogs.length > 0 ? blogs : FALLBACK_BLOGS;

  const viewModels = toBlogPostViewModels(source);

  return (
    <section
      aria-labelledby="featured-blogs-heading"
      className={cn(
        "relative w-full bg-[#f1efeb] py-16 md:py-20 overflow-hidden",
        className
      )}
    >
      <div className="relative mx-auto max-w-6xl lg:max-w-7xl px-4 sm:px-6 lg:px-8">

        <SectionHeader
          id="featured-blogs-heading"
          title={title}
          description={description}
          backgroundLabel={backgroundLabel}
          backgroundPosition={backgroundPosition}
          align="center"
          accentWord="Blogs"
        />

        {viewModels.length === 0 ? (
          <EmptyBlogs />
        ) : (
          <>
            <div className="hidden md:flex md:flex-col gap-4 lg:gap-6">
              {Array.from({ length: Math.ceil(viewModels.length / 3) }).map((_, chunkIndex) => {
                const chunk = viewModels.slice(chunkIndex * 3, chunkIndex * 3 + 3);

                if (chunk.length === 3) {
                  return (
                    <div key={chunkIndex} className="grid gap-4 md:h-[640px] md:grid-cols-2 md:grid-rows-2 lg:grid-cols-[1fr_0.52fr]">
                      {chunk.map((post, index) => {
                        const isPrimary = index === 0;
                        return (
                          <div key={post.id} className={cn(isPrimary ? "row-span-2" : "row-span-1")}>
                            <BlogCard post={post} isPrimary={isPrimary} />
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                if (chunk.length === 2) {
                  return (
                    <div key={chunkIndex} className="grid gap-4 md:h-[320px] md:grid-cols-2">
                      {chunk.map((post) => (
                        <div key={post.id} className="row-span-1">
                          <BlogCard post={post} isPrimary={false} />
                        </div>
                      ))}
                    </div>
                  );
                }

                if (chunk.length === 1 && chunk[0]) {
                  return (
                    <div key={chunkIndex} className="grid gap-4 md:h-[320px] grid-cols-1">
                      <div className="row-span-1">
                        <BlogCard post={chunk[0]} isPrimary={true} />
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            <div className="flex flex-col gap-4 md:hidden">
              {viewModels.map((post, index) => (
                <BlogCard key={post.id} post={post} isPrimary={index === 0} />
              ))}
            </div>
          </>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/blogs"
            className={cn(
              "inline-flex items-center gap-2 rounded-full",
              "bg-slate-800 px-6 py-3 text-sm font-semibold text-white",
              "transition-colors duration-200 hover:bg-slate-700",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
            )}
          >
            View all posts
            <MoveRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
