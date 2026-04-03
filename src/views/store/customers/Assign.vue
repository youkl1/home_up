<template>
  <div class="customer-assign">
    <div class="page-header">
      <h1>客资分配</h1>
      <div class="header-actions">
        <el-button type="primary" @click="showAutoAssignDialog">
          <el-icon><MagicStick /></el-icon>
          自动分配
        </el-button>
        <el-button @click="showBatchAssignDialog" :disabled="selectedCustomers.length === 0">
          <el-icon><FolderOpened /></el-icon>
          批量分配 ({{ selectedCustomers.length }})
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ stats.unassigned }}</div>
            <div class="stat-label">待分配客户</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card primary">
            <div class="stat-value">{{ stats.assignedToday }}</div>
            <div class="stat-label">今日已分配</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card success">
            <div class="stat-value">{{ stats.autoAssigned }}</div>
            <div class="stat-label">自动分配</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card warning">
            <div class="stat-value">{{ stats.manualAssigned }}</div>
            <div class="stat-label">手动分配</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 分配规则配置 -->
    <div class="assign-rules">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>分配规则配置</span>
            <el-button type="primary" size="small" @click="saveRules">保存规则</el-button>
          </div>
        </template>
        <el-form :model="assignRules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="分配模式">
                <el-radio-group v-model="assignRules.mode">
                  <el-radio-button label="auto">自动分配</el-radio-button>
                  <el-radio-button label="manual">手动分配</el-radio-button>
                  <el-radio-button label="mixed">混合模式</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="分配维度">
                <el-checkbox-group v-model="assignRules.dimensions">
                  <el-checkbox label="region">按区域</el-checkbox>
                  <el-checkbox label="performance">按业绩</el-checkbox>
                  <el-checkbox label="workload">按负载</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最大客户数">
                <el-input-number v-model="assignRules.maxCustomers" :min="10" :max="200" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>

    <!-- 待分配客户列表 -->
    <div class="customer-list">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>待分配客户</span>
            <el-input v-model="searchKeyword" placeholder="搜索客户" clearable style="width: 200px">
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </template>
        <el-table :data="unassignedCustomers" v-loading="loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="客户信息" min-width="180">
            <template #default="{ row }">
              <div class="customer-info">
                <el-avatar :size="36">{{ row.name?.charAt(0) }}</el-avatar>
                <div class="info-detail">
                  <div class="name">{{ row.name }}</div>
                  <div class="phone">{{ row.phone }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="level" label="等级" width="80">
            <template #default="{ row }">
              <el-tag :type="getLevelType(row.level)">{{ row.level }}级</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="source" label="来源" width="100">
            <template #default="{ row }">
              <el-tag size="small">{{ getSourceText(row.source) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="budget" label="预算" width="100">
            <template #default="{ row }">
              <span v-if="row.budget">¥{{ row.budget }}万</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="区域" width="100" />
          <el-table-column prop="createTime" label="创建时间" width="140" />
          <el-table-column label="分配给" width="150">
            <template #default="{ row }">
              <el-select v-model="row.assignTo" placeholder="选择导购" size="small">
                <el-option v-for="guide in guides" :key="guide.id" :label="guide.name" :value="guide.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="assignCustomer(row)">分配</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 分配记录 -->
    <div class="assign-records">
      <el-card shadow="hover">
        <template #header>
          <span>分配记录</span>
        </template>
        <el-table :data="assignRecords" size="small">
          <el-table-column prop="customerName" label="客户姓名" />
          <el-table-column prop="guideName" label="分配导购" />
          <el-table-column prop="assignType" label="分配方式">
            <template #default="{ row }">
              <el-tag :type="row.assignType === 'auto' ? 'success' : 'warning'" size="small">
                {{ row.assignType === 'auto' ? '自动' : '手动' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作人" />
          <el-table-column prop="assignTime" label="分配时间" />
        </el-table>
      </el-card>
    </div>

    <!-- 自动分配弹窗 -->
    <el-dialog v-model="autoAssignDialogVisible" title="自动分配" width="600px">
      <div class="auto-assign-dialog">
        <el-alert
          title="自动分配规则说明"
          type="info"
          :closable="false"
          style="margin-bottom: 20px"
        >
          <template #default>
            <ul style="margin: 0; padding-left: 20px;">
              <li>按区域匹配：优先分配给同区域的导购</li>
              <li>按业绩平衡：优先分配给业绩较低的导购</li>
              <li>按负载均衡：优先分配给客户数较少的导购</li>
            </ul>
          </template>
        </el-alert>
        
        <el-form label-width="120px">
          <el-form-item label="待分配客户">
            <span>{{ unassignedCustomers.length }} 人</span>
          </el-form-item>
          <el-form-item label="分配数量">
            <el-input-number v-model="autoAssignCount" :min="1" :max="unassignedCustomers.length" />
            <span style="margin-left: 10px">人</span>
          </el-form-item>
          <el-form-item label="分配策略">
            <el-radio-group v-model="autoAssignStrategy">
              <el-radio-button label="balance">负载均衡</el-radio-button>
              <el-radio-button label="performance">业绩优先</el-radio-button>
              <el-radio-button label="region">区域优先</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排除导购">
            <el-select v-model="excludeGuides" multiple placeholder="选择要排除的导购" style="width: 100%">
              <el-option v-for="guide in guides" :key="guide.id" :label="guide.name" :value="guide.id" />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="preview-section" v-if="previewResult.length > 0">
          <div class="preview-title">分配预览</div>
          <el-table :data="previewResult" size="small" max-height="200">
            <el-table-column prop="customerName" label="客户" />
            <el-table-column prop="guideName" label="分配导购" />
            <el-table-column prop="reason" label="分配原因" />
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="autoAssignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="previewAutoAssign" v-if="previewResult.length === 0">
          预览分配
        </el-button>
        <el-button type="success" @click="confirmAutoAssign" v-else :loading="submitting">
          确认分配
        </el-button>
      </template>
    </el-dialog>

    <!-- 手动分配弹窗 -->
    <el-dialog v-model="assignDialogVisible" title="手动分配客户" width="500px">
      <el-form label-width="100px">
        <el-form-item label="客户信息">
          <div class="customer-info-preview" v-if="currentCustomer">
            <el-avatar :size="40">{{ currentCustomer.name?.charAt(0) }}</el-avatar>
            <div class="info">
              <div class="name">{{ currentCustomer.name }}</div>
              <div class="detail">
                <el-tag size="small" :type="getLevelType(currentCustomer.level)">{{ currentCustomer.level }}级</el-tag>
                <span style="margin-left: 10px">{{ currentCustomer.phone }}</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="分配导购" required>
          <el-select v-model="assignForm.guideId" placeholder="请选择导购" style="width: 100%">
            <el-option v-for="guide in guides" :key="guide.id" :label="guide.name" :value="guide.id">
              <div style="display: flex; justify-content: space-between;">
                <span>{{ guide.name }}</span>
                <span style="color: #909399; font-size: 12px;">当前客户: {{ guide.customerCount }}人</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配原因">
          <el-input v-model="assignForm.reason" type="textarea" :rows="2" placeholder="请输入分配原因（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAssign" :loading="submitting">确认分配</el-button>
      </template>
    </el-dialog>

    <!-- 批量分配弹窗 -->
    <el-dialog v-model="batchAssignDialogVisible" title="批量分配客户" width="700px">
      <div class="batch-assign-dialog">
        <el-alert
          :title="`已选择 ${selectedCustomers.length} 位客户`"
          type="info"
          :closable="false"
          style="margin-bottom: 20px"
        />
        
        <el-form label-width="100px">
          <el-form-item label="分配方式">
            <el-radio-group v-model="batchAssignForm.mode">
              <el-radio-button label="single">分配给同一导购</el-radio-button>
              <el-radio-button label="average">平均分配</el-radio-button>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="选择导购" v-if="batchAssignForm.mode === 'single'">
            <el-select v-model="batchAssignForm.guideId" placeholder="请选择导购" style="width: 100%">
              <el-option v-for="guide in guides" :key="guide.id" :label="guide.name" :value="guide.id" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="选择导购" v-else>
            <el-checkbox-group v-model="batchAssignForm.guideIds">
              <el-checkbox v-for="guide in guides" :key="guide.id" :label="guide.id">
                {{ guide.name }} ({{ guide.customerCount }}人)
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <div class="selected-customers">
          <div class="section-title">已选客户列表</div>
          <el-table :data="selectedCustomers" size="small" max-height="200">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="phone" label="电话" />
            <el-table-column prop="level" label="等级">
              <template #default="{ row }">
                <el-tag size="small" :type="getLevelType(row.level)">{{ row.level }}级</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="batchAssignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchAssign" :loading="submitting">确认分配</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MagicStick, FolderOpened, Search } from '@element-plus/icons-vue'

// 统计数据
const stats = reactive({
  unassigned: 15,
  assignedToday: 8,
  autoAssigned: 5,
  manualAssigned: 3
})

// 分配规则
const assignRules = reactive({
  mode: 'mixed',
  dimensions: ['region', 'workload'],
  maxCustomers: 50
})

// 搜索
const searchKeyword = ref('')
const loading = ref(false)
const submitting = ref(false)

// 导购列表
const guides = ref([
  { id: 1, name: '张小明', customerCount: 45 },
  { id: 2, name: '李小红', customerCount: 32 },
  { id: 3, name: '王小强', customerCount: 28 },
  { id: 4, name: '赵小芳', customerCount: 35 }
])

// 待分配客户
const unassignedCustomers = ref([
  { id: 1, name: '客户A', phone: '138****1234', level: 'A', source: 'walkin', budget: 50, region: '朝阳区', createTime: '2024-12-01', assignTo: '' },
  { id: 2, name: '客户B', phone: '139****5678', level: 'B', source: 'referral', budget: 25, region: '海淀区', createTime: '2024-12-01', assignTo: '' },
  { id: 3, name: '客户C', phone: '137****9012', level: 'A', source: 'online', budget: 80, region: '东城区', createTime: '2024-11-30', assignTo: '' },
  { id: 4, name: '客户D', phone: '136****3456', level: 'C', source: 'phone', budget: 15, region: '西城区', createTime: '2024-11-30', assignTo: '' }
])

// 已选客户
const selectedCustomers = ref([])

// 分配记录
const assignRecords = ref([
  { id: 1, customerName: '客户X', guideName: '张小明', assignType: 'auto', operator: '系统', assignTime: '2024-12-01 14:30' },
  { id: 2, customerName: '客户Y', guideName: '李小红', assignType: 'manual', operator: '管理员', assignTime: '2024-12-01 11:20' }
])

// 弹窗控制
const autoAssignDialogVisible = ref(false)
const assignDialogVisible = ref(false)
const batchAssignDialogVisible = ref(false)

// 当前操作客户
const currentCustomer = ref(null)

// 自动分配配置
const autoAssignCount = ref(10)
const autoAssignStrategy = ref('balance')
const excludeGuides = ref([])
const previewResult = ref([])

// 手动分配表单
const assignForm = reactive({
  guideId: '',
  reason: ''
})

// 批量分配表单
const batchAssignForm = reactive({
  mode: 'single',
  guideId: '',
  guideIds: []
})

// 辅助方法
const getLevelType = (level) => {
  const map = { A: 'danger', B: 'warning', C: 'success', D: 'info' }
  return map[level] || 'info'
}

const getSourceText = (source) => {
  const map = { walkin: '自然进店', phone: '电话邀约', online: '线上推广', referral: '转介绍' }
  return map[source] || source
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedCustomers.value = selection
}

// 保存规则
const saveRules = () => {
  ElMessage.success('分配规则保存成功')
}

// 显示自动分配弹窗
const showAutoAssignDialog = () => {
  autoAssignCount.value = unassignedCustomers.value.length
  excludeGuides.value = []
  previewResult.value = []
  autoAssignDialogVisible.value = true
}

// 预览自动分配
const previewAutoAssign = () => {
  // 模拟预览结果
  previewResult.value = unassignedCustomers.value.slice(0, autoAssignCount.value).map((customer, index) => ({
    customerName: customer.name,
    guideName: guides.value[index % guides.value.length].name,
    reason: '负载均衡分配'
  }))
}

// 确认自动分配
const confirmAutoAssign = () => {
  submitting.value = true
  setTimeout(() => {
    // 添加分配记录
    previewResult.value.forEach(item => {
      assignRecords.value.unshift({
        id: Date.now() + Math.random(),
        customerName: item.customerName,
        guideName: item.guideName,
        assignType: 'auto',
        operator: '系统',
        assignTime: new Date().toLocaleString()
      })
    })
    
    // 移除已分配客户
    unassignedCustomers.value = unassignedCustomers.value.slice(autoAssignCount.value)
    
    submitting.value = false
    autoAssignDialogVisible.value = false
    previewResult.value = []
    stats.unassigned = unassignedCustomers.value.length
    stats.autoAssigned += autoAssignCount.value
    stats.assignedToday += autoAssignCount.value
    
    ElMessage.success(`成功分配 ${autoAssignCount.value} 位客户`)
  }, 500)
}

// 分配单个客户
const assignCustomer = (row) => {
  currentCustomer.value = row
  assignForm.guideId = row.assignTo || ''
  assignForm.reason = ''
  assignDialogVisible.value = true
}

// 确认手动分配
const confirmAssign = () => {
  if (!assignForm.guideId) {
    ElMessage.warning('请选择要分配的导购')
    return
  }
  
  submitting.value = true
  setTimeout(() => {
    const guide = guides.value.find(g => g.id === assignForm.guideId)
    
    // 添加分配记录
    assignRecords.value.unshift({
      id: Date.now(),
      customerName: currentCustomer.value.name,
      guideName: guide.name,
      assignType: 'manual',
      operator: '当前用户',
      assignTime: new Date().toLocaleString()
    })
    
    // 移除已分配客户
    const index = unassignedCustomers.value.findIndex(c => c.id === currentCustomer.value.id)
    if (index > -1) {
      unassignedCustomers.value.splice(index, 1)
    }
    
    submitting.value = false
    assignDialogVisible.value = false
    stats.unassigned = unassignedCustomers.value.length
    stats.manualAssigned++
    stats.assignedToday++
    
    ElMessage.success(`已将客户分配给 ${guide.name}`)
  }, 500)
}

// 显示批量分配弹窗
const showBatchAssignDialog = () => {
  if (selectedCustomers.value.length === 0) {
    ElMessage.warning('请先选择要分配的客户')
    return
  }
  batchAssignForm.mode = 'single'
  batchAssignForm.guideId = ''
  batchAssignForm.guideIds = []
  batchAssignDialogVisible.value = true
}

// 确认批量分配
const confirmBatchAssign = () => {
  if (batchAssignForm.mode === 'single' && !batchAssignForm.guideId) {
    ElMessage.warning('请选择要分配的导购')
    return
  }
  if (batchAssignForm.mode === 'average' && batchAssignForm.guideIds.length === 0) {
    ElMessage.warning('请选择要分配的导购')
    return
  }
  
  submitting.value = true
  setTimeout(() => {
    const count = selectedCustomers.value.length
    
    // 添加分配记录
    selectedCustomers.value.forEach((customer, index) => {
      let guideId = batchAssignForm.guideId
      if (batchAssignForm.mode === 'average') {
        guideId = batchAssignForm.guideIds[index % batchAssignForm.guideIds.length]
      }
      const guide = guides.value.find(g => g.id === guideId)
      
      assignRecords.value.unshift({
        id: Date.now() + index,
        customerName: customer.name,
        guideName: guide.name,
        assignType: 'manual',
        operator: '当前用户',
        assignTime: new Date().toLocaleString()
      })
    })
    
    // 移除已分配客户
    const selectedIds = selectedCustomers.value.map(c => c.id)
    unassignedCustomers.value = unassignedCustomers.value.filter(c => !selectedIds.includes(c.id))
    
    submitting.value = false
    batchAssignDialogVisible.value = false
    selectedCustomers.value = []
    stats.unassigned = unassignedCustomers.value.length
    stats.manualAssigned += count
    stats.assignedToday += count
    
    ElMessage.success(`成功分配 ${count} 位客户`)
  }, 500)
}
</script>

<style scoped lang="scss">
.customer-assign {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      margin: 0;
      font-size: 24px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #409eff;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }

      &.primary .stat-value { color: #409eff; }
      &.success .stat-value { color: #67c23a; }
      &.warning .stat-value { color: #e6a23c; }
    }
  }

  .assign-rules {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .customer-list {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .customer-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .info-detail {
        .name {
          font-weight: 500;
          color: #303133;
        }

        .phone {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  .auto-assign-dialog {
    .preview-section {
      margin-top: 20px;

      .preview-title {
        font-weight: bold;
        margin-bottom: 10px;
        color: #303133;
      }
    }
  }

  .customer-info-preview {
    display: flex;
    align-items: center;
    gap: 12px;

    .info {
      .name {
        font-weight: 500;
        color: #303133;
        margin-bottom: 5px;
      }

      .detail {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #909399;
      }
    }
  }

  .batch-assign-dialog {
    .selected-customers {
      margin-top: 20px;

      .section-title {
        font-weight: bold;
        margin-bottom: 10px;
        color: #303133;
      }
    }
  }
}
</style>
