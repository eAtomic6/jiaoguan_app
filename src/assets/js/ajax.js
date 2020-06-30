import axios from 'axios'
const qs = require('qs')

let errorMsg = {
    '400':'系统繁忙，请稍后再试',
    '403':'无该功能权限',
    '410':'重复请求',
    '500':'网络异常，请稍后再试',
}

axios.defaults.headers.common['Cache-Control']='no-cache'

axios.interceptors.request.use((request)=>{
    if(window.navigator.onLine===false){
        // '网络未正常连接'
    }
    return request
})
axios.interceptors.response.use((response)=>{
    let res=response.data
    if(res.status===200){
        return response
    }else if(res.status===300){
        return Promise.reject(res)
    }else {
        return Promise.reject(res.message)
    }
},error => {
    if(window.navigator.onLine===false){
        return Promise.reject('网络未正常连接')
    }else {
        return Promise.reject(error)
    }
})

let api = {
    post: function(url, param) {
        return axios
            .post(url, qs.stringify(param))
            .then(res => {
                return res
            })
    },
    postJSON: function(url, param) {
        let jsonParam = JSON.stringify(param)
        let headers = {
            post: {}
        }
        headers.post['Content-Type'] = 'application/json'
        return axios.post(url, jsonParam, { headers: headers }).then(res => {
            return res
        })
    },
    get: function(url, param) {
        param = Object.assign({},param,{
            dayRandomTime:new Date().getTime()
        })
        if(param.keyword){
            param.keyword=encodeURIComponent(param.keyword)
        }
        return axios.get(url,{params:param}).then(res => {
            return res
        })
    },
    delete: function(url, param) {
        return axios
            .delete(url, {
                params: param
            })
            .then(res => {
                return res
            })
    },
    put: function(url, param,type=1) {
        let header={}
        if(type===1){
            header['Content-Type']='application/json'
        }
        return axios.put(url, type===1?JSON.stringify(param):qs.stringify(param),{headers:header}).then(res => {
            return res
        })
    }
}
export { api,errorMsg }
