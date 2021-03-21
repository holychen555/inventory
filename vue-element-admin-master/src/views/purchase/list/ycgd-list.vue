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
                <el-table-column label="预采购单编号" width="200" prop="id">
                    
                    <template slot-scope="scope">
                       
                        <router-link
                            :to="'/purchase/detail/'+scope.row.id" 
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
                <el-table-column prop="owner" label="采购人员" width="120">
                    <template slot-scope="scope">{{
                        showStaffName(scope.row.owner)
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
                 <el-table-column label="关联的采购单" prop="id">
                    
                    <template slot-scope="scope" v-if="scope.row.relatedToId">
                       
                        <router-link
                            :to="'/purchase/detail/'+scope.row.relatedToId" 
                        >
                            <span class="order-id">{{scope.row.relatedToId}}</span>
                        </router-link>
                    </template>
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
import { getPrePurchaseList } from "@/api/purchase";
import {list} from '../mixins/list'
export default {
    mixins: [list],
    methods: {
        getList() {
            this.listLoading = true;
            getPrePurchaseList(this.listQuery).then((res) => {
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