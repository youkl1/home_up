<template>
  <div class="supply-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">供应链总览</h1>
    </div>
    
    <!-- 供应链概览 -->
    <div class="supply-overview mb-6">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-primary-light text-primary mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                🏭
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ totalOrders }}</div>
              <div class="data-label text-secondary">生产订单</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-success-light text-success mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                📦
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ totalInventory }}</div>
              <div class="data-label text-secondary">库存总量</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-warning-light text-warning mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                🚚
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ shippingOrders }}</div>
              <div class="data-label text-secondary">发货中</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-info-light text-info mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                🤝
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ supplierCount }}</div>
              <div class="data-label text-secondary">供应商</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 时间筛选 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="flex-between items-center">
          <span class="font-semibold text-title">数据筛选</span>
          <div class="filter-buttons">
            <el-select v-model="timeRange" size="small" class="mr-4">
              <el-option label="近7天" value="7d"></el-option>
              <el-option label="近30天" value="30d"></el-option>
              <el-option label="近90天" value="90d"></el-option>
              <el-option label="近1年" value="1y"></el-option>
            </el-select>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
            />
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 生产进度概览 -->
    <div class="production-overview mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">生产进度概览</span>
          </div>
        </template>
        <div class="production-stats">
          <el-row :gutter="20">
            <el-col :span="4" v-for="stat in productionStats" :key="stat.name">
              <div class="stat-box text-center p-4">
                <div class="stat-number text-2xl font-bold" :class="stat.color">{{ stat.value }}</div>
                <div class="stat-name text-secondary mt-2">{{ stat.name }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    
    <!-- 库存预警 -->
    <div class="inventory-warning mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">库存预警</span>
            <el-button type="primary" size="small" @click="viewAllWarnings">查看全部</el-button>
          </div>
        </template>
        <el-table :data="inventoryWarnings" style="width: 100%" class="warning-table">
          <el-table-column prop="productName" label="产品名称"></el-table-column>
          <el-table-column prop="warehouse" label="仓库" width="150"></el-table-column>
          <el-table-column prop="currentStock" label="当前库存" width="120">
            <template #default="scope">
              <span :class="scope.row.currentStock < scope.row.threshold ? 'text-danger font-semibold' : ''">
                {{ scope.row.currentStock }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="threshold" label="预警阈值" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.currentStock < scope.row.threshold ? 'danger' : 'success'">
                {{ scope.row.currentStock < scope.row.threshold ? '库存不足' : '正常' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button size="small" @click="viewWarningDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
  
  <!-- 预警详情弹窗 -->
  <el-dialog
    v-model="warningDetailVisible"
    title="库存预警详情"
    width="500px"
  >
    <div class="warning-detail">
      <div class="detail-item">
        <span class="label">产品名称：</span>
        <span class="value">{{ currentWarning.productName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">仓库：</span>
        <span class="value">{{ currentWarning.warehouse }}</span>
      </div>
      <div class="detail-item">
        <span class="label">当前库存：</span>
        <span :class="currentWarning.currentStock < currentWarning.threshold ? 'text-danger font-semibold' : 'text-success font-semibold'">
          {{ currentWarning.currentStock }}
        </span>
      </div>
      <div class="detail-item">
        <span class="label">预警阈值：</span>
        <span class="value">{{ currentWarning.threshold }}</span>
      </div>
      <div class="detail-item">
        <span class="label">状态：</span>
        <el-tag :type="currentWarning.currentStock < currentWarning.threshold ? 'danger' : 'success'">
          {{ currentWarning.currentStock < currentWarning.threshold ? '库存不足' : '正常' }}
        </el-tag>
      </div>
      <div class="detail-item">
        <span class="label">预警时间：</span>
        <span class="value">{{ currentWarning.warningTime || '2026-04-01 09:00' }}</span>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="warningDetailVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleWarning">处理预警</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// 模拟数据
const totalOrders = ref('1,256')
const totalInventory = ref('58,600')
const shippingOrders = ref('128')
const supplierCount = ref('45')

// 时间范围
const timeRange = ref('30d')
const dateRange = ref([])

// 生产统计
const productionStats = ref([
  { name: '待生产', value: '156', color: 'text-secondary' },
  { name: '生产中', value: '423', color: 'text-primary' },
  { name: '待质检', value: '89', color: 'text-warning' },
  { name: '质检中', value: '67', color: 'text-info' },
  { name: '待发货', value: '234', color: 'text-success' },
  { name: '已发货', value: '287', color: 'text-primary' }
])

// 库存预警
const inventoryWarnings = ref([
  {
    productName: '现代简约橱柜-白色',
    warehouse: '北京总仓',
    currentStock: 45,
    threshold: 100
  },
  {
    productName: '欧式古典橱柜-红木',
    warehouse: '上海分仓',
    currentStock: 78,
    threshold: 80
  },
  {
    productName: '推拉门衣柜-镜面',
    warehouse: '广州分仓',
    currentStock: 23,
    threshold: 50
  },
  {
    productName: '平开门衣柜-实木',
    warehouse: '成都分仓',
    currentStock: 156,
    threshold: 100
  }
])

// 弹窗相关
const warningDetailVisible = ref(false)
const currentWarning = ref({})

// 查看预警详情
const viewWarningDetail = (row) => {
  currentWarning.value = { ...row }
  warningDetailVisible.value = true
}

// 查看全部预警
const viewAllWarnings = () => {
  // 跳转到库存管理页面
  router.push('/headquarters/supply/inventory')
  console.log('查看全部预警')
}

// 处理预警
const handleWarning = () => {
  console.log('处理预警:', currentWarning.value)
  // 这里可以调用接口处理预警
  warningDetailVisible.value = false
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
.supply-page {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.supply-overview {
  margin-bottom: var(--spacing-md);
}

.data-card {
  height: 200px;
  transition: all var(--transition-normal);
}

.data-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.data-item {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.data-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
}

.data-value {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--text-title);
  margin: 0 0 var(--spacing-xs) 0;
}

.data-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.filter-section {
  margin-bottom: var(--spacing-md);
}

.filter-buttons {
  display: flex;
  align-items: center;
}

.production-overview,
.inventory-warning {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-box {
  background-color: var(--bg-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.stat-number {
  font-size: var(--font-size-xl);
  font-weight: bold;
}

.stat-name {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.warning-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.text-primary {
  color: var(--primary-color);
}

.text-success {
  color: var(--success-color);
}

.text-warning {
  color: var(--warning-color);
}

.text-danger {
  color: var(--danger-color);
}

.text-info {
  color: var(--info-color);
}

.text-secondary {
  color: var(--text-secondary);
}

/* 预警详情弹窗样式 */
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .supply-overview .el-col {
    --el-col-span: 12;
  }
  
  .production-stats .el-col {
    --el-col-span: 8;
  }
}

@media screen and (max-width: 768px) {
  .supply-page {
    padding: var(--spacing-sm);
  }
  
  .supply-overview .el-col {
    --el-col-span: 24;
  }
  
  .production-stats .el-col {
    --el-col-span: 12;
  }
  
  .filter-buttons {
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