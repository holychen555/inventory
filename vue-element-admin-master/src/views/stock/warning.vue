<template>
    <div class="warning">
        <div class="warning-title">库存预警</div>
        <div class="warning-condiction">
            <div>
                <el-form
                    ref="form"
                    :model="listQuery"
                    label-width="80px"
                    label-style="color: #666;"
                >
                    <el-form-item label="库存状态">
                        <el-radio-group
                            v-model="listQuery.type"
                            size="mini"
                        >
                            <el-radio-button
                                border
                                label="全部"
                            ></el-radio-button>
                            <el-radio-button
                                border
                                label="高库存"
                            ></el-radio-button>
                            <el-radio-button
                                border
                                label="低库存"
                            ></el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-row>
                        <el-col :span="24">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="仓库">
                                        <el-select
                                            v-model="listQuery.warehouseId"
                                            placeholder="请选择仓库"
                                            size="mini"
                                            filterable
                                        >
                                            <el-option
                                                label="全部"
                                                value="全部"
                                            ></el-option>
                                            <el-option
                                                v-for="item in warehouseList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="产品">
                                        <el-select
                                            v-model="listQuery.goodsId"
                                            placeholder="请输入关键词"
                                            size="mini"
                                            filterable
                                            :loading="loading"
                                            remote
                                            :remote-method="getGoods"
                                        >
                                            <el-option
                                                label="全部"
                                                value="全部"
                                            ></el-option>
                                            <el-option
                                                v-for="item in goodsList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
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
                    <el-table-column type="index" label="序号" width="60">
                    </el-table-column>
                    <el-table-column label="仓库名称" >
                        <template slot-scope="scope">
                            {{ showWareHouseName(scope.row.warehouseId) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="goodsId"
                        label="商品编号"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="goodsName"
                        label="商品名称"
                        width="200"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="goodsModel"
                        label="规格"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="goodsUnit"
                        label="单位"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="currentNum"
                        label="当前库存量"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="minStock"
                        label="最低库存量"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="maxStock"
                        label="最高库存量"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        label="超限数量"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            <div v-html="showNum(
                                    scope.row.minStock,
                                    scope.row.maxStock,
                                    scope.row.currentNum
                                )"></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
import { getAllWareHouse } from "@/api/warehouse";
import { getWarningList } from "@/api/stock";
import { getGoodsByName } from "@/api/goods";
export default {
    components: { pagination },
    data() {
        return {
            listLoading: true,
            loading: true,
            list: [],
            total: 100,
            warehouseList: [],
            listQuery: {
                type: "全部"
            },
            goodsList: [],
        };
    },
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
    created() {
        this.parseQuery();
        getAllWareHouse().then((res) => {
            if (res.code == 0) {
                this.warehouseList = res.data.list;
            }
        });
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
        getGoods(val) {
            this.loading = true;
            getGoodsByName(val).then((res) => {
                if (res.code == 0) {
                    this.loading = false;
                    this.goodsList = res.data;
                }
            });
        },
        showNum(min, max, current) {
            let result = 0;
            if (min >= current) {
                result = current - min;
            }
            if (max <= current) {
                result = current - max;
            }
            if(result<0){
                return `<span class="red">${result}</span>`
            }else{
                return result;
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
                path: "/warning/list",
                query: this.listQuery,
            });
        },
        getList() {
            this.listLoading = true;
            getWarningList(this.listQuery).then((res) => {
                const { list, count } = res.data;
                this.list = list;
                this.total = count;
                this.listLoading = false;
            });
        },
        showWareHouseName(id) {
            let name = "";
            this.warehouseList.forEach((item) => {
                if (item.value == id) {
                    name = item.label;
                }
            });
            return name;
        },
    },
};
</script>

<style>
.warning {
    padding: 30px 20px;
}
.warning-title {
    font-size: 20px;
    padding-bottom: 10px;
}
.warning-condiction {
    width: 100%;
    padding-top: 20px;
    background-color: #fff;
    margin-bottom: 15px;
}
.red {
    color: red !important;
}
</style>