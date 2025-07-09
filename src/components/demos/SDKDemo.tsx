import React, { useState } from 'react';
import { CraveTraySDK } from '../../sdk';
import { sampleProducts } from '../../sdk/utils/product';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export const SDKDemo: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(sampleProducts[0]);
  const [isControlledOpen, setIsControlledOpen] = useState(false);

  const codeExamples = {
    basic: `import { CraveTraySDK, createProduct } from '@cravetray/sdk';

const product = createProduct({
  id: 'pasta-1',
  name: 'Truffle Pasta Bowl',
  price: 24.99,
  image: '/pasta.jpg'
});

<CraveTraySDK 
  product={product}
  appContext="food"
  triggerText="Order Now"
/>`,

    controlled: `import { CraveTraySDK } from '@cravetray/sdk';

const [isOpen, setIsOpen] = useState(false);

<CraveTraySDK 
  product={product}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  showTrigger={false}
/>

<button onClick={() => setIsOpen(true)}>
  Custom Trigger
</button>`,

    autoTrigger: `<CraveTraySDK 
  product={product}
  autoTrigger={true}
  autoTriggerDelay={2000}
  appContext="fashion"
/>`,

    customCheckout: `const handleCheckout = async (product, quantity) => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({ product, quantity })
  });
  
  const { url } = await response.json();
  window.open(url, '_blank');
};

<CraveTraySDK 
  product={product}
  onCheckout={handleCheckout}
/>`
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">
          CraveTray SDK Demo
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Universal embeddable commerce interface for React applications
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Usage</TabsTrigger>
          <TabsTrigger value="controlled">Controlled</TabsTrigger>
          <TabsTrigger value="auto">Auto-trigger</TabsTrigger>
          <TabsTrigger value="custom">Custom Checkout</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic SDK Implementation</CardTitle>
              <CardDescription>
                Simple drop-in component with built-in trigger button
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Live Demo</h4>
                  <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      {sampleProducts.map((product) => (
                        <Button
                          key={product.id}
                          variant={selectedProduct.id === product.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                        >
                          {product.category}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="border rounded-lg p-6 bg-card">
                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h5 className="font-semibold">{selectedProduct.name}</h5>
                          <p className="text-sm text-muted-foreground">${selectedProduct.price}</p>
                        </div>
                      </div>
                      
                      <CraveTraySDK 
                        product={selectedProduct}
                        appContext={selectedProduct.category.includes('Italian') ? 'food' : 
                                   selectedProduct.category.includes('Outerwear') ? 'fashion' : 'tech'}
                        triggerText="Try SDK"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Code</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{codeExamples.basic}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controlled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Controlled State</CardTitle>
              <CardDescription>
                Manage tray state externally with custom triggers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Live Demo</h4>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-6 bg-card">
                      <h5 className="font-semibold mb-2">{sampleProducts[1].name}</h5>
                      <p className="text-sm text-muted-foreground mb-4">
                        Custom trigger button with controlled state
                      </p>
                      
                      <Button onClick={() => setIsControlledOpen(true)}>
                        Open Custom Tray
                      </Button>
                      
                      <CraveTraySDK 
                        product={sampleProducts[1]}
                        isOpen={isControlledOpen}
                        onClose={() => setIsControlledOpen(false)}
                        showTrigger={false}
                        appContext="fashion"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Code</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{codeExamples.controlled}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto-trigger</CardTitle>
              <CardDescription>
                Automatically open tray when product changes (great for video content)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Live Demo</h4>
                  <div className="space-y-4">
                    <Badge variant="secondary" className="mb-2">
                      Tray will auto-open in 2 seconds
                    </Badge>
                    
                    <div className="border rounded-lg p-6 bg-card">
                      <CraveTraySDK 
                        product={sampleProducts[2]}
                        autoTrigger={true}
                        autoTriggerDelay={2000}
                        appContext="tech"
                        triggerText="Manual Override"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Code</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{codeExamples.autoTrigger}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Checkout Handler</CardTitle>
              <CardDescription>
                Integrate with your own payment processing or API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Live Demo</h4>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-6 bg-card">
                      <CraveTraySDK 
                        product={sampleProducts[0]}
                        appContext="food"
                        triggerText="Custom Checkout"
                        onCheckout={(product, quantity) => {
                          alert(`Custom checkout: ${quantity}x ${product.name} for $${(product.price * quantity).toFixed(2)}`);
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Code</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{codeExamples.customCheckout}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Installation & Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Install via NPM</h4>
              <pre className="bg-muted p-3 rounded-lg text-sm">
                <code>npm install @cravetray/sdk</code>
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Import Components</h4>
              <pre className="bg-muted p-3 rounded-lg text-sm">
                <code>{`import { CraveTraySDK, createProduct } from '@cravetray/sdk';`}</code>
              </pre>
            </div>

            <div className="flex gap-4">
              <Badge>React 16.8+</Badge>
              <Badge>TypeScript Ready</Badge>
              <Badge>Tree Shakeable</Badge>
              <Badge>0 Dependencies</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};