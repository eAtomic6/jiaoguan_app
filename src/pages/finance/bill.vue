<template>
    <div class="finance-context" :class="{'bg-white':list.length===0,'no-bottom':isSearch}">
        <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh" v-if="list.length>0">
            <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    error-text="请求失败，点击重新加载"
                    @load="onLoad()">
                <van-cell v-for="item in list" :key="item.id" @click="toDetail(item)">
                    <div class="bill-card">
                        <ul>
                            <li>
                                <p>收付 ID {{item.payCode}}</p>
                            </li>
                            <li><span>合同类型：</span>{{item.contType}}</li>
                            <li><span>合同编号：</span>{{item.contCode}}</li>
                            <li><span>签约方式：</span> {{item.recordType|getLabel}}</li>
                            <li><span>款类：</span>{{item.moneyType}}</li>
                            <li><span>对象：</span>{{item.outObjType|getLabel}}</li>
                            <li><span>收款人：</span>{{item.inObjStore}}-{{item.inObjName}}</li>
                            <li><span>金额（元）：</span>{{item.amount}}</li>
                            <li><span>创建时间：</span>{{item.createTime|formatTime(true)}}</li>
                            <li><span>到账时间：</span>{{item.toAccountTime|formatTime(true)}}</li>
                            <li v-if="item.payStatus"><span>收款状态：</span><span :class="[{'color-red':item.payStatus.value===4},{'color-green':item.payStatus.value===5}]">{{item.payStatus|getLabel}}</span></li>
                        </ul>
                        <p class="opera-btn van-hairline--top" v-if="item.payStatus&&item.payStatus.value===4&&power['sign-cw-rev-update']">
                            <van-button @click.stop="toupdate(item)">编辑</van-button>
                        </p>
                    </div>
                    <div class="detail-icon">
                        <i class="iconfont iconUtubiao-11"></i>
                    </div>
                </van-cell>
            </van-list>
        </van-pull-refresh>
        <div v-if="!haveRequest&&powerFlag" class="listLoading" >
            <van-loading type="spinner" color="#3EBA70"  />
        </div>
        <div class="no-data" v-if="showData">
            <img :src="noData" alt="">
            <p>暂无数据</p>
        </div>
        <div class="no-data" v-if="!powerFlag">
            <img :src="getImgUrl('no_power.png')" alt="">
            <p>暂无权限，去配置吧～</p>
        </div>
    </div>
</template>

<script>
import {List,PullRefresh,Loading} from 'vant';
import {mapMutations,mapGetters} from 'vuex';
export default {
    name: "bill",
    components:{
        [List.name]:List,
        [PullRefresh.name]:PullRefresh,
        [Loading.name]:Loading,
    },
    props:{
        search:{
            type:Boolean,
            default:false
        },
        keyword:{
            type:String,
            default: ''
        }
    },
    data(){
        return{
            src:'/payInfo/selectPayInfoList',
            parameters:{
                keyword: '',
                startTime:'',
                endTime:'',
                contTypes:'',
                billStatus:'',
                payObjType:'',
                moneyType:'',
                deptId:''

            },
            list:[],
            pageNum:1,
            noData:require('@/assets/img/no_data.png'),
            refreshing:false,
            loading:false,
            finished:false,
            haveRequest:false,//发起过请求
            timer:null,//定时器,
            showData:false,
            powerFlag:false, //列表查询权限
        }
    },
    created(){
        this.onRefresh()
        this.setEntry({
            pageType:'getBill',
            activeTab:0,
            url:this.$route.path
        })
    },
    mounted(){
        var that=this
        this.$EventBus.$on('getSearchBar',function (res) {
            console.log(res);
            that.parameters.startTime=res.signTime.startTime
            that.parameters.endTime=res.signTime.endTime
            if(that.parameters.startTime||that.parameters.endTime){
                that.parameters.timeType=4
            }else{
                that.parameters.timeType=''
            }
            that.parameters.contTypes=res.choseResult['10'].key
            that.parameters.checkStatus=res.choseResult['23'].key
            that.parameters.payObjType=res.choseResult['57'].key
            that.parameters.moneyType=res.otherParam.billId
            that.parameters.deptId=res.otherParam.depId
            console.log( this.parameters);
            that.onRefresh()
        })
    },
    methods:{
        ...mapMutations([
            'setBillRow',
        ]),
        getImgUrl:function(url){
            return require('@/assets/img/'+url);
        },
        getList(){
            if(this.timer) clearTimeout(this.timer)
            this.timer=setTimeout(()=>{
                this.haveRequest=true
            },1000)
            let param=Object.assign({},this.parameters,{pageNum:this.pageNum,pageSize:10,type:1,recordType:10})
            this.$ajax.get(`/api${this.src}`,param).then(res=>{
                res=res.data
                if(res.status===200){
                    this.loading=false
                    let result=res.data.page
                    this.list=this.list.concat(result.list)
                    if(this.list.length>0){
                        this.showData=false
                    }else{
                        this.showData=true
                    }
                    let total=result.total
                    if(this.list.length>=total){
                        this.finished=true
                    }
                }
            })
        },
        toupdate(item){
            this.$router.push({
                path:'billCreate',
                query:{
                    contId:item.contId,
                    depId:item.depId,
                    id:item.id,
                    type:'2',
                    title:'编辑收款'
                }
            })
        },
        toDetail:function(item){
            if(this.power["sign-cw-debt-rev"].state){
                this.$router.push({
                    path:'/billDatails',
                    query:{
                        id:item.id,
                        payway:item.payway.value
                    }
                })
            }else {
                this.$toast('无详情权限')
            }
        },
        //合同列表上拉加载
        onLoad(type='load'){
            if (this.refreshing) {
                this.list = [];
                this.refreshing = false;
            }
            if(type==='load'){
                this.pageNum+=1
            }
            this.getList()
        },
        //合同列表下拉刷新
        onRefresh() {
            this.powerFlag = false
            if(this.power[`sign-cw-debt-query`].state) {
                this.powerFlag = true
            }
            if(!this.powerFlag) {
                this.contList = []
                return false
            }
            this.refreshing=true
            // 清空列表数据
            this.finished = false;

            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading = true;
            this.pageNum=1
            this.onLoad('refresh');
        },
        ...mapMutations(['setEntry'])
    },
    computed:{
        isSearch:function () {
            return this.search
        },
        power() {
            return this.getPowerCode
        },
        ...mapGetters(['getPowerCode'])
    },
    watch:{
        keyword:function (val) {
            this.parameters.keyword=val
            this.onRefresh()
        }
    },
    filters:{
        getLabel:function (val) {
            return val.label||''
        }
    }
}
</script>

<style scoped lang="less">
@import "@/assets/common.less";
.detail-icon {
    position: absolute;
    right: 10px;
    top: 30%;
    color: @text-grey-BBB;
}
.finance-context{
    height: calc(100% - 60px);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: @bg-grey;
    padding: 0 10px;
    position: relative;
    &.no-bottom{
        height: 100%;
    }
    .onRefresh{
        position: absolute;
        right: 10px;
    }
    &.bg-white{
        background-color: @bg-white;
    }
    /deep/ .van-cell{
        margin: 10px 0;
        padding: 0;
    }
}
    .bill-card{
        background-color: @bg-white;
        >ul{
            padding: 14px 15px;
            li{
                height: 14px;
                padding: 5px 0;
                span:first-child{
                    color:#999999;
                }
                &:first-of-type{
                    font-weight: bold;
                    font-size: @font-16;
                }
                &:last-of-type{
                    margin-bottom: 0;
                    >span{
                        &.color-red{
                            color: @text-red;
                        }
                        &.color-green{
                            color: @text-green;
                        }
                    }
                }
            }
        }
        >p:first-of-type{
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0 10px;
            /deep/ .van-button{
                background-color: @bg-green;
                color: @text-white;
                border-radius: 2px;
                width: 80px;
                height: 30px;
                border-radius: 2px;
            }
        }
    }
    .listLoading{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 60px;
        background-color: rgba(225, 225, 225, 225);
        z-index: 999;
        /deep/.van-loading{
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%);
        }
    }
    .no-data{
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
</style>
