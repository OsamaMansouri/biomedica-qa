@i18n @e2e
Feature: Locale switch
  Scenario: Guest: switch locale updates URL and navigation
    Given I am on the home page
    When I switch to the other storefront locale
    Then the URL and navigation reflect the new locale

  @pdp
  Scenario: Guest: locale switch on PDP keeps product slug
    Given I open the default product page
    When I switch to the other storefront locale
    Then the URL still contains the same product slug

  @cart
  Scenario: Guest: cart line survives header locale switch
    Given I add the default product to cart from PDP
    And I close the cart drawer
    When I switch to the other storefront locale
    And I open the cart from the header
    Then the cart still shows one unit of the product
