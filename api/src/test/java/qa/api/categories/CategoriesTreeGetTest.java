package qa.api.categories;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import qa.api.shared.HttpBase;

import static io.restassured.RestAssured.given;

/** GET /api/categories */
class CategoriesTreeGetTest {

  @BeforeEach
  void setup() {
    HttpBase.configureBaseUri();
  }

  @Test
  void tree_returns_200() {
    given()
        .accept(ContentType.JSON)
        .when()
        .get("/api/categories")
        .then()
        .statusCode(200)
        .contentType(ContentType.JSON);
  }
}
