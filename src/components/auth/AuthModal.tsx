import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import { Award, ShieldCheck, UserCheck, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (!name.trim() || !email.trim() || !password) {
          throw new Error('Please fill in all required fields.');
        }
        await register(name, email, password, role);
      } else {
        if (!email.trim()) {
          throw new Error('Please enter your registered email address.');
        }
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-custom hover:text-heading text-xs font-semibold p-1"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-yellow-300 to-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
            <Award className="w-8 h-8 text-purple-950 font-black" />
          </div>
          <h2 className="text-2xl font-black text-heading">
            {isSignUp ? 'Create your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-muted-custom font-medium">
            {isSignUp
              ? 'Select your account role to register your personalized portal'
              : 'Sign in with your registered email and password'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-xs text-center font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <div>
              <label className="block text-heading font-extrabold mb-1">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-10 pr-4 py-2.5 glass-card-sub rounded-xl text-heading text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-heading font-extrabold mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 glass-card-sub rounded-xl text-heading text-xs focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-heading font-extrabold mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 glass-card-sub rounded-xl text-heading text-xs focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Explicit Role Selection on Sign Up */}
          {isSignUp && (
            <div className="space-y-2 pt-2">
              <label className="block text-heading font-extrabold text-xs uppercase tracking-wider">
                Select Account Role *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setRole('STUDENT')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    role === 'STUDENT'
                      ? 'badge-sage shadow-lg'
                      : 'glass-card-sub text-muted-custom opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                    {role === 'STUDENT' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />}
                  </div>
                  <div className="mt-2 text-left">
                    <span className="block font-black text-sm">Student / User</span>
                    <span className="text-[10px] font-medium opacity-80">Take quizzes & earn certificates</span>
                  </div>
                </div>

                <div
                  onClick={() => setRole('ADMIN')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    role === 'ADMIN'
                      ? 'badge-purple shadow-lg'
                      : 'glass-card-sub text-muted-custom opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <ShieldCheck className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                    {role === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-purple-700 dark:text-purple-300" />}
                  </div>
                  <div className="mt-2 text-left">
                    <span className="block font-black text-sm">Admin</span>
                    <span className="text-[10px] font-medium opacity-80">Manage quizzes, users & analytics</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-4 btn-yellow-pastel rounded-xl font-black text-xs flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>{isSubmitting ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Sign in vs Sign up */}
        <div className="text-center pt-2 text-xs text-muted-custom font-medium border-t border-purple-300/20">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsSignUp(false)} className="text-heading font-black underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsSignUp(true)} className="text-heading font-black underline">
                Sign Up as Student or Admin
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
