<template>
    <div class="filter-condiction">
        <div>
            <el-collapse>
                <el-collapse-item>
                    <div slot="title" class="filter-condiction__default">
                        <div class="filter-condiction__title">筛选条件：</div>
                        <el-tag>
                            单据日期：{{
                                listQuery.orderDate
                                    ? listQuery.orderDate
                                    : "本月"
                            }}
                        </el-tag>
                        <el-tag>
                            付款日期：{{
                                listQuery.payDate ? listQuery.payDate : "全部"
                            }}
                        </el-tag>
                        <el-tag>
                            结案状态：{{
                                listQuery.closingStatus
                                    ? listQuery.closingStatus
                                    : "全部"
                            }}
                        </el-tag>
                        <el-tag v-if="type == 'collectings'">
                            客户：{{
                                showCustomerName(listQuery.customerId)
                                    ? showCustomerName(listQuery.customerId)
                                    : "全部"
                            }}
                        </el-tag>
                        <el-tag v-if="type != 'collectings'">
                            供应商：{{
                                listQuery.vendorId ? listQuery.vendorId : "全部"
                            }}
                        </el-tag>
                        <el-tag>
                            {{
                                type == "collectings" ? "销售人员" : "采购人员"
                            }}：
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
                            <el-form-item label="单据日期">
                                <el-radio-group
                                    v-model="listQuery.orderDate"
                                    size="mini"
                                >
                                    <el-radio-button
                                        border
                                        label="全部"
                                    ></el-radio-button>
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
                            <el-form-item label="付款日期">
                                <el-radio-group
                                    v-model="listQuery.payDate"
                                    size="mini"
                                >
                                    <el-radio-button
                                        border
                                        label="全部"
                                    ></el-radio-button>
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
                            <el-form-item label="结案状态">
                                <el-radio-group
                                    v-model="listQuery.closingStatus"
                                    size="mini"
                                >
                                    <el-radio-button
                                        border
                                        label="全部"
                                    ></el-radio-button>
                                    <el-radio-button
                                        border
                                        label="未结案"
                                    ></el-radio-button>
                                    <el-radio-button
                                        border
                                        label="已结案"
                                    ></el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-row>
                                <el-col :span="24">
                                    <el-row>
                                        <el-col :span="6">
                                            <el-form-item
                                                label="客户"
                                                v-if="(type = 'collectings')"
                                            >
                                                <el-select
                                                    v-model="
                                                        listQuery.customerId
                                                    "
                                                    placeholder="请输入关键词"
                                                    size="mini"
                                                    filterable
                                                    :loading="loading"
                                                    remote
                                                    :remote-method="
                                                        getCustomers
                                                    "
                                                >
                                                    <el-option
                                                        label="全部"
                                                        value="全部"
                                                    ></el-option>
                                                    <el-option
                                                        v-for="item in customerList"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                    >
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item
                                                label="供应商"
                                                v-if="type != 'collectings'"
                                            >
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
                                            <el-form-item
                                                :label="
                                                    type == 'collectings'
                                                        ? '销售人员'
                                                        : '采购人员'
                                                "
                                            >
                                                <el-select
                                                    v-model="listQuery.owner"
                                                    placeholder="请选择"
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
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
import { getCustomerByName } from "@/api/customer";
import { getVendorByName } from "@/api/vendor";
import { getAllStaff } from "@/api/staff";
export default {
    props: ["type"],
    data() {
        return {
            loading: true,
            listQuery: {
                orderDate: "本月",
                payDate: "全部",
                closingStatus: "全部",
                customerId: "全部",
                vendorId: "全部",
                owner: "全部",
            },
            orderDate: "",
            payDate: "",
            staffList: [],
            vendorList: [],
            customerList: [],
        };
    },
    watch: {
        listQuery: {
            handler() {
                let query = { ...this.listQuery };
                if (this.payDate) {
                    query.payDate =
                        this.payDate[0] +
                        "/" +
                        this.payDate[1].slice(0, 10) +
                        " 23:59:59";
                }
                if (this.orderDate) {
                    query.orderDate =
                        this.orderDate[0] +
                        "/" +
                        this.orderDate[1].slice(0, 10) +
                        " 23:59:59";
                }
                this.$emit("changeListQuery", query);
            },
            deep: true,
        },
        orderDate(val) {
            let query = { ...this.listQuery };
            query.orderDate = val[0] + "/" + val[1].slice(0, 10) + " 23:59:59";
            this.$emit("changeListQuery", query);
        },
        payDate(val) {
            let query = { ...this.listQuery };
            query.payDate = val[0] + "/" + val[1].slice(0, 10) + " 23:59:59";
            this.$emit("changeListQuery", query);
        },
    },
    created() {
        getAllStaff().then((res) => {
            if (res.code == 0) {
                this.staffList = res.data.list;
            }
        });
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
        showCustomerName(id) {
            let name = "";
            this.customerList.forEach((item) => {
                if (item.value == id) {
                    name = item.label;
                }
            });
            return name;
        },
        getCustomers(query) {
            if (query !== "") {
                this.loading = true;
                getCustomerByName({ vendorName: query }).then((res) => {
                    if (res.code == 0) {
                        this.loading = false;
                        this.customerList = res.data.list;
                    }
                });
            } else {
                this.customerList = [];
            }
        },
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
.filter-condiction >>> .el-collapse-item__content {
    padding-bottom: 0;
}
</style>