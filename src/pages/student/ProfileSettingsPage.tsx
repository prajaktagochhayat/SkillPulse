import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User as UserIcon, Upload, Sparkles, LogOut, CheckCircle2, Save, ArrowLeft, ShieldCheck } from 'lucide-react';

interface ProfileSettingsPageProps {
  onBack: () => void;
}

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Prajakta',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CyberBot',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Luna',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Sophia',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Ethan',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Quantum',
];

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || 'Engineering Scholar & Tech Enthusiast');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || AVATAR_PRESETS[0]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSelectedAvatar(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setSaveSuccessMsg('');

    try {
      await api.updateUserProfile(user.id, {
        name,
        bio,
        avatarUrl: selectedAvatar,
      });
      setSaveSuccessMsg('Profile settings and avatar updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-black text-slate-800 dark:text-slate-200 hover:text-amber-500 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="badge-purple px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300" />
          <span>Account Settings & Profile</span>
        </span>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl badge-sage text-xs font-black flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="glass-card rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* Profile Header & Active Avatar */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-purple-300/20">
          <div className="relative group">
            <img
              src={selectedAvatar}
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full border-4 border-emerald-400 object-cover shadow-xl bg-purple-100"
            />
            <label className="absolute bottom-0 right-0 p-2 rounded-full bg-amber-400 text-purple-950 shadow-lg cursor-pointer hover:scale-110 transition">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
            </label>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{user?.name}</h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">{user?.email}</p>
            <span className="badge-yellow px-2.5 py-0.5 rounded-lg text-[10px] inline-block font-black">
              {user?.role} ACCOUNT
            </span>
          </div>
        </div>

        {/* Section 1: Custom Profile Picture Upload */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-2">
            <Upload className="w-4 h-4 text-amber-500" />
            <span>Upload Custom Profile Picture</span>
          </h3>
          <div className="p-4 rounded-2xl glass-card-sub flex flex-col sm:flex-row items-center justify-between gap-4 border border-purple-300/30">
            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
              Choose a custom PNG, JPG, or GIF image from your computer to use as your avatar.
            </p>
            <label className="btn-yellow-pastel px-4 py-2 rounded-xl text-xs font-black shrink-0 cursor-pointer flex items-center space-x-2 shadow">
              <Upload className="w-4 h-4" />
              <span>Browse Image File</span>
              <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Section 2: Avatar Character Gallery */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-300" />
            <span>Or Pick an Avatar Character from Gallery</span>
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {AVATAR_PRESETS.map((preset, idx) => {
              const isSelected = selectedAvatar === preset;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedAvatar(preset)}
                  className={`p-2.5 rounded-2xl border-2 cursor-pointer transition flex flex-col items-center justify-center ${
                    isSelected
                      ? 'border-amber-400 badge-yellow shadow-lg scale-105'
                      : 'border-purple-300/30 glass-card-sub hover:border-amber-400/60'
                  }`}
                >
                  <img src={preset} alt={`Avatar ${idx}`} className="w-12 h-12 rounded-full object-cover" />
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-800 mt-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Profile Info Form Fields */}
        <div className="space-y-4 pt-4 border-t border-purple-300/20">
          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-slate-100 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 glass-card-sub rounded-xl text-xs text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-slate-100 mb-1">Bio / Headline</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 glass-card-sub rounded-xl text-xs text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Save & Logout Actions */}
        <div className="pt-4 border-t border-purple-300/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={logout}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-xs font-black flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto btn-yellow-pastel px-8 py-3 rounded-xl text-xs font-black flex items-center justify-center space-x-2 shadow-lg"
          >
            <Save className="w-4 h-4 text-amber-800" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
