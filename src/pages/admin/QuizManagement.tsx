import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Quiz, Category } from '../../types';
import { BookOpen, Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';

export const QuizManagement: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [duration, setDuration] = useState(20);
  const [passingScore, setPassingScore] = useState(60);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const qList = await api.getQuizzes('ADMIN');
    setQuizzes(qList);
    const cList = await api.getCategories();
    setCategories(cList);
    if (cList.length > 0) setCategoryId(cList[0].id);
  };

  const handleOpenModal = (quiz?: Quiz) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setTitle(quiz.title);
      setDescription(quiz.description);
      setCategoryId(quiz.categoryId);
      setDifficulty(quiz.difficulty);
      setDuration(quiz.duration);
      setPassingScore(quiz.passingScore);
      setMaxAttempts(quiz.maxAttempts || 3);
      setStatus(quiz.status);
    } else {
      setEditingQuiz(null);
      setTitle('');
      setDescription('');
      if (categories.length > 0) setCategoryId(categories[0].id);
      setDifficulty('Intermediate');
      setDuration(20);
      setPassingScore(60);
      setMaxAttempts(3);
      setStatus('Published');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (editingQuiz) {
      await api.updateQuiz(editingQuiz.id, {
        title,
        description,
        categoryId,
        difficulty,
        duration,
        passingScore,
        maxAttempts,
        status,
      });
    } else {
      await api.createQuiz({
        title,
        description,
        categoryId,
        categoryName: categories.find((c) => c.id === categoryId)?.name || 'General',
        difficulty,
        duration,
        passingScore,
        maxAttempts,
        status,
        thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      });
    }

    setShowModal(false);
    loadData();
  };

  const handleTogglePublish = async (quiz: Quiz) => {
    const nextStatus = quiz.status === 'Published' ? 'Draft' : 'Published';
    await api.toggleQuizPublishStatus(quiz.id, nextStatus);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assessment quiz?')) {
      await api.deleteQuiz(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <BookOpen className="w-7 h-7 text-purple-600 dark:text-purple-300" />
            <span>Quiz & Assessment Management</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Create and edit engineering assessment tracks, configure passing rules, and publish quizzes.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-yellow-pastel px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-800" />
          <span>Create New Quiz Track</span>
        </button>
      </div>

      {/* Quizzes Table */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border border-purple-300/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-purple-950/10 dark:bg-purple-950/40 border-b border-purple-300/30 text-purple-950 dark:text-purple-200 uppercase tracking-wider font-black">
                <th className="p-4">Track Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Pass %</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-300/20">
              {quizzes.map((q) => (
                <tr key={q.id} className="hover:bg-purple-500/10 transition bg-white/50 dark:bg-slate-900/50">
                  <td className="p-4 font-black text-sm text-purple-950 dark:text-purple-100 profile-name-text">
                    {q.title}
                  </td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{q.categoryName}</td>
                  <td className="p-4 font-bold text-amber-600 dark:text-yellow-400">{q.difficulty}</td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{q.duration}m</td>
                  <td className="p-4 font-black text-emerald-600">{q.passingScore}%</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black ${
                        q.status === 'Published' ? 'badge-sage' : 'badge-yellow'
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleTogglePublish(q)}
                      className="p-2 rounded-xl badge-purple hover:bg-purple-200 text-purple-900 transition"
                      title={q.status === 'Published' ? 'Unpublish Quiz' : 'Publish Quiz'}
                    >
                      {q.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenModal(q)}
                      className="p-2 rounded-xl badge-yellow text-amber-900 transition"
                      title="Edit Quiz"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 transition"
                      title="Delete Quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* High Contrast Create / Edit Quiz Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 border border-purple-400/40 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-purple-300/20 pb-4">
              <h2 className="text-lg font-black text-white">
                {editingQuiz ? 'Edit Assessment Track' : 'Create New Assessment Track'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-purple-200 mb-1">Quiz Track Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Advanced Python Systems"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-purple-300/40 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-purple-200 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of domain concepts tested..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-purple-300/40 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-purple-200 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-purple-300/40 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-purple-200 mb-1">Difficulty *</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-purple-300/40 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  >
                    <option value="Beginner" className="bg-slate-900 text-white">Beginner</option>
                    <option value="Intermediate" className="bg-slate-900 text-white">Intermediate</option>
                    <option value="Advanced" className="bg-slate-900 text-white">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-purple-200 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min={5}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-purple-300/40 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-purple-200 mb-1">Pass %</label>
                  <input
                    type="number"
                    min={40}
                    max={100}
                    value={passingScore}
                    onChange={(e) => setPassingScore(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-purple-300/40 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-purple-200 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-purple-300/40 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  >
                    <option value="Published" className="bg-slate-900 text-white">Published</option>
                    <option value="Draft" className="bg-slate-900 text-white">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-purple-300/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-yellow-pastel px-6 py-2.5 rounded-xl text-xs font-black shadow-lg"
                >
                  {editingQuiz ? 'Update Track' : 'Publish Assessment Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
