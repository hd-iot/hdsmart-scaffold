<template>
    <div>
        <el-col :span="24" class="main">
            <div class="hint">产品列表:</div>
            <el-table
                :data="list"
                @row-click="onSelectProduct"
                style="width: 100%">
                <el-table-column
                    prop="brand_name"
                    label="品牌"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="type_name"
                    label="设备类型"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="type_txt"
                    label="入网方案"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="product_id"
                    label="设备id（ProductId）"
                    width="300">
                </el-table-column>
                <el-table-column
                    prop="updated_at"
                    label="最后更新日期"
                    width="300">
                </el-table-column>
            </el-table>
        </el-col>
    </div>
</template>

<script>
    import { getProductList } from '../../assets/http';

    export default {
        name: 'product-list',
        // props: {
        //     type: String
        // },
        data() {
            return {
                list : []
            }
        },
        mounted() {
            getProductList().then(data=>{
                console.log(data);
                this.list = data.data;
            });
        },
        methods: {
            onSelectProduct(row) {
                // console.log('current row : ', row);
                //TODO:测试数据
                let device_category_id = 1 //row.type_id
                    ,product_id = "000e83c6c1" //row.product_id 000e83c6c1
                // TODO:选定一个需要调试的商品后，立即给路由器发送请求(带上product id)；
                // 路由器对比设备真实id和参数product id，一致后路由器请求设备入网；
                // 入网成功之后，开发者就能调用socket api来调试设备了。
                window.HdSmart.linkDevice(device_category_id, product_id, json=>{
                    console.log('已经连接设备', json);
                    this.$router.push('/control');
                }, (code, msg, result)=>{
                    console.error(Array.from(arguments));
                })
            }
        }
    }
</script>

<style scoped>
    .list-ct {
        list-style: none;
    }

    .list {
        list-style: none;
        background: #EEF;
        font-size: 1.5em;
        padding: 4px 10px;
        margin: 6px 0;
        border-radius: 10px;
    }
</style>
