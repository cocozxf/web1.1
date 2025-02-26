<template>
  <el-form ref="ruleFormRef" :model="apicollection" :rules="rules" label-width="120px" class="demo-ruleForm">
    <!-- 不同的页面，不同的表单字段 -->
    <el-form-item label="项目模块信息" prop="project_id">
      <el-col :span="5">
        <el-form-item prop="project_id">
          <el-select v-model="apicollection.project_id" placeholder="项目" @change="projectChange" clearable>
            <el-option v-for="project in projectList" :key="project.id" :label="project.project_name"
              :value="project.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item prop="module_id">
          <el-select v-model="apicollection.module_id" placeholder="模块" @click="getModule" clearable>
            <el-option v-for="module_info in moduleList" :key="module_info.id" :label="module_info.module_name"
              :value="module_info.id" /></el-select>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="用例名称" prop="collection_name">
      <el-input v-model="apicollection.collection_name" clearable />
    </el-form-item>
    <el-form-item label="用例描述" prop="collection_desc">
      <el-input v-model="apicollection.collection_desc" clearable />
    </el-form-item>
    <el-form-item label="运行环境数据" prop="collection_env">
      <el-input v-model="apicollection.collection_env" :rows="2" type="textarea"
        placeholder='输入一些统一的环境变量定义（json格式）&#13;&#10;{"key1":"value1", "key2":"value2"}' />
    </el-form-item>
    <el-form-item label="参数化运行" prop="collection_params">
      <el-input v-model="apicollection.collection_params" :rows="2" type="textarea"
        placeholder='参数化DDT（json数组格式）&#13;&#10;[{"name":"tony","pwd":"xxxx","desc":"参数描述"},{"name":"jack","pwd":"xxxx","desc":"参数描述"}]' />
    </el-form-item>
    <!-- END 表单字段 -->
    <!-- 接口关联 -->
    <el-form-item label="接口关联">
      <el-table :data="apiCaseList" style="width: 100%">
        <el-table-column prop="run_order" label="顺序" style="width: 5%" />
        <el-table-column prop="api_name" label="接口名称" style="width: 40%" show-overflow-tooltip="true" />
        <el-table-column prop="request_url" label="请求地址" style="width: 40%" />
        <el-table-column prop="debug_vars" label="变量依赖" style="width: 40%" show-overflow-tooltip="true" />
        <el-table-column fixed="right" label="操作" style="width: 15%">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="editCaseParamData(scope.$index)">
              运行参数配置
            </el-button>
            <el-button link type="primary" size="small" @click.prevent="deleteApi(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="width: 70%" small background layout="prev, pager, next" :page-size="apiCasePageSize"
        :total="apiCaseTotal" class="mt-4" v-model:current-page="currentApiPage"
        @current-change="handleApiCaseCurrentChange" />
      <el-button @click="showApiInfosDialog">添加接口</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        保存退出
      </el-button>
      <el-button @click="closeForm()">关闭</el-button>
    </el-form-item>
    <!-- END 用例关联 -->
  </el-form>
  <!-- 弹窗 - 运行参数配置对话框 -->
  <el-dialog v-model="paramDialogFormVisible" title="运行参数配置">
    <el-form-item label="运行顺序" prop="caseRunOrder">
      <el-input v-model="caseRunOrder" />
    </el-form-item>
    <!-- <el-form-item label="运行参数" prop="caseParamData">
      <el-input v-model="caseParamData" :rows="10" type="textarea"
        placeholder='参数化DDT（json数组格式）&#13;&#10;[{"name":"tony"},{"name":"jack"}]' />
    </el-form-item> -->

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="paramDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handlerCaseParamDataChange">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 弹窗 - 弹窗加载接口列表 -->
  <el-dialog v-model="infoDialogFormVisible" title="添加接口">
    <el-form-item>
      <el-row class="mb-4" type="flex" justify="start">
        <el-input v-model="searchForm.api_name" placeholder="根据接口名称筛选" clearable style="width: 40%" />
        <el-select v-model="searchForm.project_id" placeholder="项目" @change="dailogprojectChange" clearable
          style="width: 20%">
          <el-option v-for="project in projectList" :key="project.id" :label="project.project_name"
            :value="project.id" />
        </el-select>
        <el-select v-model="searchForm.module_id" placeholder="模块" @click="getdailogModule" clearable style="width: 20%">
          <el-option v-for="module_info in moduleList" :key="module_info.id" :label="module_info.module_name"
            :value="module_info.id" /></el-select>
        <el-button type="primary" @click="loadApiInfos()">查询</el-button>
      </el-row>
      <el-table :data="computedTable" style="width: 100%">
        <el-table-column prop="num" label="序号" style="width: 5%" />
        <el-table-column prop="api_name" label="接口名称" style="width: 30%" show-overflow-tooltip="true" />
        <el-table-column prop="request_url" label="接口url" style="width: 60%" show-overflow-tooltip="true" />
        <el-table-column fixed="right" label="操作" style="width: 5%">
          <template #default="scope">
            <el-button type="primary" size="small" @click.prevent="addApiInfo(scope.$index)">
              添加
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-pagination :current-page="currentApiInfoPage" :page-size="apiInfoPageSize" :total="apiInfoTotal"
        @current-change="handleApiInfoCurrentChange"></el-pagination>
    </el-form-item>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue";
import { queryById, insertData, updateData } from "./ApiCollection.js"; // 不同页面不同的接口
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

// 表单实例
const ruleFormRef = ref<FormInstance>();

// 表单数据 - 不同的页面，不同的表单字段
const apicollection = reactive({
  id: 0,
  project_id: "",
  module_id: "",
  collection_name: "",
  collection_desc: "",
  collection_env: "",
  collection_params: ""
});

// 表单验证规则 - 不同的页面，不同的校验规则
const rules = reactive<any>({
  project_id: [{ required: true, message: "必填项", trigger: "blur" }],
  module_id: [{ required: true, message: "必填项", trigger: "blur" }],
  collection_name: [{ required: true, message: "必填项", trigger: "blur" }],
  collection_desc: [{ required: true, message: "必填项", trigger: "blur" }],
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
    if (apicollection.id > 0) {
      updateData(apicollection).then(
        (res: { data: { code: number; msg: string } }) => {
          if (res.data.code == 200) {
            router.push("/ApiCollectionList"); // 跳转回列表页面 - 不同的页面，不同的路径
          }
        }
      );
    } else {
      insertData(apicollection).then(
        (res: { data: { code: number; msg: string } }) => {
          if (res.data.code == 200) {
            router.push("/ApiCollectionList"); // 跳转回列表页面 - 不同的页面，不同的路径
          }
        }
      );
    }
  });
};

// 关闭表单 - 回到数据列表页 - 不同的页面，不同的路径
const closeForm = () => {
  router.push("/ApiCollectionList");
};

// 加载表单数据
const loadData = async (id: number) => {
  const res = await queryById(id);
  // 不同的页面，不同的表单字段 (注意这里的res.data.data.xxx，xxx是接口返回的字段，不同的接口，字段不同)
  apicollection.id = res.data.data.id;
  apicollection.project_id = res.data.data.project_id;
  apicollection.module_id = res.data.data.module_id;
  apicollection.collection_name = res.data.data.collection_name;
  apicollection.collection_desc = res.data.data.collection_desc;
  apicollection.collection_env = res.data.data.collection_env;
  apicollection.collection_params = res.data.data.collection_params;
};

// 如果有id参数，说明是编辑，需要获取数据
console.log(router);
let query_id = router.currentRoute.value.query.id;
apicollection.id = query_id ? Number(query_id) : 0;
if (apicollection.id > 0) {
  loadData(apicollection.id);
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
onMounted(() => {
  getModuleList()                                       
})
const getModule = () => {
  getModuleList()
}
const getdailogModule = () => {
  getdailogModuleList()
}
// 模块加载
import { queryByPage as apiModuleQuery } from "../module/ApiModule.js"; // 不同页面不同的接口
const moduleList = ref([{
  id: "",
  module_name: '',
  module_desc: ''
}]);
function getModuleList() { // 根据项目加载模块
  apiModuleQuery({
    "project_id": apicollection.project_id,
    "page": 1,
    "pageSize": 999999
  }).then((res) => {
    moduleList.value = res.data.data;
  });
}

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
const projectChange = (value: number) => { // 项目变动触发
  console.log(value)
  if (value) {
    apicollection.module_id = ''
  } else {
    moduleList.value = [{
      id: '',
      module_name: '',
      module_desc: ''
    }]
    apicollection.module_id = ''

  }
}
// 2. 加载接口关联信息 
import { queryByPage, deleteData } from "./ApiCase.js"; // 不同页面不同的接口
const apiCaseList = ref([] as any[]); // 用例关联的接口
const currentApiPage = ref(1) // 页码
const apiCasePageSize = ref(5) // 每页大小
const apiCaseTotal = ref(0)
// 根据分页参数 加载数据
function loadApiCases() {
  let searchData = {
    "collection_id": apicollection.id,
    "page": currentApiPage.value,
    "pageSize": apiCasePageSize.value
  }

  queryByPage(searchData).then((res: { data: { data: never[]; total: number; msg: string } }) => {
    console.log(res.data.data)
    apiCaseList.value = res.data.data
    apiCaseTotal.value = res.data.total
  })
}
// 翻页
const handleApiCaseCurrentChange = (val: number) => {
  console.log("页码变化:" + val)
  currentApiPage.value = val
  loadApiCases()
}
// 删除接口
const deleteApi = (index: number) => {
  deleteData(apiCaseList.value[index]["id"]).then((res: {}) => {
    loadApiCases()
  })
};
// 如果有id参数，说明是编辑，需要获取数据
if (apicollection.id > 0) {
  loadApiCases()
}



// 3. 运行参数调整
import { updateData as updateApiCaseCol } from "./ApiCase.js"; // 不同页面不同的接口
const paramDialogFormVisible = ref(false)
const caseRunOrder = ref(0)
const currentApiCaseIndex = ref(-1)

function handlerCaseParamDataChange() {
  updateApiCaseCol({
    "id": apiCaseList.value[currentApiCaseIndex.value].id,
    "run_order": caseRunOrder.value
  }).then((res: { data: { code: number; msg: string; }; }) => {
    if (res.data.code == 200) {
      apiCaseList.value[currentApiCaseIndex.value].run_order = caseRunOrder.value
      paramDialogFormVisible.value = false
      loadApiCases()
    }
  })
}
const editCaseParamData = (index: number) => {
  currentApiCaseIndex.value = index
  caseRunOrder.value = apiCaseList.value[index].run_order
  paramDialogFormVisible.value = true // 展示对话框
};

// 4. 添加接口
// 接口信息加载
import { queryByPage as queryApiInfoByPage } from "../apiinfo/ApiInfo.js"; // 不同页面不同的接口
const apiInfoList = ref([] as any[]); // 接口列表
const currentApiInfoPage = ref(1) // 页码
const apiInfoPageSize = ref(5) // 每页大小
const apiInfoTotal = ref(0)
const infoDialogFormVisible = ref(false) // 是否展示弹窗
const searchForm = reactive({ "api_name": '', "project_id": '', "module_id": '' })// 搜索


import { ElMessage, ElMessageBox } from 'element-plus' // 弹窗
import type { Action } from 'element-plus'
function showApiInfosDialog() {
  // 如果是新建用例,提示将自动保存,获取到ID之后再进行接口关联
  if (apicollection.id == 0) {
    ElMessageBox.alert('继续关联接口将自动保存测试用例', '提示', {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: '我已知晓,继续',
      callback: (action: Action) => {
        if (action == 'confirm') {
          // 提交数据
          console.log(apicollection);
          
          insertData(apicollection).then(
            (res: { data: { data: any, code: number; msg: string } }) => {
              if (res.data.code == 200) {
                apicollection.id = res.data.data.id
                infoDialogFormVisible.value = true
              }
            }
          );
          loadApiInfos()
        }

      },
    })
  } else {
    infoDialogFormVisible.value = true
    loadApiInfos()
  }


}

// 根据分页参数 加载数据
function loadApiInfos() {
  let searchData = searchForm
  searchData["page"] = currentApiInfoPage.value,
    searchData["pageSize"] = apiInfoPageSize.value
  queryApiInfoByPage(searchData).then((res: { data: { data: never[]; total: number; msg: string } }) => {
    console.log(res.data.data)
    apiInfoList.value = res.data.data
    apiInfoTotal.value = res.data.total
  })
}

const computedTable = computed(() => {
  return apiInfoList.value.map((item, index) => ({
    ...item,
    num: (currentApiInfoPage.value - 1) * apiInfoPageSize.value + index + 1 // 分页序号 
  }))
})
// 翻页
const handleApiInfoCurrentChange = (val: number) => {
  console.log("页码变化:" + val)
  currentApiInfoPage.value = val
  loadApiInfos()
}
// 关联到测试集合
import { insertData as insertApiCase } from "./ApiCase.js"; // 不同页面不同的接口
const addApiInfo = (index: number) => {
  insertApiCase({
    "collection_id": apicollection.id,
    "api_info_id": apiInfoList.value[index].id,
    "run_order": 0
  }).then(
    (res: { data: { code: number; msg: string } }) => {
      // 添加成功,刷新列表
      if (res.data.code == 200) {
        loadApiCases()
      }
    }
  );

}


</script>