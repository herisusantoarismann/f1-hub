# 🏁 Panduan Onboarding Developer — F1 Hub

Selamat datang di tim pengembang **F1 Hub**! Dokumen ini dirancang untuk memandu developer baru dalam memahami arsitektur, standar penulisan kode, model data, dan tata cara berkontribusi secara efisien.

---

## 1. ⚙️ Setup Lingkungan Pengembangan

### Kebutuhan Perangkat Lunak

- **Node.js**: Versi `>= 18.18.0` atau `>= 20.0.0`
- **npm**: Versi `>= 9.0.0`
- **Editor**: Disarankan VS Code dengan ekstensi:
    - _Tailwind CSS IntelliSense_
    - _ESLint_
    - _Pretty TypeScript Errors_

### Langkah Awal

```bash
# 1. Kloning repository
git clone https://github.com/herisusantoarismann/f1-hub.git
cd f1-hub

# 2. Pasang dependensi
npm install

# 3. Jalankan server lokal
npm run dev

# 4. Jalankan pengujian untuk memastikan lingkungan siap
npm test
```

> [!NOTE]
> Pada sistem operasi Windows, jika Anda menggunakan PowerShell dan menemui hambatan eksekusi skrip, Anda dapat menjalankan perintah melalui terminal `cmd /c npm <command>`.

---

## 2. 🏛️ Konvensi Arsitektur & Atomic Design

Proyek ini mengadopsi struktur komponen bertingkat:

### `src/components/atoms/`

Komponen UI dasar yang tidak memiliki dependensi bisnis:

- `Button.tsx`: Tombol dengan varian `primary`, `secondary`, `outline`, `ghost` dan ukuran `sm`, `md`, `lg`.
- `Badge.tsx`: Badge indikator status balap, ban, atau kategori.
- `Skeleton.tsx`: Efek shimmer loading untuk konten asinkron.

### `src/components/molecules/`

Gabungan atom yang membentuk unit UI terfokus:

- `LiveRaceNotificationBanner.tsx`: Notifikasi yang otomatis memeriksa status sesi live balapan.
- `CircuitInfoCard.tsx`: Kartu ringkasan spesifikasi sirkuit.
- `StrategyComparisonCard.tsx`: Kartu komparasi stint dan waktu projected race.
- `SceneTreeInspector.tsx`: Panel inspeksi geometri 3D.

### `src/components/organisms/`

Komponen kompleks yang mengelola state dan interaksi pengguna:

- `PitStopStrategySimulator.tsx`: Simulator strategi pit stop offline dengan regulasi 2026.
- `LiveRaceStrategyPitWall.tsx`: Dashboard Pit Wall real-time dengan prediksi posisi keluar pit (_rejoin_).
- `ChampionshipCalculator.tsx`: Kalkulator skenario poin kejuaraan.
- `F1ModelViewer.tsx`: Canvas 3D render mobil balap Three.js.

### `src/app/` (Pages & Layouts)

Mengikuti pola Next.js App Router:

- Menggunakan Server Components secara default untuk performa maksimal.
- Tandai komponen dengan directive `"use client";` hanya jika memerlukan Hooks (`useState`, `useEffect`) atau event browser.

---

## 3. 🧠 Logika Bisnis & Simulasi Ban

Seluruh logika perhitungan Formula 1 diisolasi dalam modul mandiri di `src/lib/`:

### Mesin Simulasi Ban (`src/lib/strategy-simulator.ts`)

- **Degradasi Eksponensial Pirelli**:
  \[
  \text{Degradation}(age) = \text{baseRate} \times \left(1 + \frac{age}{\text{cliffLap}}\right)^{1.8}
  \]
- **Regulasi 2026**:
    - `F1_2026_REGULATIONS.carMinWeightKg`: 768 kg
    - `F1_2026_REGULATIONS.maxFuelCapacityKg`: 75 kg (100% sustainable fuels)
    - `F1_2026_REGULATIONS.fuelConsumptionPerLapKg`: 1.25 kg/lap
    - `F1_2026_REGULATIONS.mandatoryDryCompounds`: Minimal 2 compound kering berbeda (Article 30.5).

### Prediktor Live Rejoin (`src/lib/live-race-simulator.ts`)

- Menghitung waktu pit loss berdasarkan status bendera balapan:
    - **Green Flag**: 20.0s – 23.0s (tergantung panjang pit lane sirkuit).
    - **Safety Car (SC)**: ~12.0s (karena laju mobil di lintasan dibatasi delta SC).
    - **Virtual Safety Car (VSC)**: ~15.0s.
- Menyortir urutan pembalap (_running order_) dan mencari gap kumulatif untuk menentukan di belakang siapa pembalap akan kembali ke trek.

---

## 4. 📡 Integrasi API & Caching

### OpenF1 API Client (`src/lib/api/openf1-client.ts`)

- Menyediakan fungsi `getLiveRaceTelemetry()` yang memeriksa apakah waktu saat ini berada di dalam interval `date_start` s/d `date_end` sesi balapan Grand Prix resmi.
- Tidak menggunakan fake/hybrid data secara default. Jika tidak ada balapan, API secara transparan mengembalikan `isLive: false` beserta info balapan berikutnya (`nextRace`).

### Jolpica Ergast Client (`src/lib/api/f1-client.ts`)

- Mengambil data kalender, klasemen, pembalap, dan hasil balapan historis dengan caching berbasis waktu (`revalidate: 3600` detik).

---

## 5. ✍️ Standar Penulisan Kode (Coding Guidelines)

1. **Strict Type Safety**: Hindari penggunaan tipe `any`. Definisikan interface atau type alias secara eksplisit di `src/types/` atau pada file modul terkait.
2. **Key Uniqueness di React Lists**: Pastikan setiap elemen yang di-`map` memiliki key unik dan stabil. Gunakan ID unik atau gabungan index komposit (`${item.id || "item"}-${index}`).
3. **Aksesibilitas (A11y)**: Gunakan elemen semantik HTML (`<main>`, `<nav>`, `<button>`, `<header>`) dan tambahkan atribut `aria-label` jika tombol hanya berupa ikon.
4. **Clean Code**: Bersihkan `console.log` sisa eksperimen sebelum melakukan commit.

---

## 6. 🧪 Prosedur Pengujian (Testing Workflow)

Setiap perubahan fitur wajib dilengkapi atau lolos pengujian:

```bash
# Menjalankan seluruh test suite
npm test

# Menjalankan test pada file tertentu
npm test -- src/tests/components/LiveRaceStrategyPitWall.test.tsx

# Memeriksa build produksi
npm run build
```

---

## 7. 🚀 Alur Kerja Pembuatan Fitur Baru

1. Buat branch baru dari branch utama (`feature/nama-fitur`).
2. Tulis logika atau komponen sesuai hierarki _Atomic Design_.
3. Buat unit test di `src/tests/` yang memverifikasi skenario normal dan edge cases.
4. Jalankan `npm test` dan `npm run build` untuk memverifikasi ketiadaan regresi.
5. Ajukan Pull Request dengan deskripsi perubahan yang jelas.
