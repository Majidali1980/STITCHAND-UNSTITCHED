// Lightweight URL router that maps browser URLs to app views and back.
// Routes:
//   /                        → home
//   /shop?category=...       → shop (filters as query params)
//   /product/:slug           → product detail
//   /cart                    → cart
//   /checkout                → checkout
//   /order-confirmation      → order-confirmation
//   /account?tab=...         → account
//   /page/:slug              → cms page
//   /admin                   → admin panel

export interface ParsedUrl {
  view: string;
  params: Record<string, any>;
}

export function parseUrl(): ParsedUrl {
  if (typeof window === 'undefined') return { view: 'home', params: {} };

  const path = window.location.pathname;
  const search = window.location.search;

  const params: Record<string, any> = {};
  if (search) {
    const searchParams = new URLSearchParams(search);
    searchParams.forEach((value, key) => {
      if (value === 'true') params[key] = true;
      else if (value === 'false') params[key] = false;
      else params[key] = value;
    });
  }

  // /product/:slug
  const productMatch = path.match(/^\/product\/(.+)$/);
  if (productMatch) {
    return { view: 'product', params: { ...params, slug: decodeURIComponent(productMatch[1]) } };
  }

  // /page/:slug
  const pageMatch = path.match(/^\/page\/(.+)$/);
  if (pageMatch) {
    return { view: 'cms', params: { ...params, slug: decodeURIComponent(pageMatch[1]) } };
  }

  switch (path) {
    case '/admin': return { view: 'admin', params };
    case '/shop': return { view: 'shop', params };
    case '/cart': return { view: 'cart', params };
    case '/checkout': return { view: 'checkout', params };
    case '/order-confirmation': return { view: 'order-confirmation', params };
    case '/account': return { view: 'account', params };
    default: return { view: 'home', params };
  }
}

export function viewToUrl(view: string, params: Record<string, any> = {}): string {
  switch (view) {
    case 'product': {
      const slug = params.slug || params.id || '';
      return slug ? `/product/${encodeURIComponent(slug)}` : '/';
    }
    case 'cms': {
      const slug = params.slug || 'about-us';
      return `/page/${encodeURIComponent(slug)}`;
    }
    case 'admin':
      return '/admin';
    case 'shop':
    case 'cart':
    case 'checkout':
    case 'order-confirmation':
    case 'account': {
      const query: Record<string, string> = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && typeof value !== 'object') {
          query[key] = String(value);
        }
      });
      const qs = new URLSearchParams(query).toString();
      return `/${view}${qs ? `?${qs}` : ''}`;
    }
    case 'home':
    default:
      return '/';
  }
}
