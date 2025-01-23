/* eslint-disable prettier/prettier */
/* eslint-disable indent */
import request from "@/utils/request";

// 登录
export function login(params) {
    return request({
        // eslint-disable-next-line prettier/prettier
        url: "/user/login",
        method: "get",
        params,
    });
}

// 刷新token
export function refreshToken() {
    return request({
        url: "/user/refresh",
        method: "get",
    });
}

//   校验用户是否在所在区域
export function checkLocation({ activity_id, user_id }) {
    return request({
        // url: "`/check/location/${activity_id}/${user_id}`",
        url: `/check/location/${activity_id}/${user_id}`,
        method: "post",
        // data,
    });
}


//   获取活动信息
export function getActivityDetail({ activity_id, user_id }) {
    return request({
        url: `/wechat/activity/${activity_id}/${user_id}`,
        method: "get",
    });
}

// 接口
export function getVideobind({ activity_id, user_id, share_id }) {
    return request({
        url: `/wechat/videobind/${activity_id}/${user_id}?share_id=${share_id}`,
        method: "get",
    })
}

// 跳转接口
export function getscheme({ id, activity_id }) {
    return request({
        url: `/integrity/scheme/${id}?activity_id=${activity_id}`,
        method: "get",
    })
}



//  获取JSsdk
export function getJsSdk() {
    return request({
        url: "/wechat/jssdk",
        method: "get",
        params: {
            url: window.location.href,
        },
    });
}

//  获取地区信息
export function setLocation(data) {
    return request({
        url: "/set/location",
        method: "Post",
        data
    });
}

// 修改用户信息
export function postUser(data) {
    return request({
        url: "/center/user",
        method: "post",
        data,
    });
}
// 获取用户信息
export function getUser(data) {
    return request({
        url: "/center/user",
        method: "get",
        data,
    });
}

