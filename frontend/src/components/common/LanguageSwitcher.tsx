import React, { useState } from 'react';
import { useLanguage, Language, LANGUAGE_LABELS } from '../../contexts/LanguageContext';
import { Globe, Check } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const languages: Language[] = ['en', 'te', 'hi'];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200"
        title="Change Language"
      >
        <Globe className="w-3.5 h-3.5 text-brand-900" />
        <span>{LANGUAGE_LABELS[language].native}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-white shadow-soft-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs font-medium transition ${
                  language === lang
                    ? 'bg-blue-50 text-brand-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-slate-900 font-medium">{LANGUAGE_LABELS[lang].native}</div>
                  <div className="text-[10px] text-slate-500">{LANGUAGE_LABELS[lang].label}</div>
                </div>
                {language === lang && <Check className="w-3.5 h-3.5 text-brand-900" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
