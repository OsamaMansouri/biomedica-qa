@shop @e2e
Feature: Shop
  Scenario: Guest: shop category bain loads filtered grid
    Given I open the shop page with Bain category filter
    Then the shop grid is visible with Bain category active

  @cart
  Scenario: Guest: shop card add to cart opens cart drawer
    Given I am on the shop page
    When I hover the first shop card and click add to cart
    Then the cart drawer opens with checkout available

  Scenario: Guest: Bain filter to first product to cart
    Given I am on the shop page
    When I filter by Bain open first product and add to cart
    Then the cart drawer opens with checkout available

  Scenario: Guest: page 2 keeps sort in URL and reloads product grid
    Given the shop catalog has at least 2 pages
    When I go to shop page 2 with price ascending sort
    Then the URL keeps sort and page params and the grid changes

  Scenario: Guest: Bain category filter and price ascending keep URL params
    Given I am on the shop page
    When I filter shop by Bain category and sort price ascending
    Then the URL has category and sort params with ascending prices

  Scenario: Guest: sort price ascending orders product cards
    Given I am on the shop page
    When I sort by price ascending
    Then product prices on the grid are ascending

  Scenario: Guest: sort price descending orders product cards
    Given I am on the shop page
    When I sort by price descending
    Then product prices on the grid are descending

  Scenario: Guest: browser back restores shop sort query
    Given I open the shop page with price descending sort
    When I navigate to home from the header
    And I go back in the browser
    Then the shop URL still has price descending sort
