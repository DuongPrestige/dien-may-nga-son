# ADMIN_REQUIREMENTS.md

# Admin Requirements

Project: Điện Máy Nga Sơn

Version: MVP 1.0

---

# 1. Admin Purpose

The admin system is for 1-3 store administrators.

Primary purpose:

* Manage website content
* Manage products
* Manage services
* Manage blog posts
* Manage leads
* Manage store settings

This is not an enterprise admin system.

Keep it simple, fast, and easy to use.

---

# 2. Admin Users

Roles:

SUPER_ADMIN

ADMIN

SUPER_ADMIN can:

* Manage everything
* Manage users

ADMIN can:

* Manage content
* Manage products
* Manage leads
* Manage settings

ADMIN cannot:

* Delete SUPER_ADMIN
* Change security-sensitive settings

---

# 3. Admin Routes

Required routes:

```text
/admin
/admin/login
/admin/products
/admin/categories
/admin/brands
/admin/services
/admin/posts
/admin/banners
/admin/leads
/admin/settings
/admin/users
```

---

# 4. Dashboard

Dashboard should show:

* Total products
* Total services
* Total blog posts
* Total leads
* New leads
* Recent leads
* Featured products
* Quick actions

Quick actions:

* Add product
* Add service
* Add blog post
* View leads

---

# 5. Product Management

Admin should support:

* List products
* Search products
* Filter by category
* Filter by brand
* Filter by status
* Create product
* Edit product
* Delete product
* Mark featured
* Upload thumbnail
* Upload gallery images
* Manage specifications

Product fields:

* Name
* Slug
* Category
* Brand
* SKU
* Price
* Sale price
* Thumbnail
* Gallery
* Short description
* Description
* Specifications
* Featured
* Status
* SEO title
* SEO description

---

# 6. Category Management

Admin should support:

* List categories
* Create category
* Edit category
* Delete category

Fields:

* Name
* Slug
* Description
* SEO title
* SEO description

---

# 7. Brand Management

Admin should support:

* List brands
* Create brand
* Edit brand
* Delete brand
* Upload logo

Fields:

* Name
* Slug
* Logo
* Description

---

# 8. Service Management

Admin should support:

* List services
* Create service
* Edit service
* Delete service
* Mark featured

Fields:

* Name
* Slug
* Thumbnail
* Short description
* Content
* Featured
* SEO title
* SEO description

---

# 9. Blog Management

Admin should support:

* List blog posts
* Search posts
* Filter by status
* Create post
* Edit post
* Delete post
* Publish/unpublish post

Fields:

* Title
* Slug
* Category
* Thumbnail
* Excerpt
* Content
* Published status
* Published date
* SEO title
* SEO description

---

# 10. Banner Management

Admin should support:

* List banners
* Create banner
* Edit banner
* Delete banner
* Enable/disable banner
* Sort banners

Fields:

* Title
* Image
* Target URL
* Position
* Sort order
* Active status

---

# 11. Lead Management

Admin should support:

* List leads
* Search by phone/name
* Filter by status
* Filter by source type
* View lead detail
* Update status
* Delete lead

Lead fields:

* Name
* Phone
* Message
* Source type
* Source URL
* Product interested
* Service interested
* Status
* Created date

Lead statuses:

* NEW
* CONTACTED
* CONVERTED
* CLOSED

---

# 12. Settings Management

Admin should manage:

* Store name
* Logo
* Favicon
* Phone
* Zalo URL
* Facebook URL
* Address
* Working hours
* Google Maps embed
* Default SEO title
* Default SEO description

---

# 13. User Management

SUPER_ADMIN only.

Admin should support:

* List users
* Create user
* Edit user
* Disable user
* Change role

Do not allow deleting the last SUPER_ADMIN.

---

# 14. Admin UI Rules

Admin UI must be:

* Simple
* Clear
* Fast
* Mobile usable
* Desktop optimized

Use:

* Tables
* Forms
* Filters
* Search
* Pagination
* Confirmation dialogs

Avoid:

* Complex charts
* Enterprise analytics
* Fancy animations

---

# 15. CRUD Rules

Every CRUD page should have:

* List view
* Create button
* Edit action
* Delete action
* Search if needed
* Empty state
* Loading state
* Error state

---

# 16. Safety Rules

Before delete:

Show confirmation.

For important data:

Prefer soft delete if simple.

For MVP:

Hard delete is acceptable except users.

---

# 17. Admin Completion Criteria

Admin is complete when:

* Store owner can manage all products
* Store owner can manage all services
* Store owner can publish blog posts
* Store owner can update contact information
* Store owner can view and update leads

END OF FILE
