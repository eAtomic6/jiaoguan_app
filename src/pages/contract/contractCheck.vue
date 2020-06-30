<template>
    <div class="htreview" ref="maindetails">
        <ul class="tabList" v-if="showTab">
            <li v-for="(item,index) in tab" :key="index" @click="changeTab(index)" :class="isActive===index?'actived':''">{{item}}</li>
        </ul>  
        <div class="yulan">
            <div class="content">
                <div class="signaturewrap">
                    <img v-for="(item,index) in src" :key="index" :src="item" alt="">
                </div>
            </div>
        </div>
        <van-button type="primary" @click="sh">审核</van-button>
        <van-dialog v-model="rejectDialog"  class="opdialog" title="合同审核" show-cancel-button  cancel-button-text="驳回" confirm-button-text="通过" @cancel="operate(2)" @confirm="operate(1)">
            <p>驳回原因</p>
            <van-field
                v-model="message"
                rows="3"
                autosize
                type="textarea"
                maxlength="200"
                placeholder="请填写驳回原因，不超过200字"
                show-word-limit
            />
        </van-dialog>
    </div>
</template>
           
<script>
import { mapGetters } from "vuex";
import {Field} from 'vant';
export default{
    components: {
        [Field.name]: Field,
    },
    data(){
        return{
            code:'',
            rejectDialog:false,
            message:'',
            id:'',
            src:'',
            isActive:0,//默认选中tab1
            showAddress:'',
            total_r:0,
            total_b:0,
            showTab:false,
            tab:['买卖合同','居间合同'],
            business:'',
            residence:'',

        }
    },
    created(){
        this.code=this.$route.query.code
        this.id=this.$route.query.id
        this.getContImg()
        this.watermark()
    },
    methods:{
        watermark() {
            this.$nextTick(() => {
                this.$tool.waterMark(
                    `${this.getUserMsg.user.depName}${this.getUserMsg.user.name}${this.getUserMsg.user.mobile}`,
                    this.$refs.maindetails,
                    false,
                    60
                );
            });
        },
        operate(type){
            let param = {
                bizCode:this.code,
                flowType:3,
                modularType:0,//合同类型
                approvalForm:{
                    result: type,
                    remark: this.message
                }
            }
            if(type==2){
                this.message=this.message.replace(/\s/g,"");
                if(this.message.length>0){
                    this.toChecked(param);
                }else{
                    this.$toast('请填写审核原因')
                }
            }else if(type==1){
                this.toChecked(param)
            }

        },
        changeTab(val){
            this.isActive=val
            if(val===0){
                this.showAddress=this.business;
                this.setSrc(this.showAddress,this.total_b);
            }else if(val==1){
                this.showAddress=this.residence;
                this.setSrc(this.showAddress,this.total_r);
            }
        },
        //获取合同预览图片
        getContImg(){
            let param = {
                id:this.id,
                // isentrust:this.isentrust
            };
            this.$ajax.get('/api/contract/preview', param).then(res=>{
                res=res.data
                if(res.status===200){
                    if(res.data.isWuHanMM===1&&(res.data.contType.value===2)){
                        this.showTab=true
                        this.total_r=res.data.imgCount.residence;
                        this.total_b=res.data.imgCount.business;
                        this.business=res.data.imgAddress.business;
                        this.residence=res.data.imgAddress.residence;
                        this.showAddress=res.data.imgAddress.business;
                        this.setSrc(this.showAddress,res.data.imgCount.residence);
                    }else{
                        this.showAddress=res.data.imgAddress.address;
                        this.setSrc(this.showAddress,res.data.imgCount.count);
                    }
                }
            })
        },
        //拼接地址
        setSrc(value,count){
            var arrSrc = [];
            for(let i=1;i<=count;i++){
                let src = value.substr(0,value.lastIndexOf('.'))+i+value.substr(value.lastIndexOf('.'));
                arrSrc.push(src);
            }
            let param = {
                urls:arrSrc.join(',')
            }
            this.$ajax.put("/api/load/generateAccessURLBatch",param,2).then(res=>{
                res = res.data
                if(res.status ===200){
                    this.src = res.data;
                }
            })
        },
        toChecked(param){
            let param_ = {
                id:this.id
            }
            //验证此合同是否正在编辑
            this.$ajax.get("/api/contract/audit",param_).then(res=>{
                res=res.data
                if(res.status===200){
                    this.$ajax.postJSON('/api/machine/audit', param).then(res=>{
                        res=res.data
                        if(res.status===200){
                            this.rejectDialog=false;
                            this.$toast('审核成功')
                            this.$router.push({
                                path:'contractHomePage'
                            })
                        }
                    }).catch(error => {
                        if(error.message==='下一节点审批人不存在'){
                            //弹出选择审核人弹框
                            this.$router.push({
                                path:'setReviewer',
                                query:{
                                    checkType:1,
                                    code:this.code,
                                    flowType:3
                                }
                            })
                        }else{
                            this.$toast(error)
                        }
                    })
                }
            }).catch(error =>{
                this.$toast(error)
            })
        },
        sh(){
            let param={
                id:this.id
            }
            this.rejectDialog=true;
        }
    },
    computed:{
        ...mapGetters(["getUserMsg"]),
    }
}
</script>
<style lang="less" scoped>
@import "~@/assets/common.less";
.yulan{
    padding: 0 5px;
    margin-top: 40px;
    box-sizing: border-box;
    margin-bottom: 50px;
    .content{
        .signaturewrap{
            img{
                width: 100%;
            }
        }
    }
}
.tabList{
    background-color: white;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    display: flex;
    border-bottom: 1px solid @bg-grey;
    li{
        flex-grow: 1;
        text-align: center;
        font-size: 16px;
        padding: 10px 0;
        position: relative;
        overflow-y: hidden;
        &::before{
            content: '';
            display: inline-block;
            width: 22px;
            transition-duration: 0.3s;
            background-color: @text-green;
            border-radius: 1px;
            position: absolute;
            bottom: -10px;
            left: 0;
            z-index: 1;
            height: 3px;
        }
    }
    .actived{
        font-weight: bold;
        &::before{
            bottom:0px;
            transform: translateX(93.5px) translateX(-50%);
        }
    }
    .tabs_line{
        width: 22px;
        transform: translateX(93.5px) translateX(-50%);
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
.htreview{
    padding: 0px 7px;
    box-sizing: border-box;
    height: calc(100% - 60px);
    position: relative;
    overflow: scroll;
    button{
        height: 50px;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
    }
    .opdialog{
        p{
            margin-left: 14px;
        }
        /deep/ button:nth-child(1){
            color:rgba(255,59,48,1);
        }
    }
}
</style>