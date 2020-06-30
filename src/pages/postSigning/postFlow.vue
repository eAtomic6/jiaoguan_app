<template>
    <div class="postFlow">
        <div class="post-herder">
            <p>交易流程：</p>
             <van-field
                v-model="currentFlow"
                readonly
                right-icon="arrow"
                placeholder="请选择"
                @click="showdig"
                class="van-hairline--bottom"
           />
        </div>
        <div class="post-body">
            <p>交易步骤：</p>
            <ul>
                <li v-for="item in currentStep" :key="item.id" class="van-hairline--bottom">{{item.transactionSteps}}</li>
            </ul>
        </div>
        <div class="btn-sure">
            <span @click="sureFn">确认</span>
        </div>
        <van-popup v-model="showFlow" position="bottom" :close-on-click-overlay=true :style="{ height: '70%' }" >
            <div class="flow-title">
                <span>请选择交易流程</span>
                <i class="iconfont iconguanbi" @click="showFlow=false"></i>
            </div>
            <ul class="flowlist">
                <li v-for="(item,index) in flowList" :key="item.id" @click.stop="selflow(item.id,index)" class="van-hairline--bottom"><span>{{item.name}}</span><span class="active" v-if="flowId===item.id"><i class="icon iconfont iconUtubiao-12"></i></span></li>
            </ul>
        </van-popup>
    </div>
</template>

<script>
import {Field,Popup } from 'vant';
import { postMixin } from '@/assets/js/postMixin';

export default {
    name: 'post-flow',
    mixins: [postMixin],
    components: {
        [Field.name]: Field,
        [Popup.name]: Popup,
    },
    data() {
        return{
            currentFlow:'',
            copyCurrentFlow:'',
            currentStep:[],
            flowList:[],
            showFlow:false,
            isActive:'',
            id: '',
            flowId:'',
        }
    },
    created(){
        this.id = this.$route.query.id
        this.getTransactionProcess()
    },
    methods:{
        getTransactionProcess(){
            this.$ajax.post('/api/flowmanage/selectFlowPageList',{
                cityId: this.cityId
            }).then(res=>{
                res = res.data
                if (res.status === 200) {
                    this.flowList=res.data
                }
            })
        },
        getPostflow(){
            let param={
                id: this.id   
            }
            this.$ajax.get('/api/postSigning/getStepList', param).then(res => {
                res=res.data
                if(res.status==200){
                    this.currentStep=res.data.instances
                    this.flowId = res.data.transFlowCode
                    this.flowList.find(item => {
                        if(item.id === res.data.transFlowCode) {
                            this.currentFlow = item.name
                            this.copyCurrentFlow = item.name
                        }
                    })
                }
            })
        },
        showdig(){
            this.showFlow=true
        },
        selflow(id,index){
            this.isActive=index
            this.$ajax.post('/api/flowmanage/selectFlowStepsList',{
                flowId:id
            }).then(res=>{
                res = res.data;
                if(res.status === 200){
                    this.currentStep=res.data
                    this.currentStep.forEach(v=>{
                        v.transactionSteps=v.stepsName
                        this.flowList.forEach(v2=>{
                            if(v2.id==v.transFlowId){
                                this.currentFlow=v2.name
                                this.flowId=v2.id
                            }
                        })
                        
                    })
                    this.showFlow=false
                }
            })
        },
        sureFn() {
            if(this.currentFlow===this.copyCurrentFlow){
                this.$router.go(-1)
            } else {
                this.$ajax.post('/api/postSigning/updateTransFlow',{
                    contractCode:this.id,
                    transFlowCode:this.flowId,
                }).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        this.$toast('交易流程修改成功~')
                        this.$router.go(-1)
                    }
                }).catch(err=>{
                    this.$toast(err)
                })
            }
        }
    },
    computed: {
        cityId() {
            return this.getUserMsg.user.cityId
        }
    },
    watch: {
        flowList(val) {
            if(val.length) {
                this.getPostflow()
            }
        }
    }
}
</script>

<style scoped lang="less">
@import "~@/assets/common.less";

.postFlow{
    padding: 20px 18px;
    box-sizing: border-box;
    height: calc(100% - 60px);
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    p:nth-child(1){
        font-weight:500;
        color:rgba(51,51,51,1);
        font-size: 16px;
    }
    .flowlist{
        padding-left: 15px;
        li{
            height: 50px;
            line-height: 50px;
            display: flex;
            span:first-of-type{
                flex: 11;
            }
            span:last-of-type{
                flex: 1;
            }
            .active{
                >i{
                    font-size: 20px;
                }
            }
            .active{
                color: @text-green;
            }
        }
    }
    .flow-title {
        display: flex;
        justify-content: center;
        padding: 10px;
        position: relative;
        i {
            position: absolute;
            right: 10px;
            top: 10px;
            font-size: 20px;
        }
    }
    .post-herder{
        /deep/ .van-cell{
            margin-top: 5px;
            padding-left: 0!important;
        }
    }
    .post-body{
        margin-top: 20px;
        p:nth-child(1){
            font-weight:500;
            color:rgba(51,51,51,1);
            font-size: 16px;
        }
        ul{
            li{
                height: 50px;
                line-height: 50px;
            }
        }
    }
    .btn-sure {
        position: absolute;
        top: 20px;
        right: 12px;
        color: @text-green;
    }
}
</style>