<template>
    <div class="order">
        <div class="order-title">利润表</div>
        <div class="order-condiction">
            <el-form
                ref="form"
                :model="listQuery"
                label-width="80px"
                label-style="color: #666;"
            >
                <el-form-item label="单据日期">
                    <el-radio-group v-model="listQuery.orderDate" size="mini">
                        <el-radio-button border label="本周"></el-radio-button>
                        <el-radio-button border label="上周"></el-radio-button>
                        <el-radio-button border label="本月"></el-radio-button>
                        <el-radio-button border label="上月"></el-radio-button>
                        <el-radio-button
                            border
                            label="自定义"
                        ></el-radio-button>
                    </el-radio-group>
                    <el-date-picker
                        style="margin-left: 10px"
                        size="mini"
                        v-if="listQuery.orderDate == '自定义'"
                        v-model="orderDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <div class="order-detail">
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
                :summary-method="getSummaries"
            >
               
                <el-table-column type="index" label="序号" width="60">
                </el-table-column>
                <el-table-column prop="type" label="项目" width="120">
                </el-table-column>
                 <el-table-column prop="amount" label="金额">
                </el-table-column>
              </el-table>
        </div>
    </div>
</template>

<script>
import {getProfitReport} from "@/api/reports";
export default {
    data() {
        return {
            listLoading:true,
            input: "",
            list: [],
            listQuery: {
                orderDate: "本月",
            },
            orderDate: '',
            data: {}
        };
    },
    watch: {
       listQuery: {
            handler(val){
                let query = {...this.listQuery};
                if(this.orderDate){
                    query.orderDate = this.orderDate[0]+'/'+this.orderDate[1].slice(0,10)+' 23:59:59';
                }
                this.getProfit();
            },
            deep: true
        },
        orderDate(val){
            let query = {...this.listQuery};
            query.orderDate = val[0]+'/'+val[1].slice(0,10)+' 23:59:59';
            this.getProfit();
        }
    },
    created() {
        this.getProfit();
    },
    methods: {
        getProfit(){
            this.listLoading = true;
            getProfitReport(this.listQuery).then(res=>{
                if(res.code==0){
                    this.listLoading = false;
                    this.data = res.data;
                    console.log(res.data);
                    let list = [];
                    list.push({type:'销售收入',amount: res.data.sales || 0});
                    list.push({type:'采购支出',amount: res.data.purchase || 0});
                    this.list = list;
                    console.log(this.list);
                }
            })
        },
        changeListQuery(val) {
            this.listQuery = val;
        },
         getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = "利润";
                    return;
                }
                if (index == 2) {
                    sums[index] = this.data.sales - this.data.purchase;
                }
            });

            return sums;
        },
    },
};
</script>

<style lang="scss" scoped>
.order {
    padding: 20px 30px;
    .order-title {
        font-size: 20px;
        margin-bottom: 10px;
    }
    .order-condiction {
        height: 58px;
        padding-top: 10px;
        margin-bottom: 20px;
        background: #fff;
    }
    
}
</style>