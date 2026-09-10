'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Eye, EyeOff, UserPlus, CheckCircle2, Shield } from 'lucide-react';
import { authApi } from '@/lib/api/authApi';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const res = await authApi.register({
        name,
        email,
        password,
        role,
      });

      setSuccessMessage(`User "${res.user?.name || name}" (${role.toUpperCase()}) registered successfully!`);
      // Reset form fields
      setName('');
      setEmail('');
      setPassword('');
      setRole('staff');
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          'Failed to register user. Please verify input details and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] py-8 px-4 transition-colors">
      <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Creston Brand Header */}
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md">
              C
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              CRESTON
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold mt-2">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admin User Registration</span>
          </div>

          <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
            Register new team members and assign role permissions
          </p>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-extrabold text-emerald-900 dark:text-emerald-100">
                Registration Successful
              </h5>
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Full Name
            </label>
            <Input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Email / Username
            </label>
            <Input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@creston.com"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Assigned Role</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="staff">Staff (Standard Access)</option>
              <option value="admin">Admin (Full Access)</option>
              <option value="viewer">Viewer (Read Only)</option>
            </select>
          </div>

          {apiError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold text-center">
              {apiError}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full mt-2 py-3 shadow-md shadow-indigo-500/20"
          >
            Register New User
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            www.creston.com • Admin User Management
          </p>
        </div>
      </div>
    </div>
  );
}
