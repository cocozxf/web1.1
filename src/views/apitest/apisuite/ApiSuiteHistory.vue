<template>
    <div>
        <!-- 搜索表单 -->
        <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="任务名称">
                <el-input v-model="searchForm.suite_name" placeholder="根据任务名称筛选" />
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
                    <el-button link type="primary" size="small" @click.prevent="excuteDetail(scope.$index)">
                        查看测试详情
                    </el-button>
                    <!-- <el-button link type="primary" size="small" @click.prevent="showApiHistorysDialog(scope.$index)">
                        执行记录
                    </el-button> -->
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
import { queryexcuteResult } from './ApiSuite' // 不同页面不同的接口
import { useRouter } from "vue-router";
const router = useRouter()
const searchForm = reactive({ "suite_name": "" })
// 表格列 - 不同页面不同的列
const columnList = ref([
    { prop: "id", label: '任务编号' },
    { prop: "excute_suite_name", label: '任务名称' },
    { prop: "excute_status", label: '任务状态' },
    { prop: "pass_count", label: '成功数' },
    { prop: "fail_count", label: '失败数' },
    { prop: "total_count", label: '总数' },
    { prop: "excute_time", label: '执行完成时间' },
    // 其他列
])

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
// 表格数据
const tableData = ref([])

// 加载页面数据
const loadData = () => {
    let searchData = searchForm
    searchData["page"] = currentPage.value
    searchData["pageSize"] = pageSize.value

    queryexcuteResult(searchData).then((res: { data: { data: never[]; total: number; msg: string }; }) => {
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

// const excuteDetail = (index: number) => {
//     router.push({
//         path: '/ExcuteDetail',
//         query: {
//             suiteId: tableData.value[index]["suite_id"],
//             createTime: tableData.value[index]["create_time"]
//         }
//     });
// }

const excuteDetail = (index: number) => {
    router.push({name:"ExcuteDetail",params:{suiteId: tableData.value[index]["suite_id"],createTime: tableData.value[index]["create_time"]}});
}
</script>