<template>
  <div class="marketing-data">
    <div class="page-header">
      <h1>营销数据分析</h1>
    </div>
    
    <!-- 数据筛选 -->
    <div class="filter-section">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-col>
          <el-col :span="8">
            <el-select v-model="activityId" placeholder="选择活动">
              <el-option label="全部活动" value=""></el-option>
              <el-option label="春季家装节" value="ACT001"></el-option>
              <el-option label="五一劳动节特惠" value="ACT002"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button type="success" @click="exportData">导出报表</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 核心指标 -->
    <div class="metrics-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="metric-card">
            <div class="metric-content">
              <div class="metric-value">{{ metrics.exposure }}</div>
              <div class="metric-label">活动曝光</div>
              <div class="metric-change">
                <el-tag type="success">+15.2%</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="metric-card">
            <div class="metric-content">
              <div class="metric-value">{{ metrics.participation }}</div>
              <div class="metric-label">活动参与</div>
              <div class="metric-change">
                <el-tag type="success">+8.5%</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="metric-card">
            <div class="metric-content">
              <div class="metric-value">{{ metrics.conversion }}</div>
              <div class="metric-label">活动转化</div>
              <div class="metric-change">
                <el-tag type="danger">-2.1%</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="metric-card">
            <div class="metric-content">
              <div class="metric-value">{{ metrics.revenue }}</div>
              <div class="metric-label">活动营收</div>
              <div class="metric-change">
                <el-tag type="success">+22.8%</el-tag>
              </div>
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
                <span>活动趋势分析</span>
              </div>
            </template>
            <div class="chart-container">
              <div class="mock-chart">
                <div class="chart-title">曝光量/参与量/转化量趋势</div>
                <div class="chart-bars">
                  <div class="bar-group">
                    <div class="bar exposure" style="height: 80%;"></div>
                    <div class="bar participation" style="height: 60%;"></div>
                    <div class="bar conversion" style="height: 40%;"></div>
                    <span>周一</span>
                  </div>
                  <div class="bar-group">
                    <div class="bar exposure" style="height: 70%;"></div>
                    <div class="bar participation" style="height: 50%;"></div>
                    <div class="bar conversion" style="height: 35%;"></div>
                    <span>周二</span>
                  </div>
                  <div class="bar-group">
                    <div class="bar exposure" style="height: 90%;"></div>
                    <div class="bar participation" style="height: 70%;"></div>
                    <div class="bar conversion" style="height: 50%;"></div>
                    <span>周三</span>
                  </div>
                  <div class="bar-group">
                    <div class="bar exposure" style="height: 85%;"></div>
                    <div class="bar participation" style="height: 65%;"></div>
                    <div class="bar conversion" style="height: 45%;"></div>
                    <span>周四</span>
                  </div>
                  <div class="bar-group">
                    <div class="bar exposure" style="height: 95%;"></div>
                    <div class="bar participation" style="height: 75%;"></div>
                    <div class="bar conversion" style="height: 55%;"></div>
                    <span>周五</span>
                  </div>
                </div>
                <div class="chart-legend">
                  <div class="legend-item">
                    <div class="legend-color" style="background-color: #409eff;"></div>
                    <span>曝光量</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background-color: #67c23a;"></div>
                    <span>参与量</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background-color: #e6a23c;"></div>
                    <span>转化量</span>
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
                <span>活动转化漏斗</span>
              </div>
            </template>
            <div class="chart-container">
              <div class="funnel-chart">
                <div class="funnel-level" style="width: 100%;">
                  <div class="funnel-bar">
                    <span class="funnel-label">曝光</span>
                    <span class="funnel-value">12,580</span>
                  </div>
                </div>
                <div class="funnel-level" style="width: 75%;">
                  <div class="funnel-bar">
                    <span class="funnel-label">点击</span>
                    <span class="funnel-value">9,435</span>
                  </div>
                </div>
                <div class="funnel-level" style="width: 50%;">
                  <div class="funnel-bar">
                    <span class="funnel-label">参与</span>
                    <span class="funnel-value">6,290</span>
                  </div>
                </div>
                <div class="funnel-level" style="width: 30%;">
                  <div class="funnel-bar">
                    <span class="funnel-label">转化</span>
                    <span class="funnel-value">3,774</span>
                  </div>
                </div>
                <div class="funnel-level" style="width: 15%;">
                  <div class="funnel-bar">
                    <span class="funnel-label">成单</span>
                    <span class="funnel-value">1,887</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 活动数据明细 -->
    <div class="detail-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>活动数据明细</span>
          </div>
        </template>
        <el-table :data="activityData" style="width: 100%">
          <el-table-column prop="name" label="活动名称"></el-table-column>
          <el-table-column prop="exposure" label="曝光量"></el-table-column>
          <el-table-column prop="participation" label="参与量"></el-table-column>
          <el-table-column prop="conversion" label="转化量"></el-table-column>
          <el-table-column prop="conversionRate" label="转化率">
            <template #default="scope">
              <el-tag :type="scope.row.conversionRate >= 30 ? 'success' : 'warning'">{{ scope.row.conversionRate }}%</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="revenue" label="营收"></el-table-column>
          <el-table-column prop="cost" label="成本"></el-table-column>
          <el-table-column prop="roi" label="ROI">
            <template #default="scope">
              <el-tag :type="scope.row.roi >= 3 ? 'success' : 'warning'">{{ scope.row.roi }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const dateRange = ref([])
const activityId = ref('')

const metrics = ref({
  exposure: '12,580',
  participation: '6,290',
  conversion: '3,774',
  revenue: '¥458,900'
})

const activityData = ref([
  { name: '春季家装节', exposure: '8,520', participation: '4,260', conversion: '2,556', conversionRate: 60, revenue: '¥312,000', cost: '¥45,000', roi: 6.9 },
  { name: '五一劳动节特惠', exposure: '2,580', participation: '1,290', conversion: '774', conversionRate: 60, revenue: '¥98,000', cost: '¥25,000', roi: 3.9 },
  { name: '老客户回馈', exposure: '1,480', participation: '740', conversion: '444', conversionRate: 60, revenue: '¥48,900', cost: '¥15,000', roi: 3.3 }
])

const search = () => {
  ElMessage.success('查询功能开发中')
}

const reset = () => {
  dateRange.value = []
  activityId.value = ''
}

const exportData = () => {
  ElMessage.success('导出报表功能开发中')
}

onMounted(() => {
  console.log('[MarketingData] 组件挂载')
})
</script>

<style scoped>
.marketing-data {
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

.metrics-section {
  margin-bottom: 20px;
}

.metric-card {
  height: 140px;
}

.metric-content {
  text-align: center;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.charts-section {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-chart {
  width: 100%;
  height: 100%;
}

.chart-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding: 0 20px;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.bar {
  width: 20px;
  border-radius: 2px;
}

.bar.exposure {
  background-color: #409eff;
}

.bar.participation {
  background-color: #67c23a;
}

.bar.conversion {
  background-color: #e6a23c;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.funnel-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.funnel-level {
  display: flex;
  justify-content: center;
}

.funnel-bar {
  background: linear-gradient(to right, #409eff, #67c23a);
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-radius: 4px;
  color: white;
  min-width: 200px;
}

.funnel-label {
  font-weight: bold;
}

.funnel-value {
  font-size: 16px;
}

.detail-section {
  margin-bottom: 20px;
}
</style>
