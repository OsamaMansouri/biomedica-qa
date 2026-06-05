@home @smoke
Feature: Home smoke
  Scenario: Locale in URL and main landmark
    Given I am on the home page
    Then the URL contains the project locale
    And the main landmark is visible
