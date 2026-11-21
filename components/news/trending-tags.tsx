import { Container, TagChip } from "@/components/news/primitives";
import type { TrendingTag } from "@/lib/data/types";
import { t } from "@/lib/i18n";

/** Trending row under the ticker — DESIGN.md §4.4, FR-G3. */
export function TrendingTags({ tags }: { tags: TrendingTag[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="border-b border-line">
      <Container className="no-scrollbar flex items-center gap-2.5 overflow-x-auto py-3">
        <span className="me-1 shrink-0 text-[14px] font-semibold text-meta">
          {t.home.trendingLabel}
        </span>
        {tags.map((tag) => (
          <TagChip
            key={tag.slug}
            label={tag.label}
            slug={tag.slug}
            className="shrink-0"
          />
        ))}
      </Container>
    </div>
  );
}
