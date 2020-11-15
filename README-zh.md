# 安装淘宝npm
npm install -g cnpm --registry=https://registry.npm.taobao.org
# vue-cli 安装依赖包
cnpm install --g vue-cli


# 切换到项目根目录
cd vueblog-vue
# 安装element-ui
cnpm install element-ui --save 

然后我们打开项目src目录下的main.js，引入element-ui依赖。
import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
Vue.use(Element)
复制代码这样我们就可以愉快得在官网上选择组件复制代码到我们项目中直接使用啦。


cnpm install axios --save

然后同样我们在main.js中全局引入axios。

import axios from 'axios'
Vue.prototype.$axios = axios //

10、博客编辑（发表）
我们点击发表博客链接调整到/blog/add页面，这里我们需要用到一个markdown编辑器，在vue组件中，比较好用的是mavon-editor，那么我们直接使用哈。先来安装mavon-editor相关组件：
安装mavon-editor
基于Vue的markdown编辑器mavon-editor
cnpm install mavon-editor --save
复制代码然后在main.js中全局注册：
// 全局注册
import Vue from 'vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// use
Vue.use(mavonEditor)
 