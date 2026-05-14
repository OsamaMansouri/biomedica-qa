package qa.api.shared;

import io.restassured.RestAssured;

public final class HttpBase {

  /** Only used when no env URL is set (typical local `php artisan serve`). */
  private static final String DEFAULT_LOCAL_LARAVEL_BASE = "http://localhost:8000";

  private HttpBase() {}

  /**
   * CI can pass {@code -Dqa.api.baseUrl=...} so Surefire always hits the intended host even if forked
   * JVMs mishandle inherited environment variables.
   */
  public static void configureBaseUri() {
    String base =
        firstNonBlank(
            System.getProperty("qa.api.baseUrl"),
            System.getenv("API_BASE_URL"),
            System.getenv("PLAYWRIGHT_API_BASE_URL"),
            DEFAULT_LOCAL_LARAVEL_BASE);
    RestAssured.baseURI = base.replaceAll("/+$", "");
  }

  private static String firstNonBlank(String... values) {
    for (String v : values) {
      if (v != null && !v.isBlank()) return v.trim();
    }
    return "";
  }
}
