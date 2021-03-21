import request from '../utils/request'

// 销售单
export function getSalesId(){
    return request({
        url:'/sales/salesid',
        method: 'get'
    })
}

export function addSales(params){
    return request({
        url:'/sales/add',
        method: 'post',
        params
    })
}

export function getSalesById(id){
    return request({
        url:'/sales/list/'+id,
        method: 'get'
    })
}

export function updateSalesApproval(params){
    return request({
        url:'/sales/approval',
        method: 'post',
        params
    })
}

export function deleteSales(id){
    return request({
        url:'/sales/delete/'+id,
        method: 'post',
    })
}

export function updateSales(params){
    return request({
        url:'/sales/update',
        method: 'post',
        params
    })
}

export function getSalesList(params){
    return request({
        url:'/sales/list',
        method: 'get',
        params
    })
}

export function updateSalesSettle(params){
    return request({
        url:'/sales/settle',
        method: 'post',
        params
    })
}

export function updateSalesClosing(params){
    return request({
        url:'/sales/closing',
        method: 'post',
        params
    })
}

// 销售出库单
export function getSalesStockoutId(){
    return request({
        url:'/salesstockout/salesstockoutid',
        method: 'get'
    })
}

export function addSalesStockout(params){
    return request({
        url:'/salesstockout/add',
        method: 'post',
        params
    })
}

export function getSalesStockoutById(id){
    return request({
        url:'/salesstockout/list/'+id,
        method: 'get'
    })
}

export function updateSalesStockoutApproval(params){
    return request({
        url:'/salesstockout/approval',
        method: 'post',
        params
    })
}

export function deleteSalesStockout(id){
    return request({
        url:'/salesstockout/delete/'+id,
        method: 'post',
    })
}

export function updateSalesStockout(params){
    return request({
        url:'/salesstockout/update',
        method: 'post',
        params
    })
}

export function getSalesStockoutList(params){
    return request({
        url:'/salesstockout/list',
        method: 'get',
        params
    })
}

export function getSalesStockoutByCustomerId(customerId){
    return request({
        url:'/salesstockout/list/customer/'+customerId,
        method: 'get'
    })
}

// 销售退货单
export function getSalesReturnId(){
    return request({
        url:'/salesreturn/salesreturnid',
        method: 'get'
    })
}

export function addSalesReturn(params){
    return request({
        url:'/salesreturn/add',
        method: 'post',
        params
    })
}

export function getSalesReturnById(id){
    return request({
        url:'/salesreturn/list/'+id,
        method: 'get'
    })
}

export function updateSalesReturnApproval(params){
    return request({
        url:'/salesreturn/approval',
        method: 'post',
        params
    })
}

export function deleteSalesReturn(id){
    return request({
        url:'/salesreturn/delete/'+id,
        method: 'post',
    })
}

export function updateSalesReturn(params){
    return request({
        url:'/salesreturn/update',
        method: 'post',
        params
    })
}

export function getSalesReturnList(params){
    return request({
        url:'/salesreturn/list',
        method: 'get',
        params
    })
}

export function updateSalesReturnSettle(params){
    return request({
        url:'/salesreturn/settle',
        method: 'post',
        params
    })
}

export function updateSalesReturnClosing(params){
    return request({
        url:'/salesreturn/closing',
        method: 'post',
        params
    })
}

// 销售业绩
export function getSalesRecordList(params){
    return request({
        url:'/salesrecord/list',
        method: 'get',
        params
    })
}
