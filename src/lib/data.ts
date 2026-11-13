import type { PaketId } from "@/lib/types";

export interface Paket {
  id: PaketId;
  nama: string;
  harga: string;
  hargaNumerik: number;
  durasi: string;
  fasilitas: string[];
}

// Sumber data paket tunggal (dipakai di tampilan dan perhitungan server)
export const dataPaket: Paket[] = [
  {
    id: "dasar",
    nama: "Paket Dasar",
    harga: "Rp1.000.000",
    hargaNumerik: 1000000,
    durasi: "4-5 menit",
    fasilitas: [
      "Aransemen dasar (tanpa vokal)",
      "Maksimal 5 instrumen",
      "Penyesuaian tempo",
      "3x revisi",
      "File akhir MP3",
      "Pengerjaan maksimal 7 hari",
    ],
  },
  {
    id: "standar",
    nama: "Paket Standar",
    harga: "Rp1.500.000",
    hargaNumerik: 1500000,
    durasi: "5-8 menit",
    fasilitas: [
      "Aransemen mengikuti struktur tari",
      "5-8 instrumen fleksibel",
      "Karakter musik disesuaikan",
      "File akhir MP3 & WAV",
      "Pengerjaan maksimal 10 hari",
    ],
  },
  {
    id: "pro",
    nama: "Paket Pro",
    harga: "Rp2.000.000",
    hargaNumerik: 2000000,
    durasi: "5-8 menit",
    fasilitas: [
      "Aransemen detail sesuai konsultasi",
      "Penekanan dinamika & transisi",
      "Daerah/tema tari disesuaikan",
      "File akhir MP3 & WAV",
      "Pengerjaan maksimal 10 hari",
    ],
  },
];

export const BIAYA_VOKAL = 250000;

// Nomor WhatsApp admin (format 62...)
export const NOMOR_ADMIN = "628977250597";

// GANTI dengan nomor rekening BCA yang benar sebelum deploy
export const REKENING_BCA = "GANTI_NOMOR_REKENING_BCA";
export const NAMA_REKENING = "Fikri Yassaar";
