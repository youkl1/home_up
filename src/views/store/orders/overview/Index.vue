<template>
  <div class="orders-overview">
    <div class="page-header">
      <h1>订单总览</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="时间范围">
          <el-select v-model="filterForm.timeRange" size="small">
            <el-option label="今日" value="today"></el-option>
            <el-option label="本周" value="week"></el-option>
            <el-option label="本月" value="month"></el-option>
            <el-option label="全年" value="year"></el-option>
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
              <div class="data-value">{{ totalOrders }}</div>
              <div class="data-label">累计订单量</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ totalAmount }}</div>
              <div class="data-label">总成单额</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ pendingProduction }}</div>
              <div class="data-label">待生产</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ inProduction }}</div>
              <div class="data-label">生产中</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ pendingDelivery }}</div>
              <div class="data-label">待发货</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ pendingInstallation }}</div>
              <div class="data-label">待安装</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-item">
              <div class="data-value">{{ completed }}</div>
              <div class="data-label">已交付</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 订单状态饼图 -->
    <div class="chart-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>订单状态分布</span>
          </div>
        </template>
        <div class="chart-container">
          <div class="chart-placeholder">订单状态饼图</div>
        </div>
      </el-card>
    </div>
    
    <!-- 业绩趋势图 -->
    <div class="chart-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>业绩趋势</span>
            <el-select v-model="trendRange" size="small">
              <el-option label="近7天" value="7d"></el-option>
              <el-option label="近30天" value="30d"></el-option>
              <el-option label="近90天" value="90d"></el-option>
            </el-select>
          </div>
        </template>
        <div class="chart-container">
          <div class="chart-placeholder">业绩趋势图</div>
        </div>
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

// 趋势图时间范围
const trendRange = ref('30d')

// 模拟数据
const totalOrders = ref(128)
const totalAmount = ref('¥1,285,000')
const pendingProduction = ref(23)
const inProduction = ref(35)
const pendingDelivery = ref(18)
const pendingInstallation = ref(22)
const completed = ref(20)

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.orders-overview {
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
</style>