<template>
    <div class="view-container">
        <!-- 接收操作切换 -->
        <van-tabs v-model="activeTab" line-width="22px" color="#3EBA70">
            <van-tab v-for="tab in tabs" :key="tab" :title="tab"></van-tab>
        </van-tabs>
        <div v-if="activeTab === 0" class="receive-list content">
            <template v-if="dealList.length>0">
                <ul v-for="(item,index) in dealList" :key="index">
                    <li class="list-item"><span>步骤类型:</span><span>{{item.transactionStepsType}}</span><span :class="index===0||disableFn(item)?'grey':'green'" @click="followUp(item,index)">同上</span></li>
                    <li class="list-item"><span>步骤名称:</span><span>{{item.transactionSteps}}</span></li>
                    <li><span>结算百分比:</span><span>{{percentageFn(item.settlePercent)}}</span></li>
                    <li><span>计划天数:</span><span>{{item.specifiedDay}}</span></li>
                    <li>
                        <van-field class="item" readonly v-model="item.roleName" :disabled="disableFn(item)" label="分配角色:" placeholder="请选择" @click="openFn(item,index)" is-link input-align="right"></van-field>
                    </li>
                    <li class="van-hairline--top">
                        <van-field class="item" readonly v-model="item.personLiableName" :disabled="disableFn(item)" label="选责任人:" placeholder="请选择" @click="openFn(item,index,2)" is-link input-align="right"></van-field>
                    </li>
                </ul>
            </template>
            <div v-if="dealList.length===0&&loading" class="no-data">
                <img :src="getImgUrl('no_data.png')" alt="">
                <p>暂无数据</p>
            </div>
            <div v-if="!loading" class="loading-box" >
                <van-loading type="spinner" color="#3EBA70"  />
            </div>
        </div>
        <div v-show="activeTab === 1" class="content">
            <contractDataBase :preload='true' :fromPost="true"></contractDataBase>
        </div>
        <!-- 操作栏按钮 -->
        <div class="btn" v-if="dealList.length>0">
            <van-button plain type="primary" class="receive none-bg" @click="btnFn()" v-show="receiveComFn(transParams.statusLaterStage)" v-if="power['sign-qh-rev-receive'].state">接收</van-button>
            <van-button type="primary" class="save" @click="btnFn(2,transParams.statusLaterStage)" v-if="power['sign-qh-rev-receive'].state">保存</van-button>
        </div>
        <popList class="search-bar" :list="postListArr" :activeId='popSelect.popSelectId' :state="popShow.popState" :showInput="true" :postFlag="true" v-if="popShow.popState" @chose="confirmChose" @close="popShow.popState=false" @searchList="search"></popList>
    </div>
</template>

<script>
import { Picker, Field, Popup, Loading } from 'vant'
import popList from '@/components/popList.vue';
import contractDataBase from '@/pages/contract/contractDataBase.vue';
import { mapGetters } from 'vuex';

const RECEIVE = {
    receive: 2, //接收
    haveReceive: 3 //已接收
}
export default {
    name: 'post-receive',
    components: {
        [Picker .name]: Picker,
        [Field.name]: Field,
        [Popup.name]: Popup,
        popList,
        contractDataBase,
        [Loading.name]:Loading,
    },
    data() {
        return {
            tabs: ['交易流程指派','合同资料库'],
            activeTab: '',
            dealList: [],
            dealListRole: [],
            transParams: {
                contractCode: '',
                transFlowCode: '',
                dealAgentId: '',
                dealagentStoreId: '',
                statusLaterStage: ''
            },
            popShow: {
                popState: false
            },
            postListArr: [],
            copyPostListArr: [],
            popSelect: {
                popSelectId: '',
                popSelectType: '',
                popSelectIndex: ''
            },
            loading: false
        }
    },
    created() {
        let query = this.$route.query
        this.transParams = {
            contractCode: query.id,
            transFlowCode: query.transFlowCode,
            dealAgentId: query.dealAgentId,
            dealagentStoreId: query.dealagentStoreId,
            statusLaterStage: query.statusLaterStage
        }
        this.getRoles()
    },
    methods: {
        getImgUrl:function(url){
            return require('@/assets/img/'+url);
        },
        receiveComFn(state) {
            if (state == RECEIVE.receive) {
                return true
            } else {
                return false
            }
        },
        search(res) {
            if(res.keyword) {
                let arr = this.copyPostListArr.filter(item=>{
                    let str = item.name
                    return str.includes(res.keyword)
                })
                this.postListArr = [...arr]
            } else {
                this.postListArr = [...this.copyPostListArr]
            }
        },
        btnFn(type=1,state) {
            let arr = [...this.dealList]
            let bool = true
            arr.map(e => {
                e.contractCode = this.transParams.contractCode
                if (!e.personLiableName) {
                    bool = false
                }
            })
            let url = 'addStepFlow'
            if(type === 1) {
                if(!bool) {
                    this.$toast('请将交易步骤分配完，才能接收并开始办理后期')
                    return false
                }
            } else {
                url = 'saveStepFlow'
                if(state == RECEIVE.haveReceive && !bool) {
                    this.$toast('数据不能为空')
                    return false
                }
            }
            this.$ajax.postJSON(`/api/postSigning/${url}`, arr).then(res => {
                res = res.data
                if (res.status === 200) {
                    this.$toast(`后期${type===1?'接收':'保存'}成功~`)
                    this.$router.go(-1)
                }
            }).catch(err => {
                this.$toast(err)
            })
        },
        followUp(e,i) {
            if (!this.disableFn(e)) {
                if (i === 0) {
                    this.$toast('本步骤没有上一步，请手动进行分配')
                } else {
                    let arr = this.dealList[i - 1]
                    let roleId = arr.roleId
                    let roleName = arr.roleName
                    let personLiableCode = arr.personLiableCode
                    let personLiableName = arr.personLiableName
                    let obj = Object.assign(this.dealList[i], {
                        roleId,
                        roleName,
                        personLiableCode,
                        personLiableName
                    })
                    this.$set(this.dealList, i, obj)
                }
            }
        },
        confirmChose(val) {
            this.popShow.popState = false
            if(val) {
                let obj = this.dealList[this.popSelect.popSelectIndex]
                if(this.popSelect.popSelectType === 1) {
                    obj.roleId = val.key
                    obj.roleName = val.value
                    obj.personLiableCode = ''
                    obj.personLiableName = ''
                } else {
                    obj.personLiableCode = val.empId
                    obj.personLiableName = val.name
                }
            }
        },
        disableFn(e) {
            // 2 已办理 4 不可办理
            if (!e.stepState) {
                return false
            }
            if (e.stepState.value === 2 || e.stepState.value === 4) {
                return false
            } else {
                return true
            }
        },
        getEmployeeFn(e) {
            this.$ajax.get('/api/employee/postsigning/duty',{
                roleId:e.roleId,
                empId:this.transParams.dealAgentId,
                depId:this.transParams.dealagentStoreId,
            }).then(res=>{
                res = res.data
                if(res.status === 200){
                    if(res.data.length) {
                        let arr = [...res.data]
                        arr.map(e=>{
                            e.id = e.empId
                        })
                        this.postListArr = [...arr]
                        this.copyPostListArr = [...arr]
                        this.popShow.popState = true
                    } else {
                        this.$toast('分配的角色下无责任人')
                    }
                }
            }).catch(err=>{
                this.$toast(err)
            })
        },
        openFn(e,i,type=1) {
            if(!this.disableFn(e)){
                this.popSelect = {
                    popSelectId: type===1?e.roleId:e.personLiableCode||-99,
                    popSelectType: type,
                    popSelectIndex: i
                }
                if(type === 1) {
                    this.postListArr = [...this.dealListRole]
                    this.copyPostListArr = [...this.dealListRole]
                    this.popShow.popState = true
                } else {
                    if(!!e.roleName) {
                        this.getEmployeeFn(e)
                    } else {
                        this.$toast('请先分配角色~')
                    }
                }
            }
        },
        percentageFn(val){
            if(val > 0){
                return `${val}%`
            }else{
                return '--'
            }
        },
        getRoles() {
            this.$ajax.get('/api/roles').then(res => {
                res = res.data
                if(res.status === 200) {
                    let arr = [...res.data]
                    arr.map(e=>{
                        e.id = e.key
                        e.name = e.value
                    })
                    this.dealListRole = [...arr]
                }
            }).catch(err => {
                this.$toast(err)
            })
        },
        getReceiveData() {
            this.$ajax.get('/api/postSigning/clickReceive', {
                contractCode: this.transParams.contractCode,
                transFlowCode: this.transParams.transFlowCode
            }).then(res => {
                res = res.data
                if(res.status === 200) {
                    let arr = [...res.data];
                    arr.map(e => {
                        if(e.roleId == 0) {
                            e.roleId = ""
                        }
                        this.dealListRole.find(item=>{
                            if(e.roleId === item.key) {
                                e.roleName = item.value
                            }
                        })
                    })
                    this.dealList = arr;
                    this.loading = true
                }
            }).catch(err =>{
                this.loading = true
                this.$toast(err)
            })
        }
    },
    watch: {
        dealListRole(val) {
            if(val.length) {
                this.getReceiveData()
            }
        }
    },
    computed: {
        power() {
            return this.getPowerCode
        },
        ...mapGetters([
            'getPowerCode'
        ]),
    }
}
</script>

<style scoped lang="less">
@import '~@/assets/common.less';
/deep/ .van-tab__text {
    font-size: 16px;
}
.content {
    position: absolute;
    top: 105px;
    left: 0;
    right: 0;
    bottom: 75px;
    overflow: auto;
    // -webkit-overflow-scrolling: touch;
    background-color: @bg-grey;
}
.receive-list {
    ul {
        padding: 10px 10px 0;
        border-radius: 2px;
        li {
            overflow: hidden;
            background-color: white;
            font-size: 14px;
            padding: 0 15px;
            span:first-child {
                color: @text-grey-BBB;
            }
            span:nth-child(2) {
                display: inline-block;
                width: 60%;
                word-wrap: break-word;
                margin-left: 10px;
            }
            &.list-item span:first-child {
                float: left;
            }
            &:first-child span:last-child {
                float: right;
            }
            &:first-child {
                padding-top: 15px;
            }
            .grey {
                color: @text-grey-BBB;
            }
            .green {
                color: @text-green;
            }
            .item {
                background-color: white;
                padding-left: 0;
                padding-right: 0;
                /deep/ .van-cell__title {
                    color: @text-grey-BBB;
                }
            }
        }
    }
    .no-data {
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
    .loading-box {
        position: absolute;
        top: 0;
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
}
.btn {
    position: absolute;
    bottom: 0;
    height: 75px;
    width: 100%;
    padding: 0 14px;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    align-items: center;
    .receive {
        flex: 1;
        margin-right: 15px;
    }
    .save {
        flex: 1;
    }
}
.search-bar {
    /deep/ .van-field {
        background-color: #EBEBEB;
        border-radius: 4px;
        width: 70%;
    }
}
.van-button.none-bg {
    background-color: @text-white!important;
    border: 1px solid #3DB96F!important;
}
</style>