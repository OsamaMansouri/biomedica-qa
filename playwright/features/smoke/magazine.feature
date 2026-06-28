@magazine @smoke
Feature: Magazine smoke
  Scenario: Magazine listing loads
    Given I open the magazine listing page
    Then the magazine listing title is visible

  Scenario: Magazine listing first article card is clickable
    Given I open the magazine listing page
    Then the first article card links to an article

  Scenario: Magazine article loads
    Given I open the smoke magazine article page
    Then the magazine article title is visible

  Scenario: Magazine section hub loads
    Given I open the smoke magazine section hub page
    Then the magazine section title is visible

  Scenario: Magazine topics index loads
    Given I open the magazine topics page
    Then the magazine topics title is visible
