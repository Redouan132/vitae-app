# 🌿 Vitae — App de bienestar premium (v2)

App de nutrición y fitness con **login/registro**, **búsqueda real de alimentos** (Open Food Facts) y suscripción mensual de 10 €.

---

## 🚀 Puesta en marcha rápida

```bash
npm install
npm run dev
# Abre http://localhost:5173
```

---

## 🔑 Paso 1 — Configurar Supabase (login/registro)

1. Ve a **https://supabase.com** → "New project" (gratis)
2. En tu proyecto: **Settings → API**
3. Copia **Project URL** y **anon public key**
4. Pégalos en `src/lib/supabase.js`:
   ```js
   const SUPABASE_URL  = 'https://XXXXXXXX.supabase.co'
   const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   ```
5. En Supabase Dashboard → **SQL Editor** → ejecuta este SQL para crear los perfiles:

```sql
create table public.profiles (
  id         uuid references auth.users on delete cascade primary key,
  name       text,
  goal_kcal  integer default 1980,
  goal_prot  integer default 150,
  goal_carbs integer default 200,
  goal_fat   integer default 65,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Solo tu perfil" on public.profiles for all using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

✅ Listo. Los usuarios ya pueden registrarse y loguearse.

---

## 🥗 Paso 2 — Open Food Facts (ya funciona, sin configurar)

Open Food Facts es gratis y no necesita API key. La integración ya está lista en `src/lib/foodApi.js`. Solo necesitas tener conexión a internet.

Cuando un usuario con suscripción activa pulse "+ Añadir" en Nutrición, verá el buscador con:
- Resultados en tiempo real de +3M alimentos
- Ajuste de gramos con cálculo automático de macros
- Imagen del producto
- Atribución correcta a Open Food Facts (obligatoria por su licencia ODbL)

---

## 💳 Paso 3 — Stripe (próximamente)

El botón de suscripción está listo para conectar. Busca el comentario `// TODO: conectar Stripe aquí` en `src/App.jsx`.

---

## 🗂 Estructura del proyecto

```
vitae-app/
├── src/
│   ├── lib/
│   │   ├── supabase.js       ← Cliente Supabase (pon tus credenciales aquí)
│   │   └── foodApi.js        ← Open Food Facts (sin configuración)
│   ├── hooks/
│   │   └── useAuth.js        ← Hook de autenticación
│   ├── components/
│   │   ├── Nav.jsx           ← Navbar con avatar y logout
│   │   ├── FoodSearch.jsx    ← Buscador de alimentos
│   │   ├── SubscriptionModal.jsx
│   │   └── Toast.jsx
│   └── views/
│       ├── Auth.jsx          ← Login, Registro, Recuperar contraseña
│       ├── Home.jsx
│       ├── Nutrition.jsx     ← Con buscador Open Food Facts integrado
│       ├── Workout.jsx
│       └── Progress.jsx
```

---

## 📦 Build para producción

```bash
npm run build
# Archivos listos para deploy en /dist
```

Despliega en **Vercel** (gratis): conecta tu repo de GitHub y Vercel lo detecta automáticamente.
