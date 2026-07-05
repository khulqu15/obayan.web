# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## SaaS Expiry Blocker

Set `NUXT_PUBLIC_SAAS_EXPIRES_AT` untuk mengaktifkan tampilan out of service.

```env
# Kosong/null/off/false = website tetap aktif
NUXT_PUBLIC_SAAS_EXPIRES_AT=

# Blocker aktif mulai 00:00 WIB pada tanggal ini
NUXT_PUBLIC_SAAS_EXPIRES_AT=2026-08-01
```

Kontak pada halaman blocker bisa diatur lewat:

```env
NUXT_PUBLIC_SAAS_SUPPORT_EMAIL=team-sencra@gmail.com
NUXT_PUBLIC_SAAS_SUPPORT_WHATSAPP=62895396004952
```

Superadmin `team.sencra@gmail.com` dapat mengubah tanggal blocker dari dashboard `/app`.
Nilai dashboard disimpan di Realtime Database pada `settings/saasOutOfService` dan menjadi override untuk runtime config.

## Backend Modular

Backend baru memakai MySQL sebagai sumber data utama, Redis sebagai cache, dan Firebase Realtime Database hanya sebagai mirror data realtime sementara.

File utama:

```text
server/utils/mysql.ts
server/utils/redis.ts
server/repositories/appRecordRepository.ts
server/services/appDataService.ts
server/services/firebaseRealtimeService.ts
server/services/backupService.ts
app/composables/useAppRepository.ts
```

Endpoint generik:

```http
GET  /api/repository?collection=santri
GET  /api/repository?collection=santri&id=abc
POST /api/repository?collection=santri
POST /api/repository?collection=santri&id=abc&method=update
POST /api/repository?collection=santri&id=abc&method=delete
```

Maintenance manual:

```http
POST /api/maintenance-firebase-cleanup
POST /api/maintenance-backup-monthly
```

Atur `AUTO_MAINTENANCE_ENABLED=true` untuk mengaktifkan cleanup berkala dan backup bulanan otomatis. Contoh env lengkap ada di `.env.example`.

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
