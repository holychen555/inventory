<template>
    <div class="warehouse">
        <div class="warehouse__header">
            <div class="warehouse__title">仓库管理</div>
            <el-button
                class="warehouse__add"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="addWareHouseInfo"
                >新增仓库</el-button
            >
        </div>
        <div class="warehouse-list">
            <el-table
                v-loading="listLoading"
                stripe
                ref="multipleTable"
                :data="list"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{
                    background: '#1890ff',
                    color: '#fff',
                    borderLeft: '1px solid #3589dc',
                }"
            >
                <el-table-column
                    label="仓库编号"
                    width="120"
                    prop="warehouseId"
                >
                    <template slot-scope="scope">{{
                        scope.row.warehouseId
                    }}</template>
                </el-table-column>
                <el-table-column
                    prop="warehouseName"
                    label="仓库名称"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="warehouseAddress"
                    label="仓库地址"
                    width="200"
                >
                </el-table-column>
                <el-table-column
                    width="120"
                    prop="owner"
                    label="负责人"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                     width="160"
                    prop="createdDate"
                    label="创建时间"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="msg"
                    label="备注"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button
                            @click="editWareHouse(scope.row)"
                            type="text"
                            size="small"
                            >编辑</el-button
                        >
                        <el-button
                            type="text"
                            size="small"
                            @click="deleteWareHouse(scope.row)"
                            >删除</el-button
                        >
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
        <el-dialog :title="warehouseTitle" :visible.sync="dialogFormVisible">
            <warehouse-info
                :isEdit="isEdit"
                :formData="formData"
                @cancel="dialogFormVisible = false"
                @confirm="dialogFormVisible = false"
                @refresh="this.getList"
            ></warehouse-info>
        </el-dialog>
    </div>
</template>

<script>
import pagination from "../../components/Pagination/index";
import warehouseInfo from "./components/warehouseInfo.vue";
import { getWareHouse, deleteWareHouse } from "../../api/warehouse";
export default {
    components: { warehouseInfo, pagination },
    data() {
        return {
            isEdit: false,
            listLoading: true,
            warehouseTitle: "新增仓库信息",
            dialogFormVisible: false,
            input: "",
            listQuery: {},
            list: [],
            total: 100,
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
        }
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
                path: "/base/warehouse",
                query: this.listQuery,
            });
        },
        getList() {
            this.listLoading = true;
            getWareHouse(this.listQuery).then((res) => {
                const { list, count } = res.data;
                this.list = list;
                this.total = count;
                this.listLoading = false;
            });
        },
        addWareHouseInfo() {
            this.dialogFormVisible = true;
            this.warehouseTitle = "新增仓库信息";
            this.isEdit = false;
            this.formData = {
                warehouseName: "",
                owner: "",
                warehouseAddress: "",
                msg: "",
            };
        },
        deleteWareHouse(e) {
            // console.log(warehouseIdList);
            this.$confirm("此操作将永久删除该仓库, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deleteWareHouse(e.warehouseId).then((res) => {
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
        editWareHouse(e) {
            this.isEdit = true;
            this.warehouseTitle = "编辑仓库信息";
            this.formData = {...e};
            this.dialogFormVisible = true;
        },
    },
};
</script>
<style lang="scss" scoped>
.warehouse {
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

.warehouse-list {
    margin-top: 20px;
}
</style>