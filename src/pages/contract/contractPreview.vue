<template>
    <div class="preview">
        <van-tabs v-if="isShowType" v-model="isActive" @click="changeType" line-width="22px" color="#3EBA70" class="tabs">
            <van-tab title="居间合同"></van-tab>
            <van-tab title="买卖合同"></van-tab>
        </van-tabs>
        <div class="preview_body" ref="maindetails">
            <img v-for="(item,index) in src" :key="index" :src="item" @click="showGaller(index)">
        </div>
        <van-image-preview v-model="galleryShow" :images="src" :startPosition="startIndex">
        <!--  <template v-slot:index>第{{ index }}页</template>-->
        </van-image-preview>
    </div>
</template>
           
<script>
import {mapGetters} from 'vuex'
import { ImagePreview } from 'vant';
export default{
    components: {
        [ImagePreview.Component.name]: ImagePreview.Component,
    },
    data(){
        return{
            isActive:0,
            id:'',
            src:[],
            isShowType:false,
            //买卖合同地址
            business:'',
            total_b:'',
            //居间合同地址
            residence:'',
            total_r:'',
            //其他合同地址
            address:'',
            total_a:'',
            //展示地址
            showAddress:'',
            showTotal:'',
            count:1,

            galleryShow:false,//图片预览
            startIndex:0,//图片预览起始位置索引
        }
    },
    created () {
        this.id = this.$route.query.id;
        this.getContImg()
        this.watermark()
    },
    methods:{
        //添加水印
        watermark(){
            this.$nextTick(()=>{
                this.$tool.waterMark(`${this.getUserMsg.user.depName}${this.getUserMsg.user.name}${this.getUserMsg.user.mobile}`,this.$refs.maindetails);
            })
        },
        changeType(val){
            this.isActive = val;
            if(val===0){
                this.count=1;
                this.showAddress=this.residence;
                this.setSrc(this.showAddress,this.total_r);
            }else{
                this.count=1;
                this.showAddress=this.business;
                this.setSrc(this.showAddress,this.total_b);
            }
        },
        //获取合同预览图片
        getContImg(type){
            let param = {
                id:this.id,
                isentrust:0
            };
            this.$ajax.get('/api/contract/preview', param).then(res=>{
                res=res.data
                if(res.status===200){
                    //1 武汉  2 合肥  11 襄阳
                    if(res.data.isWuHanMM===1&&(res.data.contType.value===2)){
                        this.isShowType=true;
                        //买卖
                        this.business=res.data.imgAddress.business; 
                        this.total_b=res.data.imgCount.business;
                        //居间
                        this.residence=res.data.imgAddress.residence;
                        this.total_r=res.data.imgCount.residence;
                        this.showAddress=res.data.imgAddress.residence;
                        this.setSrc(this.showAddress,res.data.imgCount.residence);
                    }else {
                        //其他
                        this.address=res.data.imgAddress.address;
                        this.total_a=res.data.imgCount.count;
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
                    res.data.forEach(element => {
                        if(element==="文件不存在"){
                            this.reduce=1;
                        }
                    });
                }
            })
        },
        //预览图片
        showGaller(index){
            this.startIndex=index
            this.galleryShow=true
        },
    },
    computed:{
        ...mapGetters([
            'getUserMsg',
        ]),
    }
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.preview{
    position: relative;
    height: calc(100% - 60px);
    overflow-y: scroll;
} 
.preview_body{
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    img{
        width: 100%;
    }
}      
</style>