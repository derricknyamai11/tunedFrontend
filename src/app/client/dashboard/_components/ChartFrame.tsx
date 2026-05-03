"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer } from "recharts";

export function ChartFrame({ children }: { readonly children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-full min-h-[200px]" />;
  }

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%" debounce={100}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}