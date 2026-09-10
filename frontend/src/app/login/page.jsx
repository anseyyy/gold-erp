'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          'Invalid credentials. Please check your username/email & password.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white dark:bg-slate-950 px-4 transition-colors">
      <div className="w-full max-w-[440px]">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Creston Brand Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-black text-xl shadow-md">
              C
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              CRESTON
            </span>
          </div>

          <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm font-medium">Manage workflows with ease</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col items-center w-full space-y-5">
          <Input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username / email"
            required
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />

          {apiError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 text-center font-medium w-full">
              {apiError}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full mt-2"
          >
            Login
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          www.creston.com
        </p>
      </div>
    </div>
  );
}
