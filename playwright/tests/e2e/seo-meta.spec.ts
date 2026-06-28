import { test, expect, type Page } from "@playwright/test";



import { localeFromProject } from "../i18n/locale";

import {

  smokeMagazineArticleSlug,

  STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG,

} from "../i18n/strings";

import { waitForStorefrontNotLoading } from "../utils/openApp";



async function expectCanonical(page: Page, pattern: RegExp) {

  const canonical = page.locator('link[rel="canonical"]');

  await expect(canonical).toHaveCount(1);

  const href = await canonical.getAttribute("href");

  expect(href, "canonical href").toMatch(pattern);

}



async function expectHreflangAlternates(

  page: Page,

  frPattern: RegExp,

  enPattern: RegExp,

) {

  const fr = page.locator('link[rel="alternate"][hreflang="fr"]');

  const en = page.locator('link[rel="alternate"][hreflang="en"]');

  await expect(fr).toHaveCount(1);

  await expect(en).toHaveCount(1);

  const frHref = await fr.getAttribute("href");

  const enHref = await en.getAttribute("href");

  expect(frHref, "hreflang fr").toMatch(frPattern);

  expect(enHref, "hreflang en").toMatch(enPattern);

}



test.describe("E2E: SEO meta tags", () => {

  test("Guest: PDP exposes canonical and hreflang alternates @seo @pdp @e2e", async ({

    page,

  }, testInfo) => {

    const locale = localeFromProject(testInfo);

    const slug = (

      process.env.PLAYWRIGHT_TEST_PRODUCT_SLUG ||

      STORE_FRONT_E2E_DEFAULT_PRODUCT_SLUG

    ).trim();



    await page.goto(`product/${slug}`, { waitUntil: "domcontentloaded" });

    await waitForStorefrontNotLoading(page);



    await expectCanonical(page, new RegExp(`/product/${slug}`));

    await expectHreflangAlternates(

      page,

      /\/fr\/product\//,

      /\/en\/product\//,

    );

    expect(page.url()).toContain(`/${locale}/product/`);

  });



  test("Guest: magazine article exposes canonical and hreflang alternates @seo @magazine @e2e", async ({

    page,

  }, testInfo) => {

    const locale = localeFromProject(testInfo);

    const slug = smokeMagazineArticleSlug(testInfo);



    await page.goto(`magazine/${slug}`, { waitUntil: "domcontentloaded" });

    await waitForStorefrontNotLoading(page);



    if ((await page.getByRole("main").getByRole("heading", { level: 1 }).count()) === 0) {

      test.skip(true, `magazine article not found: ${slug}`);

    }



    await expectCanonical(page, new RegExp(`/magazine/${slug}`));

    await expectHreflangAlternates(

      page,

      /\/fr\/magazine\//,

      /\/en\/magazine\//,

    );

    expect(page.url()).toContain(`/${locale}/magazine/`);

  });

});

