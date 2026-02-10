import mongoose from "mongoose";

const ConnectMongodB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URL;

        // console.log("DB URL:", MONGO_URI);

        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default ConnectMongodB;
