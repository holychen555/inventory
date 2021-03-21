import { getVendorByName } from "@/api/vendor";
import { getAllStaff } from "@/api/staff";
export const order = {
    created() {
        getAllStaff().then((res) => {
            if (res.code == 0) {
                this.staffList = res.data.list;
            }
        });
        eventBus.$on("checkGoods", (value, errMsg) => {
            this.checkGoods = value;
            if (errMsg) {
                this.errMsg = errMsg;
            }
        });
        eventBus.$on("submitGoods", (value) => {
            this.goodsList = value;
        });
    },
    beforeDestory() {
        eventBus.$off("checkGoods");
        eventBus.$off("submitGoods");
    },
    methods: {
        getVendors(query) {
            if (query !== "") {
                this.loading = true;
                getVendorByName({ vendorName: query }).then((res) => {
                    if (res.code == 0) {
                        this.loading = false;
                        this.vendorList = res.data.list;
                    }
                });
            } else {
                this.vendorList = [];
            }
        },
        goBack() {
            this.$router.go(-1);
        },
    },
}