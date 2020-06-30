<template>
    <div class="view-container">
        <van-tabs v-model="activeTab" @click="changeTab" line-width="22px" color="#3EBA70" class="tabs">
            <van-tab v-for="tab in tabs" :key="tab.id" :title="tab.title"></van-tab>
        </van-tabs>
        <div class="content">
            <contractList ref="list" :pageType="pageType" :src="src" :parameters="parameters" :requestType="requestType"></contractList>
        </div>
    </div>
</template>

<script>
import contractList from '@/components/contractList';
import {mapMutations,mapGetters} from 'vuex';
export default {
    name: 'post-index',
    components: {
        contractList
    },
    data() {
        return {
            activeTab: 0,
            tabs: [
                {
                    id: 1,
                    title: '后期接收',
                    src: '/postSigning/getContract',
                    pageType: 'getContract',
                },
                {
                    id: 2,
                    title: '后期管理',
                    src: '/postSigning/getAdminContract',
                    pageType: 'getAdminContract',
                },
                {
                    id: 3,
                    title: '后期监控',
                    src: '/postSigning/getMonitorContract',
                    pageType: 'getMonitorContract',
                }
            ],
            src: '/postSigning/getContract',
            pageType: 'getContract',
            requestType: 'get',
            parameters: {
                keyword: ''
            },
        }
    },
    created() {
        let entry = localStorage.getItem('entry');
        if(entry){
            let flag=JSON.parse(entry)
            if(flag&&this.$route.path===flag.url){
                this.activeTab=flag.activeTab
                this.changeTab(this.activeTab)
                localStorage.removeItem('entry')
            }
        }
        this.setEntry({
            pageType:this.pageType,
            activeTab:this.activeTab,
            url:this.$route.path
        })
    },
    mounted(){
        let that = this
        this.$EventBus.$on('getSearchBar',function (res) {
            that.setDataRange({
                key:that.activeTab===1?res.choseResult['48'].key:that.getDataRange.key,
                state:that.activeTab===2?res.choseResult['18'].key:that.getDataRange.state
            })
            if (res.signTime) {//签约时间
                if(that.activeTab===0){
                    that.parameters.signDateSta = res.signTime.startTime
                    that.parameters.signDateEnd = res.signTime.endTime
                }else if(that.activeTab===1){
                    that.parameters.receiveTimeStar = res.signTime.startTime
                    that.parameters.receiveTimeEnd = res.signTime.endTime
                }
            }
            that.parameters.recordType = res.choseResult['64'].key //签约方式
            if(that.activeTab===0){
                that.parameters.statusLaterStage = res.choseResult['43'].key //后期状态
                that.parameters.transFlowCode = res.otherParam.tranProcessId //交易流程
            }else if(that.activeTab===1){
                that.parameters.statusLaterStage = res.choseResult['44'].key
                that.parameters.dataRange = res.choseResult['48'].key //数据状态
            }
            if(that.activeTab===1||that.activeTab===2) {
                that.parameters.stepState = res.choseResult['18'].key //交易步骤状态
                that.parameters.stepInstanceCode = res.otherParam.tranStepId //交易步骤
                if(this.activeTab===1) {
                    that.parameters.statusReceiveAmount = res.choseResult['13'].key //收佣状态
                } else {
                    that.parameters.statusResult = res.choseResult['13'].key //收佣状态
                }
            }
            that.parameters.areaName = res.otherParam.tranAreaName //产权地址区域
            that.parameters.dealAgentStoreId = res.otherParam.depId //部门
            that.$refs.list.onRefresh()
        })
    },
    beforeDestroy() {
        this.$EventBus.$off('getSearchBar')
    },
    methods: {
        changeTab() {
            this.src = this.tabs[this.activeTab].src
            this.pageType = this.tabs[this.activeTab].pageType
            this.parameters = { keyword: '' }
            if(this.pageType === 'getAdminContract') {
                this.parameters.dataRange = this.getDataRange.key
            }else if(this.pageType === 'getMonitorContract') {
                this.parameters.stepState = this.getDataRange.state
            }
            this.setEntry({
                pageType:this.pageType,
                activeTab:this.activeTab,
                url:this.$route.path
            })
            this.setDataRange({
                key: 1,
                state: 3
            })
        },
        ...mapMutations(['setEntry','setDataRange'])
    },
    computed: {
        ...mapGetters(['getDataRange'])
    }
}
</script>

<style scoped lang="less">
@import '~@/assets/common.less';

/deep/ .van-tab__text {
    font-size: 16px;
}
.content {
    position: absolute;
    top: 105px;
    left: 0;
    right: 0;
    bottom: 60px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}
</style>
