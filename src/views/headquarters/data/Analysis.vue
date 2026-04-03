<template>
  <div class="headquarters-data-analysis">
    <div class="page-header">
      <h1>数据分析</h1>
    </div>
    
    <!-- 数据筛选 -->
    <div class="data-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-select v-model="dataType" placeholder="选择数据类型">
              <el-option label="销售数据" value="sales"></el-option>
              <el-option label="客户数据" value="customers"></el-option>
              <el-option label="库存数据" value="inventory"></el-option>
              <el-option label="门店数据" value="stores"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="analyze">分析数据</el-button>
            <el-button @click="exportData">导出数据</el-button>
            <el-button @click="viewDataDetails">数据详情</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 数据图表 -->
    <div class="data-charts">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>销售趋势</span>
              </div>
            </template>
            <div class="chart-container" v-loading="loading">
              <div ref="salesTrendChart" class="chart"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>客户分布</span>
              </div>
            </template>
            <div class="chart-container" v-loading="loading">
              <div ref="customerDistributionChart" class="chart"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>产品销售排行</span>
              </div>
            </template>
            <div class="chart-container" v-loading="loading">
              <div ref="productRankingChart" class="chart"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>门店业绩对比</span>
              </div>
            </template>
            <div class="chart-container" v-loading="loading">
              <div ref="storePerformanceChart" class="chart"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 数据表格 -->
    <div class="data-table">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>详细数据</span>
            <el-button type="primary" size="small" @click="refreshData">刷新数据</el-button>
          </div>
        </template>
        <el-table :data="dataList" style="width: 100%" v-loading="loading">
          <el-table-column prop="date" label="日期" width="120"></el-table-column>
          <el-table-column prop="product" label="产品名称"></el-table-column>
          <el-table-column prop="store" label="门店" width="150"></el-table-column>
          <el-table-column prop="amount" label="销售金额" width="120"></el-table-column>
          <el-table-column prop="quantity" label="销售数量" width="100"></el-table-column>
          <el-table-column prop="customer" label="客户数" width="100"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button size="small" @click="viewItemDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    
    <!-- 数据详情弹窗 -->
    <el-dialog
      v-model="dataDetailsVisible"
      title="数据详情"
      width="800px"
    >
      <div v-loading="loading">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>数据概览</span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ totalSales }}</div>
                <div class="stat-label">总销售额</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ totalQuantity }}</div>
                <div class="stat-label">销售总量</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ totalCustomers }}</div>
                <div class="stat-label">总客户数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ avgOrderValue }}</div>
                <div class="stat-label">平均订单价值</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
        
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>详细数据列表</span>
            </div>
          </template>
          <el-table :data="dataDetailsList" style="width: 100%">
            <el-table-column prop="date" label="日期" width="120"></el-table-column>
            <el-table-column prop="product" label="产品名称"></el-table-column>
            <el-table-column prop="store" label="门店" width="150"></el-table-column>
            <el-table-column prop="amount" label="销售金额" width="120"></el-table-column>
            <el-table-column prop="quantity" label="销售数量" width="100"></el-table-column>
            <el-table-column prop="customer" label="客户数" width="100"></el-table-column>
            <el-table-column prop="growth" label="增长率" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.growth >= 0 ? 'success' : 'danger'">
                  {{ scope.row.growth >= 0 ? '+' : '' }}{{ scope.row.growth }}%
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dataDetailsVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 导出数据弹窗 -->
    <el-dialog
      v-model="exportDialogVisible"
      title="导出数据"
      width="600px"
    >
      <el-form :model="exportForm" label-position="top">
        <el-form-item label="导出设置">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="导出格式">
                <el-select v-model="exportForm.format" placeholder="选择导出格式">
                  <el-option label="Excel" value="excel"></el-option>
                  <el-option label="CSV" value="csv"></el-option>
                  <el-option label="PDF" value="pdf"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="导出范围">
                <el-select v-model="exportForm.range" placeholder="选择导出范围">
                  <el-option label="当前页" value="current"></el-option>
                  <el-option label="全部数据" value="all"></el-option>
                  <el-option label="自定义" value="custom"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="导出字段">
                <el-checkbox-group v-model="exportForm.fields">
                  <el-checkbox label="date">日期</el-checkbox>
                  <el-checkbox label="product">产品名称</el-checkbox>
                  <el-checkbox label="store">门店</el-checkbox>
                  <el-checkbox label="amount">销售金额</el-checkbox>
                  <el-checkbox label="quantity">销售数量</el-checkbox>
                  <el-checkbox label="customer">客户数</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmExport">确认导出</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 数据项详情弹窗 -->
    <el-dialog
      v-model="itemDetailVisible"
      title="数据项详情"
      width="600px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="销售信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="日期">
                <el-input v-model="currentItem.date" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品名称">
                <el-input v-model="currentItem.product" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="门店">
                <el-input v-model="currentItem.store" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="销售金额">
                <el-input v-model="currentItem.amount" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="销售数量">
                <el-input v-model="currentItem.quantity" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户数">
                <el-input v-model="currentItem.customer" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="销售分析">
          <el-input
            v-model="itemAnalysis"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="itemDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import * as echarts from 'echarts'

// 数据筛选
const dataType = ref('sales')
const dateRange = ref([])

// 加载状态
const loading = ref(false)

// 数据列表
const dataList = ref([
  { date: '2026-04-01', product: '整体衣柜', store: '北京旗舰店', amount: '¥12,500', quantity: 5, customer: 3 },
  { date: '2026-04-01', product: '书柜', store: '上海体验店', amount: '¥8,900', quantity: 3, customer: 2 },
  { date: '2026-04-02', product: '餐桌', store: '广州专卖店', amount: '¥15,600', quantity: 2, customer: 1 },
  { date: '2026-04-02', product: '沙发', store: '北京旗舰店', amount: '¥28,000', quantity: 1, customer: 1 },
  { date: '2026-04-03', product: '整体衣柜', store: '深圳体验店', amount: '¥13,200', quantity: 4, customer: 2 }
])

// 数据详情列表
const dataDetailsList = ref([
  { date: '2026-04-01', product: '整体衣柜', store: '北京旗舰店', amount: '¥12,500', quantity: 5, customer: 3, growth: 15 },
  { date: '2026-04-01', product: '书柜', store: '上海体验店', amount: '¥8,900', quantity: 3, customer: 2, growth: 8 },
  { date: '2026-04-02', product: '餐桌', store: '广州专卖店', amount: '¥15,600', quantity: 2, customer: 1, growth: 22 },
  { date: '2026-04-02', product: '沙发', store: '北京旗舰店', amount: '¥28,000', quantity: 1, customer: 1, growth: -5 },
  { date: '2026-04-03', product: '整体衣柜', store: '深圳体验店', amount: '¥13,200', quantity: 4, customer: 2, growth: 10 }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const dataDetailsVisible = ref(false)
const exportDialogVisible = ref(false)
const itemDetailVisible = ref(false)

// 当前数据项
const currentItem = ref({})
const itemAnalysis = ref('')

// 导出表单
const exportForm = ref({
  format: 'excel',
  range: 'current',
  fields: ['date', 'product', 'store', 'amount', 'quantity', 'customer']
})

// 统计数据
const totalSales = ref('¥78,200')
const totalQuantity = ref(15)
const totalCustomers = ref(9)
const avgOrderValue = ref('¥8,688')

// 图表引用
const salesTrendChart = ref(null)
const customerDistributionChart = ref(null)
const productRankingChart = ref(null)
const storePerformanceChart = ref(null)

// 图表实例
let salesChartInstance = null
let customerChartInstance = null
let productChartInstance = null
let storeChartInstance = null

// 图表数据
const chartData = {
  salesTrend: {
    dates: ['1月', '2月', '3月', '4月', '5月', '6月'],
    data: [120000, 190000, 150000, 180000, 220000, 250000]
  },
  customerDistribution: {
    regions: ['华东', '华北', '华南', '西南', '西北', '东北'],
    data: [35, 25, 20, 10, 5, 5]
  },
  productRanking: {
    products: ['整体衣柜', '书柜', '餐桌', '沙发', '床', '书桌'],
    data: [250, 180, 150, 120, 100, 80]
  },
  storePerformance: {
    stores: ['北京旗舰店', '上海体验店', '广州专卖店', '深圳体验店', '成都专卖店'],
    data: [120000, 95000, 85000, 75000, 60000]
  }
}

// 初始化销售趋势图表
const initSalesTrendChart = () => {
  if (salesTrendChart.value) {
    const chartDom = salesTrendChart.value
    
    if (chartDom.clientWidth > 0 && chartDom.clientHeight > 0) {
      salesChartInstance = echarts.init(chartDom)
      setSalesTrendOption()
    } else {
      const resizeObserver = new ResizeObserver(() => {
        if (chartDom.clientWidth > 0 && chartDom.clientHeight > 0) {
          salesChartInstance = echarts.init(chartDom)
          setSalesTrendOption()
          resizeObserver.disconnect()
        }
      })
      resizeObserver.observe(chartDom)
    }
  }
}

// 设置销售趋势图表选项
const setSalesTrendOption = () => {
  if (salesChartInstance) {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.salesTrend.dates,
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '销售额',
          type: 'bar',
          data: chartData.salesTrend.data,
          itemStyle: {
            color: '#409eff'
          }
        }
      ]
    }
    salesChartInstance.setOption(option)
  }
}

// 初始化客户分布图表
const initCustomerDistributionChart = () => {
  if (customerDistributionChart.value) {
    const chartDom = customerDistributionChart.value
    
    if (chartDom.clientWidth > 0 && chartDom.clientHeight > 0) {
      customerChartInstance = echarts.init(chartDom)
      setCustomerDistributionOption()
    } else {
      const resizeObserver = new ResizeObserver(() => {
        if (chartDom.clientWidth > 0 && chartDom.clientHeight > 0) {
          customerChartInstance = echarts.init(chartDom)
          setCustomerDistributionOption()
          resizeObserver.disconnect()
        }
      })
      resizeObserver.observe(chartDom)
    }
  }
}

// 设置客户分布图表选项
const setCustomerDistributionOption = () => {
  if (customerChartInstance) {
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '3%',
        left: 'center'
      },
      series: [
        {
          name: '客户分布',
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
          data: chartData.customerDistribution.regions.map((region, index) => ({
            value: chartData.customerDistribution.data[index],
            name: region
          }))
        }
      ]
    }
    customerChartInstance.setOption(option)
  }
}

// 初始化产品销售排行图表
const initProductRankingChart = () => {
  if (productRankingChart.value) {
    const chartDom = productRankingChart.value
    
    if (chartDom.clientWidth > 0 && chartDom.clientHeight > 0) {
      productChartInstance = echarts.init(chartDom)
      setProductRankingOption()
    } else {
      const resizeObserver = new ResizeObserver(() => {
        if (chartDom.clientWidth > 0 && chartDom.clientHeight > 0) {
          productChartInstance = echarts.init(chartDom)
          setProductRankingOption()
          resizeObserver.disconnect()
        }
      })
      resizeObserver.observe(chartDom)
    }
  }
}

// 设置产品销售排行图表选项
const setProductRankingOption = () => {
  if (productChartInstance) {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: chartData.productRanking.products
      },
      series: [
        {
          name: '销售数量',
          type: 'bar',
          data: chartData.productRanking.data,
          itemStyle: {
            color: '#67c23a'
          }
        }
      ]
    }
    productChartInstance.setOption(option)
  }
}

// 初始化门店业绩对比图表
const initStorePerformanceChart = () => {
  if (storePerformanceChart.value) {
    const chartDom = storePerformanceChart.value
    
    if (chartDom.clientWidth > 0 && chartDom.clientHeight > 0) {
      storeChartInstance = echarts.init(chartDom)
      setStorePerformanceOption()
    } else {
      const resizeObserver = new ResizeObserver(() => {
        if (chartDom.clientWidth > 0 && chartDom.clientHeight > 0) {
          storeChartInstance = echarts.init(chartDom)
          setStorePerformanceOption()
          resizeObserver.disconnect()
        }
      })
      resizeObserver.observe(chartDom)
    }
  }
}

// 设置门店业绩对比图表选项
const setStorePerformanceOption = () => {
  if (storeChartInstance) {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.storePerformance.stores,
        axisLabel: {
          interval: 0,
          rotate: 45
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '销售额',
          type: 'bar',
          data: chartData.storePerformance.data,
          itemStyle: {
            color: '#e6a23c'
          }
        }
      ]
    }
    storeChartInstance.setOption(option)
  }
}

// 初始化所有图表
const initCharts = () => {
  initSalesTrendChart()
  initCustomerDistributionChart()
  initProductRankingChart()
  initStorePerformanceChart()
}

// 响应式调整
const handleResize = () => {
  if (salesChartInstance) salesChartInstance.resize()
  if (customerChartInstance) customerChartInstance.resize()
  if (productChartInstance) productChartInstance.resize()
  if (storeChartInstance) storeChartInstance.resize()
}

// 分析数据
const analyze = () => {
  loading.value = true
  // 模拟分析数据逻辑
  setTimeout(() => {
    // 实际项目中这里应该调用API获取分析数据
    console.log(`分析数据：${dataType.value}，日期范围：${dateRange.value}`)
    ElMessage.success('数据分析完成')
    loading.value = false
  }, 1000)
}

// 导出数据
const exportData = () => {
  exportDialogVisible.value = true
}

// 确认导出
const confirmExport = () => {
  loading.value = true
  // 模拟导出数据逻辑
  setTimeout(() => {
    // 实际项目中这里应该调用API导出数据
    console.log(`导出数据：格式=${exportForm.value.format}，范围=${exportForm.value.range}，字段=${exportForm.value.fields}`)
    ElMessage.success('数据导出成功')
    exportDialogVisible.value = false
    loading.value = false
  }, 1000)
}

// 查看数据详情
const viewDataDetails = () => {
  loading.value = true
  // 模拟获取数据详情
  setTimeout(() => {
    // 实际项目中这里应该调用API获取数据详情
    dataDetailsVisible.value = true
    loading.value = false
  }, 500)
}

// 查看数据项详情
const viewItemDetail = (item) => {
  loading.value = true
  // 模拟获取数据项详情
  setTimeout(() => {
    currentItem.value = { ...item }
    itemAnalysis.value = `该产品在${item.store}的销售情况良好，销售金额为${item.amount}，销售数量为${item.quantity}，共服务了${item.customer}位客户。`
    itemDetailVisible.value = true
    loading.value = false
  }, 500)
}

// 刷新数据
const refreshData = () => {
  loading.value = true
  // 模拟刷新数据
  setTimeout(() => {
    // 实际项目中这里应该调用API获取最新数据
    ElMessage.success('数据刷新成功')
    loading.value = false
  }, 1000)
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 实际项目中这里应该调用API获取对应页的数据
  console.log(`切换到第 ${page} 页`)
  ElMessage.info(`切换到第 ${page} 页`)
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('数据分析数据加载完成')
    loading.value = false
    nextTick(() => {
      initCharts()
      window.addEventListener('resize', handleResize)
    })
  }, 500)
})

// 组件卸载
onUnmounted(() => {
  if (salesChartInstance) salesChartInstance.dispose()
  if (customerChartInstance) customerChartInstance.dispose()
  if (productChartInstance) productChartInstance.dispose()
  if (storeChartInstance) storeChartInstance.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.headquarters-data-analysis {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.data-filter {
  margin-bottom: 20px;
}

.data-charts {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-table {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.stat-card {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.mb-4 {
  margin-bottom: 20px;
}
</style>