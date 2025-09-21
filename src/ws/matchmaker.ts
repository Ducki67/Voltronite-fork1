import { WebSocketServer } from "ws";
import crypto from "crypto";
import { Logger } from "../utils/logger";

const port = Number(process.env.MATCHMAKER_PORT!);
const wss = new WebSocketServer({ port });

wss.on("listening", () => {
  Logger.matchmaker(
    `Voltronite Matchmaker successfully started on port ${port}`
  );
});

wss.on("connection", (ws) => {
  const ticketId = crypto
    .createHash("md5")
    .update(`1${Date.now()}`)
    .digest("hex");
  const matchId = crypto
    .createHash("md5")
    .update(`2${Date.now()}`)
    .digest("hex");
  const sessionId = crypto
    .createHash("md5")
    .update(`3${Date.now()}`)
    .digest("hex");

  const events = [
    { delay: 200, name: "StatusUpdate", payload: { state: "Connecting" } },
    {
      delay: 1000,
      name: "StatusUpdate",
      payload: { totalPlayers: 1, connectedPlayers: 1, state: "Waiting" },
    },
    {
      delay: 2000,
      name: "StatusUpdate",
      payload: {
        ticketId,
        queuedPlayers: 0,
        estimatedWaitSec: 0,
        status: {},
        state: "Queued",
      },
    },
    {
      delay: 6000,
      name: "StatusUpdate",
      payload: { matchId, state: "SessionAssignment" },
    },
    {
      delay: 8000,
      name: "Play",
      payload: { matchId, sessionId, joinDelaySec: 1 },
    },
  ];

  events.forEach(({ delay, name, payload }) => {
    setTimeout(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ name, payload }));
      }
    }, delay);
  });
});
