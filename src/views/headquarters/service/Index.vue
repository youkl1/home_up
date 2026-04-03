<template>
  <div class="service-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">服务总览</h1>
    </div>
    
    <!-- 服务概览 -->
    <div class="service-overview mb-6">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-primary-light text-primary mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                🛠️
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ totalOrders }}</div>
              <div class="data-label text-secondary">总工单</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-success-light text-success mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                ✅
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ completedOrders }}</div>
              <div class="data-label text-secondary">已完成</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-warning-light text-warning mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                ⏳
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ pendingOrders }}</div>
              <div class="data-label text-secondary">待处理</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item flex flex-col items-center justify-center h-full">
              <div class="data-icon bg-danger-light text-danger mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                ⭐
              </div>
              <div class="data-value text-2xl font-bold text-title mb-2">{{ avgRating }}</div>
              <div class="data-label text-secondary">平均评分</div>
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
    
    <!-- 工单趋势 -->
    <div class="order-trend mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">工单趋势</span>
          </div>
        </template>
        <div class="chart-container bg-light rounded-lg h-64">
          <div ref="orderTrendChart" class="w-full h-full"></div>
        </div>
      </el-card>
    </div>
    
    <!-- 服务质量 -->
    <div class="service-quality mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">服务质量</span>
          </div>
        </template>
        <div class="quality-grid">
          <div class="quality-item">
            <div class="quality-value">{{ onTimeRate }}%</div>
            <div class="quality-label">准时率</div>
          </div>
          <div class="quality-item">
            <div class="quality-value">{{ satisfactionRate }}%</div>
            <div class="quality-label">满意度</div>
          </div>
          <div class="quality-item">
            <div class="quality-value">{{ complaintRate }}%</div>
            <div class="quality-label">投诉率</div>
          </div>
          <div class="quality-item">
            <div class="quality-value">{{ completionRate }}%</div>
            <div class="quality-label">完成率</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 模拟数据
const totalOrders = ref('1,256')
const completedOrders = ref('1,128')
const pendingOrders = ref('128')
const avgRating = ref('4.8')

// 时间范围
const timeRange = ref('30d')
const dateRange = ref([])

// 服务质量数据
const onTimeRate = ref('95.2')
const satisfactionRate = ref('92.8')
const complaintRate = ref('1.2')
const completionRate = ref('98.5')

// 图表引用
const orderTrendChart = ref(null)
let chartInstance = null

// 工单趋势数据
const orderTrendData = {
  dates: ['1月', '2月', '3月', '4月', '5月', '6月'],
  completed: [120, 132, 101, 134, 90, 230],
  pending: [20, 32, 41, 34, 50, 30]
}

// 初始化图表
const initChart = () => {
  if (orderTrendChart.value) {
    const chartDom = orderTrendChart.value
    
    // 确保DOM元素有尺寸
    const checkSize = () => {
      if (chartDom.clientWidth > 0 && chartDom.clientHeight > 0) {
        chartInstance = echarts.init(chartDom)
        setChartOption()
        return true
      }
      return false
    }
    
    // 立即检查
    if (checkSize()) {
      return
    }
    
    // 使用ResizeObserver监听尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      if (checkSize()) {
        resizeObserver.disconnect()
      }
    })
    resizeObserver.observe(chartDom)
    
    // 添加超时处理，防止ResizeObserver不触发
    setTimeout(() => {
      if (!chartInstance && chartDom.clientWidth > 0 && chartDom.clientHeight > 0) {
        chartInstance = echarts.init(chartDom)
        setChartOption()
        resizeObserver.disconnect()
      }
    }, 1000)
  }
}

// 设置图表选项
const setChartOption = () => {
  if (chartInstance) {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['已完成', '待处理'],
        top: '3%',
        left: 'center'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: orderTrendData.dates,
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '已完成',
          type: 'bar',
          data: orderTrendData.completed,
          itemStyle: {
            color: '#409eff'
          }
        },
        {
          name: '待处理',
          type: 'bar',
          data: orderTrendData.pending,
          itemStyle: {
            color: '#e6a23c'
          }
        }
      ]
    }
    chartInstance.setOption(option)
  }
}

// 响应式调整
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
    nextTick(() => {
      initChart()
      window.addEventListener('resize', handleResize)
    })
  }, 500)
})

// 组件卸载
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.service-page {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.service-overview {
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

.order-trend,
.service-quality {
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

.quality-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

.quality-item {
  text-align: center;
  padding: var(--spacing-md);
  background-color: #F9FAFC;
  border-radius: var(--border-radius-md);
}

.quality-value {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.quality-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .service-overview .el-col {
    --el-col-span: 12;
  }
  
  .quality-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .service-page {
    padding: var(--spacing-sm);
  }
  
  .service-overview .el-col {
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
  
  .quality-grid {
    grid-template-columns: 1fr;
  }
}
</style>