import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import {
    useCookies
} from '@vueuse/integrations/useCookies';
// import Test from '~/views/test.vue'
// import Test01 from '~/views/test01.vue'
import NotFound from '~/views/404.vue'
import Login from '~/views/login/login.vue'
import Home from '~/views/home/home.vue'
import ExcuteDetail from '~/views/apitest/apisuite/ExcuteDetail.vue'
import ApiSuiteHistory from '~/views/apitest/apisuite/ApiSuiteHistory.vue'
import userList from '~/views/users/userList.vue'
import userForm from '~/views/users/userForm.vue'
import ApiProjectList from '~/views/apitest/project/ApiProjectList.vue'
import ApiProjectForm from '~/views/apitest/project/ApiProjectForm.vue'
import ApiModuleList from '~/views/apitest/module/ApiModuleList.vue'
import ApiModuleForm from '~/views/apitest/module/ApiModuleForm.vue'
import ApiInfoList from '~/views/apitest/apiinfo/ApiInfoList.vue'
import ApiInfoForm from '~/views/apitest/apiinfo/ApiInfoForm.vue'
import ApiCollectionList from '~/views/apitest/collection/ApiCollectionList.vue'
import ApiCollectionForm from '~/views/apitest/collection/ApiCollectionForm.vue'
import ApiSuiteList from '~/views/apitest/apisuite/ApiSuiteList.vue'
import ApiSuiteForm from '~/views/apitest/apisuite/ApiSuiteForm.vue'

import {
    ElNotification
} from 'element-plus'

const cookies = useCookies()
const routes = [{
    path: '/',
    redirect: '/login'
}, {
    path: "/login",
    component: Login
}, {
    path: "/home",
    component: Home,
    //子路由概念，后续所有的子页面都要放在这里
    children: [{
        path: "/userList",
        component: userList,
        meta: {
            title: "用户管理"
        }
    }, {
        path: "/userForm",
        component: userForm,
        meta: {
            title: "用户表单"
        }
    }, {
        path: "/ApiProjectList",
        component: ApiProjectList,
        meta: {
            title: "项目列表"
        }
    }, {
        path: "/ApiProjectForm",
        component: ApiProjectForm,
        meta: {
            title: "项目操作"
        }
    }, {
        path: "/ApiModuleList",
        component: ApiModuleList,
        meta: {
            title: "模块列表"
        }
    }, {
        path: "/ApiModuleForm",
        component: ApiModuleForm,
        meta: {
            title: "模块操作"
        }
    }, {
        path: "/ApiInfoList",
        component: ApiInfoList,
        meta: {
            title: "接口信息维护列表"
        }
    }, {
        path: "/ApiInfoForm",
        component: ApiInfoForm,
        meta: {
            title: "接口信息编辑"
        }
    }, {
        path: "/ApiCollectionList",
        component: ApiCollectionList,
        meta: {
            title: "测试用例列表"
        }
    }, {
        path: "/ApiCollectionForm",
        component: ApiCollectionForm,
        meta: {
            title: "测试用例操作"
        }
    }, {
        path: "/apisuiteList",
        component: ApiSuiteList,
        meta: {
            title: "测试任务列表"
        }
    }, {
        path: "/ApiSuiteForm",
        component: ApiSuiteForm,
        meta: {
            title: "测试套件操作"
        }
    }, {
        path: "/ApiSuiteHistory",
        component: ApiSuiteHistory,
        meta: {
            title: "任务执行记录"
        }
    }, {
        path: "/excuteDetail/:suiteId/:createTime",
        component: ExcuteDetail,
        name: "ExcuteDetail",
        meta: {
            title: "任务测试详情"
        }
    }]
},
// 最后匹配不到的 都返回 404 !!!
{
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
}
]

/** */
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//导航判断逻辑
router.beforeEach((to, from, next) => {
    const token = cookies.get("l-token");
    if (to.path === '/login') {
        // 如果要前往登录页面，无需检查 token，直接跳转
        next();
    } else {
        // 如果不是前往登录页面，检查 token 是否存在
        if (token) {
            // 如果 token 存在，允许继续导航
            next();
        } else {
            cookies.remove('tabList')
            ElNotification({
                title: '登录',
                message: '登录状态失效，重新登录',
                type: 'error',
                duration: 2000
            })
            // 如果 token 不存在，重定向到登录页面
            next('/login');
        }
    }
})

export default router