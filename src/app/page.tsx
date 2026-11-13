import Link from "next/link";
import Navbar from "@/components/Navbar";
import PaketCard from "@/components/PaketCard";
import { dataPaket } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen bg-prag-black">
      <Navbar />
      <section className="pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-serif text-prag-gold mb-4">PragArt Lab</h1>
        <p className="text-lg text-gray-300 max-w-2xl mb-8">
          Musik digarap secara custom sesuai konsep tari, karakter daerah, dan kebutuhan artistik pertunjukan Anda.
        </p>
        <Link
          href="/order"
          className="bg-prag-gold text-prag-black px-8 py-4 rounded-md font-bold text-lg hover:bg-prag-gold-light transition"
        >
          Mulai Produksi Sekarang
        </Link>
      </section>

      <section id="harga" className="py-20 px-4 bg-prag-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-prag-gold mb-2">Pilihan Paket Produksi</h2>
            <p className="text-gray-400">Harga transparan, kualitas maksimal.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {dataPaket.map((paket) => (
              <PaketCard key={paket.id} paket={paket} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
