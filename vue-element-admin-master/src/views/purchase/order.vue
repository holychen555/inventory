<template>
    <div>
        <div v-if="type == 'ycgd'">
            <ycgd-order :orderId="orderId"></ycgd-order>
            <goods :orderId="orderId"></goods>
        </div>
        <div v-if="type == 'cgdd'">
            <cgdd-order :orderId="orderId" :relatedId="relatedId"></cgdd-order>
            <goods :orderId="orderId" :relatedId="relatedId"></goods>
        </div>
        <div v-if="type == 'yrkd'">
            <yrkd-order :orderId="orderId" :relatedId="relatedId"></yrkd-order>
            <goods :orderId="orderId" :relatedId="relatedId"></goods>
        </div>
        <div v-if="type == 'cgrk'">
            <cgrk-order :orderId="orderId" :relatedId="relatedId"></cgrk-order>
            <goods :orderId="orderId" :relatedId="relatedId"></goods>
        </div>
        <div v-if="type == 'cgth'">
            <cgth-order :orderId="orderId" :relatedId="relatedId" @selectRelatedFromId="selectRelatedId"></cgth-order>
            <goods :orderId="orderId" :relatedId="relatedId" :isReturn="true"></goods>
        </div>
    </div>
</template>

<script>
import cgddOrder from "./order/cgdd-order";
import ycgdOrder from "./order/ycgd-order";
import yrkdOrder from "./order/yrkd-order";
import cgrkOrder from "./order/cgrk-order";
import cgthOrder from "./order/cgth-order";
import goods from './order/goods';
export default {
    components: {
        cgddOrder,
        ycgdOrder,
        yrkdOrder,
        cgrkOrder,
        cgthOrder,
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