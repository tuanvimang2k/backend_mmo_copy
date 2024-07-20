const mongoose = require("mongoose");

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
};
module.exports = connectMongo;
