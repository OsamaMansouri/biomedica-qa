@cart @e2e
Feature: Cart
  Scenario: Guest: change quantity and remove line leaves empty cart
    Given I open the default product page
    When I add to cart increase decrease and remove the line
    Then the cart shows empty state

  Scenario: Guest: cart lines survive a full page reload
    Given I add the default product to cart from PDP
    When I reload the page and open the cart
    Then the cart still shows one unit of the product
