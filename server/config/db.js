import mongoose from "mongoose"

const connectDB = async () => {
  try {
    // Check if MONGO_URI is provided
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI environment variable is not set!")
      console.error("Please set your MongoDB Atlas connection string in the .env file")
      process.exit(1)
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    console.error("Please check your MongoDB Atlas connection string")
    process.exit(1)
  }
}

export default connectDB
