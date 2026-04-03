<template>
  <div class="headquarters-purchase">
    <div class="page-header">
      <h1>采购商城管理</h1>
    </div>
    
    <!-- 数据概览 -->
    <div class="data-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item">
              <div class="data-icon bg-primary-light text-primary mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                📋
              </div>
              <div class="data-value">{{ totalOrders }}</div>
              <div class="data-label">总订单数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item">
              <div class="data-icon bg-success-light text-success mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                💰
              </div>
              <div class="data-value">{{ totalAmount }}</div>
              <div class="data-label">采购总额</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item">
              <div class="data-icon bg-warning-light text-warning mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                🤝
              </div>
              <div class="data-value">{{ totalSuppliers }}</div>
              <div class="data-label">供应商数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card card transition-all">
            <div class="data-item">
              <div class="data-icon bg-info-light text-info mb-4 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                ⏳
              </div>
              <div class="data-value">{{ pendingOrders }}</div>
              <div class="data-label">待处理订单</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" class="card transition-all">
            <template #header>
              <div class="card-header">
                <span>采购趋势</span>
              </div>
            </template>
            <div class="chart-container h-80">
              <div ref="trendChart" class="chart"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="card transition-all">
            <template #header>
              <div class="card-header">
                <span>供应商分布</span>
              </div>
            </template>
            <div class="chart-container h-80">
              <div ref="supplierChart" class="chart"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 最近订单 -->
    <div class="recent-orders">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header">
            <span>最近采购订单</span>
            <el-button type="primary" size="small" @click="viewAllOrders">查看全部</el-button>
          </div>
        </template>
        <el-table :data="recentOrders" style="width: 100%" class="orders-table" @row-click="viewOrderDetail">
          <el-table-column prop="orderId" label="订单编号" width="150"></el-table-column>
          <el-table-column prop="supplier" label="供应商" width="150"></el-table-column>
          <el-table-column prop="amount" label="金额" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button size="small" @click.stop="viewOrderDetail(scope.row)">查看</el-button>
              <el-button size="small" type="info" @click.stop="viewReconciliation(scope.row)">对账</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    
    <!-- 订单详情弹窗 -->
    <el-dialog
      v-model="orderDetailVisible"
      :title="`订单详情 - ${currentOrder.orderId}`"
      width="800px"
    >
      <div class="order-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form :model="currentOrder" label-width="100px">
              <el-form-item label="订单编号">
                <span>{{ currentOrder.orderId }}</span>
              </el-form-item>
              <el-form-item label="供应商">
                <span>{{ currentOrder.supplier }}</span>
              </el-form-item>
              <el-form-item label="采购金额">
                <span class="font-semibold">{{ currentOrder.amount }}</span>
              </el-form-item>
              <el-form-item label="订单状态">
                <el-tag :type="getStatusType(currentOrder.status)">{{ currentOrder.status }}</el-tag>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ currentOrder.createTime }}</span>
              </el-form-item>
              <el-form-item label="预计交付">
                <span>{{ currentOrder.expectedDelivery || '暂无' }}</span>
              </el-form-item>
              <el-form-item label="实际交付">
                <span>{{ currentOrder.actualDelivery || '暂无' }}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="mb-4">
              <template #header>
                <div class="card-header">
                  <span>订单商品</span>
                </div>
              </template>
              <el-table :data="currentOrder.items" style="width: 100%" size="small">
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
                <el-table-column prop="unitPrice" label="单价" width="100"></el-table-column>
                <el-table-column prop="subtotal" label="小计" width="100"></el-table-column>
              </el-table>
            </el-card>
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>订单备注</span>
                </div>
              </template>
              <div class="order-remark">
                {{ currentOrder.remark || '暂无备注' }}
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="orderDetailVisible = false">关闭</el-button>
          <el-button v-if="currentOrder.status === '待支付'" type="primary" @click="payOrder">立即支付</el-button>
          <el-button v-if="currentOrder.status === '处理中'" type="success" @click="confirmReceipt">确认收货</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 对账弹窗 -->
    <el-dialog
      v-model="reconciliationVisible"
      :title="`订单对账 - ${currentOrder.orderId}`"
      width="600px"
    >
      <div class="reconciliation-detail">
        <el-form :model="reconciliationForm" label-width="120px" :rules="reconciliationRules" ref="reconciliationFormRef">
          <el-form-item label="订单编号">
            <span>{{ currentOrder.orderId }}</span>
          </el-form-item>
          <el-form-item label="供应商">
            <span>{{ currentOrder.supplier }}</span>
          </el-form-item>
          <el-form-item label="订单金额">
            <span>{{ currentOrder.amount }}</span>
          </el-form-item>
          <el-form-item label="实际金额" prop="actualAmount">
            <el-input v-model="reconciliationForm.actualAmount" placeholder="请输入实际金额"></el-input>
          </el-form-item>
          <el-form-item label="对账状态" prop="status">
            <el-select v-model="reconciliationForm.status" placeholder="选择对账状态" class="w-full">
              <el-option label="待对账" value="待对账"></el-option>
              <el-option label="已对账" value="已对账"></el-option>
              <el-option label="有差异" value="有差异"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="对账备注" prop="remark">
            <el-input v-model="reconciliationForm.remark" type="textarea" :rows="3" placeholder="请输入对账备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reconciliationVisible = false">取消</el-button>
          <el-button type="primary" @click="saveReconciliation">保存</el-button>
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

// 数据概览
const totalOrders = ref('1,258')
const totalAmount = ref('¥2,850,000')
const totalSuppliers = ref('86')
const pendingOrders = ref('45')

// 最近订单
const recentOrders = ref([
  {
    orderId: 'PO20260401001', 
    supplier: '广东橱柜厂', 
    amount: '¥128,500', 
    status: '已完成', 
    createTime: '2026-04-01 10:30',
    expectedDelivery: '2026-04-10',
    actualDelivery: '2026-04-08',
    remark: '加急订单，需要尽快交付',
    items: [
      { name: '橱柜门板', quantity: '100', unitPrice: '¥800', subtotal: '¥80,000' },
      { name: '橱柜柜体', quantity: '100', unitPrice: '¥485', subtotal: '¥48,500' }
    ]
  },
  {
    orderId: 'PO20260401002', 
    supplier: '浙江五金厂', 
    amount: '¥89,200', 
    status: '处理中', 
    createTime: '2026-04-01 09:15',
    expectedDelivery: '2026-04-15',
    actualDelivery: '',
    remark: '常规采购',
    items: [
      { name: '铰链', quantity: '5000', unitPrice: '¥12', subtotal: '¥60,000' },
      { name: '拉手', quantity: '2000', unitPrice: '¥14.6', subtotal: '¥29,200' }
    ]
  },
  {
    orderId: 'PO20260331001', 
    supplier: '上海板材厂', 
    amount: '¥235,600', 
    status: '已完成', 
    createTime: '2026-03-31 16:45',
    expectedDelivery: '2026-04-05',
    actualDelivery: '2026-04-03',
    remark: '',
    items: [
      { name: '密度板', quantity: '1000', unitPrice: '¥180', subtotal: '¥180,000' },
      { name: '刨花板', quantity: '500', unitPrice: '¥111.2', subtotal: '¥55,600' }
    ]
  },
  {
    orderId: 'PO20260331002', 
    supplier: '广东玻璃厂', 
    amount: '¥67,800', 
    status: '待支付', 
    createTime: '2026-03-31 14:20',
    expectedDelivery: '2026-04-12',
    actualDelivery: '',
    remark: '需要特殊尺寸定制',
    items: [
      { name: '钢化玻璃', quantity: '300', unitPrice: '¥226', subtotal: '¥67,800' }
    ]
  }
])

// 弹窗状态
const orderDetailVisible = ref(false)
const reconciliationVisible = ref(false)

// 当前订单
const currentOrder = ref({})

// 对账表单
const reconciliationForm = ref({
  actualAmount: '',
  status: '待对账',
  remark: ''
})

// 对账表单验证规则
const reconciliationRules = {
  actualAmount: [
    { required: true, message: '请输入实际金额', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择对账状态', trigger: 'change' }
  ]
}

// 表单引用
const reconciliationFormRef = ref(null)

// 图表引用
const trendChart = ref(null)
const supplierChart = ref(null)
let trendChartInstance = null
let supplierChartInstance = null

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case '已完成':
      return 'success'
    case '处理中':
      return 'warning'
    case '待支付':
      return 'info'
    case '待对账':
      return 'info'
    case '已对账':
      return 'success'
    case '有差异':
      return 'danger'
    default:
      return 'info'
  }
}

// 查看全部订单
const viewAllOrders = () => {
  // 跳转到订单管理页面
  router.push('/headquarters/purchase/orders')
}

// 查看订单详情
const viewOrderDetail = (row) => {
  Object.assign(currentOrder, row)
  orderDetailVisible.value = true
}

// 查看对账
const viewReconciliation = (row) => {
  Object.assign(currentOrder, row)
  reconciliationForm.value = {
    actualAmount: row.amount.replace('¥', ''),
    status: '待对账',
    remark: ''
  }
  reconciliationVisible.value = true
}

// 支付订单
const payOrder = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  // 模拟API调用
  setTimeout(() => {
    currentOrder.value.status = '处理中'
    
    // 更新列表中的数据
    const index = recentOrders.value.findIndex(item => item.orderId === currentOrder.value.orderId)
    if (index !== -1) {
      recentOrders.value[index].status = '处理中'
    }
    
    ElMessage.success('支付成功')
    loading.close()
  }, 1000)
}

// 确认收货
const confirmReceipt = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  // 模拟API调用
  setTimeout(() => {
    currentOrder.value.status = '已完成'
    currentOrder.value.actualDelivery = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
    
    // 更新列表中的数据
    const index = recentOrders.value.findIndex(item => item.orderId === currentOrder.value.orderId)
    if (index !== -1) {
      recentOrders.value[index].status = '已完成'
      recentOrders.value[index].actualDelivery = currentOrder.value.actualDelivery
    }
    
    ElMessage.success('确认收货成功')
    loading.close()
  }, 1000)
}

// 保存对账
const saveReconciliation = async () => {
  if (!reconciliationFormRef.value) return
  
  try {
    await reconciliationFormRef.value.validate()
    
    const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      ElMessage.success('对账保存成功')
      loading.close()
      reconciliationVisible.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 初始化采购趋势图表
const initTrendChart = () => {
  if (!trendChart.value) return
  
  trendChartInstance = echarts.init(trendChart.value)
  
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
      data: ['采购金额', '订单数量']
    },
    xAxis: [
      {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
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
        max: 600000,
        interval: 200000,
        axisLabel: {
          formatter: '¥{value}'
        }
      },
      {
        type: 'value',
        name: '数量',
        min: 0,
        max: 300,
        interval: 100
      }
    ],
    series: [
      {
        name: '采购金额',
        type: 'bar',
        data: [350000, 420000, 580000, 450000, 520000, 480000]
      },
      {
        name: '订单数量',
        type: 'line',
        yAxisIndex: 1,
        data: [120, 150, 280, 210, 250, 230]
      }
    ]
  }
  
  trendChartInstance.setOption(option)
}

// 初始化供应商分布图表
const initSupplierChart = () => {
  if (!supplierChart.value) return
  
  supplierChartInstance = echarts.init(supplierChart.value)
  
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
        name: '供应商分布',
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
        data: [
          { value: 35, name: '广东' },
          { value: 20, name: '浙江' },
          { value: 15, name: '上海' },
          { value: 10, name: '江苏' },
          { value: 6, name: '其他' }
        ]
      }
    ]
  }
  
  supplierChartInstance.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  if (trendChartInstance) {
    trendChartInstance.resize()
  }
  if (supplierChartInstance) {
    supplierChartInstance.resize()
  }
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
    nextTick(() => {
      initTrendChart()
      initSupplierChart()
    })
  }, 500)
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 组件卸载
onUnmounted(() => {
  if (trendChartInstance) {
    trendChartInstance.dispose()
  }
  if (supplierChartInstance) {
    supplierChartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.headquarters-purchase {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.page-header h1 {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--text-title);
  margin: 0;
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

.charts-section {
  margin-bottom: var(--spacing-md);
}

.chart-container {
  height: 320px;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}

.recent-orders {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.orders-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

/* 订单详情弹窗样式 */
.order-detail {
  padding: var(--spacing-sm);
}

.order-remark {
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
}

/* 对账弹窗样式 */
.reconciliation-detail {
  padding: var(--spacing-sm);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .data-overview .el-col {
    --el-col-span: 12;
  }
  
  .charts-section .el-col {
    --el-col-span: 24;
  }
  
  .chart-container {
    height: 300px;
  }
}

@media screen and (max-width: 768px) {
  .headquarters-purchase {
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
  
  .order-detail .el-col {
    --el-col-span: 24;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>