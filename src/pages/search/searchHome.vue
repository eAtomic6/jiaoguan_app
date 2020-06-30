<template>
    <div class="search-content">
        <searchBar ref="search" class="top-bar" :initVal="keyword" @toSearch="getList"></searchBar>
        <history v-show="showHistory" @history="getHistoty"></history>
        <div class="search-list" v-show="!showHistory">
            <contractList v-if="getListType" ref="list" :pageType="pageType" :src="configObj.url" :parameters="getKeyword" :requestType="configObj.method"></contractList>
            <billList :search="true" :keyword="keyword" v-else></billList>
        </div>
    </div>
</template>

<script>
import searchBar from "@/components/searchBar";
const history=()=>import("@/pages/search/history");
const contractList=()=>import('@/components/contractList');
const billList=()=>import('@/pages/finance/bill');
import {mapMutations,mapGetters} from 'vuex'

const urlJSON={
    'contractList':{
        url:'/contract/contractList',
        method:'postJSON'
    },
    'auditList':{
        url:'/contract/auditList',
        method: 'postJSON'
    },
    'getlist':{
        url:'/signingAudit/getlist',
        method:'get'
    },
    'getContract':{
        url:'/postSigning/getContract'
    },
    'getAdminContract':{
        url:'/postSigning/getAdminContract'
    },
    'getMonitorContract':{
        url:'/postSigning/getMonitorContract'
    },
    'getBill':{
        url:'/payInfo/selectPayInfoList'
    }
}

export default {
    components:{
        searchBar,
        history,
        contractList,
        billList
    },
    data(){
        return{
            // list:[],
            showHistory:true,
            keyword:'',
            pageType:'',//列表接口标识
            configObj:Object.create(null)
        }
    },
    created(){
        let entry = localStorage.getItem('entry');
        if(entry){
            let flag=JSON.parse(entry)
            this.pageType=flag.pageType
            Object.assign(this.configObj,urlJSON[flag.pageType])
        }
        if(this.getSearchKey) {
            this.showHistory=false
            this.keyword = this.getSearchKey
        }
    },
    // beforeRouteEnter(to,from,next){
    //     next(vm=>{
    //         debugger
    //         if(['/contractHomePage','/bill','/postIndex'].includes(from.path)) {
    //             vm.setSearchKey('')
    //             vm.keyword = ''
    //         }
    //     });
    // },
    methods:{
        //关键字查询数据请求
        getList(paythod){
            // this.keyword.keyword=paythod.keyword
            this.keyword=paythod.keyword
            this.showHistory=false
            this.$nextTick(()=>{
                this.getListType&&this.$refs.list.onRefresh()
            })
            this.setSearchKey(paythod.keyword)
        },
        getHistoty:function (res) {
            this.keyword=res
            this.showHistory=false
            this.$nextTick(()=>{
                this.getListType&&this.$refs.list.onRefresh()
            })
            this.setSearchKey(res)
        },
        ...mapMutations(['setSearchKey'])
    },
    computed:{
        getKeyword:function () {
            return {keyword:this.keyword}
        },
        getListType:function () {
            return this.pageType!=='getBill'
        },
        ...mapGetters(['getSearchKey'])
    }
}
</script>

<style scoped lang="less">
    @import "@/assets/common.less";
    .search-content{
        height: calc(100%);
        background-color: @bg-grey;
        position: relative;
        padding-top: 60px;
        box-sizing: border-box;
        .top-bar{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 99;
        }
        .search-list{
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: auto;
        }
    }
</style>
