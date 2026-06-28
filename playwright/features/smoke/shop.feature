@shop @smoke
Feature: Shop smoke
  Scenario: Shop listing loads
    Given I am on the shop page
    Then the shop main landmark is visible

  Scenario: Shop grid first product card links to PDP
    Given I am on the shop page
    Then the first shop card links to a product page

  Scenario: Shop filter sheet opens from toolbar
    Given I am on the shop page
    When I open the shop filter sheet
    Then the shop filter sheet browse heading is visible

  @cart
  Scenario: Shop card shows add to cart on hover
    Given I am on the shop page on desktop
    When I hover the first shop card
    Then the shop card add to cart button is visible
