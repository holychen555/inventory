<template>
    <div class="order">
        <div class="order__name">
            <div>
                盘点时间: {{ postData.checkDate
                }}<span @click="goBack" class="back">&lt; 返回</span>
            </div>
            <el-button
                size="mini"
                type="primary"
                @click="submit"
                v-if="!orderId||(orderId&&isEdit)"
                >提交审批</el-button>
            <div v-if="orderId&&!isEdit">
                <svg-icon class="svg-icon" :icon-class="status" />
                <div v-if="status == 'status_approving'">
                    <el-button size="mini" @click="disagree">驳回</el-button>
                    <el-button size="mini" type="primary" @click="agree">审批通过</el-button>
                </div>
                <div v-if="status == 'status_rejected'">
                    <el-button size="mini" @click="deleteOrder">删除</el-button>
                    <el-button size="mini" type="primary" @click="editOrder">编辑</el-button>
                </div>
            </div>
        </div>
        <div class="order__detail">
            <div class="order-item">
                <span class="order-item__label">盘点编号：</span>
                <span class="order-item__value">{{ postData.id }}</span>
            </div>
            <div class="order-item">
                <span class="order-item__label">盘点仓库：</span>
                <span class="order-item__value">{{
                    showWareHouseName(postData.warehouseId)
                }}</span>
            </div>
            <div class="order-item">
                <span class="order-item__label">盘点产品量：</span>
                <span class="order-item__value">{{ postData.checkNum }}</span>
            </div>
            <div class="order-item">
                <el-button
                    v-if="!orderId"
                    type="primary"
                    size="mini"
                    @click="showSelectGoods = true"
                    >添加商品</el-button
                >
            </div>
        </div>
        <check-goods
            :warehouseId="postData.warehouseId"
            :orderId="orderId"
            :isEdit="isEdit"
            :showSelectGoods="showSelectGoods"
            @changeShowSelectGoods="changeShowSelectGoods"
        ></check-goods>
         <div class="order-other" v-if="orderId">
                <div>
                    <span class="order-other__title">其他信息</span>
                </div>
                <el-divider></el-divider>
                <div>
                    <span class="order-other__label">创建人：</span>
                    <span class="order-other__value">{{showStaffName(postData.createdBy)}}</span>
                    <span class="order-other__label">创建时间：</span>
                    <span class="order-other__value">{{postData.createdDate}}</span>
                </div>
                <div v-if="status!='status_approving'">
                    <span class="order-other__label">审批人：</span>
                    <span class="order-other__value">{{showStaffName(postData.approvalBy)}}</span>
                    <span class="order-other__label">审批时间：</span>
                    <span class="order-other__value">{{postData.approvalDate}}</span>
                </div>
                <div v-if="status=='status_rejected'">
                    <span class="order-other__label">驳回原因：</span>
                    <span class="order-other__value">{{postData.approvalMsg}}</span>
                </div>
                <div v-if="status=='status_passed'">
                    <span class="order-other__label">通过原因：</span>
                    <span class="order-other__value">{{postData.approvalMsg}}</span>
                </div>
        </div>
    </div>
</template>

<script>
import { parseTime } from "@/utils/index.js";
import { getCheckId, getCheckById, updateCheck, addCheck,updateCheckApproval, deleteCheck} from "@/api/stock";
import { addOrderGoods, updateOrderGoods,deleteOrderGoods } from "@/api/ordergoods";
import { getAllWareHouse } from "@/api/warehouse";
import {getAllStaff} from "@/api/staff";
import CheckGoods from "./components/check-goods.vue";
export default {
    components: {
        CheckGoods,
    },
    data() {
        return {
            showSelectGoods: false,
            relatedId: "",
            orderId: "",
            postData: {
                warehouseId: "",
                id: "",
                checkDate: parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}"),
                checkNum: 0,
                profitAndLoss: 0,
                approvalStatus: 0
            },
            warehouseList: [],
            goodsList: [],
            errMsg: "",
            checkGoods: false, // 校验商品数据
            isEdit: false,
            staffList: []
        };
    },
    watch: {
        $route: {
            handler(to, from) {
                if (to.query.warehouseId) {
                    this.postData.warehouseId = to.query.warehouseId;
                }
                console.log("to", to);
                if (to.params.orderId) {
                    this.orderId = to.params.orderId;
                    this.isEdit = false;
                }
                if(to.query.orderId){
                    this.orderId = to.query.orderId || '';
                    this.isEdit = true;
                }
            },
            immediate: true,
        },
    },
    computed: {
        status: function () {
            // `this` 指向 vm 实例
            let status = this.postData.approvalStatus;
            if(status==0){
                return 'status_approving';
            } else if(status==1){
                return 'status_passed';
            } else if(status==2){
                return 'status_rejected';
            } 
        }
    },
    created() {
        if (this.orderId) {
            getCheckById(this.orderId).then((res) => {
                if (res.code == 0) {
                    this.postData = res.data;
                }
            });
        }
        if (!this.orderId) {
            getCheckId().then((res) => {
                if (res.code == 0) {
                    this.postData.id = res.data;
                }
            });
        }
        getAllStaff().then((res) => {
            if (res.code == 0) {
                this.staffList = res.data.list;
            }
        });
        getAllWareHouse().then((res) => {
            if (res.code == 0) {
                this.warehouseList = res.data.list;
            }
        });
        eventBus.$on("checkGoods", (value, errMsg) => {
            this.checkGoods = value;
            if (errMsg) {
                this.errMsg = errMsg;
            }
        });
        eventBus.$on("submitGoods", (value) => {
            this.goodsList = value;
        });
        eventBus.$on("setProfitAndLoss", (value) => {
            this.postData.profitAndLoss = value;
        });
        eventBus.$on("setCheckNum", (value) => {
            this.postData.checkNum = value;
        });
    },
    beforeDestory() {
        eventBus.$off("checkGoods");
        eventBus.$off("submitGoods");
        eventBus.$off("setProfitAndLoss");
        eventBus.$off("setCheckNum");
    },
    methods: {
        showWareHouseName(id) {
            let name = "";
            this.warehouseList.forEach((item) => {
                if (item.value == id) {
                    name = item.label;
                }
            });
            return name;
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
        goBack() {
            this.$router.go(-1);
        },
        submit() {
            console.log(this.goodsList);
            console.log(this.postData);
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
            // 存在orderId即为编辑状态
            let p1, p2;
            if (this.isEdit) {
                p1 = updateOrderGoods({
                    list: this.goodsList,
                    orderId: this.postData.id,
                });
                this.postData.approvalStatus = 0;
                p2 = updateCheck(this.postData);
            } else {
                p1 = addOrderGoods({
                    list: this.goodsList,
                    orderId: this.postData.id,
                });
                p2 = addCheck(this.postData);
            }
            Promise.all([p1, p2])
                .then((res) => {
                    let success = res.every((item) => item.code == 0);
                    if (success) {
                        this.$router.replace({
                            path: "/stock/check/order/" + this.postData.id,
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
        },
        changeShowSelectGoods() {
            this.showSelectGoods = false;
        },
         agree(){
            this.$prompt('请输入通过备注', '提示', {
                confirmButtonText: '通过',
                cancelButtonText: '取消',
                }).then(({ value }) => {
                    updateCheckApproval({id:this.orderId,approvalStatus: 1,approvalMsg: value}).then(res=>{
                        if(res.code==0){
                            getCheckById(this.orderId).then((res) => {
                                console.log(res);
                                if (res.code == 0) {
                                    this.postData = res.data;
                                }
                            });
                        }
                    })
            })
        },
        disagree(){
            this.$prompt('请输入驳回备注', '提示', {
                confirmButtonText: '驳回',
                cancelButtonText: '取消',
                }).then(({ value }) => {
                    updateCheckApproval({id:this.orderId,approvalStatus: 2,approvalMsg: value}).then(res=>{
                        if(res.code==0){
                            getCheckById(this.orderId).then((res) => {
                                console.log(res);
                                if (res.code == 0) {
                                    this.postData = res.data;
                                }
                            });
                        }
                    })
            })
        },
        deleteOrder() {
            let p1 = deleteOrderGoods(this.orderId);
            let p2 = deleteCheck(this.orderId);
            Promise.all([p1, p2])
                .then((res) => {
                    let success = res.every(item=>item.code==0);
                    if(success){
                        this.$router.go(-1);
                    }
                })
                .catch((err) => {
                    this.$notify({  offset: 100,
                        title: "错误",
                        message: err[0].msg,
                        type: "error",
                    });
                });
        },
        editOrder() {
            this.$router.replace({path:'/stock/check/order/?orderId='+this.orderId});
        },
    },
};
</script>

<style scoped>
.order {
    padding: 20px 15px;
    position: relative;
}
.svg-icon {
    position: absolute;
    left: 400px;
    top: -10px;
    width: 110px;
    height: 110px;
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
.order__detail {
    width: 100%;
    padding: 15px;
    background-color: #f7fbfe;
    display: flex;
}
.order-item {
    padding: 10px 0;
    padding-right: 20px;
    color: #666;
    font-size: 14px;
    line-height: 40px;
}
.order-item__label {
    font-weight: bold;
}
.order-item__value {
    margin-left: 10px;
}
.order-other {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #fff;
    color: #666;
}
.order-other >>> .el-divider--horizontal{
    margin: 10px 0;
}
.order-other__title {
    padding-left: 25px;
    font-size: 14px;
    color: #666;
}
.order-other__label {
    font-weight: bold;
    font-size: 14px;
    line-height: 40px;
    padding-right: 10px;
    padding-left: 25px;
}
.order-other__value {
    display: inline-block;
    width: 250px;
    font-size: 14px;
}
</style>