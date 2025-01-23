/* eslint-disable prettier/prettier */
/* eslint-disable indent */
import wx from 'weixin-js-sdk'
import { getActivityDetail } from '@/api/index'
// import { Toast } from 'vant';
import { setCarimg } from '@/utils/auth'

const state = {
    // 活动基本数据
    base: {
        status: 2, // 1待审核，2审核通过，3审核驳回，4已结束，5暂停
        template_type: 0, // 模板 1 2 3
        name: '', // 活动名称
        time: [1579224000, 1599294000], // 活动时间
        group_qr_code: '', // 群二维码

        show_top: 0, // 是否显示排行榜

        detail: '', // 详情

        carousel: [], // 轮播图
        card_name: '', // 套餐名称
        price: 0, // 套餐金额
        origin_price: 0, // 商品原始价格
        income_max: 10, // 佣金最高值

        share_title: '', // 分享标题
        share_desc: '', // 分享描述
        share_pic: '', // 分享图片

        share_type: 1, // 分享类型
        link: '', // 二维码链接地址
        help_link: '', // 助力链接
        poster_pic: '', // 分享海报
        extra: {}, // 其他设置
        banner: '', // 顶部背景图
        bg_color: '#ff0000', // 背景色
        music: '', // 音乐
        light_num: 3 // 需点亮数量  3  5  7
    },
    fromGroup: {},
    // 活动相关数据
    related: {
        shareCount: 10, // 分享量
        viewsCount: 8, // 浏览量(浏览次数)
        viewsNumber: 8, // 浏览量(浏览人数)
        viewsList: [
            // {
            //   users:{
            //     avatar:'http://files.jb51.net/file_images/game/201601/20160102204921139.jpg',
            //     nickname:'昵称'
            //   }
            // }
        ], // 浏览数据

        actTotal: 100, // 套餐总量
        actLast: 90, // 套餐剩余量

        orderCount: 10, // 订单量
        orderList: [
            // {
            //   users:{nickname:'昵称',avatar:'http://pic.rmb.bdstatic.com/7d536a66323aebebd1c87b761cd02c16.jpeg'},
            //   pay_time:'2020-01-14',
            //   order_price:'30'
            // }
        ], // 订单列表
        incomeList: [
            // {
            //   users:{nickname:'昵称',avatar:'http://pic.rmb.bdstatic.com/7d536a66323aebebd1c87b761cd02c16.jpeg'},
            //   income:'30'
            // }
        ], // 佣金列表（全部数据 时间倒序） 用于顶部轮播展示用户获得佣金金额 （该数据包含真实数据与虚拟数据）
        incomeListTopTen: [
            // {
            //   users:{nickname:'冠军',avatar:'http://pic.rmb.bdstatic.com/7d536a66323aebebd1c87b761cd02c16.jpeg'},
            //   income:'50',
            //   add_time:'2020-01-14 14:32'
            // },
            // {
            //   users:{nickname:'亚军',avatar:'http://pic.rmb.bdstatic.com/7d536a66323aebebd1c87b761cd02c16.jpeg'},
            //   income:'40',
            //   add_time:'2020-01-14 14:32'
            // },
            // {
            //   users:{nickname:'我就是试一下昵称太长了会不会坏掉',avatar:'http://pic.rmb.bdstatic.com/7d536a66323aebebd1c87b761cd02c16.jpeg'},
            //   income:'30',
            //   add_time:'2020-01-14 14:32'
            // }
        ], // 佣金列表 （前十名 金额倒序）

        myIncome: {
            order: 10, // 排名
            users: {
                // nickname:'我就是试一下昵称太长了会不会坏掉',
                // avatar:'http://pic.rmb.bdstatic.com/7d536a66323aebebd1c87b761cd02c16.jpeg'
            },
            income: '30',
            add_time: '2020-01-14 14:32'
        } // 用户自己的佣金数据
    },
    // 推荐人
    recommended: {
        id: 0,
        nickname: '',
        avatar: ''
    },
    // 联系人信息
    concatInfo: {
        storeName: '',
        storePhone: '',
        storeCode: '',
        storeAddress: '',
        storeLocation: {},
        business_hours: [], // 商家营业时间
        agentPhone: '',
        agentCode: '',
        agentClose: 0, // 是否关闭代理信息 1关闭 0不关闭
        plateFormClose: 0 // 是否关闭联系平台 1关闭 0不关闭
    },
    copyRight: 'CopyRight @2021拓客多多',
    status: 0, // 活动状态：-1 未开始 0 已经开始 1 结束
    ad: {},
    helpdata: {
        carousel: [{
            path: ''
        }]
    },
    from_user: {},
    helplist: [],
    bargainlist: [],
    lightCount: 0, //  点亮模式 点亮数量
    hasLightOrder: false, // 点亮模式 奖品是否已领取
    // 汽车模式列表
    carlist: []
}

const mutations = {
    SET_BASE: (state, base) => {
        state.base = base
    },
    SET_RELATED: (state, related) => {
        state.related = related
    },
    SET_RECOMMENDED: (state, recommended) => {
        state.recommended = recommended
    },
    SET_CONCATINFO: (state, concatInfo) => {
        state.concatInfo = concatInfo
    },
    SET_STATUS: (state) => {
        // 1待审核，2审核通过，3审核驳回，4已结束，5暂停
        const s = state.base.status
        let res = -1
        if ('13'.indexOf(s) >= 0) {
            res = -1
        } else if (s === 2) {
            const curTime = Math.round(new Date().getTime() / 1000)
            const startTime = state.base.time[0]
            const endTime = state.base.time[1]
            if (curTime < startTime) {
                res = -1
            } else if (curTime >= startTime && curTime <= endTime) {
                res = 0
            } else {
                res = 1
            }
        } else if ('45'.indexOf(s) >= 0) {
            res = 1
        }
        state.status = res
    },
    SET_STATUSA: (state, data) => {
        state.base.status = data
    },
    SET_AD: (state, ad) => {
        state.ad = ad
    },
    SET_LIGHTCOUNT: (state, lightCount) => {
        state.lightCount = lightCount
    },
    SET_EIGHTSHARE: (state, is_share) => {
        state.base.is_share = is_share
    },
    SET_HASLIGHTORDER: (state, hasLightOrder) => {
        state.hasLightOrder = hasLightOrder
    },
    SET_HELPDATA: (state, data) => {
        state.helpdata = data
    },
    SET_HELPLIST: (state, data) => {
        state.helplist = data
    },

    SET_FROMUSER: (state, data) => {
        state.from_user = data
    },
    SET_BARGAINLISR: (state, data) => {
        state.bargainlist = data
    },
    SET_STORES: (state, data) => {
        state.carlist = data
    }
}

const actions = {
    getActivityInfo({ commit }, data) {
        return new Promise((resolve, reject) => {
            getActivityDetail(data)
                .then((res) => {

                    const { base, help_link, link, related, recommended, concatInfo, ad, fromGroup, lightCount, hasLightOrder } = res.data
                    commit('SET_BASE', { ...base, help_link, link, fromGroup })
                    setCarimg(res.data.base.carousel[0])
                    commit('SET_RELATED', related)
                    commit('SET_RECOMMENDED', recommended)
                    commit('SET_CONCATINFO', concatInfo)
                    commit('SET_AD', ad)
                    commit('SET_LIGHTCOUNT', lightCount)
                    commit('SET_HASLIGHTORDER', hasLightOrder)

                    commit('SET_STATUS')
                    // commit(' SET_STORES', carlist)

                    res.data.base.link = link
                    resolve(res.data)
                })
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })
    },


    openLocation({ state }) {
        wx.openLocation({
            latitude: state.concatInfo.storeLocation.lat, // 纬度，浮点数，范围为90 ~ -90
            longitude: state.concatInfo.storeLocation.lng, // 经度，浮点数，范围为180 ~ -180。
            name: state.concatInfo.storeName, // 位置名
            address: state.concatInfo.storeAddress, // 地址详情说明
            scale: 15, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        })
    },



    changeStatus({ commit }, data) {
        commit('SET_STATUSA', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
