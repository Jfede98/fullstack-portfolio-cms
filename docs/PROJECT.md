# 📋 PROJECT MASTER DOCUMENT

> **Propósito**: Este documento es la fuente de verdad del proyecto. Si abres un nuevo chat con un AI assistant, mándale a leer este archivo para tener contexto completo.

---

## 🎯 Qué es este proyecto

Un **portfolio personal fullstack** construido como monorepo NX. El propio sitio web del portfolio se administra con Strapi (headless CMS), se renderiza con Next.js, y tiene una librería de componentes reutilizables con Storybook.

**Origen**: Migrado de un proyecto empresarial de telecomunicaciones. Se mantiene toda la arquitectura y funcionalidades, reemplazando contenido específico por contenido genérico/personal.

---

## 🏗️ Arquitectura

```
apps/
├── frontend/          → Next.js 16 (App Router) — el sitio web
├── backend/           → Strapi 5.31 (Headless CMS) — administra contenido
libs/
├── shared-ui/         → Component library + Storybook 10 (~40+ componentes)
├── aws/               → AWS CDK infrastructure (opcional, para deploy en AWS)
├── strapiBackups/     → Plugin Strapi: backups de base de datos
├── strapiRevalidate/  → Plugin Strapi: revalidación de cache Next.js
└── strapiSync/        → Plugin Strapi: sincronización entre ambientes
```

**Flujo de datos**:
```
Usuario → Next.js (frontend) → Strapi API (backend) → PostgreSQL
                ↓
         shared-ui (componentes)
```

---

## 🛠️ Tech Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | Next.js (App Router) | 16.0.7 |
| Backend/CMS | Strapi | 5.31.3 |
| UI Library | Storybook | 10.1 |
| Monorepo | NX | 22.1.3 |
| Estilos | Tailwind CSS | 4.x |
| Testing | Jest + Vitest + Playwright | latest |
| Package Manager | Bun | 1.2.18 |
| Database | PostgreSQL (prod) / SQLite (dev opcional) | 17 |
| Language | TypeScript | 5.9 |

---

## 💻 Cómo levantar en local

### Prerrequisitos
- Node.js >= 20
- Bun (`curl -fsSL https://bun.sh/install | bash`)
- PostgreSQL local o Docker

### Pasos

```bash
# 1. Clonar
git clone https://github.com/Jfede98/fullstack-portfolio-cms.git
cd fullstack-portfolio-cms

# 2. Instalar dependencias
bun install

# 3. Configurar variables de entorno
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
# Editar los .env con tus valores (ver sección "Variables de Entorno")

# 4. Levantar PostgreSQL (opción Docker)
docker run --name portfolio-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:17-alpine

# 5. Levantar todo
bun run dev              # Todo junto
# O individualmente:
bun run dev:backend      # Strapi en http://localhost:1337
bun run dev:frontend     # Next.js en http://localhost:4009
bun run dev:storybook    # Storybook en http://localhost:6006
```

### Primera vez con Strapi
1. Ir a `http://localhost:1337/admin`
2. Crear usuario administrador
3. En Settings → API Tokens → crear un token Full Access
4. Copiar ese token en `apps/frontend/.env` como `STRAPI_ADMIN_TOKEN`

---

## 🔑 Variables de Entorno

### Frontend (`apps/frontend/.env`)

| Variable | Descripción | Ejemplo local |
|----------|-------------|---------------|
| `STRAPI_ADMIN_TOKEN` | Token API de Strapi (Full Access) | (generado en Strapi admin) |
| `STRAPI_API_URL` | URL del backend Strapi | `http://localhost:1337` |
| `STRAPI_ORIGIN_HEADER` | Origin para CORS | `http://localhost:4009` |
| `SITE_ORIGIN` | URL pública del sitio | `http://localhost:4009` |
| `URL_STATIC_RESOURCES` | URL de recursos estáticos/media | `http://localhost:1337` |
| `GOOGLE_TAG_MANAGER_ID` | GTM ID (opcional) | (vacío en dev) |
| `REVALIDATE_TOKEN` | Token para revalidación ISR | (cualquier string seguro) |

### Backend (`apps/backend/.env`)

| Variable | Descripción | Ejemplo local |
|----------|-------------|---------------|
| `DATABASE_CLIENT` | Cliente de DB | `postgres` o `sqlite` |
| `DATABASE_HOST` | Host de PostgreSQL | `localhost` |
| `DATABASE_PORT` | Puerto de PostgreSQL | `5432` |
| `DATABASE_NAME` | Nombre de la DB | `postgres` |
| `DATABASE_USERNAME` | Usuario DB | `postgres` |
| `DATABASE_PASSWORD` | Password DB | `postgres` |
| `APP_KEYS` | Keys de la app Strapi | `key1,key2,key3,key4` |
| `API_TOKEN_SALT` | Salt para tokens API | (string random largo) |
| `ADMIN_JWT_SECRET` | Secret para JWT admin | (string random largo) |
| `JWT_SECRET` | Secret para JWT | (string random largo) |
| `CORS_ALLOWED_ORIGINS` | Origins permitidos | `http://localhost:4009,http://localhost:3000` |

---

## 🚀 Plan de Deploy (Servicios Gratuitos)

### Frontend → Vercel
- **Por qué**: Soporte nativo Next.js, free tier generoso, preview deploys automáticos
- **Cómo**: Conectar repo de GitHub, seleccionar `apps/frontend` como root directory
- **Config**: Agregar variables de entorno del frontend en Vercel dashboard
- **Build command**: `cd ../.. && bun install && bun run build:all-frontend`
- **Output directory**: `apps/frontend/.next`
- **Nota**: El `next.config.ts` tiene `output: "standalone"` y `transpilePackages: ["@sitio-publico/shared-ui"]`

### Backend (Strapi) → Railway
- **Por qué**: Soporta Node.js, incluye PostgreSQL, free tier con $5/mes de crédito
- **Alternativa**: Render (free tier con cold starts de ~30s)
- **Cómo**: Conectar repo, seleccionar `apps/backend` como root, configurar start command `bun run start`
- **Config**: Agregar todas las variables de entorno del backend
- **Importante**: En producción cambiar `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET` a valores seguros

### Base de Datos → Railway PostgreSQL (incluido) o Supabase
- **Railway**: Viene incluido si el backend está ahí, más simple
- **Supabase**: Free tier con 500MB, buena opción si el backend va en otro lado
- **Config**: Usar `DATABASE_URL` connection string o las variables individuales

### Media/Uploads → Cloudinary
- **Por qué**: Free tier con 25GB, transformaciones de imagen incluidas
- **Alternativa**: Mantener AWS S3 si ya tienes cuenta (el plugin ya está configurado)
- **Cambio necesario**: Instalar `@strapi/provider-upload-cloudinary` y actualizar `apps/backend/config/plugins.ts`

### Storybook → Chromatic o Vercel
- **Chromatic**: Gratis para proyectos open source, visual testing incluido
- **Vercel**: Segundo proyecto en Vercel apuntando a `libs/shared-ui`

---

## 📦 Componentes Principales

### Sistema de FAQs (`apps/frontend/src/components/faqsBlock/`)
- Búsqueda con lógica OR y filtrado de stop words
- Filtros por categoría (relaciones Strapi)
- Slider de FAQs destacados
- URLs con anchors para compartir preguntas específicas
- Backward compatible con formato simple

### Carousel (`libs/shared-ui/src/lib/components/faqCardsSlider/`)
- Drag/swipe en mobile, flechas en desktop
- Breakpoints responsive
- Detección automática mobile/desktop

### Markdown Processor (`libs/shared-ui/src/lib/components/markdown/`)
- 3 variantes: `navbar`, `footer`, `default`
- Procesa iconos font-icons, links, listas
- Cada variante tiene su propio procesamiento HTML

### Otros componentes clave
- Hero con slides
- Tabla comparativa
- Sistema de testimonios con carousel
- Formulario de contacto
- Navbar responsive con sidebar mobile
- Footer con secciones desplegables
- Modal system
- Stepper para flujos multi-paso

---

## 🗄️ Estructura de Strapi (Content Types)

### Collections
- `page` — Páginas del sitio (dinámicas, con bloques)
- `plan` — Planes/servicios
- `testimonial` — Testimonios
- `faq-category` — Categorías de FAQs
- `custom-icon` — Iconos personalizados
- `lead-form` — Formularios de contacto

### Singles
- `navbar` — Menú de navegación
- `footer` — Pie de página
- `global` — Configuración global del sitio

### Bloques (Components)
Los bloques son componentes reutilizables que se agregan a las páginas:
- `hero`, `features`, `fa-qs`, `testimonials`, `cta-banner`
- `comparative-table`, `plan-tab`, `streaming-plans`
- `informational-section`, `two-columns`, `contact-form-block`
- `link-block`, `banner-link-block`, `info-card-block`, `list-card-block`
- `service-channels`, `map`, `widget`, `dual-buttons`

---

## ⚠️ Tareas Pendientes

### Prioridad Alta
- [ ] Cambiar upload provider de AWS S3 a Cloudinary (o configurar para local en dev)
- [ ] Crear contenido de portfolio en Strapi (proyectos, about, skills)
- [ ] Adaptar el look & feel / tema de colores para portfolio personal
- [ ] Deploy inicial en Vercel (frontend) + Railway (backend + DB)

### Prioridad Media
- [ ] Renombrar `@sitio-publico/shared-ui` a `@portfolio/shared-ui` en todo el código (hay ~100+ archivos con este import, requiere search & replace global + actualizar tsconfig paths)
- [ ] Remover componentes específicos del negocio anterior que no apliquen (flows de checkout, lead distribution, address catalog)
- [ ] Crear nuevos content types en Strapi para portfolio (projects, skills, experience)
- [ ] Configurar Cloudinary para media uploads

### Prioridad Baja
- [ ] Configurar CI/CD con GitHub Actions para Vercel + Railway
- [ ] Agregar Playwright E2E tests para el portfolio
- [ ] Configurar dominio personalizado
- [ ] SEO optimization con contenido real

---

## 📁 Archivos Clave para Referencia

| Archivo | Qué hace |
|---------|----------|
| `nx.json` | Configuración del monorepo NX |
| `package.json` (raíz) | Scripts principales: `dev`, `build`, `dev:frontend`, etc. |
| `apps/frontend/next.config.ts` | Config de Next.js (standalone, transpile shared-ui) |
| `apps/frontend/src/lib/fetch.ts` | Fetching a Strapi con auth token |
| `apps/frontend/src/lib/constants/constants.ts` | Variables de entorno exportadas |
| `apps/frontend/src/lib/helpers/buildBlocks.tsx` | Mapea bloques de Strapi a componentes React |
| `apps/frontend/src/lib/helpers/mappers/` | Transforman data de Strapi a props de componentes |
| `apps/backend/config/database.ts` | Config de DB (soporta postgres, mysql, sqlite) |
| `apps/backend/config/plugins.ts` | Plugins de Strapi (upload, email, docs, custom plugins) |
| `apps/backend/config/middlewares.ts` | Middlewares (CORS, CSP, security) |
| `apps/backend/src/components/` | Schemas de componentes Strapi (bloques, shared, etc.) |
| `libs/shared-ui/src/lib/components/` | Todos los componentes UI reutilizables |
| `libs/shared-ui/src/lib/main.ts` | Entry point de la librería (exports) |
| `tsconfig.base.json` | Path aliases del monorepo |

---

## 🔗 URLs del Proyecto

| Recurso | URL |
|---------|-----|
| Repo GitHub | https://github.com/Jfede98/fullstack-portfolio-cms |
| Frontend (local) | http://localhost:4009 |
| Strapi Admin (local) | http://localhost:1337/admin |
| Strapi API (local) | http://localhost:1337/api |
| Storybook (local) | http://localhost:6006 |
| Frontend (prod) | *pendiente deploy* |
| Strapi (prod) | *pendiente deploy* |

---

*Última actualización: Julio 2025*
