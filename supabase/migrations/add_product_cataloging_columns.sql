-- ============================================================
-- Migración: Columnas adicionales para catalogación de productos
-- Pegar en el SQL Editor de Supabase y ejecutar
-- ============================================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sku                TEXT,
  ADD COLUMN IF NOT EXISTS occasion           TEXT,       -- casual, formal, deportivo, playa, trabajo...
  ADD COLUMN IF NOT EXISTS season             TEXT,       -- verano, invierno, primavera, otoño, todo el año
  ADD COLUMN IF NOT EXISTS collection         TEXT,       -- nombre de la colección/línea
  ADD COLUMN IF NOT EXISTS care_instructions  TEXT,       -- instrucciones de lavado/cuidado
  ADD COLUMN IF NOT EXISTS country_of_origin  TEXT,       -- país de fabricación
  ADD COLUMN IF NOT EXISTS is_sustainable     BOOLEAN DEFAULT FALSE,  -- producto eco/sostenible
  ADD COLUMN IF NOT EXISTS features           TEXT[],     -- ['impermeable','transpirable','reflectante'...]
  ADD COLUMN IF NOT EXISTS collab             TEXT,       -- colaboración especial (ej. 'Nike x Off-White')
  ADD COLUMN IF NOT EXISTS rating             DECIMAL(3,1), -- calificación promedio (ej. 4.5)
  ADD COLUMN IF NOT EXISTS review_count       INTEGER DEFAULT 0,      -- número de reseñas
  ADD COLUMN IF NOT EXISTS additional_images  TEXT[];     -- URLs de imágenes adicionales del producto

-- Índices para filtros de catalogación
CREATE INDEX IF NOT EXISTS idx_products_sku          ON products(sku)                   WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_occasion     ON products(occasion)              WHERE available = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_season       ON products(season)                WHERE available = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_collab       ON products(collab)                WHERE collab IS NOT NULL AND available = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_sustainable  ON products(is_sustainable)        WHERE is_sustainable = TRUE AND available = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_rating       ON products(rating DESC NULLS LAST) WHERE available = TRUE;

-- Comentarios en las columnas para documentar la tabla
COMMENT ON COLUMN products.sku               IS 'Código único del producto (SKU del proveedor)';
COMMENT ON COLUMN products.occasion          IS 'Ocasión de uso: casual, formal, deportivo, playa, trabajo, fiesta';
COMMENT ON COLUMN products.season            IS 'Temporada: verano, invierno, primavera, otoño, todo el año';
COMMENT ON COLUMN products.collection        IS 'Nombre de la colección o línea del producto';
COMMENT ON COLUMN products.care_instructions IS 'Instrucciones de lavado y cuidado';
COMMENT ON COLUMN products.country_of_origin IS 'País de fabricación/origen';
COMMENT ON COLUMN products.is_sustainable    IS 'TRUE si el producto usa materiales reciclados o prácticas sostenibles';
COMMENT ON COLUMN products.features          IS 'Array de características: impermeable, transpirable, UV, reflectante, etc.';
COMMENT ON COLUMN products.collab            IS 'Colaboración especial, ej: Nike x Off-White, Adidas x Gucci';
COMMENT ON COLUMN products.rating            IS 'Calificación promedio de reseñas (0.0 - 5.0)';
COMMENT ON COLUMN products.review_count      IS 'Número total de reseñas del producto';
COMMENT ON COLUMN products.additional_images IS 'URLs adicionales de fotos del producto (frente, espalda, detalle...)';
