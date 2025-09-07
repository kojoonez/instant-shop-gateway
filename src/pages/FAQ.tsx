import { Seo } from '@/components/seo/Seo';

const faqs: Array<{ q: string; a: string }> = [
  { q: 'What is Cravy?', a: 'Cravy is a live shopping platform for products, food, services, and events.' },
  { q: 'Do I need an account?', a: 'Yes. You must log in to view feeds and watch live streams.' },
  { q: 'How do payments work?', a: 'We support secure payments and a wallet with rewards and refunds.' },
  { q: 'What fees apply?', a: 'Fees vary by category. We show all fees transparently before checkout.' },
  { q: 'How are sellers verified?', a: 'Businesses and creators are reviewed. Verification is required to go live.' },
  { q: 'Shipping and delivery?', a: 'Cravy provides delivery services with approved partners. Track orders live in the app.' },
  { q: 'Cancellations and refunds?', a: 'Requests are handled per seller policy with platform support for appeals.' },
  { q: 'Who can apply?', a: 'Creators and businesses in supported categories. Applications are reviewed.' },
  { q: 'When do I get paid?', a: 'Payouts follow successful delivery or event completion, minus fees.' },
  { q: 'Is my data safe?', a: 'We follow GDPR/CCPA, encrypt data, and minimize retention.' },
];

export default function FAQ() {
  return (
    <div className="container mx-auto py-12">
      <Seo 
        title="FAQ" 
        description="Answers about fees, shipping, cancellations, eligibility, payouts, and verification."
        path="/faq"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a }
          }))
        }}
      />
      <h1 className="text-4xl font-bold mb-6">FAQ</h1>
      <div className="space-y-4">
        {faqs.map(({ q, a }) => (
          <div key={q} className="rounded-xl p-6 border border-white/10 bg-gradient-card">
            <h2 className="text-lg font-semibold">{q}</h2>
            <p className="text-muted-foreground mt-2">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


