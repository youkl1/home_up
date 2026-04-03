<template>
  <div class="purchase-orders">
    <div class="page-header">
      <h1>采购订单跟踪</h1>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="searchKeyword" placeholder="搜索订单号" prefix-icon="Search"></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="orderStatus" placeholder="订单状态" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="待付款" value="pending"></el-option>
              <el-option label="待发货" value="paid"></el-option>
              <el-option label="已发货" value="shipped"></el-option>
              <el-option label="已完成" value="completed"></el-option>
              <el-option label="已取消" value="cancelled"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button type="success" @click="goToReconciliation">财务对账</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 订单列表 -->
    <div class="orders-list">
      <el-card shadow="hover">
        <el-table :data="orders" style="width: 100%">
          <el-table-column prop="id" label="订单号" width="180"></el-table-column>
          <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
          <el-table-column prop="amount" label="订单金额" width="120">
            <template #default="scope">
              <span class="amount">¥{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="订单状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="logistics" label="物流信息">
            <template #default="scope">
              <div v-if="scope.row.logistics">
                <div>{{ scope.row.logistics.company }}</div>
                <div class="tracking-no">{{ scope.row.logistics.trackingNo }}</div>
              </div>
              <span v-else class="no-logistics">暂无物流信息</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
              <el-button size="small" type="primary" v-if="scope.row.status === 'pending'" @click="payOrder(scope.row.id)">立即付款</el-button>
              <el-button size="small" type="success" v-if="scope.row.status === 'shipped'" @click="confirmReceipt(scope.row.id)">确认收货</el-button>
              <el-button size="small" type="danger" v-if="canApplyAfterSales(scope.row.status)" @click="applyAfterSales(scope.row.id)">申请售后</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>

    <!-- 订单详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="订单详情" width="800px">
      <div class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ selectedOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ selectedOrder.createTime }}</el-descriptions-item>
          <el-descriptions-item label="订单金额">¥{{ selectedOrder.amount }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(selectedOrder.status)">{{ getStatusText(selectedOrder.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="收货人">{{ selectedOrder.receiver }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ selectedOrder.phone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">{{ selectedOrder.address }}</el-descriptions-item>
        </el-descriptions>

        <div class="order-items">
          <h3>商品清单</h3>
          <el-table :data="selectedOrder.items" style="width: 100%">
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="price" label="单价" width="120">
              <template #default="scope">¥{{ scope.row.price }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
            <el-table-column prop="subtotal" label="小计" width="120">
              <template #default="scope">¥{{ scope.row.subtotal }}</template>
            </el-table-column>
          </el-table>
        </div>

        <div class="logistics-info" v-if="selectedOrder.logistics">
          <h3>物流信息</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in selectedOrder.logistics.timeline"
              :key="index"
              :timestamp="item.time"
            >
              {{ item.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const searchKeyword = ref('')
const orderStatus = ref('')
const dateRange = ref([])

const orders = ref([
  { id: 'PO20260401001', createTime: '2026-04-01 10:30', amount: 8997, status: 'completed', receiver: '张三', phone: '138****1234', address: '北京市朝阳区建国路88号', logistics: { company: '顺丰速运', trackingNo: 'SF1234567890', timeline: [{ time: '2026-04-01 14:30', content: '订单已发货' }, { time: '2026-04-02 09:00', content: '快件已到达北京朝阳集散中心' }, { time: '2026-04-02 14:00', content: '快件已签收' }] }, items: [{ name: '现代简约沙发', price: 2999, quantity: 2, subtotal: 5998 }, { name: '实木茶几', price: 899, quantity: 1, subtotal: 899 }, { name: '北欧风格双人床', price: 1899, quantity: 1, subtotal: 1899 }] },
  { id: 'PO20260402001', createTime: '2026-04-02 09:15', amount: 5998, status: 'shipped', receiver: '李四', phone: '139****5678', address: '北京市海淀区中关村大街1号', logistics: { company: '京东物流', trackingNo: 'JD9876543210', timeline: [{ time: '2026-04-02 16:00', content: '订单已发货' }] }, items: [{ name: '现代简约沙发', price: 2999, quantity: 2, subtotal: 5998 }] },
  { id: 'PO20260403001', createTime: '2026-04-03 14:20', amount: 2898, status: 'pending', receiver: '王五', phone: '137****9012', address: '北京市西城区西单北大街120号', logistics: null, items: [{ name: '实木餐桌', price: 1299, quantity: 2, subtotal: 2598 }, { name: '玻璃茶几', price: 599, quantity: 1, subtotal: 599 }] }
])

const total = ref(3)
const pageSize = ref(10)
const currentPage = ref(1)
const detailDialogVisible = ref(false)
const selectedOrder = ref({
  id: '',
  createTime: '',
  amount: 0,
  status: '',
  receiver: '',
  phone: '',
  address: '',
  logistics: null,
  items: []
})

const getStatusType = (status) => {
  const typeMap = { pending: 'warning', paid: 'info', shipped: 'primary', completed: 'success', cancelled: 'danger' }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = { pending: '待付款', paid: '待发货', shipped: '已发货', completed: '已完成', cancelled: '已取消' }
  return textMap[status] || status
}

const canApplyAfterSales = (status) => {
  return ['completed', 'shipped'].includes(status)
}

const search = () => {
  ElMessage.success('搜索功能开发中')
}

const reset = () => {
  searchKeyword.value = ''
  orderStatus.value = ''
  dateRange.value = []
}

const goToReconciliation = () => {
  router.push('/store/finance/reconciliation')
}

const viewDetail = (id) => {
  const order = orders.value.find(item => item.id === id)
  if (order) {
    selectedOrder.value = { ...order }
    detailDialogVisible.value = true
  }
}

const payOrder = (id) => {
  ElMessage.success(`支付订单：${id}`)
}

const confirmReceipt = (id) => {
  ElMessageBox.confirm('确认已收到货物吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('确认收货成功')
  }).catch(() => {})
}

const applyAfterSales = (id) => {
  router.push(`/store/purchase/aftersales?orderId=${id}`)
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

onMounted(() => {
  console.log('[PurchaseOrders] 组件挂载')
})
</script>

<style scoped>
.purchase-orders {
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

.filter-section {
  margin-bottom: 20px;
}

.amount {
  font-weight: bold;
  color: #f56c6c;
}

.tracking-no {
  color: #409eff;
  font-size: 12px;
}

.no-logistics {
  color: #999;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.order-detail {
  padding: 20px 0;
}

.order-items,
.logistics-info {
  margin-top: 20px;
}

.order-items h3,
.logistics-info h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}
</style>
