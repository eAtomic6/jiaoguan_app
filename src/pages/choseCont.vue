<template>
    <van-popup v-model="showContTypeDialog" :close-on-click-overlay="false" @click-overlay="closeWeb">
        <ul class="entry-contlist">
            <li>请选择合同类型</li>
            <li v-for="item in contType" class="van-hairline--top" :class="{'active':activeCont===item.id}" :key="item.id" @click="choseContType(item)">
                <span>{{item.name}}</span>
                <span v-if="activeCont===item.id"><i class="icon iconfont iconUtubiao-12"></i></span>
            </li>
        </ul>
    </van-popup>
</template>

<script>
import { Popup } from 'vant';
export default {
    name: "choseCont",
    components:{
        [Popup.name]:Popup
    },
    data(){
        return{
            showContTypeDialog:true,
            contType:[
                {name:'意向',id:4},
                {name:'定金',id:5}
            ],
            activeCont:0,
            houseId: -1
        }
    },
    created(){
        let param=this.$route.query
        console.log(param)
        if(param.houseCode){
            if(param.houseCode.indexOf('S')>-1){//买卖
                this.contType=[{name:'买卖',id:2}, {name:'代办',id:3}].concat(this.contType)
            }
            if(param.houseCode.indexOf('Z')>-1){//租赁
                this.contType=[{name:'租赁',id:1}].concat(this.contType)
            }
        }
        //判断是否为创建合同页
        if(param.houseId){
            this.houseId=param.houseId
        }
    },
    methods:{
        choseContType:function(item){
            this.activeCont=item.id
            this.$router.replace({
                path:'/addContract',
                query:{
                    houseId: this.houseId,
                    contType: this.activeCont
                }
            })
        },
        //点击遮罩层关闭页面
        closeWeb(){
            // Android
            document.location = "js://close";
            //IOS
            window.webkit.messageHandlers.close.postMessage("");
        },
    }
}
</script>

<style scoped lang="less">
@import "@/assets/common.less";
.entry-contlist{
    min-width: 300px;
    >li{
        padding: 14px;
        &:first-of-type{
            text-align: center;
        }
        &.active{
            position: relative;
            >span{
                color: @text-green;
                &:last-of-type{
                    position: absolute;
                    top: 50%;
                    right: 16px;
                    transform: translateY(-50%);
                }
            }
        }
    }
}
</style>
