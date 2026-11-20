import { describe, expect, it } from "vitest";

import {
  buildSearchIndex,
  matchesQuery,
  normalise,
  transliterate,
} from "@/lib/search/translit";

describe("transliterate", () => {
  it("renders common Hindi news words in Latin", () => {
    expect(transliterate("मौसम")).toBe("mausam");
    expect(transliterate("क्रिकेट")).toBe("kriket");
    expect(transliterate("दिल्ली")).toBe("dilli");
  });

  it("keeps word-internal schwas, which the fuzzy matcher absorbs", () => {
    // No schwa deletion: "नौकरी" → "naukari", one edit from how people type it.
    expect(transliterate("नौकरी")).toBe("naukari");
    expect(matchesQuery(buildSearchIndex(["सरकारी नौकरी"]), "naukri")).toBe(true);
  });

  it("handles nukta letters", () => {
    expect(transliterate("ख़बर")).toBe("khabar");
    expect(transliterate("बाज़ार")).toBe("bazar");
  });
});

describe("matchesQuery", () => {
  const index = buildSearchIndex([
    "उत्तर भारत में कोहरे और ठंड का डबल अटैक",
    "मौसम विभाग ने ऑरेंज अलर्ट जारी किया",
    "मौसम कोहरा दिल्ली",
  ]);

  it("finds a Hindi word with a Latin query (FR-S1)", () => {
    expect(matchesQuery(index, "mausam")).toBe(true);
  });

  it("finds the same word written in Hindi", () => {
    expect(matchesQuery(index, "मौसम")).toBe(true);
  });

  it("tolerates a single typo", () => {
    expect(matchesQuery(index, "mausm")).toBe(true);
  });

  it("does not match unrelated words", () => {
    expect(matchesQuery(index, "क्रिकेट")).toBe(false);
    expect(matchesQuery(index, "cricket")).toBe(false);
  });

  it("requires every token to match", () => {
    expect(matchesQuery(index, "मौसम क्रिकेट")).toBe(false);
  });
});

describe("normalise", () => {
  it("strips punctuation and collapses whitespace", () => {
    expect(normalise("  मौसम,   अलर्ट!  ")).toBe("मौसम अलर्ट");
  });
});
