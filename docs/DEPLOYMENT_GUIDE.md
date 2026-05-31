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
```

Optional:

```env
RESEND_API_KEY=

TELEGRAM_BOT_TOKEN=

TELEGRAM_CHAT_ID=
```

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

Auto Detect

Output Directory:

Default

Install Command:

npm install

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

Supabase Backups

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
