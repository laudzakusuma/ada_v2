import { io } from "socket.io-client";

export const socket = io("http://localhost:8000");

socket.on("connect", () => {
  console.log("socket connected");
});

socket.on("viewer:command", (data) => {
  console.log("viewer command:", data);

  window.dispatchEvent(
    new CustomEvent("viewer-command", { detail: data })
  );
});

socket.on("ui:speaking", (value) => {
  window.dispatchEvent(
    new CustomEvent("ui-speaking", { detail: value })
  );
});
