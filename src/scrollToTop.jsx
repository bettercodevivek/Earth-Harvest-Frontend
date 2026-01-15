import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Only scroll to top if there's no hash (hash navigation is handled by ScrollToHash)
    if (!hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      }, 0);
    }
  }, [pathname, hash]);

  return null;
}

