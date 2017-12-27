<template>
    <div>
        <div>{{title}}</div>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>

</template>

<style>

</style>

<script>
    export default {
        data() {
            return {
                title: '',
                userInfo : null
            }
        },
        created (){

        },
        mounted (){
            // console.log('App comp mounted.');
        },
        methods :{

        }
    }
</script>
