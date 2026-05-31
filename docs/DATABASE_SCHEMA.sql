-- =====================================================
-- DATABASE_SCHEMA.sql
-- Project: Điện Máy Nga Sơn
-- Version: MVP 1.0
-- PostgreSQL
-- =====================================================

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
email VARCHAR(255) UNIQUE NOT NULL,
password_hash TEXT NOT NULL,

role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',

full_name VARCHAR(255),

is_active BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
```

);

CREATE INDEX idx_users_email
ON users(email);

-- =====================================================
-- CATEGORIES
-- =====================================================

CREATE TABLE categories (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
name VARCHAR(255) NOT NULL,
slug VARCHAR(255) UNIQUE NOT NULL,

description TEXT,

seo_title VARCHAR(255),
seo_description TEXT,

created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
```

);

CREATE INDEX idx_categories_slug
ON categories(slug);

-- =====================================================
-- BRANDS
-- =====================================================

CREATE TABLE brands (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
name VARCHAR(255) NOT NULL,
slug VARCHAR(255) UNIQUE NOT NULL,

logo_url TEXT,

description TEXT,

created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
```

);

CREATE INDEX idx_brands_slug
ON brands(slug);

-- =====================================================
-- PRODUCTS
-- =====================================================

CREATE TABLE products (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
category_id UUID NOT NULL,
brand_id UUID NOT NULL,

name VARCHAR(255) NOT NULL,
slug VARCHAR(255) UNIQUE NOT NULL,

sku VARCHAR(100),

price NUMERIC(14,2) NOT NULL,
sale_price NUMERIC(14,2),

thumbnail_url TEXT,

short_description TEXT,
description TEXT,

is_featured BOOLEAN DEFAULT FALSE,

status VARCHAR(50) DEFAULT 'ACTIVE',

seo_title VARCHAR(255),
seo_description TEXT,

created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),

CONSTRAINT fk_product_category
    FOREIGN KEY(category_id)
    REFERENCES categories(id),

CONSTRAINT fk_product_brand
    FOREIGN KEY(brand_id)
    REFERENCES brands(id)
```

);

CREATE INDEX idx_products_slug
ON products(slug);

CREATE INDEX idx_products_category
ON products(category_id);

CREATE INDEX idx_products_brand
ON products(brand_id);

CREATE INDEX idx_products_featured
ON products(is_featured);

-- =====================================================
-- PRODUCT_IMAGES
-- =====================================================

CREATE TABLE product_images (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
product_id UUID NOT NULL,

image_url TEXT NOT NULL,

sort_order INTEGER DEFAULT 0,

created_at TIMESTAMP DEFAULT NOW(),

CONSTRAINT fk_product_images_product
    FOREIGN KEY(product_id)
    REFERENCES products(id)
    ON DELETE CASCADE
```

);

CREATE INDEX idx_product_images_product
ON product_images(product_id);

-- =====================================================
-- PRODUCT_SPECS
-- =====================================================

CREATE TABLE product_specs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
product_id UUID NOT NULL,

spec_name VARCHAR(255) NOT NULL,
spec_value TEXT NOT NULL,

sort_order INTEGER DEFAULT 0,

CONSTRAINT fk_product_specs_product
    FOREIGN KEY(product_id)
    REFERENCES products(id)
    ON DELETE CASCADE
```

);

CREATE INDEX idx_product_specs_product
ON product_specs(product_id);

-- =====================================================
-- SERVICES
-- =====================================================

CREATE TABLE services (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
name VARCHAR(255) NOT NULL,
slug VARCHAR(255) UNIQUE NOT NULL,

thumbnail_url TEXT,

short_description TEXT,

content TEXT,

is_featured BOOLEAN DEFAULT FALSE,

seo_title VARCHAR(255),
seo_description TEXT,

created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
```

);

CREATE INDEX idx_services_slug
ON services(slug);

-- =====================================================
-- BLOG CATEGORIES
-- =====================================================

CREATE TABLE post_categories (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
name VARCHAR(255) NOT NULL,
slug VARCHAR(255) UNIQUE NOT NULL
```

);

-- =====================================================
-- POSTS
-- =====================================================

CREATE TABLE posts (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
category_id UUID,

title VARCHAR(255) NOT NULL,
slug VARCHAR(255) UNIQUE NOT NULL,

thumbnail_url TEXT,

excerpt TEXT,

content TEXT NOT NULL,

is_published BOOLEAN DEFAULT FALSE,

published_at TIMESTAMP,

seo_title VARCHAR(255),
seo_description TEXT,

created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),

CONSTRAINT fk_post_category
    FOREIGN KEY(category_id)
    REFERENCES post_categories(id)
```

);

CREATE INDEX idx_posts_slug
ON posts(slug);

-- =====================================================
-- BANNERS
-- =====================================================

CREATE TABLE banners (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
title VARCHAR(255) NOT NULL,

image_url TEXT NOT NULL,

target_url TEXT,

position VARCHAR(100),

sort_order INTEGER DEFAULT 0,

is_active BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP DEFAULT NOW()
```

);

-- =====================================================
-- LEADS
-- =====================================================

CREATE TABLE leads (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
name VARCHAR(255) NOT NULL,

phone VARCHAR(50) NOT NULL,

message TEXT,

source_type VARCHAR(50),

source_url TEXT,

product_id UUID,

service_id UUID,

status VARCHAR(50) DEFAULT 'NEW',

created_at TIMESTAMP DEFAULT NOW(),

CONSTRAINT fk_lead_product
    FOREIGN KEY(product_id)
    REFERENCES products(id),

CONSTRAINT fk_lead_service
    FOREIGN KEY(service_id)
    REFERENCES services(id)
```

);

CREATE INDEX idx_leads_phone
ON leads(phone);

CREATE INDEX idx_leads_status
ON leads(status);

-- =====================================================
-- SETTINGS
-- =====================================================

CREATE TABLE settings (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
setting_key VARCHAR(255) UNIQUE NOT NULL,
setting_value TEXT,

created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
```

);

-- =====================================================
-- SEO REDIRECTS
-- =====================================================

CREATE TABLE seo_redirects (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

```
source_path TEXT NOT NULL,
destination_path TEXT NOT NULL,

redirect_type INTEGER DEFAULT 301,

created_at TIMESTAMP DEFAULT NOW()
```

);

-- =====================================================
-- DEFAULT SETTINGS
-- =====================================================

INSERT INTO settings(setting_key, setting_value)
VALUES
('store_name','Điện Máy Nga Sơn'),
('phone',''),
('zalo_url',''),
('facebook_url',''),
('address',''),
('working_hours',''),
('google_map_embed','');

-- =====================================================
-- END OF FILE
-- =====================================================
