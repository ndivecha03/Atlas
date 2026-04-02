const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const { chatRouter } = require('./routes/chat');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Atlas API' });
});

app.use('/api/chat', chatRouter);

app.listen(PORT, () => {
  console.log(`Atlas server running on port ${PORT}`);
});

