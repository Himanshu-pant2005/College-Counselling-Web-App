# College Counselling Web App — Full Rebuild

## Background

The existing Django codebase has **12+ bugs** (missing templates, variable mismatches, broken file uploads, undefined URL names) and an incomplete UI. Rather than patching it, we'll rebuild from scratch with a modern stack that delivers a **visually stunning, fully functional** application.

---

## Tech Stack Decision: **Next.js 14**

| Concern | Choice | Why |
|---------|--------|-----|
| **Framework** | Next.js 14 (App Router) | Full-stack React framework — single codebase for frontend & backend |
| **Auth** | NextAuth.js (Auth.js v5) | Built-in Google OAuth + Credentials (email/password) — trivial setup |
| **Database** | Prisma ORM + SQLite | Type-safe queries, easy migrations, no external DB server needed |
| **Styling** | Vanilla CSS | Maximum control, custom animations, no dependency bloat |
| **PDF Generation** | jsPDF (client-side) | Generate offer letters as downloadable PDFs |
| **Password Hashing** | bcrypt | Industry-standard |
| **File Uploads** | Local filesystem (`/public/uploads/`) | Simple, no cloud dependencies |
| **Language** | JavaScript (ES Modules) | Simpler than TypeScript for a college project |

> [!TIP]
> Next.js gives us server-side rendering, API routes, file-based routing, and React's component model — all in one. This means a **much better UI** than Django templates, with smooth page transitions, dynamic forms, and real-time feedback.

---

## User Review Required

> [!IMPORTANT]
> **Google OAuth Setup**: For Google sign-in to work, you'll need to create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/). I'll set up the code to work with environment variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`). The app will work with email/password auth even without Google credentials configured.

> [!WARNING]
> **This replaces the entire Django codebase.** The existing Django files will be removed and replaced with a Next.js project. The SQLite database will be fresh (no data migration from the old `db.sqlite3`).

---

## Open Questions

1. **Branch List**: The existing code has two conflicting sets — `CSE, ECE, ME, CE, EE, IT` (in Student model) vs `B.Tech - CSE, B.Tech - ECE, BCA, MCA` (in seed script). Which branches should we use? I'll default to the 6 engineering branches (CSE, ECE, ME, CE, EE, IT) with 60 seats each.

2. **Admin Registration**: Should admins self-register, or should we seed a default admin account? I'll implement **both** — a seed script for the first admin + an admin-only "Create Admin" feature.

3. **Payment Flow**: The project says "submit the receipt of the amount deposited in Bank." I'll implement a file upload for the bank receipt (image/PDF), not an actual payment gateway.

---

## Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String?                    // null for Google OAuth users
  role          String    @default("student") // "student" | "admin"
  image         String?
  phone         String?
  dob           String?
  createdAt     DateTime  @default(now())
  student       Student?
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Student {
  id              String  @id @default(cuid())
  userId          String  @unique
  user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  // High School Marks (0-100)
  mathHs          Int?
  scienceHs       Int?
  englishHs       Int?
  hindiHs         Int?

  // 10+2 Marks (0-100)
  physics         Int?
  chemistry       Int?
  math12          Int?

  // Branch Preferences
  branchChoice1   String?
  branchChoice2   String?
  allottedBranch  String?
  branchStatus    String  @default("pending") // pending|accepted|rejected

  // Payment
  paymentReceipt  String?  // file path
  paymentVerified Boolean  @default(false)

  // Offer Letter
  offerGenerated  Boolean  @default(false)

  // Profile Status
  profileCompleted Boolean @default(false)
  marksSubmitted   Boolean @default(false)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model SeatMatrix {
  id          String @id @default(cuid())
  branchName  String @unique
  branchCode  String @unique
  totalSeats  Int    @default(60)
  filledSeats Int    @default(0)
}
```

---

## Proposed Changes

### 1. Project Setup & Configuration

#### [DELETE] All existing Django files
Remove: `manage.py`, `requirements.txt`, `db.sqlite3`, `add_courses.py`, `college_counselling/`, `counselling/`, `students/`, `admins/`, `templates/`, `static/`, `README_GOOGLE_AUTH.md`

#### [NEW] Next.js project initialization
- `npx create-next-app@latest` with App Router, JavaScript, no TypeScript, vanilla CSS
- Install dependencies: `next-auth`, `@prisma/client`, `prisma`, `bcryptjs`, `jspdf`

#### [NEW] `.env.local`
Environment variables for NextAuth secret, Google OAuth credentials, database URL

#### [NEW] `prisma/schema.prisma`
Database schema as defined above

#### [NEW] `prisma/seed.js`
Seed script to create default admin + 6 branches (CSE, ECE, ME, CE, EE, IT)

---

### 2. Authentication System

#### [NEW] `src/app/api/auth/[...nextauth]/route.js`
NextAuth.js configuration with:
- **Credentials Provider**: Email + password login with bcrypt verification
- **Google Provider**: OAuth2 with automatic account linking
- Custom callbacks: attach `role` and `id` to session/JWT

#### [NEW] `src/app/api/auth/register/route.js`
POST endpoint for student registration (name, email, password → hashed with bcrypt)

#### [NEW] `src/app/api/auth/register-admin/route.js`
POST endpoint for admin registration (protected — requires existing admin session)

#### [NEW] `src/lib/auth.js`
Shared auth utilities (getServerSession wrapper, requireAuth, requireAdmin helpers)

---

### 3. Public Pages

#### [NEW] `src/app/page.js` — Landing Page
- Hero section with animated gradient background
- Feature cards (Registration → Branch Allotment → Offer Letter)
- Available branches table with live seat counts
- Admission process timeline (5 steps, animated)
- CTA buttons for Login / Sign Up

#### [NEW] `src/app/about/page.js` — About Page
- College information, mission, placement stats

#### [NEW] `src/app/contact/page.js` — Contact Page
- Contact form (name, email, message) + college address/map embed

---

### 4. Student Authentication Pages

#### [NEW] `src/app/login/page.js` — Student Login
- Email + password form
- Google OAuth button with icon
- "Forgot password?" link
- Animated card with glassmorphism effect

#### [NEW] `src/app/register/page.js` — Student Registration
- Name, email, password, confirm password
- Google OAuth button
- Form validation with real-time feedback
- Matching design to login page

---

### 5. Student Portal (Protected Routes)

#### [NEW] `src/app/student/layout.js`
- Sidebar navigation with step progress indicator
- Protected layout (redirects to login if unauthenticated)

#### [NEW] `src/app/student/dashboard/page.js` — Student Dashboard
- Welcome message + profile completion progress bar
- 5-step workflow cards showing current status
- Allotted branch info (if applicable)
- Available branches table

#### [NEW] `src/app/student/profile/page.js` — Step 1: Personal Info
- Form: First Name, Last Name, Email (disabled), Phone, Date of Birth
- 2-column responsive grid layout
- Save & Continue button

#### [NEW] `src/app/student/marks/page.js` — Step 2: Marks & Branch Preferences
- Section 1: High School Marks (Math, Science, English, Hindi) — number inputs with 0-100 validation
- Section 2: 10+2 Marks (Physics, Chemistry, Math) — number inputs
- Section 3: Branch Preferences — two dropdowns (1st & 2nd choice)
- Auto-calculated total displayed
- Save Preferences button

#### [NEW] `src/app/student/branch-status/page.js` — Step 3: Branch Acceptance
- Conditional display:
  - Pending: "Waiting for branch allotment" message with animation
  - Allotted: Branch name + Accept / Request Reassignment buttons
  - Accepted: Confirmation + proceed to payment
  - Rejected: "Reassignment requested" status

#### [NEW] `src/app/student/payment/page.js` — Step 4: Fee Payment
- Upload receipt (image/PDF) with drag-and-drop zone
- Preview uploaded file
- Payment verification status indicator
- Only accessible after accepting branch

#### [NEW] `src/app/student/offer-letter/page.js` — Step 5: Offer Letter
- Download offer letter button (generates PDF via jsPDF)
- Offer letter preview
- Only accessible after payment verification

---

### 6. Admin Portal (Protected Routes — staff only)

#### [NEW] `src/app/admin-portal/login/page.js` — Admin Login
- Separate admin login page with distinct design (dark theme)
- Email + password form (no Google OAuth for admin)

#### [NEW] `src/app/admin-portal/register/page.js` — Admin Registration
- Protected: only accessible by existing admins
- Name, email, password form

#### [NEW] `src/app/admin-portal/layout.js`
- Admin sidebar with navigation
- Protected layout (redirects if not admin)

#### [NEW] `src/app/admin-portal/dashboard/page.js` — Admin Dashboard
- Students table sorted by 10+2 marks (descending) = Merit Ranking
- Columns: Rank, Name, Physics, Chemistry, Math, Total, Branch Choice 1, Branch Choice 2, Allotted Branch, Status, Actions
- "Allot Branch" button per student → modal/page
- Filter/search functionality

#### [NEW] `src/app/admin-portal/seat-matrix/page.js` — Seat Matrix Management
- Table: Branch Name, Total Seats, Filled Seats, Available Seats
- Add Branch form (inline)
- Edit / Delete buttons per row

#### [NEW] `src/app/admin-portal/allot-branch/[studentId]/page.js` — Branch Allotment
- Student details summary
- Branch selection dropdown (showing available seats)
- Allot button → updates student + increments filled seats

#### [NEW] `src/app/admin-portal/verify-payment/[studentId]/page.js` — Payment Verification
- Student details + uploaded receipt preview
- Approve / Reject buttons
- On approve: marks payment verified + offer letter generated

---

### 7. API Routes

#### [NEW] `src/app/api/student/profile/route.js` — GET/POST student profile
#### [NEW] `src/app/api/student/marks/route.js` — GET/POST marks & preferences
#### [NEW] `src/app/api/student/branch-status/route.js` — GET/POST accept/reject branch
#### [NEW] `src/app/api/student/payment/route.js` — GET/POST payment receipt upload
#### [NEW] `src/app/api/student/offer-letter/route.js` — GET generate offer letter data
#### [NEW] `src/app/api/admin/students/route.js` — GET all students (sorted by merit)
#### [NEW] `src/app/api/admin/seat-matrix/route.js` — GET/POST/PUT/DELETE seat matrix
#### [NEW] `src/app/api/admin/allot-branch/route.js` — POST allot branch to student
#### [NEW] `src/app/api/admin/verify-payment/route.js` — POST verify/reject payment

---

### 8. Shared Components

#### [NEW] `src/components/Navbar.js` — Responsive top navbar
#### [NEW] `src/components/Sidebar.js` — Portal sidebar with step progress
#### [NEW] `src/components/Footer.js` — Site-wide footer
#### [NEW] `src/components/StepProgress.js` — Visual step indicator (1-5)
#### [NEW] `src/components/BranchTable.js` — Reusable branch/seats table
#### [NEW] `src/components/FileUpload.js` — Drag-and-drop file upload component
#### [NEW] `src/components/Modal.js` — Reusable modal dialog
#### [NEW] `src/components/LoadingSpinner.js` — Loading animation

---

### 9. Styling

#### [NEW] `src/app/globals.css` — Design System
- CSS custom properties (color palette, spacing, typography, shadows, radii)
- Dark-mode-first color scheme with vibrant accents
- Glassmorphism card styles
- Animated gradient backgrounds
- Form input styles with focus animations
- Button styles (primary, secondary, danger, success)
- Table styles with hover effects
- Responsive breakpoints (mobile-first)
- Micro-animations (fade-in, slide-up, pulse, shimmer)
- Step progress indicator styles

---

## Design Direction

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `hsl(230, 80%, 56%)` | Primary buttons, links, accents |
| `--primary-dark` | `hsl(230, 80%, 44%)` | Hover states |
| `--secondary` | `hsl(280, 70%, 55%)` | Gradients, secondary elements |
| `--success` | `hsl(152, 68%, 45%)` | Accept, verified, complete |
| `--warning` | `hsl(38, 92%, 55%)` | Pending, caution |
| `--danger` | `hsl(0, 72%, 56%)` | Reject, error |
| `--bg-primary` | `hsl(225, 25%, 8%)` | Page background (dark) |
| `--bg-card` | `hsl(225, 20%, 12%)` | Card backgrounds |
| `--bg-input` | `hsl(225, 20%, 16%)` | Input backgrounds |
| `--text-primary` | `hsl(0, 0%, 95%)` | Main text |
| `--text-secondary` | `hsl(225, 15%, 60%)` | Muted text |

### Typography
- **Font**: `Inter` (Google Fonts) — clean, modern, excellent readability
- **Headings**: 700 weight, letter-spacing -0.02em
- **Body**: 400 weight, line-height 1.6

### Key Visual Elements
- Glassmorphism cards (`backdrop-filter: blur(20px)`, semi-transparent backgrounds)
- Animated gradient hero sections
- Smooth page transitions
- Micro-animations on buttons, cards, form inputs
- Step progress indicator with animated completion
- Floating label inputs
- Drag-and-drop upload zone with hover animation

---

## File Structure (Final)

```
proj/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── public/
│   └── uploads/              # Payment receipts
├── src/
│   ├── app/
│   │   ├── globals.css       # Design system
│   │   ├── layout.js         # Root layout (Inter font, Navbar)
│   │   ├── page.js           # Landing page
│   │   ├── about/page.js
│   │   ├── contact/page.js
│   │   ├── login/page.js
│   │   ├── register/page.js
│   │   ├── student/
│   │   │   ├── layout.js
│   │   │   ├── dashboard/page.js
│   │   │   ├── profile/page.js
│   │   │   ├── marks/page.js
│   │   │   ├── branch-status/page.js
│   │   │   ├── payment/page.js
│   │   │   └── offer-letter/page.js
│   │   ├── admin-portal/
│   │   │   ├── login/page.js
│   │   │   ├── register/page.js
│   │   │   ├── layout.js
│   │   │   ├── dashboard/page.js
│   │   │   ├── seat-matrix/page.js
│   │   │   ├── allot-branch/[studentId]/page.js
│   │   │   └── verify-payment/[studentId]/page.js
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.js
│   │       ├── auth/register/route.js
│   │       ├── auth/register-admin/route.js
│   │       ├── student/
│   │       │   ├── profile/route.js
│   │       │   ├── marks/route.js
│   │       │   ├── branch-status/route.js
│   │       │   ├── payment/route.js
│   │       │   └── offer-letter/route.js
│   │       └── admin/
│   │           ├── students/route.js
│   │           ├── seat-matrix/route.js
│   │           ├── allot-branch/route.js
│   │           └── verify-payment/route.js
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── Sidebar.js
│   │   ├── StepProgress.js
│   │   ├── BranchTable.js
│   │   ├── FileUpload.js
│   │   ├── Modal.js
│   │   └── LoadingSpinner.js
│   └── lib/
│       ├── auth.js
│       └── prisma.js
├── .env.local
├── .gitignore
├── next.config.mjs
├── package.json
├── jsconfig.json
└── README.md
```

---

## Verification Plan

### Automated Tests
1. **Build check**: `npm run build` — ensure zero errors
2. **Dev server**: `npm run dev` — verify all pages load
3. **Database**: `npx prisma db push` + `npx prisma db seed` — verify schema and seed data
4. **Auth flow**: Test registration → login → session persistence
5. **Student flow**: Walk through all 5 steps end-to-end
6. **Admin flow**: Login → dashboard → allot branch → verify payment

### Manual Verification
- Test responsive layout on mobile/tablet/desktop viewports
- Verify Google OAuth flow (requires credentials)
- Check all form validations
- Verify PDF offer letter generation and download
- Test file upload for payment receipts
