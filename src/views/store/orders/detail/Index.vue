<template>
  <div class="order-detail">
    <div class="page-header">
      <h1>订单详情</h1>
      <div class="header-actions">
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>
    
    <!-- 订单状态 -->
    <div class="status-section">
      <el-card shadow="hover">
        <div class="order-status">
          <el-tag type="success" size="large">{{ orderStatus }}</el-tag>
          <div class="status-time">更新时间：{{ updateTime }}</div>
        </div>
        <div class="status-actions">
          <el-button type="primary" @click="updateStatus">更新状态</el-button>
        </div>
      </el-card>
    </div>
    
    <!-- 订单基础信息 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>订单基础信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="订单号">{{ order.id }}</el-descriptions-item>
          <el-descriptions-item label="订单类型">{{ order.type }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ order.createTime }}</el-descriptions-item>
          <el-descriptions-item label="导购">{{ order.sales }}</el-descriptions-item>
          <el-descriptions-item label="预计交付时间">{{ order.estimatedDelivery }}</el-descriptions-item>
          <el-descriptions-item label="订单金额">{{ order.amount }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    
    <!-- 客户信息 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>客户信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="客户姓名">{{ customer.name }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ customer.phone }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ customer.address }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    
    <!-- 产品明细 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>产品明细</span>
          </div>
        </template>
        <el-table :data="products" style="width: 100%">
          <el-table-column prop="name" label="产品名称"></el-table-column>
          <el-table-column prop="spec" label="规格"></el-table-column>
          <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
          <el-table-column prop="price" label="单价" width="100"></el-table-column>
          <el-table-column prop="total" label="小计" width="120"></el-table-column>
        </el-table>
      </el-card>
    </div>
    
    <!-- 报价明细 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>报价明细</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="产品总价">{{ quote.productTotal }}</el-descriptions-item>
          <el-descriptions-item label="安装费">{{ quote.installationFee }}</el-descriptions-item>
          <el-descriptions-item label="运费">{{ quote.shippingFee }}</el-descriptions-item>
          <el-descriptions-item label="优惠">{{ quote.discount }}</el-descriptions-item>
          <el-descriptions-item label="最终金额" :span="2">{{ quote.finalAmount }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    
    <!-- 收款记录 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>收款记录</span>
          </div>
        </template>
        <el-table :data="payments" style="width: 100%">
          <el-table-column prop="amount" label="金额" width="120"></el-table-column>
          <el-table-column prop="method" label="支付方式" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>
      </el-card>
    </div>
    
    <!-- 生产进度 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>生产进度</span>
            <el-button size="small" @click="consultProduction">咨询进度</el-button>
          </div>
        </template>
        <div class="production-progress">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in productionSteps"
              :key="index"
              :timestamp="item.time"
              :type="item.status === 'completed' ? 'success' : 'info'"
              :icon="item.status === 'completed' ? 'el-icon-check' : 'el-icon-time'"
            >
              {{ item.description }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-card>
    </div>
    
    <!-- 物流信息 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>物流信息</span>
          </div>
        </template>
        <div v-if="logistics" class="logistics-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="物流公司">{{ logistics.company }}</el-descriptions-item>
            <el-descriptions-item label="物流单号">{{ logistics.trackingNumber }}</el-descriptions-item>
            <el-descriptions-item label="发货时间">{{ logistics.shippingTime }}</el-descriptions-item>
            <el-descriptions-item label="预计到达">{{ logistics.estimatedArrival }}</el-descriptions-item>
          </el-descriptions>
          <div class="logistics-timeline">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in logistics.tracks"
                :key="index"
                :timestamp="item.time"
              >
                {{ item.status }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div v-else class="no-data">暂无物流信息</div>
      </el-card>
    </div>
    
    <!-- 安装工单 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>安装工单</span>
          </div>
        </template>
        <div v-if="installationOrder" class="installation-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="工单号">{{ installationOrder.id }}</el-descriptions-item>
            <el-descriptions-item label="安装师傅">{{ installationOrder.installer }}</el-descriptions-item>
            <el-descriptions-item label="预约时间">{{ installationOrder.scheduledTime }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ installationOrder.status }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div v-else class="no-data">暂无安装工单</div>
      </el-card>
    </div>
    
    <!-- 跟进记录 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>跟进记录</span>
            <el-button size="small" @click="addFollowUp">添加记录</el-button>
          </div>
        </template>
        <el-table :data="followUps" style="width: 100%">
          <el-table-column prop="time" label="时间" width="180"></el-table-column>
          <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
          <el-table-column prop="content" label="内容"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 模拟订单数据
const order = ref({
  id: 'ORD20260401001',
  type: '标准订单',
  createTime: '2026-04-01 10:30',
  sales: '李导购',
  estimatedDelivery: '2026-04-15',
  amount: '¥12,800'
})

// 订单状态
const orderStatus = ref('已交付')
const updateTime = ref('2026-04-15 14:30')

// 客户信息
const customer = ref({
  name: '张女士',
  phone: '138****8888',
  address: '北京市朝阳区XX小区1号楼1001室'
})

// 产品明细
const products = ref([
  { name: '沙发', spec: '三人位', quantity: 1, price: '¥8,000', total: '¥8,000' },
  { name: '茶几', spec: '120*60cm', quantity: 1, price: '¥2,800', total: '¥2,800' },
  { name: '电视柜', spec: '200*40cm', quantity: 1, price: '¥2,000', total: '¥2,000' }
])

// 报价明细
const quote = ref({
  productTotal: '¥12,800',
  installationFee: '¥500',
  shippingFee: '¥300',
  discount: '¥1,000',
  finalAmount: '¥12,600'
})

// 收款记录
const payments = ref([
  { amount: '¥6,300', method: '微信支付', status: '已完成', time: '2026-04-01 10:30', remark: '定金' },
  { amount: '¥6,300', method: '银行转账', status: '已完成', time: '2026-04-15 14:30', remark: '尾款' }
])

// 生产进度
const productionSteps = ref([
  { description: '订单确认', status: 'completed', time: '2026-04-01 10:30' },
  { description: '生产中', status: 'completed', time: '2026-04-02 09:00' },
  { description: '生产完成', status: 'completed', time: '2026-04-10 16:00' },
  { description: '已发货', status: 'completed', time: '2026-04-12 10:00' },
  { description: '已交付', status: 'completed', time: '2026-04-15 14:30' }
])

// 物流信息
const logistics = ref({
  company: '顺丰速运',
  trackingNumber: 'SF1234567890',
  shippingTime: '2026-04-12 10:00',
  estimatedArrival: '2026-04-14',
  tracks: [
    { status: '【北京】快件已发出', time: '2026-04-12 10:00' },
    { status: '【天津】快件已到达', time: '2026-04-12 18:00' },
    { status: '【北京】快件已到达', time: '2026-04-13 08:00' },
    { status: '【北京】快件已派送', time: '2026-04-14 09:00' },
    { status: '【北京】快件已签收', time: '2026-04-14 14:30' }
  ]
})

// 安装工单
const installationOrder = ref({
  id: 'INST20260414001',
  installer: '王师傅',
  scheduledTime: '2026-04-15 09:00',
  status: '已完成'
})

// 跟进记录
const followUps = ref([
  { time: '2026-04-01 10:30', operator: '李导购', content: '客户确认订单' },
  { time: '2026-04-12 10:00', operator: '李导购', content: '通知客户已发货' },
  { time: '2026-04-14 14:30', operator: '李导购', content: '确认客户收到货' },
  { time: '2026-04-15 14:30', operator: '李导购', content: '确认安装完成' }
])

// 返回
const goBack = () => {
  // 返回到订单列表
  console.log('返回订单列表')
}

// 更新状态
const updateStatus = () => {
  // 更新订单状态
  console.log('更新订单状态')
}

// 咨询生产进度
const consultProduction = () => {
  // 向总部发起生产进度咨询
  console.log('咨询生产进度')
}

// 添加跟进记录
const addFollowUp = () => {
  // 添加跟进记录
  console.log('添加跟进记录')
}

// 组件挂载
onMounted(() => {
  // 模拟获取订单详情数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.order-detail {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.status-section {
  margin-bottom: 20px;
}

.order-status {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.status-time {
  margin-left: 20px;
  color: #909399;
}

.status-actions {
  margin-top: 10px;
}

.info-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.production-progress {
  margin-top: 20px;
}

.logistics-info {
  margin-top: 20px;
}

.logistics-timeline {
  margin-top: 20px;
}

.installation-info {
  margin-top: 20px;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #909399;
}
</style>