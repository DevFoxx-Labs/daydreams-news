"use client";

import { useMemo, useState } from "react";

import {
  CloudFogIcon,
  CloudIcon,
  CloudMidRainIcon,
  HugeiconsIcon,
  Location01Icon,
  SnowIcon,
  Sun01Icon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClientStore } from "@/lib/client-store";
import { t } from "@/lib/i18n";
import { cityStore, setCity } from "@/lib/preference-stores";
import type { Aqi, Weather } from "@/lib/services/types";
import { cn } from "@/lib/utils";

/**
 * Weather + AQI for the reader's city — FR-G4.
 *
 * The server renders the default city (नई दिल्ली) so the utility bar is part
 * of the static shell; this component swaps in the saved city after mount.
 * Data for every selectable city is passed in as props (ten small objects),
 * which keeps the switch instant and avoids making the page dynamic.
 */

const ICONS = {
  sun: Sun01Icon,
  cloud: CloudIcon,
  rain: CloudMidRainIcon,
  fog: CloudFogIcon,
  snow: SnowIcon,
} as const;

const AQI_COLORS: Record<Aqi["level"], string> = {
  good: "border-[#8fd19e] bg-[#eefaf1] text-[#14703a]",
  satisfactory: "border-[#c5e1a5] bg-[#f3f9ec] text-[#426b1f]",
  moderate: "border-[#ffd27f] bg-[#fff8ec] text-[#8a5a00]",
  poor: "border-[#ffb199] bg-[#fff2ee] text-[#9e3b16]",
  veryPoor: "border-[#f3c6cd] bg-[#fff1f3] text-[#9e0b22]",
  severe: "border-[#d9a0a0] bg-[#f7ecec] text-[#6b0f0f]",
};

export type CityWidget = { weather: Weather; aqi: Aqi };

export function CityWeather({
  cities,
  defaultCity,
  className,
}: {
  cities: CityWidget[];
  defaultCity: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const savedCity = useClientStore(cityStore);
  const citySlug = cities.some((c) => c.weather.city === savedCity)
    ? savedCity
    : defaultCity;

  const current = useMemo(
    () => cities.find((c) => c.weather.city === citySlug) ?? cities[0],
    [cities, citySlug],
  );

  function choose(slug: string) {
    setCity(slug);
    setOpen(false);
  }

  const { weather, aqi } = current;

  return (
    <div className={cn("flex items-center gap-2 lg:gap-5", className)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className="flex items-center gap-1.5 text-[13px] font-medium text-ink-2 hover:text-brand"
          aria-label={t.widgets.changeCity}
        >
          <HugeiconsIcon
            icon={ICONS[weather.icon]}
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <span>
            {weather.cityName} {weather.tempC}°C
          </span>
        </DialogTrigger>

        <span
          className={cn(
            "rounded-[14px] border px-2.5 py-[2px] text-[12.5px] font-semibold",
            AQI_COLORS[aqi.level],
          )}
        >
          AQI {aqi.value} · {aqi.label}
        </span>

        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{t.widgets.changeCity}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {cities.map(({ weather: w }) => (
                <li key={w.city}>
                  <Button
                    variant={w.city === citySlug ? "brand" : "outline"}
                    size="md"
                    className="w-full justify-start gap-2"
                    onClick={() => choose(w.city)}
                  >
                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    {w.cityName}
                  </Button>
                </li>
              ))}
            </ul>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
