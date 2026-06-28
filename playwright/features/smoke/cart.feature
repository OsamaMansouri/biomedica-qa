@cart @smoke
Feature: Cart drawer smoke
  Scenario: Empty cart sheet from header
    Given I am on the home page
    When I open the cart from the header
    Then the cart drawer shows empty state
    And continue shopping is visible

  Scenario: Empty cart hides checkout CTA
    Given I am on the home page
    When I open the cart from the header
    Then checkout is not available in the cart drawer

  Scenario: Close cart drawer with close button
    Given I open the cart from the header
    When I close the cart drawer with the close button
    Then the cart drawer is closed

  Scenario: Close cart drawer with Escape
    Given I open the cart from the header
    When I press Escape
    Then the cart drawer is closed

  Scenario: Close cart drawer by clicking overlay
    Given I open the cart from the header
    When I click the cart sheet overlay
    Then the cart drawer is closed

  @shop
  Scenario: Continue shopping from empty cart opens shop
    Given I open the cart from the header
    When I click continue shopping
    Then the shop page is displayed

  @header
  Scenario: Header cart badge shows count after add to cart
    Given I add the default product to cart from PDP
    Then the header cart badge shows count 1

  Scenario: Cart drawer shows line qty controls and checkout
    Given I add the default product to cart from PDP
    Then the cart drawer shows quantity controls and checkout

  @header
  Scenario: Header cart badge clears after removing line
    Given I add the default product to cart from PDP
    When I remove the line from the cart drawer
    Then the header cart badge is hidden

  @pdp
  Scenario: Add to cart from PDP opens cart drawer
    Given I open the default product page
    When I click add to cart on the PDP
    Then the cart drawer opens
