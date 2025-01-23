/* eslint-disable prettier/prettier */
// 检查浏览器环境,封装到checkBrower.js内
export default function checkBrower() {
    // const ua = window.navigator.userAgent.toLowerCase();
    const ua = window.navigator.userAgent.toLowerCase();
    let webType;
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        webType = 1;
        // wx.miniProgram.getEnv(function(res) {
        // 	webType = (res.miniprogram ? 2 : 1)  // 1微信浏览器 2微信小程序
        // })
    } else if (
        /swan\//.test(window.navigator.userAgent) ||
        /^webswan-/.test(window.name)
    ) {
        webType = 3; //百度小程序
    } else {
        webType = 0; //普通浏览器
    }
    return webType;
}
