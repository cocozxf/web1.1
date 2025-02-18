<template>
  <div class="window" v-for="(item, index) in casefromList" :key="item">
    <span
      >步骤{{ index + 1
      }}<el-button @click="deleteSetup(index)">删除</el-button></span
    >
    <el-form ref="formRef" class="w-350px]" label-width="100px">
      <el-form-item label="步骤1" class="label-wrap">
        <el-input class="w-100 m-2" v-model="stepform[item.model1].username">
        </el-input>
      </el-form-item>
      <el-form-item label="步骤2" class="label-wrap">
        <el-input class="w-100 m-2" v-model="stepform[item.model1].username2">
        </el-input>
      </el-form-item>
      <el-form-item label="后置提取" class="label-wrap">
        <el-input class="w-100 m-2" v-model="stepform[item.model1].username2">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
  <div>
    <el-button @click="addSteup">添加</el-button>
    <el-button type="primary" @click="onsubmit"> 确认 </el-button>
  </div>
</template>

<script setup>
import { ref, reactive, toRef } from "vue";
const casefromList = reactive([
  {
    model1: "setup1",
  },
]);

const stepform = reactive({
  setup1: {
    username: "",
    username2: "",
  },
});
const addSteup = () => {
  stepform[`setup${casefromList.length + 1}`] = {
    username: "",
    username2: "",
  };
  casefromList.push({
    model1: `setup${casefromList.length + 1}`,
  });
  console.log(casefromList, stepform);
};
const deleteSetup = (index) => {
  if (index === 0) {
    console.log("不能删除第一个步骤");
    return;
  }
  casefromList.splice(index, 1);
  console.log(casefromList, stepform);
  stepform = toRef(delete stepform[`setup${index + 1}`]).value;
};

const onsubmit = () => {
  console.log(casefromList, stepform);
  const keys = Object.keys(stepform);
  const params = {};
  keys.forEach((el) => {
    params[el] = stepform[el];
  });
};
</script>