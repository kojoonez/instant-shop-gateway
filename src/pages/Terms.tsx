import { Seo } from '@/components/seo/Seo';

export default function Terms() {
  return (
    <div className="container mx-auto py-12">
      <Seo title="Terms of Service" description="Terms for live commerce, tickets, services, UGC, referrals, and payouts on Cravy." />
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-invert max-w-none">
        <h2>Use of Service</h2>
        <p>Cravy enables live shopping, bookings, and events. You must comply with laws and our policies.</p>
        <h2>Accounts and Access</h2>
        <p>Login is required to view feeds. Keep credentials secure. We may suspend accounts for violations.</p>
        <h2>Transactions</h2>
        <p>Payments are processed securely. Sellers are responsible for fulfillment. Refunds follow seller policy and platform support.</p>
        <h2>UGC and Moderation</h2>
        <p>You own your content but grant us a license to host and display it. We remove harmful or illegal content.</p>
        <h2>Payouts</h2>
        <p>Payouts occur after successful delivery (fulfilled by Cravy’s approved partners) or event completion, subject to fees and reserves.</p>
      </div>
    </div>
  );
}


