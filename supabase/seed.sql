-- ============================================================================
-- Seed seguro para admin de prueba
-- ============================================================================
-- Este seed no crea tablas ni borra registros existentes.
-- Solo marca como admin a un usuario que ya exista en Auth y asegura
-- que su perfil en public.users quede sincronizado con role = 'admin'.
--
-- Flujo recomendado:
--   1. Crear el usuario en Supabase Auth con este email:
--      admin.prueba@mercado-campesino.test
--   2. Ejecutar este seed para dejar el perfil en public.users.
--
-- Credenciales sugeridas para prueba:
--   Email:    admin.prueba@mercado-campesino.test
--   Password: AdminPrueba123!
-- ============================================================================

DO $$
DECLARE
  v_email text := 'admin.prueba@mercado-campesino.test';
  v_user_id uuid;
BEGIN
  SELECT id
  INTO v_user_id
  FROM auth.users
  WHERE email = v_email
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION
      'No existe un usuario en auth.users con email %. Crea primero la cuenta en Supabase Auth y vuelve a ejecutar este seed.',
      v_email;
  END IF;

  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    phone,
    role,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_email,
    'Administrador',
    'Prueba',
    NULL,
    'admin',
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = EXCLUDED.updated_at;
END;
$$;

