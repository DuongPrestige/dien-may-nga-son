# Vercel Deploy Checklist

Project: Dien May Nga Son

Use this checklist before deploying the production website to Vercel.

---

## 1. Vercel Setup

- Create or select the Vercel project.
- Connect the GitHub repository.
- Framework preset: Next.js.
- Root directory: repository root.
- Output directory: default.
- Install command:

```bash
npm install
```

- Build command:

```bash
npm run build
```

- Production branch: `main` or the branch selected for launch.

---

## 2. Supabase Environment Variables

Configure these in Vercel Project Settings -> Environment Variables:

```env
DATABASE_URL=
DIRECT_URL=
```

Use the Supabase PostgreSQL connection strings:

- `DATABASE_URL`: pooled connection string, usually port `6543`.
- `DIRECT_URL`: direct connection string, usually port `5432`.

Do not commit real Supabase credentials to Git.

---

## 3. Required Environment Variables

Configure all required production variables in Vercel:

```env
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_SITE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_ANALYTICS_ID=
```

Recommended production values:

```env
NEXTAUTH_URL=https://dienmayngason.vn
NEXT_PUBLIC_SITE_URL=https://dienmayngason.vn
```

Optional variables:

```env
RESEND_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

---

## 4. Database Preparation

Before launch:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

Verify seed data exists:

- Store settings
- Product categories
- Brands
- Services
- Blog categories

Do not create fake products or fake posts for production.

---

## 5. Production Checklist

- `npm run lint` passes locally.
- `npm run build` passes locally.
- Vercel build succeeds.
- Production environment variables are set for Production, not only Preview.
- Supabase database is reachable from Vercel.
- Cloudinary credentials are valid.
- `NEXT_PUBLIC_SITE_URL` matches the final production domain.
- `NEXTAUTH_URL` matches the final production domain.
- No `.env`, `.env.local`, or `.env.production` file is committed.
- Mobile sticky CTA appears on public pages.
- Header and footer render contact information safely.

---

## 6. SEO Verification Checklist

Verify these URLs after deployment:

```text
/robots.txt
/sitemap.xml
/manifest.webmanifest
```

Check:

- `robots.txt` allows public pages.
- `robots.txt` disallows `/admin`, `/admin/*`, and `/api/*`.
- `robots.txt` references the production sitemap.
- `sitemap.xml` uses `NEXT_PUBLIC_SITE_URL`.
- Sitemap includes homepage, about, contact, products, services, blog, and published detail pages.
- Canonical URLs use the production domain.
- OpenGraph metadata exists on public pages.
- Twitter metadata exists on public pages.
- JSON-LD renders where expected:
  - LocalBusiness
  - Product
  - Article
  - FAQPage
  - BreadcrumbList
- Submit `https://dienmayngason.vn/sitemap.xml` to Google Search Console.

---

## 7. Lead Form Verification Checklist

Test lead submission on:

- Homepage quote form
- Product detail page
- Service detail page
- Blog detail page
- Contact page

Verify:

- Required name validation works.
- Vietnamese phone validation works.
- Success message displays after submission.
- Duplicate submissions are prevented while submitting.
- Lead records are created in Supabase.
- `sourceType` is correct:
  - `HOME`
  - `PRODUCT`
  - `SERVICE`
  - `BLOG`
  - `CONTACT`
- `sourceUrl` stores the current public page path.
- `productId` is stored for product leads.
- `serviceId` is stored for service leads.

---

## 8. Post-Deployment Checks

- Open the site on mobile widths: 320px, 375px, 390px, 414px.
- Test phone CTA links.
- Test Zalo links.
- Test Facebook links.
- Verify missing settings do not crash the UI.
- Check Vercel logs for server errors.
- Check Supabase logs for failed database queries.
- Run a Lighthouse check for Performance, SEO, Accessibility, and Best Practices.

END OF FILE
