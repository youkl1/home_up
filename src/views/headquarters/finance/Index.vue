<template>
  <div class="finance-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">财务总览</h1>
    </div>
    
    <!-- 财务概览 -->
    <div class="finance-overview mb-6">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-primary-light text-primary mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                ¥
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ totalRevenue }}</div>
              <div class="data-label text-secondary">平台营收</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-success-light text-success mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                ¥
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ reconciliationAmount }}</div>
              <div class="data-label text-secondary">门店对账</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-warning-light text-warning mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                ¥
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ depositAmount }}</div>
              <div class="data-label text-secondary">保证金总额</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-danger-light text-danger mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                ¥
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ invoiceAmount }}</div>
              <div class="data-label text-secondary">发票总额</div>
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
            <el-select v-model="timeRange" size="small" class="mr-4" @change="updateCharts">
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
              @change="updateCharts"
            />
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 营收趋势 -->
    <div class="revenue-trend mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">营收趋势</span>
          </div>
        </template>
        <div class="chart-container bg-light rounded-lg h-64">
          <div ref="revenueChartRef" class="w-full h-full"></div>
        </div>
      </el-card>
    </div>
    
    <!-- 区域分布 -->
    <div class="region-distribution mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">区域分布</span>
          </div>
        </template>
        <div class="chart-container bg-light rounded-lg h-64">
          <div ref="regionChartRef" class="w-full h-full"></div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 模拟数据
const totalRevenue = ref('¥12,850,000')
const reconciliationAmount = ref('¥8,620,000')
const depositAmount = ref('¥3,250,000')
const invoiceAmount = ref('¥9,850,000')

// 时间范围
const timeRange = ref('30d')
const dateRange = ref([])

// 图表引用
const revenueChartRef = ref(null)
const regionChartRef = ref(null)

// 图表实例
let revenueChart = null
let regionChart = null

// 模拟营收趋势数据
const getRevenueData = () => {
  return {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
    data: [1200000, 1900000, 3000000, 2500000, 3600000, 4200000]
  }
}

// 模拟区域分布数据
const getRegionData = () => {
  return {
    regions: ['华东', '华北', '华南', '西南', '西北', '东北'],
    data: [4500000, 3200000, 2800000, 1500000, 1000000, 850000]
  }
}

// 初始化营收趋势图表
const initRevenueChart = () => {
  if (!revenueChartRef.value) return
  
  revenueChart = echarts.init(revenueChartRef.value)
  const data = getRevenueData()
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
      data: ['营收']
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
        max: 5000000,
        interval: 1000000,
        axisLabel: {
          formatter: '¥{value}'
        }
      }
    ],
    series: [
      {
        name: '营收',
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
  revenueChart.setOption(option)
}

// 初始化区域分布图表
const initRegionChart = () => {
  if (!regionChartRef.value) return
  
  regionChart = echarts.init(regionChartRef.value)
  const data = getRegionData()
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '区域分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.regions.map((region, index) => {
          return {
            value: data.data[index],
            name: region
          }
        })
      }
    ]
  }
  regionChart.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  if (revenueChart) {
    revenueChart.resize()
  }
  if (regionChart) {
    regionChart.resize()
  }
}

// 更新图表
const updateCharts = () => {
  // 模拟数据更新
  nextTick(() => {
    initRevenueChart()
    initRegionChart()
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
    nextTick(() => {
      initRevenueChart()
      initRegionChart()
    })
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  }, 500)
})

// 组件卸载
onUnmounted(() => {
  if (revenueChart) {
    revenueChart.dispose()
  }
  if (regionChart) {
    regionChart.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.finance-page {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.finance-overview {
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

.revenue-trend,
.region-distribution {
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

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .finance-overview .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .finance-page {
    padding: var(--spacing-sm);
  }
  
  .finance-overview .el-col {
    --el-col-span: 24;
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