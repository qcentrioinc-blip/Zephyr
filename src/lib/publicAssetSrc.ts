/** Encode a `/public` asset path so spaces and reserved chars work on CDNs.
 *  Keep `+` literal — Vite's static server 404s (falls back to index.html) on `%2B`. */
export function publicAssetSrc(src: string): string {
  if (!src) return src;
  if (src.startsWith("data:") || src.startsWith("blob:")) return src;
  if (src.includes("%")) {
    return src.replace(/%2B/gi, "+");
  }

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
      return encodeURIComponent(segment).replace(/%2B/g, "+");
    })
    .join("/");
}
