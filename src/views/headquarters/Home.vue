<template>
  <div class="headquarters-home">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">总部运营首页</h1>
    </div>
    
    <!-- 数据概览 -->
    <div class="data-overview mb-6">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-primary-light text-primary mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                ¥
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ totalSales }}</div>
              <div class="data-label text-secondary">总销售额</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-success-light text-success mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                👥
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ totalCustomers }}</div>
              <div class="data-label text-secondary">总客户数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-warning-light text-warning mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                🏪
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ totalStores }}</div>
              <div class="data-label text-secondary">门店数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-danger-light text-danger mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                👨‍💼
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ totalStaff }}</div>
              <div class="data-label text-secondary">员工数</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 销售趋势 -->
    <div class="sales-trend mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">销售趋势</span>
            <el-select v-model="timeRange" size="small" class="time-select" @change="updateChart">
              <el-option label="近7天" value="7d"></el-option>
              <el-option label="近30天" value="30d"></el-option>
              <el-option label="近90天" value="90d"></el-option>
              <el-option label="近1年" value="1y"></el-option>
            </el-select>
          </div>
        </template>
        <div class="chart-container bg-light rounded-lg h-64">
          <div ref="salesChartRef" class="w-full h-full"></div>
        </div>
      </el-card>
    </div>
    
    <!-- 门店销售排行 -->
    <div class="store-ranking mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">门店销售排行</span>
            <el-select v-model="rankingType" size="small" class="ranking-select">
              <el-option label="按销售额" value="sales"></el-option>
              <el-option label="按客户数" value="customers"></el-option>
            </el-select>
          </div>
        </template>
        <el-table :data="storeRanking" style="width: 100%" class="ranking-table">
          <el-table-column prop="rank" label="排名" width="80"></el-table-column>
          <el-table-column prop="storeName" label="门店名称"></el-table-column>
          <el-table-column prop="sales" label="销售额" width="150">
            <template #default="scope">
              <span class="text-danger font-semibold">{{ scope.row.sales }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customers" label="客户数" width="100"></el-table-column>
          <el-table-column prop="growthRate" label="增长率" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.growthRate.includes('+') ? 'success' : 'danger'" class="growth-tag">
                {{ scope.row.growthRate }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    
    <!-- 业务数据看板 -->
    <div class="business-dashboard mb-6">
      <el-row :gutter="20">
        <!-- 财务数据 -->
        <el-col :span="8">
          <el-card shadow="hover" class="card transition-all">
            <template #header>
              <div class="card-header">
                <span class="font-semibold text-title">财务数据</span>
              </div>
            </template>
            <div class="dashboard-content">
              <div class="metric-item">
                <div class="metric-value">{{ financialData.totalRevenue }}</div>
                <div class="metric-label">总收入</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ financialData.totalExpense }}</div>
                <div class="metric-label">总支出</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ financialData.profitMargin }}</div>
                <div class="metric-label">利润率</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 供应链数据 -->
        <el-col :span="8">
          <el-card shadow="hover" class="card transition-all">
            <template #header>
              <div class="card-header">
                <span class="font-semibold text-title">供应链数据</span>
              </div>
            </template>
            <div class="dashboard-content">
              <div class="metric-item">
                <div class="metric-value">{{ supplyData.totalInventory }}</div>
                <div class="metric-label">总库存</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ supplyData.pendingOrders }}</div>
                <div class="metric-label">待处理订单</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ supplyData.averageDeliveryTime }}</div>
                <div class="metric-label">平均交付时间</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 安装服务数据 -->
        <el-col :span="8">
          <el-card shadow="hover" class="card transition-all">
            <template #header>
              <div class="card-header">
                <span class="font-semibold text-title">安装服务数据</span>
              </div>
            </template>
            <div class="dashboard-content">
              <div class="metric-item">
                <div class="metric-value">{{ serviceData.totalWorkOrders }}</div>
                <div class="metric-label">总工单数</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ serviceData.completionRate }}</div>
                <div class="metric-label">完成率</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ serviceData.averageRating }}</div>
                <div class="metric-label">平均评分</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 模拟数据
const totalSales = ref('¥1,285,000')
const totalCustomers = ref('1,560')
const totalStores = ref('25')
const totalStaff = ref('120')

// 时间范围
const timeRange = ref('30d')
// 排行类型
const rankingType = ref('sales')

// 图表引用
const salesChartRef = ref(null)
// 图表实例
let salesChart = null

// 门店销售排行
const storeRanking = ref([
  { rank: 1, storeName: '北京旗舰店', sales: '¥128,500', customers: 156, growthRate: '+12.5%' },
  { rank: 2, storeName: '上海中心店', sales: '¥105,200', customers: 128, growthRate: '+8.2%' },
  { rank: 3, storeName: '广州天河店', sales: '¥98,600', customers: 112, growthRate: '+5.8%' },
  { rank: 4, storeName: '深圳南山店', sales: '¥89,300', customers: 98, growthRate: '+3.2%' },
  { rank: 5, storeName: '成都武侯店', sales: '¥76,500', customers: 85, growthRate: '-1.5%' }
])

// 财务数据
const financialData = ref({
  totalRevenue: '¥1,285,000',
  totalExpense: '¥860,000',
  profitMargin: '33.1%'
})

// 供应链数据
const supplyData = ref({
  totalInventory: '12,500',
  pendingOrders: '156',
  averageDeliveryTime: '3.2天'
})

// 安装服务数据
const serviceData = ref({
  totalWorkOrders: '856',
  completionRate: '98.2%',
  averageRating: '4.8/5.0'
})

// 模拟销售趋势数据
const getSalesData = () => {
  return {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
    data: [120000, 190000, 300000, 250000, 360000, 420000]
  }
}

// 初始化销售趋势图表
const initSalesChart = () => {
  if (!salesChartRef.value) return
  
  salesChart = echarts.init(salesChartRef.value)
  const data = getSalesData()
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: ['销售额']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: data.categories,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '金额',
        min: 0,
        max: 500000,
        interval: 100000,
        axisLabel: {
          formatter: '¥{value}'
        }
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'bar',
        data: data.data,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#409EFF'
            },
            {
              offset: 1,
              color: '#66B1FF'
            }
          ])
        }
      }
    ]
  }
  salesChart.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  if (salesChart) {
    salesChart.resize()
  }
}

// 更新图表
const updateChart = () => {
  // 模拟数据更新
  nextTick(() => {
    initSalesChart()
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
    nextTick(() => {
      initSalesChart()
    })
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  }, 500)
})

// 组件卸载
onUnmounted(() => {
  if (salesChart) {
    salesChart.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.headquarters-home {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.data-overview {
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

.sales-trend {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 320px;
  background-color: var(--bg-light);
  border-radius: var(--border-radius-md);
  position: relative;
}

.chart-container > div {
  width: 100%;
  height: 100%;
}

.chart-placeholder {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
}

.store-ranking {
  margin-bottom: var(--spacing-md);
}

.ranking-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.growth-tag {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
}

.business-dashboard {
  margin-bottom: var(--spacing-md);
}

.dashboard-content {
  padding: var(--spacing-md) 0;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--border-color);
}

.metric-item:last-child {
  border-bottom: none;
}

.metric-value {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--text-title);
}

.metric-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .data-overview .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .headquarters-home {
    padding: var(--spacing-sm);
  }
  
  .data-overview .el-col {
    --el-col-span: 24;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>