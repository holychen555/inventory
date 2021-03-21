<template>
    <div class="order-condiction">
            <el-form
                ref="form"
                :model="listQuery"
                label-width="80px"
                label-style="color: #666;"
            >
                <el-form-item label="业务类型">
                    <el-radio-group v-model="listQuery.type" size="mini">
                        <el-radio-button border label="全部"></el-radio-button>
                        <el-radio-button border label="采购入库"></el-radio-button>
                        <el-radio-button border label="采购退货"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="单据日期">
                    <el-radio-group v-model="listQuery.orderDate" size="mini">
                        <el-radio-button border label="全部"></el-radio-button>
                        <el-radio-button border label="今天"></el-radio-button>
                        <el-radio-button border label="昨天"></el-radio-button>
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

                <el-form-item label="审批状态">
                    <el-radio-group
                        v-model="listQuery.approvalStatus"
                        size="mini"
                    >
                        <el-radio-button border label="全部"></el-radio-button>
                        <el-radio-button border :label="0"
                            >待审批</el-radio-button
                        >
                        <el-radio-button border :label="2"
                            >已驳回</el-radio-button
                        >
                        <el-radio-button border :label="1"
                            >审批通过</el-radio-button
                        >
                    </el-radio-group>
                </el-form-item>
                <el-row>
                    <el-col :span="24">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="供应商">
                                    <el-select
                                        v-model="listQuery.vendorId"
                                        placeholder="请输入关键词"
                                        size="mini"
                                        filterable
                                        :loading="loading"
                                        remote
                                        :remote-method="getVendors"
                                    >
                                        <el-option
                                            label="全部"
                                            value="全部"
                                        ></el-option>
                                        <el-option
                                            v-for="item in vendorList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="采购人员">
                                    <el-select
                                        v-model="listQuery.owner"
                                        placeholder="请选择采购人员"
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
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="仓库">
                                    <el-select
                                        v-model="listQuery.warehouseId"
                                        placeholder="请选择仓库"
                                        size="mini"
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
                        </el-row>
                    </el-col>
                </el-row>
            </el-form>
    </div>
</template>

<script>
import { getVendorByName } from "@/api/vendor";
import { getAllStaff } from "@/api/staff";
import {getAllWareHouse} from "@/api/warehouse";
export default {
    data() {
        return {
            listQuery: {
                type: '全部',
                orderDate: '本月',
                approvalStatus: '全部',
                vendorId: '全部',
                owner: '全部'
            },
            orderDate: '',
            warehouseList: [],
            staffList: [],
            vendorList: [], //
            loading: true,
        };
    },
    watch: {
        listQuery: {
            handler(val){
                let query = {...this.listQuery};
                if(this.orderDate){
                    query.orderDate = this.orderDate[0]+'/'+this.orderDate[1].slice(0,10)+' 23:59:59';
                }
                this.$emit('changeListQuery',query);
            },
            deep: true
        },
        orderDate(val){
            let query = {...this.listQuery};
            query.orderDate = val[0]+'/'+val[1].slice(0,10)+' 23:59:59';
            this.$emit('changeListQuery',query);
        }
    },
    created() {
        getAllStaff().then((res) => {
            if (res.code == 0) {
                this.staffList = res.data.list;
            }
        });
        getAllWareHouse().then(res=>{
            if(res.code==0){
                this.warehouseList = res.data.list;
            }
        })
    },
    methods: {
        getVendors(query) {
            if (query !== "") {
                this.loading = true;
                getVendorByName({ vendorName: query }).then((res) => {
                    if (res.code == 0) {
                        this.loading = false;
                        this.vendorList = res.data.list;
                    }
                });
            } else {
                this.vendorList = [];
            }
        },
    },
};
</script>

<style>

</style>