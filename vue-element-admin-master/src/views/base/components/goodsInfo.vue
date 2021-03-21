<template>
    <div class="goods">
        <div class="goods__header">
            <div class="goods__title">{{ isEdit ? "编辑" : "新增" }}商品</div>
            <div>
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </div>
        </div>
        <el-tabs type="border-card">
            <el-tab-pane label="基本信息">
                <div class="goods-base">
                    <el-form
                     ref="formBase"
                        label-position="right"
                        label-width="120px"
                        :model="form"
                    >
                        <el-form-item label="商品名称" prop="goodsName"> 
                            <el-input v-model="form.goodsName"></el-input>
                        </el-form-item>
                        <el-form-item label="商品单位" prop="goodsUnit">
                            <el-input v-model="form.goodsUnit"></el-input>
                        </el-form-item>
                        <el-form-item label="商品规格"  prop="goodsModel">
                            <el-input v-model="form.goodsModel"></el-input>
                        </el-form-item>
                        <el-form-item label="标准售价"  prop="sellingPrice">
                            <el-input v-model="form.sellingPrice"></el-input>
                        </el-form-item>
                        <el-form-item label="标准买价"  prop="buyingPrice">
                            <el-input v-model="form.buyingPrice"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类"  prop="goodsCategory">
                            <el-select
                                v-model="form.goodsCategory"
                                placeholder="请选择商品分类"
                            >
                                <el-option
                                    v-for="(item,index) in categoryList"
                                    :key="index"
                                    :label="item"
                                    :value="item"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane label="库存预警">
                <el-form
                ref="formStock"
                    label-position="top"
                    :model="form"
                >
                    <el-form-item label="最高库存" prop="maxStock">
                        <el-input v-model="form.maxStock"></el-input>
                    </el-form-item>
                    <el-form-item label="最低库存" prop="minStock">
                        <el-input v-model="form.minStock"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>    

<script>
import {getGoodsById,addGoods,updateGoods} from '../../../api/goods'
export default {
    data() {
        return {
            isEdit: false,
            labelPosition: "right",
            form: {
                goodsName: "",
                goodsUnit: "",
                goodsModel: "",
                goodsCategory: "",
                sellingPrice: "",
                buyingPrice: "",
                maxStock: "",
                minStock: "",
                goodsId: "",
            },
            categoryList: ['口红','面霜']
        };
    },
    created() {
        let query = this.$route.query;
        console.log(this.$route);
        if (query){
            if(query.goodsId){
                this.isEdit = true;
                this.getGoodsById(query.goodsId);
            }
        }
        
    },
    methods: {
        getGoodsById(id) {
            getGoodsById(id).then(res=>{
                if(res.code==0){
                    this.form = res.data;
                }
            })
        },
        cancel() {
            this.$router.go(-1);
        },
        save() {
            if(this.isEdit){
                updateGoods(this.form).then(res=>{
                     this.$notify({  offset: 100,
                        title: "成功",
                        message: res.msg,
                        type: "success",
                    });
                    this.$router.go(-1);
                })
            }else{
                addGoods(this.form).then(res=>{
                     this.$notify({  offset: 100,
                        title: "成功",
                        message: res.msg,
                        type: "success",
                    });
                    this.$router.go(-1);
                })
            }
        }
    }
};
</script>
<style scoped>
.goods >>> .el-form-item__content {
    width: 400px;
}
</style>
<style lang="scss" scoped>
.goods {
    margin: 30px 15px;
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    &__title {
        // height: 40px;
        font-size: 18px;
        line-height: 20px;
    }
    &__delete {
        margin-left: 10px;
    }
}
.goods-base {
    width: 100%;
    margin-left: -50px;
}
</style>