<template>
    <div class="filter-condiction">
        <div>
            <el-collapse>
                <el-collapse-item>
                    <div slot="title" class="filter-condiction__default">
                        <div class="filter-condiction__title">筛选条件：</div>
                        <el-tag>
                            盘点日期：{{
                                listQuery.checkDate
                                    ? listQuery.checkDate
                                    : "本月"
                            }}
                        </el-tag>
                        <el-tag>
                            审批状态：{{
                                listQuery.approvalStatus | filterApprovalStatus
                            }}
                        </el-tag>
                        <el-tag>
                            仓库：{{
                                showWareHouseName(listQuery.warehouseId) ? showWareHouseName(listQuery.warehouseId) : "全部"
                            }}
                        </el-tag>
                        <el-tag>
                            盘点人：
                            {{
                                showStaffName(listQuery.owner)
                                    ? showStaffName(listQuery.owner)
                                    : "全部"
                            }}
                        </el-tag>
                    </div>
                    <div class="filter-condiction__selects">
                        <el-form
                            ref="form"
                            :model="listQuery"
                            label-width="80px"
                            label-style="color: #666;"
                        >
                            <el-form-item label="盘点日期">
                                <el-radio-group
                                    v-model="listQuery.checkDate"
                                    size="mini"
                                >
                                    <el-radio-button border label="全部"></el-radio-button>
                                    <el-radio-button border label="今天"></el-radio-button>
                                    <el-radio-button border label="昨天"></el-radio-button>
                                    <el-radio-button border label="本周"></el-radio-button>
                                    <el-radio-button border label="上周"></el-radio-button>
                                    <el-radio-button border label="本月"></el-radio-button>
                                    <el-radio-button border label="上月"></el-radio-button>
                                    <el-radio-button border label="自定义"></el-radio-button>
                                </el-radio-group>
                                <el-date-picker
                                    style="margin-left: 10px;"
                                    size="mini"
                                    v-if="listQuery.checkDate == '自定义'"
                                    v-model="checkDate"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="审批状态">
                                <el-radio-group
                                    v-model="listQuery.approvalStatus"
                                    size="mini"
                                >
                                    <el-radio-button border label="全部"></el-radio-button>
                                    <el-radio-button
                                        border
                                        :label="0"
                                    >待审批</el-radio-button>
                                    <el-radio-button
                                        border
                                        :label="2"
                                    >已驳回</el-radio-button>
                                    <el-radio-button
                                        border
                                        :label="1"
                                    >审批通过</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="仓库">
                                <el-select
                                    v-model="listQuery.warehouseId"
                                    placeholder="请输入关键词"
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
                            <el-form-item label="盘点人">
                                <el-select
                                    v-model="listQuery.owner"
                                    placeholder="盘点人"
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
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
// import { getCustomerByName } from "@/api/customer";
import {getAllWareHouse} from "@/api/warehouse";
import { getAllStaff } from "@/api/staff";
export default {
    data() {
        return {
            listQuery: {
                checkDate: '本月',
                approvalStatus: '全部',
                warehouseId: '全部',
                owner: '全部'
            },
            checkDate: '',
            staffList: [],
            warehouseList: [], 
        };
    },
    watch: {
        listQuery: {
            handler(){
                let query = {...this.listQuery};
                if(this.checkDate){
                    query.checkDate = this.checkDate[0]+'/'+this.checkDate[1].slice(0,10)+' 23:59:59';
                }
                this.$emit('changeListQuery',query);
            },
            deep: true
        },
        checkDate(val){
            let query = {...this.listQuery};
            query.checkDate = val[0]+'/'+val[1].slice(0,10)+' 23:59:59';
            this.$emit('changeListQuery',query);
        }
    },
    filters: {
        filterApprovalStatus(val) {
            if (val == 0) {
                return "待审批";
            } else if (val == 1) {
                return "审批通过";
            } else if (val == 2) {
                return "已驳回";
            } else {
                return val;
            }
        },
    },
    created() {
        getAllStaff().then((res) => {
            if (res.code == 0) {
                this.staffList = res.data.list;
            }
        });
        getAllWareHouse().then(res=>{
            if(res.code == 0) {
                this.warehouseList = res.data.list;
            }
        })
    },
    methods: {
        showStaffName(id) {
            let name = "";
            this.staffList.forEach((item) => {
                if (item.value == id) {
                    name = item.label;
                }
            });
            return name;
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

<style scoped>

.filter-condiction__select {
    margin-top: 100px;
}
.filter-condiction__default {
    display: flex;
    line-height: 30px;
}
.filter-condiction__title {
    padding-left: 10px;
    font-size: 14px;
    color: #666;
}
.filter-condiction >>> .el-collapse-item__header {
    height: 60px;
    line-height: 60px;
}
</style>