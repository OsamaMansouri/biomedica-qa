package qa.api.brand;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import qa.api.shared.HttpBase;

import static io.restassured.RestAssured.given;

/** GET /api/brand */
class BrandGetTest {

  @BeforeEach
  void setup() {
    HttpBase.configureBaseUri();
  }

  @Test
  void brand_returns_200() {
    given()
        .accept(ContentType.JSON)
        .when()
        .get("/api/brand")
        .then()
        .statusCode(200)
        .contentType(ContentType.JSON);
  }
}
