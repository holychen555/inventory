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
                <el-table-column label="预入库单编号" width="200" prop="id">
                    
                    <template slot-scope="scope">
                       
                        <router-link
                            :to="'/purchase/detail/'+scope.row.id" 
                        >
                            <span class="order-id">{{scope.row.id}}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="到货日期" width="120" prop="id">
                    <template slot-scope="scope">{{
                        scope.row.arrivalDate | filterDate
                    }}</template>
                </el-table-column>
                <el-table-column prop="vendorId" label="供应商名称" width="120">
                    <template slot-scope="scope">{{
                        showVendorName(scope.row.vendorId)
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
                 <el-table-column label="关联的采购单"  prop="relatedFromId" width="200">
                    
                    <template slot-scope="scope" v-if="scope.row.relatedFromId">
                       
                        <router-link
                            :to="'/purchase/detail/'+scope.row.relatedFromId" 
                        >
                            <span class="order-id">{{scope.row.relatedFromId}}</span>
                        </router-link>
                    </template>
                </el-table-column>
                  <el-table-column label="关联的采购入库单"  prop="relatedToId" width="200">
                    
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
import { getPreStockinList } from "@/api/purchase";
import {list} from '../mixins/list';
export default {
    mixins: [list],
    methods: {
        getList() {
            this.listLoading = true;
            getPreStockinList(this.listQuery).then((res) => {
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