<template>
  <div class="review-datail" ref="maindetails">
    <van-cell-group class="group">
      <van-cell title="合同编号" :value="detailList.code" />
      <van-cell title="房源" :value="houseInfo" />
      <van-cell title="客源" :value="clientInfo" />
      <van-cell title="签约方式" :value="detailList.recordType&&detailList.recordType.label" />
      <van-cell title="合同类型" :value="detailList.contType&&detailList.contType.label" />
      <van-cell title="物业地址" :value="porAddr" />
      <van-cell
        :title="contType==2||contType==3?'成交总价':contType==1?'租金':contType==4?'意向金额':'定金金额'"
        :value="reviewType=='auditList'?detailList.dealPrice:detailList.price"
      />
      <van-cell title="成交经纪人" :value="agentInfo" >
        <template>
          <p v-if="isAu">
            <span v-if="!detailList.dealAgentStoreName&&!detailList.dealAgentName">-</span>
            <span v-else>
              <span v-if="detailList.dealAgentStoreName">{{detailList.dealAgentStoreName}}</span><span v-else>-</span>
              <span v-if="detailList.dealAgentName">{{'-'+detailList.dealAgentName}}</span><span v-else>-</span>
            </span>
          </p>
          <p v-else>
            <span v-if="!detailList.dealAgentStoreName&&!detailList.dealName">-</span>
            <span v-else>
              <span v-if="detailList.dealAgentStoreName">{{detailList.dealAgentStoreName}}</span><span v-else>-</span>
              <span v-if="detailList.dealName">{{'-'+detailList.dealName}}</span><span v-else>-</span>
            </span>
          </p>
        </template>
      </van-cell>
      <van-cell title="签约时间" :value="Number(detailList.signDate) | formatTime" />
      <van-cell title="上传合同主体时间" :value="Number(uploadTime) | formatTime" />
      <van-cell title="审核时间" :value="Number(autTime) | formatTime" />
      <van-cell title="当前审核人" >
        <template #right-icon>
          <p v-if="isAu">
            <span v-if="(!detailList.auditName)||detailList.toExamineState.value!==0">-</span>
            <span v-else>
              <span v-if="detailList.auditStoreName">{{detailList.auditStoreName}}</span><span v-else>-</span>
              <span v-if="detailList.auditName">{{'-'+detailList.auditName}}</span><span v-else>-</span>
            </span>
          </p>
          <p v-else>
            <span v-if="(!detailList.currentReviewer)||detailList.state.value!==0">-</span>
            <span v-else>
              <span v-if="detailList.currentReviewerDep">{{detailList.currentReviewerDep}}</span><span v-else>-</span>
              <span v-if="detailList.currentReviewer">{{'-'+detailList.currentReviewer}}</span><span v-else>-</span>
            </span>
          </p>
        </template>
      </van-cell>
      <van-cell title="下一步审核人">
        <template #right-icon>
          <p v-if="isAu">
            <span v-if="!detailList.nextAuditStoreName&&!detailList.nextAuditName">-</span>
            <span v-else>
              <span v-if="detailList.nextAuditStoreName">{{detailList.nextAuditStoreName}}</span><span v-else>-</span>
              <span v-if="detailList.nextAuditName">{{'-'+detailList.nextAuditName}}</span><span v-else>-</span>
            </span>
          </p>
          <p v-else>
            <span v-if="!detailList.nextReviewerDep&&!detailList.nextReviewer">-</span>
            <span v-else>
              <span v-if="detailList.nextReviewerDep">{{detailList.nextReviewerDep}}</span><span v-else>-</span>
              <span v-if="detailList.nextReviewer">{{'-'+detailList.nextReviewer}}</span><span v-else>-</span>
            </span>
          </p>
        </template>
      </van-cell>
      <van-cell v-if="(detailList.toExamineState&&detailList.toExamineState.label=='已驳回')||(detailList.state&&detailList.state.label=='已驳回')" title="驳回原因" 
      :value="detailList.toExamineState?detailList.remarksExamine:detailList.remarks" />
    </van-cell-group>
  </div>
</template>
           
<script>
import { mapGetters } from "vuex";
export default {
    name: "reviewDetial",
    props: {
    //审核类型
        reviewType: {
            type: String,
            default: ""
        },
        detailList: {
            type: Object,
            default: function() {
                return {};
            }
        },
        //合同类型
        contType: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            title2: ""
        };
    },
    methods: {
        //添加水印
        watermark() {
            this.$nextTick(() => {
                this.$tool.waterMark(
                    `${this.getUserMsg.user.depName}${this.getUserMsg.user.name}${this.getUserMsg.user.mobile}`,
                    this.$refs.maindetails,
                    false
                );
            });
        }
    },
    watch: {},
    computed: {
        ...mapGetters(["getUserMsg"]),
        // showRejectReason(){
        //   if(detailList.toExamineState&&detailList.toExamineState.label=='已驳回'){
        //     return ttue
        //   }else{

        //   }
        // },
        houseInfo() {
            if (this.reviewType == "auditList") {
                return (
                    this.detailList.houseinfoCode + "-" + this.detailList.showOwnerName
                );
            } else {
                return this.detailList.honseCode + "-" + this.detailList.showOwnerName;
            }
        },
        clientInfo() {
            if (this.reviewType == "auditList") {
                return (
                    this.detailList.guestinfoCode + "-" + this.detailList.showCustName
                );
            } else {
                return this.detailList.guestCode + "-" + this.detailList.showCustName;
            }
        },
        porAddr() {
            if (this.reviewType == "auditList") {
                return this.detailList.propertyAddr;
            } else {
                return this.detailList.property_addr;
            }
        },
        autTime() {
            if (this.reviewType == "auditList") {
                return this.detailList.auditTime;
            } else {
                return this.detailList.updateTime;
            }
        },
        agentInfo() {
            if (this.reviewType == "auditList") {
                return (
                    this.detailList.dealAgentStoreName +
          "-" +
          this.detailList.dealAgentName
                );
            } else {
                return (
                    this.detailList.dealAgentStoreName + "-" + this.detailList.dealName
                );
            }
        },
        auditer() {
            if (this.reviewType == "auditList") {
                return this.detailList.auditStoreName + "-" + this.detailList.auditName;
            } else {
                return (
                    this.detailList.currentReviewerDep +
          "-" +
          this.detailList.currentReviewer
                );
            }
        },
        uploadTime() {
            if (this.reviewType == "auditList") {
                return this.detailList.uploadTime;
            } else {
                return this.detailList.upTime;
            }
        },
        isAu(){
            return this.reviewType == "auditList"
        }
        // nextAuditer() {
        //   if (this.reviewType == "auditList") {
        //     return (
        //       this.detailList.nextAuditStoreName +
        //       "-" +
        //       this.detailList.nextAuditName
        //     );
        //   } else {
        //     return (
        //       this.detailList.nextReviewerDep + "-" + this.detailList.nextReviewer
        //     );
        //   }
        // }
    },
    created() {
        this.watermark();
    }
};
</script>
<style lang="less" scoped>
.van-hairline--top-bottom::after {
  border-width: 0px 0 !important;
}
.van-cell::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 4.26667vw;
  border-bottom: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.review-datail {
  height: calc(100% - 60px);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.group {
  /deep/ .van-cell::after {
    right: 4.26667vw !important;
    // border-bottom:solid 2px #ebedf0!important;
  }
  .van-cell__title {
    span {
      color: #969799;
    }
  }
  .van-cell__value {
    span {
      color: #323233;
    }
  }
}
</style>