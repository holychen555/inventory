<template>
    <div class="order">  
        <div class="order__name">
            <div class="order-title">采购入库单<span @click="goBack" class="back">&lt; 返回</span></div>
             <svg-icon class="svg-icon" :icon-class="status" />
            <div v-if="status=='status_approving'">
                <el-button size="mini" @click="disagree">驳回</el-button>
                <el-button size="mini" type="primary" @click="agree">审批通过</el-button>
            </div>
            <div v-if="status=='status_rejected'">
                <el-button size="mini" @click="deleteOrder">删除</el-button>
                <el-button size="mini" type="primary" @click="editOrder">编辑</el-button>
            </div>
        </div>
        <div>
            <div class="order-info">
                <div class="order-info__item">
                    <span class="order-info__name">编号：</span>
                    <span class="order-info__value">{{postForm.id}}</span>
                </div>
                 <div class="order-info__item">
                    <span class="order-info__name">入库日期：</span>
                    <span class="order-info__value">{{postForm.stockingDate | filterDate}}</span>
                </div>
                 <div class="order-info__item">
                    <span class="order-info__name">采购人员：</span>
                    <span class="order-info__value">{{showStaffName(postForm.owner)}}</span>
                </div>
            </div>
            <div class="goods-list">
                <el-table
                    v-loading="loading"
                    ref="goodsList"
                    :data="goodsList"
                    style="width: 100%"
                    :header-cell-style="{
                        background: '#e8e8e8',
                        color: '#323232',
                        borderLeft: '1px solid #eef1f5',
                    }"
                    border
                    row-key="index"
                    show-summary
                    :cell-style="{
                        borderLeft: '1px solid #eef1f5',
                        borderBottom: '1px solid #eef1f5',
                    }"
                    :summary-method="getSummaries"
                >
                    <el-table-column type="index" align="center" width="40">
                    </el-table-column>
                    <el-table-column width="200px" align="left" label="商品名称" show-overflow-tooltip>
                        <template slot-scope="{ row }">
                            <span>{{ row.goodsName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120px" align="left" label="商品编号">
                        <template slot-scope="{ row }">
                            <span>{{ row.goodsId }}</span>
                        </template>
                    </el-table-column>
                     <el-table-column width="120px" align="left" prop="goodsNum" label="数量">
                        <template slot-scope="{ row }">
                            <span>{{ row.goodsNum }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120px" align="left" label="单位">
                        <template slot-scope="{ row }">
                            <span>{{ row.goodsUnit }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120px" align="left" label="规格型号" show-overflow-tooltip>
                        <template slot-scope="{ row }">
                            <span>{{ row.goodsModel }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120px" align="left" label="采购单价(元)">
                        <template slot-scope="{ row }">
                            <span>{{ row.goodsPrice }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="130px" align="left" prop="goodsSum" label="采购金额(元)">
                        <template slot-scope="{ row }">
                            <span>{{ row.goodsSum = row.goodsNum * row.goodsPrice }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="170px" align="left" label="仓库">
                        <template slot-scope="{ row }">
                            <span>{{ showWarehouseName(row.warehouseId) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="150px" align="left" label="备注">
                        <template slot-scope="{ row }">
                            <span>{{ row.msg }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="order-other">
                <div>
                    <span class="order-other__title">其他信息</span>
                </div>
                <el-divider></el-divider>
                <div>
                    <span class="order-other__label">创建人：</span>
                    <span class="order-other__value">{{showStaffName(postForm.createdBy)}}</span>
                    <span class="order-other__label">创建时间：</span>
                    <span class="order-other__value">{{postForm.createdDate}}</span>
                </div>
                <div v-if="status!='status_approving'">
                    <span class="order-other__label">审批人：</span>
                    <span class="order-other__value">{{showStaffName(postForm.approvalBy)}}</span>
                    <span class="order-other__label">审批时间：</span>
                    <span class="order-other__value">{{postForm.approvalDate}}</span>
                </div>
                <div v-if="status=='status_rejected'">
                    <span class="order-other__label">驳回原因：</span>
                    <span class="order-other__value">{{postForm.approvalMsg}}</span>
                </div>
                <div v-if="status=='status_passed'">
                    <span class="order-other__label">通过原因：</span>
                    <span class="order-other__value">{{postForm.approvalMsg}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getPurchaseStockinById,updatePurchaseStockinApproval,deletePurchaseStockin } from "@/api/purchase";
import { deleteOrderGoods } from "@/api/ordergoods";
import {info} from '../mixins/info';
export default {
    mixins: [info],
    props: ["orderId"],
    created() {
        getPurchaseStockinById(this.orderId).then((res) => {
            console.log(res);
            if (res.code == 0) {
                this.postForm = res.data;
            }
        });
    },
    methods: {
        agree(){
            this.$prompt('请输入通过备注', '提示', {
                confirmButtonText: '通过',
                cancelButtonText: '取消',
                }).then(({ value }) => {
                    updatePurchaseStockinApproval({id:this.orderId,approvalStatus: 1,approvalMsg: value}).then(res=>{
                        if(res.code==0){
                            getPurchaseStockinById(this.orderId).then((res) => {
                                console.log(res);
                                if (res.code == 0) {
                                    this.postForm = res.data;
                                }
                            });
                        }
                    })
            })
        },
        disagree(){
            this.$prompt('请输入驳回备注', '提示', {
                confirmButtonText: '驳回',
                cancelButtonText: '取消',
                }).then(({ value }) => {
                    updatePurchaseStockinApproval({id:this.orderId,approvalStatus: 2,approvalMsg: value}).then(res=>{
                        if(res.code==0){
                            getPurchaseStockinById(this.orderId).then((res) => {
                                console.log(res);
                                if (res.code == 0) {
                                    this.postForm = res.data;
                                }
                            });
                        }
                    })
            })
        },
        deleteOrder() {
            let p1 = deleteOrderGoods(this.orderId);
            let p2 = deletePurchaseStockin(this.orderId);
            Promise.all([p1, p2])
                .then((res) => {
                    let success = res.every(item=>item.code==0);
                    if(success){
                        this.$router.go(-1);
                    }
                })
                .catch((err) => {
                    this.$notify({  offset: 100,
                        title: "错误",
                        message: err[0].msg,
                        type: "error",
                    });
                });
        },
        editOrder() {
            this.$router.push({path:'/purchase/order/cgrk?orderId='+this.orderId});
        },
    },
};
</script>

<style scoped>
.order {
    padding: 20px 15px;
}
.order__name {
    position: relative;
    width: 100%;
    /* height: 40px; */
    margin-bottom: 30px;
    font-size: 18px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
}
.order-title {
    padding-left: 20px;
}
.order-info {
    width: 100%;
    padding: 15px;
    background-color: #f7fbfe;
    display: flex;
}
.order-info__item {
    margin: 0 10px;
    font-size: 14px;
}
.order-info__name {
    color: #666;
    padding-right: 10px;
}
.order-info__value {
    color: #666;
}
.svg-icon {
    position: absolute;
    left: 180px;
    top: -25px;
    width: 110px;
    height: 110px;
}
.order-other {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #fff;
    color: #666;
}
.order-other >>> .el-divider--horizontal{
    margin: 10px 0;
}
.order-other__title {
    padding-left: 25px;
    font-size: 14px;
    color: #666;
}
.order-other__label {
    font-weight: bold;
    font-size: 14px;
    line-height: 40px;
    padding-right: 10px;
    padding-left: 25px;
}
.order-other__value {
    display: inline-block;
    width: 250px;
    font-size: 14px;
}
</style>