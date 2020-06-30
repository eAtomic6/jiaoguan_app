<template>
    <van-popup class="info-popup" :class="{'pt-60':getInput}" :value="getState" position="bottom" :style="{ height: '50%' }" @click-overlay="close">
        <div class="search-title" v-if="showTitle">
            <span>请选择{{titleForm[title]}}</span>
            <i class="iconfont iconguanbi" @click="close"></i>
        </div>
        <div class="search-box" v-if="getInput">
            <van-field v-model="value" placeholder="请输入" :clearable="true" @input="inputSearch" />
        </div>
        <van-list :class="{'h-100':getInput}">
            <van-cell v-for="item in !filterStep?getList:list" class="info-cell" :key="item[getProto]" :title="item.name" @click="chose(item)">
                <span class="active" v-if="activeDepId===item[getProto]"><i class="icon iconfont iconUtubiao-12"></i></span>
            </van-cell>
        </van-list>
    </van-popup>
</template>

<script>
import { Popup,List,Field } from 'vant';

export default {
    name: "searchDep",
    components: {
        [Popup.name]: Popup,
        [List.name]: List,
        [Field.name]: Field
    },
    props:{
        state:{
            type:Boolean,
            default:false
        },
        activeId:{
            type:Number,
            default:-99
        },
        checkProto:{
            type:String,
            default:'id'
        },
        list:{
            type:Array,
            default:function () {
                return [];
            },
            required:true
        },
        showInput:{
            type:Boolean,
            default:false
        },
        postFlag:{
            type:Boolean,
            default:false
        },
        showTitle:{
            type:Boolean,
            default:false
        },
        filterStep:{
            type:Boolean,
            default:false
        },
        title:{
            type:String,
            default:''
        }
    },
    data(){
        return{
            activeDepId:'',
            value:'',//关键字,
            titleForm: {
                'tranArea':'产权地址区域',
                'cardSituation':'两证情况',
                'mortgageSituation':'抵押情况',
                'maritalStatus':'婚姻状况',
                'transFlowName':'交易流程',
                'tranProcess':'交易流程',
                'landNature':'土地性质',
                'stagesBankName':'按揭银行',
                'buyerCardType':'证件类型',
                'sellerCardType':'证件类型',
                'bill':'款类',
            }
        }
    },
    created(){
        this.activeDepId=this.activeId
    },
    methods:{
        chose:function (item) {
            this.value=''//初始化搜索关键字
            if(this.activeDepId===item[this.getProto]){
                if(this.postFlag) {
                    this.activeDepId = item.key
                } else {
                    this.activeDepId=-99
                }
                this.$emit('chose')
            }else{
                this.activeDepId=item[this.getProto]
                this.$emit('chose',item)
            }
        },
        close:function(){
            this.value=''//初始化搜索关键字
            this.$emit('close')
        },
        inputSearch:function () {
            if(!this.filterStep) {
                this.$emit('searchList',{keyword:this.value}) 
            } else {
                // 交易步骤关键字模糊匹配
                this.$emit('searchStep',{keyword:this.value})
            }
        }
    },
    computed:{
        getState:function () {
            return this.state
        },
        getInput:function(){
            return this.showInput
        },
        getList:function () {
            let arr=[]
            this.list.map((item,index)=>{
                let type=Object.prototype.toString.call(item)
                if(type==='[object String]'){
                    arr.push({
                        id:index+1,
                        name:item
                    })
                }else{
                    arr.push(item)
                }
            })
            return arr
        },
        getProto:function () {
            return this.checkProto
        }
    },
    watch:{
        activeId:function(val){
            this.activeDepId=val
        }
    }
}
</script>

<style scoped lang="less">
@import "@/assets/common.less";
/deep/ .van-cell{
    &.info-cell{
        font-size: @font-base;
        height: 44px;
        .active{
            >i{
                font-size: 20px;
            }
        }
    }
}
.active{
    color: @text-green;
}
.info-popup{
    /deep/ .van-list{
        height: calc(100% - 50px);
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .van-cell {
            height: auto;
            align-items: center;
            &__title {
                flex: 11;
                color: @text-grey-333!important;
            }
        }
    }
}
.pt-60 {
    padding-top: 60px;
}
.h-100 {
    height: 100%!important;
}
.search-title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    position: relative;
    span {
        font-weight: bold;
    }
    i {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 20px;
    }
}
    .search-box{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        padding: 10px 0;
        /deep/ .van-cell{
            width: 90% !important;
            margin: 0 auto;
        }
    }
</style>
