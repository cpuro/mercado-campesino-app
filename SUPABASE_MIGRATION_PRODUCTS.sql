-- MIGRACIÓN: Actualizar tabla products para productos agrícolas
-- Ejecuta esto en SQL Editor de Supabase

-- 1. Cambiar columna 'quantity' de INTEGER a TEXT
-- (antes era solo número, ahora será "50 kilos", "30 pollos", etc)
ALTER TABLE public.products
ALTER COLUMN quantity TYPE TEXT;

-- 2. Agregar nuevas columnas
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS quantity_notes TEXT NULL,
ADD COLUMN IF NOT EXISTS availability_frequency TEXT NULL;

-- 3. Agregar índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_products_availability_frequency 
  ON public.products USING btree (availability_frequency);

-- 4. Agregar comentarios para documentación (opcional pero útil)
COMMENT ON COLUMN public.products.quantity IS 'Formato: "50 kilos", "30 pollos", "8 arrobas", etc';
COMMENT ON COLUMN public.products.quantity_notes IS 'Notas descriptivas: "30 pollos/mes", "según cosecha", etc';
COMMENT ON COLUMN public.products.availability_frequency IS 'semanal, quincenal, mensual, segun_cosecha';

-- ✅ Listo! La tabla está actualizada
