<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="用户名称" prop="staffName">
                <el-input v-model="form.staffName"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="24">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="用户角色" prop="staffRole">
                                <el-select
                                    v-model="form.staffRole"
                                    placeholder="请选择用户角色"
                                >
                                    <el-option
                                        v-for="(value, index) in roles"
                                        :key="index"
                                        :label="value"
                                        :value="value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户手机" prop="staffPhone">
                                <el-input v-model="form.staffPhone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="用户账号" prop="staffAccount">
                                <el-input
                                    v-model="form.staffAccount"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户密码" prop="staffPassword">
                                <el-input
                                    type="password"
                                    v-model="form.staffPassword"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <div class="permission">设置用户权限</div>
            <div class="permission__model">
                <div class="permission__title">基础资料</div>
                <el-divider></el-divider>
                <div class="permission__item">
                    <div class="permission__item-title">客户</div>
                    <el-checkbox-group v-model="permission.kh">
                        <el-checkbox label="kh_read" :checked="hasPermis('kh_read')">查看</el-checkbox>
                        <el-checkbox label="kh_edit" :checked="hasPermis('kh_edit')">编辑</el-checkbox>
                        <el-checkbox label="kh_del" :checked="hasPermis('kh_del')">删除</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="permission__item">
                    <div class="permission__item-title">供应商</div>
                    <el-checkbox-group v-model="permission.gys">
                        <el-checkbox label="gys_read" :checked="hasPermis('gys_read')">查看</el-checkbox>
                        <el-checkbox label="gys_edit" :checked="hasPermis('gys_edit')">编辑</el-checkbox>
                        <el-checkbox label="gys_del" :checked="hasPermis('gys_del')">删除</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="permission__item">
                    <div class="permission__item-title">商品</div>
                    <el-checkbox-group v-model="permission.sp">
                        <el-checkbox label="sp_read" :checked="hasPermis('sp_read')">查看</el-checkbox>
                        <el-checkbox label="sp_edit" :checked="hasPermis('sp_edit')">编辑</el-checkbox>
                        <el-checkbox label="sp_del" :checked="hasPermis('sp_del')">删除</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="permission__item">
                    <div class="permission__item-title">仓库</div>
                    <el-checkbox-group v-model="permission.ck">
                        <el-checkbox label="ck_read" :checked="hasPermis('ck_read')">查看</el-checkbox>
                        <el-checkbox label="ck_edit" :checked="hasPermis('ck_edit')">编辑</el-checkbox>
                        <el-checkbox label="ck_del" :checked="hasPermis('ck_del')">删除</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <el-form-item>
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { addStaff, updateStaff } from "../../../api/staff";
const roles = [

    "管理员",
    "采购人员",
    "采购主管",
    "仓库人员",
    "仓库主管",
    "销售人员",
    "销售主管",
    "财务人员",
    "决策人员",
];
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
            roles,
            form: {
                staffName: "",
                staffRole: "",
                staffPhone: "",
                staffAccount: "",
                staffPassword: "",
                staffPermission: "",
            },
            permission: {kh:[],gys:[],sp:[],ck:[]},
            rules: {
                staffName: [
                    {
                        required: true,
                        message: "请输入用户名称",
                        trigger: "blur",
                    },
                    {
                        min: 2,
                        max: 20,
                        message: "长度在 2 到 20 个字符",
                        trigger: "blur",
                    },
                ],
                staffRole: [
                    {
                        required: true,
                        message: "请选择用户类型",
                        trigger: "change",
                    },
                ],
                staffPhone: checkPhone,
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
        hasPermis(permis) {
            let setData = new Set(this.form.staffPermission.split(','));
            return setData.has(permis);
        },
        cancel() {
            this.$emit("cancel");
        },
        // 获取权限集字符串,将permission转化为,分割的字符串
        getPermissions() {
            let data = JSON.parse(JSON.stringify(this.permission));
            let keys = Object.keys(data);
            let result = '';
            keys.forEach(key=>{
                if(data[key].length>0){
                    result+=','+[].concat(data[key].flat(1));
                }
            })
            result = result.slice(1);
            console.log(result);
            return result;
        },
        confirm() {
            this.form.staffPermission = this.getPermissions();
            this.$emit("confirm");
            if (this.isEdit) {
                updateStaff(this.form).then((res) => {
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
                addStaff(this.form).then((res) => {
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

<style lang="scss" scoped>
.permission {
    // padding-left: 12px;
    color: #333;
    font-size: 16px;
    &__model {
        margin: 10px 0;
    }
    &__title {
        padding-top: 10px;
        padding-left: 40px;
        font-size: 14px;
        color: #555;
    }
    &__item {
        display: flex;
        padding-left: 40px;
        margin: 15px 0px;
    }
    &__item-title {
        width: 60px;
    }
}
</style>