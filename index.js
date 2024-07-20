const dotenv = require("dotenv");
const connectMongo = require("./config/mongodb.config");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT;
connectMongo();
app.get("", (req, res) => {
    res.status(200).send({ message: "Welcome my MMO!" });
});
app.listen(PORT, () => {
    console.log(`Server started on port ` + PORT);
});
