import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Question, Quiz } from '../../types';
import { HelpCircle, Plus, Upload, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export const QuestionManagement: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [csvContent, setCsvContent] = useState('');
  const [importStatusMsg, setImportStatusMsg] = useState('');

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    const list = await api.getQuizzes('ADMIN');
    setQuizzes(list);
    if (list.length > 0) {
      setSelectedQuizId(list[0].id);
      loadQuestions(list[0].id);
    }
  };

  const loadQuestions = async (quizId: string) => {
    const qList = await api.getQuestionsByQuizId(quizId);
    setQuestions(qList);
  };

  const handleSelectQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    loadQuestions(quizId);
  };

  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedQuizId) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (reader.result) {
          try {
            const count = await api.importQuestionsCsv(selectedQuizId, reader.result as string);
            setImportStatusMsg(`Successfully imported ${count} questions to subject!`);
            loadQuestions(selectedQuizId);
          } catch (err: any) {
            setImportStatusMsg('Error importing CSV: ' + err.message);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this question from bank?')) {
      await api.deleteQuestion(id);
      loadQuestions(selectedQuizId);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <HelpCircle className="w-7 h-7 text-purple-600 dark:text-purple-300" />
            <span>Question Bank & Manager</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Configure questions, answer options, explanations, and CSV batch import.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedQuizId}
            onChange={(e) => handleSelectQuiz(e.target.value)}
            className="px-4 py-2.5 glass-card-sub rounded-2xl text-xs text-slate-900 dark:text-slate-100 font-bold focus:outline-none border border-purple-300/40"
          >
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title} ({q.categoryName})
              </option>
            ))}
          </select>

          <label className="btn-yellow-pastel px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 cursor-pointer flex items-center space-x-2 shadow">
            <Upload className="w-4 h-4 text-amber-800" />
            <span>Batch Import CSV</span>
            <input type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
          </label>
        </div>
      </div>

      {importStatusMsg && (
        <div className="p-4 rounded-2xl badge-sage text-xs font-black flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>{importStatusMsg}</span>
        </div>
      )}

      {/* Question Cards */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="glass-card p-6 rounded-3xl space-y-4 border border-purple-300/30">
            <div className="flex items-center justify-between">
              <span className="badge-purple px-3 py-1 rounded-xl text-xs font-black">
                Q{idx + 1} • {q.difficulty || 'Intermediate'} ({q.marks || 1} Mark)
              </span>
              <button
                onClick={() => handleDelete(q.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">{q.questionText}</h3>

            {/* Options List with High Contrast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between ${
                    opt.isCorrect
                      ? 'badge-sage border-emerald-400'
                      : 'glass-card-sub text-slate-900 dark:text-slate-100 border-purple-300/30'
                  }`}
                >
                  <span className="profile-name-text">{opt.optionText}</span>
                  {opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                </div>
              ))}
            </div>

            {q.explanation && (
              <div className="p-3.5 rounded-2xl badge-purple text-xs font-bold text-purple-950 dark:text-purple-100">
                <span className="font-black text-purple-900 block">Explanation:</span>
                <p>{q.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
