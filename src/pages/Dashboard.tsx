"use client";

import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-carpet-black via-carpet-black to-carpet-brown">
      {/* Header */}
      <header className="glass-dark border-b border-carpet-antique-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <h2 className="font-display text-xl text-carpet-antique-gold">
                Safiralux
              </h2>
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-carpet-cream hover:text-carpet-antique-gold"
            >
              <LogOut className="w-4 h-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-carpet-antique-gold mb-2">
            داشبورد کاربری
          </h1>
          <p className="text-carpet-cream/60">
            به پنل کاربری خود خوش آمدید
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="glass-dark rounded-xl p-6 border border-carpet-antique-gold/20 hover:border-carpet-antique-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <User className="w-8 h-8 text-carpet-antique-gold" />
            </div>
            <h3 className="font-display text-xl text-carpet-cream mb-2">
              پروفایل
            </h3>
            <p className="text-carpet-cream/60 text-sm mb-4">
              مشاهده و ویرایش اطلاعات کاربری
            </p>
            <Button
              variant="outline"
              className="w-full border-carpet-antique-gold/30 text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
            >
              مشاهده
            </Button>
          </div>

          {/* Orders Card */}
          <div className="glass-dark rounded-xl p-6 border border-carpet-antique-gold/20 hover:border-carpet-antique-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <ShoppingBag className="w-8 h-8 text-carpet-antique-gold" />
            </div>
            <h3 className="font-display text-xl text-carpet-cream mb-2">
              سفارشات
            </h3>
            <p className="text-carpet-cream/60 text-sm mb-4">
              پیگیری و مدیریت سفارشات
            </p>
            <Button
              variant="outline"
              className="w-full border-carpet-antique-gold/30 text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
            >
              مشاهده
            </Button>
          </div>

          {/* Favorites Card */}
          <div className="glass-dark rounded-xl p-6 border border-carpet-antique-gold/20 hover:border-carpet-antique-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-carpet-antique-gold" />
            </div>
            <h3 className="font-display text-xl text-carpet-cream mb-2">
              علاقه‌مندی‌ها
            </h3>
            <p className="text-carpet-cream/60 text-sm mb-4">
              فرش‌های مورد علاقه شما
            </p>
            <Button
              variant="outline"
              className="w-full border-carpet-antique-gold/30 text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
            >
              مشاهده
            </Button>
          </div>

          {/* Settings Card */}
          <div className="glass-dark rounded-xl p-6 border border-carpet-antique-gold/20 hover:border-carpet-antique-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Settings className="w-8 h-8 text-carpet-antique-gold" />
            </div>
            <h3 className="font-display text-xl text-carpet-cream mb-2">
              تنظیمات
            </h3>
            <p className="text-carpet-cream/60 text-sm mb-4">
              تنظیمات حساب کاربری
            </p>
            <Button
              variant="outline"
              className="w-full border-carpet-antique-gold/30 text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
            >
              مشاهده
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="font-display text-2xl text-carpet-antique-gold mb-6">
            فعالیت‌های اخیر
          </h2>
          <div className="glass-dark rounded-xl border border-carpet-antique-gold/20 p-6">
            <div className="text-center text-carpet-cream/60 py-12">
              <p>فعالیتی ثبت نشده است</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
