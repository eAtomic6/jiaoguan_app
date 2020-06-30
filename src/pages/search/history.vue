<template>
<div class="history" :class="{'bg-white':list.length===0}">
    <template v-if="list.length===0">
        <div class="no-history">
            <img :src="getImgUrl('no_history.png')" alt="">
            <p>暂无历史记录</p>
        </div>
    </template>
    <template v-else>
        <p class="history-title">历史记录</p>
        <ul>
            <li class="van-hairline--bottom textStyle" v-for="(item,index) in list" :key="index" @click="history(item)">{{item}}</li>
            <li @click="clearHistory"><i class="icon iconfont iconshanchu2"></i>清空历史记录</li>
        </ul>
    </template>
</div>
</template>

<script>
export default {
    name: "history",
    data(){
        return{
            list:[],
        }
    },
    created(){
        this.getHistoryList()
    },
    methods:{
        getImgUrl:function(url){
            return require('@/assets/img/'+url);
        },
        getHistoryList:function(){
            this.$ajax.get('/api/getSearchHistory').then(res=>{
                res=res.data
                if(res.status===200){
                    this.list=[].concat(res.data)
                }
            }).catch(error=>{
                this.$toast(error)
            })
        },
        history:function (item) {
            this.$emit('history',item)
        },
        clearHistory:function () {
            //请求清空接口
            debugger
            this.$ajax.put('/api/clearHistory').then(res=>{
                res=res.data
                if(res.status===200){
                    this.list=[]
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
@import "@/assets/common.less";
.history{
    height: calc(100%);
    overflow-y: scroll;
    position: relative;
    &.bg-white{
        background-color: @bg-white;
    }
    &-title{
        margin: 0;
        padding: 14px;
        font-size: 14px;
        background-color: @bg-grey;
        color: @text-grey-999;
    }
    >ul{
        margin: 0;
        padding: 0;
        /*position: absolute;
        top: 53px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: scroll;*/
        >li{
            color: @text-grey-333;
            padding: 14px;
            font-size: 16px;
            background-color: @bg-white;
            &:last-of-type{
                text-align: center;
                font-size: 12px;
                color: @text-grey-999;
                >i{
                    font-size: 12px;
                    padding-right: 5px;
                }
            }
        }
    }
}
    .no-history{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-100%);
        >img{
            width: 136px;
        }
        >p{
            font-size: 12px;
            text-align: center;
            color: @text-grey-999;
            margin-top: 20px;
        }
    }
</style>
