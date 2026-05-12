package qa.api.checkout;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import qa.api.shared.HttpBase;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.notNullValue;

/** POST /api/checkout — bad payloads only. */
class CheckoutPostValidationTest {

  @BeforeEach
  void setup() {
    HttpBase.configureBaseUri();
  }

  @Test
  void empty_body_returns_422() {
    given()
        .contentType(ContentType.JSON)
        .accept(ContentType.JSON)
        .body("{}")
        .when()
        .post("/api/checkout")
        .then()
        .statusCode(422)
        .body("errors", notNullValue());
  }

  @Test
  void missing_lines_returns_422() {
    given()
        .contentType(ContentType.JSON)
        .accept(ContentType.JSON)
        .body(
            "{\"customer\":{\"first_name\":\"A\",\"last_name\":\"B\",\"email\":\"qa@example.com\"}}")
        .when()
        .post("/api/checkout")
        .then()
        .statusCode(422)
        .body("errors", notNullValue());
  }
}
