import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB terhubung: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Gagal terhubung ke MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
