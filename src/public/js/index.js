const socket = io();

socket.emit("message", "Message from Frontend!");

socket.on("message", (data) => {
  console.log(data);
});
