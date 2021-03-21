<template>
    <div class="order-manage">
        <div class="order__name">
            <div class="order-title">销售管理</div>
            <router-link :to="'/sales/order/'+activeKey" class="order-add">
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
                    <div v-if="activeKey=='xsdd'">
                        <xsdd-condiction @changeListQuery="changeListQuery"></xsdd-condiction> 
                        <xsdd-list :query="listQuery"></xsdd-list>
                    </div>
                    <div v-if="activeKey=='xsck'">
                        <xsck-condiction @changeListQuery="changeListQuery"></xsck-condiction> 
                        <xsck-list :query="listQuery"></xsck-list>
                    </div>
                    <div v-if="activeKey=='xsth'">
                        <xsth-condiction @changeListQuery="changeListQuery"></xsth-condiction> 
                        <xsth-list :query="listQuery"></xsth-list>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
       
    </div>
</template>

<script>
import xsddCondiction from './list/xsdd-condiction.vue';
import xsddList from './list/xsdd-list.vue';
import xsckCondiction from './list/xsck-condiction.vue';
import xsckList from './list/xsck-list.vue';
import xsthCondiction from './list/xsth-condiction.vue';
import xsthList from './list/xsth-list.vue';
export default {
    components: {
        xsddCondiction,
        xsddList,
        xsckCondiction,
        xsckList,
        xsthCondiction,
        xsthList
    },
    data() {
        return {
            tabMapOptions: [
                { label: "销售订单", key: "xsdd" },
                { label: "销售出库单", key: "xsck" },
                { label: "销售退货单", key: "xsth" },
            ],
            activeKey: "xsdd",
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
