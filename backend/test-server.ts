import express from 'express';

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Minimal test server is alive!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TEST-SERVER] Listening on http://127.0.0.1:${PORT}`);
}).on('error', (err) => {
  console.error('[TEST-SERVER] Startup Error:', err);
});
