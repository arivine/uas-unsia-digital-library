import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { seedDatabase } from './config/seed.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  if (process.env.AUTO_SEED !== 'false') {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
};

start();
