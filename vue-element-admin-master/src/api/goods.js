import request from '../utils/request'
// 商品分类
export function getGoodsCategory(){
    return request({
        url:'/goods/category',
        method: 'get'
    })
}

export function addGoodsCategory(categoryName) {
    return request({
        url:'/goods/category/add',
        method: 'post',
        data: {categoryName:categoryName}
    })
}

export function deleteGoodsCategory(categoryName) {
    return request({
        url:'/goods/category/delete',
        method: 'post',
        data: {categoryName:categoryName}
    })
}

export function updateGoodsCategory(category) {
    return request({
        url:'/goods/category/update',
        method: 'post',
        data: category
    })
}

// 商品
export function getGoods(params){
    return request({
        url:'/goods/list',
        method: 'get',
        params
    })
}

export function getGoodsById(params){
    return request({
        url:'/goods/list/'+params,
        method: 'get'
    })
}


export function deleteGoods(list){
    return request({
        url:'/goods/delete',
        method: 'post',
        data: {'goodsIdList':list}
    })
}

export function addGoods(params){
    return request({
        url:'/goods/add',
        method: 'post',
        params
    })
}

export function updateGoods(params){
    return request({
        url:'/goods/update',
        method: 'post',
        params
    })
}

export function toggleGoodsDisabled(params){
    return request({
        url: '/goods/togglestatus',
        method: 'post',
        params
    })
}

export function getGoodsByName(params){
    return request({
        url:'/goods/name/'+params,
        method: 'get'
    })
}
