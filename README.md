# Persian Kerman Carpet - Professional E-Commerce Platform 🏛️

پلتفرم تجارت الکترونیک حرفه‌ای برای فروش فرش‌های دستباف کرمان با پرداخت کریپتو

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

## 🚀 ویژگی‌های کلیدی

### 💳 درگاه پرداخت کریپتو مستقل (NOWPayments)
- ✅ پشتیبانی از **140+ ارز دیجیتال** (BTC, ETH, USDT, USDC, BNB, SOL, ADA, و...)
- ✅ بدون نیاز به KYC - کاملاً مستقل
- ✅ کارمزد فقط 0.5%
- ✅ واریز مستقیم به کیف پول شما
- ✅ Webhook برای تایید خودکار پرداخت
- ✅ ردیابی Real-time وضعیت تراکنش

### 🔐 سیستم احراز هویت کامل
- ✅ JWT Authentication با Refresh Token
- ✅ ثبت‌نام و ورود با ایمیل/پسورد
- ✅ رمزنگاری با bcrypt
- ✅ نقش‌های کاربری (Admin/Customer)
- ✅ محافظت در مقابل حملات (Rate Limiting, Helmet)

### 👨‍💼 پنل مدیریت جامع (Admin Dashboard)
- ✅ مدیریت کامل سفارشات با فیلتر و جستجو
- ✅ آپدیت وضعیت سفارشات (pending → completed)
- ✅ مدیریت محصولات (CRUD)
- ✅ مدیریت کاربران
- ✅ آمار و گزارشات فروش Real-time
- ✅ ردیابی تراکنش‌های کریپتو
- ✅ صدور گواهی اصالت (Certificate)

### 👤 پنل کاربری (User Dashboard)
- ✅ مشاهده و ردیابی سفارشات
- ✅ تاریخچه کامل پرداخت‌ها
- ✅ دانلود گواهی اصالت PDF
- ✅ مدیریت پروفایل

### 📧 سیستم ایمیل خودکار
- ✅ تایید سفارش
- ✅ تایید پرداخت
- ✅ ارسال گواهی اصالت
- ✅ آپدیت وضعیت سفارش
- ✅ تمپلیت‌های HTML حرفه‌ای

### 📄 گواهی اصالت دیجیتال
- ✅ تولید خودکار PDF با QR Code
- ✅ طراحی حرفه‌ای با حاشیه طلایی
- ✅ شماره منحصر به فرد
- ✅ قابل دانلود از پنل کاربری

### 🎨 رابط کاربری لوکس
- ✅ طراحی Luxury و Responsive
- ✅ Animations با Framer Motion
- ✅ Mobile-first approach
- ✅ Tailwind CSS + shadcn/ui

## 🛠️ استک تکنولوژی

### Backend (کاملاً مستقل)
| تکنولوژی | استفاده |
|----------|---------|
| Node.js 18+ | Runtime |
| Express 4.18 | Web Framework |
| TypeScript 5.3 | Type Safety |
| PostgreSQL 15 | Database |
| JWT | Authentication |
| bcrypt | Password Hashing |
| NOWPayments API | Crypto Payments |
| Nodemailer | Email Service |
| PDFKit | Certificate Generation |
| Docker | Containerization |

### Frontend
| تکنولوژی | استفاده |
|----------|---------|
| React 18.3 | UI Library |
| TypeScript 5.3 | Type Safety |
| Vite 6.3 | Build Tool |
| Tailwind CSS 3.4 | Styling |
| shadcn/ui | Component Library |
| React Router 6.21 | Routing |
| TanStack Query 5.17 | Data Fetching |
| Zustand 4.4 | State Management |
| Framer Motion | Animations |

## 📦 نصب و راه‌اندازی

### روش 1: با Docker (توصیه می‌شود) 🐳

```bash
# 1. کلون پروژه
git clone https://github.com/emadmk/arsalan.git
cd arsalan
git checkout claude/crypto-dashboard-setup-01UtYRu8A2jBtj6bkhXztC1Q

# 2. اجرای اسکریپت نصب
chmod +x setup.sh
./setup.sh

# انتخاب گزینه 1 (Docker Compose)
```

اسکریپت به صورت خودکار:
- فایل `.env` می‌سازد
- PostgreSQL را راه‌اندازی می‌کند
- Database schema را ایجاد می‌کند
- Backend را build و اجرا می‌کند

### روش 2: نصب دستی

```bash
# 1. نصب PostgreSQL
sudo apt install postgresql postgresql-contrib

# 2. ساخت دیتابیس
psql -U postgres -c "CREATE DATABASE persian_carpet_db;"
psql -U postgres -d persian_carpet_db -f backend/src/config/schema.sql

# 3. تنظیم Environment
cp backend/.env.example backend/.env
# ویرایش .env با API keys

# 4. نصب dependencies
cd backend && npm install
cd .. && npm install

# 5. اجرای backend
cd backend && npm run dev

# 6. اجرای frontend (terminal دیگر)
npm run dev
```

## 🔑 تنظیمات API Keys

### 1. NOWPayments (ضروری)

1. به [nowpayments.io](https://nowpayments.io/) بروید
2. ثبت‌نام کنید (بدون KYC)
3. API Key و IPN Secret بگیرید
4. در `.env` اضافه کنید:

```env
NOWPAYMENTS_API_KEY=your_api_key_here
NOWPAYMENTS_IPN_SECRET=your_ipn_secret_here
```

### 2. Gmail SMTP (برای ایمیل)

1. در Gmail خود 2FA فعال کنید
2. App Password بسازید
3. در `.env` اضافه کنید:

```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. JWT Secret (خودکار)

اسکریپت setup.sh به صورت خودکار یک کلید امن می‌سازد.

## 📁 ساختار پروژه

```
arsalan/
├── backend/                    # Backend Node.js
│   ├── src/
│   │   ├── config/            # Database & env config
│   │   │   ├── database.ts    # PostgreSQL connection
│   │   │   └── schema.sql     # Database schema
│   │   ├── models/            # Database models
│   │   │   ├── User.ts
│   │   │   ├── Order.ts
│   │   │   ├── Product.ts
│   │   │   ├── Transaction.ts
│   │   │   ├── Certificate.ts
│   │   │   └── Settings.ts
│   │   ├── controllers/       # API controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── admin.controller.ts
│   │   │   └── webhook.controller.ts
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & validation
│   │   ├── services/          # External services
│   │   │   ├── nowpayments.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── pdf.service.ts
│   │   └── server.ts          # Express app
│   ├── Dockerfile
│   └── package.json
├── src/                        # Frontend React
│   ├── components/
│   ├── pages/
│   └── ...
├── docker-compose.yml          # Docker setup
├── setup.sh                    # اسکریپت نصب
└── README.md
```

## 🗄️ Database Schema

پایگاه داده شامل 6 جدول اصلی:

### users
- احراز هویت و اطلاعات کاربران
- نقش‌های Admin/Customer
- Password hashing با bcrypt

### products
- محصولات فرش
- مدیریت Grid Positions
- قیمت‌گذاری و تصاویر

### orders
- سفارشات کامل
- 11 وضعیت مختلف (pending → completed)
- اطلاعات مشتری و آدرس

### transactions
- تراکنش‌های کریپتو
- اطلاعات NOWPayments
- Transaction hash و مبالغ

### certificates
- گواهی‌های اصالت
- شماره منحصر به فرد
- لینک دانلود PDF

### settings
- تنظیمات سیستم
- Key-value storage

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          # ثبت‌نام
POST   /api/auth/login             # ورود
POST   /api/auth/refresh           # تمدید توکن
GET    /api/auth/me                # اطلاعات کاربر
PATCH  /api/auth/me                # آپدیت پروفایل
POST   /api/auth/change-password   # تغییر رمز
```

### Orders
```
POST   /api/orders                       # ایجاد سفارش
POST   /api/orders/:id/payment           # پرداخت کریپتو
GET    /api/orders/my                    # سفارشات من
GET    /api/orders/:id                   # جزئیات سفارش
GET    /api/orders/:id/payment-status    # وضعیت پرداخت
GET    /api/orders/:id/certificate       # دانلود گواهی
```

### Admin
```
GET    /api/admin/dashboard              # آمار کلی
GET    /api/admin/orders                 # لیست سفارشات
PATCH  /api/admin/orders/:id/status      # آپدیت وضعیت
POST   /api/admin/orders/:id/issue-certificate  # صدور گواهی
GET    /api/admin/products               # لیست محصولات
POST   /api/admin/products               # ایجاد محصول
PATCH  /api/admin/products/:id           # ویرایش محصول
DELETE /api/admin/products/:id           # حذف محصول
GET    /api/admin/users                  # لیست کاربران
GET    /api/admin/transactions           # لیست تراکنش‌ها
GET    /api/admin/settings               # تنظیمات
```

### Webhook
```
POST   /api/webhooks/nowpayments         # NOWPayments IPN
```

## 🚀 دستورات مفید

### Development
```bash
# Backend
cd backend
npm run dev          # اجرا با hot reload
npm run build        # Build TypeScript
npm start            # اجرای production

# Frontend
npm run dev          # Development server
npm run build        # Build برای production
```

### Docker
```bash
docker-compose up -d              # اجرا
docker-compose logs -f            # مشاهده logs
docker-compose restart            # Restart
docker-compose down               # متوقف کردن
```

### Database
```bash
# اتصال به PostgreSQL
docker-compose exec postgres psql -U postgres -d persian_carpet_db

# Backup
docker-compose exec postgres pg_dump -U postgres persian_carpet_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres -d persian_carpet_db < backup.sql
```

## 🔐 امنیت

✅ **JWT Authentication** با Refresh Token  
✅ **Password Hashing** با bcrypt (10 rounds)  
✅ **Rate Limiting** (100 req/15min API, 10 req/15min Auth)  
✅ **Helmet Security Headers**  
✅ **CORS Configuration**  
✅ **Input Validation & Sanitization**  
✅ **SQL Injection Prevention** (Parameterized Queries)  
✅ **XSS Protection**  
✅ **NOWPayments IPN Signature Verification**

## 📊 فلوی پرداخت

1. کاربر سفارش ایجاد می‌کند
2. سیستم پرداخت کریپتو ایجاد می‌کند (NOWPayments)
3. کاربر مبلغ را به آدرس ارسال می‌کند
4. NOWPayments webhook سیستم را مطلع می‌کند
5. سیستم وضعیت سفارش را آپدیت می‌کند
6. ایمیل تایید پرداخت ارسال می‌شود
7. ادمین سفارش را completed می‌کند
8. سیستم گواهی PDF تولید و ارسال می‌کند

## 🧪 تست API

### با cURL:

```bash
# Health Check
curl http://localhost:5000/health

# ثبت‌نام
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!@#"}'

# لاگین
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!@#"}'

# Dashboard (با توکن)
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### با Postman:

1. Collection import کنید
2. Environment variables تنظیم کنید
3. تمام endpoints را تست کنید

## 🐛 Troubleshooting

### Database Connection Error
```bash
# چک کنید PostgreSQL در حال اجرا است
docker-compose ps

# Logs را ببینید
docker-compose logs postgres
```

### Email Not Sending
- Gmail 2FA فعال باشد
- App Password (نه پسورد معمولی)
- SMTP settings را چک کنید

### Payment Webhook Not Working
- NOWPayments IPN URL باید عمومی باشد
- برای تست local از ngrok استفاده کنید:
```bash
ngrok http 5000
# URL را در NOWPayments تنظیم کنید
```

### Port Already in Use
```bash
# پورت‌های در حال استفاده را ببینید
sudo lsof -i :5000
sudo lsof -i :5432

# Process را kill کنید
sudo kill -9 PID
```

## 📞 پشتیبانی

- 🐛 **Issues**: [GitHub Issues](https://github.com/emadmk/arsalan/issues)
- 📧 **Email**: support@example.com

## 📄 لایسنس

MIT License

---

<div align="center">

**ساخته شده با ❤️ برای میراث فرهنگی ایران**

🏛️ 🕌 🧵 ⚡

[طراحی اولیه Figma](https://www.figma.com/design/qt04FLbV8v3s6EA7NChJju/Persian-Kerman-Carpet-Luxury-Landing-Page)

</div>
