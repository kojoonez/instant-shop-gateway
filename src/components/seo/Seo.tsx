import { useEffect } from 'react';
import { siteConfig } from '@/config/site';

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  jsonLd?: object | object[] | null;
};

export function Seo({ title, description, path = '/', jsonLd }: SeoProps) {
  useEffect(() => {
    const t = title ? `${title} · ${siteConfig.name}` : `${siteConfig.name}: Live shopping, food, services, events`;
    const d = description ?? siteConfig.description;
    document.title = t;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', d);

    const og = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    og('og:title', t);
    og('og:description', d);
    og('og:type', 'website');
    og('og:site_name', siteConfig.name);
    og('og:url', path);

    const tw = (name: string, content: string) => setMeta(name, content);
    tw('twitter:title', t);
    tw('twitter:description', d);

    // JSON-LD
    // Remove previous route JSON-LD scripts
    document.querySelectorAll('script[data-jsonld^="route"]').forEach(n => n.parentElement?.removeChild(n));
    if (jsonLd) {
      const buildPayload = (data: object | object[]) => {
        if (Array.isArray(data)) {
          return { '@context': 'https://schema.org', '@graph': data } as object;
        }
        return data;
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-jsonld', 'route-0');
      script.text = JSON.stringify(buildPayload(jsonLd));
      document.head.appendChild(script);
    }
  }, [title, description, path, jsonLd]);

  return null;
}


