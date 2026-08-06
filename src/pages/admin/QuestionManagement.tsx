import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Quiz, Question, Option, QuestionType, DifficultyLevel } from '../../types';
import { Plus, Edit, Trash2, Upload, FileText, CheckCircle2, HelpCircle, AlertCircle, Info } from 'lucide-react';

export const QuestionManagement: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);

  // Modals
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Question Form State
  const [questionText, setQuestionText] = useState('');
  const [type, setType] = useState<QuestionType>('single');
  const [marks, setMarks] = useState(1);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [explanation, setExplanation] = useState('');
  const [options, setOptions] = useState<{ id?: string; optionText: string; isCorrect: boolean }[]>([
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
  ]);

  // CSV Import state
  const [csvContent, setCsvContent] = useState('');

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuizId) {
      loadQuestions(selectedQuizId);
    }
  }, [selectedQuizId]);

  const loadQuizzes = async () => {
    const list = await api.getQuizzes('ADMIN');
    setQuizzes(list);
    if (list.length > 0 && !selectedQuizId) {
      setSelectedQuizId(list[0].id);
    }
  };

  const loadQuestions = async (quizId: string) => {
    const qList = await api.getQuestionsByQuizId(quizId);
    setQuestions(qList);
  };

  const handleOpenCreateQuestion = () => {
    setEditingQuestion(null);
    setQuestionText('');
    setType('single');
    setMarks(1);
    setDifficulty('Intermediate');
    setExplanation('');
    setOptions([
      { optionText: 'Option A', isCorrect: true },
      { optionText: 'Option B', isCorrect: false },
      { optionText: 'Option C', isCorrect: false },
      { optionText: 'Option D', isCorrect: false },
    ]);
    setShowQuestionModal(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setQuestionText(q.questionText);
    setType(q.type);
    setMarks(q.marks);
    setDifficulty(q.difficulty);
    setExplanation(q.explanation);
    setOptions(
      q.options.map((o) => ({
        id: o.id,
        optionText: o.optionText,
        isCorrect: o.isCorrect,
      }))
    );
    setShowQuestionModal(true);
  };

  const handleOptionTextChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].optionText = text;
    setOptions(newOptions);
  };

  const handleOptionCorrectToggle = (index: number) => {
    const newOptions = options.map((opt, i) => {
      if (type === 'single' || type === 'boolean') {
        return { ...opt, isCorrect: i === index };
      }
      return i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt;
    });
    setOptions(newOptions);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !selectedQuizId) return;

    const formattedOptions: Option[] = options.map((opt, i) => ({
      id: opt.id || `opt-${Date.now()}-${i}`,
      questionId: editingQuestion ? editingQuestion.id : '',
      optionText: opt.optionText,
      isCorrect: opt.isCorrect,
    }));

    if (editingQuestion) {
      await api.updateQuestion(editingQuestion.id, {
        questionText,
        type,
        marks: Number(marks),
        difficulty,
        explanation,
        options: formattedOptions,
      });
    } else {
      await api.createQuestion({
        quizId: selectedQuizId,
        questionText,
        type,
        marks: Number(marks),
        difficulty,
        explanation,
        options: formattedOptions,
      });
    }

    setShowQuestionModal(false);
    loadQuestions(selectedQuizId);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm('Delete this question?')) {
      await api.deleteQuestion(id);
      loadQuestions(selectedQuizId);
    }
  };

  const handleImportCsv = async () => {
    if (!csvContent.trim() || !selectedQuizId) return;
    try {
      const count = await api.importQuestionsCsv(selectedQuizId, csvContent);
      alert(`Successfully imported ${count} questions!`);
      setShowCsvModal(false);
      setCsvContent('');
      loadQuestions(selectedQuizId);
    } catch (err: any) {
      alert('CSV Import Error: ' + err.message);
    }
  };

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Quiz Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Question Bank & Manager</h1>
          <p className="text-sm text-slate-400">Configure questions, answer options, explanations, and CSV import.</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm font-medium focus:outline-none focus:border-blue-500"
          >
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title} ({q.categoryName})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold text-sm transition"
            title="Import Questions via CSV file"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">CSV Import</span>
          </button>

          <button
            onClick={handleOpenCreateQuestion}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={q.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                  Q{index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{q.questionText}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {q.type.toUpperCase()}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {q.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEditQuestion(q)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
              {q.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    opt.isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>{opt.optionText}</span>
                  {opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
              ))}
            </div>

            {/* Explanation */}
            {q.explanation && (
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60 text-xs text-slate-400 flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">Explanation: </span>
                  {q.explanation}
                </div>
              </div>
            )}
          </div>
        ))}

        {questions.length === 0 && (
          <div className="glass-card p-12 text-center text-slate-400 rounded-2xl border border-slate-800">
            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="font-semibold text-slate-300">No questions added to this quiz yet.</p>
            <p className="text-xs text-slate-500 mt-1">Click "Add Question" or "CSV Import" to populate the question bank.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold text-slate-100">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h2>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs text-slate-300">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question Statement *</label>
                <textarea
                  rows={2}
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. Which method converts a JSON string into a JavaScript object?"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as QuestionType)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none"
                  >
                    <option value="single">Single Choice (MCQ)</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="boolean">True / False</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Marks</label>
                  <input
                    type="number"
                    min={1}
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Answer Options (Check correct answer)</label>
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type={type === 'multiple' ? 'checkbox' : 'radio'}
                      name="correct-option"
                      checked={opt.isCorrect}
                      onChange={() => handleOptionCorrectToggle(i)}
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <input
                      type="text"
                      required
                      value={opt.optionText}
                      onChange={(e) => handleOptionTextChange(i, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Explanation (Detailed Answer Review)</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why this answer is correct for the student review page..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                <span>Bulk CSV Question Import</span>
              </h2>
              <button onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste CSV text below with format: <br />
              <code className="text-blue-400 bg-slate-800 px-1 py-0.5 rounded">
                QuestionText,OptionA,OptionB,OptionC,OptionD,CorrectIndex(0-3),Explanation
              </code>
            </p>

            <textarea
              rows={6}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder={`"What is HTML?",HyperText Markup,HighText Machine,HyperTool,HomeTool,0,HyperText Markup Language\n"Which keyword is constant?",var,let,const,static,2,const declares block scoped constants`}
              className="w-full p-3 bg-slate-950 font-mono border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none"
            />

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportCsv}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-emerald-500/20"
              >
                Parse & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
