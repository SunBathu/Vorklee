import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 60000, // 30 seconds
            socketTimeoutMS: 60000,          // 45 seconds
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log("Database connected successfully!");
        return cached.conn;
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
}
