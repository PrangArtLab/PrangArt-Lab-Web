import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-prag-black/90 backdrop-blur-md border-b border-prag-gold/20 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 relative overflow-hidden rounded-full border border-prag-gold bg-prag-gray flex items-center justify-center">
            <span className="font-serif text-prag-gold font-bold text-lg">P</span>
          </div>
          <span className="font-serif text-xl font-bold text-prag-gold tracking-wider">PragArt Lab</span>
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-semibold items-center">
          <Link href="/#harga" className="hover:text-prag-gold transition">Harga</Link>
          <Link href="/order" className="bg-prag-gold text-prag-black px-5 py-2 rounded-md hover:bg-prag-gold-light transition">Pesan Sekarang</Link>
        </div>
      </div>
    </nav>
  );
}
