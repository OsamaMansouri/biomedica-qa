package qa.api.shared;

import io.restassured.RestAssured;

public final class HttpBase {

  /** Only used when no env URL is set (typical local `php artisan serve`). */
  private static final String DEFAULT_LOCAL_LARAVEL_BASE = "http://localhost:8000";

  private HttpBase() {}

  // Env first; last value is local-only fallback when unset.
  public static void configureBaseUri() {
    String base =
        firstNonBlank(
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
