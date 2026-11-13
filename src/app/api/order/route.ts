import { NextResponse } from "next/server";
import { BIAYA_VOKAL, NOMOR_ADMIN, dataPaket } from "@/lib/data";

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);

// Ubah 08xxxx menjadi 628xxxx dan buang karakter selain angka
const normalisasiWhatsapp = (nomor: string) => {
  const angka = nomor.replace(/\D/g, "");
  return angka.startsWith("0") ? "62" + angka.slice(1) : angka;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const paketData = dataPaket.find((p) => p.id === body.paket);
    if (!paketData) {
      return NextResponse.json({ success: false, message: "Paket tidak valid." }, { status: 400 });
    }

    const nama = String(body.nama ?? "").trim();
    const whatsapp = normalisasiWhatsapp(String(body.whatsapp ?? ""));
    const judulTari = String(body.judulTari ?? "").trim();
    if (!nama || !whatsapp || !judulTari) {
      return NextResponse.json({ success: false, message: "Data wajib belum lengkap." }, { status: 400 });
    }

    const paket = paketData.id;
    const vokal =
      paket === "dasar" ? body.vokalDasar : paket === "standar" ? body.vokalStandar : body.vokalPro;
    const adaVokal = Boolean(vokal) && vokal !== "Tidak menggunakan";

    const total = paketData.hargaNumerik + (adaVokal ? BIAYA_VOKAL : 0);
    const dp = total / 2;

    const jenisTari = body.jenisTari === "Lainnya" ? body.jenisTariLainnya : body.jenisTari;
    const nuansa = body.nuansaMusik === "Lainnya" ? body.nuansaMusikLainnya : body.nuansaMusik;

    let detailPaket = "";
    if (paket === "dasar") {
      detailPaket = `Tempo: ${body.tempoDasar}\nNuansa: ${nuansa}\nInstrumen: ${body.instrumen}\nVokal: ${body.vokalDasar}`;
    } else if (paket === "standar") {
      detailPaket = `Vokal: ${body.vokalStandar}\nStruktur: ${(body.strukturTari ?? []).join(", ")}\nUrutan Musik: ${body.urutanMusikStandar}`;
    } else {
      detailPaket = `Vokal: ${body.vokalPro}\nUrutan Nuansa: ${body.urutanNuansaPro}`;
    }

    // Pesan ini dikirim KLIEN ke ADMIN (tautan wa.me langsung ke nomor admin)
    const pesan = `Halo Admin *PragArt Lab*, saya ingin memesan musik tari.

*Data Pemesan*
Nama: ${nama}
Sanggar/Instansi: ${body.sanggar}
Kota: ${body.kota}
WhatsApp: ${whatsapp}
Email: ${body.email}
Koreografer: ${body.koreografer || "-"}

*Detail Karya*
Judul Tari: ${judulTari}
Jenis Tari: ${jenisTari}
Latar Budaya: ${body.latarBudaya}
Estimasi Durasi: ${body.estimasiDurasi}
Referensi Musik: ${body.referensi}

Sinopsis:
${body.sinopsis}

*Paket: ${paketData.nama}*
Total: *${formatRupiah(total)}*
DP (50%): *${formatRupiah(dp)}*

*Detail Paket*
${detailPaket}

Mohon instruksi pembayaran DP. Terima kasih.`;

    const waUrl = `https://wa.me/${NOMOR_ADMIN}?text=${encodeURIComponent(pesan)}`;

    return NextResponse.json({ success: true, waUrl });
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ success: false, message: "Gagal memproses pesanan." }, { status: 500 });
  }
}
