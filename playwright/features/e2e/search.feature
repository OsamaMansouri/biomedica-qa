@search @e2e
Feature: Search
  Scenario: Guest: nonsense query shows empty state
    Given I am on the home page
    When I search for a nonsense query with no matches
    Then the search sheet shows no results message

  Scenario: Guest: search first result and add to cart
    Given I am on the home page
    When I search open first result and add to cart
    Then the cart drawer opens with checkout available
