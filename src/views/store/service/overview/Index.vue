<template>
  <div class="service-overview">
    <div class="page-header">
      <h1>售后工单总览</h1>
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
              <div class="data-value">{{ totalTickets }}</div>
              <div class="data-label">累计工单</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ pendingTickets }}</div>
              <div class="data-label">待处理</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ processingTickets }}</div>
              <div class="data-label">处理中</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ completedTickets }}</div>
              <div class="data-label">已完成</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ closedTickets }}</div>
              <div class="data-label">已关闭</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ complaintTickets }}</div>
              <div class="data-label">投诉工单</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 工单状态饼图 -->
    <div class="chart-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>工单状态分布</span>
          </div>
        </template>
        <div class="chart-container">
          <div class="chart-placeholder">工单状态饼图</div>
        </div>
      </el-card>
    </div>
    
    <!-- 处理时效统计 -->
    <div class="chart-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>处理时效统计</span>
          </div>
        </template>
        <div class="chart-container">
          <div class="chart-placeholder">处理时效统计图</div>
        </div>
      </el-card>
    </div>
    
    <!-- 最近工单 -->
    <div class="recent-tickets">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>最近工单</span>
            <el-button size="small">查看全部</el-button>
          </div>
        </template>
        <el-table :data="recentTickets" style="width: 100%">
          <el-table-column prop="id" label="工单号" width="180"></el-table-column>
          <el-table-column prop="customer" label="客户"></el-table-column>
          <el-table-column prop="type" label="工单类型" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="handler" label="处理人" width="120"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 筛选表单
const filterForm = ref({
  timeRange: 'month'
})

// 模拟数据
const totalTickets = ref(156)
const pendingTickets = ref(23)
const processingTickets = ref(45)
const completedTickets = ref(78)
const closedTickets = ref(10)
const complaintTickets = ref(8)

// 最近工单
const recentTickets = ref([
  { id: 'SRV20260401001', customer: '张女士', type: '安装问题', status: '处理中', createTime: '2026-04-01 10:30', handler: '李师傅' },
  { id: 'SRV20260401002', customer: '李先生', type: '产品质量', status: '待处理', createTime: '2026-04-01 09:15', handler: '' },
  { id: 'SRV20260331001', customer: '王女士', type: '退款申请', status: '已完成', createTime: '2026-03-31 16:45', handler: '赵经理' },
  { id: 'SRV20260331002', customer: '赵先生', type: '安装问题', status: '已完成', createTime: '2026-03-31 14:20', handler: '李师傅' },
  { id: 'SRV20260330001', customer: '刘女士', type: '产品质量', status: '处理中', createTime: '2026-03-30 11:00', handler: '赵经理' }
])

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    '待处理': 'warning',
    '处理中': 'info',
    '已完成': 'success',
    '已关闭': 'danger'
  }
  return typeMap[status] || 'info'
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
.service-overview {
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

.recent-tickets {
  margin-bottom: 20px;
}
</style>