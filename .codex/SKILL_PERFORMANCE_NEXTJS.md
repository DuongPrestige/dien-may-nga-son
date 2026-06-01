# SKILL_PERFORMANCE_NEXTJS.md

# Performance Skill for Next.js + Prisma + Supabase

Project: Điện Máy Nga Sơn

Purpose:

Ensure Codex builds fast public pages and avoids unnecessary database queries.

---

# Core Rules

Public pages must be fast.

Admin pages can be dynamic.

Do not make public pages dynamic unless absolutely required.

---

# Route Strategy

Use ISR for public pages:

* Homepage: revalidate = 3600
* Products listing: revalidate = 300
* Product detail: revalidate = 300
* Services listing: revalidate = 3600
* Service detail: revalidate = 3600
* Blog listing: revalidate = 600
* Blog detail: revalidate = 600
* About: revalidate = 3600
* Contact: revalidate = 300

Use dynamic rendering for:

* /admin/*
* login
* mutations
* lead form submissions

---

# Data Loading Rules

Avoid duplicate Prisma queries.

Do not let:

* generateMetadata()
* page render
* schema generation

query the same database row separately.

Use one shared cached loader when possible.

Example:

getCachedProductBySlug(slug)

should be reused by:

* generateMetadata
* page render
* schema helpers

---

# Query Count Rule

Before finishing a public route, count Prisma queries.

Target:

* Listing page: 2-4 queries max
* Detail page: 1-3 queries max
* Static page: 0-1 queries max

Avoid unnecessary:

* count queries
* wide select
* repeated settings queries
* repeated related-item queries

---

# Select Only Needed Fields

Do not use broad includes by default.

Bad:

include everything

Good:

select only fields required by the UI.

For listing cards:

* name
* slug
* price
* salePrice
* thumbnailUrl
* shortDescription
* brand/category name if needed

Do not load heavy detail-only fields on listing pages:

* full description
* all specs
* all gallery images
* long content

---

# Settings Cache Rule

Header, Footer, and MobileStickyCTA must not trigger duplicate settings queries.

Use shared cached settings loader.

Settings should be cached and revalidated when settings are updated.

---

# Static Params Rule

generateStaticParams must be lightweight.

Only select:

* slug

Do not select full records.

Cache slug loaders if possible.

---

# Prisma + Supabase Rules

Avoid heavy Promise.all fan-out with Prisma queries when using Supabase.

Use pooled DATABASE_URL with proper connection config.

For Supabase pooler:

DATABASE_URL should usually include:

pgbouncer=true

If local dev has pool timeout, increase connection_limit carefully.

Avoid connection_limit=1 when pages run multiple queries.

---

# Decimal Serialization Rule

Never call .toNumber() directly in UI/page code.

Prices may become:

* Prisma Decimal
* number
* string
* null
* undefined

Use a safe price helper.

If price is invalid, render:

Liên hệ

---

# Cache Invalidation Rule

When admin changes public content, invalidate relevant cache tags.

Product mutation should invalidate:

* products
* product-detail
* sitemap

Service mutation should invalidate:

* services
* service-detail
* sitemap

Blog mutation should invalidate:

* blog
* blog-detail
* sitemap

Settings mutation should invalidate:

* settings
* contact
* layout

---

# Development Timing Logs

When performance is unclear, add temporary development-only logs.

Only log when:

NODE_ENV === "development"

Measure:

* settings query
* main list query
* detail query
* related query
* static params query
* metadata query

Remove or keep only safe dev-only logs after optimization.

---

# Performance Targets

Public warm cache:

* Listing pages: under 100ms
* Detail pages: under 100ms
* Static pages: under 100ms

Public cold request:

* Prefer under 1s
* Investigate if above 1.5s

Admin pages:

* Accept slower dynamic loading
* Still avoid unnecessary query fan-out

---

# Codex Checklist Before Completing Route Work

Before marking a public route complete:

1. Is this route ISR/static where possible?
2. Is dynamic rendering avoided?
3. Are duplicate DB queries removed?
4. Are metadata and page render using shared cached loaders?
5. Are only needed fields selected?
6. Are settings cached?
7. Are Decimal prices handled safely?
8. Are cache tags invalidated after admin mutations?
9. Does npm run lint pass?
10. Does npm run build pass?

END OF FILE
