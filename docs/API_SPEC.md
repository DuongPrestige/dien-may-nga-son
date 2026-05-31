# API_SPEC.md

# API Specification

Project: Điện Máy Nga Sơn

Version: MVP 1.0

---

# 1. API Principles

Use:

* Next.js Route Handlers
* Server Actions
* TypeScript
* Zod validation
* Prisma services

Prefer Server Actions for:

* Forms
* Admin mutations
* Lead submission

Use Route Handlers for:

* Public APIs
* Upload callbacks
* Webhooks if needed

---

# 2. Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

# 3. Lead APIs

## Create Lead

Action:

```text
createLeadAction
```

Input:

```json
{
  "name": "Nguyen Van A",
  "phone": "0900000000",
  "message": "Tôi muốn tư vấn điều hòa",
  "sourceType": "PRODUCT",
  "sourceUrl": "/products/dieu-hoa-daikin",
  "productId": null,
  "serviceId": null
}
```

Validation:

* name required
* phone required
* phone must be valid Vietnamese phone format
* message optional

Output:

```json
{
  "success": true,
  "message": "Gửi yêu cầu thành công"
}
```

---

# 4. Product APIs / Actions

## Get Products

Function:

```text
getProducts
```

Filters:

```json
{
  "category": "dieu-hoa",
  "brand": "daikin",
  "minPrice": 0,
  "maxPrice": 20000000,
  "sort": "latest",
  "page": 1,
  "limit": 12
}
```

## Get Product By Slug

Function:

```text
getProductBySlug
```

Input:

```text
slug
```

## Create Product

Admin Action:

```text
createProductAction
```

Required fields:

* name
* slug
* categoryId
* brandId
* price

Optional fields:

* salePrice
* thumbnailUrl
* shortDescription
* description
* specs
* images
* seoTitle
* seoDescription

## Update Product

Admin Action:

```text
updateProductAction
```

## Delete Product

Admin Action:

```text
deleteProductAction
```

Use confirmation in UI.

---

# 5. Category APIs / Actions

Functions:

```text
getCategories
getCategoryBySlug
createCategoryAction
updateCategoryAction
deleteCategoryAction
```

Required fields:

* name
* slug

---

# 6. Brand APIs / Actions

Functions:

```text
getBrands
getBrandBySlug
createBrandAction
updateBrandAction
deleteBrandAction
```

Required fields:

* name
* slug

---

# 7. Service APIs / Actions

Functions:

```text
getServices
getFeaturedServices
getServiceBySlug
createServiceAction
updateServiceAction
deleteServiceAction
```

Required fields:

* name
* slug
* shortDescription
* content

---

# 8. Blog APIs / Actions

Functions:

```text
getPosts
getPublishedPosts
getPostBySlug
createPostAction
updatePostAction
deletePostAction
```

Required fields:

* title
* slug
* content

Optional:

* excerpt
* thumbnailUrl
* seoTitle
* seoDescription
* publishedAt

---

# 9. Banner APIs / Actions

Functions:

```text
getActiveBanners
createBannerAction
updateBannerAction
deleteBannerAction
```

Required fields:

* title
* imageUrl

Optional:

* targetUrl
* position
* sortOrder

---

# 10. Lead Admin APIs / Actions

Functions:

```text
getLeads
getLeadById
updateLeadStatusAction
deleteLeadAction
```

Filters:

```json
{
  "status": "NEW",
  "sourceType": "PRODUCT",
  "page": 1,
  "limit": 20
}
```

---

# 11. Settings APIs / Actions

Functions:

```text
getSettings
updateSettingAction
updateStoreSettingsAction
```

Settings keys:

* store_name
* phone
* zalo_url
* facebook_url
* address
* working_hours
* google_map_embed
* default_seo_title
* default_seo_description

---

# 12. Auth APIs

Use NextAuth.

Routes:

```text
/api/auth/[...nextauth]
```

Login Page:

```text
/admin/login
```

Protected Routes:

```text
/admin/*
```

---

# 13. Upload APIs

Use Cloudinary.

Upload target:

* Product images
* Blog thumbnails
* Service thumbnails
* Banner images
* Logo
* Favicon

---

# 14. Validation Rules

Use Zod schemas for all input.

Suggested validators:

```text
product.validator.ts
service.validator.ts
lead.validator.ts
post.validator.ts
settings.validator.ts
```

---

# 15. Error Handling

All actions must:

* Validate input
* Catch errors
* Return safe error messages
* Never expose stack traces to users

---

# 16. Rate Limiting

Apply rate limit to:

* Lead form
* Contact form
* Login

---

# 17. API Security

Admin mutations require authentication.

Public read APIs are allowed.

Lead form is public but rate-limited.

END OF FILE
