@checkout @smoke
Feature: Checkout empty smoke
  Scenario: Checkout page shows empty cart message
    Given I open the checkout page with an empty cart
    Then the checkout page shows empty cart guidance

  @promo
  Scenario: Checkout with cart shows promo field and apply control
    Given I have a product in checkout
    Then the promo code field and apply button are visible
    And the apply promo control is clickable
