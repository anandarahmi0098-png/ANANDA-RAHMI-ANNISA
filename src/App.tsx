import React, { useState, useEffect } from "react";
import { LevelType, SubjectType, WeekSyllabus, TPQIdentity } from "./types";
import { curriculumData, getWeeksForLevelAndSemester } from "./data";
import { SyllabusTable } from "./components/SyllabusTable";
import { ModulAjarView } from "./components/ModulAjarView";
import { OAuthWidget } from "./components/OAuthWidget";
import { TahfidzAssessment } from "./components/TahfidzAssessment";
import { initAuth, googleSignIn, logout } from "./lib/googleAuth";
import { exportSyllabusToGoogleDocs, exportModulToGoogleDocs, exportCertificateToGoogleDocs } from "./lib/googleDocsExport";
import { User } from "firebase/auth";
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Bookmark, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Award
} from "lucide-react";

const DEFAULT_TPQ_IDENTITY: TPQIdentity = {
  namaTPQ: "TPQ Hubbul Qur'an Yogyakarta",
  ketuaYayasan: "Ustadz K.H. Ahmad Syarif, M.A.",
  pengasuhYayasan: "K.H. Muhammad Zainuddin",
  kepalaTPQ: "Ustadz K.H. Ahmad Syarif, M.A.",
  guruPembimbing: "Ustazah Ananda Rahmi Annisa",
  alamatTPQ: "Jl. Kaliurang KM 5, Sleman, Yogyakarta"
};

export default function App() {
  // Authentication states
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // TPQ Identity States
  const [tpqIdentity, setTpqIdentity] = useState<TPQIdentity>(() => {
    const saved = localStorage.getItem("tpq_identity");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_TPQ_IDENTITY;
  });
  const [isEditingTpq, setIsEditingTpq] = useState(false);

  useEffect(() => {
    localStorage.setItem("tpq_identity", JSON.stringify(tpqIdentity));
  }, [tpqIdentity]);

  // Active workspace tab state
  const [activeTab, setActiveTab] = useState<"syllabus" | "tahfidz">("syllabus");

  // Curriculum configuration states
  const [selectedLevel, setSelectedLevel] = useState<LevelType>("Dasar");
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  
  // Selected topic for Modul Ajar generation
  const [selectedTopic, setSelectedTopic] = useState<{
    week: number;
    subject: SubjectType;
    title: string;
  }>({
    week: 1,
    subject: "Tahsin & Tajwid",
    title: "",
  });

  // Export states
  const [isSyllabusExporting, setIsSyllabusExporting] = useState(false);
  const [isModulExporting, setIsModulExporting] = useState(false);
  const [isCertExporting, setIsCertExporting] = useState(false);
  const [syllabusDocUrl, setSyllabusDocUrl] = useState<string | null>(null);
  const [modulDocUrl, setModulDocUrl] = useState<string | null>(null);
  const [certDocUrl, setCertDocUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Firebase Authentication listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorMessage("Gagal menghubungkan ke akun Google. Silakan coba kembali.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setSyllabusDocUrl(null);
      setModulDocUrl(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Fetch weeks based on level and semester
  const activeWeeks = getWeeksForLevelAndSemester(selectedLevel, selectedSemester);

  // Auto-select topic when level or semester changes
  useEffect(() => {
    if (activeWeeks.length > 0) {
      const week1 = activeWeeks[0];
      setSelectedTopic({
        week: week1.week,
        subject: "Tahsin & Tajwid",
        title: week1.topics["Tahsin & Tajwid"].title,
      });
      setSyllabusDocUrl(null);
      setModulDocUrl(null);
    }
  }, [selectedLevel, selectedSemester]);

  const handleSelectTopic = (week: number, subject: SubjectType, topicTitle: string) => {
    setSelectedTopic({
      week,
      subject,
      title: topicTitle,
    });
    setModulDocUrl(null); // Clear previous modul doc export
    // Scroll right column to view on mobile
    const rightCol = document.getElementById("modul-workspace");
    if (rightCol) {
      rightCol.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Exports the entire 18-week syllabus to Google Docs
  const handleExportSyllabus = async () => {
    if (!token) {
      setErrorMessage("Silakan hubungkan akun Google Docs terlebih dahulu untuk melakukan ekspor.");
      // Scroll to auth widget
      document.getElementById("auth-panel")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setIsSyllabusExporting(true);
    setErrorMessage(null);
    setSyllabusDocUrl(null);

    try {
      const docUrl = await exportSyllabusToGoogleDocs(
        token,
        selectedLevel,
        selectedSemester,
        activeWeeks,
        tpqIdentity
      );
      setSyllabusDocUrl(docUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Gagal mengekspor Silabus: ${err.message || "Pastikan izin Google Docs aktif"}`);
    } finally {
      setIsSyllabusExporting(false);
    }
  };

  // Exports a generated Modul Ajar to Google Docs
  const handleExportModul = async (markdownContent: string): Promise<string | null> => {
    if (!token) {
      setErrorMessage("Silakan hubungkan akun Google Docs terlebih dahulu untuk melakukan ekspor.");
      document.getElementById("auth-panel")?.scrollIntoView({ behavior: "smooth" });
      return null;
    }

    setIsModulExporting(true);
    setErrorMessage(null);
    setModulDocUrl(null);

    try {
      const docUrl = await exportModulToGoogleDocs(
        token,
        selectedLevel,
        selectedTopic.subject,
        selectedSemester,
        selectedTopic.week,
        selectedTopic.title,
        markdownContent,
        tpqIdentity
      );
      setModulDocUrl(docUrl);
      return docUrl;
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Gagal mengekspor Modul Ajar: ${err.message || "Terjadi kesalahan"}`);
      return null;
    } finally {
      setIsModulExporting(false);
    }
  };

  // Exports a generated Graduation Certificate to Google Docs
  const handleExportCertificate = async (
    santriName: string,
    predikat: string,
    averageScore: number,
    totalEval: number
  ): Promise<string | null> => {
    if (!token) {
      setErrorMessage("Silakan hubungkan akun Google Docs terlebih dahulu untuk melakukan ekspor.");
      document.getElementById("auth-panel")?.scrollIntoView({ behavior: "smooth" });
      return null;
    }

    setIsCertExporting(true);
    setErrorMessage(null);
    setCertDocUrl(null);

    try {
      const docUrl = await exportCertificateToGoogleDocs(
        token,
        santriName,
        selectedLevel,
        selectedSemester,
        predikat,
        averageScore,
        totalEval,
        tpqIdentity
      );
      setCertDocUrl(docUrl);
      return docUrl;
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Gagal mengekspor Sertifikat Kelulusan: ${err.message || "Terjadi kesalahan"}`);
      return null;
    } finally {
      setIsCertExporting(false);
    }
  };

  const levelInfo = curriculumData.find((c) => c.level === selectedLevel);

  return (
    <div className="min-h-screen bg-natural-bg flex flex-col selection:bg-sage/20 selection:text-sage-deep">
      
      {/* Decorative Header Banner */}
      <header className="bg-sage-deep text-white relative overflow-hidden border-b-4 border-clay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(210,180,140,0.15),transparent)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sage to-sage-light border-2 border-clay flex items-center justify-center shadow-lg shadow-sage-deep/40 flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-clay/20 text-clay border border-clay/30 px-2 py-0.5 rounded-full">
                  Kurikulum Profesional
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-sage-light/20 text-clay-light border border-sage-light/30 px-2 py-0.5 rounded-full">
                  Karya Guru 15+ Thn
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-serif mt-1">
                Silabus &amp; Modul Ajar Hubbul Qur'an
              </h1>
              <p className="text-xs text-clay-light/90 mt-1 max-w-2xl font-sans leading-relaxed">
                Platform penyusunan kurikulum Al-Qur'an terstruktur, terintegrasi otomatis dengan Google Docs. Dirancang untuk tahsin, tajwid, adab akhlak, hadits, fiqih ibadah, dan sirah nabawiyah.
              </p>
            </div>
          </div>

          {/* Teacher Identity Tag */}
          <div className="bg-sage-dark/60 border border-sage-light/50 rounded-2xl p-4 md:text-right min-w-[240px] flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-clay uppercase tracking-widest font-sans">
                Identitas Pengajar &amp; TPQ
              </p>
              <p className="text-sm font-bold text-white font-serif mt-1">
                {tpqIdentity.guruPembimbing}
              </p>
              <p className="text-xs text-clay-light font-medium font-sans mt-0.5">
                {tpqIdentity.namaTPQ}
              </p>
            </div>
            <button
              onClick={() => setIsEditingTpq(!isEditingTpq)}
              className="mt-3 text-left md:text-right text-[10px] text-clay hover:text-white transition-colors flex items-center md:justify-end gap-1 font-bold cursor-pointer bg-sage/20 hover:bg-sage/40 py-1 px-2.5 rounded-lg border border-clay/30"
            >
              <span>✏️ Edit Identitas TPQ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Error Alert Display */}
        {errorMessage && (
          <div className="bg-[#F9F6F0] border border-clay-light rounded-xl p-4 flex items-start gap-3 text-natural-dark animate-fade-in">
            <AlertCircle className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold font-serif">Informasi Sistem</p>
              <p className="text-xs mt-0.5 font-sans">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Editable TPQ Identity Management Form */}
        {isEditingTpq && (
          <div className="bg-[#FDFBF7] rounded-2xl border-2 border-clay p-6 space-y-4 shadow-xs animate-fade-in">
            <div className="flex justify-between items-center border-b border-clay/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                <h3 className="font-serif font-bold text-lg text-sage-deep">
                  Pengaturan Identitas TPQ &amp; Yayasan
                </h3>
              </div>
              <button 
                onClick={() => setIsEditingTpq(false)}
                className="text-clay-dark hover:text-white hover:bg-sage/80 font-bold text-xs bg-clay-light/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                Tutup [X]
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                  Nama TPQ
                </label>
                <input
                  type="text"
                  value={tpqIdentity.namaTPQ}
                  onChange={(e) => setTpqIdentity({ ...tpqIdentity, namaTPQ: e.target.value })}
                  className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-3 py-2 text-xs font-semibold text-natural-dark focus:outline-none focus:ring-1 focus:ring-sage"
                  placeholder="Nama TPQ"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                  Ketua Yayasan
                </label>
                <input
                  type="text"
                  value={tpqIdentity.ketuaYayasan}
                  onChange={(e) => setTpqIdentity({ ...tpqIdentity, ketuaYayasan: e.target.value })}
                  className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-3 py-2 text-xs font-semibold text-natural-dark focus:outline-none focus:ring-1 focus:ring-sage"
                  placeholder="Ketua Yayasan"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                  Pengasuh Yayasan
                </label>
                <input
                  type="text"
                  value={tpqIdentity.pengasuhYayasan}
                  onChange={(e) => setTpqIdentity({ ...tpqIdentity, pengasuhYayasan: e.target.value })}
                  className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-3 py-2 text-xs font-semibold text-natural-dark focus:outline-none focus:ring-1 focus:ring-sage"
                  placeholder="Pengasuh Yayasan"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                  Kepala TPQ
                </label>
                <input
                  type="text"
                  value={tpqIdentity.kepalaTPQ}
                  onChange={(e) => setTpqIdentity({ ...tpqIdentity, kepalaTPQ: e.target.value })}
                  className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-3 py-2 text-xs font-semibold text-natural-dark focus:outline-none focus:ring-1 focus:ring-sage"
                  placeholder="Kepala TPQ"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                  Guru Pembimbing (Pengajar)
                </label>
                <input
                  type="text"
                  value={tpqIdentity.guruPembimbing}
                  onChange={(e) => setTpqIdentity({ ...tpqIdentity, guruPembimbing: e.target.value })}
                  className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-3 py-2 text-xs font-semibold text-natural-dark focus:outline-none focus:ring-1 focus:ring-sage"
                  placeholder="Guru Pembimbing"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                  Alamat TPQ
                </label>
                <input
                  type="text"
                  value={tpqIdentity.alamatTPQ}
                  onChange={(e) => setTpqIdentity({ ...tpqIdentity, alamatTPQ: e.target.value })}
                  className="w-full bg-[#F9F6F0]/60 border border-clay-light rounded-xl px-3 py-2 text-xs font-semibold text-natural-dark focus:outline-none focus:ring-1 focus:ring-sage"
                  placeholder="Alamat TPQ"
                />
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-clay-light/50 pt-3">
              <span className="text-[10px] text-clay font-bold italic font-sans">
                * Perubahan identitas akan langsung otomatis diterapkan pada seluruh modul ajar, ijazah kelulusan, kartu evaluasi, dan dokumen cetak lainnya.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTpqIdentity(DEFAULT_TPQ_IDENTITY)}
                  className="text-xs text-clay-dark hover:text-red-600 bg-clay-light/10 hover:bg-red-50 px-4 py-2 rounded-xl border border-clay-light/40 transition-all font-bold cursor-pointer"
                >
                  Reset Default
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTpq(false)}
                  className="text-xs text-white bg-sage hover:bg-sage-dark px-5 py-2 rounded-xl shadow-xs transition-all font-bold cursor-pointer"
                >
                  Terapkan Identitas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Google Authentication Integration Widget */}
        <section id="auth-panel">
          <OAuthWidget
            user={user}
            needsAuth={needsAuth}
            isLoggingIn={isLoggingIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </section>

        {/* Workspace Mode Selection Tabs */}
        <div className="flex border-b border-clay-light/50 gap-1.5 pb-px">
          <button
            onClick={() => setActiveTab("syllabus")}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-bold uppercase tracking-wider transition-all duration-200 border-b-2 rounded-t-xl cursor-pointer ${
              activeTab === "syllabus"
                ? "border-sage text-sage-deep bg-white/50 shadow-2xs"
                : "border-transparent text-clay-dark hover:text-sage hover:bg-white/20"
            }`}
          >
            <BookOpen className="w-4 h-4 text-sage" />
            <span>Kurikulum &amp; Modul Ajar</span>
          </button>
          
          <button
            onClick={() => setActiveTab("tahfidz")}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-bold uppercase tracking-wider transition-all duration-200 border-b-2 rounded-t-xl cursor-pointer ${
              activeTab === "tahfidz"
                ? "border-sage text-sage-deep bg-white/50 shadow-2xs"
                : "border-transparent text-clay-dark hover:text-sage hover:bg-white/20"
            }`}
          >
            <Award className="w-4 h-4 text-sage" />
            <span>Penilaian Tahfidz Santri</span>
          </button>
        </div>

        {activeTab === "syllabus" ? (
          /* Dashboard split screen layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            
            {/* LEFT COLUMN: Syllabus Explorer & Navigation (5 cols) */}
            <section className="lg:col-span-5 space-y-6">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-clay-light shadow-xs p-5">
                <h2 className="text-sm font-bold text-sage-deep uppercase tracking-wider font-serif mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sage" />
                  <span>Navigasi Silabus Kurikulum</span>
                </h2>

                {/* Santri Level Selectors */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                      Pilih Tingkat Santri (Jenjang Umur)
                    </label>
                    <div className="grid grid-cols-3 gap-2 bg-[#F9F6F0]/80 p-1.5 rounded-xl border border-clay-light">
                      {(["Dasar", "Menengah", "Lanjut"] as LevelType[]).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setSelectedLevel(lvl)}
                          className={`py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                            selectedLevel === lvl
                              ? "bg-sage text-white shadow-xs"
                              : "text-clay-dark hover:text-natural-dark hover:bg-white/50"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Semester Selectors */}
                  <div>
                    <label className="block text-[11px] font-bold text-clay-dark uppercase tracking-wider mb-1.5">
                      Pilih Semester Pembelajaran
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-[#F9F6F0]/80 p-1.5 rounded-xl border border-clay-light">
                      {([1, 2] as const).map((sem) => (
                        <button
                          key={sem}
                          onClick={() => setSelectedSemester(sem)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                            selectedSemester === sem
                              ? "bg-sage text-white shadow-xs"
                              : "text-clay-dark hover:text-natural-dark hover:bg-white/50"
                          }`}
                        >
                          Semester {sem}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selected Level Brief info */}
                {levelInfo && (
                  <div className="mt-5 bg-[#F9F6F0]/50 rounded-xl border border-clay-light p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sage-deep font-serif">
                        Tingkat {selectedLevel}
                      </span>
                      <span className="text-[10px] font-bold bg-clay text-sage-deep px-2.5 py-0.5 rounded-full border border-clay/50">
                        {levelInfo.targetAge}
                      </span>
                    </div>
                    <p className="text-xs text-[#3E362E] leading-relaxed mt-2 font-sans">
                      {levelInfo.description}
                    </p>
                  </div>
                )}

                {/* Entire Syllabus Docs Exporter Link */}
                <div className="mt-5 pt-5 border-t border-clay-light">
                  <button
                    onClick={handleExportSyllabus}
                    disabled={isSyllabusExporting}
                    className="w-full flex items-center justify-center gap-2 bg-clay/25 hover:bg-clay/40 disabled:opacity-50 text-sage-deep font-bold text-xs py-3 px-4 rounded-xl border border-clay/50 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer"
                  >
                    {isSyllabusExporting ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-sage" />
                    ) : (
                      <FileText className="w-4 h-4 text-sage" />
                    )}
                    <span>Ekspor Seluruh Silabus Level {selectedLevel} (Sem. {selectedSemester})</span>
                  </button>

                  {syllabusDocUrl && (
                    <div className="mt-3 bg-clay-light/25 border border-clay-light p-3 rounded-xl flex items-center justify-between gap-3">
                      <span className="text-[11px] text-natural-dark font-medium font-serif">
                        Silabus berhasil diekspor!
                      </span>
                      <a
                        href={syllabusDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-sage hover:text-sage-dark"
                      >
                        <span>Buka Google Doc</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

               {/* Render 18-week table list */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-extrabold text-clay-dark uppercase tracking-wider font-sans">
                    Daftar Pekan Pembelajaran ({activeWeeks.length} Minggu)
                  </h3>
                  <span className="text-[10px] text-sage font-bold">
                    Klik untuk detail &amp; buat Modul Ajar
                  </span>
                </div>
                <SyllabusTable
                  key={`${selectedLevel}-${selectedSemester}`}
                  weeks={activeWeeks}
                  onSelectTopic={handleSelectTopic}
                />
              </div>
            </section>

            {/* RIGHT COLUMN: Interactive Lesson Plan Generator (7 cols) */}
            <main id="modul-workspace" className="lg:col-span-7">
              <ModulAjarView
                level={selectedLevel}
                subject={selectedTopic.subject}
                semester={selectedSemester}
                week={selectedTopic.week}
                topicTitle={selectedTopic.title || activeWeeks[0]?.topics["Tahsin & Tajwid"].title}
                onExportToDocs={handleExportModul}
                isDocsExporting={isModulExporting}
                exportedDocUrl={modulDocUrl}
                onExportCertificate={handleExportCertificate}
                isCertExporting={isCertExporting}
                exportedCertUrl={certDocUrl}
                tpqIdentity={tpqIdentity}
              />
            </main>
          </div>
        ) : (
          <TahfidzAssessment tpqIdentity={tpqIdentity} />
        )}
      </main>

      {/* Aesthetic Footer */}
      <footer className="mt-auto bg-sage-deep text-clay-light border-t border-sage-dark py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-sage rounded-md flex items-center justify-center font-bold text-[10px] text-clay-light">
              HQ
            </div>
            <span className="font-sans font-semibold text-clay-light/90">
              {tpqIdentity.namaTPQ} © 2026. Hak Cipta Dilindungi.
            </span>
          </div>
          <div className="flex items-center gap-4 text-clay-light/60">
            <span>Sistem Kurikulum &amp; Silabus Terpadu</span>
            <span>•</span>
            <span>{tpqIdentity.guruPembimbing}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
