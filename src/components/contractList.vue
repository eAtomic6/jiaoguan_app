<template>
    <!-- 合同列表组件 -->
    <div class="contList" :class="{'bg-white':contList.length===0}">
        <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh" v-if="contList.length>0">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                :error.sync="error"
                error-text="请求失败，点击重新加载"
                :offset="60"
                @load="onLoad()">
                <van-cell v-for="item in contList" :key="item.id" @click="toDetail(item)">
                    <div  v-if="!postPageType.includes(pageType)">
                        <div class="contCode" v-if="iscontractList">
                            <span>合同编号 {{item.code}}</span>
                            <span class="grey" v-if="item.contState.value===0">{{item.contState.label}}</span>
                            <span class="orange" v-if="item.contState.value===1">{{item.contState.label}}</span>
                            <span class="red" v-if="item.contState.value===2">{{item.contState.label}}</span>
                            <span class="green" v-if="item.contState.value===3">{{item.contState.label}}</span>
                        </div>
                        <div class="contCode" v-if="isauditList">
                            <span>合同编号 {{item.code}}</span>
                            <span class="orange" v-if="item.toExamineState.value===0">{{item.toExamineState.label}}</span>
                            <span class="green" v-if="item.toExamineState.value===1">{{item.toExamineState.label}}</span>
                            <span class="red" v-if="item.toExamineState.value===2">{{item.toExamineState.label}}</span>
                        </div>
                        <div class="contCode" v-if="isgetlist">
                            <span>合同编号 {{item.code}}</span>
                            <span class="orange" v-if="item.state&&item.state.value===0">{{item.state.label}}</span>
                            <span class="green" v-if="item.state&&item.state.value===1">{{item.state.label}}</span>
                            <span class="red" v-if="item.state&&item.state.value===2">{{item.state.label}}</span>
                        </div>
                    </div>
                    <div class="contCode" v-else>
                        <p class="code"><span>合同编号：</span><span class="green" @click.stop="postToContractFn(item)">{{item.code}}</span></p>
                        <div v-if="pageType==='getContract'">
                            <span class="red" v-if="item.statusLaterStage.value===2">未开始</span>
                            <span class="green" v-else>已开始</span>
                        </div>
                        <div v-if="pageType==='getAdminContract'">
                            <span class="red" v-if="item.statusLaterStage.value===3">已开始</span>
                            <span class="green" v-else>已结案</span>
                        </div>
                    </div>
                    <ul class="contMsg" v-if="!postPageType.includes(pageType)">
                        <li>合同类型：<span>{{item.contType.label}}</span></li>
                        <li>签约方式：<span v-if="item.recordType">{{item.recordType.label}}</span></li>
                        <li>签约日期：<span>{{Number(item.signDate)|timeFormat_hm}}</span></li>
                        <li v-if="iscontractList">建筑面积：<span>{{item.houseSquare?item.houseSquare:'0'}}m²</span></li>
                        <li>{{item.contType.value===1?"租金":(item.contType.value===2||item.contType.value===3)?"成交总价":item.contType.value===4?"意向金金额":"定金金额"}}：<span>{{isauditList||iscontractList?item.dealPrice:item.price}}元</span><span v-if="item.contType.value===1">{{item.timeUnit===1?"/月":item.timeUnit===2?"/季度":item.timeUnit===3?"/半年":"/年"}}</span></li>
                        <li v-if="item.contType.value>3">认购总价：<span>{{item.subscriptionPrice}}元</span></li>
                        <li v-if="iscontractList&&item.contType.value<4">应收佣金：<span>{{item.receivableCommission}}元</span></li>
                        <li v-if="iscontractList||isauditList" class="van-ellipsis">物业地址：<span>{{item.propertyAddr}}</span></li>
                        <li v-if="isgetlist" class="van-ellipsis">物业地址：<span>{{item.property_addr}}</span></li>
                        <li v-if="iscontractList||isauditList">成交经纪人：<span>{{item.dealAgentStoreName+'-'+item.dealAgentName}}</span></li>
                        <li v-if="isgetlist">成交经纪人：<span>{{item.dealAgentStoreName+'-'+item.dealName}}</span></li>
                        <li v-if="isauditList">当前审核人：<span v-if="item.auditId>0&&item.toExamineState.value===0">{{item.auditStoreName+'-'+item.auditName}}</span><span v-else>-</span></li>
                        <li v-if="isgetlist">当前审核人：<span v-if="item.currentReviewerId>0&&item.state&&(item.state.value===0)">{{item.currentReviewerDep+'-'+item.currentReviewer}}</span><span v-else>-</span></li>
                        <li v-if="isauditList">下一步审核人：<span v-if="item.nextAuditId>0">{{item.nextAuditStoreName+'-'+item.nextAuditName}}</span><span v-else>-</span></li>
                        <li v-if="isgetlist">下一步审核人：<span v-if="item.nextReviewerId>0">{{item.nextReviewerDep+'-'+item.nextReviewer}}</span><span v-else>-</span></li>
                        <li v-if="isauditList">审核时间：<span>{{Number(item.auditTime)|timeFormat_hm}}</span></li>
                        <li v-if="isgetlist">审核时间：<span>{{Number(item.updateTime)|timeFormat_hm}}</span></li>

                        <li v-if="iscontractList">合同审核状态：
                            <span class="blue" v-if="item.toExamineState.value===-1">{{item.toExamineState.label}}</span>
                            <span class="orange" v-if="item.toExamineState.value===0">{{item.toExamineState.label}}</span>
                            <span class="green" v-if="item.toExamineState.value===1">{{item.toExamineState.label}}</span>
                            <span class="red" v-if="item.toExamineState.value===2">{{item.toExamineState.label}}</span>
                        </li>
                        <li v-if="iscontractList">签后审核状态：
                            <span class="blue" v-if="!item.signingState||item.signingState.value===-1">待提审</span>
                            <span class="orange" v-if="item.signingState&&item.signingState.value===0">{{item.signingState.label}}</span>
                            <span class="blue" v-if="item.signingState&&item.signingState.value===1">{{item.signingState.label}}</span>
                            <span class="red" v-if="item.signingState&&item.signingState.value===2">{{item.signingState.label}}</span>
                        </li>
                        <li class="BtnList" v-if="iscontractList">
                            <van-button v-if="power['sign-ht-info-view'].state&&item.recordType.value!=2" type="default" size="small" @click.stop="toPreview(item)">预览</van-button>
                            <van-button v-if="power['sign-ht-xq-data'].state" type="default" size="small" @click.stop="toContData(item)">资料库</van-button>
                            <van-button v-if="power['sign-ht-info-collect'].state" type="default" size="small" @click.stop="toGetBill(item)">收款</van-button>
                            <van-button v-if="power['sign-ht-xq-main-add']&&item.contState.value===3" type="default" size="small" @click.stop="toContMain(item)">合同主体</van-button>
                            <van-button v-if="power['sign-ht-view-toverify'].state&&(item.toExamineState.value<0||item.toExamineState.value===2)&&item.isCanAudit===1" type="primary" size="small" @click.stop="toSubmitAduit(item)">合同提审</van-button>
                            <van-button v-if="power['sign-ht-qhsh-toverify'].state&&item.signAudit" type="primary" size="small" @click.stop="toSignAudit(item)">签后提审</van-button>
                            <van-button v-if="power['sign-ht-info-fqqs'].state&&(item.contState.value===1||item.contState.value===2)&&item.toExamineState.value===1" type="primary" size="small" @click.stop="toSign(item)">发起签署</van-button>
                        </li>
                        <li class="BtnList" v-if="isgetlist||isauditList">
                            <van-button type="primary" size="small" v-if="isauditList?(item.toExamineState&&item.toExamineState.value===0)&&( ((!(item.auditId>0))&&getUserMsg&&item.grabDept==='true') || (((item.contType&&item.contType.value===1||item.contType&&item.contType.value===4||item.contType&&item.contType.value===5)&&getUserMsg&&item.auditId===getUserMsg.user.empId) || ((item.contType.value===2||item.contType&&item.contType.value===3)&&((item.auditId===getUserMsg.user.empId))) ) )
                                :item.state&&item.state.value===0&&((item.currentReviewerId===getUserMsg.user.empId)||((!(item.currentReviewerId>0))&&getUserMsg&&item.grabDept))" @click.stop="toSh(item)" >审核</van-button>
                        </li>
                    </ul>
                    <ul class="contMsg" v-else>
                        <li>签约方式：<span>{{item.recordType.label}}</span></li>
                        <li v-if="pageType==='getContract'">签约时间：<span>{{Number(item.signDate)|timeFormat_hm}}</span></li>
                        <li v-else>接收日期：<span>{{Number(item.receiveTime)|timeFormat_hm}}</span></li>
                        <li>交易流程：<span>{{item.transFlowName}}</span></li>
                        <li class="van-ellipsis">物业地址：<span>{{item.propertyAddr}}</span></li>
                        <li v-if="pageType==='getContract'">成交经纪人：<span>{{item.dealagentStoreName+'-'+item.dealAgentName}}</span></li>
                        <li v-else>收佣状态：<span>{{item.statusReceiveAmount.label}}</span></li>
                        <li class="BtnList" v-if="pageType==='getContract'" :class="{'pd-none':!power['sign-qh-rev-receive'].state}">
                            <van-button type="primary" size="small" v-if="power['sign-qh-rev-receive'].state" @click.stop="toPostFn(item)">{{item.statusLaterStage.value===2?'接收':'已接收'}}</van-button>
                        </li>
                        <li class="BtnList" v-else>
                            <van-button type="primary" size="small" v-if="pageType==='getAdminContract'" @click.stop="toPostFn(item,2)">后期进度</van-button>
                            <van-button type="primary" size="small" v-if="pageType==='getMonitorContract'" @click.stop="toPostFn(item,3)">查看交易流程</van-button>
                        </li>
                    </ul>
                    <div class="detail-icon">
                        <i class="iconfont iconUtubiao-11"></i>
                    </div>
                </van-cell>
            </van-list>
        </van-pull-refresh>
        <div class="no-data" v-if="contList.length===0&&haveRequest">
            <img :src="getImgUrl('no_data.png')" alt="">
            <p>暂无数据</p>
        </div>
        <div class="no-data" v-if="!powerFlag">
            <img :src="getImgUrl('no_power.png')" alt="">
            <p>暂无权限，去配置吧～</p>
        </div>
        <div v-if="!haveRequest&&powerFlag" class="listLoading" >
            <van-loading type="spinner" color="#3EBA70"  />
        </div>
        <!-- 合同提审确认弹窗 -->
        <van-dialog v-model="submitDialog" title="确认提审？" show-cancel-button @confirm="submitAduit">
            <div class="signDialog">请仔细核对合同内容是否有误</div>
        </van-dialog>
        <!-- 签后提审确认弹窗 -->
        <van-dialog v-model="signAduitDialog" title="确认提审？" show-cancel-button @confirm="signAudit">
            <div class="signDialog">请仔细核对合同内容是否有误</div>
        </van-dialog>
        <!-- 发起签署成功弹窗 -->
        <van-dialog v-model="signDialog" title="合同已发起签署" confirmButtonText="上传资料库" :show-cancel-button="true" @confirm="toDataBase" @cancel="close">
            <div class="signDialog">请督促业主和客户在手机上尽快完成签署</div>
        </van-dialog>
        <!-- loading弹层 -->
        <van-overlay :show="showLoading">
            <div class="wrapper" @click.stop>
                <van-loading size="24px" />
            </div>
        </van-overlay>
    </div>
</template>

<script>
import {List,PullRefresh,Overlay,Loading} from 'vant';
import { mapMutations,mapGetters } from 'vuex';
import {MIXINS} from "../assets/js/common";

export default{
    mixins:[MIXINS],
    components:{
        [List.name]:List,
        [PullRefresh.name]:PullRefresh,
        [Overlay.name]:Overlay,
        [Loading.name]:Loading,
    },
    props:{
        //页面类型
        pageType:{
            type:String,
            default:'contractList'
        },
        //接口
        src:{
            type:String,
            default:''
        },
        //接口参数
        parameters:{
            type:Object,
            default:function () {
                return {}
            }
        },
        //请求类型
        requestType:{
            type: String,
            default:'get'
        }
    },
    data(){
        return{
            submitDialog:false,//合同提审
            submitMsg:'',//提审合同信息
            loading:false,//上拉加载
            finished:false,
            refreshing:false,//下拉刷新
            error:false,//加载失败
            contList:[],//合同列表数据
            total:0,//总条数
            pageSize:10,
            pageNum:1,
            postPageType: ['getContract','getAdminContract','getMonitorContract'], //后期页面类型
            signDialog:false,//发起签署
            signId:'',//发起签署合同id
            isHaveData:'',//发起签署合同资料库是否上传

            signAduitDialog:false,
            signAuditItem:'',
            showLoading:false,//loading状态
            haveRequest:false,//发起过请求
            powerFlag:false, //列表查询权限
            powerObj: {
                'contractList': 'sign-ht-info-query',
                'auditList': 'sign-ht-htsh-query',
                'getlist': 'sign-ht-qhsh-query',
                'getContract': 'sign-qh-rev-query',
                'getAdminContract': 'sign-qh-mgr-query',
                'getMonitorContract': 'sign-qh-cont-query'
            }
        }
    },
    created () {
        this.onRefresh()
    },
    beforeDestroy(){
        clearTimeout(this.timer)
    },
    methods:{
        getImgUrl:function(url){
            return require('@/assets/img/'+url);
        },
        // 获取列表数据
        getList(){
            let param = {
                pageSize:this.pageSize,
                pageNum:this.pageNum
            }
            if(this.pageType==="contractList"){
                param.recordType=10//无纸化
                param.platForm=1//平台类型 3 pc  5 app
            }
            if(this.pageType==="getlist"){
                this.parameters.statusReceiveAmount=this.parameters.receiveAmountState
                this.parameters.depId=this.parameters.dealAgentStoreId
            }
            param = Object.assign({}, param, this.parameters);
            this.$ajax[`${this.requestType}`](`/api${this.src}`,param).then(res=>{
                res=res.data
                if(res.status===200){
                    this.haveRequest=true
                    // 加载状态结束
                    this.loading = false;
                    this.contList=this.contList.concat(res.data.list);
                    let resultKeies=Object.keys(res.data)
                    if(resultKeies.includes('count')){
                        this.total = res.data.count
                    }else{
                        this.total = res.data.total
                    }
                    // 数据全部加载完成
                    if (this.contList.length >= this.total) {
                        this.finished = true;
                    }
                }
            }).catch(error=>{
                this.haveRequest=true
                this.$toast(error)
            })
        },
        //前往审核页面，this.pageType=='getlist'表示签后审核，auditList表示合同审核
        toSh(val){
            //抢单模式
            let param
            if(this.pageType=='auditList'){
                param={
                    bizCode:val.code,
                    flowType:3
                }
                if(val.isCombine){
                    param.flowType=11
                }
                if(this.getUserMsg.user.empId==val.auditId){
                    this.$router.push({
                        path: "/contractCheck",
                        query: {
                            id: val.id,
                            code:val.code,
                            isHaveData:1,
                            signId:val.id,
                            
                        }
                    });
                }else{
                    this.QDFn(val,param)
                }
            }else if(this.pageType=='getlist'){
                param = {
                    bizCode:val.id,
                    flowType:12
                }
                if(val.currentReviewerId===this.getUserMsg.user.empId){
                    this.$router.push({
                        path: "/contractSignsh",
                        query: {
                            id: val.cid,
                            isHaveData:1,
                            code:val.code,
                            signId:val.id,
                            recordType:val.recordType&&val.recordType.value
                        }
                    });
                }else{
                    this.QDFn(val,param)
                }
            }

        },
        QDFn(val,param){
            this.$ajax.get('/api/machine/getAuditAuth',param).then(res=>{
                res = res.data
                if(res.status===200){
                    if(this.pageType=='auditList'){
                        this.$router.push({
                            path:'/contractCheck',
                            query:{
                                code:val.code,
                                id:val.id,
                                // isentrust:item.isCombine?1:0
                            }
                        })
                    }else if(this.pageType=='getlist'){
                        this.$router.push({
                            path: "/contractSignsh",
                            query: {
                                id: val.cid,
                                isHaveData:1,
                                code:val.code,
                                signId:val.id,
                                recordType:val.recordType&&val.recordType.value
                            }
                        });
                    }
                }
            }).catch(error=>{
                this.$toast(error)
            })
        },
        //合同列表上拉加载
        onLoad(type='load'){
            if (this.refreshing) {
                this.contList = [];
                this.refreshing = false;
            }
            if(type==='load'){
                this.pageNum+=1
            }
            this.getList()
        },
        //合同列表下拉刷新
        onRefresh() {
            this.powerFlag = false
            if(this.power[`${this.powerObj[this.pageType]}`].state) {
                this.powerFlag = true
            }
            if(!this.powerFlag) {
                this.contList = []
                return false
            }
            this.refreshing=true
            // 清空列表数据
            this.finished = false;

            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading = true;
            this.pageNum=1
            this.haveRequest=false
            this.onLoad('refresh');
        },
        //跳转合同详情
        toDetail(val){
            if(this.pageType=='contractList'){
                if(this.power['sign-com-htdetail'].state){
                    this.$router.push({
                        path: "/contractDetail",
                        query: {
                            id: val.id,
                            contType: val.contType.value
                        }
                    });
                }else{
                    this.$toast("无合同详情权限")
                }
            } else if(this.postPageType.includes(this.pageType)) {
                let pageType = this.postPageType.indexOf(this.pageType)
                this.$router.push({
                    path: this.pageType==='getAdminContract'?'/postManage':'/postDetail',
                    query:{
                        id:val.id,
                        code:val.code,
                        pageType
                    }
                })
            } else if(this.pageType=='auditList') {
                this.$router.push({
                    path: "/contractReview",
                    query: {
                        keyword:val.code,
                        contType: val.contType.value,
                        pageType:this.pageType
                    }
                });
            }else if(this.pageType=='getlist'){
                this.$router.push({
                    path: "/contractReview",
                    query: {
                        keyword:val.code,
                        contType: val.contType.value,
                        pageType:this.pageType
                    }
                })
            }
        },
        postToContractFn(val) {
            if(!this.power['sign-com-htdetail'].state){
                this.noPower(this.power['sign-com-htdetail'].name);
                return false
            }
            this.$router.push({
                path: "/contractDetail",
                query: {
                    id: val.id,//合同id
                    code: val.code,//合同编号
                    contType: val.tradeType.value//合同类型
                }
            });
        },
        //跳转合同预览
        toPreview(val){
            this.$router.push({
                path:'contractPreview',
                query:{
                    id:val.id
                }
            })
        },
        //资料库
        toContData(val){
            this.$router.push({
                path:"/contractDataBase",
                query:{
                    id:val.id,
                    isHaveData:val.isHaveData
                }
            })
        },
        //收款
        toGetBill(val){
            this.$router.push({
                path:'billCreate',
                query:{
                    contId:val.id,
                    code:val.code,
                }
            })
        },
        //合同主体
        toContMain(val){
            this.$router.push({
                path:"/contractBody",
                query:{
                    id:val.id,
                }
            })
        },
        // 合同提审
        toSubmitAduit(val){
            this.submitDialog=true
            this.submitMsg = val
        },
        submitAduit(){
            let param = {
                cityId:this.submitMsg.cityCode,
                flowType:3,
                bizCode:this.submitMsg.code,
                modularType:0//合同类型
            }
            this.$ajax.get('/api/machine/submitAduit', param).then(res=>{
                this.submitAduitDialog=false;
                res=res.data;
                if(res.status===200){
                    this.$toast('提审成功')
                    this.onRefresh()
                }
            }).catch(error => {
                if(error.message==='下一节点审批人不存在'){
                    this.isSubmitAudit=false;
                    this.$router.push({
                        path:'setReviewer',
                        query:{
                            code:this.submitMsg.code,
                            checkType:0,
                            flowType:3,
                        }
                    })
                }else{
                    this.$toast(error)
                }
            })
        },
        // 签后提审
        toSignAudit(val){
            this.signAuditItem=val
            this.signAduitDialog=true
        },
        signAudit(){
            let param = {
                contId:this.signAuditItem.id,
                contType:this.signAuditItem.isCombine?this.signAuditItem.isCombine:false
            }
            this.$ajax.post("/api/signingAudit/addsignin",param).then(res=>{
                res=res.data
                if(res.status===200){
                    this.isSubmitAudit=false
                    this.$toast("提审成功")
                    this.onRefresh()
                }
            }).catch(error => {
                this.isSubmitAudit=false;
                if(error.message==='下一节点审批人不存在'){
                    this.isSubmitAudit=false;
                    this.$router.push({
                        path:'setReviewer',
                        query:{
                            code:error.data.bizCode,
                            checkType:0,
                            flowType:12,
                        }
                    })
                }else{
                    this.onRefresh()
                    this.$toast(error)
                }
            })
        },
        //发起签署
        toSign(val){
            let owner = []
            let guest = []
            val.contPersons.forEach(element => {
                if(element.personType.value === 1){
                    owner.push(element)
                }else{
                    guest.push(element)
                }
            });
            if(owner.length>1||guest.length>1){//多个业主客户时选择一个发起签署
                this.setOwnerList(owner)
                this.setGuestList(guest)
                this.$router.push({
                    path:"/choosePerson",
                    query:{
                        id:val.id,
                        isHaveData:val.isHaveData,
                        storeId:val.guestStoreCode
                    }
                })
            }else{
                this.showLoading=true
                let param = {
                    contId:val.id,
                    type:1,//签章
                    isentrust:0,//非委托
                    storeId:val.guestStoreCode//门店id
                }
                param.owner=[
                    {name:owner[0].name,identityType:owner[0].cardType,identity:owner[0].encryptionCode,mobile:owner[0].mobile,email:owner[0].email}
                ]
                param.customer=[
                    {name:guest[0].name,identityType:guest[0].cardType,identity:guest[0].encryptionCode,mobile:guest[0].mobile,email:guest[0].email}
                ]
                this.$ajax.postJSON('/api/app/contract/sendCont',param).then(res=>{
                    this.showLoading=false
                    res=res.data
                    if(res.status===200){
                        this.signId=val.id
                        this.isHaveData=val.isHaveData
                        this.signDialog=true
                        this.onRefresh()
                    }
                }).catch(error=>{
                    this.showLoading=false
                    this.$toast(error)
                })
            }
        },
        //跳转资料库
        toDataBase(){
            this.$router.push({
                path:"/contractDataBase",
                query:{
                    id:this.signId,
                    isHaveData:this.isHaveData
                }
            })
        },
        //关闭签署弹窗
        close(){
            this.signDialog=false
        },
        // 跳转后期接收/进度
        toPostFn(val,type=1) {
            if(type===1&&!val.dealAgentId) {
                this.$toast('当前合同没有成交经纪人')
                return false
            }
            this.setPostRow(val)
            let obj = { id: val.id }
            if(type === 1) {
                obj.transFlowCode = val.transFlowCode
                obj.dealAgentId = val.dealAgentId
                obj.dealagentStoreId = val.dealagentStoreId
                obj.statusLaterStage = val.statusLaterStage.value
            } else {
                obj.statusLaterStage = val.statusLaterStage.label
                obj.statusChange = val.statusChange.value
                if(type===2) {
                    obj.statusReceiveAmount = val.statusReceiveAmount.value
                }
            }
            if(type === 1) {
                this.$ajax.get('/api/postSigning/clickReceive', {
                    contractCode: val.id,
                    transFlowCode: val.transFlowCode
                }).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.$router.push({
                            path: "/postReceive",
                            query: obj
                        })
                    }
                }).catch(err => {
                    this.$toast(err)
                })
            } else {
                this.$router.push({
                    path: "/postProgress",
                    query: Object.assign({
                        title: type === 3 ? '查看交易流程' : '',
                        btnHide: type === 3 ? 0 : 1
                    }, obj)
                })
            }
        },
        ...mapMutations([
            'setPostRow',
            'setOwnerList',
            'setGuestList',
        ])
    },
    computed:{
        iscontractList(){
            return this.pageType=='contractList'
        },
        isauditList(){
            return this.pageType=='auditList'
        },
        isgetlist(){
            return this.pageType=='getlist'
        },
        ...mapGetters([
            'getUserMsg',
            'getPowerCode'
        ]),
        userMsg(){
            return this.getUserMsg.user
        },
        power() {
            return this.getPowerCode
        }
    },
    watch: {
        src(newData){
            console.log(newData)
            this.onRefresh()
            this.haveRequest=false
        },
        /*parameters(newData){
            debugger
            console.log(newData)
            this.onRefresh()
        }*/
    },
    filters:{
        timeFormat_hm: function (val) {
            if (!val) {
                return '--'
            } else {
                let time = new Date(val)
                let y = time.getFullYear()
                let M = time.getMonth() + 1
                let D = time.getDate()
                let h = time.getHours()
                let m = time.getMinutes()
                let s = time.getSeconds()
                let time_ = `${y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
                return time_.substr(0, 16)
            }
        },
    }
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
/deep/.van-cell{
    background-color: @bg-grey;
    padding: 10px 10px 0;
    .van-cell__value{
        background-color: @bg-white;
        padding: 10px;
        border-radius: 2px;
    }
}
.grey{
    color: @text-grey-999!important;
}
.blue{
    color:@text-blue!important;
}
.orange{
    color:@text-origen!important;
}
.green{
    color:@text-green!important;
}
.red{
    color:@text-red!important;
}
.contCode{
    display: flex;
    justify-content:space-between;
    > span{
        &:first-of-type{
            font-size: 16px;
            font-weight: bold;
            color: @text-grey-333;
        }
    }
    .code {
        font-weight: normal!important;
        > span:first-child {
            color: @text-grey-999;
        }
    }
}
.contMsg{
    color: @text-grey-999;
    span{
        color: @text-grey-333;
    }
    .BtnList{
        text-align: right;
        padding: 20px 0 0 0;
        position: relative;
        display: flex;
        justify-content: flex-end;
        &::before{
            content: '';
            display: inline-block;
            width: 354px;
            height: 1px;
            border-top: 1px solid @border-grey;
            position: absolute;
            top: 10px;
            left: -10px;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
        }
        /deep/.van-button__text{
            white-space: nowrap;
        }
        /deep/.van-button--small{
            margin-right: 10px;
            &:last-of-type{
                margin-right: 0;
            }
        }
        /deep/.van-button--primary{
            .van-button__text{
                color: @bg-white !important;
            }
        }
        /deep/.van-button--default{
            background-color: @btn-grey;
        }
    }
    .pd-none {
        padding: 0;
    }
}
.contList{
    position: relative;
    height: calc(100%);
    background-color: @bg-grey;
    &.bg-white{
        background-color: @bg-white;
    }
}
.no-data{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-100%);
    >img{
        width: 136px;
    }
    >p{
        text-align: center;
        color: @text-grey-999;
        margin-top: 20px;
        font-size: 12px;
    }
}
/deep/.van-dialog{
    width: 284px;
    border-radius: 5px;
    font-size: 16px;
    .van-dialog__content{
        font-size: 14px;
    }
    .van-dialog__footer{
        .van-dialog__confirm{
            color: @text-green;
        }
    }
}
.signDialog{
    text-align: center;
    font-size: 14px;
    color: @text-grey-666;
    margin: 20px 0;
}
.van-overlay{
    z-index: 999;
    .wrapper{
        color: @text-green;
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
        left: 50%;
        transform: translateX(-50%);
        /deep/.van-loading__text{
            color: @text-green;
        }
    }
}
.listLoading{
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
.detail-icon {
    position: absolute;
    right: 10px;
    top: 30%;
    color: @text-grey-BBB;
}
</style>
