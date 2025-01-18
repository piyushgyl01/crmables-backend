const express = require("express");
const app = express();

//DB IMPORT
const { initialiseDatabase } = require("./db/db.connect.js");

//MODELS IMPORT
const Lead = require("./models/lead.models.js");
const Comment = require("./models//comment.models.js");
const SalesAgent = require("./models/salesAgents.models.js");
const Tag = require("./models/tag.models.js");

initialiseDatabase();

app.use(express.json());

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("HELLO, DEVELOPER");
});

//LEAD CRUD APIs

//SALES AGENT CREATE AND READ APIs

//COMMENTS APIs

//REPORTING APIs

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT yeahhhh ${PORT}`);
});
