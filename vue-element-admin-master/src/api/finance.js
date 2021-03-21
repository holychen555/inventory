import request from '../utils/request'

// 收款单据列表
export function getCollectingsList(params){
    return request({
        url:'/finance/collectings/list',
        method: 'get',
        params
    })
}

// 付款单据列表
export function getPaymentsList(params){
    return request({
        url:'/finance/payments/list',
        method: 'get',
        params
    })
}