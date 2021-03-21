<template>
    <div class="order">
        <div class="order-title">销售明细报表</div>
        <sales-con @changeListQuery="changeListQuery"></sales-con>
        <div class="order-search-box">
            <div>
                <el-input
                    class="order-search-input"
                    v-model="input"
                    placeholder="输入商品名搜索"
                    size="mini"
                ></el-input>
                <el-button
                    size="mini"
                    plain
                    @click="search"
                    >查询</el-button
                >
            </div>
        </div>
        <sales-list :query="listQuery"></sales-list>
    </div>
</template>

<script>

import salesList from './components/sales-list.vue'
import SalesCon from './components/sales-con.vue';
export default {
    components: {
        SalesCon,
        salesList
    },
    data() {
        return {
            input: '',
            list: [],
            listQuery: {
                orderDate: "本月",
                approvalStatus: "全部",
                vendorId: "全部",
                owner: "全部",
                goodsName: "",
            },
        };
    },
    methods: {
        changeListQuery(val) {
            this.listQuery = val;
        },
        search(){
            let query = {
                ...this.listQuery
            }
            query.goodsName = this.input;
            this.listQuery = query;
        }
    },
};
</script>

<style lang="scss" scoped>
.order {
    padding: 20px 30px;
    .order-title {
        font-size: 20px;
        margin-bottom: 10px;
    }
    .order-condiction {
        padding-top: 10px;
        background: #fff;
    }
    .order-search-box {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .order-search-input {
        display: inline-block;
        width: 120px;
    }
}
</style>