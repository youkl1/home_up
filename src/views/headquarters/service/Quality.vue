<template>
  <div class="quality-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">服务质量监管</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.region" placeholder="选择区域" size="small" class="w-full">
                <el-option label="全部区域" value=""></el-option>
                <el-option label="华北区" value="north"></el-option>
                <el-option label="华东区" value="east"></el-option>
                <el-option label="华南区" value="south"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.warningType" placeholder="预警类型" size="small" class="w-full">
                <el-option label="全部类型" value=""></el-option>
                <el-option label="工单超时" value="timeout"></el-option>
                <el-option label="客户投诉" value="complaint"></el-option>
                <el-option label="服务差评" value="badreview"></el-option>
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
            <el-button type="primary" size="small" @click="searchQuality">查询</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 预警列表 -->
    <div class="warning-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">服务预警</span>
            <span class="text-secondary">共 {{ total }} 条预警</span>
          </div>
        </template>
        <el-table :data="warningList" style="width: 100%" class="warning-table">
          <el-table-column prop="id" label="预警编号" width="180"></el-table-column>
          <el-table-column prop="warningType" label="预警类型" width="120">
            <template #default="scope">
              <el-tag :type="getWarningType(scope.row.warningType)">
                {{ scope.row.warningType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="orderId" label="关联工单" width="150"></el-table-column>
          <el-table-column prop="customerName" label="客户姓名" width="100"></el-table-column>
          <el-table-column prop="workerName" label="责任师傅" width="100"></el-table-column>
          <el-table-column prop="storeName" label="所属门店" width="120"></el-table-column>
          <el-table-column prop="description" label="预警描述"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewWarningDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="processWarning(scope.row)" v-if="scope.row.status !== '已解决'">处理</el-button>
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
    
    <!-- 师傅评分排行 -->
    <div class="worker-ranking mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">师傅服务评分排行</span>
            <el-radio-group v-model="rankingPeriod" size="small">
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
              <el-radio-button label="quarter">本季度</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <el-table :data="workerRanking" style="width: 100%" class="ranking-table">
          <el-table-column prop="rank" label="排名" width="80">
            <template #default="scope">
              <div class="rank-cell">
                <span v-if="scope.row.rank <= 3" class="top-rank">{{ scope.row.rank }}</span>
                <span v-else>{{ scope.row.rank }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="workerName" label="师傅姓名" width="120"></el-table-column>
          <el-table-column prop="region" label="服务区域"></el-table-column>
          <el-table-column prop="completedOrders" label="完成工单" width="120"></el-table-column>
          <el-table-column prop="rating" label="评分" width="120">
            <template #default="scope">
              <div class="flex items-center">
                <el-icon class="text-warning mr-1"><StarFilled /></el-icon>
                <span class="font-semibold">{{ scope.row.rating }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="satisfactionRate" label="满意度" width="120">
            <template #default="scope">
              <span class="text-success">{{ scope.row.satisfactionRate }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="complaintCount" label="投诉次数" width="120">
            <template #default="scope">
              <span :class="getComplaintClass(scope.row.complaintCount)">
                {{ scope.row.complaintCount }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
    
    <!-- 处理预警弹窗 -->
    <el-dialog
      v-model="warningDialogVisible"
      :title="`处理预警：${warningForm.id}`"
      width="600px"
    >
      <el-form :model="warningForm" label-width="100px">
        <el-form-item label="预警编号">
          <el-input v-model="warningForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="预警类型">
          <el-tag :type="getWarningType(warningForm.type)">{{ warningForm.type }}</el-tag>
        </el-form-item>
        <el-form-item label="关联工单">
          <el-input v-model="warningForm.orderId" disabled></el-input>
        </el-form-item>
        <el-form-item label="责任师傅">
          <el-input v-model="warningForm.workerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="预警原因">
          <el-input v-model="warningForm.reason" type="textarea" :rows="3" disabled></el-input>
        </el-form-item>
        <el-form-item label="处理方式">
          <el-select v-model="warningForm.processMethod" placeholder="选择处理方式">
            <el-option label="电话沟通" value="call"></el-option>
            <el-option label="现场检查" value="inspect"></el-option>
            <el-option label="培训指导" value="train"></el-option>
            <el-option label="警告处罚" value="punish"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input v-model="warningForm.processRemark" type="textarea" :rows="3" placeholder="请输入处理备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="warningDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitWarning">确认处理</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`预警详情：${detailForm.id}`"
      width="800px"
    >
      <div class="detail-header mb-4">
        <div class="flex-between items-center">
          <div>
            <h3 class="font-semibold">{{ detailForm.type }}</h3>
            <p class="text-secondary">预警编号：{{ detailForm.id }}</p>
            <p class="text-secondary">关联工单：{{ detailForm.orderId }}</p>
            <p class="text-secondary">责任师傅：{{ detailForm.workerName }}</p>
          </div>
          <div class="text-right">
            <p class="text-secondary">预警时间</p>
            <p class="font-semibold">{{ detailForm.createTime }}</p>
            <p class="text-secondary mt-2">处理状态</p>
            <el-tag :type="getProcessStatusType(detailForm.processStatus)">{{ detailForm.processStatus }}</el-tag>
          </div>
        </div>
      </div>
      <div class="detail-content">
        <el-form label-width="100px">
          <el-form-item label="预警原因">
            <el-input v-model="detailForm.reason" type="textarea" :rows="3" disabled></el-input>
          </el-form-item>
          <el-form-item label="处理方式" v-if="detailForm.processMethod">
            <el-input v-model="detailForm.processMethod" disabled></el-input>
          </el-form-item>
          <el-form-item label="处理备注" v-if="detailForm.processRemark">
            <el-input v-model="detailForm.processRemark" type="textarea" :rows="3" disabled></el-input>
          </el-form-item>
          <el-form-item label="处理时间" v-if="detailForm.processTime">
            <el-input v-model="detailForm.processTime" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { StarFilled } from '@element-plus/icons-vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

// 筛选表单
const filterForm = ref({
  region: '',
  warningType: '',
  status: '',
  dateRange: []
})

// 弹窗相关
const warningDialogVisible = ref(false)
const detailDialogVisible = ref(false)

// 处理预警表单
const warningForm = ref({
  id: '',
  type: '',
  orderId: '',
  customerName: '',
  workerName: '',
  reason: '',
  processMethod: '',
  processRemark: ''
})

// 详情表单
const detailForm = ref({
  id: '',
  type: '',
  orderId: '',
  customerName: '',
  workerName: '',
  reason: '',
  createTime: '',
  processStatus: '',
  processMethod: '',
  processRemark: '',
  processTime: ''
})

// 预警列表
const warningList = ref([
  {
    id: 'WR202604001',
    warningType: '工单超时',
    orderId: 'WO202604001',
    customerName: '张先生',
    workerName: '张师傅',
    storeName: '北京旗舰店',
    description: '工单已超时24小时未完成',
    status: '待处理',
    createTime: '2026-04-01 09:00'
  },
  {
    id: 'WR202604002',
    warningType: '客户投诉',
    orderId: 'WO202604002',
    customerName: '李女士',
    workerName: '李师傅',
    storeName: '上海中心店',
    description: '客户投诉服务态度问题',
    status: '处理中',
    createTime: '2026-04-01 10:30'
  },
  {
    id: 'WR202604003',
    warningType: '服务差评',
    orderId: 'WO202604003',
    customerName: '王先生',
    workerName: '王师傅',
    storeName: '广州天河店',
    description: '客户给出1星差评',
    status: '已解决',
    createTime: '2026-04-01 11:15'
  }
])

// 分页数据
const total = ref(50)

// 排行周期
const rankingPeriod = ref('month')

// 师傅排行
const workerRanking = ref([
  {
    rank: 1,
    workerName: '张师傅',
    region: '北京市朝阳区',
    completedOrders: 156,
    rating: '4.9',
    satisfactionRate: '98',
    complaintCount: 0
  },
  {
    rank: 2,
    workerName: '李师傅',
    region: '上海市浦东新区',
    completedOrders: 142,
    rating: '4.8',
    satisfactionRate: '96',
    complaintCount: 1
  },
  {
    rank: 3,
    workerName: '王师傅',
    region: '广州市天河区',
    completedOrders: 138,
    rating: '4.8',
    satisfactionRate: '95',
    complaintCount: 0
  },
  {
    rank: 4,
    workerName: '赵师傅',
    region: '深圳市南山区',
    completedOrders: 125,
    rating: '4.6',
    satisfactionRate: '93',
    complaintCount: 2
  },
  {
    rank: 5,
    workerName: '刘师傅',
    region: '成都市武侯区',
    completedOrders: 118,
    rating: '4.5',
    satisfactionRate: '92',
    complaintCount: 1
  }
])

// 获取预警类型
const getWarningType = (type) => {
  switch (type) {
    case '工单超时': return 'danger'
    case '客户投诉': return 'warning'
    case '服务差评': return 'info'
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

// 获取投诉次数样式
const getComplaintClass = (count) => {
  return count > 0 ? 'text-danger' : 'text-success'
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    region: '',
    warningType: '',
    status: '',
    dateRange: []
  }
  ElMessage.info('筛选条件已重置')
}

// 搜索预警
const searchQuality = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索预警...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredList = warningList.value.filter(item => {
      const typeMatch = !filterForm.value.warningType || item.warningType === filterForm.value.warningType
      const statusMatch = !filterForm.value.status || item.status === filterForm.value.status
      return typeMatch && statusMatch
    })
    
    total.value = filteredList.length
    
    if (filteredList.length > 0) {
      ElMessage.success(`找到 ${filteredList.length} 条预警`)
    } else {
      ElMessage.info('未找到匹配的预警')
    }
    loading.close()
  }, 500)
}

// 查看详情
const viewWarningDetail = (row) => {
  // 填充详情表单
  detailForm.value = {
    id: row.id,
    type: row.warningType,
    orderId: row.orderId,
    customerName: row.customerName,
    workerName: row.workerName,
    reason: row.description,
    createTime: row.createTime,
    processStatus: row.status,
    processMethod: row.status === '已解决' ? '电话沟通' : '',
    processRemark: row.status === '已解决' ? '已与师傅沟通，问题已解决' : '',
    processTime: row.status === '已解决' ? '2026-04-01 15:00' : ''
  }
  detailDialogVisible.value = true
}

// 处理预警
const processWarning = (row) => {
  // 填充处理预警表单
  warningForm.value = {
    id: row.id,
    type: row.warningType,
    orderId: row.orderId,
    customerName: row.customerName,
    workerName: row.workerName,
    reason: row.description,
    processMethod: '',
    processRemark: ''
  }
  warningDialogVisible.value = true
}

// 提交处理预警
const submitWarning = () => {
  // 表单验证
  if (!warningForm.value.processMethod) {
    ElMessage.error('请选择处理方式')
    return
  }
  if (!warningForm.value.processRemark) {
    ElMessage.error('请输入处理备注')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在处理预警...' })
  
  setTimeout(() => {
    const index = warningList.value.findIndex(item => item.id === warningForm.value.id)
    if (index !== -1) {
      warningList.value[index].status = '已解决'
      ElMessage.success('预警处理成功')
    }
    
    warningDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 分页处理
const handleCurrentChange = (current) => {
  // 模拟API调用延迟
  const loading = ElLoading.service({ text: '正在加载数据...' })
  
  setTimeout(() => {
    // 实际项目中这里应该调用API获取对应页的数据
    ElMessage.success(`切换到第 ${current} 页`)
    loading.close()
  }, 300)
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
.quality-page {
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

.warning-list,
.worker-ranking {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warning-table,
.ranking-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

.rank-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-rank {
  width: 24px;
  height: 24px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.text-warning {
  color: var(--warning-color);
}

.text-success {
  color: var(--success-color);
}

.text-danger {
  color: var(--danger-color);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .filter-form .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .quality-page {
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
}
</style>