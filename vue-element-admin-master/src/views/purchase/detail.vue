<template>
    <div>
        <cgdd-info :orderId="orderId" v-if="type == 'cgdd'"></cgdd-info>
        <ycgd-info :orderId="orderId" v-if="type == 'ycgd'"></ycgd-info>
        <yrkd-info :orderId="orderId" v-if="type == 'yrkd'"></yrkd-info>
        <cgrk-info :orderId="orderId" v-if="type == 'cgrk'"></cgrk-info>
        <cgth-info :orderId="orderId" v-if="type == 'cgth'"></cgth-info>
    </div>
</template>

<script>
import cgddInfo from "./detail/cgdd-info.vue";
import ycgdInfo from "./detail/ycgd-info.vue";
import yrkdInfo from "./detail/yrkd-info.vue";
import cgrkInfo from "./detail/cgrk-info.vue";
import cgthInfo from "./detail/cgth-info.vue";
export default {
    components: {
        cgddInfo,
        ycgdInfo,
        yrkdInfo,
        cgrkInfo,
        cgthInfo,
    },
    data() {
        return {
            type: "",
            orderId: "",
        };
    },
    watch: {
        '$route': {
            handler(to, from) {
                console.log('to',to);
                this.orderId = to.params.orderId;
                this.type = to.params.orderId.slice(0, 4).toLowerCase();
            },
            immediate: true,
        },
    },
    methods: {},
};
</script>

<style scoped>
</style>