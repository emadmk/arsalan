# 🚀 راهنمای نصب کامل - Persian Carpet Platform

این راهنما شامل **نصب خودکار** کل سیستم است.

## 📋 پیش‌نیازها

قبل از شروع، نصب کنید:
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 14+](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

## ⚡ نصب سریع (یک دستور!)

```bash
chmod +x setup.sh && ./setup.sh
```

این اسکریپت:
✅ Frontend را نصب می‌کند
✅ Backend را نصب می‌کند
✅ Database را راه‌اندازی می‌کند
✅ Admin اولیه را می‌سازد
✅ همه چیز را تست می‌کند

---

## 📦 نصب دستی (گام به گام)

### 1. Clone پروژه
```bash
git clone https://github.com/emadmk/arsalan.git
cd arsalan
```

### 2. Setup Database

```bash
# ورود به PostgreSQL
psql -U postgres

# ساخت database
CREATE DATABASE persian_carpet_db;
\q
```

### 3. Backend Setup

```bash
cd backend

# نصب dependencies
npm install

# کپی environment variables
cp .env.example .env

# ویرایش .env و مقادیر زیر را وارد کنید:
#  - DB_PASSWORD
#  - JWT_SECRET
#  - NOWPAYMENTS_API_KEY
#  - SMTP_USER & SMTP_PASS

# اجرای migrations
npm run migrate

# ساخت admin اولیه
npm run seed

# اجرا در حالت development
npm run dev
```

Backend در `http://localhost:5000` اجرا میشه.

### 4. Frontend Setup

```bash
cd ../  # برگشت به root

# نصب dependencies
npm install

# کپی environment variables
cp .env.example .env

# ویرایش .env:
#  فقط نیاز به VITE_SUPABASE_URL و ANON_KEY نیست!
#  Backend خودمون استفاده میشه

# اجرا
npm run dev
```

Frontend در `http://localhost:5173` اجرا میشه.

---

## 🔑 API Keys لازم

### 1. NOW Payments
1. برو [nowpayments.io](https://nowpayments.io)
2. ثبت‌نام کن (فقط ایمیل!)
3. از Settings > API Keys یک key بگیر
4. در `backend/.env` وارد کن:
```env
NOWPAYMENTS_API_KEY=your_key_here
```

### 2. Gmail SMTP (برای ایمیل)
1. برو Google Account > Security
2. 2-Step Verification فعال کن
3. App Passwords بساز
4. در `backend/.env` وارد کن:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🐳 نصب با Docker (آسان‌ترین!)

```bash
# Build و run
docker-compose up --build

# یا در background:
docker-compose up -d
```

تموم! همه چیز اماده است:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- PostgreSQL: localhost:5432

---

## ✅ تست سیستم

### 1. ورود به Admin
```
URL: http://localhost:5173
Email: admin@example.com
Password: Admin123!@#
```

### 2. تست خرید
1. خروج از admin
2. کلیک روی "Reserve Your Piece"
3. فرم رو پر کن
4. به درگاه NOWPayments برو
5. تست payment انجام بده

### 3. چک کردن Dashboard
بعد از payment، redirect به Dashboard میشی.

---

## 🔧 دستورات مفید

```bash
# Backend
cd backend
npm run dev          # اجرا development
npm run build        # build production
npm run start        # اجرا production
npm run migrate      # run migrations
npm run seed         # seed database

# Frontend
npm run dev          # اجرا development
npm run build        # build production
npm run preview      # preview build

# Docker
docker-compose up        # start all services
docker-compose down      # stop all services
docker-compose logs -f   # نمایش logs
```

---

## 📁 ساختار پروژه

```
arsalan/
├── backend/              # Node.js API
│   ├── src/
│   │   ├── routes/      # API Routes
│   │   ├── controllers/ # Business Logic
│   │   ├── models/      # Database Models
│   │   ├── services/    # External Services (NOWPayments, Email)
│   │   └── server.ts    # Entry Point
│   └── package.json
│
├── src/                  # React Frontend
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── App.tsx
│
├── docker-compose.yml    # Docker setup
├── setup.sh             # Auto setup script
└── README.md
```

---

## ❓ مشکلات رایج

### Database connection error
```bash
# چک کن PostgreSQL اجرا است:
sudo systemctl status postgresql

# اگر نه، start کن:
sudo systemctl start postgresql
```

### Port already in use
```bash
# پورت 5000 رو آزاد کن:
lsof -ti:5000 | xargs kill -9

# یا پورت backend رو عوض کن در backend/.env
```

### Email not sending
- مطمئن شو 2FA فعال است
- از App Password استفاده کن (نه password اصلی)
- "Less secure app access" رو فعال نکن (deprecated شده)

---

## 🎉 تبریک!

سیستمت آماده است! حالا میتونی:
- محصول جدید اضافه کنی
- فروش باز/بسته کنی
- سفارشات رو مدیریت کنی
- ایمیل‌ها رو تنظیم کنی

---

## 📞 پشتیبانی

مشکلی داری؟
- GitHub Issues: https://github.com/emadmk/arsalan/issues
- Email: support@example.com

