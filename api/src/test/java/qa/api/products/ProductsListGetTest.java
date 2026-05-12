package qa.api.products;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import qa.api.shared.HttpBase;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.notNullValue;

/** GET /api/products — list, search, sort. */
class ProductsListGetTest {

  @BeforeEach
  void setup() {
    HttpBase.configureBaseUri();
  }

  @Test
  void list_returns_200() {
    given()
        .accept(ContentType.JSON)
        .when()
        .get("/api/products?per_page=1")
        .then()
        .statusCode(200)
        .contentType(ContentType.JSON)
        .body("data.size()", greaterThanOrEqualTo(0));
  }

  @Test
  void list_with_search_and_sort_returns_200() {
    given()
        .accept(ContentType.JSON)
        .when()
        .get("/api/products?q=test&sort=price-asc&per_page=2")
        .then()
        .statusCode(200)
        .body("data", notNullValue())
        .body("meta", notNullValue());
  }

  @Test
  void list_with_invalid_sort_still_returns_200() {
    given()
        .accept(ContentType.JSON)
        .when()
        .get("/api/products?sort=__invalid_sort__&per_page=1")
        .then()
        .statusCode(200)
        .body("data", notNullValue());
  }
}
