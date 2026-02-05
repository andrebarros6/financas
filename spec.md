# Product Specification: Freelancer Receipt Dashboard (Portugal)

## Overview

A web application for Portuguese independent workers (trabalhadores independentes) to visualize and analyze their receipt data exported from the AT (Autoridade Tributária) portal. Users upload their SIRE CSV files and see interactive dashboards showing income evolution by month and client.

---

## Target Market

- **Primary**: Portuguese freelancers who issue "recibos verdes" (green receipts)
- **Pain point**: No easy way to visualize income trends from the AT portal's raw CSV exports
- **Language**: Portuguese only (MVP)

---

## Tech Stack

| Layer | Technology | Cost |
|-------|------------|------|
| Frontend | Next.js (React + TypeScript) | Free |
| Styling | Tailwind CSS | Free |
| Charts | Chart.js | Free |
| Database | PostgreSQL via Supabase | Free tier (500MB, 50K users) |
| Authentication | Email + Social via Supabase Auth | Free tier |
| Payments | Stripe | Pay-per-use (2.9% + €0.25/tx) |
| Analytics | Google Analytics | Free |
| Hosting | Vercel | Free tier (100GB bandwidth) |

**MVP Cost: €0/month** (only pay Stripe fees when revenue comes in)

---

## Data Model

### CSV Structure (from AT Portal - SIRE Export)
The SIRE CSV contains 20 fields (semicolon-separated, Portuguese headers, European decimal format):

**Document Identification:**
- `Referência` - Receipt reference number (e.g., "FR ATSIRE01FR/70")
- `Tipo Documento` - Document type (Fatura-Recibo, Fatura)
- `ATCUD` - Unique AT code (used for deduplication)
- `Situação` - Status (Emitido/Anulado - filter out Anulado)

**Dates:**
- `Data da Transação` - Transaction date (YYYY-MM-DD)
- `Motivo Emissão` - Reason for issuance
- `Data de Emissão` - Issue date (YYYY-MM-DD)

**Client Information:**
- `País do Adquirente` - Client country (e.g., "PORTUGAL")
- `NIF Adquirente` - Client tax ID (9-digit number)
- `Nome do Adquirente` - Client name

**Financial Values (in euros, European decimal format: 1.391,61):**
- `Valor Tributável (em euros)` - Taxable amount
- `Valor do IVA (em euros)` - VAT amount
- `Imposto do Selo como Retenção na Fonte` - Stamp tax as withholding
- `Valor do Imposto do Selo (em euros)` - Stamp tax value
- `Valor do IRS (em euros)` - IRS withholding
- `Total de Impostos (em euros)` - Total taxes
- `Total com Impostos (em euros)` - Subtotal with taxes
- `Total de Retenções na Fonte (em euros)` - Total withholdings
- `Contribuição Cultura (em euros)` - Culture contribution
- `Total do Documento (em euros)` - Final document total

**Important Notes:**
- File uses UTF-8 encoding with BOM character at start
- Semicolon (;) delimiter
- European decimal format: dots for thousands, comma for decimals (e.g., "1.391,61" = 1391.61)
- Empty values represented as missing between semicolons (;;)

### Database Schema

```sql
-- Users (managed by Supabase Auth)
users (
  id UUID PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP,
  subscription_tier TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMP
)

-- Receipts (all 20 columns from SIRE CSV)
receipts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),

  -- Document identification
  referencia TEXT NOT NULL,
  tipo_documento TEXT NOT NULL,
  atcud TEXT NOT NULL,
  situacao TEXT NOT NULL,

  -- Dates
  data_transacao DATE NOT NULL,
  motivo_emissao TEXT,
  data_emissao DATE NOT NULL,

  -- Client info
  pais_adquirente TEXT,
  nif_adquirente TEXT NOT NULL,
  nome_adquirente TEXT NOT NULL,

  -- Financial values (all in euros)
  valor_tributavel DECIMAL(12,2) NOT NULL,
  valor_iva DECIMAL(12,2) DEFAULT 0,
  imposto_selo_retencao DECIMAL(12,2),
  valor_imposto_selo DECIMAL(12,2) DEFAULT 0,
  valor_irs DECIMAL(12,2) DEFAULT 0,
  total_impostos DECIMAL(12,2),
  total_com_impostos DECIMAL(12,2) NOT NULL,
  total_retencoes DECIMAL(12,2) DEFAULT 0,
  contribuicao_cultura DECIMAL(12,2) DEFAULT 0,
  total_documento DECIMAL(12,2) NOT NULL,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Prevent duplicates per user
  UNIQUE(user_id, atcud)
)

-- Waiting list for pre-launch signups
waitlist (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  notified_at TIMESTAMP  -- NULL until launch email sent
)
```

---

## Features

### Free Tier "Explorador" (€0/mês)

**Limit: 1 year of data (current year only)**

1. **SIRE CSV Import**
   - Drag-and-drop or click to import SIRE CSV file from AT Portal
   - Parse and validate 20-column CSV format
   - Handle European decimal format (1.391,61 → 1391.61)
   - Handle UTF-8 BOM character at file start
   - Detect and skip duplicate receipts (by ATCUD)
   - Filter out cancelled receipts (Situação: Anulado)
   - **Restriction**: Only receipts from a single calendar year allowed

2. **Monthly Income Chart**
   - Bar chart showing total income per month
   - Current year data
   - Interactive tooltips with exact values

3. **Income by Client Chart**
   - Horizontal bar chart showing total per client
   - Sorted by total amount (descending)

4. **View Receipts**
   - View imported receipts in a table
   - **No editing or deleting** (view-only)

5. **User Account**
   - Email/password or Social login (Google/GitHub)
   - Data persisted in cloud
   - Manual data deletion option

### Premium Tier "Pro" (€2.99/mês) - MVP

**Unlocks: Unlimited years + full features**
**7-day opt-in trial** (no credit card required)

1. **Multi-Year Analysis**
   - Upload unlimited years of data
   - Year-over-year comparison charts
   - Growth trends visualization

2. **Edit & Delete Receipts**
   - Edit client name or amounts (corrections)
   - Delete individual receipts

3. **Client Insights**
   - Per-client detailed view
   - Payment frequency analysis
   - Top clients ranking over time

4. **Export to PDF/Excel**
   - Download monthly/yearly summaries
   - Client breakdown reports
   - Formatted for accountant sharing

### Post-MVP: Three Tiers with Decoy Pricing

When validated, restructure to three tiers:

**Free "Explorador"** (€0/mês)
- Same as MVP (1 year, view-only)

**Pro "Profissional"** (€2.99/mês) - DECOY 🎯
- Up to 3 years of data
- Edit & delete receipts
- Export PDF only (no Excel)
- Basic year-over-year comparison
- Basic client insights

**Premium "Completo"** (€4.99/mês) ⭐ MAIS POPULAR
- Unlimited years
- Edit & delete receipts
- Export PDF + Excel
- Full multi-year comparisons
- Advanced client insights
- Priority support

This makes Premium (€4.99) feel like obvious value for only €2 more than Pro.

---

## User Experience

### Landing Page
- Hero section with demo dashboard using sample data
- "See how it works" - interactive preview with fake receipts
- Clear CTA: "Importar Ficheiro SIRE" / "Comece Grátis"
- Trust indicators: "Your data stays private", "Portuguese company"
- Pricing section showing Free vs Premium

### Design Style
- Clean/minimal aesthetic (inspired by Notion)
- White background, subtle shadows
- Primary color: Professional blue or green (recibos verdes reference)
- Typography: Inter or similar clean sans-serif
- Cards for grouping related information
- Generous whitespace

### Responsiveness
- Desktop-first design
- Basic mobile support (functional but not optimized)
- Key flows work on tablet

---

## Authentication Flow

**Methods supported:**
- Email/password (traditional signup)
- Social login: Google only (simplified for MVP)

**Flow:**
1. User lands on homepage
2. Clicks "Comece Grátis" / "Importar Ficheiro SIRE"
3. Sign up/in options: Email or Google
4. Email signup requires email verification
5. After auth, redirected to dashboard
6. First-time users see empty state with upload prompt

**Rationale**: Email/password ensures users with any email provider (Hotmail, Yahoo, corporate) can sign up. Social login reduces friction for those who prefer it.

---

## Monetization

### MVP Pricing (Two Tiers)
- **Free "Explorador"** (€0/mês): 1 year of data, basic charts (monthly + client), view-only receipts
- **Premium "Pro"** (€2.99/mês): Unlimited years, edit/delete receipts, multi-year comparisons, exports, client insights

**Pricing Psychology**:
- Below €5 psychological barrier
- ~1 coffee/month value proposition

**7-day opt-in trial**: Triggered when free user tries a premium feature (upload year 2, edit receipt, export)

**Conversion triggers**:
- Upload data from a second year → upgrade prompt
- Try to edit/delete a receipt → upgrade prompt
- Try to export → upgrade prompt

### Post-MVP Pricing (Three Tiers with Decoy)
Add third tier to make €4.99 Premium feel like obvious value:
- **Free "Explorador"** (€0/mês): Same as MVP
- **Pro "Profissional"** (€2.99/mês): Limited features (3 years max, PDF only, basic insights)
- **Premium "Completo"** (€4.99/mês): Full features, "MAIS POPULAR" badge

### Early Adopter Program
- **First 10 users**: Lifetime premium access for free
- **In exchange for**: Feedback sessions, bug reports, testimonial/review
- **Implementation**: Manual flag in database (`is_founding_member: true`)
- **Display**: "Founding Member" badge in their account

### Stripe Integration
- Subscription management via Stripe Customer Portal
- Webhook handlers for subscription events
- Grace period for failed payments
- Cancel anytime

---

## Privacy & Data

- Data stored in EU (Supabase EU region)
- Users can delete all their data from settings
- No data sharing with third parties
- HTTPS everywhere
- Row-level security in Supabase (users only see their data)

---

## MVP Scope

### In Scope
- [ ] Landing page with demo
- [ ] Email/password + Google login
- [ ] CSV upload and parsing
- [ ] Monthly income bar chart
- [ ] Income by client bar chart
- [ ] Receipt table with edit capability
- [ ] User settings (delete data)
- [ ] Stripe subscription for premium
- [ ] Basic free/premium feature gating

### Out of Scope (Future)
- Manual receipt entry (only edit existing)
- Tax estimation/projections
- Mobile app
- Multi-language support
- Blog/educational content
- Email notifications
- API access

---

## Implementation Plan

**Development approach**: Feature-by-feature with validation testing after each feature.

### Phase 1: Foundation
1. Set up Next.js project with TypeScript
   - **Test**: App runs locally, displays welcome page
2. Configure Supabase (database + auth)
   - **Test**: Can connect to Supabase from app
3. Create database schema
   - **Test**: Tables created, can insert/query test data
4. Implement login flow (email + Google)
   - **Test**: Can sign up, login, logout with email and Google

### Phase 2: Core Features
1. Build CSV parser for SIRE format
   - **Test**: Parse sample CSV, verify all fields extracted correctly
2. Create upload interface with drag-and-drop
   - **Test**: Upload CSV, see parsed data preview
3. Implement receipt storage and retrieval
   - **Test**: Upload saves to DB, refresh shows saved data
4. Build Chart.js visualizations (monthly + client)
   - **Test**: Charts render with real uploaded data

### Phase 3: Polish & Premium
1. Add receipt editing functionality
   - **Test**: Edit a receipt, verify change persists
2. Implement Stripe integration
   - **Test**: Complete test subscription flow
3. Build premium features (multi-year, exports)
   - **Test**: Free user blocked from 2nd year, premium user allowed
4. Create landing page with demo
   - **Test**: Demo loads with sample data, CTA links work

### Phase 4: Launch
1. Add Google Analytics
   - **Test**: Verify events tracked in GA dashboard
2. Set up error monitoring
3. Deploy to production
   - **Test**: Full user flow works on production URL
4. Beta testing with real users

### Design Decision Point
Before building the dashboard UI (Phase 2, step 4), user will be asked:
- **Option A**: Provide a mockup (from Mokup.ai, Figma, or manual sketch)
- **Option B**: Let developer design based on spec (Notion-style, clean/minimal)

---

## Code Standards & Best Practices

### General Principles
- **Readability over cleverness**: Code should be self-explanatory
- **Single Responsibility**: Each function/component does one thing well
- **DRY (Don't Repeat Yourself)**: Extract reusable logic into utilities
- **Fail fast**: Validate inputs early, handle errors explicitly

### TypeScript
- Strict mode enabled (`strict: true` in tsconfig)
- Explicit return types on functions
- Interface over type for object shapes
- No `any` - use `unknown` if type is truly unknown
- Descriptive variable names (no single letters except loops)

### React/Next.js
- Functional components only (no class components)
- Custom hooks for reusable logic (`useReceipts`, `useAuth`)
- Colocation: keep related files together (component + styles + tests)
- Server components by default, client components only when needed
- Loading and error states for all async operations

### File & Folder Naming
- Components: PascalCase (`MonthlyIncomeChart.tsx`)
- Utilities/hooks: camelCase (`useAuth.ts`, `csvParser.ts`)
- Folders: kebab-case (`/components/charts/`)
- One component per file

### Code Organization
```typescript
// 1. Imports (external, then internal, then types)
import { useState } from 'react'
import { Button } from '@/components/ui'
import type { Receipt } from '@/types'

// 2. Types/Interfaces (if not in separate file)
interface Props {
  receipts: Receipt[]
  onSelect: (id: string) => void
}

// 3. Component
export function ReceiptList({ receipts, onSelect }: Props) {
  // 3a. Hooks
  const [selected, setSelected] = useState<string | null>(null)

  // 3b. Derived state / computations
  const sortedReceipts = receipts.sort((a, b) => ...)

  // 3c. Event handlers
  const handleClick = (id: string) => {
    setSelected(id)
    onSelect(id)
  }

  // 3d. Render
  return (...)
}
```

### Comments
- No obvious comments (`// increment counter` on `counter++`)
- Document "why", not "what"
- JSDoc for exported functions with complex parameters
- TODO comments include context: `// TODO(auth): Add rate limiting after MVP`

### Error Handling
- User-facing errors in Portuguese
- Technical errors logged to console (dev) / error service (prod)
- Never swallow errors silently
- Graceful degradation when possible

### Testing Philosophy
- Test behavior, not implementation
- Each feature has at least one integration test
- Critical paths (auth, payments) have comprehensive tests

---

## File Structure (Proposed)

```
/app
  /page.tsx                 # Landing page
  /dashboard
    /page.tsx               # Main dashboard
    /upload/page.tsx        # Upload flow
    /settings/page.tsx      # User settings
  /api
    /webhooks/stripe        # Stripe webhooks
/components
  /charts
    /MonthlyIncomeChart.tsx
    /ClientIncomeChart.tsx
  /upload
    /CsvUploader.tsx
    /CsvParser.ts
  /receipts
    /ReceiptTable.tsx
    /ReceiptEditModal.tsx
  /ui                       # Shared UI components
/lib
  /supabase.ts              # Supabase client
  /stripe.ts                # Stripe helpers
  /csv-parser.ts            # CSV parsing logic
/types
  /receipt.ts               # TypeScript types
```

---

## Success Metrics

### Key Metrics
| Metric | Definition | Target |
|--------|------------|--------|
| **Active Users** | Users who logged in within last 30 days | Track growth |
| **Activation** | % of signups who upload at least 1 CSV | > 50% |
| **Retention** | % of users returning after 30 days | > 40% |
| **Conversion** | Free to paid conversion rate | > 5% |
| **Revenue** | Monthly Recurring Revenue (MRR) | Growth |

### Analytics Strategy

**MVP: Google Analytics only**
- Track: Page views, signups, uploads, subscription conversions
- Custom events: `signup`, `csv_upload`, `subscription_start`
- Goals: Upload completion, subscription purchase

**After 100 paying users: Add Mixpanel**
- User-level tracking (who did what, when)
- Retention cohorts (are Jan users still active in March?)
- Funnel analysis (signup → upload → subscribe drop-offs)
- Feature usage (which charts are viewed most?)

### Events to Track (GA4)
```
signup_start        - User clicks signup button
signup_complete     - User completes registration
csv_upload_start    - User initiates upload
csv_upload_success  - CSV parsed successfully
csv_upload_error    - CSV parsing failed
dashboard_view      - User views dashboard
upgrade_prompt_view - User sees upgrade modal
subscription_start  - User subscribes to premium
subscription_cancel - User cancels subscription
```

---

## Open Questions

1. **Product name** - To be decided
2. **Exact premium feature boundaries** - May adjust based on user feedback
3. **Marketing strategy** - How to reach Portuguese freelancers

---

## Summary

| Aspect | Decision |
|--------|----------|
| Frontend | Next.js + TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Email/password + Social (Google/GitHub) |
| Charts | Chart.js |
| Monetization | Freemium (€2.99/month MVP, €4.99/month post-MVP) |
| Payments | Stripe |
| Analytics | Google Analytics |
| Language | Portuguese only |
| Design | Clean/minimal (Notion-style) |
| Mobile | Desktop-first |
| Hosting | Vercel + Supabase (both free tier) |
