<template>
    <van-popup :value="getState" position="bottom" @click-overlay="chose">
        <ul class="list">
            <li v-for="item in list" :key="item" @click="chose(item)">{{item}}</li>
        </ul>
    </van-popup>
</template>
           
<script>
import { Popup } from 'vant';
export default{
    components: {
        [Popup.name]: Popup,
    },
    props: {
        state:{
            type: Boolean,
            default: false,
        },
        sceneId:{
            type: Number,
            default: 11,//11 合同资料库 12 财务  13 后期
        }
    },
    data(){
        return{
            list:['拍照','从相册中选取','从文件管理中选取','取消'],
        }
    },
    created () {
        
    },
    mounted () {
        //将上传方法挂载到windows上 供原生调
        // window.successPhone = this.successPhone;//上传图片成功回调
        // window.errPhone = this.errPhone;//上传图片失败回调   
        // 2020.06.12 原生调整回调方法名
        window.pickImageSuccess = this.successPhone;//上传图片成功回调
        window.pickImageFailure = this.errPhone;//上传图片失败回调
        // 2020.06.28 原生文件上传
        window.successFiles = this.getSuccessFiles;//上传图片成功回调
        window.errFiles = this.getErrFiles;//上传图片失败回调     
    },
    methods:{
        chose(val){
            this.$emit('close')
            // 相册选取
            if (val === "拍照") {
                // Android
                document.location = `js://takePhoto?scene=${this.sceneId}`;
                //IOS
                window.webkit.messageHandlers.takePhoto.postMessage({scene:this.sceneId});
            }
            //  从相机里获取
            if (val === "从相册中选取") {
                // Android
                document.location = `js://takeAlbum?scene=${this.sceneId}&maxNum=9`;
                //IOS
                window.webkit.messageHandlers.takeAlbum.postMessage({scene:this.sceneId,maxNum:9});
            }
            //  从文件管理中获取
            if (val === "从文件管理中选取") {
                // Android
                document.location = `js://takeFiles?scene=${this.sceneId}`;
                //IOS
                window.webkit.messageHandlers.takeFiles.postMessage({scene:this.sceneId});
            }
        },
        // 上传图片成功回调
        successPhone(val){
            console.log(val)
            let strList = JSON.parse(val)
            console.log(strList.constructor==String)
            console.log(strList.constructor==Array)
            let arr = []
            strList.forEach(element => {
                let pos = element.lastIndexOf("/");
                let name = ""
                if (pos != -1) {
                    name = element.substring(pos+1);
                }
                let path = "https" + element.substring(element.indexOf(":"))
                let item = {
                    name,
                    path
                }
                arr.push(item)
            });
            this.$emit("chose",arr)
        },
        // 上传图片失败回调
        errPhone(val){
            console.log(val)
            this.$toast('上传失败')
            this.$emit('close')
        },
        // 文件上传成功回调
        getSuccessFiles(val) {
            this.successPhone(val)
        },
        // 文件上传失败回调
        getErrFiles(val) {
            console.log(val);
            this.$toast('上传失败')
            this.$emit('close')
        }
    },
    computed: {
        getState(){
            return this.state
        }
    }
}
</script>
<style scoped lang="less">
@import "@/assets/common.less";
.list{
    text-align: center;
    font-size: 18px;
    color: @text-grey-333;
    background-color: @bg-grey;
    li{
        padding: 18px;
        background-color: @bg-white;
        &:not(:last-of-type){
            border-bottom: 1px solid @border-grey-E0;
        }
        &:last-of-type{
            margin-top: 10px;
        }
    }
}       
</style>