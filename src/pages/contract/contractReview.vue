<template>
    <div class="review-detail">
        <van-tabs v-model="isActive" @click="changeTab" line-width="22px" color="#3EBA70" class="tabs">
            <van-tab :name="1" title="审核详情"></van-tab>
            <van-tab :name="2" title="审核记录"></van-tab>
        </van-tabs>
        <!-- 审核详情 -->
        <div class="mainPart" v-if="isActive===1">
            <review-detail :detailList="contractDetail"  :contType="contType" :reviewType='pageType' v-if="flag"></review-detail>
        </div>
        <!-- 审核记录 -->
        <div class="mainPart" v-if="isActive===2" ref="maindetails">
            <reviewList :contCode="code" :signingId="contractDetail.id" :reviewType='pageType'></reviewList>
        </div>
    </div>
</template>
           
<script>
import reviewDetail from '@/components/reviewDetail'
import reviewList from '@/components/reviewList'
export default{
    name:'contractView',
    components:{
        reviewDetail,
        reviewList,
    },
    data(){
        return {
            contractDetail:'',
            flag:false,
            code:'',
            pageType:'',
            contType:'',
            dictionary:{
                '507':''
            },
            isActive:1,
        }
    },
    methods:{
        getDictionaryIds(obj) {
            let arr = []
            for (let item in obj) {
                arr.push(item)
            }
            return arr.join(',')

        },
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
        transmoney(){
            if(this.contType==1){
                for(let key in this.contractDetail){
                    if(key=='timeUnit'){
                        for(let i=0;i<this.dictionary['507'].length;i++){
                            if(this.dictionary['507'][i].key==this.contractDetail[key]){
                                if(this.pageType=="auditList"){
                                    this.contractDetail['dealPrice']=`${this.contractDetail['dealPrice']}元/${this.dictionary['507'][i].value}`
                                }else{
                                    this.contractDetail['price']=`${this.contractDetail['price']}元/${this.dictionary['507'][i].value}`
                                }
                                console.log(this.contractDetail['dealPrice']);
                            }
                        }
                    }
                }
            }else {
                if(this.pageType=="auditList"){
                    this.contractDetail['dealPrice']=this.contractDetail['dealPrice']+'元'
                }else {
                    this.contractDetail['price']=this.contractDetail['price']+'元'
                }
            }
        },
        getList(pageType="auditList"){
            if(pageType=='auditList'){
                let param={
                    isCheckList:1,
                    keyword:this.code,
                    pageNum:1,
                    pageSize:10
                }
                this.$ajax.postJSON('/api/contract/auditList',param).then(res=>{
                    res=res.data
                    if(res.status==200){
                        this.flag=true
                        this.contractDetail=res.data.list[0]
                        this.transmoney()
                        
                    }
                })
            }else if(pageType=='getlist'){
                let param={
                    keyword:this.code,
                    pageNum:1,
                    pageSize:10,
                    contTypes:'',
                    empId:''
                }
                this.$ajax.get('/api/signingAudit/getlist',param).then(res=>{
                    res=res.data
                    if(res.status==200){
                        this.flag=true
                        this.contractDetail=res.data.list[0]
                        this.transmoney()
                    }
                })
            }
        },
        //tab栏切换
        changeTab(val){
            if(document.querySelector("#watermark")){
                document.querySelector("#watermark").remove()
            }
            this.isActive=val
        },
    },
    created(){
        this.code=this.$route.query.keyword
        this.pageType=this.$route.query.pageType
        this.contType=Number(this.$route.query.contType)
        this.getDictionary()
        this.getList(this.pageType)
    },
}
</script>
<style lang="less" scoped>
@import "~@/assets/common.less";
.review-detail{
    position: relative;
    background-color: @bg-grey;
    height: calc(100%);
    overflow-y: scroll;
    -webkit-overflow-scrolling:touch;
    .mainPart{
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
    }
}
           
</style>