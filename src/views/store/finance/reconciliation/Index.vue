<template>
  <div class="reconciliation-management">
    <div class="page-header">
      <h1>与总部对账管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="对账周期">
          <el-select v-model="filterForm.period" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="2026年3月" value="2026-03"></el-option>
            <el-option label="2026年2月" value="2026-02"></el-option>
            <el-option label="2026年1月" value="2026-01"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对账状态">
          <el-select v-model="filterForm.status" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待确认" value="pending"></el-option>
            <el-option label="已确认" value="confirmed"></el-option>
            <el-option label="已结算" value="settled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small">查询</el-button>
          <el-button size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-section">
      <el-button>导出对账单</el-button>
    </div>
    
    <!-- 对账列表 -->
    <div class="table-section">
      <el-card shadow="hover">
        <el-table :data="reconciliations" style="width: 100%">
          <el-table-column prop="id" label="对账单号" width="180"></el-table-column>
          <el-table-column prop="period" label="对账周期" width="120"></el-table-column>
          <el-table-column prop="amount" label="对账金额" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="settleTime" label="结算时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
              <el-button size="small" type="primary" v-if="scope.row.status === 'pending'" @click="confirmReconciliation(scope.row.id)">确认对账</el-button>
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
    
    <!-- 对账详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="对账详情"
      width="800px"
    >
      <div class="reconciliation-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="对账单号">{{ selectedReconciliation.id }}</el-descriptions-item>
          <el-descriptions-item label="对账周期">{{ selectedReconciliation.period }}</el-descriptions-item>
          <el-descriptions-item label="对账金额">{{ selectedReconciliation.amount }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusText(selectedReconciliation.status) }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedReconciliation.createTime }}</el-descriptions-item>
          <el-descriptions-item label="结算时间">{{ selectedReconciliation.settleTime || '未结算' }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="reconciliation-items">
          <h3>对账明细</h3>
          <el-table :data="selectedReconciliation.items" style="width: 100%">
            <el-table-column prop="orderId" label="订单号" width="180"></el-table-column>
            <el-table-column prop="amount" label="金额" width="120"></el-table-column>
            <el-table-column prop="commission" label="佣金" width="100"></el-table-column>
            <el-table-column prop="status" label="状态" width="100"></el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 筛选表单
const filterForm = ref({
  period: '',
  status: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(20)

// 对账列表
const reconciliations = ref([
  { id: 'REC202603001', period: '2026年3月', amount: '¥120,000', status: 'pending', createTime: '2026-04-01 00:00', settleTime: '' },
  { id: 'REC202602001', period: '2026年2月', amount: '¥105,000', status: 'settled', createTime: '2026-03-01 00:00', settleTime: '2026-03-10 14:30' },
  { id: 'REC202601001', period: '2026年1月', amount: '¥98,000', status: 'settled', createTime: '2026-02-01 00:00', settleTime: '2026-02-08 10:00' }
])

// 详情弹窗
const detailDialogVisible = ref(false)
const selectedReconciliation = ref({
  id: '',
  period: '',
  amount: '',
  status: '',
  createTime: '',
  settleTime: '',
  items: []
})

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    confirmed: 'info',
    settled: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待确认',
    confirmed: '已确认',
    settled: '已结算'
  }
  return textMap[status] || status
}

// 查看详情
const viewDetail = (id) => {
  // 模拟获取对账详情
  selectedReconciliation.value = {
    id: id,
    period: '2026年3月',
    amount: '¥120,000',
    status: 'pending',
    createTime: '2026-04-01 00:00',
    settleTime: '',
    items: [
      { orderId: 'ORD20260301001', amount: '¥12,800', commission: '¥1,280', status: '已确认' },
      { orderId: 'ORD20260302001', amount: '¥18,600', commission: '¥1,860', status: '已确认' },
      { orderId: 'ORD20260303001', amount: '¥8,900', commission: '¥890', status: '已确认' },
      { orderId: 'ORD20260304001', amount: '¥25,000', commission: '¥2,500', status: '已确认' },
      { orderId: 'ORD20260305001', amount: '¥15,600', commission: '¥1,560', status: '已确认' }
    ]
  }
  detailDialogVisible.value = true
}

// 确认对账
const confirmReconciliation = (id) => {
  // 确认对账
  console.log('确认对账:', id)
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
.reconciliation-management {
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

.action-section {
  margin-bottom: 20px;
}

.table-section {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.reconciliation-detail {
  padding: 20px 0;
}

.reconciliation-items {
  margin-top: 20px;
}

.reconciliation-items h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}
</style>