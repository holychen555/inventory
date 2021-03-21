import { getCustomerByName } from "@/api/customer";
import { getAllStaff } from "@/api/staff";
export const order = {
    created() {
        getAllStaff().then((res) => {
            if (res.code == 0) {
                this.staffList = res.data.list;
            }
        });
        // 当为其他单据生成时或编辑状态时
        if(this.relatedId || this.orderId){
            this.getAllCustomers();
        }
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
        getCustomers(query) {
            if (query !== "") {
                this.loading = true;
                getCustomerByName({ customerName: query }).then((res) => {
                    if (res.code == 0) {
                        this.loading = false;
                        this.customerList = res.data.list;
                    }
                });
            } else {
                this.customerList = [];
            }
        },
        goBack() {
            this.$router.go(-1);
        },
        getAllCustomers(){
            getCustomerByName().then((res) => {
                if (res.code == 0) {
                    this.customerList = res.data.list;
                }
            });
        }
    },
}