@checkout @e2e
Feature: Checkout
  Scenario: Guest: checkout lists shipping methods after address quote
    Given I have a product in checkout
    Then shipping method options are listed

  Scenario: Guest: checkout can select alternate shipping method
    Given I have a product in checkout
    When I select the second shipping method
    Then the second shipping method is checked

  @validation
  Scenario: Guest: checkout blocks submit when required fields are empty
    Given I have a product in checkout
    When I submit checkout without filling required fields
    Then checkout remains on the form with email required error

  @validation
  Scenario: Guest: invalid checkout email shows inline error on blur
    Given I have a product in checkout
    When I enter an invalid checkout email and leave the field
    Then I see the checkout email validation error
    And checkout does not reach thank you

  @validation
  Scenario: Guest: invalid checkout phone shows inline error on blur
    Given I have a product in checkout
    When I enter an invalid checkout phone and leave the field
    Then I see the checkout phone validation error
    And checkout does not reach thank you

  @checkout-cod @skip
  Scenario: Guest: complete guest COD order from default product
    Given I am on the home page
    When I complete a guest COD order from the default product
    Then I see the order thank-you page with a reference

  @promo
  Scenario: Guest: valid promo reduces checkout total
    Given I have a product in checkout
    When I apply a valid promo code
    Then the checkout total is lower than before promo

  @promo @validation
  Scenario: Guest: invalid promo shows error and total unchanged
    Given I have a product in checkout
    When I apply an invalid promo code
    Then I see the promo validation error
    And the checkout total is unchanged

  @promo
  Scenario: Guest: remove promo restores checkout total
    Given I have a product in checkout with a valid promo applied
    When I remove the applied promo
    Then the checkout total matches the pre-promo total

  @promo @checkout-cod @skip
  Scenario: Guest: COD order with promo reaches thank-you
    Given I have a product in checkout with a valid promo applied
    When I complete guest checkout with pay on delivery
    Then I see the order thank-you page with a reference

  Scenario: Guest: thank-you without reference shows no-order state
    Given I open the thank-you page without an order reference
    Then I see the no-order thank-you state
    And the order confirmation title is not shown
