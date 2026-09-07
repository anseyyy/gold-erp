'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Mail, Lock, Shield, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';

    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid credentials. Please check your email & password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-md">
            G
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">GoldStock ERP</h1>
          <p className="text-xs text-slate-500 font-medium">
            Sign in to access your financial & operational workspace
          </p>
        </div>

        <Card className="shadow-lg border-[#E8EAF0]">
          <form onSubmit={handleSubmit} className="space-y-4 p-2">
            {apiError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs font-semibold text-rose-700">
                {apiError}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember session</span>
              </label>
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Sign In to ERP
            </Button>
          </form>

        </Card>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px]">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted 256-bit Financial Endpoint</span>
        </div>
      </div>
    </div>
  );
}
