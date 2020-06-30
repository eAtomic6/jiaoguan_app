<template>
    <div class="view-container">
        <div class="content-box">
            <van-tabs v-model="activeTab" line-width="22px" color="#3EBA70" v-if="stepReportData.length>0&&(currentTit === STEPS.start || currentTit === STEPS.affirm || currentTit === STEPS.end)" @change="changeTab">
                <van-tab v-for="(tab,i) in tabs" :key="'tab'+i" :title="tab"></van-tab>
            </van-tabs>
            <div class="is-finish van-hairline--bottom" v-if="(currentTit === STEPS.start || currentTit === STEPS.affirm)&&activeTab==0">
               <p class="label">是否完成</p>
               <van-radio-group v-model="isHandle" direction="horizontal">
                    <van-radio checked-color="#3EBA70" name="0">是，已完成</van-radio>
                    <van-radio checked-color="#3EBA70" name="1">否，写跟进日志</van-radio>
                </van-radio-group>
            </div>
            <van-form @submit="sureFn" v-if="activeTab==0&&isHandle==0" ref="operaForm">
                <div v-for="(item,index) in stepsForm.list" :key="'list'+index" class="form-opera">
                    <template v-if="currentTit !== STEPS.end">
                        <template v-if="item.type === STEPSINPUT.start">
                            <van-field v-model="item.val" :label="item.title" :required="item.isRequired" :rules="[item.rules]" clearable placeholder="请输入" />
                        </template>
                        <template v-else-if="item.type === STEPSINPUT.num">
                            <van-field v-model="item.val" :label="item.title" :required="item.isRequired" :rules="[item.rules]" type="digit" clearable placeholder="请输入" />
                        </template>
                        <template v-else-if="item.type === STEPSINPUT.time">
                            <van-field readonly is-link v-model="item.val" :label="item.title" :required="item.isRequired" :rules="[item.rules]" @click="openFn(1,index)" placeholder="请选择" />
                            <i class="step-icon van-icon van-icon-clear" v-if="item.val" @click.stop="clearDate(1,index)"></i>
                        </template>
                        <template v-else-if="item.type === STEPSINPUT.textarea">
                            <van-field v-model="item.val" :label="item.title" :required="item.isRequired" :rules="[item.rules]" type="textarea" rows="2" autosize maxlength="200" show-word-limit clearable placeholder="请输入" />
                        </template>
                        <template v-else-if="item.type === STEPSINPUT.img || item.type === STEPSINPUT.mp4 || item.type === STEPSINPUT.pdf || item.type === STEPSINPUT.excel || item.type === STEPSINPUT.word">
                            <van-field readonly v-model="item.val.length" :label="item.title" :required="item.isRequired" :rules="[item.rules]" class="no-field" />
                            <div class="gallery">
                                <div class="gallery-item" v-for="(file,fileIndex) in item.val" :key="'gallery'+fileIndex">
                                    <div class="picture" @click="showGallery(file)">
                                        <i v-if="!isPictureFile(file.type)" class="icon iconfont" :class="file.type|getType" @click.stop="fileSign([file.path],'download')"></i>
                                        <img v-else :src="file.path|getSignImage(fileList)">
                                    </div>
                                    <p class="van-ellipsis">{{file.name}}</p>
                                    <p class="float-close" @click="deleteFile(fileIndex,item.val)"><img :src="iconClose" alt="close"></p>
                                </div>
                               <div class="gallery-item uploader-btn" @click="openGallery(index)"><i class="icon iconfont icontianjiatupian"></i><span class="up">点击上传</span></div>
                            </div>
                        </template>
                    </template>
                    <template v-else>
                        <template v-if="item.type === STEPSINPUT.start || item.type === STEPSINPUT.time || item.type === STEPSINPUT.textarea || item.type === STEPSINPUT.num">
                            <div class="steps-see">
                                <span>{{item.title}}：</span>
                                <span>{{item.val}}</span>
                            </div>
                        </template>
                        <template v-else>
                            <ul class="steps-img">
                                <p>{{item.title}}：</p>
                                <li v-for="file in item.val" :key="'steps'+file.path" class="steps-item">
                                    <div class="picture" @click="showGallery(file)">
                                        <i v-if="!isPictureFile(file.type)" class="icon iconfont" :class="file.type|getType" @click.stop="fileSign([file.path],'download')"></i>
                                        <img v-else :src="file.path|getSignImage(fileList)">
                                    </div>
                                    <p class="van-ellipsis">{{file.name}}</p>
                                </li>
                            </ul>
                        </template>
                    </template>
                </div>
            </van-form>
            <van-form @submit="onReportSubmit" v-else-if="activeTab==0&&isHandle==1" ref="reportForm">
                <van-field readonly v-model="stepReportForm.reportingtor" label="跟进人" class="form-opera" />
                <div class="form-opera">
                    <van-field readonly is-link v-model="stepReportForm.reportingDate" label="跟进时间" required :rules="[{ required: true, message: '请选择跟进日期' }]" @click="openFn()" placeholder="请选择" />
                    <i class="report-icon van-icon van-icon-clear" v-if="stepReportForm.reportingDate" @click.stop="clearDate()"></i>
                </div>
                <van-field v-model="stepReportForm.reportingRemake" label="日志内容" class="form-opera" type="textarea" rows="2" autosize maxlength="200" show-word-limit placeholder="请输入" />
            </van-form>
            <div v-if="activeTab==1" class="report">
                <ul>
                    <li v-for="(item,index) in stepReportData" :key="'report'+index" class="van-hairline--bottom">
                        <p class="bold">{{item.reportingtor}}</p>
                        <p class="time">跟进时间: {{item.reportingDate|formatDate}}</p>
                        <div class="remark" v-if="item.reportingRemake">{{item.reportingRemake}}</div>
                        <div v-else></div>
                    </li>
                </ul>
            </div>
        </div>
        <van-popup v-model="showDate" position="bottom" :style="{ height: '30%' }">
            <van-datetime-picker
                v-model="currentDate"
                type="date"
                title="选择年月日"
                @confirm="onConfirm()"
                @cancel="onConfirm('clear')"
                :max-date="maxDate" />
        </van-popup>
        <van-dialog v-model="sureDialog" title="确认办理完成？" show-cancel-button @confirm="onSubmit">
            <div class="sure-text">您的佣金暂未收齐</div>
        </van-dialog>
        <van-image-preview v-model="galleryShow" :images="fileList" :startPosition="startIndex"></van-image-preview>
        <fileSelect :state='dialog' :sceneId="13" @close="closeDialog" @chose="getSrc"></fileSelect>
    </div>
</template>

<script>
import fileSelect from '@/components/fileSelect'
import { postMixin } from '@/assets/js/postMixin';
import { Form, Field, RadioGroup, Radio, DatetimePicker, Popup, ImagePreview } from 'vant';
// 办理状态
const STEPS = {
    start: '办理',    //办理
    sure: '修改',     //修改
    end: '查看',      //查看
    affirm: '确认',   //确认
}
// 办理输入框
const STEPSINPUT = {
    start:0,        //input 文本输入框
    num:1,          //input number类型
    time:2,         //时间选择
    img:3,          //图片
    mp4:4,          //视频
    pdf:5,          //pdf文件
    excel:6,        //表格
    word:7,         //文档
    textarea:8,     //文本框输入
}

export default {
    name: 'post-progress-opera',
    mixins: [postMixin],
    components: {
        [Form.name]: Form,
        [Field.name]: Field,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [Popup.name]: Popup,
        [DatetimePicker.name]: DatetimePicker,
        [ImagePreview.Component.name]: ImagePreview.Component,
        fileSelect
    },
    data() {
        return {
            STEPS,
            STEPSINPUT,
            activeTab: '',
            tabs: ['','跟进记录'],
            isHandle: '0',
            currentTit: '',
            currentId: '',
            stepsForm: {
                list: [],
                id: '',
            },
            stepReportForm: {
                reportingtorId: '',
                reportingtor: '',
                reportingDate: this.dateFormat(Date.now()),
                reportingRemake: ''
            },
            showDate: false,
            currentDate: new Date(),
            stepReportData: [],
            maxDate: new Date(),
            dateType: {},
            sureDialog: false,
            sureObj: {}, //办理步骤是过户
            galleryShow: false,
            fileList:[],
            dialog:false,
            iconClose:require('@/assets/img/icon-close.png'),
            startIndex:0,//图片预览起始位置索引
        }
    },
    created() {
        let query = this.$route.query
        this.currentId = query.id
        this.currentTit = query.title
        this.sureObj = {
            remarkAfter: query.remarkAfter,
            statusReceiveAmount: query.statusReceiveAmount
        }
        this.tabs[0] = this.currentTit
        this.getLookStepFn()
        console.log(this.currentTit);
    },
    mounted() {
        let that=this
        this.$EventBus.$on('submitFn',function () {
            if(that.isHandle==0){
                that.$refs.operaForm.submit()
            }else{
                that.$refs.reportForm.submit()
            }
        })
    },
    beforeDestroy(){
        this.$EventBus.$off('submitFn')
    },
    methods: {
        changeTab(val) {
            this.setReportTab(val)
        },
        openGallery(index) {
            this.dateType.index = index
            this.dialog = true
        },
        closeDialog() {
            this.dialog=false
        },
        getSrc(src) {
            console.log(src);
            let arr = src;
            arr.forEach(item => {
                let type = this.get_suffix(item.name);
                item.type = type;
            });
            this.stepsForm.list[this.dateType.index].val = this.stepsForm.list[
                this.dateType.index
            ].val.concat(arr);
            let pre_arr = [];
            this.stepsForm.list.forEach(item => {
                if([3,4,5,6,7].includes(item.type)) {
                    item.val.forEach(ele =>{
                        if(this.isPictureFile(ele.type)) {
                            pre_arr.push(ele.path)
                        }
                    })
                }
            })
            this.fileSign(pre_arr, "preload").then(res => {
                this.fileList = res;
            });
        },
        deleteFile:function(index,parent){
            parent.splice(index,1)
        },
        showGallery:function(val){
            let a
            this.fileList.forEach((element,index) => {
                if(element.indexOf(val.path)>-1){
                    a = index
                }
            });
            this.startIndex=a
            this.galleryShow=true
        },
        getLookStepFn() {
            this.$ajax.get('/api/postSigning/lookStep',{
                id: this.currentId
            }).then(res => {
                res = res.data
                if(res.status === 200){
                    let resData = res.data
                    let arr = [...resData.transAtepsAttach]
                    this.stepReportData = resData.stepReportings ? [...resData.stepReportings] : []
                    let arr2 = [
                        {
                            val: this.dateFormat(resData.handleDatetime),
                            title: '办理日期',
                            id:'bj'+resData.id + 1,
                            isRequired: true,
                            type: 2,
                            rules: {
                                required: true,
                                message: `请选择办理日期`
                            }
                        },
                        {
                            val: resData.remarks,
                            title: '备注',
                            id:'bj' + resData.id + 2,
                            isRequired: false,
                            type: 8,
                            rules: {
                                required: false
                            }
                        }
                    ]
                    arr.map(e => {
                        let j = {}
                        if(e.type === STEPSINPUT.start || e.type === STEPSINPUT.time || e.type === STEPSINPUT.textarea || e.type === STEPSINPUT.num) {
                            e.val = e.value
                            j.message = `请输入${e.title}`
                        } else {
                            if(e.value) {
                                e.val = this.cutFilePath(e.value.split(','))
                            } else {
                                e.val = []
                            }
                            j.message = `请上传${e.title}`
                        }
                        e.isRequired = Boolean(e.isRequired)
                        if(e.isRequired) {
                            j.required = true
                        } else {
                            j.required = false
                        }
                        e.rules = j
                        // if(e.type === STEPSINPUT.num) {
                        //     e.rules = [ j, { bool: e.isRequired } ]
                        // } else {
                        //     e.rules = j
                        // }
                    })
                    this.stepsForm = {
                        list: [ ...arr, ...arr2 ],
                        id: resData.id
                    }
                    if(this.currentTit === STEPS.end || this.currentTit === STEPS.sure || this.currentTit === STEPS.affirm) {
                        let preloadList = []
                        arr.forEach(e =>{
                            if([3,4,5,6,7].includes(e.type)) {
                                e.val.forEach(t =>{
                                    if(this.isPictureFile(t.type)){
                                        preloadList.push(t.path)
                                    }
                                })   
                            }
                        })
                        if(preloadList.length){
                            this.fileSign(preloadList,'preload').then(res=>{
                                this.fileList=[].concat(res)
                            })  
                        }
                    }
                }
            }).catch(err => {
                this.$toast(err)
            })
        },
        sureFn() {
            if(this.currentTit === STEPS.start&&this.sureObj.remarkAfter==1&&this.sureObj.statusReceiveAmount==1) {
                this.sureDialog = true
            } else {
                this.onSubmit()
            }
        },
        onSubmit() {
            let url = 'confirmStep'
            if(this.currentTit === STEPS.sure) {
                url = 'updateStep'
            }
            let id = this.stepsForm.id
            let transAtepsAttach = [...this.stepsForm.list]
            // 添加备注和时间
            let handleDatetime = this.dateFormat(transAtepsAttach[transAtepsAttach.length-2].val)
            let remarks = transAtepsAttach[transAtepsAttach.length-1].val
            // 删除多余的数组
            transAtepsAttach.splice(-2,2)
            transAtepsAttach.map(e => {
                if(e.type === STEPSINPUT.start || e.type === STEPSINPUT.time || e.type === STEPSINPUT.textarea || e.type === STEPSINPUT.num){
                    if(e.type === STEPSINPUT.time) {
                        e.val = this.dateFormat(e.val)
                    }
                    e.value = e.val;
                }else{
                    if(e.val.length === 0) {
                        e.value = '';
                    } else {
                        let arr = this.getFilePath(e.val);
                        e.value = arr.join();
                    }
                }
            })
            this.$ajax.postJSON(`/api/postSigning/${url}`, {
                handleDatetime,
                remarks,
                transAtepsAttach,
                id,
            }).then(res => {
                res = res.data
                if(res.status === 200){
                    this.$toast(res.message)
                    this.$router.go(-1)
                }
            }).catch(err => {
                this.$toast(err)
            })
        },
        onReportSubmit() {
            let arr = [...this.stepReportData]
            arr.unshift(this.stepReportForm)
            let param = {
                id: this.currentId,
                stepReportings: arr
            }
            this.$ajax.postJSON('/api/postSigning/addStepReporting',param).then(res =>{
                res = res.data
                if(res.status === 200){
                    this.$toast('录入跟进日志成功')
                    this.$router.go(-1)
                }
            }).catch(err => {
                this.$toast(err)
            })
        },
        clearDate(type=0,index) {
            if(type===1) {
                this.stepsForm.list[index].val = ''
            } else {
                this.stepReportForm.reportingDate = ''
            }
        },
        openFn(type=0,index) {
            this.showDate = true
            this.dateType = {
                type,
                index
            }
            if(type===1) {
                let value = this.stepsForm.list[index].val
                if(value) {
                    this.currentDate = new Date(value)
                }
            }
        },
        onConfirm(type='init') {
            if(type==='init') {
                let date = this.dateFormat(this.currentDate)
                if(this.dateType.type===0) {
                    this.stepReportForm.reportingDate = date
                } else {
                    this.stepsForm.list[this.dateType.index].val = date
                }
            }
            this.showDate = false
        },
        dateFormat: function(val, type = 1) {
            if (!val) {
                return "";
            } else {
                let time = new Date(val);
                let y = time.getFullYear();
                let M = time.getMonth() + 1;
                let D = time.getDate();
                return type === 1 ? `${y}-${M > 9 ? M : "0" + M}-${D > 9 ? D : "0" + D}` : `${y}/${M > 9 ? M : "0" + M}/${D > 9 ? D : "0" + D}`;
            }
        },
        //上传拼接
        getFilePath: function (arr) {
            let newArr = [];
            arr.forEach(item => {
                newArr.push(`${item.path}?${item.name}`);
            });
            return newArr;
        },
        //获取文件的后缀
        get_suffix(filename) {
            let pos = filename.lastIndexOf(".");
            let suffix = "";
            if (pos != -1) {
                suffix = filename.substring(pos);
            }
            return suffix;
        },
        cutFilePath: function (arr) {
            let newArr = [];
            arr.forEach(item => {
                let cell = {
                    path: item.split("?")[0],
                    name: item.split("?")[1],
                    type: this.get_suffix(item.split("?")[1])
                };
                newArr.push(cell);
            });
            return newArr;
        },
        // 判断是否为图片类别
        isPictureFile(type){
            let lowType = type.toLowerCase()
            return ['.png', '.jpg', '.jpeg', '.gif', '.bmp'].includes(lowType)
        },
        /**
         * 获取签名
         */
        fileSign:async function (arr,type) {
            let param={urls:arr.join(',')}
            if(type==='download'){
                param.rct='application%2Foctet-stream'
            }
            // param.style='jjw-watermark'
            let result=await this.$ajax.put('/api/load/generateAccessURLBatch',param,2).then(res=>{
                res=res.data
                if(res.status===200){
                    if(type==='download'){
                        // var a = document.createElement('a');
                        // a.download = undefined;
                        // a.href = res.data[0];
                        // // a.innerText='test'
                        // document.body.appendChild(a)
                        // a.click();
                        // document.body.removeChild(a)
                        this.$router.push({
                            path: "/seeFiles",
                            query: {
                                url: res.data[0]
                            }
                        });
                    }else{//图片缩略图使用
                        return res.data
                    }
                }
            })
            if(result){
                return Promise.resolve(result)
            }
        },
    },
    watch: {
        getUserMsg: {
            handler(val) {
                this.stepReportForm.reportingtorId = val.user.empId
                this.stepReportForm.reportingtor = val.user.name
            },
            deep: true,
            immediate: true
        }
    },
    filters:{
        /**
         * 过滤显示图片缩略图
         * @param val后端返回的所有文件资源遍历的当前项
         * @param list图片资源获取签名后的临时数组
         */
        getSignImage(val,list){
            if(list.length===0){
                return '';
            }else {
                return list.find(item=>{
                    return item.includes(val)
                })
            }
        },
        getType: function (val) {
            switch (val.toLocaleLowerCase()) {
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.gif':
            case '.bmp':
                return 'iconicon-tupian';
            case '.mp3':
            case '.mpeg':
            case '.cd':
            case '.wave':
            case '.aiff':
                return 'icon-yinpin1'
            case '.mp4':
            case '.avi':
            case '.rmvb':
            case '.wmv':
            case '.mkv':
                return 'icon-shipin1'
            case '.txt':
                return 'iconicon-wendang'
            case '.pdf':
                return 'iconpdf'
            case '.xls':
            case '.xlsx':
                return 'iconexcel'
            case '.docx':
            case '.doc':
                return 'iconword'
            case '.ppt':
                return 'iconppt'
            case '.zip':
            case '.rar':
                return 'iconicon-yasuobao'
            default:
                return 'iconicon-qita'
            }
        }
    }
}
</script>

<style scoped lang="less">
@import "~@/assets/common.less";

.view-container {
    height: calc(100% - 60px);
    overflow: auto;
    // -webkit-overflow-scrolling: touch;
    background-color: @bg-grey;
}
.content-box {
    .is-finish {
        background-color: @bg-white;
        padding: 10px 0 10px 15px;
        margin-top: 10px;
        font-size: 14px;
        .label {
            margin-bottom: 10px;
        }
        .van-radio {
            padding: 5px 0;
            width: 45%;
        }
        /deep/ .van-radio__icon {
            font-size: 18px;
        }
    }
    .form-opera {
        position: relative;
        background: white;
        .step-icon, .report-icon {
            position: absolute;
            right: 40px;
            top: 14px;
            color: @text-grey-BBB;
        }
        margin-bottom: 10px;
        .steps-see, .steps-img {
            background-color: @bg-white;
            padding: 10px 15px;
        }
        .steps-see {
            span {
                display: inline-block;
                &:first-child {
                    margin-right: 5px;
                }
            }
        }
        .steps-img {
            >p {
                margin-bottom: 10px;
            }
            .steps-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 162px;
                height: 122px;
                border-radius: 4px;
                background-color: @bg-grey-EFF;
                margin: 0 12px 12px 0;
                text-align: center;
                position: relative;
                &:nth-of-type(2n){
                    margin-right: 0;
                }
                >p{
                    width: 90%;
                }
            }
            .picture{
                height: 94px;
                display: flex;
                align-items: center;
                justify-content: center;
                >img{
                    height: 100%;
                    width: 153px;
                    height: 94px;
                    border-radius: 4px;
                }
                >i{
                    font-size: 30px;
                }
            }
        }
        .gallery {
            padding: 0 19px 19px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: space-between;
            &-item{
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 162px;
                height: 122px;
                border-radius: 4px;
                background-color: @bg-grey-EFF;
                margin: 0 12px 12px 0;
                text-align: center;
                position: relative;
                &:nth-of-type(2n){
                    margin-right: 0;
                }
                >p{
                    width: 90%;
                }
                .float-close{
                    width: 33px;
                    position: absolute;
                    top: -14px;
                    right: -14px;
                }
            }
            .picture{
                height: 94px;
                display: flex;
                align-items: center;
                justify-content: center;
                >img{
                    height: 100%;
                    width: 153px;
                    height: 94px;
                    border-radius: 4px;
                }
                >i{
                    font-size: 30px;
                }
            }
        }
        .uploader-btn{
            position: relative;
            background: #F0F0F0;
            >i{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-75%);
                font-size: 30px;
                color: @text-grey-DDD;
            }
            .up {
                display: inline-block;
                width: 100px;
                color: @text-grey-999;
                font-size: 12px;
                position: absolute;
                top: 65%;
                left: 50%;
                transform: translateX(-50%);
            }
            &::before{
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 99;
            }
        }
        /deep/ .van-cell:not(:last-child)::after {
            border: 0;
        }
        .no-field {
            /deep/ .van-field__control {
                display: none;
            }
        }
    }
    .report {
        background-color: @bg-white;
        li {
            // border-bottom: 1px solid @border-grey-E0;
            padding: 20px;
            &:first-child {
                margin-top: 10px;
            }
            p.bold {
                font-weight: bold;
            }
            p.time {
                font-size: 14px;
                color: @text-grey-999;
            }
            div.remark {
                padding: 20px 15px;
                background-color: @bg-grey-F7F8FB;
            }
        }
    }
    /deep/.van-field__control{
        color: @text-grey-333;
        &::-webkit-input-placeholder {
            color: @text-grey-BBB;
        }
    }
    /deep/.van-field__control:disabled{
        color: @text-grey-666;
    }
}
.sure-text {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: @text-red;
}
</style>