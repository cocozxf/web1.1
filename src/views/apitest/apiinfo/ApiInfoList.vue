<template>
    <div>
        <!-- 搜索表单 -->
        <el-form ref="searchFormRef" :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="接口名称">
                <el-input v-model="searchForm.api_name" placeholder="根据接口名称筛选" clearable />
            </el-form-item>
            <el-form-item label="项目">
                <el-select v-model="searchForm.project_id" placeholder="项目" @change="projectChange" clearable>
                    <el-option v-for="project in projectList" :key="project.id" :label="project.project_name"
                        :value="project.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="模块">
                <el-select v-model="searchForm.module_id" placeholder="请先关联项目" clearable>
                    <el-option v-for="module_info in moduleList" :key="module_info.id" :label="module_info.module_name"
                        :value="module_info.id" /></el-select>
            </el-form-item>


            <el-row class="mb-4" type="flex" justify="end">
                <el-button type="primary" @click="loadData()">查询</el-button>
                <el-button type="warning" @click="onDataForm(-1)">新增数据</el-button>
            </el-row>
        </el-form>
        <!-- END 搜索表单 -->

        <!-- 数据表格 -->
        <el-table :data="computedTable" style="width: 100%;" max-height="500">
            <!-- 数据列 -->
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
import { ref, reactive, computed } from "vue"
import { queryByPage, deleteData } from './ApiInfo.js' // 不同页面不同的接口
import { useRouter } from "vue-router";
const router = useRouter()

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索功能 - 筛选表单
const searchStatus = ref(false) // 是否应用搜索表单
const searchForm = reactive({ "api_name": "", "project_id": "", "module_id": "" })


// 表格列 - 不同页面不同的列
const columnList = ref([
    { prop: "num", label: '序号' },
    { prop: "api_name", label: '接口名称' },
    { prop: "request_method", label: '请求方法' },
    { prop: "request_url", label: '请求地址' },
    { prop: "project_name", label: '关联项目' },
    { prop: "module_name", label: '关联模块' },
    // ... 其他列 ...
])


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

    queryByPage(searchData).then((res: { data: { data: never[]; total: number; msg: string } }) => {
        tableData.value = res.data.data
        total.value = res.data.total
    })
}
loadData()

// 变更 页大小
const handleSizeChange = (val: number) => {
    console.log("页大小变化:" + val)
    pageSize.value = val
    loadData()
}

// 变更 页码
const handleCurrentChange = (val: number) => {
    console.log("页码变化:" + val)
    currentPage.value = val
    loadData()
}

// 打开表单（编辑/新增）
const onDataForm = (index: number) => {
    let params_data = {};
    if (index >= 0) {
        params_data = {
            id: tableData.value[index]["id"]
        };
    }
    router.push({
        path: 'ApiInfoForm', // 不同页面不同的表单路径
        query: params_data
    });
}

// 删除数据
const onDelete = (index: number) => {
    deleteData(tableData.value[index]["id"]).then((res: {}) => {
        loadData()
    })
}

// 其他功能拓展
// 1. 加载项目
import { queryAll } from "../project/ApiProject.js"; // 不同页面不同的接口
const projectList = ref([{
    id: 0,
    project_name: '',
    project_desc: ''
}]);
function getProjectList() {
    queryAll().then((res) => {
        projectList.value = res.data.data;
    });
}
getProjectList();
// 2. 模块添加
import { queryByPage as apiModuleQuery } from "../module/ApiModule.js"; // 不同页面不同的接口
const moduleList = ref([{
    id: null,
    module_name: '',
    module_desc: ''
}]);
function getModuleList(value: number) { // 根据项目加载模块
    apiModuleQuery({
        // "project_id": searchForm.project_id,
        "project_id": value,
        "page": 1,
        "pageSize": 999999
    }).then((res) => {
        moduleList.value = res.data.data;
    });
}
const projectChange = (value: number) => { // 项目变动触发
    console.log(value);
    if (value) {
        getModuleList(value)
        searchForm.module_id = ''
    } else {
        moduleList.value = [{
            id: null,
            module_name: '',
            module_desc: ''
        }]
        searchForm.module_id = ''

    }



}
</script>
  
<style scoped>
.demo-pagination-block+.demo-pagination-block {
    margin-top: 10px;
}

.demo-pagination-block .demonstration {
    margin-bottom: 16px;
}
</style>
  