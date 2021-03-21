<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="客户名称" prop="customerName">
                <el-input v-model="form.customerName"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="24">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="客户类型" prop="customerType">
                                <el-select
                                    v-model="form.customerType"
                                    placeholder="请选择客户类型"
                                >
                                    <el-option
                                        label="普通客户"
                                        value="普通客户"
                                    ></el-option>
                                    <el-option
                                        label="批发客户"
                                        value="批发客户"
                                    ></el-option>
                                    <el-option
                                        label="大客户"
                                        value="大客户"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="业务员" prop="owner">
                                <el-select
                                    v-model="form.owner"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        label="钟述"
                                        value="钟述"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <el-form-item label="联系人" prop="contactName">
                <el-input v-model="form.contactName"></el-input>
            </el-form-item>
            <el-form-item label="联系人手机" prop="contactPhone">
                <el-input v-model="form.contactPhone"></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <div class="customer-info__recipient">收件信息</div>
            <el-row>
                <el-col :span="24">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="收件人">
                                <el-input
                                    v-model="form.recipientName"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="收件手机"
                                prop="recipientPhone"
                            >
                                <el-input
                                    v-model="form.recipientPhone"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-form-item label="收件地址">
                <el-input v-model="form.recipientAddress"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { addCustomer ,updateCustomer} from "../../../api/customer";
const checkPhone = [
    {
        min: 11,
        max: 11,
        message: "请输入11位手机号码",
        trigger: "blur",
    },
    {
        pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
        message: "请输入正确的手机号码",
    },
];
export default {
    props: ["formData", "isEdit"],
    data() {
        return {
            form: {
                customerName: "",
                customerType: "",
                owner: "",
                contactName: "",
                contactPhone: "",
                recipientName: "",
                recipientPhone: "",
                recipientAddress: "",
            },
            rules: {
                customerName: [
                    {
                        required: true,
                        message: "请输入客户名称",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 20,
                        message: "长度在 3 到 20 个字符",
                        trigger: "blur",
                    },
                ],
                customerType: [
                    {
                        required: true,
                        message: "请选择客户类型",
                        trigger: "change",
                    },
                ],
                owner: [
                    {
                        required: true,
                        message: "请选择业务员",
                        trigger: "change",
                    },
                ],
                recipientPhone: checkPhone,
                contactPhone: checkPhone,
            },
        };
    },
    watch: {
        formData: {
            handler(val) {
      　　      this.form = val;
    　　     },
    　　    immediate: true
        },
    },
    methods: {
        cancel() {
            this.$emit("cancel");
        },
        confirm() {
            this.$emit("confirm");
            if (this.isEdit) {
                updateCustomer(this.form).then((res) => {
                    if (res.code == 0) {
                        this.$notify({  offset: 100,
                            title: "成功",
                            message: res.msg,
                            type: "success",
                        });
                        this.$emit("refresh");
                    }
                });
            } else {
                addCustomer(this.form).then((res) => {
                    if (res.code == 0) {
                        this.$notify({  offset: 100,
                            title: "成功",
                            message: res.msg,
                            type: "success",
                        });
                        this.$emit("refresh");
                    }
                });
            }
        },
    },
};
</script>

<style>
.customer-info__recipient {
    font-size: 16px;
    padding-right: 30px;
}
</style>