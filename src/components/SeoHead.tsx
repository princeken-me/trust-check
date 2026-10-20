import React, { useEffect } from 'react';

interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  schemaData?: object;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title = 'TrustCheck - Global Entity Trust & Scam Verification Engine',
  description = 'Verify businesses, websites, job offers, rental listings, and online offers before engaging. Transparent trust intelligence, risk detection, and verified public evidence.',
  canonicalUrl,
  ogType = 'website',
  schemaData
}) => {
  useEffect(() => {
    // 1. Update document title
    document.title = title.endsWith('TrustCheck') ? title : `${title} | TrustCheck`;

    // 2. Meta description
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. OpenGraph Tags
    const ogTitle = document.querySelector("meta[property='og:title']") || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', title);
    if (!ogTitle.parentNode) document.head.appendChild(ogTitle);

    const ogDesc = document.querySelector("meta[property='og:description']") || document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.setAttribute('content', description);
    if (!ogDesc.parentNode) document.head.appendChild(ogDesc);

    const ogTypeMeta = document.querySelector("meta[property='og:type']") || document.createElement('meta');
    ogTypeMeta.setAttribute('property', 'og:type');
    ogTypeMeta.setAttribute('content', ogType);
    if (!ogTypeMeta.parentNode) document.head.appendChild(ogTypeMeta);

    // 4. Canonical URL
    if (canonicalUrl) {
      let canonicalLink = document.querySelector("link[rel='canonical']");
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // 5. JSON-LD Structured Data Schema
    let scriptTag = document.getElementById('json-ld-schema') as HTMLScriptElement;
    if (schemaData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'json-ld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalUrl, ogType, schemaData]);

  return null;
};
