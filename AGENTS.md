# AGENTS.md

# Project Overview

Project Name: Điện Máy Nga Sơn

Business Type:

Local Home Appliance Store

Primary Goals:

* Generate leads
* Promote products
* Promote repair services
* Improve local SEO

This is NOT an e-commerce website.

Do NOT implement:

* Shopping Cart
* Checkout
* Payment Gateway
* Customer Account
* Inventory Management
* Shipping Management
* Order Fulfillment

The website acts as:

* Product Catalog
* Service Promotion Platform
* Lead Generation Platform

---

# Business Priorities

Revenue Distribution:

* 70% Air Conditioners
* 20% Repair Services
* 10% Other Appliances

Products:

* Air Conditioners
* TVs
* Refrigerators
* Washing Machines

Services:

* Air Conditioner Repair
* Air Conditioner Maintenance
* Air Conditioner Installation
* Refrigerator Repair
* Washing Machine Repair

Target Customers:

Local Residential Customers (B2C)

Store Size:

1 Local Store

1-3 Admin Users

---

# Technical Stack

Framework:

* Next.js App Router

Language:

* TypeScript

Styling:

* Tailwind CSS

UI Library:

* shadcn/ui

Database:

* PostgreSQL

ORM:

* Prisma

Authentication:

* NextAuth

Storage:

* Cloudinary

Deployment:

* Vercel

---

# Architecture Rules

Follow documentation under:

/docs

Must read before implementation:

1. PRD.md
2. SYSTEM_ARCHITECTURE.md
3. DATABASE_SCHEMA.sql
4. UI_UX_GUIDELINES.md
5. SEO_STRATEGY.md
6. API_SPEC.md

Always follow documented requirements.

Do not invent business logic.

---

# UI Requirements

Design Style:

Combine:

* Điện Máy Xanh
* Modern HVAC Service Websites
* Modern SaaS Visual Design

Avoid:

* Apple Style
* Dark Theme
* Brutalist Design
* Experimental Layouts

Design Goals:

* Trustworthy
* Professional
* Local Business Friendly
* Conversion Focused

---

# Mobile First Rules

Mobile UX has highest priority.

Must support:

* 320px
* 375px
* 390px
* 414px

Must include sticky bottom CTA:

* Call
* Zalo
* Facebook
* Quote

Visible on all mobile pages.

---

# Lead Generation Rules

Every important page must have CTA.

Required CTAs:

* Call Now
* Chat Zalo
* Facebook Message
* Request Quote

Lead Forms:

Name

Phone

Message

Source Page

---

# SEO Rules

Prioritize Local SEO.

Generate:

* Metadata
* OpenGraph
* Twitter Card
* Sitemap
* Robots
* Canonical URL

Implement:

* LocalBusiness Schema
* Product Schema
* Article Schema
* FAQ Schema
* Breadcrumb Schema

Every page must be SEO friendly.

---

# Coding Rules

Always:

* Use TypeScript strict mode
* Use Server Components when possible
* Use Server Actions when appropriate
* Use Zod validation
* Use Prisma for DB access

Never:

* Use any
* Create unused code
* Leave TODO comments
* Create placeholder implementations

Generated code must be production-ready.

---

# Admin System Rules

Admin Features:

* Product Management
* Category Management
* Brand Management
* Service Management
* Blog Management
* Banner Management
* Lead Management
* Settings Management

Admin UI:

* Simple
* Fast
* Functional

No complex enterprise dashboard.

---

# Performance Rules

Target Lighthouse:

Performance > 90

SEO > 95

Accessibility > 90

Best Practices > 90

---

# AI Agent Workflow

Before implementing:

1. Read AGENTS.md
2. Read documentation under /docs
3. Create implementation plan
4. Generate code
5. Verify code quality
6. Verify SEO requirements
7. Verify responsive design

Never skip planning.

END OF FILE
