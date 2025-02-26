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
                <el-button type="warning" @click="onDataForm(-1)">新增数据</el-button>
            </el-row>
        </el-form>
        <!-- END 搜索表单 -->

        <!-- 数据表格 -->
        <el-table :data="computedTable" style="width: 100%;" max-height="500">
            <!-- 数据列 -->
            <!-- 默认情况下，如果单元格内容过长，会占用多行显示。 若需要单行显示可以使用 show-overflow-tooltip -->
            <el-table-column v-for="col in columnList" :prop="col.prop" :label="col.label" :key="col.prop"
                show-overflow-tooltip="true" />

            <!-- 操作 -->
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click.prevent="onDataForm(scope.$index)">
                        编辑
                    </el-button>
                    <el-button link type="primary" size="small" @click.prevent="onDelete(scope.$index)">
                        删除
                    </el-button>
                    <el-button link type="primary" size="small" @click.prevent="pushexcutehistory(scope.$index)">
                        执行测试
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
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <!-- END 分页 -->
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import { queryByPage, deleteData, excuteTest } from './ApiSuite' // 不同页面不同的接口
import { useRouter } from "vue-router";
import { ElMessageBox } from 'element-plus';
const router = useRouter()
const searchForm = reactive({ "suite_name": "" })
// 表格列 - 不同页面不同的列
const columnList = ref([
    { prop: "num", label: '序号' },
    { prop: "suite_name", label: '任务名称' },
    // 其他列
])

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
// 表格数据
const tableData = ref([])
const computedTable = computed(() => {
    return tableData.value.map((item, index) => ({
        ...item,
        num: (currentPage.value - 1) * pageSize.value + index + 1 // 分页序号 
    }))
})
// 加载页面数据
const loadData = () => {
    let searchData = searchForm
    searchData["page"] = currentPage.value
    searchData["pageSize"] = pageSize.value

    queryByPage(searchData).then((res: { data: { data: never[]; total: number; msg: string }; }) => {
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
const onDataForm = (index: number) => {
    let params_data = {}
    if (index >= 0) {
        params_data = {
            id: tableData.value[index]["id"]
        }
    }
    router.push({
        path: '/ApiSuiteForm', // 不同页面不同的表单路径
        query: params_data
    });
}


// 删除数据
const onDelete = (index: number) => {
    deleteData(tableData.value[index]["id"]).then((res: {}) => {
        loadData()
    })
}

// 执行测试
const onExecuteTest = (index: number) => {
    excuteTest(tableData.value[index]).then((res: {}) => {
        console.log(res)
    })
}

const pushexcutehistory = (index: number) => {
    onExecuteTest(index)
    showModal("是否跳转到任务执行记录页面？", "warning", "").then((res) => {
        router.push("/ApiSuiteHistory");
    })
}

const showModal = (content, type, title) => {
    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type,
        }
    )
}

</script>