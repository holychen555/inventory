import request from '../utils/request'

// 采购单
export function getPurchaseId(){
    return request({
        url:'/purchase/purchaseid',
        method: 'get'
    })
}

export function addPurchase(params){
    return request({
        url:'/purchase/add',
        method: 'post',
        params
    })
}

export function getPurchaseById(id){
    return request({
        url:'/purchase/list/'+id,
        method: 'get'
    })
}

export function updatePurchaseApproval(params){
    return request({
        url:'/purchase/approval',
        method: 'post',
        params
    })
}

export function deletePurchase(id){
    return request({
        url:'/purchase/delete/'+id,
        method: 'post',
    })
}

export function updatePurchase(params){
    return request({
        url:'/purchase/update',
        method: 'post',
        params
    })
}

export function getPurchaseList(params){
    return request({
        url:'/purchase/list',
        method: 'get',
        params
    })
}

// 预采购单
export function getPrePurchaseId(){
    return request({
        url:'/prepurchase/prepurchaseid',
        method: 'get'
    })
}

export function addPrePurchase(params){
    return request({
        url:'/prepurchase/add',
        method: 'post',
        params
    })
}

export function getPrePurchaseById(id){
    return request({
        url:'/prepurchase/list/'+id,
        method: 'get'
    })
}

export function updatePrePurchaseApproval(params){
    return request({
        url:'/prepurchase/approval',
        method: 'post',
        params
    })
}

export function deletePrePurchase(id){
    return request({
        url:'/prepurchase/delete/'+id,
        method: 'post',
    })
}

export function updatePrePurchase(params){
    return request({
        url:'/prepurchase/update',
        method: 'post',
        params
    })
}

export function getPrePurchaseList(params){
    return request({
        url:'/prepurchase/list',
        method: 'get',
        params
    })
}

// 预入库单
export function getPreStockinId(){
    return request({
        url:'/prestockin/prestockinid',
        method: 'get'
    })
}

export function addPreStockin(params){
    return request({
        url:'/prestockin/add',
        method: 'post',
        params
    })
}

export function getPreStockinById(id){
    return request({
        url:'/prestockin/list/'+id,
        method: 'get'
    })
}

export function updatePreStockinApproval(params){
    return request({
        url:'/prestockin/approval',
        method: 'post',
        params
    })
}

export function deletePreStockin(id){
    return request({
        url:'/prestockin/delete/'+id,
        method: 'post',
    })
}

export function updatePreStockin(params){
    return request({
        url:'/prestockin/update',
        method: 'post',
        params
    })
}

export function getPreStockinList(params){
    return request({
        url:'/prestockin/list',
        method: 'get',
        params
    })
}

// 采购入库单
export function getPurchaseStockinId(){
    return request({
        url:'/purchasestockin/purchasestockinid',
        method: 'get'
    })
}

export function addPurchaseStockin(params){
    return request({
        url:'/purchasestockin/add',
        method: 'post',
        params
    })
}

export function getPurchaseStockinById(id){
    return request({
        url:'/purchasestockin/list/'+id,
        method: 'get'
    })
}

export function updatePurchaseStockinApproval(params){
    return request({
        url:'/purchasestockin/approval',
        method: 'post',
        params
    })
}

export function deletePurchaseStockin(id){
    return request({
        url:'/purchasestockin/delete/'+id,
        method: 'post',
    })
}

export function updatePurchaseStockin(params){
    return request({
        url:'/purchasestockin/update',
        method: 'post',
        params
    })
}

export function getPurchaseStockinList(params){
    return request({
        url:'/purchasestockin/list',
        method: 'get',
        params
    })
}

export function getPurchaseStockinByVendorId(vendorId){
    return request({
        url:'/purchasestockin/list/vendor/'+vendorId,
        method: 'get'
    })
}


export function updatePurchaseStockinSettle(params){
    return request({
        url:'/purchasestockin/settle',
        method: 'post',
        params
    })
}

export function updatePurchaseStockinClosing(params){
    return request({
        url:'/purchasestockin/closing',
        method: 'post',
        params
    })
}

// 采购退货单
export function getPurchaseReturnId(){
    return request({
        url:'/purchasereturn/purchasereturnid',
        method: 'get'
    })
}

export function addPurchaseReturn(params){
    return request({
        url:'/purchasereturn/add',
        method: 'post',
        params
    })
}

export function getPurchaseReturnById(id){
    return request({
        url:'/purchasereturn/list/'+id,
        method: 'get'
    })
}

export function updatePurchaseReturnApproval(params){
    return request({
        url:'/purchasereturn/approval',
        method: 'post',
        params
    })
}

export function deletePurchaseReturn(id){
    return request({
        url:'/purchasereturn/delete/'+id,
        method: 'post',
    })
}

export function updatePurchaseReturn(params){
    return request({
        url:'/purchasereturn/update',
        method: 'post',
        params
    })
}

export function getPurchaseReturnList(params){
    return request({
        url:'/purchasereturn/list',
        method: 'get',
        params
    })
}

export function updatePurchaseReturnSettle(params){
    return request({
        url:'/purchasereturn/settle',
        method: 'post',
        params
    })
}

export function updatePurchaseReturnClosing(params){
    return request({
        url:'/purchasereturn/closing',
        method: 'post',
        params
    })
}




