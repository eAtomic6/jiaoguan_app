<template>
    <div class="record">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-if="recordList.length>0">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <van-cell v-for="(item,index) in recordList" :key="index">
                    <ul class="recordMsg">
                        <li>
                            <span class="label">回访人</span>：
                            <span class="van-ellipsis">{{item.storeName+'-'+item.callerName}}</span>
                        </li>
                        <li>
                            <span class="label">回访时间</span>：
                            <span>{{item.startTime|formatTime(false)}}</span>
                        </li>
                        <li>
                            <span class="label">回访电话</span>：
                            <span>{{item.calledMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}</span>
                        </li>
                        <li>
                           <span class="label">回访录音</span> ：
                           <span class="record" :class="{'record_green':(recordKey===index)&&isPlay&&!isReady}">
                               <van-icon v-if="(recordKey===index)&&isPlay&&!isReady" class="playIcon" name="pause-circle" @click="playStop(index,item)" />
                               <van-icon v-else class="playIcon" name="play-circle" @click="playStop(index,item)" />
                               <span class="talkTime">{{item.talkTime|SecondFormat}}″</span>
                            </span>
                            <audio :src="item.recordSrc" :id="'audio'+index"></audio>
                        </li>
                        <li class="remarkMsg">
                            <span class="label">备注</span>：
                            <span class="remarks van-ellipsis" v-if="item.remarks&&power['sign-ht-xq-ly-vmemo'].state">{{item.remarks}}</span>
                            <span v-if="item.remarks&&!power['sign-ht-xq-ly-vmemo'].state">无权限浏览</span>
                            <span class="noRemarks" v-if="!item.remarks&&power['sign-ht-xq-ly-wmemo'].state" @click="showRemark(item)"><van-icon class="addIcon" name="add-o" />添加备注</span>
                            <van-icon v-if="item.remarks&&power['sign-ht-xq-ly-wmemo'].state" class="editIcon" name="edit" @click="showRemark(item)" />
                        </li>
                    </ul>
                </van-cell>
            </van-list>
        </van-pull-refresh>
        <div class="no-data" v-else>
            <img :src="getImgUrl('no_data.png')" alt="">
            <p>暂无数据</p>
        </div>
        <!-- //添加备注弹窗 -->
        <van-popup v-model="show">
            <van-field
            :border="false"
            v-model="remarks"
            rows="4"
            :autosize="{maxHeight:80, minHeight: 50}"
            type="textarea"
            maxlength="100"
            placeholder="请输入备注"
            show-word-limit
            @input="formatter"
            />
            <div class="btnList">
                <van-button type="default" size="small" @click="show=false">取消</van-button>
                <van-button type="primary" size="small" @click="confirm">确认</van-button>
            </div>
        </van-popup>
    </div>
</template>
           
<script>
import {mapGetters} from 'vuex'
import {List,PullRefresh,Progress,Popup,Field} from 'vant';
export default{
    components:{
        [List.name]:List,
        [PullRefresh.name]:PullRefresh,
        [Progress.name]:Progress,
        [Popup.name]:Popup,
        [Field.name]:Field,
    },
    props:{
        code:{
            type: String,
            default:''
        }
    },
    data(){
        return {
            loading:false,//上拉加载
            finished:false,
            refreshing:false,//下拉刷新
            error:false,//加载失败
            recordList:[],
            total:0,
            pageSize:10,
            pageNum:1,

            playTime:0,
            recordKey:'',
            isPlay:false,
            isReady:false,

            show:false,//备注弹窗
            remarkId:'',
            remarks:'',
        }
    },
    created () {
        this.onRefresh()  
    },
    methods: {
        getImgUrl(url){
            return require('@/assets/img/'+url);
        },
        //列表上拉加载
        onLoad(type='load'){
            if (this.refreshing) {
                this.recordList = [];
                this.refreshing = false;
            }
            if(type==='load'){
                this.pageNum+=1
            }
            this.getList()
        },
        //列表下拉刷新
        onRefresh() {
            this.refreshing=true
            // 清空列表数据
            this.finished = false;

            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading = true;
            this.pageNum=1
            this.onLoad('refresh');
        },
        //查询录音
        getList(){
            let param = {
                contractCode: this.code,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            this.$ajax.get('/api/record/list', param).then(res=>{
                res=res.data;
                if(res.status===200){
                    // 加载状态结束
                    this.loading = false;

                    this.total=res.data.total;
                    let arr = res.data.list
                    arr.forEach(element => {
                        if(element.recording){
                            let src = element.recording
                            element.recordSrc=src
                            element.recordTime=0
                            element.secondTime=0
                        }
                    });
                    this.recordList=this.recordList.concat(arr)
                    // 数据全部加载完成
                    if (this.recordList.length >= this.total) {
                        this.finished = true;
                    }
                }
            }).catch(error=>{
                this.$toast(error)
            })
        },
        //播放录音
        playStop(index,row){
            if(this.power['sign-ht-xq-ly-play'].state){
                let id = 'audio'+index;
                let myAudios = document.getElementsByTagName('audio');
                let myAudio = document.getElementById(id);
                if(index!=this.recordKey){
                    this.playTime=0
                }
                this.recordKey=index;
                if (myAudio.paused){
                    for(var i=0;i<myAudios.length;i++){
                        myAudios[i].pause();
                    }
                    myAudio.play();
                    this.isPlay=true;
                }else{
                    myAudio.pause();
                    this.isPlay=false;
                }
                var that=this
                myAudio.ontimeupdate = function () {
                    that.isReady=false
                    console.log(myAudio.duration,myAudio.readyState,myAudio.networkState)
                    if(!myAudio.duration){
                        if(myAudio.paused){
                            return
                        }else{
                            that.isReady=true
                            return
                        }
                    }
                    let playTime_=(myAudio.currentTime/myAudio.duration)*100;
                    if(playTime_){
                        row.recordTime=playTime_
                        row.secondTime=myAudio.currentTime
                    }
                };
                myAudio.onended=function(){
                    row.recordTime=0;
                    that.isPlay=false;
                    myAudio.pause();
                }
            }else{
                this.$toast("没有听取录音权限")
            }
        },
        //添加备注
        showRemark(val){
            this.remarkId=val.id
            if(val.remarks){
                this.remarks=val.remarks
            }else{
                this.remarks=''
            }
            this.show=true
        },
        confirm(){
            if(this.remarks.length>0){
                this.remarks=this.remarks.replace(/\s/g,"");
                if(this.remarks.length>0){
                    let param = {
                        remarks:this.remarks,
                        id:this.remarkId
                    }
                    this.$ajax.put('/api/record/update',param, 2).then(res=>{
                        res=res.data;
                        if(res.status===200){
                            this.show=false;
                            this.$toast('添加成功');
                            this.onRefresh();
                        }
                    }).catch(error=>{
                        this.$toast(error)
                    })
                }else{
                    this.$toast("备注不能为空")
                }
            }else{
                this.$toast("备注不能为空")
            }
        },
        //备注限制输入
        formatter(){
            let addrReg = /\\|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
            this.remarks=this.remarks.replace(/\s+/g,"").replace(addrReg,'')
        }
    },
    computed: {
        ...mapGetters([
            'getUserMsg',
            'getPowerCode',
        ]),
        power() {
            return this.getPowerCode
        }  
    },
    filters: {
        //秒转时分秒
        SecondFormat: function(result){
            var h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
            var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
            var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
            return result = h + ":" + m + ":" + s;
        },
    }
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
/deep/.van-cell{
    background-color: @bg-grey;
    padding: 5px 10px 10px 10px;
    .van-cell__value{
        background-color: @bg-white;
        padding: 15px;
        border-radius: 2px;
    }
}
.recordMsg{
    li{
        height: 30px;
        line-height: 30px;
        margin: 5px 0;
        display: flex;
        color: @text-grey-999;
        span{
            display: inline-block;
            &:last-of-type{
                color: @text-grey-333;
                padding-left: 5px;
            }
        } 
        .label{
            width: 60px;
            height: 30px;
            text-align: justify;
            &::after{
                content: '';
                display: inline-block;
                width: 100%;
            }
        }
        .record{
            width: 130px;
            height: 30px;
            background-color: #EFF4F7;
            border-radius: 2px;
            position: relative;
            .playIcon{
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 10px;
                color: #7B8B94;
            }
            .playIng{
                color: @text-white;
            }
            .talkTime{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                color: #7B8B94;
            }
        }
        .record_green{
            background-color: @text-green;
            .playIcon{
                color: @text-white;
            }
            .talkTime{
                color: @text-white;
            }
        }
        .noRemarks{
            position: relative;
            color: @text-green!important;
            padding-left: 20px!important;
            .addIcon{
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
            }
        }
        .remarks{
            width: 200px;
        }
    }
    .remarkMsg{
        position: relative;
        .editIcon{
            color: @text-green;
            font-size: 20px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0;
        }
    }
}
/deep/.van-cell{
    background-color: @text-white;
}
.van-popup{
    height: 180px;
    width: 300px;
}
.btnList{
    padding: 0 10px;
    text-align: right;
    .van-button{
        margin-left: 20px;
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
</style>