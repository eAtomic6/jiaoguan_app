<template>
    <div class="contract-detail">
        <van-tabs v-model="isActive" @click="changeTab" line-width="22px" color="#3EBA70" class="tabs">
            <van-tab :name="1" title="成交报告" v-if="contType===2||contType===3"></van-tab>
            <van-tab :name="2" title="合同详情"></van-tab>
            <van-tab :name="3" title="回访录音"></van-tab>
        </van-tabs>
        <!-- tab主体 成交报告 -->
        <div class="mainPart" v-if="isActive===1">
            <div class="mainBody" ref="maindetails">
                <!-- 合同基本信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>合同基本信息</div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>签约时间</span>
                            <span>{{contractDetail.signDate}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>合同编号</span>
                            <span>{{contractDetail.code}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>交易类型</span>
                            <span>{{contractDetail.contType.label}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>房屋总价</span>
                            <span>{{contractDetail.dealPrice}}元 {{contractDetail.dealPrice|moneyFormat}}</span>
                        </li>
                        <li>
                            <span>应收佣金（元）</span>
                            <span>{{contractDetail.receivableCommission}}</span>
                        </li>
                    </ul>
                </div>
                <!-- 房屋基本信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>房屋基本信息</div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>两证情况</span>
                            <span>{{report.cardSituation===0?'无':report.cardSituation===1?'合同':report.cardSituation===2?'两证':report.cardSituation===3?'不动产':'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>抵押情况</span>
                            <span>{{report.mortgageSituation===1?'有抵押':report.mortgageSituation===2?'无抵押':'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>提前还款</span>
                            <span>{{report.isEarlyRepayment==='0'?'否':report.isEarlyRepayment==='1'?'是':'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>建筑面积（m²）</span>
                            <span>{{contractDetail.houseInfo.Square}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>土地使用权面积（m²）</span>
                            <span>{{report.landUseArea?report.landUseArea:'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>土地性质</span>
                            <span>{{report.landNature?report.landNature===1?'划拨':'出让':'/'}}</span>
                        </li>
                        <div class="propertyRightAddr van-hairline--bottom">
                            <p>产权地址</p>
                            <p class="van-ellipsis">{{contractDetail.recordVersion==2?contractDetail.propertyRightAddr:'/'}}</p>
                        </div>
                        <li class="van-hairline--bottom">
                            <span>权属证号</span>
                            <span>{{report.ownershipNumber?report.ownershipNumber:'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>预缴税费（万元）</span>
                            <span>{{report.payTaxation?report.payTaxation:'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>房屋总楼层</span>
                            <span>{{contractDetail.houseInfo.FloorAll?contractDetail.houseInfo.FloorAll:'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>建筑结构</span>
                            <span>{{report.buildingStructure?report.buildingStructure:'/'}}</span>
                        </li>
                        <li>
                            <span>评估值（万元）</span>
                            <span>{{report.evaluationValue?report.evaluationValue:'/'}}</span>
                        </li>
                    </ul>
                </div>
                <!-- 客源方信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>客源方信息</div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>店长</span>
                            <span>{{report.guestShopOwnerName?report.guestShopOwnerName:'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>门店</span>
                            <span>{{report.guestStoreName?report.guestStoreName:'/'}}</span>
                        </li>
                        <li>
                            <span>联系电话</span>
                            <span>{{report.guestShopOwnerMobile?report.guestShopOwnerMobile:'/'}}</span>
                        </li>
                    </ul>
                </div>
                <!-- 房源方信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>房源方信息</div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>店长</span>
                            <span>{{report.houseShopOwnerName?report.houseShopOwnerName:'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>门店</span>
                            <span>{{report.houseStoreName?report.houseStoreName:'/'}}</span>
                        </li>
                        <li>
                            <span>联系电话</span>
                            <span>{{report.houseShopOwnerMobile?report.houseShopOwnerMobile:'/'}}</span>
                        </li>
                    </ul>
                </div>
                <!-- 买方信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>买方信息</div>
                    <div class="personList" v-for="(item,index) in guestList" :key="index">
                        <div class="personTitle">客户{{index+1}}</div>
                        <ul class="msg personnel">
                            <li class="van-hairline--bottom">
                                <span>姓名</span>
                                <span>{{item.name}}</span>
                            </li>
                            <li class="van-hairline--bottom">
                                <span>证件号码</span>
                                <span>{{item.cardType===1?'（身份证号）':item.cardType===2?'（护照）':item.cardType===3?'（营业执照）':'（军官证）'}}{{item.identifyCode}}</span>
                            </li>
                            <li>
                                <span>联系电话</span>
                                <span>{{item.mobile}}</span>
                            </li>
                        </ul>
                    </div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>付款方式</span>
                            <template v-for="item in dictionary['621']">
                                <span :key="item.key" v-if="report.buyerPaymentMethod===item.key">{{item.value}}</span>
                            </template>
                            <span v-if="!report.buyerPaymentMethod">/</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>交易流程</span>
                            <span>{{report.transFlowName?report.transFlowName:'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>按揭银行</span>
                            <span>{{report.stagesBankName?report.stagesBankName:'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>贷款金额（万元）</span>
                            <span>{{report.loanAmount?report.loanAmount:'/'}}</span>
                        </li>
                        <li>
                            <span>贷款期限（年）</span>
                            <span>{{report.loanTerm?report.loanTerm:'/'}}</span>
                        </li>
                    </ul>
                </div>
                <!-- 卖方信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>卖方信息</div>
                    <div class="personList" v-for="(item,index) in ownerList" :key="index">
                        <div class="personTitle">客户{{index+1}}</div>
                        <ul class="msg personnel">
                            <li class="van-hairline--bottom">
                                <span>姓名</span>
                                <span>{{item.name}}</span>
                            </li>
                            <li class="van-hairline--bottom">
                                <span>证件号码</span>
                                <span>{{item.cardType===1?'（身份证号）':item.cardType===2?'（护照）':item.cardType===3?'（营业执照）':'（军官证）'}}{{item.identifyCode}}</span>
                            </li>
                            <li>
                                <span>联系电话</span>
                                <span>{{item.mobile}}</span>
                            </li>
                        </ul>
                    </div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>是否析产（继承）</span>
                            <span>{{report.isExtend==='1'?"是":report.isExtend==='0'?"否":'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>婚姻状况</span>
                            <template v-for="item in dictionary['624']">
                                <span :key="item.key" v-if="report.maritalStatus===item.key">{{item.value}}</span>
                            </template>
                            <span v-if="!report.maritalStatus">/</span>
                        </li>
                    </ul>
                </div>
                <!-- 买方代理人信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>买方代理人信息</div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>代理人姓名</span>
                            <span>{{report.buyerAgentName?report.buyerAgentName:'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>证件类型</span>
                            <span>{{report.buyerAgentCardType===1?'身份证号':report.buyerAgentCardType===2?'护照':report.buyerAgentCardType===3?'营业执照':report.buyerAgentCardType===4?'军官证':"/"}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>证件号码</span>
                            <span>{{report.buyerAgentCard?report.buyerAgentCard:"/"}}</span>
                        </li>
                        <li>
                            <span>联系电话</span>
                            <span>{{report.buyerAgentMobile?report.buyerAgentMobile:'/'}}</span>
                        </li>
                    </ul>
                </div>
                <!-- 卖方代理人信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>卖方代理人信息</div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>代理人姓名</span>
                            <span>{{report.sellerAgentName?report.sellerAgentName:'/'}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>证件类型</span>
                            <span>{{report.sellerAgentCardType===1?'身份证号':report.sellerAgentCardType===2?'护照':report.sellerAgentCardType===3?'营业执照':report.sellerAgentCardType===4?'军官证':"/"}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>证件号码</span>
                            <span>{{report.sellerAgentCard?report.sellerAgentCard:"/"}}</span>
                        </li>
                        <li>
                            <span>联系电话</span>
                            <span>{{report.sellerAgentMobile?report.sellerAgentMobile:'/'}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="btnList">
                <span v-if="power['sign-ht-info-edit'].state" class="editStyle" @click="toReportEdit">编辑</span>
            </div>
        </div>
        <!-- tab主体 合同详情 -->
        <div class="mainPart" v-if="isActive===2">
            <div class="mainBody" ref="maindetails">
                <!-- 合同信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>合同信息</div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>合同编号</span>
                            <span>{{contractDetail.code}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>签约方式</span>
                            <span>{{contractDetail.recordType.label}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>签约时间</span>
                            <span>{{contractDetail.signDate}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>合同类型</span>
                            <span>{{contractDetail.contType.label}}</span>
                        </li>
                        <li class="van-hairline--bottom">
                            <span>{{contractDetail.contType.value===1?"租金":(contractDetail.contType.value===2||contractDetail.contType.value===3)?"成交总价":contractDetail.contType.value===4?"意向金金额":"定金金额"}}</span>
                            <span class="van-multi-ellipsis--l2 max_w" v-if="contractDetail.contType.value===1">{{contractDetail.dealPrice}}元{{contractDetail.timeUnit===1?"/月":contractDetail.timeUnit===2?"/季度":contractDetail.timeUnit===3?"/半年":"/年"}} {{contractDetail.dealPrice|moneyFormat}}</span>
                            <span class="van-multi-ellipsis--l2 max_w" v-else>{{contractDetail.dealPrice}}元 {{contractDetail.dealPrice|moneyFormat}}</span>
                        </li>
                        <li class="van-hairline--bottom" v-if="contractDetail.contType.value>3">
                            <span>认购总价</span>
                            <span>{{contractDetail.subscriptionPrice}}</span>
                        </li>
                        <li class="van-hairline--bottom" v-if="contractDetail.contType.value>3">
                            <span>房源价格</span>
                            <span>{{contractDetail.houseInfo.ListingPrice}}{{contractDetail.houseInfo.TradeInt == 0?"":contractDetail.houseInfo.TradeInt == 2?"元":contractDetail.houseInfo.TradeInt == 3?"元/月":""}}</span>
                        </li>
                        <li class="van-hairline--bottom" v-if="contractDetail.contType.value<4">
                            <span>客户佣金（元）</span>
                            <span>{{contractDetail.custCommission}}</span>
                        </li>
                        <li class="van-hairline--bottom" v-if="contractDetail.contType.value<4">
                            <span>业主佣金（元）</span>
                            <span>{{contractDetail.ownerCommission}}</span>
                        </li>
                        <li v-if="contractDetail.contType.value<4">
                            <span>佣金合计（元）</span>
                            <span>{{contractDetail.custCommission+contractDetail.ownerCommission}}</span>
                        </li>
                    </ul>
                </div>
                <!-- 房源信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>房源信息</div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>房源编号</span>
                            <span>{{contractDetail.houseinfoCode}}</span>
                        </li>
                        <div class="propertyRightAddr">
                            <p>物业地址</p>
                            <p class="van-ellipsis">{{contractDetail.propertyAddr}}</p>
                        </div>
                        <div class="propertyRightAddr">
                            <p>产权地址</p>
                            <p class="van-ellipsis">{{contractDetail.propertyRightAddr?contractDetail.propertyRightAddr:'-'}}</p>
                        </div>
                        <li class="van-hairline--bottom">
                            <span>建筑面积（m²）</span>
                            <span>{{contractDetail.houseInfo.Square?contractDetail.houseInfo.Square:'-'}}</span>
                        </li>
                        <li>
                            <span>套内面积（m²）</span>
                            <span>{{contractDetail.houseInfo.SquareUse?contractDetail.houseInfo.SquareUse:'-'}}</span>
                        </li>
                    </ul>
                </div>
                <!-- 业主信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>业主信息</div>
                    <div class="personList" v-for="(item,index) in ownerList" :key="index">
                        <div class="personTitle">业主{{index+1}}</div>
                        <ul class="msg personnel">
                            <li class="van-hairline--bottom">
                                <span>姓名</span>
                                <span>{{item.name}}</span>
                            </li>
                            <li class="van-hairline--bottom">
                                <span>电话</span>
                                <!-- <span class="mobile">{{item.mobile}}<van-icon class="phoneIcon" name="phone-circle" @click="call(item)" /></span> -->
                                <span class="mobile">{{item.mobile}}<span v-if="power['sign-ht-xq-ly-call'].state" class="phoneIcon" @click="call(item)"><i class="iconfont icondianhua"></i></span></span>
                            </li>
                            <li v-if="contType<4" class="van-hairline--bottom">
                                <span>关系</span>
                                <span>{{item.relation}}</span>
                            </li>
                            <li v-if="contType===2||contType===3" class="van-hairline--bottom">
                                <span>产权比</span>
                                <span>{{item.propertyRightRatio}}%</span>
                            </li>
                            <li class="van-hairline--bottom">
                                <span>证件号码</span>
                                <span>{{item.cardType===1?'（身份证号）':item.cardType===2?'（护照）':item.cardType===3?'（营业执照）':'（军官证）'}}{{item.identifyCode}}</span>
                            </li>
                            <li class="van-hairline--bottom" v-if="item.cardType===3">
                                <span>企业名称</span>
                                <span>{{item.companyName}}</span>
                            </li>
                            <li class="van-hairline--bottom" v-if="item.cardType===3">
                                <span>法人名称</span>
                                <span>{{item.lepName}}</span>
                            </li>
                            <li class="van-hairline--bottom" v-if="item.cardType===3">
                                <span>法人身份证号</span>
                                <span>{{item.lepIdentity}}</span>
                            </li>
                            <li>
                                <span>邮箱</span>
                                <span>{{item.email}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 客源信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>客源信息</div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>客源编号</span>
                            <span>{{contractDetail.guestinfoCode?contractDetail.guestinfoCode:"--"}}</span>
                        </li>
                    </ul>
                </div>
                <!-- 客户信息 -->
                <div class="detailModule">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>客户信息</div>
                    <div class="personList" v-for="(item,index) in guestList" :key="index">
                        <div class="personTitle">客户{{index+1}}</div>
                        <ul class="msg personnel">
                            <li class="van-hairline--bottom">
                                <span>姓名</span>
                                <span>{{item.name}}</span>
                            </li>
                            <li class="van-hairline--bottom">
                                <span>电话</span>
                                <span class="mobile">{{item.mobile}}<span v-if="power['sign-ht-xq-ly-call'].state" class="phoneIcon" @click="call(item)"><i class="iconfont icondianhua"></i></span></span>
                            </li>
                            <li v-if="contType<4" class="van-hairline--bottom">
                                <span>关系</span>
                                <span>{{item.relation}}</span>
                            </li>
                            <li v-if="contType===2||contType===3" class="van-hairline--bottom">
                                <span>产权比</span>
                                <span>{{item.propertyRightRatio}}%</span>
                            </li>
                            <li class="van-hairline--bottom">
                                <span>证件号码</span>
                                <span>{{item.cardType===1?'（身份证号）':item.cardType===2?'（护照）':item.cardType===3?'（营业执照）':'（军官证）'}}{{item.identifyCode}}</span>
                            </li>
                            <li class="van-hairline--bottom" v-if="item.cardType===3">
                                <span>企业名称</span>
                                <span>{{item.companyName}}</span>
                            </li>
                            <li class="van-hairline--bottom" v-if="item.cardType===3">
                                <span>法人名称</span>
                                <span>{{item.lepName}}</span>
                            </li>
                            <li class="van-hairline--bottom" v-if="item.cardType===3">
                                <span>法人身份证号</span>
                                <span>{{item.lepIdentity}}</span>
                            </li>
                            <li>
                                <span>邮箱</span>
                                <span>{{item.email}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 备注 -->
                <div class="detailModule" v-if="contractDetail.remarks&&contractDetail.remarks.length>0">
                    <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>备注栏</div>
                    <ul class="msg">
                        <li class="van-hairline--bottom">
                            <span>{{contractDetail.remarks}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="btnList">
                <span class="editStyle_"  v-if="(power['sign-ht-info-edit'].state&&(contractDetail.recordType.value===1||contractDetail.recordType.value===10)&&contractDetail.contState.value!=3)" @click="toContEdit">编辑</span>
                <span class="arraignedStyle" v-if="power['sign-ht-view-toverify'].state&&(contractDetail.toExamineState.value<0||contractDetail.toExamineState.value===2)&&contractDetail.isCanAudit===1" @click="showDialog('auto')">提审</span>
                <span class="arraignedStyle" v-if="power['sign-ht-xq-void'].state&&(contractDetail.recordType.value!=2&&contractDetail.contState.value===2)" @click="showDialog('invalid')">撤单</span>
            </div>
        </div>
        <!-- tab主体 回访录音 -->
        <div class="mainPart" :class="{'bottom_0':isActive===3}" v-if="isActive===3">
            <recordList :code="contractDetail.code"></recordList>
        </div>
        <!-- 虚拟小号弹窗 -->
        <van-dialog v-model="callDialog" title="号码绑定成功" show-cancel-button confirm-button-text="拨打" @confirm="toCall">
            <div class="callDialog">请拨打电话{{callNumber}}联系客户</div>
        </van-dialog>
        <!-- 合同提审/撤单确认弹窗 -->
        <van-dialog v-model="verifyDialog" :title="dialogType==='auto'?'确认提审？':'确认撤单？'" show-cancel-button @confirm="toConfirm">
            <div class="callDialog">{{dialogType==='auto'?'请仔细核对合同内容是否有误':'撤单后，合同需重新提审'}}</div>
        </van-dialog>
        <!-- 拨打电话 -->
        <a :href="getMobile" ref="phone" style="position: absolute;bottom:-100px;"></a>
    </div>
</template>
           
<script>
import {mapGetters} from 'vuex'
import {Tab, Tabs, Icon, Dialog } from 'vant';
import { TOOL, MIXINS } from "@/assets/js/common";
import recordList from "@/components/recordList"
export default{
    mixins: [MIXINS],
    components:{
        [Tab.name]:Tab,
        [Tabs.name]:Tabs,
        [Icon.name]:Icon,
        [Dialog.Component.name]: Dialog.Component,
        recordList,
    },
    data(){
        return{
            contType:'',//合同类型
            isActive: 1,//tab栏选中
            id:'',//合同id
            contractDetail:{//合同详情
                contType:{},
                houseInfo: {},
                recordType:{},//线上线下合同
                contState:{},//合同状态
                toExamineState:{},//合同审核状态
            },
            guestList:[],//客户列表
            ownerList:[],//业主列表
            report: {//成交报告
                cardSituation: "",
                mortgageSituation: "",
                isEarlyRepayment: "",
                landUseArea: "",
                landNature: "",
                ownershipNumber: "",
                payTaxation: "",
                buildingStructure: "",
                evaluationValue: "",
                buyerPaymentMethod: "",
                transFlowCode: "",
                transFlowName: "",
                stagesBankName: "",
                loanAmount: "",
                loanTerm: "",
                isExtend: "",
                maritalStatus: "",
                buyerAgentName: "",
                buyerAgentCardType: "",
                buyerAgentCard: "",
                buyerAgentMobile: "",
                sellerAgentName: "",
                sellerAgentCardType: "",
                sellerAgentCard: "",
                sellerAgentMobile: "",
                guestShopOwnerName: "",
                guestStoreName: "",
                guestShopOwnerMobile: "",
                houseShopOwnerName: "",
                houseStoreName: "",
                houseShopOwnerMobile: ""
            },
            canCall:true,//拨打按钮节流阀
            callNumber:'',//虚拟号码
            callDialog:false,//拨打电话弹窗

            dialogType:'',
            verifyDialog:false,//确认提审/撤单弹窗

            flowList: [], //交易流程

            //数据字典
            dictionary: {
                "611": "", //两证情况
                "615": "", //抵押情况
                "618": "", //土地性质
                "621": "", //买方付款方式
                "624": "", //婚姻状况
                "630": "" //代理人证件类型
            },
        }
    },
    created () {
        this.getDictionary()//字典
        this.getFlowList()//交易流程
        this.id=Number(this.$route.query.id)
        this.contType=Number(this.$route.query.contType)
        if(this.contType!=2&&this.contType!=3){
            this.isActive=2
            this.watermark()
        }
        if(this.contType==2||this.contType==3){
            this.isActive=1
            this.watermark()
        }
        this.getContDetail()
    },
    methods:{
        //添加水印
        watermark(){
            this.$nextTick(()=>{
                this.$tool.waterMark(`${this.getUserMsg.user.depName}${this.getUserMsg.user.name}${this.getUserMsg.user.mobile}`,this.$refs.maindetails);
            })
        },
        //tab栏切换
        changeTab(val){
            if(document.querySelector("#watermark")){
                document.querySelector("#watermark").remove()
            }
            this.isActive=val
            if(val!=3){
                this.watermark()
            }
            // else{//非合同详情tab删除水印
            //     if(document.querySelector("#watermark")){
            //         document.querySelector("#watermark").remove()
            //     }
            // }
        },
        //获取交易流程
        getFlowList() {
            this.$ajax.get('/api/contract/getTransFlowListByCity').then(res => {
                res = res.data
                if(res.status === 200) {
                    this.flowList = res.data
                }
            }).catch(error => {
                this.$toast(error)
            })
        },
        //获取合同详情
        getContDetail(){
            let param = {
                id: this.id
            }
            this.$ajax.get("/api/contract/detail", param).then(res => {
                res=res.data
                if(res.status===200){
                    this.contractDetail = res.data;
                    this.contType=res.data.contType.value
                    this.contractDetail.signDate = res.data.signDate.substr(0, 16);
                    this.ownerList=[];
                    this.guestList=[];
                    for (var i = 0; i < this.contractDetail.contPersons.length; i++) {
                        if (this.contractDetail.contPersons[i].personType.value === 1) {
                            this.ownerList.push(this.contractDetail.contPersons[i]);
                        } else if (
                            this.contractDetail.contPersons[i].personType.value === 2
                        ) {
                            this.guestList.push(this.contractDetail.contPersons[i]);
                        }
                    }
                    //成交报告
                    if(!res.data.dealReport) {
                        this.report.guestShopOwnerName = this.recordVersion === 1 ? res.data.dealAgentShopowner : res.data.guestInfo.ShopOwnerName
                        this.report.guestStoreName = this.recordVersion === 1 ? res.data.dealAgentStoreName : res.data.guestInfo.GuestStoreName
                        this.report.guestShopOwnerMobile = this.recordVersion === 1 ? res.data.dealAgentShopownerMobile :res.data.guestInfo.ShopOwnerMobile
                        this.report.houseShopOwnerName = res.data.houseInfo.ShopOwnerName
                        this.report.houseStoreName = res.data.houseInfo.HouseStoreName
                        this.report.houseShopOwnerMobile = res.data.houseInfo.ShopOwnerMobile   
                    }else{
                        this.report=JSON.parse(res.data.dealReport)
                    }
                }
            })
        },
        //拨打电话弹窗
        call(val){
            if(this.canCall){
                this.canCall=false
                var param = {
                    plateType:0,
                    id:val.pid,
                    contractCode:this.contractDetail.code,
                    sourceType:val.personType.value===1?0:1,
                    calledMobile:val.encryptionMobile,
                    calledName:val.name
                };
                this.$ajax.get('/api/record/virtualNum',param).then(res=>{
                    res=res.data;
                    if(res.status===200){
                        this.callNumber=res.data.virtualNum;
                        this.callDialog = true;
                        this.canCall=true
                    }
                }).catch(error=>{
                    this.$toast(error)
                    this.canCall=true
                })
            }
        },
        //拨打电话
        toCall(){
            this.callDialog = false;
            this.$refs.phone.click()
        },
        //提审/撤单弹窗
        showDialog(type){
            this.dialogType=type
            this.verifyDialog=true
        },
        // 确认
        toConfirm(){
            if(this.dialogType==='auto'){//提审
                let param = {
                    cityId:this.contractDetail.cityCode,
                    flowType:3,
                    bizCode:this.contractDetail.code,
                    modularType:0//合同类型
                }
                this.$ajax.get('/api/machine/submitAduit', param).then(res=>{
                    this.submitAduitDialog=false;
                    res=res.data;
                    if(res.status===200){
                        this.$toast('提审成功')
                        this.$router.push({
                            path: "/contractHomePage",
                        });
                    }
                }).catch(error => {
                    if(error.message==='下一节点审批人不存在'){
                        this.isSubmitAudit=false;
                        this.$router.push({
                            path:'setReviewer',
                            query:{
                                code:this.contractDetail.code,
                                flowType:3,
                                checkType:0,
                            }
                        })
                    }else{
                        this.$toast(error)
                    }
                })
            }else{//撤单
                let param = {
                    id: this.id
                };
                this.$ajax.post('/api/contract/invalid', param).then(res=>{
                    res=res.data;
                    if(res.status===200){
                        this.$toast('操作成功')
                        this.$router.push({
                            path: "/contractHomePage",
                        });
                    }
                }).catch(error=>{
                    this.$toast(error)
                })
            }
            
        },
        //合同编辑
        toContEdit(){
            this.$router.push({
                path:'/addContract',
                query:{
                    id:this.id,//合同id
                    operationType:'edit',
                    title:'合同编辑'
                }
            })
        },
        //成交报告编辑
        toReportEdit(){
            this.$router.push({
                path:'/editDealReport',
                query:{
                    id:this.id,//合同id
                }
            })
        },
    },
    computed: {
        getMobile: function () {
            return `tel://${this.callNumber}`
        },
        ...mapGetters([
            'getUserMsg',
            'getPowerCode',
        ]),
        power() {
            return this.getPowerCode
        }
    },
    filters: {
        moneyFormat: function(val) {
            if (!val) {
                return "零";
            } else {
                return TOOL.toChineseNumber(val);
            }
        },
    }
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
/deep/.van-tab{
    color: @text-grey-999;
}
/deep/.van-tab__text {
    font-size: 16px;
}
/deep/.van-tab--active{
    font-weight: bold;
    color: @text-grey-333;
}
/deep/.van-tabs__content{
    background-color: @bg-grey;
    padding: 10px 0;
}
.contract-detail{
    position: relative;
    background-color: @bg-grey;
    height: calc(100% - 60px);
    overflow-y: scroll;
    -webkit-overflow-scrolling:touch
}
.tabList{
    position: relative;
    background-color: @bg-white;
    display: flex;
    border-bottom: 1px solid @bg-grey;
    li{
        flex-grow: 1;
        text-align: center;
        font-size: 16px;
        padding: 10px 0;
    }
    .actived{
        font-weight: bold;
    }
    .tabs_line{
        width: 22px;
        transform: translateX(270%) translateX(-50%);
        transition-duration: 0.3s;
        background-color: @text-green;
        border-radius: 1px;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        height: 2px;
    }
}
.mainPart{
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    .mainBody{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        padding-bottom: 85px;
        overflow: auto;
    }
}
.bottom_0{
    bottom: 0;
}
.detailModule{
    overflow: hidden;
    background-color: @bg-white;
    margin-bottom: 10px;
    &:last-of-type{
        margin-bottom: 0;
    }
    .title{
        color: @text-grey-333;
        font-size: 16px;
        font-weight: bold;
        line-height: 45px;
        padding: 0 10px 0 25px;
        position: relative;
        >i{
            color: @text-green;
            font-size: 24px;
            position: absolute;
            top: 0;
            left: 2px;
        }
        // border: 1px solid @border-grey;
    }
    .msg{
        font-size: 14px;
        padding: 0 10px;
        color: @text-grey-333;
        li{
            box-sizing: border-box;
            padding: 13px;
            display: flex;
            justify-content: space-between;
            // border-bottom: 1px solid @border-grey;
            // &:last-of-type{
            //     border-bottom: none;
            // }
            span{
                &:first-of-type{
                    color: @text-grey-999;
                }
            }
            .max_w{
                max-width: 220px;
            }
        }
        .propertyRightAddr{
            p{
                padding: 12px 12px 0 12px;
                &:first-of-type{
                    color: @text-grey-999;
                }
                &:last-of-type{
                    padding: 10px 12px 15px 12px;
                    // border-bottom: 1px solid @border-grey;
                }
            }
        }
    }
    .personList{
        width: 344px;
        margin: 0 auto;
    }
    .personTitle{
        font-size: 14px;
        color: @text-grey-333;
        font-weight: bold;
        background-color: @border-grey;
        padding: 0 20px;
        margin-top: 16px;
        line-height: 40px;
        border-radius: 7px 7px 0 0;
    }
    .personnel{
        padding: 0 20px 10px 20px;
        margin: 0 auto 10px;
        border-radius: 0 0 7px 7px;
        overflow: hidden;
        background-color: @bg-light-grey;
        li{
            padding: 13px 0;
            border-color: @border-grey;
            position: relative;
            .mobile{
                padding-right: 25px;
            }
            .phoneIcon{
                color: @text-white;
                position: absolute;
                right: 0;
                top: 12px;
                display: inline-block;
                width: 18px;
                height: 18px;
                background-color: @text-green;
                border-radius: 10px;
                i{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    color: @text-white;
                    font-size: 12px;
                }
            }
        }
    }
}
.btnList{
    position: absolute;
    background-color: @bg-white;
    bottom: 0;
    // height: 76px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    // padding: 13px 14px;
    display: flex;
    span{
        margin: 14px;
        flex-grow: 1;
        display: inline-block;
        line-height: 50px;
        border-radius: 4px;
        font-size: 16px;
    }
    .editStyle{
        width: 345px;
        color: @bg-white;
        background-color: @text-green;
    }
    .editStyle_{
        width:163px;
        color: @text-green;
        background-color: @bg-white;
        border: 1px solid @text-green;
    }
    .arraignedStyle{
        width:163px;
        color: @bg-white;
        background-color: @text-green;
        margin-left: 13px;
        border: 1px solid @text-green;
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
.callDialog{
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: @text-grey-666;
}    
</style>
