# SKILL_ADMIN_CMS.md

# Admin CMS Skill

Project: Điện Máy Nga Sơn

Purpose:

Teach AI agents how to build the admin system.

This admin panel is for a local business.

Not an enterprise application.

---

# Admin Philosophy

Users:

1-3 Administrators

Goals:

* Manage products
* Manage services
* Manage blog content
* Manage leads
* Manage store settings

Keep everything simple.

---

# Admin Design Principles

Must be:

* Fast
* Simple
* Easy to learn
* Easy to maintain

Avoid:

* Complex analytics
* Enterprise dashboards
* Advanced reporting
* Unnecessary charts

---

# Navigation Structure

Dashboard

Products

Categories

Brands

Services

Posts

Banners

Leads

Settings

Users

---

# Dashboard Rules

Dashboard should display:

* Total Products
* Total Services
* Total Blog Posts
* Total Leads
* New Leads
* Recent Leads

Quick Actions:

* Add Product
* Add Service
* Add Post
* View Leads

---

# Product Management

Required Features:

* List
* Search
* Filter
* Create
* Edit
* Delete

Fields:

* Name
* Slug
* Category
* Brand
* SKU
* Price
* Sale Price
* Thumbnail
* Gallery
* Short Description
* Description
* Specifications
* Featured
* Status
* SEO Title
* SEO Description

---

# Category Management

Required Features:

* List
* Create
* Edit
* Delete

Fields:

* Name
* Slug
* Description
* SEO Title
* SEO Description

---

# Brand Management

Required Features:

* List
* Create
* Edit
* Delete

Fields:

* Name
* Slug
* Logo
* Description

---

# Service Management

Required Features:

* List
* Search
* Create
* Edit
* Delete

Fields:

* Name
* Slug
* Thumbnail
* Short Description
* Content
* Featured
* SEO Title
* SEO Description

---

# Blog Management

Required Features:

* List
* Search
* Create
* Edit
* Delete
* Publish

Fields:

* Title
* Slug
* Category
* Thumbnail
* Excerpt
* Content
* Published
* SEO Title
* SEO Description

---

# Banner Management

Required Features:

* List
* Create
* Edit
* Delete
* Sort

Fields:

* Title
* Image
* URL
* Position
* Sort Order
* Active

---

# Lead Management

This is one of the most important modules.

Required Features:

* List Leads
* Search Leads
* Filter Leads
* View Lead
* Update Status
* Delete Lead

Display:

* Name
* Phone
* Source
* Status
* Created Date

---

# Lead Status

NEW

CONTACTED

CONVERTED

CLOSED

---

# Settings Management

Store Settings:

* Store Name
* Logo
* Favicon
* Phone
* Zalo URL
* Facebook URL
* Address
* Working Hours
* Google Maps Embed

SEO Settings:

* Default SEO Title
* Default SEO Description

---

# User Management

SUPER_ADMIN only.

Required Features:

* List Users
* Create User
* Edit User
* Disable User

Never allow deletion of last SUPER_ADMIN.

---

# Table Rules

All list pages should support:

* Search
* Pagination
* Sorting
* Empty State
* Loading State

---

# Form Rules

Forms must include:

* Validation
* Error Messages
* Success Messages

Never submit invalid data.

---

# Delete Rules

Before delete:

Show confirmation dialog.

Example:

"Bạn có chắc chắn muốn xóa mục này?"

---

# Mobile Admin

Admin is desktop-first.

Mobile support is optional.

Tablet support should work.

---

# Performance Rules

Admin should load quickly.

Avoid:

* Heavy charts
* Complex dashboards
* Excessive API calls

---

# Success Criteria

Store owner should be able to:

* Manage all products
* Manage all services
* Manage all blog posts
* Manage all leads
* Manage all settings

Without developer assistance.

END OF FILE
