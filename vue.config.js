const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const path = require('path');

module.exports={
    publicPath:'./',
    assetsDir:'static',
    devServer:{
        proxy:{
            '/api':{ //代理地址
                target: 'http://192.168.1.224:28081', //需要代理的地址 'http://192.168.1.224:28083
                changeOrigin: true, //是否跨域
                secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    },
    configureWebpack:config=>{
        config.externals={
            'vue': 'Vue',
            'vue-router': 'VueRouter'
        };
    },
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
}
