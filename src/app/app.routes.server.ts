import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  //prerender
  { path: 'update-store/:id', renderMode: RenderMode.Client },
  { path: 'view-store/:id', renderMode: RenderMode.Client },
  { path: 'updatecart/:id', renderMode: RenderMode.Client },
  { path: 'viewcart/:id', renderMode: RenderMode.Client },
  { path: 'view-payment/:id', renderMode: RenderMode.Client },
  { path: 'products/:id/edit', renderMode: RenderMode.Client },
  { path: 'products/:id/view', renderMode: RenderMode.Client },
  { path: 'orders/:id', renderMode: RenderMode.Client },

  //prerender
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'user', renderMode: RenderMode.Prerender },
  { path: 'store', renderMode: RenderMode.Prerender },
  { path: 'add-new-store', renderMode: RenderMode.Prerender },
  { path: 'cart', renderMode: RenderMode.Prerender },
  { path: 'createcart', renderMode: RenderMode.Prerender },
  { path: 'payments', renderMode: RenderMode.Prerender },
  { path: 'coupon', renderMode: RenderMode.Prerender },
  { path: 'reviews', renderMode: RenderMode.Prerender },
  { path: 'products', renderMode: RenderMode.Prerender },
  { path: 'products/create', renderMode: RenderMode.Prerender },
  { path: 'category', renderMode: RenderMode.Prerender },
  { path: 'chatbot', renderMode: RenderMode.Prerender },
  { path: 'orders', renderMode: RenderMode.Prerender },
  { path: 'orders/create', renderMode: RenderMode.Prerender },

  // fallback
  { path: '**', renderMode: RenderMode.Prerender },
];
