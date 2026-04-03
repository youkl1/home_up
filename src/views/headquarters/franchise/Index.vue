<template>
  <div class="franchise-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">加盟商招商总览</h1>
    </div>
    
    <!-- 招商数据概览 -->
    <div class="overview-stats mb-6">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item flex flex-col items-center justify-center h-full">
              <div class="stat-icon bg-primary-light text-primary mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                📋
              </div>
              <div class="stat-value text-2xl font-bold text-title mb-2">{{ totalIntents }}</div>
              <div class="stat-label text-secondary">意向客户</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item flex flex-col items-center justify-center h-full">
              <div class="stat-icon bg-success-light text-success mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                📄
              </div>
              <div class="stat-value text-2xl font-bold text-title mb-2">{{ totalContracts }}</div>
              <div class="stat-label text-secondary">已签约</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item flex flex-col items-center justify-center h-full">
              <div class="stat-icon bg-warning-light text-warning mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                🏬
              </div>
              <div class="stat-value text-2xl font-bold text-title mb-2">{{ totalStores }}</div>
              <div class="stat-label text-secondary">已开店</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card card transition-all">
            <div class="stat-item flex flex-col items-center justify-center h-full">
              <div class="stat-icon bg-info-light text-info mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                📈
              </div>
              <div class="stat-value text-2xl font-bold text-title mb-2">{{ conversionRate }}%</div>
              <div class="stat-label text-secondary">转化率</div>
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
            <el-select v-model="timeRange" size="small" class="mr-4" @change="handleTimeRangeChange">
              <el-option label="近30天" value="30d"></el-option>
              <el-option label="近90天" value="90d"></el-option>
              <el-option label="近1年" value="1y"></el-option>
              <el-option label="全部" value="all"></el-option>
            </el-select>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              @change="handleDateRangeChange"
            />
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 招商趋势 -->
    <div class="franchise-trend mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">招商趋势</span>
          </div>
        </template>
        <div class="chart-container bg-light rounded-lg h-64">
          <div ref="franchiseTrendChart" class="w-full h-full"></div>
        </div>
      </el-card>
    </div>
    
    <!-- 招商漏斗 -->
    <div class="funnel-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">招商漏斗</span>
          </div>
        </template>
        <div class="funnel-chart h-80">
          <div class="funnel-steps">
            <div v-for="(step, index) in funnelSteps" :key="step.name" class="funnel-step" :style="{ width: step.width }" @click="viewFunnelDetail(step)">
              <div class="step-value">{{ step.value }}</div>
              <div class="step-name">{{ step.name }}</div>
              <div class="step-percentage">{{ step.percentage }}%</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 近期意向客户 -->
    <div class="recent-intents mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">近期意向客户</span>
            <el-button type="primary" size="small" @click="viewAllIntents">查看全部</el-button>
          </div>
        </template>
        <el-table :data="recentIntents" style="width: 100%" class="intents-table" @row-click="viewCustomerDetail">
          <el-table-column prop="name" label="客户姓名" width="120"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
          <el-table-column prop="region" label="意向区域" width="150"></el-table-column>
          <el-table-column prop="intentLevel" label="意向等级" width="120">
            <template #default="scope">
              <el-tag :type="getLevelType(scope.row.intentLevel)">{{ scope.row.intentLevel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="跟进状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间" width="180"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button size="small" @click.stop="viewCustomerDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    
    <!-- 客户详情弹窗 -->
    <el-dialog
      v-model="customerDetailVisible"
      title="客户详情"
      width="800px"
    >
      <div class="customer-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form :model="currentCustomer" label-width="100px">
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
              <el-form-item label="跟进状态">
                <el-tag :type="getStatusType(currentCustomer.status)">{{ currentCustomer.status }}</el-tag>
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
          <el-button @click="customerDetailVisible = false">关闭</el-button>
          <el-button type="primary" @click="addFollowUpRecord">添加跟进记录</el-button>
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
    
    <!-- 漏斗详情弹窗 -->
    <el-dialog
      v-model="funnelDetailVisible"
      :title="`${currentFunnelStep.name}详情`"
      width="600px"
    >
      <div class="funnel-detail">
        <el-form :model="currentFunnelStep" label-width="100px">
          <el-form-item label="阶段名称">
            <span>{{ currentFunnelStep.name }}</span>
          </el-form-item>
          <el-form-item label="客户数量">
            <span>{{ currentFunnelStep.value }}</span>
          </el-form-item>
          <el-form-item label="转化率">
            <span>{{ currentFunnelStep.percentage }}%</span>
          </el-form-item>
          <el-form-item label="阶段说明">
            <div class="step-description">
              {{ getStepDescription(currentFunnelStep.name) }}
            </div>
          </el-form-item>
        </el-form>
        <div class="related-customers mt-4">
          <h4 class="mb-2">相关客户</h4>
          <div class="customer-list">
            <div v-for="(customer, index) in getRelatedCustomers(currentFunnelStep.name)" :key="index" class="customer-item">
              <div class="customer-info">
                <span class="customer-name">{{ customer.name }}</span>
                <span class="customer-phone">{{ customer.phone }}</span>
                <el-tag :type="getLevelType(customer.intentLevel)">{{ customer.intentLevel }}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="funnelDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import * as echarts from 'echarts'

// 路由实例
const router = useRouter()

// 模拟数据
const totalIntents = ref('256')
const totalContracts = ref('89')
const totalStores = ref('67')
const conversionRate = ref('34.8')

// 时间范围
const timeRange = ref('30d')
const dateRange = ref([])

// 招商趋势数据
const franchiseTrendData = {
  dates: ['1月', '2月', '3月', '4月', '5月', '6月'],
  intents: [45, 62, 78, 90, 85, 105],
  contracts: [12, 18, 25, 30, 28, 40],
  stores: [8, 12, 18, 22, 20, 25]
}

// 图表引用
const franchiseTrendChart = ref(null)
let chartInstance = null

// 招商漏斗
const funnelSteps = ref([
  { name: '意向咨询', value: '256', percentage: '100', width: '100%' },
  { name: '初步洽谈', value: '189', percentage: '73.8', width: '80%' },
  { name: '实地考察', value: '124', percentage: '48.4', width: '60%' },
  { name: '合同签约', value: '89', percentage: '34.8', width: '40%' },
  { name: '门店开业', value: '67', percentage: '26.2', width: '20%' }
])

// 近期意向客户
const recentIntents = ref([
  {
    name: '张总',
    phone: '138****1234',
    region: '北京市朝阳区',
    intentLevel: '高',
    status: '跟进中',
    createTime: '2026-04-01 09:00',
    demand: '意向开设100平米专卖店，希望了解加盟政策和支持方案。',
    followUpRecords: [
      { time: '2026-04-01 10:00', content: '初步沟通，了解客户需求' },
      { time: '2026-04-02 14:00', content: '发送加盟资料和政策' }
    ]
  },
  {
    name: '李总',
    phone: '139****5678',
    region: '上海市浦东新区',
    intentLevel: '中',
    status: '待联系',
    createTime: '2026-04-01 10:30',
    demand: '意向在上海开设加盟店，关注品牌影响力和市场前景。',
    followUpRecords: []
  },
  {
    name: '王总',
    phone: '137****9012',
    region: '广州市天河区',
    intentLevel: '高',
    status: '实地考察',
    createTime: '2026-04-01 11:15',
    demand: '计划在广州天河区开设旗舰店，需要实地考察总部和现有门店。',
    followUpRecords: [
      { time: '2026-04-01 15:00', content: '安排实地考察时间' },
      { time: '2026-04-03 09:00', content: '实地考察总部' }
    ]
  },
  {
    name: '赵总',
    phone: '136****3456',
    region: '深圳市南山区',
    intentLevel: '中',
    status: '待评估',
    createTime: '2026-04-01 14:20',
    demand: '意向在深圳南山区开设加盟店，需要评估投资回报率。',
    followUpRecords: [
      { time: '2026-04-01 16:00', content: '提供投资回报分析' }
    ]
  },
  {
    name: '刘总',
    phone: '135****7890',
    region: '成都市武侯区',
    intentLevel: '低',
    status: '已拒绝',
    createTime: '2026-04-01 15:45',
    demand: '意向开设小型加盟店，但预算有限。',
    followUpRecords: [
      { time: '2026-04-02 10:00', content: '沟通后客户因预算问题放弃加盟' }
    ]
  }
])

// 弹窗状态
const customerDetailVisible = ref(false)
const followUpDialogVisible = ref(false)
const funnelDetailVisible = ref(false)

// 当前客户详情
const currentCustomer = ref({})

// 当前漏斗步骤
const currentFunnelStep = ref({})

// 跟进记录表单
const followUpForm = ref({
  content: '',
  status: '',
  nextFollowUpTime: ''
})

// 跟进记录表单验证规则
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
const followUpFormRef = ref(null)

// 获取等级类型
const getLevelType = (level) => {
  const map = { '高': 'success', '中': 'warning', '低': 'danger' }
  return map[level] || ''
}

// 获取状态类型
const getStatusType = (status) => {
  const map = { '待联系': 'info', '跟进中': 'primary', '实地考察': 'warning', '待评估': 'warning', '已拒绝': 'danger' }
  return map[status] || ''
}

// 查看全部意向客户
const viewAllIntents = () => {
  // 跳转到意向加盟商管理页面
  router.push('/headquarters/franchise/intents')
}

// 查看客户详情
const viewCustomerDetail = (row) => {
  Object.assign(currentCustomer, row)
  customerDetailVisible.value = true
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
      const index = recentIntents.value.findIndex(item => item.name === currentCustomer.value.name)
      if (index !== -1) {
        recentIntents.value[index].status = followUpForm.value.status
        recentIntents.value[index].followUpRecords = currentCustomer.value.followUpRecords
      }
      
      ElMessage.success('跟进记录添加成功')
      loading.close()
      followUpDialogVisible.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 查看漏斗详情
const viewFunnelDetail = (step) => {
  Object.assign(currentFunnelStep, step)
  funnelDetailVisible.value = true
}

// 获取步骤说明
const getStepDescription = (stepName) => {
  const descriptions = {
    '意向咨询': '客户通过各种渠道了解品牌，表达加盟意向的初始阶段。',
    '初步洽谈': '与客户进行初步沟通，了解客户需求和资质的阶段。',
    '实地考察': '客户实地考察总部和现有门店，深入了解品牌实力的阶段。',
    '合同签约': '双方达成合作意向，签订加盟合同的阶段。',
    '门店开业': '加盟商完成门店装修和筹备，正式开业的阶段。'
  }
  return descriptions[stepName] || ''
}

// 获取相关客户
const getRelatedCustomers = (stepName) => {
  // 模拟根据阶段获取相关客户
  return recentIntents.value.slice(0, 3)
}

// 处理时间范围变化
const handleTimeRangeChange = () => {
  console.log('时间范围变化:', timeRange.value)
  // 这里可以调用接口获取对应时间范围的数据
}

// 处理日期范围变化
const handleDateRangeChange = () => {
  console.log('日期范围变化:', dateRange.value)
  // 这里可以调用接口获取对应日期范围的数据
}

// 初始化图表
const initChart = () => {
  if (franchiseTrendChart.value) {
    const chartDom = franchiseTrendChart.value
    
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
        data: ['意向客户', '已签约', '已开店'],
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
        data: franchiseTrendData.dates,
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '意向客户',
          type: 'bar',
          data: franchiseTrendData.intents,
          itemStyle: {
            color: '#409eff'
          }
        },
        {
          name: '已签约',
          type: 'bar',
          data: franchiseTrendData.contracts,
          itemStyle: {
            color: '#67c23a'
          }
        },
        {
          name: '已开店',
          type: 'bar',
          data: franchiseTrendData.stores,
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
.franchise-page {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.overview-stats {
  margin-bottom: var(--spacing-md);
}

.stat-card {
  height: 200px;
  transition: all var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-item {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--text-title);
  margin: 0 0 var(--spacing-xs) 0;
}

.stat-label {
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

.franchise-trend,
.funnel-section {
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

.funnel-chart {
  height: 320px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: var(--spacing-sm);
}

.funnel-steps {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-sm);
  height: 100%;
}

.funnel-step {
  background: linear-gradient(to top, var(--primary-color), var(--primary-light));
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
  transition: all var(--transition-normal);
  cursor: pointer;
}

.funnel-step:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.step-value {
  font-size: var(--font-size-lg);
  font-weight: bold;
  margin-bottom: var(--spacing-xs);
}

.step-name {
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}

.step-percentage {
  font-size: var(--font-size-xs);
  opacity: 0.9;
}

.recent-intents {
  margin-bottom: var(--spacing-md);
}

.intents-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
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

/* 漏斗详情弹窗样式 */
.funnel-detail {
  padding: var(--spacing-sm);
}

.step-description {
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.related-customers {
  margin-top: var(--spacing-md);
}

.customer-list {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.customer-item {
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--transition-fast);
}

.customer-item:hover {
  background-color: var(--bg-light);
}

.customer-item:last-child {
  border-bottom: none;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.customer-name {
  font-weight: semibold;
  color: var(--text-title);
}

.customer-phone {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .overview-stats .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .franchise-page {
    padding: var(--spacing-sm);
  }
  
  .overview-stats .el-col {
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
  
  .funnel-chart {
    height: 200px;
  }
  
  .funnel-steps {
    gap: 4px;
  }
  
  .step-value {
    font-size: var(--font-size-sm);
  }
  
  .step-name {
    font-size: var(--font-size-xs);
  }
  
  .step-percentage {
    font-size: 10px;
  }
  
  .customer-detail .el-col {
    --el-col-span: 24;
  }
  
  .customer-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>