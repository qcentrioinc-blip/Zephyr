/** Encode a `/public` asset path so spaces and reserved chars work on CDNs.
 *
 *  Use `%2B` for `+` (not a literal `+`). On Vercel/CDNs a bare `+` in the path
 *  is often treated like a space, so files named `A + B.jpg` 404 in production
 *  while working in Vite. Local Vite middleware maps `%2B` → `+` for disk lookup.
 */
export function publicAssetSrc(src: string): string {
  if (!src) return src;
  if (src.startsWith("data:") || src.startsWith("blob:")) return src;

  if (/^https?:\/\//i.test(src)) {
    try {
      const url = new URL(src);
      url.pathname = encodePathname(url.pathname);
      return url.href;
    } catch {
      return src;
    }
  }

  return encodePathname(src);
}

function encodePathname(pathname: string): string {
  return pathname
    .split("/")
    .map((segment, index) => {
      if (index === 0 && segment === "") return "";
      let decoded = segment;
      try {
        decoded = decodeURIComponent(segment);
      } catch {
        /* keep raw segment */
      }
      return encodeURIComponent(decoded);
    })
    .join("/");
}
