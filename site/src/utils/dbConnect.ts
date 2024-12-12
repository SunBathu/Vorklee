import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env.local',
  );
}

// Define a type for the cached connection
interface CachedConnection {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Use global to prevent re-creating connections in development
declare global {
  var mongoose: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

export default async function dbConnect(): Promise<Connection> {
  // Check if a connection is already established
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string)
      .then((mongooseInstance) => {
        console.log('Database connected successfully');
        return mongooseInstance.connection;
      });
  }

  try {
    cached.conn = await cached.promise;
    global.mongoose = cached;
    return cached.conn;
  } catch (error) {
    console.error('Database connection error:', error);
    cached.promise = null;
    throw error;
  }
}
