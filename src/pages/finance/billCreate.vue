<template>
  <div class="bill-content">
    <div class="content">
      <p class="van-hairline--bottom">收款信息</p>
      <ul class="bill-detial">
        <li>
          <span>应收佣金（元）</span>
          <br />
          <span>{{contCommission.receivableCommission}}</span>
        </li>
        <li>
          <span>已收（元）</span>
          <br />
          <span>{{contCommission.receivedCommission}}</span>
        </li>
        <li>
          <span>未收（元）</span>
          <br />
          <span>{{contCommission.uncollected}}</span>
        </li>
      </ul>
      <div class="content-body">
        <div class="body-detail van-hairline--bottom">
          <p class="van-hairline--bottom">
            <span>收款方式</span>
            <span>线上收款</span>
          </p>
          <div class="y-j van-hairline--bottom">
            <van-field readonly class="kl" label="款类" @click="showLei">
              <template #button>
                <span :class="nullList.includes(currentMoneyType.name)?'color-153':'color-51'">
                  {{currentMoneyType.name?currentMoneyType.name:'请选择'}}
                  <van-icon class="icon2" name="arrow-down" />
                </span>
              </template>
            </van-field>
          </div>

          <ul class="money van-hairline--bottom">
            <li>付款方</li>
            <li
              @click="showSeller"
              :class="nullList.includes(outObj.label)?'color-153':'color-51'"
              style="display:flex;justify-content:space-between;"
            >
              <span style="flex:1"></span>
              <span style="display:flex;align-items:center;flex:1;justify-content:flex-end">
                {{outObj.label?outObj.label:'请选择'}}
                <van-icon style="top:-3px"  name="arrow-down" />
              </span> 
              <div style="flex:1" v-if="outObj.label=='其它'">
              <van-field
                @click.stop
                class="cent"
                v-if="outObj.label=='其它'"
                style="position:relative;top:-4px;"
                placeholder="请输入姓名"
                v-model="outObj.name"
              />
              </div>
            </li>
          </ul>
          <ul class="s-kr van-hairline--bottom">
            <li style="height:35px">收款人</li>
            <li style="display:flex;height:35px">
              <div style="flex:1"></div>
              <div style="flex:1;display:flex;justify-content:flex-end" @click.stop="selDep">
                <span>{{depName}}</span>
                <van-icon class="icon2" name="arrow-down" />
              </div>
              <div style="flex:1;display:flex;justify-content:flex-end" @click.stop="selEmp">
                <span :class="nullList.includes(empName)?'color-153':'color-51'">{{empName==''?'请选择':empName}}</span>
                <van-icon class="icon2" name="arrow-down" />
              </div>
            </li>
            <!-- <li >
            </li> -->
          </ul>
          <ul class="money money2">
            <li style="display:flex;justify-content:space-between">
              <span>收款金额（元）</span>
              <span style="color:@fontColor">{{money | toChineseNumber}}</span>
            </li>
            <li>
              <van-field
                class="cent"
                @input="formatter('money')"
                placeholder="请输入"
                v-model="money"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="content-footer">
        <div class="footer-detail">
          <p class="van-hairline--bottom">
            其他信息
            <span>（选填）</span>
          </p>
          <van-field
            v-model="message"
            rows="2"
            class="b-z"
            autosize
            type="textarea"
            maxlength="50"
            label="备注信息"
            placeholder="请输入备注信息"
            show-word-limit
          />
        </div>
      </div>
      <van-popup
        v-model="leiDialog"
        position="bottom"
        :close-on-click-overlay="true"
        :style="{ height: '70%' }"
      >
        <div class="all-lei van-hairline--bottom" v-for="(item,index) in moneyType" :key="index">
          <p>{{item.name}}</p>
          <ul>
            <li
              v-for="(im,inx) in item.moneyTypes"
              @click="selMoneyType(im,item)"
              :class="currentMoneyType.name==im.name?'bg':''"
              :key="inx"
            >{{im.name}}</li>
          </ul>
        </div>
      </van-popup>
      <van-popup
        v-model="sellerDialog"
        position="bottom"
        :close-on-click-overlay="true"
        :style="{ height: '40%' }"
      >
        <ul class="seller">
          <li
            class="van-hairline--bottom"
            style="position:relative;display:flex"
            v-for="(item,index) in sellerList"
            @click="selOutOgj(item)"
            :key="index"
          >
            <span style="display:inline-block;min-width:38px">{{item.label}}</span>
            <i v-if="outObj.id==item.custId" class="icon iconfont iconUtubiao-12 leaf"></i>
          </li>
        </ul>
      </van-popup>
      <pop-list
        key="empList"
        :list="empList"
        @chose="choosEmp"
        checkProto="empId"
        :activeId="empId"
        :showInput="false"
        @close="closePop2"
        :state="flagEmp"
      ></pop-list>
      <pop-list
        key="depList"
        :list="depList"
        @chose="choose"
        :checkProto="pp"
        :activeId="depId"
        :showInput="false"
        @close="closePop"
        :state="flag"
        @searchList="search"
      ></pop-list>
    </div>
    <div class="fixed">
      <van-button v-if="$route.query.type==2" type="default" @click.stop="back">取消</van-button>
      <van-button
        v-if="$route.query.type==2"
        type="primary"
        @click.stop="toGetMoney(1)"
      >创建pos收款订单</van-button>
      <van-button v-if="$route.query.type!=2" type="default" @click.stop="back">取消</van-button>
      <van-button v-if="$route.query.type!=2" type="primary" @click.stop="toGetMoney(2)">创建pos收款订单</van-button>
    </div>
  </div>
</template>
           
<script>
import {Field,Popup} from 'vant'
import {mapGetters} from 'vuex'
import popList from '@/components/popList'
import { TOOL } from "@/assets/js/common";
export default{
    name:'bill-create',
    components: {
        [Field.name]: Field,
        [Popup.name]: Popup,
        popList
    },
    data(){
        return {
            bthStatus:true,  //保存按钮是否可点击
            pp:'depId',
            message:'',
            contId:'',
            code:'',
            contCommission:'',
            leiDialog:false,
            sellerDialog:false,
            moneyType:[],
            currentMoneyType:{name:'',id:-99,label:''},
            sellerList:[],
            depList:[],
            flag:false,
            flagEmp:false,
            depName:'',
            depId:-99,
            empName:'',
            empId:-99,
            empList:[],
            money:'',  //收款金额
            outObj:{name:'',id:'',label:''},  //付款方,
            outer_leaf:'',   //当前付款方
            payId:0,
            moneyTypePid:0,
            nullList:['','请选择']
        }
    },
    mounted(){
        this.contId=this.$route.query.contId
        this.code=this.$route.query.code
        this.payId=this.$route.query.id
        if(this.$route.query.type&&this.$route.query.type==2){
            this.$ajax.get('/api/payInfo/selectRevDetail',{payId:this.payId,type:1}).then(res=>{
                res=res.data
                if(res.status===200){
                    this.depId=res.data.inObjStoreId
                    this.depName=res.data.inObjStore
                    this.empId=res.data.inObjId
                    this.empName=res.data.inObjName
                    this.outObj.id=res.data.outObjId
                    if(this.outObj.id!==-1){
                        this.outObj.label=res.data.outObjType.label+'-'+res.data.outObj
                    }else{
                        this.outObj.label='其它'
                    }
                    this.outObjType=res.data.outObjType.value
                    this.outObj.name=res.data.outObj
                    this.currentMoneyType.id=res.data.moneyType
                    this.moneyTypePid=res.data.moneyTypePid
                    this.currentMoneyType.name=res.data.moneyTypeName
                    this.money=res.data.amount
                    this.message=res.data.remark
                }
            })
        }
        this.getYSS()
        this.getAllLei()
        this.getSeller()
        // this.$ajax.get('/api/payInfo/access/deps',{contId:this.contId}).then(res=>{
        //     res=res.data
        //     if(res.status==200){
        //         let arr2=[]
        //         for(let key in res.data){
        //             arr2.push(res.data[key])
        //         }
        //         this.empList=arr2
        //         for(var i=0;i<this.empList.length;i++){
        //             if(this.depId==this.empList[i][0].depId){
        //                 debugger
        //                 this.empList=JSON.parse(JSON.stringify(this.empList[i]))
        //                 this.empList=this.empList[0]
        //                 break
        //             }
        //         }
        //     }
        // }).catch(error=>{
        //     this.$toast(error)
        // })
    },
    methods:{
        showLei(){  //显示所有的类
            this.leiDialog=true
        },
        back(){
            this.$router.go(-1)
        },
        formatter(type){
            if(type==="money"){
                this.$nextTick(()=>{
                    this.money=TOOL.cutFloat({val:this.money,max:99999999.99})
                    if([0,'0',''].includes(this.money)){
                        this.money=''
                        return this.$toast('金额必须大于0')
                    } 
                })
            }
        },
        trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "")
        },
        toGetMoney(type=2){
            let ajaxObj={
                2:{
                    method:'postJSON',
                    url:'/api/payInfo/saveProceeds'
                },
                1:{
                    method:'put',
                    url:'/api/payInfo/updateProceedsInfo'
                }
            }
            if(this.currentMoneyType&&this.currentMoneyType.name==''){
                this.$toast('请选择款类')
                return
            }
            if(this.outObj&&this.outObj.label==''){
                this.$toast('请选择付款方')
                return
            }
            // debugger
            if(['',-99].includes(this.empId)){
                this.$toast('请选择人员')
                return
            }
            if(this.trim(this.money.toString())==''){
                this.$toast('收款金额不能为空')
                return
            }
            if(!this.bthStatus){
                return
            }
            if(this.outObj.label=='其它'){
                if(this.outObj.name==''){
                    this.$toast('请填写付款人信息')
                    return
                }
            }
            this.bthStatus=false
            let param={
                admin:this.empId,
                contId:this.contId,
                filePath:[],
                amount:this.money,
                inAccount:[{accountId: '',amount: this.money,bankName: "—",cardNumber: "",fee: 0,payMethod: 7,storeId: 0,storeName: "",userName: ""}],
                outObj:this.outObj.name,
                outObjId:this.outObj.id,
                inObjId:this.empId,
                inObj:this.empName,
                remark:this.message,
                payAccountType:3,
                outObjType: this.outObjType,
                id:this.payId,
                moneyType:this.currentMoneyType.id,
                moneyTypePid: this.moneyTypePid,
                outAccount:[{amount: "",bankName: "",cardNumber: "",fee: "",orderNo: "",userName: ""}]

            }
            this.$ajax[ajaxObj[type].method](ajaxObj[type].url, param).then(res => {
                res = res.data
                this.bthStatus=true
                if (res.status === 200) {
                    if(this.$route.query.type==2){
                        this.$router.push({
                            path:'billDatails',
                            query:{
                                id:res.data.id
                            }
                        })
                    }else{
                        this.$router.push({
                            path:'billCode',
                            query:{
                                amount:res.data.amount,
                                RQcode:res.data.RQcode,
                                payCode:res.data.payCode,
                                id:res.data.id
                            }
                        })
                    }
                }
            }).catch(err=>{
                this.$toast(err)
                this.bthStatus=true
            })
        },
        search(res){
            if(res.keyword) {
                let arr = this.depList.filter(item=>{
                    let str = item.name
                    return str.includes(res.keyword)
                })
                this.depList = [...arr]
            } 
        },
        choose(val){
            this.depName=val.name
            this.depId=val.depId
            this.empName=''
            this.empId=-99
            this.flag=false
            for(var i=0;i<this.empList.length;i++){
                if(val.depId==this.empList[i][0].depId){
                    this.empList=JSON.parse(JSON.stringify(this.empList[i]))
                    break
                }
            }
            console.log(this.empList);
        },
        choosEmp(val){
            this.empId=val.empId
            this.empName=val.name
            this.flagEmp=false
        },
        closePop(){
            this.flag=false
            this.empName=''
            this.empId=-99
            this.$ajax.get('/api/organize/employees/pages',{depId:this.depId}).then(res=>{
                res=res.data
                if(res.status==200){
                    this.empList=res.data.list
                }
            })
        },
        closePop2(){
            this.flagEmp=false
        },
        showSeller(){
            this.sellerDialog=true

        },
        selOutOgj(item){
            this.outObj.id = item.custId
            this.outObj.name =item.custName
            this.outObj.label = item.label
            this.outer_leaf=item.custId
            this.outObjType=item.value
            this.sellerDialog=false
        },
        selEmp(){
            this.$ajax.get('/api/payInfo/access/deps',{contId:this.contId}).then(res=>{
                res=res.data
                if(res.status==200){
                    let arr2=[]
                    for(let key in res.data){
                        arr2.push(res.data[key])
                    }
                    this.empList=arr2
                    for(var i=0;i<this.empList.length;i++){
                        if(this.depId==this.empList[i][0].depId){
                            this.empList=JSON.parse(JSON.stringify(this.empList[i]))
                            break
                        }
                    }
                    if(this.empList.length>0){
                        this.flagEmp=true
                    }else{
                        this.$toast('该部门下暂无人员')
                    }
                }
            })

        },
        selDep(){
            this.flag=true
            this.$ajax.get('/api/payInfo/access/deps',{contId:this.contId}).then(res=>{
                res=res.data
                if(res.status==200){
                    let arr=[]
                    let arr2=[]
                    for(let key in res.data){
                        arr.push(key) 
                        arr2.push(res.data[key])
                    }
                    this.empList=arr2
                    this.depList=arr.map(v=>{
                        return JSON.parse(v)
                    })
                }
            }).catch(error=>{
                this.$toast(error)
            })
        },
        getYSS(){  //得到所有应收实收
            let param={
                contId:this.contId,
                type:1,
            }
            this.$ajax.get('/api/payInfo/toInsert',param).then(res=>{
                res=res.data
                if(res.status==200){
                    this.contCommission=res.data.contCommission
                }
            })
        },
        getAllLei(){
            this.$ajax.get('/api/payInfo/selectMoneyType', {}).then(res => {
                res=res.data
                if(res.status==200){
                    this.moneyType=res.data
                }
            })
        },
        selMoneyType(item,im){
            this.currentMoneyType.name=item.name
            this.currentMoneyType.id=item.key
            this.leiDialog=false
            this.moneyTypePid=im.id
        },
        getSeller(){
            let param = {
                contId: this.contId
            }
            this.$ajax.get('/api/payInfo/selectValue', param).then(res => {
                res = res.data
                if (res.status === 200) {
                    this.sellerList = res.data
                }
            })
        }
    },
    computed:{
        ...mapGetters([
            'getUserMsg'
        ])
    },
    watch:{
        getUserMsg:{
            deep:true,
            immediate:true,
            handler:function (userMsg){
                if(!userMsg) return
                let msg=userMsg.user
                this.depName=userMsg.user&&userMsg.user.depName
                this.depId=userMsg.user&&userMsg.user.depId
                this.empName=userMsg.user&&userMsg.user.name
                this.empId=userMsg.user&&userMsg.user.empId
            }
        }
    },
    filters:{
        //数字转中文数字
        toChineseNumber: function (money) {
            //汉字的数字
            var cnNums = new Array(
                "零",
                "壹",
                "贰",
                "叁",
                "肆",
                "伍",
                "陆",
                "柒",
                "捌",
                "玖"
            );
            //基本单位
            var cnIntRadice = new Array("", "拾", "佰", "仟");
            //对应整数部分扩展单位
            var cnIntUnits = new Array("", "万", "亿", "兆");
            //对应小数部分单位
            var cnDecUnits = new Array("角", "分", "毫", "厘");
            //整数金额时后面跟的字符
            var cnInteger = "整";
            //整型完以后的单位
            var cnIntLast = "元";
            //最大处理的数字
            var maxNum = 9999999999999.99;
            //金额整数部分
            var integerNum;
            //金额小数部分
            var decimalNum;
            //输出的中文金额字符串
            var chineseStr = "";
            //分离金额后用的数组，预定义
            var parts;
            if (!money) {
                chineseStr = cnNums[0] + cnIntLast + cnInteger;
                return chineseStr;
            }
            money = parseFloat(money);
            if (money >= maxNum) {
            //超出最大处理数字
                return "";
            }
            //转换为字符串
            money = money.toString();
            if (money.indexOf(".") == -1) {
                integerNum = money;
                decimalNum = "";
            } else {
                parts = money.split(".");
                integerNum = parts[0];
                decimalNum = parts[1].substr(0, 4);
            }
            //获取整型部分转换
            if (parseInt(integerNum, 10) > 0) {
                var zeroCount = 0;
                var IntLen = integerNum.length;
                for (var i = 0; i < IntLen; i++) {
                    var n = integerNum.substr(i, 1);
                    var p = IntLen - i - 1;
                    var q = p / 4;
                    var m = p % 4;
                    if (n == "0") {
                        zeroCount++;
                    } else {
                        if (zeroCount > 0) {
                            chineseStr += cnNums[0];
                        }
                        //归零
                        zeroCount = 0;
                        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                    }
                    if (m == 0 && zeroCount < 4) {
                        chineseStr += cnIntUnits[q];
                    }
                }
                chineseStr += cnIntLast;
            }
            //小数部分
            if (decimalNum != "") {
                var decLen = decimalNum.length;
                for (let i = 0; i < decLen; i++) {
                    let n = decimalNum.substr(i, 1);
                    if (n != "0") {
                        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                    }
                }
            }
            if (chineseStr == "") {
                chineseStr += cnNums[0] + cnIntLast + cnInteger;
            } else if (decimalNum == "") {
                chineseStr += cnInteger;
            }
            return chineseStr;
        },
    }   
}
</script>
<style lang="less" scoped>
@import "~@/assets/common.less";
@fontColor: rgba(51, 51, 51, 1);
@fontColor-2: rgba(224, 224, 224, 1);
@fontColor-3: rgba(153, 153, 153, 1);
@red: rgba(255, 59, 48, 1);
.color-153 {
  color: @fontColor-3!important;
}
.color-51 {
  color: @fontColor;
}
.icon2 {
  top: 2px;
  left: 2px;
  // color:@fontColor;
}
.cent{
  /deep/ .van-field__control {
    text-align: right;
  }
}
.money2 {
  /deep/ .van-cell {
    padding: 0;
  }
}
.leaf {
  position: absolute;
  right: 10px;
  color: green;
}
.save {
  width: 95% !important;
}
.fixed {
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  background-color: @bg-white;
  button {
    width: 165px;
  }
}
.all-lei {
  padding-left: 15px;
//   border-bottom: solid 1px @fontColor-2;
  p {
    line-height: 40px;
    color: @fontColor-3;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      line-height: 30px;
      margin: 0 15px;
      color: @fontColor;
    }
  }
}
.bg{
  background-color: rgba(62,186,112,0.15);
  padding: 0 2px;
  color:rgba(62,186,112,1)!important;
}
.seller {
  margin-top: 50px;
  padding-left: 15px;
  line-height: 40px;
  color: @fontColor;
  li {
    // border-bottom: solid 1px @fontColor-2;
  }
}
.bill-content {
  height: calc(100% - 60px);
  padding-top: 10px;
  background-color: @bg-grey;
  overflow: scroll;
  box-sizing: border-box;
  .content {
    background-color: white;
    font-size: 14px;
    > p:nth-child(1) {
      height: 40px;
      color: @fontColor;
      line-height: 40px;
      padding-left: 20px;
      // border-bottom: solid 1px @fontColor-2;
    }
    .bill-detial {
      height: 60px;
      display: flex;
      li {
        &:nth-of-type(1) {
          padding-left: 20px;
        }
        flex: 1;
        padding: 15px 5px;
        box-sizing: border-box;
        span {
          color: @fontColor-3;
          &:nth-of-type(2) {
            line-height: 25px;
            color: @red;
          }
        }
      }
    }
  }
  .content-body {
    padding-top: 10px;
    background-color: @bg-grey;
    .body-detail {
      background-color: white;
      padding: 0 20px;
      p {
        display: flex;
        padding-left: 0;
        justify-content: space-between;
        align-items: center;
        color: @fontColor-3;
        height: 40px;
        //    border-bottom: solid 1px @fontColor-2;
      }
      .y-j {
        .kl {
          padding-left: 0px;
          padding-right: 0px;
          color: @fontColor-3;
          // border-bottom: solid 1px @fontColor-2;
          /deep/ .van-field__button span {
            color: @fontColor;
          }
        }
      }
      .s-kr {
        // display: flex; 
        color: @fontColor-3;
        // height: 40px;
        justify-content: space-between;
        align-items: center;
        // border-bottom: solid 1px @fontColor-2;
        li {
          flex: 1;
          &:not(:first-of-type) {
            color: @fontColor;
            text-align: center;
          }
          &:last-of-type {
            text-align: right;
          }
        }
      }
      .money {
        color: @fontColor-3;
        height: 70px;
        // border-bottom: solid 1px @fontColor-2;
        li {
          height: 35px;
          line-height: 35px;
        }
        li:nth-child(1) {
          span:nth-child(2) {
            color: @fontColor;
          }
        }
        li:nth-child(2) {
          display: flex;
          justify-content: space-between;
          color: @fontColor;
        }
      }
    }
  }
  .content-footer {
    padding-top: 10px;
    background-color: @bg-grey;
    .footer-detail {
      background-color: white;
      height: 240px;
      padding: 0 20px;
      > p:nth-child(1) {
        height: 40px;
        color: @fontColor;
        line-height: 40px;
        // border-bottom: solid 1px @fontColor-2;
        span {
          color: @fontColor-3;
        }
      }
      .b-z {
        padding-left: 0;
        padding-right: 0;
        flex-direction: column;
        /deep/ .van-cell__title {
          span {
            color: @fontColor!important;
            margin-bottom: 2px;
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>