# TECH_DECISIONS.md

# Technical Decisions

Project: Điện Máy Nga Sơn

Version: 1.0

Purpose:

Document architectural and technical decisions.

This file exists so AI agents do not change the technology stack or introduce unnecessary complexity.

---

# Decision 001

Use Next.js App Router

Status:

Accepted

Reason:

* Excellent SEO
* Server Components
* Server Actions
* Vercel Native
* Strong AI ecosystem

Alternatives Considered:

* Nuxt
* Remix
* Laravel

Rejected because:

* Smaller ecosystem
* Less aligned with AI coding tools

---

# Decision 002

Use TypeScript Strict Mode

Status:

Accepted

Reason:

* Better maintainability
* Better AI-generated code quality
* Better refactoring

Rule:

Never disable strict mode.

---

# Decision 003

Use Tailwind CSS

Status:

Accepted

Reason:

* Fast development
* Easy design consistency
* Works well with AI agents

Alternatives:

* Bootstrap
* Material UI

Rejected because:

* Less flexible
* Larger design overhead

---

# Decision 004

Use shadcn/ui

Status:

Accepted

Reason:

* Modern components
* Accessible
* Easy customization
* Tailwind native

Rule:

Use shadcn as foundation.

Customize when needed.

---

# Decision 005

Use Supabase PostgreSQL

Status:

Accepted

Reason:

* Managed PostgreSQL
* Dashboard included
* Easy setup
* Suitable for small business
* Scales well

Alternatives:

* Neon
* Railway
* Self-hosted PostgreSQL

Rejected because:

* More operational overhead
* Less convenient for this project

Rule:

Supabase is the single source of truth.

---

# Decision 006

Use Prisma ORM

Status:

Accepted

Reason:

* Type safety
* Excellent DX
* AI-friendly
* Migration support

Rule:

All database access must go through Prisma.

No raw SQL unless necessary.

---

# Decision 007

Use NextAuth

Status:

Accepted

Reason:

* Simple admin authentication
* Stable ecosystem
* Easy integration

Alternatives:

* Supabase Auth
* Clerk
* Auth0

Rejected because:

* Additional complexity
* Additional cost

Rule:

Authentication is admin-only.

No customer accounts.

---

# Decision 008

Use Cloudinary

Status:

Accepted

Reason:

* Image optimization
* CDN
* Compression
* Easy integration

Rule:

Do not store images in database.

Store URLs only.

---

# Decision 009

No E-commerce Checkout

Status:

Accepted

Reason:

Business objective is lead generation.

Not online selling.

Do NOT build:

* Cart
* Checkout
* Payment
* Shipping
* Orders

---

# Decision 010

Lead Generation First

Status:

Accepted

Primary conversion actions:

* Phone
* Zalo
* Facebook
* Quote Form

Rule:

Every important page must contain CTA.

---

# Decision 011

Mobile First

Status:

Accepted

Reason:

Most local traffic is mobile.

Rule:

Design mobile first.

Desktop second.

Required:

Sticky bottom CTA.

---

# Decision 012

SEO First

Status:

Accepted

Reason:

Organic traffic is the primary acquisition channel.

Rule:

Every page must support:

* Metadata
* OpenGraph
* Canonical
* Structured Data

---

# Decision 013

Use ISR

Status:

Accepted

Use ISR for:

* Products
* Services
* Blog

Reason:

Good balance between:

* Performance
* SEO
* Fresh content

---

# Decision 014

Use Feature-Based Architecture

Status:

Accepted

Structure:

features/

products/

services/

blog/

leads/

admin/

settings/

auth/

Reason:

Scalable

AI-friendly

Maintainable

---

# Decision 015

Admin Simplicity

Status:

Accepted

Reason:

Only 1-3 administrators.

Rule:

Avoid enterprise dashboards.

Avoid unnecessary complexity.

---

# Decision 016

Content Strategy

Status:

Accepted

Use:

AI-assisted content generation.

Focus:

* Air conditioners
* Repair services
* Local SEO

Rule:

All AI content must be reviewed before publishing.

---

# Decision 017

Avoid Premature Optimization

Status:

Accepted

Do NOT add:

* Redis
* Queue systems
* Event buses
* Microservices

Until clearly needed.

---

# Decision 018

Security Baseline

Status:

Accepted

Required:

* Zod validation
* Authentication
* Authorization
* Rate limiting
* Secure environment variables

---

# Decision 019

Deployment Strategy

Status:

Accepted

GitHub

↓

Vercel

↓

Production

Use automatic deployment.

---

# Decision 020

MVP Scope Protection

Status:

Accepted

If a feature is not in:

PRD.md

PROJECT_ROADMAP.md

Do not build it.

END OF FILE
