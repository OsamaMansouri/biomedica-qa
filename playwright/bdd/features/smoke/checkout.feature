@checkout @smoke
Feature: Checkout empty smoke
  Scenario: Checkout page shows empty cart message
    Given I open the checkout page with an empty cart
    Then the checkout page shows empty cart guidance
