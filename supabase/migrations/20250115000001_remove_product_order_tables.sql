-- Remove product and order related tables
-- This migration removes all product, order, and related tables since they're not needed

-- Drop foreign key constraints first
ALTER TABLE IF EXISTS public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE IF EXISTS public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE IF EXISTS public.product_badges DROP CONSTRAINT IF EXISTS product_badges_product_id_fkey;

-- Drop tables
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.product_badges;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.categories;

-- Drop the update_updated_at_column function if it exists and is no longer needed
-- (Keep it since it might be used by other tables)
-- DROP FUNCTION IF EXISTS public.update_updated_at_column();
