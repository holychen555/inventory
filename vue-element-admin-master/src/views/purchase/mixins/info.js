import { getOrderGoods } from "@/api/ordergoods";
import { getAllStaff } from "@/api/staff";
import { getAllWareHouse } from "@/api/warehouse";
import { getVendorByName } from "@/api/vendor";
export const info = {
    data() {
        return {
            postForm: {approvalStatus:0},
            goodsList: [],
            labelWidth: "100px",
            options: [],
            value: "",
            loading: true,
            staffList: [],
            wareHouseList: [],
            vendorList: [],
        };
    },
    computed: {
         status: function () {
            // `this` 指向 vm 实例
            let status = this.postForm.approvalStatus;
            if(status==0){
                return 'status_approving';
            } else if(status==1){
                return 'status_passed';
            } else if(status==2){
                return 'status_rejected';
            } 
        }
    },
    props: ["orderId"],
    created() {
        getOrderGoods(this.orderId).then((res) => {
            console.log(res);
            if (res.code == 0) {
                this.loading = false;
                this.goodsList = res.data.list;
            }
        });
        getVendorByName().then(res=>{
            if (res.code == 0) {
                this.vendorList = res.data.list;
            }
        })
        getAllStaff().then((res) => {
            if (res.code == 0) {
                this.staffList = res.data.list;
            }
        });
        getAllWareHouse().then((res) => {
            if (res.code == 0) {
                this.wareHouseList = res.data.list;
            }
        });
    },
    filters: {
        filterDate(val) {
            if(val && val.length>0){
                return val.split(' ')[0];
            }
        }
    },
    methods: {
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 1) {
                    sums[index] = "合计";
                    return;
                }
                if (index == 3 || index == 7) {
                    const values = data.map((item) => {
                        return Number(item[column.property]);
                    });
                    if (!values.every((value) => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                    } else {
                        sums[index] = "N/A";
                    }
                }
            });

            return sums;
        },
        showWarehouseName(id){
            let name = ''
            this.wareHouseList.forEach(item=>{
                if(item.value==id){
                    name = item.label;
                }
            })
            return name;
        },
        showStaffName(id){
            let name = ''
            this.staffList.forEach(item=>{
                if(item.value==id){
                    name = item.label;
                }
            })
            return name;
        },
        showVendorName(id){
            let name = ''
            this.vendorList.forEach(item=>{
                if(item.value==id){
                    name = item.label;
                }
            })
            return name;
        },
        goBack(){
            this.$router.go(-1);
        },
    },
}