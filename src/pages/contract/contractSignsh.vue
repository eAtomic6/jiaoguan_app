<template>
    <div class="review">
      <div class="htbody">
        <p class="review-title">合同主体</p>
        <div>
            <contract-body :isSign="isSign"></contract-body>
        </div>
      </div>
      <p class="review-title">资料库</p>
      <div class="cus">
          <!-- <p>客户</p>
          <p>客户身份证照片</p> -->
          <contractDataBase :preload='true'></contractDataBase>
          <!-- <ul>
              <li></li>
              <li></li>
          </ul> -->
          
      </div>
      <div class="reject">
          <p>驳回原因</p>
          <van-field
            v-model="bhmessage"
            rows="6"
            autosize
            type="textarea"
            maxlength="200"
            placeholder="驳回原因必填，不超过200字"
            show-word-limit
         />
     </div>
     <div class="operate">
         <van-button type="danger" @click="tochecked(2)" plain>驳回</van-button>
         <van-button @click="tochecked(1)" type="primary">通过</van-button>
     </div>
     <van-dialog v-model="rejectDialog" class="reDio" title="确认驳回" show-cancel-button confirm-button-text="确认" @confirm="toreject">
         <van-field name="checkboxGroup" >
            <template #input>
                <van-checkbox-group v-model="checkboxGroup" direction="horizontal">
                    <van-checkbox name="1" :disabled="recordType==10?true:false" shape="square">合同主体</van-checkbox>
                    <van-checkbox name="2" shape="square">资料库</van-checkbox>
                </van-checkbox-group>
            </template>
        </van-field>
     </van-dialog>
    </div>
</template>
           
<script>
import {Field,Dialog,Checkbox,CheckboxGroup} from 'vant';
import {mapGetters } from 'vuex'
import contractBody from '@/pages/contract/contractBody.vue';
import contractDataBase from '@/pages/contract/contractDataBase.vue';
export default{
    name:'contractSignsh',
    components: {
        [Field.name]: Field,
        [Dialog.Component.name]: Dialog.Component,
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]:CheckboxGroup,
        contractBody,
        contractDataBase,
    },
    data(){
        return{
            checkboxGroup:[],
            bhmessage:'',
            id:'',
            uploaderList:[],
            signId:'',
            rejectDialog:false,
            checkList:[],
            isSign:false,
            recordType:'',
            code:''
        }
    },
    methods:{
        toreject(){
            if(this.checkboxGroup.length>0){
                let param
                if(this.checkboxGroup.length==2){
                    param = {
                        id:this.signId,//签后id
                        contId:this.id,//合同id
                        remarks:this.bhmessage,//审核备注
                        state:1,//通过驳回 0通过 1驳回
                        rejectFileType:'12',//驳回类型 字符串 '1'资料库 '2'合同主体 '12'资料库和合同主体
                        contType:1//是否是委托合同 0是 1不是
                    }
                }else if(this.checkboxGroup.length==1){
                    param = {
                        id:this.signId,//签后id
                        contId:this.id,//合同id
                        remarks:this.bhmessage,//审核备注
                        state:1,//通过驳回 0通过 1驳回
                        rejectFileType:this.checkboxGroup[0]==='1'?'2':'1',//驳回类型 字符串 '1'资料库 '2'合同主体 '12'资料库和合同主体
                        contType:1//是否是委托合同 0是 1不是
                    }
                }
                this.subCheck(param,2)
            }else{
                this.$toast('驳回类型不能为空')
            }
        },
        tochecked(type){
            if(type==1){
                let param = {
                    id:this.signId,//签后id
                    contId:this.id,//合同id
                    remarks:this.bhmessage,//审核备注
                    state:0,//通过驳回 0通过 1驳回
                    contType:1//是否是委托合同 0是 1不是
                }
                this.subCheck(param)
            }else if(type==2){
                if(this.bhmessage.length>0){
                    this.checkList=["合同主体", "资料库"]
                    this.rejectDialog=true
                }else{
                    this.$toast('请填写通过/驳回原因')
                }
            }
        },
        //提交审核
        subCheck(param,pp){
            console.log(param)
            this.$ajax.post('/api/signingAudit/signinAudit',param).then(res=>{
                res=res.data
                if(res.status===200){
                    pp==2?this.$toast('合同审核驳回'):this.$toast('合同审核通过')
                    this.$router.push({
                        path:'contractHomePage'
                    })
                }
            }).catch(error=>{
                if(error.message==="下一节点审批人不存在"){
                    //弹出选择审核人弹框
                    this.$router.push({
                        path:'setReviewer',
                        query:{
                            checkType:1,
                            code:this.signId,
                            flowType:12
                        }
                    })
                }else{
                    this.$toast(error)
                }
            })
        },
    },
    created(){
        this.id=this.$route.query.id
        this.code=this.$route.query.code
        this.signId=this.$route.query.signId
        this.recordType=this.$route.query.recordType
    },
    computed: {
        ...mapGetters(['getSignRow']),
        signData() {
            return this.getSignRow
        }
    }          
}
</script>
<style lang='less' scoped>
.review{
    height: calc(100% - 60px);
    background-color: rgba(247,248,251,1);
    line-height: 25px;
    font-weight: 500;
    overflow: scroll;
    // .htbody{
    //     div:nth-child(2){
    //         div{
    //            height: 60px;
    //            box-sizing: border-box;
    //            background:rgba(255,255,255,1);  
    //            padding: 10px 15px;
    //         }
    //     }
    // }
    .reDio{
        /deep/ .van-field__control{
            justify-content: space-around!important;
        }
    }
    &-title{
        height: 40px;
        padding-left: 20px;
        color: rgba(153,153,153,1);
        line-height: 40px;
        font-size: 14px;
        
    }
    // .cus{
    //     height: 200px;
    //     background:rgba(255,255,255,1);
    //     box-shadow:0px 0px 5px 0px rgba(17,40,98,0.05);
    //     padding-left: 20px;
    //     font-size: 14px;
    //     p:nth-child(1){
    //         color:rgba(51,51,51,1);
    //         font-size: 16px;
    //     }
    //     p:nth-child(2){
    //         color:rgba(153,153,153,1);
    //     }
    //     ul:nth-child(3){
    //         list-style: none;
    //         display: flex;
    //         li{
    //             width:160px;
    //             height:120px;
    //             background:rgba(239,244,242,1);
    //             border-radius:4px;
    //             margin-right: 15px;
    //         }
    //     }
    // }
    .reject{
        margin-bottom: 75px;
        margin-top: 10px;
        height: 200px;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 5px 0px rgba(17,40,98,0.05);
        p:nth-child(1){
            padding-left: 20px;
            font-size: 16px;
            color:rgba(51,51,51,1);
        }       
    }
    .operate{
        height: 75px;
        background:rgba(255,255,255,1);
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: 14px 13px;
        display: flex;
        justify-content: space-around;
        box-sizing: border-box;
        button{
            width: 165px;
            height: 50px;
        }
    }
}           
</style>