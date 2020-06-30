import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
import {api} from '@/assets/js/ajax'
import {Cell,Button,Icon,Uploader,CellGroup,Toast,Tab,Tabs,Tabbar,TabbarItem,Dialog} from 'vant'
import 'vant/lib/index.css'
import {TOOL} from "./assets/js/common";

Vue.config.productionTip = false
Vue.use(Cell)
Vue.use(Button)
Vue.use(Uploader)
Vue.use(Toast)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(CellGroup )
Vue.use(Icon )
Vue.use(Dialog)

Vue.prototype.$ajax=api;
Vue.prototype.$tool = TOOL
Vue.prototype.$EventBus=new Vue();
Vue.filter("formatDate", TOOL.dateFormat);
Vue.filter("formatTime", TOOL.timeFormat);
Vue.filter("formatNull", TOOL.nullFormat);

// 手机调试
import VConsole from 'vconsole'
const vConsole = new VConsole()
export default vConsole;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
