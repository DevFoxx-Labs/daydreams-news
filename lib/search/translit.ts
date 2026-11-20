/**
 * Devanagari → Latin transliteration, good enough for search matching
 * (FR-S1: the query "mausam" must find "मौसम").
 *
 * This is deliberately lossy and phonetic, not a reversible scheme. When a
 * real search engine (Meilisearch / Typesense) is wired up, its own
 * normalisation replaces this.
 */

const INDEPENDENT_VOWELS: Record<string, string> = {
  अ: "a",
  आ: "a",
  इ: "i",
  ई: "i",
  उ: "u",
  ऊ: "u",
  ऋ: "ri",
  ए: "e",
  ऐ: "ai",
  ओ: "o",
  औ: "au",
};

const MATRAS: Record<string, string> = {
  // Short forms throughout: readers type "naukri", not "naukree".
  "ा": "a", // ा
  "ि": "i", // ि
  "ी": "i", // ी
  "ु": "u", // ु
  "ू": "u", // ू
  "ृ": "ri", // ृ
  "े": "e", // े
  "ै": "ai", // ै
  "ो": "o", // ो
  "ौ": "au", // ौ
};

const CONSONANTS: Record<string, string> = {
  क: "k",
  ख: "kh",
  ग: "g",
  घ: "gh",
  ङ: "n",
  च: "ch",
  छ: "chh",
  ज: "j",
  झ: "jh",
  ञ: "n",
  ट: "t",
  ठ: "th",
  ड: "d",
  ढ: "dh",
  ण: "n",
  त: "t",
  थ: "th",
  द: "d",
  ध: "dh",
  न: "n",
  प: "p",
  फ: "ph",
  ब: "b",
  भ: "bh",
  म: "m",
  य: "y",
  र: "r",
  ल: "l",
  व: "v",
  श: "sh",
  ष: "sh",
  स: "s",
  ह: "h",
  ळ: "l",
  // Nukta forms that appear in Hindi news copy
  क़: "q",
  ख़: "kh",
  ग़: "g",
  ज़: "z",
  ड़: "r",
  ढ़: "rh",
  फ़: "f",
  "ऩ": "n",
};

const VIRAMA = "्"; // ्
const ANUSVARA = "ं"; // ं
const CHANDRABINDU = "ँ"; // ँ
const VISARGA = "ः"; // ः
const NUKTA = "़"; // ़
const AVAGRAHA = "ऽ";

/** "मौसम" → "mausam", "नौकरी" → "naukri". */
export function transliterate(input: string): string {
  const chars = [...input];
  let out = "";

  for (let i = 0; i < chars.length; i += 1) {
    let ch = chars[i];

    // Fold a following nukta into the base consonant (क + ़ → क़).
    if (chars[i + 1] === NUKTA && CONSONANTS[ch + NUKTA]) {
      ch += NUKTA;
      i += 1;
    }

    const consonant = CONSONANTS[ch];
    if (consonant) {
      out += consonant;
      const next = chars[i + 1];
      if (next && MATRAS[next]) {
        out += MATRAS[next];
        i += 1;
      } else if (next === VIRAMA) {
        i += 1; // conjunct: no inherent vowel
      } else if (next === ANUSVARA || next === CHANDRABINDU) {
        out += "n";
        i += 1;
      } else {
        out += "a"; // inherent vowel
      }
      continue;
    }

    if (INDEPENDENT_VOWELS[ch]) {
      out += INDEPENDENT_VOWELS[ch];
      continue;
    }
    if (ch === ANUSVARA || ch === CHANDRABINDU) {
      out += "n";
      continue;
    }
    if (ch === VISARGA || ch === NUKTA || ch === AVAGRAHA || ch === VIRAMA) {
      continue;
    }
    if (ch === "ॐ") {
      out += "om";
      continue;
    }
    out += ch.toLowerCase();
  }

  // Trim trailing inherent vowels that Hindi speakers don't pronounce
  // ("मौसम" → "mausama" → "mausam").
  return out.replace(/([bcdfghjklmnpqrstvwxyz])a\b/g, "$1");
}

/**
 * Lower-case, strip punctuation, collapse whitespace.
 * `\p{M}` must stay in the allow-list: Devanagari matras and the virama are
 * combining marks, and dropping them turns "मौसम" into "म सम".
 */
export function normalise(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Levenshtein distance, capped for speed. */
export function editDistance(a: string, b: string, max = 2): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= b.length; j += 1) {
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = row;
  }
  return prev[b.length];
}

/**
 * Searchable text for a story: the Hindi words plus their Latin
 * transliteration, so both "मौसम" and "mausam" hit the same document.
 */
export function buildSearchIndex(parts: (string | undefined)[]): string {
  const hindi = normalise(parts.filter(Boolean).join(" "));
  return `${hindi} ${transliterate(hindi)}`;
}

/** Typo-tolerant token match used by the mock search (FR-S1). */
export function matchesQuery(index: string, query: string): boolean {
  const tokens = normalise(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return false;
  const haystack = index;
  const words = haystack.split(" ");

  return tokens.every((token) => {
    const latin = transliterate(token);
    if (haystack.includes(token) || haystack.includes(latin)) return true;
    // Allow one typo on tokens long enough for it to be meaningful.
    if (token.length < 4) return false;
    return words.some(
      (word) =>
        editDistance(word, token, 1) <= 1 || editDistance(word, latin, 1) <= 1,
    );
  });
}
