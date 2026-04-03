<template>
  <div class="store-dashboard">
    <div class="page-header">
      <h1>门店经营数据看板</h1>
      <div class="header-actions">
        <el-radio-group v-model="timeRange" size="small">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
          <el-radio-button label="quarter">本季</el-radio-button>
          <el-radio-button label="year">本年</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="customDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          style="margin-left: 10px; width: 220px"
        />
        <el-button type="primary" size="small" @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 核心经营指标 -->
    <div class="section">
      <div class="section-title">
        <span>核心经营指标</span>
        <el-tooltip content="数据每小时更新一次" placement="top">
          <el-icon><InfoFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card primary">
          <div class="kpi-icon">
            <el-icon><Money /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">营业收入</div>
            <div class="kpi-value">¥{{ kpiData.revenue }}</div>
            <div class="kpi-trend" :class="kpiData.revenueTrend >= 0 ? 'up' : 'down'">
              <el-icon><ArrowUp v-if="kpiData.revenueTrend >= 0" /><ArrowDown v-else /></el-icon>
              {{ Math.abs(kpiData.revenueTrend) }}%
              <span class="compare">环比</span>
            </div>
          </div>
        </div>
        <div class="kpi-card success">
          <div class="kpi-icon">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">订单完成数</div>
            <div class="kpi-value">{{ kpiData.orders }}</div>
            <div class="kpi-trend" :class="kpiData.ordersTrend >= 0 ? 'up' : 'down'">
              <el-icon><ArrowUp v-if="kpiData.ordersTrend >= 0" /><ArrowDown v-else /></el-icon>
              {{ Math.abs(kpiData.ordersTrend) }}%
              <span class="compare">环比</span>
            </div>
          </div>
        </div>
        <div class="kpi-card warning">
          <div class="kpi-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">新增客户</div>
            <div class="kpi-value">{{ kpiData.newCustomers }}</div>
            <div class="kpi-trend" :class="kpiData.customersTrend >= 0 ? 'up' : 'down'">
              <el-icon><ArrowUp v-if="kpiData.customersTrend >= 0" /><ArrowDown v-else /></el-icon>
              {{ Math.abs(kpiData.customersTrend) }}%
              <span class="compare">环比</span>
            </div>
          </div>
        </div>
        <div class="kpi-card danger">
          <div class="kpi-icon">
            <el-icon><ShoppingCart /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">客单价</div>
            <div class="kpi-value">¥{{ kpiData.avgOrderValue }}</div>
            <div class="kpi-trend" :class="kpiData.avgTrend >= 0 ? 'up' : 'down'">
              <el-icon><ArrowUp v-if="kpiData.avgTrend >= 0" /><ArrowDown v-else /></el-icon>
              {{ Math.abs(kpiData.avgTrend) }}%
              <span class="compare">环比</span>
            </div>
          </div>
        </div>
        <div class="kpi-card info">
          <div class="kpi-icon">
            <el-icon><Star /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">客户满意度</div>
            <div class="kpi-value">{{ kpiData.satisfaction }}%</div>
            <div class="kpi-trend" :class="kpiData.satisfactionTrend >= 0 ? 'up' : 'down'">
              <el-icon><ArrowUp v-if="kpiData.satisfactionTrend >= 0" /><ArrowDown v-else /></el-icon>
              {{ Math.abs(kpiData.satisfactionTrend) }}%
              <span class="compare">环比</span>
            </div>
          </div>
        </div>
        <div class="kpi-card purple">
          <div class="kpi-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">转化率</div>
            <div class="kpi-value">{{ kpiData.conversion }}%</div>
            <div class="kpi-trend" :class="kpiData.conversionTrend >= 0 ? 'up' : 'down'">
              <el-icon><ArrowUp v-if="kpiData.conversionTrend >= 0" /><ArrowDown v-else /></el-icon>
              {{ Math.abs(kpiData.conversionTrend) }}%
              <span class="compare">环比</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-row">
      <!-- 营收趋势图 -->
      <div class="chart-card">
        <div class="chart-header">
          <span class="chart-title">营收趋势</span>
          <el-radio-group v-model="revenueChartType" size="small">
            <el-radio-button label="day">按日</el-radio-button>
            <el-radio-button label="week">按周</el-radio-button>
            <el-radio-button label="month">按月</el-radio-button>
          </el-radio-group>
        </div>
        <div ref="revenueChartRef" class="chart-container"></div>
      </div>

      <!-- 订单来源分布 -->
      <div class="chart-card">
        <div class="chart-header">
          <span class="chart-title">订单来源分布</span>
        </div>
        <div ref="sourceChartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 团队业绩排行 -->
    <div class="section">
      <div class="section-title">团队业绩排行</div>
      <div class="performance-section">
        <div class="performance-tabs">
          <el-radio-group v-model="performanceType" size="small">
            <el-radio-button label="revenue">销售额排行</el-radio-button>
            <el-radio-button label="orders">订单量排行</el-radio-button>
            <el-radio-button label="customers">客户开发排行</el-radio-button>
            <el-radio-button label="conversion">转化率排行</el-radio-button>
          </el-radio-group>
        </div>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-table :data="performanceList" stripe v-loading="performanceLoading">
              <el-table-column type="index" label="排名" width="80" align="center">
                <template #default="{ $index }">
                  <div class="rank-cell" :class="`rank-${$index + 1}`">
                    {{ $index + 1 }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="员工" min-width="150">
                <template #default="{ row }">
                  <div class="employee-cell">
                    <el-avatar :size="40" :src="row.avatar" />
                    <div class="employee-info">
                      <div class="name">{{ row.name }}</div>
                      <div class="role">{{ row.role }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="销售额" width="150">
                <template #default="{ row }">
                  <span class="amount">¥{{ row.revenue }}</span>
                </template>
              </el-table-column>
              <el-table-column label="订单数" width="100" align="center">
                <template #default="{ row }">
                  {{ row.orders }}
                </template>
              </el-table-column>
              <el-table-column label="新增客户" width="100" align="center">
                <template #default="{ row }">
                  {{ row.newCustomers }}
                </template>
              </el-table-column>
              <el-table-column label="转化率" width="100" align="center">
                <template #default="{ row }">
                  <el-progress :percentage="row.conversion" :color="getProgressColor(row.conversion)" />
                </template>
              </el-table-column>
              <el-table-column label="目标完成率" width="120" align="center">
                <template #default="{ row }">
                  <div class="target-rate" :class="getTargetClass(row.targetRate)">
                    {{ row.targetRate }}%
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="8">
            <div class="top-performer">
              <div class="top-title">🏆 本月销冠</div>
              <div class="top-card" v-if="topPerformer">
                <el-avatar :size="80" :src="topPerformer.avatar" />
                <div class="top-name">{{ topPerformer.name }}</div>
                <div class="top-role">{{ topPerformer.role }}</div>
                <div class="top-stats">
                  <div class="stat">
                    <div class="value">¥{{ topPerformer.revenue }}</div>
                    <div class="label">销售额</div>
                  </div>
                  <div class="stat">
                    <div class="value">{{ topPerformer.orders }}</div>
                    <div class="label">订单数</div>
                  </div>
                </div>
                <el-tag type="success" size="large">目标完成 {{ topPerformer.targetRate }}%</el-tag>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 营销效果分析 -->
    <div class="section">
      <div class="section-title">营销效果分析</div>
      <div class="marketing-analysis">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="analysis-card">
              <div class="card-title">活动效果对比</div>
              <div ref="marketingChartRef" class="chart-container"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="analysis-card">
              <div class="card-title">营销ROI分析</div>
              <div class="roi-list">
                <div class="roi-item" v-for="item in roiList" :key="item.channel">
                  <div class="roi-info">
                    <div class="channel">{{ item.channel }}</div>
                    <div class="spend">投入 ¥{{ item.spend }}</div>
                  </div>
                  <div class="roi-bar">
                    <div class="bar-bg">
                      <div class="bar-fill" :style="{ width: `${Math.min(item.roi / 10, 100)}%` }"></div>
                    </div>
                    <div class="roi-value" :class="getRoiClass(item.roi)">ROI {{ item.roi }}</div>
                  </div>
                  <div class="roi-revenue">回报 ¥{{ item.revenue }}</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 产品热度分析 -->
    <div class="section">
      <div class="section-title">产品热度分析</div>
      <div class="product-analysis">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="analysis-card">
              <div class="card-title">热销产品TOP10</div>
              <el-table :data="hotProducts" stripe size="small">
                <el-table-column type="index" label="排名" width="60" align="center" />
                <el-table-column label="产品名称" min-width="200">
                  <template #default="{ row }">
                    <div class="product-cell">
                      <el-image :src="row.image" fit="cover" class="product-thumb" />
                      <span>{{ row.name }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="销量" width="100" align="center">
                  <template #default="{ row }">
                    {{ row.sales }}
                  </template>
                </el-table-column>
                <el-table-column label="销售额" width="120">
                  <template #default="{ row }">
                    <span class="amount">¥{{ row.revenue }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="趋势" width="80" align="center">
                  <template #default="{ row }">
                    <el-icon :class="row.trend >= 0 ? 'up' : 'down'">
                      <ArrowUp v-if="row.trend >= 0" />
                      <ArrowDown v-else />
                    </el-icon>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="analysis-card">
              <div class="card-title">产品类别占比</div>
              <div ref="categoryChartRef" class="chart-container"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 财务/订单/安装/转介绍数据 -->
    <div class="section">
      <div class="section-title">业务数据汇总</div>
      <div class="business-data">
        <el-row :gutter="20">
          <!-- 财务数据 -->
          <el-col :span="6">
            <div class="data-card finance">
              <div class="card-icon">
                <el-icon><Wallet /></el-icon>
              </div>
              <div class="card-title">财务数据</div>
              <div class="data-list">
                <div class="data-item">
                  <span class="label">应收款</span>
                  <span class="value">¥{{ businessData.finance.receivable }}</span>
                </div>
                <div class="data-item">
                  <span class="label">已收款</span>
                  <span class="value success">¥{{ businessData.finance.received }}</span>
                </div>
                <div class="data-item">
                  <span class="label">待对账</span>
                  <span class="value warning">¥{{ businessData.finance.pending }}</span>
                </div>
                <div class="data-item">
                  <span class="label">退款</span>
                  <span class="value danger">¥{{ businessData.finance.refund }}</span>
                </div>
              </div>
              <el-button link type="primary" @click="goToFinance">查看详情 →</el-button>
            </div>
          </el-col>
          <!-- 订单数据 -->
          <el-col :span="6">
            <div class="data-card orders">
              <div class="card-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="card-title">订单数据</div>
              <div class="data-list">
                <div class="data-item">
                  <span class="label">总订单</span>
                  <span class="value">{{ businessData.orders.total }}</span>
                </div>
                <div class="data-item">
                  <span class="label">待处理</span>
                  <span class="value warning">{{ businessData.orders.pending }}</span>
                </div>
                <div class="data-item">
                  <span class="label">进行中</span>
                  <span class="value primary">{{ businessData.orders.processing }}</span>
                </div>
                <div class="data-item">
                  <span class="label">已完成</span>
                  <span class="value success">{{ businessData.orders.completed }}</span>
                </div>
              </div>
              <el-button link type="primary" @click="goToOrders">查看详情 →</el-button>
            </div>
          </el-col>
          <!-- 安装服务数据 -->
          <el-col :span="6">
            <div class="data-card install">
              <div class="card-icon">
                <el-icon><Tools /></el-icon>
              </div>
              <div class="card-title">安装服务</div>
              <div class="data-list">
                <div class="data-item">
                  <span class="label">总工单</span>
                  <span class="value">{{ businessData.install.total }}</span>
                </div>
                <div class="data-item">
                  <span class="label">待派单</span>
                  <span class="value warning">{{ businessData.install.pending }}</span>
                </div>
                <div class="data-item">
                  <span class="label">进行中</span>
                  <span class="value primary">{{ businessData.install.processing }}</span>
                </div>
                <div class="data-item">
                  <span class="label">已完成</span>
                  <span class="value success">{{ businessData.install.completed }}</span>
                </div>
              </div>
              <el-button link type="primary" @click="goToInstallers">查看详情 →</el-button>
            </div>
          </el-col>
          <!-- 转介绍数据 -->
          <el-col :span="6">
            <div class="data-card referral">
              <div class="card-icon">
                <el-icon><Share /></el-icon>
              </div>
              <div class="card-title">转介绍</div>
              <div class="data-list">
                <div class="data-item">
                  <span class="label">转介绍数</span>
                  <span class="value">{{ businessData.referral.total }}</span>
                </div>
                <div class="data-item">
                  <span class="label">成交数</span>
                  <span class="value success">{{ businessData.referral.deals }}</span>
                </div>
                <div class="data-item">
                  <span class="label">成交率</span>
                  <span class="value primary">{{ businessData.referral.rate }}%</span>
                </div>
                <div class="data-item">
                  <span class="label">贡献业绩</span>
                  <span class="value">¥{{ businessData.referral.revenue }}</span>
                </div>
              </div>
              <el-button link type="primary" @click="goToReferral">查看详情 →</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import {
  Money, CircleCheck, User, ShoppingCart, Star, TrendCharts,
  ArrowUp, ArrowDown, Refresh, InfoFilled, Wallet, Document,
  Tools, Share
} from '@element-plus/icons-vue'

import placeholderImage from '../../../assets/images/placeholder.png'

const router = useRouter()

// 时间范围
const timeRange = ref('month')
const customDateRange = ref([])
const revenueChartType = ref('day')
const performanceType = ref('revenue')

// 核心KPI数据
const kpiData = reactive({
  revenue: '1,258,600',
  revenueTrend: 15.3,
  orders: 156,
  ordersTrend: 8.7,
  newCustomers: 89,
  customersTrend: 23.5,
  avgOrderValue: '8,068',
  avgTrend: 5.2,
  satisfaction: 96.5,
  satisfactionTrend: 1.2,
  conversion: 32.8,
  conversionTrend: -2.1
})

// 图表引用
const revenueChartRef = ref(null)
const sourceChartRef = ref(null)
const marketingChartRef = ref(null)
const categoryChartRef = ref(null)

let revenueChart = null
let sourceChart = null
let marketingChart = null
let categoryChart = null

// 团队业绩数据
const performanceLoading = ref(false)
const performanceList = ref([])
const topPerformer = ref(null)

// ROI数据
const roiList = ref([
  { channel: '短信营销', spend: '2,000', revenue: '45,000', roi: 22.5 },
  { channel: '微信朋友圈', spend: '5,000', revenue: '78,000', roi: 15.6 },
  { channel: '抖音推广', spend: '8,000', revenue: '96,000', roi: 12.0 },
  { channel: '老客户转介绍', spend: '1,000', revenue: '120,000', roi: 120.0 },
  { channel: '线下活动', spend: '3,000', revenue: '35,000', roi: 11.7 }
])

// 热销产品
const hotProducts = ref([
  { name: '现代简约布艺沙发', image: placeholderImage, sales: 45, revenue: '179,955', trend: 15 },
  { name: '北欧实木餐桌椅组合', image: placeholderImage, sales: 38, revenue: '110,162', trend: 8 },
  { name: '智能乳胶床垫', image: placeholderImage, sales: 32, revenue: '191,968', trend: 22 },
  { name: '全屋定制衣柜', image: placeholderImage, sales: 28, revenue: '279,720', trend: -5 },
  { name: 'LED护眼吸顶灯', image: placeholderImage, sales: 67, revenue: '20,010', trend: 12 }
])

// 业务数据
const businessData = reactive({
  finance: {
    receivable: '356,800',
    received: '901,800',
    pending: '125,000',
    refund: '15,600'
  },
  orders: {
    total: 156,
    pending: 12,
    processing: 28,
    completed: 116
  },
  install: {
    total: 98,
    pending: 8,
    processing: 23,
    completed: 67
  },
  referral: {
    total: 45,
    deals: 18,
    rate: 40,
    revenue: '285,000'
  }
})

// 获取团队业绩数据
const fetchPerformanceData = async () => {
  performanceLoading.value = true
  try {
    // TODO: 调用API获取业绩数据
    // const res = await axios.get('/api/dashboard/performance', {
    //   params: { type: performanceType.value, timeRange: timeRange.value }
    // })
    
    setTimeout(() => {
      performanceList.value = [
        {
          name: '张小明',
          role: '资深导购',
          avatar: placeholderImage,
          revenue: '285,600',
          orders: 28,
          newCustomers: 18,
          conversion: 42,
          targetRate: 118
        },
        {
          name: '李小红',
          role: '导购',
          avatar: placeholderImage,
          revenue: '198,400',
          orders: 22,
          newCustomers: 15,
          conversion: 38,
          targetRate: 95
        },
        {
          name: '王小强',
          role: '导购',
          avatar: placeholderImage,
          revenue: '156,800',
          orders: 18,
          newCustomers: 12,
          conversion: 35,
          targetRate: 88
        },
        {
          name: '赵小芳',
          role: '导购',
          avatar: placeholderImage,
          revenue: '142,500',
          orders: 16,
          newCustomers: 10,
          conversion: 32,
          targetRate: 82
        },
        {
          name: '刘小军',
          role: '新入职导购',
          avatar: placeholderImage,
          revenue: '89,600',
          orders: 10,
          newCustomers: 8,
          conversion: 28,
          targetRate: 65
        }
      ]
      topPerformer.value = performanceList.value[0]
      performanceLoading.value = false
    }, 500)
  } catch (error) {
    performanceLoading.value = false
  }
}

// 初始化营收趋势图
const initRevenueChart = () => {
  if (!revenueChartRef.value) return
  
  revenueChart = echarts.init(revenueChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['营业收入', '目标收入'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1日', '5日', '10日', '15日', '20日', '25日', '30日'],
      axisLine: { lineStyle: { color: '#ddd' } },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#eee' } },
      axisLabel: {
        color: '#666',
        formatter: (value) => value >= 10000 ? (value / 10000) + '万' : value
      }
    },
    series: [
      {
        name: '营业收入',
        type: 'line',
        smooth: true,
        data: [32000, 45000, 38000, 52000, 48000, 61000, 58000],
        itemStyle: { color: '#409eff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ])
        }
      },
      {
        name: '目标收入',
        type: 'line',
        smooth: true,
        lineStyle: { type: 'dashed' },
        data: [35000, 40000, 42000, 48000, 50000, 55000, 60000],
        itemStyle: { color: '#67c23a' }
      }
    ]
  }
  revenueChart.setOption(option)
}

// 初始化订单来源图
const initSourceChart = () => {
  if (!sourceChartRef.value) return
  
  sourceChart = echarts.init(sourceChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: 45, name: '自然进店', itemStyle: { color: '#409eff' } },
          { value: 28, name: '老客户转介绍', itemStyle: { color: '#67c23a' } },
          { value: 18, name: '线上推广', itemStyle: { color: '#e6a23c' } },
          { value: 12, name: '电话邀约', itemStyle: { color: '#f56c6c' } },
          { value: 8, name: '异业合作', itemStyle: { color: '#909399' } }
        ]
      }
    ]
  }
  sourceChart.setOption(option)
}

// 初始化营销效果对比图
const initMarketingChart = () => {
  if (!marketingChartRef.value) return
  
  marketingChart = echarts.init(marketingChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['投入成本', '带来收入'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['短信营销', '朋友圈', '抖音', '转介绍', '线下活动'],
      axisLine: { lineStyle: { color: '#ddd' } },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#eee' } },
      axisLabel: { color: '#666' }
    },
    series: [
      {
        name: '投入成本',
        type: 'bar',
        data: [2000, 5000, 8000, 1000, 3000],
        itemStyle: { color: '#f56c6c', borderRadius: [4, 4, 0, 0] }
      },
      {
        name: '带来收入',
        type: 'bar',
        data: [45000, 78000, 96000, 120000, 35000],
        itemStyle: { color: '#67c23a', borderRadius: [4, 4, 0, 0] }
      }
    ]
  }
  marketingChart.setOption(option)
}

// 初始化产品类别图
const initCategoryChart = () => {
  if (!categoryChartRef.value) return
  
  categoryChart = echarts.init(categoryChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { value: 35, name: '沙发类', itemStyle: { color: '#409eff' } },
          { value: 25, name: '床具类', itemStyle: { color: '#67c23a' } },
          { value: 20, name: '餐桌椅', itemStyle: { color: '#e6a23c' } },
          { value: 12, name: '定制柜', itemStyle: { color: '#f56c6c' } },
          { value: 8, name: '灯具类', itemStyle: { color: '#909399' } }
        ],
        label: {
          formatter: '{b}\n{c}%'
        }
      }
    ]
  }
  categoryChart.setOption(option)
}

// 获取进度条颜色
const getProgressColor = (percentage) => {
  if (percentage >= 80) return '#67c23a'
  if (percentage >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 获取目标完成率样式
const getTargetClass = (rate) => {
  if (rate >= 100) return 'excellent'
  if (rate >= 80) return 'good'
  return 'normal'
}

// 获取ROI样式
const getRoiClass = (roi) => {
  if (roi >= 50) return 'excellent'
  if (roi >= 20) return 'good'
  if (roi >= 10) return 'normal'
  return 'poor'
}

// 刷新数据
const refreshData = () => {
  fetchPerformanceData()
  // 刷新图表数据
  initRevenueChart()
  initSourceChart()
  initMarketingChart()
  initCategoryChart()
}

// 跳转链接
const goToFinance = () => router.push('/store/finance/overview')
const goToOrders = () => router.push('/store/orders/overview')
const goToInstallers = () => router.push('/store/installers/info')
const goToReferral = () => router.push('/store/referral/overview')

// 监听窗口大小变化
const handleResize = () => {
  revenueChart?.resize()
  sourceChart?.resize()
  marketingChart?.resize()
  categoryChart?.resize()
}

// 监听业绩类型变化
watch(performanceType, () => {
  fetchPerformanceData()
})

onMounted(() => {
  nextTick(() => {
    initRevenueChart()
    initSourceChart()
    initMarketingChart()
    initCategoryChart()
  })
  fetchPerformanceData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  revenueChart?.dispose()
  sourceChart?.dispose()
  marketingChart?.dispose()
  categoryChart?.dispose()
})
</script>

<style scoped lang="scss">
.store-dashboard {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      margin: 0;
      font-size: 24px;
      color: #303133;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .section {
    margin-bottom: 20px;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;

      .el-icon {
        color: #909399;
        cursor: help;
      }
    }
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 15px;

    .kpi-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      border-left: 4px solid;

      &.primary { border-left-color: #409eff; .kpi-icon { background: #ecf5ff; color: #409eff; } }
      &.success { border-left-color: #67c23a; .kpi-icon { background: #f0f9eb; color: #67c23a; } }
      &.warning { border-left-color: #e6a23c; .kpi-icon { background: #fdf6ec; color: #e6a23c; } }
      &.danger { border-left-color: #f56c6c; .kpi-icon { background: #fef0f0; color: #f56c6c; } }
      &.info { border-left-color: #909399; .kpi-icon { background: #f4f4f5; color: #909399; } }
      &.purple { border-left-color: #8e44ad; .kpi-icon { background: #f5eef8; color: #8e44ad; } }

      .kpi-icon {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }

      .kpi-content {
        flex: 1;

        .kpi-label {
          font-size: 13px;
          color: #909399;
          margin-bottom: 5px;
        }

        .kpi-value {
          font-size: 22px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 5px;
        }

        .kpi-trend {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 3px;

          &.up {
            color: #67c23a;
          }

          &.down {
            color: #f56c6c;
          }

          .compare {
            color: #909399;
            margin-left: 5px;
          }
        }
      }
    }
  }

  .charts-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 20px;

    .chart-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);

      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;

        .chart-title {
          font-size: 16px;
          font-weight: bold;
          color: #303133;
        }
      }

      .chart-container {
        height: 280px;
      }
    }
  }

  .performance-section {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);

    .performance-tabs {
      margin-bottom: 15px;
    }

    .rank-cell {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 13px;
      margin: 0 auto;

      &.rank-1 {
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: #8b6914;
      }

      &.rank-2 {
        background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
        color: #666;
      }

      &.rank-3 {
        background: linear-gradient(135deg, #cd7f32, #daa520);
        color: #fff;
      }

      &:not(.rank-1):not(.rank-2):not(.rank-3) {
        background: #f5f7fa;
        color: #606266;
      }
    }

    .employee-cell {
      display: flex;
      align-items: center;
      gap: 12px;

      .employee-info {
        .name {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
        }

        .role {
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .amount {
      color: #f56c6c;
      font-weight: bold;
    }

    .target-rate {
      font-weight: bold;

      &.excellent {
        color: #67c23a;
      }

      &.good {
        color: #e6a23c;
      }

      &.normal {
        color: #909399;
      }
    }

    .top-performer {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 25px;
      color: #fff;
      text-align: center;

      .top-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .top-card {
        .top-name {
          font-size: 20px;
          font-weight: bold;
          margin-top: 15px;
        }

        .top-role {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 20px;
        }

        .top-stats {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 20px;

          .stat {
            .value {
              font-size: 24px;
              font-weight: bold;
            }

            .label {
              font-size: 12px;
              opacity: 0.8;
            }
          }
        }
      }
    }
  }

  .marketing-analysis {
    .analysis-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);

      .card-title {
        font-size: 15px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 15px;
      }

      .chart-container {
        height: 250px;
      }

      .roi-list {
        .roi-item {
          padding: 15px 0;
          border-bottom: 1px solid #ebeef5;

          &:last-child {
            border-bottom: none;
          }

          .roi-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;

            .channel {
              font-weight: 500;
              color: #303133;
            }

            .spend {
              color: #909399;
              font-size: 13px;
            }
          }

          .roi-bar {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 5px;

            .bar-bg {
              flex: 1;
              height: 8px;
              background: #ebeef5;
              border-radius: 4px;
              overflow: hidden;

              .bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #67c23a, #95d475);
                border-radius: 4px;
                transition: width 0.3s;
              }
            }

            .roi-value {
              font-size: 13px;
              font-weight: bold;
              min-width: 70px;
              text-align: right;

              &.excellent { color: #67c23a; }
              &.good { color: #409eff; }
              &.normal { color: #e6a23c; }
              &.poor { color: #f56c6c; }
            }
          }

          .roi-revenue {
            text-align: right;
            font-size: 13px;
            color: #67c23a;
          }
        }
      }
    }
  }

  .product-analysis {
    .analysis-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);

      .card-title {
        font-size: 15px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 15px;
      }

      .product-cell {
        display: flex;
        align-items: center;
        gap: 10px;

        .product-thumb {
          width: 40px;
          height: 40px;
          border-radius: 4px;
        }
      }

      .amount {
        color: #f56c6c;
        font-weight: bold;
      }

      .up {
        color: #67c23a;
      }

      .down {
        color: #f56c6c;
      }

      .chart-container {
        height: 280px;
      }
    }
  }

  .business-data {
    .data-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      text-align: center;

      &.finance { .card-icon { background: #ecf5ff; color: #409eff; } }
      &.orders { .card-icon { background: #f0f9eb; color: #67c23a; } }
      &.install { .card-icon { background: #fdf6ec; color: #e6a23c; } }
      &.referral { .card-icon { background: #f5eef8; color: #8e44ad; } }

      .card-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        margin: 0 auto 15px;
      }

      .card-title {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 15px;
      }

      .data-list {
        margin-bottom: 15px;

        .data-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .label {
            color: #909399;
            font-size: 13px;
          }

          .value {
            font-weight: bold;
            color: #303133;

            &.success { color: #67c23a; }
            &.warning { color: #e6a23c; }
            &.danger { color: #f56c6c; }
            &.primary { color: #409eff; }
          }
        }
      }
    }
  }
}
</style>
