// Minimal Server-Sent-Events helper used by chat.controller.js

export function initSSE(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no", // disable nginx buffering if present
  });
  res.flushHeaders?.();
}

export function sendSSE(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

export function endSSE(res) {
  res.write("event: done\ndata: {}\n\n");
  res.end();
}
