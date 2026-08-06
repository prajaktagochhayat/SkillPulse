import React from 'react';
import type { QuizAttempt } from '../../types';
import { Award, CheckCircle, Printer, Download, X } from 'lucide-react';

interface CertificateModalProps {
  attempt: QuizAttempt;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ attempt, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl overflow-y-auto max-h-[95vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Certificate Frame */}
        <div
          id="printable-certificate"
          className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-12 rounded-2xl border-4 border-amber-500/40 relative text-center space-y-6 shadow-inner"
        >
          {/* Certificate Header Emblem */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Award className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              OFFICIAL CERTIFICATE OF ACHIEVEMENT
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
              Certificate of Excellence
            </h1>
            <p className="text-xs text-slate-400 mt-1">This certificate is proudly awarded to</p>
          </div>

          <div className="py-2 border-b-2 border-t-2 border-amber-500/30 max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif tracking-wide">
              {attempt.userName}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            for successfully passing the online assessment for <br />
            <strong className="text-slate-100 font-bold underline decoration-amber-500/50">
              {attempt.quizTitle}
            </strong>{' '}
            with an outstanding score of <strong className="text-emerald-400 font-bold">{attempt.percentage}%</strong>.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-6 text-xs text-slate-400 border-t border-slate-800/80 max-w-md mx-auto">
            <div>
              <span className="block font-semibold text-slate-300">Date Issued</span>
              <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="block font-semibold text-slate-300">Verification Code</span>
              <span className="font-mono text-amber-400">QZ-{attempt.id.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
