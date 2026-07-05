export const robotsDisallow = ["/api/", "/admin/"] as const;

function matchesPathPrefix(pathname: string, prefix: string): boolean {
  const normalizedPrefix = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;

  return pathname === normalizedPrefix || pathname.startsWith(prefix);
}

export function isBlockedByRobots(pathname: string): boolean {
  return robotsDisallow.some((prefix) => matchesPathPrefix(pathname, prefix));
}

export function isNoindexPublicPath(pathname: string): boolean {
  return /^\/(?:en\/|ru\/)?newsletter(?:\/|$)/.test(pathname);
}

export function isSitemapIndexablePath(pathname: string): boolean {
  return !isBlockedByRobots(pathname) && !isNoindexPublicPath(pathname);
}
