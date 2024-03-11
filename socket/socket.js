import { Server } from "socket.io"; // Import lớp Server từ thư viện socket.io
import http from "http"; // Import module http
import express from "express"; // Import thư viện express

const app = express(); // Khởi tạo một ứng dụng Express

const server = http.createServer(app); // Tạo một máy chủ HTTP từ ứng dụng Express

const io = new Server(server, {
  // Tạo một đối tượng Server từ thư viện socket.io, kết nối với máy chủ HTTP
  cors: {
    origin: ["http://localhost:3000"], // Cấu hình CORS để chỉ cho phép kết nối từ nguồn http://localhost:3000
    methods: ["GET", "POST"], // Chỉ cho phép sử dụng phương thức GET và POST
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // Đối tượng để ánh xạ userId với socketId

io.on("connection", (socket) => {
  // Xử lý sự kiện khi có một client kết nối tới máy chủ Socket.io
  console.log("a user connected ", socket.id);

  const userId = socket.handshake.query.userId; // Lấy userId từ handshake của socket

  if (userId != "undefined")
    // Nếu userId không phải là "undefined"
    userSocketMap[userId] = socket.id; // Lưu trữ userId và socketId tương ứng

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Gửi danh sách người dùng đang online đến tất cả các client

  socket.on("disconnect", () => {
    // Xử lý sự kiện khi một client ngắt kết nối
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId]; // Xóa thông tin của client từ đối tượng userSocketMap
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Gửi lại danh sách người dùng đang online đến tất cả các client
  });
});

export { app, io, server }; // Xuất ứng dụng Express, đối tượng Server của Socket.io và máy chủ HTTP
