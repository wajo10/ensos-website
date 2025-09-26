import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: ':lang/**', renderMode: RenderMode.Server },

  { path: '', renderMode: RenderMode.Prerender },

  { path: '**', renderMode: RenderMode.Server },
];
