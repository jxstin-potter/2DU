/**
 * Normalize a tag name to a URL slug (e.g. "Hi" -> "hi", "My Tag" -> "my-tag").
 */
export function tagNameToSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
