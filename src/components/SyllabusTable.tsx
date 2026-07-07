import React, { useState } from "react";
import { WeekSyllabus, SubjectType } from "../types";
import { 
  BookOpen, 
  Bookmark, 
  Award, 
  Heart, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText
} from "lucide-react";

interface SyllabusTableProps {
  weeks: WeekSyllabus[];
  onSelectTopic: (week: number, subject: SubjectType, topicTitle: string) => void;
}

export const SyllabusTable: React.FC<SyllabusTableProps> = ({ weeks, onSelectTopic }) => {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  const getSubjectIcon = (subject: SubjectType) => {
    switch (subject) {
      case "Tahsin & Tajwid":
        return <Sparkles className="w-4 h-4 text-sage" />;
      case "Hafalan Surat Pendek":
        return <BookOpen className="w-4 h-4 text-sage-light" />;
      case "Hafalan Hadits":
        return <Award className="w-4 h-4 text-clay-dark" />;
      case "Fiqih Ibadah":
        return <Compass className="w-4 h-4 text-clay-dark" />;
      case "Adab & Akhlak":
        return <Heart className="w-4 h-4 text-clay" />;
      case "Sirah Nabawiyah":
        return <Bookmark className="w-4 h-4 text-sage-dark" />;
    }
  };

  const getSubjectColorClass = (subject: SubjectType) => {
    switch (subject) {
      case "Tahsin & Tajwid":
        return "bg-sage/10 text-sage-deep border-sage/20 hover:bg-sage/15";
      case "Hafalan Surat Pendek":
        return "bg-sage-light/10 text-sage-dark border-sage-light/20 hover:bg-sage-light/15";
      case "Hafalan Hadits":
        return "bg-clay/15 text-natural-dark border-clay/30 hover:bg-clay/25";
      case "Fiqih Ibadah":
        return "bg-clay-dark/10 text-natural-dark border-clay-dark/20 hover:bg-clay-dark/15";
      case "Adab & Akhlak":
        return "bg-clay-light/40 text-natural-dark border-clay-light hover:bg-clay-light/60";
      case "Sirah Nabawiyah":
        return "bg-sage-dark/10 text-sage-deep border-sage-dark/20 hover:bg-sage-dark/15";
    }
  };

  const toggleWeek = (weekNum: number) => {
    if (expandedWeek === weekNum) {
      setExpandedWeek(null);
    } else {
      setExpandedWeek(weekNum);
    }
  };

  return (
    <div className="space-y-3">
      {weeks.map((w) => {
        const isExpanded = expandedWeek === w.week;
        const isSpecialWeek = w.week === 9 || w.week === 17 || w.week === 18;
        
        return (
          <div 
            key={w.week} 
            className={`border rounded-2xl transition-all duration-300 overflow-hidden bg-[#FDFBF7]/80 ${
              isExpanded 
                ? "border-clay shadow-sm ring-2 ring-sage/5" 
                : "border-clay-light hover:border-clay/50 shadow-xs"
            }`}
          >
            {/* Week Header */}
            <button
              onClick={() => toggleWeek(w.week)}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors cursor-pointer ${
                isExpanded ? "bg-[#F9F6F0]" : "hover:bg-white/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-sans ${
                  isSpecialWeek 
                    ? "bg-clay text-natural-dark border border-clay-dark/20" 
                    : "bg-sage text-white border border-sage-dark"
                }`}>
                  <span className="text-[10px] font-medium leading-none opacity-80">Mggu</span>
                  <span className="text-sm font-bold mt-0.5">{w.week}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-natural-dark font-serif tracking-wide">
                    {w.week === 9 
                      ? "Evaluasi Tengah Semester (Mid-Semester)" 
                      : w.week === 17 
                        ? "Muraja'ah Akbar & Khataman" 
                        : w.week === 18 
                          ? "Imtihan Akhir Semester & Pembagian Raport" 
                          : `Syllabus Pembelajaran Pekan ${w.week}`}
                  </h4>
                  <p className="text-xs text-clay-dark mt-0.5 font-sans">
                    {isSpecialWeek 
                      ? "Pekan evaluasi, muraja'ah, dan pengukuran hafalan santri." 
                      : "Penyampaian materi terpadu 6 bidang studi keislaman."}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isSpecialWeek && (
                  <span className="text-[10px] font-semibold uppercase bg-clay/20 text-clay-dark px-2 py-0.5 rounded-full border border-clay/30">
                    Ujian / Review
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-sage" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-clay-dark" />
                )}
              </div>
            </button>

            {/* Week Content */}
            {isExpanded && (
              <div className="p-4 border-t border-clay-light bg-white/40">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.keys(w.topics) as SubjectType[]).map((subj) => {
                    const topic = w.topics[subj];
                    return (
                      <div 
                        key={subj}
                        className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-200 ${getSubjectColorClass(subj)}`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1 rounded-md bg-white/80 border border-clay-light">
                              {getSubjectIcon(subj)}
                            </div>
                            <span className="text-[11px] font-bold tracking-wider uppercase opacity-80 font-sans">
                              {subj}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold leading-snug font-serif text-natural-dark">
                            {topic.title}
                          </h5>
                          <p className="text-xs mt-1 text-clay-dark font-sans leading-relaxed line-clamp-3">
                            {topic.description}
                          </p>
                        </div>

                        <button
                          onClick={() => onSelectTopic(w.week, subj, topic.title)}
                          className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-white/90 hover:bg-white text-natural-dark text-xs font-semibold border border-clay/20 hover:border-clay/40 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-sage" />
                          <span>Susun Modul Ajar</span>
                          <ArrowRight className="w-3 h-3 ml-0.5 opacity-60" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
