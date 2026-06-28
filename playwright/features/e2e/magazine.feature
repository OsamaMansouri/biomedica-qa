@magazine @e2e
Feature: Magazine product funnel
  Scenario: Guest: article product CTA opens PDP and adds to cart
    Given I open the magazine article with a product link
    When I follow the product link and add to cart
    Then the cart drawer opens with checkout available

  Scenario: Guest: unknown magazine article slug shows not-found page
    Given I open a magazine article page that does not exist
    Then I see the magazine not-found page
