-- One-time: Playwright OOS fixture for smoke/e2e (slug: test-product-out-of-stock).
-- Run on the production API database (Laravel). Safe to re-run: skips if slug exists.

SET @slug = 'test-product-out-of-stock';

SELECT id INTO @existing FROM products WHERE slug = @slug LIMIT 1;

INSERT INTO products (
  id,
  name,
  slug,
  excerpt,
  description,
  status,
  storefront_featured,
  price,
  regular_price,
  sale_price,
  currency,
  stock_quantity,
  created_at,
  updated_at
)
SELECT
  (SELECT COALESCE(MAX(id), 0) + 1 FROM products p),
  'Produit test QA (rupture)',
  @slug,
  'Fixture Playwright — non vendu.',
  '<p>Produit de test automatisé. Toujours en rupture de stock.</p>',
  'publish',
  0,
  99.00,
  99.00,
  NULL,
  'MAD',
  0,
  NOW(),
  NOW()
FROM DUAL
WHERE @existing IS NULL;

SELECT id INTO @pid FROM products WHERE slug = @slug LIMIT 1;

UPDATE products
SET stock_quantity = 0, status = 'publish', updated_at = NOW()
WHERE id = @pid;

INSERT INTO product_translations (product_id, locale, name, excerpt, description, created_at, updated_at)
SELECT @pid, 'fr', 'Produit test QA (rupture)', 'Fixture Playwright — non vendu.', '<p>Produit de test automatisé. Toujours en rupture de stock.</p>', NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM product_translations WHERE product_id = @pid AND locale = 'fr');

INSERT INTO product_translations (product_id, locale, name, excerpt, description, created_at, updated_at)
SELECT @pid, 'en', 'QA test product (out of stock)', 'Playwright fixture — not for sale.', '<p>Automated test product. Always out of stock.</p>', NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM product_translations WHERE product_id = @pid AND locale = 'en');

-- Verify:
-- curl -s https://api.biomedica.ma/api/products/test-product-out-of-stock | jq '.data.stock_quantity,.data.in_stock'
