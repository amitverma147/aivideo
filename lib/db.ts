import mongoose from 'mongoose'

// Get MongoDB connection string from environment variables
const MONGODB_URI=process.env.MONGODB_URI!

// Check if MongoDB URI is defined
if(!MONGODB_URI){
    throw new Error("Please Define MONGODB_URI in env")
}

// Initialize cached mongoose instance
// This helps prevent multiple connections when the app reloads
let cached=global.mongoose
if(!cached){
    cached=global.mongoose={
    conn:null,    // Stores the active connection
    promise:null  // Stores the connection promise
   }
}

export async function connectToDatabase(){
    // If connection exists, return it
    if(cached.conn){
        return cached.conn
    }

    // If no existing promise, create new connection
    if(!cached.promise){
        const opts={
            bufferCommands:true,  // Queue operations if not connected
            maxPoolSize:10,       // Maximum number of connections in pool
        }
        // Create new connection and store promise
        mongoose.connect(MONGODB_URI,{}).then(()=>mongoose.connection)
    }

    try {
        // Wait for connection to establish
        cached.conn=await cached.promise
    } catch (error) {
        // Reset promise if connection fails
        cached.promise = null;
        throw error
    }

    // Return the database connection
    return cached.conn
}
