import Link from "next/link";
import { Fragment } from "react";

import { EmbedFacade } from "@/components/article/embed-facade";
import { AdSlot } from "@/components/news/ad-slot";
import { StoryImage } from "@/components/news/story-image";
import type { RichTextBlock, Story } from "@/lib/data/types";
import { t } from "@/lib/i18n";
import { storyHref } from "@/lib/routes";

/**
 * Article body renderer — FR-A2, FR-A3.
 *
 * Blocks come from the CMS as structured data, never as raw HTML, so there is
 * no HTML to sanitise and no injection surface.
 *
 * Automatic insertions:
 * · "यह भी पढ़ें" after paragraph 2 when the editor didn't place one
 * · an in-article ad after paragraph 4, then every 6 paragraphs, max 3
 */

const AD_FIRST_PARAGRAPH = 4;
const AD_EVERY = 6;
const AD_MAX = 3;
const AUTO_READ_ALSO_AFTER = 2;

export function ArticleBody({
  blocks,
  /** Stories referenced by `readAlso` blocks and the auto-inserted one. */
  readAlsoStories,
  autoReadAlso,
  /** Legal and static pages carry no ads. */
  insertAds = true,
}: {
  blocks: RichTextBlock[];
  readAlsoStories: Record<string, Story>;
  autoReadAlso: Story | null;
  insertAds?: boolean;
}) {
  const plan = planInsertions(blocks, {
    insertAds,
    autoReadAlso: Boolean(autoReadAlso),
  });

  return (
    <div className="rt-body">
      {blocks.map((block, index) => (
        <Fragment key={index}>
          <BlockView block={block} readAlsoStories={readAlsoStories} />
          {plan.readAlsoAfter === index && autoReadAlso ? (
            <ReadAlso story={autoReadAlso} />
          ) : null}
          {plan.adsAfter.has(index) ? (
            <AdSlot
              size="in-article"
              placement={`article-inline-${plan.adsAfter.get(index)}`}
              className="my-6"
            />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Works out where the automatic read-also box and the in-article ads go,
 * before rendering starts, so nothing is mutated during the render pass.
 */
function planInsertions(
  blocks: RichTextBlock[],
  options: { insertAds: boolean; autoReadAlso: boolean },
): { readAlsoAfter: number; adsAfter: Map<number, number> } {
  const hasEditorReadAlso = blocks.some((block) => block.type === "readAlso");
  const adsAfter = new Map<number, number>();
  let readAlsoAfter = -1;
  let paragraphIndex = 0;
  let adsInserted = 0;

  blocks.forEach((block, index) => {
    if (block.type !== "paragraph") return;
    paragraphIndex += 1;

    if (
      !hasEditorReadAlso &&
      options.autoReadAlso &&
      paragraphIndex === AUTO_READ_ALSO_AFTER
    ) {
      readAlsoAfter = index;
    }

    const dueForAd =
      paragraphIndex === AD_FIRST_PARAGRAPH ||
      (paragraphIndex > AD_FIRST_PARAGRAPH &&
        (paragraphIndex - AD_FIRST_PARAGRAPH) % AD_EVERY === 0);

    if (options.insertAds && dueForAd && adsInserted < AD_MAX) {
      adsInserted += 1;
      adsAfter.set(index, adsInserted);
    }
  });

  return { readAlsoAfter, adsAfter };
}

function BlockView({
  block,
  readAlsoStories,
}: {
  block: RichTextBlock;
  readAlsoStories: Record<string, Story>;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="t-body text-[#1d1d1d]">
          {block.dateline ? <b className="font-bold">{block.dateline} </b> : null}
          {block.text}
        </p>
      );

    case "heading":
      return block.level === 2 ? (
        <h2 className="mt-7 text-[22px] font-extrabold lg:text-[26px]">
          {block.text}
        </h2>
      ) : (
        <h3 className="mt-6 text-[19px] font-bold lg:text-[21px]">{block.text}</h3>
      );

    case "list":
      return block.style === "bullet" ? (
        <ul className="list-disc space-y-2 ps-6">
          {block.items.map((item) => (
            <li key={item} className="text-[17px] leading-[1.7] lg:text-[18px]">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <ol className="list-decimal space-y-2 ps-6">
          {block.items.map((item) => (
            <li key={item} className="text-[17px] leading-[1.7] lg:text-[18px]">
              {item}
            </li>
          ))}
        </ol>
      );

    case "image":
      return (
        <figure>
          <StoryImage
            media={block.media}
            seed={`body-${block.media.alt.slice(0, 12)}`}
            className="h-[200px] md:h-[320px] lg:h-[400px]"
            rounded="rounded-[6px]"
            sizes="(max-width: 1023px) 100vw, 800px"
          />
          {block.media.caption ? (
            <figcaption className="mt-2 text-[14px] text-muted">
              {block.media.caption}
              {block.media.isAiGenerated
                ? ` ${t.common.aiImage}`
                : block.media.isFile
                  ? ` ${t.common.symbolicImage}`
                  : ""}
              {block.media.credit ? ` — ${block.media.credit}` : ""}
            </figcaption>
          ) : null}
        </figure>
      );

    case "quote":
      return (
        <blockquote className="border-b border-line border-t-[3px] border-t-brand py-5 text-[22px] font-bold leading-[1.45] text-brand-dark lg:text-[26px]">
          “{block.text}”
          {block.attribution ? (
            <footer className="mt-2 text-[15px] font-medium text-muted">
              {block.attribution}
            </footer>
          ) : null}
        </blockquote>
      );

    case "readAlso": {
      const story = readAlsoStories[block.storyId];
      return story ? <ReadAlso story={story} /> : null;
    }

    case "embed":
      return (
        <EmbedFacade
          provider={block.provider}
          id={block.id}
          title={block.title}
        />
      );

    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[15px] lg:text-[16px]">
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="border border-line bg-soft px-3 py-2 text-start font-bold"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-line px-3 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "infoBox":
      return (
        <aside className="rounded-[6px] border border-line bg-soft p-4">
          <h3 className="mb-2 text-[16px] font-extrabold">{block.title}</h3>
          <ul className="list-disc space-y-1.5 ps-5">
            {block.items.map((item) => (
              <li key={item} className="text-[16px] leading-[1.6]">
                {item}
              </li>
            ))}
          </ul>
        </aside>
      );

    default:
      return null;
  }
}

/** "यह भी पढ़ें" inline box — DESIGN.md §6.6. */
export function ReadAlso({ story }: { story: Story }) {
  return (
    <aside className="my-6 grid grid-cols-[100px_1fr] items-center gap-4 border border-line border-s-4 border-s-brand p-3.5 lg:grid-cols-[130px_1fr] lg:px-[18px]">
      <StoryImage
        media={story.image}
        seed={`ra-${story.id}`}
        className="h-[70px] lg:h-[80px]"
        rounded="rounded-[4px]"
        sizes="130px"
      />
      <div>
        <span className="mb-1 block text-[13px] font-extrabold text-brand">
          {t.article.readAlso}
        </span>
        <Link
          href={storyHref(story)}
          className="clamp-2 text-[16px] font-bold leading-snug hover:text-brand-dark lg:text-[18px]"
        >
          {story.title}
        </Link>
      </div>
    </aside>
  );
}
