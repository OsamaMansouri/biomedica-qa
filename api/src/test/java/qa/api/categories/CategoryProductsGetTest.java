package qa.api.categories;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import qa.api.shared.HttpBase;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

/** GET /api/categories/{slug}/products */
class CategoryProductsGetTest {

  @BeforeEach
  void setup() {
    HttpBase.configureBaseUri();
  }

  @Test
  void others_returns_200() {
    given()
        .accept(ContentType.JSON)
        .when()
        .get("/api/categories/others/products?per_page=1")
        .then()
        .statusCode(200)
        .body("category.slug", equalTo("others"))
        .body("data", notNullValue())
        .body("meta", notNullValue());
  }

  @Test
  void unknown_category_returns_404() {
    given()
        .accept(ContentType.JSON)
        .when()
        .get("/api/categories/__biomedica_qa_unknown_category__/products?per_page=1")
        .then()
        .statusCode(404);
  }
}
