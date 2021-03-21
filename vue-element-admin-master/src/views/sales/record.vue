<template>
    <div class="order-manage">
        <div class="order__name">
            <div class="order-title">销售业绩</div>
        </div>
        <div class="tab-container">
            <el-tabs
                v-model="activeKey"
                style="width: 100%; padding-right: 30px; margin-top: 15px"
                type="card"
            >
                <el-tab-pane
                    v-for="item in tabMapOptions"
                    :key="item.key"
                    :label="item.label"
                    :name="item.key"
                    lazy
                >
                    <div class="condiction">
                         <el-form
                        ref="form"
                        :model="listQuery"
                        label-width="80px"
                        label-style="color: #666;"
                    >
                        <el-form-item label="日期">
                            <el-radio-group
                                v-model="listQuery.orderDate"
                                size="mini"
                            >
                                <el-radio-button
                                    border
                                    label="今天"
                                ></el-radio-button>
                                <el-radio-button
                                    border
                                    label="昨天"
                                ></el-radio-button>
                                <el-radio-button
                                    border
                                    label="本周"
                                ></el-radio-button>
                                <el-radio-button
                                    border
                                    label="上周"
                                ></el-radio-button>
                                <el-radio-button
                                    border
                                    label="本月"
                                ></el-radio-button>
                                <el-radio-button
                                    border
                                    label="上月"
                                ></el-radio-button>
                                <el-radio-button
                                    border
                                    label="自定义"
                                ></el-radio-button>
                            </el-radio-group>
                            <el-date-picker
                                style="margin-left: 10px"
                                size="mini"
                                v-if="listQuery.deliveryDate == '自定义'"
                                v-model="deliveryDate"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            >
                            </el-date-picker>
                        </el-form-item>
                          <el-form-item label="销售人员">
                                <el-select
                                    v-model="listQuery.owner"
                                    placeholder="请选择销售人员"
                                    size="mini"
                                >
                                    <el-option
                                        label="全部"
                                        value="全部"
                                    ></el-option>
                                    <el-option
                                        v-for="item in staffList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                    </el-form>
                    </div>
                   
                </el-tab-pane>
            </el-tabs>
        </div>
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
                show-summary
            >
                <el-table-column label="序号" type="index" width="60">
                </el-table-column>
                <el-table-column prop="owner" label="销售人员" >
                    <template slot-scope="scope">{{
                        showStaffName(scope.row.owner)
                    }}</template>
                </el-table-column>
                <el-table-column prop="xsNum" label="销售单" >
                </el-table-column>
                 <el-table-column prop="thNum" label="退货单" >
                </el-table-column>
                <el-table-column prop="xsAmount" label="销售金额" >
                </el-table-column>
                <el-table-column prop="thAmount" label="退货金额" >
                </el-table-column>
                  <el-table-column prop="total" label="金额合计" >
                       <template slot-scope="scope">{{
                        scope.row.total = scope.row.xsAmount - scope.row.thAmount
                    }}</template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getSalesRecordList } from "@/api/sales";
import {getAllStaff} from "@/api/staff";
export default {
    components: {},
    data() {
        return {
            tabMapOptions: [{ label: "按销售员", key: "xsy" }],
            activeKey: "xsy",
            listQuery: {orderDate:'本周'},
            list: [],
            orderDate: '',
            staffList: [],
            listLoading: true,
        };
    },
    computed: {
        activeName() {
            let name = "";
            this.tabMapOptions.some((item) => {
                if (item.key == this.activeKey) {
                    name = item.label;
                }
            });
            return name;
        },
    },
    watch: {
         listQuery: {
            handler(val){
                let query = {...this.listQuery};
                if(this.orderDate){
                    query.orderDate = this.orderDate[0]+'/'+this.orderDate[1].slice(0,10)+' 23:59:59';
                }
                console.log('query',query);
                this.getRecords();
            },
            deep: true
        },
        orderDate(val){
            let query = {...this.listQuery};
            query.orderDate = val[0]+'/'+val[1].slice(0,10)+' 23:59:59';
            this.getRecords();
        }
    },
    created() {
        this.getRecords();
        getAllStaff().then(res=>{
            if(res.code == 0){
                this.staffList = res.data.list;
            }
        })
    },
    methods: {
        changeListQuery(listQuery) {
            this.listQuery = listQuery;
        },
        getRecords() {
            this.listLoading = true;
            getSalesRecordList(this.listQuery).then((res) => {
                if (res.code == 0) {
                    this.listLoading = false;
                    this.list = res.data.list;
                }
            });
        },
       showStaffName(id) {
            let name = "";
            this.staffList.forEach((item) => {
                if (item.value == id) {
                    name = item.label;
                }
            });
            return name;
        },
    },
};
</script>

<style scoped>
.order-manage {
    padding: 20px 15px;
    position: relative;
}
.order__name {
    position: relative;
    width: 100%;
    /* height: 40px; */
    margin-bottom: 30px;
    font-size: 18px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
}
.order-add {
    z-index: 10;
}
.order-title {
    padding-left: 20px;
}
.tab-container {
    width: 100%;
    position: absolute;
    top: 0;
}
.tab-container >>> .el-tabs__header {
    margin-bottom: 0;
}
.tab-container >>> .el-tabs__header .el-tabs__nav {
    margin-left: 150px;
    border: none;
}
.tab-container >>> .el-tabs__header .el-tabs__item {
    margin-right: 2px;
    border: none;
    padding: 0 40px;
    padding-left: 40px;
    border-top: 2px solid transparent;
    color: #26344b;
    font-size: 13px;
    background-color: #d6dde3;
}
.tab-container >>> .el-tabs__header .el-tabs__item.is-active {
    border-top: 2px solid #459df5;
    background-color: #f7fbfe;
}
.tab-container >>> .el-tabs__header .el-tabs__item:nth-child(2) {
    padding-left: 40px;
}
.tab-container >>> .el-tabs__header .el-tabs__item:last-child {
    padding-right: 40px;
}
.tab-container >>> .el-tabs__content {
    padding: 10px;
    background-color: #fff;
}
.order-list {
    margin-top: 180px;
}
</style>
