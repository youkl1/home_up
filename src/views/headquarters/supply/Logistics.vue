<template>
  <div class="logistics-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">物流发货跟踪</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="发货状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="待发货" value="pending"></el-option>
                <el-option label="已发货" value="shipped"></el-option>
                <el-option label="配送中" value="delivering"></el-option>
                <el-option label="已签收" value="delivered"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.store" placeholder="所属门店" size="small" class="w-full">
                <el-option label="全部门店" value=""></el-option>
                <el-option label="北京旗舰店" value="beijing1"></el-option>
                <el-option label="上海中心店" value="shanghai1"></el-option>
                <el-option label="广州天河店" value="guangzhou1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="filterForm.trackingNo" placeholder="物流单号" size="small" class="w-full">
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
            <el-button type="primary" size="small" @click="searchLogistics">查询</el-button>
            <el-button type="success" size="small" class="ml-2" @click="syncLogistics">同步物流</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 物流列表 -->
    <div class="logistics-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">发货列表</span>
            <span class="text-secondary">共 {{ total }} 条记录</span>
          </div>
        </template>
        <el-table :data="logisticsList" style="width: 100%" class="logistics-table">
          <el-table-column prop="id" label="发货编号" width="180"></el-table-column>
          <el-table-column prop="orderId" label="关联订单" width="150"></el-table-column>
          <el-table-column prop="storeName" label="所属门店" width="150"></el-table-column>
          <el-table-column prop="customerName" label="客户姓名" width="100"></el-table-column>
          <el-table-column prop="trackingNo" label="物流单号" width="150"></el-table-column>
          <el-table-column prop="logisticsCompany" label="物流公司" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="shipTime" label="发货时间" width="180"></el-table-column>
          <el-table-column prop="estimatedArrival" label="预计送达" width="150"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="viewTracking(scope.row)">物流轨迹</el-button>
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
    title="发货详情"
    width="600px"
  >
    <div class="logistics-detail">
      <div class="detail-item">
        <span class="label">发货编号：</span>
        <span class="value">{{ currentLogistics.id }}</span>
      </div>
      <div class="detail-item">
        <span class="label">关联订单：</span>
        <span class="value">{{ currentLogistics.orderId }}</span>
      </div>
      <div class="detail-item">
        <span class="label">所属门店：</span>
        <span class="value">{{ currentLogistics.storeName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">客户姓名：</span>
        <span class="value">{{ currentLogistics.customerName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">物流单号：</span>
        <span class="value font-semibold">{{ currentLogistics.trackingNo }}</span>
      </div>
      <div class="detail-item">
        <span class="label">物流公司：</span>
        <span class="value">{{ currentLogistics.logisticsCompany }}</span>
      </div>
      <div class="detail-item">
        <span class="label">状态：</span>
        <el-tag :type="getStatusType(currentLogistics.status)">{{ currentLogistics.status }}</el-tag>
      </div>
      <div class="detail-item">
        <span class="label">发货时间：</span>
        <span class="value">{{ currentLogistics.shipTime }}</span>
      </div>
      <div class="detail-item">
        <span class="label">预计送达：</span>
        <span class="value">{{ currentLogistics.estimatedArrival }}</span>
      </div>
    </div>
  </el-dialog>
  
  <!-- 物流轨迹弹窗 -->
  <el-dialog
    v-model="trackingDialogVisible"
    title="物流轨迹"
    width="600px"
  >
    <div class="tracking-content">
      <div class="tracking-header mb-4">
        <div class="tracking-info">
          <div class="font-semibold">{{ currentLogistics.logisticsCompany }}</div>
          <div class="text-secondary">{{ currentLogistics.trackingNo }}</div>
        </div>
        <div class="tracking-status">
          <el-tag :type="getStatusType(currentLogistics.status)">{{ currentLogistics.status }}</el-tag>
        </div>
      </div>
      <div class="tracking-steps">
        <div 
          v-for="(step, index) in trackingSteps" 
          :key="index"
          class="tracking-step"
        >
          <div class="step-icon" :class="{ 'active': step.active }"></div>
          <div class="step-content">
            <div class="step-time">{{ step.time }}</div>
            <div class="step-description">{{ step.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'

const filterForm = ref({
  status: '',
  store: '',
  trackingNo: '',
  dateRange: []
})

const logisticsList = ref([
  {
    id: 'LG202604001',
    orderId: 'PD202604001',
    storeName: '北京旗舰店',
    customerName: '张先生',
    trackingNo: 'SF1234567890',
    logisticsCompany: '顺丰速运',
    status: '配送中',
    shipTime: '2026-04-01 09:00',
    estimatedArrival: '2026-04-03'
  },
  {
    id: 'LG202604002',
    orderId: 'PD202604002',
    storeName: '上海中心店',
    customerName: '李女士',
    trackingNo: 'JD9876543210',
    logisticsCompany: '京东物流',
    status: '已签收',
    shipTime: '2026-03-28 10:30',
    estimatedArrival: '2026-03-30'
  },
  {
    id: 'LG202604003',
    orderId: 'PD202604003',
    storeName: '广州天河店',
    customerName: '王先生',
    trackingNo: 'YT5555666677',
    logisticsCompany: '圆通速递',
    status: '已发货',
    shipTime: '2026-04-01 14:20',
    estimatedArrival: '2026-04-05'
  }
])

const total = ref(100)

const getStatusType = (status) => {
  const map = { '待发货': 'info', '已发货': 'primary', '配送中': 'warning', '已签收': 'success' }
  return map[status] || ''
}

const resetFilter = () => {
  filterForm.value = { status: '', store: '', trackingNo: '', dateRange: [] }
}

// 弹窗相关
const detailDialogVisible = ref(false)
const trackingDialogVisible = ref(false)
const currentLogistics = ref({})

// 物流轨迹
const trackingSteps = ref([
  {
    time: '2026-04-01 09:00',
    description: '包裹已从北京仓库发出',
    active: true
  },
  {
    time: '2026-04-01 12:30',
    description: '包裹已到达北京转运中心',
    active: true
  },
  {
    time: '2026-04-01 18:00',
    description: '包裹已到达上海转运中心',
    active: true
  },
  {
    time: '2026-04-02 08:30',
    description: '包裹已到达上海配送中心',
    active: true
  },
  {
    time: '2026-04-02 10:00',
    description: '快递员正在派送中',
    active: true
  },
  {
    time: '2026-04-02 14:00',
    description: '包裹已签收',
    active: false
  }
])

const searchLogistics = () => {
  console.log('搜索物流:', filterForm.value)
}

const syncLogistics = () => {
  console.log('同步物流')
}

const viewDetail = (row) => {
  currentLogistics.value = { ...row }
  detailDialogVisible.value = true
}

const viewTracking = (row) => {
  currentLogistics.value = { ...row }
  trackingDialogVisible.value = true
}

const handleCurrentChange = (current) => {
  console.log('当前页码:', current)
}

onMounted(() => setTimeout(() => {}, 500))
</script>

<style scoped>
.logistics-page { padding: var(--spacing-md); background-color: var(--bg-color); min-height: 100vh; }
.page-header { margin-bottom: var(--spacing-md); }
.filter-section { margin-bottom: var(--spacing-md); }
.filter-form { padding: var(--spacing-sm); }
.logistics-list { margin-bottom: var(--spacing-md); }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.logistics-table { --el-table-header-bg-color: var(--bg-light); --el-table-header-color: var(--text-secondary); --el-table-row-hover-bg-color: var(--bg-light); }
.pagination { margin-top: var(--spacing-md); display: flex; justify-content: center; }
@media screen and (max-width: 1200px) { .filter-form .el-col { --el-col-span: 12; } }
/* 弹窗样式 */
.logistics-detail {
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

.tracking-content {
  padding: var(--spacing-sm);
}

.tracking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.tracking-info {
  flex: 1;
}

.tracking-steps {
  margin-top: var(--spacing-md);
}

.tracking-step {
  display: flex;
  margin-bottom: var(--spacing-md);
  position: relative;
}

.tracking-step::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 20px;
  bottom: -20px;
  width: 2px;
  background-color: var(--border-color);
  z-index: 1;
}

.tracking-step:last-child::before {
  display: none;
}

.step-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--bg-light);
  border: 2px solid var(--border-color);
  margin-right: var(--spacing-sm);
  position: relative;
  z-index: 2;
}

.step-icon.active {
  background-color: var(--success-color);
  border-color: var(--success-color);
}

.step-content {
  flex: 1;
}

.step-time {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.step-description {
  color: var(--text-primary);
  line-height: 1.4;
}

@media screen and (max-width: 768px) { 
  .logistics-page { padding: var(--spacing-sm); } 
  .filter-form .el-col { --el-col-span: 24; } 
  .filter-actions { flex-direction: column; align-items: flex-start; gap: var(--spacing-sm); }
  .card-header { flex-direction: column; align-items: flex-start; gap: var(--spacing-sm); }
  .detail-item { flex-direction: column; align-items: flex-start; }
  .detail-item .label { width: 100%; margin-bottom: var(--spacing-xs); }
  .tracking-header { flex-direction: column; align-items: flex-start; gap: var(--spacing-sm); }
}

</style>