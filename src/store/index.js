/* eslint-disable prettier/prettier */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// https://webpack.js.org/guides/dependency-management/#requirecontext
// 一个webpack的api 通过执行require.context()函数获取一个特定的上下文，主要用来实现自动化导入模块
const modulesFiles = require.context("./modules", true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
// keys()创建一个数组迭代对象，该对象包含了数组的键
// reduce()作为一个循环使用，接收四个参数，初始值（上一次返回的值），当前元素 值
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    // replace()方法用于在字符串中用一些字符替代另一些字符，或替换一个与正则匹配的字符
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
    const value = modulesFiles(modulePath);
    modules[moduleName] = value.default;
    return modules;
}, {});

const store = new Vuex.Store({
    modules,

});

export default store;
