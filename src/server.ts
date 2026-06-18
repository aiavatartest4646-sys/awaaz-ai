import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();

// Initialize AngularNodeAppEngine
const angularApp = new AngularNodeAppEngine(); // ✅ This was missing

// Enable CORS for development (important for OAuth)
app.use((req, res, next) => {
  // Allow your Angular dev server and production domains
  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:4000',
    'http://awaazai.fun'
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});

// Parse JSON bodies (for API endpoints)
app.use(express.json());

// Example API endpoint for OAuth token validation (optional)
app.post('/api/auth/social-login', (req, res) => {
  // This is just a proxy example - in production, forward to your Spring Boot backend
  // Or implement direct validation here
  console.log('Social login request:', req.body);

  // Forward to Spring Boot backend or handle directly
  // For now, just acknowledge receipt
  res.json({
    success: true,
    message: 'Login processed',
    user: req.body
  });
});

// Optional: Proxy API requests to Spring Boot backend
// Uncomment if you want to proxy API calls through Angular server
/*
import http from 'http';
app.use('/api/*', (req, res) => {

  const proxyReq = http.request(backendUrl + req.url, (proxyRes) => {
    res.writeHead(proxyRes.statusCode!, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });
  
  req.pipe(proxyReq, { end: true });
  
  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Backend unavailable' });
  });
});
*/

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Health check endpoint (useful for load balancers)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// OAuth callback routes - ensure they're not cached
app.get('/oauth-callback', (req, res, next) => {
  // Disable caching for OAuth callbacks
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  next();
});

// Protect certain routes from being server-side rendered
const clientSideOnlyRoutes = [
  '/login',
  '/dashboard',
  '/dashboard/*',
  '/profile',
  '/settings',
  '/oauth-callback'
];

// Middleware to check if route should be client-side only
app.use((req, res, next) => {
  const path = req.path;

  // Check if route matches any client-side only pattern
  const isClientSideOnly = clientSideOnlyRoutes.some(route => {
    if (route.endsWith('/*')) {
      const baseRoute = route.slice(0, -2);
      return path === baseRoute || path.startsWith(baseRoute + '/');
    }
    return path === route;
  });

  if (isClientSideOnly) {
    // For client-side only routes, send the index.html for client-side rendering
    res.sendFile(resolve(browserDistFolder, 'index.html'));
  } else {
    next();
  }
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response: any) => { // ✅ Added type annotation
      if (response) {
        // Add security headers
        response.headers = {
          ...response.headers,
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        };
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch(next);
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`✅ Node Express server listening on http://localhost:${port}`);
    console.log(`📍 Angular app: http://localhost:${port}`);
    console.log(`🔐 OAuth callbacks will be handled at: http://localhost:${port}/oauth-callback`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);