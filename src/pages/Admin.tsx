"use client";

import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const stats = [
    { label: 'کل فروش', value: '۱۲۳,۴۵۶,۷۸۹ تومان', icon: TrendingUp, color: 'text-green-400' },
    { label: 'سفارشات', value: '۲۴۵', icon: ShoppingCart, color: 'text-blue-400' },
    { label: 'محصولات', value: '۱۸۹', icon: Package, color: 'text-purple-400' },
    { label: 'کاربران', value: '۱,۲۳۴', icon: Users, color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-carpet-black via-carpet-black to-carpet-brown">
      {/* Header */}
      <header className="glass-dark border-b border-carpet-antique-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <h2 className="font-display text-xl text-carpet-antique-gold">
                  Safiralux
                </h2>
              </Link>
              <span className="px-3 py-1 rounded-full bg-carpet-antique-gold/20 text-carpet-antique-gold text-xs font-medium">
                Admin
              </span>
            </div>
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
            پنل مدیریت
          </h1>
          <p className="text-carpet-cream/60">
            مدیریت و کنترل سیستم
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="glass-dark rounded-xl p-6 border border-carpet-antique-gold/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <p className="text-carpet-cream/60 text-sm mb-1">{stat.label}</p>
                <p className="font-display text-2xl text-carpet-cream">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard */}
          <div className="glass-dark rounded-xl p-6 border border-carpet-antique-gold/20 hover:border-carpet-antique-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <LayoutDashboard className="w-8 h-8 text-carpet-antique-gold" />
            </div>
            <h3 className="font-display text-xl text-carpet-cream mb-2">
              داشبورد
            </h3>
            <p className="text-carpet-cream/60 text-sm mb-4">
              نمای کلی و آمار سیستم
            </p>
            <Button
              variant="outline"
              className="w-full border-carpet-antique-gold/30 text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
            >
              مشاهده
            </Button>
          </div>

          {/* Users Management */}
          <div className="glass-dark rounded-xl p-6 border border-carpet-antique-gold/20 hover:border-carpet-antique-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-carpet-antique-gold" />
            </div>
            <h3 className="font-display text-xl text-carpet-cream mb-2">
              کاربران
            </h3>
            <p className="text-carpet-cream/60 text-sm mb-4">
              مدیریت کاربران سیستم
            </p>
            <Button
              variant="outline"
              className="w-full border-carpet-antique-gold/30 text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
            >
              مشاهده
            </Button>
          </div>

          {/* Products Management */}
          <div className="glass-dark rounded-xl p-6 border border-carpet-antique-gold/20 hover:border-carpet-antique-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-carpet-antique-gold" />
            </div>
            <h3 className="font-display text-xl text-carpet-cream mb-2">
              محصولات
            </h3>
            <p className="text-carpet-cream/60 text-sm mb-4">
              مدیریت محصولات و فرش‌ها
            </p>
            <Button
              variant="outline"
              className="w-full border-carpet-antique-gold/30 text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
            >
              مشاهده
            </Button>
          </div>

          {/* Orders Management */}
          <div className="glass-dark rounded-xl p-6 border border-carpet-antique-gold/20 hover:border-carpet-antique-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="w-8 h-8 text-carpet-antique-gold" />
            </div>
            <h3 className="font-display text-xl text-carpet-cream mb-2">
              سفارشات
            </h3>
            <p className="text-carpet-cream/60 text-sm mb-4">
              مدیریت و پیگیری سفارشات
            </p>
            <Button
              variant="outline"
              className="w-full border-carpet-antique-gold/30 text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
            >
              مشاهده
            </Button>
          </div>

          {/* Analytics */}
          <div className="glass-dark rounded-xl p-6 border border-carpet-antique-gold/20 hover:border-carpet-antique-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-carpet-antique-gold" />
            </div>
            <h3 className="font-display text-xl text-carpet-cream mb-2">
              آمار و تحلیل
            </h3>
            <p className="text-carpet-cream/60 text-sm mb-4">
              گزارشات و تحلیل داده‌ها
            </p>
            <Button
              variant="outline"
              className="w-full border-carpet-antique-gold/30 text-carpet-antique-gold hover:bg-carpet-antique-gold hover:text-carpet-black"
            >
              مشاهده
            </Button>
          </div>

          {/* Settings */}
          <div className="glass-dark rounded-xl p-6 border border-carpet-antique-gold/20 hover:border-carpet-antique-gold/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <Settings className="w-8 h-8 text-carpet-antique-gold" />
            </div>
            <h3 className="font-display text-xl text-carpet-cream mb-2">
              تنظیمات
            </h3>
            <p className="text-carpet-cream/60 text-sm mb-4">
              تنظیمات عمومی سیستم
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
            فعالیت‌های اخیر سیستم
          </h2>
          <div className="glass-dark rounded-xl border border-carpet-antique-gold/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-carpet-black/30 border-b border-carpet-antique-gold/20">
                  <tr>
                    <th className="px-6 py-3 text-right text-carpet-cream/60 text-sm">زمان</th>
                    <th className="px-6 py-3 text-right text-carpet-cream/60 text-sm">رویداد</th>
                    <th className="px-6 py-3 text-right text-carpet-cream/60 text-sm">کاربر</th>
                    <th className="px-6 py-3 text-right text-carpet-cream/60 text-sm">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-carpet-cream/60">
                      فعالیتی ثبت نشده است
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
