# Local PostgreSQL Setup

Project: Dien May Nga Son

Purpose:

Document how to use a local PostgreSQL database for development without changing the production database strategy.

This project uses PostgreSQL through Prisma. Local development can point to a local PostgreSQL server, while production can continue using Supabase PostgreSQL or another hosted PostgreSQL provider.

---

# 1. When to Use Local PostgreSQL

Use local PostgreSQL for:

* Day-to-day development
* Testing Prisma migrations before production
* Running seed data locally
* Working without depending on Supabase network access

Do not treat the local database as production data.

Production remains separate and can still use:

* Supabase PostgreSQL
* Another hosted PostgreSQL service

---

# 2. Run PostgreSQL Locally

Install PostgreSQL locally using one of these options:

* PostgreSQL installer for Windows, macOS, or Linux
* Docker Desktop
* A local PostgreSQL package manager installation

Recommended local values:

```text
Host: localhost
Port: 5432
Database: dien_may_nga_son_dev
User: postgres
Password: postgres
```

Create the local database:

```bash
createdb -U postgres dien_may_nga_son_dev
```

If `createdb` is not available, create the database with `psql`:

```bash
psql -U postgres
```

Then run:

```sql
CREATE DATABASE dien_may_nga_son_dev;
```

---

# 3. Optional Docker Setup

If using Docker, start PostgreSQL with:

```bash
docker run --name dien-may-nga-son-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dien_may_nga_son_dev \
  -p 5432:5432 \
  -d postgres:16
```

If the container already exists:

```bash
docker start dien-may-nga-son-postgres
```

---

# 4. Local Environment Variables

Create or update `.env.local` for local development.

Example local PostgreSQL connection strings:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dien_may_nga_son_dev"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/dien_may_nga_son_dev"
```

For local PostgreSQL, `DATABASE_URL` and `DIRECT_URL` can usually be the same direct connection string.

Keep production Supabase values in Vercel environment variables, not in `.env.local`.

---

# 5. Run Prisma Migrations

After setting local `DATABASE_URL` and `DIRECT_URL`, run:

```bash
npx prisma migrate dev
```

This command:

* Reads `prisma/schema.prisma`
* Applies migrations to the local development database
* Creates a new migration if the schema changed
* Regenerates Prisma Client when needed

Do not run `migrate dev` against production.

For production deployments, use:

```bash
npx prisma migrate deploy
```

---

# 6. Seed Local Data

After migrations are applied, seed the local database:

```bash
npx prisma db seed
```

This command should only be used when local seed data is needed for development or testing.

If seed data already exists, check the seed script behavior before rerunning it to avoid duplicate development data.

---

# 7. Environment Strategy

Local development:

* Can use PostgreSQL running on `localhost`
* Uses `.env.local`
* Can safely run `npx prisma migrate dev`
* Can safely run `npx prisma db seed`
* Should not contain production database credentials

Production:

* Can continue using Supabase PostgreSQL
* Can use another hosted PostgreSQL provider if needed
* Uses Vercel environment variables
* Should run `npx prisma migrate deploy` during deployment workflows
* Must not use local development credentials

The Prisma schema does not need to change between local and production because both environments use PostgreSQL.

---

# 8. Production Supabase Support

This local setup does not replace Supabase.

Supabase remains the documented production PostgreSQL option in:

* `docs/DEPLOYMENT_GUIDE.md`
* `docs/TECH_DECISIONS.md`
* `.env.example`

Use Supabase connection strings for production:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
```

Use local connection strings only for local development.

END OF FILE
