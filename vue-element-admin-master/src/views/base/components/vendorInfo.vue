<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="供应商名称" prop="vendorName">
                <el-input v-model="form.vendorName"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="24">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="供应商类型" prop="vendorType">
                                <el-select
                                    v-model="form.vendorType"
                                    placeholder="请选择供应商类型"
                                >
                                    <el-option
                                        label="个体"
                                        value="个体"
                                    ></el-option>
                                    <el-option
                                        label="一级供应商"
                                        value="一级供应商"
                                    ></el-option>
                                    <el-option
                                        label="二级供应商"
                                        value="二级供应商"
                                    ></el-option>
                                    <el-option
                                        label="批发"
                                        value="批发"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="负责人" prop="owner">
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
           <el-form-item label="供应商地址">
                <el-input v-model="form.vendorAddress"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { addVendor ,updateVendor} from "../../../api/vendor";
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
                vendorName: "",
                vendorType: "",
                owner: "",
                contactName: "",
                contactPhone: "",
                vendorAddress: "",
            },
            rules: {
                vendorName: [
                    {
                        required: true,
                        message: "请输入供应商名称",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 20,
                        message: "长度在 3 到 20 个字符",
                        trigger: "blur",
                    },
                ],
                vendorType: [
                    {
                        required: true,
                        message: "请选择供应商类型",
                        trigger: "change",
                    },
                ],
                owner: [
                    {
                        required: true,
                        message: "请选择负责人",
                        trigger: "change",
                    },
                ],
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
                updateVendor(this.form).then((res) => {
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
                addVendor(this.form).then((res) => {
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

</style>