const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 12001;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the landing directory
app.use(express.static(path.join(__dirname, 'landing')));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'landing', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Landing page server is running on http://0.0.0.0:${PORT}`);
});