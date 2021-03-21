<template>
    <div>
        <condiction
            type="collectings"
            @changeListQuery="changeListQuery"
        ></condiction>
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
                    show-summary
                    :summary-method="getSummaries"
                >
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button
                                v-if="scope.row.closingStatus == 0"
                                type="text"
                                size="small"
                                @click="changeSettleStatus(scope.row)"
                                >付款</el-button
                            >
                            <el-button
                                v-if="scope.row.closingStatus == 0"
                                type="text"
                                size="small"
                                @click="changeClosingStatus(scope.row)"
                                >结案</el-button
                            >
                            <el-button
                                v-if="scope.row.closingStatus == 1"
                                type="text"
                                size="small"
                                @click="changeClosingStatus(scope.row)"
                                >反结案</el-button
                            >
                        </template>
                    </el-table-column>
                    <el-table-column label="单据编号" width="200" prop="id">
                        <template slot-scope="scope">
                            <router-link
                                :to="'/sales/detail/' + scope.row.id"
                            >
                                <span class="order-id">{{ scope.row.id }}</span>
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="单据类型" prop="type">
                        <template slot-scope="scope">
                            {{ scope.row.id | filterOrderType }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单据日期" prop="orderDate">
                        <template slot-scope="scope">{{
                            scope.row.orderDate | filterDate
                        }}</template>
                    </el-table-column>
                    <el-table-column prop="customerId" label="客户名称">
                        <template slot-scope="scope">{{
                            showCustomerName(scope.row.customerId)
                        }}</template>
                    </el-table-column>
                    <el-table-column prop="totalAmount" label="应收金额">
                        <template slot-scope="scope">{{
                            scope.row.totalAmount
                        }}</template>
                    </el-table-column>
                    <el-table-column prop="amount" label="已收金额">
                        <template slot-scope="scope">{{
                            scope.row.amount = scope.row.settleStatus == 0
                                ? 0
                                : scope.row.totalAmount
                        }}</template>
                    </el-table-column>
                    <el-table-column prop="owner" label="销售人员">
                        <template slot-scope="scope">{{
                            showStaffName(scope.row.owner)
                        }}</template>
                    </el-table-column>
                    <el-table-column prop="approvalStatus" label="结案状态">
                        <template slot-scope="scope">{{
                            scope.row.closingStatus | filterClosingStatus
                        }}</template>
                    </el-table-column>
                    <el-table-column label="付款日期" prop="payDate">
                        <template slot-scope="scope">{{
                            scope.row.payDate | filterDate
                        }}</template>
                    </el-table-column>
                    <el-table-column label="创建日期" prop="createdDate">
                        <template slot-scope="scope">{{
                            scope.row.createdDate | filterDate
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
    </div>
</template>

<script>
import { getCollectingsList } from "@/api/finance";
import { updateSalesSettle, updateSalesClosing } from "@/api/sales";
import { updateSalesReturnSettle, updateSalesReturnClosing } from "@/api/sales";
import condiction from "./condiction";
import pagination from "@/components/Pagination/index";
import { getAllStaff } from "@/api/staff";
import { getCustomerByName } from "@/api/customer";
export default {
    components: { pagination, condiction },
    data() {
        return {
            listLoading: true,
            list: [],
            total: 100,
            customerList: [],
            staffList: [],
            listQuery: {},
        };
    },
    props: ["query"],
    watch: {
        listQuery: {
            handler(val) {
                this.getList();
            },
            deep: true,
        },
        query(val) {
            this.listQuery = val;
        },
    },
    filters: {
        filterDate(val) {
            if (val && val.length > 0) {
                return val.split(" ")[0];
            }
        },
        filterOrderType(val) {
            if (val && val.length > 0) {
                let type = val.slice(0, 4);
                if (type == "XSTH") {
                    return "销售退货单";
                } else if (type == "XSDD") {
                    return "销售订单";
                }
            }
        },
        filterClosingStatus(val) {
            if (val == 0) {
                return "未结案";
            } else {
                return "已结案";
            }
        },
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
    created() {
        this.parseQuery();
        getCustomerByName().then((res) => {
            if (res.code == 0) {
                this.customerList = res.data.list;
            }
        });
        getAllStaff().then((res) => {
            if (res.code == 0) {
                this.staffList = res.data.list;
            }
        });
    },
    mounted() {
        this.getList();
    },
    methods: {
        // 付款
        changeSettleStatus(val) {
            console.log(val);
            const data = {
                id: val.id,
            };
            this.listLoading = true;
            let type = val.id.slice(0, 4);
            if (type == "XSTH") {
                updateSalesReturnSettle(data).then((res) => {
                    if (res.code == 0) {
                        this.getList();
                    }
                });
            } else {
                updateSalesSettle(data).then((res) => {
                    if (res.code == 0) {
                        this.getList();
                    }
                });
            }
        },
        // 结案/反结案
        changeClosingStatus(val) {
            console.log(val);
            const data = {
                id: val.id,
                settleStatus: val.settleStatus,
                closingStatus: val.closingStatus == 0 ? 1 : 0,
            };
            this.listLoading = true;
            let type = val.id.slice(0, 4);
            if (type == "XSTH") {
                updateSalesReturnClosing(data).then((res) => {
                    if (res.code == 0) {
                        this.getList();
                    }
                });
            } else {
                updateSalesClosing(data).then((res) => {
                    if (res.code == 0) {
                        this.getList();
                    }
                });
            }
           
        },
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
                path: "/finance/index",
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
        showCustomerName(id) {
            let name = "";
            this.customerList.forEach((item) => {
                if (item.value == id) {
                    name = item.label;
                }
            });
            return name;
        },
        getList() {
            this.listLoading = true;
            getCollectingsList(this.listQuery).then((res) => {
                const { list, count } = res.data;
                this.list = list;
                this.total = count;
                this.listLoading = false;
            });
        },
        changeListQuery(val) {
            this.listQuery = val;
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = "合计";
                    return;
                }
                if (index == 5 || index == 6) {
                    const values = data.map((item) => {
                        return Number(item[column.property]);
                    });
                    if (!values.every((value) => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                    } else {
                        sums[index] = "N/A";
                    }
                }
            });

            return sums;
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