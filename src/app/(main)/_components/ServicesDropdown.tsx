"use client";

import Link, { type LinkProps } from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownSkeleton } from "./DropdownSkeleton";
import type { ServicesDropdownProps } from "@/lib/props/service.props";
import type { Service } from "@/lib/types/service.type";

export function ServicesDropdown({ 
  categories, 
  isOpen, 
  onClose,
  isLoading,
  activeCategoryId,
  onCategorySelect,
  services,
  isServicesLoading
}: ServicesDropdownProps) {
  if (!isOpen) return null;

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  return (
    <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[720px] bg-white rounded-3xl border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] overflow-hidden z-100 animate-in fade-in zoom-in-95 duration-200 origin-top">
      {isLoading ? (
        <DropdownSkeleton />
      ) : (
        <div className="flex divide-x divide-slate-50 min-h-[440px]">
          <div className="w-[280px] bg-slate-50/50 p-5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-3 mb-3">
                Expertise Areas
              </span>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  onMouseEnter={() => onCategorySelect(category.id)}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-all duration-150 text-left",
                    activeCategoryId === category.id
                      ? "bg-white text-emerald-700 shadow-sm ring-1 ring-slate-100"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/60"
                  )}
                >
                  {category.name}
                  <ChevronRight 
                    size={14} 
                    className={cn(
                      "transition-all duration-200", 
                      activeCategoryId === category.id 
                        ? "text-emerald-500 translate-x-0" 
                        : "text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    )} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white min-h-[440px] relative flex flex-col">
            {/* Scrollable Container */}
            <div className={cn(
              "flex-1 overflow-y-auto px-8 py-8 transition-all duration-300 custom-scrollbar",
              isServicesLoading ? "opacity-50 blur-[2px] pointer-events-none scale-[0.99]" : "opacity-100 scale-100"
            )}
            style={{ maxHeight: "calc(440px)" }}
            >
              <div className="flex flex-col gap-6 ">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {activeCategory?.name || "Services"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed max-w-[320px]">
                    {activeCategory?.description || "Select a category to explore our specialized services."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 pb-4">
                  {services.map((service: Service) => (
                    <Link
                      key={service.id}
                      href={`/service/${service.slug}` as LinkProps<string>["href"]}
                      onClick={onClose}
                      className={cn(
                        "group flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-white hover:border-emerald-100 hover:bg-emerald-50/30 transition-all duration-300",
                        "shadow-xs hover:shadow-md hover:shadow-emerald-500/5 hover:-translate-y-0.5"
                      )}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-bold text-slate-800 group-hover:text-emerald-800 transition-colors">
                          {service.name}
                        </span>
                        <span className="text-[12px] text-slate-500 line-clamp-1 opacity-80 group-hover:opacity-100">
                          {(service.description ?? "").substring(0, 60)}...
                        </span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-200/50 group-hover:text-emerald-600 transition-all">
                        <ExternalLink size={14} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {isServicesLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white/40 backdrop-blur-[1px] z-10 animate-in fade-in duration-300">
                 <div className="flex flex-col gap-4 w-full">
                   <div className="h-8 w-40 bg-slate-100 rounded-lg animate-pulse" />
                   <div className="h-4 w-64 bg-slate-50 rounded-lg animate-pulse" />
                   <div className="grid grid-cols-1 gap-3 mt-4">
                     {[1, 2, 3, 4].map(i => (
                       <div key={i} className="h-20 w-full bg-slate-50/80 rounded-2xl animate-pulse border border-slate-100" />
                     ))}
                   </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="bg-slate-50/80 border-t border-slate-100 p-4 flex items-center justify-between">
        <p className="text-[11px] font-medium text-slate-500 italic">
          Looking for custom solutions? Our support is available 24/7.
        </p>
        <Link 
          href={"/samples" as LinkProps<string>["href"]} 
          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
          onClick={onClose}
        >
          View all samples
        </Link>
      </div>
    </div>
  );
}
