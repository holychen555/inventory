<template>
    <div class="staff">
        <div class="staff__header">
            <div class="staff__title">用户管理</div>
            <el-button
                class="staff__add"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="addStaffInfo"
                >新增用户</el-button
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
                                >用户角色：{{
                                    listQuery.staffRole
                                        ? listQuery.staffRole
                                        : "全部"
                                }}</el-tag
                            >
                        </div>
                        <div class="filter-condiction__selects">
                            <el-form
                                ref="form"
                                :model="listQuery"
                                label-width="100px"
                                label-style="color: #666;"
                            >
                                <el-form-item label="用户角色">
                                    <el-select
                                        v-model="listQuery.staffRole"
                                        placeholder="请选择用户角色"
                                        size="mini"
                                    >
                                        <el-option
                                            label="全部"
                                            value="全部"
                                        ></el-option>
                                        <el-option
                                            v-for="(value, index) in roles"
                                            :key="index"
                                            :label="value"
                                            :value="value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <div class="staff-operate">
            <div class="staff-operate__text">
                <span>
                    已选择<span class="staff-operate__num">{{
                        selectedStaff.length
                    }}</span
                    >个用户
                </span>
                <el-button
                    class="staff__delete"
                    plain
                    icon="el-icon-delete"
                    @click="deleteStaff"
                    size="mini"
                    >删除</el-button
                >
                <el-button
                    class="staff__delete"
                    plain
                    icon="el-icon-edit"
                    @click="editStaff"
                    size="mini"
                    >编辑</el-button
                >
            </div>
            <div>
                <el-select
                    v-model="staffSelect"
                    class="staff-operate__select"
                    size="mini"
                >
                    <el-option label="用户名称" value="用户名称"></el-option>
                    <el-option label="用户编号" value="用户编号"></el-option>
                </el-select>
                <el-input
                    class="staff-operate__search"
                    v-model="input"
                    placeholder="搜索编号、用户"
                    size="mini"
                ></el-input>
                <el-button size="mini" plain @click="searchStaff"
                    >查询</el-button
                >
            </div>
        </div>
        <div class="staff-list">
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
                <el-table-column label="用户编号" width="120" prop="staffId">
                    <template slot-scope="scope">{{
                        scope.row.staffId
                    }}</template>
                </el-table-column>
                <el-table-column prop="staffName" label="用户名称" width="120">
                    <!-- <template slot-scope="scope">{{ scope.row.staffName }}</template> -->
                </el-table-column>
                <el-table-column label="用户角色" width="200">
                    <template slot-scope="scope">{{
                        scope.row.staffRole
                    }}</template>
                </el-table-column>
                <el-table-column
                    width="120"
                    label="操作权限"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope"
                        >{{
                            scope.row.staffPermission | showPermission
                        }}个</template
                    >
                </el-table-column>
                <el-table-column
                    width="120"
                    prop="staffPhone"
                    label="用户手机"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    width="120"
                    prop="staffAccount"
                    label="用户账号"
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
        <el-dialog :title="staffTitle" :visible.sync="dialogFormVisible">
            <staff-info
                :isEdit="isEdit"
                :formData="formData"
                @cancel="dialogFormVisible = false"
                @confirm="dialogFormVisible = false"
                @refresh="this.getList"
            ></staff-info>
        </el-dialog>
    </div>
</template>

<script>
import pagination from "../../components/Pagination/index";
import staffInfo from "./components/staffInfo.vue";
import { getStaff, deleteStaff, getStaffById } from "../../api/staff";
const roles = [
    "管理员",
    "采购人员",
    "采购主管",
    "仓库人员",
    "仓库主管",
    "销售人员",
    "销售主管",
    "财务人员",
    "决策人员",
];
export default {
    components: { staffInfo, pagination },
    data() {
        return {
            roles,
            isEdit: false,
            listLoading: true,
            staffTitle: "新增用户信息",
            dialogFormVisible: false,
            input: "",
            staffSelect: "用户名称",
            selectedStaff: [],
            listQuery: {},
            categoryList: [],
            list: [],
            total: 100,
            defaultSort: {},
            formData: {},
        };
    },
    filters: {
        showPermission(val) {
            if (val.length == 0) {
                return 0;
            } else {
                let arr = val.split(",");
                return arr.length;
            }
        },
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
                delete this.listQuery.staffName;
                delete this.listQuery.staffId;
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
                path: "/base/staff",
                query: this.listQuery,
            });
        },
        getList() {
            this.listLoading = true;
            getStaff(this.listQuery).then((res) => {
                const { list, count } = res.data;
                this.list = list;
                this.total = count;
                this.listLoading = false;
            });
        },
        handleSelectionChange(val) {
            this.selectedStaff = val;
        },
        addStaffInfo() {
            this.dialogFormVisible = true;
            this.staffTitle = "新增用户信息";
            this.isEdit = false;
            this.formData = {
                staffName: "",
                staffPhone: "",
                staffAccount: "",
                staffPassword: "",
                staffRole: "",
                staffPermission: "",
            };
        },
        deleteStaff() {
            if (this.selectedStaff.length == 0) {
                this.$notify.warning({  offset: 100,
                    title: "警告",
                    message: "请选择用户",
                });
                return;
            }
            let staffIdList = "";
            this.selectedStaff.forEach((e) => {
                staffIdList += ",'" + e.staffId + "'";
            });
            staffIdList = staffIdList.slice(1);
            // console.log(staffIdList);
            this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deleteStaff(staffIdList).then((res) => {
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
        editStaff() {
            if (this.selectedStaff.length !== 1) {
                this.$notify.warning({  offset: 100,
                    title: "警告",
                    message: "必须且只能选择一个用户",
                });
                return;
            }
            this.isEdit = true;
            this.staffTitle = "编辑用户信息";
            this.formData = {...this.selectedStaff[0]};
            this.dialogFormVisible = true;
        },
        searchStaff() {
            if (this.input) {
                if (this.staffSelect == "用户名称") {
                    delete this.listQuery.staffId;
                    this.listQuery.staffName = this.input;
                } else {
                    delete this.listQuery.staffName;
                    this.listQuery.staffId = this.input;
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
.staff >>> .el-form-item__label {
    color: #666;
    font-weight: normal;
}
</style>
<style lang="scss" scoped>
.staff {
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
.staff-operate {
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
.staff-list {
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
        padding-left: 30px;
        font-size: 14px;
        color: #666;
    }
}
</style>