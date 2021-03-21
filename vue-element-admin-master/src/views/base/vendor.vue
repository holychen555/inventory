<template>
    <div class="vendor">
        <div class="vendor__header">
            <div class="vendor__title">供应商列表</div>
            <el-button
                class="vendor__add"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="addVendorInfo"
                >新增供应商</el-button
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
                                >供应商类型：{{
                                    listQuery.vendorType
                                        ? listQuery.vendorType
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
                                label-width="100px"
                                label-style="color: #666;"
                            >
                                <el-form-item label="供应商类型">
                                    <el-radio-group
                                        v-model="listQuery.vendorType"
                                        size="mini"
                                    >
                                        <el-radio
                                            border
                                            label="全部"
                                        ></el-radio>
                                        <el-radio
                                            border
                                            label="个体"
                                        ></el-radio>
                                        <el-radio
                                            border
                                            label="一级供应商"
                                        ></el-radio>
                                        <el-radio
                                            border
                                            label="二级供应商"
                                        ></el-radio>
                                        <el-radio
                                            border
                                            label="批发"
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
        <div class="vendor-operate">
            <div class="vendor-operate__text">
                <span>
                    已选择<span class="vendor-operate__num">{{
                        selectedVendor.length
                    }}</span
                    >个供应商
                </span>
                <el-button
                    class="vendor__delete"
                    plain
                    icon="el-icon-delete"
                    @click="deleteVendor"
                    size="mini"
                    >删除</el-button
                >
                <el-button
                    class="vendor__delete"
                    plain
                    icon="el-icon-edit"
                    @click="editVendor"
                    size="mini"
                    >编辑</el-button
                >
            </div>
            <div>
                <el-select
                    v-model="vendorSelect"
                    class="vendor-operate__select"
                    size="mini"
                >
                    <el-option label="供应商名称" value="供应商名称"></el-option>
                    <el-option label="供应商编号" value="供应商编号"></el-option>
                </el-select>
                <el-input
                    class="vendor-operate__search"
                    v-model="input"
                    placeholder="搜索编号、供应商"
                    size="mini"
                ></el-input>
                <el-button size="mini" plain @click="searchVendor" >查询</el-button>
            </div>
        </div>
        <div class="vendor-list">
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
                <el-table-column label="供应商编号" width="120" prop="vendorId">
                    <template slot-scope="scope">{{
                        scope.row.vendorId
                    }}</template>
                </el-table-column>
                <el-table-column
                    prop="vendorName"
                    label="供应商名称"
                    width="120"
                >
                    <!-- <template slot-scope="scope">{{ scope.row.vendorName }}</template> -->
                </el-table-column>
                <el-table-column label="供应商类型" width="120">
                    <template slot-scope="scope">{{
                        scope.row.vendorType
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
        <el-dialog :title="vendorTitle" :visible.sync="dialogFormVisible">
            <vendor-info
                :isEdit="isEdit"
                :formData="formData"
                @cancel="dialogFormVisible = false"
                @confirm="dialogFormVisible = false"
                @refresh="this.getList"
            ></vendor-info>
        </el-dialog>
    </div>
</template>

<script>
import pagination from "../../components/Pagination/index";
import vendorInfo from "./components/vendorInfo.vue";
import {
    getVendor,
    deleteVendor,
    getVendorById,
} from "../../api/vendor";
export default {
    components: { vendorInfo, pagination },
    data() {
        return {
            isEdit: false,
            listLoading: true,
            vendorTitle: "新增供应商信息",
            dialogFormVisible: false,
            input: "",
            vendorSelect: "供应商名称",
            selectedVendor: [],
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
                delete this.listQuery.vendorName;
                delete this.listQuery.vendorId;
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
                path: "/base/vendor",
                query: this.listQuery,
            });
        },
        getList() {
            this.listLoading = true;
            getVendor(this.listQuery).then((res) => {
                const { list, count } = res.data;
                this.list = list;
                this.total = count;
                this.listLoading = false;
            });
        },
        handleSelectionChange(val) {
            this.selectedVendor = val;
        },
        addVendorInfo() {
            this.dialogFormVisible = true;
            this.vendorTitle = "新增供应商信息";
            this.isEdit = false;
            this.formData = {
                vendorName: "",
                vendorType: "",
                owner: "",
                contactName: "",
                contactPhone: "",
                vendorAddress: "",
            }
        },
        deleteVendor() {
            if (this.selectedVendor.length == 0) {
                this.$notify.warning({  offset: 100,
                    title: "警告",
                    message: "请选择供应商",
                });
                return
            }
            let vendorIdList = "";
            this.selectedVendor.forEach((e) => {
                vendorIdList += ",'" + e.vendorId + "'";
            });
            vendorIdList = vendorIdList.slice(1);
            // console.log(vendorIdList);
            this.$confirm("此操作将永久删除该供应商, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deleteVendor(vendorIdList).then((res) => {
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
        editVendor() {
            if (this.selectedVendor.length !== 1) {
                this.$notify.warning({  offset: 100,
                    title: "警告",
                    message: "必须且只能选择一个供应商",
                });
                return;
            }
            getVendorById(this.selectedVendor[0].vendorId).then((res) => {
                if (res.code == 0) {
                    console.log(res);
                    this.isEdit = true;
                    this.vendorTitle = "编辑供应商信息";
                    this.formData = res.data;
                    this.dialogFormVisible = true;
                }
            });
        },
        searchVendor() {
            if (this.input) {
                if (this.vendorSelect == "供应商名称") {
                    delete this.listQuery.vendorId;
                    this.listQuery.vendorName = this.input;
                } else {
                    delete this.listQuery.vendorName;
                    this.listQuery.vendorId = this.input;
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
.vendor >>> .el-form-item__label {
    color: #666;
    font-weight: normal;
}
</style>
<style lang="scss" scoped>
.vendor {
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
.vendor-operate {
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
.vendor-list {
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