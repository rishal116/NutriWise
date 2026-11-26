import { NAV_SECTIONS, type NavChild } from "./admin-sidebar.config";

export function isPathActive(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function getActiveChildPath(
  pathname: string,
  children: NavChild[],
): string | null {
  const activeChild = children
    .filter((child) => isPathActive(pathname, child.path))
    .sort((first, second) => second.path.length - first.path.length)[0];

  return activeChild?.path ?? null;
}

export function getActiveGroup(pathname: string): string | null {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.children && getActiveChildPath(pathname, item.children)) {
        return item.name;
      }
    }
  }

  return null;
}
