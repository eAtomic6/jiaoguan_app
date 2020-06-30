<template>
    <div class="view-container view-box" ref="detail">
        <ul class="post-detail-box">
            <!-- pageType 0后期接收 1后期管理 2后期监控 -->
            <li class="van-hairline--bottom"><span>合同编号</span><span>{{postDetail.code}}</span></li>
            <li class="van-hairline--bottom"><span>签约方式</span><span>{{postDetail.recordType&&postDetail.recordType.label}}</span></li>
            <li class="van-hairline--bottom" v-if="pageType===0"><span>签约时间</span><span>{{postDetail.signDate|formatTime(false)}}</span></li>
            <li class="van-hairline--bottom" v-else><span>接收日期</span><span>{{postDetail.receiveTime|formatDate}}</span></li>
            <li class="van-hairline--bottom" v-if="pageType!=2"><span>后期状态</span><span>{{postDetail.statusLaterStage&&postDetail.statusLaterStage.label}}</span></li>
            <li class="van-hairline--bottom"><span>物业地址</span><span>{{postDetail.propertyAddr|formatNull}}</span></li>
            <li class="van-hairline--bottom"><span>交易流程</span><span>{{postDetail.transFlowName|formatNull}}</span></li>
            <li class="van-hairline--bottom"><span>产权地址</span><span>{{postDetail.propertyRightAddr|formatNull}}</span></li>
            <li class="van-hairline--bottom"><span>业主</span><span>{{pageType===1?ownerList.name:postDetail.owner}}</span></li>
            <li class="van-hairline--bottom" v-if="pageType===1"><span>业主电话</span><span class="phone-box"><span class="phone">{{ownerList.mobile|formatMobile}}</span><van-icon class="phone-icon" name="phone-circle" v-if="power['sign-ht-xq-ly-call'].state" @click="callFn(ownerList)" /></span></li>
            <li class="van-hairline--bottom"><span>客户</span><span>{{pageType===1?buyerList.name:postDetail.customer}}</span></li>
            <li class="van-hairline--bottom" v-if="pageType===1"><span>客户电话</span><span class="phone-box"><span class="phone">{{buyerList.mobile|formatMobile}}</span><van-icon class="phone-icon" name="phone-circle" v-if="power['sign-ht-xq-ly-call'].state" @click="callFn(buyerList)" /></span></li>
            <li class="van-hairline--bottom"><span>成交经纪人</span><span>{{postDetail.dealagentStoreName+'-'+postDetail.dealAgentName}}</span></li>
            <template v-if="pageType===2">
                <li class="van-hairline--bottom"><span>店长</span><span>{{postDetail.guestinfo&&postDetail.guestinfo.ShopOwnerName|formatNull}}</span></li>
                <li class="van-hairline--bottom"><span>当前步骤</span><span>{{postDetail.overtimeSteps|formatNull}}</span></li>
                <li class="van-hairline--bottom"><span>当前步骤负责人</span><span>{{postDetail.overtimeName|formatNull}}</span></li>
                <li class="van-hairline--bottom"><span>计划完成时间</span><span>{{postDetail.specifiedTime|formatDate}}</span></li>
                <li class="van-hairline--bottom"><span>超时天数</span><span>{{postDetail.overtimeDay|formatNull}}</span></li>
            </template>
            <template v-if="pageType!==0">
                <li class="van-hairline--bottom"><span>实收/应收</span><span>{{postDetail.receivedCommission}}/{{postDetail.receivableCommission}}</span></li>
                <li class="van-hairline--bottom"><span>收佣状态</span><span>{{postDetail.statusReceiveAmount&&postDetail.statusReceiveAmount.label}}</span></li>
            </template>
            <template v-if="pageType===1">
                <li class="van-hairline--bottom" v-if="postDetail.statusLaterStage&&postDetail.statusLaterStage.label!='已结案'">
                    <span>后期进度</span>
                    <!-- <span v-if="postDetail.statusLaterStage">{{postDetail.statusLaterStage.label}}</span> -->
                    <p>
                        <span>当前步骤: {{postDetail.stepInstanceName==='-'?'-':postDetail.stepInstanceName}}</span>
                        <span v-if="postDetail.nextStepName">下一步骤: {{postDetail.nextStepName}}</span>
                    </p>
                </li>
                <li class="van-hairline--bottom"><span>当前步骤是否超时</span><span>{{postDetail.isOvertime&&postDetail.isOvertime.label|formatNull}}</span></li>
                <li class="van-hairline--bottom"><span>当前步骤责任人</span><span>{{postDetail.personLiableName|formatNull}}</span></li>
            </template>
        </ul>
        <van-dialog v-model="callDialog" title="号码绑定成功" show-cancel-button confirm-button-text="拨打" @confirm="toCall">
            <div class="call-dialog">请拨打电话{{callNumber}}联系客户</div>
        </van-dialog>
    </div>
</template>

<script>
import { postMixin } from '@/assets/js/postMixin';

export default {
    name: 'post-detail',
    mixins: [postMixin],
    data() {
        return {
            callDialog: false, //拨打电话弹窗
            canCall: true, //拨打按钮节流阀
            callNumber: '', //虚拟号码
            id: '',
            code: '',
            pageType: '',
            postDetail: {},
            ownerList: {},
            buyerList: {}
        }
    },
    created() {
        this.id = this.$route.query.id
        this.code = this.$route.query.code
        this.pageType = this.$route.query.pageType
        if(this.pageType == 1) {
            this.getContractDetail()
        }
        this.getPostDetail()
    },
    mounted() {
        this.$nextTick(()=>{
            let bool = this.pageType===1
            this.$tool.waterMark(`${this.getUserMsg.user.depName}${this.getUserMsg.user.name}${this.getUserMsg.user.mobile}`,this.$refs.detail,bool);
        })
    },
    methods: {
        getPostDetail() {
            this.$ajax.get(`/api/postSigning/${this.pageType===0?'getContract':this.pageType===1?'getAdminContract':'getMonitorContract'}`, {keyword:this.code}).then(res =>{
                res = res.data
                if(res.status === 200) {
                    this.postDetail = res.data.list[0]
                }
            })
        },
        getContractDetail() {
            this.$ajax.get('/api/contract/detail', { id: this.id }).then(res => {
                res = res.data
                if(res.status === 200) {
                    let arr = [...res.data.contPersons]
                    this.ownerList = arr.filter(item=> item.personType.value===1)[0]
                    this.buyerList = arr.filter(item=> item.personType.value===2)[0]
                }
            })
        },
        callFn(val) {
            if(this.canCall) {
                this.canCall = false;
                let param = {
                    plateType: 0,
                    id: val.pid,
                    contractCode: this.id,
                    sourceType: val.personType.value===1?0:1,
                    calledMobile: val.encryptionMobile,
                    calledName: val.name
                };
                this.$ajax.get('/api/record/virtualNum', param).then(res => {
                    res = res.data;
                    if(res.status === 200) {
                        this.callNumber = res.data.virtualNum;
                        this.callDialog = true;
                        this.canCall = true;
                    }
                }).catch(error => {
                    this.$toast(error);
                    this.canCall = true;
                })
            }
        },
        //拨打电话
        toCall(){
            this.callDialog = false;
            window.location.href = `tel://${this.callNumber}`
        },
    },
    filters: {
        formatMobile: function(val) {
            if (!val) {
                return "--";
            } else {
                return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            }
        }
    }
}
</script>

<style scoped lang="less">
@import '~@/assets/common.less';

.view-box {
    height: calc(100% - 60px);
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: @bg-grey;
}
.post-detail-box {
    margin-top: 10px;
    padding: 0 13px 0 16px;
    background-color: @bg-white;
    li {
        // border-bottom: 1px solid #E0E0E1;
        font-size: 14px;
        padding: 13px 15px 13px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
            display: inline-block;
        }
        > span:first-child {
            color: @text-grey-BBB;
            min-width: 120px;
        }
        > span:last-child {
            width: 70%;
            word-wrap: break-word;
            text-align: right;
        }
        p {
            text-align: right;
            span {
                width: 100%;
            }
        }
        span.phone-box {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        span.phone {
            margin-right: 24px;
        }
        .phone-icon {
            color: @text-green;
            font-size: 18px;
        }
    }
}
.call-dialog {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: @text-grey-666;
}
</style>