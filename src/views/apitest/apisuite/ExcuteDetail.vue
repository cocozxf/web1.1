<template>
    <div>
        <!-- 搜索表单 -->
        <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="用例名称">
                <el-input v-model="searchForm.collection_name" placeholder="根据用例名称筛选" />
            </el-form-item>
            <!-- 这里可以根据需要添加其他搜索条件 -->
            <el-row class="mb-4" type="flex" justify="end">
                <el-button type="primary" @click="loadData()">查询</el-button>
            </el-row>
        </el-form>
        <!-- END 搜索表单 -->

        <!-- 数据表格 -->
        <el-table :data="tableData" style="width: 100%;" max-height="500">
            <!-- 数据列 -->
            <!-- 默认情况下，如果单元格内容过长，会占用多行显示。 若需要单行显示可以使用 show-overflow-tooltip -->
            <el-table-column v-for="col in columnList" :prop="col.prop" :label="col.label" :key="col.prop"
                show-overflow-tooltip="true" />

            <!-- 操作 -->
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click.prevent="showApiHistory(scope.$index)">
                        查看测试报告
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- END 数据表格 -->

        <!-- 分页 -->
        <div class="demo-pagination-block">
            <div class="demonstration"></div>
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
        <!-- END 分页 -->
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { queryByPage as queryApiHistoryByPage } from "../collection/ApiHistory"; // 不同页面不同的接口 // 不同页面不同的接口
import { useRouter,useRoute } from "vue-router";
const router = useRouter()
const route = useRoute()
const searchForm = reactive({ "collection_name": "" })
// 表格列 - 不同页面不同的列
const columnList = ref([
    { prop: "collection_name", label: '用例名称' },
    { prop: "history_desc", label: '用例执行记录' },
    { prop: "create_time", label: '执行时间' }
    // 其他列
])

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
// 表格数据
const tableData = ref([])// 关联的用例
console.log(router);
console.log(route);
let suite_id = router.currentRoute.value.params.suiteId;
let suite_create_time = router.currentRoute.value.params.createTime;


// 加载页面数据
const loadData = () => {
    let searchData = searchForm
    searchData["page"] = currentPage.value
    searchData["pageSize"] = pageSize.value
    searchData["suite_id"] = suite_id
    searchData["suite_create_time"] = suite_create_time
    queryApiHistoryByPage(searchData).then((res: { data: { data: never[]; total: number; msg: string }; }) => {
        tableData.value = res.data.data
        total.value = res.data.total
    })
}
loadData()

// 变更页大小
const handleSizeChange = (val: number) => {
    console.log("页大小变化:" + val)
    pageSize.value = val
    loadData()
}

// 变更页码
const handleCurrentChange = (val: number) => {
    console.log("页码变化:" + val)
    currentPage.value = val
    loadData()
}

// 展示具体测试报告
const showApiHistory = (index: number) => {
    // 注意： 这个地方的测试报告服务器地址，是需要根据后端服务器修改的，这里写死了，后面要改成配置文件
    var report_id = tableData.value[index]["history_detail"]
    window.open("http://127.0.0.1:5001/ApiHistory/" + report_id + ".html", '_blank');
}
</script>


