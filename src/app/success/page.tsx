"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, MessageCircle } from "lucide-react";
import { NAMA_REKENING, REKENING_BCA } from "@/lib/data";

export default function SuccessPage() {
  const [waUrl, setWaUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      setWaUrl(sessionStorage.getItem("pragart-wa-admin"));
    } catch {
      setWaUrl(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-prag-black flex items-center justify-center p-4">
      <div className="bg-prag-gray p-8 md:p-10 rounded-xl border border-prag-gold/30 text-center max-w-md w-full">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-serif text-prag-gold mb-4">Pesanan Diterima!</h1>
        <p className="text-gray-300 mb-6">
          Langkah berikutnya: kirim ringkasan pesanan ke admin melalui WhatsApp, lalu transfer DP 50% ke rekening berikut.
        </p>

        <div className="bg-prag-black border border-gray-700 rounded-lg p-4 mb-6 text-left text-sm">
          <p className="text-gray-400">Bank BCA</p>
          <p className="font-bold text-white text-lg">{REKENING_BCA}</p>
          <p className="text-gray-300">a/n {NAMA_REKENING}</p>
        </div>

        {waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-prag-gold text-prag-black font-bold py-3 rounded-md hover:bg-prag-gold-light transition mb-4"
          >
            <MessageCircle className="w-5 h-5" />
            Kirim Pesanan ke WhatsApp Admin
          </a>
        ) : (
          <p className="text-gray-400 text-sm mb-4">
            Ringkasan pesanan tidak ditemukan. Silakan hubungi admin langsung.
          </p>
        )}

        <Link href="/" className="text-prag-gold underline text-sm">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
