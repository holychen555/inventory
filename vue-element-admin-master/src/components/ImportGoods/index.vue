<template>
    <div class="app-container">
        <upload-excel-component
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
        />
        <el-table
           
            stripe
            height="320px"
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            style="width: 100%;margin-top: 10px;"
            :header-cell-style="{
                background: '#1890ff',
                color: '#fff',
                borderLeft: '1px solid #3589dc',
            }"
           
        >
            <el-table-column
                prop="goodsName"
                label="商品名称"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="goodsModel"
                label="规格"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column prop="goodsNum" label="数量" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="goodsPrice"
                label="单价"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column prop="goodsSum" label="金额" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="msg" label="备注" show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <div class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
        </div>
    </div>
</template>

<script>
import UploadExcelComponent from "@/components/UploadExcel/index.vue";

export default {
    name: "UploadExcel",
    components: { UploadExcelComponent },
    data() {
        return {
            tableData: [],
            tableHeader: [],
            list: [],
        };
    },
    methods: {
        beforeUpload(file) {
            const isLt1M = file.size / 1024 / 1024 < 1;

            if (isLt1M) {
                return true;
            }

            this.$message({
                message: "上传的文件大小不可大于1M",
                type: "warning",
            });
            return false;
        },
        handleSuccess({ results, header }) {
            this.tableData = results;
            this.tableHeader = header;
            let list = results;
            list.shift();
            this.list = list;
            console.log(this.tableData, this.tableHeader);
        },
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm',this.list);
        }
    },
};
</script>
<style scoped>
.dialog-footer {
    display: flex;
    justify-content: flex-end;
}
</style>
