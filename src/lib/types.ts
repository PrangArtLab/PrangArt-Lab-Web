export type PaketId = "dasar" | "standar" | "pro";

export interface OrderFormData {
  nama: string;
  sanggar: string;
  kota: string;
  whatsapp: string;
  email: string;
  koreografer: string;
  judulTari: string;
  jenisTari: string;
  jenisTariLainnya: string;
  latarBudaya: string;
  sinopsis: string;
  referensi: string;
  estimasiDurasi: string;

  // Paket Dasar
  tempoDasar: string;
  nuansaMusik: string;
  nuansaMusikLainnya: string;
  instrumen: string;
  vokalDasar: string;

  // Paket Standar
  vokalStandar: string;
  strukturTari: string[];
  urutanMusikStandar: string;

  // Paket Pro
  vokalPro: string;
  urutanNuansaPro: string;

  persetujuan: boolean;
}
