import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { getStates } from "@/lib/cms";
import { t } from "@/lib/i18n";
import { stateHref } from "@/lib/routes";
import { site } from "@/lib/site";

/** राज्य index — every state with its major cities. */

export const metadata: Metadata = {
  title: "राज्य और शहर",
  description: `हर राज्य और बड़े शहरों की ख़बरें एक जगह — ${site.name} पर।`,
  alternates: { canonical: "/state" },
};

export default async function StatesIndexPage() {
  const states = await getStates();

  return (
    <SiteShell variant="full">
      <Container className="pt-5">
        <SectionHeader title={t.nav.states} as="h1" />
        <ul className="grid gap-6 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {states.map((state) => (
            <li key={state.slug}>
              <Link
                href={stateHref(state.slug)}
                className="block text-[17px] font-bold hover:text-brand"
              >
                {state.name}
              </Link>
              <ul className="mt-1 space-y-0.5">
                {state.cities.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={stateHref(state.slug, city.slug)}
                      className="text-[14px] text-muted hover:text-brand"
                    >
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </SiteShell>
  );
}
