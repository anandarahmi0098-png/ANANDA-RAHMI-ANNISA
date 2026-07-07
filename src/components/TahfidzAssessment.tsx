import React, { useState, useEffect } from "react";
import { TPQIdentity } from "../types";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  BookOpen, 
  Award, 
  Printer, 
  Sliders, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Sparkles,
  Info
} from "lucide-react";

export interface TahfidzRecord {
  id: string;
  santriName: string;
  juz: string;
  ayat: string;
  makhorijulHuruf: number;
  kelancaran: number;
  tajwid: number;
  isJuzComplete: boolean;
  finalAssessment: string;
  date: string;
  day: string;
}

const JUZ_LIST = [
  { value: "30", label: "Juz 30 (Surah An-Naba' - An-Naas)" },
  { value: "29", label: "Juz 29 (Surah Al-Mulk - Al-Mursalat)" },
  { value: "28", label: "Juz 28 (Surah Al-Mujadilah - At-Tahrim)" },
  { value: "27", label: "Juz 27 (Surah Adz-Dzariyat - Al-Hadid)" },
  { value: "26", label: "Juz 26 (Surah Al-Ahqaf - Adz-Dzariyat)" },
  { value: "25", label: "Juz 25 (Surah Fushshilat - Al-Jathiyah)" },
  { value: "24", label: "Juz 24 (Surah Az-Zumar - Fushshilat)" },
  { value: "23", label: "Juz 23 (Surah Ya-Sin - Az-Zumar)" },
  { value: "22", label: "Juz 22 (Surah Al-Ahzab - Ya-Sin)" },
  { value: "21", label: "Juz 21 (Surah Al-Ankabut - Al-Ahzab)" },
  { value: "20", label: "Juz 20 (Surah An-Naml - Al-Ankabut)" },
  { value: "19", label: "Juz 19 (Surah Al-Furqan - An-Naml)" },
  { value: "18", label: "Juz 18 (Surah Al-Mu'minun - Al-Furqan)" },
  { value: "17", label: "Juz 17 (Surah Al-Anbiya - Al-Mu'minun)" },
  { value: "16", label: "Juz 16 (Surah Al-Kahf - Al-Anbiya)" },
  { value: "15", label: "Juz 15 (Surah Al-Isra' - Al-Kahf)" },
  { value: "14", label: "Juz 14 (Surah Al-Hijr - An-Nahl)" },
  { value: "13", label: "Juz 13 (Surah Yusuf - Ibrahim)" },
  { value: "12", label: "Juz 12 (Surah Hud - Yusuf)" },
  { value: "11", label: "Juz 11 (Surah Yunus - Hud)" },
  { value: "10", label: "Juz 10 (Surah Al-Anfal - At-Tawbah)" },
  { value: "9", label: "Juz 9 (Surah Al-A'raf - Al-Anfal)" },
  { value: "8", label: "Juz 8 (Surah Al-An'am - Al-A'raf)" },
  { value: "7", label: "Juz 7 (Surah Al-Ma'idah - Al-An'am)" },
  { value: "6", label: "Juz 6 (Surah An-Nisa' - Al-Ma'idah)" },
  { value: "5", label: "Juz 5 (Surah An-Nisa')" },
  { value: "4", label: "Juz 4 (Surah Ali 'Imran - An-Nisa')" },
  { value: "3", label: "Juz 3 (Surah Al-Baqarah - Ali 'Imran)" },
  { value: "2", label: "Juz 2 (Surah Al-Baqarah)" },
  { value: "1", label: "Juz 1 (Surah Al-Fatihah - Al-Baqarah)" }
];

export const getIndonesianDayName = (dateStr: string): string => {
  if (!dateStr) return "Senin";
  // Parse with local timezone
  const dateParts = dateStr.split("-");
  if (dateParts.length !== 3) return "Senin";
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[2], 10);
  const date = new Date(year, month, day);
  const dayIndex = date.getDay(); // 0 is Sunday, 1 is Monday...
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return days[dayIndex];
};

interface TahfidzAssessmentProps {
  tpqIdentity?: TPQIdentity;
}

export function TahfidzAssessment({ tpqIdentity }: TahfidzAssessmentProps) {
  const [records, setRecords] = useState<TahfidzRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJuz, setFilterJuz] = useState("all");

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [santriName, setSantriName] = useState("");
  const [juz, setJuz] = useState("30");
  const [ayat, setAyat] = useState("");
  const [makhorijulHuruf, setMakhorijulHuruf] = useState(8);
  const [kelancaran, setKelancaran] = useState(8);
  const [tajwid, setTajwid] = useState(8);
  const [isJuzComplete, setIsJuzComplete] = useState(false);
  const [finalAssessment, setFinalAssessment] = useState("");
  const [day, setDay] = useState(() => {
    const d = new Date();
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[d.getDay()];
  });
  const [date, setDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset * 60 * 1000));
    return localToday.toISOString().split("T")[0];
  });

  // Load initial sample data if none exists
  useEffect(() => {
    const saved = localStorage.getItem("tahfidz_records");
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      const initial: TahfidzRecord[] = [
        {
          id: "1",
          santriName: "Ahmad Fathoni",
          juz: "30",
          ayat: "An-Naba' 1-40",
          makhorijulHuruf: 9,
          kelancaran: 8,
          tajwid: 9,
          isJuzComplete: false,
          finalAssessment: "Belum Menyelesaikan Juz",
          date: "2026-07-05",
          day: "Minggu"
        },
        {
          id: "2",
          santriName: "Fathimah Az-Zahra",
          juz: "30",
          ayat: "1- akhir (Lengkap)",
          makhorijulHuruf: 9,
          kelancaran: 9,
          tajwid: 10,
          isJuzComplete: true,
          finalAssessment: "Lulus dengan Predikat Istimewa (Mumtaz) 🎉 (Skor: 9.3/10)",
          date: "2026-07-06",
          day: "Senin"
        },
        {
          id: "3",
          santriName: "Zuhair Al-Ghifari",
          juz: "29",
          ayat: "Al-Mulk 1-30",
          makhorijulHuruf: 7,
          kelancaran: 8,
          tajwid: 7,
          isJuzComplete: true,
          finalAssessment: "Lulus dengan Predikat Baik (Jayyid) 🙂 (Skor: 7.3/10)",
          date: "2026-07-07",
          day: "Selasa"
        }
      ];
      setRecords(initial);
      localStorage.setItem("tahfidz_records", JSON.stringify(initial));
    }
  }, []);

  // Sync to local storage
  const saveRecords = (newRecords: TahfidzRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem("tahfidz_records", JSON.stringify(newRecords));
  };

  // Auto-calculate final assessment when inputs change
  useEffect(() => {
    const avg = (makhorijulHuruf + kelancaran + tajwid) / 3;
    const rounded = Math.round(avg * 10) / 10;

    if (isJuzComplete) {
      let predicate = "Kurang (Dhaif) ✍️";
      if (rounded >= 9.0) {
        predicate = "Istimewa (Mumtaz) 🎉";
      } else if (rounded >= 8.0) {
        predicate = "Sangat Baik (Jayyid Jiddan) 👍";
      } else if (rounded >= 7.0) {
        predicate = "Baik (Jayyid) 🙂";
      } else if (rounded >= 6.0) {
        predicate = "Cukup (Maqbul) 📖";
      }
      setFinalAssessment(`Lulus dengan Predikat ${predicate} (Skor: ${rounded}/10)`);
    } else {
      setFinalAssessment("Belum Menyelesaikan Juz Penuh (Hasil Akhir Otomatis Setelah Juz Tuntas)");
    }
  }, [makhorijulHuruf, kelancaran, tajwid, isJuzComplete]);

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!santriName.trim() || !ayat.trim()) {
      alert("Harap isi nama santri dan ayat hafalan.");
      return;
    }

    const selectedDate = date || new Date().toISOString().split("T")[0];
    const selectedDay = day || getIndonesianDayName(selectedDate);

    if (editingId) {
      // Edit record
      const updated = records.map(r => {
        if (r.id === editingId) {
          return {
            ...r,
            santriName: santriName.trim(),
            juz,
            ayat: ayat.trim(),
            makhorijulHuruf,
            kelancaran,
            tajwid,
            isJuzComplete,
            finalAssessment,
            date: selectedDate,
            day: selectedDay
          };
        }
        return r;
      });
      saveRecords(updated);
      setEditingId(null);
    } else {
      // New record
      const newRec: TahfidzRecord = {
        id: Date.now().toString(),
        santriName: santriName.trim(),
        juz,
        ayat: ayat.trim(),
        makhorijulHuruf,
        kelancaran,
        tajwid,
        isJuzComplete,
        finalAssessment,
        date: selectedDate,
        day: selectedDay
      };
      saveRecords([newRec, ...records]);
    }

    // Reset Form to today
    setSantriName("");
    setAyat("");
    setMakhorijulHuruf(8);
    setKelancaran(8);
    setTajwid(8);
    setIsJuzComplete(false);
    
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset * 60 * 1000));
    const todayStr = localToday.toISOString().split("T")[0];
    setDate(todayStr);
    setDay(getIndonesianDayName(todayStr));
  };

  // Edit Action
  const handleEdit = (rec: TahfidzRecord) => {
    setEditingId(rec.id);
    setSantriName(rec.santriName);
    setJuz(rec.juz);
    setAyat(rec.ayat);
    setMakhorijulHuruf(rec.makhorijulHuruf);
    setKelancaran(rec.kelancaran);
    setTajwid(rec.tajwid);
    setIsJuzComplete(rec.isJuzComplete);
    setDate(rec.date);
    setDay(rec.day || getIndonesianDayName(rec.date));
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setSantriName("");
    setAyat("");
    setMakhorijulHuruf(8);
    setKelancaran(8);
    setTajwid(8);
    setIsJuzComplete(false);
    
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset * 60 * 1000));
    const todayStr = localToday.toISOString().split("T")[0];
    setDate(todayStr);
    setDay(getIndonesianDayName(todayStr));
  };

  // Delete Action
  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data penilaian tahfidz ini?")) {
      const filtered = records.filter(r => r.id !== id);
      saveRecords(filtered);
    }
  };

  // Print Student Tahfidz Progress Card
  const handlePrintCard = (rec: TahfidzRecord) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup terblokir! Izinkan popup untuk mencetak.");
      return;
    }

    const selectedJuzLabel = JUZ_LIST.find(j => j.value === rec.juz)?.label || `Juz ${rec.juz}`;
    const avgScore = ((rec.makhorijulHuruf + rec.kelancaran + rec.tajwid) / 3).toFixed(1);

    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Hasil Tahfidz - ${rec.santriName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              line-height: 1.6; 
              padding: 40px; 
              color: #2C331F; 
              background-color: #FFF; 
            }
            .card-border {
              border: 3px double #556B2F;
              padding: 30px;
              border-radius: 16px;
              background-color: #FDFBF7;
              max-width: 650px;
              margin: 0 auto;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #556B2F;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .header h1 {
              font-family: 'Cormorant Garamond', serif;
              font-size: 24px;
              color: #2C331F;
              margin: 0 0 5px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .header p {
              font-size: 11px;
              color: #556B2F;
              margin: 0;
              font-weight: 600;
              letter-spacing: 1.5px;
              text-transform: uppercase;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin-bottom: 25px;
              font-size: 13px;
              background-color: #F9F6F0;
              padding: 15px;
              border-radius: 10px;
              border: 1px solid #E8E2D9;
            }
            .meta-item strong {
              color: #556B2F;
            }
            .score-section {
              margin-bottom: 25px;
            }
            .score-section h2 {
              font-family: 'Cormorant Garamond', serif;
              font-size: 16px;
              color: #2C331F;
              border-bottom: 1px solid #D2B48C;
              padding-bottom: 4px;
              margin-bottom: 15px;
            }
            .score-table {
              width: 100%;
              border-collapse: collapse;
            }
            .score-table th, .score-table td {
              border: 1px solid #E8E2D9;
              padding: 10px;
              font-size: 13px;
            }
            .score-table th {
              background-color: #F9F6F0;
              text-align: left;
              color: #2C331F;
            }
            .badge {
              display: inline-block;
              background-color: #556B2F;
              color: white;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 600;
            }
            .badge-success {
              background-color: #2e7d32;
            }
            .badge-warn {
              background-color: #ef6c00;
            }
            .final-result-box {
              background-color: #FFF;
              border: 1.5px dashed #556B2F;
              border-radius: 10px;
              padding: 15px;
              margin-top: 25px;
              text-align: center;
            }
            .final-result-box h3 {
              font-family: 'Cormorant Garamond', serif;
              font-size: 15px;
              margin: 0 0 5px 0;
              color: #556B2F;
              text-transform: uppercase;
            }
            .final-result-box p {
              font-size: 13px;
              font-weight: 700;
              color: #2C331F;
              margin: 0;
            }
            .signature-area {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              font-size: 12px;
            }
            .sig-box {
              width: 200px;
              text-align: center;
            }
            .sig-line {
              margin-top: 50px;
              border-top: 1px solid #2C331F;
              padding-top: 4px;
              font-weight: bold;
            }
            @media print {
              body { padding: 0; background-color: #fff; }
              .card-border { box-shadow: none; border: 2px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="card-border">
            <div class="header">
              <h1>KARTU HASIL EVALUASI TAHFIDZ</h1>
              <p>${tpqIdentity?.namaTPQ?.toUpperCase() || "TPQ HUBBUL QUR'AN YOGYAKARTA"}</p>
              ${tpqIdentity?.alamatTPQ ? `<p style="font-size: 10px; margin-top: 4px; color: #555; font-style: italic;">${tpqIdentity.alamatTPQ}</p>` : ""}
            </div>
            
            <div class="meta-grid">
              <div class="meta-item">
                <strong>Nama Santri:</strong> ${rec.santriName}
              </div>
              <div class="meta-item">
                <strong>Hari / Tanggal:</strong> ${rec.day || getIndonesianDayName(rec.date)}, ${new Date(rec.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <div class="meta-item" style="grid-column: span 2;">
                <strong>Juz Pembelajaran:</strong> ${selectedJuzLabel}
              </div>
              <div class="meta-item" style="grid-column: span 2;">
                <strong>Ayat Hafalan:</strong> ${rec.ayat}
              </div>
            </div>

            <div class="score-section">
              <h2>Kriteria Penilaian</h2>
              <table class="score-table">
                <thead>
                  <tr>
                    <th>Aspek Penilaian</th>
                    <th style="width: 100px; text-align: center;">Skor (1-10)</th>
                    <th style="width: 120px; text-align: center;">Kategori</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Makhorijul Huruf</strong></td>
                    <td style="text-align: center; font-weight: bold;">${rec.makhorijulHuruf}</td>
                    <td style="text-align: center;">${rec.makhorijulHuruf >= 9 ? "Istimewa" : rec.makhorijulHuruf >= 8 ? "Sangat Baik" : rec.makhorijulHuruf >= 7 ? "Baik" : "Cukup"}</td>
                  </tr>
                  <tr>
                    <td><strong>Kelancaran Hafalan</strong></td>
                    <td style="text-align: center; font-weight: bold;">${rec.kelancaran}</td>
                    <td style="text-align: center;">${rec.kelancaran >= 9 ? "Istimewa" : rec.kelancaran >= 8 ? "Sangat Baik" : rec.kelancaran >= 7 ? "Baik" : "Cukup"}</td>
                  </tr>
                  <tr>
                    <td><strong>Tajwid</strong></td>
                    <td style="text-align: center; font-weight: bold;">${rec.tajwid}</td>
                    <td style="text-align: center;">${rec.tajwid >= 9 ? "Istimewa" : rec.tajwid >= 8 ? "Sangat Baik" : rec.tajwid >= 7 ? "Baik" : "Cukup"}</td>
                  </tr>
                  <tr style="background-color: #FDFBF7;">
                    <td><strong>Skor Rata-Rata</strong></td>
                    <td style="text-align: center; font-weight: 800; color: #556B2F;">${avgScore}</td>
                    <td style="text-align: center; font-weight: bold;">
                      <span class="badge ${rec.isJuzComplete ? "badge-success" : "badge-warn"}">
                        ${rec.isJuzComplete ? "Tuntas 1 Juz" : "Progres Sesi"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="final-result-box">
              <h3>Penilaian Hasil Akhir (Yudisium)</h3>
              <p>${rec.finalAssessment}</p>
            </div>

            <div class="signature-area">
              <div class="sig-box">
                <div>Mengetahui,</div>
                <div style="font-weight: 600;">Kepala ${tpqIdentity?.namaTPQ || "TPQ Hubbul Qur'an"}</div>
                <div class="sig-line">${tpqIdentity?.kepalaTPQ || "Ustadz K.H. Ahmad Syarif, M.A."}</div>
              </div>
              <div class="sig-box">
                <div>${tpqIdentity?.alamatTPQ?.split(",")[0] || "Yogyakarta"}, ${rec.day || getIndonesianDayName(rec.date)}, ${new Date(rec.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
                <div style="font-weight: 600;">Guru Pengajar,</div>
                <div class="sig-line">${tpqIdentity?.guruPembimbing || "Ustazah Ananda Rahmi Annisa"}</div>
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

  // Filter & Search records
  const filteredRecords = records.filter(rec => {
    const matchesSearch = rec.santriName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rec.ayat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJuz = filterJuz === "all" || rec.juz === filterJuz;
    return matchesSearch && matchesJuz;
  });

  // Calculate Statistics
  const totalSantri = new Set(records.map(r => r.santriName.toLowerCase())).size;
  const completedJuzCount = records.filter(r => r.isJuzComplete).length;
  
  const avgMakhroj = records.length ? (records.reduce((sum, r) => sum + r.makhorijulHuruf, 0) / records.length).toFixed(1) : "0.0";
  const avgKelancaran = records.length ? (records.reduce((sum, r) => sum + r.kelancaran, 0) / records.length).toFixed(1) : "0.0";
  const avgTajwid = records.length ? (records.reduce((sum, r) => sum + r.tajwid, 0) / records.length).toFixed(1) : "0.0";

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* SECTION BANNER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-clay-light p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sage/10 text-sage flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-clay uppercase tracking-widest">Total Santri</p>
            <h4 className="text-xl font-bold font-serif text-sage-deep">{totalSantri} Santri</h4>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-clay-light p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-clay/20 text-sage-deep flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-clay uppercase tracking-widest">Juz Diselesaikan</p>
            <h4 className="text-xl font-bold font-serif text-sage-deep">{completedJuzCount} Juz Tuntas</h4>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-clay-light p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sage-light/20 text-clay-dark flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-clay uppercase tracking-widest">Rerata Kelancaran</p>
            <h4 className="text-xl font-bold font-serif text-sage-deep">{avgKelancaran} / 10</h4>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-clay-light p-4 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-clay uppercase tracking-widest">Rerata Tajwid & Huruf</p>
            <h4 className="text-xl font-bold font-serif text-sage-deep">{avgTajwid} & {avgMakhroj}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ASSESSMENT ENTRY FORM (5 cols) */}
        <div className="lg:col-span-5 bg-white/85 backdrop-blur-md rounded-2xl border border-clay-light shadow-xs p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-sage-deep uppercase tracking-wider font-serif flex items-center gap-2">
              <Plus className="w-4 h-4 text-sage" />
              <span>{editingId ? "Edit Penilaian Tahfidz" : "Input Evaluasi Tahfidz Baru"}</span>
            </h3>
            <p className="text-[10px] text-clay font-medium font-sans mt-0.5">
              Kelola dan catat hafalan Quran santri secara berkala.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Santri */}
            <div>
              <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                Nama Lengkap Santri
              </label>
              <input
                type="text"
                placeholder="Contoh: Ahmad Fathoni"
                value={santriName}
                onChange={(e) => setSantriName(e.target.value)}
                className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-sage placeholder-clay-dark/60"
                required
              />
            </div>

            {/* Hari & Tanggal Penilaian */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                  Hari Penilaian
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sage cursor-pointer"
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                  <option value="Minggu">Minggu</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                  Tanggal Penilaian
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setDate(newDate);
                    setDay(getIndonesianDayName(newDate));
                  }}
                  className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-sage cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Juz Selector */}
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                  Pilih Juz Quran
                </label>
                <select
                  value={juz}
                  onChange={(e) => setJuz(e.target.value)}
                  className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sage cursor-pointer"
                >
                  {JUZ_LIST.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ayat Column (Manual type) */}
            <div>
              <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                Kolom Ayat Hafalan (Ketik Manual)
              </label>
              <input
                type="text"
                placeholder="Contoh: An-Naba' 1-20, Al-Baqarah 150-160, atau Lengkap"
                value={ayat}
                onChange={(e) => setAyat(e.target.value)}
                className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-sage placeholder-clay-dark/60"
                required
              />
            </div>

            {/* Ratings Grid */}
            <div className="p-3 bg-[#F9F6F0]/50 rounded-xl border border-clay-light/80 space-y-3">
              <span className="block text-[10px] font-bold text-sage-deep uppercase tracking-widest text-center border-b border-clay-light pb-1">
                Kriteria &amp; Rating Hafalan (Skor 1 - 10)
              </span>

              {/* Makhorijul Huruf */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-clay-dark">Makhorijul Huruf</span>
                  <span className="text-xs font-extrabold text-sage">{makhorijulHuruf} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={makhorijulHuruf}
                  onChange={(e) => setMakhorijulHuruf(Number(e.target.value))}
                  className="w-full accent-sage h-1.5 bg-clay-light rounded-lg cursor-pointer"
                />
              </div>

              {/* Kelancaran Hafalan */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-clay-dark">Kelancaran Hafalan</span>
                  <span className="text-xs font-extrabold text-sage">{kelancaran} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={kelancaran}
                  onChange={(e) => setKelancaran(Number(e.target.value))}
                  className="w-full accent-sage h-1.5 bg-clay-light rounded-lg cursor-pointer"
                />
              </div>

              {/* Tajwid */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-clay-dark">Hukum Tajwid</span>
                  <span className="text-xs font-extrabold text-sage">{tajwid} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={tajwid}
                  onChange={(e) => setTajwid(Number(e.target.value))}
                  className="w-full accent-sage h-1.5 bg-clay-light rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Is Juz Complete Box */}
            <div className="flex items-center gap-3 p-3 bg-sage-light/10 border border-sage/20 rounded-xl">
              <input
                id="isJuzComplete"
                type="checkbox"
                checked={isJuzComplete}
                onChange={(e) => setIsJuzComplete(e.target.checked)}
                className="w-4 h-4 accent-sage border-clay-light rounded-md cursor-pointer"
              />
              <label htmlFor="isJuzComplete" className="text-xs font-bold text-sage-deep cursor-pointer">
                Santri Telah Menyelesaikan 1 Juz Penuh ini?
              </label>
            </div>

            {/* Final Assessment Auto Filled */}
            <div className="p-3.5 bg-clay/10 border border-clay/30 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-sage-deep">
                <Info className="w-3.5 h-3.5 text-sage" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Penilaian Hasil Akhir (Otomatis)</span>
              </div>
              <p className="text-xs font-semibold text-natural-dark leading-relaxed">
                {finalAssessment}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-sage hover:bg-sage-dark text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer text-center"
              >
                {editingId ? "Simpan Perubahan" : "Tambah Penilaian"}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-clay/20 hover:bg-clay/35 text-sage-deep font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-150 cursor-pointer"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: ASSESSMENT DATABASE TABLE & FILTER (7 cols) */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-2xl border border-clay-light shadow-xs p-5 flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-sage-deep uppercase tracking-wider font-serif">
                Database Hafalan Tahfidz Santri
              </h3>
              <p className="text-[10px] text-clay font-medium font-sans">
                Gunakan pencarian nama atau filter juz untuk mempermudah pemantauan.
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-clay">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Cari nama santri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-sage placeholder-clay-dark/60"
              />
            </div>

            <div className="sm:col-span-5">
              <select
                value={filterJuz}
                onChange={(e) => setFilterJuz(e.target.value)}
                className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sage cursor-pointer"
              >
                <option value="all">Semua Juz</option>
                {JUZ_LIST.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Records Table */}
          <div className="flex-1 overflow-x-auto border border-clay-light/80 rounded-xl bg-white/50">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F9F6F0] text-sage-deep border-b border-clay-light font-bold">
                  <th className="p-3 font-serif">Santri</th>
                  <th className="p-3">Hari &amp; Tanggal</th>
                  <th className="p-3">Juz</th>
                  <th className="p-3">Ayat</th>
                  <th className="p-3 text-center">M / K / T</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay-light/40">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-clay font-medium italic">
                      Tidak ada catatan penilaian tahfidz ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => {
                    const avgScore = ((rec.makhorijulHuruf + rec.kelancaran + rec.tajwid) / 3).toFixed(1);
                    return (
                      <tr key={rec.id} className="hover:bg-clay-light/10 transition-colors">
                        <td className="p-3 font-serif font-bold text-sage-deep">
                          {rec.santriName}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 bg-clay-light/60 text-sage-deep px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                            {rec.day || getIndonesianDayName(rec.date)}
                          </span>
                          <div className="text-[10px] text-clay font-sans flex items-center gap-1 font-medium mt-1">
                            <Calendar className="w-2.5 h-2.5 text-sage" />
                            {new Date(rec.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-center sm:text-left">
                          <span className="bg-sage/10 text-sage px-2 py-0.5 rounded-md">
                            Juz {rec.juz}
                          </span>
                        </td>
                        <td className="p-3 text-clay-dark font-medium max-w-[120px] truncate" title={rec.ayat}>
                          {rec.ayat}
                        </td>
                        <td className="p-3 text-center">
                          <div className="font-extrabold text-sage-deep">
                            {rec.makhorijulHuruf} / {rec.kelancaran} / {rec.tajwid}
                          </div>
                          <div className="text-[9px] text-clay mt-0.5">
                            Rerata: <span className="font-bold">{avgScore}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {rec.isJuzComplete ? (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-200">
                              <CheckCircle className="w-3 h-3" />
                              <span>Tuntas</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-200">
                              <Info className="w-3 h-3" />
                              <span>Progres</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handlePrintCard(rec)}
                              title="Cetak Hasil Penilaian"
                              className="p-1.5 text-sage-deep hover:bg-clay-light/30 rounded-lg transition-colors cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEdit(rec)}
                              title="Ubah Penilaian"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(rec.id)}
                              title="Hapus Penilaian"
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-[#F9F6F0]/50 border border-clay-light rounded-xl p-3 text-[11px] text-[#3E362E] leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Panduan Predikat Yudisium:</span> 
              {" "}Rating skor rata-rata minimal <strong>9.0</strong> dinilai sebagai <strong>Mumtaz</strong>, <strong>8.0</strong> sebagai <strong>Jayyid Jiddan</strong>, <strong>7.0</strong> sebagai <strong>Jayyid</strong>, dan <strong>6.0</strong> sebagai <strong>Maqbul</strong>. Hasil akhir ini dicatat secara otomatis ketika tanda tuntas juz dipilih.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
