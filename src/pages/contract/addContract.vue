<template>
    <div class="addContract">
        <van-form @submit="onSubmit" autocomplete="off" :scroll-to-error='true'>
            <!-- 合同信息 -->
            <div class="msgModule">
                <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>合同信息</div>
                <van-field
                input-align="right"
                :value="contractForm.type===1?'租赁':contractForm.type===2?'买卖':contractForm.type===3?'代办':contractForm.type===4?'意向':contractForm.type===5?'定金':''"
                name="contType"
                label="合同类型"
                placeholder="合同类型"
                disabled
                />

                <van-field
                input-align="right"
                v-model="contractForm.signDate"
                name="signDate"
                label="签约时间"
                placeholder="签约时间"
                disabled
                />

                <van-field
                v-if="contractForm.type<4"
                input-align="right"
                v-model="contractForm.custCommission"
                type="number"
                name="custCommission"
                label="客户佣金（元）"
                placeholder="请输入"
                @input="formatter('custCommission')"
                @change="countTotal"
                :rules="[{ validator, message: '请输入客户佣金' }]"
                />

                <van-field
                v-if="contractForm.type<4"
                input-align="right"
                v-model="contractForm.ownerCommission"
                type="number"
                naem="ownerCommission"
                label="业主佣金（元）"
                placeholder="请输入"
                @input="formatter('ownerCommission')"
                @change="countTotal"
                :rules="[{ validator, message: '请输入业主佣金' }]"
                />

                <van-field
                v-if="contractForm.type<4"
                input-align="right"
                v-model="commissionTotal"
                type="number"
                name="总佣金"
                label="总佣金（元）"
                disabled
                />

                <!-- 意向定金独有字段 -->
                <van-field
                v-if="contractForm.type>3"
                readonly
                clickable
                input-align="right"
                name="subscriptionTerm"
                v-model="contractForm.subscriptionTerm"
                label="认购期限"
                placeholder="请选择"
                @click="showPickerTime"
                :rules="[{ required: true, message: '请选择认购期限' }]"
                />

                <van-field
                v-if="contractForm.type>3"
                input-align="right"
                v-model="contractForm.subscriptionPrice"
                type="number"
                name="subscriptionPrice"
                label="认购总价（元）"
                placeholder="请输入"
                @input="formatter('subscriptionPrice')"
                :rules="[{ required: true, message: '请输入认购总价' }]"
                />

                <van-field
                v-if="contractForm.type>3"
                class="longLabel"
                input-align="right"
                v-model="contractForm.dealPrice"
                type="number"
                name="dealPrice"
                :label="contractForm.type===4?'意向金金额（元）':'定金金额（元）'"
                placeholder="请输入"
                @input="formatter('dealPrice')"
                :rules="[{ required: true, message: `请输入${contractForm.type===4?'意向':'定金'}金金额` }]"
                />
            </div>
            <!-- 房源信息 -->
            <div class="msgModule">
                <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>房源信息</div>
                <van-field
                input-align="right"
                v-model="contractForm.houseinfoCode"
                name="houseinfoCode"
                label="房源编号"
                placeholder="请选择"
                disabled
                />

                <van-field
                 v-if="contractForm.type===2||contractForm.type===3"
                input-align="right"
                v-model="contractForm.dealPrice"
                type="number"
                name="dealPrice"
                label="成交总价（元）"
                placeholder="请输入"
                @input="formatter('dealPrice')"
                :rules="[{ required: true, message: '请输入成交总价' }]"
                />

                <div class="rental" id="rental" v-if="contractForm.type===1">
                    <div class="label">租金</div>
                    <div class="inputArea">
                        <input
                        v-model="contractForm.dealPrice"
                        type="text"
                        placeholder="请输入"
                        @input="formatter('dealPrice')"
                        >
                        <span class="placeText" v-if="!contractForm.timeUnit||contractForm.timeUnit===-99" @click="showPopList('timeUnit',1)">请选择</span>
                        <span class="timeUnit" v-else @click="showPopList('timeUnit',1)">{{contractForm.timeUnit===1?'元 / 月':contractForm.timeUnit===2?'元 / 季度':contractForm.timeUnit===3?'元 / 半年':contractForm.timeUnit===4?'元 / 年':''}}</span>
                        <van-icon class="downIcon" name="arrow-down" />
                    </div>
                    <div class="errorMsg" :class="{'showError':dealPriceError}">请输入租金</div>
                </div>

                <van-field
                input-align="right"
                :value="contractForm.houseInfo.EstateName.replace(/\s/g,'')+' '+contractForm.houseInfo.BuildingName.replace(/\s/g,'')+contractForm.houseInfo.Unit.replace(/\s/g,'')+contractForm.houseInfo.RoomNo.replace(/\s/g,'')"
                type="number"
                name="物业地址"
                label="物业地址"
                placeholder="请输入"
                disabled
                />

                <van-field
                v-if="contractForm.type<4"
                input-align="right"
                v-model="contractForm.houseInfo.CompleteYear"
                name="CompleteYear"
                label="建成年代"
                placeholder="请输入"
                disabled 
                />

                <div class="rightAddr" id="rightAddr">
                    <div class="label">产权地址</div>
                    <div class="inputArea van-hairline--bottom">
                        <input
                        v-model="contractForm.rightAddrCity"
                        type="text"
                        maxlength="10"
                        placeholder="请输入"
                        @blur="checkMsg"
                        @input="formatter('city')"
                        >市
                        <div class="border-left"></div>
                        <input
                        v-model="contractForm.rightAddrArea"
                        type="text"
                        maxlength="10"
                        placeholder="请输入"
                        @blur="checkMsg"
                        @input="formatter('area')"
                        >区
                    </div>
                    <div class="errorMsg" :class="{'showError':showError}">请输入产权地址</div>
                </div>

                <van-field
                input-align="left"
                v-model="contractForm.rightAddrDetail"
                type="text"
                maxlength="100"
                name="rightAddrDetail"
                placeholder="请输入详细地址"
                @input="formatter('rightAddrDetail')"
                :rules="[{ required: true, message: '请输入详细地址' }]"
                />

                <van-field
                v-if="contractForm.type<4"
                input-align="right"
                v-model="contractForm.houseInfo.Square"
                type="number"
                name="Square"
                label="建筑面积（m²）"
                placeholder="请输入"
                @input="formatter('Square')"
                />

                <van-field
                v-if="contractForm.type<4"
                input-align="right"
                v-model="contractForm.houseInfo.SquareUse"
                type="number"
                name="SquareUse"
                label="套内面积（m²）"
                placeholder="请输入"
                @input="formatter('SquareUse')"
                />

                <div class="rental rental_b" id="rental" v-if="contractForm.type>3">
                    <div class="label">房源总价</div>
                    <div class="inputArea">
                        <input
                        class="listingPrice"
                        v-model="contractForm.houseInfo.ListingPrice"
                        type="text"
                        placeholder="请输入"
                        @input="formatter('ListingPrice')"
                        >
                         <!-- v-if="String(contractForm.houseInfo.ListingPrice).length>0||contractForm.houseInfo.TradeInt" -->
                        <span class="placeText" v-if="!contractForm.houseInfo.TimeUnit" @click="showPopList('ListingPrice',1)">请选择</span>
                        <span class="timeUnit" v-else @click="showPopList('ListingPrice',1)">{{contractForm.houseInfo.TimeUnit===1?'元':contractForm.houseInfo.TimeUnit===2?'元 / 月':''}}</span>
                        <van-icon class="downIcon" name="arrow-down" />
                    </div>
                    <!-- <div class="errorMsg" :class="{'showError':dealPriceError}">请输入租金</div> -->
                </div>
            </div>
            <!-- 业主信息 -->
             <div class="personModule">
                <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>业主信息<van-icon v-if="contractForm.type<4" class="personAdd" name="add-o" @click.stop="addPerson('owner')" /></div>
                <div class="personList" v-for="(item,index) in ownerList" :key="index">
                    <div class="personTitle">业主{{index+1}}<span class="personDel" v-if="ownerList.length>1" @click.stop="deletePerson(index,'owner')">删除</span></div>
                    <div class="personMsg">
                        <van-field
                        input-align="right"
                        v-model="item.name"
                        maxlength="10"
                        :name="'ownerName'+index"
                        label="户名"
                        placeholder="请输入"
                        @input="formatPersonMsg(index,'owner','name')"
                        :rules="[{ validator: asyncValidator, message: '请输入户名' }]"
                        />

                        <van-field
                        input-align="right"
                        v-model="item.mobile"
                        :name="'ownerMobile'+index"
                        label="电话"
                        placeholder="请输入"
                        @input="formatPersonMsg(index,'owner','mobile')"
                        @keydown="saveMobile(item,index,'owner')"
                        :rules="[{ validator: asyncValidator, message: '请输入电话' }]"
                        />

                        <van-field
                        v-if="contractForm.type<4"
                        class="choseIcon"
                        right-icon="arrow-down"
                        input-align="right"
                        v-model="item.relation"
                        :name="'ownerRelation'+index"
                        label="关系"
                        placeholder="请选择"
                        disabled
                        @click="showPopList('ownerRelation',index)"
                        :rules="[{ required: true, message: '请选择关系' }]"
                        />
                        
                        <van-field
                        v-if="contractForm.type===2||contractForm.type===3"
                        input-align="right"
                        v-model="item.propertyRightRatio"
                        :name="'ownerPropertyRightRatio'+index"
                        label="产权比"
                        placeholder="请输入"
                        @input="formatPersonMsg(index,'owner','propertyRightRatio')"
                        :rules="[{ validator, message: '请输入产权比' }]"
                        >
                        <template #extra >
                            %
                        </template>
                        </van-field>

                        <van-field
                        input-align="right"
                        right-icon="arrow-down"
                        :value="item.cardType===1?'身份证':item.cardType===2?'护照':item.cardType===3?'营业执照':item.cardType===4?'军官证':''"
                        :name="'ownerCardType'+index"
                        label="证件类型"
                        placeholder="请选择"
                        disabled
                        @click="showPopList('ownerCardType',index)"
                        :rules="[{ validator: asyncValidator, message: '请选择证件' }]"
                        />

                        <van-field
                        input-align="right"
                        v-model="item.encryptionCode"
                        :name="'ownerEncryptionCode'+index"
                        label="证件号码"
                        placeholder="请输入"
                        :maxlength="item.cardType===1?18:item.cardType===2?30:item.cardType===3?20:10"
                        @input="formatPersonMsg(index,'owner','cardId')"
                        :rules="[{ validator: asyncValidator, message: '请输入证件号' }]"
                        />

                        <van-field 
                        v-if="item.cardType===3"
                        input-align="right"
                        v-model="item.companyName"
                        :name="'companyName'+index"
                        label="企业名称"
                        placeholder="请输入"
                        maxlength="100"
                        @input="formatPersonMsg(index,'owner','companyName')"
                        :rules="[{ validator: asyncValidator, message: '请输入企业名称' }]"
                        />

                        <van-field 
                        v-if="item.cardType===3"
                        input-align="right"
                        v-model="item.lepName"
                        :name="'legalPersonName'+index"
                        label="法人名称"
                        placeholder="请输入"
                        maxlength="10"
                        @input="formatPersonMsg(index,'owner','lepName')"
                        :rules="[{ validator: asyncValidator, message: '请输入法人名称' }]"
                        />

                        <van-field 
                        v-if="item.cardType===3"
                        input-align="right"
                        v-model="item.lepIdentity"
                        :name="'legalPersonId'+index"
                        label="法人身份证号"
                        placeholder="请输入"
                        maxlength="18"
                        @input="formatPersonMsg(index,'owner','lepIdentity')"
                        :rules="[{ validator: verifyIdcard, message: '请输入法人身份证号' }]"
                        />

                        <van-field
                        input-align="right"
                        v-model="item.email"
                        name="email"
                        label="邮箱"
                        @input="formatPersonMsg(index,'owner','email')"
                        placeholder="选填（如：666666@qq.com)"
                        />
                    </div>
                </div>
            </div>
            <!-- 客源信息 -->
            <div class="msgModule">
                <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>客源信息</div>
                <van-field
                input-align="right"
                right-icon="arrow"
                v-model="contractForm.guestinfoCode"
                name="guestinfoCode"
                label="客源编号"
                placeholder="请选择"
                disabled 
                @click="chooseGuest"
                :rules="[{ required: true, message: '请选择客源' }]"
                />

                <div v-if="contractForm.type>3" class="rightAddr rental_p" id="rightAddr">
                    <div class="label">成交经纪人</div>
                    <div class="inputArea">
                        <span class="van-ellipsis">{{contractForm.guestInfo?contractForm.guestInfo.GuestStoreName:''}}</span>
                        <span>{{contractForm.guestInfo?contractForm.guestInfo.EmpName:''}}</span>
                    </div>
                    <div class="errorMsg" :class="{'showError':showError}">请输入产权地址</div>
                </div>
            </div>
            <!-- 客户信息 -->
             <div class="personModule" ref="moreWishWrap">
                <div class="title van-hairline--bottom"><i class="iconfont iconjiaobiao"></i>客户信息<van-icon v-if="contractForm.type<4" class="personAdd" name="add-o" @click.stop="addPerson('guest')" /></div>
                <div class="personList" v-for="(item,index) in guestList" :key="index">
                    <div class="personTitle">客户{{index+1}}<span class="personDel" v-if="guestList.length>1" @click.stop="deletePerson(index,'guest')">删除</span></div>
                    <div class="personMsg">
                        <van-field
                        input-align="right"
                        v-model="item.name"
                        maxlength="10"
                        :name="'guestName'+index"
                        label="户名"
                        placeholder="请输入"
                        @input="formatPersonMsg(index,'guest','name')"
                        :rules="[{ required: true, message: '请输入户名' }]"
                        />

                        <van-field
                        input-align="right"
                        v-model="item.mobile"
                        :name="'guestMobile'+index"
                        label="电话"
                        placeholder="请输入"
                        @input="formatPersonMsg(index,'guest','mobile')"
                        @keydown="saveMobile(item,index,'guest')"
                        :rules="[{ required: true, message: '请输入电话' }]"
                        />

                        <van-field
                        v-if="contractForm.type<4"
                        input-align="right"
                        right-icon="arrow-down"
                        v-model="item.relation"
                        :name="'guestRelation'+index"
                        label="关系"
                        placeholder="请选择"
                        disabled
                        @click="showPopList('guestRelation',index)"
                        :rules="[{ required: true, message: '请选择关系' }]"
                        />
                        
                        <van-field
                        v-if="contractForm.type===2||contractForm.type===3"
                        input-align="right"
                        v-model="item.propertyRightRatio"
                        :name="'guestPropertyRightRatio'+index"
                        label="产权比"
                        placeholder="请输入"
                        @input="formatPersonMsg(index,'guest','propertyRightRatio')"
                        :rules="[{ validator, message: '请输入产权比' }]"
                        >
                        <template #extra >
                            %
                        </template>
                        </van-field>
                        

                        <van-field
                        input-align="right"
                        right-icon="arrow-down"
                        :value="item.cardType===1?'身份证':item.cardType===2?'护照':item.cardType===3?'营业执照':item.cardType===4?'军官证':''"
                        :name="'guestCardType'+index"
                        label="证件类型"
                        placeholder="请选择"
                        disabled
                        @click="showPopList('guestCardType',index)"
                        :rules="[{ required: true, message: '请选择证件' }]"
                        />

                        <van-field
                        input-align="right"
                        v-model="item.encryptionCode"
                        :name="'guestEncryptionCode'+index"
                        label="证件号码"
                        placeholder="请输入"
                        :maxlength="item.cardType===1?18:item.cardType===2?30:item.cardType===3?20:10"
                        @input="formatPersonMsg(index,'guest','cardId')"
                        :rules="[{ required: true, message: '请输入证件号' }]"
                        />

                        <van-field 
                        v-if="item.cardType===3"
                        input-align="right"
                        v-model="item.companyName"
                        :name="'companyName'+index"
                        label="企业名称"
                        placeholder="请输入"
                        maxlength="100"
                        @input="formatPersonMsg(index,'guest','companyName')"
                        :rules="[{ required: true, message: '请输入企业名称' }]"
                        />

                        <van-field 
                        v-if="item.cardType===3"
                        input-align="right"
                        v-model="item.lepName"
                        :name="'legalPersonName'+index"
                        label="法人名称"
                        placeholder="请输入"
                        maxlength="10"
                        @input="formatPersonMsg(index,'guest','lepName')"
                        :rules="[{ required: true, message: '请输入法人名称' }]"
                        />

                        <van-field 
                        v-if="item.cardType===3"
                        input-align="right"
                        v-model="item.lepIdentity"
                        :name="'legalPersonId'+index"
                        label="法人身份证号"
                        placeholder="请输入"
                        maxlength="18"
                        @input="formatPersonMsg(index,'guest','lepIdentity')"
                        :rules="[{ validator:verifyIdcard, message: '请输入法人身份证号' }]"
                        />

                        <van-field
                        input-align="right"
                        v-model="item.email"
                        name="email"
                        label="邮箱"
                        placeholder="选填（如：666666@qq.com)"
                        @input="formatPersonMsg(index,'guest','email')"
                        />
                    </div>
                </div>
            </div>
            <!-- 备注栏 -->
            <div class="msgModule">
                <div class="title remarkStyle van-hairline--bottom" @click.stop="showRemark"><i class="iconfont iconjiaobiao"></i>备注栏<span>（选填）</span><van-icon class="foldRemark" :name="remarkState?'arrow-down':'arrow-up'" /></div>
                <van-field
                v-if="remarkState"
                v-model="contractForm.remarks"
                rows="4"
                :autosize="{maxHeight:80, minHeight: 50}"
                type="textarea"
                maxlength="200"
                placeholder="请输入备注"
                show-word-limit
                @input="formatter('remarks')"
                />
            </div>
            <div class="submitBtn">
                <van-button native-type="submit">
                    下一步
                </van-button>
            </div>
        </van-form>
        <!-- 时间选择器 -->
        <van-popup v-model="showPicker" position="bottom">
            <van-datetime-picker
            v-model="subscriptionTerm"
            type="date"
            @confirm="onConfirm"
            @cancel="showPicker = false"
            />
        </van-popup>
        <!-- 选择器弹窗 -->
        <popList :list="selectList" :state="popState" :activeId='popSelectId' @chose="confirmChose" @close="closePop" v-if="popState"></popList>
        <!-- 人员删除弹窗 -->
        <van-dialog v-model="delPersonDialog" title="确认删除？ " show-cancel-button @confirm="confirmDel">
            <div class="callDialog">当前联系人将会被删除</div>
        </van-dialog>
        <!-- loading弹层 -->
        <van-overlay :show="showLoading">
            <div class="wrapper" @click.stop>
                <van-loading size="24px" />
            </div>
        </van-overlay>
        <!-- 单公司提示 -->
        <van-dialog v-model="singleCompany" title="提示 " @confirm="toH5">
            <div class="singleDialog">
                <span>{{singleCompanyName}}未设置公章，请联系管理员设置！</span>
            </div>
        </van-dialog>
    </div>
</template>
           
<script>
import {mapMutations, mapGetters} from 'vuex'
import popList from '@/components/popList'
import {Form, Field, DatetimePicker, Popup, Picker, Area, Dialog, Overlay, Loading} from 'vant'; 
import { TOOL } from "@/assets/js/common";
import { area } from "@/assets/js/area";
export default{
    components: {
        [Form.name]:Form,
        [Field .name]:Field,
        [DatetimePicker.name]:DatetimePicker,
        [Popup.name]:Popup,
        [Picker.name]:Picker,
        [Area.name]:Area,
        [Dialog.Component.name]: Dialog.Component,
        [Loading.name]:Loading,
        [Overlay.name]:Overlay,
        popList,
    },
    data(){
        return{
            showPicker:false,//时间选择器
            operationType:'add',//操作类型 默认新增
            contractForm:{
                timeUnit:'',
                contType:'',
                signDate:'',
                subscriptionTerm:'',
                custCommission:'',
                ownerCommission:'',
                propertyRightAddr:'',
                houseinfoCode:'',
                dealPrice:'',
                rightAddrCity:'',
                rightAddrArea:'',
                rightAddrDetail:'',
                houseInfo:{
                    CompleteYear:'',
                    Square:'',
                    SquareUse:'',
                    EstateName:'',
                    BuildingName:'',
                    Unit:'',
                    RoomNo:'',
                },
                remarks:'',
            },
            showError:false,//产权地址未填提示
            dealPriceError:false,//租金未填写提示
            commissionTotal:0,//总佣金  客户佣金+业主佣金
            showArea: false,
            showRelation: false,
            areaList: area,
            ownerList:[
                {
                    type: 1,
                    encryptionCode: "",
                    mobile: "",
                    relation: "",
                    cardType: "",
                    name: "",
                    propertyRightRatio: "",
                    lepName:"",
                    companyName:"",
                    lepIdentity:"",

                }
            ],
            ownerList_:[],
            guestList:[
                {
                    type: 2,
                    encryptionCode: "",
                    mobile: "",
                    relation: "",
                    cardType: "",
                    name: "",
                    propertyRightRatio: "",
                    lepName:"",
                    companyName:"",
                    lepIdentity:"",
                }
            ],
            guestList_:[],
            beforeChangeMobile: "",//改变之前的手机号

            popListType:'',//选择器组件类型
            popListIndex:'',//选择器组件index
            selectList:[],//选择器组件下拉数组
            popState:false,//选择器组件状态
            popSelectId:-98,//选中id

            relationList:[],//人员关系
            delType:'',//删除人员信息类型
            delIndex:'',//删除人员索引
            delPersonDialog:false,//删除人员确认弹窗
            remarkState:true,//备注栏展开收起

            fromPath:'',
            guestId:'',
            dictionary: {//数据字典
                "507": "", //时间单位
                "633":"",//证件类型(护照,身份证,营业执照)
            },

            showLoading:false,//loading

            subscriptionTerm:'',
            singleCompany: false,
            singleCompanyName: '',
        }
    },
    beforeRouteEnter(to, from, next) {
        let path = from.path
        next(vm=>{
            if(path==="/chooseGuest"){//从选择客源页面返回
                let guestId = vm.getGuestId
                vm.contractForm=Object.assign({},vm.getContractForm)
                vm.ownerList=[].concat(vm.getOwnerList)
                vm.ownerList_=[].concat(vm.getOwnerList_)
                vm.guestList=[].concat(vm.getGuestList)
                vm.guestList_=[].concat(vm.getGuestList_)
                vm.operationType=vm.getOperationType
                if(guestId){
                    vm.guestId=guestId
                    vm.getGuestDetail(guestId)
                }else{
                    vm.guestId=vm.contractForm.guestInfo.InquiryCode
                }
                vm.countTotal()
                
                setTimeout(()=>{
                    vm.$nextTick(() => {
                        vm.$refs.moreWishWrap.scrollIntoView(false);
                    },2000)
                });
              
            }else{
                if(path==="/contractDetail"||path==="/contractH5"){//编辑
                    if(vm.$route.query.operationType||path==="/contractH5"){
                        vm.operationType=vm.$route.query.operationType?vm.$route.query.operationType:'edit'
                        vm.getContractDetail(vm.$route.query.id)
                    }
                }else{//新增
                    let houseId = Number(to.query.houseId)
                    vm.contractForm.type=Number(to.query.contType)
                    vm.contractForm.signDate=TOOL.timeFormat(new Date(),false)
                    if(Number(to.query.contType)>3){
                        vm.contractForm.subscriptionTerm=TOOL.dateFormat(new Date())
                    }
                    vm.getHousedetail(houseId)
                }
            }
        })
    },
    created () {
        this.getRelation()//人员关系
        this.getDictionary();//字典
        // if(this.$route.query.operationType){
        //     this.operationType=this.$route.query.operationType
        //     this.getContractDetail(this.$route.query.id)
        // }

    },
    methods:{
        //获取所在城市的人员关系
        getRelation() {
            let param = {
                type: "Relation"
            };
            this.$ajax.get("/api/dictionary/uplus", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    // this.relationList = res.data;
                    res.data.forEach(element => {
                        let ele={}
                        ele.id=element.key
                        ele.name=element.value
                        this.relationList.push(ele)
                    });
                }
            });
        },
        /**
         * 收取字典id，拼接字符串
         * @param obj
         * @returns {string}
         */
        getDictionaryIds(obj) {
            let arr = []
            for (let item in obj) {
                arr.push(item)
            }
            return arr.join(',')

        },
        /**
         * 获取筛选数据
         * dictionary必须在各自页面定义 例：dictionary:{'1':'','2':''}
         */
        getDictionary() {
            let param = {
                parentIds: this.getDictionaryIds(this.dictionary)
            }
            this.$ajax.get('/api/dictionary/batchQuery', param).then(res => {
                res = res.data
                if (res.status === 200) {
                    this.dictionary = Object.assign({}, res.data)
                }
            })
        },
        showPickerTime(){
            this.subscriptionTerm=this.contractForm.subscriptionTerm?new Date(this.contractForm.subscriptionTerm):new Date()
            this.showPicker=true
        },
        //计算佣金和
        countTotal(){
            let owner = Number(this.contractForm.ownerCommission?this.contractForm.ownerCommission:0)
            let cust = Number(this.contractForm.custCommission?this.contractForm.custCommission:0)
            if(cust||owner){
                let total = cust + owner
                this.commissionTotal = this.fomatFloat(total,2)
            }
        },
        //运算时四舍五入保留两位小数 num为传入的值，n为保留的小数位
        fomatFloat(num, n) {
            var f = parseFloat(num);
            if (isNaN(f)) {
                return false;
            }
            f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
            var s = f.toString();
            var rs = s.indexOf(".");
            //判定如果是整数，增加小数点再补0
            if (rs < 0) {
                rs = s.length;
                s += ".";
            }
            while (s.length <= rs + n) {
                s += "0";
            }
            return s;
        },
        //下一步
        onSubmit(){
            if(this.contractForm.type<4){//租赁买卖代办验证
                if (this.contractForm.custCommission > 0 || this.contractForm.ownerCommission > 0 ) {//客户佣金和业主佣金不能同时为空
                    if(!this.contractForm.rightAddrCity||!this.contractForm.rightAddrArea){//产权地址
                        this.showError=true
                        document.querySelector("#rightAddr").scrollIntoView()
                        return
                    }else{
                        this.showError=false
                    }
                    if(!this.contractForm.dealPrice){//租金
                        this.dealPriceError=true
                        document.querySelector("#rental").scrollIntoView()
                        return
                    }else{
                        this.dealPriceError=false
                    }
                    let ownerRightRatio = 0;
                    let isOk;
                    let ownerArr = this.ownerList.map(item =>
                        Object.assign({}, item)
                    );
                    ownerArr.forEach((element, index) => {
                        if (element.isEncryption) {
                            element.encryptionMobile = this.ownerList_[index].encryptionMobile;
                        } else {
                            element.encryptionMobile =element.mobile;
                        }
                    });
                    for (var i = 0; i < ownerArr.length; i++) {
                        let element = ownerArr[i];
                        isOk = false;
                        //2020.01.09 更改需求 温州客户业主姓名可以存在 ‘先生’ ‘女士’ 字符(待定)
                        if (element.name.indexOf("先生") === -1 && element.name.indexOf("女士") === -1) {
                            let reg = /^1[0-9]{10}$/; //手机号正则
                            let reg_ = /^0\d{2,3}\-?\d{7,8}$/; //固话正则
                            if (reg.test(element.encryptionMobile) || reg_.test(element.encryptionMobile)) {
                                if ((this.contractForm.type === 1 && element.cardType) || this.contractForm.type !== 1 ) {
                                    if (this.type===2) {
                                        if (!element.propertyRightRatio) {
                                            element.propertyRightRatio = "0";
                                        }
                                    }
                                    if ((element.propertyRightRatio&&element.propertyRightRatio>0)||element.propertyRightRatio=="0"||this.contractForm.type===1) {
                                        if (element.encryptionCode.replace(/\s/g,"")) {
                                            if (element.cardType!==1) {
                                                element.encryptionCode = element.encryptionCode.replace(/[&\|\\\*^%$#@\-]/g,"");
                                            }
                                            if ((element.cardType ===1 && this.isIdCardNo(element.encryptionCode)) || (element.cardType === 2 && element.encryptionCode.length <=30) || (element.cardType === 3 && element.encryptionCode.length <=20&&this.isIdCardNo(element.lepIdentity)) || (element.cardType === 4 && element.encryptionCode.length <= 10)) {
                                                if(element.email){
                                                    let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                                                    if(reg.test(element.email)){
                                                        isOk = true;
                                                        ownerRightRatio += element.propertyRightRatio - 0;
                                                    }else{
                                                        this.$toast("房源信息-业主邮箱不正确");
                                                        break;
                                                    }
                                                }else{
                                                    isOk = true;
                                                    ownerRightRatio += element.propertyRightRatio - 0;
                                                }
                                            } else {
                                                this.$toast(`房源信息-业主${element.cardType===3?'法人身份证号':'证件号码'}不正确`);
                                                break;
                                            }
                                        } else {
                                            this.$toast("房源信息-业主证件号不能为空");
                                            break;
                                        }
                                    } else {
                                        this.$toast("房源信息-业主产权比不能为空或负");
                                        break;
                                    }
                                } else {
                                    this.$toast("房源信息-业主证件类型不能为空");
                                    break;
                                }
                            } else {
                                this.$toast("房源信息-业主电话号码不正确");
                                break;
                            }
                        } else {
                            this.$toast("房源信息-业主姓名不正确");
                            break;
                        }
                    }

                    if (isOk) {
                        if (ownerRightRatio === 100 || this.contractForm.type === 1) {
                            if (this.contractForm.guestInfo.GuestStoreCode) {
                                //客户产权比
                                let guestRightRatio = 0;
                                let isOk_;
                                // this.guestList.forEach(element => {
                                let guestArr = this.guestList.map( item => Object.assign({}, item));
                                guestArr.forEach((element, index) => {
                                    if (element.isEncryption) {
                                        element.encryptionMobile = this.guestList_[index].encryptionMobile;
                                    } else {
                                        element.encryptionMobile = element.mobile;
                                    }
                                });
                                for (var j = 0;j < guestArr.length;j++) {
                                    let element = guestArr[j];
                                    isOk_ = false;
                                    if (element.name) {
                                        if (element.name.replace(/\s/g,"")) {
                                            element.name = element.name.replace(/\s/g,"");
                                            if (element.name.indexOf("先生") === -1 && element.name.indexOf("女士") === -1) {
                                                let reg = /^1[0-9]{10}$/; //手机号正则
                                                let reg_ = /^0\d{2,3}\-?\d{7,8}$/; //固话正则
                                                if (reg.test(element.encryptionMobile) || reg_.test(element.encryptionMobile)) {
                                                    if ((this.contractForm.type === 1 && element.cardType) || this.contractForm.type !== 1) {
                                                        if (this.type === 2 ) {
                                                            if (!element.propertyRightRatio) {
                                                                element.propertyRightRatio ="0";
                                                            }
                                                        }
                                                        if ((element.propertyRightRatio && element.propertyRightRatio>0) || element.propertyRightRatio === "0" || this.contractForm.type === 1) {
                                                            if (element.encryptionCode.replace(/\s/g,"")) {
                                                                if (this.contractForm.type === 1) {
                                                                    if (element.cardType !== 1) {
                                                                        element.encryptionCode = element.encryptionCode.replace(/[&\|\\\*^%$#@\-]/g,"");
                                                                    }
                                                                }
                                                                if ((element.cardType === 1 && this.isIdCardNo(element.encryptionCode)) || (element.cardType === 2 && element.encryptionCode.length <=30) ||  (element.cardType === 3 && element.encryptionCode.length <=20&&this.isIdCardNo(element.lepIdentity)) || (element.cardType === 4 && element.encryptionCode.length <=10)) {
                                                                    if(element.email){
                                                                        let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                                                                        if(reg.test(element.email)){
                                                                            isOk_ = true;
                                                                            guestRightRatio += element.propertyRightRatio - 0;
                                                                        }else{
                                                                            this.$toast("客源信息-业主邮箱不正确");
                                                                            break;
                                                                        }
                                                                    }else{
                                                                        isOk_ = true;
                                                                        guestRightRatio += element.propertyRightRatio - 0;
                                                                    }
                                                                } else {
                                                                    this.$toast(`客源信息-客户${element.cardType===3?'法人身份证号':'证件号'}不正确`);
                                                                    break;
                                                                }
                                                            } else {
                                                                this.$toast("客源信息-客户证件号不能为空");
                                                                break;
                                                            }
                                                        } else {
                                                            this.$toast("客源信息-客户产权比不能为空或负");
                                                            break;
                                                        }
                                                    } else {
                                                        this.$toast("客源信息-客户证件类型不能为空");
                                                        break;
                                                    }
                                                } else {
                                                    this.$toast("客源信息-客户电话号码不正确");
                                                    break;
                                                }
                                            } else {
                                                this.$toast("客源信息-客户姓名不正确");
                                                break;
                                            }
                                        } else {
                                            this.$toast("客源信息-客户姓名不能为空");
                                            break;
                                        }
                                    } else {
                                        this.$toast("客源信息-客户姓名不能为空");
                                        break;
                                    }
                                }
                                if (isOk_) {
                                    if (guestRightRatio === 100 || this.contractForm.type === 1) {
                                        // 验证手机号是否重复  2019.10.17 张丽茹更改需求 业主之间电话号码可以重复 客户之间电话号码可以重复 但业主和客户电话号码不能重复
                                        let ownerMobileList = [];
                                        let guestMobileList = [];
                                        //验证身份证是否重复
                                        let IdCardList = [];
                                        //验证护照是否重复
                                        let passportList = [];
                                        //验证营业执照是否重复
                                        let businessList = [];
                                        //验证军官证是否重复
                                        let militaryIDList = [];

                                        ownerArr.forEach(
                                            element => {
                                                if (element.cardType === 1) {
                                                    IdCardList.push(element.encryptionCode);
                                                }
                                                if (element.cardType === 2) {
                                                    passportList.push(element.encryptionCode);
                                                }
                                                if (element.cardType === 3) {
                                                    businessList.push(element.encryptionCode);
                                                }
                                                if (element.cardType === 4) {
                                                    militaryIDList.push(element.encryptionCode);
                                                }
                                                let obj = JSON.parse(JSON.stringify(element));
                                                obj.encryptionMobile = obj.encryptionMobile.replace("-","");
                                                ownerMobileList.push(obj.encryptionMobile);
                                            }
                                        );

                                        guestArr.forEach(
                                            element => {
                                                if (element.cardType === 1) {
                                                    IdCardList.push(element.encryptionCode);
                                                }
                                                if (element.cardType === 2) {
                                                    passportList.push(element.encryptionCode);
                                                }
                                                if (element.cardType === 3) {
                                                    businessList.push(element.encryptionCode);
                                                }
                                                if (element.cardType === 4) {
                                                    militaryIDList.push(element.encryptionCode);
                                                }
                                                let obj = JSON.parse(JSON.stringify(element));
                                                obj.encryptionMobile = obj.encryptionMobile.replace("-","");
                                                guestMobileList.push(obj.encryptionMobile);
                                            }
                                        );
                                        let ownerGuestMobile = true;
                                        let otherMobile = true;
                                        if (this.contractForm.isHaveCooperation === 1 && this.contractForm.mobile) {
                                            let allMobileList = ownerMobileList.concat(guestMobileList);
                                            for (let i = 0;i <allMobileList.length;i++) {
                                                if (allMobileList[i] === this.contractForm.otherCooperationInfo.mobile) {
                                                    otherMobile = false;
                                                    break;
                                                }
                                            }
                                            for (let index = 0;index <guestMobileList.length;index++) {
                                                if (ownerMobileList.includes(guestMobileList[index])) {
                                                    ownerGuestMobile = false;
                                                    break;
                                                }
                                            }
                                        } else {
                                            for (let index = 0;index < guestMobileList.length;index++) {
                                                if (ownerMobileList.includes(guestMobileList[index])) {
                                                    ownerGuestMobile = false;
                                                    break;
                                                }
                                            }
                                        }
                                        if (this.contractForm.isHaveCooperation === 1 && this.contractForm.otherCooperationInfo.identifyCode) {
                                            IdCardList.push(this.contractForm.otherCooperationInfo.identifyCode);
                                        }
                                        let IdCardList_ = Array.from(new Set(IdCardList));
                                        let passportList_ = Array.from(new Set(passportList));
                                        let businessList_ = Array.from(new Set(businessList));
                                        let militaryIDList_ = Array.from(new Set(militaryIDList));
                                        if (ownerGuestMobile && otherMobile) {
                                            if (IdCardList.length === IdCardList_.length) {
                                                if (passportList.length === passportList_.length) {
                                                    if (businessList.length === businessList_.length) {
                                                        if (militaryIDList.length === militaryIDList_.length) {
                                                            this.verifyIDCard('one')
                                                        } else {
                                                            this.$toast("军官证重复");
                                                        }
                                                    } else {
                                                        this.$toast("营业执照重复");
                                                    }
                                                } else {
                                                    this.$toast("护照重复");
                                                }
                                            } else {
                                                this.$toast("身份证号重复");
                                            }
                                        } else {
                                            this.$toast("电话号码重复");
                                        }
                                    } else {
                                        this.$toast("客源信息-客户产权比和必须为100%");
                                    }
                                }
                            } else {
                                this.$toast("客源信息-客源方门店不能为空");
                            }
                        } else {
                            this.$toast("房源信息-业主产权比和必须为100%");
                        }
                    }
                }else{
                    this.$toast('合同信息-总佣金不能为零')
                }
            }else{//意向定金验证
                if(!this.contractForm.rightAddrCity||!this.contractForm.rightAddrArea){//产权地址
                    this.showError=true
                    document.querySelector("#rightAddr").scrollIntoView()
                    return
                }else{
                    this.showError=false
                }

                if(this.ownerList[0].name.indexOf("先生")!=-1||this.ownerList[0].name.indexOf("女士")!=-1||this.guestList[0].name.indexOf("先生")!=-1||this.guestList[0].name.indexOf("女士")!=-1){
                    this.$toast("业主或客户姓名不正确");
                    return
                }

                let reg = /^1[0-9]{10}$/; //手机号正则
                let reg_ = /^0\d{2,3}\-?\d{7,8}$/; //固话正则

                if(this.ownerList[0].mobile&&!reg.test(this.ownerList[0].mobile)&&!reg_.test(this.ownerList[0].mobile)){
                    this.$toast("业主电话号码格式错误");
                    return
                }

                if(this.ownerList[0].cardType===1&&!this.isIdCardNo(this.ownerList[0].encryptionCode)){
                    this.$toast("业主身份证格式错误");
                    return
                }

                if(this.ownerList[0].lepIdentity&&!this.isIdCardNo(this.ownerList[0].lepIdentity)){
                    this.$toast("业主法人身份证格式错误");
                    return
                }

                if(!reg.test(this.guestList[0].mobile)&&!reg_.test(this.guestList[0].mobile)){
                    this.$toast("客户电话号码格式错误");
                    return
                }

                if(this.guestList[0].cardType===1&&!this.isIdCardNo(this.guestList[0].encryptionCode)){
                    this.$toast("客户身份证格式错误");
                    return
                }
                if(this.guestList[0].lepIdentity&&!this.isIdCardNo(this.guestList[0].lepIdentity)){
                    this.$toast("客户法人身份证格式错误");
                    return
                }

                let mobileNum0 = JSON.parse(JSON.stringify(this.ownerList[0])).mobile.replace('-','')
                let mobileNum1 = JSON.parse(JSON.stringify(this.guestList[0])).mobile.replace('-','')
                if(mobileNum0===mobileNum1){
                    this.$toast("业主客户电话号码重复");
                    return
                }
                if(this.ownerList[0].encryptionCode!=''&&this.guestList[0].encryptionCode!=''&&this.ownerList[0].cardType!=''&&this.guestList[0].cardType!=''&&this.ownerList[0].cardType===this.guestList[0].cardType&&this.ownerList[0].encryptionCode===this.guestList[0].encryptionCode){
                    this.$toast("业主客户证件号码重复");
                    return
                }
                this.verifyIDCard('two')
            }
        },
        //验证姓名和身份证号是否一致
        verifyIDCard(type){
            let cardList = []
            this.ownerList.forEach(element=>{
                if(element.cardType===1){
                    let item = {
                        name:element.name,
                        identity:element.encryptionCode
                    }
                    cardList.push(item)
                }
            })
            this.guestList.forEach(element=>{
                if(element.cardType===1){
                    let item = {
                        name:element.name,
                        identity:element.encryptionCode
                    }
                    cardList.push(item)
                }
            })
            if(cardList.length>0){
                this.$ajax.postJSON('/api/app/contract/authCardInfoList',cardList).then(res=>{
                    res=res.data
                    if(res.status===200){
                        if(type==='one'){
                            this.submit_one()
                        }else{
                            this.submit_two()
                        }
                    }
                }).catch(error=>{
                    this.$toast(error)
                })
            }else{
                if(type==='one'){
                    this.submit_one()
                }else{
                    this.submit_two()
                }
            }
        },
        //租赁买卖代办提交
        submit_one(){
            this.showLoading=true
            this.contractForm.signDate=this.contractForm.signDate.substr(0,16) + ":00"
            this.contractForm.propertyRightAddr = this.contractForm.rightAddrCity + "市" + this.contractForm.rightAddrArea + "区" + this.contractForm.rightAddrDetail;
            this.contractForm.contPersons = [];
            let ownerArr = this.ownerList.map(item => Object.assign({}, item));
            let guestArr = this.guestList.map(item => Object.assign({}, item));
            ownerArr.forEach((element, index) => {
                if (element.isEncryption) {
                    element.encryptionMobile = this.ownerList_[index].encryptionMobile;
                } else {
                    element.encryptionMobile = element.mobile;
                }
                delete element.isEncryption;
                this.contractForm.contPersons.push(element);
            });
            guestArr.forEach((element, index) => {
                if (element.isEncryption) {
                    element.encryptionMobile = this.guestList_[index].encryptionMobile;
                } else {
                    element.encryptionMobile = element.mobile;
                }
                delete element.isEncryption;
                this.contractForm.contPersons.push(element);
            });
            let param
            if (this.contractForm.type === 1) { //租赁合同
                param = {
                    leaseCont: this.contractForm,
                    type: this.operationType==="add"?1:2,
                    recordType:10,//无纸化
                    haveExamine:0,
                };
            } else if (this.contractForm.type === 2 || this.contractForm.type === 3) { //买卖代办合同
                param = {
                    saleCont: this.contractForm,
                    type: this.operationType==="add"?1:2,
                    recordType:10,//无纸化
                    haveExamine:0,
                };
            }
            if (this.operationType === "add") {//新增
                this.$ajax.postJSON("/api/contract/addContract", param).then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        let contractMsg = res.data;
                        sessionStorage.setItem("contractMsg",JSON.stringify(contractMsg));
                        if (contractMsg.singleCompany) {
                            this.singleCompany = true;
                            this.singleCompanyName = contractMsg.singleCompany;
                        } else {
                            this.$router.push({
                                path: "/contractH5"
                            });
                        }
                    }
                }).catch(error => {
                    this.showLoading=false
                    this.$toast(error);
                });
            } else if (this.operationType === "edit") {//编辑
                let a = this.contractForm.type===1?"leaseCont":"saleCont"
                delete param[a].contChangeState;
                delete param[a].contState;
                delete param[a].contType;
                delete param[a].laterStageState;
                delete param[a].toExamineState;
                delete param[a].previewImg;
                delete param[a].subscriptionTerm;
                delete param[a].updateTime;
                delete param[a].distributableAchievement;
                delete param[a].achievementState;
                delete param[a].recordType;
                delete param[a].resultState;
                this.$ajax.postJSON("/api/contract/updateContract", param).then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        this.showLoading=false
                        let contractMsg = res.data;
                        sessionStorage.setItem("contractMsg",JSON.stringify(contractMsg));
                        if (contractMsg.singleCompany) {
                            this.singleCompany = true;
                            this.singleCompanyName = contractMsg.singleCompany;
                        } else {
                            this.$router.push({
                                path: "/contractH5"
                            });
                        }
                    }
                }).catch(error => {
                    this.showLoading=false
                    this.$toast(error);
                });
            }
        },
        //意向定金提交
        submit_two(){
            this.showLoading=true
            this.contractForm.signDate=this.contractForm.signDate.substr(0,16) + ":00"
            this.contractForm.contPersons = [];
            let ownerArr = this.ownerList.map(item => Object.assign({}, item));
            let guestArr = this.guestList.map(item => Object.assign({}, item));
            ownerArr.forEach((element, index) => {
                if (element.isEncryption) {
                    element.encryptionMobile = this.ownerList_[index].encryptionMobile;
                } else {
                    element.encryptionMobile = element.mobile;
                }
                delete element.isEncryption;
                this.contractForm.contPersons.push(element);
            });
            guestArr.forEach((element, index) => {
                if (element.isEncryption) {
                    element.encryptionMobile = this.guestList_[index].encryptionMobile;
                } else {
                    element.encryptionMobile = element.mobile;
                }
                delete element.isEncryption;
                this.contractForm.contPersons.push(element);
            });
            let url = this.operationType==="add"?'/api/contract/addContract':'/api/contract/updateContract'
            let param = {
                igdCont: {
                    type: this.contractForm.type,
                    pCode: this.contractForm.pCode,
                    signDate: this.contractForm.signDate,
                    houseinfoCode: this.contractForm.houseinfoCode,
                    guestinfoCode: this.contractForm.guestinfoCode,
                    subscriptionTerm: this.contractForm.subscriptionTerm,
                    subscriptionPrice: this.contractForm.subscriptionPrice,
                    dealPrice: this.contractForm.dealPrice,
                    remarks: this.contractForm.remarks,
                    houseInfo:this.contractForm.houseInfo,
                    guestInfo:this.contractForm.guestInfo,
                    contPersons: [
                        //业主信息
                        {
                            name: this.contractForm.contPersons[0].name,
                            encryptionMobile: this.contractForm.contPersons[0].mobile,
                            mobile:this.contractForm.contPersons[0].mobile,
                            encryptionCode: this.contractForm.contPersons[0].encryptionCode,
                            identifyCode: this.contractForm.contPersons[0].encryptionCode,
                            cardType: this.contractForm.contPersons[0].cardType,
                            email: this.contractForm.contPersons[0].email,
                            type: 1,
                            companyName: this.contractForm.contPersons[0].companyName?this.contractForm.contPersons[0].companyName:'',
                            lepName: this.contractForm.contPersons[0].lepName?this.contractForm.contPersons[0].lepName:'',
                            lepIdentity: this.contractForm.contPersons[0].lepIdentity?this.contractForm.contPersons[0].lepIdentity:'',
                        },
                        //客户信息
                        {
                            name: this.contractForm.contPersons[1].name,
                            encryptionMobile: this.contractForm.contPersons[1].mobile,
                            mobile: this.contractForm.contPersons[1].mobile,
                            encryptionCode: this.contractForm.contPersons[1].encryptionCode,
                            identifyCode: this.contractForm.contPersons[1].encryptionCode,
                            cardType: this.contractForm.contPersons[1].cardType,
                            email: this.contractForm.contPersons[1].email,
                            type: 2,
                            companyName: this.contractForm.contPersons[0].companyName?this.contractForm.contPersons[0].companyName:'',
                            lepName: this.contractForm.contPersons[0].lepName?this.contractForm.contPersons[0].lepName:'',
                            lepIdentity: this.contractForm.contPersons[0].lepIdentity?this.contractForm.contPersons[0].lepIdentity:'',
                        }
                    ],
                    propertyRightAddr:this.contractForm.rightAddrCity+"市"+this.contractForm.rightAddrArea+"区"+this.contractForm.rightAddrDetail
                },
                type: this.operationType==="add"?1:2,//操作类型 1新增 2编辑
                recordType:10,//线上线下 1线上  2线下  10无纸化
            };
            if(this.operationType==="edit"){
                param.igdCont.id=this.contractForm.id
            }
            let price=''
            if(param.igdCont.houseInfo.ListingPrice){
                price = String(param.igdCont.houseInfo.ListingPrice)
            }
            if(!param.igdCont.houseinfoCode&&price.length>0){
                if(param.igdCont.houseInfo.TimeUnit===1){
                    param.igdCont.houseInfo.ListingPrice=price.replace(/\.$/,'')+'元'
                }else if(param.igdCont.houseInfo.TimeUnit===2){
                    param.igdCont.houseInfo.ListingPrice=price.replace(/\.$/,'')+'元/月'
                }
            }else if(price.length>0){
                param.igdCont.houseInfo.ListingPrice=price.replace(/\.$/,'')
            }
            this.$ajax.postJSON(url, param).then(res => {
                if (res.data.status === 200) {
                    this.showLoading=false
                    let contractMsg = res.data.data
                    sessionStorage.setItem("contractMsg", JSON.stringify(contractMsg));
                    if (contractMsg.singleCompany) {
                        this.singleCompany = true;
                        this.singleCompanyName = contractMsg.singleCompany;
                    } else {
                        this.$router.push({
                            path: "/contractH5"
                        });
                    }
                }
            }).catch(error => {
                this.showLoading=false
                this.$toast(error);
            });
        },
        //跳转H5页面
        toH5() {
            this.singleCompany = false;
            this.$router.push({
                path: "/contractH5"
            });
        },
        //输入格式化
        formatter(type){
            let addrReg = /\\|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
            if(type==="custCommission"){
                this.$nextTick(()=>{
                    this.contractForm.custCommission=TOOL.cutFloat({val:this.contractForm.custCommission,max:999999999.99})
                })
            }
            if(type==="ownerCommission"){
                this.$nextTick(()=>{
                    this.contractForm.ownerCommission=TOOL.cutFloat({val:this.contractForm.ownerCommission,max:999999999.99})
                })
            }
            if(type==="dealPrice"){
                this.$nextTick(()=>{
                    this.contractForm.dealPrice=TOOL.cutFloat({val:this.contractForm.dealPrice,max:999999999.99})
                })
            }
            if(type==="city"){
                this.$nextTick(()=>{
                    this.contractForm.rightAddrCity = this.contractForm.rightAddrCity.replace(/\s+/g, "").replace(addrReg, "").replace("市", "")
                })
            }
            if(type==="area"){
                this.contractForm.rightAddrArea = this.contractForm.rightAddrArea.replace(/\s+/g, "").replace(addrReg, "").replace("市", "")
            }
            if(type==="rightAddrDetail"){
                this.contractForm.rightAddrDetail=this.contractForm.rightAddrDetail.replace(/\s+/g,"").replace(addrReg,'')
            }
            if(type==="Square"){
                this.$nextTick(()=>{
                    this.contractForm.houseInfo.Square=TOOL.cutFloat({val:this.contractForm.houseInfo.Square,max:999999.99})
                })
            }
            if(type==="SquareUse"){
                this.$nextTick(()=>{
                    this.contractForm.houseInfo.SquareUse=TOOL.cutFloat({val:this.contractForm.houseInfo.SquareUse,max:999999.99})
                })
            }
            if(type==="remarks"){
                let addrReg = /\\|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
                this.contractForm.remarks=this.contractForm.remarks.replace(/\s+/g,"").replace(addrReg,'')
            }
            if(type==="subscriptionPrice"){//意向定金 认购总价
                this.$nextTick(()=>{
                    this.contractForm.subscriptionPrice=TOOL.cutFloat({val:this.contractForm.subscriptionPrice,max:999999999.99})
                })
            }
            if(type==="ListingPrice"){//意向定金 房屋总价
                this.$nextTick(()=>{
                    this.contractForm.houseInfo.ListingPrice=TOOL.cutFloat({val:this.contractForm.houseInfo.ListingPrice,max:999999999.99})
                })
            }
        },
        //人员信息格式化
        formatPersonMsg(index,personType,name){
            let arr = []
            if(personType==="owner"){
                arr = [].concat(this.ownerList)
            }else{
                arr = [].concat(this.guestList)
            }

            if(name==='name'||name==="companyName"||name==='lepName'){
                arr[index][name]=TOOL.textInput(arr[index][name])
            }
            if(name==='mobile'){
                this.verifyMobile(arr[index],index,personType)
            }
            if(name==='propertyRightRatio'){
                arr[index].propertyRightRatio=TOOL.cutFloat({val:arr[index].propertyRightRatio,max:100})
            }
            if(name==='cardId'){
                let item = arr[index]
                if(item.encryptionCode.length===18){
                    if (!this.isIdCardNo(item.encryptionCode)&&item.cardType===1) {
                        this.$toast('身份证格式不正确')
                    }
                }
            }
            if(name==="lepIdentity"){
                let item = arr[index]
                if(item.lepIdentity.length===18){
                    if (!this.isIdCardNo(item.lepIdentity)) {
                        this.$toast('身份证格式不正确')
                    }
                }
            }
            if(name==="email"){
                arr[index].email=arr[index].email.replace(/\s+/g,"")
            }
        },
        //手机号验证
        verifyMobile(item,index,type) {
            let beginNum = /^0.*$/
            if(item.mobile.length>0){
                if(type==="owner"){
                    if(beginNum.test(item.mobile)){
                        this.ownerList[index].mobile=item.mobile.substring(0,13)
                    }else{
                        this.ownerList[index].mobile=item.mobile.substring(0,11)
                    }
                    item.mobile=this.ownerList[index].mobile
                }else if(type==="guest"){
                    if(beginNum.test(item.mobile)){
                        this.guestList[index].mobile=item.mobile.substring(0,13)
                    }else{
                        this.guestList[index].mobile=item.mobile.substring(0,11)
                    }
                    item.mobile=this.guestList[index].mobile
                }
            }
            if(item.isEncryption){//是否是加密的号码
                if(type==="owner"){
                    if(this.ownerList[index].mobile!==this.beforeChangeMobile){
                        if(Number(item.mobile)){
                            this.ownerList[index].mobile=item.mobile;
                        }else{
                            this.ownerList[index].mobile='';
                        }
                        this.ownerList[index].isEncryption=false;
                    }
                }else if(type==="guest"){
                    if(this.guestList[index].mobile!==this.beforeChangeMobile){
                        if(Number(item.mobile)){
                            this.guestList[index].mobile=item.mobile;
                        }else{
                            this.guestList[index].mobile='';
                        }
                        this.guestList[index].isEncryption=false;
                    }
                }
            }else{
                if(item.mobile.length>=11){
                    let reg = /^1[0-9]{10}$/;
                    let reg_ = /^0\d{2,3}\-?\d{7,8}$/
                    if (!reg.test(item.mobile)&&!reg_.test(item.mobile)) {
                        this.$toast('电话号码格式不正确')
                    }
                }
            }
        },
        //存贮改变之前的手机号
        saveMobile(item, index, type) {
            if (item.isEncryption) {
                if (type === "owner") {
                    this.beforeChangeMobile = this.ownerList[index].mobile;
                } else if (type === "guest") {
                    this.beforeChangeMobile = this.guestList[index].mobile;
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
        //产权比验证 业主客户佣金验证
        validator(val){
            if(val>=0){
                return true
            }else{
                return false
            }
        },
        //是否是必填（意向定金合同部分字段非必填）
        asyncValidator(val){
            if(this.contractForm.type<4){
                if(val&&val.length>0){
                    return true
                }else{
                    return false
                }
            }else{
                return true
            }
        },
        //身份证验证
        verifyIdcard(val){
            if(val){
                return this.isIdCardNo(val)
            }else{
                return false
            }
            
        },
        //时间选择器
        onConfirm(val){
            this.contractForm.subscriptionTerm=TOOL.dateFormat(val)
            this.showPicker=false
        },
        // 城市选择
        selectCity(val){
            this.contractForm.frontAddr=val.map((item) => item.name).join('-');
            this.showArea=false
        },
        //选择器组件弹出
        showPopList(type,index){
            this.popSelectId=-99
            this.popListType=type
            this.popListIndex=index
            if(type==="ownerRelation"||type==="guestRelation"){
                if(type==="ownerRelation"){
                    this.popSelectId=this.ownerList[index].relation?this.ownerList[index].relationId:-99
                }else{
                    this.popSelectId=this.guestList[index].relation?this.guestList[index].relationId:-99
                }
                this.selectList=[].concat(this.relationList)
                this.popState=true
            }else if(type==="ownerCardType"||type==="guestCardType"){
                if(type==="ownerCardType"){
                    this.popSelectId=this.ownerList[index].cardType?this.ownerList[index].cardType:-99
                }else{
                    this.popSelectId=this.guestList[index].cardType?this.guestList[index].cardType:-99
                }
                let arr = []
                this.dictionary['633'].forEach(element => {
                    let a ={
                        id:element.key,
                        name:element.value,
                    }
                    if(a.name!="军官证"){
                        arr.push(a)
                    }
                });
                this.selectList=[].concat(arr)
                this.popState=true
            }else if(type==="timeUnit"){
                this.popSelectId=this.contractForm.timeUnit?this.contractForm.timeUnit:-99
                let arr = []
                this.dictionary['507'].forEach(element => {
                    let a ={
                        id:element.key,
                        name:element.value,
                    }
                    arr.push(a)
                });
                this.selectList=[].concat(arr)
                this.popState=true
            }else if(type==="ListingPrice"){
                if(!this.contractForm.houseinfoCode){
                    this.popSelectId=this.contractForm.houseInfo.TimeUnit?this.contractForm.houseInfo.TimeUnit:-99
                    let arr = [{id:1,name:'元'},{id:2,name:'元 / 月'}]
                    this.selectList=[].concat(arr)
                    this.popState=true
                }
                
            }
        },
        //选择器组件确认
        confirmChose(val){
            this.popState=false
            if(this.popListType==="ownerRelation"){
                this.ownerList[this.popListIndex].relation=val?val.name:''
                this.ownerList[this.popListIndex].relationId=val?val.id:-99
            }if(this.popListType==="guestRelation"){
                this.guestList[this.popListIndex].relation=val?val.name:''
                this.guestList[this.popListIndex].relationId=val?val.id:-99
            }else if(this.popListType==="ownerCardType"){
                if(val.id!=this.ownerList[this.popListIndex].cardType){
                    this.ownerList[this.popListIndex].encryptionCode=''
                }
                if(val.id!=3){//非营业执照清空法人信息
                    this.$set(this.ownerList[this.popListIndex],'companyName','')
                    this.$set(this.ownerList[this.popListIndex],'lepName','')
                    this.$set(this.ownerList[this.popListIndex],'lepIdentity','')
                }
                this.ownerList[this.popListIndex].cardType=val?val.id:-99
            }else if(this.popListType==="guestCardType"){
                if(val.id!=this.guestList[this.popListIndex].cardType){
                    this.guestList[this.popListIndex].encryptionCode=''
                }
                if(val.id!=3){//非营业执照清空法人信息
                    this.$set(this.guestList[this.popListIndex],'companyName','')
                    this.$set(this.guestList[this.popListIndex],'lepName','')
                    this.$set(this.guestList[this.popListIndex],'lepIdentity','')
                }
                this.guestList[this.popListIndex].cardType=val?val.id:-99
            }else if(this.popListType==="timeUnit"){
                this.$set(this.contractForm,'timeUnit',val?val.id:-99)
            }else if(this.popListType==="ListingPrice"){
                this.$set(this.contractForm.houseInfo,'TimeUnit',val?val.id:-99)
            }
        },
        //选择器组件取消
        closePop(){
            this.popState=false
        },
        //删除业主客户
        deletePerson(index,type){
            this.delType=type
            this.delIndex=index
            this.delPersonDialog=true
        },
        confirmDel(){
            if(this.delType==="owner"){
                this.ownerList.splice(this.delIndex, 1);
                // this.ownerList_.splice(this.delIndex, 1);
                this.delPersonDialog=false;
            }else{
                this.guestList.splice(this.delIndex, 1);
                // this.guestList_.splice(this.delIndex, 1);
                this.delPersonDialog=false;
            }
        },
        //添加业主客户
        addPerson(type){
            let ob = {
                type: type==="owner"?1:2,
                encryptionCode: "",
                mobile: "",
                encryptionMobile:"",
                relation: "",
                cardType: "",
                name: "",
                propertyRightRatio: "",
                lepName:"",
                companyName:"",
                lepIdentity:"",
            }
            if(type==="owner"){
                if(this.ownerList.length===10){
                    this.$toast('业主数量已达上限')
                }else{
                    this.ownerList.push(ob)
                }
            }else{
                if(this.guestList.length===10){
                    this.$toast('业主数量已达上限')
                }else{
                    this.guestList.push(ob)
                }
            }
        },
        //验证产权地址是否填写
        checkMsg(){
            if(!this.contractForm.rightAddrCity||!this.contractForm.rightAddrArea){
                this.showError=true
            }else{
                this.showError=false
            }
        },
        //选择客源
        chooseGuest(){
            this.setContractForm(this.contractForm)
            this.setOwnerList(this.ownerList)
            this.setOwnerList_(this.ownerList_)
            this.setGuestList(this.guestList)
            this.setGuestList_(this.guestList_)
            this.setOperationType(this.operationType)
            let type=''//全部
            if(this.contractForm.type===1){
                type=1//求租
            }else if(this.contractForm.type===2||this.contractForm.type===3){
                type=2//求购
            }
            this.$router.push({
                path:"/chooseGuest",
                query:{
                    id:this.guestId,
                    type
                }
            })
        },
        //根据房源id获取房源信息
        getHousedetail(id) {
            let param = {
                houseId: id
            };
            this.$ajax.get("/api/resource/houses/one", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    let houseMsg = res.data;
                    this.contractForm.houseinfoCode = houseMsg.PropertyNo; //房源编号
                    if(this.contractForm.type<4){//买卖租赁代办
                        houseMsg.CompleteYear = houseMsg.CompleteYear ? houseMsg.CompleteYear : "--";
                        // 1 月 2 季度 4 年
                        let unit;
                        if (houseMsg.PriceUnitNameEnum) {
                            unit = houseMsg.PriceUnitNameEnum;
                        } else {
                            unit = 1;
                        }
                        this.$set(this.contractForm, "timeUnit", unit);
                        this.contractForm.houseInfo = houseMsg;
                        if (houseMsg.OwnerInfoList.length > 0) {
                            this.ownerList = [];
                            this.ownerList_ = [];
                            houseMsg.OwnerInfoList.forEach(element => {
                                element.type = 1;
                                element.encryptionCode = "";
                                element.propertyRightRatio = "";
                                element.name = element.OwnerName;
                                element.mobile = element.OwnerMobile;
                                element.relation = element.Relation;
                                element.cardType = "";
                                element.isEncryption = true;
                                delete element.OwnerName;
                                delete element.OwnerMobile;
                                delete element.Relation;
                                let obj = Object.assign({}, element);
                                obj.mobile = obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
                                this.ownerList.push(obj);
                                let obj_ = Object.assign({}, element);
                                obj_.encryptionMobile = obj_.mobile;
                                this.ownerList_.push(obj_);
                            });
                        }
                        this.contractForm.houseInfo = houseMsg;
                    }else{//意向定金
                        this.contractForm.houseInfo = houseMsg;
                        this.contractForm.houseInfo.ListingPrice=''
                        if(houseMsg.TradeInt===2){
                            this.$set(this.contractForm.houseInfo,'TimeUnit',1)
                        }else if(houseMsg.TradeInt===3){
                            this.$set(this.contractForm.houseInfo,'TimeUnit',2)
                        }
                    }
                }
            }).catch(error => {
                this.$toast(error);
            });
        },
        //根据客源id获取客源详情
        getGuestDetail(id) {
            let param = {
                customerId: id
            };
            this.$ajax.get("/api/resource/customers/one", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    let guestMsg = res.data;
                    this.contractForm.guestinfoCode = guestMsg.InquiryNo; //客源编号
                    this.contractForm.guestInfo = guestMsg;
                    if(this.contractForm.type<4){//租赁买卖代办
                        this.$set(this.contractForm.guestInfo,"paymentMethod",1);
                        if (guestMsg.OwnerInfo.length > 0) {
                            this.guestList = [];
                            this.guestList_ = [];
                            guestMsg.OwnerInfo.forEach(element => {
                                element.type = 2;
                                element.encryptionCode = "";
                                element.propertyRightRatio = "";
                                element.name = element.CustName;
                                element.mobile = element.CustMobile;
                                element.relation = element.CustRelation;
                                element.cardType = "";
                                element.isEncryption = true;
                                delete element.CustName;
                                delete element.CustMobile;
                                delete element.CustRelation;
                                let obj = Object.assign({}, element);
                                obj.mobile = obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
                                this.guestList.push(obj);
                                let obj_ = Object.assign({}, element);
                                obj_.encryptionMobile = obj_.mobile;
                                this.guestList_.push(obj_);
                            });
                        }
                    }else{//意向定金
                        this.guestList[0].name=guestMsg.OwnerInfo[0].CustName
                        this.guestList[0].encryptionMobile=guestMsg.OwnerInfo[0].CustMobile
                        this.guestList[0].mobile=guestMsg.OwnerInfo[0].CustMobile
                        this.guestList[0].relation=guestMsg.OwnerInfo[0].CustRelation
                        this.guestList[0].type=2
                    }
                }
            }).catch(error => {
                this.$toast(error);
            });
        },
        //备注栏展开收起
        showRemark(){
            this.remarkState=!this.remarkState
        },
        //获取合同信息
        getContractDetail(id) {
            let param = {
                id: id
            };
            this.$ajax.get("/api/contract/detail", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    this.contractForm = res.data;
                    this.contractForm.houseInfo.Square=this.contractForm.houseInfo.Square?this.contractForm.houseInfo.Square:''
                    this.contractForm.houseInfo.SquareUse=this.contractForm.houseInfo.SquareUse?this.contractForm.houseInfo.SquareUse:''
                    this.contractForm.signDate=this.contractForm.signDate.substr(0,16)
                    this.countTotal();//计算总佣金
                    if (res.data.remarks && res.data.remarks.length > 0) {//备注栏
                        this.remarkState = true;
                    }
                    this.contractForm.type = res.data.contType.value;
                    this.guestId = res.data.guestInfo.InquiryCode
                    if(this.contractForm.type>3){//意向定金处理
                        this.contractForm.subscriptionTerm = res.data.subscriptionTerm.substr(0,10); 
                        if(this.contractForm.houseinfoCode){
                            if(this.contractForm.houseInfo.TradeInt===2){
                                this.$set(this.contractForm.houseInfo,'TimeUnit',1)
                            }else if(this.contractForm.houseInfo.TradeInt===3){
                                this.$set(this.contractForm.houseInfo,'TimeUnit',2)
                            }
                        }else if(this.contractForm.houseInfo.ListingPrice.length>0){
                            if(this.contractForm.houseInfo.ListingPrice.indexOf('元/月')>-1){
                                this.$set(this.contractForm.houseInfo,'TimeUnit',2)
                            }else{
                                this.$set(this.contractForm.houseInfo,'TimeUnit',1)
                            }
                            this.contractForm.houseInfo.ListingPrice=this.contractForm.houseInfo.ListingPrice.split("元")[0]
                        }
                    }
                    let rightAddress = res.data.propertyRightAddr;
                    let index1 = rightAddress.indexOf("市");
                    let index2 = rightAddress.indexOf("区");
                    if (index1 > 0) {
                        this.$set(this.contractForm, 'rightAddrCity', rightAddress.substring(0, index1))
                    }
                    if (index2 > 0) {
                        if (index1 > 0) {
                            this.$set(this.contractForm, 'rightAddrArea', rightAddress.substring(index1 + 1,index2))
                        } else {
                            this.$set(this.contractForm, 'rightAddrArea', rightAddress.substring(0,index2))
                        }
                    }
                    if (index1 > 0 && index2 > 0) {
                        this.$set(this.contractForm, 'rightAddrDetail', rightAddress.substring(index2 + 1))
                    } else if (index1 > 0 && index2 < 0) {
                        this.$set(this.contractForm, 'rightAddrDetail', rightAddress.substring(index1 + 1))
                    } else if (index1 < 0 && index2 > 0) {
                        this.$set(this.contractForm, 'rightAddrDetail', rightAddress.substring(index2 + 1))
                    } else {
                        this.$set(this.contractForm, 'rightAddrDetail', rightAddress)
                    }
                    this.ownerList = [];
                    this.guestList = [];
                    for (let i = 0;i < this.contractForm.contPersons.length;i++) {
                        if (this.contractForm.contPersons[i].personType.value === 1) {
                            let element = {
                                name: this.contractForm.contPersons[i].name,
                                mobile: this.contractForm.contPersons[i].mobile,
                                pid: this.contractForm.contPersons[i].pid,
                                encryptionMobile: this.contractForm.contPersons[i].encryptionMobile,
                                relation: this.contractForm.contPersons[i].relation,
                                propertyRightRatio: this.contractForm.contPersons[i].propertyRightRatio,
                                identifyCode: this.contractForm.contPersons[i].identifyCode,
                                encryptionCode: this.contractForm.contPersons[i].encryptionCode,
                                email: this.contractForm.contPersons[i].email==='-'?'':this.contractForm.contPersons[i].email,
                                cardType: this.contractForm.contPersons[i].cardType,
                                lepName: this.contractForm.contPersons[i].lepName==='-'?'':this.contractForm.contPersons[i].lepName,
                                companyName: this.contractForm.contPersons[i].companyName==='-'?'':this.contractForm.contPersons[i].companyName,
                                lepIdentity: this.contractForm.contPersons[i].lepIdentity==='-'?'':this.contractForm.contPersons[i].lepIdentity,
                                type: 1,
                                isEncryption: true
                            };
                            let obj = Object.assign({}, element);
                            // obj.mobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
                            this.ownerList.push(obj);
                            let obj_ = Object.assign({}, element);
                            this.ownerList_.push(obj_);
                        } else if (this.contractForm.contPersons[i].personType.value === 2) {
                            let element = {
                                name: this.contractForm.contPersons[i].name,
                                mobile: this.contractForm.contPersons[i].mobile,
                                pid: this.contractForm.contPersons[i].pid,
                                encryptionMobile: this.contractForm.contPersons[i].encryptionMobile,
                                relation: this.contractForm.contPersons[i].relation,
                                propertyRightRatio: this.contractForm.contPersons[i].propertyRightRatio,
                                identifyCode: this.contractForm.contPersons[i].identifyCode,
                                encryptionCode: this.contractForm.contPersons[i].encryptionCode,
                                email: this.contractForm.contPersons[i].email==='-'?'':this.contractForm.contPersons[i].email,
                                cardType: this.contractForm.contPersons[i].cardType,
                                lepName: this.contractForm.contPersons[i].lepName==='-'?'':this.contractForm.contPersons[i].lepName,
                                companyName: this.contractForm.contPersons[i].companyName==='-'?'':this.contractForm.contPersons[i].companyName,
                                lepIdentity: this.contractForm.contPersons[i].lepIdentity==='-'?'':this.contractForm.contPersons[i].lepIdentity,
                                type: 2,
                                isEncryption: true
                            };
                            let obj = Object.assign({}, element);
                            // obj.mobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
                            this.guestList.push(obj);
                            let obj_ = Object.assign({}, element);
                            this.guestList_.push(obj_);
                        }
                    }
                }
            });
        },
        ...mapMutations([
            'setContractForm',
            'setOwnerList',
            'setOwnerList_',
            'setGuestList',
            'setGuestList_',
            'setOperationType',
        ])
    },
    computed: {
        ...mapGetters([
            'getContractForm',
            'getOwnerList',
            'getOwnerList_',
            'getGuestList',
            'getGuestList_',
            'getGuestId',
            'getOperationType',
        ]),
        isDisabled(){
            return (!!this.contractForm.houseinfoCode)
        }
    },
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
    bottom: 60px;
    overflow-y: auto;
}
.van-form{
    /deep/.van-cell__title{
        color: @text-grey-BBB;
    }
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
/deep/.van-field__right-icon{
    color: @text-grey-BBB;
}
.longLabel{
    /deep/.van-field__label{
        width: 205px !important;
    }
}
/deep/.van-icon-arrow-down{
    color: @text-grey-BBB;
}
/deep/.van-field__control{
    color: @text-grey-333;
}
.addContract{
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
        padding: 0 10px 0 25px;
        position: relative;
        >.iconjiaobiao{
            color: @text-green;
            font-size: 22px;
            position: absolute;
            top: 0;
            left: 4px;
        }
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
    /deep/.van-field__label{
        width: 110px;
    }
    /deep/.van-cell{
        padding: 10px 26px;
    }
}
.personModule{
    background-color: @bg-white;
    margin-top: 10px;
    padding-bottom: 10px;
    .title{
        position: relative;
        color: @text-grey-333;
        font-size: 16px;
        font-weight: bold;
        padding: 15px 15px 12px 25px;
        >.iconjiaobiao{
            color: @text-green;
            font-size: 22px;
            position: absolute;
            top: 14px;
            left: 4px;
        }
        .personAdd{
            font-size: 24px;
            color: @text-green;
            position: absolute;
            right: 25px;
            top: 12px;
        }
    }
    .personList{
        width: 344px;
        margin: 0 auto;
        .personTitle{
            font-size: 14px;
            color: @text-grey-333;
            font-weight: bold;
            background-color: @border-grey;
            padding: 0 20px;
            margin-top: 12px;
            line-height: 40px;
            border-radius: 7px 7px 0 0;
            .personDel{
                float: right;
                color: @text-green;
            }
        }
        .personMsg{
            // padding: 0 20px 10px 20px;
            margin: 0 auto 10px;
            border-radius: 0 0 7px 7px;
            overflow: hidden;
            background-color: @bg-light-grey;
            /deep/.van-cell{
                background-color: @bg-light-grey;
            }
        }
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
.singleDialog{
    width: 280px;
    box-sizing: border-box;
    padding: 10px;
    word-break: normal;
    height: 60px;
    text-align: center;
    color: @text-grey-666;
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
.rightAddr{
    font-size: 14px;
    margin: 10px 20px 0 20px;
    .label{
        padding-left: 5px;
        color: @text-grey-BBB;
    }
    .inputArea{
        padding: 10px 0 8px 0;
        display: flex;
        input{
            width: 120px;
            border: none;
            padding: 0 10px;
            text-align: right;
            vertical-align:middle;
            color: @text-grey-333;
            &::-webkit-input-placeholder {
                color: @text-grey-BBB;
            }
            &:last-of-type{
                margin-left: 5px;
            }
        }
        span{
            padding: 0 5px;
            display: inline-block;
            width: 180px;
            color: @text-grey-666;
            &:last-of-type{
                padding-left: 20px;
                border-left: 1px solid @text-grey-BBB;
            }
        }
        .border-left{
            display: inline-block;
            width: 15px;
            height: 16px;
            border-left: none;
            border-right: 1px solid @bg-grey-E0E0E1;

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
.rental{
    font-size: 14px;
    margin: 10px 20px 0 20px;
    padding: 3px 0 10px 0;
    border-bottom: 1px solid #ebedf0;
    .label{
        padding-left: 5px;
        color: @text-grey-BBB;
        display: inline-block;
    }
    .inputArea{
        display: inline-block;
        position: relative;
        input{
            margin-left: 25px;
            width: 120px;
            border: none;
            padding: 0 15px;
            text-align: right;
            color: @text-grey-333;
            &::-webkit-input-placeholder {
                color: @text-grey-BBB;
            }
        }
        .listingPrice{
            width: 95px;
        }
        span{
            display: inline-block;
            width: 100px;
            text-align: right;
            border-left: 1px solid @text-grey-BBB;
        }
        .placeText{
            color: @text-grey-BBB;
        }
        .timeUnit{
            color: @text-grey-333;
        }
        .downIcon{
            position: absolute;
            top: 2px;
            right: -20px;
            color: @text-grey-BBB;
        }
    }
    .errorMsg{
        display: none;
        padding:  10px 5px 0 0;
        font-size: 12px;
        color: #ee0a24;
        text-align: right;
    }
    .showError{
        display:block
    }
}
.rental_b{
    padding-bottom: 20px;
    border-bottom: none;
}
.rental_p{
    padding-bottom: 10px;
    border-bottom: none;
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
/deep/.van-field__word-limit{
    color: @text-grey-BBB;
}
</style>