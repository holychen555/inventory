<template>
    <div class="order">
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
            >
                <el-table-column label="销售单编号" width="200" prop="id">
                    
                    <template slot-scope="scope">
                       
                        <router-link
                            :to="'/sales/detail/'+scope.row.id" 
                        >
                            <span class="order-id">{{scope.row.id}}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="单据日期" width="120" prop="id">
                    <template slot-scope="scope">{{
                        scope.row.orderDate | filterDate
                    }}</template>
                </el-table-column>
                <el-table-column label="交货日期" width="120" prop="id">
                    <template slot-scope="scope">{{
                        scope.row.deliveryDate | filterDate
                    }}</template>
                </el-table-column>
                <el-table-column prop="customerId" label="客户名称" width="120">
                    <template slot-scope="scope">{{
                        showCustomerName(scope.row.customerId)
                    }}</template>
                </el-table-column>
                <el-table-column prop="owner" label="销售人员" width="120">
                    <template slot-scope="scope">{{
                        showStaffName(scope.row.owner)
                    }}</template>
                </el-table-column>
                 <el-table-column prop="totalAmount" label="应收款" width="120">
                    <template slot-scope="scope">{{
                        scope.row.totalAmount
                    }}</template>
                </el-table-column>
                <el-table-column
                    prop="approvalStatus"
                    label="审批状态"
                    width="120"
                >
                    <template slot-scope="scope">{{
                        scope.row.approvalStatus | filterApprovalStatus
                    }}</template>
                </el-table-column>
                <el-table-column prop="approvalBy" label="审批人员" width="120">
                    <template slot-scope="scope" v-if="scope.row.approvalBy">{{
                        showStaffName(scope.row.approvalBy)
                    }}</template>
                </el-table-column>
                 <el-table-column label="关联的销售入库单"  prop="relatedToId" width="200">
                    
                    <template slot-scope="scope">
                       
                        <router-link
                            :to="'/sales/detail/'+scope.row.relatedToId" 
                        >
                            <span class="order-id">{{scope.row.relatedToId}}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="createdBy" label="创建人" width="100">
                    <template slot-scope="scope" v-if="scope.row.createdBy">{{
                        showStaffName(scope.row.createdBy)
                    }}</template>
                </el-table-column>
                <el-table-column prop="createdDate" label="创建时间" width="120" show-overflow-tooltip>
                    <template slot-scope="scope">{{
                        scope.row.createdDate
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
import { getSalesList } from "@/api/sales";
import {list} from '../mixins/list'
export default {
    mixins: [list],
    methods: {
        getList() {
            this.listLoading = true;
            getSalesList(this.listQuery).then((res) => {
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
    margin-top: 20px;
}
.order-id {
    color: #459df5;
}
</style>