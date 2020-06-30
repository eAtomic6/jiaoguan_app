<template>
    <div class="search-bar">
        <p>
            <span><i class="icon iconfont iconjiantou1" @click.stop="goBack"></i></span>
            <span><i class="icon iconfont iconguanbi" @click.stop="closeWeb"></i></span>
        </p>
        <van-field v-model="text" :placeholder="getPlaceholder" :disabled="getDisabled" @clear="clearText" @click="toRoute" @focus="getFocus" :clearable="true"/>
        <span v-if="getDisabled" class="btn-types"><i class="icon iconfont iconshaixuan" @click.stop="showPop()"></i></span>
        <span class="btn-search" @click="toSearch" v-else>搜索</span>
        <van-popup v-model="popShow" position="right" class="search-slider" :close-on-click-overlay="true">
            <div class="slider-context">
                <ul class="slider-types">
                    <li v-if="!getPost3">
                        <p>{{getBillParam?'到账时间':getPost2?'接收日期':'签约日期'}}</p>
                        <div class="date">
                            <span class="date-picker" @click="showPop('startTime')">
                                <template v-if="!signTime.startTime">开始时间</template>
                                <template v-else>{{signTime.startTime|formatDate}}<i class="van-icon van-icon-clear" @click.stop="clearTime('start')"></i></template>
                            </span>
                            <i class="line-10"></i>
                            <span class="date-picker" @click="showPop('endTime')">
                                <template v-if="!signTime.endTime">结束时间</template>
                                <template v-else>{{signTime.endTime|formatDate}}<i class="van-icon van-icon-clear" @click.stop="clearTime('end')"></i></template>
                            </span>
                        </div>
                    </li>
                    <li v-if="getContract23||getPost1||getPost2||getPost3">
                        <p v-if="choseResult['64']">{{choseResult['64'].name}}</p>
                        <div class="types" v-if="dictionary['64']">
                            <template v-for="item in dictionary['64']">
                                <span class="types-item" :key="item.key" :class="{'active':choseResult['64']&&choseResult['64'].key===item.key}" v-if="!(getContract4&&item.key==2)" @click="choseType(item,64)">{{ item.value}}</span>
                            </template>
                        </div>
                    </li>
                    <li v-if="getContract1||getContract23||getBillParam">
                        <p v-if="choseResult['10']">{{choseResult['10'].name}}</p>
                        <div class="types" v-if="dictionary['10']">
                            <template v-for="item in dictionary['10']">
                                <span class="types-item" :key="item.key" v-if="item.value!=='委托合同'" :class="{'active':choseResult['10']&&choseResult['10'].key===item.key}" @click="choseType(item,10)">{{item.value}}</span>
                            </template>
                        </div>
                    </li>
                    <li v-if="getContract1&&false">
                        <p v-if="choseResult['11']">{{choseResult['11'].name}}</p>
                        <div class="types" v-if="dictionary['11']">
                            <span class="types-item" v-for="item in dictionary['11']" :key="item.key" :class="{'active':choseResult['11']&&choseResult['11'].key===item.key}" @click="choseType(item,11)">{{item.value}}</span>
                        </div>
                    </li>
                    <li v-if="getContract1">
                        <p v-if="choseResult['51']">{{choseResult['51'].name}}</p>
                        <div class="types" v-if="dictionary['51']">
                            <span class="types-item" v-for="item in dictionary['51']" :key="item.key" :class="{'active':choseResult['51']&&choseResult['51'].key===item.key}" @click="choseType(item,51)">{{item.value}}</span>
                        </div>
                    </li>
                    <li v-if="getContract1">
                        <p v-if="choseResult['72']">{{choseResult['72'].name}}</p>
                        <div class="types" v-if="dictionary['72']">
                            <span class="types-item" v-for="item in dictionary['72']" :key="item.key" :class="{'active':choseResult['72']&&choseResult['72'].key===item.key}" @click="choseType(item,72)">{{item.value}}</span>
                        </div>
                    </li>
                    <li v-if="getPost2">
                        <p v-if="choseResult['48']">{{choseResult['48'].name}}</p>
                        <div class="types" v-if="dictionary['48']">
                            <span class="types-item" v-for="item in dictionary['48']" :key="item.key" :class="{'active':choseResult['48']&&choseResult['48'].key===item.key}" @click="choseType(item,48)">{{item.value}}</span>
                        </div>
                    </li>
                    <li v-if="getPost2">
                        <p v-if="choseResult['44']">{{choseResult['44'].name}}</p>
                        <div class="types" v-if="dictionary['44']">
                            <span class="types-item" v-for="item in dictionary['44']" :key="item.key" :class="{'active':choseResult['44']&&choseResult['44'].key===item.key}" @click="choseType(item,44)">{{item.value}}</span>
                        </div>
                    </li>
                    <li v-if="getPost1">
                        <p v-if="choseResult['43']">{{choseResult['43'].name}}</p>
                        <div class="types" v-if="dictionary['43']">
                            <span class="types-item" v-for="item in dictionary['43']" :key="item.key" :class="{'active':choseResult['43']&&choseResult['43'].key===item.key}" @click="choseType(item,43)">{{item.value}}</span>
                        </div>
                    </li>
                    <li v-if="getPost2||getPost3">
                        <p v-if="choseResult['18']">{{choseResult['18'].name}}</p>
                        <div class="types">
                            <span class="types-item" v-for="item in stepsMo" :key="item.key" :class="{'active':choseResult['18']&&choseResult['18'].key===item.key}" @click="choseType(item,18)">{{item.value}}</span>
                        </div>
                    </li>
                    <li v-if="getBillParam">
                        <p v-if="choseResult['23']">{{choseResult['23'].name}}</p>
                        <div class="types" v-if="dictionary['23']">
                            <template v-for="item in dictionary['23']">
                                <span class="types-item" :key="item.key" v-if="[3,4,5].includes(item.key)" :class="{'active':choseResult['23']&&choseResult['23'].key===item.key}" @click="choseType(item,23)">{{item.value}}</span>
                            </template>
                        </div>
                    </li>
                    <li v-if="getBillParam">
                        <p v-if="choseResult['57']">{{choseResult['57'].name}}</p>
                        <div class="types" v-if="dictionary['57']">
                            <template v-for="item in dictionary['57']">
                                <span class="types-item" :key="item.key" v-if="item.key!==-1" :class="{'active':choseResult['57']&&choseResult['57'].key===item.key}" @click="choseType(item,57)">{{item.value}}</span>
                            </template>
                        </div>
                    </li>
                    <li v-if="getContract23||getPost2||getPost3">
                        <p v-if="choseResult['13']">{{choseResult['13'].name}}</p>
                        <div class="types" v-if="dictionary['13']">
                            <span class="types-item" v-for="item in dictionary['13']" :key="item.key" :class="{'active':choseResult['13']&&choseResult['13'].key===item.key}" @click="choseType(item,13)">{{item.value}}</span>
                        </div>
                    </li>
                    <li class="dep-picker" @click="showPop('tranProcess')" v-if="getPost1">
                        <span>交易流程</span>
                        <span><span :class="otherParam.tranProcessId?'color-bbb':''">{{otherParam.tranProcessName|setPlaceholder}}</span><i class="icon iconfont iconUtubiao-11"></i></span>
                    </li>
                    <li class="dep-picker" @click="showPop('tranStep')" v-if="getPost2||getPost3">
                        <span>交易步骤</span>
                        <span><span :class="otherParam.tranStepId?'color-bbb':''">{{otherParam.tranStepName|setPlaceholder}}</span><i class="icon iconfont iconUtubiao-11"></i></span>
                    </li>
                    <li class="dep-picker" @click="showPop('tranArea')" v-if="getPost1||getPost2||getPost3">
                        <span>产权地址区域</span>
                        <span><span :class="otherParam.tranAreaId?'color-bbb':''">{{otherParam.tranAreaName|setPlaceholder}}</span><i class="icon iconfont iconUtubiao-11"></i></span>
                    </li>
                    <li class="dep-picker" @click="showPop('bill')" v-if="getBillParam">
                        <span>收付款类</span>
                        <span><span :class="otherParam.billId?'color-bbb':''">{{otherParam.billName|setPlaceholder}}</span><i class="icon iconfont iconUtubiao-11"></i></span>
                    </li>
                    <li class="dep-picker" @click="showPop('dep')">
                        <span>所属部门</span>
                        <span><span :class="otherParam.depId?'color-bbb':''">{{otherParam.depName|setPlaceholder}}</span><i class="icon iconfont iconUtubiao-11"></i></span>
                    </li>
                </ul>
                <p class="slider-btns">
                    <van-button type="default" @click="initType">重置</van-button>
                    <van-button type="default" @click="sendSearchParam">确定</van-button>
                </p>
            </div>
        </van-popup>
        <van-popup v-model="popDateShow.state" position="bottom" :style="{ height: '30%' }">
            <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    title="选择年月日"
                    @confirm="getSignTime"
                    @cancel="getSignTime('clear')"
            />
        </van-popup>
        <searchDep :showInput="showPopupInput" :showTitle="showPopTitle" :title="popTitle" :filterStep="isFilterStep" :state="popListShow.state" :list="popList" :checkProto="popListShow.proto" :activeId="Number(otherParam[`${popListShow.popType}Id`])" @chose="chosePopListItem" @close="closePop" @searchList="searchPopupList" @searchStep="searchStepList"></searchDep>
    </div>
</template>

<script>
import { Field, Popup,DatetimePicker } from 'vant';
import {BASE} from "@/assets/js/common";
import searchDep from '@/components/popList.vue';
import {MIXINS} from "../assets/js/common";
import {mapGetters} from 'vuex';

const dic=Object.assign({},BASE.DICTIONARY);
// const dicRenderList=['10','11','51','72','13'];

export default {
    name: "searchBar",
    mixins:[MIXINS],
    components: {
        [Field.name]: Field,
        [Popup.name]: Popup,
        [DatetimePicker.name]: DatetimePicker,
        searchDep
    },
    props: {
        placeholder: {//输入框placeholder
            type: String,
            default: "合同编号/业主/客户/手机号/物业地址"
        },
        requestUrl: {//列表请求url
            type: String,
            // required: true
        },
        disabled: {//输入是否可编辑，用于搜索入口页
            type: Boolean,
            default: false
        },
        initVal: {//输入栏初始值
            type:String,
            default: ''
        },
        ifInitParam:{//是否清空筛选条件
            type:String,
            default:''
        }
    },
    watch:{
        initVal: function (val) {
            this.text=val
        },
        getEntry:{
            handler:function (val) {
                let {activeTab,url,pageType}=val
                this.searchPopupOptions=Object.assign({},{activeTab,url,pageType})
            },
            deep:true,
            immediate:true
        },
        ifInitParam:{
            immediate: true,
            handler:function (val) {
                val&&this.initType()
            }
        },
        // getUserMsg:{
        //     deep:true,
        //     handler(val){
        //         debugger
        //         if(val){
        //             this.getDictionary()
        //         }
        //     }
        // }
    },
    data() {
        return {
            text: this.initVal,
            popShow: false,
            popDateShow:{
                state:false,
                text:''
            },
            popListShow:{
                state:false,
                popType:'',
                proto:'id'
            },
            dictionary:{
                '11':'',
                '51':'',
                '72':'',
                '13':'',
                '10':'',
                '64':'',
                '48':'',
                '44':'',
                '43':'',
                // '18':'',
                '57':'',
                '23':'',
            },
            choseResult:Object.assign({},(function(){
                let obj={};
                for(let item in dic){
                    obj[item]={name:dic[item],key:''}
                }
                return obj;
            })()),
            currentDate: new Date(),
            signTime:{
                startTime:'',
                endTime:''
            },
            otherParam:{
                depId:'',//部门id
                depName:'',
                tranProcessId:'',//交易流程id
                tranProcessName:'',
                tranStepId:'',//交易步骤id
                tranStepName:'',
                tranAreaId:'',//产权地址id
                tranAreaName:'',
                billId:'',//收款款类id
                billName:'',
            },
            popList:[],
            showPopupInput:false,//是否显示pop弹窗中的搜索
            searchPopupOptions:Object.create(null),
            stepsMo: [
                {
                    key: 1,
                    value: "已完成"
                },
                {
                    key: 2,
                    value: "办理中"
                },
                {
                    key: 3,
                    value: "超时未办理"
                },
                {
                    key: 4,
                    value: "超时已办理"
                }
            ],
            popTitle: '', //pop弹窗标题
            showPopTitle:false, //是否显示pop弹窗中的产权地址title
            isFilterStep:false, //后期筛选交易步骤时是否启用模糊匹配
        }
    },
    mounted(){
        this.getDictionary()
    },
    methods: {
        toSearch: function () {
            this.$emit('toSearch', {keyword: this.text, url: this.requestUrl})
        },
        toRoute: function () {
            if(this.getDisabled){
                this.$emit('toRoute')
            }
        },
        getFocus(){
            this.$emit('onFocus')
        },
        //输入框清空操作
        clearText: function () {
            this.$emit('clear')
        },
        clearTime:function(type){
            this.$set(this.signTime,`${type}Time`,'')
        },
        //Popup弹窗显示
        showPop:function (val='init') {
            this.showPopTitle=false
            this.popTitle=''
            if(['tranProcess','tranArea','bill'].includes(val)){//控制Popup标题文本
                this.showPopTitle=true
                this.popTitle=val
            }
            if(val==='init'){
                this.popShow=!this.popShow
            }else if(['startTime','endTime'].includes(val)){//控制事件Popup
                Object.assign(this.popDateShow,{
                    state:!this.popDateShow.state,
                    text:val
                })
            }else if(['dep','tranProcess','tranStep','tranArea'].includes(val)){//控制部门选择Popup
                Object.assign(this.popListShow,{
                    state:!this.popDateShow.state,
                    popType:val
                })
                this.showPopupInput=false
                this.isFilterStep=false
                switch (val) {
                case 'dep':
                    this.showPopupInput=true
                    this.getDepList();
                    break;
                case 'tranProcess':
                    this.getTransition('/flowmanage/selectFlowPageList','post')
                    break;
                case 'tranStep':
                    this.showPopupInput=true
                    this.isFilterStep=true
                    this.getTransition('/postSigning/getAllStepFlows')
                    break;
                case 'tranArea':
                    this.getTransition('/organize/currentdep/areaname')
                    break;
                }
            }else if(val==='bill'){
                this.popListShow=Object.assign({},this.popListShow,{
                    state:!this.popDateShow.state,
                    popType:val,
                    proto:'key'
                })
                this.showPopupInput=false
                this.$ajax.get('/api/payInfo/selectSmallMoneyType').then(res => {
                    res = res.data
                    if (res.status === 200) {
                        this.popList=[].concat(res.data)
                    }
                })
            }
        },
        //初始化
        initType:function(){
            for (let item in this.choseResult){
                this.$set(this.choseResult[item],'key','')
            }
            
            Object.assign(this.signTime,{
                startTime: '',
                endTime: ''
            })
            Object.assign(this.otherParam,{
                depId:'',
                depName:'',
                tranProcessId:'',
                tranProcessName:'',
                tranStepId:'',
                billId:'',
                billName:'',
                tranStepName:'',
                tranAreaId:'',
                tranAreaName:''
            })
            // 后期管理筛选数据范围初始化
            if(this.getDataRange.key&&this.getPost2) {
                this.choseType({
                    key: this.getDataRange.key
                },48)
            }
            // 后期监控筛选交易步骤状态初始化
            if(this.getDataRange.state&&this.getPost3) {
                this.choseType({
                    key: this.getDataRange.state
                },18)
            }
        },
        //最终筛选条件确定
        sendSearchParam:function(){
            if((this.signTime.startTime&&this.signTime.endTime)||(!this.signTime.startTime&&!this.signTime.endTime)){
                this.$emit('sendParam',{
                    choseResult: Object.assign({},this.choseResult),
                    signTime: Object.assign({},this.signTime),
                    otherParam: Object.assign({},this.otherParam)
                })
                this.popShow=false
            } else {
                this.$toast(`${this.getBillParam?'到账时间':this.getPost2?'接收日期':'签约日期'}需选择开始时间和结束时间`)
            }
            
        },
        //选择cell筛选条件
        choseType:function(item,index){
            this.$set(this.choseResult[index],'key',this.choseResult[index]&&this.choseResult[index].key===item.key?'':item.key)
        },
        closePop:function(){
            this.popListShow=Object.assign(this.popListShow,{
                state:false,
                popType:'',
                proto:'id'
            })
        },
        //选择部门
        chosePopListItem:function(item){
            let param=JSON.parse(JSON.stringify(this.otherParam));
            let type=this.popListShow.popType
            switch (type) {
            case 'dep':
            case 'tranProcess':
            case 'tranStep':
            case 'tranArea':
                param[`${type}Id`]=!!item?item.id:'';
                param[`${type}Name`]=!!item?item.name:'';
                break;
            case 'bill':
                param[`${type}Id`]=!!item?item.key:'';
                param[`${type}Name`]=!!item?item.name:'';
            }
            Object.assign(this.otherParam,param);
            this.popListShow.state=false
        },
        getSignTime:function(val='init'){
            if(val==='clear'){
                // this.signTime[this.popDateShow.text]=''
            }else{
                val = this.$tool.dateFormat(val,2)
                if(this.popDateShow.text==='endTime'&&val<this.signTime.startTime){
                    this.$toast('结束时间不能小于开始时间')
                }else if(this.popDateShow.text==='startTime'&&this.signTime.endTime&&val>this.signTime.endTime) {
                    this.$toast('开始时间不能大于结束时间')
                }else {
                    this.signTime[this.popDateShow.text]=val
                }
            }
            Object.assign(this.popDateShow,{
                state:!this.popDateShow.state,
                text:''
            })
        },
        //获取交易流程、步骤、产权地址区域
        getTransition: function (url,method='get') {
            let param=Object.create(null);
            if(url==='/flowmanage/selectFlowPageList'){
                param.cityId=this.getUserMsg.user.cityId
            }
            this.$ajax[method](`/api${url}`,param).then(res=>{
                res=res.data
                if(res.status===200){
                    this.popList=[].concat(res.data)
                }
            })
        },
        //获取部门数据列表
        getDepList:function (keyword='') {
            this.$ajax.get(`/api/access/deps`,{keyword}).then(res=>{
                res=res.data
                if(res.status===200){
                    this.popList=[].concat(res.data)
                }
            }).catch(error=>{
                this.$toast(error)
            })
        },
        searchPopupList:function (res) {
            this.getDepList(res.keyword)
        },
        searchStepList(res) {
            let arr = [].concat(this.popList)
            if(res.keyword) {
                this.popList = arr.filter(item => {
                    let str = item.name
                    return str.includes(res.keyword)
                })
            }else{
                this.getTransition('/postSigning/getAllStepFlows')
            }
        },
        //返回
        goBack(){
            let arr = ['/contractHomePage','/bill','/postIndex','/addContract']
            if(arr.includes(this.$route.path)){
                // Android
                document.location = "js://close";
                //IOS
                window.webkit.messageHandlers.close.postMessage("");
            }else{
                this.$router.go(-1)
            }
        },
        // 关闭
        closeWeb(){
            // Android
            document.location = "js://close";
            //IOS
            window.webkit.messageHandlers.close.postMessage("");
        }
    },
    computed: {
        getPlaceholder: function () {
            return this.placeholder
        },
        getDisabled: function () {
            return this.disabled
        },
        getBillParam:function () {
            return this.searchPopupOptions.url==='/bill'
        },
        getContract1:function () {
            return this.searchPopupOptions.url==='/contractHomePage'&&this.searchPopupOptions.activeTab===0
        },
        getContract23:function () {
            return this.searchPopupOptions.url==='/contractHomePage'&&[1,2].includes(this.searchPopupOptions.activeTab)
        },
        getContract4:function () {
            return this.searchPopupOptions.url==='/contractHomePage'&&this.searchPopupOptions.activeTab===1
        },
        getPost1:function () {
            return this.searchPopupOptions.url==='/postIndex'&&this.searchPopupOptions.activeTab===0
        },
        getPost2:function () {
            return this.searchPopupOptions.url==='/postIndex'&&this.searchPopupOptions.activeTab===1
        },
        getPost3:function () {
            return this.searchPopupOptions.url==='/postIndex'&&this.searchPopupOptions.activeTab===2
        },
        ...mapGetters(['getEntry','getUserMsg','getDataRange'])
    },
    filters:{
        setPlaceholder:function (val) {
            if(val.length===0){
                return '请选择'
            }else{
                return val
            }
        }
    }
}
</script>

<style scoped lang="less">
    @import "@/assets/common.less";

    .search-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px 0 12px;
        height: 60px;
        background-color: @bg-white;
        >p:first-of-type{
            flex: 1.5;
            span{
                color: @text-black;
                margin-right: 12px;
                &:last-of-type{
                    margin: 0;
                }
            }
        }
        /deep/ .van-cell {
            padding: 2px 10px;
        }
        /deep/ .van-field {
            background-color: #EBEBEB;
            border-radius: 4px;
            flex: 6;
            /deep/ .van-field__control::-webkit-input-placeholder {
                font-size: 12px;
            }
        }

        .btn-search {
            font-size: 14px;
            color: @text-green;
        }

        .btn-types {
            > i {
                font-size: 16px;
            }
        }
        >span{
            flex: 1;
            text-align: center;
            // margin-left: 10px;
            white-space: nowrap;
        }
    }
    .line-10{
        display: inline-block;
        width: 10px;
        border-top: 1px solid @border-grey-999;
    }
    .search-slider{
        height: 100%;
        width: calc(100% - 90px);
        .slider-context{
            position: relative;
            height: 100%;
            padding: 16px 16px 60px;
            box-sizing: border-box;
        }
        .slider-types{
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling:touch;
            >li{
                margin-bottom: 10px;
                &:last-of-type{
                    margin:0;
                }
                p:first-of-type{
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                .date{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .date-picker{
                        border: 1px solid @border-grey;
                        padding: 8.6px 0;
                        flex: 1;
                        text-align: center;
                        color: @text-grey-999;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: @font-12;
                        >i{
                            margin-left: 4px;
                        }
                    }
                    .line-10{
                        margin: 10px;
                    }
                }
                .types{
                    &-item{
                        background-color: @bg-grey;
                        display: inline-block;
                        border-radius: @border-radius-base;
                        min-width: 66px;
                        text-align: center;
                        padding: 8.6px 8px;
                        box-sizing: border-box;
                        margin: 0 16px 10px 0;
                        font-size: @font-12;
                        &.active{
                            background-color: @bg-green-E2F5EA;
                            color: @text-green;
                        }
                    }
                }
                &.dep-picker{
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    > span:last-of-type {
                        display: flex;
                        align-items: baseline;
                        span {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            width:120px;
                            text-align: right;
                            color: @text-grey-BBB;
                            font-size: @font-12;
                        }
                        >i{
                            font-size: @font-12;
                            color: @text-grey-333!important;
                        }
                        .color-bbb {
                            color: @text-grey-333!important;
                        }
                    }
                }
            }
        }
        .slider-btns{
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            text-align: center;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            /deep/ .van-button{
                width: 120px;
                padding: 14px 0;
                margin-right: 16px;
                text-align: center;
                font-size: @font-16;
                &:first-of-type{
                    background-color: @bg-light-grey;
                    color: @text-grey-333;
                }
                &:last-of-type{
                    margin-right: 0;
                    background-color: @bg-green;
                    color: @text-white;
                }
            }
        }
    }
</style>
