/**
 * 张鸿提供的云端环境。路由器基本对应
 */
var net = require('net');

var HOST = '120.76.199.208';
var PORT = 1000;

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // 建立连接后立即向服务器发送数据，服务器将收到这些数据
    client.write('{\"uuid\":\"111\", \"encry\":\"false\", \"content\":{\"method\":\"um_login_pwd\",\"timestamp\":12345667,\"req_id\":123,\"params\":{\"phone\":\"13316825575\",\"pwd\":\"96e79218965eb72c92a549dd5a330112\",\"os_type\":\"Android\"}} }\n');

});

// 为客户端添加“data”事件处理函数
// data是服务器发回的数据
client.on('data', function(data) {

    console.log('DATA: ' + data);
    // 完全关闭连接
    // client.destroy();

});

// 为客户端添加“close”事件处理函数
client.on('close', function() {
    console.log('Connection closed');
});
