/**
 * 提供给业务模块的socket-sdk， 模拟android/iOS。调用方法一致，实现不同。
 */

import ws from './ws'
// import helper from '../helper';

let deviceInfo = {
    //品类ID
    category_id : 0,
    //设备ID
    uuid : '',
    //设备名
    name : ''
}

//TODO：这里只列出了空调控制页所用到的API。
const HdSmart = {
    // 注入HdSmart对象的步骤在此可以省略掉，跟app环境不一样，可以直接同步使用。
    ready (onSuccess){
        //此命令字只是在联通路由器时触发，并非具体业务。
        ws.attachCallback('ready', onSuccess);
    },

    // // 路由器断开提醒
    // onRouterClose (callback){
    //     ws.attachCallback('router_close', callback);
    // },

    //注册设备消息回调函数【只收不发】
    onDeviceListen (onSuccess){
        ws.attachCallback('device_listen', (result)=>{
            onSuccess(result);
        });
    },
    Device : {
        //获取设备状态【又发又收】
        getSnapShot (onSuccess, onFail){
            ws.getData('dm_get_device_info', null, onSuccess, onFail);
        },

        //发起控制操作【又发又收】
        control (data, onSuccess, onFail){
            // control({
            //     method: 'dm_set',
            //     nodeid: NODE_ID + type,
            //     params: {
            //         attribute: attr
            //     }
            // })
            ws.getData('dm_set', {
                nodeid : data.nodeid,
                params : {
                    attribute : data.attribute
                }
            }, onSuccess , onFail);
        }
    },
    //UI相关的，无需发路由器消息，纯本地代理就行了。
    UI : {
        hideLoading (){

        },
        showLoading (){

        }
    },

    //TODO 以下调试器独有的API:
    /**
     * @title 连接设备【product同device】
     * @param device_category_id {Number} 品类ID
     * @param product_id {String} 设备ID
     * @param onSuccess {Function}
     * @param onFail {Function}
     */
    linkDevice (device_category_id, product_id, onSuccess, onFail){
        let contentParams = {
            params : {
                device_category_id,
                product_id
            }
        };
        ws.getData('dm_add_device', contentParams, result =>{
            // 设置品类id和设备uuid
            deviceInfo.category_id = device_category_id;
            deviceInfo.uuid = product_id;
            deviceInfo.name = result.name;
            console.log('已添加设备:',deviceInfo);
            onSuccess(result);
        }, onFail);
    },

    /**
     * @title 断开设备
     * @param device_uuid
     * @param onSuccess
     * @param onFail
     */
    unlinkDevice (device_uuid, onSuccess, onFail){
        let contentParams = {
            params : { device_uuid }
        };
        ws.getData('dm_del_device', contentParams, result=>{
            // 重置设备信息
            deviceInfo.category_id = 0;
            deviceInfo.uuid = '';
            deviceInfo.name = '';
            onSuccess(result);
        }, onFail);

        // ({
        //     "uuid": "111",
        //     "encry": "false",
        //     "content": {
        //         "method": "dm_del_device",
        //         "req_id": 86454,
        //         "params": {
        //             "device_uuid": "000e83c6c10100000000000002020143",
        //             "family_id": 5555,
        //             "user_id": 5555
        //         }
        //     }
        // })
    }
};

window.HdSmart = HdSmart;

export default HdSmart;
