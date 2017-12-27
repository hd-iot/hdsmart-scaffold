/**
 * 辅助类方法
 */
export default {

    /**
     * 获取设备device_uuid
     * @returns {string}
     */
    getDeviceUUID() {
        return window.device_uuid;
    },

    /**
     * 获取设备device_name
     * @returns {string}
     */
    getDeviceName () {
        return window.device_name;
    },

    /**
     * 获取设备类型
     * @returns {}
     */
    getDeviceCategory() {
        return window.device_category_id;
    },

    /**
     * 断言value的数据类型为type。
     * @param type {String|Constructor} 如'String' 或者 String
     * @param value {*}
     * @returns {boolean}
     */
    is (type, value){
        if(typeof type === 'function'){
            type = type.name;
        }
        return Object.prototype.toString.call(value) === `[object ${type}]`;
    }
}
