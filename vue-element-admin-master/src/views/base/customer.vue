<template>
    <div class="customer">
        <div class="customer__header">
            <div class="customer__title">客户列表</div>
            <el-button
                class="customer__add"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="addCustomerInfo"
                >新增客户</el-button
            >
        </div>
        <div class="filter-condiction">
            <div>
                <el-collapse>
                    <el-collapse-item>
                        <div slot="title" class="filter-condiction__default">
                            <div class="filter-condiction__title">
                                筛选条件：
                            </div>
                            <el-tag
                                >客户类型：{{
                                    listQuery.customerType
                                        ? listQuery.customerType
                                        : "全部"
                                }}</el-tag
                            >
                            <el-tag
                                >负责人：{{
                                    listQuery.owner ? listQuery.owner : "全部"
                                }}</el-tag
                            >
                        </div>
                        <div class="filter-condiction__selects">
                            <el-form
                                ref="form"
                                :model="listQuery"
                                label-width="80px"
                                label-style="color: #666;"
                            >
                                <el-form-item label="客户类型">
                                    <el-radio-group
                                        v-model="listQuery.customerType"
                                        size="mini"
                                    >
                                        <el-radio
                                            border
                                            label="全部"
                                        ></el-radio>
                                        <el-radio
                                            border
                                            label="普通客户"
                                        ></el-radio>
                                        <el-radio
                                            border
                                            label="批发客户"
                                        ></el-radio>
                                        <el-radio
                                            border
                                            label="大客户"
                                        ></el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="负责人">
                                    <el-select
                                        v-model="listQuery.owner"
                                        placeholder="请选择负责人"
                                        size="mini"
                                    >
                                        <el-option
                                            label="全部"
                                            value="全部"
                                        ></el-option>
                                        <el-option
                                            label="李海杰"
                                            value="李海杰"
                                        ></el-option>
                                        <el-option
                                            label="钟述"
                                            value="钟述"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <div class="customer-operate">
            <div class="customer-operate__text">
                <span>
                    已选择<span class="customer-operate__num">{{
                        selectedCustomer.length
                    }}</span
                    >个客户
                </span>
                <el-button
                    class="customer__delete"
                    plain
                    icon="el-icon-delete"
                    @click="deleteCustomer"
                    size="mini"
                    >删除</el-button
                >
                <el-button
                    class="customer__delete"
                    plain
                    icon="el-icon-edit"
                    @click="editCustomer"
                    size="mini"
                    >编辑</el-button
                >
            </div>
            <div>
                <el-select
                    v-model="customerSelect"
                    class="customer-operate__select"
                    size="mini"
                >
                    <el-option label="客户名称" value="客户名称"></el-option>
                    <el-option label="客户编号" value="客户编号"></el-option>
                </el-select>
                <el-input
                    class="customer-operate__search"
                    v-model="input"
                    placeholder="搜索编号、客户"
                    size="mini"
                ></el-input>
                <el-button size="mini" plain @click="searchCustomer" >查询</el-button>
            </div>
        </div>
        <div class="customer-list">
            <el-table
                v-loading="listLoading"
                stripe
                height="300px"
                ref="multipleTable"
                :data="list"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{
                    background: '#1890ff',
                    color: '#fff',
                    borderLeft: '1px solid #3589dc',
                }"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" border width="55">
                </el-table-column>
                <el-table-column label="客户编号" width="120" prop="customerId">
                    <template slot-scope="scope">{{
                        scope.row.customerId
                    }}</template>
                </el-table-column>
                <el-table-column
                    prop="customerName"
                    label="客户名称"
                    width="120"
                >
                    <!-- <template slot-scope="scope">{{ scope.row.customerName }}</template> -->
                </el-table-column>
                <el-table-column label="客户类型" width="120">
                    <template slot-scope="scope">{{
                        scope.row.customerType
                    }}</template>
                </el-table-column>
                <el-table-column
                    width="120"
                    prop="owner"
                    label="负责人"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    width="120"
                    prop="contactName"
                    label="联系人"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="createdDate"
                    label="创建时间"
                    show-overflow-tooltip
                >
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
        <el-dialog :title="customerTitle" :visible.sync="dialogFormVisible">
            <customer-info
                :isEdit="isEdit"
                :formData="formData"
                @cancel="dialogFormVisible = false"
                @confirm="dialogFormVisible = false"
                @refresh="this.getList"
            ></customer-info>
        </el-dialog>
    </div>
</template>

<script>
import pagination from "../../components/Pagination/index";
import customerInfo from "./components/customerInfo.vue";
import {
    getCustomer,
    deleteCustomer,
    getCustomerById,
} from "../../api/customer";
export default {
    components: { customerInfo, pagination },
    data() {
        return {
            isEdit: false,
            listLoading: true,
            customerTitle: "新增客户信息",
            dialogFormVisible: false,
            input: "",
            customerSelect: "客户名称",
            selectedCustomer: [],
            listQuery: {},
            categoryList: [],
            list: [],
            total: 100,
            defaultSort: {},
            formData: {},
        };
    },
    watch: {
        listQuery: {
            handler(val) {
                // console.log(val);
                this.getList();
            },
            deep: true,
        },
        input(val) {
            if (val == 0) {
                delete this.listQuery.customerName;
                delete this.listQuery.customerId;
            }
        },
    },
    created() {
        this.parseQuery();
    },
    mounted() {
        // this.getCategoryList()
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
                path: "/base/customer",
                query: this.listQuery,
            });
        },
        getList() {
            this.listLoading = true;
            getCustomer(this.listQuery).then((res) => {
                const { list, count } = res.data;
                this.list = list;
                this.total = count;
                this.listLoading = false;
            });
        },
        handleSelectionChange(val) {
            this.selectedCustomer = val;
        },
        addCustomerInfo() {
            this.dialogFormVisible = true;
            this.customerTitle = "新增客户信息";
            this.isEdit = false;
            this.formData = {
                customerName: "",
                customerType: "",
                owner: "",
                contactName: "",
                contactPhone: "",
                recipientName: "",
                recipientPhone: "",
                recipientAddress: "",
            }
        },
        deleteCustomer() {
            if (this.selectedCustomer.length == 0) {
                this.$notify.warning({  offset: 100,
                    title: "警告",
                    message: "请选择客户",
                });
                return
            }
            let customerIdList = "";
            this.selectedCustomer.forEach((e) => {
                customerIdList += ",'" + e.customerId + "'";
            });
            customerIdList = customerIdList.slice(1);
            // console.log(customerIdList);
            this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deleteCustomer(customerIdList).then((res) => {
                        if (res.code == 0) {
                            this.$notify({  offset: 100,
                                title: "成功",
                                message: res.msg,
                                type: "success",
                            });
                            this.getList();
                        }
                    });
                })
                .catch(() => {});
        },
        editCustomer() {
            if (this.selectedCustomer.length !== 1) {
                this.$notify.warning({  offset: 100,
                    title: "警告",
                    message: "必须且只能选择一个客户",
                });
                return;
            }
            getCustomerById(this.selectedCustomer[0].customerId).then((res) => {
                if (res.code == 0) {
                    console.log(res);
                    this.isEdit = true;
                    this.customerTitle = "编辑客户信息";
                    this.formData = res.data;
                    this.dialogFormVisible = true;
                }
            });
        },
        searchCustomer() {
            if (this.input) {
                if (this.customerSelect == "客户名称") {
                    delete this.listQuery.customerId;
                    this.listQuery.customerName = this.input;
                } else {
                    delete this.listQuery.customerName;
                    this.listQuery.customerId = this.input;
                }
                this.getList();
            } else {
                this.getList();
            }
        },
    },
};
</script>
<style scoped>
.customer >>> .el-form-item__label {
    color: #666;
    font-weight: normal;
}
</style>
<style lang="scss" scoped>
.customer {
    margin: 30px 15px;
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
.customer-operate {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    &__text {
        color: #666;
        font-size: 14px;
    }
    &__num {
        color: #459df5;
        padding: 5px;
    }
    &__search {
        display: inline-block;
        width: 150px;
    }
    &__select {
        width: 120px;
    }
}
.customer-list {
    margin-top: 10px;
}
.filter-condiction {
    margin-top: 20px;
    
    &__selects {
        margin-top: 10px;
    }
    &__default {
        display: flex;
        line-height: 30px;
    }
    &__title {
        padding-left: 10px;
        font-size: 14px;
        color: #666;
    }
}
</style>