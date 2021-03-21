<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="仓库名称" prop="warehouseName">
                <el-input v-model="form.warehouseName"></el-input>
            </el-form-item>
            <el-form-item label="仓库地址" prop="warehouseAddress">
                <el-input v-model="form.warehouseAddress"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="owner">
                <el-select v-model="form.owner" placeholder="请选择">
                    <el-option label="钟述" value="钟述"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="msg">
                <el-input type="textarea" v-model="form.msg"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { addWareHouse, updateWareHouse } from "../../../api/warehouse";
export default {
    props: ["formData", "isEdit"],
    data() {
        return {
            form: {
                warehouseName: "",
                owner: "",
                warehouseAddress: "",
                msg: ""
            },
            rules: {
                warehouseName: [
                    {
                        required: true,
                        message: "请输入仓库名称",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 20,
                        message: "长度在 3 到 20 个字符",
                        trigger: "blur",
                    },
                ],
                owner: [
                    {
                        required: true,
                        message: "请选择负责人",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    watch: {
        formData: {
            handler(val) {
                this.form = val;
            },
            immediate: true,
        },
    },
    methods: {
        cancel() {
            this.$emit("cancel");
        },
        confirm() {
            this.$emit("confirm");
            if (this.isEdit) {
                updateWareHouse(this.form).then((res) => {
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
                addWareHouse(this.form).then((res) => {
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