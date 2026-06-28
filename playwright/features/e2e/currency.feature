@shop @e2e
Feature: Currency switch
  Scenario: Guest: switch currency updates header and first product card
    Given I am on the shop page
    When I switch to the next currency in the header
    Then the header currency and first product card format update

  @cart
  Scenario: Guest: cart line unit price updates when currency changes
    Given I add the default product to cart from PDP
    And I close the cart drawer
    When I switch to the next currency in the header
    And I open the cart from the header
    Then the cart line unit price text changes
