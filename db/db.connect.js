const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGODB;

const initialiseDatabase = async () => {
  await mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to databse yeahhh");
    })
    .catch((error) =>
      console.log(
        "You suck lmao here's the error while connecting to db",
        error
      )
    );
};

module.exports = { initialiseDatabase };
