# DEVELOPMENT_RULES.md

# Development Rules

Project: Điện Máy Nga Sơn

Version: MVP 1.0

---

# 1. Core Principle

Build a production-ready local business website.

Do not build unnecessary e-commerce features.

Do not over-engineer.

Do not create placeholder code.

---

# 2. Required Stack

Use:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Prisma
* PostgreSQL
* Zod
* NextAuth
* Cloudinary

---

# 3. Code Quality Rules

Always:

* Write clean TypeScript
* Use strict types
* Validate inputs with Zod
* Keep components small
* Keep business logic out of UI components
* Use meaningful names
* Remove unused code
* Handle errors properly

Never:

* Use `any`
* Leave TODO comments
* Create fake placeholder functions
* Hardcode secrets
* Ignore TypeScript errors
* Ignore ESLint errors

---

# 4. File Organization

Use feature-based structure:

```text
src/features/products
src/features/services
src/features/blog
src/features/leads
src/features/admin
src/features/settings
src/features/auth
```

Each feature may contain:

```text
components
actions
services
types
validators
```

---

# 5. Component Rules

Prefer:

* Server Components by default
* Client Components only when needed
* Reusable UI components
* Composition over large components

Client Components are allowed for:

* Forms
* Modals
* Dropdowns
* Search
* Filters
* Interactive admin tables

---

# 6. Form Rules

All forms must:

* Use Zod validation
* Show validation errors
* Show loading state
* Show success state
* Prevent duplicate submissions
* Sanitize input

Lead forms must require:

* Name
* Phone

---

# 7. Database Rules

Use Prisma for database access.

Never query database directly from UI components.

Create service functions for data access.

Example:

```text
products.service.ts
leads.service.ts
settings.service.ts
```

---

# 8. SEO Rules

Every public page must have:

* Metadata
* Canonical URL
* OpenGraph data

Important pages must have:

* JSON-LD schema
* FAQ section
* Internal links

---

# 9. Admin Rules

Admin must be simple.

No complex enterprise dashboard.

Admin CRUD must include:

* Create
* Read
* Update
* Delete
* Search
* Filter
* Pagination

Deletion should use confirmation.

---

# 10. Lead Rules

Lead creation must store:

* Name
* Phone
* Message
* Source URL
* Source Type
* Product ID if any
* Service ID if any

Lead status:

* NEW
* CONTACTED
* CONVERTED
* CLOSED

---

# 11. UI Rules

Follow:

docs/UI_UX_GUIDELINES.md

Mobile-first.

Sticky mobile CTA is required.

No auto-playing sliders.

No intrusive popups.

---

# 12. Security Rules

Required:

* Password hashing
* Input validation
* Rate limiting
* Protected admin routes
* Environment variables
* Secure headers

Never expose:

* Database URL
* Auth secret
* Cloudinary credentials

---

# 13. Performance Rules

Use:

* next/image
* Lazy loading
* Static generation where possible
* ISR for public content

Avoid:

* Heavy client-side JS
* Unnecessary animation libraries
* Large image files
* Unoptimized third-party scripts

---

# 14. Testing Checklist

Before completing any feature:

* TypeScript passes
* ESLint passes
* Page renders on mobile
* Form validation works
* Empty states exist
* Error states exist
* Loading states exist
* SEO metadata exists where needed

---

# 15. Prohibited Features in MVP

Do not implement:

* Cart
* Checkout
* Payment
* Shipping
* Customer login
* Product inventory tracking
* Multi-store management
* ERP
* Booking calendar

---

# 16. AI Agent Output Rules

When coding:

* Explain plan first
* Modify files intentionally
* Do not rewrite unrelated files
* Do not delete existing working code
* Do not create duplicate components
* Do not invent new architecture
* Follow existing docs strictly

END OF FILE
