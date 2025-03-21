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

    const existingSalesAgent = await SalesAgent.findById(salesAgent);
    if (!existingSalesAgent) {
      res
        .status(404)
        .json({ error: `Sales agent with ID ${salesAgent} not found` });
    }

    if (!name || !source || !status || !timeToClose || !priority) {
      res.status(404).json({ error: "Some field is missing" });
    }

    if (typeof name !== "string") {
      res.status(400).json({ error: "Name must be a string" });
    }

    const validSources = [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ];
    if (!validSources.includes(source)) {
      res
        .status(400)
        .json({ error: `Source must be one of: ${validSources.join(", ")}` });
    }

    const validStatuses = [
      "New",
      "Contacted",
      "Qualified",
      "Proposal Sent",
      "Closed",
    ];
    if (!validStatuses.includes(status)) {
      res
        .status(400)
        .json({ error: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const validPriorities = ["High", "Medium", "Low"];
    if (!validPriorities.includes(priority)) {
      res.status(400).json({
        error: `Priority must be one of: ${validPriorities.join(", ")}`,
      });
    }

    if (!Number.isInteger(timeToClose) || timeToClose < 0) {
      res
        .status(404)
        .json({ error: "Time to close must be a positive integer" });
    }

    if (!Array.isArray(tags)) {
      res.status(404).json({ error: "Tags must be an array" });
    }

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
app.get("/leads", async (req, res) => {
  try {
    const leads = await Lead.find().populate("salesAgent");
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/lead/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
    res.json(lead)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });

  }
})

//UPDATE API
app.put("/leads/:id", async (req, res) => {
  try {
    const leadId = req.params.id;
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    const existingSalesAgent = await SalesAgent.findById(salesAgent);
    if (!existingSalesAgent) {
      res
        .status(404)
        .json({ error: `Sales agent with ID ${salesAgent} not found` });
    }

    if (!name || !source || !status || !timeToClose || !priority) {
      res.status(404).json({ error: "Some field is missing" });
    }

    if (typeof name !== "string") {
      res.status(400).json({ error: "Name must be a string" });
    }

    const validSources = [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ];
    if (!validSources.includes(source)) {
      res
        .status(400)
        .json({ error: `Source must be one of: ${validSources.join(", ")}` });
    }

    const validStatuses = [
      "New",
      "Contacted",
      "Qualified",
      "Proposal Sent",
      "Closed",
    ];
    if (!validStatuses.includes(status)) {
      res
        .status(400)
        .json({ error: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const validPriorities = ["High", "Medium", "Low"];
    if (!validPriorities.includes(priority)) {
      res.status(400).json({
        error: `Priority must be one of: ${validPriorities.join(", ")}`,
      });
    }

    if (!Number.isInteger(timeToClose) || timeToClose < 0) {
      res
        .status(404)
        .json({ error: "Time to close must be a positive integer" });
    }

    if (!Array.isArray(tags)) {
      res.status(404).json({ error: "Tags must be an array" });
    }

    const updatedLeadData = await Lead.findByIdAndUpdate(
      leadId,
      { name, source, salesAgent, status, tags, timeToClose, priority },
      { new: true }
    );

    if (!updatedLeadData) {
      res.status(404).json({ error: "Lead not found" });
    }

    res.status(201).json(updatedLeadData);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error while updating the lead's details ${error}` });
  }
});

//DELETE API
app.delete("/leads/:id", async (req, res) => {
  const leadId = req.params.id;
  try {
    const deletedLead = await Lead.findByIdAndDelete(leadId);

    if (!deletedLead) {
      res.status(404).json({ error: `Lead with ${leadId} not found` });
    }

    res
      .status(200)
      .json({ message: "Lead deleted successfully", lead: deletedLead });
  } catch (error) {
    res.status(404).json({ error: `${error} while deleting a lead` });
  }
});

//SALES AGENT CREATE AND READ APIs
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
//POSTING COMMENT API
app.post("/leads/:id/comments", async (req, res) => {
  try {
    const leadId = req.params.id;
    const { author, commentText } = req.body;
    if (!author || !commentText) {
      return res.status(400).json({
        error: "Both author and commentText are required",
      });
    }

    const existingLead = await Lead.findById(leadId);
    if (!existingLead) {
      return res.status(404).json({
        error: `Lead with ID ${leadId} not found`,
      });
    }

    const newComment = new Comment({ lead: leadId, author, commentText });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(404).json({ error: `${error} while adding a comment` });
  }
});

//READING COMMENT API
app.get("/leads/:id/comments", async (req, res) => {
  try {
    const leadId = req.params.id;
    const comments = await Comment.find({ lead: leadId }).populate("author");
    res.status(200).json(comments);
  } catch (error) {
    res.status(404).json({ error: `${error} while adding a comment` });
  }
});

//REPORTING APIs
//CLOSE LAST WEEK API
app.get("/report/last-week", async (req, res) => {
  const leads = await Lead.find({ status: "Closed" });
  try {
    const today = new Date();
    const lastWeek = today.setDate(today.getDate() - 7);

    const lastWeekLead = leads.filter(
      (lead) => new Date(lead.createdAt) >= lastWeek
    );

    res.status(200).json(lastWeekLead);
  } catch (error) {
    res.status(404).json({ error: `${error} while getting last week leads` });
  }
});

//TOTAL LEADS IN PIPELINE API
app.get("/report/pipeline", async (req, res) => {
  const leads = await Lead.find();
  try {
    const pipelineLead = leads.filter((lead) => !(lead.status === "Closed"));
    // if (leads.filter((lead) => lead.))
    const count = pipelineLead.length;
    res.status(200).json({ totalLeadsInPipeline: count });
  } catch (error) {
    res.status(404).json({ error: `${error} while getting pipleline leads` });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT yeahhhh ${PORT}`);
});
