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
                <el-table-column label="编号" width="200" prop="id">
                    
                    <template slot-scope="scope">
                       
                        <router-link
                            :to="'/stock/check/order/'+scope.row.id" 
                        >
                            <span class="order-id">{{scope.row.id}}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="盘点日期" width="200" prop="id">
                    <template slot-scope="scope">{{
                        scope.row.checkDate
                    }}</template>
                </el-table-column>
                <el-table-column prop="warehouseId" label="仓库名称" width="120">
                    <template slot-scope="scope">{{
                        showWareHouseName(scope.row.warehouseId)
                    }}</template>
                </el-table-column>
                 <el-table-column label="盘点产品量" width="200" prop="id">
                    <template slot-scope="scope">{{
                        scope.row.checkNum
                    }}</template>
                </el-table-column>
                 <el-table-column label="盘盈盘亏" width="200" prop="id">
                    <template slot-scope="scope">{{
                        scope.row.profitAndLoss
                    }}</template>
                </el-table-column>
                <el-table-column prop="owner" label="盘点人员" width="120">
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
import pagination from "@/components/Pagination/index";
import { getAllStaff } from "@/api/staff";
import { getCheckList } from "@/api/stock";
import {getAllWareHouse} from "@/api/warehouse";
export default {
    components: { pagination },
    data() {
        return {
            listLoading: true,
            list: [],
            total: 100,
            warehouseList: [],
            staffList: [],
            listQuery: {}
        };
    },
    props: ['query'],
    watch: {
        listQuery: {
            handler(val) {
                this.getList();
            },
            deep: true,
        },
        query(val){
            this.listQuery = val;
        } 
    },
    filters: {
        filterApprovalStatus(val) {
            if (val == 0) {
                return "待审批";
            } else if (val == 1) {
                return "审批通过";
            } else if (val == 2) {
                return "已驳回";
            }
        },
    },
    created() {
        this.parseQuery();
       
        getAllStaff().then((res) => {
            if (res.code == 0) {
                this.staffList = res.data.list;
            }
        });
        getAllWareHouse().then(res=>{
            if(res.code==0){
                this.warehouseList = res.data.list;
            }
        })
    },
    mounted() {
        this.getList();
    },
    beforeRouteUpdate(to, from, next) {
        if (to.path == from.path) {
            const newQuery = Object.assign({}, to.query);
            const oldQuery = Object.assign({}, from.query);
            if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
                this.getList();
            }
        }
        console.log(to, from);
    },
    methods: {
        parseQuery() {
            const query = Object.assign({}, this.$route.query);
            const listQuery = {
                page: 1,
                pageSize: 10,
            };
            if (query) {
                query.page && (query.page = +query.page);
                query.pageSize && (query.pageSize = +query.pageSize);
            }
            this.listQuery = { ...query, ...listQuery };
        },
        refresh() {
            this.$router.push({
                path: "/stock/check",
                query: this.listQuery,
            });
        },
        showStaffName(id) {
            let name = "";
            this.staffList.forEach((item) => {
                if (item.value == id) {
                    name = item.label;
                }
            });
            return name;
        },
        showWareHouseName (id) {
            let name = "";
            this.warehouseList.forEach((item) => {
                if (item.value == id) {
                    name = item.label;
                }
            });
            return name;
        },
        getList() {
            this.listLoading = true;
            getCheckList(this.listQuery).then((res) => {
                const { list, count } = res.data;
                this.list = list;
                this.total = count;
                this.listLoading = false;
            });
        },
    }
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