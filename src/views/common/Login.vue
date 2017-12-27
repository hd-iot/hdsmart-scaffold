<template>
    <el-form label-position="left" label-width="0px" class="login-container">
        <h3 class="title">系统登录(厂商开放平台的账号密码)</h3>
        <el-form-item>
            <el-input type="text" v-model="uid" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="password" v-model="pwd" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button style="width:100%;" type="primary" @click="onLogin">登　录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    //    import {requestLogin} from '../http/http';
    import { doLogin } from '../../assets/http/index';
    export default {
        data() {
            return {
                uid : 'brynden.mao@qq.com',
                pwd : 'mbn19830101',
                checked : true,
                rules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ]
                },
                checked: true
            };
        },
        methods: {
            onLogin() {
                doLogin(this.uid, this.pwd).then(data=>{
                    console.info("data:", data);
                    //TODO: 获取到的登录用户信息，后面想办法优化成全局不可改的对象
                    window.user_info = data;
                    // window.Token = data.token;
                    window.vueInstance.$router.push('/products');
                })

            }
        }
    }

</script>

<style scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        /*.title {*/
        /*margin: 0px auto 40px auto;*/
        /*text-align: center;*/
        /*color: #505458;*/
        /*}*/
        /*.remember {*/
        /*margin: 0px 0px 35px 0px;*/
        /*}*/
    }
    /*.el-input, .el-button{*/
        /*margin : 10px 0;*/
    /*}*/
    /*.el-button{   margin: 0 auto; }*/
</style>
