import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

/**
 * Default Open Graph / Twitter card — SEO-2 (1200×630).
 *
 * Latin-only by design: `next/og` needs a TTF/OTF/WOFF to draw Devanagari and
 * the project currently ships only WOFF2 (see docs/known-gaps.md). Per-story
 * cards with the Hindi headline land once a Mukta TTF is added to
 * `public/fonts`.
 */

export const alt = `${site.nameLatin} — Hindi News`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ width: 24, height: "100%", backgroundColor: site.colors.brand }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 16,
              backgroundColor: site.colors.brand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <div style={{ color: "#fff", fontSize: 64, fontWeight: 800 }}>KS</div>
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              color: site.colors.brand,
              letterSpacing: -2,
            }}
          >
            {site.nameLatin}
          </div>
          <div style={{ fontSize: 34, color: "#333333", marginTop: 12 }}>
            Hindi News · National, State &amp; City
          </div>
          <div style={{ fontSize: 26, color: "#6b6b6b", marginTop: 24 }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
