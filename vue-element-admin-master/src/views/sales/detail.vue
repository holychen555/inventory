<template>
    <div>
        <xsdd-info :orderId="orderId" v-if="type == 'xsdd'"></xsdd-info>
        <xsck-info :orderId="orderId" v-if="type == 'xsck'"></xsck-info>
        <xsth-info :orderId="orderId" v-if="type == 'xsth'"></xsth-info>
    </div>
</template>

<script>
import xsddInfo from "./detail/xsdd-info.vue";
import xsckInfo from "./detail/xsck-info.vue";
import xsthInfo from "./detail/xsth-info.vue";
export default {
    components: {
        xsddInfo,
        xsckInfo,
        xsthInfo,
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