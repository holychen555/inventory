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
            <el-table-column width="120px" align="left" label="系统数量">
                <template slot-scope="{ row }">
                    <span>{{ row.currentNum }}</span>
                </template>
            </el-table-column>
            
            <el-table-column
                width="120px"
                align="left"
                prop="goodsNum"
                label="盘点数量"
            >
                <template slot-scope="{ row }">
                    <el-input
                        type="number"
                        v-model="row.goodsNum"
                        size="small"
                        :min="0"
                        :disabled="!!orderId&&!isEdit"
                    />
                </template>
            </el-table-column>
            <el-table-column width="120px" align="left" prop="profitAndLoss" label="盘盈盘亏">
                <template slot-scope="{ row }">
                    <span>{{ (row.profitAndLoss = row.goodsNum - row.currentNum) | filterNum }}</span>
                </template>
            </el-table-column>
            <el-table-column  align="left" label="备注">
                <template slot-scope="{ row }">
                    <el-input :disabled="!!orderId&&!isEdit" v-model="row.msg" size="small" />
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
        <el-dialog
            top="5vh"
            width="1050px"
            title="添加商品"
            :visible.sync="showSelect"
            destroy-on-close
            @close="$emit('changeShowSelectGoods')"
        >
            <select-goods></select-goods>
        </el-dialog>
    </div>
</template>

<script>
import {getOrderGoods} from "@/api/ordergoods";
import SelectGoods from "@/components/SelectGoods/index.vue";
export default {
    components: {
        SelectGoods,
    },
    data() {
        return {
            list: [],
            showSelect: false
        };
    },
    props: ['orderId','isEdit','showSelectGoods','warehouseId'],
    provide() {
        return {
            warehouseId: this.warehouseId
        }
    },
    watch: {
        list: {
            handler: function (val) {
                let errMsg = "";
                eventBus.$emit('setCheckNum',this.list.length);
                if(val.length==0){
                    eventBus.$emit("checkGoods", false, '请选择盘点商品');
                    return
                }
                let hasGoodsNum = val.every((item, index) => {
                    if (item.goodsNum == '') {
                        errMsg = `以下商品数量不能为空，<br/>第${
                            index + 1
                        }行商品${item.goodsName}`;
                    }
                    return item.goodsNum != '';
                });
                if (!hasGoodsNum) {
                    eventBus.$emit("checkGoods", false, errMsg);
                }
                if (hasGoodsNum) {
                    eventBus.$emit("checkGoods", true, "");
                    eventBus.$emit('submitGoods',this.list);
                }
                
            },
            deep: true,
            immediate: true,
        },
        showSelectGoods: {
            handler(val){
                 this.showSelect = val;
            },
            immediate: true
        }
    },
    filters: {
        filterNum(val){
            if(isNaN(val)){
                return ''
            }else{
                return val;
            }
        }
    },
    created() {
        if(this.orderId){
            getOrderGoods(this.orderId).then((res) => {
                if (res.code == 0) {
                    this.list = res.data.list;
                }
            });
        }
        eventBus.$on("confirmSelectGoods", (data) => {
            this.list = [...this.list, ...data];
            this.showSelect = false;
        });
        eventBus.$on("cancelSelectGoods", () => {
            this.showSelect = false;
        });
    },
    beforeDestory() {
        eventBus.$off("confirmSelectGoods");
        eventBus.$off("cancelSelectGoods");
    },
    methods: {
        addGoods() {
            this.showSelect = true;
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
            columns.forEach((column, index) => {
                if (index === 1) {
                    sums[index] = "合计";
                    return;
                }
                if (index==6 || index == 7) {
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
                        if(index==6){
                            sums[6] = ""
                        }
                    } else {
                        sums[index] = "";
                    }
                    if(sums[7]){
                        eventBus.$emit('setProfitAndLoss',sums[7]);
                    }
                   
                  
                }
            });

            return sums;
        },
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