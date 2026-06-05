@magazine @e2e
Feature: Magazine product funnel
  Scenario: Guest: article product CTA opens PDP and adds to cart
    Given I open the magazine article with a product link
    When I follow the product link and add to cart
    Then the cart drawer opens with checkout available
