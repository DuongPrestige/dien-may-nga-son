# SKILL_TESTING_CHECKLIST.md

# Testing Checklist Skill

Project: Điện Máy Nga Sơn

Purpose:

Teach AI agents how to verify work before marking a task complete.

---

# Core Rule

A feature is not complete when code is written.

A feature is complete when it is:

* Working
* Validated
* Responsive
* Secure
* SEO-ready if public
* Usable by store admins if admin-related

---

# Required Checks For Every Task

Before marking any task complete, verify:

* TypeScript passes
* ESLint passes
* Build passes
* No unused imports
* No unused variables
* No console errors
* No placeholder code
* No TODO comments
* No fake implementation

---

# Command Checklist

Run when appropriate:

```bash
npm run lint
npm run build
```

If Prisma schema changed:

```bash
npx prisma generate
npx prisma migrate dev
```

---

# Public Page Checklist

For public pages, verify:

* Mobile layout works
* Desktop layout works
* Header works
* Footer works
* Sticky mobile CTA exists
* Metadata exists
* H1 exists
* CTA exists
* Images have alt text
* Loading state exists if data is async
* Empty state exists if data may be empty

---

# Product Page Checklist

Verify:

* Product name visible
* Price visible
* Price notice visible
* Call CTA visible
* Zalo CTA visible
* Facebook CTA visible
* Quote form visible
* Specs visible
* Related products visible
* Product schema exists

---

# Service Page Checklist

Verify:

* H1 includes service intent
* Common problems section exists
* Process section exists
* Trust section exists
* FAQ exists
* CTA appears multiple times
* Local SEO content exists
* FAQ schema exists

---

# Lead Form Checklist

Verify:

* Name required
* Phone required
* Phone format validated
* Message optional
* Source URL saved
* Source type saved
* Success message shown
* Error message shown
* Duplicate submissions prevented
* Rate limiting considered

---

# Admin Checklist

Verify:

* Admin route protected
* CRUD works
* Search works if required
* Pagination works if required
* Validation works
* Delete confirmation exists
* Empty state exists
* Loading state exists
* Error state exists

---

# SEO Checklist

Verify:

* Title exists
* Description exists
* Canonical exists
* OpenGraph exists
* Sitemap includes page
* Robots excludes admin
* Structured data exists where needed

---

# Security Checklist

Verify:

* Input validated with Zod
* Admin mutations require auth
* Secrets not exposed
* No credentials committed
* Public form rate-limited or prepared for rate limiting

---

# Responsive Checklist

Test widths:

* 320px
* 375px
* 390px
* 414px
* 768px
* 1024px
* 1440px

---

# Final Completion Message Format

When finishing a task, report:

* Files changed
* What was implemented
* How it was tested
* Remaining limitations

END OF FILE
