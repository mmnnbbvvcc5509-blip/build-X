const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 12001;

// Enable CORS for all routes
app.use(cors());

// Proxy all requests to the Expo development server
app.use('/', createProxyMiddleware({
  target: 'http://localhost:19006',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug'
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server is running on http://0.0.0.0:${PORT}`);
});