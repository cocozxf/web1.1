<template>
    <div>
    </div>
    <div v-for="(node, i) in casestepForm.stepList" :key="i">
        <div v-if="node.editstepType === '1'">
            <span> 步骤{{ node.number }} </span>
            <el-form-item label="步骤名称" :prop="'stepList.' + i + '.stepName'" :rules="[
        { required: true, message: '请输入步骤名称', trigger: 'blur' },
    ]">
                <el-input v-model="node.stepName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="步骤描述" :prop="'stepList.' + i + '.stepDescription'">
                <el-input type="textarea" v-model="node.stepDescription" placeholder="请输入"></el-input>
            </el-form-item>
            <el-button type="primary" class="add-btn" @click="assertAddClick(i)">添加断言+</el-button>
            <div v-for="(item, j) in node.assertoptionsList" :key="j">
                <div v-if="item.editassertType === '1'">
                    <span >断言{{ item.number }}</span>
                    <el-form-item :prop="'stepList.' + i + '.assertoptionsList.' + j + '.value'">
                        <div>
                            <el-input v-model="item.value" placeholder="请输入实际结果"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item :prop="'stepList.' + i + '.assertoptionsList.' + j + '.type'">
                        <div>
                            <el-select v-model="item.type" placeholder="请选择判定类型">
                                <el-option v-for="(el, index) in typeList" :key="index" :label="el.label"
                                    :value="el.value"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item :prop="'stepList.' + i + '.assertoptionsList.' + j + '.target'">
                        <div>
                            <el-input v-model="item.target" :type="item.type >= 2 ? 'number' : 'text'"
                                placeholder="请输入预期结果"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item :prop="'stepList.' + i + '.assertoptionsList.' + j + '.errorMsg'">
                        <div>
                            <el-input v-model="item.errorMsg" placeholder="请输入错误提示信息"></el-input>
                        </div>
                    </el-form-item>
                    <el-button type="primary" class="remove-btn" @click="assertRemoveClick(item, i)">删除断言-</el-button>
                </div>
            </div>
            <el-button type="primary" class="remove-link" @click="stepRemoveClick(node, i)">删除步骤-</el-button>
        </div>
    </div>
    <div>
        <el-button type="primary" class="add-link" @click="stepAddClick">添加步骤+</el-button>
    </div>
    <!-- <div v-for="(ddtnode, i) in casestepForm.ddtList" :key="i">
        <span> 参数化{{ Number(i + 1) }} </span>
        <div>
            <el-form-item label="参数名称" :prop="'ddtList.' + i + '.ddtName'" :rules="[
                { required: true, message: '请输入参数名称', trigger: 'blur' },
            ]">
                <el-input v-model="ddtnode.ddtName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="参数描述" :prop="'ddtList.' + i + '.ddtDescription'">
                <el-input type="textarea" v-model="node.stepDescription" placeholder="请输入"></el-input>
            </el-form-item>
            <div>
                <el-form-item v-for="(item, j) in node.assertoptionsList" :label="'断言' + Number(j + 1)" :key="j"
                    :prop="'stepList.' + i + '.assertoptionsList.' + j + '.assertName'">
                    <el-button type="primary" class="add-btn" @click="assertAddClick(i)">+</el-button>
                    <el-button type="primary" class="remove-btn" @click="assertRemoveClick(item, i)">-</el-button>
                </el-form-item>
            </div>
            <el-button v-if="btnShow" type="primary" class="remove-link" @click="stepRemoveClick(node, i)">-</el-button>
        </div>
    </div>
    <div>
        <el-button type="primary" class="add-link" @click="stepAddClick()">+</el-button>
    </div> -->
    <div>
        <el-button type="primary" @click="onsubmit"> 确认 </el-button>
    </div>
</template>

<script setup>
import { ref, reactive, toRef, computed } from "vue";
// const assertoptionsList = reactive([{ assertName: '' }])
const typeList = [
    { label: 'equals', value: 0 },
    { label: 'exists', value: 1 },
    { label: '等于', value: 2 },
    { label: '大于', value: 3 },
    { label: '小于', value: 4 },
    { label: '大于等于', value: 5 },
    { label: '小于等于', value: 6 },
];


//统计有效展示的步骤数
const countstep = ref(1)
const countassert = ref(1)
const casestepForm = reactive(
    {
        caseName: '',
        caseNumber: '',
        caseDescription: '',
        editType: '1',
        stepList: [{
            stepName: '',
            stepDescription: '',
            editstepType: '1',
            assertoptionsList: [
                {
                    target: '',
                    type: null,
                    value: '',
                    errorMsg: '',
                    editassertType: '1',
                }
            ]
        }],
        ddtList: [
            {
                ddtname: '',
                ddtDescription: '',
                ddtoptionsList: [{ ddtkey: '', ddtvalue: '' }]
            }
        ],
        casebody: [
            {
                bodykey: '',
                bodyvalue: ''
            }
        ]

    }
)



// 点击步骤+按钮
const stepAddClick = () => {
    let obj = {
        stepName: '',
        stepDescription: '',
        editstepType: '1',
        assertoptionsList: [
            {
                target: '',
                type: null,
                value: '',
                errorMsg: '',
                editassertType: '1',
            }
        ]
    }
    casestepForm.stepList.push(obj);
    countstep.value += 1
}
// 点击步骤-按钮
const stepRemoveClick = (node, i) => {
    if (casestepForm.stepList.length == 1) {
        return
    }
    let index = casestepForm.stepList.indexOf(node)
    if (index !== -1) {
        casestepForm.stepList[i].editstepType = '0'
        casestepForm.stepList[0].editstepType = '1'
        countstep.value -= 1
    }

};


// 点击断言+按钮
const assertAddClick = (i) => {
    casestepForm.stepList[i].assertoptionsList.push({
        target: '',
        type: null,
        value: '',
        errorMsg: '',
        editassertType: '1'
    });
    countassert.value++
}
//点击断言-按钮
const assertRemoveClick = (item, i) => {
    if (casestepForm.stepList[i].assertoptionsList.length == 1) {
        return
    } else {
        let index = casestepForm.stepList[i].assertoptionsList.indexOf(item)
        if (index !== -1) {
            casestepForm.stepList[i].assertoptionsList[index].editassertType = '0'
            casestepForm.stepList[i].assertoptionsList[0].editassertType = '1'
            countassert.value--
        }
    }
}


const onsubmit = () => {
    console.log(casestepForm);
};
</script>