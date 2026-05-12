package qa.api.contact;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import qa.api.shared.HttpBase;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.notNullValue;

/** POST /api/contact — bad payloads only. */
class ContactPostValidationTest {

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
        .post("/api/contact")
        .then()
        .statusCode(422)
        .body("errors", notNullValue());
  }

  @Test
  void invalid_email_returns_422() {
    given()
        .contentType(ContentType.JSON)
        .accept(ContentType.JSON)
        .body(
            "{\"name\":\"QA\",\"email\":\"not-a-valid-email\",\"body\":\"Hello from REST Assured\"}")
        .when()
        .post("/api/contact")
        .then()
        .statusCode(422)
        .body("errors", notNullValue());
  }
}
