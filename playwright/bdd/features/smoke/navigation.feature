@header @smoke
Feature: Navigation smoke
  Scenario: Primary nav shows home products and cart
    Given I am on the home page on desktop
    Then the primary navigation shows home products and cart

  Scenario: Locale and currency switchers are visible
    Given I am on the home page on desktop
    Then the locale switcher is visible
    And the currency switcher is visible

  @mobile
  Scenario: Mobile menu opens shop from Produits submenu
    Given I am on the home page on mobile
    When I open the mobile menu and choose shop from Produits
    Then the shop page is displayed
