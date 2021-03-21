import request from '../utils/request'

// 采购明细报表
export function getPurchaseReport(params){
    return request({
        url:'/reports/purchasereport/list',
        method: 'get',
        params
    })
}

// 销售明细报表
export function getSalesReport(params){
    return request({
        url:'/reports/salesreport/list',
        method: 'get',
        params
    })
}

// 利润报表
export function getProfitReport(params){
    return request({
        url: '/reports/profitreport',
        method:'get',
        params
    })
}

