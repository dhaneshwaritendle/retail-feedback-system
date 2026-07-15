
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
