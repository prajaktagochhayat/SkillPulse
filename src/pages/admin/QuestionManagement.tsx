import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Question, Quiz, Chapter } from '../../types';
import { HelpCircle, Plus, Upload, Trash2, CheckCircle2, X } from 'lucide-react';

export const QuestionManagement: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [importStatusMsg, setImportStatusMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [qText, setQText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctOptIdx, setCorrectOptIdx] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [marks, setMarks] = useState(1);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    const list = await api.getQuizzes('ADMIN');
    setQuizzes(list);
    if (list.length > 0) {
      setSelectedQuizId(list[0].id);
      loadQuizDetails(list[0].id);
    }
  };

  const loadQuizDetails = async (quizId: string) => {
    const qList = await api.getQuestionsByQuizId(quizId);
    setQuestions(qList);
    const chList = await api.getChaptersByQuizId(quizId);
    setChapters(chList);
    if (chList.length > 0) setSelectedChapterId(chList[0].id);
  };

  const handleSelectQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    loadQuizDetails(quizId);
  };

  const handleOpenAddModal = () => {
    setQText('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setCorrectOptIdx(0);
    setExplanation('');
    if (chapters.length > 0) setSelectedChapterId(chapters[0].id);
    setShowAddModal(true);
  };

  const handleCreateQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !opt0.trim() || !opt1.trim()) return;

    const qId = 'q-' + Date.now();
    await api.createQuestion({
      quizId: selectedQuizId,
      chapterId: selectedChapterId || 'ch-1',
      questionText: qText,
      type: 'single',
      marks,
      difficulty,
      explanation,
      options: [
        { id: `opt-${qId}-0`, questionId: qId, optionText: opt0, isCorrect: correctOptIdx === 0 },
        { id: `opt-${qId}-1`, questionId: qId, optionText: opt1, isCorrect: correctOptIdx === 1 },
        { id: `opt-${qId}-2`, questionId: qId, optionText: opt2, isCorrect: correctOptIdx === 2 },
        { id: `opt-${qId}-3`, questionId: qId, optionText: opt3, isCorrect: correctOptIdx === 3 },
      ],
    });

    setShowAddModal(false);
    loadQuizDetails(selectedQuizId);
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
            loadQuizDetails(selectedQuizId);
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
      loadQuizDetails(selectedQuizId);
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

        <div className="flex flex-wrap items-center gap-3">
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

          <button
            onClick={handleOpenAddModal}
            className="btn-yellow-pastel px-4 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2 shadow"
          >
            <Plus className="w-4 h-4 text-amber-900" />
            <span>Add Question</span>
          </button>

          <label className="px-4 py-2.5 rounded-2xl glass-card-sub text-xs font-black shrink-0 cursor-pointer flex items-center space-x-2 border border-purple-300/30 hover:bg-purple-500/10">
            <Upload className="w-4 h-4 text-purple-600 dark:text-purple-300" />
            <span>Import CSV</span>
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

      {/* CREATE QUESTION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 border border-purple-400/40 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-purple-300/20 pb-4">
              <h2 className="text-lg font-black text-white">Create New Assessment Question</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-purple-200 mb-1">Question Prompt *</label>
                <textarea
                  rows={3}
                  required
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Type full question statement..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-purple-300/40 rounded-xl text-xs text-white focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-purple-200">Answer Options (Select radio for correct answer) *</label>
                {[opt0, opt1, opt2, opt3].map((optVal, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={correctOptIdx === idx}
                      onChange={() => setCorrectOptIdx(idx)}
                      className="w-4 h-4 text-amber-400"
                    />
                    <input
                      type="text"
                      required
                      placeholder={`Option ${idx + 1}`}
                      value={idx === 0 ? opt0 : idx === 1 ? opt1 : idx === 2 ? opt2 : opt3}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (idx === 0) setOpt0(v);
                        if (idx === 1) setOpt1(v);
                        if (idx === 2) setOpt2(v);
                        if (idx === 3) setOpt3(v);
                      }}
                      className="flex-1 px-4 py-2 bg-slate-800 border border-purple-300/40 rounded-xl text-xs text-white focus:outline-none font-bold"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-black text-purple-200 mb-1">Solution Explanation</label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Detailed concept explanation..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-purple-300/40 rounded-xl text-xs text-white focus:outline-none font-bold"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-purple-300/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-yellow-pastel px-6 py-2.5 rounded-xl text-xs font-black shadow-lg"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
