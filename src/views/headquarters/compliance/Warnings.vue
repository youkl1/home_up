<template>
  <div class="warnings-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">合规预警管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.warningType" placeholder="预警类型" size="small" class="w-full">
                <el-option label="全部类型" value=""></el-option>
                <el-option label="价格违规" value="price"></el-option>
                <el-option label="内容违规" value="content"></el-option>
                <el-option label="活动违规" value="activity"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.level" placeholder="预警等级" size="small" class="w-full">
                <el-option label="全部等级" value=""></el-option>
                <el-option label="高危" value="high"></el-option>
                <el-option label="中危" value="medium"></el-option>
                <el-option label="低危" value="low"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="处理状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="待处理" value="pending"></el-option>
                <el-option label="处理中" value="processing"></el-option>
                <el-option label="已解决" value="resolved"></el-option>
              </el-select>
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
            <el-button type="primary" size="small" @click="searchWarnings">查询</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 预警统计 -->
    <div class="warning-stats mb-6">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item text-center">
              <div class="stat-value text-3xl font-bold text-danger mb-2">{{ highRiskCount }}</div>
              <div class="stat-label text-secondary">高危预警</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item text-center">
              <div class="stat-value text-3xl font-bold text-warning mb-2">{{ mediumRiskCount }}</div>
              <div class="stat-label text-secondary">中危预警</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item text-center">
              <div class="stat-value text-3xl font-bold text-success mb-2">{{ lowRiskCount }}</div>
              <div class="stat-label text-secondary">低危预警</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item text-center">
              <div class="stat-value text-3xl font-bold text-primary mb-2">{{ pendingCount }}</div>
              <div class="stat-label text-secondary">待处理</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 预警列表 -->
    <div class="warnings-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">合规预警列表</span>
            <span class="text-secondary">共 {{ total }} 条预警</span>
          </div>
        </template>
        <el-table :data="warningsList" style="width: 100%" class="warnings-table">
          <el-table-column prop="id" label="预警编号" width="180"></el-table-column>
          <el-table-column prop="warningType" label="预警类型" width="120">
            <template #default="scope">
              <el-tag :type="getWarningTypeType(scope.row.warningType)">
                {{ scope.row.warningType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="level" label="等级" width="100">
            <template #default="scope">
              <el-tag :type="getLevelType(scope.row.level)">
                {{ scope.row.level }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="storeName" label="涉及门店" width="150"></el-table-column>
          <el-table-column prop="description" label="预警描述"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewWarningDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="warning" @click="sendNotice(scope.row)" v-if="scope.row.status !== '已解决'">下发整改</el-button>
              <el-button size="small" type="primary" @click="processWarning(scope.row)" v-if="scope.row.status !== '已解决'">标记处理</el-button>
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
  </div>
  
  <!-- 查看详情弹窗 -->
  <el-dialog
    v-model="detailDialogVisible"
    title="预警详情"
    width="600px"
  >
    <div class="warning-detail">
      <div class="detail-item">
        <span class="label">预警编号：</span>
        <span class="value">{{ currentWarning.id }}</span>
      </div>
      <div class="detail-item">
        <span class="label">预警类型：</span>
        <el-tag :type="getWarningTypeType(currentWarning.warningType)">
          {{ currentWarning.warningType }}
        </el-tag>
      </div>
      <div class="detail-item">
        <span class="label">预警等级：</span>
        <el-tag :type="getLevelType(currentWarning.level)">
          {{ currentWarning.level }}
        </el-tag>
      </div>
      <div class="detail-item">
        <span class="label">涉及门店：</span>
        <span class="value">{{ currentWarning.storeName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">预警描述：</span>
        <div class="warning-desc">{{ currentWarning.description }}</div>
      </div>
      <div class="detail-item">
        <span class="label">状态：</span>
        <el-tag :type="getStatusType(currentWarning.status)">
          {{ currentWarning.status }}
        </el-tag>
      </div>
      <div class="detail-item">
        <span class="label">创建时间：</span>
        <span class="value">{{ currentWarning.createTime }}</span>
      </div>
    </div>
  </el-dialog>
  
  <!-- 下发整改通知弹窗 -->
  <el-dialog
    v-model="noticeDialogVisible"
    title="下发整改通知"
    width="500px"
  >
    <el-form :model="noticeForm" label-width="100px">
      <el-form-item label="整改期限">
        <el-date-picker
          v-model="noticeForm.deadline"
          type="date"
          placeholder="请选择整改期限"
          class="w-full"
        />
      </el-form-item>
      <el-form-item label="整改要求">
        <el-input
          v-model="noticeForm.requirement"
          type="textarea"
          :rows="4"
          placeholder="请输入整改要求"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="noticeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmNotice">确认下发</el-button>
      </span>
    </template>
  </el-dialog>
  
  <!-- 标记处理弹窗 -->
  <el-dialog
    v-model="processDialogVisible"
    title="标记处理"
    width="500px"
  >
    <el-form :model="processForm" label-width="100px">
      <el-form-item label="处理结果">
        <el-select v-model="processForm.result" placeholder="请选择处理结果" class="w-full">
          <el-option label="已解决" value="resolved"></el-option>
          <el-option label="部分解决" value="partially_resolved"></el-option>
          <el-option label="无法解决" value="unresolved"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理说明">
        <el-input
          v-model="processForm.description"
          type="textarea"
          :rows="4"
          placeholder="请输入处理说明"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmProcess">确认处理</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'

// 筛选表单
const filterForm = ref({
  warningType: '',
  level: '',
  status: '',
  dateRange: []
})

// 统计数据
const highRiskCount = ref('12')
const mediumRiskCount = ref('28')
const lowRiskCount = ref('45')
const pendingCount = ref('35')

// 预警列表
const warningsList = ref([
  {
    id: 'CW202604001',
    warningType: '价格违规',
    level: '高危',
    storeName: '上海中心店',
    description: '门店报价低于最低限价，违反价格体系管理规定',
    status: '待处理',
    createTime: '2026-04-01 09:00'
  },
  {
    id: 'CW202604002',
    warningType: '内容违规',
    level: '中危',
    storeName: '北京旗舰店',
    description: '宣传海报使用未经授权的品牌标识',
    status: '处理中',
    createTime: '2026-04-01 10:30'
  },
  {
    id: 'CW202604003',
    warningType: '活动违规',
    level: '低危',
    storeName: '广州天河店',
    description: '未按总部要求执行促销活动',
    status: '已解决',
    createTime: '2026-04-01 11:15'
  },
  {
    id: 'CW202604004',
    warningType: '价格违规',
    level: '高危',
    storeName: '深圳南山店',
    description: '门店报价严重低于最低限价，影响市场价格体系',
    status: '待处理',
    createTime: '2026-04-01 14:20'
  },
  {
    id: 'CW202604005',
    warningType: '内容违规',
    level: '中危',
    storeName: '成都武侯店',
    description: '产品宣传内容与实际不符',
    status: '处理中',
    createTime: '2026-04-01 15:45'
  }
])

// 分页数据
const total = ref(100)

// 弹窗相关
const detailDialogVisible = ref(false)
const noticeDialogVisible = ref(false)
const processDialogVisible = ref(false)
const currentWarning = ref({})
const noticeForm = ref({
  deadline: '',
  requirement: ''
})
const processForm = ref({
  result: '',
  description: ''
})

// 获取预警类型
const getWarningTypeType = (type) => {
  switch (type) {
    case '价格违规': return 'danger'
    case '内容违规': return 'warning'
    case '活动违规': return 'info'
    default: return ''
  }
}

// 获取等级类型
const getLevelType = (level) => {
  switch (level) {
    case '高危': return 'danger'
    case '中危': return 'warning'
    case '低危': return 'success'
    default: return ''
  }
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case '待处理': return 'danger'
    case '处理中': return 'warning'
    case '已解决': return 'success'
    default: return ''
  }
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    warningType: '',
    level: '',
    status: '',
    dateRange: []
  }
}

// 搜索预警
const searchWarnings = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '搜索中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    ElMessage.success('搜索完成')
  }, 1000)
}

// 查看详情
const viewWarningDetail = (row) => {
  currentWarning.value = { ...row }
  detailDialogVisible.value = true
}

// 下发整改通知
const sendNotice = (row) => {
  currentWarning.value = { ...row }
  noticeForm.value = {
    deadline: '',
    requirement: ''
  }
  noticeDialogVisible.value = true
}

// 确认下发整改通知
const confirmNotice = () => {
  if (!noticeForm.value.deadline || !noticeForm.value.requirement) {
    ElMessage.error('请填写所有必填项')
    return
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: '下发中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    // 更新状态
    const index = warningsList.value.findIndex(item => item.id === currentWarning.value.id)
    if (index !== -1) {
      warningsList.value[index].status = '处理中'
    }
    noticeDialogVisible.value = false
    ElMessage.success('整改通知下发成功')
  }, 1000)
}

// 处理预警
const processWarning = (row) => {
  currentWarning.value = { ...row }
  processForm.value = {
    result: 'resolved',
    description: ''
  }
  processDialogVisible.value = true
}

// 确认处理预警
const confirmProcess = () => {
  if (!processForm.value.result || !processForm.value.description) {
    ElMessage.error('请填写所有必填项')
    return
  }
  
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    // 更新状态
    const index = warningsList.value.findIndex(item => item.id === currentWarning.value.id)
    if (index !== -1) {
      warningsList.value[index].status = '已解决'
    }
    processDialogVisible.value = false
    ElMessage.success('预警处理成功')
  }, 1000)
}

// 分页处理
const handleCurrentChange = (current) => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    ElMessage.success(`加载第 ${current} 页数据`)
  }, 1000)
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
.warnings-page {
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

.warning-stats {
  margin-bottom: var(--spacing-md);
}

.stat-card {
  height: 120px;
  transition: all var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: bold;
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.warnings-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warnings-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

.text-danger {
  color: var(--danger-color);
}

.text-warning {
  color: var(--warning-color);
}

.text-success {
  color: var(--success-color);
}

.text-primary {
  color: var(--primary-color);
}

/* 弹窗样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

/* 预警详情样式 */
.warning-detail {
  padding: var(--spacing-sm);
}

.detail-item {
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: flex-start;
}

.detail-item .label {
  width: 100px;
  font-weight: bold;
  color: var(--text-secondary);
}

.detail-item .value {
  flex: 1;
  color: var(--text-primary);
}

.warning-desc {
  flex: 1;
  color: var(--text-primary);
  line-height: 1.5;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .filter-form .el-col {
    --el-col-span: 12;
  }
  
  .warning-stats .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .warnings-page {
    padding: var(--spacing-sm);
  }
  
  .filter-form .el-col {
    --el-col-span: 24;
  }
  
  .warning-stats .el-col {
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
}
</style>