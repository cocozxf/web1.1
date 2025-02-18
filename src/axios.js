import axios from "axios"
import { ref, reactive } from "vue";
import { ElLoading, ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import {
    useCookies
} from '@vueuse/integrations/useCookies';
const cookies = useCookies()

const service = axios.create({
    baseURL: "/api"
})
const nums = ref(0)
const loading = ref(null)

function open() {
    if (nums.value == 0) {
        loading.value = ElLoading.service({
            lock: true,
            text: '加载中',
            background: 'rgba(0, 0, 0, 0.05)',
        })
    }
    nums.value++ // 记录数值加一
}

function close() {
    if (nums.value <= 0) return

    nums.value = Math.max(0, nums.value - 1)

    if (nums.value === 0 && loading.value) {
        loading.value.close()
        loading.value = null
    }
}


// 添加请求拦截器
service.interceptors.request.use(config => {
    open()
    return config
}, error => {
    close()
    ElMessage.error('网络异常，请稍后再试')
    return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(response => {
    close()

    if (response.data.code == 401) {

        cookies.remove("l-token")

    }
    else if (response.data.code != 200) {
        ElNotification({
            message: response.data.msg,
            type: 'error',
            duration: 1000
        })
    } else {
        if (response.data.msg != null) {
            ElNotification({
                title: response.data.msg,
                type: 'success',
                duration: 1000
            })
        }

    }
    return response
}, error => {
    close()
    ElMessage.error('网络异常，请稍后再试')
    return Promise.reject(error)
})

export default service