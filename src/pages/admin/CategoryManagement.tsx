import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Category } from '../../types';
import { FolderTree, Plus, Trash2, Code } from 'lucide-react';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const list = await api.getCategories();
    setCategories(list);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.createCategory({
      name,
      description,
      icon: 'Code',
    });
    setName('');
    setDescription('');
    setShowAddForm(false);
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete category domain?')) {
      await api.deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <FolderTree className="w-7 h-7 text-purple-600 dark:text-purple-300" />
            <span>Category & Domain Management</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Organize assessment quizzes into academic and technical categories.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-yellow-pastel px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-800" />
          <span>{showAddForm ? 'Close Form' : 'Add New Domain Category'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCategory} className="glass-card p-6 rounded-3xl space-y-4 border border-purple-300/30">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">Create Academic Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-100 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cloud Security"
                className="w-full px-4 py-2.5 glass-card-sub rounded-xl text-xs text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-900 dark:text-slate-100 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short summary of domain scope..."
                className="w-full px-4 py-2.5 glass-card-sub rounded-xl text-xs text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-yellow-pastel px-6 py-2 rounded-xl text-xs font-black">
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c) => (
          <div key={c.id} className="glass-card p-5 rounded-3xl space-y-3 border border-purple-300/30">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl badge-purple flex items-center justify-center">
                <Code className="w-5 h-5 text-purple-900" />
              </div>
              <span className="badge-purple px-2.5 py-0.5 rounded text-[10px] font-black">ACTIVE DOMAIN</span>
            </div>

            <div>
              <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm profile-name-text">{c.name}</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold line-clamp-2 mt-0.5">{c.description}</p>
            </div>

            <div className="pt-2 border-t border-purple-300/20 flex items-center justify-end">
              <button
                onClick={() => handleDelete(c.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
