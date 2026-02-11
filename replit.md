# Overview

**روياتي (Riwayati)** is an Arabic-language novel writing and planning platform. It provides authors with tools to create novels, organize chapters with drag-and-drop reordering, manage characters and settings, write with a rich text editor, and generate AI-powered plot suggestions. The entire UI is RTL (right-to-left) and uses Arabic fonts (Amiri for serif, Noto Sans Arabic for sans-serif). The application name translates roughly to "My Novel."

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Monorepo Structure

The project follows a three-folder monorepo pattern:

- **`client/`** — React SPA (single-page application)
- **`server/`** — Express.js API server
- **`shared/`** — Shared types, schemas, and API route contracts used by both client and server

## Frontend (`client/src/`)

- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight React router)
- **State/Data Fetching**: `@tanstack/react-query` for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS
- **Rich Text Editor**: Tiptap (with StarterKit and Placeholder extensions) for chapter writing
- **Drag & Drop**: `@dnd-kit/core` and `@dnd-kit/sortable` for chapter reordering
- **Forms**: `react-hook-form` with `@hookform/resolvers` and Zod validation
- **Styling**: Tailwind CSS with CSS variables for theming (warm paper-like palette). Custom fonts loaded from Google Fonts.
- **RTL**: Enforced globally via `dir="rtl"` on the HTML element and CSS

### Key Pages
- `Home` — Lists all novels with create button
- `Wizard` — Novel creation form
- `Dashboard` — Novel overview with stats
- `Planner` — Chapter management with drag-and-drop ordering and AI plot generation
- `Characters` — Character CRUD management
- `Editor` — Rich text chapter editor with auto-save (3-second debounce)

### Custom Hooks
- `use-novels.ts` — Novel CRUD + AI plot generation
- `use-chapters.ts` — Chapter CRUD + reordering
- `use-characters.ts` — Character CRUD
- `use-settings.ts` — Setting/location CRUD

### Path Aliases
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

## Backend (`server/`)

- **Framework**: Express.js with TypeScript, run via `tsx`
- **Database ORM**: Drizzle ORM with PostgreSQL (`node-postgres` driver)
- **API Design**: RESTful JSON API under `/api/` prefix. Route contracts are defined in `shared/routes.ts` with Zod schemas for input validation and response types.
- **AI Integration**: OpenAI client configured via Replit AI Integrations environment variables (`AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`) for plot generation
- **Dev Server**: Vite dev server middleware for HMR in development
- **Production**: Static file serving from `dist/public/` with SPA fallback

### API Endpoints
- `GET/POST /api/novels` — List/create novels
- `GET/PUT/DELETE /api/novels/:id` — Get/update/delete novel
- `GET/POST /api/novels/:novelId/chapters` — List/create chapters
- `GET/PUT/DELETE /api/chapters/:id` — Get/update/delete chapter
- `PUT /api/chapters/reorder` — Reorder chapters
- `GET/POST /api/novels/:novelId/characters` — List/create characters
- `PUT/DELETE /api/characters/:id` — Update/delete character
- `GET/POST /api/novels/:novelId/settings` — List/create settings
- `PUT/DELETE /api/settings/:id` — Update/delete setting
- `POST /api/generate-plot` — AI-powered plot generation
- `/api/conversations/*` — Chat integration routes

### Replit Integrations (`server/replit_integrations/`)
Pre-built integration modules:
- **chat/** — Conversation/message storage and streaming chat routes via OpenAI
- **audio/** — Voice recording, playback, speech-to-text, text-to-speech
- **image/** — Image generation via `gpt-image-1`
- **batch/** — Batch processing with rate limiting and retries

## Shared (`shared/`)

- **`schema.ts`** — Drizzle ORM table definitions (novels, chapters, characters, settings, conversations, messages) and Zod insert schemas
- **`routes.ts`** — Typed API contract defining all endpoints, methods, paths, input schemas, and response schemas. Includes a `buildUrl` helper for parameterized paths.
- **`models/chat.ts`** — Chat-specific table definitions (conversations, messages)

## Database Schema

PostgreSQL with the following tables:

| Table | Purpose |
|-------|---------|
| `novels` | id, title, genre, summary, targetWordCount, status, timestamps |
| `chapters` | id, novelId (FK), title, content (HTML), orderIndex, status, timestamp |
| `characters` | id, novelId (FK), name, role, description, traits (JSONB), timestamp |
| `settings` | id, novelId (FK), name, description, timestamp |
| `conversations` | id, title, timestamp (for AI chat) |
| `messages` | id, conversationId (FK), role, content, timestamp (for AI chat) |

Schema migrations are managed via `drizzle-kit push` (command: `npm run db:push`).

## Build Process

- **Development**: `npm run dev` — runs `tsx server/index.ts` with Vite middleware for HMR
- **Production Build**: `npm run build` — Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs`
- **Production Start**: `npm run start` — runs `node dist/index.cjs`

# External Dependencies

- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable
- **OpenAI API** (via Replit AI Integrations) — Used for AI plot generation. Configured with:
  - `AI_INTEGRATIONS_OPENAI_API_KEY`
  - `AI_INTEGRATIONS_OPENAI_BASE_URL`
- **Google Fonts** — Amiri (serif) and Noto Sans Arabic (sans-serif) loaded via CDN
- **Replit Vite Plugins** — `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` (dev only)