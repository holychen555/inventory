<template>
    <div>
        <div class="order-list">
            <el-table
                v-loading="listLoading"
                stripe
                ref="multipleTable"
                :data="list"
                tooltip-effect="dark"
                :header-cell-style="{
                    background: '#1890ff',
                    color: '#fff',
                    borderLeft: '1px solid #3589dc',
                }"
                show-summary
            >
               
                <el-table-column label="单据" width="200" prop="orderId">
                </el-table-column>
                <el-table-column prop="vendorId" label="供应商名称" width="120">
                    <template slot-scope="scope">{{
                        showVendorName(scope.row.vendorId)
                    }}</template>
                </el-table-column>
                 <el-table-column prop="warehouseId" label="仓库名称" width="120">
                    <template slot-scope="scope">{{
                        showWarehouseName(scope.row.warehouseId)
                    }}</template>
                </el-table-column>
                 <el-table-column label="商品编号" width="120" prop="goodsId">
                </el-table-column>
                 <el-table-column label="商品名称" width="200" prop="goodsName" show-overflow-tooltip>
                </el-table-column>
                 <el-table-column label="规格" width="120" prop="goodsModel">
                </el-table-column>
                 <el-table-column label="单位" width="120" prop="goodsUnit">
                </el-table-column>
                 <el-table-column label="数量" width="120" prop="goodsNum">
                </el-table-column>
                 <el-table-column label="采购单价" width="120" prop="goodsPrice">
                </el-table-column>
                <el-table-column prop="owner" label="采购人员" width="120">
                    <template slot-scope="scope">{{
                        showStaffName(scope.row.owner)
                    }}</template>
                </el-table-column>
                 <el-table-column prop="orderDate" label="单据日期" width="120">
                    <template slot-scope="scope">{{
                        scope.row.orderDate | filterDate
                    }}</template>
                </el-table-column>
            </el-table>
        </div>
        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.pageSize"
            @pagination="refresh"
        />
    </div>
</template>

<script>
import { getPurchaseReport } from "@/api/reports";
import {list} from '../mixins/list.js';
export default {
    mixins: [list],
    methods: {
        getList() {
            this.listLoading = true;
            getPurchaseReport(this.listQuery).then((res) => {
                const { list, count } = res.data;
                this.list = list;
                this.total = count;
                this.listLoading = false;
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.order {
    width: 100%;
    &__header {
        display: flex;
        justify-content: space-between;
    }
    &__title {
        // height: 40px;
        font-size: 18px;
        line-height: 20px;
    }
    &__delete {
        margin-left: 10px;
    }
}

.order-list {
    margin-top: 10px;
}
.order-id {
    color: #459df5;
}
</style>