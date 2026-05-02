const express = require("express");
const getTopNotifications = require("./notificationProcessor");
const Log = require("../logging_middleware/logger");

const app = express();
app.use(express.json());

app.post("/process-notifications", async (req, res) => {
  try {
    await Log("backend", "info", "controller", "process req");

    const result = getTopNotifications(req.body);

    await Log("backend", "info", "controller", "process done");

    res.json({ top: result });
  } catch (err) {
    await Log("backend", "error", "controller", "process fail");
    res.status(500).send("error");
  }
});

app.listen(3000, () => console.log("Server running"));