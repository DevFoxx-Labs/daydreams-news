"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { site } from "@/lib/site";

/** 14-day publishing trend — skill §5.8 (224px, brand area with a gradient). */
export function PublishTrendChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-xs text-muted-foreground">
        पिछले 14 दिन का कोई आंकड़ा नहीं।
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={224}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="ks-publish" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={site.colors.brand} stopOpacity={0.35} />
            <stop offset="95%" stopColor={site.colors.brand} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} width={40} />
        <Tooltip
          formatter={(value) => [`${value ?? 0} ख़बरें`, ""]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke={site.colors.brand}
          strokeWidth={2}
          fill="url(#ks-publish)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
