export type LevelType = "Dasar" | "Menengah" | "Lanjut";

export type SubjectType = 
  | "Tahsin & Tajwid" 
  | "Hafalan Surat Pendek" 
  | "Hafalan Hadits" 
  | "Fiqih Ibadah" 
  | "Adab & Akhlak" 
  | "Sirah Nabawiyah";

export interface WeekSyllabus {
  week: number;
  semester: 1 | 2;
  topics: {
    [key in SubjectType]: {
      title: string;
      description: string;
    }
  }
}

export interface LevelSyllabus {
  level: LevelType;
  description: string;
  targetAge: string;
  semester1: WeekSyllabus[];
  semester2: WeekSyllabus[];
}

export interface SavedModul {
  id: string;
  level: LevelType;
  subject: SubjectType;
  semester: 1 | 2;
  week: number;
  topic: string;
  content: string;
  createdAt: string;
}

export interface TPQIdentity {
  namaTPQ: string;
  ketuaYayasan: string;
  pengasuhYayasan: string;
  kepalaTPQ: string;
  guruPembimbing: string;
  alamatTPQ: string;
}
