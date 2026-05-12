package qa.api.payments;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import qa.api.shared.HttpBase;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;

/** GET /api/payment/cmi/callback — human-readable doc response. */
class CmiCallbackGetTest {

  @BeforeEach
  void setup() {
    HttpBase.configureBaseUri();
  }

  @Test
  void get_returns_200_plain_text() {
    given()
        .when()
        .get("/api/payment/cmi/callback")
        .then()
        .statusCode(200)
        .header("Content-Type", containsString("text/plain"))
        .body(containsString("Endpoint CMI callback"));
  }
}
