const path = require("path");
const express = require("express");
const queueService = require("./queueService");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"), { index: false })); 

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "landing.html"));
});

app.get("/queue", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.post("/api/join", (req, res) => {
  try {
    const snapshot = queueService.joinQueue(req.body.customerName || "");
    res.status(201).json(snapshot);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

app.get("/api/queue", (req, res) => {
  res.json(queueService.createQueueSnapshot(req.query.ticket || null));
});

app.post("/api/call-next", (req, res) => {
  res.json(queueService.callNext());
});

app.post("/api/skip/:ticket", (req, res) => {
  try {
    res.json(queueService.skipTicket(req.params.ticket));
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

app.post("/api/remove/:ticket", (req, res) => {
  try {
    res.json(queueService.removeTicket(req.params.ticket));
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

app.post("/api/pause", (req, res) => {
  res.json(queueService.pauseQueue());
});

app.post("/api/resume", (req, res) => {
  res.json(queueService.resumeQueue());
});

app.listen(PORT, () => {
  console.log(`Q Master is running on port ${PORT}`);
});
