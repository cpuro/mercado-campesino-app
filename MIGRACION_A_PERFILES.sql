-- ============================================================================
-- MIGRACIÓN: Convertir estructura antigua a arquitectura empresarial
-- ============================================================================
-- Ejecuta esto DESPUÉS de ejecutar SUPABASE_SETUP_v2.sql
-- Este script migra datos existentes a la nueva estructura

-- ============================================================================
-- PASO 1: Migrar usuarios existentes (si no existen)
-- ============================================================================

-- Insertar usuarios de la tabla anterior (si tienes datos)
-- Ajusta la consulta según tu estructura actual
INSERT INTO users (id, email, role, full_name, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(
    (raw_user_meta_data->>'role')::text,
    'buyer'
  ) as role,
  COALESCE(
    first_name || ' ' || last_name,
    email
  ) as full_name,
  created_at,
  updated_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PASO 2: Crear perfiles de productores
-- ============================================================================

INSERT INTO producer_profiles (user_id, business_name, description, specialty)
SELECT 
  u.id,
  COALESCE(
    (u.raw_user_meta_data->>'business_name')::text,
    u.email
  ) as business_name,
  (u.raw_user_meta_data->>'description')::text,
  (u.raw_user_meta_data->>'specialty')::text
FROM auth.users u
WHERE u.raw_user_meta_data->>'role' = 'producer'
  AND u.id NOT IN (SELECT user_id FROM producer_profiles)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- PASO 3: Crear perfiles de compradores
-- ============================================================================

INSERT INTO buyer_profiles (user_id)
SELECT u.id
FROM auth.users u
WHERE COALESCE(u.raw_user_meta_data->>'role', 'buyer') = 'buyer'
  AND u.id NOT IN (SELECT user_id FROM buyer_profiles)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Verificar usuarios
SELECT 'Users creados:' as info, COUNT(*) as total FROM users;

-- Verificar perfiles de productores
SELECT 'Producer Profiles creados:' as info, COUNT(*) as total FROM producer_profiles;

-- Verificar perfiles de compradores
SELECT 'Buyer Profiles creados:' as info, COUNT(*) as total FROM buyer_profiles;

-- Mostrar resumen
SELECT 
  'Resumen por rol' as info,
  role,
  COUNT(*) as total
FROM users
GROUP BY role;
