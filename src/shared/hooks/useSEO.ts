import { useEffect } from 'react';

const BASE_URL = 'https://coopehemp.cr';
const DEFAULT_IMAGE = '/og-cover.jpg';

interface SEOConfig {
  title: string;
  description: string;
  /** ruta relativa, e.g. "/productos" */
  path?: string;
  /** ruta de imagen relativa, e.g. "/hemp-oil.jpg" */
  image?: string;
  type?: 'website' | 'article' | 'product';
  /** JSON-LD adicional para la página */
  structuredData?: object;
}

export function useSEO({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  structuredData,
}: SEOConfig) {
  useEffect(() => {
    const fullTitle = `${title} | CoopeHemp R.L.`;
    const imgUrl = `${BASE_URL}${image}`;
    const pageUrl = `${BASE_URL}${path}`;

    document.title = fullTitle;

    setMeta('description', description);
    setOG('og:title', fullTitle);
    setOG('og:description', description);
    setOG('og:image', imgUrl);
    setOG('og:image:secure_url', imgUrl);
    setOG('og:url', pageUrl);
    setOG('og:type', type);
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', imgUrl);
    setCanonical(pageUrl);

    let ldScript: HTMLScriptElement | null = null;
    if (structuredData) {
      ldScript = document.createElement('script');
      ldScript.type = 'application/ld+json';
      ldScript.setAttribute('data-page-ld', 'true');
      ldScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(ldScript);
    }

    return () => {
      if (ldScript) ldScript.remove();
    };
  }, [title, description, path, image, type, structuredData]);
}

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setOG(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = url;
}
