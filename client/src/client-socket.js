import socketIOClient from "socket.io-client";
import { post } from "./utilities";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

export const move = (userId, gameId, position) => {
  socket.emit("move", position, gameId, userId);
};

export const tagPlayer = (gameId, tagged) => {
  socket.emit("tagged", gameId, tagged);
};

export const startGame = (gameId) => {
  socket.emit("startGame", gameId);
};
