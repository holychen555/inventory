<template>
    <div class="order">
        <div class="order__name">
            <div>
                采购退货单<span @click="goBack" class="back">&lt; 返回</span>
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
                            <el-col :span="7">
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
                           
                            <el-col :span="7">
                                <el-form-item
                                    label="退货日期:"
                                    :label-width="labelWidth"
                                    prop="returnDate"
                                >
                                    <el-date-picker
                                        class="info-content"
                                        v-model="postForm.returnDate"
                                        type="datetime"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item
                                    label="供应商:"
                                    label-width="70px"
                                    prop="vendorId"
                                >
                                    <el-select
                                        class="info-content"
                                        v-model="postForm.vendorId"
                                        filterable
                                        placeholder="请输入关键词"
                                        :loading="loading"
                                        remote
                                        :remote-method="getVendors"
                                    >
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
                        </el-row>
                        <el-row>
                            <el-col :span="7">
                                <el-form-item
                                    label="关联入库单编号:"
                                    :label-width="labelWidth"
                                    prop="relatedFromId"
                                >
                                    <el-select
                                        class="info-content"
                                        v-model="postForm.relatedFromId"
                                        filterable
                                        searchable
                                        :disabled="!postForm.vendorId"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            v-for="item in cgrkIdList"
                                            :key="item.id"
                                            :label="item.id"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
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
                    </el-col>
                </el-row>
              
            </div>
            <slot></slot>
        </el-form>
    </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";
import { getPurchaseReturnId, addPurchaseReturn,getPurchaseReturnById ,getPurchaseStockinByVendorId,updatePurchaseReturn  } from "@/api/purchase";
import { addOrderGoods ,updateOrderGoods } from "@/api/ordergoods";
import {order} from '../mixins/order'
const fields = {
    id: "订单编号",
    relatedFromId: "采购入库单",
    returnDate: "退货日期",
    vendorId: "客户",
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
                returnDate: new Date(),
                vendorId: "",
                owner: "",
                totalAmount: '',
                relatedFromId: ''
            },
            rules: {
                id: [{ required: true, validator: validateRequire }],
                returnDate: [{ required: true, validator: validateRequire }],
                vendorId: [{ required: true, validator: validateRequire }],
                owner: [{ required: true, validator: validateRequire }],
                relatedFromId: [{ required: true, validator: validateRequire }],
            },
            goodsList: [],
            labelWidth: "130px",
            vendorList: [],
            value: "",
            loading: "",
            staffList: [],
            checkGoods: false, // 校验商品数据
            errMsg: "",
            cgrkIdList: []
        };
    },
    props: ["orderId","relatedId"],
    watch: {
        'postForm.vendorId': {
            handler(val){
                if(!this.orderId&&!this.relatedId){
                    getPurchaseStockinByVendorId(val).then(res=>{
                        if(res.code==0){
                            console.log(res);
                            this.cgrkIdList = res.data;
                        }
                    })
                }
            }
        },
        'postForm.relatedFromId': {
            handler(val){
                if(!this.orderId){
                    this.$emit('selectRelatedFromId',val);
                }
                
            }
        }
    },
    created() {
        // 存在orderId即为编辑状态
        if (this.orderId) {
            getPurchaseReturnById(this.orderId).then((res) => {
                console.log(res);
                if (res.code == 0) {
                   this.postForm = res.data;
                }
            });
        }
        if (!this.orderId) {
            getPurchaseReturnId().then((res) => {
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
        submit() {
            this.$refs.postForm.validate((valid, fields) => {
                if (valid) {
                    this.postForm.returnDate = parseTime(
                        this.postForm.returnDate,
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
                        p2 = updatePurchaseReturn(this.postForm);
                    }else {
                        p1 = addOrderGoods({
                            list: this.goodsList,
                            orderId: this.postForm.id,
                        });
                        p2 = addPurchaseReturn(this.postForm);
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
    font-size: 17px;
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
    width: 190px;
}
</style>