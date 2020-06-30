import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store= new Vuex.Store({
    state:{
        'userMsg':null,
        postRow:null,
        contractForm:null,//合同新增编辑表单
        ownerList:[],//合同新增编辑业主信息
        ownerList_:[],//合同新增编辑客户信息-加密
        guestList:[],//合同新增编辑客户信息
        guestList_:[],//合同新增编辑客户信息-加密
        operationType:'',//合同新增/编辑
        postProgressData:[],
        signRow:null,
        billRow:null,
        opDepLists:[],
        popDepLists:[],//设置审核人部门选择列表
        entryMsg:Object.create(null),//存放入口页当前激活tab项
        guestId:'',//客源id
        userPowerCodeList:Object.create(null),//权限code列表
        keyWord:'', //搜索关键字
        guestKeyWord:'', //客源搜索关键字
        dataRangeObj: {
            key: 1, //后期管理筛选数据范围默认本人正在办理的步骤
            state: 3 //后期监控筛选交易步骤状态默认超时未办理
        },
        reportTab: '' //后期办理tab切换至跟进记录
    },
    mutations:{
        setPowerCode:function(state,payload){
            state.userPowerCodeList=JSON.parse(JSON.stringify(payload))
        },
        setBillRow:function(state,payload){
            state.setBillRow=Object.assign({},payload)
        },
        setEntry:function(state,payload){
            localStorage.setItem('entry',JSON.stringify(payload))
            state.entryMsg=Object.assign({},payload)
        },
        setUserMsg:function (state, payload) {
            state.userMsg=Object.assign({},payload)
        },
        setPostRow:function (state, payload) {
            state.postRow=Object.assign({},payload)
        },
        setSignRow:function (state, payload) {
            state.signRow=Object.assign({},payload)
        },
        setPostProgressData:function (state, payload) {
            state.postProgressData=[...payload]
        },
        setContractForm(state,contractForm){
            state.contractForm=Object.assign({},contractForm)
        },
        setOwnerList(state,ownerList){
            state.ownerList=[].concat(ownerList)
        },
        setOwnerList_(state,ownerList_){
            state.ownerList_=[].concat(ownerList_)
        },
        setGuestList(state,guestList){
            state.guestList=[].concat(guestList)
        },
        setGuestList_(state,guestList_){
            state.guestList_=[].concat(guestList_)
        },
        setDepList:function (state,payload) {
            state.popDepLists=[].concat(payload.arr)
        },
        setGuestId:function (state,payload) {
            state.guestId=payload
        },
        setOperationType:function (state,payload) {
            state.operationType=payload
        },
        setSearchKey(state,payload) {
            state.keyWord = payload
        },
        setGuestKey(state,payload) {
            state.guestKeyWord = payload
        },
        setDataRange(state,payload) {
            state.dataRangeObj=Object.assign({},state.dataRangeObj,payload)
        },
        setReportTab(state, payload) {
            state.reportTab = payload
        }
    },
    getters:{
        getPowerCode:function(state){
            return state.userPowerCodeList
        },
        getEntry:function(state){
            return state.entryMsg
        },
        getUserMsg:function (state) {
            return state.userMsg
        },
        getPostRow:function (state) {
            return state.postRow
        },
        getSignRow:function (state) {
            return state.signRow
        },
        getPostProgressData:function (state) {
            return state.postProgressData
        },
        getContractForm(state){
            return state.contractForm
        },
        getOwnerList(state){
            return state.ownerList
        },
        getOwnerList_(state){
            return state.ownerList_
        },
        getGuestList(state){
            return state.guestList
        },
        getGuestList_(state){
            return state.guestList_
        },
        getDepList:function (state) {
            return state.popDepLists
        },
        getGuestId:function (state) {
            return state.guestId
        },
        getSearchKey:state=>{
            return state.guestKeyWord
        },
        getGuestKey:state=>{
            return state.keyWord
        },
        getDataRange:state=>{
            return state.dataRangeObj
        },
        getOperationType:state=>{
            return state.operationType
        },
        getReportTab:state=>{
            return state.reportTab
        }
    }
})
export {
    store
}
