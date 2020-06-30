const BASE = {
    DICTIONARY: {
        10: "合同类型",
        11: "后期状态",
        13: "收佣状态",
        51: "合同审核状态",
        64: "签约方式",
        72: "签后审核状态",
        48: "数据范围",
        44: "后期状态",
        43: "后期状态",
        18: "交易步骤状态",
        57: "收付对象",
        23: "收款状态"
    },
};
const POWER={
    'sign-com-bill': {
        state: false,
        name: '流水'
    },
    "sign-cw-rev-update": {
        state: false,
        name: "编辑"
    },
    "sign-cw-debt-query": {
        state: false,
        name: "查询"
    },
    "sign-cw-debt-rev": {
        state: false,
        name: "收款详情"
    },
    'sign-ht-info-collect': {
        state: false,
        name: '收款'
    },
    'sign-ht-info-pay': {
        state: false,
        name: '付款'
    },
    'sign-ht-info-print': {
        state: false,
        name: '打印空白合同'
    },
    'sign-ht-info-add': {
        state: false,
        name: '创建正式合同'
    },
    'sign-ht-info-addoffline': {
        state: false,
        name: '创建线下合同'
    },
    'sign-ht-info-view': {
        state: false,
        name: '预览'
    },
    'sign-ht-xq-data': {
        state: false,
        name: '资料库'
    },
    "sign-ht-xq-main-down": {
        state: false,
        name: "下载合同主体"
    },
    'sign-ht-info-edit': {
        state: false,
        name: '合同编辑'
    },
    'sign-ht-xq-void': {
        state: false,
        name: '撤单'
    },
    'sign-ht-view-toverify': {
        state: false,
        name: '提审'
    },
    'sign-ht-info-fqqs': {
        state: false,
        name: '发起签署'
    },
    'sign-ht-xq-entrust-edit': {
        state: false,
        name: '委托合同'
    },
    'sign-ht-xq-main-add': {
        state: false,
        name: '合同主体上传'
    },
    'sign-ht-xq-ly-call': {
        state: false,
        name: '拨打电话'
    },
    'sign-ht-xq-ly-play': {
        state: false,
        name: '播放录音'
    },
    'sign-ht-xq-ly-wmemo': {
        state: false,
        name: '添加备注'
    },
    'sign-ht-xq-ly-vmemo': {
        state: false,
        name: '查看备注'
    },
    'sign-ht-info-adjust': {
        state: false,
        name: '调佣'
    },
    'sign-ht-info-end': {
        state: false,
        name: '结算状态'
    },
    'sign-ht-info-rec': {
        state: false,
        name: '收佣状态'
    },
    'sign-com-hqstep': {
        state: false,
        name: '后期进度'
    },
    'sign-com-htdetail': {
        state: false,
        name: '合同详情'
    },
    'sign-com-house': {
        state: false,
        name: '房源详情'
    },
    'sign-com-cust': {
        state: false,
        name: '客源详情'
    },
    'sign-ht-info-export': {
        state: false,
        name: '导出'
    },
    'sign-ht-info-del': {
        state: false,
        name: '合同删除'
    },
    'sign-ht-info-recovery': {
        state: false,
        name: '合同恢复'
    },
    'sign-ht-qhsh-toverify': {
        state: false,
        name: '签后提审'
    },
    'sign-qh-rev-receive':{
        name:'',
        state:false,
    },
    "sign-qh-mgr-jd-modify": {
        name: "更换交易流程",
        state: false
    },
    "sign-qh-mgr-jd-smgr": {
        name: "步骤管理",
        state: false
    },
    "sign-qh-mgr-jd-move": {
        name: "上、下",
        state: false
    },
    'sign-ht-info-query': {
        name: '合同查询',
        state: false
    },
    'sign-ht-htsh-query': {
        name: '合同审核',
        state: false
    },
    'sign-ht-qhsh-query': {
        name: '签后审核',
        state: false
    },
    'sign-qh-rev-query': {
        name: '后期接收',
        state: false
    },
    'sign-qh-mgr-query': {
        name: '后期管理',
        state: false
    },
    'sign-qh-cont-query': {
        name: '后期监控',
        state: false
    }
}
const TOOL = {
    debounce(func,wait,immediate) {
        let timeout;
        return function () {
            let context = this;
            let args = arguments;

            if (timeout) clearTimeout(timeout);
            if (immediate) {
                let callNow = !timeout;
                timeout = setTimeout(() => {
                    timeout = null;
                }, wait)
                if (callNow) func.apply(context, args)
            }
            else {
                timeout = setTimeout(() => {
                    func.apply(context, args)
                }, wait);
            }
        }
    },
    dateFormat: function(val, type = 1) {
        if (!val) {
            return "--";
        } else {
            let time = new Date(val);
            let y = time.getFullYear();
            let M = time.getMonth() + 1;
            let D = time.getDate();
            return type === 1 ? `${y}-${M > 9 ? M : "0" + M}-${D > 9 ? D : "0" + D}` : `${y}/${M > 9 ? M : "0" + M}/${D > 9 ? D : "0" + D}`;
        }
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
    timeFormat: function(val, second = true) {
        if (!val) {
            return "--";
        } else {
            let time = new Date(val);
            let y = time.getFullYear();
            let M = time.getMonth() + 1;
            let D = time.getDate();
            let h = time.getHours();
            let m = time.getMinutes();
            let s = time.getSeconds();
            if (second) {
                return `${y}-${M > 9 ? M : "0" + M}-${D > 9 ? D : "0" + D} ${ h > 9 ? h : "0" + h }:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
            } else {
                return `${y}-${M > 9 ? M : "0" + M}-${D > 9 ? D : "0" + D} ${ h > 9 ? h : "0" + h }:${m > 9 ? m : "0" + m}`;
            }
        }
    },
    nullFormat: function(val, number) {
        if (!val && typeof val !== "number") {
            return !number ? "--" : 0;
        } else {
            return val;
        }
    },
    //数字转中文数字
    toChineseNumber: function(money) {
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
            for (var j = 0; j < decLen; j++) {
                var nm = decimalNum.substr(j, 1);
                if (nm != "0") {
                    chineseStr += cnNums[Number(nm)] + cnDecUnits[j];
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
    //保留小数位
    cutFloat: function ({val, max, num = 2}) {
        val = val.toString().replace(/[^\d.]/g, "").replace(/\.{2,}/g, "");
        let regex = /^\./g;
        let point = "";
        if (parseFloat(val) >= max) {
            return max;
        }
        if (regex.test(val)) {//不允许小数点开头
            return ''
        }
        let pos = val.indexOf(".");
        if (pos > -1) {
            point = val.split(".")[1];
            if (point.length > num) {
                point = point.substring(0, num);
            }
            return `${val.slice(0, pos)}.${point}`;
        } else {
            return val;
        }
    },
    //文字输入框限制
    textInput: function (val, type = 1) {
        if (type === 1) {
            return val.replace(/[^\a-zA-Z\u4E00-\u9FA5]/g, "").replace(/\s/g, "");
        } else if (type === 2) {
            return val.replace(/[^\d\a-zA-Z]/g, "").replace(/\s/g, "");
        } else if (type === 3) {
            return val.replace(/[^\u4E00-\u9FA5]/g, "").replace(/\s/g, "");
        } else if (type === 4) {
            return val.replace(/[^\d\a-zA-Z\u4E00-\u9FA5]/g, "").replace(/\s/g, "");
        }
    },
    //纯数字输入
    numberInput: function (val) {
        return val.replace(/[^\d]/g, "");
    },
    waterMark(str,dom,bool=true,bottom) {
        let can = document.createElement('canvas')

        can.width = str.length<22 ?220 : dom.clientWidth
        can.height = 120

        let cans = can.getContext('2d')
        cans.rotate(-15 * Math.PI / 180)
        cans.font = '12px PingFang-SC-Medium'
        cans.fillStyle = 'pink'
        cans.textAlign = 'left'
        cans.textBaseline = 'Middle'
        cans.fillText(str, can.width / 200, can.height )

        let div = document.createElement('div')
        div.id='watermark'
        div.style.pointerEvents = 'none'
        div.style.top = bool?'100px':'60px'
        div.style.left = '0px'
        div.style.position = 'fixed'
        div.style.zIndex = '100000'
        div.style.width = dom.clientWidth  + 'px'
        div.style.height = dom.clientHeight  + 'px'
        if(bottom){
            div.style.height = (dom.clientHeight - bottom )  + 'px'
        }
        div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
        dom.appendChild(div)
    }
};

const MIXINS = {
    methods:{
        noPower:function (msg) {
            this.$toast(`没有${msg}权限`)
        },
        /**
         * 收取字典id，拼接字符串
         * @param obj
         * @returns {string}
         */
        getDictionaryIds: function (obj) {
            let arr = []
            for (let item in obj) {
                arr.push(item)
            }
            return arr.join(',')

        },
        /**
         * 获取筛选数据
         * dictionary必须在各自页面定义 例：dictionary:{'1':'','2':''}
         */
        getDictionary: function () {
            let param = {
                parentIds: this.getDictionaryIds(this.dictionary)
            }
            this.$ajax.get('/api/dictionary/batchQuery', param).then(res => {
                // console.log(res);
                res = res.data
                if (res.status === 200) {
                    // console.log(res.data)
                    this.dictionary = Object.assign({}, res.data)
                }
            })
        },
    }
}

export { BASE, TOOL, MIXINS, POWER };
