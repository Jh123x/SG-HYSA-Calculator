import { useEffect, useRef } from "react";

/**
 * Sets the document title for the current page.
 * Restores the previous title when the component unmounts.
 *
 * @param title - The page-specific title. The site name suffix is appended automatically.
 */
export function useDocumentTitle(title: string): void {
  const prevTitleRef = useRef(document.title);

  useEffect(() => {
    const fullTitle = `${title} — SG HYSA Calculator`;
    document.title = fullTitle;

    return () => {
      document.title = prevTitleRef.current;
    };
  }, [title]);
}
