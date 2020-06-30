<template>
    <div id="homePage">
        <!-- tab栏 -->
        <van-tabs v-model="isActive" @click="changeTab" line-width="22px" color="#3EBA70" class="tabs">
            <van-tab v-for="item in tab" :key="item.id" :title="item.title"></van-tab>
        </van-tabs>
        <!-- 合同状态切换 -->
        <div class="contStatus">
            <ul v-if="isActive===0">
                <li><span :class="contStatusActive==='all'?'choosed':''" @click="onChange('all')">全部</span></li>
                <li><span :class="contStatusActive===1?'choosed':''" @click="onChange(1)">起草中</span></li>
                <li><span :class="contStatusActive===2?'choosed':''" @click="onChange(2)">已签章</span></li>
                <li><span :class="contStatusActive===3?'choosed':''" @click="onChange(3)">已签约</span></li>
                <li><span :class="contStatusActive===0?'choosed':''" @click="onChange(0)">已撤单</span></li>
            </ul>
            <ul v-if="isActive>0">
                <li><span :class="contStatusActive==='all'?'choosed':''" @click="onChange('all')">全部</span></li>
                <li><span :class="contStatusActive===0?'choosed':''" @click="onChange(0)">审核中</span></li>
                <li><span :class="contStatusActive===1?'choosed':''" @click="onChange(1)">已通过</span></li>
                <li><span :class="contStatusActive===2?'choosed':''" @click="onChange(2)">已驳回</span></li>
            </ul>
        </div>
        <!-- tab主体 -->
        <div class="mainPart">
            <contractList ref="list" :pageType="pageType" :src="src" :parameters="parameters"  :requestType="requestType"></contractList>
        </div>
    </div>
</template>
<script>
import {List,PullRefresh } from 'vant';
import contractList from '@/components/contractList';
import {mapMutations} from 'vuex';
export default {
    components:{
        contractList,
        [List.name]:List,
        [PullRefresh.name]:PullRefresh,
    },
    data() {
        return {
            activeName:'',
            tab:[
                {id:0,title:'合同查询'},
                {id:1,title:'合同审核'},
                {id:2,title:'签后审核'}
            ],
            isActive:0,//默认选中tab1
            contStatusActive:'all',//合同状态选中
            // 列表组件参数
            pageType:'contractList',//类型
            src:'/contract/contractList',//接口 默认合同列表
            parameters:{},//参数
            requestType:'postJSON',//请求类型
            params:{
                startTime:'',
                endTime:'',
                contTypes:'',//合同类型
                signinState:'',//签后后期状态
                toExamineState:'',//合同审核状态
                receiveAmountState:'',//收佣状态
                laterStageState:'',//合同后期状态
                recordType:'',//签约方式
                transFlowCode:'',//交易流程
                statusLaterStage:'',//后期状态
                stepState:'',//交易步骤状态
                statusReceiveAmount:'',//后期收佣状态
                dataRange:'',//后期数据范围
            }
        };
    },
    created() {
        console.log(this)
        let entry = localStorage.getItem('entry');
        if(entry){
            let flag=JSON.parse(entry)
            if(flag&&this.$route.path===flag.url){
                this.isActive=flag.activeTab
                this.changeTab(this.isActive)
                localStorage.removeItem('entry')
            }
        }
        this.setEntry({
            pageType:this.pageType,
            activeTab:this.isActive,
            url:this.$route.path
        })
    },
    mounted(){
        let that = this
        this.$EventBus.$on('getSearchBar',function (res) {
            if (res.signTime) {//签约时间
                if(that.pageType==="getlist"){
                    that.parameters.signDateSta = res.signTime.startTime;
                    that.parameters.signDateEnd = res.signTime.endTime;
                }else{
                    that.parameters.beginDate = res.signTime.startTime;
                    that.parameters.endDate = res.signTime.endTime;
                }
            }
            if(res.choseResult['10'].key){//合同类型
                that.parameters.contTypes = String(res.choseResult['10'].key)
            }else{
                that.parameters.contTypes = ''
            }
            that.parameters.receiveAmountState = res.choseResult['13'].key //收佣状态
            that.parameters.dealAgentStoreId = res.otherParam.depId //部门
            if(that.pageType==="contractList"){//合同列表筛选参数
                that.parameters.laterStageState = res.choseResult['11'].key //后期状态
                that.parameters.toExamineState = res.choseResult['51'].key //合同审核状态
                that.parameters.signinState = res.choseResult['72'].key //签后审核状态
                that.parameters.receiveAmountState = res.choseResult['13'].key //收佣状态
                that.parameters.dealAgentStoreId = res.otherParam.depId //部门
            }else{//合同审核 签后审核筛选参数
                that.parameters.recordType = res.choseResult['64'].key //签约方式
                that.parameters.dealAgentStoreId = res.otherParam.depId //部门
            }
            that.$refs.list.onRefresh()
        })
    },
    methods: {
        //tab栏切换
        changeTab(val){
            // [this.contStatusActive,this.parameters.contState,this.parameters.toExamineState,this.parameters.state,this.parameters.isCheckList,this.isActive]=['all','','','','',val]
            [this.contStatusActive,this.parameters,this.isActive]=['all',{},val]
            if(val===0){//合同列表
                this.src="/contract/contractList"
                this.requestType="postJSON"
                this.pageType="contractList"
            }else if(val===1){//审核列表
                this.parameters.isCheckList=1
                this.src="/contract/auditList"
                this.requestType="postJSON"
                this.pageType="auditList"
            }else{//签后审核列表
                this.parameters.contTypes=''
                this.src="/signingAudit/getlist"
                this.requestType="get"
                this.pageType="getlist"
            }
            /*Object.assign(this.$route.query,{
                pageType:this.pageType,
                activeTab:this.isActive
            })*/
            this.setEntry({
                pageType:this.pageType,
                activeTab:this.isActive,
                url:this.$route.path
            })
        },
        // 合同状态切换
        onChange(val){
            this.contStatusActive=val;
            if(this.pageType==="contractList"){//合同列表
                if(val!='all'){
                    this.parameters.contState=val
                }else{
                    this.parameters.contState=''
                }
                this.$refs.list.onRefresh()
            }else if(this.pageType==="auditList"){//审核列表
                if(val!='all'){
                    this.parameters.toExamineState=val
                }else{
                    this.parameters.toExamineState=''
                }
                this.$refs.list.onRefresh()
            }else{//签后审核列表
                if(val!='all'){
                    this.parameters.state=val
                }else{
                    this.parameters.state=''
                }
                this.$refs.list.onRefresh()
            }
        },
        ...mapMutations(['setEntry'])
    },
    beforeDestroy(){
        this.$EventBus.$off('getSearchBar')
    }
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
/deep/.van-tab__text {
    font-size: 16px;
}
.homePage{
    position: relative;
}
.contStatus{
    position: absolute;
    top: 102px;
    left: 0;
    right: 0;
    // height: 60px;
    // line-height: 60px;
    overflow: hidden;
    ul{
        li{
            display: inline-block;
            width: 19%;
            height: 60px;
            font-size: 14px;
            position: relative;
            &:first-of-type{
                margin-left: 14px;
            }
            span{
                box-sizing: border-box;
                display: inline-block;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 60px;
                height: 26px;
                text-align: center;
                line-height: 26px;
                border: 1px solid #E7E9EE;
                border-radius: 13px;
                background-color: #FAFCFE;
                color: #999999;
            }
            .choosed{
                color: #3EBA70;
                background-color: #E2F5EA;
                border-color: #E2F5EA;
            }
        }
    }
}
.mainPart{
    position: absolute;
    top: 160px;
    left: 0;
    right: 0;
    bottom: 60px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}
</style>
