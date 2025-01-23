/* eslint-disable prettier/prettier */
import Cookies from 'js-cookie'

const TokenKey = 'tkddToken'
const InCarimg = 'InCarimg'
const InLink = 'Link'
const ToId = 'ToId'
const ToAvatar = 'ToAvatar'
const Togroupnum = 'Togroupnum'
const Todetail = 'Todetail'
const Tocarposter = 'Tocarposter'
const Storebuy = 'Storebuy'
const musicstatus = 'musicstatus'

export function getMusicstatus() {
    return Cookies.get(musicstatus)
}

export function getStorebuy() {
    return Cookies.get(Storebuy)
}
export function getCarposter() {
    return Cookies.get(Tocarposter)
}
export function getDetail() {
    return Cookies.get(Todetail)
}
export function getGroup() {
    return Cookies.get(Togroupnum)
}
export function getToken() {
    return Cookies.get(TokenKey)
}
export function getCarimg() {
    return Cookies.get(InCarimg)
}
export function getLink() {
    return Cookies.get(InLink)
}

export function setMusicstatus(status) {
    return Cookies.set(musicstatus, status)
}

export function setStorebuy(store) {
    console.log(store, 'StorebuyStorebuyStorebuy')
    return Cookies.set(Storebuy, store)
}
export function setToken(token) {
    return Cookies.set(TokenKey, token)
}
export function setCarimg(img) {
    return Cookies.set(InCarimg, img)
}
export function setLink(link) {
    return Cookies.set(InLink, link)
}
export function setGroup(group) {
    return Cookies.set(Togroupnum, group)
}

export function setDetail(detail) {
    return Cookies.set(Todetail, detail)
}

export function setCarposter(detail) {
    return Cookies.set(Tocarposter, detail)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function removeStorebuy() {
    return Cookies.remove(Storebuy)
}

export function removeLink() {
    return Cookies.remove(InLink)
}
export function removeGroup() {
    return Cookies.remove(Togroupnum)
}
// 获取活动id
export function getId() {
    return Cookies.get(ToId)
}
// 设置活动id
export function setId(id) {
    return Cookies.set(ToId, id)
}
// 删除分享人id
export function removeFrom() {
    return Cookies.remove(ToId)
}
// 设置分享人的头像 setAvatar
export function setAvatar(avatar) {
    return Cookies.set(ToAvatar, avatar)
}
// 获取登录人头像
export function getAvatar() {
    return Cookies.get(ToAvatar)
}
// 删除登录人头像
export function removeAvatar() {
    return Cookies.remove(ToAvatar)
}

// 删除音乐
export function removeMusicstatus() {
    return Cookies.remove(musicstatus)
}
