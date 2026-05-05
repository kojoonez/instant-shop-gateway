import { Seo } from '@/components/seo/Seo';
import { siteConfig } from '@/config/site';

export default function Features() {
  const description = `${siteConfig.name} connects a high-performance social content feed with a complete transactional engine—food delivery, ticketing, consultations, rides, and logistics—so creators, merchants, and riders stay in one ecosystem.`;

  return (
    <div className="container mx-auto py-12">
      <Seo title="Features" description={description} />
      <h1 className="text-4xl font-bold mb-4">Platform capabilities</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-3xl">{description}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          ['Social content feed', 'A fast, unified feed for discovery—posts, live moments, and social proof that drive intent.'],
          ['Live streaming commerce', 'Go live with real-time chat, cart, and checkout so viewers buy without leaving the stream.'],
          ['Transactional engine', 'One checkout stack for physical goods, digital offers, bookings, and paid sessions.'],
          ['Food delivery', 'Order from kitchens and brands with fulfillment and tracking tied into the same app graph.'],
          ['Event ticketing', 'List, promote, and sell tickets; buyers manage passes and updates in one wallet.'],
          ['1-on-1 video consultations', 'Book paid video sessions with pros—scheduling, reminders, and secure join in-app.'],
          ['Taxi & mobility', 'Request rides and route logistics alongside your orders and appointments.'],
          ['Logistics layer', 'Coordinate delivery, handoffs, and status so buyers, sellers, and partners see one truth.'],
          ['Wallet & rewards', 'Stored value, referrals, and perks across categories—not siloed per vertical.'],
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
