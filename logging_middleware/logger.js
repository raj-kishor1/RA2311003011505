
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

async function Log(stack, level, pkg, message) {
  try {
    const res = await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({ stack, level, package: pkg, message })
    });

    const data = await res.json();
    console.log("LOG:", data);
  } catch (err) {
    console.error("Log error:", err.message);
  }
}

module.exports = Log;