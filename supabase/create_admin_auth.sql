-- ============================================================================
-- Crear usuario de Auth para admin de prueba
-- ============================================================================
-- Ejecuta este archivo en el SQL Editor de Supabase.
-- No crea ni modifica otras tablas.
-- Solo intenta crear este usuario de Auth si no existe todavía.
--
-- Credenciales de prueba:
--   Email:    admin.prueba@mercado-campesino.test
--   Password: AdminPrueba123!
--
-- Si luego quieres sincronizar el perfil en public.users, usa el seed
-- existente en supabase/seed.sql o crea el registro manualmente.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_email text := 'admin.prueba@mercado-campesino.test';
  v_password text := 'AdminPrueba123!';
  v_user_id uuid;
BEGIN
  SELECT id
  INTO v_user_id
  FROM auth.users
  WHERE email = v_email
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    RAISE NOTICE 'El usuario % ya existe en auth.users. No se hicieron cambios.', v_email;
  ELSE
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'role', 'admin',
        'full_name', 'Administrador de prueba',
        'email', v_email
      ),
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      v_user_id,
      v_user_id::text,
      jsonb_build_object(
        'sub', v_user_id::text,
        'email', v_email
      ),
      'email',
      now(),
      now(),
      now()
    );

    RAISE NOTICE 'Usuario admin de prueba creado: %', v_email;
  END IF;
END;
$$;
