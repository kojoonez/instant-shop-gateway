import { Seo } from '@/components/seo/Seo';

export default function Privacy() {
  return (
    <div className="container mx-auto py-12">
      <Seo title="Privacy Policy" description="Privacy Policy for Cravy: live commerce, UGC, referrals, and payments." />
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none">
        <p>We collect account, device, and usage data to operate Cravy and provide live shopping, bookings, events, and wallet features. We minimize retention and honor GDPR/CCPA rights.</p>
        <h2>Data we process</h2>
        <ul>
          <li>Account and identity details</li>
          <li>Orders, bookings, and wallet transactions</li>
          <li>UGC such as posts, streams, and chat</li>
          <li>Device, analytics, and security logs</li>
        </ul>
        <h2>Why we process data</h2>
        <ul>
          <li>Provide the service and ensure safety and moderation</li>
          <li>Process payments and refunds</li>
          <li>Prevent fraud and enforce policies</li>
          <li>Improve product with optional analytics</li>
        </ul>
        <h2>Retention</h2>
        <p>We retain data only as long as necessary for legal, tax, and operational reasons. You may request deletion subject to legal exceptions.</p>
        <h2>Rights</h2>
        <p>You may access, correct, export, or delete your data. Contact us to exercise GDPR/CCPA rights.</p>
      </div>
    </div>
  );
}


