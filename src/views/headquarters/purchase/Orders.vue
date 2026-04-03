<template>
  <div class="headquarters-purchase-orders">
    <div class="page-header">
      <h1>订单管理</h1>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover" class="card transition-all">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索订单编号或供应商" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="orderStatus" placeholder="选择状态" class="w-full">
              <el-option label="全部" value=""></el-option>
              <el-option label="待处理" value="pending"></el-option>
              <el-option label="已确认" value="confirmed"></el-option>
              <el-option label="已发货" value="shipped"></el-option>
              <el-option label="已完成" value="completed"></el-option>
              <el-option label="已取消" value="cancelled"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 订单列表 -->
    <div class="order-list">
      <el-card shadow="hover" class="card transition-all">
        <el-table :data="filteredOrders" style="width: 100%" class="orders-table" @row-click="viewOrderDetail">
          <el-table-column prop="id" label="订单编号" width="150"></el-table-column>
          <el-table-column prop="supplier" label="供应商" width="150"></el-table-column>
          <el-table-column prop="totalAmount" label="订单金额" width="120"></el-table-column>
          <el-table-column prop="orderTime" label="下单时间" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.statusText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click.stop="viewOrderDetail(scope.row)">查看</el-button>
              <el-button v-if="scope.row.status === 'pending'" size="small" type="success" @click.stop="confirmOrder(scope.row)">确认</el-button>
              <el-button v-if="scope.row.status === 'confirmed'" size="small" type="primary" @click.stop="shipOrder(scope.row)">发货</el-button>
              <el-button v-if="scope.row.status === 'shipped'" size="small" type="info" @click.stop="completeOrder(scope.row)">完成</el-button>
              <el-button v-if="scope.row.status === 'pending' || scope.row.status === 'confirmed'" size="small" type="danger" @click.stop="cancelOrder(scope.row)">取消</el-button>
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
    
    <!-- 订单详情弹窗 -->
    <el-dialog
      v-model="orderDetailVisible"
      :title="`订单详情 - ${currentOrder.id || ''}`"
      width="800px"
    >
      <div class="order-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form :model="currentOrder" label-width="100px">
              <el-form-item label="订单编号">
                <span>{{ currentOrder.id }}</span>
              </el-form-item>
              <el-form-item label="供应商">
                <span>{{ currentOrder.supplier }}</span>
              </el-form-item>
              <el-form-item label="订单金额">
                <span class="font-semibold">{{ currentOrder.totalAmount }}</span>
              </el-form-item>
              <el-form-item label="下单时间">
                <span>{{ currentOrder.orderTime }}</span>
              </el-form-item>
              <el-form-item label="订单状态">
                <el-tag :type="getStatusType(currentOrder.status)">{{ currentOrder.statusText }}</el-tag>
              </el-form-item>
              <el-form-item label="确认时间">
                <span>{{ currentOrder.confirmTime || '暂无' }}</span>
              </el-form-item>
              <el-form-item label="发货时间">
                <span>{{ currentOrder.shipTime || '暂无' }}</span>
              </el-form-item>
              <el-form-item label="完成时间">
                <span>{{ currentOrder.completeTime || '暂无' }}</span>
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
          <el-button v-if="currentOrder.status === 'pending'" type="success" @click="confirmOrder(currentOrder)">确认订单</el-button>
          <el-button v-if="currentOrder.status === 'confirmed'" type="primary" @click="shipOrder(currentOrder)">标记发货</el-button>
          <el-button v-if="currentOrder.status === 'shipped'" type="info" @click="completeOrder(currentOrder)">标记完成</el-button>
          <el-button v-if="(currentOrder.status === 'pending' || currentOrder.status === 'confirmed') && !currentOrder.cancelled" type="danger" @click="cancelOrder(currentOrder)">取消订单</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const orderStatus = ref('')

// 订单数据
const orders = ref([
  {
    id: 'PO20260401001', 
    supplier: '广东橱柜厂', 
    totalAmount: '¥128,500', 
    orderTime: '2026-04-01 10:30', 
    status: 'pending', 
    statusText: '待处理',
    remark: '加急订单，需要尽快处理',
    items: [
      { name: '橱柜门板', quantity: '100', unitPrice: '¥800', subtotal: '¥80,000' },
      { name: '橱柜柜体', quantity: '100', unitPrice: '¥485', subtotal: '¥48,500' }
    ]
  },
  {
    id: 'PO20260401002', 
    supplier: '浙江五金厂', 
    totalAmount: '¥89,200', 
    orderTime: '2026-04-01 09:15', 
    status: 'confirmed', 
    statusText: '已确认',
    confirmTime: '2026-04-01 11:00',
    remark: '常规采购',
    items: [
      { name: '铰链', quantity: '5000', unitPrice: '¥12', subtotal: '¥60,000' },
      { name: '拉手', quantity: '2000', unitPrice: '¥14.6', subtotal: '¥29,200' }
    ]
  },
  {
    id: 'PO20260331001', 
    supplier: '上海板材厂', 
    totalAmount: '¥235,600', 
    orderTime: '2026-03-31 16:45', 
    status: 'shipped', 
    statusText: '已发货',
    confirmTime: '2026-04-01 09:00',
    shipTime: '2026-04-01 14:00',
    remark: '',
    items: [
      { name: '密度板', quantity: '1000', unitPrice: '¥180', subtotal: '¥180,000' },
      { name: '刨花板', quantity: '500', unitPrice: '¥111.2', subtotal: '¥55,600' }
    ]
  },
  {
    id: 'PO20260331002', 
    supplier: '广东玻璃厂', 
    totalAmount: '¥67,800', 
    orderTime: '2026-03-31 14:20', 
    status: 'completed', 
    statusText: '已完成',
    confirmTime: '2026-03-31 15:00',
    shipTime: '2026-04-01 10:00',
    completeTime: '2026-04-03 09:00',
    remark: '需要特殊尺寸定制',
    items: [
      { name: '钢化玻璃', quantity: '300', unitPrice: '¥226', subtotal: '¥67,800' }
    ]
  },
  {
    id: 'PO20260330001', 
    supplier: '江苏配件厂', 
    totalAmount: '¥45,300', 
    orderTime: '2026-03-30 11:00', 
    status: 'cancelled', 
    statusText: '已取消',
    remark: '客户取消订单',
    items: [
      { name: '螺丝', quantity: '10000', unitPrice: '¥2.5', subtotal: '¥25,000' },
      { name: '螺母', quantity: '5000', unitPrice: '¥4.06', subtotal: '¥20,300' }
    ]
  }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const orderDetailVisible = ref(false)

// 当前订单
const currentOrder = ref({})

// 过滤后的订单列表
const filteredOrders = computed(() => {
  let result = [...orders.value]
  
  // 搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(order => 
      order.id.toLowerCase().includes(keyword) || 
      order.supplier.toLowerCase().includes(keyword)
    )
  }
  
  // 状态过滤
  if (orderStatus.value) {
    result = result.filter(order => order.status === orderStatus.value)
  }
  
  return result
})

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'confirmed':
      return 'info'
    case 'shipped':
      return 'primary'
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'danger'
    default:
      return 'info'
  }
}

// 搜索
const search = () => {
  // 模拟搜索
  ElMessage.success('搜索成功')
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  orderStatus.value = ''
}

// 查看订单详情
const viewOrderDetail = (row) => {
  Object.assign(currentOrder.value, row)
  orderDetailVisible.value = true
}

// 确认订单
const confirmOrder = (order) => {
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  // 模拟API调用
  setTimeout(() => {
    order.status = 'confirmed'
    order.statusText = '已确认'
    order.confirmTime = new Date().toLocaleString('zh-CN')
    
    ElMessage.success('订单确认成功')
    loading.close()
  }, 1000)
}

// 发货
const shipOrder = (order) => {
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  // 模拟API调用
  setTimeout(() => {
    order.status = 'shipped'
    order.statusText = '已发货'
    order.shipTime = new Date().toLocaleString('zh-CN')
    
    ElMessage.success('订单发货成功')
    loading.close()
  }, 1000)
}

// 完成订单
const completeOrder = (order) => {
  const loading = ElLoading.service({
    lock: true,
    text: '处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  // 模拟API调用
  setTimeout(() => {
    order.status = 'completed'
    order.statusText = '已完成'
    order.completeTime = new Date().toLocaleString('zh-CN')
    
    ElMessage.success('订单完成成功')
    loading.close()
  }, 1000)
}

// 取消订单
const cancelOrder = (order) => {
  ElMessageBox.confirm(
    `确定要取消订单 ${order.id} 吗？`,
    '取消订单',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(() => {
    const loading = ElLoading.service({
      lock: true,
      text: '处理中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      order.status = 'cancelled'
      order.statusText = '已取消'
      order.cancelled = true
      
      ElMessage.success('订单取消成功')
      loading.close()
    }, 1000)
  }).catch(() => {
    // 取消操作
  })
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
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
.headquarters-purchase-orders {
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

.search-filter {
  margin-bottom: var(--spacing-md);
}

.order-list {
  margin-bottom: var(--spacing-md);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: flex-end;
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

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .search-filter .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .headquarters-purchase-orders {
    padding: var(--spacing-sm);
  }
  
  .search-filter .el-col {
    --el-col-span: 24;
  }
  
  .order-detail .el-col {
    --el-col-span: 24;
  }
}
</style>