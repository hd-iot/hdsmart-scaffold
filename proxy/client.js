/**
 * 张鸿提供的云端环境。路由器基本对应
 */
let proxy_server = require('./server')
let net = require('net');

let config = require('../config')
let HOST = config.dev.router_host;
let PORT = config.dev.router_port;

var client = new net.Socket();

// 按照标准的router回包格式拼凑json
let makeResponse = (method, code=0, msg='', result={})=>{
    return {
        "uuid": "00fbfca7bf0000000000000001026666",
        "encry": "false",
        "content": {
            method,
            "timestamp": Date.now(),
            "req_id": 0,
            code,
            msg,
            result
        }
    };
}

client.connect(PORT, HOST, function() {
    console.log('已连接路由器!!! : ' + HOST + ':' + PORT);
    // 建立连接后立即向服务器发送数据，服务器将收到这些数据
    _to_web(makeResponse('ready', 0, ''));
});

// 收到路由器下发的消息（接收的参数可以是string或者buffer，路由器给回来的是buffer）
client.on('data', function(jsonString) {
    if(jsonString instanceof Buffer){
        jsonString = jsonString.toString('utf8');
    }
    console.log('[proxy] 接收到路由器发过来的消息:', jsonString);
    let json = null;
    try{
        json = JSON.parse(jsonString);
    }catch(e){
        console.error('[proxy] 路由器下发的消息解析出错');
    }

    // 过滤掉状态上报等无用的消息
    let method = json.content['method'];
    if(json && (method !== 'mdp_msg')){
        _to_web(json);
    }
});

client.on('timeout', ()=>{
    console.info('连接超时！');
});
client.on('error', (e)=>{
    console.error('\n连接路由器出错:', e);
});
// 为客户端添加“close”事件处理函数
client.on('close', function() {
    console.warn('\n路由器连接已断开');
    let response = makeResponse('router_close', 0, '路由器连接已断开');
    _to_web(response);
});

//下发消息给web
function _to_web(json){
    proxy_server.dispatchToWeb(json);
}

//上传消息给路由器
function _to_router(json){
    client.write(JSON.stringify(json) + '\n');
}

/**
 * 转发WEB消息给路由器
 * @param json {JSON}
 */
exports.sendToRouter = function (json){
    console.log(' 发消息给路由器:\n', JSON.stringify(json, null, 2));
    _to_router(json);
}
