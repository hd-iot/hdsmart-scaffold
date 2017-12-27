/**
 * 后台接口，只返回json，url里面接受一个service的command参数。
 * 如果是post，则其他参数以key-value的形式丢在body里面,格式为form-data。
 * @type {string}
 */

const URL_PREFIX = 'https://devpho.evergrande.cn/api/index.php/';

// import axios from 'axios';
//
// //当前所有请求都是跨域的。
// axios.defaults.withCredentials = true;

export default function (command, config) {
    //method = 'get', params = {}
    let url = URL_PREFIX + command;
    let method = (config.method||'post').toLowerCase();
    let params = config.params || {};
    let needToken = !(config.needToken === false);//只有 显示指定为false，才不需要token，因为默认大多数场景需要token。
    let options = {
        method: method,
        mode: 'cors',
        redirect: 'follow',
        credentials: 'include'
    };

    //TODO: 无token跳转到登录页
    if(needToken && !window.user_info.token){
        console.warn('needToken:', needToken, ',   window.Token: ', window.user_info.token);
        window.vueInstance.$router.push('/login');
        return false;
    }

    //post请求的参数作为K-V形式以form-data提交，get的参数为search params。
    if (method === 'post') {
        // url = URL_PREFIX + command;
        options.headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            // 'Content-Type': 'multipart/form-data'
        };
        let paramsArray = [];
        Object.keys(params).forEach(key => {
            paramsArray.push(key + '=' + params[key])
        });
        options.body = paramsArray.join('&');
        // options.body = function(fd){
        //   Object.keys(params).forEach(key=>{
        //     fd.append(key, params[key]);
        //   });
        //   return fd;
        // }(new FormData());

    } else {
        let paramsArray = [];
        // params['service'] = command;
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
        // url = BASE_URL + '?' + paramsArray.join('&');
        url += ('?' + paramsArray.join('&'));
    }

    // console.log("===");
    return window.fetch(url, options).then(resp => {
        return resp.json();
    }).then(json=>{
        if(+json.code === 200){
            // console.log('dddd', json.result);
            return json.result;
        }else{
            // let vue = window.vueInstance;
            // if( Array.includes([401, 10001], +json.code) && vue.$router.path !== '/login' ){
            //     vue.$router.push({path: '/login'});
            // }
            // //其他类型的错误先弹出错误提示，再把错误信息给回业务侧,执行业务侧的回调。
            // vue.$message({
            //     message: (json.msg || '接口错误，请联系廖远忠'),
            //     type: 'error'
            // });


            return Promise.reject(json);
        }
    }, (err)=>{
        // window.vueInstance.$message({
        //     message: '网络错误。',
        //     type: 'error'
        // });
        console.error("ERROR:", err);
        return Promise.reject({
            msg : '网络错误。',
            code : 10086,
            success : 0
        });
    });
};
