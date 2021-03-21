<template>
    <div class="order-manage">
        <div class="order__name">
            <div class="order-title">库存盘点</div>
           
            <el-button
                type="primary"
                size="mini"
                icon="el-icon-upload2"
                @click="showAddCheckDialog"
                >开始盘点</el-button
            >
            
        </div>
        <div class="tab-container">
            <check-condiction
                @changeListQuery="changeListQuery"
                :warehouseList="warehouseList"
            ></check-condiction>
            <check-list :query="listQuery"></check-list>
        </div>
        <el-dialog title="新增盘点" :visible.sync="showAddCheck">
            <div>
                <div class="addcheck-msg">
                    <div class="addcheck-msg__label">提示：</div>
                    <div class="addcheck-img__value">
                        选择仓库并开始盘点，系统会自动将您生成盘点单，你可以在盘点单上新增自己想盘点的产品分类或具体的产品
                    </div>
                </div>
                <el-form ref="postForm" :rules="rules" :model="data">
                    <el-form-item label="仓库" prop="warehouseId">
                        <el-select
                            v-model="data.warehouseId"
                            placeholder="请输入关键词"
                            size="mini"
                            filterable
                        >
                            <el-option
                                v-for="item in warehouseList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="showAddCheck = false">取 消</el-button>
                    <el-button size="mini" type="primary" @click="toCheckOrder">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import checkCondiction from "./components/check-condiction.vue";
import checkList from "./components/check-list.vue";
import { getAllWareHouse } from "@/api/warehouse";
export default {
    components: {
        checkCondiction,
        checkList,
    },
    data() {
        return {
            tabMapOptions: [{ label: "库存盘点", key: "kcpd" }],
            activeKey: "xsdd",
            listQuery: {},
            showAddCheck: false,
            warehouseList: [],
            data: {
                warehouseId: '',
            },
            rules: {
                warehouseId: [{ required: true, message: '请选择仓库' }],
            },
        };
    },
    computed: {
        activeName() {
            let name = "";
            this.tabMapOptions.some((item) => {
                if (item.key == this.activeKey) {
                    name = item.label;
                }
            });
            return name;
        },
    },
    created() {
        getAllWareHouse().then((res) => {
            if (res.code == 0) {
                this.warehouseList = res.data.list;
            }
        });
    },
    methods: {
        changeListQuery(listQuery) {
            this.listQuery = listQuery;
        },
        showAddCheckDialog() {
            this.showAddCheck = true;
        },
        toCheckOrder(){
            this.$refs.postForm.validate((valid, fields) => {
                if (valid) {
                    this.$router.push({path:'/stock/check/order?warehouseId='+this.data.warehouseId})
                }
            })
        }
    }
};
</script>

<style scoped>
.order-manage {
    padding: 20px 15px;
    position: relative;
}
.order__name {
    position: relative;
    width: 100%;
    /* height: 40px; */
    margin-bottom: 10px;
    font-size: 18px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
}
.order-add {
    z-index: 10;
}
.order-title {
    padding-left: 20px;
}
/* .tab-container {
    width: 100%;
    position: absolute;
    top: 0;
} */
.addcheck-msg {
    color: #65ad6e;
    border: 1px solid #cbf0c1;
    background-color: #e9f9e7;
    padding: 20px;
    font-size: 12px;
}
</style>
