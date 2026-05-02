const getTopNotifications = require("./notificationProcessor");

const sampleData = {
  notifications: [
    { type: "Event", timestamp: "2024-01-01" },
    { type: "Placement", timestamp: "2024-01-02" },
    { type: "Result", timestamp: "2024-01-03" },
    { type: "Placement", timestamp: "2024-01-05" },
    { type: "Event", timestamp: "2024-01-04" }
  ]
};

(async () => {
  const result = await getTopNotifications(sampleData);
  console.log("Top Notifications:", result);
})();