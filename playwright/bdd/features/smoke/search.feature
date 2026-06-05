@search @smoke
Feature: Search sheet smoke
  Scenario: Search opens sheet with input
    Given I am on the home page on desktop
    When I open search from the header
    Then the search sheet shows the search input

  Scenario: Search sheet closes with close button
    Given I open search from the header on desktop
    When I close the search sheet with the close button
    Then the search sheet is closed

  Scenario: Search sheet closes with Escape
    Given I open search from the header on desktop
    When I press Escape
    Then the search sheet is closed
