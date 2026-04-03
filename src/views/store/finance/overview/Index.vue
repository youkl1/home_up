<template>
  <div class="finance-overview">
    <div class="page-header">
      <h1>门店财务总览</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="时间范围">
          <el-select v-model="filterForm.timeRange" size="small">
            <el-option label="本月" value="month"></el-option>
            <el-option label="本季度" value="quarter"></el-option>
            <el-option label="本年" value="year"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 数据卡片 -->
    <div class="data-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ totalRevenue }}</div>
              <div class="data-label">累计营收</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ receivedAmount }}</div>
              <div class="data-label">已收款</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ pendingAmount }}</div>
              <div class="data-label">待收款</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ rebateAmount }}</div>
              <div class="data-label">返利总额</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ depositBalance }}</div>
              <div class="data-label">保证金余额</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ reconciliationAmount }}</div>
              <div class="data-label">待结算金额</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 收支趋势图 -->
    <div class="chart-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>收支趋势</span>
            <el-select v-model="trendRange" size="small">
              <el-option label="近7天" value="7d"></el-option>
              <el-option label="近30天" value="30d"></el-option>
              <el-option label="近90天" value="90d"></el-option>
            </el-select>
          </div>
        </template>
        <div class="chart-container">
          <div class="chart-placeholder">收支趋势图</div>
        </div>
      </el-card>
    </div>
    
    <!-- 最近交易记录 -->
    <div class="recent-transactions">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>最近交易记录</span>
            <el-button size="small" @click="viewAllTransactions">查看全部</el-button>
          </div>
        </template>
        <el-table :data="transactions" style="width: 100%">
          <el-table-column prop="time" label="时间" width="180"></el-table-column>
          <el-table-column prop="type" label="类型" width="120"></el-table-column>
          <el-table-column prop="amount" label="金额" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 全部交易记录弹窗 -->
    <el-dialog
      v-model="allTransactionsDialogVisible"
      title="全部交易记录"
      width="900px"
    >
      <div class="all-transactions">
        <!-- 筛选条件 -->
        <div class="filter-section mb-4">
          <el-form :inline="true" :model="transactionFilterForm" class="filter-form">
            <el-form-item label="交易类型">
              <el-select v-model="transactionFilterForm.type" size="small" placeholder="全部类型">
                <el-option label="全部类型" value=""></el-option>
                <el-option label="收款" value="收款"></el-option>
                <el-option label="返利" value="返利"></el-option>
                <el-option label="对账" value="对账"></el-option>
                <el-option label="退款" value="退款"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交易状态">
              <el-select v-model="transactionFilterForm.status" size="small" placeholder="全部状态">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="已完成" value="已完成"></el-option>
                <el-option label="待处理" value="待处理"></el-option>
                <el-option label="失败" value="失败"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="transactionFilterForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small">查询</el-button>
              <el-button size="small" @click="resetTransactionFilter">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 交易记录表格 -->
        <el-table :data="allTransactions" style="width: 100%">
          <el-table-column prop="id" label="交易ID" width="150"></el-table-column>
          <el-table-column prop="time" label="时间" width="180"></el-table-column>
          <el-table-column prop="type" label="类型" width="120"></el-table-column>
          <el-table-column prop="amount" label="金额" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getTransactionStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination mt-4">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="allTransactionsTotal"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleTransactionPageChange"
          ></el-pagination>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="allTransactionsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 筛选表单
const filterForm = ref({
  timeRange: 'month'
})

// 趋势图时间范围
const trendRange = ref('30d')

// 模拟数据
const totalRevenue = ref('¥1,285,000')
const receivedAmount = ref('¥1,120,000')
const pendingAmount = ref('¥165,000')
const rebateAmount = ref('¥85,000')
const depositBalance = ref('¥200,000')
const reconciliationAmount = ref('¥120,000')

// 最近交易记录
const transactions = ref([
  { time: '2026-04-01 10:30', type: '收款', amount: '¥12,800', status: '已完成', description: '订单 ORD20260401001 收款' },
  { time: '2026-03-31 16:45', type: '收款', amount: '¥8,900', status: '已完成', description: '订单 ORD20260331001 收款' },
  { time: '2026-03-30 14:20', type: '返利', amount: '¥5,000', status: '已完成', description: '3月返利' },
  { time: '2026-03-29 11:00', type: '收款', amount: '¥15,600', status: '待处理', description: '订单 ORD20260330001 收款' },
  { time: '2026-03-28 09:15', type: '对账', amount: '¥50,000', status: '已完成', description: '2月对账结算' }
])

// 全部交易记录弹窗
const allTransactionsDialogVisible = ref(false)

// 交易记录筛选表单
const transactionFilterForm = ref({
  type: '',
  status: '',
  dateRange: []
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const allTransactionsTotal = ref(50)

// 全部交易记录
const allTransactions = ref([
  { id: 'TX20260401001', time: '2026-04-01 10:30', type: '收款', amount: '¥12,800', status: '已完成', description: '订单 ORD20260401001 收款', operator: '张导购' },
  { id: 'TX20260331001', time: '2026-03-31 16:45', type: '收款', amount: '¥8,900', status: '已完成', description: '订单 ORD20260331001 收款', operator: '李导购' },
  { id: 'TX20260330001', time: '2026-03-30 14:20', type: '返利', amount: '¥5,000', status: '已完成', description: '3月返利', operator: '系统自动' },
  { id: 'TX20260329001', time: '2026-03-29 11:00', type: '收款', amount: '¥15,600', status: '待处理', description: '订单 ORD20260330001 收款', operator: '王导购' },
  { id: 'TX20260328001', time: '2026-03-28 09:15', type: '对账', amount: '¥50,000', status: '已完成', description: '2月对账结算', operator: '系统自动' },
  { id: 'TX20260327001', time: '2026-03-27 16:00', type: '退款', amount: '¥2,500', status: '已完成', description: '订单 ORD20260325001 退款', operator: '赵店长' },
  { id: 'TX20260326001', time: '2026-03-26 14:30', type: '收款', amount: '¥9,200', status: '已完成', description: '订单 ORD20260326001 收款', operator: '张导购' },
  { id: 'TX20260325001', time: '2026-03-25 10:15', type: '收款', amount: '¥18,500', status: '已完成', description: '订单 ORD20260325001 收款', operator: '李导购' },
  { id: 'TX20260324001', time: '2026-03-24 09:30', type: '对账', amount: '¥35,000', status: '已完成', description: '1月对账结算', operator: '系统自动' },
  { id: 'TX20260323001', time: '2026-03-23 15:45', type: '返利', amount: '¥3,000', status: '已完成', description: '2月返利', operator: '系统自动' }
])

// 查看全部交易记录
const viewAllTransactions = () => {
  allTransactionsDialogVisible.value = true
}

// 重置交易记录筛选
const resetTransactionFilter = () => {
  transactionFilterForm.value = {
    type: '',
    status: '',
    dateRange: []
  }
}

// 获取交易状态类型
const getTransactionStatusType = (status) => {
  switch (status) {
    case '已完成': return 'success'
    case '待处理': return 'warning'
    case '失败': return 'danger'
    default: return 'info'
  }
}

// 交易记录分页变化
const handleTransactionPageChange = (page) => {
  currentPage.value = page
  // 加载对应页数据
}

// 获取状态类型
const getStatusType = (status) => {
  return status === '已完成' ? 'success' : 'warning'
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
.finance-overview {
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

.data-cards {
  margin-bottom: 20px;
}

.data-item {
  text-align: center;
  padding: 20px 0;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}

.data-label {
  font-size: 14px;
  color: #666;
}

.chart-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.chart-placeholder {
  font-size: 16px;
  color: #909399;
}

.recent-transactions {
  margin-bottom: 20px;
}

/* 全部交易记录样式 */
.all-transactions {
  padding: 10px 0;
}

.mb-4 {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.mt-4 {
  margin-top: 20px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .filter-form {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .el-form-item {
    margin-right: 0 !important;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .el-pagination {
    flex-wrap: wrap;
  }
}
</style>