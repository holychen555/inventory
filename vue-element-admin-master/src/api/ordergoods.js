import request from '../utils/request'
export function addOrderGoods(data){
    return request({
        url:'/ordergoods/add',
        method: 'post',
        data
    })
}

export function getOrderGoods(params){
    return request({
        url:'/ordergoods/orderid/'+params,
        method: 'get'
    })
}

export function deleteOrderGoods(orderId){
    return request({
        url:'/ordergoods/delete/'+orderId,
        method: 'post',
    })
}

export function updateOrderGoods(data){
    return request({
        url:'/ordergoods/update',
        method: 'post',
        data
    })
}

// export function getPurchaseId(){
//     return request({
//         url:'/purchase/purchaseid',
//         method: 'get'
//     })
// }



// export function getPurchaseById(params){
//     return request({
//         url:'/purchase/list/'+params,
//         method: 'get'
//     })
// }




