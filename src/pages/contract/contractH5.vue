<template>
    <div class="view-container">
        <van-tabs v-if="isShowType" v-model="tabActive" @click="changeType" line-width="22px" color="#3EBA70" class="tabs">
            <van-tab title="居间合同"></van-tab>
            <van-tab title="买卖合同"></van-tab>
        </van-tabs>
        <div class="contentBox" :class="{'top_0':!isShowType}">
            <iframe :src="src1" frameborder="0" ref='iframeFirst' v-show="isActive===1"></iframe>
            <iframe :src="src2" frameborder="0" ref='iframeSecond' v-show="isActive===2"></iframe>
        </div>

        <div class="btnList">
            <span class="editStyle"  @click="isSave(1)">保存</span>
            <span class="arraignedStyle" @click="submit">提审</span>
        </div>

        <!-- 合同提审弹窗 -->
        <van-dialog v-model="submitDialog" title="确认提审？  " show-cancel-button @confirm="toSubmit">
            <div class="callDialog">请仔细核对合同内容是否有误</div>
        </van-dialog>

        <!-- loading弹层 -->
        <van-overlay :show="showLoading">
            <div class="wrapper" @click.stop>
                <van-loading size="24px" vertical color="#3EBA70">加载中...</van-loading>
            </div>
        </van-overlay>
    </div>
</template>

<script>
let emptyInput1=[]
let emptyInput2=[]
import { MIXINS } from "@/assets/js/common";
import { Overlay, Loading } from 'vant'; 

export default {
    mixins: [ MIXINS ],
    components: {
        [Overlay.name]:Overlay,  
        [Loading.name]:Loading,  
    },
    data(){
        return{
            tabActive:0,
            Msg:'',//合同信息
            htmlPath:'',//html
            isShowType:false,
            isActive: 1,
            src1:'',
            src2:'',
            html:'',
            submitDialog:false,
            showLoading:false,
            param:'',
            //权限
            power:{
                'sign-com-htdetail': {
                    state: false,
                    name: '合同详情'
                },
                'sign-ht-xq-data': {
                    state: false,
                    name: '资料库权限'
                },
                'sign-ht-info-toverify': {
                    state: false,
                    name: '提交审核'//编辑+提审
                },
                'sign-ht-xq-entrust-edit': {
                    state: false,
                    name: '委托合同'
                },
                'sign-ht-info-sverify': {
                    state: false,
                    name: '提交审核'//新增+提审
                },
            },
            iframe1State:false,
            iframe2State:false,
            http:'',
            checkPerson: {
                state:false,
                type:1,
                code:'',
                flowType:3,
                label:false
            },
        }
    },
    created(){
        this.showLoading=true
        this.Msg = JSON.parse(sessionStorage.getItem("contractMsg"));
        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }
        this.http = window.location.origin
        let dayRandomTime=new Date().getTime()
        if(this.Msg.type===1){ //租赁
            this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
        }else if(this.Msg.type===2){ //买卖
            if(this.Msg.isWuHanMM){//是否是武汉的买卖合同
                this.isShowType=true;
                this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=residence&dayRandomTime=${dayRandomTime}`//居间
                this.src2=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=business&dayRandomTime=${dayRandomTime+10}`//买卖
            }else{
                this.isShowType=false;
                this.isActive=2;
                this.src2=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=address`//买卖
            }
        }else if(this.Msg.type===3){ //代办
            this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
        }else if(this.Msg.type===4){ //意向
            this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
        }else if(this.Msg.type===5){ //定金
            this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
        }else if(this.Msg.isentrust){ //委托
            this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=entrust`
        }
    },
    mounted () {
        // this.$nextTick(()=>{
        //     let meta=document.head.querySelector(`meta[name="viewport"]`)
        //     meta.content="width=device-width,initial-scale=1.0,user-scalable=yes"
        // })

        let iframe1 = this.$refs.iframeFirst;
        let iframe2 = this.$refs.iframeSecond;
        let that = this
        if(this.Msg.type===2){
            if(this.Msg.isWuHanMM){
                iframe2.onload=function(){
                    that.iframe2State=true
                }
                iframe1.onload=function(){
                    that.iframe1State=true
                }
            }else{
                iframe2.onload=function(){
                    that.isSave(2)
                }
            }
        }else{
            iframe1.onload=function(){
                that.isSave(2)
            }
        }
    },
    methods: {
        //居间买卖切换
        changeType(val) {
            this.tabActive=val
            this.isActive = val+1;
        },
        //导航跳转
        goNav(id){
            this.navId=id;
            let iframebox=this.$refs.iframeSecond
            let navHeight = iframebox.contentWindow.document.querySelector(`#${id}`).offsetTop+5
            iframebox.contentWindow.scrollTo(0,navHeight)
        },

        //保存
        isSave(operation){
            var param={};
            var isClick=0
            if(operation===1){
                isClick=1
                this.showLoading=true
            }
            var isFull=0;//合同是否填写完整
            let iframebox1=this.$refs.iframeFirst
            let iframebox2=this.$refs.iframeSecond
            iframebox2.contentWindow.document.body.click()
            let htmlTxt1 = `<!DOCTYPE html><html lang="en">${iframebox1.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
            let htmlTxt2 = `<!DOCTYPE html><html lang="en">${iframebox2.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`

            if(this.Msg.type===2){
                iframebox2.contentWindow.document.querySelector("#submit").click()
                if(this.Msg.isWuHanMM){
                    iframebox1.contentWindow.document.querySelector("#submit").click()
                    emptyInput1 = sessionStorage.getItem("templateError")?JSON.parse(sessionStorage.getItem("templateError")):[];
                    emptyInput2 = sessionStorage.getItem("templateError1")?JSON.parse(sessionStorage.getItem("templateError1")):[];
                    param = {
                        id:this.Msg.id,
                        isClick:isClick,
                        html:{
                            residence:htmlTxt1,
                            business:htmlTxt2
                        },
                        isCanAudit:isFull//1.完整 0.否
                    }
                }else{
                    emptyInput2 = sessionStorage.getItem("templateError1")?JSON.parse(sessionStorage.getItem("templateError1")):[];
                    param = {
                        id:this.Msg.id,
                        html:{
                            address:htmlTxt2
                        },
                        isCanAudit:isFull//1.完整 0.否
                    }
                }
            }else if(this.Msg.isentrust){
                iframebox1.contentWindow.document.querySelector("#submit").click()
                emptyInput1 = sessionStorage.getItem("templateError")?JSON.parse(sessionStorage.getItem("templateError")):[];
                param = {
                    id:this.Msg.id,
                    isClick:isClick,
                    html:{
                        entrust:htmlTxt1
                    },
                    isCanAudit:isFull//1.完整 0.否
                }
            }else{
                iframebox1.contentWindow.document.querySelector("#submit").click()
                emptyInput1 = sessionStorage.getItem("templateError")?JSON.parse(sessionStorage.getItem("templateError")):[];
                param = {
                    id:this.Msg.id,
                    isClick:isClick,
                    html:{
                        address:htmlTxt1
                    },
                    isCanAudit:isFull//1.完整 0.否
                }
            }
            if(emptyInput1.length===0&&emptyInput2.length===0){
                param.isCanAudit=1
            }
            this.$ajax.postJSON('/api/contract/updateHtml', param).then(res => {
                res=res.data
                if(res.status===200){
                    this.showLoading=false
                    if(operation===1){
                        this.$toast('保存成功')
                        this.$router.push({
                            path:'/contractHomePage'
                        });
                    }else if(operation===4){
                        this.pdfUrl=`${this.http}/api/contract/generateContPdf?id=${this.Msg.id}`
                        this.haveUrl=true;
                        this.dialogSub=false
                    }
                }
            }).catch(error=>{
                this.showLoading=false
                this.$toast(error)
            })
        },

        submit(){
            let iframebox1=this.$refs.iframeFirst;
            let iframebox2=this.$refs.iframeSecond;
            if(this.Msg.type===2){
                iframebox2.contentWindow.document.querySelector("#submit").click()
                if(this.Msg.isWuHanMM){
                    iframebox1.contentWindow.document.querySelector("#submit").click()
                    emptyInput1 = sessionStorage.getItem("templateError")?JSON.parse(sessionStorage.getItem("templateError")):[];
                    emptyInput2 = sessionStorage.getItem("templateError1")?JSON.parse(sessionStorage.getItem("templateError1")):[];
                    if(this.isActive===1){
                        if(emptyInput1.length>0){
                            if(emptyInput1[0].company){
                                this.$toast('主客方门店未设置公章')
                            }else{
                                this.$toast('合同信息未填写完整')
                            }
                            let inputHeight1=0
                            if(emptyInput1[0].type){
                                let inputTag = iframebox1.contentWindow.document.querySelector(`*[extendparam=${emptyInput1[0].name}]`)
                                inputTag.classList.add("BODERRED")
                                inputHeight1 = inputTag.offsetTop
                            }else{
                                inputHeight1 = iframebox1.contentWindow.document.querySelector(`*[name=${emptyInput1[0]}]`).offsetTop
                            }
                            iframebox1.contentWindow.scrollTo(0,inputHeight1)
                        }else if(emptyInput2.length>0){
                            this.$toast('买卖合同信息未填写完整')
                        }
                    }else{
                        if(emptyInput2.length>0){
                            if(emptyInput2[0].company){
                                this.$toast('主客方门店未设置公章')
                            }else{
                                this.$toast('合同信息未填写完整')
                            }
                            let inputHeight2=0
                            if(emptyInput2[0].type){
                                let inputTag = iframebox2.contentWindow.document.querySelector(`*[extendparam=${emptyInput2[0].name}]`)
                                inputTag.classList.add("BODERRED")
                                inputHeight2 = inputTag.offsetTop
                            }else{
                                inputHeight2 = iframebox2.contentWindow.document.querySelector(`*[name=${emptyInput2[0]}]`).offsetTop
                            }
                            iframebox2.contentWindow.scrollTo(0,inputHeight2)
                        }else if(emptyInput1.length>0){
                            this.$toast('居间合同信息未填写完整')
                        }
                    }
                }else{//非武汉买卖
                    emptyInput2 = sessionStorage.getItem("templateError1")?JSON.parse(sessionStorage.getItem("templateError1")):[];
                    if(emptyInput2.length>0){
                        if(emptyInput2[0].company){
                            this.$toast('主客方门店未设置公章')
                        }else{
                            this.$toast('合同信息未填写完整')
                        }
                        let inputHeight2=0
                        if(emptyInput2[0].type){
                            let inputTag = iframebox2.contentWindow.document.querySelector(`*[extendparam=${emptyInput2[0].name}]`)
                            inputTag.classList.add("BODERRED")
                            inputHeight2 = inputTag.offsetTop
                        }else{
                            inputHeight2 = iframebox2.contentWindow.document.querySelector(`*[name=${emptyInput2[0]}]`).offsetTop
                        }
                        iframebox2.contentWindow.scrollTo(0,inputHeight2)
                    }
                }
            }else{
                iframebox1.contentWindow.document.querySelector("#submit").click()
                emptyInput1 = sessionStorage.getItem("templateError")?JSON.parse(sessionStorage.getItem("templateError")):[];
                if(emptyInput1.length>0){
                    if(emptyInput1[0].company){
                        this.$toast('主客方门店未设置公章')
                    }else{
                        this.$toast('合同信息未填写完整')
                    }
                    let inputHeight1=0
                    if(emptyInput1[0].type){
                        let inputTag = iframebox1.contentWindow.document.querySelector(`*[extendparam=${emptyInput1[0].name}]`)
                        inputTag.classList.add("BODERRED")
                        if(inputTag.offsetParent.tagName==="TD"){
                            inputHeight1=inputTag.offsetParent.offsetTop + inputTag.offsetParent.offsetParent.offsetTop
                        }else{
                            inputHeight1 = inputTag.offsetTop
                        }
                    }else{
                        inputHeight1 = iframebox1.contentWindow.document.querySelector(`*[name=${emptyInput1[0]}]`).offsetTop
                    }
                    iframebox1.contentWindow.scrollTo(0,inputHeight1)
                }
            }
            if(emptyInput1.length===0&&emptyInput2.length===0){
                let htmlTxt1=''
                let htmlTxt2=''
                let param = {}
                if(this.Msg.type===2){
                    htmlTxt1 = `<!DOCTYPE html><html lang="en">${iframebox1.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
                    htmlTxt2 = `<!DOCTYPE html><html lang="en">${iframebox2.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
                    if(this.Msg.isWuHanMM){
                        param = {
                            cityId:this.Msg.cityId,
                            bizCode:this.Msg.code,
                            id:this.Msg.id,
                            html:{
                                residence:htmlTxt1,
                                business:htmlTxt2
                            }
                        }
                    }else{
                        param = {
                            cityId:this.Msg.cityId,
                            bizCode:this.Msg.code,
                            id:this.Msg.id,
                            html:{
                                address:htmlTxt2
                            }
                        }
                    }
                }else{
                    htmlTxt1 = `<!DOCTYPE html><html lang="en">${iframebox1.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
                    param = {
                        cityId:this.Msg.cityId,
                        bizCode:this.Msg.code,
                        id:this.Msg.id,
                    }
                    if(this.Msg.isentrust){
                        param.html = {
                            entrust:htmlTxt1
                        }
                    }else{
                        param.html = {
                            address:htmlTxt1
                        }
                    }
                }
                this.param = param;
                this.submitDialog=true
            }
        },

        //确定提审
        toSubmit(){
            this.showLoading=true
            this.$ajax.postJSON('/api/contract/updateContractAudit', this.param).then(res => {
                res=res.data
                if(res.status===200){
                    this.submitDialog=false
                    this.showLoading=false
                    this.$toast('提审成功')
                    this.$router.push({
                        path:'/contractHomePage'
                    });
                }
            }).catch(error=>{
                this.showLoading=false
                if(error.message==='下一节点审批人不存在'){
                    // this.checkPerson.code=this.Msg.code;
                    // this.checkPerson.state=true;
                    // this.checkPerson.label=true;
                    // if(this.Msg.isentrust){
                    //     this.checkPerson.flowType=11;
                    // }
                    this.$router.push({
                        path:'setReviewer',
                        query:{
                            code:this.Msg.code,
                            flowType:3,
                            checkType:0,
                        }
                    })
                }else{
                    this.$toast(error)
                }
            })
        },

        //获取自定义勾选框选中状态
        getCheckState(ele){
            return	!!(ele.querySelector('p').getAttribute('checked'))
        },
    },
    computed:{
        iframeState:function(){
            return this.iframe1State&&this.iframe2State
        },
        getUserMsg(){
            return this.getUser.user
        }
    },
    watch:{
        iframeState:function(val){
            if(val){
                this.isSave(3)
            }
        }
    },
    // beforeDestroy () {
    //     this.$nextTick(()=>{
    //         let meta=document.head.querySelector(`meta[name="viewport"]`)
    //         meta.content="width=device-width,initial-scale=1.0,user-scalable=no"
    //     })
    // }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.view-container{
    position: relative;
    height: calc(100% - 60px);
    overflow-y: scroll;
    .contentBox{
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 76px;
        overflow: auto;
        iframe{
            width: 870px;
            height: calc(100%);
        }
    }
    .top_0{
        top: 0;
    }
    .btnList{
        position: absolute;
        background-color: @bg-white;
        bottom: 0;
        height: 76px;
        width: 100%;
        box-sizing: border-box;
        text-align: center;
        padding: 13px 14px;
        display: flex;
        span{
            flex-grow: 1;
            display: inline-block;
            line-height: 50px;
            border-radius: 4px;
            font-size: 16px;
        }
        .editStyle{
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
.van-overlay{
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
