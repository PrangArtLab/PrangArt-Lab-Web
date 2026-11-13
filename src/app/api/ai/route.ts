import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "API Key Gemini belum diset" },
        { status: 500 }
      );
    }

    const { judul, latarBudaya, jenisTari } = await req.json();
    if (!judul || !latarBudaya) {
      return NextResponse.json(
        { success: false, message: "Judul dan latar budaya wajib diisi" },
        { status: 400 }
      );
    }

    // Dibuat di dalam handler agar error konfigurasi tertangkap dengan benar
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Bertindaklah sebagai seniman tari dan penulis naskah profesional. Buatkan sinopsis tari yang puitis, mendalam, dan dramatis untuk pertunjukan dengan detail berikut: Judul: ${judul}, Latar Budaya: ${latarBudaya}, Jenis Tari: ${jenisTari}. Panjang sekitar 150-200 kata. Gunakan bahasa Indonesia yang indah. Tulis sebagai paragraf biasa tanpa judul dan tanpa format markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const sinopsis = response.text?.trim();
    if (!sinopsis) {
      return NextResponse.json(
        { success: false, message: "Respons AI kosong" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, sinopsis });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal generate sinopsis" },
      { status: 500 }
    );
  }
}
