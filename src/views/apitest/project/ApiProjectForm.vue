<template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
      <!-- <el-form-item label="项目编号" prop="id">
        <el-input v-model="ruleForm.id" disabled />
      </el-form-item> -->
      <el-form-item label="项目名称" prop="project_name">
        <el-input v-model="ruleForm.project_name" />
      </el-form-item>
      <el-form-item label="项目描述" prop="project_desc">
        <el-input v-model="ruleForm.project_desc" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
        <el-button @click="resetForm(ruleFormRef)">清空</el-button>
        <el-button @click="closeForm()">关闭</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from "vue";
  import { queryById, insertData, updateData } from './ApiProject.js'; // 不同页面不同的接口
  import type { FormInstance, FormRules } from 'element-plus';
  import { useRouter ,useRoute} from "vue-router";
  
  const router = useRouter();
  const route = useRoute()
  // 表单实例
  const ruleFormRef = ref<FormInstance>();
  
  // 表单数据
  const ruleForm = reactive({
    id: 0,
    project_name: '',
    project_desc: ''
  });
  
  // 表单验证规则
  const rules = reactive<FormRules>({
    project_name: [
      { required: true, message: '必填项', trigger: 'blur' }
    ],
    project_desc: [
      { required: true, message: '必填项', trigger: 'blur' }
    ]
  });
  
  // 提交表单
  const submitForm = async (form: FormInstance | undefined) => {
    if (!form) return;
    await form.validate((valid, fields) => {
      if (!valid) {
        return;
      }
      // 有ID代表是修改，没有ID代表是新增
      if (ruleForm.id > 0) {
        updateData(ruleForm).then((res: { data: { code: number; msg: string; }; }) => {
          if (res.data.code == 200) {
            router.push('/ApiProjectList'); // 跳转回列表页面
          }
        });
      } else {
        insertData(ruleForm).then((res: { data: { code: number; msg: string; }; }) => {
          console.log(res)
          if (res.data.code == 200) {
            router.push('/ApiProjectList'); // 跳转回列表页面
          }
          console.log("1111")
        });
      }
    });
  };
  
  // 重置表单
  const resetForm = (form: FormInstance | undefined) => {
    if (!form) return;
    form.resetFields();
  };
  
  // 关闭表单 - 回到数据列表页
  const closeForm = () => {
    router.push('/ApiProjectList');
  };
  
  // 加载表单数据
  const loadData = async (id: number) => {
    const res = await queryById(id);
    ruleForm.id = res.data.data.id;
    ruleForm.project_name = res.data.data.project_name;
    ruleForm.project_desc = res.data.data.project_desc;
  };
  
  // 如果有id参数，说明是编辑，需要获取数据
  // let query_id = router.currentRoute.value.query.id;
  let query_id = route.query.id;
  console.log(query_id);
  
  ruleForm.id = query_id ? Number(query_id) : 0;
  if (ruleForm.id > 0) {
    loadData(ruleForm.id);
  }
  </script>
  