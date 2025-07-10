import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const productId = pathSegments[pathSegments.length - 1];

    switch (req.method) {
      case 'GET':
        if (productId && productId !== 'products') {
          // Get single product with badges
          const { data: product, error } = await supabase
            .from('products')
            .select(`
              *,
              categories (name),
              product_badges (badge_name)
            `)
            .eq('id', productId)
            .eq('is_active', true)
            .single();

          if (error) {
            console.error('Error fetching product:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(product), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all products with optional filtering
          const category = url.searchParams.get('category');
          const search = url.searchParams.get('search');
          const limit = parseInt(url.searchParams.get('limit') || '50');
          const offset = parseInt(url.searchParams.get('offset') || '0');

          let query = supabase
            .from('products')
            .select(`
              *,
              categories (name),
              product_badges (badge_name)
            `)
            .eq('is_active', true)
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false });

          if (category) {
            query = query.eq('categories.name', category);
          }

          if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
          }

          const { data: products, error } = await query;

          if (error) {
            console.error('Error fetching products:', error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(products), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const productData = await req.json();
        
        const { data: newProduct, error: createError } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (createError) {
          console.error('Error creating product:', createError);
          return new Response(JSON.stringify({ error: createError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Add badges if provided
        if (productData.badges && productData.badges.length > 0) {
          const badgeInserts = productData.badges.map((badge: string) => ({
            product_id: newProduct.id,
            badge_name: badge
          }));

          await supabase
            .from('product_badges')
            .insert(badgeInserts);
        }

        return new Response(JSON.stringify(newProduct), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        if (!productId || productId === 'products') {
          return new Response(JSON.stringify({ error: 'Product ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updateData = await req.json();
        
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', productId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating product:', updateError);
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(updatedProduct), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        if (!productId || productId === 'products') {
          return new Response(JSON.stringify({ error: 'Product ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: deleteError } = await supabase
          .from('products')
          .update({ is_active: false })
          .eq('id', productId);

        if (deleteError) {
          console.error('Error deleting product:', deleteError);
          return new Response(JSON.stringify({ error: deleteError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ message: 'Product deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});