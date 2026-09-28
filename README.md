# 🏎️ F1 Hub — Formula 1 Intelligence & Telemetry Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729b1b?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-black?style=for-the-badge&logo=three.js)](https://threejs.org/)

**F1 Hub** adalah platform intelligence, edukasi, telemetri, dan simulasi strategi balapan Formula 1 modern yang dibangun dengan Next.js App Router berarsitektur _Atomic Design_. Platform ini mencakup kalkulasi matematis FIA, regulasi teknis 2026, simulator degradasi ban Pirelli, dan Live Pit Wall yang terintegrasi secara real-time dengan OpenF1 API.

---

## 📑 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Arsitektur Proyek](#-arsitektur-proyek)
- [Struktur Direktori](#-struktur-direktori)
- [Teknologi & Dependensi](#-teknologi--dependensi)
- [Memulai & Instalasi](#-memulai--instalasi)
- [Pengujian & Test Coverage](#-pengujian--test-coverage)
- [Dokumentasi API](#-dokumentasi-api)
- [SEO, Metadata & Icons](#-seo-metadata--icons)
- [Panduan Kontributor](#-panduan-kontributor)

---

## 🚀 Fitur Utama

### 1. Live Race Strategy & Rejoin Pit Wall (`/strategy/live`)

- **Strict Real-Time Detection**: Terhubung langsung ke OpenF1 API (`api.openf1.org/v1`) untuk mendeteksi sesi Grand Prix yang sedang berjalan secara akurat.
- **Deteksi Kondisi Balap**: Jika balapan **tidak aktif**, halaman menyajikan info jadwal Grand Prix berikutnya dan banner di `/strategy` disembunyikan secara bersih.
- **Pit Rejoin Predictor (_"Keluar di belakang siapa?"_)**: Menghitung secara real-time delta waktu pit loss (Green Flag ~20-22s, Safety Car ~12s, Virtual Safety Car ~15s) dan memprediksi posisi track serta pembalap yang akan berada di depan saat mobil keluar dari pit lane.
- **Rekomendasi Stint Berikutnya (_"Ganti di lap berapa lagi?"_)**: Estimasi sisa usia ban dan lap window optimal sebelum ban masuk ke fase _cliff_.
- **Undercut Threat Matrix**: Peringatan otomatis jika pembalap di belakang masuk ke rentang ancaman undercut (< 2.2 detik).

### 2. Simulator Strategi Pit Stop 2026 (`/strategy`)

- **Regulasi FIA 2026 Ready**:
    - Ban Pirelli 18" lebih ramping (Depan: 280mm, Belakang: 375mm).
    - Kapasitas bahan bakar 100% sustainable fuels maksimum 75 kg (_fuel burn-off_ ~1.25 kg/lap, penalti ~0.030s/kg).
    - _Active Aerodynamics_ (Corner Mode / Straight Mode).
    - Peringatan wajib menggunakan minimal **2 compound ban kering yang berbeda** (FIA Article 30.5).
- **Tata Letak Interaktif Split View**: Panel konfigurasi ban & stint di sisi kiri, visualisasi grafik lap-by-lap dan timeline di sisi kanan, serta perbandingan strategi multi-plan.

### 3. Championship Points & Clinch Math Calculator (`/calculator`)

- Mensimulasikan skenario poin pembalap & konstruktor untuk sisa musim.
- Menghitung kemungkinan penguncian gelar juara dunia (_clinch math_) dengan deteksi matematis batas poin maksimal yang masih dapat diperebutkan.
- Dukungan balapan reguler (25-18-15-12-10-8-6-4-2-1) dan Sprint Race (8-7-6-5-4-3-2-1).

### 4. Head-to-Head Driver Comparison & Radar Charts (`/compare`)

- Komparasi mendalam antar dua pembalap F1 sepanjang karier atau musim tertentu.
- Radar Chart 6 dimensi performa: Race Pace, Qualifying Pace, Racecraft, Wet Weather Skill, Consistency, Tyre Management.
- Head-to-Head qualifying & race finish record.

### 5. 3D F1 Car Model Viewer & Scene Tree Inspector (`/test-3d`)

- Render mobil F1 3D interaktif menggunakan Three.js dan `@react-three/fiber` / `@react-three/drei`.
- Scene Tree Inspector untuk membedah hierarki geometri mesh, toggling visibilitas komponen (sayap depan, suspensi, halo, diffuser), dan mode isolasi.

### 6. Kalender Balap & Profil Sirkuit (`/schedule`, `/circuits/[id]`)

- Jadwal 24 seri balapan lengkap dengan hitung mundur presisi, zona waktu lokal, dan cuaca.
- Profil elevasi sirkuit SVG (titik terendah, titik tertinggi, sudut kemiringan tikungan/banking) dan daftar _Iconic Turns_.

---

## 🏛️ Arsitektur Proyek

Aplikasi dirancang mengikuti metodologi **Atomic Design**:

```
Atoms      → Button, Badge, Skeleton
Molecules  → RaceCard, DriverCard, LiveRaceNotificationBanner, CircuitInfoCard, StrategyComparisonCard, dll.
Organisms  → Navbar, Footer, PitStopStrategySimulator, LiveRaceStrategyPitWall, ChampionshipCalculator, dll.
Templates  → DashboardLayout
Pages      → Next.js App Router (src/app/*)
```

---

## 📁 Struktur Direktori

```
f1-hub/
├── docs/                      # Dokumentasi komprehensif
│   └── ONBOARDING.md          # Panduan orientasi developer baru
├── public/                    # Aset statis & model 3D
│   ├── images/                # Foto pembalap, sirkuit & logo tim
│   └── models/                # Model 3D GLTF/GLB
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API Route Handlers (/api/strategy/live-race, /api/compare)
│   │   ├── calculator/        # Halaman Championship Calculator
│   │   ├── circuits/          # Halaman Sirkuit & Elevasi
│   │   ├── compare/           # Halaman Head-to-Head Comparison
│   │   ├── drivers/           # Halaman Roster Pembalap
│   │   ├── schedule/          # Halaman Kalender Balap & Hasil
│   │   ├── standings/         # Halaman Klasemen Kejuaraan
│   │   ├── strategy/          # Simulator Strategi Pit Stop
│   │   │   └── live/          # Live Race Strategy Pit Wall
│   │   ├── teams/             # Halaman Tim Konstruktor
│   │   ├── test-3d/           # Inspector Model 3D
│   │   ├── icon.tsx           # Dynamic Favicon (ImageResponse)
│   │   ├── apple-icon.tsx     # Dynamic Apple Touch Icon
│   │   ├── opengraph-image.tsx# Dynamic OpenGraph Social Card
│   │   ├── robots.ts          # SEO Robots.txt
│   │   ├── sitemap.ts         # SEO Sitemap.xml
│   │   ├── manifest.ts        # PWA Web App Manifest
│   │   └── layout.tsx         # Root Layout & Global Metadata
│   ├── components/            # Atomic Component Design
│   │   ├── atoms/             # Button, Badge, Skeleton
│   │   ├── molecules/         # Cards, Charts, Banners, Rows
│   │   ├── organisms/         # Simulators, Tables, Grids, 3D Viewer
│   │   └── templates/         # Page Templates
│   ├── data/                  # Static Reference & Seed Data
│   ├── lib/                   # Business Logic, Calculators & Clients
│   │   ├── api/               # OpenF1 Client & Ergast Client
│   │   ├── strategy-simulator.ts  # Mesin Simulasi Ban & Regulasi 2026
│   │   └── live-race-simulator.ts # Logika Prediktor Rejoin & Pit Loss
│   └── tests/                 # Unit & Integration Tests (Vitest)
├── next.config.mjs            # Konfigurasi Next.js
├── tailwind.config.ts         # Tema F1 (f1-red, f1-black, dll.)
├── tsconfig.json              # Konfigurasi Strict TypeScript
└── vitest.config.ts           # Konfigurasi Testing Vitest & JSDOM
```

---

## 🛠️ Teknologi & Dependensi

| Layer            | Pilihan Teknologi            | Deskripsi                                        |
| ---------------- | ---------------------------- | ------------------------------------------------ |
| **Framework**    | Next.js 16 (App Router)      | Server-Side Rendering, Caching, Route Handlers   |
| **UI Library**   | React 19                     | Komponen reaktif & Server Components             |
| **Bahasa**       | TypeScript 5.6               | Strict type-safety di seluruh layer              |
| **Styling**      | Tailwind CSS 3.4             | Utilitas styling dengan palette resmi motorsport |
| **3D Engine**    | Three.js + React Three Fiber | Inspeksi geometri mobil balap 3D                 |
| **Testing**      | Vitest + Testing Library     | Pengujian otomatis unit & komponen DOM           |
| **Iconography**  | Lucide React                 | Ikon modern, ringan, dan tree-shakeable          |
| **Data Sources** | OpenF1 API & Jolpica Ergast  | Data telemetri balap live dan arsip historis     |

---

## ⚡ Memulai & Instalasi

### Prasyarat

- Node.js versi 18.18+ atau 20+
- npm versi 9+

### Langkah Pemasangan

```bash
# 1. Kloning repository
git clone https://github.com/herisusantoarismann/f1-hub.git
cd f1-hub

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev

# 4. Buka di browser
# http://localhost:3000
```

### Skrip yang Tersedia

- `npm run dev`: Menjalankan server dev Next.js pada port 3000.
- `npm run build`: Melakukan compile dan build produksi (beserta sitemap, icon, og-image).
- `npm start`: Menjalankan server hasil build produksi.
- `npm test`: Menjalankan suite pengujian unit dan komponen (Vitest).
- `npm run lint`: Memeriksa kepatuhan kode dan linting ESLint.

---

## 🧪 Pengujian & Test Coverage

F1 Hub mengutamakan keandalan kode dengan suite pengujian komprehensif menggunakan **Vitest** dan **React Testing Library**:

- **38+ Test Suites (150+ Tests)** mencakup:
    - Unit tests untuk mesin simulasi ban (`strategy-simulator.test.ts`).
    - Unit tests untuk kalkulator live rejoin dan pit delta (`live-race-simulator.test.ts`).
    - Client API OpenF1 aktif & idle weekend (`openf1-client.test.ts`).
    - Route handlers API (`/api/strategy/live-race`, `/api/compare`).
    - Komponen antarmuka atom, molekul, dan organisme.

Untuk menjalankan pengujian:

```bash
npm test
```

---

## 🌐 Dokumentasi API

### 1. `GET /api/strategy/live-race`

Mengembalikan status sesi balapan real-time dari OpenF1 API.

- **Cache**: 15 detik revalidation.
- **Contoh Response (Saat Balapan Aktif)**:
    ```json
    {
      "isLive": true,
      "session": {
        "grandPrixName": "Australian Grand Prix",
        "circuitShortName": "Melbourne",
        "currentLap": 24,
        "totalLaps": 58,
        "flagStatus": "GREEN",
        "trackTempC": 34.2,
        "airTempC": 21.5,
        "safetyCarProbability": 0.65,
        "avgPitStopTime": 21.8,
        "scPitLossTime": 12.2,
        "drivers": [...]
      },
      "nextRace": null
    }
    ```
- **Contoh Response (Saat Tidak Ada Balapan)**:
    ```json
    {
        "isLive": false,
        "session": null,
        "nextRace": {
            "name": "Singapore Grand Prix",
            "circuit": "Marina Bay Street Circuit",
            "dateStart": "2026-10-04T12:00:00Z",
            "location": "Marina Bay, Singapore"
        }
    }
    ```

### 2. `GET /api/compare?d1={driver1}&d2={driver2}&season={season}`

Mengembalikan data statistik perbandingan head-to-head dua pembalap.

---

## 🔍 SEO, Metadata & Icons

- **Dynamic Favicon (`/icon`)**: Dibuat secara native via Next.js `ImageResponse` (32x32 PNG) dengan aksen F1 red.
- **Apple Touch Icon (`/apple-icon`)**: Ikon 180x180 beresolusi tinggi untuk perangkat mobile / iOS home screen.
- **Social Sharing Card (`/opengraph-image`)**: Banner 1200x630 otomatis untuk preview Twitter / Facebook / WhatsApp.
- **Sitemap & Robots**: `/sitemap.xml` dan `/robots.txt` dibuat otomatis secara dinamis untuk crawler search engine.

---

## 🤝 Panduan Kontributor

Silakan baca dokumen [docs/ONBOARDING.md](docs/ONBOARDING.md) untuk panduan lengkap setup lingkungan lokal, struktur state, konvensi penamaan kode, dan prosedur penambahan fitur.

---

## ⚖️ Lisensi & Disclaimer

_Disclaimer: Situs ini adalah proyek edukasi non-komersial dan tidak terafiliasi dengan Formula 1, FIA, Formula One Management (FOM), atau perusahaan terkait Formula 1. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX dan merek terkait merupakan merek dagang dari Formula One Licensing B.V._
