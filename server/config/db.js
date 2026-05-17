const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Ye process.env.MONGO_URI aapki .env file se aayega
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Error hone par process band kar do
    }
};

module.exports = connectDB;