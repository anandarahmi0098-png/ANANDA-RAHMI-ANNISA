import { WeekSyllabus, SubjectType, TPQIdentity } from "../types";

interface TextBlock {
  text: string;
  isHeading1?: boolean;
  isHeading2?: boolean;
  isHeading3?: boolean;
  isBold?: boolean;
  isItalic?: boolean;
  color?: { red: number; green: number; blue: number };
  fontSize?: number;
}

/**
 * Creates a beautiful Google Doc containing the Syllabus
 */
export async function exportSyllabusToGoogleDocs(
  accessToken: string,
  level: string,
  semester: number,
  weeks: WeekSyllabus[],
  tpqIdentity?: TPQIdentity
): Promise<string> {
  const schoolName = tpqIdentity?.namaTPQ || "TPQ HUBBUL QUR'AN";
  const teacherName = tpqIdentity?.guruPembimbing || "Ustazah Ananda Rahmi Annisa";
  const title = `Silabus Kurikulum ${schoolName} - Level ${level} (Sem. ${semester})`;
  
  // Create plain text and build formatting requests
  const blocks: TextBlock[] = [
    { text: "KURIKULUM & SILABUS PENDIDIKAN AL-QUR'AN\n", isHeading1: true, fontSize: 18, color: { red: 0.1, green: 0.37, blue: 0.13 } }, // Deep Emerald
    { text: `${schoolName.toUpperCase()}\n`, isHeading2: true, fontSize: 14, color: { red: 0.74, green: 0.53, blue: 0.0 } }, // Gold Accent
    { text: `Penyusun: ${teacherName} (Pengalaman 15+ Tahun)\n`, isItalic: true, fontSize: 10 },
    { text: `Jenjang Kelas: Level ${level}  |  Semester: ${semester}  |  Tahun Ajaran: 2026/2027\n`, isBold: true, fontSize: 11 },
    { text: "========================================================================\n\n", color: { red: 0.5, green: 0.5, blue: 0.5 } },
  ];

  // Append each week's lessons
  weeks.forEach((w) => {
    blocks.push({ text: `MINGGU KE-${w.week}\n`, isHeading2: true, fontSize: 13, color: { red: 0.1, green: 0.37, blue: 0.13 } });
    
    const subjects: SubjectType[] = [
      "Tahsin & Tajwid",
      "Hafalan Surat Pendek",
      "Hafalan Hadits",
      "Fiqih Ibadah",
      "Adab & Akhlak",
      "Sirah Nabawiyah"
    ];

    subjects.forEach((subj) => {
      const topic = w.topics[subj];
      if (topic) {
        blocks.push({ text: `  • ${subj}: `, isBold: true, fontSize: 10, color: { red: 0.12, green: 0.12, blue: 0.12 } });
        blocks.push({ text: `${topic.title} \n`, isBold: true, fontSize: 10 });
        blocks.push({ text: `    Keterangan: ${topic.description}\n\n`, fontSize: 9, isItalic: true, color: { red: 0.4, green: 0.4, blue: 0.4 } });
      }
    });
    
    blocks.push({ text: "------------------------------------------------------------------------\n\n", color: { red: 0.7, green: 0.7, blue: 0.7 } });
  });

  return await createAndFillGoogleDoc(accessToken, title, blocks);
}

/**
 * Creates a beautiful Graduation Certificate in Google Docs
 */
export async function exportCertificateToGoogleDocs(
  accessToken: string,
  santriName: string,
  level: string,
  semester: number,
  predikat: string,
  averageScore: number,
  totalEval: number,
  tpqIdentity?: TPQIdentity
): Promise<string> {
  const schoolName = tpqIdentity?.namaTPQ || "TPQ HUBBUL QUR'AN YOGYAKARTA";
  const teacherName = tpqIdentity?.guruPembimbing || "Ustazah Ananda Rahmi Annisa";
  const kepalaName = tpqIdentity?.kepalaTPQ || "Ustadz K.H. Ahmad Syarif, M.A.";
  const alamat = tpqIdentity?.alamatTPQ || "Yogyakarta, Indonesia";
  
  const title = `Sertifikat Kelulusan - ${santriName} (Level ${level}, Sem. ${semester})`;
  
  const blocks: TextBlock[] = [
    { text: "\n\n\n", fontSize: 12 },
    { text: "SERTIFIKAT KELULUSAN SEMESTER\n", isHeading1: true, fontSize: 24, color: { red: 0.1, green: 0.37, blue: 0.13 } },
    { text: `${schoolName.toUpperCase()}\n\n`, isHeading2: true, fontSize: 16, color: { red: 0.74, green: 0.53, blue: 0.0 } },
    { text: "Diberikan dengan hormat kepada:\n\n", isItalic: true, fontSize: 12, color: { red: 0.2, green: 0.2, blue: 0.2 } },
    { text: `${santriName.toUpperCase()}\n\n`, isHeading1: true, fontSize: 20, color: { red: 0.12, green: 0.12, blue: 0.12 } },
    { text: `Atas kelulusan dan keberhasilan menyelesaikan pembelajaran Al-Qur'an pada:\n`, fontSize: 12 },
    { text: `Jenjang Kelas: Level ${level}  |  Semester: ${semester}\n`, isBold: true, fontSize: 12, color: { red: 0.1, green: 0.37, blue: 0.13 } },
    { text: `Tahun Ajaran: 2026/2027\n\n`, isBold: true, fontSize: 11 },
    { text: "========================================================================\n", color: { red: 0.74, green: 0.53, blue: 0.0 } },
    { text: "IKHTISAR CAPAIAN & PRESTASI BELAJAR\n", isBold: true, fontSize: 13, color: { red: 0.1, green: 0.37, blue: 0.13 } },
    { text: "========================================================================\n\n", color: { red: 0.74, green: 0.53, blue: 0.0 } },
    { text: `  • Total Evaluasi Tercatat : `, isBold: true, fontSize: 11 },
    { text: `${totalEval} Kegiatan Pembelajaran\n`, fontSize: 11 },
    { text: `  • Rata-rata Nilai Capaian : `, isBold: true, fontSize: 11 },
    { text: `${averageScore.toFixed(2)} / 3.00\n`, fontSize: 11 },
    { text: `  • Predikat Kelulusan      : `, isBold: true, fontSize: 11 },
    { text: `${predikat}\n\n`, isBold: true, fontSize: 12, color: { red: 0.1, green: 0.37, blue: 0.13 } },
    { text: "------------------------------------------------------------------------\n\n", color: { red: 0.7, green: 0.7, blue: 0.7 } },
    { text: "Semoga ilmu yang diperoleh menjadi berkah, menuntun langkah dalam mencintai Al-Qur'an, serta menjadi hafizh/hafizhah yang berakhlak mulia di masa depan. Aamiin.\n\n\n\n", isItalic: true, fontSize: 11, color: { red: 0.3, green: 0.3, blue: 0.3 } },
    { text: `${alamat.split(",")[0]}, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}\n`, fontSize: 11 },
    { text: `Kepala TPQ: ${kepalaName}   |   Guru Pengajar:\n\n\n\n\n`, fontSize: 11 },
    { text: `${teacherName}\n`, isBold: true, fontSize: 12, color: { red: 0.12, green: 0.12, blue: 0.12 } },
    { text: `Guru Pengajar ${schoolName}\n`, fontSize: 10, color: { red: 0.4, green: 0.4, blue: 0.4 } },
  ];

  return await createAndFillGoogleDoc(accessToken, title, blocks);
}

/**
 * Creates a beautiful Google Doc from a generated Modul Ajar (which is in Markdown format)
 */
export async function exportModulToGoogleDocs(
  accessToken: string,
  level: string,
  subject: string,
  semester: number,
  week: number,
  topic: string,
  markdownContent: string,
  tpqIdentity?: TPQIdentity
): Promise<string> {
  const schoolName = tpqIdentity?.namaTPQ || "TPQ HUBBUL QUR'AN";
  const teacherName = tpqIdentity?.guruPembimbing || "Ustazah Ananda Rahmi Annisa";
  const title = `Modul Ajar TPQ - ${subject} (Mg ${week}, Sem. ${semester})`;
  
  // Simple markdown parser to text blocks
  const blocks: TextBlock[] = [
    { text: "MODUL AJAR PEMBELAJARAN TPQ INTERAKTIF\n", isHeading1: true, fontSize: 18, color: { red: 0.1, green: 0.37, blue: 0.13 } },
    { text: `${schoolName.toUpperCase()}\n`, isHeading2: true, fontSize: 14, color: { red: 0.74, green: 0.53, blue: 0.0 } },
    { text: `Penyusun: ${teacherName}  |  Materi: ${subject}\n`, isBold: true, fontSize: 11 },
    { text: `Jenjang: Level ${level}  |  Semester: ${semester}  |  Minggu ke-${week}\n`, isBold: true, fontSize: 10 },
    { text: `Topik Pembelajaran: ${topic}\n`, isBold: true, fontSize: 12, color: { red: 0.1, green: 0.37, blue: 0.13 } },
    { text: "========================================================================\n\n", color: { red: 0.5, green: 0.5, blue: 0.5 } },
  ];

  // Parse markdown line by line
  const lines = markdownContent.split("\n");
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      blocks.push({ text: "\n" });
      return;
    }

    if (trimmed.startsWith("###")) {
      blocks.push({ text: trimmed.replace(/^###\s*/, "") + "\n", isHeading3: true, fontSize: 12, isBold: true, color: { red: 0.1, green: 0.37, blue: 0.13 } });
    } else if (trimmed.startsWith("##")) {
      blocks.push({ text: trimmed.replace(/^##\s*/, "") + "\n", isHeading2: true, fontSize: 14, isBold: true, color: { red: 0.1, green: 0.37, blue: 0.13 } });
    } else if (trimmed.startsWith("#")) {
      blocks.push({ text: trimmed.replace(/^#\s*/, "") + "\n", isHeading1: true, fontSize: 16, isBold: true, color: { red: 0.1, green: 0.37, blue: 0.13 } });
    } else if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
      // Bold list items or basic items
      const itemText = trimmed.replace(/^[-*]\s*/, "");
      blocks.push({ text: "  • ", isBold: true, color: { red: 0.1, green: 0.37, blue: 0.13 } });
      
      // Simple parse for inline bold like **text**
      parseInlineStyles(itemText, blocks);
      blocks.push({ text: "\n" });
    } else if (/^\d+\./.test(trimmed)) {
      // Numbered list
      const numMatch = trimmed.match(/^(\d+\.)\s*(.*)/);
      if (numMatch) {
        blocks.push({ text: `  ${numMatch[1]} `, isBold: true });
        parseInlineStyles(numMatch[2], blocks);
        blocks.push({ text: "\n" });
      } else {
        parseInlineStyles(trimmed, blocks);
        blocks.push({ text: "\n" });
      }
    } else {
      parseInlineStyles(trimmed, blocks);
      blocks.push({ text: "\n" });
    }
  });

  return await createAndFillGoogleDoc(accessToken, title, blocks);
}

/**
 * Parses inline formatting like **bold** into blocks
 */
function parseInlineStyles(text: string, blocks: TextBlock[]) {
  const boldRegex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    const textBefore = text.substring(lastIndex, match.index);
    if (textBefore) {
      blocks.push({ text: textBefore });
    }
    blocks.push({ text: match[1], isBold: true });
    lastIndex = boldRegex.lastIndex;
  }

  const remaining = text.substring(lastIndex);
  if (remaining) {
    blocks.push({ text: remaining });
  }
}

/**
 * Creates a Google Doc and fills it with text blocks + styles using a highly robust single-batch update
 */
async function createAndFillGoogleDoc(
  accessToken: string,
  docTitle: string,
  blocks: TextBlock[]
): Promise<string> {
  // 1. Create empty document
  const createRes = await fetch("https://docs.googleapis.com/v1/documents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: docTitle }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create Google Doc: ${errText}`);
  }

  const doc = await createRes.json();
  const documentId = doc.documentId;

  // 2. We will assemble the entire text and keep track of character ranges to apply styling.
  // This is highly robust because indices are computed accurately prior to writing.
  let fullText = "";
  const styleRanges: {
    start: number;
    end: number;
    block: TextBlock;
  }[] = [];

  blocks.forEach((block) => {
    const startIdx = fullText.length;
    fullText += block.text;
    const endIdx = fullText.length;

    // Only store style if it has special attributes to apply
    if (
      block.isBold ||
      block.isItalic ||
      block.isHeading1 ||
      block.isHeading2 ||
      block.isHeading3 ||
      block.fontSize ||
      block.color
    ) {
      styleRanges.push({ start: startIdx, end: endIdx, block });
    }
  });

  // Construct batch update requests
  const requests: any[] = [];

  // Request 1: Insert all text at index 1
  requests.push({
    insertText: {
      location: { index: 1 },
      text: fullText,
    },
  });

  // Request 2+ : Apply styles in reverse order (to avoid index shift issues if document changes size,
  // though style ranges match exactly since we use insertText with pre-computed coordinates).
  // Actually, since we inserted all text in one go, the indices 1 to fullText.length+1 are absolutely fixed.
  // Google Docs indices are 1-based. So a range of [start, end] in our JS string maps to [start + 1, end + 1] in Google Docs.
  styleRanges.forEach(({ start, end, block }) => {
    const docStart = start + 1;
    const docEnd = end + 1;

    // Calculate font size
    let fontSize = block.fontSize || 11;
    if (block.isHeading1) fontSize = 18;
    else if (block.isHeading2) fontSize = 14;
    else if (block.isHeading3) fontSize = 12;

    const textStyle: any = {
      weightedFontFamily: {
        fontFamily: "Calibri",
        weight: block.isBold || block.isHeading1 || block.isHeading2 || block.isHeading3 ? 700 : 400,
      },
      fontSize: {
        size: fontSize,
        unit: "PT",
      },
      italic: !!block.isItalic,
    };

    if (block.color) {
      textStyle.foregroundColor = {
        color: {
          rgbColor: block.color,
        },
      };
    }

    requests.push({
      updateTextStyle: {
        range: {
          startIndex: docStart,
          endIndex: docEnd,
        },
        textStyle,
        fields: "weightedFontFamily,fontSize,italic,foregroundColor",
      },
    });

    // If it's a heading, center align or apply paragraph spacing
    if (block.isHeading1 || block.isHeading2) {
      requests.push({
        updateParagraphStyle: {
          range: {
            startIndex: docStart,
            endIndex: docEnd,
          },
          paragraphStyle: {
            alignment: block.isHeading1 ? "CENTER" : "START",
            spaceAbove: { size: block.isHeading1 ? 12 : 8, unit: "PT" },
            spaceBelow: { size: 6, unit: "PT" },
          },
          fields: "alignment,spaceAbove,spaceBelow",
        },
      });
    }
  });

  // 3. Submit the styling requests in batch
  const updateRes = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    console.error("Batch update failed:", errText);
    // Don't fail the whole operation, still return the documentId so they can open the unstyled doc at least
  }

  return `https://docs.google.com/document/d/${documentId}/edit`;
}
