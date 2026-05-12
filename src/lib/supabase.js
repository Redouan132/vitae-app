// =============================================
// lib/supabase.js — Cliente de Supabase
// =============================================
//
// CONFIGURACIÓN (2 pasos):
//   1. Ve a https://supabase.com y crea un proyecto gratis
//   2. En tu proyecto: Settings → API
//      Copia "Project URL" y "anon public key"
//      y pégalos aquí abajo
//
// Después en Supabase Dashboard:
//   - Authentication → Providers → Email: activado (ya viene por defecto)
//   - Authentication → Email Templates: personaliza los emails si quieres
//   - SQL Editor → ejecuta el script de abajo para crear la tabla de usuarios
//
// ──────────────────────────────────────────────
// SQL para crear la tabla de perfiles de usuario
// (ejecutar en Supabase → SQL Editor):
// ──────────────────────────────────────────────
//
//  create table public.profiles (
//    id          uuid references auth.users on delete cascade primary key,
//    name        text,
//    goal_kcal   integer default 1980,
//    goal_prot   integer default 150,
//    goal_carbs  integer default 200,
//    goal_fat    integer default 65,
//    created_at  timestamptz default now()
//  );
//
//  -- Política de seguridad: cada usuario solo ve sus propios datos
//  alter table public.profiles enable row level security;
//  create policy "Usuarios solo ven su perfil"
//    on public.profiles for all using (auth.uid() = id);
//
//  -- Crear perfil automáticamente al registrarse
//  create or replace function public.handle_new_user()
//  returns trigger as $$
//  begin
//    insert into public.profiles (id, name)
//    values (new.id, new.raw_user_meta_data->>'name');
//    return new;
//  end;
//  $$ language plpgsql security definer;
//
//  create trigger on_auth_user_created
//    after insert on auth.users
//    for each row execute procedure public.handle_new_user();
//
// =============================================

import { createClient } from '@supabase/supabase-js'

// 🔑 CAMBIA ESTOS DOS VALORES por los de tu proyecto de Supabase
const SUPABASE_URL  = 'https://TU_PROYECTO.supabase.co'
const SUPABASE_ANON = 'TU_ANON_PUBLIC_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
