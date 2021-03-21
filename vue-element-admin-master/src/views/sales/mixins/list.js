import pagination from "@/components/Pagination/index";
import { getAllStaff } from "@/api/staff";
import { getCustomerByName } from "@/api/customer";
export const list = {
    components: { pagination },
    data() {
        return {
            listLoading: true,
            list: [],
            total: 100,
            customerList: [],
            staffList: [],
            listQuery: {}
        };
    },
    props: ['query'],
    watch: {
        listQuery: {
            handler(val) {
                this.getList();
            },
            deep: true,
        },
        query(val){
            this.listQuery = val;
        } 
    },
    filters: {
        filterDate(val) {
            if (val && val.length > 0) {
                return val.split(" ")[0];
            }
        },
        filterApprovalStatus(val) {
            if (val == 0) {
                return "待审批";
            } else if (val == 1) {
                return "审批通过";
            } else if (val == 2) {
                return "已驳回";
            }
        },
    },
    created() {
        this.parseQuery();
        getCustomerByName().then((res) => {
            if (res.code == 0) {
                this.customerList = res.data.list;
            }
        });
        getAllStaff().then((res) => {
            if (res.code == 0) {
                this.staffList = res.data.list;
            }
        });
    },
    mounted() {
        this.getList();
    },
    beforeRouteUpdate(to, from, next) {
        if (to.path == from.path) {
            const newQuery = Object.assign({}, to.query);
            const oldQuery = Object.assign({}, from.query);
            if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
                this.getList();
            }
        }
        console.log(to, from);
    },
    methods: {
        parseQuery() {
            const query = Object.assign({}, this.$route.query);
            const listQuery = {
                page: 1,
                pageSize: 10,
            };
            if (query) {
                query.page && (query.page = +query.page);
                query.pageSize && (query.pageSize = +query.pageSize);
            }
            this.listQuery = { ...query, ...listQuery };
        },
        refresh() {
            this.$router.push({
                path: "/sales/order/list",
                query: this.listQuery,
            });
        },
        showStaffName(id) {
            let name = "";
            this.staffList.forEach((item) => {
                if (item.value == id) {
                    name = item.label;
                }
            });
            return name;
        },
        showCustomerName(id) {
            let name = "";
            this.customerList.forEach((item) => {
                if (item.value == id) {
                    name = item.label;
                }
            });
            return name;
        },
    },
}