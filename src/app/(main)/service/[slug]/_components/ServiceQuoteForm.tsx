"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useQuoteForm } from "@/lib/hooks/quote.hook";
import { LevelSelect } from "@/app/(main)/_components/LevelSelect";
import { DeadlinePicker } from "@/app/(main)/_components/DeadlinePicker";
import { PageCountControl } from "@/app/(main)/_components/PageCountControl";
import { cn } from "@/lib/utils";
import type { ServiceQuoteFormProps } from "@/lib/props/service.props";
import type { Level } from "@/lib/types/content.type";

export function ServiceQuoteForm({ service, levels }: ServiceQuoteFormProps) {
  const {
    formState,
    price,
    isPriceLoading,
    priceError,
    wordsPerPage,
    setServiceId,
    setLevelId,
    setDeadline,
    setPageCount,
  } = useQuoteForm();

  useEffect(() => {
    setServiceId(service.id);
    if (levels.length > 0 && levels[0] && !formState.levelId) {
      setLevelId(levels[0].id);
    }
  }, [service.id, levels, setServiceId, setLevelId, formState.levelId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const continueHref = `/order?service=${service.slug}` as any;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="text-center px-2">
        <p className="text-base font-bold text-white tracking-tight">
          Get Instant Pricing
        </p>
        <p className="text-[11px] text-emerald-200/80 mt-0.5 font-medium uppercase tracking-wider">
          {service.name} Specialist
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            Selected Service
          </label>
          <div className="h-11 w-full bg-slate-900 border border-slate-700 rounded-lg flex items-center px-4 text-emerald-400 font-semibold text-sm">
            {service.name}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
              Level
            </label>
            <LevelSelect
              levels={levels as unknown as Level[]}
              value={formState.levelId}
              onChange={setLevelId}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
              Deadline
            </label>
            <DeadlinePicker
              value={formState.deadline}
              onChange={setDeadline}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            Length
          </label>
          <div className="bg-slate-900 rounded-lg p-3 ring-1 ring-slate-700">
            <PageCountControl
              value={formState.pageCount}
              wordsPerPage={wordsPerPage}
              onChange={setPageCount}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-700/50">
        <div>
          <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-0.5">
            Estimated Price:
          </p>
          <div className="h-7 flex items-center">
            {isPriceLoading ? (
              <Loader2
                size={18}
                className="animate-spin text-emerald-400"
                aria-label="Calculating price"
              />
            ) : priceError ? (
              <span className="text-xs font-semibold text-red-400">Calculation Error</span>
            ) : (
              <span className="text-2xl font-black text-white tabular-nums drop-shadow-sm">
                {price?.total_price
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(price.total_price)
                  : "$0.00"}
              </span>
            )}
          </div>
        </div>

        <Link
          href={continueHref}
          className={cn(
            "flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-900 transition-all shadow-xl shadow-emerald-500/10 active:scale-95",
            (!formState.serviceId || isPriceLoading) && "opacity-50 cursor-not-allowed grayscale"
          )}
          aria-label="Continue to order"
        >
          Check out
          <ArrowRight size={16} strokeWidth={3} />
        </Link>
      </div>
    </div>
  );
}
