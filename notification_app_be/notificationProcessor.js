const Log = require("../logging_middleware/logger");

async function getTopNotifications(data) {
  try {
    // priority mapping
    const priority = {
      Placement: 3,
      Result: 2,
      Event: 1,
    };

    await Log("backend", "info", "service", "start sort");

    const sorted = data.notifications.sort((a, b) => {
      if (priority[b.type] !== priority[a.type]) {
        return priority[b.type] - priority[a.type];
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    await Log("backend", "info", "service", "sort done");

    return sorted.slice(0, 10);
  } catch (err) {
    await Log("backend", "error", "service", "sort error");
    throw err;
  }
}

module.exports = getTopNotifications;