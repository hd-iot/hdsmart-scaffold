var io = require('socket.io-client');

var socket = io('http://localhost:12345');
// 自定义一个'news'事件
socket.on('news', function (data) {
    console.log(data);
    // 发送事件到服务端
    socket.emit('my other event', { my: 'data' });
});

