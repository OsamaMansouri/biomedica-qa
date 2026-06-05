@seo @e2e
Feature: SEO meta tags
  @pdp
  Scenario: Guest: PDP exposes canonical and hreflang alternates
    Given I open the default product page
    Then the PDP has canonical and hreflang meta tags

  @magazine
  Scenario: Guest: magazine article exposes canonical and hreflang alternates
    Given I open the smoke magazine article page
    Then the magazine article has canonical and hreflang meta tags
