# 🎓 CounselSphere

> A full-stack college admission counselling portal — from student registration to merit-based seat allotment, fee verification, and digital offer letter generation.

![Next.js](https://img.shields.io/badge/Framework-Next.js_16-000000?style=for-the-badge&logo=nextdotjs)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)
![Auth](https://img.shields.io/badge/Auth-NextAuth.js-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🎯 What it does

A complete digital counselling system for engineering college admissions — replacing manual paperwork with a transparent, merit-based online pipeline.

- **Student Portal** — Register, submit marks, choose branch preferences, accept allotment, upload fee receipt, download offer letter
- **Admin Panel** — View merit rankings, allot branches manually, verify payment receipts, manage seat matrix
- **Merit-Based Ranking** — Students automatically ranked by 10+2 (Physics + Chemistry + Math) scores
- **Digital Offer Letter** — Auto-generated PDF with student details, allotted branch, and signatures
- **Google OAuth** — Students can sign up/log in with Google
- **Live Seat Matrix** — Real-time seat availability visible on landing page

---

## 📸 Screenshots

> Coming soon

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 (App Router) | Full-stack React framework |
| Auth | NextAuth.js v4 | Credentials + Google OAuth |
| Database | SQLite via Prisma ORM | Type-safe queries, easy migrations |
| Styling | Vanilla CSS + Glassmorphism | Custom dark theme, no Tailwind |
| PDF Generation | jsPDF | Client-side offer letter generation |
| Password Hashing | bcryptjs | Secure credential storage |

---

## 🏗️ Architecture

```
Student/Admin Browser
        ↓
Next.js App Router (SSR + Client Components)
        ↓
NextAuth.js (JWT Sessions)
        ↓
API Routes (/api/student/* and /api/admin/*)
        ↓
Prisma ORM
        ↓
SQLite Database (dev.db)
```

---

## 📁 Project Structure

```
proj/
├── prisma/
│   ├── schema.prisma         # DB schema (User, Student, SeatMatrix)
│   └── seed.js               # Default admin + 6 branches
├── public/
│   └── uploads/              # Payment receipts
├── src/
│   ├── app/
│   │   ├── page.js           # Landing page (live seat matrix + timeline)
│   │   ├── login/            # Student login
│   │   ├── register/         # Student registration
│   │   ├── student/          # Protected student portal
│   │   │   ├── dashboard/    # Application checklist + progress
│   │   │   ├── profile/      # Personal info form
│   │   │   ├── marks/        # 10th & 12th marks + branch preferences
│   │   │   ├── branch-status/# Accept / request reassignment
│   │   │   ├── payment/      # Upload bank receipt
│   │   │   └── offer-letter/ # Download offer letter PDF
│   │   ├── admin-portal/     # Protected admin panel
│   │   │   ├── login/        # Admin login
│   │   │   ├── dashboard/    # Merit rankings + allotment + verification
│   │   │   └── seat-matrix/  # Branch CRUD management
│   │   └── api/              # All API routes
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── Sidebar.js        # Student portal sidebar with step progress
│   │   ├── StepProgress.js   # 5-step progress bar
│   │   ├── FileUpload.js
│   │   └── LoadingSpinner.js
│   └── lib/
│       ├── auth.js           # requireAuth / requireStudent / requireAdmin
│       └── prisma.js         # Prisma client singleton
├── .env.local                # Environment variables
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### Installation

```bash
# Clone the repo
git clone https://github.com/Himanshu-pant2005/college-counselling.git
cd college-counselling
```

```bash
# Install dependencies
npm install
```

### Environment Setup

Create `.env.local` in the root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional — Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Database Setup

```bash
# Push schema to SQLite
npx prisma db push

# Seed default admin + 6 branches
npx prisma db seed
```

### Run

```bash
npm run dev
```

Visit **http://localhost:3000**

---

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.edu | adminpassword |

> ⚠️ Change the admin password before deploying to production.

---

## 🗺️ 5-Step Admission Flow

```
1. Register & Verify      → Student creates account
2. Submit Profile & Marks → Personal info + 10th & 12th marks + branch preferences
3. Merit Ranking          → Admin views ranked list, manually allots branch
4. Accept & Pay           → Student accepts branch, uploads bank receipt
5. Offer Letter           → Admin verifies payment, student downloads PDF
```

---

## 👤 Admin Access

The admin panel is intentionally not linked from the public navbar.

- URL: `/admin-portal/login`
- First admin is created via the seed script
- Additional admins can be created from `/admin-portal/register` (requires existing admin session)

---

## 🧪 Try it out

1. Register a student account at `/register`
2. Fill profile and submit marks with branch preferences
3. Log in as admin at `/admin-portal/login`
4. View merit rankings → allot a branch to the student
5. Log back in as student → accept the branch
6. Upload a payment receipt (any image)
7. Admin verifies the receipt
8. Student downloads the offer letter PDF

---

## 🗺️ Roadmap

- [x] Student registration with OTP-style flow
- [x] Google OAuth login
- [x] Profile + marks submission
- [x] Merit-based ranking system
- [x] Admin branch allotment with seat matrix
- [x] Payment receipt upload + admin verification
- [x] jsPDF offer letter generation
- [x] Glassmorphism dark theme UI
- [x] Fully responsive (mobile + tablet + desktop)
- [ ] Email notifications at each step
- [ ] OTP verification via SMS
- [ ] Deploy to Vercel + PlanetScale

---

## 🤝 Contributing

Pull requests are welcome. For major changes please open an issue first.

---

## 📄 License

[MIT](LICENSE) — free to use for educational purposes.

---

<p align="center">Built with 💙 using Next.js + Prisma + NextAuth</p>