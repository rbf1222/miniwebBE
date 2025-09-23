// server.js
import dotenv from 'dotenv';

import app from './app.js'
import config from './config/config.js';

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 