/* eslint-disable prettier/prettier */
/* eslint-disable indent */
import wx from "weixin-js-sdk";


import { getJsSdk } from "@/api/index";

const state = {
    sdk: {},
};

const mutations = {
    SET_SDK: (state, sdk) => {
        state.sdk = sdk;
    },
};

const actions = {
    getSdk({ commit }) {
        return new Promise((resolve, reject) => {
            getJsSdk()
                .then((res) => {
                    res.data.jsApiList.push('showMenuItems')
                    console.log('res.data.jsApiList', res.data.jsApiList)
                    commit("SET_SDK", res.data);
                    // console.log(res, 'SET_SDK')
                    const obj = {
                        code: res.code
                    }
                    resolve(obj);
                })
                .catch((err) => {
                    console.log("getSdk", err);
                    reject(err);
                });
        });
    },
    // 校验微信配置
    checkWxConfig({ state }, jsApiList) {
        return new Promise((resolve, reject) => {
            console.log('state.sdk', state.sdk)
            wx.config(state.sdk);
            wx.ready(() => {
                // js校验的api jsApiList: ['openLocation','hideAllNonBaseMenuItem']
                if (jsApiList && jsApiList.length > 0) {
                    wx.checkJsApi({
                        jsApiList,
                        success: (res) => {
                            console.log('hideMenuItems', res)
                            wx.hideAllNonBaseMenuItem()
                            wx.showMenuItems({
                                menuList: ["menuItem:openWithQQBrowser", "menuItem:openWithSafari"] // 要显示的菜单项，所有 menu 项见附录3
                            });

                            // wx.hideMenuItems({
                            //     menuList: ["menuItem:share:appMessage", "menuItem:share:timeline", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:share:QZone",
                            //     ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有 menu 项见附录3
                            // });
                            resolve(res);
                        },
                        fail: (err) => {
                            console.log("ready", err);
                            reject(err);
                        },
                    });
                } else {
                    resolve();
                }
            });
            wx.error(function(err) {
                console.log("config", err);
                reject(err);
            });
        });
    },
    // 获取location
    getLocation() {
        return new Promise((resolve, reject) => {
            wx.getLocation({
                type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function(res) {
                    const obj = {
                        latitude: res.latitude,
                        longitude: res.longitude,
                    }
                    resolve(obj);

                },
                fail: res => {
                    reject(res)
                }
                // fail: res => {
                //     reject(res)
                // }
            })
        })

    },





};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
