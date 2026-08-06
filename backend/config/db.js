//--------------------------------------------------IMPORT------------------------------------------------------------------------------------------------------------
const mongoose = require("mongoose");

//------------------------------------------DB CONNECTING FUNCTION----------------------------------------------------------------------------------------------
const connectDB = async () =>{

    try{

        await mongoose.connect(process.env.MONGO_URI);
        console.log("mogoDB connected");

        return mongoose;

    } catch(error){

        console.log("database error", error.message);

        process.exit(1);


    }
};

module.exports = connectDB;           // EXOPRTING PAGE FOR IMPORTS