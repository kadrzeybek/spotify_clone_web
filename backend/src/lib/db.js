import mongoose from 'mongoose';


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log('Database is connected',conn.connection.host)
    } catch (error) {
        console.log('Failed to connect to MongoDB', error)
        process.exit(1);
    }
}