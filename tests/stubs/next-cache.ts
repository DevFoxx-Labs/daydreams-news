/**
 * Test stub for `next/cache`.
 *
 * `use cache` directives are compiled away by Vitest, but the `cacheLife` and
 * `cacheTag` calls inside those functions still run and throw outside the
 * Next.js request context. The data-access layer's behaviour is what the
 * tests are about, so the cache hints become no-ops here.
 */
export function cacheLife(_profile?: unknown): void {}
export function cacheTag(..._tags: string[]): void {}
export function revalidateTag(..._tags: string[]): void {}
export function revalidatePath(_path: string, _type?: unknown): void {}
export function updateTag(..._tags: string[]): void {}
