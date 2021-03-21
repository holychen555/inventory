<template>
    <div class="filter-condiction">
        <div>
            <el-collapse>
                <el-collapse-item>
                    <div slot="title" class="filter-condiction__default">
                        <div class="filter-condiction__title">筛选条件：</div>
                        <el-tag>
                            入库日期：{{
                                listQuery.stockingDate
                                    ? listQuery.stockingDate
                                    : "本月"
                            }}
                        </el-tag>
                        <el-tag>
                            审批状态：{{
                                listQuery.approvalStatus
                                    ? listQuery.approvalStatus
                                    : "全部"
                            }}
                        </el-tag>
                        <el-tag>
                            供应商：{{
                                listQuery.vendorId ? listQuery.vendorId : "全部"
                            }}
                        </el-tag>
                        <el-tag>
                            采购人员：
                            {{
                                listQuery.owner
                                    ? listQuery.owner
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
                            <el-form-item label="入库日期">
                                <el-radio-group
                                    v-model="listQuery.stockingDate"
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
                                    v-if="listQuery.stockingDate == '自定义'"
                                    v-model="stockingDate"
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
                        </el-form>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
import { getVendorByName } from "@/api/vendor";
import { getAllStaff } from "@/api/staff";
export default {
    data() {
        return {
            listQuery: {
                stockingDate: '本月',
                approvalStatus: '全部',
                vendorId: '全部',
                owner: '全部'
            },
            stockingDate: '',
            staffList: [],
            vendorList: [], //
            loading: true,
        };
    },
    watch: {
        listQuery: {
            handler(val){
                let query = {...this.listQuery};
                if(this.stockingDate){
                    query.stockingDate = this.stockingDate[0]+'/'+this.stockingDate[1].slice(0,10)+' 23:59:59';
                }
                console.log('query',query);
                this.$emit('changeListQuery',query);
            },
            deep: true
        },
        stockingDate(val){
            let query = {...this.listQuery};
            query.stockingDate = val[0]+'/'+val[1].slice(0,10)+' 23:59:59';
             console.log('query',query);
            this.$emit('changeListQuery',query);
        }
    },
    created() {
        getAllStaff().then((res) => {
            if (res.code == 0) {
                this.staffList = res.data.list;
            }
        });
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

<style scoped>
/* .filter-condiction >>> .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #e8f4ff;
    border-color: #e8f4ff;
} */

.filter-condiction__select {
    margin-top: 10px;
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