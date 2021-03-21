<template>
    <div class="order-manage">
        <div class="order__name">
            <div class="order-title">财务管理</div>
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
                    <div v-if="activeKey=='collectings'">
                        <collectings></collectings>
                    </div>
                    <div v-if="activeKey=='payments'">
                        <payments></payments>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
       
    </div>
</template>

<script>
import collectings from './components/collectings';
import payments from './components/payments';
export default {
    components: {
        collectings,
        payments
    },
    data() {
        return {
            tabMapOptions: [
                { label: "应收", key: "collectings" },
                { label: "应付", key: "payments" },
            ],
            activeKey: "collectings",
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
