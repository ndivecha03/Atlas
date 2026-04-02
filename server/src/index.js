const path    = require('path');
const express = require('express');
const cors    = require('cors');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { chatRouter } = require('./routes/chat');

const REQUIRED_ENV = ['ANTHROPIC_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const app  = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8081').split(',');
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '50kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Atlas API' });
});

app.use('/api/chat', chatRouter);

app.listen(PORT, () => {
  console.log(`Atlas server running on port ${PORT}`);
});

