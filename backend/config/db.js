//--------------------------------------------------IMPORT------------------------------------------------------------------------------------------------------------
const mongoose = require("mongoose");

//------------------------------------------DB CONNECTING FUNCTION----------------------------------------------------------------------------------------------
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");
        console.log("Database name:", mongoose.connection.name);
        console.log("MongoDB host:", mongoose.connection.host);

        return mongoose;

    } catch (error) {
        console.log("Database error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;