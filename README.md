# E-Commerce Manager

## Note: This Is Gonna Be Frecking Messy!

---

### What's done (3-6-2025):

-   ✅ Validated a problem many sellers face
-   ✅ Defined the MVP and high-ticket subscription model
-   ✅ Picked a scalable tech stack: Supabase, Node.js, React
-   ✅ Designed the database and added secure RLS rules

---

### What's done (4-6-2025):

-   ✅ Crud Factory, that work for any table
-   ✅ Orders, products, stores, subscriptions routes & controllers
-   ✅ Basic Supabase JWT auth
-   ✅ Auth Middleware
-   ✅ Utility like CreateError class, and asyncWrapper function
-   ✅ Error handler middleware

---

### What's done (5-6-2025):

🔐 1. Finalize Auth & User Management

-   ✅ Create users table integration (store extra profile info)

-   ✅ Add register controller to sync Supabase user with local users table

-   ✅ Secure all routes with Auth middleware (where necessary)

📦 2. Seed Data / Dummy Data

-   ✅ Add sample data for products, orders, and stores (for early testing)

-   ✅ Create a seeder.js script or use Supabase SQL editor

📥 3. Implement Advanced Filtering / Pagination

-   ✅ Add query parameters support in getAll routes (e.g., ?limit=10&page=2)

-   ✅ Add filtering logic (e.g., by status, date, store ID)

🔄 4. Implement Relations Logic

-   ✅ Add logic in controllers to handle orders + order_products correctly

-   ✅ Populate store_id when creating a product

-   ✅ Join logic for fetching store orders, product subscriptions, etc.

🧪 5. Test All Routes with Postman or Thunder Client

-   Write a checklist for each route (CRUD working, errors handled, auth protected)

-   Spot any bugs or missing logic
