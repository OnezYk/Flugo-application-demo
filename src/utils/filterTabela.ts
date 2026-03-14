import Fuse from "fuse.js";

export function fuzzySearch<T>(
  data: T[],
  filter: string,
  query: string,
  threshold = 0.3
): T[] {
  if (!query) return data;

  const fuse = new Fuse(data, {
    keys: [filter as string],
    threshold,
  });

  return fuse.search(query).map((r) => r.item);
}