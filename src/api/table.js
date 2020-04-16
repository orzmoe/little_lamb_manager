import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/manager/order/list',
    method: 'get',
    params
  })
}
export function getMenu(params) {
  return request({
    url: '/manager/menu/getMenu',
    method: 'get',
    params
  })
}
export function editMenu(data) {
  return request({
    url: '/manager/menu/editMenu',
    method: 'post',
    data
  })
}
export function addMenu(data) {
  return request({
    url: '/manager/menu/addMenu',
    method: 'post',
    data
  })
}
export function getPolicyToken(params) {
  return request({
    url: 'http://oss.apiserver.cc/oss/ali/getPolicyToken',
    method: 'get',
    params
  })
}

export function addContent(data) {
  return request({
    url: '/manager/content/addContent',
    method: 'post',
    data
  })
}
export function sortClass(data) {
  return request({
    url: '/manager/menu/sortClass',
    method: 'post',
    data
  })
}

export function sortMenu(data) {
  return request({
    url: '/manager/menu/sortMenu',
    method: 'post',
    data
  })
}
export function delClass(data) {
  return request({
    url: '/manager/menu/delClass',
    method: 'post',
    data
  })
}
export function addClass(data) {
  return request({
    url: '/manager/menu/addClass',
    method: 'post',
    data
  })
}
export function getContent(params) {
  return request({
    url: '/manager/content/list',
    method: 'get',
    params
  })
}
