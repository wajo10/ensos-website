import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
const staticMiddleware = express.static(browserDistFolder, {
  maxAge: '1y',
  index: false,
  redirect: false,
});

// Serve only asset-like requests (URLs that contain a file extension), avoid Express path patterns to prevent path-to-regexp errors.
app.use((req, res, next) => {
  if (/\.[a-zA-Z0-9]+$/.test(req.path)) {
    return staticMiddleware(req, res, next);
  }
  next();
});

app.use((req, res, next) => {
  // If the user hits exactly '/', detect language and redirect
  if (req.url === '/') {
    const acceptLangHeader = req.headers['accept-language'] || '';
    // Example: 'es,en;q=0.8' => take the first part before comma => 'es'
    const userLang = acceptLangHeader.toString().split(',')[0].split('-')[0];

    // Default supported languages
    const supportedLangs = ['en', 'es'];
    const finalLang = supportedLangs.includes(userLang) ? userLang : 'en';

    // Perform a 302 redirect to /:lang (e.g. /en or /es)
    res.redirect(`/${finalLang}`);
    return; // prevent further handling after redirect
  }
  next();
});

/**
 * Handle all other requests by rendering the Angular application.
 */
// Catch-all SSR handler without using Express path patterns (avoids path-to-regexp '*')
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then(async (response) => {
      if (!response) {
        return next();
      }

      const urlPath = (req.originalUrl || req.url || '').split('?')[0];
      const segments = urlPath.split('/').filter(Boolean);
      const finalLang = segments[0] === 'es' ? 'es' : 'en';

      if (response.body && typeof response.body.getReader === 'function') {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let html = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          html += decoder.decode(value);
        }

        html = html.replace(
          /<html\b[^>]*>/i,
          `<html lang="${finalLang}">`
        );

        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
      }

      return writeResponseToNodeResponse(response, res);
    })
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
