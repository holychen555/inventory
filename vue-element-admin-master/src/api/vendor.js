import request from '../utils/request'
export function getVendor(params){
    return request({
        url:'/vendor/list',
        method: 'get',
        params
    })
}

export function getVendorByName(params){
    return request({
        url:'/vendor/list/name',
        method: 'get',
        params
    })
}


export function getVendorById(params){
    return request({
        url:'/vendor/list/'+params,
        method: 'get'
    })
}


export function deleteVendor(list){
    return request({
        url:'/vendor/delete',
        method: 'post',
        data: {'vendorIdList':list}
    })
}

export function addVendor(params){
    return request({
        url:'/vendor/add',
        method: 'post',
        params
    })
}

export function updateVendor(params){
    return request({
        url:'/vendor/update',
        method: 'post',
        params
    })
}