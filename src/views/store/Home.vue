<template>
  <div class="store-home">
    <div class="page-header">
      <h1>门店管理首页</h1>
    </div>
    
    <!-- 数据概览 -->
    <div class="data-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ totalSales }}</div>
              <div class="data-label">总销售额</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ totalCustomers }}</div>
              <div class="data-label">总客户数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ totalOrders }}</div>
              <div class="data-label">总订单数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ totalStaff }}</div>
              <div class="data-label">员工数</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 销售趋势 -->
    <div class="sales-trend">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>销售趋势</span>
            <el-select v-model="timeRange" size="small">
              <el-option label="近7天" value="7d"></el-option>
              <el-option label="近30天" value="30d"></el-option>
              <el-option label="近90天" value="90d"></el-option>
            </el-select>
          </div>
        </template>
        <div class="chart-container">
          <!-- 这里可以集成图表库，如ECharts -->
          <div class="chart-placeholder">销售趋势图表</div>
        </div>
      </el-card>
    </div>
    
    <!-- 最近订单 -->
    <div class="recent-orders">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>最近订单</span>
            <el-button type="primary" size="small">查看全部</el-button>
          </div>
        </template>
        <el-table :data="orders" style="width: 100%">
          <el-table-column prop="id" label="订单号" width="180"></el-table-column>
          <el-table-column prop="customer" label="客户"></el-table-column>
          <el-table-column prop="amount" label="金额" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 模拟数据
const totalSales = ref('¥128,500')
const totalCustomers = ref(156)
const totalOrders = ref(89)
const totalStaff = ref(12)

// 时间范围
const timeRange = ref('7d')

// 最近订单
const orders = ref([
  { id: 'ORD20260401001', customer: '张女士', amount: '¥12,800', status: '已完成', createTime: '2026-04-01 10:30' },
  { id: 'ORD20260401002', customer: '李先生', amount: '¥18,600', status: '处理中', createTime: '2026-04-01 09:15' },
  { id: 'ORD20260331001', customer: '王女士', amount: '¥8,900', status: '已完成', createTime: '2026-03-31 16:45' },
  { id: 'ORD20260331002', customer: '赵先生', amount: '¥25,000', status: '处理中', createTime: '2026-03-31 14:20' }
])

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.store-home {
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

.data-overview {
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

.sales-trend {
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

.recent-orders {
  margin-bottom: 20px;
}
</style>