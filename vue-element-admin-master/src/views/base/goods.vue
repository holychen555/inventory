<template>
    <div class="goods">
        <el-row>
            <el-col :span="24">
                <el-row>
                    <el-col :span="5">
                        <div class="goods-category">
                            <div class="goods-category__title">商品分类</div>
                            <div class="goods-category__list">
                                <el-tree
                                    :data="categroyList"
                                    node-key="id"
                                    default-expand-all
                                    highlight-current
                                    :expand-on-click-node="false"
                                    empty-text="暂无分类"
                                    @node-click="selectCategory"
                                >
                                    <span
                                        class="custom-tree-node"
                                        slot-scope="{ node }"
                                    >
                                        <span>{{ node.label }}</span>
                                        <span v-if="node.key != 'all'">
                                            <el-button
                                                type="text"
                                                size="mini"
                                                @click.stop="
                                                    () => editCategory(node)
                                                "
                                            >
                                                <i class="el-icon-edit" />
                                            </el-button>
                                            <el-button
                                                type="text"
                                                size="mini"
                                                @click.stop="
                                                    () => deleteCategory(node)
                                                "
                                            >
                                                <i class="el-icon-delete" />
                                            </el-button>
                                        </span>
                                        <span v-else @click.stop="addCategory">
                                            新增分类
                                        </span>
                                    </span>
                                </el-tree>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="19">
                        <div class="goods-list">
                            <goods-list :categoryName="categoryName"></goods-list>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {
    getGoodsCategory,
    addGoodsCategory,
    updateGoodsCategory,
    deleteGoodsCategory
} from "../../api/goods";
import goodsList from "./components/goodsList";
let id = 1000;

export default {
    components: {
        goodsList,
    },
    data() {
        const data = [
            {
                id: "all",
                key: "all",
                label: "全部",
                children: [
                    {
                        id: 4,
                        label: "口红",
                    },
                    {
                        id: 5,
                        label: "面霜",
                    },
                ],
            },
        ];
        return {
            categroyList: JSON.parse(JSON.stringify(data)),
            categoryName: '全部'
        };
    },
    created() {
        this.getCategoryList();
    },
    methods: {
        editCategory(e) {
            console.log("edit", e);
            this.$prompt("名称不可重复", "编辑商品分类", {
                inputValue: e.label,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                // inputErrorMessage: "",
            })
                .then(({ value }) => {
                    const data = {
                        categoryName: value,
                        categoryId: e.key,
                    };
                    updateGoodsCategory(data)
                        .then((res) => {
                            console.log(res);
                            if (res.code == 0) {
                                this.$notify({  offset: 100,
                                    title: "成功",
                                    message: res.msg,
                                    type: "success",
                                });
                                this.getCategoryList();
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        deleteCategory(e) {
            console.log("delete", e);
            this.$confirm(`商品分类:"${e.label}",确认删除?`, "删除商品分类", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deleteGoodsCategory(e.label)
                        .then((res) => {
                            if (res.code == 0) {
                                this.$notify({  offset: 100,
                                    title: "成功",
                                    message: res.msg,
                                    type: "success",
                                });
                                this.getCategoryList();
                            }
                        })
                        .catch((err) => {});
                })
                .catch(() => {});
        },
        addCategory(e) {
            console.log("add", e);
            this.$prompt("名称不可重复", "新增商品分类", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                // inputErrorMessage: "",
            })
                .then(({ value }) => {
                    addGoodsCategory(value)
                        .then((res) => {
                            console.log(res);
                            if (res.code == 0) {
                                this.$notify({  offset: 100,
                                    title: "成功",
                                    message: res.msg,
                                    type: "success",
                                });
                                this.getCategoryList();
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        getCategoryList() {
            getGoodsCategory().then((res) => {
                console.log(res);
                if (res.code == 0) {
                    this.categroyList[0].children = res.data;
                }
            });
        },
        selectCategory(e) {
            this.categoryName = e.label;
        }
    },
};
</script>
<style scoped>
.goods >>> .el-tree-node__content {
    height: 35px;
}
.goods >>> .el-tree-node__content:checked {
    background-color: #459df5;
}
</style>
<style lang="scss" scoped>
.goods {
    width: 100%;
}

.goods-category {
    width: 100%;
    min-height: calc(100vh - 50px);
    background: #fff;
    &__title {
        height: 50px;
        padding: 0 20px;
        overflow: hidden;
        background-color: #f9f9f9;
        font-size: 14px;
        font-weight: bold;
        line-height: 50px;
        color: #459df5;
        border-bottom: none;
    }
    &__list {
        padding: 10px;
    }
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin: 15px;
    padding-right: 8px;
}
</style>