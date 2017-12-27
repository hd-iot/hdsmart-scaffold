var app = require('http').createServer()
var io = require('socket.io')(app);
// var fs = require('fs');

app.listen(12345);

// 创建socket，监听连接
io.on('connection', function (socket) {
    // 收到连接后，触发 'news' 事件
    socket.emit('news', { hello: 'world' });
    // 接收客户端事件
    socket.on('my other event', function (data) {
        console.log(data);
    });
});
