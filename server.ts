import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Fix for ESM __dirname in Node
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI lazily
  let ai: GoogleGenAI | null = null;
  function getAIClient() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in the environment.");
      }
      ai = new GoogleGenAI({ apiKey });
    }
    return ai;
  }

  // API Route to generate Modul Ajar
  app.post("/api/generate-modul", async (req, res) => {
    try {
      const { level, subject, semester, week, topic, additionalInstructions } = req.body;

      if (!level || !subject || !semester || !week || !topic) {
        return res.status(400).json({ error: "Missing required fields: level, subject, semester, week, topic" });
      }

      const client = getAIClient();
      
      const prompt = `
Anda adalah seorang guru/ustazah TPQ senior (pengalaman mengajar 15+ tahun) yang sangat kompeten dalam merancang rencana pelaksanaan pembelajaran (RPP) atau Modul Ajar yang sistematis, interaktif, menyenangkan, dan berakhlak mulia untuk santri TPQ.

Tolong susun Modul Ajar lengkap dan komprehensif berdasarkan informasi berikut:
- **Nama TPQ**: TPQ Hubbul Qur'an
- **Nama Guru**: Ustazah Ananda Rahmi Annisa
- **Jenjang Kelas Santri**: ${level} (Dasar setara 2-3 SD / Menengah setara 4-6 SD / Lanjut setara MTs)
- **Mata Pelajaran**: ${subject}
- **Semester**: ${semester}
- **Minggu Ke-**: ${week}
- **Topik / Materi Pokok**: ${topic}
${additionalInstructions ? `- **Instruksi Tambahan**: ${additionalInstructions}` : ''}

Modul Ajar harus disusun dengan bahasa Indonesia yang santun, profesional, dan menyentuh hati. Tolong bagi ke dalam struktur berikut (gunakan format Markdown yang rapi dengan heading, sub-heading, list, dan tabel):

1. **IDENTITAS MODUL**
   Tampilkan Nama TPQ, Nama Guru, Jenjang, Mata Pelajaran, Semester, Minggu, Alokasi Waktu (misal: 60 Menit), dan Target Santri secara rapi dalam format tabel atau blok informasi yang indah.

2. **TUJUAN PEMBELAJARAN (TP)**
   Sebutkan secara spesifik apa yang harus dicapai santri setelah pembelajaran selesai dalam 3 ranah:
   - Kognitif (Pemahaman materi/hukum)
   - Afektif (Penanaman akhlak, sikap spiritual & sosial)
   - Psikomotorik (Praktik, hafalan, kelancaran lisan)

3. **METODE & PENDEKATAN PEMBELAJARAN**
   Sebutkan metode mengajar yang cocok untuk TPQ (misal: Talaqqi, Klasikal-Individual, Privat/Sorogan, Drills/Pengulangan, Game Edukatif Islami). Jelaskan bagaimana metode ini digunakan.

4. **MATERI POKOK & RINGKASAN BAHAN AJAR (Sangat Detail)**
   Tuliskan penjelasan materi secara lengkap, mendalam, namun mudah dipahami. 
   - Jika materi adalah Tahsin/Tajwid: Berikan penjelasan hukumnya, cara membaca, dan berikan contoh tulisan Arab, cara melafalkan, dan alasannya.
   - Jika materi adalah Hafalan Surat Pendek / Hadits: Tuliskan teks Arab surat/hadits tersebut, transliterasi huruf latin, arti kata per kata atau terjemahan umum, serta kandungan maknanya secara ringkas dan menyentuh hati.
   - Jika materi adalah Fiqih Ibadah / Sirah / Adab Akhlak: Berikan materi esensial secara runut, dalil pendukung (jika ada), dan hikmah di baliknya.

5. **LANGKAH-LANGKAH KEGIATAN PEMBELAJARAN (Skenario Mengajar)**
   Uraikan skenario pembelajaran 60 menit secara mendalam:
   - **Kegiatan Awal (10 Menit)**: Pembukaan, doa pembuka, absensi kreatif, apersepsi interaktif, dan motivasi ber-Al-Qur'an.
   - **Kegiatan Inti (40 Menit)**: Proses penyampaian materi, bimbingan klasikal/individual, sesi talaqqi, interaksi aktif santri, permainan edukatif singkat agar santri tidak bosan.
   - **Kegiatan Akhir (10 Menit)**: Evaluasi/setoran hafalan kilat, kesimpulan bersama santri, nasihat akhlak/hikmah, doa penutup majelis (Kafaratul Majelis).

6. **MEDIA & SUMBER BELAJAR**
   Sebutkan alat bantu/media yang digunakan (misal: Kartu Huruf, Proyektor, Buku Iqro', Al-Qur'an Tajwid, dll) dan sumber rujukannya.

7. **ASESMEN / PENILAIAN**
   Buat rubrik penilaian yang aplikatif untuk guru TPQ. Sebutkan kriteria kelulusan (Mulai Berkembang, Sedang Berkembang, Berkembang Sesuai Harapan, Sangat Berkembang) beserta indikatornya.

Tuliskan modul ini dengan sangat lengkap (jangan disingkat-singkat, jangan gunakan placeholder seperti "[Tuliskan doa disini]" atau "[Ulangi langkah ini]"). Tulis materi Arab-nya secara jelas menggunakan tulisan Arab standar (atau transliterasi yang baik jika diperlukan). Tunjukkan aura seorang ustazah senior yang penyayang, sabar, namun profesional.
`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const modulText = response.text || "Gagal menghasilkan modul ajar.";
      res.json({ modul: modulText });
    } catch (error: any) {
      console.error("Error generating modul ajar:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Handle Vite middleware in development or serve built files in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
