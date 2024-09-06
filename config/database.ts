import mongoose, { connect } from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGOURL;
    mongoose.set('strictQuery', false);
    await connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
