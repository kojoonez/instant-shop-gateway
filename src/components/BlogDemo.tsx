import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// CraveTray component removed - product functionality not needed
import { Heart, Share2, Bookmark, Clock, User } from 'lucide-react';

const blogProduct = {
  id: 'kitchen-knife-set',
  name: 'Professional Chef Knife Set',
  price: 129.99,
  originalPrice: 179.99,
  image: 'https://images.unsplash.com/photo-1593618998160-e34014b33d79?w=400&h=300&fit=crop',
  description: 'Premium stainless steel knife set with ergonomic handles. Perfect for home chefs and professionals.',
  rating: 4.9,
  reviews: 847,
  category: 'Kitchen & Dining',
  deliveryFee: 0,
  deliveryTime: '2-3 days',
  badges: ['Chef Recommended', 'Free Shipping']
};

export const BlogDemo: React.FC = () => {
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const openTray = () => setIsTrayOpen(true);
  const closeTray = () => setIsTrayOpen(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Blog Header */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Badge className="mb-3 bg-crave-orange text-white">
            Featured Recipe
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Perfect Pasta Carbonara: A Chef's Guide
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Chef Isabella Martinez</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>15 min read</span>
            </div>
            <span>•</span>
            <span>March 15, 2024</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=400&fit=crop"
            alt="Pasta Carbonara"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-black/20 backdrop-blur-sm text-white border-white/20">
              🍝 Authentic Italian
            </Badge>
          </div>
        </div>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            There's something magical about a perfectly executed carbonara. The silky sauce, 
            the crispy pancetta, the perfectly cooked pasta – when done right, it's a symphony 
            of flavors that transports you straight to Rome.
          </p>

          <p>
            Today, I'm sharing my foolproof technique for creating restaurant-quality carbonara 
            at home. The secret? It's all about timing, temperature, and using the right tools.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Essential Equipment</h2>
          
          <p>
            Before we dive into the recipe, let's talk about the tools that will make or break 
            your carbonara. A sharp, professional knife set is absolutely crucial for achieving 
            the perfect pancetta dice and pasta preparation.
          </p>

          {/* Embedded Product CTA */}
          <div className="not-prose my-8">
            <div className="bg-gradient-to-r from-crave-orange/10 to-crave-purple/10 rounded-2xl p-6 border border-crave-orange/20">
              <div className="flex items-center gap-4">
                <img 
                  src={blogProduct.image}
                  alt={blogProduct.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <Badge className="mb-2 bg-crave-orange text-white">
                    Chef's Pick
                  </Badge>
                  <h3 className="font-bold text-lg mb-1">{blogProduct.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    The exact knife set I use in my professional kitchen
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-crave-orange">
                      ${blogProduct.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ${blogProduct.originalPrice}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      28% OFF
                    </Badge>
                  </div>
                </div>
                <Button 
                  onClick={openTray}
                  className="bg-crave-orange hover:bg-crave-orange/90 text-white font-semibold px-6"
                >
                  Get This Set
                </Button>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">The Perfect Carbonara Recipe</h2>

          <h3 className="text-xl font-semibold mb-3">Ingredients (Serves 4)</h3>
          <ul className="space-y-2">
            <li>• 400g spaghetti or tonnarelli</li>
            <li>• 200g guanciale (or pancetta), diced</li>
            <li>• 4 large egg yolks + 1 whole egg</li>
            <li>• 100g Pecorino Romano, finely grated</li>
            <li>• Freshly cracked black pepper</li>
            <li>• Sea salt for pasta water</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Instructions</h3>
          <ol className="space-y-4">
            <li>
              <strong>1. Prepare your mise en place.</strong> Using a sharp knife, dice the guanciale 
              into small, even pieces. This is where that professional knife set really shines – 
              clean, precise cuts ensure even cooking.
            </li>
            <li>
              <strong>2. Cook the guanciale.</strong> In a large pan over medium-low heat, render 
              the guanciale until golden and crispy, about 8-10 minutes.
            </li>
            <li>
              <strong>3. Prepare the egg mixture.</strong> In a bowl, whisk together egg yolks, 
              whole egg, grated Pecorino, and a generous amount of black pepper.
            </li>
            <li>
              <strong>4. Cook the pasta.</strong> Boil spaghetti in well-salted water until 
              al dente, reserving 1 cup of pasta water before draining.
            </li>
            <li>
              <strong>5. The magic moment.</strong> Remove the guanciale pan from heat, add 
              drained pasta, then slowly whisk in the egg mixture, adding pasta water 
              gradually until you achieve a silky sauce.
            </li>
          </ol>

          <div className="bg-muted/50 rounded-xl p-6 mt-8">
            <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
            <p>
              The key to carbonara is temperature control. Too hot, and you'll scramble the eggs. 
              Too cool, and the sauce won't come together. Practice makes perfect!
            </p>
          </div>
        </div>

        {/* Article Actions */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={isBookmarked ? "text-blue-500" : ""}
            >
              <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            2.3k likes • 47 comments
          </div>
        </div>
      </div>

      {/* Product functionality removed - not needed */}
    </div>
  );
};