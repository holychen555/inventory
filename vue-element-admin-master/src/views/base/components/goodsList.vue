<template>
    <div class="goods">
        <div class="goods__header">
            <div class="goods__title">商品列表</div>
            <el-button
                class="goods__add"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="toGoodsInfo(false)"
                >新增商品</el-button
            >
        </div>
        <div class="goods-operate">
            <div class="goods-operate__text">
                <span>
                    已选择<span class="goods-operate__num">{{
                        selectedGoods.length
                    }}</span
                    >个商品
                </span>
                <el-button
                    class="goods__delete"
                    plain
                    icon="el-icon-delete"
                    @click="deleteGoods"
                    size="mini"
                    >批量删除</el-button
                >
            </div>
            <div>
                <el-select
                    v-model="goodsSelect"
                    class="goods-operate__select"
                    size="mini"
                >
                    <el-option label="商品名称" value="0"></el-option>
                    <el-option label="商品编号" value="1"></el-option>
                    <el-option label="商品规格" value="2"></el-option>
                    <el-option label="商品分类" value="3"></el-option>
                </el-select>
                <el-input
                    class="goods-operate__search"
                    v-model="input"
                    placeholder="输入关键字搜索"
                    size="mini"
                ></el-input>
                <el-button size="mini" plain @click="searchGoods"
                    >查询</el-button
                >
            </div>
        </div>
        <div class="goods-list">
            <el-table
                v-loading="listLoading"
                stripe
                height="320px"
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
                <el-table-column
                    fixed="left"
                    type="selection"
                    border
                    width="50"
                >
                </el-table-column>
                <el-table-column fixed="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button
                            @click="toggleGoodsStatus(scope.row)"
                            type="text"
                            size="small"
                            >{{
                                scope.row.goodsDisabled ? "启用" : "禁用"
                            }}</el-button
                        >
                        <el-button
                            type="text"
                            size="small"
                            @click="toGoodsInfo(scope.row.goodsId)"
                            >编辑</el-button
                        >
                        <el-button
                            type="text"
                            size="small"
                            @click="deleteOneGoods(scope.row.goodsId)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="left"
                    prop="goodsId"
                    label="商品编号"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="goodsName"
                    label="商品名称"
                    width="150"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="goodsModel"
                    label="规格"
                    width="120"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="goodsUnit"
                    label="单位"
                    width="120"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="beginingNum"
                    label="期初数量"
                    width="120"
                >
                </el-table-column>
                <el-table-column prop="goodsDisabled" label="状态" width="120">
                    <template slot-scope="scope">{{
                        scope.row.goodsDisabled ? "禁用" : "已启用"
                    }}</template>
                </el-table-column>
                <el-table-column
                    prop="createdDate"
                    width="150"
                    label="创建时间"
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
        <!-- <el-dialog :title="goodsTitle" :visible.sync="dialogFormVisible">
            <goods-info
                :isEdit="isEdit"
                :formData="formData"
                @cancel="dialogFormVisible = false"
                @confirm="dialogFormVisible = false"
                @refresh="this.getList"
            ></goods-info>
        </el-dialog> -->
    </div>
</template>

<script>
import pagination from "../../../components/Pagination/index";
import {
    getGoods,
    deleteGoods,
    toggleGoodsDisabled,
} from "../../../api/goods";
export default {
    components: { pagination },
    props: ["categoryName"],
    data() {
        return {
            isEdit: false,
            listLoading: true,
            // goodsTitle: "新增商品信息",
            // dialogFormVisible: false,
            input: "",
            goodsSelect: "0",
            selectedGoods: [],
            listQuery: {},
            categoryList: [],
            list: [],
            total: 100,
            defaultSort: {},
            formData: {},
        };
    },
    watch: {
        input(val) {
            if (val.length == 0) {
                delete this.listQuery.goodsName;
                delete this.listQuery.goodsId;
                delete this.listQuery.goodsModel;
                delete this.listQuery.goodsCategory;
            }
        },
        categoryName(val) {
            this.listQuery.categoryName = val;
            this.getList();
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
                path: "/base/goods",
                query: this.listQuery,
            });
        },
        getList() {
            this.listLoading = true;
            getGoods(this.listQuery).then((res) => {
                const { list, count } = res.data;
                this.list = list;
                this.total = count;
                this.listLoading = false;
                delete this.listQuery.goodsId;
                delete this.listQuery.goodsModel;
                delete this.listQuery.goodsName;
                delete this.listQuery.goodsCategory;
            });
        },
        handleSelectionChange(val) {
            this.selectedGoods = val;
        },
        deleteGoods() {
            if (this.selectedGoods.length == 0) {
                this.$notify.warning({  offset: 100,
                    offset: 100,
                    title: "警告",
                    message: "请选择商品",
                });
                return;
            }
            let goodsIdList = "";
            this.selectedGoods.forEach((e) => {
                goodsIdList += ",'" + e.goodsId + "'";
            });
            goodsIdList = goodsIdList.slice(1);
            // console.log(goodsIdList);
            this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deleteGoods(goodsIdList).then((res) => {
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
        deleteOneGoods(goodsId) {
            console.log(goodsId);
            this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deleteGoods("'" + goodsId + "'").then((res) => {
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
        editGoods() {
            this.isEdit = true;
            this.goodsTitle = "编辑商品信息";
            this.formData = res.data;
            this.dialogFormVisible = true;
            // getGoodsById(this.selectedGoods[0].goodsId).then((res) => {
            //     if (res.code == 0) {
            //         console.log(res);

            //     }
            // });
        },
        searchGoods() {
            if (this.input) {
                if (this.goodsSelect == 0) {
                    this.listQuery.goodsName = this.input;
                } else if (this.goodsSelect == 1) {
                    this.listQuery.goodsId = this.input;
                } else if (this.goodsSelect == 2) {
                    this.listQuery.goodsModel = this.input;
                } else if (this.goodsSelect == 3) {
                    this.listQuery.goodsCategory = this.input;
                }
                this.getList();
            } else {
                this.getList();
            }
        },
        toggleGoodsStatus(data) {
            const goods = {
                goodsDisabled: !data.goodsDisabled,
                goodsId: data.goodsId,
            };
            toggleGoodsDisabled(goods).then((res) => {
                if (res.code == 0) {
                    this.$notify({  offset: 100,
                        title: "成功",
                        message: res.msg,
                        type: "success",
                    });
                    this.getList();
                }
            });
        },
        toGoodsInfo(goodsId) {
            // 有goodsId即为编辑
            this.$router.addRoutes([
               
            ]);

            this.$router.push({path:"/goods/info",query: {goodsId:goodsId?goodsId:false}});
        },
    },
};
</script>
<style scoped>
.goods >>> .el-form-item__label {
    color: #666;
    font-weight: normal;
}
</style>
<style lang="scss" scoped>
.goods {
    // width: 800px;
    padding: 30px 15px;
    &__header {
        margin-top: -30px;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    &__title {
        font-size: 16px;
    }
    &__delete {
        margin-left: 10px;
    }
}
.goods-operate {
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
.goods-list {
    width: 100%;
    margin-top: 10px;
}
</style>