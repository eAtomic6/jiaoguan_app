<template>
    <div class="dealReport">
        <van-form @submit="onSubmit" autocomplete="off" :scroll-to-error='true'>
            <!-- 合同基本信息 -->
            <div class="msgModule">
                <div class="title">合同基本信息</div>
                <van-field
                input-align="right"
                v-model="dealBasicInfo.signDate"
                name="signDate"
                label="签约时间"
                placeholder="签约时间"
                disabled
                />

                <van-field
                input-align="right"
                v-model="dealBasicInfo.code"
                type="text"
                name="code"
                label="合同编号"
                placeholder="请输入"
                disabled
                />

                <van-field
                input-align="right"
                v-model="dealBasicInfo.contType"
                name="contType"
                label="交易类型"
                placeholder="交易类型"
                disabled
                />
                
                <van-field
                input-align="right"
                v-model="dealBasicInfo.dealPrice"
                type="number"
                name="dealPrice"
                label="房屋总价"
                placeholder="请输入"
                disabled
                />

                <van-field
                input-align="right"
                v-model="dealBasicInfo.receivableCommission"
                type="number"
                naem="ownerCommission"
                label="应收佣金（元）"
                placeholder="请输入"
                disabled
                />
            </div>
            <!-- 房屋基本信息 -->
            <div class="msgModule">
                <div class="title">房屋基本信息</div>
                <van-field
                input-align="right"
                v-model="reportForm.cardSituationName"
                name="cardSituationName"
                label="两证情况"
                placeholder="请选择"
                disabled
                @click="showPopList('cardSituation')"
                :rules="[{ required: true, message: '请选择两证情况' }]"
                />

                <van-field
                input-align="right"
                v-model="reportForm.mortgageSituationName"
                name="mortgageSituation"
                label="抵押情况"
                placeholder="请选择"
                disabled
                @click="showPopList('mortgageSituation')"
                :rules="[{ required: true, message: '请选择抵押情况' }]"
                />

                <div class="radioStyle" id="earlyRepayment">
                    <div class="label">提前还款</div>
                    <div class="list">
                        <van-radio-group v-model="reportForm.isEarlyRepayment" direction="horizontal" @change="changeRadio('isEarlyRepayment')">
                            <van-radio checked-color="#3EBA70" name="1">是</van-radio>
                            <van-radio checked-color="#3EBA70" name="0">否</van-radio>
                        </van-radio-group>
                    </div>
                    <div class="errorMsg" :class="{'showError':repaymentError}">请选择是否提前还款</div>
                </div>

                <van-field
                input-align="right"
                v-model="dealBasicInfo.Square"
                type="number"
                name="Square"
                label="建筑面积（m²）"
                placeholder="请输入"
                disabled
                />

                <van-field
                class="longLabel"
                input-align="right"
                v-model="reportForm.landUseArea"
                type="number"
                name="landUseArea"
                label="土地使用权面积（m²）（选填）"
                placeholder="请输入"
                @input="formatter('landUseArea')"
                />

                <van-field
                class="longLabel"
                input-align="right"
                v-model="reportForm.landNatureName"
                name="landNature"
                label="土地性质（选填）"
                placeholder="请选择"
                disabled
                @click="showPopList('landNature')"
                />

                <van-field
                input-align="right"
                v-model="reportForm.ownershipNumber"
                type="number"
                name="ownershipNumber"
                label="权属证号"
                placeholder="请输入"
                @input="formatter('ownershipNumber')"
                :rules="[{ required: true, message: '请输入权属证号' }]"
                />

                <van-field
                input-align="right"
                v-model="dealBasicInfo.CompleteYear"
                type="number"
                name="Square"
                label="建成年代"
                placeholder="请输入"
                disabled
                />

                <div class="radioStyle">
                    <div class="label">产权地址</div>
                    <div class="inputStyle van-ellipsis">
                        {{dealBasicInfo.propertyRightAddr}}
                    </div>
                </div>

                <van-field
                class="longLabel"
                input-align="right"
                v-model="reportForm.payTaxation"
                type="number"
                name="payTaxation"
                label="预缴税费（万元）（选填）"
                placeholder="请输入"
                @input="formatter('payTaxation')"
                />

                <van-field
                input-align="right"
                v-model="dealBasicInfo.FloorAll"
                type="number"
                name="payTaxation"
                label="房屋总楼层"
                placeholder="请输入"
                disabled
                />

                <van-field
                class="longLabel"
                input-align="right"
                v-model="reportForm.buildingStructure"
                type="text"
                maxlength="10"
                name="payTaxation"
                label="建筑结构（选填）"
                placeholder="请输入"
                @input="formatter('buildingStructure')"
                />

                <van-field
                class="longLabel"
                input-align="right"
                v-model="reportForm.evaluationValue"
                type="number"
                name="evaluationValue"
                label="评估值（万元）（选填）"
                placeholder="请输入"
                @input="formatter('evaluationValue')"
                />
            </div>
            <!-- 客源方信息 -->
            <div class="msgModule">
                <div class="title">客源方信息</div>
                <van-field
                input-align="right"
                v-model="reportForm.guestShopOwnerName"
                type="text"
                name="guestShopOwnerName"
                label="店长"
                placeholder="请输入店长"
                @input="formatter('guestShopOwnerName')"
                :rules="[{ required: true, message: '请输入店长姓名' }]"
                />

                <van-field
                input-align="right"
                v-model="reportForm.guestStoreName"
                type="text"
                name="guestStoreName"
                label="门店"
                placeholder="请输入门店"
                @input="formatter('guestStoreName')"
                :rules="[{ required: true, message: '请输入门店名称' }]"
                />

                <van-field
                input-align="right"
                v-model="reportForm.guestShopOwnerMobile"
                type="tel"
                maxlength='11'
                name="guestShopOwnerMobile"
                label="联系电话"
                placeholder="请输入联系电话"
                @input="formatter('guestShopOwnerMobile')"
                :rules="[{ validator, message: '请输入正确电话号码' }]"
                />
            </div>
            <!-- 房源方信息 -->
            <div class="msgModule">
                <div class="title">房源方信息</div>
                <van-field
                input-align="right"
                v-model="reportForm.houseShopOwnerName"
                type="text"
                name="houseShopOwnerName"
                label="店长"
                placeholder="请输入店长"
                @input="formatter('houseShopOwnerName')"
                :rules="[{ required: true, message: '请输入店长姓名' }]"
                />

                <van-field
                input-align="right"
                v-model="reportForm.houseStoreName"
                type="text"
                name="houseStoreName"
                label="门店"
                placeholder="请输入门店"
                @input="formatter('houseStoreName')"
                :rules="[{ required: true, message: '请输入门店名称' }]"
                />

                <van-field
                input-align="right"
                v-model="reportForm.houseShopOwnerMobile"
                type="tel"
                maxlength='11'
                name="houseShopOwnerMobile"
                label="联系电话"
                placeholder="请输入联系电话"
                @input="formatter('houseShopOwnerMobile')"
                :rules="[{ validator, message: '请输入正确电话号码' }]"
                />
            </div>
            <!-- 买方信息 -->
            <div class="msgModule">
                <div class="title">买方信息</div>
                <!-- 人员信息 -->
                <div class="personList" v-for="(item,index) in guestList" :key="index">
                    <van-field
                    input-align="right"
                    v-model="item.name"
                    :name="'guestName'+index"
                    label="姓名"
                    placeholder="请输入"
                    disabled
                    />

                    <van-field
                    input-align="right"
                    v-model="item.mobile"
                    :name="'guestMobile'+index"
                    label="电话"
                    placeholder="请输入"
                    disabled
                    />

                    <van-field
                    input-align="right"
                    :value="item.encryptionCode?item.encryptionCode:'-'"
                    :name="'guestEncryptionCode'+index"
                    :label="item.cardType===1?'身份证':item.cardType===2?'护照':item.cardType===3?'营业执照':'军官证'"
                    placeholder="请输入"
                    disabled
                    />
                </div>
                <!-- 贷款信息 -->
                <div>
                    <div class="radioStyle" id="paymentMethod">
                        <div class="label">付款方式</div>
                        <div class="list">
                            <van-radio-group v-model="reportForm.buyerPaymentMethod" direction="horizontal" @change="changeRadio('buyerPaymentMethod')">
                                <van-radio v-for="item in dictionary['621']" :key="item.key" checked-color="#3EBA70" :name="item.key">{{item.value}}</van-radio>
                            </van-radio-group>
                        </div>
                        <div class="errorMsg" :class="{'showError':paymethodError}">请选择付款方式</div>
                    </div>

                    <van-field
                    input-align="right"
                    v-model="reportForm.transFlowName"
                    name="transFlowName"
                    label="交易流程"
                    placeholder="请选择"
                    disabled
                    @click="showPopList('transFlowName')"
                    :rules="[{ required: true, message: '请选择交易流程' }]"
                    />

                    <van-field
                    input-align="right"
                    v-model="reportForm.stagesBankName"
                    name="stagesBankName"
                    label="按揭银行"
                    placeholder="请选择"
                    disabled
                    @click="showPopList('stagesBankName')"
                    />

                    <van-field
                    class="longLabel"
                    input-align="right"
                    v-model="reportForm.loanAmount"
                    name="loanAmount"
                    :disabled="noInput"
                    label="贷款金额（万元）"
                    placeholder="请输入"
                    />

                    <van-field
                    input-align="right"
                    v-model="reportForm.loanTerm"
                    name="loanTerm"
                    :disabled="noInput"
                    label="贷款期限（年）"
                    placeholder="请输入"
                    />
                </div>
            </div>
            <!-- 卖方信息 -->
            <div class="msgModule">
                <div class="title">卖方信息</div>
                <!-- 人员信息 -->
                <div class="personList" v-for="(item,index) in ownerList" :key="index">
                    <van-field
                    input-align="right"
                    v-model="item.name"
                    :name="'ownerName'+index"
                    label="姓名"
                    placeholder="请输入"
                    disabled
                    />

                    <van-field
                    input-align="right"
                    v-model="item.mobile"
                    :name="'ownerMobile'+index"
                    label="电话"
                    placeholder="请输入"
                    disabled
                    />

                    <van-field
                    input-align="right"
                    :value="item.encryptionCode?item.encryptionCode:'-'"
                    :name="'ownerEncryptionCode'+index"
                    :label="item.cardType===1?'身份证':item.cardType===2?'护照':item.cardType===3?'营业执照':'军官证'"
                    placeholder="请输入"
                    disabled
                    />
                </div>
                <!-- 贷款信息 -->
                <div>
                    <div class="radioStyle" id="extend">
                        <div class="label">是否析产（继承）</div>
                        <div class="list">
                            <van-radio-group v-model="reportForm.isExtend" direction="horizontal" @change="changeRadio('isExtend')">
                                <van-radio checked-color="#3EBA70" name="1">是</van-radio>
                                <van-radio checked-color="#3EBA70" name="0">否</van-radio>    
                            </van-radio-group>
                        </div>
                        <div class="errorMsg" :class="{'showError':extendError}">是否析产不能为空</div>
                    </div>

                    <van-field
                    class="longLabel"
                    input-align="right"
                    v-model="reportForm.maritalStatusName"
                    name="maritalStatusName"
                    label="婚姻状况（选填）"
                    placeholder="请选择"
                    disabled
                    @click="showPopList('maritalStatus')"
                    />
                </div>
            </div>
            <!-- 买方代理人信息 -->
            <div class="msgModule">
                <div class="title remarkStyle" @click.stop="showAgent('buyer')">买方代理人信息<span>（选填）</span><van-icon class="foldRemark" :name="buyerState?'arrow-down':'arrow-up'" /></div>
                <div v-if="buyerState">
                    <van-field
                        input-align="right"
                        v-model="reportForm.buyerAgentName"
                        name="buyerAgentName"
                        label="代理人姓名"
                        placeholder="请输入"
                        @input="formatter('buyerAgentName')"
                        />

                        <van-field
                        input-align="right"
                        :value="reportForm.buyerAgentCardType===1?'身份证':reportForm.buyerAgentCardType===2?'护照':reportForm.buyerAgentCardType===3?'营业执照':reportForm.buyerAgentCardType===4?'军官证':''"
                        name="buyerAgentCardType"
                        label="证件类型"
                        placeholder="请选择"
                        disabled
                        @click="showPopList('buyerCardType')"
                        />

                        <van-field
                        input-align="right"
                        v-model="reportForm.buyerAgentCard"
                        name="buyerAgentCard"
                        label="证件号码"
                        placeholder="请输入"
                        :maxlength="reportForm.buyerAgentCardType===1?18:reportForm.buyerAgentCardType===2?30:reportForm.buyerAgentCardType===3?20:10"
                        @input="formatter('buyerAgentCard')"
                        />

                        <van-field
                        input-align="right"
                        type="tel"
                        v-model="reportForm.buyerAgentMobile"
                        name="buyerAgentMobile"
                        label="电话"
                        placeholder="请输入"
                        @input="formatter('buyerAgentMobile')"
                        />
                </div>
            </div>
            <!-- 卖方代理人信息 -->
            <div class="msgModule">
                <div class="title remarkStyle" @click.stop="showAgent('seller')">卖方代理人信息<span>（选填）</span><van-icon class="foldRemark" :name="sellerState?'arrow-down':'arrow-up'" /></div>
                <div v-if="sellerState">
                    <van-field
                    input-align="right"
                    v-model="reportForm.sellerAgentName"
                    name="sellerAgentName"
                    label="代理人姓名"
                    placeholder="请输入"
                    @input="formatter('sellerAgentName')"
                    />

                    <van-field
                    input-align="right"
                    :value="reportForm.sellerAgentCardType===1?'身份证':reportForm.sellerAgentCardType===2?'护照':reportForm.sellerAgentCardType===3?'营业执照':reportForm.sellerAgentCardType===4?'军官证':''"
                    name="sellerAgentCardType"
                    label="证件类型"
                    placeholder="请选择"
                    disabled
                    @click="showPopList('sellerCardType')"
                    @input="formatter('buyerAgentName')"
                    />

                    <van-field
                    input-align="right"
                    v-model="reportForm.sellerAgentCard"
                    name="sellerAgentCard"
                    label="证件号码"
                    placeholder="请输入"
                    :maxlength="reportForm.sellerAgentCardType===1?18:reportForm.sellerAgentCardType===2?30:reportForm.sellerAgentCardType===3?20:10"
                    @input="formatter('sellerAgentCard')"
                    />

                    <van-field
                    input-align="right"
                    v-model="reportForm.sellerAgentMobile"
                    name="sellerAgentMobile"
                    label="电话"
                    placeholder="请输入"
                    @input="formatter('sellerAgentMobile')"
                    />
                </div>
                
            </div>
            <div class="submitBtn">
                <van-button native-type="submit">
                    保存
                </van-button>
            </div>
        </van-form>
        <!-- 选择器弹窗 -->
        <popList v-if="popState" :showTitle="showPopTitle" :title="popTitle" :list="selectList" :state="popState" :activeId='popSelectId' @chose="confirmChose" @close="closePop"></popList>
    </div>
</template>
           
<script>
import popList from '@/components/popList'
import {Form, Field, RadioGroup, Radio } from 'vant';
import { MIXINS, TOOL } from "@/assets/js/common";
export default{
    mixins: [MIXINS],
    components: {
        [Form.name]:Form,
        [Field.name]:Field,
        [RadioGroup.name]:RadioGroup,
        [Radio.name]:Radio,
        popList,
    }, 
    data(){
        return{
            contType:'',//合同类型
            id:'',//合同id
            reportForm:{
                guestShopOwnerName:'',
                guestStoreName:'',
                guestShopOwnerMobile:'',
                houseShopOwnerName:'',
                houseStoreName:'',
                houseShopOwnerMobile:'',
            },
            dealBasicInfo:{},
            ownerList:[],
            guestList:[],
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
            //银行列表
            bankList: [
                { id: 1, name: "中国工商银行" },
                { id: 2, name: "中国建设银行" },
                { id: 3, name: "中国银行" },
                { id: 4, name: "中国农业银行" },
                { id: 5, name: "交通银行" },
                { id: 6, name: "招商银行" },
                { id: 7, name: "中信银行" },
                { id: 8, name: "中国民生银行" },
                { id: 9, name: "兴业银行" },
                { id: 10, name: "上海浦东发展银行" },
                { id: 11, name: "中国邮政储蓄银行" },
                { id: 12, name: "中国光大银行" },
                { id: 13, name: "平安银行" },
                { id: 14, name: "华夏银行" }
            ],
            buyerState:true,//买方代理人展开
            sellerState:true,//卖方代理人展开

            popListType:'',//选择器组件类型
            popListIndex:'',//选择器组件index
            selectList:[],//选择器组件下拉数组
            popState:false,//选择器组件状态
            popSelectId:-99,//选中id

            repaymentError:false,//提前还款未选择提示
            paymethodError:false,//付款方式未选择提示
            extendError:false,//是否析产未选择提示

            pattern:/^1[0-9]{10}$/,//电话正则
            showPopTitle:false,
            popTitle:'',
            laterStageState:'',//后期状态 1未提交 2未开始 3已开始 5已结案
            noInput:false,
        }
    },
    created(){
        this.id=Number(this.$route.query.id)
        this.getDictionary()//字典
        this.getFlowList()//交易流程
        this.getDealReport()//成交报告
    },
    methods:{
        //提交表单
        onSubmit(){
            if(!this.reportForm.isEarlyRepayment){
                this.repaymentError=true
                document.querySelector("#earlyRepayment").scrollIntoView()
                return
            }else{
                this.repaymentError=false
            }

            if(!this.reportForm.buyerPaymentMethod){
                this.paymethodError=true
                document.querySelector("#paymentMethod").scrollIntoView()
                return
            }else{
                this.paymethodError=false
            }

            if(!this.reportForm.isExtend){
                this.extendError=true
                document.querySelector("#extend").scrollIntoView()
                return
            }else{
                this.extendError=false
            }

            if((this.reportForm.buyerAgentMobile||this.reportForm.buyerAgentCard||this.reportForm.buyerAgentCardType)&&!this.reportForm.buyerAgentName){
                this.$toast('请填写买方代理人姓名')
                return
            }

            if((this.reportForm.sellerAgentMobile||this.reportForm.sellerAgentCard||this.reportForm.sellerAgentCardType)&&!this.reportForm.sellerAgentName){
                this.$toast('请填写卖方代理人姓名')
                return
            }
            this.$ajax.postJSON('/api/contract/updateReport',{report:this.reportForm, id:this.id}).then(res => {
                res = res.data
                if(res.status === 200) {
                    this.$toast("保存成功")
                    this.$router.push({
                        path: "/contractDetail",
                        query: {
                            id: this.id,
                            contType: this.contType
                        }
                    });
                }
            }).catch(error => {
                this.$toast(error)
            })
        },
        // 表单函数校验
        validator(val){
            if(val){
                let reg = /^1[0-9]{10}$/
                return reg.test(String(val))
            }else{
                return false
            }
        },
        //选择器组件弹出
        showPopList(type,index){
            this.popSelectId=-99
            this.popListType=type
            this.popListIndex=index
            let arr = []
            if(type==="cardSituation"){//两证情况
                this.popSelectId=this.reportForm.cardSituation?this.reportForm.cardSituation:-99
                this.dictionary['611'].forEach(element => {
                    let a ={
                        id:element.key,
                        name:element.value,
                    }
                    arr.push(a)
                });
                arr.push({id:0,name:"无"})
            }else if(type==="mortgageSituation"){//抵押情况
                this.popSelectId=this.reportForm.mortgageSituation?this.reportForm.mortgageSituation:-99
                this.dictionary['615'].forEach(element => {
                    let a ={
                        id:element.key,
                        name:element.value,
                    }
                    arr.push(a)
                });
            }else if(type==="landNature"){//土地性质
                this.popSelectId=this.reportForm.landNature?this.reportForm.landNature:-99
                this.dictionary['618'].forEach(element => {
                    let a ={
                        id:element.key,
                        name:element.value,
                    }
                    arr.push(a)
                });
            }else if(type==="transFlowName"){//交易流程
                if([1,2,4].includes(this.laterStageState)){
                    this.popSelectId=this.reportForm.transFlowCode?this.reportForm.transFlowCode:-99
                    arr=[].concat(this.flowList)
                }
            }else if(type==="stagesBankName"){//按揭银行
                this.popSelectId=this.reportForm.stagesBankName?this.reportForm.stagesBankName:-99
                arr=[].concat(this.bankList)
            }else if(type==="maritalStatus"){//婚姻状况
                this.popSelectId=this.reportForm.maritalStatus?this.reportForm.maritalStatus:-99
                this.dictionary['624'].forEach(element => {
                    let a ={
                        id:element.key,
                        name:element.value,
                    }
                    arr.push(a)
                });
            }else if(type==="buyerCardType"||type==="sellerCardType"){//买方代理人证件类型
                if(type==="buyerCardType"){
                    this.popSelectId=this.reportForm.buyerAgentCardType?this.reportForm.buyerAgentCardType:-99
                }else{
                    this.popSelectId=this.reportForm.sellerAgentCardType?this.reportForm.sellerAgentCardType:-99
                }
                this.dictionary['630'].forEach(element => {
                    let a ={
                        id:element.key,
                        name:element.value,
                    }
                    arr.push(a)
                });
            }
            this.selectList=[].concat(arr)
            if(type==="stagesBankName"){
                this.popState=!this.noInput?true:false
            }else if(type==="transFlowName"){
                if([1,2,4].includes(this.laterStageState)){
                    this.popState=true
                }
            }else{
                this.popState=true
            }
            // Popup弹窗标题和文本
            this.showPopTitle=true
            this.popTitle=type
        },
        //选择器组件确认
        confirmChose(val){
            this.popState=false
            if(this.popListType==="cardSituation"){
                this.reportForm.cardSituation=val?val.id:''
                this.reportForm.cardSituationName=val?val.name:''
            }if(this.popListType==="mortgageSituation"){
                this.reportForm.mortgageSituation=val?val.id:''
                this.reportForm.mortgageSituationName=val?val.name:''
            }else if(this.popListType==="landNature"){
                this.reportForm.landNature=val?val.id:''
                this.reportForm.landNatureName=val?val.name:''
            }else if(this.popListType==="transFlowName"){
                this.reportForm.transFlowCode=val?val.id:''
                this.reportForm.transFlowName=val?val.name:''
            }else if(this.popListType==="stagesBankName"){
                this.reportForm.stagesBankName=val?val.name:''
            }else if(this.popListType==="maritalStatus"){
                this.reportForm.maritalStatus=val?val.id:''
                this.reportForm.maritalStatusName=val?val.name:''
            }else if(this.popListType==="buyerCardType"){
                this.reportForm.buyerAgentCardType=val?val.id:''
            }else if(this.popListType==="sellerCardType"){
                this.reportForm.sellerAgentCardType=val?val.id:''
            }
        },
        //选择器组件取消
        closePop(){
            this.popState=false
        },
        //复选框切换
        changeRadio(type){
            if(type==="isEarlyRepayment"){
                this.repaymentError=false
            }else if(type==="buyerPaymentMethod"){
                this.paymethodError=false
                if(this.reportForm[type]===1){//全款
                    this.noInput=true
                    this.$set(this.reportForm,'stagesBankName','')
                    this.$set(this.reportForm,'loanAmount','')
                    this.$set(this.reportForm,'loanTerm','')
                }else{
                    this.noInput=false
                }
            }else{
                this.extendError=false
            }
        },
        //代理人收起展开
        showAgent(type){
            if(type==="buyer"){
                this.buyerState=!this.buyerState
            }else{
                this.sellerState=!this.sellerState
            }
        },
        //获取交易流程
        getFlowList() {
            this.$ajax.get('/api/contract/getTransFlowListByCity').then(res => {
                res = res.data
                if(res.status === 200) {
                    this.flowList = res.data
                }
            }).catch(error => {
                this.$message({
                    message: error,
                    type: "error"
                })
            })
        },
        //获取成交报告
        getDealReport(){
            let param = {
                id: this.id
            }
            this.$ajax.get("/api/contract/detail", param).then(res => {
                res=res.data
                if(res.status===200){
                    let data = res.data
                    this.laterStageState = data.laterStageState.value
                    this.dealBasicInfo.signDate = data.signDate.substr(0, 16)
                    this.dealBasicInfo.code = data.code
                    this.dealBasicInfo.contType = data.contType.label
                    this.contType=data.contType.value
                    this.dealBasicInfo.dealPrice = data.dealPrice
                    this.dealBasicInfo.receivableCommission = data.receivableCommission
                    this.dealBasicInfo.Square = data.houseInfo.Square
                    this.dealBasicInfo.CompleteYear = data.houseInfo.CompleteYear
                    this.dealBasicInfo.propertyRightAddr = data.propertyRightAddr?data.propertyRightAddr:'sad啊实打实大啊实打实大阿斯达是'
                    this.dealBasicInfo.FloorAll = data.houseInfo.FloorAll
                    if(data.dealReport){
                        this.reportForm=JSON.parse(data.dealReport)
                    }
                    
                    if(this.reportForm.cardSituation){
                        this.dictionary['611'].forEach(element => {
                            if(element.key===this.reportForm.cardSituation){
                                this.$set(this.reportForm,'cardSituationName',element.value)
                            }
                        });
                    }
                    if(this.reportForm.mortgageSituation){
                        this.dictionary['615'].forEach(element => {
                            if(element.key===this.reportForm.mortgageSituation){
                                this.$set(this.reportForm,'mortgageSituationName',element.value)
                            }
                        });
                    }
                    if(this.reportForm.landNature){
                        this.dictionary['618'].forEach(element => {
                            if(element.key===this.reportForm.landNature){
                                this.$set(this.reportForm,'landNatureName',element.value)
                            }
                        });
                    }
                    if(this.reportForm.maritalStatus){
                        this.dictionary['624'].forEach(element => {
                            if(element.key===this.reportForm.maritalStatus){
                                this.$set(this.reportForm,'maritalStatusName',element.value)
                            }
                        });
                    }
                    this.recordVersion = data.recordVersion
                    if(data.loanType) {
                        this.reportForm.buyerPaymentMethod = data.loanType == 7 ? 1: 2
                    }
                    this.loadType = data.loanType ? true : false
                    if(!data.dealReport) {
                        this.reportForm.guestShopOwnerName = this.recordVersion === 1 ? data.dealAgentShopowner : data.guestInfo.ShopOwnerName
                        this.reportForm.guestStoreName = this.recordVersion === 1 ? data.dealAgentStoreName : data.guestInfo.GuestStoreName
                        this.reportForm.guestShopOwnerMobile = this.recordVersion === 1 ? data.dealAgentShopownerMobile :data.guestInfo.ShopOwnerMobile
                        this.reportForm.houseShopOwnerName = data.houseInfo.ShopOwnerName
                        this.reportForm.houseStoreName = data.houseInfo.HouseStoreName
                        this.reportForm.houseShopOwnerMobile = data.houseInfo.ShopOwnerMobile   
                    }
                    this.guestList = data.contPersons.filter(item => item.personType.value === 2)
                    this.ownerList = data.contPersons.filter(item => item.personType.value === 1)
                }
            })
        },
        //输入格式化
        formatter(type){
            if(type==="landUseArea"){
                this.$nextTick(()=>{
                    this.reportForm.landUseArea=TOOL.cutFloat({val:this.reportForm.landUseArea,max:999999.99})
                })
            }
            if(type==="ownershipNumber"){
                this.$nextTick(()=>{
                    this.reportForm.ownershipNumber = this.reportForm.ownershipNumber.replace(/[^\-\/\(\)\（\）\s\d\a-zA-Z\u4E00-\u9FA5]/g, "")
                })
            }
            if(type==="payTaxation"){
                this.$nextTick(()=>{
                    this.reportForm.payTaxation=TOOL.cutFloat({val:this.reportForm.payTaxation,max:999999999.99})
                })
            }
            if(type==="buildingStructure"){
                this.$nextTick(()=>{
                    this.reportForm.buildingStructure = TOOL.textInput(this.reportForm.buildingStructure,3) 
                })
            }
            if(type==="evaluationValue"){
                this.$nextTick(()=>{
                    this.reportForm.evaluationValue=TOOL.cutFloat({val:this.reportForm.evaluationValue,max:999999999.99})
                })
            }
            if(type==="guestShopOwnerName"||type==="guestStoreName"||type==="houseShopOwnerName"||type==="houseStoreName"||type==="buyerAgentName"||type==="sellerAgentName"){
                this.$nextTick(()=>{
                    this.reportForm[type] = TOOL.textInput(this.reportForm[type]) 
                })
            }
            if(type==="guestShopOwnerMobile"||type==="houseShopOwnerMobile"||type==="buyerAgentMobile"||type==="sellerAgentMobile"){
                this.$nextTick(()=>{
                    this.reportForm[type] = TOOL.numberInput(this.reportForm[type])
                })
            }
            if(type==="buyerAgentCard"||type==="sellerAgentCard"){
                let a = type==="buyerAgentCard"?'buyerAgentCardType':'sellerAgentCardType'
                if(this.reportForm[type].length===18){
                    if (!this.isIdCardNo(this.reportForm[type])&&this.reportForm[a]===1) {
                        this.$toast({
                            message:'身份证格式不正确',
                            type: "warning"
                        })
                    }
                }
            }
        },
        //这个可以验证15位和18位的身份证，并且包含生日和校验位的验证。
        isIdCardNo(num) {
            num = num.toUpperCase();
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
            if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
                // alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
                return false;
            }
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            //下面分别分析出生日期和校验位
            var len, re;
            len = num.length;
            if (len == 15) {
                re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                let arrSplit = num.match(re);
                //检查生日日期是否正确
                let dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
                let bGoodDay;
                bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                    // alert('输入的身份证号里出生日期不对！');
                    return false;
                } else {
                    //将15位身份证转成18位
                    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var nTemp = 0, i;
                    num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                    for (i = 0; i < 17; i++) {
                        nTemp += num.substr(i, 1) * arrInt[i];
                    }
                    num += arrCh[nTemp % 11];
                    return true;
                }
            }
            if (len == 18) {
                re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                let arrSplit = num.match(re);
                //检查生日日期是否正确
                let dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                let bGoodDay;
                bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                    // alert(dtmBirth.getYear());
                    // alert(arrSplit[2]);
                    // alert('输入的身份证号里出生日期不对！');
                    return false;
                } else {
                    //检验18位身份证的校验码是否正确。
                    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                    // var valnum;
                    // var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    // var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    // var nTemp = 0, i;
                    // for (i = 0; i < 17; i++) {
                    //     nTemp += num.substr(i, 1) * arrInt[i];
                    // }
                    // valnum = arrCh[nTemp % 11];
                    // if (valnum != num.substr(17, 1)) {
                    //     // alert('18位身份证的校验码不正确！应该为：' + valnum);
                    //     return false;
                    // }
                    return true;
                }
            }
            return false;
        },
    }
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
/deep/.van-form{
    background-color: @bg-grey;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 70px;
    overflow-y: auto;
}
/deep/.van-cell__title{
    color: @text-grey-BBB;
}
/deep/.van-field__error-message{
    text-align: right;
}
/deep/.van-field__control{
    color: @text-grey-333;
    &::-webkit-input-placeholder {
      color: @text-grey-BBB;
    }
}
/deep/.van-field__control:disabled{
    color: @text-grey-666;
}
/deep/.van-cell:not(:last-child)::after{
    left: 16px;
    right: 16px;
}
.longLabel{
    /deep/.van-field__label{
        width: 205px !important;
    }
}
.dealReport{
    background-color: @bg-grey;
    position: relative;
    overflow-y: scroll;
    height: calc(100% - 60px);
}
.msgModule{
    background-color: @bg-white;
    margin-top: 10px;
    .title{
        color: @text-grey-333;
        font-size: 16px;
        font-weight: bold;
        line-height: 45px;
        padding: 0 15px;
        border-bottom: 1px solid @border-grey;
    }
    .remarkStyle{
        position: relative;
        span{
            color:  @text-grey-BBB;
            font-size: 12px;
        }
        .foldRemark{
            position: absolute;
            top: 20px;
            right: 20px;
        }
    }
    // .rightAddr{
    //     /deep/.van-cell{

    //     }
    // }
    /deep/.van-field__label{
        width: 110px;
    }
    /deep/.van-cell{
        padding: 10px 26px;
    }
}
.submitBtn{
    background-color: @bg-white;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    line-height: 60px;
    text-align: center;
    .van-button--normal{
        width:345px;
        color: @bg-white;
        border-radius: 4px;
        background-color: @text-green;
    }
}
.radioStyle{
    font-size: 14px;
    margin: 10px 20px 0 20px;
    border-bottom: 1px solid #ebedf0;
    .label{
        padding-left: 5px;
        color: @text-grey-BBB;
    }
    .list{
        /deep/.van-radio-group--horizontal{
            padding: 15px 10px;
            .van-radio--horizontal{
                width: 130px;
            }
            .van-radio__icon{
                font-size: 16px;
            }
        }
    }
    .inputStyle{
        padding: 10px 8px;
        input{
            border: none;
        }
    }
    .errorMsg{
        display: none;
        padding:  0 5px 12px 0;
        padding-bottom: 12px;
        font-size: 12px;
        color: #ee0a24;
        text-align: right;
    }
    .showError{
        display:block
    }
}
</style>