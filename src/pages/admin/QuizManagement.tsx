import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Quiz, Category, DifficultyLevel, QuizStatus } from '../../types';
import { Plus, Edit, Trash2, CheckCircle, Eye, Clock, Award, Shuffle, AlertCircle, Image as ImageIcon } from 'lucide-react';

export const QuizManagement: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [duration, setDuration] = useState(20);
  const [passingScore, setPassingScore] = useState(60);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [status, setStatus] = useState<QuizStatus>('Draft');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [allowNegativeMarking, setAllowNegativeMarking] = useState(false);
  const [negativeMark, setNegativeMark] = useState(0.25);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const qList = await api.getQuizzes('ADMIN');
    const cList = await api.getCategories();
    setQuizzes(qList);
    setCategories(cList);
    if (cList.length > 0 && !categoryId) setCategoryId(cList[0].id);
  };

  const handleOpenCreateModal = () => {
    setEditingQuiz(null);
    setTitle('');
    setDescription('');
    setDuration(20);
    setPassingScore(60);
    setMaxAttempts(3);
    setStatus('Draft');
    setThumbnailUrl('');
    setAllowNegativeMarking(false);
    setNegativeMark(0.25);
    setRandomizeQuestions(true);
    setShowModal(true);
  };

  const handleOpenEditModal = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setTitle(quiz.title);
    setDescription(quiz.description);
    setCategoryId(quiz.categoryId);
    setDifficulty(quiz.difficulty);
    setDuration(quiz.duration);
    setPassingScore(quiz.passingScore);
    setMaxAttempts(quiz.maxAttempts);
    setStatus(quiz.status);
    setThumbnailUrl(quiz.thumbnailUrl || '');
    setAllowNegativeMarking(quiz.allowNegativeMarking || false);
    setNegativeMark(quiz.negativeMark || 0.25);
    setRandomizeQuestions(quiz.randomizeQuestions !== false);
    setShowModal(true);
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) return;

    if (editingQuiz) {
      await api.updateQuiz(editingQuiz.id, {
        title,
        description,
        categoryId,
        difficulty,
        duration: Number(duration),
        passingScore: Number(passingScore),
        maxAttempts: Number(maxAttempts),
        status,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
        allowNegativeMarking,
        negativeMark: Number(negativeMark),
        randomizeQuestions,
      });
    } else {
      await api.createQuiz({
        title,
        description,
        categoryId,
        difficulty,
        duration: Number(duration),
        passingScore: Number(passingScore),
        maxAttempts: Number(maxAttempts),
        status,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
        allowNegativeMarking,
        negativeMark: Number(negativeMark),
        randomizeQuestions,
      });
    }

    setShowModal(false);
    loadData();
  };

  const handleTogglePublishStatus = async (quiz: Quiz) => {
    const nextStatus: QuizStatus = quiz.status === 'Published' ? 'Unpublished' : 'Published';
    await api.toggleQuizPublishStatus(quiz.id, nextStatus);
    loadData();
  };

  const handleDeleteQuiz = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz? All associated questions will be removed.')) {
      await api.deleteQuiz(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Quiz Management</h1>
          <p className="text-sm text-slate-400">Create, edit, publish, and configure online assessment quizzes.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Quiz</span>
        </button>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition group">
            <div>
              <div className="relative h-40 overflow-hidden bg-slate-800">
                <img
                  src={quiz.thumbnailUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80'}
                  alt={quiz.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md border ${
                      quiz.status === 'Published'
                        ? 'bg-emerald-500/90 text-white border-emerald-400'
                        : quiz.status === 'Draft'
                        ? 'bg-amber-500/90 text-white border-amber-400'
                        : 'bg-slate-700/90 text-slate-300 border-slate-600'
                    }`}
                  >
                    {quiz.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-xs font-medium text-slate-200 border border-slate-700">
                  {quiz.categoryName}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-slate-100 text-lg line-clamp-1">{quiz.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{quiz.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{quiz.duration} Mins</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pass: {quiz.passingScore}%</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-indigo-400">Questions:</span>
                    <span>{quiz.totalQuestions || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-amber-400">Attempts Max:</span>
                    <span>{quiz.maxAttempts}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleTogglePublishStatus(quiz)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                  quiz.status === 'Published'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                }`}
              >
                {quiz.status === 'Published' ? 'Unpublish' : 'Publish Quiz'}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEditModal(quiz)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                  title="Edit Quiz Settings"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                  title="Delete Quiz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold text-slate-100">
              {editingQuiz ? 'Edit Quiz Settings' : 'Create New Assessment Quiz'}
            </h2>

            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs text-slate-300">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Quiz Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern JavaScript Fundamentals"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a overview of what skills are tested..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Passing %</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Attempts</label>
                  <input
                    type="number"
                    min={1}
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as QuizStatus)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Unpublished">Unpublished</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 space-y-3">
                <span className="font-bold text-slate-200 block">Advanced Assessment Rules</span>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-slate-200">Negative Marking</span>
                    <p className="text-[11px] text-slate-400">Deduct marks for incorrect answers</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowNegativeMarking}
                    onChange={(e) => setAllowNegativeMarking(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                </div>
                {allowNegativeMarking && (
                  <div className="flex items-center space-x-3 pt-1">
                    <span className="text-slate-300">Penalty multiplier:</span>
                    <input
                      type="number"
                      step={0.1}
                      min={0.1}
                      max={1.0}
                      value={negativeMark}
                      onChange={(e) => setNegativeMark(Number(e.target.value))}
                      className="w-24 p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="font-medium text-slate-200">Question & Option Randomization</span>
                    <p className="text-[11px] text-slate-400">Shuffle question order for each attempt</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={randomizeQuestions}
                    onChange={(e) => setRandomizeQuestions(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20"
                >
                  {editingQuiz ? 'Save Changes' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
