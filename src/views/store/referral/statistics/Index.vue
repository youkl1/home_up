<template>
  <div class="referral-statistics">
    <div class="page-header">
      <h1>裂变数据统计</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="导购">
          <el-select v-model="filterForm.sales" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="赵经理" value="sales1"></el-option>
            <el-option label="钱经理" value="sales2"></el-option>
            <el-option label="孙经理" value="sales3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
          <el-button type="success" @click="exportReport">导出报表</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 数据卡片 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ totalReferrals }}</div>
              <div class="stat-label">转介绍总量</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ conversionRate }}%</div>
              <div class="stat-label">转化率</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ avgReward }}</div>
              <div class="stat-label">平均奖励</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ totalRewardCost }}</div>
              <div class="stat-label">奖励成本</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>转介绍渠道分布</span>
              </div>
            </template>
            <div class="chart-container">
              <div class="mock-chart pie-chart">
                <div class="chart-title">渠道分布占比</div>
                <div class="pie-container">
                  <div class="pie-segment" style="--percentage: 40%; --color: #1890ff;"></div>
                  <div class="pie-segment" style="--percentage: 30%; --color: #52c41a;"></div>
                  <div class="pie-segment" style="--percentage: 20%; --color: #faad14;"></div>
                  <div class="pie-segment" style="--percentage: 10%; --color: #f5222d;"></div>
                  <div class="pie-center">
                    <div class="pie-label">40%</div>
                    <div class="pie-sub-label">微信</div>
                  </div>
                </div>
                <div class="pie-legend">
                  <div class="legend-item">
                    <div class="legend-color" style="background-color: #1890ff;"></div>
                    <span>微信</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background-color: #52c41a;"></div>
                    <span>短信</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background-color: #faad14;"></div>
                    <span>线下</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background-color: #f5222d;"></div>
                    <span>其他</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>成单转化率</span>
              </div>
            </template>
            <div class="chart-container">
              <div class="mock-chart bar-chart">
                <div class="chart-title">月度转化率趋势</div>
                <div class="chart-bars">
                  <div class="bar" style="height: 30%;"><span>1月</span></div>
                  <div class="bar" style="height: 45%;"><span>2月</span></div>
                  <div class="bar" style="height: 60%;"><span>3月</span></div>
                  <div class="bar" style="height: 55%;"><span>4月</span></div>
                  <div class="bar" style="height: 70%;"><span>5月</span></div>
                  <div class="bar" style="height: 85%;"><span>6月</span></div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 奖励成本统计 -->
    <div class="cost-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>奖励成本统计</span>
          </div>
        </template>
        <div class="cost-table">
          <el-table :data="costData" style="width: 100%">
            <el-table-column prop="period" label="统计周期" width="120"></el-table-column>
            <el-table-column prop="rewardCount" label="奖励次数" width="100"></el-table-column>
            <el-table-column prop="commissionCost" label="佣金成本"></el-table-column>
            <el-table-column prop="giftCost" label="礼品成本"></el-table-column>
            <el-table-column prop="totalCost" label="总成本"></el-table-column>
            <el-table-column prop="returnRate" label="投资回报率" width="120">
              <template #default="scope">
                <el-tag type="success">{{ scope.row.returnRate }}%</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 筛选表单
const filterForm = ref({
  dateRange: [],
  sales: ''
})

// 统计数据
const totalReferrals = ref(156)
const conversionRate = ref(57)
const avgReward = ref('¥350')
const totalRewardCost = ref('¥31,500')

// 奖励成本数据
const costData = ref([
  { period: '2026-01', rewardCount: 20, commissionCost: '¥4,500', giftCost: '¥1,200', totalCost: '¥5,700', returnRate: '320%' },
  { period: '2026-02', rewardCount: 18, commissionCost: '¥3,800', giftCost: '¥900', totalCost: '¥4,700', returnRate: '310%' },
  { period: '2026-03', rewardCount: 25, commissionCost: '¥5,200', giftCost: '¥1,500', totalCost: '¥6,700', returnRate: '330%' },
  { period: '2026-04', rewardCount: 30, commissionCost: '¥6,800', giftCost: '¥1,800', totalCost: '¥8,600', returnRate: '350%' }
])

// 导出报表
const exportReport = () => {
  // 导出统计报表
  console.log('导出统计报表')
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
.referral-statistics {
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

.stats-section {
  margin-bottom: 20px;
}

.stat-card {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.charts-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  margin-top: 10px;
  height: 300px;
}

.mock-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chart-title {
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.pie-chart {
  width: 100%;
}

.pie-container {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px 0;
}

.pie-segment {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color);
  clip-path: polygon(50% 50%, 50% 0%, calc(50% + 50% * cos(var(--angle))) calc(50% + 50% * sin(var(--angle))));
  transform: rotate(calc(var(--offset) * 1deg));
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.pie-label {
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
}

.pie-sub-label {
  font-size: 12px;
  color: #666;
}

.pie-legend {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.bar-chart {
  width: 100%;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  height: 200px;
  width: 100%;
  padding: 0 40px;
}

.bar {
  flex: 1;
  background-color: #1890ff;
  border-radius: 4px 4px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 10px;
  color: white;
  font-size: 12px;
}

.cost-section {
  margin-bottom: 20px;
}

.cost-table {
  margin-top: 10px;
}
</style>