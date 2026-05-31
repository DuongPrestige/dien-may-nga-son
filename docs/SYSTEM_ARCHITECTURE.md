# SYSTEM_ARCHITECTURE.md

# System Architecture

Project: Điện Máy Nga Sơn

Version: MVP 1.0

---

# 1. Architecture Overview

Architecture Type:

Feature-Based Modular Monolith

Reason:

* Small business project
* Easy maintenance
* Easy AI-assisted development
* Fast deployment
* Low operational cost

This project should remain a modular monolith.

Do NOT use microservices.

---

# 2. Technology Stack

Frontend

* Next.js 15 App Router
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend

* Next.js Route Handlers
* Next.js Server Actions

Database

* PostgreSQL

ORM

* Prisma

Validation

* Zod

Authentication

* NextAuth

File Storage

* Cloudinary

Deployment

* Vercel

Analytics

* Google Analytics 4
* Google Search Console

---

# 3. Application Layers

Presentation Layer

* Pages
* Layouts
* Components

Business Layer

* Services
* Actions
* Business Rules

Data Layer

* Prisma
* PostgreSQL

Infrastructure Layer

* Cloudinary
* Analytics
* External APIs

---

# 4. Project Structure

src/

app/

components/

features/

lib/

actions/

services/

types/

hooks/

validators/

---

# 5. Feature Modules

features/

products/

services/

blog/

leads/

admin/

settings/

auth/

Each feature must contain:

components/

actions/

services/

types/

validators/

---

# 6. Routing Structure

Public Routes

/

/products

/products/[slug]

/services

/services/[slug]

/blog

/blog/[slug]

/promotions

/about

/contact

---

Admin Routes

/admin

/admin/products

/admin/categories

/admin/brands

/admin/services

/admin/posts

/admin/banners

/admin/leads

/admin/settings

/admin/users

---

# 7. Rendering Strategy

Homepage

ISR

Product Pages

ISR

Service Pages

ISR

Blog Pages

ISR

Admin Pages

Dynamic

Reason:

SEO + Performance

---

# 8. Authentication

Roles:

SUPER_ADMIN

ADMIN

Authentication:

NextAuth Credentials Provider

Protected Routes:

All /admin routes

---

# 9. Authorization Rules

SUPER_ADMIN

* Full Access

ADMIN

* CRUD Content
* Manage Leads

ADMIN cannot:

* Delete SUPER_ADMIN
* Change system security settings

---

# 10. Product Architecture

Product

belongs to Category

Product

belongs to Brand

Product

has many Images

Product

has many Specifications

Product

can be Featured

Product

can have SEO metadata

---

# 11. Service Architecture

Service

has content

has SEO metadata

has FAQ

has featured image

has CTA blocks

---

# 12. Blog Architecture

Post

belongs to Category

has SEO metadata

has featured image

has related posts

supports AI-generated content

---

# 13. Lead Architecture

Lead Sources:

PRODUCT

SERVICE

BLOG

CONTACT

PROMOTION

Lead Status:

NEW

CONTACTED

CONVERTED

CLOSED

---

# 14. Lead Flow

Visitor

↓

Product/Service Page

↓

Lead Form

↓

Validation

↓

Database

↓

Admin Dashboard

↓

Store Contact

---

# 15. Form Handling

Use:

Server Actions

Validation:

Zod

Storage:

Database

All forms must:

* Validate
* Sanitize
* Log errors

---

# 16. SEO Architecture

Every page must support:

Title

Description

Keywords

Canonical URL

OpenGraph

Twitter Card

---

Structured Data

LocalBusiness

Product

Article

FAQ

BreadcrumbList

---

# 17. Search Architecture

MVP:

Database Search

Using:

Prisma

contains()

Future:

Meilisearch

---

# 18. Media Architecture

Images stored in:

Cloudinary

Benefits:

* CDN
* Compression
* Responsive Images
* Optimization

---

# 19. Error Handling

Must support:

404

500

Form Errors

Validation Errors

Network Errors

---

# 20. Logging

Track:

Lead Creation

Login Attempts

Form Errors

Server Errors

Use:

Vercel Logs

Console Logs

---

# 21. Security

Use:

Zod Validation

Rate Limiting

Password Hashing

CSRF Protection

XSS Protection

Secure Headers

Environment Variables

Never expose secrets.

---

# 22. Performance Targets

Lighthouse

Performance > 90

SEO > 95

Accessibility > 90

Best Practices > 90

Core Web Vitals:

LCP < 2.5s

CLS < 0.1

INP < 200ms

---

# 23. Mobile First

Required breakpoints:

320px

375px

390px

414px

768px

1024px

1440px

---

# 24. CTA Rules

Mobile:

Sticky Bottom CTA

Desktop:

Sticky Contact Box

CTA Buttons:

Call

Zalo

Facebook

Request Quote

---

# 25. Future Expansion

Future Versions may include:

* Booking System
* CRM Integration
* ERP Integration
* Inventory Management
* Mobile App

Do not implement these in MVP.

END OF FILE
