package qa.api.products;

import io.restassured.http.ContentType;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import qa.api.shared.HttpBase;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;

/** GET /api/products/{slug} — 404 vs detail. */
class ProductBySlugGetTest {

  @BeforeEach
  void setup() {
    HttpBase.configureBaseUri();
  }

  @Test
  void unknown_slug_returns_404() {
    given()
        .accept(ContentType.JSON)
        .when()
        .get("/api/products/__biomedica_qa_nonexistent_slug__")
        .then()
        .statusCode(404);
  }

  @Test
  void detail_returns_200_when_catalog_has_product() {
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
    Object slugObj = data.get(0).get("slug");
    Assumptions.assumeTrue(slugObj != null, "skip when slug missing");
    String slug = slugObj.toString();

    given()
        .accept(ContentType.JSON)
        .when()
        .get("/api/products/" + slug)
        .then()
        .statusCode(200)
        .body("data.slug", equalTo(slug))
        .body("data.id", greaterThanOrEqualTo(1));
  }
}
