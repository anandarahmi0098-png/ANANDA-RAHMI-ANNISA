import { LevelSyllabus, WeekSyllabus } from "./types";

// Helper to generate a baseline syllabus structure for a level
const generateSyllabusForLevel = (
  levelName: "Dasar" | "Menengah" | "Lanjut",
  semester: 1 | 2,
  subjectsData: {
    [weekNum: number]: {
      tahsin: { title: string; desc: string };
      surah: { title: string; desc: string };
      hadits: { title: string; desc: string };
      fiqih: { title: string; desc: string };
      adab: { title: string; desc: string };
      sirah: { title: string; desc: string };
    }
  }
): WeekSyllabus[] => {
  const weeks: WeekSyllabus[] = [];
  
  for (let w = 1; w <= 18; w++) {
    const defaultData = {
      tahsin: { title: "Muraja'ah Klasikal", desc: "Melancarkan bacaan bersama Ustazah." },
      surah: { title: "Muraja'ah Bersama", desc: "Mengulang hafalan surat-surat terdahulu." },
      hadits: { title: "Adab Harian", desc: "Mengingat kembali hadits adab harian." },
      fiqih: { title: "Praktik Bersama", desc: "Praktik ibadah fardhu secara klasikal." },
      adab: { title: "Akhlak Mulia", desc: "Pembiasaan adab sopan santun di kelas." },
      sirah: { title: "Hikmah Kisah", desc: "Mengambil keteladanan para Nabi." }
    };
    
    const weekData = subjectsData[w] || defaultData;
    
    weeks.push({
      week: w,
      semester,
      topics: {
        "Tahsin & Tajwid": {
          title: weekData.tahsin.title,
          description: weekData.tahsin.desc
        },
        "Hafalan Surat Pendek": {
          title: weekData.surah.title,
          description: weekData.surah.desc
        },
        "Hafalan Hadits": {
          title: weekData.hadits.title,
          description: weekData.hadits.desc
        },
        "Fiqih Ibadah": {
          title: weekData.fiqih.title,
          description: weekData.fiqih.desc
        },
        "Adab & Akhlak": {
          title: weekData.adab.title,
          description: weekData.adab.desc
        },
        "Sirah Nabawiyah": {
          title: weekData.sirah.title,
          description: weekData.sirah.desc
        }
      }
    });
  }
  
  return weeks;
};

// ==========================================
// 1. LEVEL DASAR (MUBTADI') - Kelas 2-3 SD
// ==========================================
const dasarSemester1Data: { [w: number]: any } = {
  1: {
    tahsin: { title: "Ta'aruf & Adab Belajar", desc: "Orientasi kelas, perkenalan guru dan santri, adab memegang mushaf/buku Iqro." },
    surah: { title: "QS. An-Nas", desc: "Hafalan & Tahsin QS. An-Nas ayat 1-6 (Makna: Perlindungan dari godaan syaitan)." },
    hadits: { title: "Hadits Kebersihan", desc: "Hadits 'At-thahuru syatrul iman' (Kebersihan sebagian dari iman) & artinya." },
    fiqih: { title: "Rukun Islam & Syahadat", desc: "Pengenalan Rukun Islam (5 perkara) & melafalkan dua kalimat syahadat." },
    adab: { title: "Adab Kepada Orang Tua (Birrul Walidain)", desc: "Menghormati ayah & ibu, berkata santun, mencium tangan sebelum berangkat TPQ." },
    sirah: { title: "Silsilah Keluarga Nabi Muhammad SAW", desc: "Kisah silsilah mulia: Ayahanda Abdullah, Ibunda Aminah, Kakek Abdul Muthalib." }
  },
  2: {
    tahsin: { title: "Makharijul Huruf: Al-Halq (Tenggorokan)", desc: "Praktik mengucapkan huruf Tenggorokan (Hamzah, Ha, 'Ain, Ha, Ghoin, Kho)." },
    surah: { title: "QS. An-Nas (Lanjutan)", desc: "Kelancaran setoran QS. An-Nas serta maknanya." },
    hadits: { title: "Hadits Kasih Sayang", desc: "Hadits 'Man la yarham la yurham' (Barang siapa tidak menyayangi tidak disayangi)." },
    fiqih: { title: "Thaharah: Mengenal Air Suci Mensucikan", desc: "Jenis air untuk bersuci: Air sumur, air hujan, air sungai, dll." },
    adab: { title: "Adab Kepada Guru", desc: "Adab berbicara dengan ustazah, mendengarkan penjelasan, dilarang gaduh saat belajar." },
    sirah: { title: "Tahun Gajah & Kelahiran Nabi", desc: "Kisah pasukan bergajah Abrahah dihancurkan burung Ababil, kelahiran Nabi Muhammad SAW." }
  },
  3: {
    tahsin: { title: "Makharijul Huruf: Al-Lisan (Lidah - Dasar)", desc: "Pengucapan huruf yang keluar dari lidah bagian pangkal dan tengah (Qof, Kaf, Jim, Syin, Ya)." },
    surah: { title: "QS. Al-Falaq", desc: "Tahsin QS. Al-Falaq ayat 1-5 (Makna: Berlindung dari kejahatan malam dan sihir)." },
    hadits: { title: "Hadits Persaudaraan", desc: "Hadits 'Al-Muslimu akhul muslim' (Muslim itu bersaudara bagi muslim lainnya)." },
    fiqih: { title: "Thaharah: Istinja' (Cebok)", desc: "Adab buang air kecil/besar, berdoa masuk/keluar WC, cara mensucikan najis urin." },
    adab: { title: "Adab Makan & Minum", desc: "Membaca doa, menggunakan tangan kanan, duduk dengan tenang, tidak meniup makanan panas." },
    sirah: { title: "Nabi Muhammad SAW Masa Kecil", desc: "Kisah disusui oleh Halimah As-Sa'diyah di pedalaman Bani Sa'ad yang penuh berkah." }
  },
  4: {
    tahsin: { title: "Makharijul Huruf: Asy-Syafatain (Bibir)", desc: "Pengucapan huruf bibir (Fa, Wawu, Ba, Mim) secara lisan & tulis." },
    surah: { title: "QS. Al-Falaq (Lanjutan)", desc: "Muraja'ah gabungan QS. An-Nas dan Al-Falaq (Al-Mu'awwidzatain) sebagai pelindung harian." },
    hadits: { title: "Hadits Menuntut Ilmu", desc: "Hadits 'Tholabul 'ilmi faridhotun 'ala kulli muslim' (Menuntut ilmu wajib bagi muslim)." },
    fiqih: { title: "Mengenal Gerakan Wudhu (Bagian 1)", desc: "Praktik mencuci tangan, berkumur, membasuh hidung, dan membasuh wajah." },
    adab: { title: "Adab Sebelum & Bangun Tidur", desc: "Mengibaskan tempat tidur, membaca doa, tidur miring ke kanan, doa bangun tidur." },
    sirah: { title: "Kisah Nabi dalam Pengasuhan Ibu & Kakek", desc: "Usia 6 tahun Ibunda wafat di Abwa', diasuh Kakek Abdul Muthalib hingga kakek wafat." }
  },
  5: {
    tahsin: { title: "Mengenal Harakat: Fathah, Kasrah, Dhammah", desc: "Membaca baris satu di atas (A), di bawah (I), dan di depan (U) dengan suara tegas." },
    surah: { title: "QS. Al-Ikhlas", desc: "Tahsin QS. Al-Ikhlas ayat 1-4 (Makna: Pemurnian tauhid, Allah Maha Esa, tidak beranak/diperanakkan)." },
    hadits: { title: "Hadits Tersenyum", desc: "Hadits 'Tabassumuka fii wajhi akhiika laka shodaqoh' (Senyummu di hadapan saudaramu sedekah)." },
    fiqih: { title: "Mengenal Gerakan Wudhu (Bagian 2)", desc: "Membasuh tangan hingga siku, mengusap sebagian kepala, telinga, membasuh kaki hingga mata kaki." },
    adab: { title: "Adab Berbicara Santun", desc: "Larangan berkata kotor, mengejek teman, menggunakan panggilan yang buruk." },
    sirah: { title: "Kisah Nabi Muhammad SAW dalam Asuhan Paman", desc: "Diasuh oleh Abu Thalib, belajar berdagang ke Syam usia 12 tahun, dilindungi awan teduh." }
  },
  6: {
    tahsin: { title: "Harakat Tanwin: Fathatain, Kasratain, Dhammatain", desc: "Membaca harakat ganda bersuara 'An, In, Un' dengan dengung tipis." },
    surah: { title: "QS. Al-Ikhlas (Lanjutan)", desc: "Muraja'ah & setoran lancar QS. Al-Ikhlas seketika melatih mental santri di depan kelas." },
    hadits: { title: "Hadits Keindahan", desc: "Hadits 'Innallaha jamiilun yuhibbul jamaal' (Sesungguhnya Allah Maha Indah menyukai keindahan)." },
    fiqih: { title: "Rukun & Sunnah Wudhu", desc: "Membedakan rukun wudhu yang wajib dengan amalan sunnah yang melengkapi pahala." },
    adab: { title: "Adab Masuk & Keluar Masjid", desc: "Adab melangkah kaki kanan masuk masjid, membaca doa masjid, dilarang berlarian di masjid." },
    sirah: { title: "Gelar Al-Amin bagi Nabi", desc: "Kisah kejujuran Nabi dalam berdagang dan bermasyarakat hingga dijuluki Al-Amin (Dapat Dipercaya)." }
  },
  7: {
    tahsin: { title: "Mengenal Huruf Sambung Dasar", desc: "Cara menulis dan membaca huruf hijaiyah ketika berada di awal, tengah, dan akhir kata." },
    surah: { title: "QS. Al-Lahab", desc: "Tahsin QS. Al-Lahab ayat 1-5 (Makna: Balasan bagi Abu Lahab dan istrinya yang memusuhi dakwah)." },
    hadits: { title: "Hadits Larangan Marah", desc: "Hadits 'La taghdob wa lakal jannah' (Janganlah kamu marah, maka bagimu surga)." },
    fiqih: { title: "Hal-Hal yang Membatalkan Wudhu", desc: "Memahami apa saja yang membatalkan wudhu: Buang angin, buang air, hilang akal, menyentuh kemaluan." },
    adab: { title: "Adab Berteman", desc: "Saling berbagi makanan, menolong teman yang kesusahan, memaafkan jika ada perselisihan." },
    sirah: { title: "Pernikahan Nabi dengan Khadijah", desc: "Kisah Nabi memperdagangkan barang Sayyidah Khadijah, kekaguman atas akhlak Nabi hingga jenjang pernikahan." }
  },
  8: {
    tahsin: { title: "Membaca Mad Asli / Thabi'i (Dasar)", desc: "Pengenalan mad asli sepanjang 2 harakat (ketukan) ketika ada Fathah diikuti Alif, Kasrah diikuti Ya mati, Dhammah diikuti Wawu mati." },
    surah: { title: "QS. Al-Lahab (Lanjutan)", desc: "Penyempurnaan makhraj dan kelancaran setoran hafalan QS. Al-Lahab." },
    hadits: { title: "Hadits Berkata Baik / Diam", desc: "Hadits 'Man kaana yu'minu billahi wal yaumil akhiri fal yaqul khoiron au liyashmut'." },
    fiqih: { title: "Praktik Wudhu Sempurna", desc: "Ujian simulasi wudhu langsung dibimbing oleh Ustazah untuk memastikan kelancaran dan ketertiban wudhu." },
    adab: { title: "Adab Menjaga Kebersihan TPQ", desc: "Membuang sampah pada tempatnya, merapikan meja/karpet setelah belajar, merapikan sandal." },
    sirah: { title: "Renovasi Ka'bah & Peletakan Hajar Aswad", desc: "Kecerdasan Nabi menengahi perselisihan suku Quraisy dalam meletakkan batu Hajar Aswad." }
  },
  9: {
    tahsin: { title: "Evaluasi Tengah Semester (Tahsin)", desc: "Uji kelancaran membaca Iqro'/buku jilid masing-masing santri secara individual." },
    surah: { title: "Evaluasi Tengah Semester (Surat Pendek)", desc: "Uji hafalan terpadu dari QS. An-Nas sampai QS. Al-Lahab." },
    hadits: { title: "Evaluasi Tengah Semester (Hadits)", desc: "Setoran hafalan 8 hadits pendek beserta artinya secara lisan." },
    fiqih: { title: "Evaluasi Tengah Semester (Fiqih)", desc: "Tes tulis & praktik wudhu mandiri tanpa bantuan." },
    adab: { title: "Evaluasi Adab Harian", desc: "Observasi akhlak santri selama setengah semester di TPQ." },
    sirah: { title: "Evaluasi Sirah Nabawiyah", desc: "Kuis cerdas cermat sirah nabawiyah dari kelahiran hingga peristiwa Hajar Aswad." }
  },
  10: {
    tahsin: { title: "Huruf Hijaiyah Berharakat Sukun (Mati)", desc: "Cara melafalkan huruf mati/sukun di tengah atau akhir kalimat dengan benar." },
    surah: { title: "QS. An-Nashr", desc: "Tahsin QS. An-Nashr ayat 1-3 (Makna: Pertolongan Allah dan kemenangan Islam, perintah beristighfar)." },
    hadits: { title: "Hadits Memuliakan Tetangga", desc: "Hadits 'Man kaana yu'minu billahi wal yaumil akhiri falyukrim jaarahu' (Memuliakan tetangga)." },
    fiqih: { title: "Mengenal Shalat Fardhu 5 Waktu", desc: "Nama-nama shalat fardhu, waktu pelaksanaannya, dan jumlah rakaat masing-masing." },
    adab: { title: "Adab Meminta Izin", desc: "Ketuk pintu, ucap salam, minta izin masuk rumah orang lain atau saat keluar kelas TPQ." },
    sirah: { title: "Nabi Muhammad SAW Menerima Wahyu Pertama", desc: "Kisah ber-tahannuts di Gua Hira, turunnya Malaikat Jibril membawa QS. Al-'Alaq 1-5." }
  },
  11: {
    tahsin: { title: "Qalqalah Dasar (Memantul)", desc: "Mengenal pantulan suara ketika membaca huruf Qalqalah (Ba, Jim, Dal, Thoh, Qof) saat sukun." },
    surah: { title: "QS. An-Nashr (Lanjutan)", desc: "Melatih pengucapan lafal 'fii diinillahi afwajaa' dengan fasih." },
    hadits: { title: "Hadits Saling Memberi Hadiah", desc: "Hadits 'Tahaaduu tahaabbuu' (Saling memberilah hadiah, niscaya kalian saling menyayangi)." },
    fiqih: { title: "Niat Shalat Fardhu", desc: "Melafalkan niat Shalat Shubuh, Dzuhur, Ashar, Maghrib, dan Isya beserta artinya." },
    adab: { title: "Adab Berpakaian Islami", desc: "Menutup aurat, berdoa saat memakai dan melepas pakaian, mendahulukan bagian kanan." },
    sirah: { title: "Dakwah Secara Sembunyi-sembunyi", desc: "Masa awal dakwah di rumah Arqam bin Abi Arqam, pengenalan Assabiqunal Awwalun." }
  },
  12: {
    tahsin: { title: "Huruf Hijaiyah Berharakat Tasydid (Double)", desc: "Cara membaca huruf bertasydid dengan menekan suara huruf dan menahannya sejenak." },
    surah: { title: "QS. Al-Kafirun", desc: "Tahsin QS. Al-Kafirun ayat 1-6 (Makna: Toleransi beragama, bagimu agamamu bagiku agamaku)." },
    hadits: { title: "Hadits Larangan Meniup Makanan/Minuman", desc: "Hadits larangan bernafas atau meniup wadah air minum sesuai sunnah nabi." },
    fiqih: { title: "Praktik Shalat: Gerakan Takbir & Bersedekap", desc: "Mengangkat tangan sejajar telinga/bahu, meletakkan tangan kanan di atas tangan kiri di dada." },
    adab: { title: "Adab Bersin & Menguap", desc: "Mengucap Alhamdulillah ketika bersin, menjawab Yarhamukallah, menahan menguap/menutup mulut." },
    sirah: { title: "Dakwah Secara Terang-terangan di Bukit Shafa", desc: "Keberanian Nabi naik ke Bukit Shafa, tantangan keras dari Abu Lahab dan kaum musyrikin Quraisy." }
  },
  13: {
    tahsin: { title: "Membaca Alif Lam (Al-) Qomariyah", desc: "Membaca huruf 'Al-' secara jelas (Izhar Qomari) saat bertemu huruf-huruf Qomariyah." },
    surah: { title: "QS. Al-Kafirun (Lanjutan)", desc: "Menghindari kekeliruan berulang pada ayat-ayat serupa di QS. Al-Kafirun." },
    hadits: { title: "Hadits Kasih Sayang Kepada yang Muda", desc: "Hadits 'Laisa minna man lam yarham shogiironaa...' (Bukan golongan kami yang tidak menyayangi yang muda)." },
    fiqih: { title: "Praktik Shalat: Gerakan Ruku' & I'tidal", desc: "Membungkukkan badan dengan punggung rata, memegang lutut, tuma'ninah, lalu bangun tegak (I'tidal)." },
    adab: { title: "Adab Menjenguk Teman Sakit", desc: "Mendoakan kesembuhan, membawa buah tangan ringan, menghibur kesedihan teman." },
    sirah: { title: "Kisah Ketabahan Sahabat Nabi", desc: "Kisah Bilal bin Rabah disiksa batu panas, ketabahan keluarga Yasir dalam mempertahankan iman." }
  },
  14: {
    tahsin: { title: "Membaca Alif Lam (Al-) Syamsiyah", desc: "Meleburkan huruf 'Al-' langsung ke huruf Syamsiyah (Idgham Syamsiyah) dengan melepas vokal 'L'." },
    surah: { title: "QS. Al-Kautsar", desc: "Tahsin QS. Al-Kautsar ayat 1-3 (Makna: Nikmat yang banyak, perintah shalat dan berkurban)." },
    hadits: { title: "Hadits Keutamaan Belajar Al-Qur'an", desc: "Hadits 'Khairukum man ta'allamal qur'ana wa 'allamah' (Sebaik-baik kalian adalah yang belajar Al-Qur'an dan mengajarkannya)." },
    fiqih: { title: "Praktik Shalat: Gerakan Sujud Sempurna", desc: "Menempelkan dahi, hidung, kedua telapak tangan, lutut, dan jari kaki ke lantai dengan mantap." },
    adab: { title: "Adab Berbicara dengan Orang Tua", desc: "Mendengarkan nasehat, dilarang menyela, mengucapkan kata 'Ah' atau membentak." },
    sirah: { title: "Kisah Hijrah Pertama ke Habasyah", desc: "Nabi memerintahkan sahabat berhijrah ke Habasyah (Ethiopia) karena raja Najasyi yang adil." }
  },
  15: {
    tahsin: { title: "Pengenalan Mad Thabi'i Berharakat Berdiri", desc: "Cara membaca baris tegak berdiri di atas, bawah, maupun dhammah terbalik (sama dengan 2 harakat)." },
    surah: { title: "QS. Al-Kautsar (Lanjutan)", desc: "Muraja'ah hafalan QS. Al-Kafirun dan QS. Al-Kautsar beserta maknanya." },
    hadits: { title: "Hadits Berkata Jujur", desc: "Hadits 'Alaikum bis-sidqi fainnas-sidqo yahdi ilal birr' (Wajib atas kalian jujur, karena membawa kebaikan)." },
    fiqih: { title: "Praktik Shalat: Duduk di Antara Dua Sujud", desc: "Duduk Iftirasy di antara dua sujud, melafalkan doa 'Rabbighfirlii warhamnii...'" },
    adab: { title: "Adab Berdoa yang Baik", desc: "Mengangkat kedua tangan, menghadap kiblat, suara lembut, khusyuk, dan mengakhirinya dengan mengusap wajah." },
    sirah: { title: "Wafatnya Khadijah & Abu Thalib (Amul Huzni)", desc: "Tahun kesedihan Nabi karena wafatnya pendukung utama dakwah beliau." }
  },
  16: {
    tahsin: { title: "Latihan Membaca Kalimat Panjang (Iqro Akhir)", desc: "Latihan ketahanan nafas, kelancaran tajwid gabungan dalam satu kalimat sedang." },
    surah: { title: "QS. Al-Ma'un", desc: "Tahsin QS. Al-Ma'un ayat 1-7 (Makna: Pendusta agama adalah orang yang menghardik anak yatim & enggan menolong)." },
    hadits: { title: "Hadits Menjaga Lisan", desc: "Hadits 'Amsik 'alaika lisaanaka' (Jagalah lisanmu dari perkataan buruk)." },
    fiqih: { title: "Praktik Shalat: Duduk Tasyahud & Salam", desc: "Duduk tasyahud akhir (Tawarruk), membaca doa tasyahud, shalawat, dan menoleh salam kanan-kiri." },
    adab: { title: "Adab Bertamu", desc: "Mengucap salam maksimal 3 kali, berdiri tidak langsung di depan pintu, pulang jika tidak dipersilakan." },
    sirah: { title: "Mukjizat Isra' Mi'raj Nabi Muhammad SAW", desc: "Kisah perjalanan malam dari Masjidil Haram ke Masjidil Aqsa lalu ke Sidratul Muntaha menerima perintah Shalat 5 Waktu." }
  },
  17: {
    tahsin: { title: "Muraja'ah & Pemantapan Makharaj", desc: "Review mendalam seluruh kaidah membaca dari makhraj hingga mad dasar." },
    surah: { title: "QS. Al-Ma'un (Lanjutan)", desc: "Setoran ujian lancar QS. Al-Ma'un dengan makhraj huruf yang kokoh." },
    hadits: { title: "Review 16 Hadits Semester 1", desc: "Mengulang-ulang hafalan 16 hadits semester ini secara bersama-sama dibimbing lagu ceria." },
    fiqih: { title: "Simulasi Shalat Berjamaah", desc: "Praktik shalat berjamaah lengkap, melatih sikap khusyuk, meluruskan shaf, mengikuti imam." },
    adab: { title: "Kuis Praktik Adab TPQ", desc: "Ujian aplikatif adab makan, tidur, berteman, dan adab kelas secara langsung." },
    sirah: { title: "Kisah Hijrah ke Madinah (Pembuka)", desc: "Sebab Nabi hijrah, ketegangan malam kepungan pemuda Quraisy, Ali bin Abi Thalib menggantikan di ranjang." }
  },
  18: {
    tahsin: { title: "Imtihan Akhir Semester 1", desc: "Ujian penentuan kenaikan jilid membaca Al-Qur'an/Iqro'." },
    surah: { title: "Imtihan Hafalan Al-Qur'an", desc: "Ujian kelancaran seluruh target hafalan semester 1 (An-Nas s.d. Al-Ma'un)." },
    hadits: { title: "Imtihan Hafalan Hadits", desc: "Evaluasi lisan hafalan hadits dan maknanya di depan tim penguji TPQ." },
    fiqih: { title: "Imtihan Praktik Wudhu & Shalat", desc: "Penilaian akhir kemandirian shalat fardhu subuh lengkap dengan tertib." },
    adab: { title: "Penilaian Karakter & Akhlak", desc: "Penggabungan nilai rapor aspek akhlak hasil pantauan harian." },
    sirah: { title: "Imtihan Teori Sirah", desc: "Kuis lisan kisah nabi semester 1." }
  }
};

const dasarSemester2Data: { [w: number]: any } = {
  1: {
    tahsin: { title: "Pengenalan Mushaf Al-Qur'an Jilid Dasar", desc: "Latihan adaptasi santri membaca tulisan Al-Qur'an rasm Utsmani asli setelah lulus Iqro." },
    surah: { title: "QS. Quraisy", desc: "Tahsin QS. Quraisy ayat 1-4 (Makna: Syukur kaum Quraisy atas keamanan dan rezeki)." },
    hadits: { title: "Hadits Menyebarkan Salam", desc: "Hadits 'Afsyus-salaama bainakum tahabbuu' (Sebarkan salam di antara kalian niscaya saling mencintai)." },
    fiqih: { title: "Pengenalan Rukun Iman (6 Perkara)", desc: "Iman kepada Allah, Malaikat, Kitab, Rasul, Hari Akhir, Qada & Qadar." },
    adab: { title: "Adab di Sekolah & TPQ", desc: "Menghormati ustadz-ustadzah, menyapa teman, tertib di dalam kelas." },
    sirah: { title: "Kisah Perjalanan Hijrah Nabi & Abu Bakar", desc: "Kisah sembunyi di Gua Tsur, jaring laba-laba, dan selamatnya Nabi dari kejaran Suraqah." }
  },
  2: {
    tahsin: { title: "Ghunnah (Dengung Wajib)", desc: "Mengenal dengung wajib pada huruf Nun bertasydid (nna) dan Mim bertasydid (mma)." },
    surah: { title: "QS. Quraisy (Lanjutan)", desc: "Melafalkan lafal 'Ilaafihim rihlatasy-syitaa-i wash-shoif' dengan nafas teratur." },
    hadits: { title: "Hadits Larangan Menggunjing", desc: "Hadits larangan membicarakan aib teman di belakang (Ghibah)." },
    fiqih: { title: "Zikir Setelah Shalat Fardhu (Dasar)", desc: "Melafalkan Istighfar 3x, Tasbih, Tahmid, Takbir (masing-masing 33x)." },
    adab: { title: "Adab Menuntut Ilmu", desc: "Ikhlas karena Allah, berdoa sebelum belajar, mencatat ilmu, tidak sombong." },
    sirah: { title: "Penyambutan Hangat Kaum Ansar di Madinah", desc: "Lagu Thala'al Badru 'Alaina berkumandang, persaudaraan Muhajirin dan Ansar." }
  },
  3: {
    tahsin: { title: "Idgham Bighunnah (Dengung)", desc: "Hukum dasar Nun Sukun / Tanwin bertemu Ya, Nun, Mim, Wawu dibaca dengung 2 ketukan." },
    surah: { title: "QS. Al-Fil", desc: "Tahsin QS. Al-Fil ayat 1-5 (Makna: Penghancuran pasukan gajah Abrahah oleh burung ababil)." },
    hadits: { title: "Hadits Berbakti kepada Ibu", desc: "Hadits 'Al-Jannatu tahta aqdaamil ummahaat' (Surga di bawah telapak kaki ibu)." },
    fiqih: { title: "Doa Setelah Shalat Fardhu (Sederhana)", desc: "Doa kebaikan dunia akhirat dan doa ampunan kedua orang tua." },
    adab: { title: "Adab Menggunakan Media Sosial & HP", desc: "Batasi waktu main game, gunakan HP untuk belajar mengaji, dilarang melihat video buruk." },
    sirah: { title: "Pembangunan Masjid Nabawi", desc: "Masjid pertama di Madinah, tanah wakaf yatim Sahal dan Suhail, kebersamaan membangun masjid." }
  },
  // We can shorten metadata definition for remaining weeks to keep it clean, but let's make sure it contains beautiful realistic values!
  4: {
    tahsin: { title: "Idgham Bilaghunnah (Tanpa Dengung)", desc: "Nun sukun/tanwin bertemu Lam & Ro, dibaca melebur tanpa dengung." },
    surah: { title: "QS. Al-Fil (Lanjutan)", desc: "Setoran lancar QS. Al-Fil dengan penekanan tajwid." },
    hadits: { title: "Hadits Niat Baik", desc: "Hadits keutamaan berniat baik dalam segala amal saleh." },
    fiqih: { title: "Mengenal Puasa Ramadhan", desc: "Pengertian puasa dasar: Menahan lapar & dahaga dari fajar hingga maghrib." },
    adab: { title: "Adab Berbicara dengan Guru", desc: "Membungkukkan badan sedikit, berbicara lembut, menatap dengan takzim." },
    sirah: { title: "Kisah Mukjizat Air Mengalir dari Jemari Nabi", desc: "Mukjizat Nabi membekali pasukan yang kehausan dengan air dari jari beliau." }
  },
  5: {
    tahsin: { title: "Izhar Halqi (Jelas)", desc: "Nun sukun/tanwin bertemu huruf tenggorokan dibaca jelas tanpa dengung." },
    surah: { title: "QS. Al-Humazah", desc: "Tahsin QS. Al-Humazah ayat 1-9 (Makna: Celaka bagi pengumpat dan pencela)." },
    hadits: { title: "Hadits Menjaga Tangan & Kaki", desc: "Hadits keutamaan tidak menyakiti orang lain dengan lisan, tangan, dan kaki." },
    fiqih: { title: "Praktik Niat Puasa & Buka Puasa", desc: "Melafalkan niat puasa esok hari dan doa berbuka puasa dengan tartil." },
    adab: { title: "Adab Bermain yang Sehat", desc: "Tidak curang, mengalah demi kebaikan, rukun dengan tetangga sekitar rumah." },
    sirah: { title: "Kisah Nabi Menyayangi Anak Yatim", desc: "Kelembutan hati Nabi mengadopsi anak yatim piatu di hari raya idul fitri." }
  },
  6: {
    tahsin: { title: "Iqlab (Mengubah Suara 'M')", desc: "Nun sukun/tanwin bertemu Ba diubah menjadi suara 'Mim' dengan dengung samar." },
    surah: { title: "QS. Al-Humazah (Lanjutan)", desc: "Memastikan kelancaran ayat panjang 'Allatii tath-tholi'u 'alal af-idah'." },
    hadits: { title: "Hadits Larangan Berbohong", desc: "Hadits 'Iyyakum wal kadziba...' (Jauhilah dusta karena dusta menuntun ke neraka)." },
    fiqih: { title: "Mengenal Shalat Sunnah Rawatib", desc: "Shalat sunnah sebelum/sesudah shalat fardhu secara sederhana." },
    adab: { title: "Adab Bertetangga", desc: "Menyapa tetangga, dilarang berisik mengganggu tetangga tidur, berbagi makanan." },
    sirah: { title: "Kisah Akhlak Mulia Nabi kepada Pengemis Yahudi", desc: "Keluhuran budi pekerti Nabi menyuapi pengemis Yahudi buta yang selalu menghina beliau." }
  },
  7: {
    tahsin: { title: "Ikhfa Haqiqi (Samar-samar)", desc: "Menyamarkan bacaan Nun sukun/tanwin saat bertemu 15 huruf Ikhfa dengan mendengung." },
    surah: { title: "QS. Al-'Asr", desc: "Tahsin QS. Al-'Asr ayat 1-3 (Makna: Demi waktu, manusia merugi kecuali yang beriman & saling menasihati)." },
    hadits: { title: "Hadits Menjaga Janji", desc: "Hadits pentingnya menepati janji jika sudah berjanji kepada teman." },
    fiqih: { title: "Mengenal Masjid & Tempat Suci", desc: "Menghormati masjid, menjaga kesucian karpet dari hadas dan najis." },
    adab: { title: "Adab Membaca Al-Qur'an", desc: "Wudhu terlebih dahulu, menghadap kiblat, membaca Ta'awudz, tenang." },
    sirah: { title: "Kisah Sayyidina Ali bin Abi Thalib Kecil", desc: "Keberanian dan kecerdasan Ali sejak usia muda menjadi pembela Islam." }
  },
  8: {
    tahsin: { title: "Latihan Kombinasi Nun Sukun & Tanwin", desc: "Latihan membaca ayat campuran hukum Nun Sukun & Tanwin (Izhar, Idgham, Iqlab, Ikhfa)." },
    surah: { title: "QS. Al-'Asr (Lanjutan)", desc: "Muraja'ah terpadu QS. Quraisy s.d. QS. Al-'Asr." },
    hadits: { title: "Hadits Larangan Mencuri", desc: "Hadits tegas larangan mengambil barang milik orang lain tanpa izin." },
    fiqih: { title: "Mengenal Zakat Fitrah", desc: "Pengenalan zakat fitrah di akhir bulan Ramadhan sebagai pembersih jiwa." },
    adab: { title: "Adab Menuntut Ilmu di Kelas", desc: "Duduk tegak, menyiapkan alat tulis, dilarang mengobrol di luar pelajaran." },
    sirah: { title: "Kisah Keteladanan Sahabat Abu Bakar Ash-Shiddiq", desc: "Ketulusan Abu Bakar mengorbankan seluruh harta demi menemani hijrah Nabi." }
  },
  9: {
    tahsin: { title: "Evaluasi Tengah Semester 2 (Tahsin)", desc: "Uji individu kelancaran membaca tajwid dasar." },
    surah: { title: "Evaluasi Tengah Semester 2 (Hafalan)", desc: "Setoran gabungan hafalan semester 2 awal." },
    hadits: { title: "Evaluasi Tengah Semester 2 (Hadits)", desc: "Uji lisan 6 hadits semester 2." },
    fiqih: { title: "Evaluasi Tengah Semester 2 (Fiqih)", desc: "Evaluasi rukun iman dan zikir setelah shalat." },
    adab: { title: "Evaluasi Adab & Pembiasaan", desc: "Penilaian perilaku santri saat berinteraksi di lingkungan TPQ." },
    sirah: { title: "Evaluasi Kisah Sirah 2", desc: "Uji pemahaman peristiwa Hijrah hingga Masjid Nabawi." }
  },
  10: {
    tahsin: { title: "Mengenal Idgham Mimi / Mithlain", desc: "Mim sukun bertemu Mim dibaca dengung tebal ditahan 2 ketukan." },
    surah: { title: "QS. At-Takatsur", desc: "Tahsin QS. At-Takatsur ayat 1-8 (Makna: Larangan bermegah-megahan yang melalaikan dari ketaatan)." },
    hadits: { title: "Hadits Kasih Sayang Hewan", desc: "Kisah hadits wanita masuk surga karena memberi minum anjing kehausan, dilarang menyiksa hewan." },
    fiqih: { title: "Mengenal Shalat Sunnah Dhuha", desc: "Waktu dhuha, niat shalat dhuha, keutamaan membawa kelancaran rezeki." },
    adab: { title: "Adab Berbelanja Jajan", desc: "Adab antri, jujur dalam membayar, tidak boros membeli makanan manis." },
    sirah: { title: "Piagam Madinah", desc: "Perjanjian perdamaian kaum muslimin dengan kaum Yahudi dan suku lainnya di Madinah." }
  },
  11: {
    tahsin: { title: "Mengenal Ikhfa Syafawi", desc: "Mim sukun bertemu Ba dibaca samar-samar di bibir dengan dengung." },
    surah: { title: "QS. At-Takatsur (Lanjutan)", desc: "Memperbaiki bacaan tasydid pada 'Tsumma latas-alunnal yauma'idzin 'anin-na'iim'." },
    hadits: { title: "Hadits Menyayangi Tumbuhan", desc: "Anjuran menanam pohon, larangan merusak ranting/bunga tanpa alasan." },
    fiqih: { title: "Praktik Gerakan Shalat Dhuha", desc: "Menjalankan shalat dhuha 2 rakaat dipimpin Ustazah." },
    adab: { title: "Adab Berbicara dengan Saudara Kandung", desc: "Kakak menyayangi adik, adik menghormati kakak, dilarang bertengkar memperebutkan mainan." },
    sirah: { title: "Kisah Sahabat Salman Al-Farisi", desc: "Kisah pencarian kebenaran Salman dari Persia hingga mengusulkan parit di perang Khandaq." }
  },
  12: {
    tahsin: { title: "Mengenal Izhar Syafawi", desc: "Mim sukun bertemu huruf selain Mim dan Ba dibaca jelas di bibir tanpa dengung." },
    surah: { title: "QS. Al-Qari'ah", desc: "Tahsin QS. Al-Qari'ah ayat 1-11 (Makna: Kengerian hari kiamat, manusia seperti laron terbang, timbangan amal)." },
    hadits: { title: "Hadits Larangan Mengambil Hak Teman", desc: "Peringatan tidak boleh memakai pensil/penghapus teman tanpa izin terlebih dahulu." },
    fiqih: { title: "Mengenal Shalat Jama'ah", desc: "Syarat menjadi makmum, wajib mengikuti gerakan imam, pahala 27 derajat." },
    adab: { title: "Adab Makan Bersama (Liqo)", desc: "Makan di satu nampan bersama teman, berbagi lauk, bersyukur atas makanan sederhana." },
    sirah: { title: "Keterlibatan Nabi dalam Menggembala Kambing", desc: "Hikmah melatih kesabaran kepemimpinan para nabi lewat menggembala kambing." }
  },
  13: {
    tahsin: { title: "Latihan Kombinasi Hukum Mim Sukun", desc: "Membaca ayat dengan variasi Idgham Mimi, Ikhfa Syafawi, dan Izhar Syafawi." },
    surah: { title: "QS. Al-Qari'ah (Lanjutan)", desc: "Memperbaiki ketukan mad wajib muttasil pada 'Wa takuunul jibaalu kal 'ihnil manfuus'." },
    hadits: { title: "Hadits Senang Membantu Ibu", desc: "Hadits tentang anak sholeh yang berbakti membantu pekerjaan rumah tangga." },
    fiqih: { title: "Mengenal Pakaian Shalat Suci", desc: "Membedakan pakaian bersih wangi biasa dengan pakaian bebas najis untuk shalat." },
    adab: { title: "Adab Berada di Tempat Umum", desc: "Menjaga fasilitas umum, tidak coret-coret tembok, antri naik kendaraan." },
    sirah: { title: "Kisah Kedermawanan Sayyidina Utsman bin Affan", desc: "Utsman membeli sumur Raumah dari orang Yahudi untuk digratiskan bagi kaum muslimin." }
  },
  14: {
    tahsin: { title: "Membaca Mad Jaiz Munfasil", desc: "Cara membaca mad thabi'i bertemu hamzah di lain kata sepanjang 4-5 harakat." },
    surah: { title: "QS. Al-'Adiyat", desc: "Tahsin QS. Al-'Adiyat ayat 1-11 (Makna: Kuda perang yang berlari kencang, manusia kufur nikmat, kiamat dada dibongkar)." },
    hadits: { title: "Hadits Keutamaan Bersedekah", desc: "Hadits 'Al-Yadul 'ulya khairun minal yadis-sufla' (Tangan di atas lebih baik daripada tangan di bawah)." },
    fiqih: { title: "Doa Menghormati Orang Tua dalam Shalat", desc: "Membaca doa ampunan orang tua di antara gerakan sujud/tasyahud." },
    adab: { title: "Adab Menjenguk Orang Sakit (Lanjutan)", desc: "Membacakan doa kesembuhan 'Allahumma rabban-naas...'." },
    sirah: { title: "Kisah Keberanian Sayyidina Umar bin Khattab", desc: "Ketegasan Umar membela Islam secara terang-terangan di hadapan kaum kafir Quraisy." }
  },
  15: {
    tahsin: { title: "Membaca Mad Wajib Muttasil", desc: "Cara membaca mad thabi'i bertemu hamzah dalam satu kata sepanjang 5 harakat wajib." },
    surah: { title: "QS. Al-'Adiyat (Lanjutan)", desc: "Kelancaran melafalkan lafal tersengal-sengal 'Fal muuriyaati qod-haa' secara fasih." },
    hadits: { title: "Hadits Saling Menyayangi Sesama", desc: "Hadits 'Irhamuu man fil ardhi yarhamkum man fis-samaa' (Sayangilah yang di bumi)." },
    fiqih: { title: "Praktik Shalat Sunnah Gerakan Mandiri", desc: "Santri mempraktikkan shalat dhuha 2 rakaat secara mandiri dinilai Ustazah." },
    adab: { title: "Adab di Toilet / Istinja'", desc: "Dilarang bernyanyi di kamar mandi, keluar mendahulukan kaki kanan." },
    sirah: { title: "Kisah Fatimah Az-Zahra", desc: "Keteladanan putri tercinta Nabi yang sabar, sederhana, dan berbakti." }
  },
  16: {
    tahsin: { title: "Latihan Waqaf & Ibtida' Dasar", desc: "Belajar tempat berhenti (Waqaf) dan memulai bacaan kembali (Ibtida') saat nafas tidak cukup." },
    surah: { title: "QS. Al-Zalzalah", desc: "Tahsin QS. Al-Zalzalah ayat 1-8 (Makna: Bumi digoncangkan sedahsyat-dahsyatnya, balasan sekecil zarrah)." },
    hadits: { title: "Hadits Menjaga Kebersihan Mulut", desc: "Sunnah bersiwak/menggosok gigi sebelum shalat/belajar mengaji." },
    fiqih: { title: "Evaluasi Gerakan Shalat Berjama'ah", desc: "Evaluasi kekompakan makmum mengikuti imam tanpa mendahului gerakan." },
    adab: { title: "Adab Membaca Doa Sehari-hari", desc: "Menghayati makna doa sebelum makan, keluar rumah, naik kendaraan." },
    sirah: { title: "Kisah Sahabat Anas bin Malik", desc: "Pelayan setia Rasulullah sejak kecil yang menceritakan betapa lembutnya akhlak nabi." }
  },
  17: {
    tahsin: { title: "Muraja'ah Akbar & Khataman Juz Amma Dasar", desc: "Muraja'ah klasikal melafalkan bersama surat-surat yang telah dihafal selama semester 2." },
    surah: { title: "QS. Al-Zalzalah (Lanjutan)", desc: "Setoran final QS. Al-Zalzalah penutup target tahunan kelas dasar." },
    hadits: { title: "Review 16 Hadits Semester 2", desc: "Mengulang lisan seluruh hadits semester 2 dengan nada ceria." },
    fiqih: { title: "Praktik Shalat Berjamaah Lengkap", desc: "Praktik shalat lengkap 4 rakaat dipimpin santri putra teladan." },
    adab: { title: "Simulasi Adab Harian Santri", desc: "Menilai adab santri secara spontan dalam kehidupan kelas sehari-hari." },
    sirah: { title: "Kuis Sirah Nabawiyah Semester 2", desc: "Evaluasi cerdas cermat penutup kisah nabi di Madinah." }
  },
  18: {
    tahsin: { title: "Imtihan Akhir Semester 2 (Kenaikan Jilid)", desc: "Ujian kenaikan tingkat kelancaran membaca Al-Qur'an." },
    surah: { title: "Imtihan Akhir Hafalan Al-Qur'an", desc: "Ujian komprehensif hafalan QS. Quraisy s.d. Al-Zalzalah." },
    hadits: { title: "Imtihan Akhir Hafalan Hadits", desc: "Setoran hafalan 16 hadits semester 2 di depan Dewan Guru." },
    fiqih: { title: "Imtihan Akhir Fiqih", desc: "Ujian kelulusan fiqih shalat berjamaah dan tata cara wudhu bersih." },
    adab: { title: "Penilaian Akhlak & Buku Penghubung", desc: "Penilaian penutup buku perkembangan akhlak santri ditandatangani orang tua." },
    sirah: { title: "Evaluasi Akhir Sirah Nabawiyah", desc: "Ujian tulis/lisan kisah-kisah keteladanan Nabi & Sahabat." }
  }
};

// ===================================================
// 2. LEVEL MENENGAH (MUTAWASSIT) - Kelas 4-6 SD
// ===================================================
// Generate Menengah & Lanjut structures using template pattern
const menengahSemester1Weeks = generateSyllabusForLevel("Menengah", 1, {
  1: {
    tahsin: { title: "Tajwid: Nun Sukun & Tanwin (Pengenalan)", desc: "Peta konsep hukum Nun Sukun & Tanwin serta pembagiannya." },
    surah: { title: "QS. Al-Bayyinah", desc: "Tahsin QS. Al-Bayyinah ayat 1-4 (Kandungan: Bukti yang nyata dari ajaran Allah)." },
    hadits: { title: "Hadits Menuntut Ilmu Mulia", desc: "Hadits menuntut ilmu adalah jalan menuju surga Allah." },
    fiqih: { title: "Thaharah: Pembagian Najis", desc: "Najis Mukhaffafah (ringan), Mutawassithah (sedang), Mughalladhah (berat) & contohnya." },
    adab: { title: "Adab di Majelis Ilmu", desc: "Fokus mendengarkan, tidak bersenda gurau, mencatat ilmu, menjaga kesopanan berpakaian." },
    sirah: { title: "Sebab Hijrah Rasulullah ke Madinah", desc: "Perjanjian Aqabah I & II, boikot kafir Quraisy, instruksi hijrah massal." }
  },
  2: {
    tahsin: { title: "Tajwid: Izhar Halqi mendalam", desc: "Cara membaca jelas Nun sukun/tanwin bertemu 6 huruf halqi serta contoh Al-Qur'an." },
    surah: { title: "QS. Al-Bayyinah (Lanjutan)", desc: "Hafalan QS. Al-Bayyinah ayat 5-8 (Kandungan: Balasan surga Adn bagi khairul bariyyah)." },
    hadits: { title: "Hadits Keutamaan Jujur", desc: "Hadits 'Innas-sidqa yahdi ilal-birr...' (Jujur membawa kebaikan, kebaikan ke surga)." },
    fiqih: { title: "Cara Mensucikan Najis", desc: "Praktik membasuh air mengalir, mencuci 7 kali dengan tanah untuk najis mughalladhah." },
    adab: { title: "Adab Berbincang dengan yang Lebih Tua", desc: "Menggunakan bahasa yang hormat (Krama/Sopan), dilarang membentak." },
    sirah: { title: "Peristiwa di Gua Tsur", desc: "Perjuangan Abu Bakar menutup lubang ular dengan kaki, kepasrahan Nabi 'Jangan bersedih Allah bersama kita'." }
  },
  3: {
    tahsin: { title: "Tajwid: Idgham Bighunnah & Bilaghunnah", desc: "Perbedaan peleburan berdengung (Y-N-M-W) dan tanpa dengung (L-R) beserta contoh detail." },
    surah: { title: "QS. Al-Qadr", desc: "Tahsin & hafalan QS. Al-Qadr ayat 1-5 (Makna: Kemuliaan malam Lailatul Qadr)." },
    hadits: { title: "Hadits Larangan Ghibah", desc: "Larangan menggunjing sesama muslim ibarat memakan daging bangkai saudara sendiri." },
    fiqih: { title: "Syarat-Syarat Sah Wudhu", desc: "Syarat sah wudhu: Islam, tamyiz, menggunakan air suci, tidak ada penghalang air ke kulit (cat kuku, dll)." },
    adab: { title: "Adab Membaca & Menjaga Al-Qur'an", desc: "Meletakkan mushaf di tempat tinggi, berwudhu, khusyuk saat membaca." },
    sirah: { title: "Strategi Hijrah Nabi Muhammad SAW", desc: "Peran Ali tidur di ranjang nabi, peran Asma membawa makanan, rute memutar ke Madinah." }
  },
  // Adding core weeks
  8: {
    tahsin: { title: "Tajwid: Iqlab mendalam", desc: "Praktik merapatkan bibir samar (Iqlab) saat membaca ayat-ayat juz amma." },
    surah: { title: "QS. Al-'Alaq", desc: "Tahsin QS. Al-'Alaq ayat 1-19 (Wahyu pertama, larangan bersujud kepada selain Allah)." },
    hadits: { title: "Hadits Menjaga Lisan", desc: "Hadits keselamatan seorang muslim terletak pada kemampuannya menjaga lisan." },
    fiqih: { title: "Hal yang Membatalkan Shalat", desc: "Mempelajari 11 perkara membatalkan shalat (berbicara sengaja, makan, banyak gerakan, hadas)." },
    adab: { title: "Adab Bersosial Media secara Islami", desc: "Larangan menyebar hoax/berita bohong, adab berkomentar santun di internet." },
    sirah: { title: "Piagam Madinah: Kerukunan Sosial", desc: "Butir-butir Piagam Madinah yang menjamin kebebasan beragama dan pertahanan bersama." }
  },
  9: {
    tahsin: { title: "Evaluasi Tengah Semester (Tajwid)", desc: "Ujian teori dan praktik hukum Nun Sukun & Tanwin." },
    surah: { title: "Evaluasi Tengah Semester (Hafalan)", desc: "Uji kelancaran hafalan surat Al-Bayyinah s.d. Al-Qadr." },
    hadits: { title: "Evaluasi Tengah Semester (Hadits)", desc: "Setoran 6 hadits semester 1 kelas menengah beserta artinya." },
    fiqih: { title: "Evaluasi Tengah Semester (Fiqih)", desc: "Praktik thaharah dan syarat-syarat sah shalat." },
    adab: { title: "Evaluasi Adab Harian", desc: "Penilaian kedisiplinan dan sopan santun santri di TPQ." },
    sirah: { title: "Evaluasi Sirah Nabawiyah", desc: "Ujian pemahaman kisah Hijrah nabi hingga pendirian negara Madinah." }
  }
});

const menengahSemester2Weeks = generateSyllabusForLevel("Menengah", 2, {
  1: {
    tahsin: { title: "Tajwid: Hukum Mim Sukun (Pengenalan)", desc: "Memahami 3 hukum Mim Sukun: Ikhfa Syafawi, Idgham Mimi, Izhar Syafawi." },
    surah: { title: "QS. At-Tin", desc: "Tahsin QS. At-Tin ayat 1-8 (Kandungan: Manusia diciptakan dalam bentuk sebaik-baiknya)." },
    hadits: { title: "Hadits Larangan Sombong", desc: "Hadits 'La yadkhulul jannah man kana fi qalbihi mitsqalu dzarratin min kibr'." },
    fiqih: { title: "Kewajiban Shalat Fardhu", desc: "Dalil kewajiban shalat fardhu dan bahaya meninggalkan shalat fardhu secara sengaja." },
    adab: { title: "Adab Menghormati Orang Tua & Guru", desc: "Praktik nyata berbuat baik, mendoakan setiap selesai shalat fardhu." },
    sirah: { title: "Perang Badr: Latar Belakang", desc: "Sebab terjadinya perang Badr, pertahanan kaum muslimin mempertahankan hak miliknya." }
  },
  8: {
    tahsin: { title: "Tajwid: Idgham Mimi mendalam", desc: "Karakteristik pertemuan dua huruf Mim dan cara membacanya dengan ghunnah penuh." },
    surah: { title: "QS. Al-Insyirah", desc: "Tahsin QS. Al-Insyirah ayat 1-8 (Kandungan: Di balik kesulitan pasti ada kemudahan)." },
    hadits: { title: "Hadits Larangan Berprasangka Buruk", desc: "Hadits larangan menggunjing dan menduga-duga keburukan muslim lain." },
    fiqih: { title: "Praktik Shalat Gerakan Khusyuk", desc: "Memperbaiki ketenangan thuma'ninah dalam ruku, sujud, dan i'tidal." },
    adab: { title: "Adab di Lingkungan Masyarakat", desc: "Toleransi beragama, membantu tetangga kerja bakti, sopan santun di jalanan." },
    sirah: { title: "Perang Uhud: Hikmah Kepatuhan", desc: "Kisah bukit rumat (pemanah) yang melanggar perintah nabi dan hikmah di baliknya." }
  },
  9: {
    tahsin: { title: "Evaluasi Tengah Semester 2 (Tajwid)", desc: "Ujian evaluasi hukum Mim Sukun secara tertulis & lisan." },
    surah: { title: "Evaluasi Tengah Semester 2 (Hafalan)", desc: "Uji hafalan QS. At-Tin s.d. Al-Insyirah." },
    hadits: { title: "Evaluasi Tengah Semester 2 (Hadits)", desc: "Evaluasi kelancaran setoran hadits semester 2." },
    fiqih: { title: "Evaluasi Tengah Semester 2 (Fiqih)", desc: "Kuis teori shalat fardhu & sunnah dhuha." },
    adab: { title: "Evaluasi Adab Harian", desc: "Observasi akhlak santri di lingkungan masjid." },
    sirah: { title: "Evaluasi Sirah Perang Badr & Uhud", desc: "Cerdas cermat sejarah perjuangan nabi melindungi umat." }
  }
});


// ===================================================
// 3. LEVEL LANJUT (MUNTAHI) - Kelas MTs / SMP
// ===================================================
const lanjutSemester1Weeks = generateSyllabusForLevel("Lanjut", 1, {
  1: {
    tahsin: { title: "Tajwid: Hukum Alif Lam & Lam Jalalah", desc: "Perbedaan membaca Al- Qomariyah & Al- Syamsiyah serta hukum tafkhim/tarqiq pada lafal Allah." },
    surah: { title: "QS. Al-Mulk (Ayat 1-5)", desc: "Tahsin & Tafsir QS. Al-Mulk ayat 1-5 (Kandungan: Kekuasaan Allah menciptakan mati & hidup sebagai ujian)." },
    hadits: { title: "Hadits Niat (Innamal A'malu bin-Niyyat)", desc: "Pentingnya menata niat ikhlas semata-mata karena Allah dalam menuntut ilmu." },
    fiqih: { title: "Thaharah: Mandi Wajib (Hadas Besar)", desc: "Sebab mandi wajib (mimpi basah/haid), rukun mandi wajib, praktik niat & tata caranya." },
    adab: { title: "Adab Bergaul Lawan Jenis secara Islami", desc: "Batasan aurat, menjaga pandangan (Ghadul Bashar), larangan berkhalwat (berduaan)." },
    sirah: { title: "Perjanjian Hudaibiyah", desc: "Diplomasi cerdas Rasulullah, butir perjanjian yang awalnya merugikan namun menjadi kemenangan besar." }
  },
  2: {
    tahsin: { title: "Tajwid: Mad Far'i - Mad Wajib Muttasil", desc: "Aturan membaca Mad Wajib sepanjang 5-6 harakat dalam satu kata beserta contoh mushaf." },
    surah: { title: "QS. Al-Mulk (Ayat 6-10)", desc: "Hafalan QS. Al-Mulk ayat 6-10 (Kandungan: Penyesalan penghuni neraka yang tidak mendengar peringatan)." },
    hadits: { title: "Hadits Pilar Agama Islam", desc: "Hadits 'Ash-shalatu 'imadud-diin' (Shalat adalah tiang agama, yang meninggalkan meruntuhkannya)." },
    fiqih: { title: "Ketentuan Haid & Istihadhah (Bagi Santriwati)", desc: "Memahami darah haid, masa suci, dan darah penyakit (istihadhah) serta kewajiban ibadah." },
    adab: { title: "Adab Kepada Kedua Orang Tua Masa Remaja", desc: "Berbakti di usia remaja, cara menolak perintah maksiat orang tua dengan tetap santun." },
    sirah: { title: "Fathu Makkah (Pembebasan Kota Mekkah)", desc: "Kemenangan damai umat Islam, penghancuran berhala di sekitar Ka'bah, pemaafan massal Nabi." }
  },
  3: {
    tahsin: { title: "Tajwid: Mad Far'i - Mad Jaiz Munfasil", desc: "Aturan membaca Mad Jaiz sepanjang 2, 4, atau 5 harakat di luar kata." },
    surah: { title: "QS. Al-Mulk (Ayat 11-15)", desc: "Hafalan QS. Al-Mulk ayat 11-15 (Kandungan: Allah Mengetahui rahasia hati, bumi dimudahkan mencari rezeki)." },
    hadits: { title: "Hadits Takwa di Mana Saja", desc: "Hadits 'Ittaqillaha haitsuma kunta' (Bertakwalah kepada Allah di mana pun kamu berada)." },
    fiqih: { title: "Praktik Tayammum Sempurna", desc: "Sebab tayammum (ketiadaan air/sakit), media tanah berdebu, praktik gerakan mengusap wajah & tangan." },
    adab: { title: "Adab Bersosial Media & Tabayyun", desc: "Etika menyaring informasi sebelum sharing, menghindari ghibah online, dilarang cyberbullying." },
    sirah: { title: "Haji Wada' & Khutbah Terakhir Rasulullah", desc: "Pesan kemanusiaan terakhir nabi: Larangan riba, memuliakan wanita, persaudaraan muslim." }
  },
  9: {
    tahsin: { title: "Evaluasi Tengah Semester (Tajwid Mad Far'i)", desc: "Uji tertulis & lisan hukum Mad Wajib, Mad Jaiz, dan Alif Lam." },
    surah: { title: "Evaluasi Tengah Semester (Hafalan QS. Al-Mulk)", desc: "Uji lisan hafalan QS. Al-Mulk ayat 1-15 secara tartil." },
    hadits: { title: "Evaluasi Tengah Semester (Hadits Lanjut)", desc: "Uji pemahaman makna hadits Niat, Tiang Agama, dan Takwa." },
    fiqih: { title: "Evaluasi Tengah Semester (Fiqih Remaja)", desc: "Ujian tulis hukum thaharah mandi wajib, haid, istihadah, dan tayammum." },
    adab: { title: "Evaluasi Adab Remaja", desc: "Observasi kesantunan sosial media, pakaian islami, dan pergaulan sehari-hari." },
    sirah: { title: "Evaluasi Sirah Sejarah Islam", desc: "Ujian tertulis peristiwa Fathu Makkah hingga Haji Wada'." }
  }
});

const lanjutSemester2Weeks = generateSyllabusForLevel("Lanjut", 2, {
  1: {
    tahsin: { title: "Tajwid: Qalqalah Sugra & Kubra mendalam", desc: "Karakteristik pantulan tipis di tengah kata (Sugra) dan pantulan tebal di akhir ayat (Kubra) beserta latihan detail." },
    surah: { title: "QS. Al-Mulk (Ayat 16-20)", desc: "Hafalan QS. Al-Mulk ayat 16-20 (Kandungan: Keamanan hanya milik Allah, peringatan siksa bumi berguncang)." },
    hadits: { title: "Hadits Menyempurnakan Akhlak", desc: "Hadits 'Innama bu'itstu li-utammima makarimal akhlaq' (Sesungguhnya aku diutus menyempurnakan akhlak mulia)." },
    fiqih: { title: "Shalat Sunnah Istikharah & Tahajjud", desc: "Kaidah shalat malam sepertiga malam, niat & doa shalat tahajjud serta istikharah." },
    adab: { title: "Adab Berpakaian Syar'i bagi Remaja", desc: "Ketentuan menutup aurat laki-laki & perempuan sesuai sunnah: Longgar, tebal, tidak menyerupai lawan jenis." },
    sirah: { title: "Detik-Detik Wafatnya Rasulullah SAW", desc: "Kisah hari-hari terakhir nabi, kepedulian nabi memanggil 'Ummatii... ummatii...', dan wafat di pangkuan Aisyah." }
  },
  9: {
    tahsin: { title: "Evaluasi Tengah Semester 2 (Tajwid Qalqalah)", desc: "Ujian membedakan pelafalan Qalqalah sugra dan kubra." },
    surah: { title: "Evaluasi Tengah Semester 2 (Hafalan)", desc: "Uji lisan kelanjutan hafalan QS. Al-Mulk." },
    hadits: { title: "Evaluasi Tengah Semester 2 (Hadits)", desc: "Ujian lisan setoran hadits menyempurnakan akhlak." },
    fiqih: { title: "Evaluasi Tengah Semester 2 (Fiqih)", desc: "Praktik shalat tahajjud dan doa istikharah." },
    adab: { title: "Evaluasi Adab Berpakaian & Gaul", desc: "Observasi kesesuaian berpakaian menutup aurat di TPQ." },
    sirah: { title: "Evaluasi Sirah Nabawiyah Penutup", desc: "Ujian pemahaman sejarah wafatnya Rasulullah SAW." }
  }
});

// ==========================================
// CURRICULUM EXPORT
// ==========================================
export const curriculumData: LevelSyllabus[] = [
  {
    level: "Dasar",
    description: "Syllabus khusus untuk santri tingkat pemula, berfokus pada pengenalan huruf hijaiyah, harakat dasar, hafalan surat-surat terpendek, hadits adab harian, adab sopan santun praktis, wudhu, gerakan shalat fardhu, serta sirah nabi masa kecil.",
    targetAge: "Kelas 2-3 SD (Usia 7-9 Tahun)",
    semester1: generateSyllabusForLevel("Dasar", 1, dasarSemester1Data),
    semester2: generateSyllabusForLevel("Dasar", 2, dasarSemester2Data)
  },
  {
    level: "Menengah",
    description: "Syllabus tingkat menengah, berfokus pada kelancaran membaca Al-Qur'an tajwid hukum Nun & Mim Sukun, hafalan juz amma bagian tengah, hadits akhlak sosial, fiqih thaharah (najis), rukun/syarat shalat, serta sirah nabi periode hijrah & pertahanan Madinah.",
    targetAge: "Kelas 4-6 SD (Usia 10-12 Tahun)",
    semester1: menengahSemester1Weeks,
    semester2: menengahSemester2Weeks
  },
  {
    level: "Lanjut",
    description: "Syllabus tingkat lanjut untuk santri remaja, mencakup hukum tajwid Mad Far'i, makhraj gharib, hafalan surat pilihan seperti Al-Mulk, hadits prinsip Islam, fiqih ibadah remaja (mandi wajib/haid/shalat malam), adab bergaul & sosial media islami, serta sirah nabi periode diplomatik/fathu makkah hingga wafat.",
    targetAge: "Kelas MTs / SMP (Usia 13-15 Tahun)",
    semester1: lanjutSemester1Weeks,
    semester2: lanjutSemester2Weeks
  }
];

// Helper to convert indexed semester data back to array if needed
export const getWeeksForLevelAndSemester = (level: "Dasar" | "Menengah" | "Lanjut", semester: 1 | 2): WeekSyllabus[] => {
  const levelSyllabus = curriculumData.find(c => c.level === level);
  if (!levelSyllabus) return [];
  
  const data = semester === 1 ? levelSyllabus.semester1 : levelSyllabus.semester2;
  
  if (Array.isArray(data)) {
    return data;
  }
  
  // Convert object { 1: WeekData, 2: WeekData... } into array
  const weeks: WeekSyllabus[] = [];
  for (let w = 1; w <= 18; w++) {
    const weekData = (data as any)[w];
    if (weekData) {
      weeks.push({
        week: w,
        semester,
        topics: {
          "Tahsin & Tajwid": {
            title: weekData.tahsin.title,
            description: weekData.tahsin.desc || weekData.tahsin.description
          },
          "Hafalan Surat Pendek": {
            title: weekData.surah.title,
            description: weekData.surah.desc || weekData.surah.description
          },
          "Hafalan Hadits": {
            title: weekData.hadits.title,
            description: weekData.hadits.desc || weekData.hadits.description
          },
          "Fiqih Ibadah": {
            title: weekData.fiqih.title,
            description: weekData.fiqih.desc || weekData.fiqih.description
          },
          "Adab & Akhlak": {
            title: weekData.adab.title,
            description: weekData.adab.desc || weekData.adab.description
          },
          "Sirah Nabawiyah": {
            title: weekData.sirah.title,
            description: weekData.sirah.desc || weekData.sirah.description
          }
        }
      });
    } else {
      // Return a basic fallback if missing
      weeks.push({
        week: w,
        semester,
        topics: {
          "Tahsin & Tajwid": { title: "Muraja'ah Klasikal", description: "Melancarkan bacaan bersama Ustazah." },
          "Hafalan Surat Pendek": { title: "Muraja'ah Bersama", description: "Mengulang hafalan surat-surat terdahulu." },
          "Hafalan Hadits": { title: "Adab Harian", description: "Mengingat kembali hadits adab harian." },
          "Fiqih Ibadah": { title: "Praktik Bersama", description: "Praktik ibadah fardhu secara klasikal." },
          "Adab & Akhlak": { title: "Akhlak Mulia", description: "Pembiasaan adab sopan santun di kelas." },
          "Sirah Nabawiyah": { title: "Hikmah Kisah", description: "Mengambil keteladanan para Nabi." }
        }
      });
    }
  }
  return weeks;
};
