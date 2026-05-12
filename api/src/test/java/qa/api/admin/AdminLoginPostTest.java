package qa.api.admin;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import qa.api.shared.HttpBase;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

/** POST /api/admin/login + GET /api/admin/me (unauthenticated). */
class AdminLoginPostTest {

  @BeforeEach
  void setup() {
    HttpBase.configureBaseUri();
  }

  @Test
  void login_empty_body_returns_422() {
    given()
        .contentType(ContentType.JSON)
        .accept(ContentType.JSON)
        .body("{}")
        .when()
        .post("/api/admin/login")
        .then()
        .statusCode(422)
        .body("errors", notNullValue());
  }

  @Test
  void login_wrong_password_returns_401() {
    given()
        .contentType(ContentType.JSON)
        .accept(ContentType.JSON)
        .body(
            "{\"email\":\"__biomedica_qa_no_such_user__@example.com\",\"password\":\"wrong-password-123\"}")
        .when()
        .post("/api/admin/login")
        .then()
        .statusCode(401)
        .body("message", equalTo("Identifiants invalides"));
  }

  @Test
  void me_without_token_returns_401() {
    given()
        .accept(ContentType.JSON)
        .when()
        .get("/api/admin/me")
        .then()
        .statusCode(401);
  }
}
