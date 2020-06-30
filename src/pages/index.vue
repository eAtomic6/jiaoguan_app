<template>
    <div class="main">
        <template v-if="$route.path!=='/choseCont'">
            <searchBar :disabled="true" :ifInitParam="initSearchComponentParam" v-if="getUserMsg&&showSearch" @sendParam="getSearchParam" @toRoute="linkSearch"></searchBar>
            <div class="search-bar-other"  v-if="!(showSearch||$route.path==='/search'||$route.path==='/chooseGuest')">
                <p>
                    <span><i class="icon iconfont iconjiantou1" @click.stop="goBack"></i></span>
                    <span><i class="icon iconfont iconguanbi" @click.stop="closeWeb"></i></span>
                </p>
                <span>{{pageTitle}}</span>
                <div v-if="($route.path==='/postProgressOpera'&&$route.query.title!=='查看'&&getReportTab!==1)||$route.path==='/postSteps'" @click="postSure">确认</div>
            </div>
            <div class="footer-tabs" v-if="showSearch">
                <ul>
                    <li v-for="item in footerTab" :key="item.id" @click="choseTab(item)" :class="{'active':footerTabActive===item.id}">
                        <span><i class="icon iconfont" :class="item.icon"></i></span>
                        <p>{{item.name}}</p>
                    </li>
                </ul>
            </div>
        </template>
        <router-view v-if="getUserMsg"></router-view>
    </div>
</template>

<script>
import searchBar from '@/components/searchBar.vue';
import {mapMutations,mapGetters} from 'vuex';
import {POWER} from "../assets/js/common";

export default {
    name: "index",
    components:{
        searchBar
    },
    data() {
        return {
            userId: '',
            code: {},
            show: false,
            pageTitle: '',
            footerTabActive:1,
            footerTab:[
                {id:1,name:'合同',icon:'iconhetong',path:'contractHomePage'},
                {id:2,name:'财务',icon:'iconcaiwu',path:'bill'},
                {id:3,name:'后期',icon:'iconhouqi',path:'postIndex'}
            ],
            initSearchComponentParam:'',//是否初始化筛选组件
            power:JSON.parse(JSON.stringify(POWER))
        }
    },
    beforeRouteEnter(to,from,next){
        next(vm=>{
            if(to.path==='/contractHomePage'){
                vm.footerTabActive=1
            }else if(to.path==='/bill'){
                vm.footerTabActive=2
            }else{
                vm.footerTabActive=3
            }
            if(to.meta){
                vm.pageTitle=to.query.title||to.meta.title
            }else{
                vm.pageTitle=''
            }
        });
    },
    beforeRouteUpdate(to,from,next){
        if(to.path==='/contractHomePage'){
            this.footerTabActive=1
        }else if(to.path==='/bill'){
            this.footerTabActive=2
        }else{
            this.footerTabActive=3
        }
        if(to.meta){
            this.pageTitle=to.query.title||to.meta.title
        }else{
            this.pageTitle=''
        }
        if(['/contractHomePage','/bill','/postIndex'].includes(to.path)) {
            this.setSearchKey('')
        }
        next();
    },
    created() {
        let param = this.$route.query
        // this.setPath([])
        if (param.newToken) {
            document.cookie = `ERP-Test=${this.$route.query.newToken}`;
        } else if (param.empcode) {
            for (let item in param) {
                if (item === 'empcode') {
                    param[item] = parseInt(param[item])
                }
            }
            this.code = Object.assign({}, param)
        }
        // console.log(this.code,param)
        this.login()
    },
    methods: {
        linkSearch:function(){
            this.$router.push({
                path:'/search'
            })
        },
        choseTab:function(item){
            this.footerTabActive=item.id
            this.$router.replace({
                path:item.path
            })
        },
        goBack:function(){
            let arr = ['/contractHomePage','/bill','/postIndex','/addContract']
            if(arr.includes(this.$route.path)){
                if(this.$route.query.title==="合同编辑"){
                    this.$router.go(-1)
                }else{
                    // Android
                    document.location = "js://close";
                    //IOS
                    window.webkit.messageHandlers.close.postMessage("");
                }
            }else{
                if(this.$route.path==='/contractDataBase'){
                    this.$EventBus.$emit('showDialog')
                }else{
                    this.$router.go(-1)
                }
            }
        },
        closeWeb(){
            // Android
            document.location = "js://close";
            //IOS
            window.webkit.messageHandlers.close.postMessage("");
        },
        //EventBus传递顶部筛选选择条件
        getSearchParam:function(res){
            this.$EventBus.$emit('getSearchBar',res)
        },
        login: function () {
            this.$set(this.code,'platForm',1)
            this.$ajax.post('/api/verify', this.code).then(res => {
                res = res.data
                if (res.status === 200) {
                    this.$ajax.get('/api/me', {time: new Date()}).then(res => {
                        res = res.data
                        if (res.status === 200) {
                            this.setUserMsg(res.data)
                            let arr = res.data.privileges
                            if(arr.length>0){
                                for (let cell in this.power){
                                    if(arr.includes(cell)){
                                        this.power[cell].state=true
                                    }
                                }
                                this.setPowerCode(this.power)
                            }else{
                                this.$toast('无任何权限')
                            }
                        }
                    })
                }
            }).catch(error => {
                this.$toast(error)
            })
        },
        postSure() {
            let str = 'submitFn'
            if(this.$route.path === '/postSteps') {
                str = 'btnSureFn'
            }
            this.$EventBus.$emit(str)
        },
        ...mapMutations(['setUserMsg','setPowerCode','setSearchKey','setDataRange'])
    },
    computed:{
        showSearch:function () {
            return ['/contractHomePage','/postIndex','/bill'].includes(this.$route.path)
        },
        ...mapGetters(['getEntry','getUserMsg','getReportTab'])
    },
    watch:{
        getEntry:function (val) {
            this.initSearchComponentParam=`${val.pageType}-${val.activeTab}`
        }
    }
}
</script>

<style scoped lang="less">
    @import "@/assets/common.less";
    .main{
        height: calc(100%);
    }
    .search-bar-other{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        height: 60px;
        background-color: @bg-white;
        position: relative;
        >p{
            position: absolute;
            top: 50%;
            left: 16px;
            transform: translateY(-50%);
            span{
                margin-right: 20px;
            }
        }
        >span {
            font-size: @font-18;
        }
        >div {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: @text-green!important;
        }
    }
    .footer-tabs{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        z-index: 99;
        background-color: @bg-white;
        ul{
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            >li{
                flex: 1;
                text-align: center;
                align-self: center;
                height: 100%;
                box-sizing: border-box;
                padding-top: 8px;
                i{
                    font-size: 24px;
                }
                &.active{
                    color: @text-green;
                }
                >p{
                    font-size: 12px;
                }
            }
        }
    }
</style>
