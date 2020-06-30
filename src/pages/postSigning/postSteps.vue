<template>
    <div class="view-container">
        <div class="box-select">
            <p class="title">已选步骤</p>
            <ul>
                <li v-for="(item,index) in copyProcessData" :key="index" class="van-hairline--bottom">
                    <p class="w80">
                        <i class="iconfont icontubiao_shiyong-4" :class="noEditFn(item.stepState.value)?'color-grey':''" @click="operationFn(index,item)"></i>
                        <span class="text-mid" :class="item.stepState.value ===2?'color-red':noEditFn(item.stepState.value)?'color-grey':''">{{item.transactionStepsType}}/{{item.transactionSteps}}</span>
                    </p>
                </li>
            </ul>
        </div>
        <div class="box-select">
            <p class="title">添加步骤</p>
            <template v-for="(item,index) in stepsData">
                <ul :key="item.typeId" v-if="item.flag">
                    <li class="type-name van-hairline--bottom">
                        <p class="w100"><i class="iconfont icontubiao_shiyong-10" @click="addFn('all',index,item)"></i><span class="text-long">{{item.typeName}}</span></p>
                    </li>
                    <template v-for="(ele,e) in item.stepsList">
                        <li :key="ele.id" v-if="ele.bool" class="van-hairline--bottom">
                            <p class="w100"><i class="iconfont icontubiao_shiyong-10" @click="addFn('single',index,ele,e)"></i><span class="text-long">{{ele.name}}</span></p>
                        </li>
                    </template>
                </ul>
            </template>
        </div>
        <!-- <div class="btn-sure">
            <span @click="sureFn">确认</span>
        </div> -->
    </div>
</template>

<script>
import { postMixin } from '@/assets/js/postMixin';

export default {
    name: 'post-steps',
    mixins: [postMixin],
    data() {
        return {
            stepsData: [],
            copyProcessData: [],
            id: ''
        }
    },
    created() {
        this.getAllStep()
        this.copyProcessData = JSON.parse(JSON.stringify(this.processData))
        this.id = this.$route.query.id
    },
    mounted() {
        let that=this
        this.$EventBus.$on('btnSureFn',function () {
            that.sureFn()
        })
    },
    beforeDestroy(){
        this.$EventBus.$off('btnSureFn')
    },
    methods: {
        getAllStep() {
            this.$ajax.post('/api/flowmanage/selectTypeStepsList',{
                cityId: this.cityId
            }).then(res => {
                res = res.data
                if(res.status === 200){
                    let arr = [...res.data]
                    arr.map(e => {
                        let n = 0
                        e.flag = true
                        e.stepsList.map(i => {
                            i.bool = true
                            i.stepState = {
                                label: '不可办理',
                                value: 4
                            }
                            i.transactionStepsType = i.stepsTypeName
                            i.transactionSteps = i.name
                            i.transactionStepsCode = i.id
                            this.copyProcessData.forEach(t => {
                                if(t.transactionStepsCode === i.id){
                                    n++
                                    i.bool = false
                                    i.stepState = {...t.stepState}
                                    if(n === e.stepsList.length){
                                        e.flag = false
                                    }
                                }
                            })
                        })
                    })
                    this.stepsData = [...arr]
                }
            }).catch(err=>{
                this.$toast(err);
            })
        },
        noEditFn(val,type=1) {
            if(type === 1) {
                return [1,3,5].includes(val)
            }
        },
        operationFn(index,obj) {
            if(this.noEditFn(obj.stepState.value)) {
                this.$toast('该步骤已办理，无法调整~')
                return
            }
            this.copyProcessData.splice(index, 1)
            this.stepsData.map(e => {
                e.stepsList.map(i => {
                    if(obj.transactionStepsCode === i.id) {
                        i.bool = true
                        e.flag = true
                    }
                })
            })
        },
        addFn(type,index,obj,e) {
            if(type === 'single') {
                this.stepsData[index].stepsList[e].bool = false
                this.stepsData[index].flag = this.stepsData[index].stepsList.some(item => item.bool)
                this.copyProcessData.push(obj)
            } else {
                if(obj.stepsList.length===0) {
                    this.$toast('该步骤类型下无交易步骤')
                    return
                }
                this.stepsData[index].flag = false
                let arr = obj.stepsList.filter(item => item.bool)
                this.stepsData[index].stepsList.forEach(item => item.bool = false)
                this.copyProcessData = [...this.copyProcessData,...arr]
            }
        },
        sureFn() {
            let arr = []
            let arr2 = []
            let steps = []
            this.processData.map(e => {
                arr.push(e.transactionStepsCode)
            })
            this.copyProcessData.map(e => {
                arr2.push(e.transactionStepsCode)
            })
            this.stepsData.map(i => {
                i.stepsList.map(t => {
                    if(!t.bool) {
                        delete t.bool
                        delete t.stepState
                        delete t.transactionStepsType
                        delete t.transactionSteps
                        delete t.transactionStepsCode
                        t.transStepsAttach = ''
                        steps.push(t)
                    }
                })
            })
            // 是否修改了
            if(arr.join() === arr2.join()) {
                // 没有修改
                this.$router.go(-1)
            } else {
                // 修改了
                this.$ajax.postJSON('/api/postSigning/updateStepInstance',{
                    contractCode: this.id,
                    steps,
                }).then(res => {
                    res = res.data
                    if(res.status === 200){
                        this.$toast('步骤修改成功~')
                        this.$router.go(-1)
                    }
                }).catch(err => {
                    this.$toast(err)
                })
            }
        }
    },
    computed: {
        cityId() {
            return this.getUserMsg.user.cityId
        },
        processData() {
            return this.getPostProgressData
        }
    }
}
</script>

<style scoped lang="less">
@import "~@/assets/common.less";

.view-container {
    height: calc(100% - 60px);
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: @bg-grey;
    padding: 0 10px 10px;
    box-sizing: border-box;
}
.box-select {
    p.title {
        margin: 14px 0;
    }
    ul {
        background-color: @bg-white;
        border-radius: 5px;
        margin-top: 14px;
    }
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        position: relative;
        // &:not(:last-child)::before {
        //     content: '';
        //     width: 91%;
        //     height: 1px;
        //     position: absolute;
        //     bottom: 0;
        //     background-color: @bg-grey-E0E0E1;
        // }
        &.type-name {
            background-color: @bg-light-green;
        }
        p {
            &.w80 {
                width: 80%;
            }
            &.w100 {
                width: 100%;
            }
            i {
                color: @text-green;
                font-size: 20px;
                &:first-child {
                    margin-right: 15px;
                }
                &:last-child {
                    transform: rotate(180deg);
                }
                &.iconfont {
                    float: left;
                }
            }
            .color-grey {
                color: @text-grey-BBB;
            }
            .color-red {
                color: @text-red;
            }
            span {
                display: inline-block;
                word-wrap: break-word;
                color: @text-grey-333;
            }
            .text-long {
                width: 85%;
            }
            .text-mid {
                width: 80%;
            }
        }
    }
}
.btn-sure {
    position: absolute;
    top: 20px;
    right: 12px;
    color: @text-green;
}
</style>