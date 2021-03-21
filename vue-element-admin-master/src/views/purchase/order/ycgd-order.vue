<template>
    <div class="order">
        <div class="order__name">
            <div>
                预采购单<span @click="goBack" class="back">&lt; 返回</span>
            </div>
            <el-button size="mini" type="primary" @click="submit"
                >提交审批</el-button
            >
        </div>
        <el-form ref="postForm" :model="postForm" :rules="rules">
            <div class="order__container">
                <el-row>
                    <el-col :span="24">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item
                                    label="订单编号:"
                                    :label-width="labelWidth"
                                    prop="id"
                                >
                                    <el-input
                                        class="info-content"
                                        v-model="postForm.id"
                                        disabled
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                    label="交货日期:"
                                    :label-width="labelWidth"
                                    prop="deliveryDate"
                                >
                                    <el-date-picker
                                        class="info-content"
                                        v-model="postForm.deliveryDate"
                                        type="datetime"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                    label="采购人员:"
                                    :label-width="labelWidth"
                                    prop="owner"
                                >
                                    <el-select
                                        class="info-content"
                                        v-model="postForm.owner"
                                        filterable
                                        searchable
                                        placeholder="请选择"
                                    >
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
                        <el-row>
                            <el-col :span="6">
                                <el-form-item
                                    label="单据日期:"
                                    :label-width="labelWidth"
                                    prop="orderDate"
                                >
                                    <el-date-picker
                                        class="info-content"
                                        v-model="postForm.orderDate"
                                        type="datetime"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
        </el-form>
    </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";
import { getPrePurchaseId,addPrePurchase,getPrePurchaseById,updatePrePurchase  } from "@/api/purchase";
import { addOrderGoods, updateOrderGoods } from "@/api/ordergoods";
import {order} from '../mixins/order'
const fields = {
    id: "订单编号",
    deliveryDate: "交货日期",
    orderDate: "单据日期",
    owner: "采购人员",
};
export default {
    mixins: [order],
    data() {
        const validateRequire = (rule, value, callback) => {
            if (value == "" || value == null) {
                callback(new Error(fields[rule.field] + "必须填写"));
            } else {
                callback();
            }
        };
        return {
            defaultTime: parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}"),
            postForm: {
                id: "",
                deliveryDate: new Date(),
                vendorId: "",
                orderDate: new Date(),
                owner: "",
            },
            rules: {
                id: [{ required: true, validator: validateRequire }],
                deliveryDate: [{ required: true, validator: validateRequire }],
                orderDate: [{ required: true, validator: validateRequire }],
                owner: [{ required: true, validator: validateRequire }],
            },
            goodsList: [],
            labelWidth: "100px",
            vendorList: [],
            value: "",
            loading: "",
            staffList: [],
            checkGoods: false, // 校验商品数据
            errMsg: "",
        };
    },
    props: ["orderId"],

    created() {
        // 存在orderId即为编辑状态
        if (this.orderId) {
            getPrePurchaseById(this.orderId).then((res) => {
                console.log(res);
                if (res.code == 0) {
                    this.postForm = res.data;
                }
            });
        }
        if (!this.orderId) {
            getPrePurchaseId().then((res) => {
                console.log(res);
                if (res.code == 0) {
                    this.postForm.id = res.data;
                }
            });
        }

    },
    methods: {
        submit() {
            this.$refs.postForm.validate((valid, fields) => {
                if (valid) {
                    this.postForm.deliveryDate = parseTime(
                        this.postForm.deliveryDate,
                        "{y}-{m}-{d} {h}:{i}:{s}"
                    );
                    this.postForm.orderDate = parseTime(
                        this.postForm.orderDate,
                        "{y}-{m}-{d} {h}:{i}:{s}"
                    );
                    if (!this.checkGoods) {
                        this.$notify({  offset: 100,
                            title: "警告",
                            message: this.errMsg || "请完善商品信息",
                            type: "warning",
                            offset: 100,
                            dangerouslyUseHTMLString: true,
                        });
                        return;
                    }
                    console.log("=======final data========");
                    console.log(this.postForm);
                    console.log(this.goodsList);
                    let p1, p2;
                    // 存在orderId即为编辑状态
                    if (this.orderId) {
                        p1 = updateOrderGoods({
                            list: this.goodsList,
                            orderId: this.postForm.id,
                        });
                        this.postForm.approvalStatus = 0;
                        p2 = updatePrePurchase(this.postForm);
                    } else {
                        p1 = addOrderGoods({
                            list: this.goodsList,
                            orderId: this.postForm.id,
                        });
                        p2 = addPrePurchase(this.postForm);
                    }
                    Promise.all([p1, p2])
                        .then((res) => {
                            let success = res.every((item) => item.code == 0);
                            if (success) {
                                this.$router.push({
                                    path:
                                        "/purchase/detail/" + this.postForm.id,
                                });
                            }
                        })
                        .catch((err) => {
                            this.$notify({  offset: 100,
                                title: "错误",
                                message: err[0].msg,
                                type: "error",
                            });
                        });
                    return;
                }
            });
        },
    },
};
</script>

<style scoped>
.order {
    padding: 20px 15px;
}
.order__name {
    width: 100%;
    /* height: 40px; */
    margin-bottom: 20px;
    font-size: 18px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
}
.order__container {
    padding: 20px 10px;
    background: #fff;
}
.info-content {
    width: 180px;
}
</style>