# Persian Kerman Carpet - Professional E-Commerce Platform 🏛️

A complete, production-ready e-commerce platform for selling luxury Persian Kerman Carpets with cryptocurrency payment integration.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

## 🚀 ویژگی‌های کلیدی

### 💳 درگاه پرداخت کریپتو مستقل
- ✅ پشتیبانی از **10+ ارز دیجیتال** (BTC, ETH, USDT, USDC, BNB, SOL, ADA, MATIC, DOT, AVAX)
- ✅ قیمت‌گذاری **Real-time** از طریق CoinGecko API
- ✅ محاسبه خودکار نرخ تبدیل
- ✅ ردیابی تراکنش‌های Blockchain
- ✅ واریز مستقیم به Trust Wallet شما

### 🔐 سیستم احراز هویت کامل
- ✅ ثبت‌نام و ورود با ایمیل/پسورد
- ✅ اتصال به Crypto Wallet (MetaMask, Trust Wallet, WalletConnect)
- ✅ Protected routes برای صفحات خصوصی
- ✅ نقش‌های کاربری (Admin/Customer)
- ✅ Session management با Supabase Auth

### 👨‍💼 پنل مدیریت جامع (Admin Dashboard)
- ✅ مدیریت سفارشات با فیلتر و جستجو
- ✅ مدیریت مشتریان و پروفایل‌ها
- ✅ آمار و گزارشات فروش Real-time
- ✅ ردیابی تراکنش‌های کریپتو
- ✅ مدیریت محصولات و Grid Positions
- ✅ نمودارها و Analytics

### 👤 پنل کاربری حرفه‌ای (User Dashboard)
- ✅ مشاهده و ردیابی سفارشات با Progress Bar
- ✅ تاریخچه کامل پرداخت‌های کریپتو
- ✅ مدیریت پروفایل و Wallet
- ✅ دانلود گواهی اصالت (Certificate)
- ✅ اطلاعات دقیق هر تراکنش

### 🎨 رابط کاربری لوکس
- ✅ طراحی Luxury و Responsive
- ✅ Animations حرفه‌ای با Framer Motion
- ✅ Dark/Light mode ready
- ✅ Mobile-first approach
- ✅ Persian/Farsi RTL support ready

## 🛠️ استک تکنولوژی

### Frontend
| تکنولوژی | نسخه | توضیحات |
|----------|------|---------|
| React | 18.3 | UI Library |
| TypeScript | 5.3 | Type Safety |
| Vite | 6.3 | Build Tool |
| Tailwind CSS | 3.4 | Styling |
| shadcn/ui | Latest | Component Library |
| React Router | 6.21 | Routing |
| TanStack Query | 5.17 | Data Fetching |
| Zustand | 4.4 | State Management |
| Framer Motion | Latest | Animations |

### Backend & Database
| تکنولوژی | استفاده |
|----------|---------|
| Supabase | Backend as a Service |
| PostgreSQL | Database |
| Row Level Security | امنیت داده |
| Real-time | Live Updates |

### Web3 & Crypto
| کتابخانه | استفاده |
|----------|---------|
| Wagmi | React Hooks for Ethereum |
| Viem | Ethereum Library |
| Ethers.js | Blockchain Interactions |
| CoinGecko API | Crypto Prices |

## 📦 نصب و راه‌اندازی

### پیش‌نیازها
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### مراحل نصب

#### 1. کلون پروژه
```bash
git clone https://github.com/emadmk/arsalan.git
cd arsalan
```

#### 2. نصب Dependencies
```bash
npm install
```

#### 3. تنظیم Environment Variables

فایل `.env` بسازید:
```bash
cp .env.example .env
```

و این مقادیر را وارد کنید:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Trust Wallet Address (آدرس کیف پول شما برای دریافت پرداخت)
VITE_CRYPTO_WALLET_ADDRESS=0xYourWalletAddress

# WalletConnect Project ID (اختیاری)
VITE_WALLETCONNECT_PROJECT_ID=your-project-id
```

#### 4. راه‌اندازی Supabase Database

1. در [supabase.com](https://supabase.com) پروژه جدید بسازید
2. به SQL Editor بروید
3. کد SQL زیر را از `src/lib/supabase.ts` کپی و اجرا کنید:

```sql
-- دستورات SQL برای ایجاد جداول و RLS policies
-- کل Schema در فایل src/lib/supabase.ts موجود است
```

#### 5. اجرای پروژه
```bash
npm run dev
```

🎉 پروژه در `http://localhost:5173` در دسترس است!

## 📁 ساختار پروژه

```
arsalan/
├── src/
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   ├── auth/
│   │   │   ├── AuthModal.tsx           # مودال ورود/ثبت‌نام
│   │   │   ├── LoginForm.tsx           # فرم ورود
│   │   │   └── RegisterForm.tsx        # فرم ثبت‌نام
│   │   ├── CryptoPaymentGateway.tsx    # درگاه پرداخت کریپتو
│   │   ├── Navigation.tsx              # نوار ناوبری
│   │   ├── HeroSection.tsx
│   │   ├── PricingSection.tsx
│   │   └── ... (سایر کامپوننت‌های لندینگ)
│   │
│   ├── pages/
│   │   ├── HomePage.tsx                # صفحه اصلی لندینگ
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx      # داشبورد مدیریت
│   │   └── user/
│   │       └── UserDashboard.tsx       # داشبورد کاربر
│   │
│   ├── lib/
│   │   ├── supabase.ts                 # Supabase client + DB Schema
│   │   └── wagmi.ts                    # Web3 configuration
│   │
│   ├── store/
│   │   └── auth.ts                     # Zustand auth store
│   │
│   ├── hooks/
│   │   ├── useOrders.ts               # Hook سفارشات
│   │   └── useCrypto.ts               # Hook قیمت‌های کریپتو
│   │
│   ├── utils/
│   │   └── crypto.ts                   # توابع کریپتو
│   │
│   ├── types/
│   │   └── index.ts                    # TypeScript definitions
│   │
│   └── App.tsx                          # Root component
│
├── .env.example                         # نمونه env
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🗄️ Schema دیتابیس

### جداول اصلی:

**users** - اطلاعات کاربران
```sql
- id (UUID, PK)
- email (TEXT, UNIQUE)
- full_name (TEXT)
- wallet_address (TEXT)
- role ('admin' | 'customer')
- created_at, updated_at
```

**products** - محصولات (فرش‌ها)
```sql
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- price_usd (DECIMAL)
- images (JSONB[])
- grid_positions_total (INT)
- grid_positions_available (INT)
- status ('active' | 'sold_out' | 'coming_soon')
```

**orders** - سفارشات
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- product_id (UUID, FK → products)
- grid_position (INT)
- status (pending_payment | payment_received | in_production | completed | cancelled)
- payment_status (pending | completed | failed | refunded)
- total_amount_usd (DECIMAL)
```

**transactions** - تراکنش‌های کریپتو
```sql
- id (UUID, PK)
- order_id (UUID, FK → orders)
- user_id (UUID, FK → users)
- transaction_hash (TEXT)
- crypto_currency (TEXT)
- crypto_amount (DECIMAL)
- usd_amount (DECIMAL)
- exchange_rate (DECIMAL)
- wallet_from, wallet_to (TEXT)
- status (pending | confirmed | failed)
```

✅ همه جداول دارای **Row Level Security (RLS)** هستند

## 🔑 تنظیم API Keys

### 1. Supabase Setup
1. به [supabase.com](https://supabase.com) بروید
2. پروژه جدید بسازید
3. به Settings > API بروید
4. مقادیر `URL` و `anon public key` را کپی کنید
5. در `.env` قرار دهید

### 2. Trust Wallet/Crypto Address
آدرس کیف پول خود را که می‌خواهید پرداخت‌ها به آن واریز شود در `.env` قرار دهید:
```env
VITE_CRYPTO_WALLET_ADDRESS=0xYourTrustWalletAddress
```

### 3. WalletConnect (اختیاری)
برای اتصال به Wallet:
1. به [cloud.walletconnect.com](https://cloud.walletconnect.com) بروید
2. پروژه جدید بسازید
3. Project ID را کپی کنید

### 4. CoinGecko (رایگان)
برای دریافت قیمت‌های Real-time - نیازی به API key نیست! (رایگان)

## 🚀 Build و Deployment

### Build برای Production
```bash
npm run build
```

خروجی در پوشه `build/` قرار می‌گیرد.

### Deploy روی Vercel
```bash
npm i -g vercel
vercel deploy
```

### Deploy روی Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Deploy روی Railway/Render
1. Repository را به Github push کنید
2. در Railway/Render به repo وصل شوید
3. Environment variables را تنظیم کنید
4. Deploy!

## 📝 راهنمای استفاده

### برای کاربر:
1. روی "Get Started" کلیک کنید
2. ثبت‌نام کنید یا Wallet وصل کنید
3. روی "Reserve Your Piece - $100" کلیک کنید
4. ارز دیجیتال دلخواه را انتخاب کنید
5. مقدار نمایش داده شده را به آدرس ارسال کنید
6. Transaction Hash را وارد کنید
7. در Dashboard خود سفارش را ردیابی کنید

### برای ادمین:
1. با حساب Admin وارد شوید
2. در Navigation روی Dashboard کلیک کنید
3. تمام سفارشات و تراکنش‌ها را مشاهده کنید
4. وضعیت سفارشات را آپدیت کنید

## 🔐 امنیت

✅ **Row Level Security (RLS)** برای تمام جداول
✅ **JWT Authentication** توسط Supabase
✅ **HTTPS Only** برای تمام requests
✅ **Environment Variables** برای Secrets
✅ **SQL Injection Prevention** با Parameterized Queries
✅ **XSS Protection** با React DOM Sanitization

## 🎯 Roadmap آینده

- [ ] پشتیبانی از Solana و سایر شبکه‌ها
- [ ] NFT Certificate برای اصالت
- [ ] Live Chat پشتیبانی
- [ ] اپلیکیشن موبایل (React Native)
- [ ] Multi-language (EN, FA, AR)
- [ ] Smart Contract Escrow
- [ ] سیستم امتیازدهی و نظرات
- [ ] Email Notifications
- [ ] SMS Verification
- [ ] Progress Photos برای سفارشات

## 🤝 مشارکت

مشارکت‌ها خوشایند است!

1. Fork کنید
2. Feature branch بسازید (`git checkout -b feature/AmazingFeature`)
3. تغییرات را commit کنید (`git commit -m 'Add AmazingFeature'`)
4. Push کنید (`git push origin feature/AmazingFeature`)
5. Pull Request باز کنید

## 📄 لایسنس

MIT License - برای جزئیات بیشتر به LICENSE ببینید

## 📞 پشتیبانی

- 🐛 **Issues**: [GitHub Issues](https://github.com/emadmk/arsalan/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/emadmk/arsalan/discussions)
- 📧 **Email**: support@example.com

## ⭐ اگر مفید بود Star بدهید!

اگر این پروژه برایتان مفید بود، لطفاً یک ستاره ⭐ بدهید!

---

<div align="center">

**Made with ❤️ for Persian Heritage**

🏛️ 🕌 🧵 ⚡

[Original Figma Design](https://www.figma.com/design/qt04FLbV8v3s6EA7NChJju/Persian-Kerman-Carpet-Luxury-Landing-Page)

</div>
