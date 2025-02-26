<template>
  <el-form ref="ruleFormRef" :model="apisuite" :rules="rules" label-width="120px" class="demo-ruleForm">
    <!-- 不同的页面，不同的表单字段 -->
    <!-- <el-form-item label="所属项目" prop="id">
        <el-select v-model="apicollection.project_id" placeholder="选择所属项目">
          <el-option v-for="project in projectList" :key="project.id" :label="project.project_name" :value="project.id" />
        </el-select>
      </el-form-item> -->
    <el-form-item label="任务名称" prop="suite_name">
      <el-input v-model="apisuite.suite_name" />
    </el-form-item>
    <el-form-item label="任务描述" prop="suite_desc">
      <el-input v-model="apisuite.suite_desc" />
    </el-form-item>
    <el-form-item label="定时任务" prop="suite_schedule" style="width: 20%">
      <el-input v-model="apisuite.suite_schedule" type="number" />
    </el-form-item>
    <!-- <el-form-item label="运行环境数据" prop="collection_env">
        <el-input v-model="apicollection.collection_env" :rows="2" type="textarea"
          placeholder='输入一些统一的环境变量定义（json格式）&#13;&#10;{"key1":"value1", "key2":"value2"}' />
      </el-form-item> -->
    <!-- <el-form-item label="参数化运行" prop="collection_params">
        <el-input v-model="apicollection.collection_params" :rows="2" type="textarea"
          placeholder='参数化DDT（json数组格式）&#13;&#10;[{"name":"tony","pwd":"xxxx","desc":"参数描述"},{"name":"jack","pwd":"xxxx","desc":"参数描述"}]' />
      </el-form-item> -->
    <!-- END 表单字段 -->
    <!-- 用例关联 -->
    <el-form-item label="用例关联">
      <el-table :data="computedTable" style="width: 100%">
        <el-table-column prop="num" label="序号" style="width: 5%" />
        <el-table-column prop="collection_name" label="用例名称" style="width: 80%" show-overflow-tooltip="true" />
        <el-table-column fixed="right" label="操作" style="width: 20%">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="deleteCases(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="width: 70%" small background layout="prev, pager, next" :page-size="apiCasePageSize"
        :total="apiCaseTotal" class="mt-4" v-model:current-page="currentCasePage"
        @current-change="handleApiCaseCurrentChange" />
      <el-button @click="showCaseInfosDialog">添加用例</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        保存退出
      </el-button>
      <el-button @click="closeForm()">关闭</el-button>
    </el-form-item>
    <!-- END 用例关联 -->
  </el-form>

  <!-- 弹窗 - 弹窗加载用例列表 -->
  <el-dialog v-model="infoDialogFormVisible" title="添加用例">
    <el-form-item>
      <el-row class="mb-4" type="flex" justify="start">
        <el-input v-model="searchForm.collection_name" placeholder="根据用例名称筛选" clearable style="width: 40%" />
        <el-select v-model="searchForm.project_id" placeholder="项目" @change="dailogprojectChange" clearable
          style="width: 20%">
          <el-option v-for="project in projectList" :key="project.id" :label="project.project_name"
            :value="project.id" />
        </el-select>
        <el-select v-model="searchForm.module_id" placeholder="模块" @click="getdailogModuleList" clearable
          style="width: 20%">
          <el-option v-for="module_info in moduleList" :key="module_info.id" :label="module_info.module_name"
            :value="module_info.id" />
        </el-select>
        <el-button type="primary" @click="loadCaseInfos()">查询</el-button>
      </el-row>
      <el-table :data="CaseInfocomputedTable" style="width: 100%">
        <el-table-column prop="num" label="序号" style="width: 10%" />
        <el-table-column prop="collection_name" label="用例名称" style="width: 80%" show-overflow-tooltip="true" />
        <el-table-column fixed="right" label="操作" style="width: 10%">
          <template #default="scope">
            <el-button type="primary" size="small" @click.prevent="addCaseInfo(scope.$index)">
              添加
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-pagination :current-page="currentCaseInfoPage" :page-size="CaseInfoPageSize" :total="CaseInfoTotal"
        @current-change="handleCaseInfoCurrentChange"></el-pagination>
    </el-form-item>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import { queryById, insertData, updateData } from "./ApiSuite"; // 不同页面不同的接口
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

// 表单实例
const ruleFormRef = ref<FormInstance>();

// 表单数据 - 不同的页面，不同的表单字段
const apisuite = reactive({
  id: 0,
  suite_name: "",
  suite_desc: "",
  suite_schedule: 0
});

// 表单验证规则 - 不同的页面，不同的校验规则
const rules = reactive<any>({
  suite_name: [{ required: true, message: "必填项", trigger: "blur" }],
  suite_desc: [{ required: true, message: "必填项", trigger: "blur" }],
});

// 提交表单
const submitForm = async (form: FormInstance | undefined) => {
  // 1. 校验表单 2.提交集合基础信息 3.提交用例信息
  if (!form) return;
  await form.validate((valid, fields) => {
    if (!valid) {
      return;
    }


    // 有ID 代表是修改， 没ID 代表是新增
    if (apisuite.id > 0) {
      updateData(apisuite).then(
        (res: { data: { code: number; msg: string } }) => {
          if (res.data.code == 200) {
            router.push("/apisuiteList"); // 跳转回列表页面 - 不同的页面，不同的路径
          }
        }
      );
    } else {
      insertData(apisuite).then(
        (res: { data: { code: number; msg: string } }) => {
          if (res.data.code == 200) {
            router.push("/apisuiteList"); // 跳转回列表页面 - 不同的页面，不同的路径
          }
        }
      );
    }
  });
};

// 关闭表单 - 回到数据列表页 - 不同的页面，不同的路径
const closeForm = () => {
  router.push("/apisuiteList");
};

// 加载表单数据
const loadData = async (id: number) => {
  const res = await queryById(id);
  // 不同的页面，不同的表单字段 (注意这里的res.data.data.xxx，xxx是接口返回的字段，不同的接口，字段不同)
  apisuite.id = res.data.data.id;
  apisuite.suite_name = res.data.data.suite_name;
  apisuite.suite_desc = res.data.data.suite_desc;
};

// 如果有id参数，说明是编辑，需要获取数据
console.log(router);
let query_id = router.currentRoute.value.query.id;
apisuite.id = query_id ? Number(query_id) : 0;
if (apisuite.id > 0) {
  loadData(apisuite.id);
}

// 如果有其他逻辑，请添加
// 1. 加载项目
import { queryAll } from "../project/ApiProject.js"; // 不同页面不同的接口
const projectList = ref([{
  id: '',
  project_name: '',
  project_desc: ''
}]);
function getProjectList() {
  queryAll().then((res) => {
    projectList.value = res.data.data;
  });
}
getProjectList();
import { queryByPage as apiModuleQuery } from "../module/ApiModule.js"; // 不同页面不同的接口
const moduleList = ref([{
  id: "",
  module_name: '',
  module_desc: ''
}]);

function getdailogModuleList() { // 根据项目加载模块
  apiModuleQuery({
    "project_id": searchForm.project_id,
    "page": 1,
    "pageSize": 999999
  }).then((res) => {
    moduleList.value = res.data.data;
  });
}
const dailogprojectChange = (value: number) => { // 项目变动触发
  console.log(value)
  if (value) {
    searchForm.module_id = ''
  } else {
    moduleList.value = [{
      id: '',
      module_name: '',
      module_desc: ''
    }]
    searchForm.module_id = ''

  }
}
// 2. 加载用例关联信息 
import { queryByPage, deleteData } from "./Case.js";
const CaseList = ref([] as any[]); // 关联的任务和用例
const currentCasePage = ref(1) // 页码
const apiCasePageSize = ref(5) // 每页大小
const apiCaseTotal = ref(0)

const computedTable = computed(() => {
  return CaseList.value.map((item, index) => ({
    ...item,
    num: (currentCasePage.value - 1) * apiCasePageSize.value + index + 1 // 分页序号 
  }))
})
// 根据分页参数 加载数据
function loadCases() {
  let searchData = {
    "suite_id": apisuite.id,
    "page": currentCasePage.value,
    "pageSize": apiCasePageSize.value
  }

  queryByPage(searchData).then((res: { data: { data: never[]; total: number; msg: string } }) => {
    console.log(res.data.data)
    CaseList.value = res.data.data
    apiCaseTotal.value = res.data.total
  })
}
// 翻页
const handleApiCaseCurrentChange = (val: number) => {
  console.log("页码变化:" + val)
  currentCasePage.value = val
  loadCases()
}
// 删除用例
const deleteCases = (index: number) => {
  deleteData(CaseList.value[index]["id"]).then((res: {}) => {
    loadCases()
  })
};
// 如果有id参数，说明是编辑，需要获取数据
if (apisuite.id > 0) {
  loadCases()
}



// 4. 添加用例
// 接口信息加载
import { queryByPage as queryCaseInfoByPage } from "../collection/ApiCollection"; // 不同页面不同的用例
const CaseInfoList = ref([] as any[]); // 关联的用例
const currentCaseInfoPage = ref(1) // 页码
const CaseInfoPageSize = ref(5) // 每页大小
const CaseInfoTotal = ref(0)
const infoDialogFormVisible = ref(false) // 是否展示弹窗
const searchForm = reactive({ "collection_name": '', "project_id": '', "module_id": '' })// 搜索

const CaseInfocomputedTable = computed(() => {
  return CaseInfoList.value.map((item, index) => ({
    ...item,
    num: (currentCaseInfoPage.value - 1) * CaseInfoPageSize.value + index + 1 // 分页序号 
  }))
})

import { ElMessage, ElMessageBox } from 'element-plus' // 弹窗
import type { Action } from 'element-plus'
function showCaseInfosDialog() {
  // 如果是新建任务,提示将自动保存,获取到ID之后再进行用例关联
  if (apisuite.id == 0) {
    ElMessageBox.alert('继续关联用例将自动保存该测试套件', '提示', {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: '我已知晓,继续',
      callback: (action: Action) => {
        if (action == 'confirm') {
          // 提交数据
          insertData(apisuite).then(
            (res: { data: { data: any, code: number; msg: string } }) => {
              if (res.data.code == 200) {
                apisuite.id = res.data.data.id
                infoDialogFormVisible.value = true
              }
            }                                                                                                                                                 
          );
          loadCaseInfos();
        }

      },
    })
  } else {
    infoDialogFormVisible.value = true
    loadCaseInfos();
  }


}

// 根据分页参数 加载数据
function loadCaseInfos() {
  let searchData = searchForm
  searchData["page"] = currentCaseInfoPage.value,
    searchData["pageSize"] = CaseInfoPageSize.value
  queryCaseInfoByPage(searchData).then((res: { data: { data: never[]; total: number; msg: string } }) => {
    console.log(res.data.data)
    CaseInfoList.value = res.data.data
    CaseInfoTotal.value = res.data.total
  })
}
// 翻页
const handleCaseInfoCurrentChange = (val: number) => {
  console.log("页码变化:" + val)
  currentCaseInfoPage.value = val
  loadCaseInfos()
}
// 关联到测试集合
import { insertData as insertApiCase } from "./Case.js"; // 不同页面不同的接口
const addCaseInfo = (index: number) => {
  insertApiCase({
    "suite_id": apisuite.id,
    "api_case_id": CaseInfoList.value[index].id,
  }).then(
    (res: { data: { code: number; msg: string } }) => {
      // 添加成功,刷新列表
      if (res.data.code == 200) {
        loadCases()
      }
    }
  );

}


</script>