<template>
  <div class="policies-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">扶持政策管理</h1>
    </div>
    
    <!-- 政策列表 -->
    <div class="policies-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">扶持政策列表</span>
            <el-button type="primary" size="small" @click="addPolicy">新增政策</el-button>
          </div>
        </template>
        <el-table :data="policiesList" style="width: 100%" class="policies-table">
          <el-table-column prop="id" label="政策编号" width="150"></el-table-column>
          <el-table-column prop="name" label="政策名称"></el-table-column>
          <el-table-column prop="type" label="政策类型" width="120">
            <template #default="scope">
              <el-tag>{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="scope" label="适用范围" width="150"></el-table-column>
          <el-table-column prop="effectiveDate" label="生效日期" width="150"></el-table-column>
          <el-table-column prop="expiryDate" label="到期日期" width="150"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="editPolicy(scope.row)">编辑</el-button>
              <el-button size="small" :type="scope.row.status === '生效中' ? 'danger' : 'success'" @click="toggleStatus(scope.row)">
                {{ scope.row.status === '生效中' ? '停用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-4 flex justify-center">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="10"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
    
    <!-- 政策申请记录 -->
    <div class="policy-applications mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">政策申请记录</span>
          </div>
        </template>
        <el-table :data="applicationsList" style="width: 100%" class="applications-table">
          <el-table-column prop="id" label="申请编号" width="150"></el-table-column>
          <el-table-column prop="policyName" label="政策名称"></el-table-column>
          <el-table-column prop="franchiseeName" label="加盟商" width="180"></el-table-column>
          <el-table-column prop="applyDate" label="申请日期" width="150"></el-table-column>
          <el-table-column prop="amount" label="申请金额" width="120">
            <template #default="scope">
              <span class="font-semibold">{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewApplication(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-4 flex justify-center">
          <el-pagination
            layout="prev, pager, next"
            :total="applicationsTotal"
            :page-size="10"
            @current-change="handleApplicationsCurrentChange"
          />
        </div>
      </el-card>
    </div>
    
    <!-- 新增/编辑政策弹窗 -->
    <el-dialog
      v-model="policyDialogVisible"
      :title="isEditPolicy ? '编辑政策' : '新增政策'"
      width="600px"
    >
      <el-form :model="policyForm" label-width="120px" :rules="policyRules" ref="policyFormRef">
        <el-form-item label="政策名称" prop="name">
          <el-input v-model="policyForm.name" placeholder="请输入政策名称"></el-input>
        </el-form-item>
        <el-form-item label="政策类型" prop="type">
          <el-select v-model="policyForm.type" placeholder="选择政策类型" class="w-full">
            <el-option label="装修补贴" value="装修补贴"></el-option>
            <el-option label="招商奖励" value="招商奖励"></el-option>
            <el-option label="升级补贴" value="升级补贴"></el-option>
            <el-option label="销售奖励" value="销售奖励"></el-option>
            <el-option label="广告支持" value="广告支持"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用范围" prop="scope">
          <el-select v-model="policyForm.scope" placeholder="选择适用范围" class="w-full">
            <el-option label="全国" value="全国"></el-option>
            <el-option label="华北区" value="华北区"></el-option>
            <el-option label="华东区" value="华东区"></el-option>
            <el-option label="华南区" value="华南区"></el-option>
            <el-option label="西南区" value="西南区"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker v-model="policyForm.effectiveDate" type="date" placeholder="选择生效日期" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期" prop="expiryDate">
          <el-date-picker v-model="policyForm.expiryDate" type="date" placeholder="选择到期日期" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="政策内容" prop="content">
          <el-input v-model="policyForm.content" type="textarea" :rows="4" placeholder="请输入政策内容"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="policyForm.status" active-value="生效中" inactive-value="已停用"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="policyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePolicy">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 政策详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="政策详情"
      width="800px"
    >
      <div class="policy-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form :model="currentPolicy" label-width="100px">
              <el-form-item label="政策编号">
                <span>{{ currentPolicy.id }}</span>
              </el-form-item>
              <el-form-item label="政策名称">
                <span>{{ currentPolicy.name }}</span>
              </el-form-item>
              <el-form-item label="政策类型">
                <el-tag>{{ currentPolicy.type }}</el-tag>
              </el-form-item>
              <el-form-item label="适用范围">
                <span>{{ currentPolicy.scope }}</span>
              </el-form-item>
              <el-form-item label="生效日期">
                <span>{{ currentPolicy.effectiveDate }}</span>
              </el-form-item>
              <el-form-item label="到期日期">
                <span>{{ currentPolicy.expiryDate }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <el-tag :type="getStatusType(currentPolicy.status)">{{ currentPolicy.status }}</el-tag>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>政策内容</span>
                </div>
              </template>
              <div class="policy-content">
                {{ currentPolicy.content || '暂无政策内容' }}
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 申请详情弹窗 -->
    <el-dialog
      v-model="applicationDialogVisible"
      title="申请详情"
      width="600px"
    >
      <div class="application-detail">
        <el-form :model="currentApplication" label-width="120px">
          <el-form-item label="申请编号">
            <span>{{ currentApplication.id }}</span>
          </el-form-item>
          <el-form-item label="政策名称">
            <span>{{ currentApplication.policyName }}</span>
          </el-form-item>
          <el-form-item label="加盟商">
            <span>{{ currentApplication.franchiseeName }}</span>
          </el-form-item>
          <el-form-item label="申请日期">
            <span>{{ currentApplication.applyDate }}</span>
          </el-form-item>
          <el-form-item label="申请金额">
            <span class="font-semibold">{{ currentApplication.amount }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <el-tag :type="getStatusType(currentApplication.status)">{{ currentApplication.status }}</el-tag>
          </el-form-item>
          <el-form-item label="申请原因">
            <div class="application-reason">
              {{ currentApplication.reason || '暂无申请原因' }}
            </div>
          </el-form-item>
          <el-form-item label="审批意见">
            <div class="approval-comment">
              {{ currentApplication.comment || '暂无审批意见' }}
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="applicationDialogVisible = false">关闭</el-button>
          <el-button v-if="currentApplication.status === '审批中'" type="primary" @click="approveApplication">审批</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 审批弹窗 -->
    <el-dialog
      v-model="approveDialogVisible"
      title="审批申请"
      width="600px"
    >
      <el-form :model="approveForm" label-width="120px" :rules="approveRules" ref="approveFormRef">
        <el-form-item label="申请编号">
          <span>{{ currentApplication.id }}</span>
        </el-form-item>
        <el-form-item label="政策名称">
          <span>{{ currentApplication.policyName }}</span>
        </el-form-item>
        <el-form-item label="加盟商">
          <span>{{ currentApplication.franchiseeName }}</span>
        </el-form-item>
        <el-form-item label="审批结果" prop="result">
          <el-radio-group v-model="approveForm.result">
            <el-radio label="通过"></el-radio>
            <el-radio label="驳回"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见" prop="comment">
          <el-input v-model="approveForm.comment" type="textarea" :rows="3" placeholder="请输入审批意见"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="approveDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveApproval">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

// 政策列表
const policiesList = ref([
  {
    id: 'PL202604001',
    name: '新加盟商装修补贴政策',
    type: '装修补贴',
    scope: '全国',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: '生效中',
    content: '新加盟商装修补贴政策：对于2026年新签约的加盟商，根据门店面积给予装修补贴，最高补贴50000元。'
  },
  {
    id: 'PL202604002',
    name: '区域代理招商奖励政策',
    type: '招商奖励',
    scope: '华北区',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: '生效中',
    content: '区域代理招商奖励政策：华北区区域代理每成功招商一家加盟店，奖励30000元。'
  },
  {
    id: 'PL202604003',
    name: '老店升级改造补贴',
    type: '升级补贴',
    scope: '全国',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-06-30',
    status: '已过期',
    content: '老店升级改造补贴：现有加盟商进行门店升级改造，给予20000元补贴。'
  },
  {
    id: 'PL202604004',
    name: '季度销售达标奖励',
    type: '销售奖励',
    scope: '全国',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: '生效中',
    content: '季度销售达标奖励：季度销售额达到50万元的加盟商，给予20000元奖励。'
  },
  {
    id: 'PL202604005',
    name: '广告宣传支持政策',
    type: '广告支持',
    scope: '华南区',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: '生效中',
    content: '广告宣传支持政策：华南区加盟商进行当地广告宣传，给予50%的费用补贴，最高补贴15000元。'
  }
])

// 申请记录列表
const applicationsList = ref([
  {
    id: 'AP202604001',
    policyName: '新加盟商装修补贴政策',
    franchiseeName: '北京现代家居有限公司',
    applyDate: '2026-04-01',
    amount: '¥50,000',
    status: '审批中',
    reason: '新开设100平米专卖店，申请装修补贴',
    comment: ''
  },
  {
    id: 'AP202604002',
    policyName: '区域代理招商奖励政策',
    franchiseeName: '上海时尚家居有限公司',
    applyDate: '2026-03-20',
    amount: '¥30,000',
    status: '已通过',
    reason: '成功招商一家加盟店，申请招商奖励',
    comment: '符合奖励条件，审批通过'
  },
  {
    id: 'AP202604003',
    policyName: '季度销售达标奖励',
    franchiseeName: '广州宜居家居有限公司',
    applyDate: '2026-03-15',
    amount: '¥20,000',
    status: '已通过',
    reason: '季度销售额达到55万元，申请销售奖励',
    comment: '销售额达标，审批通过'
  },
  {
    id: 'AP202604004',
    policyName: '广告宣传支持政策',
    franchiseeName: '成都舒适家居有限公司',
    applyDate: '2026-03-10',
    amount: '¥15,000',
    status: '已驳回',
    reason: '进行当地广告宣传，申请费用补贴',
    comment: '超出补贴范围，审批驳回'
  }
])

// 分页数据
const total = ref(50)
const applicationsTotal = ref(40)

// 弹窗状态
const policyDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const applicationDialogVisible = ref(false)
const approveDialogVisible = ref(false)

// 是否编辑政策
const isEditPolicy = ref(false)

// 当前政策
const currentPolicy = ref({})

// 当前申请
const currentApplication = ref({})

// 政策表单
const policyForm = ref({
  name: '',
  type: '',
  scope: '',
  effectiveDate: '',
  expiryDate: '',
  content: '',
  status: '生效中'
})

// 政策表单验证规则
const policyRules = {
  name: [
    { required: true, message: '请输入政策名称', trigger: 'blur' },
    { min: 2, max: 50, message: '政策名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择政策类型', trigger: 'change' }
  ],
  scope: [
    { required: true, message: '请选择适用范围', trigger: 'change' }
  ],
  effectiveDate: [
    { required: true, message: '请选择生效日期', trigger: 'change' }
  ],
  expiryDate: [
    { required: true, message: '请选择到期日期', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入政策内容', trigger: 'blur' },
    { min: 10, max: 500, message: '政策内容长度在 10 到 500 个字符', trigger: 'blur' }
  ]
}

// 审批表单
const approveForm = ref({
  result: '',
  comment: ''
})

// 审批表单验证规则
const approveRules = {
  result: [
    { required: true, message: '请选择审批结果', trigger: 'change' }
  ],
  comment: [
    { required: true, message: '请输入审批意见', trigger: 'blur' },
    { min: 5, max: 200, message: '审批意见长度在 5 到 200 个字符', trigger: 'blur' }
  ]
}

// 表单引用
const policyFormRef = ref(null)
const approveFormRef = ref(null)

// 获取状态类型
const getStatusType = (status) => {
  const map = {
    '生效中': 'success',
    '已过期': 'warning',
    '已停用': 'danger',
    '审批中': 'info',
    '已通过': 'success',
    '已驳回': 'danger'
  }
  return map[status] || ''
}

// 新增政策
const addPolicy = () => {
  isEditPolicy.value = false
  resetPolicyForm()
  policyDialogVisible.value = true
}

// 编辑政策
const editPolicy = (row) => {
  isEditPolicy.value = true
  currentPolicy.value = row
  Object.assign(policyForm.value, {
    name: row.name,
    type: row.type,
    scope: row.scope,
    effectiveDate: row.effectiveDate,
    expiryDate: row.expiryDate,
    content: row.content,
    status: row.status
  })
  policyDialogVisible.value = true
}

// 查看详情
const viewDetail = (row) => {
  currentPolicy.value = row
  detailDialogVisible.value = true
}

// 切换状态
const toggleStatus = (row) => {
  const newStatus = row.status === '生效中' ? '已停用' : '生效中'
  const confirmMessage = row.status === '生效中' ? `确定要停用政策「${row.name}」吗？` : `确定要启用政策「${row.name}」吗？`
  
  ElMessageBox.confirm(
    confirmMessage,
    '切换状态',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: row.status === '生效中' ? 'warning' : 'success'
    }
  ).then(() => {
    const loading = ElLoading.service({
      lock: true,
      text: '处理中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      row.status = newStatus
      ElMessage.success('状态切换成功')
      loading.close()
    }, 1000)
  }).catch(() => {
    // 取消操作
  })
}

// 查看申请详情
const viewApplication = (row) => {
  currentApplication.value = row
  applicationDialogVisible.value = true
}

// 审批申请
const approveApplication = () => {
  approveForm.value = {
    result: '',
    comment: ''
  }
  approveDialogVisible.value = true
}

// 保存政策
const savePolicy = async () => {
  if (!policyFormRef.value) return
  
  try {
    await policyFormRef.value.validate()
    
    const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      if (isEditPolicy.value) {
        // 编辑现有政策
        Object.assign(currentPolicy.value, {
          name: policyForm.value.name,
          type: policyForm.value.type,
          scope: policyForm.value.scope,
          effectiveDate: policyForm.value.effectiveDate,
          expiryDate: policyForm.value.expiryDate,
          content: policyForm.value.content,
          status: policyForm.value.status
        })
        ElMessage.success('政策编辑成功')
      } else {
        // 新增政策
        const newPolicy = {
          id: `PL${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(policiesList.value.length + 1).padStart(3, '0')}`,
          name: policyForm.value.name,
          type: policyForm.value.type,
          scope: policyForm.value.scope,
          effectiveDate: policyForm.value.effectiveDate,
          expiryDate: policyForm.value.expiryDate,
          content: policyForm.value.content,
          status: policyForm.value.status
        }
        policiesList.value.unshift(newPolicy)
        ElMessage.success('政策新增成功')
      }
      
      loading.close()
      policyDialogVisible.value = false
      resetPolicyForm()
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 保存审批
const saveApproval = async () => {
  if (!approveFormRef.value) return
  
  try {
    await approveFormRef.value.validate()
    
    const loading = ElLoading.service({
      lock: true,
      text: '处理中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      currentApplication.value.status = approveForm.value.result === '通过' ? '已通过' : '已驳回'
      currentApplication.value.comment = approveForm.value.comment
      
      // 更新列表中的数据
      const index = applicationsList.value.findIndex(item => item.id === currentApplication.value.id)
      if (index !== -1) {
        applicationsList.value[index].status = currentApplication.value.status
        applicationsList.value[index].comment = currentApplication.value.comment
      }
      
      ElMessage.success('审批成功')
      loading.close()
      approveDialogVisible.value = false
      applicationDialogVisible.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 重置政策表单
const resetPolicyForm = () => {
  if (policyFormRef.value) {
    policyFormRef.value.resetFields()
  }
  Object.assign(policyForm.value, {
    name: '',
    type: '',
    scope: '',
    effectiveDate: '',
    expiryDate: '',
    content: '',
    status: '生效中'
  })
}

// 分页处理
const handleCurrentChange = (current) => {
  console.log('当前页码:', current)
  // 这里可以调用接口获取对应页码的数据
}

// 申请记录分页处理
const handleApplicationsCurrentChange = (current) => {
  console.log('申请记录当前页码:', current)
  // 这里可以调用接口获取对应页码的数据
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
.policies-page {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.policies-list,
.policy-applications {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.policies-table,
.applications-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

/* 政策详情弹窗样式 */
.policy-detail {
  padding: var(--spacing-sm);
}

.policy-content {
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
}

/* 申请详情弹窗样式 */
.application-detail {
  padding: var(--spacing-sm);
}

.application-reason,
.approval-comment {
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
  padding: var(--spacing-sm);
  background: var(--bg-light);
  border-radius: var(--border-radius-sm);
  min-height: 80px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .policies-page {
    padding: var(--spacing-sm);
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .policy-detail .el-col {
    --el-col-span: 24;
  }
  
  .policy-content {
    margin-top: var(--spacing-md);
  }
}
</style>