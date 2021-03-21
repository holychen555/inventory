import request from '../utils/request'
export function login(data) {
    return request({
      url: '/staff/login',
      method: 'post',
      data
    })
  }
  
  export function getStaffInfo() {
    return request({
      url: '/staff/info',
      method: 'get'
    })
  }


export function getStaff(params){
    return request({
        url:'/staff/list',
        method: 'get',
        params
    })
}

export function getAllStaff(){
    return request({
        url:'/staff/list/all',
        method: 'get'
    })
}


export function deleteStaff(list){
    return request({
        url:'/staff/delete',
        method: 'post',
        data: {'staffIdList':list}
    })
}

export function addStaff(params){
    return request({
        url:'/staff/add',
        method: 'post',
        params
    })
}

export function updateStaff(params){
    return request({
        url:'/staff/update',
        method: 'post',
        params
    })
}