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

//CREATE API
app.post("/leads", async (req, res) => {
  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    const savedLead = new Lead({
      name,
      source,
      salesAgent,
      status,
      tags,
      timeToClose,
      priority,
    });
    await savedLead.save();
    res.status(200).json(savedLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//READ API

//UPDATE API

//DELETE API

//SALES AGENT CREATE AND READ APIs

// async function saveSalesAgentsData(data) {
//   const savedData = await SalesAgent.insertMany(data);
//   console.log("Yeah saved these sales agents in the DB", salesAgents)
//   try {
//   } catch (error) {
//     console.log("You suck lmao see this error while saving to DB lol", error);
//   }
// }

// saveSalesAgentsData()

//CREATE API
app.post("/salesAgent", async (req, res) => {
  try {
    const { name, email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingSalesAgent = await SalesAgent.findOne({ email });
    if (existingSalesAgent) {
      res.status(409).json({
        error: `Sales agent with email ${existingSalesAgent.email} already exists.`,
      });
    }

    const savedSalesAgent = new SalesAgent({ name, email });
    await savedSalesAgent.save();
    res.status(200).json(savedSalesAgent);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Invalid input: 'email' must be a valid email address." });
  }
});

//READ API
app.get("/salesAgent", async (req, res) => {
  try {
    const salesAgents = await SalesAgent.find();
    res.json(salesAgents);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//COMMENTS APIs

//REPORTING APIs

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT yeahhhh ${PORT}`);
});
