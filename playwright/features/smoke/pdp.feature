@pdp @smoke
Feature: PDP smoke
  Scenario: Default product PDP shows add to cart
    Given I open the default product page
    Then add to cart is visible and enabled on the PDP

  Scenario: PDP shows title price and gallery image
    Given I open the default product page
    Then the PDP shows title price and gallery image

  Scenario: PDP breadcrumb links home and shop
    Given I open the default product page
    Then the PDP breadcrumb links home and shop

  Scenario: PDP reviews link opens reviews section
    Given I open the default product page
    When I click see reviews on the PDP
    Then the reviews section is visible

  Scenario: Out-of-stock fixture PDP disables add to cart
    Given I open an out-of-stock product page
    Then add to cart is disabled and inventory shows out of stock
