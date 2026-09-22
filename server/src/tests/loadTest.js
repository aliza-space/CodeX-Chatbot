import http from "node:http";

const HOST = process.env.TEST_HOST || "localhost";
const PORT = process.env.TEST_PORT || 5000;
const CONCURRENT_USERS = parseInt(process.env.CONCURRENCY || "25", 10);
const PATH = "/health";

console.log(`🚀 CodeX API Concurrency Benchmark`);
console.log(`Simulating ${CONCURRENT_USERS} concurrent requests to http://${HOST}:${PORT}${PATH}...\n`);

const start = Date.now();
let completed = 0;
let success = 0;
let failed = 0;
const latencies = [];

for (let i = 0; i < CONCURRENT_USERS; i++) {
  const reqStart = Date.now();
  const req = http.get({ host: HOST, port: PORT, path: PATH }, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      latencies.push(Date.now() - reqStart);
      if (res.statusCode === 200) success++;
      else failed++;
      checkDone();
    });
  });

  req.on("error", (err) => {
    latencies.push(Date.now() - reqStart);
    failed++;
    checkDone();
  });
}

function checkDone() {
  completed++;
  if (completed === CONCURRENT_USERS) {
    const totalDuration = Date.now() - start;
    latencies.sort((a, b) => a - b);

    const avg = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1);
    const p50 = latencies[Math.floor(latencies.length * 0.5)];
    const p95 = latencies[Math.floor(latencies.length * 0.95)];
    const p99 = latencies[Math.floor(latencies.length * 0.99)];

    console.log("📊 Benchmark Results:");
    console.log(`- Total Requests: ${CONCURRENT_USERS}`);
    console.log(`- Successful: ${success}`);
    console.log(`- Failed: ${failed}`);
    console.log(`- Total Time: ${totalDuration}ms`);
    console.log(`- Average Latency: ${avg}ms`);
    console.log(`- P50 Latency: ${p50}ms`);
    console.log(`- P95 Latency: ${p95}ms`);
    console.log(`- P99 Latency: ${p99}ms\n`);
  }
}
