<template>
    <el-container>
        <el-header>
            <f-header />
        </el-header>
        <el-container>
            <el-aside :width="$store.state.asideWidth">
                <f-menu />
            </el-aside>
            <el-main>
                <f-tag-list />
                <s-tatistics v-if="hShow"></s-tatistics>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import FHeader from './FHeader.vue';
import FMenu from './FMenu.vue';
import FTagList from './FTagList.vue'
import STatistics from '../statistics/statistics.vue'
import { ref, computed } from "vue";
import { useRoute, onBeforeRouteUpdate } from 'vue-router';

const route = useRoute()
const hShow = computed(() => {
    if (route.path == "/home") {
        return true
    } else {
        return false
    }
})


</script>
<style scoped>
.el-aside {
    transition: all 0.2s;
}
</style>