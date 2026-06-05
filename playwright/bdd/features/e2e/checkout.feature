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

  @checkout-cod
  Scenario: Guest: complete guest COD order from default product
    Given I am on the home page
    When I complete a guest COD order from the default product
    Then I see the order thank-you page with a reference
