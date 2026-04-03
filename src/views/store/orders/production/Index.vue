<template>
  <div class="production-tracking">
    <div class="page-header">
      <h1>生产进度跟踪</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="订单号">
          <el-input v-model="filterForm.orderId" size="small" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="filterForm.customer" size="small" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="生产状态">
          <el-select v-model="filterForm.status" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待生产" value="pending"></el-option>
            <el-option label="生产中" value="inProduction"></el-option>
            <el-option label="生产完成" value="completed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small">查询</el-button>
          <el-button size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 生产进度表格 -->
    <div class="table-section">
      <el-card shadow="hover">
        <el-table :data="productionList" style="width: 100%">
          <el-table-column prop="orderId" label="订单号" width="180"></el-table-column>
          <el-table-column prop="customer" label="客户"></el-table-column>
          <el-table-column prop="productName" label="产品名称"></el-table-column>
          <el-table-column prop="productionStatus" label="生产状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.productionStatus)">
                {{ scope.row.productionStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="estimatedDelivery" label="预计交付时间" width="180"></el-table-column>
          <el-table-column prop="currentStep" label="当前工序" width="120"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row.orderId)">查看详情</el-button>
              <el-button size="small" type="primary" @click="consultProgress(scope.row.orderId)">咨询进度</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
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
    
    <!-- 生产明细弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="生产明细"
      width="800px"
    >
      <div class="production-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ selectedOrder.orderId }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ selectedOrder.customer }}</el-descriptions-item>
          <el-descriptions-item label="产品名称">{{ selectedOrder.productName }}</el-descriptions-item>
          <el-descriptions-item label="预计交付时间">{{ selectedOrder.estimatedDelivery }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="production-steps">
          <h3>生产工序</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(step, index) in selectedOrder.steps"
              :key="index"
              :timestamp="step.time"
              :type="step.status === 'completed' ? 'success' : 'info'"
              :icon="step.status === 'completed' ? 'el-icon-check' : 'el-icon-time'"
            >
              <div class="step-content">
                <div class="step-name">{{ step.name }}</div>
                <div class="step-description">{{ step.description }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 咨询进度弹窗 -->
    <el-dialog
      v-model="consultDialogVisible"
      title="咨询生产进度"
      width="600px"
    >
      <div class="consult-form">
        <el-form :model="consultForm" label-width="80px">
          <el-form-item label="订单号">
            <el-input v-model="consultForm.orderId" disabled></el-input>
          </el-form-item>
          <el-form-item label="咨询内容">
            <el-input type="textarea" v-model="consultForm.content" :rows="4" placeholder="请输入咨询内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="consultDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitConsult">提交咨询</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 筛选表单
const filterForm = ref({
  orderId: '',
  customer: '',
  status: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

// 生产进度列表
const productionList = ref([
  { orderId: 'ORD20260401001', customer: '张女士', productName: '沙发', productionStatus: '生产中', estimatedDelivery: '2026-04-15', currentStep: '裁剪' },
  { orderId: 'ORD20260401002', customer: '李先生', productName: '床', productionStatus: '待生产', estimatedDelivery: '2026-04-20', currentStep: '待开始' },
  { orderId: 'ORD20260331001', customer: '王女士', productName: '餐桌', productionStatus: '生产完成', estimatedDelivery: '2026-04-10', currentStep: '包装' },
  { orderId: 'ORD20260331002', customer: '赵先生', productName: '衣柜', productionStatus: '生产中', estimatedDelivery: '2026-04-18', currentStep: '组装' },
  { orderId: 'ORD20260330001', customer: '刘女士', productName: '书桌', productionStatus: '待生产', estimatedDelivery: '2026-04-12', currentStep: '待开始' }
])

// 明细弹窗
const detailDialogVisible = ref(false)
const selectedOrder = ref({
  orderId: '',
  customer: '',
  productName: '',
  estimatedDelivery: '',
  steps: []
})

// 咨询弹窗
const consultDialogVisible = ref(false)
const consultForm = ref({
  orderId: '',
  content: ''
})

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'info',
    inProduction: 'warning',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

// 查看详情
const viewDetail = (orderId) => {
  // 模拟获取订单生产明细
  selectedOrder.value = {
    orderId: orderId,
    customer: '张女士',
    productName: '沙发',
    estimatedDelivery: '2026-04-15',
    steps: [
      { name: '备料', status: 'completed', time: '2026-04-02 09:00', description: '准备原材料' },
      { name: '裁剪', status: 'completed', time: '2026-04-03 10:00', description: '裁剪面料' },
      { name: '缝纫', status: 'inProgress', time: '2026-04-04 09:00', description: '缝制沙发套' },
      { name: '组装', status: 'pending', time: '', description: '组装沙发框架' },
      { name: '包装', status: 'pending', time: '', description: '包装成品' }
    ]
  }
  detailDialogVisible.value = true
}

// 咨询进度
const consultProgress = (orderId) => {
  consultForm.value.orderId = orderId
  consultDialogVisible.value = true
}

// 提交咨询
const submitConsult = () => {
  // 提交咨询到总部
  console.log('提交咨询:', consultForm.value)
  consultDialogVisible.value = false
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 加载对应页数据
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
.production-tracking {
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

.filter-form {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.table-section {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.production-detail {
  padding: 20px 0;
}

.production-steps {
  margin-top: 20px;
}

.production-steps h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.step-content {
  margin-top: 5px;
}

.step-name {
  font-weight: bold;
}

.step-description {
  color: #666;
  font-size: 14px;
  margin-top: 5px;
}

.consult-form {
  padding: 20px 0;
}
</style>