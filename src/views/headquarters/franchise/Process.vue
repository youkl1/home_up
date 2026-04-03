<template>
  <div class="process-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">招商流程配置</h1>
    </div>
    
    <!-- 流程配置卡片 -->
    <div class="process-config mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">招商流程配置</span>
            <el-button type="primary" size="small" @click="addStep">新增步骤</el-button>
          </div>
        </template>
        <div class="process-steps">
          <div class="process-flow">
            <div v-for="(step, index) in processSteps" :key="step.id" class="step-item" :class="{ 'active': step.active }">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <div class="step-header flex-between items-center">
                  <div class="step-info">
                    <h3 class="step-title">{{ step.name }}</h3>
                    <p class="step-desc">{{ step.description }}</p>
                  </div>
                  <div class="step-actions">
                    <el-button size="small" @click="editStep(step)">编辑</el-button>
                    <el-button size="small" type="danger" @click="confirmDeleteStep(step)">删除</el-button>
                  </div>
                </div>
                <div class="step-config mt-4">
                  <el-form :model="step" label-width="120px" size="small">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="步骤类型">
                          <el-select v-model="step.type" placeholder="选择步骤类型" class="w-full">
                            <el-option label="信息收集" value="info"></el-option>
                            <el-option label="审核" value="approval"></el-option>
                            <el-option label="线下活动" value="offline"></el-option>
                            <el-option label="签约" value="signing"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="负责人">
                          <el-select v-model="step.responsible" placeholder="选择负责人" class="w-full">
                            <el-option label="招商经理" value="manager"></el-option>
                            <el-option label="区域总监" value="director"></el-option>
                            <el-option label="总部审批" value="headquarters"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="预计时长">
                          <el-input v-model="step.duration" placeholder="例如：3天" class="w-full"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="审核规则">
                          <el-input v-model="step.approvalRules" type="textarea" placeholder="填写审核规则" class="w-full"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
              <div class="step-connector" v-if="index < processSteps.length - 1"></div>
            </div>
          </div>
        </div>
        <div class="config-actions mt-6 flex justify-end">
          <el-button size="small" class="mr-2" @click="resetProcess">重置</el-button>
          <el-button type="primary" size="small" @click="saveProcess">保存配置</el-button>
        </div>
      </el-card>
    </div>
    
    <!-- 流程模板 -->
    <div class="process-templates mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">流程模板</span>
          </div>
        </template>
        <div class="templates-grid">
          <div v-for="template in processTemplates" :key="template.id" class="template-card" @click="applyTemplate(template)">
            <div class="template-header">
              <h3 class="template-name">{{ template.name }}</h3>
              <span class="template-steps">{{ template.steps.length }} 步骤</span>
            </div>
            <div class="template-steps-list">
              <div v-for="(step, index) in template.steps" :key="index" class="template-step-item">
                <span class="step-number">{{ index + 1 }}</span>
                <span class="step-name">{{ step }}</span>
              </div>
            </div>
            <div class="template-footer">
              <el-button size="small" type="primary" @click.stop="applyTemplate(template)">应用模板</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 编辑步骤弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑步骤"
      width="600px"
    >
      <el-form :model="editForm" label-width="120px" :rules="editRules" ref="editFormRef">
        <el-form-item label="步骤名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入步骤名称"></el-input>
        </el-form-item>
        <el-form-item label="步骤描述" prop="description">
          <el-input v-model="editForm.description" type="textarea" :rows="2" placeholder="请输入步骤描述"></el-input>
        </el-form-item>
        <el-form-item label="步骤类型" prop="type">
          <el-select v-model="editForm.type" placeholder="选择步骤类型" class="w-full">
            <el-option label="信息收集" value="info"></el-option>
            <el-option label="审核" value="approval"></el-option>
            <el-option label="线下活动" value="offline"></el-option>
            <el-option label="签约" value="signing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="responsible">
          <el-select v-model="editForm.responsible" placeholder="选择负责人" class="w-full">
            <el-option label="招商经理" value="manager"></el-option>
            <el-option label="区域总监" value="director"></el-option>
            <el-option label="总部审批" value="headquarters"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计时长" prop="duration">
          <el-input v-model="editForm.duration" placeholder="例如：3天" class="w-full"></el-input>
        </el-form-item>
        <el-form-item label="审核规则" prop="approvalRules">
          <el-input v-model="editForm.approvalRules" type="textarea" :rows="3" placeholder="填写审核规则" class="w-full"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="editForm.active"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEditStep">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

// 招商流程步骤
const processSteps = ref([
  {
    id: 'step1',
    name: '加盟申请',
    description: '收集意向加盟商的基本信息',
    type: 'info',
    responsible: '招商经理',
    duration: '2天',
    approvalRules: '审核加盟商基本资质和意向区域',
    active: true
  },
  {
    id: 'step2',
    name: '资质审核',
    description: '审核加盟商的资质和资金实力',
    type: 'approval',
    responsible: '区域总监',
    duration: '3天',
    approvalRules: '审核加盟商的资金实力、行业经验、经营能力',
    active: true
  },
  {
    id: 'step3',
    name: '实地考察',
    description: '实地考察加盟商的经营场所和团队',
    type: 'offline',
    responsible: '招商经理',
    duration: '5天',
    approvalRules: '考察加盟商的经营场所、团队实力、当地市场情况',
    active: true
  },
  {
    id: 'step4',
    name: '合同签约',
    description: '签订加盟合同',
    type: 'signing',
    responsible: '总部审批',
    duration: '2天',
    approvalRules: '审核合同条款，确认所有细节',
    active: true
  },
  {
    id: 'step5',
    name: '门店选址',
    description: '协助加盟商选择合适的门店位置',
    type: 'offline',
    responsible: '招商经理',
    duration: '7天',
    approvalRules: '评估门店位置、人流量、租金等因素',
    active: true
  },
  {
    id: 'step6',
    name: '装修开业',
    description: '指导门店装修和开业筹备',
    type: 'offline',
    responsible: '招商经理',
    duration: '15天',
    approvalRules: '审核装修方案，指导开业筹备',
    active: true
  }
])

// 流程模板
const processTemplates = ref([
  {
    id: 'template1',
    name: '标准招商流程',
    steps: ['加盟申请', '资质审核', '实地考察', '合同签约', '门店选址', '装修开业']
  },
  {
    id: 'template2',
    name: '快速招商流程',
    steps: ['加盟申请', '资质审核', '合同签约', '门店选址', '装修开业']
  },
  {
    id: 'template3',
    name: '区域代理流程',
    steps: ['加盟申请', '资质审核', '实地考察', '合同签约', '区域规划', '门店选址', '装修开业']
  }
])

// 弹窗状态
const editDialogVisible = ref(false)

// 当前编辑的步骤
const currentStep = ref({})

// 编辑表单
const editForm = ref({
  name: '',
  description: '',
  type: '',
  responsible: '',
  duration: '',
  approvalRules: '',
  active: true
})

// 编辑表单验证规则
const editRules = {
  name: [
    { required: true, message: '请输入步骤名称', trigger: 'blur' },
    { min: 2, max: 50, message: '步骤名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入步骤描述', trigger: 'blur' },
    { min: 5, max: 200, message: '步骤描述长度在 5 到 200 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择步骤类型', trigger: 'change' }
  ],
  responsible: [
    { required: true, message: '请选择负责人', trigger: 'change' }
  ],
  duration: [
    { required: true, message: '请输入预计时长', trigger: 'blur' }
  ]
}

// 表单引用
const editFormRef = ref(null)

// 新增步骤
const addStep = () => {
  const newStep = {
    id: `step${processSteps.value.length + 1}`,
    name: '新步骤',
    description: '步骤描述',
    type: 'info',
    responsible: '招商经理',
    duration: '1天',
    approvalRules: '',
    active: true
  }
  processSteps.value.push(newStep)
  ElMessage.success('步骤添加成功')
}

// 编辑步骤
const editStep = (step) => {
  currentStep.value = step
  Object.assign(editForm.value, {
    name: step.name,
    description: step.description,
    type: step.type,
    responsible: step.responsible,
    duration: step.duration,
    approvalRules: step.approvalRules,
    active: step.active
  })
  editDialogVisible.value = true
}

// 保存编辑步骤
const saveEditStep = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    
    const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      // 更新步骤信息
      Object.assign(currentStep.value, {
        name: editForm.value.name,
        description: editForm.value.description,
        type: editForm.value.type,
        responsible: editForm.value.responsible,
        duration: editForm.value.duration,
        approvalRules: editForm.value.approvalRules,
        active: editForm.value.active
      })
      
      ElMessage.success('步骤编辑成功')
      loading.close()
      editDialogVisible.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 确认删除步骤
const confirmDeleteStep = (step) => {
  ElMessageBox.confirm(
    `确定要删除步骤「${step.name}」吗？`,
    '删除步骤',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    deleteStep(step.id)
  }).catch(() => {
    // 取消删除
  })
}

// 删除步骤
const deleteStep = (id) => {
  processSteps.value = processSteps.value.filter(step => step.id !== id)
  ElMessage.success('步骤删除成功')
}

// 重置流程
const resetProcess = () => {
  ElMessageBox.confirm(
    '确定要重置流程为默认配置吗？',
    '重置流程',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 重置为默认流程
    processSteps.value = [
      {
        id: 'step1',
        name: '加盟申请',
        description: '收集意向加盟商的基本信息',
        type: 'info',
        responsible: '招商经理',
        duration: '2天',
        approvalRules: '审核加盟商基本资质和意向区域',
        active: true
      },
      {
        id: 'step2',
        name: '资质审核',
        description: '审核加盟商的资质和资金实力',
        type: 'approval',
        responsible: '区域总监',
        duration: '3天',
        approvalRules: '审核加盟商的资金实力、行业经验、经营能力',
        active: true
      },
      {
        id: 'step3',
        name: '实地考察',
        description: '实地考察加盟商的经营场所和团队',
        type: 'offline',
        responsible: '招商经理',
        duration: '5天',
        approvalRules: '考察加盟商的经营场所、团队实力、当地市场情况',
        active: true
      },
      {
        id: 'step4',
        name: '合同签约',
        description: '签订加盟合同',
        type: 'signing',
        responsible: '总部审批',
        duration: '2天',
        approvalRules: '审核合同条款，确认所有细节',
        active: true
      },
      {
        id: 'step5',
        name: '门店选址',
        description: '协助加盟商选择合适的门店位置',
        type: 'offline',
        responsible: '招商经理',
        duration: '7天',
        approvalRules: '评估门店位置、人流量、租金等因素',
        active: true
      },
      {
        id: 'step6',
        name: '装修开业',
        description: '指导门店装修和开业筹备',
        type: 'offline',
        responsible: '招商经理',
        duration: '15天',
        approvalRules: '审核装修方案，指导开业筹备',
        active: true
      }
    ]
    ElMessage.success('流程重置成功')
  }).catch(() => {
    // 取消重置
  })
}

// 保存配置
const saveProcess = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '保存中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  // 模拟API调用
  setTimeout(() => {
    ElMessage.success('流程配置保存成功')
    loading.close()
  }, 1000)
}

// 应用模板
const applyTemplate = (template) => {
  ElMessageBox.confirm(
    `确定要应用「${template.name}」模板吗？当前流程将被覆盖。`,
    '应用模板',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    // 应用模板
    const newSteps = template.steps.map((stepName, index) => {
      return {
        id: `step${index + 1}`,
        name: stepName,
        description: getStepDescription(stepName),
        type: getStepType(stepName),
        responsible: getStepResponsible(stepName),
        duration: getStepDuration(stepName),
        approvalRules: getStepApprovalRules(stepName),
        active: true
      }
    })
    
    processSteps.value = newSteps
    ElMessage.success('模板应用成功')
  }).catch(() => {
    // 取消应用
  })
}

// 获取步骤描述
const getStepDescription = (stepName) => {
  const descriptions = {
    '加盟申请': '收集意向加盟商的基本信息',
    '资质审核': '审核加盟商的资质和资金实力',
    '实地考察': '实地考察加盟商的经营场所和团队',
    '合同签约': '签订加盟合同',
    '门店选址': '协助加盟商选择合适的门店位置',
    '装修开业': '指导门店装修和开业筹备',
    '区域规划': '制定区域代理的发展规划'
  }
  return descriptions[stepName] || '步骤描述'
}

// 获取步骤类型
const getStepType = (stepName) => {
  const types = {
    '加盟申请': 'info',
    '资质审核': 'approval',
    '实地考察': 'offline',
    '合同签约': 'signing',
    '门店选址': 'offline',
    '装修开业': 'offline',
    '区域规划': 'offline'
  }
  return types[stepName] || 'info'
}

// 获取步骤负责人
const getStepResponsible = (stepName) => {
  const responsibles = {
    '加盟申请': '招商经理',
    '资质审核': '区域总监',
    '实地考察': '招商经理',
    '合同签约': '总部审批',
    '门店选址': '招商经理',
    '装修开业': '招商经理',
    '区域规划': '区域总监'
  }
  return responsibles[stepName] || '招商经理'
}

// 获取步骤时长
const getStepDuration = (stepName) => {
  const durations = {
    '加盟申请': '2天',
    '资质审核': '3天',
    '实地考察': '5天',
    '合同签约': '2天',
    '门店选址': '7天',
    '装修开业': '15天',
    '区域规划': '5天'
  }
  return durations[stepName] || '3天'
}

// 获取步骤审核规则
const getStepApprovalRules = (stepName) => {
  const rules = {
    '加盟申请': '审核加盟商基本资质和意向区域',
    '资质审核': '审核加盟商的资金实力、行业经验、经营能力',
    '实地考察': '考察加盟商的经营场所、团队实力、当地市场情况',
    '合同签约': '审核合同条款，确认所有细节',
    '门店选址': '评估门店位置、人流量、租金等因素',
    '装修开业': '审核装修方案，指导开业筹备',
    '区域规划': '制定区域代理的发展规划和目标'
  }
  return rules[stepName] || '审核规则'
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.process-page {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.process-config {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.process-steps {
  margin: var(--spacing-md) 0;
}

.process-flow {
  position: relative;
  padding-left: 40px;
}

.step-item {
  position: relative;
  margin-bottom: var(--spacing-lg);
  background: var(--bg-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  transition: all var(--transition-normal);
}

.step-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
}

.step-item.active {
  border-left: 4px solid var(--primary-color);
}

.step-number {
  position: absolute;
  left: -60px;
  top: 20px;
  width: 32px;
  height: 32px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: var(--font-size-sm);
}

.step-content {
  margin-left: 10px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.step-title {
  font-size: var(--font-size-lg);
  font-weight: bold;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-title);
}

.step-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.step-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.step-config {
  margin-top: var(--spacing-md);
}

.step-connector {
  position: absolute;
  left: -44px;
  top: 46px;
  bottom: -40px;
  width: 2px;
  background: var(--border-color);
}

.config-actions {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: flex-end;
}

.process-templates {
  margin-bottom: var(--spacing-md);
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.template-card {
  background: var(--bg-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--border-color);
}

.template-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.template-name {
  font-size: var(--font-size-lg);
  font-weight: bold;
  margin: 0;
  color: var(--text-title);
}

.template-steps {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background: var(--bg-color);
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
}

.template-steps-list {
  margin: var(--spacing-md) 0;
  padding-left: var(--spacing-sm);
}

.template-step-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
}

.template-step-item .step-number {
  position: relative;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  font-size: 12px;
  margin-right: var(--spacing-xs);
}

.template-footer {
  margin-top: var(--spacing-md);
  text-align: center;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .process-page {
    padding: var(--spacing-sm);
  }
  
  .process-flow {
    padding-left: 30px;
  }
  
  .step-number {
    left: -50px;
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  
  .step-connector {
    left: -36px;
  }
  
  .step-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .step-actions {
    align-self: flex-end;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .config-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>