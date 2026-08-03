import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to top whenever the route pathname changes (and on first mount). */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
