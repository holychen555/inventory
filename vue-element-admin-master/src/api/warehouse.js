import request from '../utils/request'
export function getWareHouse(params){
    return request({
        url:'/warehouse/list',
        method: 'get',
        params
    })
}

export function getAllWareHouse(){
    return request({
        url:'/warehouse/list/all',
        method: 'get',
    })
}


export function deleteWareHouse(id){
    return request({
        url:'/warehouse/delete',
        method: 'post',
        data: {'warehouseId':id}
    })
}

export function addWareHouse(params){
    return request({
        url:'/warehouse/add',
        method: 'post',
        params
    })
}

export function updateWareHouse(params){
    return request({
        url:'/warehouse/update',
        method: 'post',
        params
    })
}