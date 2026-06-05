@pdp @e2e
Feature: PDP
  Scenario: Guest: out-of-stock PDP disables add to cart
    Given I open an out-of-stock product page
    Then add to cart is disabled and inventory shows out of stock

  Scenario: Guest: unknown product slug returns not-found page
    Given I open a product page that does not exist
    Then I see the product not-found page

  Scenario: Guest: cross-sell excludes current product and opens another PDP
    Given I open the default product page
    Then the cross-sell section shows related product cards
    When I open the first cross-sell product link
    Then I am on a different product page

  @mobile
  Scenario: Guest: sticky bar adds product to cart on mobile
    Given I open the default product page on mobile
    When I tap the sticky add to cart bar
    Then the cart shows one unit of the product
