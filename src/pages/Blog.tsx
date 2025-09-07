import { Seo } from '@/components/seo/Seo';

export default function Blog() {
  return (
    <div className="container mx-auto py-12">
      <Seo title="Blog" description="Guides on live shopping, ordering food online, booking services, and event tickets." />
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <p className="text-muted-foreground">Posts coming soon.</p>
    </div>
  );
}


