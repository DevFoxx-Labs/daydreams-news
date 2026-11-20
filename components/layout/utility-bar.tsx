import Link from "next/link";

import {
  Album02Icon,
  HugeiconsIcon,
  NewspaperIcon,
  PlayCircleIcon,
} from "@/components/icons";
import { CityWeather, type CityWidget } from "@/components/layout/city-weather";
import { Container } from "@/components/news/primitives";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { weatherCities } from "@/lib/data/states";
import { hindiLongDate } from "@/lib/format/hindiDate";
import { t } from "@/lib/i18n";
import { getAqi, getWeather } from "@/lib/services/widgets";
import { site } from "@/lib/site";

/**
 * Utility bar — DESIGN.md §4.1. Desktop only (≥ lg).
 *
 * Left: Hindi date, weather and AQI for the reader's city.
 * Right: section shortcuts and the language switch (hidden until the English
 * edition exists, FR-G5).
 */
export async function UtilityBar() {
  const cities: CityWidget[] = await Promise.all(
    weatherCities.map(async (city) => {
      const [weather, aqi] = await Promise.all([
        getWeather(city.slug),
        getAqi(city.slug),
      ]);
      return { weather: weather.data, aqi: aqi.data };
    }),
  );

  const links = [
    { href: "/epaper", label: t.common.epaper, icon: NewspaperIcon },
    { href: "/videos", label: t.common.video, icon: PlayCircleIcon },
    { href: "/web-stories", label: t.common.webStories, icon: Album02Icon },
  ];

  return (
    <div className="hidden border-b border-line bg-util lg:block">
      <Container className="flex h-9 items-center justify-between text-[13px] font-medium text-ink-2">
        <div className="flex items-center gap-5">
          <time dateTime={MOCK_NOW_ISO.slice(0, 10)}>
            {hindiLongDate(MOCK_NOW_ISO)}
          </time>
          <CityWeather cities={cities} defaultCity="nayi-dilli" />
        </div>

        <nav aria-label="उपयोगी लिंक" className="flex items-center gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 hover:text-brand"
            >
              <HugeiconsIcon
                icon={link.icon}
                size={15}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {link.label}
            </Link>
          ))}
          {site.englishEditionUrl ? (
            <a
              href={site.englishEditionUrl}
              className="rounded-[14px] border border-[#cfcfcf] bg-white px-2.5 py-[2px] hover:border-brand hover:text-brand"
              hrefLang="en"
            >
              {t.common.english}
            </a>
          ) : null}
        </nav>
      </Container>
    </div>
  );
}
