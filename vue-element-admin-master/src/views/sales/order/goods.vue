<template>
    <div class="goods-list">
        <el-table
            ref="list"
            :data="list"
            style="width: 100%"
            :header-cell-style="{
                background: '#e8e8e8',
                color: '#323232',
                borderLeft: '1px solid #eef1f5',
            }"
            border
            row-key="index"
            show-summary
            :cell-style="{
                borderLeft: '1px solid #eef1f5',
                borderBottom: '1px solid #eef1f5',
            }"
            :summary-method="getSummaries"
        >
            <el-table-column type="index" align="center" width="40">
            </el-table-column>

            <el-table-column
                width="160px"
                align="left"
                label="商品名称"
                show-overflow-tooltip
            >
                <template slot-scope="{ row }">
                    <span>{{ row.goodsName }}</span>
                </template>
            </el-table-column>
            <el-table-column width="120px" align="left" label="商品编号">
                <template slot-scope="{ row }">
                    <span>{{ row.goodsId }}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="120px"
                align="left"
                label="规格型号"
                show-overflow-tooltip
            >
                <template slot-scope="{ row }">
                    <span>{{ row.goodsModel }}</span>
                </template>
            </el-table-column>

            <el-table-column width="120px" align="left" label="单位">
                <template slot-scope="{ row }">
                    <span>{{ row.goodsUnit }}</span>
                </template>
            </el-table-column>

            <el-table-column
                width="120px"
                align="left"
                prop="goodsNum"
                label="数量"
            >
                <template slot-scope="{ row }">
                    <el-input
                        type="number"
                        v-model="row.goodsNum"
                        size="small"
                        :min="0"
                    />
                </template>
            </el-table-column>

            <el-table-column
                width="120px"
                align="left"
                prop="goodsPrice"
                label="单价"
            >
                <template slot-scope="{ row }">
                    <el-input
                        type="number"
                        v-model="row.goodsPrice"
                        size="small"
                        :min="0"
                    />
                </template>
            </el-table-column>

            <el-table-column
                width="130px"
                align="left"
                prop="goodsSum"
                label="金额"
            >
                <template slot-scope="{ row }">
                    <span>{{ row.goodsSum }}</span>
                </template>
            </el-table-column>
            <el-table-column width="170px" align="left" label="仓库">
                <template slot-scope="scope">
                    <el-select
                        v-model="scope.row.warehouseId"
                        filterable
                        placeholder="请选择"
                        :key="scope.$index"
                    >
                        <el-option
                            v-for="item in wareHouseList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                            <el-tooltip
                                effect="dark"
                                :content="item.label"
                                placement="left"
                            >
                                <div
                                    class="overflow"
                                    style="
                                        float: left;
                                        color: #8492a6;
                                        font-size: 13px;
                                    "
                                >
                                    {{ item.label }}
                                </div>
                            </el-tooltip>
                            <div
                                style="
                                    float: right;
                                    color: #459df5;
                                    font-size: 13px;
                                "
                                @click="bulkSelect(item)"
                            >
                                批量
                            </div>
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column  align="left" label="备注">
                <template slot-scope="{ row }">
                    <el-input v-model="row.msg" size="small" />
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="!orderId">
                <template slot-scope="scope">
                    <el-button
                        @click.native.prevent="deleteRow(scope.$index, list)"
                        type="text"
                        size="small"
                    >
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="goods-list__operate" v-if="!isReturn||(isReturn&&!orderId)">
            <el-tag @click="addGoods">添加商品</el-tag>
            <el-tag @click="importGoods">导入商品</el-tag>
        </div>
        <el-dialog
            top="5vh"
            width="1050px"
            title="选择商品"
            :visible.sync="showSelectGoods"
            destroy-on-close
        >
            <select-goods></select-goods>
        </el-dialog>
        <el-dialog
            top="5vh"
            width="1050px"
            title="导入商品"
            :visible.sync="showImportGoods"
            destroy-on-close
        >
            <import-goods @cancel="showImportGoods = false" @confirm="confirmImportGoods"></import-goods>
        </el-dialog>
    </div>
</template>

<script>
import { getAllWareHouse } from "@/api/warehouse";
import {getOrderGoods} from "@/api/ordergoods";
import SelectGoods from "@/components/SelectGoods/index.vue";
import ImportGoods from '@/components/ImportGoods/index.vue'
export default {
    components: {
        SelectGoods,
        ImportGoods
    },
    data() {
        return {
            list: [],
            showSelectGoods: false,
            showImportGoods:false,
            wareHouseList: [],
        };
    },
    props: ['orderId','relatedId','isReturn'],
    watch: {
        list: {
            handler: function (val, oldVal) {
                val.forEach((item) => {
                    let sum = Number(item.goodsPrice) * Number(item.goodsNum);
                    if (!isNaN(sum)) {
                        item.goodsSum = _.floor(sum, 2);
                    } else {
                        item.goodsSum = "";
                    }
                });
                let errMsg = "";

                let hasGoodsNum = val.every((item, index) => {
                    if (item.goodsNum == 0 || item.goodsNum == null) {
                        errMsg = `以下商品数量需大于0，<br/>第${
                            index + 1
                        }行商品${item.goodsName}`;
                    }
                    return item.goodsNum != 0 && item.goodsNum != null;
                });
                let hasWareHouse = val.every((item, index) => {
                    if (item.warehouseId == 0 || item.warehouseId == null) {
                        errMsg = `以下商品需选择仓库，<br/>第${
                            index + 1
                        }行商品${item.goodsName}`;
                    }
                    return item.warehouseId != "" && item.warehouseId != null;
                });
                if (!hasGoodsNum) {
                    eventBus.$emit("checkGoods", false, errMsg);
                }
                if (!hasWareHouse) {
                    eventBus.$emit("checkGoods", false, errMsg);
                }
                if (hasGoodsNum && hasWareHouse) {
                    eventBus.$emit("checkGoods", true, "");
                    eventBus.$emit('submitGoods',this.list);
                }
            },
            deep: true,
            immediate: true,
        },
        relatedId(val){
            getOrderGoods(val).then((res) => {
                if (res.code == 0) {
                    this.list = res.data.list;
                }
            });
        }
    },
    created() {
        // 存在orderId即为编辑状态
        if(this.orderId){
            getOrderGoods(this.orderId).then((res) => {
                if (res.code == 0) {
                    this.list = res.data.list;
                }
            });
        }
        // 存在relatedId即为由相关单据生成
        if(this.relatedId){
            getOrderGoods(this.relatedId).then((res) => {
                if (res.code == 0) {
                    this.list = res.data.list;
                }
            });
        }
        eventBus.$on("confirmSelectGoods", (data) => {
            this.list = [...this.list, ...data];
            this.showSelectGoods = false;
        });
        eventBus.$on("cancelSelectGoods", () => {
            this.showSelectGoods = false;
        });
        getAllWareHouse().then((res) => {
            if (res.code == 0) {
                this.wareHouseList = res.data.list;
            }
        });
    },
    beforeDestory() {
        eventBus.$off("confirmSelectGoods");
        eventBus.$off("cancelSelectGoods");
    },
    methods: {
        addGoods() {
            this.showSelectGoods = true;
        },
        importGoods() {
            this.showImportGoods = true;
        },
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            let that = this;
            columns.forEach((column, index) => {
                if (index === 1) {
                    sums[index] = "合计";
                    return;
                }
                if (index == 5 || index == 6 || index == 7) {
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
                    if (index == 6) {
                        sums[index] = "";
                    }
                    if(index==7){
                        eventBus.$emit('setTotalAmount',sums[7]);
                    }
                }
            });

            return sums;
        },
        // 批量选择
        bulkSelect(target) {
            this.list.forEach((item) => {
                item.warehouseId = target.value;
            });
        },
        confirmImportGoods(list) {
            if(list&&list.length>0){
                console.log(list);
                this.list = list;
            }
            this.showImportGoods = false;
        }
    },
};
</script>
<style scoped>
.goods-list >>> .el-dialog__body {
    padding: 0;
}
</style>
<style lang="scss" scoped>
.overflow {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
}
.goods-list {
    background-color: #fff;
}
.goods-list__operate {
    padding: 10px 30px;
}
.icon-blue {
    font-size: 16px;
    margin: 0 5px;
    color: #459df5;
}
</style>