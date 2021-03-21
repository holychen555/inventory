import request from '../utils/request'
// 盘点单
export function getCheckId(){
    return request({
        url:'/check/checkid',
        method: 'get'
    })
}

export function addCheck(params){
    return request({
        url:'/check/add',
        method: 'post',
        params
    })
}

export function getCheckById(id){
    return request({
        url:'/check/list/'+id,
        method: 'get'
    })
}

export function updateCheckApproval(params){
    return request({
        url:'/check/approval',
        method: 'post',
        params
    })
}

export function deleteCheck(id){
    return request({
        url:'/check/delete/'+id,
        method: 'post',
    })
}

export function updateCheck(params){
    return request({
        url:'/check/update',
        method: 'post',
        params
    })
}

export function getCheckList(params){
    return request({
        url:'/check/list',
        method: 'get',
        params
    })
}

// 库存预警
export function getWarningList(params){
    return request({
        url:'/warning/list',
        method: 'get',
        params
    })
}