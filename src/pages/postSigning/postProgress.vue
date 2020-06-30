<template>
    <div class="view-container">
        <div v-if="progressList.length>0">
            <div v-for="(item,index) in progressList" :key="item.id" class="list-item">
                <p :class="item.stepState.value === OPERATION.backlog?'text-red':''"><span>{{item.personLiableName|formatNull}}</span><span>{{item.endDatetime|dateFormatFn}}</span></p>
                <div class="content">
                    <div class="step-type">
                        <p><span :class="overTimeFn(item.isOvertime.value)">步骤类型:</span><span :class="overTimeFn(item.isOvertime.value)">{{item.transactionStepsType}}</span></p>
                        <span><i class="iconfont iconUtubiao-" v-if="!item.iconCollapse" @click="collaspeFn(index)"></i><i class="iconfont iconUtubiao-13" v-if="item.iconCollapse" @click="collaspeFn(index)"></i></span>
                    </div>
                    <ul v-if="item.iconCollapse">
                        <li><span :class="overTimeFn(item.isOvertime.value)">步骤名称:</span><span :class="overTimeFn(item.isOvertime.value)">{{item.transactionSteps}}</span></li>
                        <li><span :class="overTimeFn(item.isOvertime.value)">结算百分比:</span><span :class="overTimeFn(item.isOvertime.value)">{{percentageFn(item.settlePercent)}}</span></li>
                        <li><span :class="overTimeFn(item.isOvertime.value)">操作人:</span><span :class="overTimeFn(item.isOvertime.value)">{{item.operatorName|formatNull}}</span></li>
                        <li><span :class="overTimeFn(item.isOvertime.value)">操作日期:</span><span :class="overTimeFn(item.isOvertime.value)">{{item.operationTime|formatDate|formatNull}}</span></li>
                        <li><span :class="overTimeFn(item.isOvertime.value)">办理天数:</span><span :class="overTimeFn(item.isOvertime.value)">{{item.actualDay|formatNull}}</span></li>
                        <li><span :class="overTimeFn(item.isOvertime.value)">规定天数:</span><span :class="overTimeFn(item.isOvertime.value)">{{item.specifiedDay}}</span></li>
                    </ul>
                </div>
                <div class="btn-opera van-hairline--top" v-if="operaBtnShow(statusLaterStage,statusChange)">
                    <p v-if="statusLaterStage===STATE.ongoing" class="text">
                        <span v-if="item.stepState.value === OPERATION.start||item.stepState.value === OPERATION.amend" class="text-green">已办理</span>
                        <span v-else-if="item.stepState.value === OPERATION.sure" class="text-red">待确认</span>
                        <span v-else-if="item.stepState.value === OPERATION.backlog" class="text-red">办理中</span>
                        <span v-else-if="item.stepState.value === OPERATION.not" class="text-orange">未办理</span>
                    </p>
                    <p v-if="statusChange!=2" class="btn">
                        <template v-if="item.stepState.value === OPERATION.start">
                            <van-button type="default" size="small" class="btn-view" @click="operationFn(item,'查看')">查看</van-button>
                        </template>
                        <template v-else-if="item.stepState.value === OPERATION.backlog && statusLaterStage !== STATE.start && getSta">
                            <van-button type="primary" size="small" @click="operationFn(item,'办理')">办理</van-button><van-button class="none-bg" plain type="primary" size="small" v-if="index !== progressList.length-1 && power['sign-qh-mgr-jd-move'].state" @click="downFn(item,index)">下</van-button>
                        </template>
                        <template v-else-if="item.stepState.value === OPERATION.sure && statusLaterStage !== STATE.start && getSta">
                            <van-button class="none-bg" plain type="primary" size="small" @click="operationFn(item,showSeeFn('确认',item))">{{showSeeFn('确认',item)}}</van-button>
                        </template>
                        <template v-else-if="item.stepState.value === OPERATION.not && statusLaterStage !== STATE.start && getSta">
                            <van-button class="none-bg" plain type="primary" size="small" v-if="isUpBtnFn(index) && power['sign-qh-mgr-jd-move'].state" @click="upFn(item,index)">上</van-button><van-button class="none-bg" plain type="primary" size="small" v-if="index !== progressList.length-1 && power['sign-qh-mgr-jd-move'].state" @click="downFn(item,index)">下</van-button>
                        </template>
                        <template v-else-if="item.stepState.value === OPERATION.amend && getSta">
                            <van-button class="none-bg" plain type="primary" size="small" @click="operationFn(item,showSeeFn('修改',item))">{{showSeeFn('修改',item)}}</van-button>
                        </template>
                    </p>
                </div>
                <span class="icon-circle" :class="item.stepState.value === OPERATION.start?'bg-green':item.stepState.value === OPERATION.backlog||item.stepState.value === OPERATION.sure?'bg-red':''"></span>
            </div>
        </div>
        <div v-if="progressList.length===0&&loading" class="no-data">
            <img :src="getImgUrl('no_data.png')" alt="">
            <p>暂无数据</p>
        </div>
        <div v-if="!loading" class="loading-box" >
            <van-loading type="spinner" color="#3EBA70"  />
        </div>
        <!-- 操作栏按钮 -->
        <div class="btn-bottom" v-if="getSta&&progressList.length>0" v-show="layerBtnShowFn(power['sign-qh-mgr-jd-modify'].state,power['sign-qh-mgr-jd-smgr'].state)">
            <van-button class="step" type="primary" @click="manageFn" v-if="power['sign-qh-mgr-jd-smgr'].state">步骤管理</van-button>
            <van-button class="flow" type="primary" @click="replaceFn" v-if="power['sign-qh-mgr-jd-modify'].state">更换交易流程</van-button>
        </div>
    </div>
</template>

<script>
import { List, Collapse, CollapseItem, Loading } from 'vant';
import { postMixin } from '@/assets/js/postMixin';
const OPERATION = {
    start: 1, //已办理
    backlog: 2, //待办理
    sure: 3, //需确认（代办）
    not: 4, //不可办理
    amend: 5 //修改
}
const STATE = {
    start: '已结案',
    ongoing: '已开始'
}
export default {
    name: 'post-progress',
    mixins: [postMixin],
    components: {
        [List.name]: List,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Loading.name]:Loading,
    },
    data() {
        return {
            OPERATION, // 步骤状态
            STATE, // 合同状态
            getSta: '',
            id: '',
            statusLaterStage: '', //后期状态
            statusChange: '', //变更解约状态
            statusReceiveAmount: '' //收佣状态
        }
    },
    created() {
        let query = this.$route.query
        this.getSta = Number(query.btnHide)
        this.id = query.id
        this.statusLaterStage = query.statusLaterStage
        this.statusChange = query.statusChange
        this.statusReceiveAmount = query.statusReceiveAmount
        this.postProgressFn(this.id)
    },
    methods: {
        percentageFn(val){
            if(val > 0){
                return `${val}%`
            }else{
                return '--'
            }
        },
        overTimeFn(e) {
            return e === 1 ? 'text-red' : ''
        },
        collaspeFn(index) {
            this.progressList[index].iconCollapse = !this.progressList[index].iconCollapse
        },
        getImgUrl:function(url){
            return require('@/assets/img/'+url);
        },
        // 是否显示上的按钮
        isUpBtnFn(index){
            if(!this.progressList[index-1]){
                return true
            }
            if(this.progressList[index-1].stepState.value === OPERATION.sure){
                return false
            }else{
                return true
            }
        },
        // 上
        upFn(e,i){
            let upId = e.id;
            let downId = this.progressList[i-1].id;
            this.oderStepFn(upId,downId);
        },
        // 下
        downFn(e,i){
            let upId = this.progressList[i+1].id;
            let downId = e.id;
            this.oderStepFn(upId,downId);
        },
        operaBtnShow(b, i) {
            if(b===STATE.start&&i==2) {
                return false
            }else{
                return true
            }
        },
        // 如果按钮都隐藏
        layerBtnShowFn(b, i) {
            if (!i && !b) {
                return false;
            } else {
                return true;
            }
        },
        oderStepFn(upId,downId){
            this.$ajax.post('/api/postSigning/oderStep',{
                upId,
                downId,
            }).then(res=>{
                res = res.data;
                if(res.status === 200){
                    this.$toast(res.message);
                    this.postProgressFn(this.id);
                }
            }).catch(err=>{
                this.toast(err);
            })
        },
        // 查看 办理 确认 修改
        operationFn(val,title) {
            let obj = {
                id: val.id,
                title,
                remarkAfter: val.remarkAfter.value,
                statusReceiveAmount: this.statusReceiveAmount
            }
            this.$router.push({
                path: '/postProgressOpera',
                query: obj
            })
        },
        showSeeFn(txt,row){
            if(row.personLiableCode === this.getUserMsg.user.empId){
                return txt;
            }else{
                return '查看';
            }
        },
        manageFn() {
            this.setPostProgressData(this.progressList)
            this.$router.push({
                path: '/postSteps',
                query: {
                    id: this.id
                }
            })
        },
        replaceFn() {
            this.$router.push({
                path: '/postFlow',
                query: {
                    id: this.id
                }
            })
        },
    },
    watch: {
        progressList(val) {
            if(val.length) {
                val.forEach(e => {
                    this.$set(e,'iconCollapse',true)
                })
            }
        }
    },
    filters: {
        dateFormatFn: function(val) {
            if (!val) {
                return "";
            } else {
                let time = new Date(val);
                let y = time.getFullYear();
                let M = time.getMonth() + 1;
                let D = time.getDate();
                return `${y}-${M > 9 ? M : "0" + M}-${D > 9 ? D : "0" + D}`;
            }
        },
    }
}
</script>

<style scoped lang="less">
@import '~@/assets/common.less';

.view-container {
    height: calc(100% - 60px);
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: @bg-grey;
    padding-top: 20px;
    font-size: 14px;
    box-sizing: border-box;
}
.no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    >img{
        width: 200px;
    }
    >p{
        text-align: center;
        color: @text-grey-999;
        margin-top: 20px;
    }
}
.loading-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(225, 225, 225, 225);
    z-index: 999;
    /deep/.van-loading{
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%);
    }
}
.list-item {
    position: relative;
    padding-left: 15px;
    padding-right: 10px;
    margin-left: 20px;
    padding-bottom: 15px;
    >p:first-child {
        margin-bottom: 10px;
        display: flex;
        align-items: baseline;
        span:first-child {
            font-weight: bold;
            margin-right: 10px;
            display: inline-block;
            max-width: 70%;
        }
        span:last-child {
            color: #7B8B94;
        }
    }
    .content {
        background: white;
        padding: 15px 10px 10px 19px;
        .step-type {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            i {
                color: #969799;
            }
        }
        li {
            font-size: 14px;
            line-height: 28px;
        }
        p, li {
            width: 100%;
            display: flex;
            align-items: flex-start;
            span:first-of-type {
                color: #969799;
                display: inline-block;
                min-width: 75px;
                text-align: right;
                margin-right: 10px;
            }
            span:last-of-type {
                display: inline-block;
                max-width: 65%;
                word-wrap: break-word;
            }
        }
    }
    .btn-opera {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 10px 20px;
        background-color: @bg-white;
        // border-top: 1px solid #E2E2E2;
        p.text {
            width: 20%;
        }
        p.btn {
            width: 85%;
            text-align: right;
        }
        .btn-view {
            background-color: #E7E9EE!important;
        }
        button:last-child {
            margin-left: 10px;
        }
    }
    &:not(:last-child)::before {
        content: '';
        width: 1px;
        height: 100%;
        background-color: #CDCDCD;
        position: absolute;
        left: 0;
        top: 15px;
    }
    &:last-child {
        margin-bottom: 75px;
    }
    .icon-circle {
        position: absolute;
        top: 3px;
        left: -6px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        border: 1px solid #999;
        display: inline-block;
        background-color: @bg-grey;
    }
    .bg-red {
        background-color: @text-red;
        border-color: @text-red;
    }
    .bg-green {
        background-color: @bg-green;
        border-color: @text-green;
    }
    .text-red {
        color: @text-red!important;
    }
    .text-green {
        color: @text-green;
    }
    .text-orange {
        color: @text-origen;
    }
}
.btn-bottom {
    position: absolute;
    bottom: 0;
    height: 75px;
    width: 100%;
    padding: 0 14px;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    align-items: center;
    .step {
        flex: 1;
        margin-right: 15px;
    }
    .flow {
        flex: 1;
    }
}
.none-bg {
    background-color: @text-white!important;
    border: 1px solid #3DB96F!important;
}
</style>