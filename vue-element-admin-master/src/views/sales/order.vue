<template>
    <div>
        <div v-if="type == 'xsdd'">
            <xsdd-order :orderId="orderId">
                <goods :orderId="orderId"></goods>
            </xsdd-order>
        </div>
        <div v-if="type == 'xsck'">
            <xsck-order :orderId="orderId" :relatedId="relatedId">
                <goods :orderId="orderId" :relatedId="relatedId"></goods>
            </xsck-order>
        </div>
        <div v-if="type == 'xsth'">
            <xsth-order :orderId="orderId" @selectRelatedFromId="selectRelatedId">
                <goods :orderId="orderId" :relatedId="relatedId" :isReturn="true"></goods>
            </xsth-order>
        </div>
    </div>
</template>

<script>
import xsddOrder from "./order/xsdd-order";
import xsckOrder from "./order/xsck-order";
import xsthOrder from "./order/xsth-order";
import goods from './order/goods';
export default {
    components: {
        xsddOrder,
        xsckOrder,
        xsthOrder,
        goods
    },
    data() {
        return {
            type: "", 
            orderId: "",
            relatedId: "",
        };
    },
    watch: {
        '$route': {
            handler(to, from){
                this.type = to.name;
                this.orderId = to.query.orderId || '';//编辑时需要的单据id
                this.relatedId = to.query.relatedId || '';//生成单据跳转时的相关单据id
                console.log('to',to);
            },
            immediate: true,
        },
    },
    methods: {
        selectRelatedId(id){
            this.relatedId = id;
        }
    },
};
</script>

<style lang="scss" scoped>
</style>