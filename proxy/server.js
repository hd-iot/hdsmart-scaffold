let express = require('express');
let app = express();

let config = require('../config/index');

// let server = require('https').createServer(ssl_options, app)
let server = require('http').createServer(app)
let io = require('socket.io').listen(server);

// 本地的websocket server ，同时也是相对路由器的socket client.
let proxy_client  =  require('./client')

let socket = null;
//暂存的消息队列
let messageList = [];

// 创建socket，监听连接
// io.on('connection', function (sock) {
io.sockets.on('connection', function (sock) {
    console.log('[proxy] 代理ws server和Web的连接通道已建立:', sock.conn.request.headers.origin );//&& sock.conn.handshake
    // 和web client建立连接后，将之前阻塞的消息队列逐一执行.TODO:最好是执行完了将其删掉。
    // messageList.forEach(msg=>{
    //     sock.emit('proxy dispatch', msg);
    // });

    // 收到web发过来的消息后原封不动的转发给路由器
    sock.on('send message', function (json) {
        // console.log('[proxy] 收到web发过来的消息:', Date.now(),  json);
        proxy_client.sendToRouter(json);
    });

    socket = sock;
});

io.sockets.on('disconnection', function () {
    console.log(`[proxy] 和客户端连接丢失`, arguments);
});

// 开启和本地web的socket server
const PORT = config.dev.socket_port;
server.listen(PORT, ()=>{
    console.log(`[proxy] websocket server running on "localhost:port(${PORT})"`)
});

/**
 * 收到代理客户端转发过来的路由器消息，下发给web
 * @param json {JSON}
 */
exports.dispatchToWeb = function(json){
    // console.log('[proxy] 下发给web的参数：', json)
    if(!socket){
        messageList.push(json);
        return console.warn('[proxy] 代理服务器收到路由器下发消息，但是和web的socket还没有建立连接。 消息：', json);
    }
    socket.emit('proxy dispatch', json);
}
