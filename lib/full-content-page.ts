export function isCategoryListingPage(
  pathname: string,
  componentGroups: string[],
) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 2) return false;
  const [section, slug] = segments;
  if (section === "blocks" || section === "examples") return true;
  return section === "components" && componentGroups.includes(slug);
}

export function isFullContentPage(
  pathname: string,
  componentGroups: string[],
) {
  if (isCategoryListingPage(pathname, componentGroups)) return false;
  return (
    pathname.startsWith("/components/") ||
    pathname.startsWith("/blocks/") ||
    pathname.startsWith("/examples/")
  );
}
