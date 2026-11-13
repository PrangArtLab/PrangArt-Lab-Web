PRAGART LAB - PANDUAN PEMASANGAN FILE

Paket ini berisi seluruh file kode yang harus dipasang di project Next.js
hasil perintah create-next-app. Struktur folder di dalam ZIP sama dengan
struktur project Anda.

LANGKAH 1 - Buat project dasar
  npx create-next-app@latest pragart-lab
  Jawaban: TypeScript Yes, ESLint Yes, Tailwind CSS Yes, src/ directory Yes,
  App Router Yes, Turbopack No, Customize import alias No.

  cd pragart-lab
  npm install lucide-react @google/genai

LANGKAH 2 - Pasang file
  Salin seluruh isi folder "src" dari ZIP ini ke dalam folder "src" project
  Anda, dan timpa file yang sudah ada.

  Jika ada file tailwind.config.ts, hapus saja (Tailwind v4 tidak memakainya).

LANGKAH 3 - Atur API Key
  Salin file .env.local.example menjadi .env.local (di folder utama,
  sejajar package.json), lalu isi GEMINI_API_KEY dengan API key Anda.

LANGKAH 4 - Atur data sebelum deploy
  Buka src/lib/data.ts, lalu ganti:
  - REKENING_BCA dengan nomor rekening BCA yang benar
  - NAMA_REKENING jika perlu
  - NOMOR_ADMIN jika nomor admin berubah (format 62...)

LANGKAH 5 - Uji coba
  npm run dev
  Buka http://localhost:3000

LANGKAH 6 - Deploy
  Upload ke GitHub, lalu impor repo di Vercel. Pada Environment Variables,
  tambahkan GEMINI_API_KEY dengan nilai API key Anda, kemudian klik Deploy.

CATATAN
- Jangan upload .env.local ke GitHub (sudah otomatis diabaikan oleh .gitignore).
- Jika model gemini-2.5-flash tidak tersedia, ganti nama model di
  src/app/api/ai/route.ts dengan model terbaru dari dokumentasi Google AI.
