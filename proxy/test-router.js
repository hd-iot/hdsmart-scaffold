/**
 * 模拟路由器，启动本地的socket服务。
 */
let net = require('net');

let devConfig = require('../config').dev
const HOST = devConfig.router_host
const PORT = devConfig.router_port

/*
请求格式：
{
    "uuid": "00fbfca7bf000000000000000102666",// 调试模式固定
    "encry": "false",// 调试模式固定
    "content": {
        method,
        "timestamp": Date.now(),
        req_id,
        "params": {
            "family_id": 5555, // 调试模式固定
            "room_id": 1,// 调试模式固定
            "user_id": 5555,// 调试模式固定
        }
    }
}
回包格式:
    {
        "uuid": "00fbfca7bf0000000000000001026666",
        "encry": "false",
        "content": {
            "method": "ready",
            "timestamp": Date.now(),
            "req_id": 0,
            "msg": "",
            "code": 0,
            "result": {}
        }
    }
 */

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function(sock) {

    // 收到一个连接，同时自动获到一个socket对象
    console.log(`[router] 【已连接本地的NodeJS代理客户端】：${sock.remoteAddress} : ${sock.remotePort}`);

    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(jsonString) {
        let json = JSON.parse(jsonString);
        // sock.write('You said "' + data + '"');
        // sock.destroy('some error occupid.');
        console.log(`[router] ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆  收到Nodejs代理客户端消息： \n${JSON.stringify(json, null, 4)}`);

        let content = json.content,
            method = content.method,
            req_id = content.req_id,
            params = content.params

        switch (method){
            // 设备入网
            case 'dm_add_device' :
                setResponse(method, req_id, 0, '', {

                });
                break;
            // 设备退网
            case 'dm_del_device' :
                setResponse(method, req_id, 0, '', {

                });
                break;
            //获取设备快照
            case 'dm_get_device_info' :
                setResponse(method, req_id, 0, '', {
                    "status_modified_at": 1513838888747,
                    "family_id": 5555,
                    "device_id": 33685827,
                    "device_name": "柜式空调",
                    "default_device_name": "柜式空调",
                    "device_category_id": 1,
                    "device_uuid": "000e83c6c10100000000000002020143",
                    "updated_at": 1513838888,
                    "attribute": {
                        "operation": "abnormal",
                        "deviceModel": "KFR-50LW/10CBB23AU1",
                        "manufactureId": "haier",
                        "deviceCategory": "airconditioner.new",
                        "deviceSubCategory": 1,
                        "connectivity": "online"
                    }
                });
                break;
            //用户主动控制设备
            case 'aaa' :
                setResponse(method, req_id, 0, '', {

                });
                break;
            default : return false;
        }

        // //模拟路由器定时下发一个设备状态消息
        // setInterval(()=>{
        //     deviceInfoChangeInterval(sock);
        // }, 1e4);
    });

    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function() {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

    // console.log('[router] Rest Router Disconnection.');

    function setResponse(method, req_id=0, code=0, msg='', result={}){
        const Delay = 2e3;
        setTimeout(()=>{
            let resposne = JSON.stringify({
                "uuid": "00fbfca7bf0000000000000001026666",
                "encry": "false",
                "content": {
                    method, // 命令字
                    "timestamp": Date.now(),
                    req_id, // requestid
                    code, // 错误码
                    msg, //错误消息
                    result //结果
                }
            });
            sock.write(resposne);
        }, Delay);
    }

}).on('error', err=>{
    console.log(`[router] 模拟服务器出错了,` , err);
}).listen({ host: HOST, port: PORT }, ()=>{
    console.log(`[router] 模拟路由器的socket server已启动:${HOST}:${PORT}`);
});


//监听路由器的状态回包（结构比较奇特）：
function deviceInfoChangeInterval(sock) {
    let time = Date.now();
    let json = {
        "uuid": "00fbfca7bf0000000000000001026666",
        "encry": "false",
        "content": {
            "method": "mdp_msg",
            "req_id": 0 , // 路由器下发的也不重复
            "timestamp": time,
            "params": {
                "msg_type": "R2F",
                "target_id": 5555,
                "content": {
                    "method": "dr_report_dev_status",
                    "timestamp": time,
                    "result": {
                        "status_modified_at": 1513838888747,
                        "family_id": 5555,
                        "device_id": 33685827,
                        "device_name": "柜式空调",
                        "default_device_name": "柜式空调",
                        "device_category_id": 1,
                        "device_uuid": "000e83c6c10100000000000002020143",
                        "updated_at": time,
                        "attribute": {
                        "operation": "abnormal",
                            "deviceModel": "KFR-50LW/10CBB23AU1",
                            "manufactureId": "haier",
                            "deviceCategory": "airconditioner.new",
                            "deviceSubCategory": 1,
                            "connectivity": "online"
                        }
                    }
                }
            }
        }
    };
    return sock.write(JSON.stringify(json));
}

/*
添加空调的回包:
{
    "uuid": "00fbfca7bf0000000000000001026666",
    "encry": "false",
    "content": {
        "method": "dm_add_device",
        "timestamp": 1513838890,
        "req_id": 1002,
        "msg": "success",
        "code": 0,
        "result": {
            "device_uuid": "000e83c6c10100000000000002020143",
            "user_id": 5555,
            "device_name": "柜式空调",
            "family_id": 5555,
            "room_id": 1,
            "room_name": "room1",
            "device_category_id": 1,
            "bussiness_user_id": 0,
            "device_id": 33685827,
            "create_at": 1513652242,
            "update_at": 1513652242,
            "attribute": {
                "operation": "abnormal",
                "deviceModel": "KFR-50LW/10CBB23AU1",
                "manufactureId": "haier",
                "deviceCategory": "airconditioner.new",
                "deviceSubCategory": 1,
                "connectivity": "online"
            }
        }
    }
}
*/
