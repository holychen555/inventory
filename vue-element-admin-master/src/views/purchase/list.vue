<template>
    <div class="order-manage">
        <div class="order__name">
            <div class="order-title">采购管理</div>
            <router-link :to="'/purchase/order/'+activeKey" class="order-add">
                <el-button type="primary" size="mini" icon="el-icon-plus"
                >新增{{ activeName }}</el-button>
            </router-link>
        </div>
        <div class="tab-container">
            <el-tabs v-model="activeKey" style="width: 100%;padding-right: 30px;margin-top: 15px" type="card">
                <el-tab-pane
                    v-for="item in tabMapOptions"
                    :key="item.key"
                    :label="item.label"
                    :name="item.key"
                    lazy
                >
                    <div v-if="activeKey=='cgdd'">
                        <cgdd-condiction @changeListQuery="changeListQuery"></cgdd-condiction> 
                        <cgdd-list :query="listQuery"></cgdd-list>
                    </div>
                    <div v-if="activeKey=='ycgd'">
                        <ycgd-condiction @changeListQuery="changeListQuery"></ycgd-condiction> 
                        <ycgd-list :query="listQuery"></ycgd-list>
                    </div>
                    <div v-if="activeKey=='yrkd'">
                        <yrkd-condiction @changeListQuery="changeListQuery"></yrkd-condiction> 
                        <yrkd-list :query="listQuery"></yrkd-list>
                    </div>
                    <div v-if="activeKey=='cgrk'">
                        <cgrk-condiction @changeListQuery="changeListQuery"></cgrk-condiction> 
                        <cgrk-list :query="listQuery"></cgrk-list>
                    </div>
                     <div v-if="activeKey=='cgth'">
                        <cgth-condiction @changeListQuery="changeListQuery"></cgth-condiction> 
                        <cgth-list :query="listQuery"></cgth-list>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
       
    </div>
</template>

<script>
import cgddCondiction from './list/cgdd-condiction.vue';
import cgddList from './list/cgdd-list.vue'
import ycgdCondiction from './list/ycgd-condiction.vue';
import ycgdList from './list/ycgd-list.vue'
import yrkdCondiction from './list/yrkd-condiction.vue';
import yrkdList from './list/yrkd-list.vue';
import cgrkCondiction from './list/cgrk-condiction.vue';
import cgrkList from './list/cgrk-list.vue';
import cgthConditcion from './list/cgth-condiction.vue';
import cgthList from './list/cgth-list.vue'
export default {
    components: {
        cgddCondiction,
        cgddList,
        ycgdCondiction,
        ycgdList,
        yrkdCondiction,
        yrkdList,
        cgrkCondiction,
        cgrkList,
        cgthConditcion,
        cgthList
    },
    data() {
        return {
            tabMapOptions: [
                { label: "预采购单", key: "ycgd" },
                { label: "采购订单", key: "cgdd" },
                { label: "预入库单", key: "yrkd" },
                { label: "采购入库单", key: "cgrk" },
                { label: "采购退货单", key: "cgth" },
            ],
            activeKey: "cgdd",
            listQuery: {}
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
    methods: {
        changeListQuery(listQuery){
            this.listQuery = listQuery;
        },
    },
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
    margin-bottom: 30px;
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
.tab-container {
    width: 100%;
    position: absolute;
    top: 0;
}
.tab-container >>> .el-tabs__header {
    margin-bottom: 0;
}
.tab-container >>> .el-tabs__header .el-tabs__nav {
    margin-left: 150px;
    border: none;
}
.tab-container >>> .el-tabs__header .el-tabs__item {
    margin-right: 2px;
    border: none;
    padding: 0 40px;
    padding-left: 40px;
    border-top: 2px solid transparent;
    color: #26344b;
    font-size: 13px;
    background-color: #d6dde3;
}
.tab-container >>> .el-tabs__header .el-tabs__item.is-active {
    border-top: 2px solid #459df5;
    background-color: #f7fbfe;
}
.tab-container >>> .el-tabs__header .el-tabs__item:nth-child(2) {
    padding-left: 40px;
}
.tab-container >>> .el-tabs__header .el-tabs__item:last-child {
    padding-right: 40px;
}


</style>
