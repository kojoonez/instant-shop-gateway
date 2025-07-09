export interface CraveTrayProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  category: string;
  deliveryFee: number;
  deliveryTime: string;
  badges?: string[];
}

// Utility function to create product data with defaults
export const createProduct = (data: Partial<CraveTrayProduct> & Pick<CraveTrayProduct, 'id' | 'name' | 'price' | 'image'>): CraveTrayProduct => {
  return {
    description: '',
    rating: 4.5,
    reviews: 0,
    category: 'Product',
    deliveryFee: 0,
    deliveryTime: '2-3 days',
    badges: [],
    ...data
  };
};

// Sample products for demos
export const sampleProducts: CraveTrayProduct[] = [
  {
    id: 'food-1',
    name: 'Truffle Pasta Bowl',
    price: 24.99,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400',
    description: 'Handmade pasta with truffle oil, parmesan, and fresh herbs',
    rating: 4.8,
    reviews: 124,
    category: 'Italian Cuisine',
    deliveryFee: 2.99,
    deliveryTime: '25-35 min',
    badges: ['Chef Special', 'Popular']
  },
  {
    id: 'fashion-1',
    name: 'Vintage Denim Jacket',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400',
    description: 'Classic vintage-style denim jacket with distressed details',
    rating: 4.6,
    reviews: 89,
    category: 'Outerwear',
    deliveryFee: 0,
    deliveryTime: '2-3 days',
    badges: ['Trending', 'Free Shipping']
  },
  {
    id: 'tech-1',
    name: 'Wireless Earbuds Pro',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
    description: 'Premium wireless earbuds with active noise cancellation',
    rating: 4.9,
    reviews: 342,
    category: 'Audio',
    deliveryFee: 0,
    deliveryTime: '1-2 days',
    badges: ['Sale', 'Best Seller']
  }
];