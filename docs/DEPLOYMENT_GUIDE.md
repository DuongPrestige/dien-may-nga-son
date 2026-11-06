# DEPLOYMENT_GUIDE.md

# Deployment Guide

Project: Điện Máy Nga Sơn

Version: MVP 1.1

---

# 1. Production Architecture

Frontend

* Next.js 15
* Vercel

Backend

* Next.js Server Actions
* Route Handlers

Database

* Supabase PostgreSQL

ORM

* Prisma

Authentication

* NextAuth

Storage

* Cloudinary

Analytics

* Google Analytics 4
* Google Search Console

Monitoring

* Vercel Logs

---

# 2. Required Accounts

Before development prepare:

## Core Services

* GitHub
* Vercel
* Supabase
* Cloudinary

## Analytics

* Google Analytics 4
* Google Search Console

## Optional

* Resend (email)
* Telegram Bot (lead notification)

---

# 3. Environment Variables

Create:

```env
DATABASE_URL=

DIRECT_URL=

NEXTAUTH_SECRET=

NEXTAUTH_URL=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

GOOGLE_ANALYTICS_ID=

GOOGLE_SITE_VERIFICATION=
```

Optional:

```env
RESEND_API_KEY=

TELEGRAM_BOT_TOKEN=

TELEGRAM_CHAT_ID=

ANTHROPIC_API_KEY=
```

## AI SEO Generator (optional)

`ANTHROPIC_API_KEY` enables the "Gợi ý SEO bằng AI" button in the admin project form.

- Leave it empty (or unset) to hide the button completely; nothing else depends on it.
- The key is read only on the server (Server Action), never exposed to the browser.
- Model: `claude-haiku-5-5` via the official `@anthropic-ai/sdk`. It generates SEO title (≤60 chars), meta description (≤155 chars) and excerpt (≤200 chars) from the form's title, location and content. Admins must review before saving.
- Create the key at https://platform.claude.com, then add it in Vercel → Project Settings → Environment Variables (Production + Preview) and redeploy.

## Facebook Import (no configuration)

Admin → Công trình → "Nhập từ Facebook" reads OpenGraph tags of a **public** Facebook post and creates a DRAFT project. It uses the existing Cloudinary variables to re-host the post image (Facebook CDN URLs expire). Private posts or posts behind a login wall cannot be read and must be entered manually.

---

# 4. Supabase Setup

Create:

Project Name:

dien-may-nga-son

Region:

Singapore

Database Password:

Generate secure password

After project creation:

Settings

↓

Database

↓

Connection String

Copy:

DATABASE_URL

DIRECT_URL

Store securely.

---

# 5. Prisma Setup

Generate:

```bash
npx prisma generate
```

Migration:

```bash
npx prisma migrate dev
```

Production Migration:

```bash
npx prisma migrate deploy
```

Seed Data:

```bash
npx prisma db seed
```

---

# 6. Cloudinary Setup

Create folders:

```text
products/

services/

posts/

banners/

settings/
```

Enable:

* Auto Optimization
* Auto Format
* CDN Delivery

Store credentials in .env

---

# 7. Git Workflow

Branches:

```text
main
develop
```

Features:

```text
feature/products

feature/services

feature/blog

feature/admin

feature/seo
```

Workflow:

```text
feature

↓

develop

↓

main

↓

production
```

---

# 8. Vercel Setup

Connect:

GitHub Repository

Framework:

Next.js

Build Command:

Defined in `vercel.json`: `prisma migrate deploy && next build`. Pending migrations are applied with `DIRECT_URL` before every production build.

Region:

`vercel.json` pins functions to `sin1` (Singapore), the same region as Supabase.

Output Directory:

Default

Install Command:

npm install (runs `prisma generate` via `postinstall`)

---

# 9. Production Environment Variables

Configure in:

Vercel

↓

Project Settings

↓

Environment Variables

Add all variables from:

.env

Never commit:

```text
.env

.env.local

.env.production
```

---

# 10. Build Verification

Before every deployment:

```bash
npm run lint

npm run build
```

Must pass:

* No TypeScript Errors
* No ESLint Errors
* No Build Errors

---

# 11. SEO Deployment Checklist

Verify:

Metadata

OpenGraph

Twitter Card

Canonical URLs

JSON-LD

Sitemap

Robots

Required URLs:

```text
/sitemap.xml

/robots.txt
```

---

# 12. Analytics Setup

Install:

Google Analytics 4

Track:

* Page Views
* Phone Clicks
* Zalo Clicks
* Facebook Clicks
* Lead Form Submissions

Custom Events:

```text
phone_click

zalo_click

facebook_click

lead_submit
```

---

# 13. Search Console Setup

Add Property

Verify Domain

Submit:

```text
https://your-domain.com/sitemap.xml
```

Monitor:

* Indexing
* CTR
* Keywords
* Coverage
* Core Web Vitals

---

# 14. Security Checklist

Verify:

Admin Authentication

Role Protection

Input Validation

Rate Limiting

Secure Headers

Environment Variables

Prisma Access Rules

Never expose:

* Database Credentials
* Auth Secret
* Cloudinary Secret

---

# 15. Backup Strategy

Database

Supabase Backups (Pro plan: daily, 7 days)

GitHub Actions: `.github/workflows/db-backup.yml` runs `pg_dump` every day at 02:00 (Vietnam time) and keeps an encrypted copy as a workflow artifact for 30 days. The repository is public (anyone signed in to GitHub can download artifacts), so every dump is encrypted to an OpenPGP **public key**; only the offline private key can decrypt it.

One-time setup on the owner's computer:

```bash
gpg --quick-generate-key "Dien May Nga Son Backup" rsa4096 encrypt never
gpg --armor --export "Dien May Nga Son Backup" > backup-public.asc
gpg --armor --export-secret-keys "Dien May Nga Son Backup" > backup-private.asc
```

Store `backup-private.asc` and its passphrase offline (password manager + USB). Never commit it.

GitHub settings (Settings > Secrets and variables > Actions):

* Secret `BACKUP_DATABASE_URL`: Supabase direct/session connection string (port 5432, not the pgbouncer pooler)
* Variable `BACKUP_GPG_PUBLIC_KEY`: full contents of `backup-public.asc`

Restore:

```bash
gpg --import backup-private.asc
gpg --decrypt dien-may-nga-son-YYYYMMDD-HHMM.dump.gpg > backup.dump
pg_restore --no-owner --no-privileges --clean --if-exists -d "$TARGET_DATABASE_URL" backup.dump
```

Test a restore into a scratch database at least once after setup.

Repository

GitHub

Media

Cloudinary

Export important data monthly.

---

# 16. Monitoring

Track:

Lead Creation Errors

Login Failures

Build Failures

Server Errors

Use:

* Vercel Logs
* Supabase Logs
* Google Analytics

---

# 17. Performance Targets

Target Lighthouse:

Performance > 90

SEO > 95

Accessibility > 90

Best Practices > 90

Core Web Vitals:

LCP < 2.5s

CLS < 0.1

INP < 200ms

---

# 18. Launch Checklist

Before Launch:

* Homepage Complete
* Product Pages Complete
* Service Pages Complete
* Contact Page Complete
* Lead Forms Working
* Admin Working
* SEO Configured
* Analytics Connected
* Search Console Connected
* Mobile Tested
* Lighthouse Audit Passed

---

# 19. Post Launch Plan

Week 1

* Verify Leads
* Verify Forms
* Verify Analytics

Month 1

* Publish 10 Blog Posts
* Review Search Console

Month 2

* Expand Service Landing Pages

Month 3

* Build Local SEO Pages

Examples:

```text
/bac-ninh

/tu-son

/yen-phong

/tien-du
```

---

# 20. Recommended Production Stack

Final Recommended Stack:

```text
Frontend:
Next.js 15

UI:
Tailwind
Shadcn UI

Database:
Supabase PostgreSQL

ORM:
Prisma

Auth:
NextAuth

Storage:
Cloudinary

Hosting:
Vercel

Analytics:
Google Analytics 4

SEO:
Metadata
Schema
Sitemap
Robots
```

END OF FILE
