import request from '../utils/request'
export function getCustomer(params){
    return request({
        url:'/customer/list',
        method: 'get',
        params
    })
}

export function getCustomerByName(params){
    return request({
        url:'/customer/list/name',
        method: 'get',
        params
    })
}

export function getCustomerById(params){
    return request({
        url:'/customer/list/'+params,
        method: 'get'
    })
}


export function deleteCustomer(list){
    return request({
        url:'/customer/delete',
        method: 'post',
        data: {'customerIdList':list}
    })
}

export function addCustomer(params){
    return request({
        url:'/customer/add',
        method: 'post',
        params
    })
}

export function updateCustomer(params){
    return request({
        url:'/customer/update',
        method: 'post',
        params
    })
}