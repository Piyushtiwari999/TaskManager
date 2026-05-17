const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Ye process.env.MONGO_URI aapki .env file se aayega
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error; // Let the caller handle the error
    }
};

module.exports = connectDB;