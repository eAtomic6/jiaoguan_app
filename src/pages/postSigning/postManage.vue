<template>
    <div class="view-container post-manage">
        <van-tabs v-model="activeTab" line-width="22px" color="#3EBA70">
            <van-tab v-for="tab in tabs" :key="tab" :title="tab"></van-tab>
        </van-tabs>
        <div v-show="activeTab === 0" class="content">
            <post-detail></post-detail>
        </div>
        <div v-if="activeTab === 1" class="content content-record">
            <div class="rocord" v-show="showRecord" v-for="(item,index) in GJRrcord" :key=index>
               <p class="van-hairline--bottom">
                <i class="icon iconfont iconjiaobiao"></i>{{item.transactionSteps}}
               </p>
               <div class="detail">
                <p><span>跟进人：</span><span>{{item.reportingtor}}</span></p>
                <p><span>跟进时间：</span><span>{{item.reportingDate | formatDate}}</span></p>
                <p><span>跟进日志：</span><span>{{item.reportingRemake}}</span></p>
               </div> 
            </div>
            <div v-show="!showRecord" class="norecard">
                <img :src="getImgUrl('no_data.png')" alt="">
                <p>暂无数据</p>
            </div>
        </div>
        <div v-if="activeTab === 2" class="content">
            <recordList :code="code"></recordList>
        </div>
    </div>
</template>

<script>
import postDetail from './postDetail'
import recordList from "@/components/recordList"

export default {
    name: 'post-manage',
    components: {
        postDetail,
        recordList
    },
    data() {
        return {
            activeTab: '',
            tabs: ['后期详情','跟进记录','回访录音'],
            GJRrcord:[],
            showRecord:true,
            id: '',
            code:''
        }
    },
    created(){
        this.id=this.$route.query.id
        this.code=this.$route.query.code
        this.getList()
    },
    methods: {
        getImgUrl:function(url){
            return require('@/assets/img/'+url);
        },
        getList(){
            let param={
                id:this.id
            }
            this.$ajax.get('/api/postSigning/getStepReportings',param).then(res=>{
                res=res.data
                if(res.status==200){
                    if(res.data.length==0){
                        this.showRecord=false
                    }else{
                        let arr = [...res.data]
                        arr.forEach(item => {
                            item.stepReportings.forEach(tip => {
                                tip.transactionSteps = item.transactionSteps
                                this.GJRrcord.push(tip)
                            })
                        })
                    }
                }
            })
        }
    }
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

/deep/ .van-tab__text {
    font-size: 16px;
}
.norecard{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    >img{
        width: 200px;
    }
    >p{
        text-align: center;
        color: @text-grey-999;
        margin-top: 20px;
    }
}
.content {
    position: absolute;
    top: 105px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}
.content-record {
    background-color: @bg-grey;
    padding: 0 10px;
}
.rocord{
    border-radius: 4px;
    margin-top: 10px;
    > p:nth-child(1){
        background-color: white;
        height: 45px;
        font-size: 16px;
        i{
            color: @text-green;
            font-size: 20px;
            line-height: 45px;
            position: relative;
            top:2.5px;
            margin-right: 2px;            
        }
    }
    .detail{
        background-color: white;
        padding: 20px 10px;
        box-sizing: border-box;
        font-size: 14px;
        p{
            line-height: 30px;
            display: flex;
            align-items: baseline;
            span:nth-child(1){
                font-weight:500;
                color:rgba(153,153,153,1);
                width: 75px;
                margin-right: 5px;
                text-align: right;
            }
            span:nth-child(2){
                max-width: 70%;
                color:rgba(51,51,51,1);
            }
        }
    }
}
/deep/ .view-box {
    height: 100%;
}
</style>
