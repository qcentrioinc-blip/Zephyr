/** Encode a `/public` asset path so CDNs serve files with special characters reliably. */
export function publicAssetSrc(src: string): string {
  if (!src) return src;
  if (src.startsWith("data:") || src.startsWith("blob:")) return src;
  if (src.includes("%")) return src;

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
    .map((segment, index) =>
      index === 0 && segment === "" ? "" : encodeURIComponent(segment),
    )
    .join("/");
}
