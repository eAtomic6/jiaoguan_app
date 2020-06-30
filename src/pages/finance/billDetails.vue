<template>
    <div class="bill-details">
        <div class="details-card">
            <p class="van-hairline--bottom"><i class="icon iconfont iconjiaobiao"></i>收款信息</p>
            <div v-if="$route.query.payway!==4" class="qrcode">
                <img :src="detailsMsg.RQcode" alt="">
                <p class="sm">扫码收款</p>
            </div>
            <ul class="payInfo">
                <li><span>收款 ID</span><span>{{detailsMsg.payCode}}</span></li>
                <li class="van-hairline--top"><span>合同编号</span><span>{{detailsMsg.contCode|getLabel}}</span></li>
                <li class="van-hairline--top"><span>房源</span><span>{{detailsMsg.contInfo&&detailsMsg.contInfo.houseInfo}}</span></li>
                <li class="van-hairline--top"><span>客源</span><span>{{detailsMsg.contInfo&&detailsMsg.contInfo.custInfo}}</span></li>
                <li class="van-hairline--top"><span>签约方式</span><span>{{detailsMsg.contInfo&&detailsMsg.contInfo.recordType}}</span></li>
                <li class="van-hairline--top"><span>合同类型</span><span>{{detailsMsg.contInfo&&detailsMsg.contInfo.contType}}</span></li>
                <li class="van-hairline--top address">
                    <span>物业地址</span>
                    <p>{{detailsMsg.address}}</p>
                </li>
                <li class="van-hairline--top"><span>付款方</span><span>{{detailsMsg.outObjType|getLabel}}-{{detailsMsg.outObj}}</span></li>
                <li class="van-hairline--top"><span>创建时间</span><span>{{detailsMsg.createTime|formatTime(true)}}</span></li>
                <li class="van-hairline--top"><span>收款人</span><span>{{detailsMsg.inObjStore}}-{{detailsMsg.inObjName}}</span></li>
            </ul>
        </div>
        <div class="details-card">
            <p class="van-hairline--bottom"><i class="icon iconfont iconjiaobiao"></i>合计金额</p>
            <ul>
                <li><span>款类</span><span>{{detailsMsg.moneyTypeName}}</span></li>
                <li class="van-hairline--top"><span>票据</span><span>{{detailsMsg.billCode|getLabel}}</span></li>
                <li class="van-hairline--top">
                    <span>支付方式</span>
                    <p>
                        <span v-if="detailsMsg.inAccount&&detailsMsg.inAccount.length>0">{{detailsMsg.inAccount[0].payMethod|getLabel}}</span>
                        <span v-else>{{detailsMsg.method}}</span>
                    </p>
                </li>
                <li class="van-hairline--top">
                    <span>金额（元）</span>
                    <p>
                        <span v-if="detailsMsg.inAccount&&detailsMsg.inAccount.length>0">{{detailsMsg.inAccount[0].amount}}</span>
                        <span v-else>{{detailsMsg.amount}}</span>
                    </p>
                </li>
                <li class="van-hairline--top">
                    <span style="display:block;min-width:80px">收款账户</span>
                    <p style="text-align:right">
                        <span v-if="detailsMsg.inAccount&&detailsMsg.inAccount.length>0">{{detailsMsg.inAccount[0].userName}}
                    {{detailsMsg.inAccount[0].bankName}} {{detailsMsg.inAccount[0].cardNumber}}</span>
                        <span v-else>--</span>
                    </p>
                </li>
                <li class="van-hairline--top"><span>状态</span><span>{{detailsMsg.statusName}}</span></li>
                <li class="van-hairline--top"><span>到账时间</span><span>{{detailsMsg.toAccountTime|formatTime(true)}}</span></li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "billDetails",
    data(){
        return{
            payId: 0,
            detailsMsg:{}
        }
    },
    created(){
        let param=this.$route.query
        this.payId=param.id
        this.getData()
    },
    methods:{
        getData(){
            this.$ajax.get('/api//payInfo/selectRevDetail',{payId:this.payId,type:1}).then(res=>{
                res=res.data
                if(res.status===200){
                    this.detailsMsg=Object.assign({},this.detailsMsg,res.data)
                }
            })
        }
    },
    computed:{
        ...mapGetters(["getUserMsg"]),
    },
    filters:{
        getLabel:function (val) {
            let type=Object.prototype.toString.call(val)
            if(type==='[object Number]'){
                return val
            }else if(type==='[object String]'){
                return val.length===0?'--':val
            }else if(type==='[object Object]'){
                return val.label||'-'
            }else{
                return '--'
            }
        }
    }
}
</script>

<style scoped lang="less">
@import "@/assets/common.less";
    .qrcode{
        padding: 10px 92px 30px 92px;
        img{
            width: 185px;
            height: 185px;
        }
    }
    .sm{
        text-align: center;
    }
    .payInfo{

    }
    .bill-details{
        background-color: @bg-grey;
        height: calc(100% - 60px);
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .details-card{
        background-color: @bg-white;
        margin-top: 10px;
        color:#333333;
        >p{
            font-size: @font-16;
            font-weight: bold;
            height: 44px;
            display: flex;
            align-items: center;
            padding: 0 30px;
            position: relative;
            >i{
                color: @text-green;
                font-size: 20px;
                position: absolute;
                top: 50%;
                left: 10px;
                transform: translateY(-50%);
            }
        }
        >ul{
            margin: 0 14px;
            >li{
                display: flex;
                align-items:center;
                justify-content: space-between;
                height: 44px;
                padding: 0 16px;
                &.address{
                    flex-direction: column;
                    align-items: flex-start;
                    height: auto;
                    padding: 14px 16px;
                    >p{
                        margin-top: 14px;
                    }
                }
                >span{
                    &:first-of-type{
                        color: @text-grey-BBB;
                    }
                }
            }
        }
    }
</style>
