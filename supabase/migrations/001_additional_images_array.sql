-- Migración: asegurar que additional_images es de tipo text[]
-- Ejecutar en Supabase SQL Editor si la columna aún es tipo text

DO $$
BEGIN
  -- Si la columna existe como text simple, convertirla a text[]
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products'
      AND column_name = 'additional_images'
      AND data_type = 'text'
  ) THEN
    ALTER TABLE products
      ALTER COLUMN additional_images TYPE text[]
      USING CASE
        WHEN additional_images IS NULL THEN NULL
        ELSE string_to_array(additional_images, ',')
      END;
    RAISE NOTICE 'additional_images convertida a text[]';
  END IF;

  -- Si la columna no existe, crearla
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products'
      AND column_name = 'additional_images'
  ) THEN
    ALTER TABLE products ADD COLUMN additional_images text[];
    RAISE NOTICE 'additional_images creada como text[]';
  END IF;
END $$;

-- Índice GIN para búsquedas eficientes en arrays
CREATE INDEX IF NOT EXISTS idx_products_additional_images
  ON products USING gin(additional_images);

-- Comentario de columna para documentación
COMMENT ON COLUMN products.additional_images IS
  'URLs adicionales de imágenes del producto. Índice 0 = imagen principal (image). Máximo recomendado: 8 imágenes.';
