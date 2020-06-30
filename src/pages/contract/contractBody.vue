<template>
  <div class="contract-body" :class="{'body-minheight':!getPreLoad}">
    <ul class="pdf-bodies">
      <li class="van-hairline--bottom" v-for="(item,index) in bodySource" :key="index">
        <img v-if="recordType==10" class="icon-pdf" :src="iconPDF | getType" alt />
        <i v-else class="icon iconfont icon-pdf" :class="item.fileType|getType"></i>
        <span class="zt-name van-ellipsis">{{item.name}}</span>
        <span v-if="power['sign-ht-xq-main-down'].state" class="btn-download">
          <i class="icon iconfont icondownload" @click.stop="download(item)"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "contractBody",
    props: {
        preload: {
            //是否只读
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            bodySource: [],
            iconPDF: require("@/assets/img/icon-pdf.png"),
            contId: "",
            recordType: 1 //1=线上线下
        };
    },
    created() {
        this.contId = Number(this.$route.query.id);
        this.recordType = Number(this.$route.query.recordType);
        this.getData();
    },
    methods: {
    //获取合同主体,为bodySource赋值
        getData: function() {
            this.$ajax
                .get("/api/contract/getContractBodyById", { id: this.contId })
                .then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        this.bodySource = [].concat(res.data);
                    }
                });
        },
        //下载合同主体
        download: function(item) {
            this.fileSign([item.path], "download");
        },
        /**
     * 获取签名
     */
        fileSign: async function(arr, type) {
            let param = { urls: arr.join(",") };
            if (type === "download") {
                param.rct = "application%2Foctet-stream";
            }
            // param.style='jjw-watermark'
            let result = await this.$ajax
                .put("/api/load/generateAccessURLBatch", param, 2)
                .then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        if (type === "download") {
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
                        } else {
                            //图片缩略图使用
                            return res.data;
                        }
                    }
                });
            if (result) {
                return Promise.resolve(result);
            }
        }
    },
    computed: {
        getPreLoad: function() {
            return this.preload;
        },
        ...mapGetters(["getUserMsg", "getPowerCode"]),
        power() {
            return this.getPowerCode;
        }
    },
    filters: {
        getType: function(val) {
            switch (val.toLocaleLowerCase()) {
            case ".png":
            case ".jpg":
            case ".jpeg":
            case ".gif":
            case ".bmp":
                return "iconicon-tupian";
            case ".mp3":
            case ".mpeg":
            case ".cd":
            case ".wave":
            case ".aiff":
                return "icon-yinpin1";
            case ".mp4":
            case ".avi":
            case ".rmvb":
            case ".wmv":
            case ".mkv":
                return "icon-shipin1";
            case ".txt":
                return "iconicon-wendang";
            case ".pdf":
                return "iconpdf";
            case ".xls":
            case ".xlsx":
                return "iconexcel";
            case ".docx":
            case ".doc":
                return "iconword";
            case ".ppt":
                return "iconppt";
            case ".zip":
            case ".rar":
                return "iconicon-yasuobao";
            default:
                return "iconicon-qita";
            }
        }
    }
};
</script>

<style scoped lang="less">
@import "@/assets/common.less";
.icon-pdf {
  width: 40px;
  height: 40px;
  font-size: 40px;
  display: flex;
  align-items: center;
}
.zt-name {
  display: inline-block;
  max-width: 250px;
}
.contract-body {
  &.body-minheight {
    min-height: calc(100% - 60px);
  }
  background-color: @bg-grey;
  padding-top: 10px;
  box-sizing: border-box;
}
.pdf-bodies {
  > li {
    padding: 10px 16px;
    background-color: @bg-white;
    display: flex;
    align-items: center;
    span {
      margin-left: 6.6px;
      &.btn-download {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        > i {
          font-size: 30px;
        }
      }
    }
  }
}
</style>
