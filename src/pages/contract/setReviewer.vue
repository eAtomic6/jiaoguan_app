<template>
    <div class="reviewer-content">
        <p>下一审核节点无审核人，请先设置下一节点审核人</p>
        <ul class="viewer-message">
            <li @click="showPop()">
                <span>部门</span>
                <p class="gallery">
                    <span>{{param.depName}}<i class="icon iconfont iconUtubiao-11"></i></span>
                </p>
            </li>
            <li @click="showPop('emp')">
                <span>人员</span>
                <p class="gallery">
                    <span>{{param.empName}}<i class="icon iconfont iconUtubiao-11"></i></span>
                </p>
            </li>
        </ul>
        <p class="footer-btns">
            <van-button>取消</van-button>
            <van-button @click="submitPersion">确认</van-button>
        </p>
        <searchDep :state="popState" :showInput="true" :list="list" :checkProto="checkProto" :activeId="activeId" @chose="getDep" @close="popState=false" @searchList="searchDep_"></searchDep>
    </div>
</template>

<script>
import searchDep from '@/components/popList.vue';
import {mapMutations,mapGetters} from 'vuex';
/*let urlParam={
    bizCode: '',
    type:0,//0=提审,1=审核
    flowType: 3
}*/
export default {
    name: "setReviewer",
    components:{
        searchDep,
    },
    data(){
        return{
            popState:false,
            popType:'dep',
            param:{
                depId:-1,
                depName:'',
                empId:'',
                empName:''
            },
            checkType:0,
            code:'',//合同编号
            flowType:0,
            list:[],
            activeId:-1,
            checkProto:"id",
            positionId:0,  //
        }
    },
    created(){
        let urlParam=this.$route.query;
        if(urlParam.flowType&&urlParam.code){
            this.code=urlParam.code
            this.flowType=urlParam.flowType
            this.checkType=Number(urlParam.checkType)
        }
        this.searchDeps()
    },
    methods:{
        showPop:function (type='dep') {
            this.list=[]
            this.popType=type
            if(type==='dep'){
                this.checkProto="id"
                let depList=this.getDepListAll
                if(depList.length===0){
                    this.searchDeps()
                }else{
                    this.list=[].concat(depList)
                }
                if(this.list.length===0){
                    this.$toast('部门列表暂无数据')
                    return;
                }
            }else{
                this.checkProto="empId"
                if(!this.param.depId||this.param.depId===-1){
                    this.$toast('请先选择部门')
                    return;
                }else {
                    this.searchEmps()
                }
            }
            this.popState=true
        },
        getDep:function (res) {
            if(this.popType==='dep'){
                this.positionId=res.positionId
                Object.assign(this.param,{
                    depId: res.id,
                    depName: res.name,
                    empId: '',
                    empName: '',
                })
                this.activeId=res.id
            }else{
                Object.assign(this.param,{
                    empId: res.empId,
                    empName: res.name
                })
                this.activeId=res.empId
            }
            this.popState=false
        },
        //提交设置审核人
        submitPersion:function(){
            if(!this.param.empId) {
                this.$toast('请选择审核人')
                return false
            }
            let param = {
                bizCode:this.code,
                flowType:this.flowType,
                userId:this.param.empId,
                userName:this.param.empName
            }
            this.$ajax.post(this.checkType===1?'/api/machine/changeAuditorNext':'/api/machine/changeAuditorNow',param).then(res=>{
                res=res.data
                if(res.status===200){
                    //跳转合同查询首页
                    this.$router.replace({
                        path:'/contractHomePage'
                    })
                }
            }).catch(error=>{
                this.toast(error)
            })
        },
        //搜索部门/人员
        searchDep_(res){
            if(this.popType==='dep'){
                this.searchDeps(res.keyword)
            }else{
                this.searchEmps(res.keyword)
            }
            
        },
        //获取部门
        searchDeps:function (keyword='') {
            let param={
                keyword, //部门名称关键字
                type:this.checkType, //设置下一节点（或审核）为1，设置当前节点（或创建后提审）为0
                bizCode:this.code, //合同编号
                flowType:this.flowType
            }
            this.$ajax.get('/api/machine/selectDept',param).then(res=>{
                res=res.data
                if(res.status===200){
                    this.list=[].concat(res.data)
                    this.setDepList({arr:JSON.parse(JSON.stringify(res.data))})
                }
            })
        },
        //搜索人员
        searchEmps:function (keyword='') {
            let param={
                keyword,
                type:this.checkType,
                depId:this.param.depId,
                bizCode:this.code,//合同编号
                positionId:this.positionId,
                flowType:this.flowType
            }
            /*if(this.getUser.version===3){
                param.positionId=this.choseItem.grade//新加职级
            }*/
            this.$ajax.get('/api/machine/selectEmp',param).then(res=>{
                res=res.data
                if(res.status===200){
                    this.list=[].concat(res.data)
                }
            })
        },
        ...mapMutations(['setDepList'])
    },
    beforeDestroy(){
        this.setDepList({arr:[]})
    },
    computed:{
        ...mapGetters(['getDepList']),
        getDepListAll(){
            return this.getDepList
        }
    }
}
</script>

<style scoped lang="less">
@import "@/assets/common.less";
    .reviewer-content{
        height: calc(100% - 60px);
        background-color: @bg-grey;
        position: relative;
        >p{
            &:first-of-type{
                padding: 16px;
                color: @text-grey-666;
            }
        }
    }
    .viewer-message{
        >li{
            height: 60px;
            background-color: @bg-white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            margin-bottom: 10px;
            &:last-of-type{
                margin-bottom: 0;
            }
        }
    }
    p.footer-btns{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 60px;
        background-color: @bg-white;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        /deep/ .van-button{
            flex: 1;
            margin-right: 12px;
            &:last-of-type{
                margin: 0;
                background-color: @bg-green;
                color: @text-white;
            }
        }
    }
</style>
