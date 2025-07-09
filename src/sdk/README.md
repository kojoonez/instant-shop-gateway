# CraveTray SDK

A universal embeddable commerce interface for React applications. CraveTray enables seamless in-app purchasing without redirecting users away from your content.

## Quick Start

```bash
npm install @cravetray/sdk
```

### Basic Usage

```jsx
import { CraveTraySDK, createProduct } from '@cravetray/sdk';

const product = createProduct({
  id: 'food-1',
  name: 'Truffle Pasta Bowl',
  price: 24.99,
  image: 'https://example.com/pasta.jpg'
});

function App() {
  return (
    <CraveTraySDK 
      product={product}
      appContext="food"
      triggerText="Order Now"
    />
  );
}
```

## Advanced Usage

### With Custom Checkout Handler

```jsx
import { CraveTraySDK } from '@cravetray/sdk';

function App() {
  const handleCheckout = async (product, quantity) => {
    // Custom checkout logic
    const response = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ product, quantity })
    });
    
    const { url } = await response.json();
    window.open(url, '_blank');
  };

  return (
    <CraveTraySDK 
      product={product}
      onCheckout={handleCheckout}
      showTrigger={false}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  );
}
```

### Using Context Provider

```jsx
import { CraveTrayProvider, useCraveTrayContext } from '@cravetray/sdk';

function ProductButton({ product }) {
  const { openTray } = useCraveTrayContext();
  
  return (
    <button onClick={() => openTray(product)}>
      Buy Now
    </button>
  );
}

function App() {
  return (
    <CraveTrayProvider>
      <ProductButton product={myProduct} />
      {/* CraveTray will be managed by context */}
    </CraveTrayProvider>
  );
}
```

### Auto-trigger on Content Load

```jsx
<CraveTraySDK 
  product={product}
  autoTrigger={true}
  autoTriggerDelay={2000}
  appContext="fashion"
/>
```

## API Reference

### CraveTraySDK Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `product` | `CraveTrayProduct` | - | Product data to display |
| `isOpen` | `boolean` | - | Controlled open state |
| `onClose` | `() => void` | - | Close callback |
| `appContext` | `'food' \| 'fashion' \| 'tech' \| 'default'` | `'default'` | Styling context |
| `autoTrigger` | `boolean` | `false` | Auto-open when product changes |
| `autoTriggerDelay` | `number` | `1500` | Delay before auto-trigger (ms) |
| `trigger` | `ReactNode` | - | Custom trigger element |
| `triggerText` | `string` | `'Order Now'` | Default trigger button text |
| `triggerClassName` | `string` | `''` | Additional trigger CSS classes |
| `showTrigger` | `boolean` | `true` | Whether to show trigger button |
| `onCheckout` | `(product, quantity) => void` | - | Custom checkout handler |
| `apiEndpoint` | `string` | - | Custom API endpoint for checkout |
| `customStyles` | `CSSProperties` | - | Custom trigger styles |

### Product Interface

```typescript
interface CraveTrayProduct {
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
```

### Utility Functions

```jsx
import { createProduct, sampleProducts } from '@cravetray/sdk';

// Create product with defaults
const product = createProduct({
  id: 'my-product',
  name: 'Product Name',
  price: 29.99,
  image: 'https://example.com/image.jpg'
});

// Use sample products for testing
const testProduct = sampleProducts[0];
```

## Styling

CraveTray uses a glassmorphism design with context-aware colors:

- **Food**: Orange gradient
- **Fashion**: Purple gradient  
- **Tech**: Blue gradient
- **Default**: Indigo gradient

### Custom Styles

```jsx
<CraveTraySDK 
  customStyles={{
    background: 'linear-gradient(45deg, #your-color)',
    borderRadius: '20px'
  }}
/>
```

## Integration Examples

### Video Content

```jsx
<div className="video-container">
  <video src="cooking-demo.mp4" />
  <CraveTraySDK 
    product={recipeIngredients}
    autoTrigger={true}
    appContext="food"
    triggerText="Buy Ingredients"
  />
</div>
```

### Blog Posts

```jsx
<article>
  <h1>Amazing Truffle Pasta Recipe</h1>
  <p>This recipe will change your life...</p>
  
  <CraveTraySDK 
    product={pastaProduct}
    triggerText="Order from Restaurant"
    appContext="food"
  />
</article>
```

### Map Integration

```jsx
<div className="map-pin" onClick={() => openTray(restaurantMenu)}>
  📍 Amazing Restaurant
  <CraveTraySDK 
    product={menuItem}
    showTrigger={false}
    isOpen={isPinClicked}
    onClose={() => setIsPinClicked(false)}
  />
</div>
```

## License

MIT License - see LICENSE file for details.