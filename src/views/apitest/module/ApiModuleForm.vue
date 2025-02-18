<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
    status-icon>
    <!-- 不同的页面，不同的表单字段 -->
    <!-- <el-form-item label="模块编号" prop="id">
      <el-input v-model="ruleForm.id" disabled />
    </el-form-item> -->
    <el-form-item label="所属项目ID" prop="project_id">
    <el-select v-model="ruleForm.project_id" placeholder="所属项目ID" >
      <el-option v-for="project in projectList" :key="project.id" :label="project.project_name" :value="project.id"/>     
    </el-select>
  </el-form-item>
    <!-- <el-form-item label="所属项目ID" prop="project_id">
      <el-input v-model="ruleForm.project_id" />
    </el-form-item> -->
    <el-form-item label="模块名称" prop="module_name">
      <el-input v-model="ruleForm.module_name" />
    </el-form-item>
    <el-form-item label="模块介绍" prop="module_desc">
      <el-input v-model="ruleForm.module_desc" />
    </el-form-item>
    <!-- END 表单字段 -->
    <!-- 表单操作 -->
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        提交
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">清空</el-button>
      <el-button @click="closeForm()">关闭</el-button>
    </el-form-item>
    <!-- END 表单操作 -->
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { queryById, insertData, updateData } from './ApiModule.js'; // 不同页面不同的接口
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from "vue-router";
const router = useRouter();

// 表单实例
const ruleFormRef = ref<FormInstance>();
// 表单数据 - 不同的页面，不同的表单字段
const ruleForm = reactive({
  id: 0,
  project_id: null,
  module_name: '',
  module_desc: ''
});


// 表单验证规则 - 不同的页面，不同的校验规则
const rules = reactive<any>({
  project_id: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  module_name: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  module_desc: [
    { required: true, message: '必填项', trigger: 'blur' }
  ]
});
// 提交表单
const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate((valid, fields) => {
    if (!valid) {
      return
    }
    // 有ID 代表是修改， 没ID 代表是新增
    if (ruleForm.id > 0) {
      updateData(ruleForm).then((res: { data: { code: number; msg: string; }; }) => {
        if (res.data.code == 200) {
          router.push('/ApiModuleList') // 跳转回列表页面 - 不同的页面，不同的路径
        }
      })
    } else {
      insertData(ruleForm).then((res: { data: { code: number; msg: string; }; }) => {
        if (res.data.code == 200) {
          router.push('/ApiModuleList') // 跳转回列表页面 - 不同的页面，不同的路径
        }
      })
    }
  })
}
// 重置表单
const resetForm = (form: FormInstance | undefined) => {
  if (!form) return;
  form.resetFields()
}
// 关闭表单 - 回到数据列表页 - 不同的页面，不同的路径
const closeForm = () => {
  router.push('/ApiModuleList')
}
// 加载表单数据
const loadData = async (id: number) => {
  const res = await queryById(id)
  // 不同的页面，不同的表单字段 (注意这里的res.data.data.xxx，xxx是接口返回的字段，不同的接口，字段不同)
  ruleForm.id = res.data.data.id
  ruleForm.project_id = res.data.data.project_id
  ruleForm.module_name = res.data.data.module_name
  ruleForm.module_desc = res.data.data.module_desc
}

// 如果有id参数，说明是编辑，需要获取数据
console.log(router)
let query_id = router.currentRoute.value.query.id
ruleForm.id = query_id ? Number(query_id) : 0
if (ruleForm.id > 0) {
  loadData(ruleForm.id)
}

// 其他逻辑

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
</script>

