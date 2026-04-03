<template>
  <div class="intents-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">意向加盟商管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="跟进状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="待联系" value="pending"></el-option>
                <el-option label="跟进中" value="processing"></el-option>
                <el-option label="实地考察" value="site_visit"></el-option>
                <el-option label="待评估" value="evaluation"></el-option>
                <el-option label="已拒绝" value="rejected"></el-option>
                <el-option label="已签约" value="signed"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.intentLevel" placeholder="意向等级" size="small" class="w-full">
                <el-option label="全部等级" value=""></el-option>
                <el-option label="高" value="high"></el-option>
                <el-option label="中" value="medium"></el-option>
                <el-option label="低" value="low"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="filterForm.keyword" placeholder="搜索客户姓名/电话" size="small" class="w-full">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                class="w-full"
              />
            </el-col>
          </el-row>
          <div class="filter-actions mt-4 flex justify-end">
            <el-button size="small" class="mr-2" @click="resetFilter">重置</el-button>
            <el-button type="primary" size="small" @click="searchIntents">查询</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 意向客户列表 -->
    <div class="intents-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">意向客户列表</span>
            <span class="text-secondary">共 {{ total }} 个意向客户</span>
          </div>
        </template>
        <el-table :data="intentsList" style="width: 100%" class="intents-table">
          <el-table-column prop="id" label="客户编号" width="120"></el-table-column>
          <el-table-column prop="name" label="客户姓名" width="120"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
          <el-table-column prop="region" label="意向区域" width="150"></el-table-column>
          <el-table-column prop="intentLevel" label="意向等级" width="100">
            <template #default="scope">
              <el-tag :type="getLevelType(scope.row.intentLevel)">{{ scope.row.intentLevel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="assignedTo" label="招商经理" width="120"></el-table-column>
          <el-table-column prop="createTime" label="提交时间" width="180"></el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="assignManager(scope.row)">分配经理</el-button>
              <el-button size="small" type="success" @click="setReminder(scope.row)">设置提醒</el-button>
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
    
    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="客户详情"
      width="800px"
    >
      <div class="customer-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form :model="currentCustomer" label-width="100px">
              <el-form-item label="客户编号">
                <span>{{ currentCustomer.id }}</span>
              </el-form-item>
              <el-form-item label="客户姓名">
                <span>{{ currentCustomer.name }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ currentCustomer.phone }}</span>
              </el-form-item>
              <el-form-item label="意向区域">
                <span>{{ currentCustomer.region }}</span>
              </el-form-item>
              <el-form-item label="意向等级">
                <el-tag :type="getLevelType(currentCustomer.intentLevel)">{{ currentCustomer.intentLevel }}</el-tag>
              </el-form-item>
              <el-form-item label="状态">
                <el-tag :type="getStatusType(currentCustomer.status)">{{ currentCustomer.status }}</el-tag>
              </el-form-item>
              <el-form-item label="招商经理">
                <span>{{ currentCustomer.assignedTo }}</span>
              </el-form-item>
              <el-form-item label="提交时间">
                <span>{{ currentCustomer.createTime }}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="mb-4">
              <template #header>
                <div class="card-header">
                  <span>客户需求</span>
                </div>
              </template>
              <div class="customer-demand">
                {{ currentCustomer.demand || '暂无需求信息' }}
              </div>
            </el-card>
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>跟进记录</span>
                </div>
              </template>
              <div class="follow-up-records">
                <div v-for="(record, index) in currentCustomer.followUpRecords" :key="index" class="record-item">
                  <div class="record-time">{{ record.time }}</div>
                  <div class="record-content">{{ record.content }}</div>
                </div>
                <div v-if="!currentCustomer.followUpRecords || currentCustomer.followUpRecords.length === 0" class="no-records">
                  暂无跟进记录
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="addFollowUpRecord">添加跟进记录</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 分配经理弹窗 -->
    <el-dialog
      v-model="assignDialogVisible"
      title="分配招商经理"
      width="600px"
    >
      <el-form :model="assignForm" label-width="120px" :rules="assignRules" ref="assignFormRef">
        <el-form-item label="客户姓名">
          <span>{{ currentCustomer.name }}</span>
        </el-form-item>
        <el-form-item label="当前经理">
          <span>{{ currentCustomer.assignedTo }}</span>
        </el-form-item>
        <el-form-item label="新招商经理" prop="managerId">
          <el-select v-model="assignForm.managerId" placeholder="选择招商经理" class="w-full">
            <el-option v-for="manager in managersList" :key="manager.id" :label="manager.name" :value="manager.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配原因" prop="reason">
          <el-input v-model="assignForm.reason" type="textarea" :rows="3" placeholder="请输入分配原因"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAssignManager">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 设置提醒弹窗 -->
    <el-dialog
      v-model="reminderDialogVisible"
      title="设置提醒"
      width="600px"
    >
      <el-form :model="reminderForm" label-width="120px" :rules="reminderRules" ref="reminderFormRef">
        <el-form-item label="客户姓名">
          <span>{{ currentCustomer.name }}</span>
        </el-form-item>
        <el-form-item label="提醒时间" prop="remindTime">
          <el-date-picker v-model="reminderForm.remindTime" type="datetime" placeholder="选择提醒时间" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="提醒内容" prop="content">
          <el-input v-model="reminderForm.content" type="textarea" :rows="3" placeholder="请输入提醒内容"></el-input>
        </el-form-item>
        <el-form-item label="提醒方式" prop="remindType">
          <el-select v-model="reminderForm.remindType" placeholder="选择提醒方式" class="w-full" multiple>
            <el-option label="系统通知" value="system"></el-option>
            <el-option label="邮件" value="email"></el-option>
            <el-option label="短信" value="sms"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reminderDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveReminder">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加跟进记录弹窗 -->
    <el-dialog
      v-model="followUpDialogVisible"
      title="添加跟进记录"
      width="600px"
    >
      <el-form :model="followUpForm" label-width="120px" :rules="followUpRules" ref="followUpFormRef">
        <el-form-item label="跟进内容" prop="content">
          <el-input v-model="followUpForm.content" type="textarea" :rows="4" placeholder="请输入跟进内容"></el-input>
        </el-form-item>
        <el-form-item label="跟进状态" prop="status">
          <el-select v-model="followUpForm.status" placeholder="选择跟进状态" class="w-full">
            <el-option label="待联系" value="待联系"></el-option>
            <el-option label="跟进中" value="跟进中"></el-option>
            <el-option label="实地考察" value="实地考察"></el-option>
            <el-option label="待评估" value="待评估"></el-option>
            <el-option label="已拒绝" value="已拒绝"></el-option>
            <el-option label="已签约" value="已签约"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下次跟进时间" prop="nextFollowUpTime">
          <el-date-picker v-model="followUpForm.nextFollowUpTime" type="datetime" placeholder="选择下次跟进时间" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="followUpDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveFollowUpRecord">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'

// 筛选表单
const filterForm = ref({
  status: '',
  intentLevel: '',
  keyword: '',
  dateRange: []
})

// 意向客户列表
const intentsList = ref([
  {
    id: 'INT001',
    name: '张总',
    phone: '138****1234',
    region: '北京市朝阳区',
    intentLevel: '高',
    status: '跟进中',
    assignedTo: '李经理',
    createTime: '2026-04-01 09:00',
    demand: '意向开设100平米专卖店，希望了解加盟政策和支持方案。',
    followUpRecords: [
      { time: '2026-04-01 10:00', content: '初步沟通，了解客户需求' },
      { time: '2026-04-02 14:00', content: '发送加盟资料和政策' }
    ]
  },
  {
    id: 'INT002',
    name: '李总',
    phone: '139****5678',
    region: '上海市浦东新区',
    intentLevel: '中',
    status: '待联系',
    assignedTo: '王经理',
    createTime: '2026-04-01 10:30',
    demand: '意向在上海开设加盟店，关注品牌影响力和市场前景。',
    followUpRecords: []
  },
  {
    id: 'INT003',
    name: '王总',
    phone: '137****9012',
    region: '广州市天河区',
    intentLevel: '高',
    status: '实地考察',
    assignedTo: '赵经理',
    createTime: '2026-04-01 11:15',
    demand: '计划在广州天河区开设旗舰店，需要实地考察总部和现有门店。',
    followUpRecords: [
      { time: '2026-04-01 15:00', content: '安排实地考察时间' },
      { time: '2026-04-03 09:00', content: '实地考察总部' }
    ]
  },
  {
    id: 'INT004',
    name: '赵总',
    phone: '136****3456',
    region: '深圳市南山区',
    intentLevel: '中',
    status: '待评估',
    assignedTo: '刘经理',
    createTime: '2026-04-01 14:20',
    demand: '意向在深圳南山区开设加盟店，需要评估投资回报率。',
    followUpRecords: [
      { time: '2026-04-01 16:00', content: '提供投资回报分析' }
    ]
  },
  {
    id: 'INT005',
    name: '刘总',
    phone: '135****7890',
    region: '成都市武侯区',
    intentLevel: '低',
    status: '已拒绝',
    assignedTo: '张经理',
    createTime: '2026-04-01 15:45',
    demand: '意向开设小型加盟店，但预算有限。',
    followUpRecords: [
      { time: '2026-04-02 10:00', content: '沟通后客户因预算问题放弃加盟' }
    ]
  }
])

// 分页数据
const total = ref(100)

// 弹窗状态
const detailDialogVisible = ref(false)
const assignDialogVisible = ref(false)
const reminderDialogVisible = ref(false)
const followUpDialogVisible = ref(false)

// 当前客户
const currentCustomer = ref({})

// 招商经理列表
const managersList = ref([
  { id: 'manager1', name: '李经理' },
  { id: 'manager2', name: '王经理' },
  { id: 'manager3', name: '赵经理' },
  { id: 'manager4', name: '刘经理' },
  { id: 'manager5', name: '张经理' }
])

// 分配经理表单
const assignForm = ref({
  managerId: '',
  reason: ''
})

// 分配经理表单验证规则
const assignRules = {
  managerId: [
    { required: true, message: '请选择招商经理', trigger: 'change' }
  ],
  reason: [
    { required: true, message: '请输入分配原因', trigger: 'blur' },
    { min: 5, max: 200, message: '分配原因长度在 5 到 200 个字符', trigger: 'blur' }
  ]
}

// 设置提醒表单
const reminderForm = ref({
  remindTime: '',
  content: '',
  remindType: []
})

// 设置提醒表单验证规则
const reminderRules = {
  remindTime: [
    { required: true, message: '请选择提醒时间', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入提醒内容', trigger: 'blur' },
    { min: 5, max: 200, message: '提醒内容长度在 5 到 200 个字符', trigger: 'blur' }
  ],
  remindType: [
    { required: true, message: '请选择提醒方式', trigger: 'change' }
  ]
}

// 添加跟进记录表单
const followUpForm = ref({
  content: '',
  status: '',
  nextFollowUpTime: ''
})

// 添加跟进记录表单验证规则
const followUpRules = {
  content: [
    { required: true, message: '请输入跟进内容', trigger: 'blur' },
    { min: 5, max: 500, message: '跟进内容长度在 5 到 500 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择跟进状态', trigger: 'change' }
  ]
}

// 表单引用
const assignFormRef = ref(null)
const reminderFormRef = ref(null)
const followUpFormRef = ref(null)

// 获取等级类型
const getLevelType = (level) => {
  const map = { '高': 'success', '中': 'warning', '低': 'danger' }
  return map[level] || ''
}

// 获取状态类型
const getStatusType = (status) => {
  const map = {
    '待联系': 'info',
    '跟进中': 'primary',
    '实地考察': 'warning',
    '待评估': 'warning',
    '已拒绝': 'danger',
    '已签约': 'success'
  }
  return map[status] || ''
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    status: '',
    intentLevel: '',
    keyword: '',
    dateRange: []
  }
}

// 搜索意向客户
const searchIntents = () => {
  console.log('搜索意向客户:', filterForm.value)
  // 这里可以调用接口搜索意向客户
}

// 查看详情
const viewDetail = (row) => {
  Object.assign(currentCustomer, row)
  detailDialogVisible.value = true
}

// 分配招商经理
const assignManager = (row) => {
  Object.assign(currentCustomer, row)
  assignForm.value = {
    managerId: '',
    reason: ''
  }
  assignDialogVisible.value = true
}

// 设置提醒
const setReminder = (row) => {
  Object.assign(currentCustomer, row)
  reminderForm.value = {
    remindTime: '',
    content: '',
    remindType: []
  }
  reminderDialogVisible.value = true
}

// 保存分配经理
const saveAssignManager = async () => {
  if (!assignFormRef.value) return
  
  try {
    await assignFormRef.value.validate()
    
    const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      // 更新客户的招商经理
      const manager = managersList.value.find(m => m.id === assignForm.value.managerId)
      if (manager) {
        currentCustomer.value.assignedTo = manager.name
        
        // 更新列表中的数据
        const index = intentsList.value.findIndex(item => item.id === currentCustomer.value.id)
        if (index !== -1) {
          intentsList.value[index].assignedTo = manager.name
        }
      }
      
      ElMessage.success('分配成功')
      loading.close()
      assignDialogVisible.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 保存提醒
const saveReminder = async () => {
  if (!reminderFormRef.value) return
  
  try {
    await reminderFormRef.value.validate()
    
    const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      ElMessage.success('提醒设置成功')
      loading.close()
      reminderDialogVisible.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 添加跟进记录
const addFollowUpRecord = () => {
  followUpForm.value = {
    content: '',
    status: currentCustomer.value.status,
    nextFollowUpTime: ''
  }
  followUpDialogVisible.value = true
}

// 保存跟进记录
const saveFollowUpRecord = async () => {
  if (!followUpFormRef.value) return
  
  try {
    await followUpFormRef.value.validate()
    
    const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      // 添加新的跟进记录
      const newRecord = {
        time: new Date().toLocaleString(),
        content: followUpForm.value.content
      }
      
      if (!currentCustomer.value.followUpRecords) {
        currentCustomer.value.followUpRecords = []
      }
      
      currentCustomer.value.followUpRecords.unshift(newRecord)
      currentCustomer.value.status = followUpForm.value.status
      
      // 更新列表中的数据
      const index = intentsList.value.findIndex(item => item.id === currentCustomer.value.id)
      if (index !== -1) {
        intentsList.value[index].status = followUpForm.value.status
        intentsList.value[index].followUpRecords = currentCustomer.value.followUpRecords
      }
      
      ElMessage.success('跟进记录添加成功')
      loading.close()
      followUpDialogVisible.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 分页处理
const handleCurrentChange = (current) => {
  console.log('当前页码:', current)
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
.intents-page {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.filter-section {
  margin-bottom: var(--spacing-md);
}

.filter-form {
  padding: var(--spacing-sm);
}

.intents-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.intents-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

/* 客户详情弹窗样式 */
.customer-detail {
  padding: var(--spacing-sm);
}

.customer-demand {
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.follow-up-records {
  max-height: 300px;
  overflow-y: auto;
}

.record-item {
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--bg-light);
  border-radius: var(--border-radius-sm);
}

.record-time {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.record-content {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  line-height: 1.4;
}

.no-records {
  text-align: center;
  color: var(--text-secondary);
  padding: var(--spacing-md);
  font-size: var(--font-size-sm);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .filter-form .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .intents-page {
    padding: var(--spacing-sm);
  }
  
  .filter-form .el-col {
    --el-col-span: 24;
  }
  
  .filter-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .customer-detail .el-col {
    --el-col-span: 24;
  }
}
</style>