<template>
  <el-form ref="ruleFormRef" :inline="false" :model="apiInfo" :rules="rules" class="demo-form-inline">
    <el-form-item>
      <el-col :span="18">
        <el-form-item prop="api_name" label="接口名称">
          <el-input v-model="apiInfo.api_name" placeholder="输入名称" />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item prop="project_id" >
          <el-select v-model="apiInfo.project_id" placeholder="项目" @change="projectChange" clearable>
            <el-option v-for="project in projectList" :key="project.id" :label="project.project_name"
              :value="project.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item prop="module_id">
          <el-select v-model="apiInfo.module_id" placeholder="模块" clearable>
            <el-option v-for="module_info in moduleList" :key="module_info.id" :label="module_info.module_name"
              :value="module_info.id" /></el-select>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item >
      <el-col :span="3" class="mr-10">
        <el-form-item prop="is_login" class="w-[200px]" label="接口类型">
          <el-select v-model="apiInfo.is_login"  clearable>
            <el-option v-for="is_login in isLoginList" :key="is_login.logintype" :label="is_login.label"
              :value="is_login.logintype" /></el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5" v-show="cookieShow" class="ml-10">
      <el-form-item label="cookie变量名">
        <el-input v-model="apiInfo.cookie_name" placeholder="输入变量名" clearable />
      </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-col :span="3" >
        <el-select v-model="apiInfo.request_method"  placeholder="请求方式" style="width: 115px">
          <el-option label="POST" value="POST" />
          <el-option label="GET" value="GET" />
          <el-option label="DELETE" value="DELETE" />
          <el-option label="PUT" value="PUT" />
        </el-select>
      </el-col>
      <el-col :span="17">
        <el-input v-model="apiInfo.request_url" placeholder="请求URL" />
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="3"><el-button type="primary" @click="debugRequest">请求(调试)</el-button></el-col>
    </el-form-item>
    <!-- 请求参数 -->
    <el-form-item>
      <el-tabs class="demo-tabs" v-model="tabActiveName" style="width: 100%;height: auto">
        <el-tab-pane label="URL参数" name="URL参数">
          <el-table :data="apiInfo.request_params" style="width: 100%" max-height="250">
            <el-table-column prop="key" label="参数名" style="width: 40%" />
            <el-table-column prop="value" label="参数值" style="width: 40%" />
            <el-table-column fixed="right" label="删除" style="width: 20%">
              <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="deleteParams(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-input v-model="requestParams.key" placeholder="输入参数名" style="width: 40%" />
          <el-input v-model="requestParams.value" placeholder="输入参数值" style="width: 40%" />
          <el-button style="width: 20%" @click="onAddParams">添加</el-button>
        </el-tab-pane>
        <el-tab-pane label="请求头Header" name="请求头Header">
          <el-table :data="apiInfo.request_headers" style="width: 100%" max-height="250">
            <el-table-column prop="key" label="请求头名称" style="width: 40%" />
            <el-table-column prop="value" label="请求头内容" style="width: 40%" />
            <el-table-column fixed="right" label="删除" style="width: 20%">
              <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="deleteHeaders(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-input v-model="requestHeaders.key" placeholder="输入请求头名称" style="width: 40%" />
          <el-input v-model="requestHeaders.value" placeholder="输入请求头内容" style="width: 40%" />
          <el-button style="width: 20%" @click="onAddHeaders">添加</el-button>
        </el-tab-pane>
        <el-tab-pane label="请求Body" name="请求Body">
          <el-tabs class="demo-tabs" model-value="form-data">
            <el-tab-pane label="form-data" name="form-data">
              <el-table :data="apiInfo.request_form_datas" style="width: 100%" max-height="250">
                <el-table-column prop="key" label="表单参数名" style="width: 40%" />
                <el-table-column prop="value" label="表单参数值" style="width: 40%" />
                <el-table-column fixed="right" label="删除" style="width: 20%">
                  <template #default="scope">
                    <el-button link type="primary" size="small" @click.prevent="deleteBodyFormDatas(scope.$index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-input v-model="requestBodyFormDatas.key" placeholder="输入表单参数名" style="width: 40%" />
              <el-input v-model="requestBodyFormDatas.value" placeholder="输入表单参数值" style="width: 40%" />
              <el-button style="width: 20%" @click="onAddBodyFormDatas">添加</el-button>
            </el-tab-pane>
            <el-tab-pane label="x-www-form-data" name="x-www-form-data">
              <el-table :data="apiInfo.request_www_form_datas" style="width: 100%" max-height="250">
                <el-table-column prop="key" label="表单参数名" style="width: 40%" />
                <el-table-column prop="value" label="表单参数值" style="width: 40%" />
                <el-table-column fixed="right" label="删除" style="width: 20%">
                  <template #default="scope">
                    <el-button link type="primary" size="small" @click.prevent="deleteBodyWwwFormDatas(scope.$index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-input v-model="requestBodyWwwFormDatas.key" placeholder="输入表单参数名" style="width: 40%" />
              <el-input v-model="requestBodyWwwFormDatas.value" placeholder="输入表单参数值" style="width: 40%" />
              <el-button style="width: 20%" @click="onAddBodyWwwFormDatas">添加</el-button>
            </el-tab-pane>
            <el-tab-pane label="json" name="json">
              <el-input v-model="apiInfo.requests_json_data" type="textarea" :rows="10" placeholder="请输入内容" />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="检查点" name="检查点">
          <el-table :data="apiInfo.assert_vars" style="width: 100%" max-height="250">
            <el-table-column prop="value" label="实际结果" style="width: 25%" />
            <el-table-column prop="type" label="判断类型" style="width: 15%" />
            <el-table-column prop="target" label="预期结果" style="width: 25%" />
            <el-table-column prop="errorMsg" label="报错提示" style="width: 25%" />
            <el-table-column fixed="right" label="删除" style="width: 10%">
              <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="deleteassertvars(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-input v-model="assertVars.value" placeholder="输入实际结果" style="width: 26.6%" />
          <el-select v-model="assertVars.type" placeholder="请选择判定类型" style="width: 10%" @change="assertVars.target = ''">
            <el-option v-for="(el, index) in typeList" :key="index" :label="el.label" :value="el.value"></el-option>
          </el-select>
          <el-input v-model="assertVars.target"
            :placeholder="typeValueList.includes(assertVars.type) ? '请输入预期结果' : '请输入预期结果（数字）'" style="width: 26.6%"
            @input="numput(assertVars.type)"></el-input>
          <el-input v-model="assertVars.errorMsg" placeholder="输入报错信息" style="width: 26.6%" />
          <el-button style="width: 10.2%" @click="onAddassertvars">添加</el-button>
        </el-tab-pane>

        <el-tab-pane label="json参数提取" name="json参数提取">
          <el-table :data="apiInfo.extract_vars" style="width: 100%" max-height="250">
            <el-table-column prop="varname" label="提取变量名" style="width: 40%" />
            <el-table-column prop="target" label="提取变量值" style="width: 40%" />
            <el-table-column fixed="right" label="删除" style="width: 20%">
              <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="deleteExtract(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-input v-model="extractVars.varname" placeholder="输入提取变量名" style="width: 40%" />
          <el-input v-model="extractVars.target" placeholder="输入提取变量值" style="width: 40%" />
          <el-button style="width: 20%" @click="onAddextractvars">添加</el-button>
        </el-tab-pane>


        <el-tab-pane label="DEBUG变量定义" name="DEBUG变量定义">
          <el-table :data="apiInfo.debug_vars" style="width: 100%" max-height="250">
            <el-table-column prop="key" label="变量名" style="width: 40%" />
            <el-table-column prop="value" label="变量值" style="width: 40%" />
            <el-table-column fixed="right" label="删除" style="width: 20%">
              <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="deleteVars(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-input v-model="debugVars.key" placeholder="输入变量名" style="width: 40%" />
          <el-input v-model="debugVars.value" placeholder="输入变量值" style="width: 40%" />
          <el-button style="width: 20%" @click="onAddVars">添加</el-button>
        </el-tab-pane>
        <el-tab-pane label="调试输出内容" name="调试输出内容">
          <el-input v-model="debugArea" type="textarea" :rows="30" placeholder="接口调用输出内容" disabled max-height="500" />
        </el-tab-pane>
      </el-tabs>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button type="primary" @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { queryById, insertData, updateData } from "./ApiInfo.js"; // 不同页面不同的接口
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from "vue-router";
const router = useRouter();
// 表单实例
const ruleFormRef = ref<FormInstance>();
const apiInfo = reactive({
  id: 0,
  project_id: "",
  module_id: "",
  api_name: "",
  is_login: "",
  cookie_name: "",
  request_method: "",
  request_url: "",
  request_params: [] as any[],
  request_headers: [] as any[],
  debug_vars: [] as any[],
  request_form_datas: [] as any[], // 请求中的 form-data
  request_www_form_datas: [] as any[], // 请求中的 x-www-form-data
  requests_json_data: "", // 请求中的 json 数据
  assert_vars: [] as any[], // 断言
  extract_vars: [] as any[], // 执行后提取变量
});
const cookieShow = computed(() => apiInfo.is_login === "login")
// 1. 加载项目
import { queryAll as queryAllProject } from "../project/ApiProject.js"; // 不同页面不同的接口
const projectList = ref([{
  id: 0,
  project_name: '',
  project_desc: ''
}]);
function getProjectList() {
  queryAllProject().then((res) => {
    projectList.value = res.data.data;
  });
}
getProjectList();
// 2. 加载模块
import { queryByPage as ApiModuleQuery } from "../module/ApiModule.js"; // 不同页面不同的接口
const moduleList = ref([{
  id: 0,
  module_name: '',
  module_desc: ''
}]);
function getModuleList() { // 根据项目加载模块
  ApiModuleQuery({
    "project_id": apiInfo.project_id,
    "page": 1,
    "pageSize": 999999
  }).then((res) => {
    moduleList.value = res.data.data;
  });
}
const projectChange = (value: number) => { // 项目变动触发
  console.log(value)
  getModuleList()
}

// 3. 如果有id参数，说明是编辑，需要获取数据
const loadData = async (id: number) => {
  const res = await queryById(id)
  // 不同的页面，不同的表单字段 (注意这里的res.data.data.xxx，xxx是接口返回的字段，不同的接口，字段不同)
  // 注意:此处将 后台的json字符串转变为对象
  apiInfo.id = res.data.data.id
  apiInfo.project_id = res.data.data.project_id
  apiInfo.module_id = res.data.data.module_id
  apiInfo.api_name = res.data.data.api_name
  apiInfo.is_login = res.data.data.is_login
  apiInfo.cookie_name = res.data.data.cookie_name
  apiInfo.request_method = res.data.data.request_method
  apiInfo.request_url = res.data.data.request_url
  apiInfo.request_params = JSON.parse(res.data.data.request_params)
  apiInfo.request_headers = JSON.parse(res.data.data.request_headers)
  apiInfo.debug_vars = JSON.parse(res.data.data.debug_vars)
  apiInfo.request_form_datas = JSON.parse(res.data.data.request_form_datas) // 请求中的 form-data
  apiInfo.request_www_form_datas = JSON.parse(res.data.data.request_www_form_datas) // 请求中的 x-www-form-data
  apiInfo.requests_json_data = res.data.data.requests_json_data // 请求中的 json 数据
  apiInfo.assert_vars = JSON.parse(res.data.data.assert_vars) // 断言
  apiInfo.extract_vars = JSON.parse(res.data.data.extract_vars) // 执行后提取变量
}

let query_id = router.currentRoute.value.query.id
apiInfo.id = query_id ? Number(query_id) : 0
if (apiInfo.id > 0) {
  loadData(apiInfo.id)
  getModuleList()
}

// 4. 表单操作
// 表单验证规则 - 不同的页面，不同的校验规则
const rules = reactive<FormRules>({
  api_name: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  is_login: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  project_id: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  module_id: [
    { required: true, message: '必填项', trigger: 'blur' }
  ]
});
const onSubmit = async () => {
  console.log(ruleFormRef.value);

  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate((valid, fields) => {
    console.log(valid);
    if (!valid) {
      return;
    }
    // 有ID代表是修改，没有ID代表是新增
    let data = {
      id: apiInfo.id,
      project_id: apiInfo.project_id,
      module_id: apiInfo.module_id,
      api_name: apiInfo.api_name,
      is_login: apiInfo.is_login,
      cookie_name: apiInfo.cookie_name,
      request_method: apiInfo.request_method,
      request_url: apiInfo.request_url,
      request_params: JSON.stringify(apiInfo.request_params), //将json对象转换为json字符串，传给后端,
      request_headers: JSON.stringify(apiInfo.request_headers),
      debug_vars: JSON.stringify(apiInfo.debug_vars),
      request_form_datas: JSON.stringify(apiInfo.request_form_datas), // 请求中的 form-data
      request_www_form_datas: JSON.stringify(apiInfo.request_www_form_datas), // 请求中的 x-www-form-data
      requests_json_data: apiInfo.requests_json_data, // 请求中的 json 数据
      assert_vars: JSON.stringify(apiInfo.assert_vars), // 断言
      extract_vars: JSON.stringify(apiInfo.extract_vars), // 执行后提取变量
    }

    if (apiInfo.id > 0) {
      updateData(data).then((res: { data: { code: number; msg: string; }; }) => {
        if (res.data.code == 200) {
          router.push('/ApiInfoList') // 跳转回列表页面 - 不同的页面，不同的路径
        }
      })
    } else {
      insertData(data).then((res: { data: { code: number; msg: string } }) => {
        if (res.data.code == 200) {
          router.push('/ApiInfoList') // 跳转回列表页面 - 不同的页面，不同的路径
        }
      });
    }
  });


};

const onCancel = () => {
  router.push('/ApiInfoList')
};

// 5. 发起调试请求
import { doDebugRequest } from "./ApiInfo.js"
const debugArea = ref()
const tabActiveName = ref("URL参数");
const debugRequest = () => {
  // console.log("debugRequest!");
  // console.log(apiInfo);
  tabActiveName.value = "调试输出内容";
  doDebugRequest(apiInfo).then((res) => {
    console.log(res)
    debugArea.value = JSON.stringify(res)
  })
};
// 是否为登录接口
const isLoginList = [{
  logintype: "login",
  label: "登录接口"
},
{
  logintype: "other",
  label: "业务接口"
}]
// 6. requestParams 请求url参数
const requestParams = reactive({
  key: "",
  value: "",
});

const deleteParams = (index: number) => {
  apiInfo.request_params.splice(index, 1);
};

const onAddParams = () => {
  // 保存起来
  apiInfo.request_params.push({
    key: requestParams.key,
    value: requestParams.value,
  });
  // 置空
  requestParams.key = "";
  requestParams.value = "";
};

// requestHeaders 请求头信息
const requestHeaders = reactive({
  key: "",
  value: "",
});

const deleteHeaders = (index: number) => {
  apiInfo.request_headers.splice(index, 1);
};

const onAddHeaders = () => {
  // 保存起来
  apiInfo.request_headers.push({
    key: requestHeaders.key,
    value: requestHeaders.value,
  });
  // 置空
  requestHeaders.key = "";
  requestHeaders.value = "";
};

// assertVars 断言定义
const assertVars = reactive({
  value: "",
  target: "",
  type: "",
  errorMsg: ""
});
// 判断输入数据类型
const numput = (type) => {
  console.log(type);

  if (!typeValueList.includes(type)) {
    assertVars.target = assertVars.target.replace(/[^\d]/g, '')
  }
}
const deleteassertvars = (index: number) => {
  apiInfo.assert_vars.splice(index, 1);
};
const typeList = [
  { label: 'equals', value: 'equals' },
  { label: 'exists', value: 'exists' },
  { label: 'contains', value: 'contains' },
  { label: '等于', value: '等于' },
  { label: '大于', value: '大于' },
  { label: '小于', value: '小于' },
  { label: '大于等于', value: '大于等于' },
  { label: '小于等于', value: '小于等于' },
];
const typeValueList = ['equals', 'exists', 'contains']
const onAddassertvars = () => {
  // 保存起来
  apiInfo.assert_vars.push({
    target: assertVars.target,
    value: assertVars.value,
    type: assertVars.type,
    errorMsg: assertVars.errorMsg

  });
  // 置空
  assertVars.target = "";
  assertVars.value = "";
  assertVars.type = "";
  assertVars.errorMsg = "";
};

// extractVars 提取变量定义
const extractVars = reactive({
  target: "",
  varname: ""
});

const deleteExtract = (index: number) => {
  apiInfo.extract_vars.splice(index, 1);
};


const onAddextractvars = () => {
  // 保存起来
  apiInfo.extract_vars.push({
    target: extractVars.target,
    varname: extractVars.varname
  });
  // 置空
  extractVars.target = "";
  extractVars.varname = "";
};

// debugVars 变量定义
const debugVars = reactive({
  key: "",
  value: "",
});

const deleteVars = (index: number) => {
  apiInfo.debug_vars.splice(index, 1);
};

const onAddVars = () => {
  // 保存起来
  apiInfo.debug_vars.push({
    key: debugVars.key,
    value: debugVars.value,
  });
  // 置空
  debugVars.key = "";
  debugVars.value = "";
};

// requestBodyFormDatas 变量定义
const requestBodyFormDatas = reactive({
  key: "",
  value: "",
});

const deleteBodyFormDatas = (index: number) => {
  apiInfo.request_form_datas.splice(index, 1);
};

const onAddBodyFormDatas = () => {
  // 保存起来
  apiInfo.request_form_datas.push({
    key: requestBodyFormDatas.key,
    value: requestBodyFormDatas.value,
  });
  // 置空
  requestBodyFormDatas.key = "";
  requestBodyFormDatas.value = "";
};

// requestBodyWwwFormDatas 变量定义
const requestBodyWwwFormDatas = reactive({
  key: "",
  value: "",
});

const deleteBodyWwwFormDatas = (index: number) => {
  apiInfo.request_www_form_datas.splice(index, 1);
};

const onAddBodyWwwFormDatas = () => {
  // 保存起来
  apiInfo.request_www_form_datas.push({
    key: requestBodyWwwFormDatas.key,
    value: requestBodyWwwFormDatas.value,
  });
  // 置空
  requestBodyWwwFormDatas.key = "";
  requestBodyWwwFormDatas.value = "";
};

// // 代码段 - SQL处理
// const code_pre_sql = () => {
//     let code = `
//     result = sql_exec('mysql',{
//         'host': 'shop-xo.hctestedu.com',
//         'user': 'api_test',
//         'password': 'Aa9999!',
//         'db': 'shopxo_hctested'
//     },"SELECT * FROM \`sxo_user\` where username='{{accounts}}'")
//     # 加密后的用户名
//     context.update({'assert_userinfo': result[0]})`;
//     apiInfo.pre_request += code;
// };
// // 代码段 - json断言
// const code_jsonAssert = () => {
//     console.log("jsonAssert!");
//     let code = `\nassert step['response'].json()['你要判断的数据'] == '断言值', '断言提示语句`;
//     apiInfo.post_request += code;
// };
// // 代码段 - 响应状态码断言
// const code_statusCodeAssert = () => {
//     let code = "\nassert step['response'].status_code == '断言值', '断言提示语句";
//     apiInfo.post_request += code;
// };
// // 代码段 - 响应头断言
// const code_headerAssert = () => {
//     let code =
//         "\nassert step['response'].headers['你要判断的头名称'] == '断言值', '断言提示语句";
//     apiInfo.post_request += code;
// };
// // 代码段 - json数据提取
// const code_json_vars = () => {
//     console.log("jsonPath!");
//     let code = `\ncontext.update({'你要提取的变量名': step['response'].json()['你要提取的数据']})`;
//     apiInfo.post_request += code;
// };
</script>

<style>
/* .demo-form-inline .el-input {
    --el-input-width: 220px;
} */
</style>