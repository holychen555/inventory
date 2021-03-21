<template>
    <div class="goods">
        <div class="goods__header">
            <div class="goods__title">商品列表</div>
            <div class="select-goods-btns">
                <div class="select-goods-num-box">
                    选中了<span class="select-goods-num">{{
                        selectedGoods.length
                    }}</span
                    >个商品
                </div>
                <el-button size="mini" type="primary" @click="confirm"
                    >确认</el-button
                >
                <el-button size="mini" @click="cancel">取消</el-button>
            </div>
        </div>
        <div class="goods-operate">
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
                <el-table-column
                    prop="goodsName"
                    label="商品名称"
                    width="180"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column prop="goodsId" label="商品编号" width="120">
                </el-table-column>
                <el-table-column
                    prop="goodsModel"
                    label="规格"
                    width="120"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="goodsCategory"
                    label="商品分类"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="goodsUnit"
                    label="单位"
                    width="120"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column prop="currentNum" label="库存数量">
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
import { getGoods } from "@/api/goods";
export default {
    components: { pagination },
    props: ["categoryName"],
    inject: ["warehouseId"],//当为盘点单时才存在warehouseId
    data() {
        return {
            listLoading: true,
            input: "",
            goodsSelect: "商品名称",
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
        if(this.warehouseId){
            this.listQuery.warehouseId = this.warehouseId;
        }
        console.log("grandson组件",this.warehouseId);
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
    beforeDestory() {
        eventBus.$off("confirmSelectGoods");
        eventBus.$off("cancelSelectGoods");
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
        handleSelectionChange(val) {
            this.selectedGoods = val;
        },
        confirm() {
            let selectedData = [];
            this.selectedGoods.forEach(item=>{
                let o = {
                    goodsId: item.goodsId,
                    goodsUnit: item.goodsUnit,
                    goodsName: item.goodsName,
                    goodsModel: item.goodsModel,
                    goodsCategory: item.goodsCategory,
                    goodsNum: this.warehouseId?'':1,//存在warehouseId则为盘点单，默认盘点数量为''
                    goodsPrice: 0,
                    goodsSum: "",
                    warehouseId: this.warehouseId?this.warehouseId:'',
                    msg: "",
                    currentNum: 0
                }
                selectedData.push(o);
            })
            eventBus.$emit("confirmSelectGoods", selectedData);
        },
        cancel() {
            eventBus.$emit("cancelSelectGoods");
        },
    },
};
</script>
<style scoped>
.goods >>> .el-form-item__label {
    color: #666;
    font-weight: normal;
}
.goods >>> .pagination-container {
    padding: 10px;
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
.select-goods-btns {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.select-goods-num-box {
    padding-right: 10px;
}
.select-goods-num {
    color: #459df5;
}
</style>