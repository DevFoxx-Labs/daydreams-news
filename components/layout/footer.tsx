import Link from "next/link";

import { CookiePreferencesButton } from "@/components/consent/cookie-preferences-button";
import {
  Facebook02Icon,
  HugeiconsIcon,
  InstagramIcon,
  Linkedin02Icon,
  NewTwitterIcon,
  PlayStoreIcon,
  YoutubeIcon,
} from "@/components/icons";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/news/primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { fill, t } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Footer — DESIGN.md §4.7. */

const COLUMNS = [
  {
    heading: t.footer.news,
    links: [
      { href: "/desh", label: "देश" },
      { href: "/duniya", label: "दुनिया" },
      { href: "/state", label: "राज्य" },
      { href: "/desh?sub=rajniti", label: "राजनीति" },
      { href: "/desh?sub=mausam", label: "मौसम" },
    ],
  },
  {
    heading: t.footer.sportsEntertainment,
    links: [
      { href: "/cricket", label: "क्रिकेट" },
      { href: "/khel", label: "खेल" },
      { href: "/manoranjan", label: "मनोरंजन" },
      { href: "/videos", label: "वीडियो" },
      { href: "/web-stories", label: "वेब स्टोरीज़" },
    ],
  },
  {
    heading: t.footer.useful,
    links: [
      { href: "/naukri", label: "नौकरी" },
      { href: "/shiksha", label: "शिक्षा" },
      { href: "/business", label: "बिज़नेस" },
      { href: "/tech", label: "टेक" },
      { href: "/rashifal", label: "राशिफल" },
    ],
  },
  {
    heading: t.footer.aboutUs,
    links: [
      { href: "/about", label: t.legal.about },
      { href: "/contact", label: t.legal.contact },
      { href: "/advertise", label: t.legal.advertise },
      { href: "/ethics", label: t.legal.ethics },
      { href: "/sitemap", label: t.legal.sitemap },
    ],
  },
];

const SOCIALS = [
  { href: site.social.facebook, label: "Facebook", icon: Facebook02Icon },
  { href: site.social.x, label: "X", icon: NewTwitterIcon },
  { href: site.social.linkedin, label: "LinkedIn", icon: Linkedin02Icon },
  { href: site.social.youtube, label: "YouTube", icon: YoutubeIcon },
  { href: site.social.instagram, label: "Instagram", icon: InstagramIcon },
].filter((s) => s.href && s.href !== "#");

const LEGAL_LINKS = [
  { href: "/privacy", label: t.legal.privacy },
  { href: "/terms", label: t.legal.terms },
  { href: "/cookies", label: t.legal.cookies },
  { href: "/grievance", label: t.legal.grievance },
  { href: "/consent", label: t.legal.consent },
];

export function Footer() {
  const year = new Date(MOCK_NOW_ISO).getUTCFullYear();

  return (
    <footer className="bg-footer pb-6 pt-11 text-[#bdbdbd]">
      <Container>
        <div className="grid gap-8 border-b border-[#2c2c2c] pb-7 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo variant="white" showTagline={false} />
            <p className="my-3.5 text-[15px] leading-[1.6] text-[#aaa]">
              {t.footer.aboutLine}
            </p>
            {(site.apps.googlePlay || site.apps.appStore) && (
              <div className="flex gap-2.5">
                {site.apps.googlePlay ? (
                  <a
                    href={site.apps.googlePlay}
                    className="flex items-center gap-1.5 rounded-[6px] border border-[#444] px-3 py-1.5 font-ui text-[12px] font-semibold text-white"
                  >
                    <HugeiconsIcon icon={PlayStoreIcon} size={14} strokeWidth={1.8} />
                    Google Play
                  </a>
                ) : null}
                {site.apps.appStore ? (
                  <a
                    href={site.apps.appStore}
                    className="rounded-[6px] border border-[#444] px-3 py-1.5 font-ui text-[12px] font-semibold text-white"
                  >
                    App Store
                  </a>
                ) : null}
              </div>
            )}
            {SOCIALS.length > 0 ? (
              <div className="mt-3.5 flex gap-2.5">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    rel="noopener noreferrer"
                    className="grid size-9 place-items-center rounded-full bg-[#2a2a2a] text-white hover:bg-brand"
                  >
                    <HugeiconsIcon icon={social.icon} size={16} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Desktop: four link columns. */}
          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="hidden lg:block">
              <h2 className="mb-3 text-[16px] font-bold text-white">{column.heading}</h2>
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-[15px] leading-[2] text-[#bdbdbd] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}

          {/* Mobile: the same columns as accordions. */}
          <Accordion type="multiple" className="lg:hidden">
            {COLUMNS.map((column) => (
              <AccordionItem key={column.heading} value={column.heading}>
                <AccordionTrigger>{column.heading}</AccordionTrigger>
                <AccordionContent>
                  {column.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-1.5 text-[15px] text-[#bdbdbd]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex flex-col gap-3 pt-4 text-[13px] text-[#888] lg:flex-row lg:items-center lg:justify-between">
          <span>{fill(t.footer.copyright, { year, name: site.name })}</span>
          <nav aria-label="कानूनी लिंक" className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            <CookiePreferencesButton />
          </nav>
        </div>
        <p className="mt-3 text-[12.5px] text-[#6f6f6f]">{t.footer.demoNotice}</p>
      </Container>
    </footer>
  );
}
