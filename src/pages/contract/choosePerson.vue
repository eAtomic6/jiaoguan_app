<template>
    <div class="choosePerson">
        <div class="content">
            <div class="typeTitle">业主</div>
            <ul class="personList">
                <li v-for="(item,index) in ownerList" :key="index" @click="chose('owner',item)">
                    <div class="title">业主{{index+1}}
                        <van-icon v-if="choseOwnerM.includes(item.mobile)" name="checked" class="chooseIcon color-green" />
                        <van-icon v-else name="passed" class="chooseIcon" />
                    </div>
                    <div class="row row_first">
                        <div class="left"><span class="label">姓名：</span><span class="value">{{item.name}}</span></div>
                        <div class="right"><span class="label">电话：</span><span class="value">{{item.mobile}}</span></div>
                    </div>
                    <div class="row">
                        <div class="left"><span class="label">关系：</span><span class="value">{{item.relation}}</span></div>
                        <div class="right"><span class="label">证件类型：</span><span class="value">{{item.cardType===1?'身份证号':item.cardType===2?'护照':item.cardType===3?'营业执照':'军官证'}}</span></div>
                    </div>
                    <div class="cardId">
                        <span>证件号码：</span><span>{{item.encryptionCode}}</span>
                    </div>
                    
                </li>
            </ul>
            <div class="typeTitle">客户</div>
            <ul class="personList">
                <li v-for="(item,index) in guestList" :key="index" @click="chose('guest',item)">
                    <div class="title">客户{{index+1}}
                        <van-icon v-if="choseGuestM.includes(item.mobile)" name="checked" class="chooseIcon color-green" />
                        <van-icon v-else name="passed" class="chooseIcon" />
                    </div>
                    <div class="row row_first">
                        <div class="left"><span class="label">姓名：</span><span class="value">{{item.name}}</span></div>
                        <div class="right"><span class="label">电话：</span><span class="value">{{item.mobile}}</span></div>
                    </div>
                    <div class="row">
                        <div class="left"><span class="label">关系：</span><span class="value">{{item.relation}}</span></div>
                        <div class="right"><span class="label">证件类型：</span><span class="value">{{item.cardType===1?'身份证号':item.cardType===2?'护照':item.cardType===3?'营业执照':'军官证'}}</span></div>
                    </div>
                    <div class="cardId">
                        <span>证件号码：</span><span>{{item.encryptionCode}}</span>
                    </div>
                    
                </li>
            </ul>
        </div>
        <div class="btnList">
            <span class="editStyle_" @click="submit('cancel')">取消</span>
            <span class="editStyle" @click="submit('confirm')">确认</span>
        </div>
        <!-- 发起签署成功弹窗 -->
        <van-dialog v-model="dialog" title="合同已发起签署 " confirmButtonText="上传资料库" :show-cancel-button="true" @confirm="toDataBase" @cancel="close">
            <div class="dialog">请督促业主和客户在手机上尽快完成签署</div>
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
import {Overlay, Loading} from 'vant'; 
import {mapGetters} from 'vuex'
export default{
    components: {
        [Loading.name]:Loading,
        [Overlay.name]:Overlay,
    },
    data(){
        return{
            ownerList:[],
            guestList:[],
            id:'',
            storeId:'',
            isHaveData:'',
            choseOwnerM:[],
            choseGuestM:[],
            choseOwner:[],
            choseGuest:[],
            dialog:false,
            showLoading:false
        }
    },
    created(){
        this.id=Number(this.$route.query.id)
        this.storeId=Number(this.$route.query.storeId)
        this.isHaveData=Number(this.$route.query.isHaveData)
        this.ownerList=[].concat(this.getOwnerList)
        this.guestList=[].concat(this.getGuestList)
    },
    methods:{
        //选择
        chose(type,val){
            if(type==="owner"){
                let index = this.choseOwnerM.indexOf(val.mobile)
                if(index>-1){
                    this.choseOwnerM.splice(index,1)
                    this.choseOwner.splice(index,1)
                }else{
                    this.choseOwnerM.push(val.mobile)
                    this.choseOwner.push(val)
                }
            }else{
                let index = this.choseGuest.indexOf(val.mobile)
                if(index>-1){
                    this.choseGuestM.splice(index,1)
                    this.choseGuest.splice(index,1)
                }else{
                    this.choseGuestM.push(val.mobile)
                    this.choseGuest.push(val)
                }
            }
        },
        //确认/取消
        submit(type){
            if(type==='confirm'){
                if(this.choseOwner.length>0&&this.choseGuest.length>0){
                    this.showLoading=true
                    let param = {
                        contId:this.id,
                        type:1,//签章
                        isentrust:0,//非委托
                        storeId:this.storeId//门店id
                    }
                    let owner=[],customer=[]
                    this.choseOwner.forEach(element => {
                        let item = {
                            name:element.name,
                            identityType:element.cardType,
                            identity:element.encryptionCode,
                            mobile:element.mobile,
                            email:element.email,
                        }
                        owner.push(item)
                    });
                    this.choseGuest.forEach(element => {
                        let item = {
                            name:element.name,
                            identityType:element.cardType,
                            identity:element.encryptionCode,
                            mobile:element.mobile,
                            email:element.email,
                        }
                        customer.push(item)
                    });
                    param.owner=owner
                    param.customer=customer
                    this.$ajax.postJSON('/api/app/contract/sendCont',param).then(res=>{
                        res=res.data
                        if(res.status===200){
                            this.showLoading=false
                            this.dialog=true
                        }
                    }).catch(error=>{
                        this.showLoading=false
                        this.$toast(error)
                    })
                }else{
                    this.$toast(this.choseOwner.length>0?'请选择客户':'请选择业主')
                }
            }else{
                this.$router.push({
                    path:"/contractHomePage",
                })
            }
        },
        //跳转资料库
        toDataBase(){
            this.$router.push({
                path:"/contractDataBase",
                query:{
                    id:this.id,
                    isHaveData:this.isHaveData
                }
            })
        },
        //跳转合同列表
        close(){
            this.$router.push({
                path:"/contractHomePage",
            })
        }
    },
    computed: {
        ...mapGetters([
            'getOwnerList',
            'getGuestList',
        ]),
    }
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.choosePerson{
    background-color: @bg-grey;
    position: relative;
    overflow-y: scroll;
    height: calc(100% - 60px);
    .content{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 75px;
        overflow: auto;
    }
    .typeTitle{
        font-size: 14px;
        color: @text-grey-333;
        margin: 15px;
        background-color: @bg-grey;
    }
    .personList{
        margin: 0 10px;
        li{
            background-color: @bg-white;
            overflow: hidden;
            border-radius: 5px;
            padding-bottom: 10px;
            margin-bottom: 10px;
            .title{
                background-color: #F6F6F6;
                padding: 10px;
                font-size: 12px;
                position: relative;
                .chooseIcon{
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 10px;
                    font-size: 20px;
                    color: @text-grey-CCC;
                } 
                .color-green{
                    color:@text-green;
                }
            }
            .row{
                padding: 10px;
                font-size: 12px;
                div{
                    display: inline-block;
                    width: 50%;
                    .label{
                        text-align: right;
                        color: @text-grey-BBB;
                        display: inline-block;
                        width: 85px;
                    }
                    .value{
                        color: @text-grey-333;
                    }
                }
            }
            .row_first{
                padding-top: 20px;
            }
            .cardId{
                padding: 10px;
                font-size: 12px;
                span{
                   color: @text-grey-333; 
                   &:first-of-type{
                        text-align: right;
                        color: @text-grey-BBB;
                        display: inline-block;
                        width: 85px;
                   }
                }
            }
        }
        
    }
    .btnList{
        position: absolute;
        background-color: @bg-white;
        bottom: 0;
        height: 75px;
        width: 100%;
        box-sizing: border-box;
        padding: 13px 14px;
        display: flex;
        justify-content: space-between;
        span{
            width: 165px;
            display: inline-block;
            text-align: center;
            line-height: 50px;
            border-radius: 4px;
            font-size: 16px;
        }
        .editStyle{
            color: @bg-white;
            background-color: @text-green;
        }
        .editStyle_{
            color: @text-green;
            background-color: @bg-white;
            border: 1px solid @text-green;
        }
    }
}
.dialog{
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
</style>