@smoke
Feature: Static pages smoke
  Scenario: FAQ hero and main
    Given I open the FAQ page
    Then the FAQ hero title is visible

  Scenario: FAQ accordion expands first question
    Given I open the FAQ page
    When I expand the first FAQ question
    Then the first FAQ question is expanded

  Scenario: Coup de coeur hero
    Given I open the coup de coeur page
    Then the coup de coeur hero title is visible

  @shop
  Scenario: Coup de coeur lists product cards when catalog has picks
    Given I open the coup de coeur page
    Then coup de coeur product cards are visible when configured

  Scenario: Privacy policy hero
    Given I open the privacy policy page
    Then the privacy policy hero title is visible
