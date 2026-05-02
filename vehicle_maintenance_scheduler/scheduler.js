const Log = require("../logging_middleware/logger");

async function fetchData(url) {
  try {
    await Log("backend", "info", "service", "fetch data");

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (err) {
    await Log("backend", "error", "service", "fetch error");
    throw err;
  }
}

async function runScheduler() {
  try {
    await Log("backend", "info", "service", "start scheduler");

    await Log("backend", "info", "service", "fetch depot");
    const depotData = await fetchData(
      "http://20.207.122.201/evaluation-service/depots"
    );

    await Log("backend", "info", "service", "fetch vehicles");
    const vehicleData = await fetchData(
      "http://20.207.122.201/evaluation-service/vehicles"
    );

    // total capacity
    const capacity = depotData.depots.reduce(
      (sum, d) => sum + d.MechanicHours,
      0
    );

    const tasks = vehicleData.vehicles;
    const n = tasks.length;

    await Log("backend", "debug", "service", "start dp");

    const dp = Array.from({ length: n + 1 }, () =>
      Array(capacity + 1).fill(0)
    );

    for (let i = 1; i <= n; i++) {
      const { Duration, Impact } = tasks[i - 1];

      for (let w = 0; w <= capacity; w++) {
        if (Duration <= w) {
          dp[i][w] = Math.max(
            dp[i - 1][w],
            dp[i - 1][w - Duration] + Impact
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    await Log("backend", "info", "service", "dp done");

    // backtrack
    let w = capacity;
    const selectedTasks = [];

    for (let i = n; i > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selectedTasks.push(tasks[i - 1]);
        w -= tasks[i - 1].Duration;
      }
    }

    await Log("backend", "info", "service", "done");

    console.log("\n RESULT:");
    console.log("Max Impact:", dp[n][capacity]);
    console.log("Selected Tasks:", selectedTasks);
  } catch (err) {
    await Log("backend", "fatal", "service", "scheduler error");
    console.error("Error:", err.message);
  }
}

runScheduler();