<template>
  <div class="database" :class="{'min-height':!getPreLoad}">
    <ul class="uploader-list" :class="{'no-margin':getPreLoad}">
      <template v-for="item in uploaderList">
        <li :key="item.type" v-if="item.child&&item.child.length>0">
          <p>{{item.name}}</p>
          <ul class="details-list">
            <li v-for="(child) in item.child" :key="child.id">
              <p>{{child.name}}</p>
              <template v-if="child.list.length>0">
                <div class="gallery">
                  <div class="gallery-item" v-for="(file,fileIndex) in child.list" :key="file.path">
                    <div class="picture" @click="showGallery(file)">
                      <i
                        v-if="!isPictureFile(file.fileType)"
                        class="icon iconfont"
                        :class="file.fileType|getType"
                        @click.stop="fileSign([file.path],'download')"
                      ></i>
                      <img v-else :src="file.path|getSignImage(fileList)" :alt="file.name" />
                    </div>
                    <p class="van-ellipsis fileName">{{file.name}}</p>
                    <p
                      class="float-close"
                      v-if="power['sign-ht-xq-data'].state&&!getPreLoad"
                      @click="deleteFile(fileIndex,child.list,child.isNecessary)"
                    >
                      <img :src="iconClose" alt="close" />
                    </p>
                  </div>
                  <div
                    v-if="!getPreLoad"
                    class="gallery-item uploader-btn"
                    @click="getFile(item.type,child.id)"
                  >
                    <i class="icon iconfont icontianjiatupian"></i>
                    <span class="littleName">点击上传{{child.name}}</span>
                  </div>
                </div>
              </template>
              <template v-else-if="!getPreLoad">
                <div class="gallery">
                  <div class="gallery-item uploader-btn" @click="getFile(item.type,child.id)">
                    <i class="icon iconfont icontianjiatupian"></i>
                    <span class="littleName">点击上传{{child.name}}</span>
                  </div>
                </div>
              </template>
              <span v-else>无</span>
            </li>
          </ul>
        </li>
      </template>
    </ul>
    <p class="uploader-submit" v-if="!getPreLoad">
      <van-button type="primary" @click="uploadFiles">确认</van-button>
    </p>
    <van-image-preview v-model="galleryShow" :images="fileList" :startPosition="startIndex">
      <!--  <template v-slot:index>第{{ index }}页</template>-->
    </van-image-preview>
    <!-- 相机相册选择弹窗 -->
    <fileSelect :state="dialog" @close="closeDialog" @chose="getSrc"></fileSelect>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import { mapGetters } from "vuex";
import fileSelect from "@/components/fileSelect";
export default {
    name: "contractDataBase",
    components: {
        [ImagePreview.Component.name]: ImagePreview.Component,
        fileSelect
    },
    props: {
        preload: {
            //是否只读
            type: Boolean,
            default: false
        },
        fromPost: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            uploaderList: [
                { name: "业主", type: 2, child: [] },
                { name: "客户", type: 1, child: [] },
                { name: "其他", type: 3, child: [] }
            ],
            fileList: [],
            isHavaData: 0, //是否上传过资料库
            contractId: "", //合同id
            galleryShow: false,
            startIndex: 0, //图片预览起始位置索引
            iconClose: require("@/assets/img/icon-close.png"),

            // 选择图片弹窗
            dialog: false,
            clickType: "",
            clickId: ""
        };
    },
    created() {
        let param = this.$route.query;
        this.contractId = param.id;
        this.getTitle().then(() => {
            //getTitle方法必须在前
            if (param.isHaveData || this.fromPost) {
                if (!this.fromPost) this.isHavaData = param.isHaveData;
                this.getContData();
            }
        });
    },
    mounted() {
        let that = this;
        this.$EventBus.$on("showDialog", function() {
            that.$dialog
                .confirm({
                    title: "确认取消上传？",
                    message: "已上传的照片将会被删除",
                    className: "database-confirm",
                    confirmButtonText: "继续上传",
                    cancelButtonText: "确认取消"
                })
                .then(res => {
                    //...
                })
                .catch(err => {
                    that.$router.go(-1);
                });
        });
    },
    beforeDestroy() {
        this.$EventBus.$off("showDialog");
    },
    methods: {
        showGallery: function(val) {
            let a;
            this.fileList.forEach((element, index) => {
                if (element.indexOf(val.path) > -1) {
                    a = index;
                }
            });
            this.startIndex = a;
            this.galleryShow = true;
        },
        getFile(type, id) {
            //type当前点击项的大类  id当前点击项id
            this.clickType = type;
            this.clickId = id;
            this.dialog = true;
        },
        //关闭弹窗
        closeDialog() {
            this.dialog = false;
        },
        //上传oss成功
        getSrc(src) {
            let preloadList = [];
            src.forEach(element => {
                let fileType = this.get_suffix(element.name);
                element.fileType = fileType;
                preloadList.push(element.path);
            });
            this.fileSign(preloadList, "preload").then(res => {
                this.fileList = this.fileList.concat(res);
            });
            this.uploaderList.forEach(element => {
                if (element.type === this.clickType) {
                    element.child.forEach(item => {
                        if (item.id === this.clickId) {
                            item.list = item.list.concat(src);
                        }
                    });
                }
            });
        },
        //对接原生上传
        /*getFile:function(file,details) {
            file.forEach(item=>{
                let fileRead=new FileReader();
                fileRead.onload=function (res) {
                    let canvas=document.createElement('canvas');
                    let img=canvas.getContext('2d');
                    console.log(this.result)
                }
                fileRead.readAsDataURL(item.file)
            })
        },*/
        deleteFile: function(index, parent, isNecessary) {
            if (this.isHavaData) {
                if (!isNecessary || parent.length > 1) {
                    parent.splice(index, 1);
                } else {
                    this.$toast("至少保留一个，请勿删除");
                }
            } else {
                parent.splice(index, 1);
            }
        },
        //获取资料库详细分类
        getTitle: function() {
            return new Promise((resove, rejectd) => {
                this.$ajax
                    .get("/api/contract/getContDataTypeById", { id: this.contractId })
                    .then(res => {
                        res = res.data;
                        if (res.status === 200) {
                            // let test_str="[{\"id\": 51, \"name\": \"身份证\", \"type\": \"1\", \"isDel\": 0, \"cityId\": 40, \"isNecessary\": 0}, {\"id\": 52, \"name\": \"业主证\", \"type\": \"2\", \"isDel\": 0, \"cityId\": 40, \"isNecessary\": 1}, {\"id\": 53, \"name\": \"资格证\", \"type\": \"3\", \"isDel\": 0, \"cityId\": 40, \"isNecessary\": 1}, {\"id\": 54, \"name\": \"测试11\", \"type\": \"2\", \"isDel\": 0, \"cityId\": 40, \"isNecessary\": 1}]";
                            let titleList = JSON.parse(res.data);
                            // let titleList=JSON.parse(test_str)//假数据用
                            titleList.forEach(item => {
                                item.list = [];
                                if (Number(item.type) === 1) {
                                    this.$set(
                                        this.uploaderList[1],
                                        "child",
                                        this.uploaderList[1].child.concat(item)
                                    );
                                } else if (Number(item.type) === 2) {
                                    this.$set(
                                        this.uploaderList[0],
                                        "child",
                                        this.uploaderList[0].child.concat(item)
                                    );
                                } else {
                                    this.$set(
                                        this.uploaderList[2],
                                        "child",
                                        this.uploaderList[2].child.concat(item)
                                    );
                                }
                            });
                            resove();
                        }
                    })
                    .catch(error => {
                        this.$toast(error);
                        rejectd();
                    });
            });
        },
        //上传资料库‘/contract/uploadContData’
        uploadFiles: function() {
            let datas = [];
            this.uploaderList.forEach(item => {
                if (item.child.length > 0) {
                    item.child.forEach(tip => {
                        datas.push({
                            isrequire: tip.isNecessary,
                            kind: item.type,
                            title: tip.name,
                            value: tip.list
                        });
                    });
                }
            });

            for (let i = 0; i < datas.length; i++) {
                if (datas[i].isrequire && datas[i].value.length === 0) {
                    this.$toast(`${datas[i].title}不能为空`);
                    return;
                }
            }
            let param = {
                datas: datas,
                contId: this.contractId,
                operation: 1
            };
            this.$ajax
                .postJSON("/api/contract/uploadContData", param)
                .then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        this.$toast("资料库上传成功");
                        this.$router.push({
                            path: "/contractHomePage"
                        });
                    }
                })
                .catch(error => {
                    this.$toast(error);
                });
        },
        //获取合同资料库信息
        getContData() {
            let param = {
                id: this.contractId
            };
            this.$ajax.get("/api/contract/getContAttachmentById", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    if (!res.data) {
                        return;
                    }
                    let pathList = [];
                    let address = JSON.parse(res.data.address);
                    address.forEach(element => {
                        element.value.forEach(item => {
                            let fileType = this.get_suffix(item.name);
                            item.fileType = fileType;
                            pathList.push(item);
                        });
                        this.uploaderList.find((item, index) => {
                            if (item.type == element.kind) {
                                item.child.find((tip, tipIndex) => {
                                    if (tip.name === element.title) {
                                        let copyItem = JSON.parse(JSON.stringify(item));
                                        copyItem.child[tipIndex]["list"] = element.value;
                                        this.uploaderList.splice(index, 1, copyItem);
                                        // this.$set(tip,'list',element.value)
                                    }
                                });
                            }
                        });
                    });
                    let preloadList = [];
                    pathList.forEach((item, index) => {
                        //判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
                        if (this.isPictureFile(item.fileType)) {
                            preloadList.push(item.path);
                        }
                    });
                    this.fileSign(preloadList, "preload").then(res => {
                        this.fileList = [].concat(res);
                    });
                }
            });
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
        },
        // 判断是否为图片类别
        isPictureFile(type) {
            let lowType = type.toLowerCase();
            return [".png", ".jpg", ".jpeg", ".gif", ".bmp"].includes(lowType);
        },
        //获取文件的后缀
        get_suffix(filename) {
            let pos = filename.lastIndexOf(".");
            let suffix = "";
            if (pos != -1) {
                suffix = filename.substring(pos);
            }
            return suffix;
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
    /**
     * 过滤显示图片缩略图
     * @param val后端返回的所有文件资源遍历的当前项
     * @param list图片资源获取签名后的临时数组
     */
        getSignImage(val, list) {
            if (list.length === 0) {
                return "";
            } else {
                return list.find(item => {
                    return item.includes(val);
                });
            }
        },
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
.database {
  &.min-height {
    height: calc(100% - 60px);
    overflow: auto;
    // -webkit-overflow-scrolling: touch;
  }
  background-color: @bg-grey;
  padding-top: 10px;
  box-sizing: border-box;
}
.no-margin {
  margin: 0 !important;
}

.uploader-submit {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: @bg-white;
  /deep/.van-button {
    width: 90%;
  }
}
.uploader-list {
  margin-bottom: 120px;
  > li {
    min-height: 125px;
    padding: 14px;
    margin-bottom: 10px;
    background-color: @bg-white;
    &:last-of-type {
      margin-right: 0;
    }
    > p {
      &:first-of-type {
        font-size: @font-16;
      }
    }
  }
}
.details-list {
  > li {
    margin-bottom: 10px;
    &:last-of-type {
      margin: 0;
    }
    > p {
      font-size: @font-base;
      color: @text-grey-999;
      padding: 13px 0;
    }
  }
}
.uploader-btn {
  position: relative;
  margin-right: 10px;
  > i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -75%);
    font-size: 30px;
    color: @text-grey-DDD;
  }
  .littleName {
    display: inline-block;
    width: 100px;
    color: @text-grey-999;
    font-size: 12px;
    position: absolute;
    top: 65%;
    left: 50%;
    transform: translateX(-50%);
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
  }
}
.gallery {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 162px;
    height: 122px;
    border-radius: 8px;
    background-color: @bg-grey-EFF;
    margin: 0 12px 12px 0;
    text-align: center;
    position: relative;
    &:nth-of-type(2n) {
      margin-right: 0;
    }
    > p {
      width: 90%;
    }
    .fileName {
      color: @text-grey-BBB;
      font-size: 12px;
      margin-top: 5px;
    }
    .float-close {
      width: 33px;
      position: absolute;
      top: -14px;
      right: -14px;
    }
  }
  .picture {
    height: 94px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    > img {
      // height: 100%;
      width: 153px;
      height: 94px;
      border-radius: 4px;
    }
    > i {
      font-size: 30px;
    }
  }
}
</style>
