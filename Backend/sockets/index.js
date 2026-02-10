import { Server } from "socket.io";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log(" User connected:", socket.id);

    socket.on("join-document", (documentId) => {
      socket.join(`document:${documentId}`);
      console.log(` Joined document:${documentId}`);
    });

    socket.on("disconnect", () => {
      console.log(" User disconnected:", socket.id);
    });
  });

  return io;
};
