<template>
    <div>
        <el-col :span="24" class="main">
            <div class="group">
                <el-button v-show="power==='on'" type="success" @click="switchPower('off')" round>开</el-button>
                <el-button v-show="power==='off'" type="info" @click="switchPower('on')" round>关</el-button>
            </div>
            <div class="group" ref="modeGroup">
                <el-button plain type="primary" mode="cold">制冷</el-button>
                <el-button plain type="primary" mode="heat">制热</el-button>
                <el-button plain type="primary" mode="dehumidify">除湿</el-button>
                <el-button plain type="primary" mode="auto">智能</el-button>
                <el-button plain type="primary" mode="wind">送风</el-button>
                <!--<el-button plain @click="setMode('')">低风</el-button>-->
                <!--<el-button plain @click="setMode('')">中风</el-button>-->
                <!--<el-button plain @click="setMode('')">高风</el-button>-->
            </div>
            <div class="group">
                <!--@change = "setTemperature"-->
                <el-slider :step="1" :min="16" :max="30"  v-model="temperature" @change = "setTemperature" show-input>
                </el-slider>
            </div>
        </el-col>
    </div>
</template>

<script>
    // import HdSmart from '../../assets/http/index';
    // import { getProductList } from '../../assets/http/index';

    import HdSmart from "../../assets/socket";

    export default {
        name: 'control',
        data() {
            return {
                // 开关机状态
                power: 'on', //on,off
                //模式
                mode : 'auto',
                // 当前温度
                temperature: 0
            }
        },
        watch: {
            //开关机状态
            'power' :  (val)=>{
                let btn = this.$refs.powerBtn;
                if(val === 'on'){
                    btn.innerText = '开';
                    btn.classList.remove('el-button--info');
                    btn.classList.add('el-button--success');
                }else{
                    btn.innerText = '关';
                    btn.classList.remove('el-button--success');
                    btn.classList.add('el-button--info');
                }
            },
            // 'mode' : (val)=>{
            //     let modeGroup = this.$refs.modeGroup;
            // }
        },
        // created() {
        //     // 跟设备交互都放在ready之后
        //     // HdSmart.ready(() => {
        //         this.init();
        //         // //增加设备状态监听
        //         // HdSmart.onDeviceListen(data => {
        //         //     // if(data.method === 'dm_set'){
        //         //     //     if(data.code !==0) {
        //         //     //         this.init();
        //         //     //     }
        //         //     // }else{
        //         //     this.refreshStatus(data.result)
        //         //     // }
        //         // })
        //     // });
        // },
        mounted() {
            //切换模式，代码待优化。
            let btns = this.$refs.modeGroup.children;

            [].forEach.call(btns, btn=>{
                btn.addEventListener('click', ()=>{
                    let mode = btn.getAttribute('mode');
                    this.setMode(mode/*, ()=>{
                        [].forEach.call(btns, (btn)=>{
                            btn.classList.remove('cur');
                        })
                        btn.classList.add('cur')

                        this.refresh({mode});
                    }*/)
                });
            });

            // 初始化，获取设备快照
            HdSmart.Device.getSnapShot(data => {
                debugger;
                this.refresh(data);
            }, () => {

            });
        },
        methods: {
            // // 初始化，获取设备快照
            // init() {
            //     HdSmart.Device.getSnapShot(data => {
            //         this.refresh(data);
            //     }, () => {
            //
            //     });
            // },
            // 刷新状态
            refresh(attr) {
                console.info('status:::', attr);
                if(attr){
                    attr.switch && (this.power = attr.switch);
                    attr.mode && (this.mode = attr.mode);
                    attr.temperature && (this.temperature = attr.temperature);
                }
            },

            // 开关机
            switchPower (){
                // 根据当前态切换
                if (this.power === "on") {
                    this.setState('switch', {
                        "switch": "off"
                    })
                } else {
                    this.setState('switch', {
                        "switch": "on"
                    })
                }
            },

            // 设置模式
            setMode (mode){
                this.setState('mode', {
                    'mode' : mode
                });
            },

            // 设置温度
            setTemperature (temperature){
                console.log("温度：", temperature)
                this.setState('temperature', {
                    "temperature": +temperature
                })
            },

            // 设置***

            // 封装的状态设置器
            setState(nodeType, attr) {
                HdSmart.Device.control({
                        // method: 'dm_set',
                        nodeid: 'airconditioner.main.' + nodeType,
                        attribute: attr
                    }, ()=>{
                        console.log('设置成功');
                        // 更新状态
                        this.refresh(attr);
                        switch(nodeType){
                            case 'switch' :
                                this.power = attr.switch;
                                break;
                            case 'mode':
                                this.mode = attr.mode;
                                break;
                            case 'temperature':
                                this.temperature = +attr.temperature;
                                break;
                            default : void(0);
                        }
                        // callback && callback();
                    }, () => {
                        console.error('设置失败');
                    }
                );
            }
        }
    }
</script>

<style scoped>
    .group {
        /*font-size: 1.5em;*/
        /*padding: 4px 10px;*/
        margin: 2rem;
        /*border-radius: 10px;*/
    }
    .group button{
        margin : 0 2rem;
    }
</style>
