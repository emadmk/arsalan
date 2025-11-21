"use client";

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      alert('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }
    if (formData.name && formData.email && formData.password) {
      // در پروژه واقعی باید به API متصل شود
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-carpet-black via-carpet-black to-carpet-brown flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="glass-dark rounded-2xl p-8 border border-carpet-antique-gold/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl text-carpet-antique-gold mb-2">
              Safiralux
            </h2>
            <p className="text-carpet-cream/60">ایجاد حساب کاربری جدید</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-carpet-cream/80 mb-2 text-sm">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-carpet-black/50 border border-carpet-antique-gold/30 rounded-lg text-carpet-cream focus:outline-none focus:border-carpet-antique-gold transition-colors"
                placeholder="نام شما"
                required
              />
            </div>

            <div>
              <label className="block text-carpet-cream/80 mb-2 text-sm">
                ایمیل
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-carpet-black/50 border border-carpet-antique-gold/30 rounded-lg text-carpet-cream focus:outline-none focus:border-carpet-antique-gold transition-colors"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-carpet-cream/80 mb-2 text-sm">
                رمز عبور
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-carpet-black/50 border border-carpet-antique-gold/30 rounded-lg text-carpet-cream focus:outline-none focus:border-carpet-antique-gold transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-carpet-cream/80 mb-2 text-sm">
                تکرار رمز عبور
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-carpet-black/50 border border-carpet-antique-gold/30 rounded-lg text-carpet-cream focus:outline-none focus:border-carpet-antique-gold transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-carpet-antique-gold text-carpet-black hover:bg-carpet-antique-gold/90 py-3"
            >
              ثبت نام
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/login"
              className="block text-carpet-antique-gold hover:text-carpet-antique-gold/80 text-sm"
            >
              قبلاً حساب دارید؟ وارد شوید
            </Link>
            <Link
              to="/"
              className="block text-carpet-cream/60 hover:text-carpet-cream text-sm"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
