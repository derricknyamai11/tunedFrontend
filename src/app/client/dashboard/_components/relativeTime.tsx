"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface RelativeTimeProps {
  date: string;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <time dateTime={date} className="text-xs text-slate-500 mt-1 block">
        ...
      </time>
    );
  }

  return (
    <time 
      dateTime={date} 
      className="text-xs text-slate-500 mt-1 block"
      suppressHydrationWarning
    >
      {formatDistanceToNow(new Date(date), { addSuffix: true })}
    </time>
  );
}