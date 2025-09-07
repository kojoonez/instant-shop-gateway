import { Seo } from '@/components/seo/Seo';

export default function HowItWorks() {
  return (
    <div className="container mx-auto py-12">
      <Seo title="How It Works" description="Three steps: watch live, add to cart, and check out securely." />
      <h1 className="text-4xl font-bold mb-6">How It Works</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          ['Watch live', 'Browse the Universal Feed and watch creators and sellers live.'],
          ['Shop instantly', 'Tap products, food, or services during streams or posts.'],
          ['Secure checkout', 'Pay safely with wallet and track orders in the app.'],
        ].map(([title, copy], i) => (
          <div key={title} className="rounded-xl p-6 border border-white/10 bg-gradient-card">
            <div className="text-sm text-primary font-mono">Step {i + 1}</div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


