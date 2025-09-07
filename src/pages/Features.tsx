import { Seo } from '@/components/seo/Seo';

export default function Features() {
  return (
    <div className="container mx-auto py-12">
      <Seo title="Features" description="Live shopping, order food online, book services, event tickets, creator monetization — all in Cravy." />
      <h1 className="text-4xl font-bold mb-6">Features</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          ['Universal Feed', 'Scroll videos and posts from shops, services, and events—live.'],
          ['Live Streams', 'Buy during live shows. Real-time chat, cart, and checkout.'],
          ['Catalog', 'Products, digital goods, and add-ons in one simple storefront.'],
          ['Food & Restaurants', 'Order from verified kitchens. Cravy delivers via approved partners.'],
          ['Services', 'Book barbers, salons, and pros with live availability.'],
          ['Events & Tickets', 'Discover local events and buy tickets instantly.'],
          ['Subscriptions', 'Join memberships for perks, drops, and premium content.'],
          ['Share & Earn', 'Invite friends and earn rewards on their purchases.'],
          ['Wallet & Rewards', 'One wallet for safe payments and automatic points.'],
        ].map(([title, copy]) => (
          <div key={title} className="rounded-xl p-6 border border-white/10 bg-gradient-card">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


