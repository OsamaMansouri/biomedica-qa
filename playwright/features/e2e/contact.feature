@contact @e2e
Feature: Contact form submit
  @skip
  Scenario: Guest: submit contact form and see success
    Given I am on the contact page
    When I submit the contact form with valid data
    Then I see the contact success message

  @validation
  Scenario: Guest: invalid email shows inline error on blur
    Given I am on the contact page
    When I enter an invalid email and leave the field
    Then I see the contact email validation error
    And I do not see the contact success message
