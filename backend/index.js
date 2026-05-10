const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin || origin === ALLOWED_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} is not allowed.`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' }
});
app.use(globalLimiter);

// ─── Stricter limiter for heavy AI endpoints ──────────────────────────────────
const heavyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,             // max 20 requests/min for pest & chat
  message: { error: 'Rate limit exceeded for this service. Please wait a moment.' }
});

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── Proxy Target Config ──────────────────────────────────────────────────────
const services = {
  advisory: process.env.ADVISORY_URL || 'http://127.0.0.1:8002',
  pest:     process.env.PEST_URL     || 'http://127.0.0.1:8003',
  weather:  process.env.WEATHER_URL  || 'http://127.0.0.1:8004',
  chat:     process.env.CHAT_URL     || 'http://127.0.0.1:8005',
  market:   process.env.MARKET_URL   || 'http://127.0.0.1:8006',
  notification: process.env.NOTIFICATION_URL || 'http://127.0.0.1:8007',
  analytics:    process.env.ANALYTICS_URL    || 'http://127.0.0.1:8008'
};

const proxyOptions = (target, prefix) => ({
  target,
  changeOrigin: true,
  pathRewrite: { [`^/api/${prefix}`]: '' },
  on: {
    error: (err, req, res) => {
      console.error(`[${prefix}] proxy error:`, err.message);
      res.status(502).json({ error: `${prefix} service is currently unavailable.` });
    }
  }
});

// ─── Proxy Routes ─────────────────────────────────────────────────────────────
app.use('/api/advisory', createProxyMiddleware(proxyOptions(services.advisory, 'advisory')));
app.use('/api/weather',  createProxyMiddleware(proxyOptions(services.weather, 'weather')));
app.use('/api/market',   createProxyMiddleware(proxyOptions(services.market, 'market')));
app.use('/api/notification', createProxyMiddleware(proxyOptions(services.notification, 'notification')));
app.use('/api/analytics',    createProxyMiddleware(proxyOptions(services.analytics, 'analytics')));

// Heavy-use endpoints get the stricter rate limiter
app.use('/api/pest', heavyLimiter, createProxyMiddleware(proxyOptions(services.pest, 'pest')));
app.use('/api/chat', heavyLimiter, createProxyMiddleware(proxyOptions(services.chat, 'chat')));

// ─── Base Routes ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Smart Crop Advisory System API Gateway', version: '2.0.0' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 API Gateway v2.0 running on port ${PORT}`);
  console.log(`🔗 Allowed Origin : ${ALLOWED_ORIGIN}`);
  console.log(`=========================================`);
  console.log(`- /api/advisory -> ${services.advisory}`);
  console.log(`- /api/pest     -> ${services.pest}`);
  console.log(`- /api/weather  -> ${services.weather}`);
  console.log(`- /api/chat     -> ${services.chat}`);
  console.log(`- /api/market   -> ${services.market}`);
  console.log(`=========================================`);
});
