<template>
    <div class="chooseGuest">
        <searchBar :placeholder='toast' :initVal="guestKeyword" @toSearch="search" @onFocus="toShow"></searchBar>
        <history v-show="showHistory" @history="getHistoty"></history>
        <div v-show="!showHistory">
            <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh" v-if="list.length>0">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    :error.sync="error"
                    error-text="请求失败，点击重新加载"
                    :offset="60"
                    @load="onLoad">
                    <van-cell v-for="item in list" :key="item.InquiryCode" @click="confirm(item)">
                        <div class="label">
                            <van-icon v-if="choseId===item.InquiryCode" name="checked" class="chooseIcon color-green" />
                            <van-icon v-else name="passed" class="chooseIcon" />
                            
                            <div class="left_l">
                                <span>姓名：</span>
                                <span>{{item.CustName}}</span>
                            </div>
                            <div class="right_l">
                                <span>客源编号：</span>
                                <span>{{item.InquiryNo}}</span>
                            </div>
                        </div>
                        <div class="label">
                            <div class="left_l">
                                <span>交易：</span>
                                <span>{{item.Trade}}</span>
                            </div>
                            <div class="right_l">
                                <span>{{guestType===1?"租价":guestType===2?"售价":"租/售价"}}：</span>
                                <span v-if="item.PriceMin||item.PriceMax">{{item.PriceMin}}{{Number(item.PriceMax)?"-"+ item.PriceMax:""}}{{item.Trade==='求租'?'元':'万元'}}{{Number(item.PriceMax)?"":"以上"}}</span>
                                <span v-else>--</span>
                            </div>
                        </div>
                        <div class="footerLabel">
                            <span>意向区域：</span>
                            <span class="van-multi-ellipsis--l2">{{item.DistrictName?item.DistrictName:'-'}}</span>
                        </div>
                        <div class="footerLabel">
                            <span>维护人：</span>
                            <span class="van-multi-ellipsis--l2">{{item.DeptName+'-'+item.EmpName}}</span>
                        </div>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
            <div class="no-data" v-if="list.length===0&&haveRequest">
                <img :src="getImgUrl('no_data.png')" alt="">
                <p>暂无数据</p>
            </div>
            <div v-if="!haveRequest" class="listLoading" >
                <van-loading type="spinner" color="#3EBA70"  />
            </div>
        </div>

    </div>
</template>
           
<script>
import {mapMutations,mapGetters} from 'vuex'
import {List,PullRefresh,Loading } from 'vant';
import searchBar from '@/components/searchBar.vue';
import history from "@/pages/search/history";
export default{
    components:{
        [List.name]:List,
        [PullRefresh.name]:PullRefresh,
        [Loading.name]:Loading,
        searchBar,
        history
    },  
    data(){
        return{
            toast:'客源编号/手机号/客户姓名',
            loading:false,//上拉加载
            finished:false,
            refreshing:false,//下拉刷新
            error:false,//加载失败
            list:[],
            guestKeyword:'',
            pageSize:10,
            pageNum:1,
            total:0,
            choseId:'',//选中的客源编号
            guestType:'',//1 出租  2 出售  空 全部

            timer:'',
            haveRequest:false,
            showHistory:false,
        }
    },
    created () {
        this.choseId=this.$route.query.id
        this.guestType=this.$route.query.type
        this.onRefresh()
        
    },
    methods: {
        getImgUrl(url){
            return require('@/assets/img/'+url);
        },
        // 搜索
        search(val){
            this.showHistory=false
            this.guestKeyword=val.keyword
            this.onRefresh()
        },
        toShow(){
            this.showHistory=true
        },
        //上拉加载
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
        //下拉刷新
        onRefresh(){
            this.haveRequest=false
            this.refreshing=true
            // 清空列表数据
            this.finished = false;

            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading = true;
            this.onLoad('refresh');
        },
        //获取客源列表
        getList(){
            if(this.timer) clearTimeout(this.timer)
            this.timer=setTimeout(()=>{
                this.haveRequest=true
            },1000)
            let param = {
                pageSize: this.pageSize,
                pageIndex: this.pageNum,
                type: this.guestType,
                keyword: this.guestKeyword,
            };
            this.$ajax.get("/api/resource/customers", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    // debugger
                    if (res.data&&res.data.TotalCount > 0) {
                        this.list = this.list.concat(res.data.list);
                        this.total = res.data.TotalCount
                    } else {
                        this.list = [];
                        this.total = 0
                    }
                    // 加载状态结束
                    this.loading = false;
                    // 数据全部加载完成
                    if (this.list.length >= this.total) {
                        this.finished = true;
                    }
                }
            })
        },
        //选择客源
        confirm(val){
            this.choseId=val.InquiryCode
            this.setGuestId(val.InquiryCode)
            this.$router.go(-1)
            // this.$router.push({
            //     path:"/addContract",
            //     query:{
            //         guestId:val.InquiryCode
            //     }
            // })
        },
        getHistoty(res) {
            this.guestKeyword=res
            this.showHistory=false
            this.onRefresh()
        },
        ...mapMutations([
            'setGuestId',
        ])
    }     
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.chooseGuest{
    position: relative;
    overflow-y: scroll;
    height: calc(100% - 60px);
    background-color: @bg-grey;
}
/deep/.van-list{
    .van-cell{
        background-color: @bg-grey;
        padding: 10px 10px 0;
        .van-cell__value{
            background-color: @bg-white;
            padding: 10px;
            border-radius: 5px;
        }
    }
}
 
.chooseIcon{
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 20px;
    color: @text-grey-CCC;
} 
.color-green{
    color:@text-green;
}
.label{
    position: relative;
    padding: 4px 0;
    font-size: 12px;
    .left_l{
        display: inline-block;
        width: 120px;
        span{
            display: inline-block;
            width: 45px;
            color: @text-grey-333;
            &:first-of-type{
                color: @text-grey-BBB;
                width: 75px;
                text-align: right;
            }
            &:last-of-type{
                vertical-align: top;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    .right_l{
        display: inline-block;
        width: 180px;
        span{
            display: inline-block;
           width: 100px; 
           color: @text-grey-333;
           &:first-of-type{
                color: @text-grey-BBB;
                width: 80px;
                text-align: right;
            }
            &:last-of-type{
                vertical-align: top;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}  
.footerLabel{
    font-size: 12px;
    padding: 4px 0;
    display: flex;
    span{
       color: @text-grey-333;
       width: 230px;
       &:first-of-type{
        //    display: inline-block;
           width: 75px;
           text-align: right;
           color: @text-grey-BBB;
       }
    }
} 
.no-data{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-100%);
    >img{
        width: 136px;
    }
    >p{
        font-size: 12px;
        text-align: center;
        color: @text-grey-999;
        margin-top: 20px;
    }
}   
.listLoading{
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(225, 225, 225, 225);
    z-index: 999;
    /deep/.van-loading{
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%);
    }
}  
</style>