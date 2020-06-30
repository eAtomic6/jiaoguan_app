import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
// Router.onError((error) => {
//     const pattern = /Loading chunk (\d)+ failed/g;
//     const isChunkLoadFailed = error.message.match(pattern);
//     if (isChunkLoadFailed) {
//         window.location.reload();
//     }else{
//         console.log(error)
//     }
// });
const Index =()=>import('@/pages/index');
const search=()=>import('@/pages/search/searchHome');
const choseCont=()=>import('@/pages/choseCont');

// 合同模块
const contractHomePage =()=>import('@/pages/contract/contractHomePage');
const contractDetail =()=>import('@/pages/contract/contractDetail');
const contractReview =()=>import('@/pages/contract/contractReview');
const contractSignsh =()=>import('@/pages/contract/contractSignsh');
const contractCheck =()=>import('@/pages/contract/contractCheck');
const addContract =()=>import('@/pages/contract/addContract');
const chooseGuest =()=>import('@/pages/contract/chooseGuest');
const editDealReport =()=>import('@/pages/contract/editDealReport');
const contractH5 =()=>import('@/pages/contract/contractH5');
const contractPreview =()=>import('@/pages/contract/contractPreview');
const choosePerson =()=>import('@/pages/contract/choosePerson');

const contractDataBase=()=>import('@/pages/contract/contractDataBase');
const contractBody=()=>import('@/pages/contract/contractBody');
const setReviewer=()=>import('@/pages/contract/setReviewer');

// 财务模块
const bill=()=>import('@/pages/finance/bill');
const billDatails=()=>import('@/pages/finance/billDetails')
const billCreate=()=>import('@/pages/finance/billCreate')
const billCode=()=>import('@/pages/finance/billCode')

// 后期模块
const postIndex =()=>import('@/pages/postSigning/postIndex');
const postReceive =()=>import('@/pages/postSigning/postReceive');
const postDetail =()=>import('@/pages/postSigning/postDetail');
const postManage =()=>import('@/pages/postSigning/postManage');
const postProgress =()=>import('@/pages/postSigning/postProgress');
const postProgressOpera =()=>import('@/pages/postSigning/postProgressOpera');
const postSteps =()=>import('@/pages/postSigning/postSteps');
const postFlow =()=>import('@/pages/postSigning/postFlow');

// 预览
const seeFiles =()=>import('@/components/seeFiles');
export default new Router({
    routes:[
        {
            path:'/',
            component:Index,
            redirect: '/contractHomePage',
            children:[
                {
                    path:'choseCont',
                    component:choseCont,
                },
                {
                    path:'bill',
                    component:bill,
                },
                {
                    path:'billDatails',
                    component:billDatails,
                    meta:{
                        title:'收款详情'
                    }
                },
                {
                    path:'billCreate',
                    component:billCreate,
                    meta:{
                        title:'创建收款'
                    }
                },
                {
                    path:'billCode',
                    component:billCode,
                    meta:{
                        title:'创建收款'
                    }
                },
                {
                    path:'setReviewer',
                    component:setReviewer,
                    meta:{
                        title:'选择审核人'
                    }
                },
                // 合同模块开始
                {
                    path:'contractBody',
                    component:contractBody,
                    meta:{
                        title:'合同主体'
                    }
                },
                {
                    path:'contractDataBase',
                    component:contractDataBase,
                    meta:{
                        title:'上传资料库'
                    }
                },
                {
                    path:'contractHomePage',
                    component:contractHomePage,
                },
                {
                    path:'contractDetail',
                    component:contractDetail,
                    meta:{
                        title:'合同详情'
                    }
                },
                {
                    path:'contractPreview',
                    component:contractPreview,
                    meta:{
                        title:'合同预览'
                    }
                },
                {
                    path:'addContract',
                    component:addContract,
                    meta:{
                        title:'新增合同'
                    }
                },
                {
                    path:'chooseGuest',
                    component:chooseGuest,
                    meta:{
                        title:'选择客源'
                    }
                },
                {
                    path:'editDealReport',
                    component:editDealReport,
                    meta:{
                        title:'编辑成交报告'
                    }
                },
                {
                    path:'contractH5',
                    component:contractH5,
                    meta:{
                        title:'合同正文'
                    }
                },
                {
                    path:'choosePerson',
                    component:choosePerson,
                    meta:{
                        title:'选择签署客户/业主'
                    }
                },
                // 合同模块结束
                {
                    path:'search',
                    component:search
                },
                {
                    path:'contractReview',
                    component:contractReview,
                    meta:{
                        title:'审核详情'
                    }
                },
                {
                    path:'contractSignsh',
                    component:contractSignsh,
                    meta:{
                        title:'合同签后审核'
                    }
                },
                {
                    path:'contractCheck',
                    component:contractCheck,
                    meta:{
                        title:'合同审核'
                    }
                },
                {
                    path:'postIndex',
                    component:postIndex
                },
                {
                    path:'postReceive',
                    component:postReceive,
                    meta:{
                        title:'接收'
                    }
                },
                {
                    path:'postDetail',
                    component:postDetail,
                    meta:{
                        title:'后期详情'
                    }
                },
                {
                    path:'postManage',
                    component:postManage,
                    meta:{
                        title:'后期详情'
                    }
                },
                {
                    path:'postProgress',
                    component:postProgress,
                    meta:{
                        title:'后期进度'
                    }
                },
                {
                    path:'postProgressOpera',
                    component:postProgressOpera,
                    meta:{
                        title:''
                    }
                },
                {
                    path:'postSteps',
                    component:postSteps,
                    meta:{
                        title:'步骤管理'
                    }
                },
                {
                    path:'postFlow',
                    component:postFlow,
                    meta:{
                        title:'更换交易流程'
                    }
                },
                {
                    path:'seeFiles',
                    component:seeFiles,
                    meta:{
                        title:'预览'
                    }
                },
            ]
        }
    ]
})
