import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/manager/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/manager/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/manager/user/logout',
    method: 'post'
  })
}
