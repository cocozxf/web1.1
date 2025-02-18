<template>
  <div class="f-menu" :style="{ width: $store.state.asideWidth }">
    <!--01 添加事件监听 @select="handleSelect-->
    <el-menu
      unique-opened
      :collapse="isCollapse"
      :default-active="route.fullPath"
      class="border-0"
      @select="handleSelect"
      :collapse-transition="false"
    >
      <template v-for="(item, index) in asideMenus" :key="index">
        <el-sub-menu
          v-if="item.child && item.child.length > 0"
          :index="item.name"
        >
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="(item2, index2) in item.child"
            :key="index2"
            :index="item2.frontpath"
          >
            <el-icon>
              <component :is="item2.icon"></component>
            </el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.frontpath">
          <component :is="item.icon"></component>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
//03 为了跳转，要引入useRouter
// 收起折叠功能
import { computed } from "vue";
import { useRouter,useRoute } from "vue-router";
import { useStore } from "vuex";
// import store from '../../store';
const router = useRouter();
const route = useRoute();
const store = useStore();

//是否折叠
const isCollapse = computed(() => !(store.state.asideWidth == "250px"));

//02 添加事件
const handleSelect = (e) => {
  //可以看看这里点击后事什么?
  console.log(e);
  router.push(e);
};
const asideMenus = [
  {
    name: "系统管理",
    icon: "User",
    child: [
      {
        name: "用户管理",
        icon: "User",
        frontpath: "/userList",
      },
    ],
  },
  {
    name: "接口自动化",
    icon: "Menu",
    child: [
      {
        name: "项目管理",
        frontpath: "/ApiProjectList",
      },
      {
        name: "模块管理",
        frontpath: "/ApiModuleList",
      },
      {
        name: "接口信息维护",
        frontpath: "/ApiInfoList",
      },
      {
        name: "接口测试用例列表",
        frontpath: "/apicollectionList",
      },
      {
        name: "接口测试任务列表",
        frontpath: "/apisuiteList",
      },
      {
        name: "接口测试任务执行记录",
        frontpath: "/ApiSuiteHistory",
      }
    ],
  },
];
</script>

<!--01 bottom 表示到底部的距离，其他同理，shadow表示阴影 ，fixed表示滚动时自己不动 overflow: auto;长度问题可以自动滚动-->
<style>
.f-menu {
  transition: all 0.2s;
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  @apply shadow-md fixed bg-light-50;
}
</style>

