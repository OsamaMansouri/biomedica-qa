package qa.api.shipping;

import io.restassured.http.ContentType;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import qa.api.shared.HttpBase;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.notNullValue;

/** POST /api/shipping/quote */
class ShippingQuotePostTest {

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
        .post("/api/shipping/quote")
        .then()
        .statusCode(422)
        .body("errors", notNullValue());
  }

  @Test
  void valid_lines_returns_200_when_product_exists() {
    List<Map<String, Object>> data =
        given()
            .accept(ContentType.JSON)
            .when()
            .get("/api/products?per_page=1")
            .then()
            .statusCode(200)
            .extract()
            .jsonPath()
            .getList("data");

    Assumptions.assumeTrue(data != null && !data.isEmpty(), "skip when catalog empty");
    Object idObj = data.get(0).get("id");
    Assumptions.assumeTrue(idObj != null, "skip when product id missing");
    int productId = ((Number) idObj).intValue();

    String body = "{\"lines\":[{\"product_id\":" + productId + ",\"qty\":1}]}";

    given()
        .contentType(ContentType.JSON)
        .accept(ContentType.JSON)
        .body(body)
        .when()
        .post("/api/shipping/quote")
        .then()
        .statusCode(200)
        .body("data", notNullValue())
        .body("data.methods.size()", greaterThanOrEqualTo(0));
  }
}
