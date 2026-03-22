# ProyectoFinal_PrograMovil
### App de Gestión de Visitas para Residencial
**Programación Móvil - React Native + Expo**

---

## 🚀 Instalación

```bash
npm install
```

## ▶️ Correr el proyecto

```bash
npx expo start
```
Luego presiona `a` para abrir en Android Studio.

---

## ⚙️ Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. Abre `src/lib/supabase.ts` y reemplaza:
   - `SUPABASE_URL` con la URL de tu proyecto
   - `SUPABASE_ANON_KEY` con tu clave anon/public

3. Crea la tabla `visits` en Supabase con este SQL:

```sql
create table visits (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  id_number text not null,
  house text not null,
  reason text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- Habilitar Row Level Security (RLS)
alter table visits enable row level security;

-- Permitir acceso a usuarios autenticados
create policy "Authenticated users can manage visits"
  on visits for all
  using (auth.role() = 'authenticated');
```

---

## 📁 Estructura del Proyecto

```
src/
  components/
    CustomButton.tsx      → Botón reutilizable (primary, secondary, danger)
    CustomInput.tsx       → Input reutilizable con label y error
  contexts/
    AuthContext.tsx       → Autenticación con Supabase
    LanguageContext.tsx   → Soporte Español / Inglés
  lib/
    supabase.ts           → Cliente de Supabase
  navigation/
    StackNavigator.tsx    → Navegación principal + protección de rutas
    TabsNavigator.tsx     → Tabs: Inicio, Visitantes, Historial, Perfil
  screens/
    LoginScreen.tsx       → Inicio de sesión
    RegisterScreen.tsx    → Crear cuenta
    HomeScreen.tsx        → Dashboard con estadísticas
    VisitorsScreen.tsx    → Lista de visitantes
    HistoryScreen.tsx     → Historial de visitas
    ProfileScreen.tsx     → Perfil + cambio de idioma + cerrar sesión
    RegisterVisitScreen.tsx → Registrar visita + generar QR
    ScanQRScreen.tsx      → Escanear QR con cámara
    VisitDetailScreen.tsx → Detalle de visita + ver QR
```

---

## 📦 Dependencias principales

| Paquete | Uso |
|---|---|
| `@supabase/supabase-js` | Base de datos + Auth |
| `expo-camera` | Cámara para escanear QR |
| `react-native-qrcode-svg` | Generar códigos QR |
| `@react-navigation/native` | Navegación |
| `i18n-js` | Internacionalización |
