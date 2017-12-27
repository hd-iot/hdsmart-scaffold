import helper from '../helper'
let io = require('socket.io-client');

//注意端口和 `/config/index.js` 里面的配置项dev.socket_port对应
// 配置选项：https://socket.io/docs/client-api/#new-manager-url-options
const socket = io('ws://localhost:18306', {
    transports:['websocket'],
    // reconnection : false,
    reconnectionDelay : 2000
});

//请求的唯一标识，一般传给server，server再透传回来。
let __req_id = 1e3; //起始request id，全局唯一
const CallbackMaps = {};

socket.on('connect', function () {
    console.log('web和ws proxy server 已连接!')
});

//收到代理服务器转发路由器过来的事件
socket.on('proxy dispatch', result => {
    // console.info('server dispatch data:', result);
    // 回包数据结构异常判断
    let formatError = !helper.is('Object', result)
        || !helper.is('Object', result.content)
        || !result.content.method;
    if(formatError){
        return console.error('路由器下发的基本数据结构异常：', result);
    }

    let method = result.content.method,
        req_id = result.content.req_id;

    let thisMethodCallbacks = CallbackMaps[method];
    if(!thisMethodCallbacks){
        return console.warn(`在回调集合里面没找到对应的回调："${method}"`, result);
    }

    let callback = thisMethodCallbacks[req_id];
    if(helper.is('Function', callback)){
        callback(result);
    }else{
        console.error('没有找到对应的回调', method, req_id, result);
    }

});

socket.on('disconnect', function () {
    console.error('web和ws proxy server 连接断开!')
});

//统一管理request_id
function increaseReq(){
    return ++ __req_id;
}

// method和req_id是必须参数，data是基于baseParams.content基础之上的可选扩展参数
function _send(method, req_id, data){
    let baseParams = {
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
    };
    Object.assign(baseParams.content, data);
    socket.emit('send message', baseParams);
}

/**
 * 往回调map里面增加一项。
 * @param method {String} 命令字
 * @param reqId {Number} 全局唯一的request id.
 * @param callbacks {Object} 回调函数。包含success和fail.
 * @private
 */
function _attach(method, reqId, callbacks){
    let thisMethodCallbacks = CallbackMaps[method];
    if(!thisMethodCallbacks){
        CallbackMaps[method] = {};
        thisMethodCallbacks = CallbackMaps[method];
    }
    thisMethodCallbacks[reqId] = (result)=>{
        let onSuccess = callbacks.success,
            onFail = callbacks.fail

        /* 数据结构举例：
        {
            "uuid": "00fbfca7bf0000000000000001026666",
            "encry": "false",
            "content": {
                "method": "dm_add_device",
                "timestamp": 1513330431,
                "req_id": 1002,
                "msg": "Timeout",
                "code": -83003,
                "result": {}
            }
        }
        */
        // 异常判断
        let error = false;
        // 基本结构检查
        if( !helper.is('Object', result) || !helper.is('Object', result.content) ){
            error = [-12580, '回包数据结构异常'];
        } else if(result.content.method !== method){
            error = [-10086, '回包的命令字对不上'];
        }else if(+result.content.code !== 0){
            error = [result.content.code, result.content.msg];
        }

        if(error){
            onFail && onFail(error[0], error[1], result);
        }else{
            onSuccess && onSuccess(result.content.result);
        }
        // 执行完回调后立即从map中解除。
        delete thisMethodCallbacks[reqId];
    }
}

//抛出三种类型的接口：只发不收、只收不发、又收又发
export default {
    //只发不收。一般用于弱场景，如上报log. TODO:暂时没有此类场景需求。
    sendMessage (method, params = {}){
        // params[method] = method;
        let reqId = increaseReq();
        _send(method, reqId, params);
    },
    //只收不发。回调可以响应一次或者无限次
    attachCallback (method, success, fail){
        let reqId = increaseReq();
        _attach(method, reqId, {success, fail});
    },
    //又发又收。需要一一对应，类似http request<->response
    getData (method, data = {}, success, fail){
        console.info(`method:${method}`, data);
        let req_id = increaseReq();
        _send(method, req_id, data);
        _attach(method, req_id, {success, fail});
    }
};

//TODO:用于调试，后面删掉
window.CallbackMaps = CallbackMaps;
