<template>
    <div class="code-content">
      <p><i class="icon iconfont iconchenggong"></i><span>已成功生成收款单</span></p>
      <div class="code-detail">
          <div class="code">
              <img :src="RQcode" alt="">
              <p class="sm">扫码收款</p>
          </div>
          <div class="money">
              <p><span>订单编号：</span><span>{{payCode}}</span></p>
              <p><span>订单金额（元）：</span><span>{{amount}}</span></p>
          </div>
        </div>
        <!-- <div class="pay-trouble">
              <span @click="toPhone">支付遇到问题？</span>
        </div> -->
      <div class="footer">
          <van-button plain  hairline type="primary"  @click.stop="gopay">返回收款列表</van-button>
      </div>
    </div>
</template>
           
<script>
import {Dialog} from 'vant'
export default{
    name:'bill-code',
    components: {
        [Dialog.name]:Dialog
    },
    data(){
        return {
            amount:'',
            RQcode:'',
            payCode:'',
            show:false,
            callNumber:4001125883
        }
    },
    created(){
        let query=this.$route.query
        this.amount=query.amount
        this.RQcode=query.RQcode
        this.payCode=query.payCode
    },
    methods:{
        toPhone(){
            this.show=true
        },
        gopay(){
            this.$router.push({
                path:'bill'
            })
        }
        // phone(){
        //     window.location.href = `tel://${this.callNumber}`
        //     console.log('phone');
        // }
    }
}
</script>
<style lang='less' scoped>
@import '~@/assets/common.less';
@fontColor:rgba(51,51,51,1);
@fontColor-2:rgba(224,224,224,1);
@fontColor-3:rgba(153,153,153,1);
.warn{
    p{
        text-align: center;
        padding: 25px;
        &:nth-of-type(2){
            padding: 0;
            color: #169BD5;
        }
    }
}
.sm{
    text-align: center;
    color:rgba(51,51,51,1)
}
.code-content{
    height: calc(100% - 60px);
    padding: 0 15px;
    overflow: scroll;
    background-color: rgba(240,240,240,1);
    font-weight: 500;
    font-size: 14px;
    >p:nth-child(1){
        line-height: 50px;
        text-align: center;
        color: @fontColor-3;
        i{
            color:#3EBA70;
        }
        span{
            margin-left: 4px;
        }
    }
    .code-detail{
        height: 415px;
        border-radius: 12px;
        background-color: rgba(255,255,255,1);
        .code{
            height: 315px;
            border-radius: 12px;
            border-bottom: dashed 1px #E0E0E0;
            position: relative;
            text-align: center;
            padding-top: 49px;
            box-sizing: border-box;
            img{
                // position: absolute;
                // left: 50%;
                // top: 50%;
                width:190px;
                height: 190px;
                // transform: translate(-50%,-50%);
            }
            &::before{
                position: absolute;
                content: '';
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color:rgba(240,240,240,1);
                left: 0;
                bottom: -19px;
                transform: translate(-50%,-50%);
            }
            &:after{
                position: absolute;
                content: '';
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color:rgba(240,240,240,1);
                right: 0;
                bottom: 0px;
                transform: translate(50%,50%);
            }
        }
    }
    .money{
        padding: 22px 70px;
        box-sizing: border-box;
        height: 100px;
        p{
            // text-align: center;
            line-height: 25px;
            color: @fontColor-3;
            &:nth-of-type(2){
                span:nth-child(2){
                   color:rgba(51,51,51,1);
                //    &:nth-of-type(1){
                //         position: relative;
                //         left: -8px;
                //         color:@fontColor-3;
                //     } 
                }
            }
            &:nth-of-type(1){
                span:nth-child(2){
                    color:rgba(51, 51, 51, 1)
                }
            }
        }
    }
    .pay-trouble{
        line-height: 49px;
        color:rgba(84,156,244,1);
        text-align: right;
        height: 49px;
    }
    .footer{
        height: 75px;
        button{
            width: 92%;
            position: fixed;
            bottom: 10px;
            box-sizing: border-box;
            /deep/ .van-button__text{
                // color:white!important
            }
        }
        .van-button--primary{
            background-color: @bg-white!important
        }
    }
}
</style>