import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Video, Image, MapPin, FileText, Plus, X, Star, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Truffle Mushroom Burger',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
    category: 'Food'
  },
  {
    id: '2',
    name: 'Alpine Winter Coat',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d2d?w=200&h=200&fit=crop',
    category: 'Fashion'
  },
  {
    id: '3',
    name: 'ProAudio Elite Buds',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200&h=200&fit=crop',
    category: 'Tech'
  }
];

export const CreatorDashboard: React.FC = () => {
  const [contentType, setContentType] = useState<'video' | 'blog' | 'map'>('video');
  const [craveTrayEnabled, setCraveTrayEnabled] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const contentIcons = {
    video: Video,
    blog: FileText,
    map: MapPin
  };

  const Icon = contentIcons[contentType];

  const addProduct = (product: Product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handlePublish = () => {
    const contentData = {
      type: contentType,
      title,
      description,
      location: location || undefined,
      craveTrayEnabled,
      products: selectedProducts
    };
    
    console.log('Publishing content:', contentData);
    alert(`Content published successfully! ${craveTrayEnabled ? 'Cravy is enabled.' : 'Cravy is disabled.'}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Creator Dashboard
        </h1>
        <p className="text-muted-foreground">
          Upload content and choose whether to enable Cravy for instant commerce
        </p>
      </div>

      {/* Content Type Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Content Type</h2>
        <div className="grid grid-cols-3 gap-4">
          {(['video', 'blog', 'map'] as const).map((type) => {
            const TypeIcon = contentIcons[type];
            return (
              <Button
                key={type}
                variant={contentType === type ? "default" : "outline"}
                className={cn(
                  "h-20 flex-col gap-2",
                  contentType === type && "bg-gradient-hero"
                )}
                onClick={() => setContentType(type)}
              >
                <TypeIcon className="h-6 w-6" />
                <span className="capitalize">{type}</span>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Content Details */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Content Details</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder={`Enter your ${contentType} title...`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder={`Describe your ${contentType}...`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {contentType === 'map' && (
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter address or location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          )}

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload your {contentType} file
            </p>
            <Button variant="outline" size="sm">
              Choose File
            </Button>
          </div>
        </div>
      </Card>

      {/* CraveTray Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Cravy Integration</h2>
            <p className="text-sm text-muted-foreground">
              Enable seamless commerce directly in your content
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="cravetray-enabled" className="text-sm">
              Enable Cravy
            </Label>
            <Switch
              id="cravetray-enabled"
              checked={craveTrayEnabled}
              onCheckedChange={setCraveTrayEnabled}
            />
          </div>
        </div>

        {craveTrayEnabled && (
          <div className="space-y-4 border-t border-border pt-4">
            <div className="bg-gradient-to-r from-crave-orange/10 to-crave-purple/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-crave-orange" />
                <span className="font-medium">Cravy Enabled</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Viewers can purchase products directly from your content without leaving the app.
                You'll earn commission on every sale!
              </p>
            </div>

            <div>
              <Label className="text-base font-medium">Select Products to Feature</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Choose which products viewers can purchase through Cravy
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {sampleProducts.map((product) => (
                  <Card 
                    key={product.id}
                    className={cn(
                      "p-3 cursor-pointer transition-all hover:scale-[1.02]",
                      selectedProducts.find(p => p.id === product.id) 
                        ? "ring-2 ring-crave-orange" 
                        : "hover:shadow-md"
                    )}
                    onClick={() => addProduct(product)}
                  >
                    <div className="flex gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{product.name}</h4>
                        <Badge variant="outline" className="text-xs mb-1">
                          {product.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="text-sm font-bold">{product.price}</span>
                        </div>
                      </div>
                      {selectedProducts.find(p => p.id === product.id) && (
                        <div className="text-crave-orange">
                          <Plus className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {selectedProducts.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Selected Products ({selectedProducts.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProducts.map((product) => (
                      <Badge 
                        key={product.id}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        {product.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeProduct(product.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Publish Button */}
      <div className="text-center">
        <Button 
          onClick={handlePublish}
          size="lg"
          className="bg-gradient-hero text-white font-semibold px-8 py-3 hover:scale-105 transition-transform"
          disabled={!title.trim()}
        >
          Publish Content
          {craveTrayEnabled && (
            <Badge className="ml-2 bg-white/20">
              Cravy Enabled
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};