const WebSocket = require("ws");

// 创建 WebSocket 服务器实例，监听指定的端口
const wss = new WebSocket.Server({ port: 8080 });
let clients = [];
// 监听连接事件
wss.on("connection", (ws) => {
  console.log("有新的客户端连接");

  // 监听消息接收事件
  ws.on("message", (message) => {
    let obj = null;
    try {
      obj = JSON.parse(message);
    } catch (error) {}
    if (obj.type === "init") {
      console.log(`客户端初始化`, obj);
      ws.id = obj.id;
      ws.status = obj.status;
      clients = clients.filter((client) => client.id !== ws.id);
      clients.push(ws);
    }
    // 向客户端广播发送消息
    clients.forEach((client) =>
      client.send(
        JSON.stringify({
          type: "status",
          data: clients.map((client) => ({
            id: client.id,
            status: client.status,
          })),
        })
      )
    );
  });

  // 监听连接关闭事件
  ws.on("close", () => {
    console.log("客户端连接关闭");
    console.log(`ws.id`, ws.id, clients);
    clients = clients.filter((client) => client.id !== ws.id);
    console.log(`clients.length`, clients.length);
  });
});

console.log("WebSocket 服务器已启动，监听端口 8080");
