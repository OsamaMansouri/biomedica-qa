import type { Page } from "@playwright/test";

export const DESKTOP_VIEWPORT = { width: 1440, height: 900 } as const;
export const MOBILE_VIEWPORT = { width: 390, height: 844 } as const;

export async function useDesktopViewport(page: Page): Promise<void> {
  await page.setViewportSize(DESKTOP_VIEWPORT);
}

export async function useMobileViewport(page: Page): Promise<void> {
  await page.setViewportSize(MOBILE_VIEWPORT);
}
