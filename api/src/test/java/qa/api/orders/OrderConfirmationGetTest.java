package qa.api.orders;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import qa.api.shared.HttpBase;

import static io.restassured.RestAssured.given;

/** GET /api/order-confirmation/{reference} */
class OrderConfirmationGetTest {

  @BeforeEach
  void setup() {
    HttpBase.configureBaseUri();
  }

  @Test
  void unknown_reference_returns_404() {
    given()
        .accept(ContentType.JSON)
        .when()
        .get("/api/order-confirmation/REF-NONEXISTENT-QA-999999")
        .then()
        .statusCode(404);
  }
}
