<template>
    <div class="order">
        <div class="order__name">
            <div>
                销售出库单<span @click="goBack" class="back">&lt; 返回</span>
            </div>
            <el-button size="mini" type="primary" @click="submit"
                >提交审批</el-button
            >
        </div>
        <el-form ref="postForm" :model="postForm" label-position="left" :rules="rules">
            <div class="order-top__container">
                <el-row>
                    <el-col :span="24">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item
                                    label="编号:"
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
                                    label="出库日期:"
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
                                    label="客户:"
                                    label-width="60px"
                                    prop="customerId"
                                >
                                    <el-select
                                        class="info-content"
                                        v-model="postForm.customerId"
                                        filterable
                                        placeholder="请输入关键词"
                                        :loading="loading"
                                        remote
                                        :remote-method="getCustomers"
                                    >
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
                        </el-row>
                        <el-row>
                             
                            <el-col :span="6">
                                <el-form-item
                                    label="销售人员:"
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
                    </el-col>
                </el-row>
              
            </div>
              <slot></slot>
           <div class="order-bottom__container">
                <el-row>
                    <el-col :span="24">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item
                                    label="收件人姓名:"
                                    :label-width="labelWidth"
                                    prop="recipientName"
                                >
                                    <el-input
                                        class="info-content"
                                        v-model="postForm.recipientName"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                 <el-form-item
                                    label="收件人手机:"
                                    :label-width="labelWidth"
                                    prop="recipientPhone"
                                >
                                    <el-input
                                        class="info-content"
                                        v-model="postForm.recipientPhone"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                    label="收件地址:"
                                    :label-width="labelWidth"
                                    prop="recipientAddress"
                                >
                                    <el-input
                                        class="info-content"
                                        v-model="postForm.recipientAddress"
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
import { getSalesStockoutId, addSalesStockout,getSalesStockoutById ,getSalesById,updateSalesStockout  } from "@/api/sales";
import { addOrderGoods ,updateOrderGoods } from "@/api/ordergoods";
import {order} from '../mixins/order'
const fields = {
    id: "订单编号",
    deliveryDate: "出库日期",
    customerId: "客户",
    orderDate: "单据日期",
    owner: "销售人员",
    recipientName: "收件人姓名",
    recipientAddress: "收件人地址",
    recipientPhone: "收件人手机"
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
                customerId: "",
                orderDate: new Date(),
                owner: "",
                recipientName: '',
                recipientPhone: '',
                recipientAddress: '',
                totalAmount: '',
            },
            rules: {
                id: [{ required: true, validator: validateRequire }],
                deliveryDate: [{ required: true, validator: validateRequire }],
                customerId: [{ required: true, validator: validateRequire }],
                orderDate: [{ required: true, validator: validateRequire }],
                owner: [{ required: true, validator: validateRequire }],
                recipientName: [{ required: true, validator: validateRequire }],
                recipientAddress: [{ required: true, validator: validateRequire }],
                recipientPhone: [{ required: true, validator: validateRequire }],
            },
            goodsList: [],
            labelWidth: "100px",
            customerList: [],
            value: "",
            loading: "",
            staffList: [],
            checkGoods: false, // 校验商品数据
            errMsg: "",
        };
    },
    props: ["orderId","relatedId"],
    watch: {
        'postForm.customerId': {
            handler(val){
                if(!this.orderId&&!this.relatedId){
                    this.postForm.recipientName = this.findRecipient(val,'recipientName'); 
                    this.postForm.recipientPhone = this.findRecipient(val,'recipientPhone'); 
                    this.postForm.recipientAddress = this.findRecipient(val,'recipientAddress'); 
                }
                console.log(val);
            },
            deep: true
        }
    },
    created() {
        // 存在orderId即为编辑状态
        if (this.orderId) {
            getSalesStockoutById(this.orderId).then((res) => {
                console.log(res);
                if (res.code == 0) {
                   this.postForm = res.data;
                }
            });
        }
        // 存在relatedId即为从销售单生成
        if(this.relatedId){
            getSalesById(this.relatedId).then((res) => {
                console.log(res);
                if (res.code == 0) {
                    const {
                        recipientName,
                        recipientAddress,
                        recipientPhone,
                        customerId,
                        owner,
                    } = res.data;
                    this.postForm.recipientName = recipientName;
                    this.postForm.recipientAddress = recipientAddress;
                    this.postForm.recipientPhone = recipientPhone;
                    this.postForm.customerId = customerId;
                    this.postForm.owner = owner;
                    this.postForm.relatedFromId = this.relatedId;
                }
            });
        }
        if (!this.orderId) {
            getSalesStockoutId().then((res) => {
                console.log(res);
                if (res.code == 0) {
                    this.postForm.id = res.data;
                }
            });
        }
        eventBus.$on('setTotalAmount',(val)=>{
            this.postForm.totalAmount = val;
        })
    },
    beforeDestory(){
        eventBus.$off('setTotalAmount');
    },
    methods: {
        findRecipient(value,type){
            let result;
            this.customerList.forEach(item=>{
                if(item.value==value){
                    result = item[type];
                }
            })
            return result;
        },
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
                    let p1,p2;
                    // 存在orderId即为编辑状态
                    if(this.orderId){
                        p1 = updateOrderGoods({
                            list: this.goodsList,
                            orderId: this.postForm.id,
                        });
                        this.postForm.approvalStatus = 0;
                        p2 = updateSalesStockout(this.postForm);
                    }else {
                        p1 = addOrderGoods({
                            list: this.goodsList,
                            orderId: this.postForm.id,
                        });
                        p2 = addSalesStockout(this.postForm);
                    }
                    Promise.all([p1, p2])
                        .then((res) => {
                            let success = res.every((item) => item.code == 0);
                            if (success) {
                                this.$router.push({
                                    path:
                                        "/sales/detail/" + this.postForm.id,
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
    font-size: 16px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
}
.order-top__container {
    padding: 20px 0;
    padding-left: 30px;
    background: #fff;
    margin-bottom: 20px;
}
.order-bottom__container {
    padding: 20px 0;
    padding-left: 30px;
    background: #fff;
    margin-top: 10px;
}
.info-content {
    width: 170px;
}
</style>