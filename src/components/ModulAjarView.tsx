import React, { useState, useEffect } from "react";
import { SubjectType, LevelType, TPQIdentity } from "../types";
import { 
  Wand2, 
  Printer, 
  Copy, 
  Check, 
  FileCheck, 
  BookOpen, 
  ChevronRight, 
  RefreshCw, 
  Sparkles,
  HelpCircle,
  FileText,
  Lightbulb,
  GraduationCap,
  Mic,
  MicOff,
  UserPlus,
  Plus,
  Trash2,
  Star,
  FileSpreadsheet,
  Save,
  Users,
  Award,
  ExternalLink
} from "lucide-react";

interface ModulAjarViewProps {
  level: LevelType;
  subject: SubjectType;
  semester: 1 | 2;
  week: number;
  topicTitle: string;
  onExportToDocs: (content: string) => Promise<string | null>;
  isDocsExporting: boolean;
  exportedDocUrl: string | null;
  onExportCertificate?: (
    santriName: string,
    predikat: string,
    averageScore: number,
    totalEval: number
  ) => Promise<string | null>;
  isCertExporting?: boolean;
  exportedCertUrl?: string | null;
  tpqIdentity?: TPQIdentity;
}

interface EvaluationRecord {
  id: string;
  level: LevelType;
  semester: 1 | 2;
  week: number;
  subject: SubjectType;
  topicTitle: string;
  santriName: string;
  kategori: string;
  capaian: 1 | 2 | 3; // 3 = Sangat Baik, 2 = Baik, 1 = Perlu Bimbingan
  catatan: string;
  timestamp: string;
}

const DEFAULT_SANTRI: Record<LevelType, string[]> = {
  Dasar: ["Ahmad Zaki", "Fatimah Azzahra", "Aisyah Humaira", "Yusuf Al-Fatih", "Ibrahim Hakim", "Maryam Jamilah"],
  Menengah: ["Farhan Maulana", "Zahra Maulida", "Ali Shiddiq", "Hasan Bashri", "Husain Kamil", "Khadijah Kubra"],
  Lanjut: ["Salman Al-Farisi", "Luqmanul Hakim", "Hamzah Syuhada", "Safiyyah Mumtaz", "Bilal Rabah", "Hafsah Hasanah"]
};

const getAspectsForSubject = (subjectName: SubjectType): string[] => {
  switch (subjectName) {
    case "Tahsin & Tajwid":
      return ["Makhraj Huruf", "Sifat Huruf", "Kelancaran Hafalan", "Panjang Pendek (Mad)"];
    case "Adab & Akhlak":
      return ["Kesopanan & Adab", "Penerapan Praktis", "Sikap di Kelas", "Kehadiran & Keaktifan"];
    case "Hafalan Hadits":
      return ["Hafalan Lafal", "Ketepatan Makhraj", "Kebenaran Makna", "Fokus & Konsentrasi"];
    case "Hafalan Surat Pendek":
      return ["Kelancaran Hafalan", "Ketepatan Tajwid", "Fashohah", "Adab Membaca"];
    case "Fiqih Ibadah":
      return ["Gerakan Praktik", "Pemahaman Syarat/Rukun", "Kekhusyukan", "Tertib Urutan"];
    case "Sirah Nabawiyah":
      return ["Pemahaman Kisah", "Pelajaran & Hikmah", "Antusiasme", "Respon Pertanyaan"];
    default:
      return ["Kelancaran", "Tajwid", "Adab", "Partisipasi"];
  }
};

// 15+ Years Veteran Teacher Tips for loading screen rotation
const VETERAN_TIPS = [
  "Awali selalu kelas dengan senyum ceria, sapaan hangat, dan doa pembuka agar berkah melimpah.",
  "Metode Talaqqi (guru melafalkan, santri menirukan) adalah kunci keakuratan makhraj dan tajwid.",
  "Santri usia dasar (kelas 2-3 SD) lebih mudah mengingat lewat media kartu huruf (flashcards) dan tepukan ritmis.",
  "Utamakan adab sebelum ilmu. Ajarkan cara memegang mushaf Al-Qur'an dengan sopan dan penuh takzim.",
  "Selipkan game islami singkat (seperti estafet tajwid atau tebak arti surat) di menit ke-30 agar santri kembali fokus.",
  "Gunakan intonasi suara yang dinamis dan bersemangat. Jangan datar agar santri tidak mengantuk.",
  "Kisah Sirah Nabawiyah paling ampuh diceritakan dengan metode bermain peran atau dongeng ekspresif.",
  "Setoran hafalan sebaiknya dilakukan privat (sorogan) satu-per-satu untuk koreksi tajwid yang lebih presisi."
];

const LEVEL_PEDAGOGY_TIPS: Record<LevelType, {
  title: string;
  badge: string;
  description: string;
  colorClass: string;
  iconBg: string;
  borderClass: string;
  items: string[];
}> = {
  Dasar: {
    title: "Panduan Pedagogis Tingkat Dasar (Usia 5-8 Tahun)",
    badge: "Sensori & Kinetis",
    description: "Santri pada jenjang dasar berada pada fase pengenalan huruf hijaiyah dan pembiasaan adab harian. Fokuskan penyusunan materi pada aspek visual yang menyenangkan, suara makhraj yang jelas, serta gerakan kinetis ritmis.",
    colorClass: "bg-amber-50/50 text-amber-950 border-amber-200/60",
    iconBg: "bg-amber-100 text-amber-800",
    borderClass: "border-amber-200/50",
    items: [
      "Metode Talaqqi Visual: Tunjukkan bentuk mulut dan makhraj secara jelas saat melafalkan huruf, lalu ajak santri menirukan secara serentak.",
      "Tepuk & Ketukan Ritmis: Gunakan variasi tepukan tangan atau intonasi berirama untuk memudahkan hafalan hadits dan doa agar santri selalu ceria.",
      "Apresiasi Sederhana: Berikan pujian verbal interaktif atau tanda bintang prestasi kecil langsung di lembar kerja setelah mereka berhasil menyelesaikan setoran.",
      "Pendekatan Dongeng Teatrikal: Ajarkan kisah Sirah Nabawiyah dengan intonasi ekspresif dan gunakan peraga visual sederhana untuk menjaga fokus mereka."
    ]
  },
  Menengah: {
    title: "Panduan Pedagogis Tingkat Menengah (Usia 9-11 Tahun)",
    badge: "Konseptual & Mandiri",
    description: "Santri mulai mengenal hukum tajwid secara teoritis serta melafalkan surat yang lebih panjang. Tumbuhkan kebiasaan disiplin membaca mandiri, pemahaman ibadah praktis, serta rasa tanggung jawab belajar.",
    colorClass: "bg-emerald-50/40 text-emerald-950 border-emerald-200/50",
    iconBg: "bg-emerald-100 text-emerald-800",
    borderClass: "border-emerald-200/40",
    items: [
      "Hukum Tajwid Konkret: Selalu hubungkan penjelasan hukum tajwid (Ikhfa, Izhar, dll.) secara langsung pada mushaf Al-Qur'an daripada sekadar hafalan definisi.",
      "Metode Saling Simak (Peer Review): Biasakan melatih kemandirian santri untuk saling menyimak hafalan dengan teman sebangku sebelum maju menyetor ke Ustazah.",
      "Demonstrasi & Simulasi Nyata: Untuk materi Fiqih Ibadah, ajak santri mempraktikkan langsung (misalnya gerakan wudhu & shalat) secara terbimbing di kelas.",
      "Mutaba'ah Harian Mandiri: Didik santri untuk belajar mengisi perkembangan dan capaian murajaah harian mereka secara aktif guna melatih kejujuran."
    ]
  },
  Lanjut: {
    title: "Panduan Pedagogis Tingkat Lanjut (Usia 12-15+ Tahun)",
    badge: "Tadabbur & Pengabdian",
    description: "Santri didorong menyempurnakan ketepatan tajwid detail (makhraj & sifat huruf), memahami pesan moral di balik ayat (tadabbur), serta membiasakan diri berkontribusi bagi lingkungan sekitar.",
    colorClass: "bg-indigo-50/40 text-indigo-950 border-indigo-200/50",
    iconBg: "bg-indigo-100 text-indigo-800",
    borderClass: "border-indigo-200/40",
    items: [
      "Akurasi Tajwid Detail: Berikan perhatian khusus pada ketepatan ketukan mad (panjang) dan durasi dengung ghunnah yang stabil dan konsisten.",
      "Tadabbur & Refleksi Nilai: Diskusikan makna ringkas atau asbabun nuzul dari surat yang sedang dihafal, serta bagaimana mengamalkannya dalam adab pergaulan.",
      "Analisis Kritis Beradab: Berikan kesempatan santri untuk menganalisis dan saling memperbaiki makhraj rekan sejawatnya secara santun dan teratur.",
      "Sinergi Program Asisten (Khidmah): Ajak santri tingkat lanjut untuk sesekali membantu menyimak hafalan adik kelas tingkat dasar guna menumbuhkan jiwa pengabdian."
    ]
  }
};

export const ModulAjarView: React.FC<ModulAjarViewProps> = ({
  level,
  subject,
  semester,
  week,
  topicTitle,
  onExportToDocs,
  isDocsExporting,
  exportedDocUrl,
  onExportCertificate,
  isCertExporting = false,
  exportedCertUrl = null,
  tpqIdentity,
}) => {
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modulContent, setModulContent] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [currentTipIdx, setCurrentTipIdx] = useState(0);

  // Tab view selection
  const [activeViewTab, setActiveViewTab] = useState<"modul" | "evaluasi" | "split" | "sertifikat">("split");

  // Certificate State
  const [certStudent, setCertStudent] = useState<string>("");

  // Santri Management State
  const [santriList, setSantriList] = useState<string[]>([]);
  const [selectedSantri, setSelectedSantri] = useState<string>("");
  const [newSantriName, setNewSantriName] = useState<string>("");
  const [showManageStudents, setShowManageStudents] = useState(false);

  // Evaluation Form State
  const [selectedAspect, setSelectedAspect] = useState<string>("");
  const [evalRating, setEvalRating] = useState<1 | 2 | 3>(3); // 3 = Sangat Baik, 2 = Baik, 1 = Perlu Bimbingan
  const [evalNotes, setEvalNotes] = useState<string>("");

  // Evaluasi List / History Stored
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [micError, setMicError] = useState<string>("");

  // Load/Save Santri List
  useEffect(() => {
    const key = `tpq_santri_${level}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSantriList(parsed);
          setSelectedSantri(parsed[0]);
          return;
        }
      } catch (e) {
        console.error("Gagal membaca daftar santri", e);
      }
    }
    const defaults = DEFAULT_SANTRI[level] || [];
    setSantriList(defaults);
    setSelectedSantri(defaults[0] || "");
    localStorage.setItem(key, JSON.stringify(defaults));
  }, [level]);

  // Load Evaluations
  useEffect(() => {
    const stored = localStorage.getItem("tpq_evaluations");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setEvaluations(parsed);
        }
      } catch (e) {
        console.error("Gagal membaca evaluasi harian", e);
      }
    }
  }, []);

  // Set default aspect when subject changes
  useEffect(() => {
    const aspects = getAspectsForSubject(subject);
    if (aspects.length > 0) {
      setSelectedAspect(aspects[0]);
    }
  }, [subject]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "id-ID";

      rec.onstart = () => {
        setIsListening(true);
        setMicError("");
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setEvalNotes((prev) => {
          const space = prev ? " " : "";
          return prev + space + transcript;
        });
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          setMicError("Akses mikrofon ditolak oleh browser.");
        } else if (event.error === "no-speech") {
          setMicError("Suara tidak terdengar. Silakan coba lagi.");
        } else {
          setMicError("Terjadi kesalahan mikrofon: " + event.error);
        }
        setIsListening(false);
      };

      setRecognition(rec);
    } else {
      setMicError("Browser tidak mendukung input suara.");
    }
  }, []);

  const handleToggleListening = () => {
    if (!recognition) {
      setMicError("Input suara tidak didukung di browser ini.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setMicError("");
      try {
        recognition.start();
      } catch (err) {
        console.error("Speech start error:", err);
      }
    }
  };

  const handleSaveEvaluation = () => {
    if (!selectedSantri) {
      alert("Pilih atau tambahkan nama santri terlebih dahulu.");
      return;
    }

    const newRecord: EvaluationRecord = {
      id: Math.random().toString(36).substring(2, 9),
      level,
      semester,
      week,
      subject,
      topicTitle,
      santriName: selectedSantri,
      kategori: selectedAspect,
      capaian: evalRating,
      catatan: evalNotes.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + ", " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    };

    const updated = [newRecord, ...evaluations];
    setEvaluations(updated);
    localStorage.setItem("tpq_evaluations", JSON.stringify(updated));
    setEvalNotes("");
  };

  const handleAddSantri = () => {
    const trimmed = newSantriName.trim();
    if (!trimmed) return;
    if (santriList.includes(trimmed)) {
      alert("Nama santri ini sudah terdaftar.");
      return;
    }
    const updated = [...santriList, trimmed];
    setSantriList(updated);
    setSelectedSantri(trimmed);
    setNewSantriName("");
    localStorage.setItem(`tpq_santri_${level}`, JSON.stringify(updated));
  };

  const handleRemoveSantri = (nameToRemove: string) => {
    const updated = santriList.filter((s) => s !== nameToRemove);
    setSantriList(updated);
    if (selectedSantri === nameToRemove) {
      setSelectedSantri(updated[0] || "");
    }
    localStorage.setItem(`tpq_santri_${level}`, JSON.stringify(updated));
  };

  const handleDeleteEvaluation = (id: string) => {
    const updated = evaluations.filter((item) => item.id !== id);
    setEvaluations(updated);
    localStorage.setItem("tpq_evaluations", JSON.stringify(updated));
  };

  const handlePrintEvaluations = () => {
    const records = evaluations.filter(
      (e) => e.level === level && e.semester === semester && e.week === week && e.subject === subject
    );
    if (records.length === 0) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rows = records.map(
      (r) => `
      <tr>
        <td style="font-weight: bold; padding: 12px; border: 1px solid #E8E2D9;">${r.santriName}</td>
        <td style="padding: 12px; border: 1px solid #E8E2D9;">${r.kategori}</td>
        <td style="padding: 12px; border: 1px solid #E8E2D9; text-align: center;">
          ${"★".repeat(r.capaian)} <span style="font-size: 11px; color: #666;">(${r.capaian === 3 ? 'Sangat Baik' : r.capaian === 2 ? 'Baik' : 'Bimbingan'})</span>
        </td>
        <td style="padding: 12px; border: 1px solid #E8E2D9; font-style: italic;">${r.catatan || "-"}</td>
      </tr>
    `
    ).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Lembar Evaluasi Harian - TPQ Hubbul Qur'an</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #3E362E; background-color: #FDFBF7; }
            h1, h2 { font-family: 'Cormorant Garamond', serif; text-align: center; }
            h1 { color: #2C331F; border-bottom: 2px solid #D2B48C; padding-bottom: 8px; margin-bottom: 4px; font-size: 24px; }
            h2 { color: #556B2F; font-size: 16px; margin-top: 0; font-weight: normal; margin-bottom: 24px; }
            .meta-box { border: 1.5px solid #556B2F; border-radius: 12px; padding: 16px; margin-bottom: 24px; background: #FFF; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; background: #FFF; }
            th { background-color: #F9F6F0; font-weight: bold; padding: 12px; border: 1px solid #E8E2D9; font-size: 13px; text-align: left; color: #556B2F; }
            td { font-size: 13px; }
            .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 13px; }
            .signature { text-align: center; margin-top: 60px; font-weight: bold; border-top: 1px solid #3E362E; width: 200px; padding-top: 4px; }
            @media print {
              body { padding: 0; background-color: #fff; }
            }
          </style>
        </head>
        <body>
          <h1>LEMBAR EVALUASI HARIAN SANTRI</h1>
          <h2>TPQ HUBBUL QUR'AN</h2>
          
          <div class="meta-box">
            <div class="meta-grid">
              <div><strong>Nama Guru:</strong> Ustazah Ananda Rahmi Annisa</div>
              <div><strong>Jenjang:</strong> Level ${level}</div>
              <div><strong>Pelajaran:</strong> ${subject}</div>
              <div><strong>Pekan:</strong> Minggu ke-${week} (Sem. ${semester})</div>
              <div style="grid-column: span 2;"><strong>Materi Pokok:</strong> ${topicTitle}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 25%;">Nama Santri</th>
                <th style="width: 25%;">Aspek Dinilai</th>
                <th style="width: 20%; text-align: center;">Capaian</th>
                <th style="width: 30%;">Catatan Perkembangan</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="footer">
            <div>Mengetahui,<br>Kepala TPQ Hubbul Qur'an</div>
            <div>
              Yogyakarta, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br>
              Guru Pengajar,
              <br><br><br>
              <div class="signature">Ustazah Ananda Rahmi Annisa</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Auto-select first student for certificate when tab is loaded or level/semester changes
  useEffect(() => {
    const list = evaluations
      .filter((e) => e.level === level && e.semester === semester)
      .map((e) => e.santriName);
    const unique = Array.from(new Set(list));
    if (unique.length > 0) {
      setCertStudent(unique[0]);
    } else if (santriList.length > 0) {
      setCertStudent(santriList[0]);
    } else {
      setCertStudent("");
    }
  }, [level, semester, evaluations, santriList]);

  const handlePrintCertificate = () => {
    if (!certStudent) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Calculate stats
    const studentSemesterEvals = evaluations.filter(
      (e) => e.level === level && e.semester === semester && e.santriName === certStudent
    );
    const totalEvalCount = studentSemesterEvals.length;
    const averageScore = totalEvalCount > 0
      ? studentSemesterEvals.reduce((acc, curr) => acc + curr.capaian, 0) / totalEvalCount
      : 3.0;

    let predikat = "Mumtaz (Istimewa)";
    if (averageScore >= 2.6) {
      predikat = "Mumtaz (Istimewa)";
    } else if (averageScore >= 2.0) {
      predikat = "Jayyid Jiddan (Sangat Baik)";
    } else if (averageScore >= 1.5) {
      predikat = "Jayyid (Baik)";
    } else {
      predikat = "Maqbul (Cukup)";
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Sertifikat Kelulusan - ${certStudent}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #3E362E;
              background-color: #FDFBF7;
              padding: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 80vh;
            }
            .certificate-border {
              border: 15px solid #2C331F;
              padding: 10px;
              background-color: #FFF;
              width: 100%;
              max-width: 800px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.05);
              position: relative;
            }
            .certificate-inner {
              border: 3px double #D2B48C;
              padding: 40px;
              text-align: center;
            }
            .certificate-badge {
              font-size: 50px;
              margin-bottom: 20px;
              color: #556B2F;
            }
            h1 {
              font-family: 'Cormorant Garamond', serif;
              font-size: 32px;
              color: #2C331F;
              margin: 0 0 10px 0;
              letter-spacing: 2px;
              font-weight: 700;
            }
            h2 {
              font-family: 'Cormorant Garamond', serif;
              font-size: 18px;
              color: #D2B48C;
              margin: 0 0 30px 0;
              letter-spacing: 3px;
              font-weight: 600;
            }
            .award-to {
              font-style: italic;
              font-size: 14px;
              color: #666;
              margin-bottom: 15px;
            }
            .student-name {
              font-family: 'Cormorant Garamond', serif;
              font-size: 36px;
              font-weight: bold;
              color: #2C331F;
              border-bottom: 2px solid #D2B48C;
              display: inline-block;
              padding-bottom: 5px;
              margin-bottom: 25px;
              text-transform: uppercase;
            }
            .award-desc {
              font-size: 14px;
              line-height: 1.6;
              margin-bottom: 30px;
              max-width: 600px;
              margin-left: auto;
              margin-right: auto;
            }
            .stats-box {
              display: inline-grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              background: #F9F6F0;
              border: 1px solid #E8E2D9;
              border-radius: 8px;
              padding: 15px 30px;
              margin-bottom: 40px;
            }
            .stat-item {
              text-align: center;
            }
            .stat-label {
              font-size: 10px;
              color: #888;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 4px;
            }
            .stat-value {
              font-size: 14px;
              font-weight: bold;
              color: #2C331F;
            }
            .footer-sign {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
              padding: 0 40px;
              font-size: 12px;
            }
            .signature {
              border-top: 1px solid #3E362E;
              width: 180px;
              margin-top: 50px;
              padding-top: 5px;
              font-weight: bold;
            }
            @media print {
              body { padding: 0; background-color: #fff; }
              .certificate-border { box-shadow: none; max-width: 100%; border-width: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-border">
            <div class="certificate-inner">
              <div class="certificate-badge">🎓</div>
              <h1>SERTIFIKAT KELULUSAN SEMESTER</h1>
              <h2>${tpqIdentity?.namaTPQ?.toUpperCase() || "TPQ HUBBUL QUR'AN YOGYAKARTA"}</h2>
              
              <div class="award-to">Diberikan kepada santri tercinta:</div>
              <div class="student-name">${certStudent}</div>
              
              <div class="award-desc">
                Telah lulus dan berhasil menyelesaikan pembelajaran kurikulum Al-Qur'an secara terintegrasi pada jenjang <strong>Level ${level} (Semester ${semester})</strong> di bawah bimbingan guru pengajar senior ${tpqIdentity?.namaTPQ || "TPQ Hubbul Qur'an"}.
              </div>

              <div class="stats-box">
                <div class="stat-item">
                  <div class="stat-label">Total Evaluasi</div>
                  <div class="stat-value">${totalEvalCount} Pekan</div>
                </div>
                <div class="stat-item" style="border-left: 1px solid #E8E2D9; border-right: 1px solid #E8E2D9; padding: 0 20px;">
                  <div class="stat-label">Rata-rata Nilai</div>
                  <div class="stat-value">${averageScore.toFixed(2)} / 3.00</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">Predikat Kelulusan</div>
                  <div class="stat-value" style="color: #556B2F;">${predikat.split(" (")[0]}</div>
                </div>
              </div>

              <div class="footer-sign">
                <div style="text-align: left;">
                  Mengetahui,<br>Kepala ${tpqIdentity?.namaTPQ || "TPQ Hubbul Qur'an"}
                  <div class="signature">${tpqIdentity?.kepalaTPQ || "Ustadz K.H. Ahmad Syarif, M.A."}</div>
                </div>
                <div style="text-align: right;">
                  ${tpqIdentity?.alamatTPQ?.split(",")[0] || "Yogyakarta"}, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br>
                  Guru Pengajar,
                  <div class="signature">${tpqIdentity?.guruPembimbing || "Ustazah Ananda Rahmi Annisa"}</div>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportCertClick = async () => {
    if (!certStudent || !onExportCertificate) return;

    // Calculate stats
    const studentSemesterEvals = evaluations.filter(
      (e) => e.level === level && e.semester === semester && e.santriName === certStudent
    );
    const totalEvalCount = studentSemesterEvals.length;
    const averageScore = totalEvalCount > 0
      ? studentSemesterEvals.reduce((acc, curr) => acc + curr.capaian, 0) / totalEvalCount
      : 3.0;

    let predikat = "Mumtaz (Istimewa)";
    if (averageScore >= 2.6) {
      predikat = "Mumtaz (Istimewa)";
    } else if (averageScore >= 2.0) {
      predikat = "Jayyid Jiddan (Sangat Baik)";
    } else if (averageScore >= 1.5) {
      predikat = "Jayyid (Baik)";
    } else {
      predikat = "Maqbul (Cukup)";
    }

    await onExportCertificate(certStudent, predikat, averageScore, totalEvalCount);
  };

  const currentAspects = getAspectsForSubject(subject);

  // Rotate tips every 4 seconds while loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentTipIdx((prev) => (prev + 1) % VETERAN_TIPS.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setModulContent("");
    
    try {
      const response = await fetch("/api/generate-modul", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level,
          subject,
          semester,
          week,
          topic: topicTitle,
          additionalInstructions,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyusun modul ajar.");
      }

      const data = await response.json();
      setModulContent(data.modul);
    } catch (err: any) {
      console.error(err);
      setModulContent(`### Terjadi Kesalahan\n\nMaaf, gagal menyusun Modul Ajar. Pastikan koneksi internet stabil atau kunci API terkonfigurasi dengan benar.\n\nError: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(modulContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Modul Ajar - TPQ Hubbul Qur'an</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
            
            body { 
              font-family: 'Inter', sans-serif; 
              line-height: 1.6; 
              padding: 40px; 
              color: #2C331F; 
              background-color: #FFF; 
            }

            .kop-surat {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 20px;
              margin-bottom: 12px;
              border-bottom: 3px double #2C331F;
              padding-bottom: 16px;
            }

            .kop-logo {
              font-size: 48px;
              line-height: 1;
            }

            .kop-text {
              text-align: center;
            }

            .kop-yayasan {
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 1.5px;
              color: #556B2F;
              margin: 0;
            }

            .kop-tpq {
              font-family: 'Cormorant Garamond', serif;
              font-size: 22px;
              font-weight: 700;
              color: #2C331F;
              margin: 2px 0;
              letter-spacing: 0.5px;
            }

            .kop-alamat {
              font-size: 10px;
              color: #666;
              margin: 0;
              font-style: italic;
            }

            .doc-title {
              font-family: 'Cormorant Garamond', serif;
              font-size: 20px;
              font-weight: 700;
              color: #2C331F;
              text-align: center;
              margin: 20px 0 4px 0;
              letter-spacing: 1px;
              text-transform: uppercase;
            }

            .doc-subtitle {
              font-size: 11px;
              color: #556B2F;
              text-align: center;
              font-weight: 700;
              margin: 0 0 24px 0;
              text-transform: uppercase;
              letter-spacing: 1.5px;
            }

            .section-header {
              font-family: 'Inter', sans-serif;
              font-size: 12px;
              font-weight: 700;
              color: #2C331F;
              background-color: #F9F6F0;
              padding: 6px 12px;
              border-left: 4px solid #556B2F;
              margin-top: 24px;
              margin-bottom: 12px;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }

            .meta-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }

            .meta-table td {
              border: none !important;
              padding: 4px 12px !important;
              font-size: 12.5px !important;
              color: #3E362E;
              vertical-align: top;
            }

            .content-body h2 {
              font-family: 'Cormorant Garamond', serif;
              color: #2C331F;
              border-bottom: 1px solid #D2B48C;
              padding-bottom: 4px;
              font-size: 17px;
              margin-top: 24px;
              margin-bottom: 12px;
              font-weight: 700;
              text-transform: uppercase;
              page-break-after: avoid;
            }

            .content-body h3 {
              font-family: 'Cormorant Garamond', serif;
              color: #556B2F;
              font-size: 14.5px;
              margin-top: 16px;
              margin-bottom: 8px;
              font-weight: 700;
              page-break-after: avoid;
            }

            .content-body p {
              font-size: 12.5px;
              margin-bottom: 12px;
              color: #3E362E;
              text-align: justify;
              line-height: 1.6;
            }

            .print-list {
              margin-left: 20px;
              margin-bottom: 16px;
              padding-left: 0;
            }

            .print-list li {
              font-size: 12.5px;
              margin-bottom: 6px;
              color: #3E362E;
              line-height: 1.5;
            }

            ul.print-list {
              list-style-type: square;
            }

            ul.print-list li::marker {
              color: #556B2F;
            }

            .print-table {
              width: 100%;
              border-collapse: collapse;
              margin: 16px 0;
              page-break-inside: avoid;
            }

            .print-table th, .print-table td {
              border: 1px solid #D2B48C;
              padding: 8px 10px;
              font-size: 12px;
              text-align: left;
            }

            .print-table th {
              background-color: #F9F6F0;
              color: #2C331F;
              font-weight: 700;
            }

            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 48px;
              page-break-inside: avoid;
            }

            .signature-box {
              width: 240px;
              font-size: 12px;
              color: #3E362E;
              line-height: 1.5;
            }

            .signature-line {
              margin-top: 60px;
              font-weight: 700;
              border-top: 1.5px solid #2C331F;
              padding-top: 4px;
              color: #2C331F;
            }

            @media print {
              @page {
                size: A4;
                margin: 20mm;
              }
              body {
                padding: 0;
                background-color: #FFF;
                color: #000;
              }
              .section-header {
                background-color: #F5F5F5 !important;
                border-left-color: #000 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .print-table th {
                background-color: #F5F5F5 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .kop-yayasan {
                color: #000;
              }
              .signature-line {
                border-top-color: #000;
              }
            }
          </style>
        </head>
        <body>
          <!-- KOP SURAT RESMI -->
          <div class="kop-surat">
            <div class="kop-logo">🕌</div>
            <div class="kop-text">
              <p class="kop-yayasan">YAYASAN HUBBUL QUR'AN YOGYAKARTA</p>
              <h2 class="kop-tpq">TAMAN PENDIDIKAN AL-QUR'AN (TPQ) HUBBUL QUR'AN</h2>
              <p class="kop-alamat">Sekretariat: Jl. Kaliurang KM 5.5, Kec. Depok, Sleman, DI Yogyakarta | HP: 0812-3456-7890</p>
            </div>
          </div>

          <!-- DOKUMEN JUDUL -->
          <h1 class="doc-title">RENCANA PELAKSANAAN PEMBELAJARAN (RPP) / MODUL AJAR</h1>
          <div class="doc-subtitle">Kurikulum Integrasi Pembelajaran TPQ Hubbul Qur'an</div>

          <!-- IDENTITAS MODUL -->
          <div class="section-header">I. Identitas Modul Pembelajaran</div>
          <table class="meta-table">
            <tr>
              <td style="width: 25%; font-weight: bold;">Nama Guru Pengajar</td>
              <td style="width: 3%; text-align: center;">:</td>
              <td style="width: 72%;">Ustazah Ananda Rahmi Annisa</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Satuan Pendidikan</td>
              <td style="text-align: center;">:</td>
              <td>TPQ Hubbul Qur'an Yogyakarta</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Mata Pelajaran</td>
              <td style="text-align: center;">:</td>
              <td>${subject}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Jenjang Pembelajaran</td>
              <td style="text-align: center;">:</td>
              <td>Level ${level} (Semester ${semester})</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Minggu / Pekan Ke</td>
              <td style="text-align: center;">:</td>
              <td>Pekan ${week}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Alokasi Waktu Sesi</td>
              <td style="text-align: center;">:</td>
              <td>60 Menit (2 Sesi Pertemuan)</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Materi Utama (Topik)</td>
              <td style="text-align: center;">:</td>
              <td style="font-weight: bold; color: #556B2F;">${topicTitle}</td>
            </tr>
          </table>

          <!-- MATERI UTAMA / KONTEN MODUL -->
          <div class="section-header">II. Rencana Kegiatan & Deskripsi Materi</div>
          <div class="content-body">
            ${customMarkdownToHTML(modulContent)}
          </div>

          <!-- TANDA TANGAN GURU -->
          <div class="signature-section">
            <div class="signature-box">
              <div>Mengetahui,</div>
              <div style="font-weight: bold; margin-top: 2px;">Kepala TPQ Hubbul Qur'an</div>
              <div class="signature-line">Ustadz K.H. Ahmad Syarif, M.A.</div>
            </div>
            <div class="signature-box" style="text-align: right;">
              <div>Yogyakarta, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
              <div style="font-weight: bold; margin-top: 2px;">Guru Pengajar,</div>
              <div class="signature-line">Ustazah Ananda Rahmi Annisa</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // High-fidelity block-level Markdown to HTML converter for professional printing
  function customMarkdownToHTML(md: string): string {
    const lines = md.split("\n");
    let html = "";
    let inList = false;
    let listType: "ul" | "ol" | null = null;
    let inTable = false;

    const parseInline = (text: string): string => {
      return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code>$1</code>");
    };

    for (let line of lines) {
      const trimmed = line.trim();

      // Skip empty lines
      if (trimmed === "") {
        if (inList) {
          html += `</${listType}>`;
          inList = false;
          listType = null;
        }
        if (inTable) {
          html += "</tbody></table>";
          inTable = false;
        }
        continue;
      }

      // Headers
      if (trimmed.startsWith("# ")) {
        if (inList) { html += `</${listType}>`; inList = false; listType = null; }
        if (inTable) { html += "</tbody></table>"; inTable = false; }
        html += `<h1>${parseInline(trimmed.substring(2))}</h1>`;
        continue;
      }
      if (trimmed.startsWith("## ")) {
        if (inList) { html += `</${listType}>`; inList = false; listType = null; }
        if (inTable) { html += "</tbody></table>"; inTable = false; }
        html += `<h2>${parseInline(trimmed.substring(3))}</h2>`;
        continue;
      }
      if (trimmed.startsWith("### ")) {
        if (inList) { html += `</${listType}>`; inList = false; listType = null; }
        if (inTable) { html += "</tbody></table>"; inTable = false; }
        html += `<h3>${parseInline(trimmed.substring(4))}</h3>`;
        continue;
      }

      // Bullet Lists
      const bulletMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
      if (bulletMatch) {
        if (inTable) { html += "</tbody></table>"; inTable = false; }
        if (!inList || listType !== "ul") {
          if (inList) html += `</${listType}>`;
          html += '<ul class="print-list">';
          inList = true;
          listType = "ul";
        }
        html += `<li>${parseInline(bulletMatch[2])}</li>`;
        continue;
      }

      // Numbered Lists
      const numberMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
      if (numberMatch) {
        if (inTable) { html += "</tbody></table>"; inTable = false; }
        if (!inList || listType !== "ol") {
          if (inList) html += `</${listType}>`;
          html += '<ol class="print-list">';
          inList = true;
          listType = "ol";
        }
        html += `<li>${parseInline(numberMatch[3])}</li>`;
        continue;
      }

      // Tables
      if (trimmed.startsWith("|")) {
        if (inList) { html += `</${listType}>`; inList = false; listType = null; }
        if (trimmed.includes("---")) {
          continue;
        }
        const cells = trimmed
          .split("|")
          .map((c) => c.trim())
          .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);

        if (!inTable) {
          html += '<table class="print-table"><thead><tr>';
          cells.forEach((cell) => {
            html += `<th>${parseInline(cell)}</th>`;
          });
          html += "</tr></thead><tbody>";
          inTable = true;
        } else {
          html += "<tr>";
          cells.forEach((cell) => {
            html += `<td>${parseInline(cell)}</td>`;
          });
          html += "</tr>";
        }
        continue;
      } else {
        if (inTable) {
          html += "</tbody></table>";
          inTable = false;
        }
      }

      // Standard paragraphs
      if (inList) {
        html += `</${listType}>`;
        inList = false;
        listType = null;
      }
      html += `<p>${parseInline(trimmed)}</p>`;
    }

    if (inList) {
      html += `</${listType}>`;
    }
    if (inTable) {
      html += "</tbody></table>";
    }

    return html;
  }

  // React-based safe Markdown renderer for interactive screen view
  const renderMarkdown = (md: string) => {
    const lines = md.split("\n");
    let inList = false;
    let listType: "ul" | "ol" | null = null;
    
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        return <div key={idx} className="h-2"></div>;
      }

      // Headers
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="text-sm font-bold text-sage font-serif mt-4 mb-2 border-l-3 border-sage pl-2">
            {parseInlineStyles(trimmed.substring(3))}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={idx} className="text-base font-bold text-sage-dark font-serif mt-6 mb-3 pb-1 border-b border-[#E8E2D9]">
            {parseInlineStyles(trimmed.substring(2))}
          </h3>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={idx} className="text-lg font-black text-sage-deep font-serif mt-8 mb-4 text-center tracking-tight">
            {parseInlineStyles(trimmed.substring(1))}
          </h2>
        );
      }

      // Bullet Lists
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-4 my-1.5 font-sans text-sm text-[#3E362E]">
            <span className="text-sage mt-1 flex-shrink-0">•</span>
            <div className="flex-1">{parseInlineStyles(trimmed.substring(1).trim())}</div>
          </div>
        );
      }

      // Numbered Lists
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-4 my-1.5 font-sans text-sm text-[#3E362E]">
            <span className="font-bold text-sage min-w-[20px] flex-shrink-0">{numMatch[1]}.</span>
            <div className="flex-1">{parseInlineStyles(numMatch[2])}</div>
          </div>
        );
      }

      // Horizontal line
      if (trimmed === "---" || trimmed === "===") {
        return <hr key={idx} className="my-5 border-[#E8E2D9]" />;
      }

      // Blockquote/Quran Quote styling
      if (trimmed.startsWith(">")) {
        return (
          <div key={idx} className="bg-[#F9F6F0] border-l-4 border-sage p-3.5 my-3 rounded-r-xl italic font-sans text-sm text-[#2C331F] leading-relaxed">
            {parseInlineStyles(trimmed.substring(1).trim())}
          </div>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-sm text-gray-800 font-sans leading-relaxed my-2.5">
          {parseInlineStyles(trimmed)}
        </p>
      );
    });
  };

  // Helper to parse inline styles like **bold**
  const parseInlineStyles = (text: string) => {
    const parts = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    let keyIdx = 0;

    while ((match = boldRegex.exec(text)) !== null) {
      const textBefore = text.substring(lastIndex, match.index);
      if (textBefore) {
        parts.push(<span key={keyIdx++}>{textBefore}</span>);
      }
      parts.push(<strong key={keyIdx++} className="font-bold text-sage-deep">{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }

    const remaining = text.substring(lastIndex);
    if (remaining) {
      parts.push(<span key={keyIdx++}>{remaining}</span>);
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-clay-light shadow-xs p-6">
      {/* Target details */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-clay-light pb-5 mb-5 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase bg-sage text-white px-2 py-0.5 rounded-md">
              Level {level}
            </span>
            <span className="text-[10px] font-bold uppercase bg-clay text-sage-deep px-2 py-0.5 rounded-md">
              Semester {semester}
            </span>
            <span className="text-[10px] font-bold uppercase bg-clay-light text-natural-dark px-2 py-0.5 rounded-md">
              Minggu {week}
            </span>
          </div>
          <h2 className="text-xl font-bold text-natural-dark font-serif mt-2">
            {subject}
          </h2>
          <p className="text-sm font-semibold text-sage font-sans mt-0.5">
            Topik: {topicTitle}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="w-full">
            <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1">
              Guru Pengajar
            </label>
            <div className="bg-[#F9F6F0] border border-clay-light rounded-lg px-3 py-1.5 text-xs text-natural-dark font-bold">
              Ustazah Ananda Rahmi Annisa
            </div>
          </div>
        </div>
      </div>

      {/* View Selection Tab Switcher */}
      <div className="flex border-b border-clay-light pb-4 mb-5 gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveViewTab("modul")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeViewTab === "modul"
              ? "bg-sage text-white shadow-2xs"
              : "bg-[#F9F6F0] hover:bg-clay/20 text-clay-dark hover:text-natural-dark"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📄 Modul Ajar</span>
        </button>

        <button
          onClick={() => setActiveViewTab("evaluasi")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeViewTab === "evaluasi"
              ? "bg-sage text-white shadow-2xs"
              : "bg-[#F9F6F0] hover:bg-clay/20 text-clay-dark hover:text-natural-dark"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>✍️ Lembar Evaluasi Harian</span>
        </button>

        <button
          onClick={() => setActiveViewTab("split")}
          className={`hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeViewTab === "split"
              ? "bg-sage text-white shadow-2xs"
              : "bg-[#F9F6F0] hover:bg-clay/20 text-clay-dark hover:text-natural-dark"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>🖥️ Layar Split (Berdampingan)</span>
        </button>

        <button
          onClick={() => setActiveViewTab("sertifikat")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeViewTab === "sertifikat"
              ? "bg-sage text-white shadow-2xs"
              : "bg-[#F9F6F0] hover:bg-clay/20 text-clay-dark hover:text-natural-dark"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>🎓 Draf Sertifikat Kelulusan</span>
        </button>
      </div>

      <div className={`grid grid-cols-1 ${activeViewTab === "split" ? "xl:grid-cols-2" : ""} gap-6 items-start`}>
        
        {/* LEFT COLUMN: Modul Ajar Panel */}
        {activeViewTab !== "sertifikat" && (activeViewTab === "modul" || activeViewTab === "split") && (
          <div className="space-y-6">
            {/* Tips Ustazah - Dynamic Pedagogical Guide */}
            {LEVEL_PEDAGOGY_TIPS[level] && (
              <div className={`rounded-2xl border p-5 transition-all duration-300 ${LEVEL_PEDAGOGY_TIPS[level].colorClass} ${LEVEL_PEDAGOGY_TIPS[level].borderClass}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${LEVEL_PEDAGOGY_TIPS[level].iconBg}`}>
                      <Lightbulb className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-natural-dark font-serif">
                        Tips Ustazah: Panduan Pedagogis
                      </h3>
                      <p className="text-[10px] text-clay-dark font-sans leading-none mt-0.5">
                        Saran pengajaran praktis dari guru senior TPQ
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-center text-[10px] font-bold uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-md border border-black/5">
                    💡 {LEVEL_PEDAGOGY_TIPS[level].badge}
                  </span>
                </div>

                <p className="text-xs text-natural-dark/95 leading-relaxed mb-4">
                  {LEVEL_PEDAGOGY_TIPS[level].description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LEVEL_PEDAGOGY_TIPS[level].items.map((item, index) => {
                    const [title, desc] = item.split(": ");
                    return (
                      <div key={index} className="bg-white/45 p-3 rounded-xl border border-black/5 flex gap-2">
                        <span className="text-xs font-bold text-sage-deep/80 mt-0.5 flex-shrink-0">
                          0{index + 1}.
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-natural-dark font-serif">
                            {title}
                          </h4>
                          <p className="text-[11px] text-clay-dark leading-relaxed mt-0.5 font-sans">
                            {desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input custom instructions */}
            <div className="bg-[#F9F6F0] rounded-xl border border-clay-light p-4">
              <label className="block text-xs font-bold text-sage mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sage" />
                <span>Instruksi Tambahan untuk Penyusunan AI (Opsional)</span>
              </label>
              <textarea
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="Contoh: Tambahkan lagu Islami bernada 'Balonku' untuk menghafal hadits, fokuskan pada nilai kejujuran..."
                rows={2}
                className="w-full text-xs bg-white rounded-lg border border-clay-light p-3 focus:outline-hidden focus:ring-2 focus:ring-sage/20 text-natural-dark placeholder-clay-dark"
              />
              <div className="flex items-center justify-between mt-3.5 gap-2">
                <p className="text-[10px] text-clay-dark italic font-serif">
                  Didukung oleh model AI Studio Gemini-2.5-Flash
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 bg-sage hover:bg-sage-dark text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5" />
                  )}
                  <span>{modulContent ? "Susun Ulang Modul" : "Susun Modul Ajar"}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Load Screen with rotating tips */}
            {isLoading && (
              <div className="border border-clay-light rounded-2xl p-8 bg-[#F9F6F0]/40 flex flex-col items-center justify-center min-h-[350px] animate-pulse">
                <div className="w-14 h-14 rounded-full bg-clay-light/30 border border-clay-light flex items-center justify-center mb-5">
                  <RefreshCw className="w-6 h-6 text-sage animate-spin" />
                </div>
                <h3 className="text-sm font-bold text-sage-deep font-serif tracking-tight text-center">
                  Ustadzah Senior sedang menyusun Modul Ajar...
                </h3>
                <p className="text-xs text-clay-dark mt-1 max-w-sm text-center">
                  Model AI sedang mensintesis materi fiqih, tahsin, adab, dan sirah sesuai dengan usia santri.
                </p>
                
                {/* Guru TPQ veteran tips carousel */}
                <div className="mt-8 max-w-md bg-white border border-clay-light rounded-xl p-4 shadow-2xs relative">
                  <div className="absolute -top-2.5 left-4 bg-sage text-white font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Tip Guru TPQ (15+ Thn Pengalaman)
                  </div>
                  <p className="text-xs italic text-clay-dark leading-relaxed text-left mt-1.5 transition-all duration-500">
                    "{VETERAN_TIPS[currentTipIdx]}"
                  </p>
                </div>
              </div>
            )}

            {/* Placeholder state before generation */}
            {!isLoading && !modulContent && (
              <div className="border border-dashed border-clay rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 rounded-full bg-[#FDFBF7] flex items-center justify-center mb-3.5 border border-clay-light">
                  <BookOpen className="w-6 h-6 text-clay-dark" />
                </div>
                <h3 className="text-sm font-bold text-natural-dark font-serif">
                  Modul Ajar Belum Disusun
                </h3>
                <p className="text-xs text-clay-dark mt-1 max-w-xs font-sans">
                  Pilih materi dari tabel silabus di sebelah kiri, masukkan instruksi opsional, lalu klik tombol <strong>"Susun Modul Ajar"</strong> di atas.
                </p>
              </div>
            )}

            {/* Rendered Modul Ajar */}
            {!isLoading && modulContent && (
              <div className="border border-clay-light rounded-2xl overflow-hidden bg-white shadow-xs">
                {/* Modul Toolbar */}
                <div className="bg-[#F9F6F0] border-b border-clay-light p-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-sage-deep font-bold text-xs">
                    <FileCheck className="w-4 h-4 text-sage" />
                    <span>Modul Pembelajaran Siap Cetak</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 bg-white hover:bg-[#F9F6F0] text-natural-dark px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-clay-light shadow-2xs transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-sage" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-clay-dark" />
                          <span>Salin Teks</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1 bg-white hover:bg-[#F9F6F0] text-natural-dark px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-clay-light shadow-2xs transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-clay-dark" />
                      <span>Cetak PDF</span>
                    </button>

                    <button
                      onClick={() => onExportToDocs(modulContent)}
                      disabled={isDocsExporting}
                      className="flex items-center gap-1.5 bg-sage hover:bg-sage-dark disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      {isDocsExporting ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-white/80" />
                      )}
                      <span>Ekspor ke Docs</span>
                    </button>
                  </div>
                </div>

                {/* Export Success Message */}
                {exportedDocUrl && (
                  <div className="bg-clay-light/25 border-b border-clay-light p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-natural-dark font-medium">
                      <Check className="w-4 h-4 text-sage" />
                      <span>Dokumen Google Docs berhasil dibuat di Google Drive Anda!</span>
                    </div>
                    <a
                      href={exportedDocUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 bg-sage hover:bg-sage-dark text-white text-[11px] font-bold px-3 py-1 rounded-md transition-colors shadow-2xs"
                    >
                      <span>Buka Google Docs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Modul Content Sheet */}
                <div className="p-6 md:p-8 max-h-[550px] overflow-y-auto bg-white/40 prose max-w-none text-left">
                  {renderMarkdown(modulContent)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RIGHT COLUMN: Lembar Evaluasi Panel */}
        {activeViewTab !== "sertifikat" && (activeViewTab === "evaluasi" || activeViewTab === "split") && (
          <div className="space-y-6">
            
            {/* Input Form Card */}
            <div className="bg-[#F9F6F0]/60 rounded-2xl border border-clay-light p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-clay-light pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center text-sage">
                    <FileSpreadsheet className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-natural-dark font-serif">Input Penilaian Santri</h3>
                    <p className="text-[10px] text-clay-dark font-sans leading-none mt-0.5">Catat perkembangan santri secara langsung</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowManageStudents(!showManageStudents)}
                  className="flex items-center gap-1 text-[10px] font-bold text-sage hover:text-sage-dark bg-white border border-clay-light px-2.5 py-1 rounded-md shadow-3xs transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{showManageStudents ? "Tutup Kelola" : "Kelola Nama"}</span>
                </button>
              </div>

              {/* Manage Students Drawer */}
              {showManageStudents && (
                <div className="bg-white rounded-xl border border-clay-light p-3.5 space-y-3 animate-none">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-natural-dark font-serif flex items-center gap-1">
                      <UserPlus className="w-3.5 h-3.5 text-sage" />
                      <span>Daftar Santri Terdaftar (Level {level})</span>
                    </h4>
                    <span className="text-[9px] bg-[#F9F6F0] border border-clay-light px-2 py-0.5 rounded-full text-clay-dark font-bold font-sans">
                      {santriList.length} Anak
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSantriName}
                      onChange={(e) => setNewSantriName(e.target.value)}
                      placeholder="Nama santri baru..."
                      className="flex-1 text-xs bg-[#FDFBF7] border border-clay-light rounded-lg px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-sage/20 text-natural-dark placeholder-clay-dark"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddSantri();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddSantri}
                      className="bg-sage hover:bg-sage-dark text-white px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto p-1.5 bg-gray-50/50 rounded-lg border border-gray-100">
                    {santriList.length === 0 ? (
                      <p className="text-[10px] text-clay-dark italic p-2 font-sans">Daftar kosong. Silakan tambah santri baru di atas.</p>
                    ) : (
                      santriList.map((name) => (
                        <span key={name} className="inline-flex items-center gap-1 text-[10px] font-medium bg-white border border-clay-light pl-2.5 pr-1.5 py-1 rounded-full text-natural-dark shadow-3xs font-sans">
                          <span>{name}</span>
                          <button
                            onClick={() => handleRemoveSantri(name)}
                            className="text-clay hover:text-red-600 hover:bg-red-50 p-0.5 rounded-full transition-colors cursor-pointer"
                            title={`Hapus ${name}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Santri Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                    Pilih Nama Santri
                  </label>
                  <select
                    value={selectedSantri}
                    onChange={(e) => setSelectedSantri(e.target.value)}
                    className="w-full text-xs bg-white rounded-lg border border-clay-light p-2.5 focus:outline-hidden text-natural-dark font-medium shadow-3xs font-sans"
                  >
                    {santriList.length === 0 ? (
                      <option value="">(Belum ada santri)</option>
                    ) : (
                      santriList.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))
                    )}
                  </select>
                </div>

                {/* Score Rating Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                    Tingkat Capaian
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { val: 3, label: "Sangat Baik", desc: "⭐⭐⭐" },
                      { val: 2, label: "Baik", desc: "⭐⭐" },
                      { val: 1, label: "Bimbingan", desc: "⭐" }
                    ] as const).map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setEvalRating(item.val)}
                        className={`py-2 px-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                          evalRating === item.val
                            ? "bg-sage text-white border-sage shadow-3xs"
                            : "bg-white hover:bg-gray-50 text-clay-dark border-clay-light"
                        }`}
                      >
                        <span className="text-[10px] tracking-tight leading-none mb-0.5">{item.desc}</span>
                        <span className="text-[9px] opacity-90">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Aspect Buttons based on Subject */}
              <div>
                <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                  Aspek Penilaian ({subject})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentAspects.map((aspect) => (
                    <button
                      key={aspect}
                      type="button"
                      onClick={() => setSelectedAspect(aspect)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedAspect === aspect
                          ? "bg-sage text-white border-sage shadow-3xs"
                          : "bg-white hover:bg-gray-50 text-clay-dark border-clay-light"
                      }`}
                    >
                      {aspect}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes with Voice Input (Microphone support) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider font-sans">
                    Catatan Perkembangan Santri
                  </label>
                  
                  <button
                    type="button"
                    onClick={handleToggleListening}
                    className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      isListening
                        ? "bg-red-500 text-white border-red-500 animate-pulse shadow-md"
                        : "bg-white hover:bg-gray-50 text-sage border-clay-light"
                    }`}
                    title={isListening ? "Klik untuk berhenti merekam suara" : "Klik untuk mulai mencatat dengan suara"}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Mendengarkan...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-sage" />
                        <span>Input Suara (Bicara)</span>
                      </>
                    )}
                  </button>
                </div>

                {micError && (
                  <div className="text-[10px] font-medium text-clay bg-white border border-clay-light px-2.5 py-1 rounded-md flex items-center gap-1 font-sans">
                    <span>ℹ️</span>
                    <span>{micError}</span>
                  </div>
                )}

                <textarea
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  placeholder="Gunakan input suara atau ketik manual catatan perkembangan di sini..."
                  rows={3}
                  className="w-full text-xs bg-white rounded-lg border border-clay-light p-3 focus:outline-hidden focus:ring-2 focus:ring-sage/20 text-natural-dark placeholder-clay-dark font-sans leading-relaxed"
                />
              </div>

              {/* Action Save Button */}
              <button
                onClick={handleSaveEvaluation}
                disabled={!selectedSantri}
                className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-2xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Catatan Evaluasi</span>
              </button>
            </div>

            {/* Riwayat Evaluasi list */}
            <div className="bg-white rounded-2xl border border-clay-light p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-clay-light pb-3.5">
                <div>
                  <h3 className="text-sm font-bold text-natural-dark font-serif flex items-center gap-1.5">
                    <Award className="w-4.5 h-4.5 text-sage" />
                    <span>Riwayat Evaluasi Pekan Ini ({evaluations.filter(
                      (e) => e.level === level && e.semester === semester && e.week === week && e.subject === subject
                    ).length})</span>
                  </h3>
                  <p className="text-[10px] text-clay-dark font-sans">
                    Evaluasi tercatat pada Level {level} • Pekan {week}
                  </p>
                </div>

                <button
                  onClick={handlePrintEvaluations}
                  disabled={evaluations.filter(
                    (e) => e.level === level && e.semester === semester && e.week === week && e.subject === subject
                  ).length === 0}
                  className="flex items-center gap-1.5 bg-[#F9F6F0] hover:bg-clay/20 disabled:opacity-50 text-natural-dark px-3 py-1.5 rounded-lg text-[10px] font-bold border border-clay-light shadow-3xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-clay-dark" />
                  <span>Cetak Lembar Evaluasi</span>
                </button>
              </div>

              {evaluations.filter(
                (e) => e.level === level && e.semester === semester && e.week === week && e.subject === subject
              ).length === 0 ? (
                <div className="py-10 text-center text-clay-dark flex flex-col items-center justify-center border border-dashed border-clay-light rounded-xl bg-gray-50/50">
                  <Users className="w-8 h-8 text-clay-light mb-2" />
                  <p className="text-xs font-bold font-serif">Belum Ada Catatan Evaluasi</p>
                  <p className="text-[10px] max-w-[240px] mt-1 font-sans">
                    Pilih nama santri, isi aspek, lalu rekam atau ketik catatan untuk mengisi lembar evaluasi harian.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {evaluations
                    .filter((e) => e.level === level && e.semester === semester && e.week === week && e.subject === subject)
                    .map((record) => (
                      <div key={record.id} className="bg-[#F9F6F0]/40 border border-clay-light/60 p-3.5 rounded-xl flex items-start justify-between gap-3 transition-colors hover:bg-[#F9F6F0]/70">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-natural-dark font-serif">{record.santriName}</span>
                            <span className="text-[9px] font-bold bg-white text-sage-deep border border-clay-light px-1.5 py-0.5 rounded-sm font-sans">
                              {record.kategori}
                            </span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: record.capaian }).map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                              ))}
                            </div>
                          </div>
                          
                          {record.catatan ? (
                            <p className="text-[11px] text-[#3E362E] italic bg-white/65 px-2.5 py-1.5 rounded-lg border border-black/5 leading-relaxed font-sans">
                              "{record.catatan}"
                            </p>
                          ) : (
                            <p className="text-[10px] text-clay-dark italic pl-1 leading-relaxed font-sans">
                              Tidak ada catatan perkembangan khusus.
                            </p>
                          )}

                          <p className="text-[9px] text-clay-dark/80 font-mono pl-0.5">
                            🕒 Terinput {record.timestamp}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteEvaluation(record.id)}
                          className="text-clay hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Hapus catatan ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CERTIFICATE COLUMN: Graduation Certificate Panel */}
        {activeViewTab === "sertifikat" && (
          <div className="col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-clay-light p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-clay-light pb-4">
                <div>
                  <h3 className="text-lg font-bold text-natural-dark font-serif flex items-center gap-2">
                    <Award className="w-5.5 h-5.5 text-sage" />
                    <span>Draf Sertifikat Kelulusan Santri</span>
                  </h3>
                  <p className="text-xs text-clay-dark font-sans">
                    Buat draf sertifikat kelulusan per semester berdasarkan rekaman evaluasi.
                  </p>
                </div>
              </div>

              {/* Selector & Dynamic Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F9F6F0]/60 p-4 rounded-xl border border-clay-light">
                <div className="col-span-1">
                  <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                    Pilih Nama Santri
                  </label>
                  <select
                    id="cert-student-select"
                    value={certStudent}
                    onChange={(e) => setCertStudent(e.target.value)}
                    className="w-full bg-white border border-clay-light rounded-lg px-3 py-2 text-xs font-bold text-natural-dark focus:outline-none focus:border-sage"
                  >
                    {Array.from(new Set(evaluations.filter(e => e.level === level && e.semester === semester).map(e => e.santriName))).length > 0 ? (
                      <optgroup label="Dari Evaluasi Semester Ini">
                        {Array.from(new Set(evaluations.filter(e => e.level === level && e.semester === semester).map(e => e.santriName))).map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </optgroup>
                    ) : null}
                    
                    <optgroup label="Daftar Santri Bawaan">
                      {santriList.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                    Jenjang Kelulusan
                  </label>
                  <div className="text-xs font-bold text-natural-dark bg-white border border-clay-light rounded-lg px-3 py-2">
                    Level {level} (Semester {semester})
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                    Tahun Ajaran
                  </label>
                  <div className="text-xs font-bold text-natural-dark bg-white border border-clay-light rounded-lg px-3 py-2">
                    2026/2027
                  </div>
                </div>
              </div>

              {/* Stats & Info Preview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-clay-light/80 p-4 rounded-xl text-center shadow-3xs">
                  <span className="text-[10px] uppercase font-bold text-clay-dark tracking-wider block">Total Evaluasi Harian</span>
                  <span className="text-2xl font-bold font-serif text-natural-dark block mt-1">
                    {evaluations.filter(e => e.level === level && e.semester === semester && e.santriName === certStudent).length}
                  </span>
                  <span className="text-[10px] text-gray-500 font-sans block mt-1">Materi Tercatat</span>
                </div>

                <div className="bg-white border border-clay-light/80 p-4 rounded-xl text-center shadow-3xs">
                  <span className="text-[10px] uppercase font-bold text-clay-dark tracking-wider block">Nilai Rata-rata</span>
                  <span className="text-2xl font-bold font-serif text-sage-deep block mt-1">
                    {(evaluations.filter(e => e.level === level && e.semester === semester && e.santriName === certStudent).length > 0 
                      ? evaluations.filter(e => e.level === level && e.semester === semester && e.santriName === certStudent).reduce((acc, curr) => acc + curr.capaian, 0) / evaluations.filter(e => e.level === level && e.semester === semester && e.santriName === certStudent).length 
                      : 3.0).toFixed(2)} / 3.00
                  </span>
                  <div className="flex justify-center gap-0.5 mt-1">
                    {Array.from({ length: Math.round(evaluations.filter(e => e.level === level && e.semester === semester && e.santriName === certStudent).length > 0 
                      ? evaluations.filter(e => e.level === level && e.semester === semester && e.santriName === certStudent).reduce((acc, curr) => acc + curr.capaian, 0) / evaluations.filter(e => e.level === level && e.semester === semester && e.santriName === certStudent).length 
                      : 3.0) }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-clay-light/80 p-4 rounded-xl text-center shadow-3xs">
                  <span className="text-[10px] uppercase font-bold text-clay-dark tracking-wider block">Predikat Kelulusan</span>
                  <span className="text-base font-bold font-serif text-[#B8860B] block mt-1.5">
                    {(() => {
                      const studentSemesterEvals = evaluations.filter(
                        (e) => e.level === level && e.semester === semester && e.santriName === certStudent
                      );
                      const totalEvalCount = studentSemesterEvals.length;
                      const averageScore = totalEvalCount > 0
                        ? studentSemesterEvals.reduce((acc, curr) => acc + curr.capaian, 0) / totalEvalCount
                        : 3.0;
                      if (averageScore >= 2.6) return "Mumtaz (Istimewa)";
                      if (averageScore >= 2.0) return "Jayyid Jiddan (Sangat Baik)";
                      if (averageScore >= 1.5) return "Jayyid (Baik)";
                      return "Maqbul (Cukup)";
                    })()}
                  </span>
                  <span className="text-[10px] text-gray-500 font-sans block mt-1">Kriteria Kelulusan TPQ</span>
                </div>
              </div>

              {/* Certificate Canvas / Outer Frame Preview */}
              <div className="relative overflow-hidden border-2 border-clay-light rounded-2xl bg-[#FDFBF7] p-6 md:p-10 shadow-xs">
                {/* Visual Decorative Corners */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-sage"></div>
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-sage"></div>
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-sage"></div>
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-sage"></div>

                <div className="border-4 border-double border-clay/60 rounded-xl p-6 md:p-8 text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 bg-sage/10 text-sage rounded-full flex items-center justify-center border border-sage/20 shadow-3xs">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xl md:text-2xl font-serif font-bold text-sage-deep tracking-wider uppercase">
                      Sertifikat Kelulusan Semester
                    </h4>
                    <p className="text-xs font-semibold text-clay-dark uppercase tracking-widest">
                      {tpqIdentity?.namaTPQ || "TPQ Hubbul Qur'an Yogyakarta"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs italic text-gray-500 block">Diberikan dengan penuh kebanggaan kepada:</span>
                    <span className="text-xl md:text-2xl font-serif font-bold text-natural-dark border-b-2 border-clay/50 pb-1 px-8 inline-block uppercase">
                      {certStudent || "Pilih Santri..."}
                    </span>
                  </div>

                  <div className="max-w-md mx-auto">
                    <p className="text-xs md:text-sm text-natural-dark/95 leading-relaxed font-sans">
                      Telah dinyatakan <strong>LULUS</strong> dalam menempuh program pendidikan pengajaran Al-Qur'an terpadu Kurikulum Profesional jenjang <strong>Level {level} (Semester {semester})</strong> dengan capaian prestasi akademik serta penerapan adab harian terpuji.
                    </p>
                  </div>

                  {/* Summary row */}
                  <div className="inline-grid grid-cols-2 gap-x-8 gap-y-1 bg-white/80 border border-clay-light px-6 py-2.5 rounded-lg text-left text-xs font-sans mx-auto">
                    <div className="text-gray-500 font-medium">Rata-rata Capaian:</div>
                    <div className="font-bold text-natural-dark">
                      {(evaluations.filter(e => e.level === level && e.semester === semester && e.santriName === certStudent).length > 0 
                        ? evaluations.filter(e => e.level === level && e.semester === semester && e.santriName === certStudent).reduce((acc, curr) => acc + curr.capaian, 0) / evaluations.filter(e => e.level === level && e.semester === semester && e.santriName === certStudent).length 
                        : 3.0).toFixed(2)} / 3.00
                    </div>
                    <div className="text-gray-500 font-medium">Predikat Kelulusan:</div>
                    <div className="font-bold text-sage-deep">
                      {(() => {
                        const studentSemesterEvals = evaluations.filter(
                          (e) => e.level === level && e.semester === semester && e.santriName === certStudent
                        );
                        const totalEvalCount = studentSemesterEvals.length;
                        const averageScore = totalEvalCount > 0
                          ? studentSemesterEvals.reduce((acc, curr) => acc + curr.capaian, 0) / totalEvalCount
                          : 3.0;
                        return averageScore >= 2.6 ? "Mumtaz" : averageScore >= 2.0 ? "Jayyid Jiddan" : averageScore >= 1.5 ? "Jayyid" : "Maqbul";
                      })()}
                    </div>
                  </div>

                  {/* Signature block */}
                  <div className="flex justify-between items-end pt-4 border-t border-clay-light/50 text-left text-[10px] md:text-xs">
                    <div>
                      <span className="text-gray-500 block">Mengetahui,</span>
                      <span className="font-bold text-natural-dark">Kepala {tpqIdentity?.namaTPQ || "TPQ Hubbul Qur'an"}</span>
                      <span className="font-bold text-natural-dark block mt-6 border-t border-natural-dark pt-0.5">{tpqIdentity?.kepalaTPQ || "Ustadz K.H. Ahmad Syarif, M.A."}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 block">{tpqIdentity?.alamatTPQ?.split(",")[0] || "Yogyakarta"}, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                      <span className="text-gray-500 block mt-1">Guru Pengajar,</span>
                      <span className="font-bold text-natural-dark block mt-6 border-t border-natural-dark pt-0.5">{tpqIdentity?.guruPembimbing || "Ustazah Ananda Rahmi Annisa"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-clay-light">
                <button
                  id="print-cert-btn"
                  onClick={handlePrintCertificate}
                  disabled={!certStudent}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#F9F6F0] hover:bg-clay/20 text-natural-dark font-bold text-xs py-3 px-4 rounded-xl border border-clay-light shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Printer className="w-4 h-4 text-clay-dark" />
                  <span>Cetak Langsung (PDF)</span>
                </button>

                <button
                  id="export-cert-btn"
                  onClick={handleExportCertClick}
                  disabled={!certStudent || isCertExporting}
                  className="flex-1 flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white font-bold text-xs py-3 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCertExporting ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <FileText className="w-4 h-4 text-white" />
                  )}
                  <span>Ekspor Draf ke Google Docs</span>
                </button>
              </div>

              {exportedCertUrl && (
                <div className="bg-clay-light/25 border border-clay-light p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in text-center sm:text-left">
                  <div>
                    <p className="text-xs font-bold text-natural-dark font-serif">Sertifikat Berhasil Diekspor!</p>
                    <p className="text-[10px] text-clay-dark font-sans">Draf sertifikat kelulusan santri telah tersimpan di Google Drive.</p>
                  </div>
                  <a
                    href={exportedCertUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white border border-clay text-xs font-bold text-sage hover:text-sage-dark px-4 py-2 rounded-lg shadow-3xs cursor-pointer"
                  >
                    <span>Buka Google Doc</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
