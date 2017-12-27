
import request from './request';

/**
 * 登录
 */
export function doLogin(f_mail, f_password){
    return request('user/logintest',{
        needToken : false,
        params : {
            f_mail,
            f_password
        }
    })
}

/**
 * 获取当前账号下的产品列表
 */
export function getProductList(limit = 10){
    return request('product/listtest', {
        params : {
            token : window.user_info.token,
            limit
        }
    })
}

/**
 * 获取指定产品的相关的属性集合
 */
export function getProductProperties(pid){
    return request('prod/list', {pid})
}
