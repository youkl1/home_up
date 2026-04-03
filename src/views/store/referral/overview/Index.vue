<template>
  <div class="referral-overview">
    <div class="page-header">
      <h1>转介绍总览</h1>
    </div>
    
    <!-- 时间筛选 -->
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
        <el-form-item>
          <el-button type="primary" @click="searchData">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
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
              <div class="stat-label">累计转介绍客户</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ totalConversions }}</div>
              <div class="stat-label">转介绍成单量</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ totalRevenue }}</div>
              <div class="stat-label">成单额</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ conversionRate }}%</div>
              <div class="stat-label">裂变率</div>
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
                <span>裂变趋势图</span>
              </div>
            </template>
            <div class="chart-container">
              <el-empty description="暂无数据" v-if="!chartData"></el-empty>
              <div v-else class="chart" style="height: 300px;">
                <!-- 这里可以集成 ECharts 图表 -->
                <div class="mock-chart">
                  <div class="chart-title">转介绍数量趋势</div>
                  <div class="chart-bars">
                    <div class="bar" style="height: 60%;"><span>1月</span></div>
                    <div class="bar" style="height: 40%;"><span>2月</span></div>
                    <div class="bar" style="height: 70%;"><span>3月</span></div>
                    <div class="bar" style="height: 90%;"><span>4月</span></div>
                    <div class="bar" style="height: 50%;"><span>5月</span></div>
                    <div class="bar" style="height: 80%;"><span>6月</span></div>
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
                <span>转介绍客户排行</span>
              </div>
            </template>
            <div class="ranking-container">
              <el-table :data="topReferrers" style="width: 100%">
                <el-table-column type="index" label="排名" width="80"></el-table-column>
                <el-table-column prop="name" label="客户姓名"></el-table-column>
                <el-table-column prop="referralCount" label="转介绍数" width="120"></el-table-column>
                <el-table-column prop="conversionCount" label="成单数" width="120"></el-table-column>
                <el-table-column prop="revenue" label="贡献金额"></el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 最近转介绍记录 -->
    <div class="recent-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>最近转介绍记录</span>
            <el-button size="small" type="primary" @click="showAllRecordsDialog">查看全部</el-button>
          </div>
        </template>
        <div class="recent-records">
          <el-table :data="recentRecords" style="width: 100%">
            <el-table-column prop="id" label="记录ID" width="120"></el-table-column>
            <el-table-column prop="referrer" label="转介绍人"></el-table-column>
            <el-table-column prop="referee" label="被介绍人"></el-table-column>
            <el-table-column prop="createTime" label="转介绍时间" width="180"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'converted' ? 'success' : 'info'">
                  {{ scope.row.status === 'converted' ? '已转化' : '待转化' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" @click="showRecordDetailDialog(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

    <!-- 查看全部记录弹窗 -->
    <el-dialog
      v-model="allRecordsDialogVisible"
      title="全部转介绍记录"
      width="1000px"
    >
      <div class="all-records">
        <div class="filter-bar">
          <el-input v-model="recordFilter" placeholder="搜索记录ID、转介绍人或被介绍人" style="width: 300px; margin-right: 10px;"></el-input>
          <el-select v-model="statusFilter" placeholder="筛选状态" style="width: 150px; margin-right: 10px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="已转化" value="converted"></el-option>
            <el-option label="待转化" value="pending"></el-option>
          </el-select>
          <el-button type="primary" @click="searchRecords">查询</el-button>
        </div>
        <el-table :data="allRecords" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="记录ID" width="120"></el-table-column>
          <el-table-column prop="referrer" label="转介绍人"></el-table-column>
          <el-table-column prop="referee" label="被介绍人"></el-table-column>
          <el-table-column prop="createTime" label="转介绍时间" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'converted' ? 'success' : 'info'">
                {{ scope.row.status === 'converted' ? '已转化' : '待转化' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="revenue" label="成单金额" width="120"></el-table-column>
          <el-table-column prop="reward" label="奖励金额" width="120"></el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button size="small" @click="showRecordDetailDialog(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" style="margin-top: 20px;">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="allRecordsTotal"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="allRecordsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="recordDetailDialogVisible"
      title="转介绍记录详情"
      width="800px"
    >
      <div class="record-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="记录ID">{{ selectedRecord?.id }}</el-descriptions-item>
          <el-descriptions-item label="转介绍人">{{ selectedRecord?.referrer }}</el-descriptions-item>
          <el-descriptions-item label="被介绍人">{{ selectedRecord?.referee }}</el-descriptions-item>
          <el-descriptions-item label="转介绍时间">{{ selectedRecord?.createTime }}</el-descriptions-item>
          <el-descriptions-item label="状态"><el-tag :type="selectedRecord?.status === 'converted' ? 'success' : 'info'">{{ selectedRecord?.status === 'converted' ? '已转化' : '待转化' }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="成单金额" v-if="selectedRecord?.revenue">{{ selectedRecord?.revenue }}</el-descriptions-item>
          <el-descriptions-item label="奖励金额" v-if="selectedRecord?.reward">{{ selectedRecord?.reward }}</el-descriptions-item>
          <el-descriptions-item label="奖励状态" v-if="selectedRecord?.rewardStatus"><el-tag :type="selectedRecord?.rewardStatus === 'paid' ? 'success' : 'warning'">{{ selectedRecord?.rewardStatus === 'paid' ? '已发放' : '待发放' }}</el-tag></el-descriptions-item>
        </el-descriptions>

        <div class="referrer-info" v-if="selectedRecord?.referrerInfo">
          <h3>转介绍人信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="姓名">{{ selectedRecord?.referrerInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ selectedRecord?.referrerInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="会员等级">{{ selectedRecord?.referrerInfo.memberLevel }}</el-descriptions-item>
            <el-descriptions-item label="累计转介绍">{{ selectedRecord?.referrerInfo.totalReferrals }}次</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="referee-info" v-if="selectedRecord?.refereeInfo">
          <h3>被介绍人信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="姓名">{{ selectedRecord?.refereeInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ selectedRecord?.refereeInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ selectedRecord?.refereeInfo.registerTime }}</el-descriptions-item>
            <el-descriptions-item label="首次消费">{{ selectedRecord?.refereeInfo.firstPurchase || '未消费' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="conversion-info" v-if="selectedRecord?.conversionInfo && selectedRecord?.status === 'converted'">
          <h3>转化信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单号">{{ selectedRecord?.conversionInfo.orderId }}</el-descriptions-item>
            <el-descriptions-item label="订单金额">{{ selectedRecord?.conversionInfo.orderAmount }}</el-descriptions-item>
            <el-descriptions-item label="下单时间">{{ selectedRecord?.conversionInfo.orderTime }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">{{ selectedRecord?.conversionInfo.orderStatus }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="reward-info" v-if="selectedRecord?.rewardInfo && selectedRecord?.reward">
          <h3>奖励信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="奖励类型">{{ selectedRecord?.rewardInfo.type }}</el-descriptions-item>
            <el-descriptions-item label="奖励金额">{{ selectedRecord?.rewardInfo.amount }}</el-descriptions-item>
            <el-descriptions-item label="发放时间" v-if="selectedRecord?.rewardInfo.payTime">{{ selectedRecord?.rewardInfo.payTime }}</el-descriptions-item>
            <el-descriptions-item label="发放方式" v-if="selectedRecord?.rewardInfo.payMethod">{{ selectedRecord?.rewardInfo.payMethod }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="recordDetailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 筛选表单
const filterForm = ref({
  dateRange: []
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const allRecordsTotal = ref(120)
const loading = ref(false)

// 记录筛选
const recordFilter = ref('')
const statusFilter = ref('')

// 统计数据
const totalReferrals = ref(156)
const totalConversions = ref(89)
const totalRevenue = ref('¥1,250,000')
const conversionRate = ref(57)

// 图表数据
const chartData = ref(true)

// 转介绍客户排行
const topReferrers = ref([
  { name: '张女士', referralCount: 12, conversionCount: 8, revenue: '¥128,000' },
  { name: '李先生', referralCount: 10, conversionCount: 6, revenue: '¥95,000' },
  { name: '王女士', referralCount: 8, conversionCount: 5, revenue: '¥82,000' },
  { name: '赵先生', referralCount: 7, conversionCount: 4, revenue: '¥68,000' },
  { name: '刘女士', referralCount: 6, conversionCount: 3, revenue: '¥52,000' }
])

// 最近转介绍记录
const recentRecords = ref([
  { id: 'REF20260401001', referrer: '张女士', referee: '陈女士', createTime: '2026-04-01 10:30', status: 'converted' },
  { id: 'REF20260401002', referrer: '李先生', referee: '周先生', createTime: '2026-04-01 09:15', status: 'pending' },
  { id: 'REF20260331001', referrer: '王女士', referee: '吴女士', createTime: '2026-03-31 16:45', status: 'converted' },
  { id: 'REF20260331002', referrer: '赵先生', referee: '郑先生', createTime: '2026-03-31 14:20', status: 'pending' },
  { id: 'REF20260330001', referrer: '刘女士', referee: '孙女士', createTime: '2026-03-30 11:00', status: 'converted' }
])

// 所有转介绍记录
const allRecords = ref([
  { id: 'REF20260401001', referrer: '张女士', referee: '陈女士', createTime: '2026-04-01 10:30', status: 'converted', revenue: '¥8,900', reward: '¥200' },
  { id: 'REF20260401002', referrer: '李先生', referee: '周先生', createTime: '2026-04-01 09:15', status: 'pending', revenue: '', reward: '' },
  { id: 'REF20260331001', referrer: '王女士', referee: '吴女士', createTime: '2026-03-31 16:45', status: 'converted', revenue: '¥12,500', reward: '¥300' },
  { id: 'REF20260331002', referrer: '赵先生', referee: '郑先生', createTime: '2026-03-31 14:20', status: 'pending', revenue: '', reward: '' },
  { id: 'REF20260330001', referrer: '刘女士', referee: '孙女士', createTime: '2026-03-30 11:00', status: 'converted', revenue: '¥6,800', reward: '¥150' },
  { id: 'REF20260329001', referrer: '张女士', referee: '马先生', createTime: '2026-03-29 15:30', status: 'converted', revenue: '¥9,200', reward: '¥200' },
  { id: 'REF20260328001', referrer: '李先生', referee: '朱女士', createTime: '2026-03-28 14:15', status: 'converted', revenue: '¥7,500', reward: '¥180' },
  { id: 'REF20260327001', referrer: '王女士', referee: '秦先生', createTime: '2026-03-27 10:00', status: 'pending', revenue: '', reward: '' },
  { id: 'REF20260326001', referrer: '赵先生', referee: '尤女士', createTime: '2026-03-26 09:30', status: 'converted', revenue: '¥10,800', reward: '¥250' },
  { id: 'REF20260325001', referrer: '刘女士', referee: '许先生', createTime: '2026-03-25 16:00', status: 'converted', revenue: '¥5,600', reward: '¥120' }
])

// 弹窗状态
const allRecordsDialogVisible = ref(false)
const recordDetailDialogVisible = ref(false)

// 当前选中记录
const selectedRecord = ref(null)

// 已选记录
const selectedRecords = ref([])

// 搜索数据
const searchData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询成功')
  }, 500)
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterForm.value, {
    dateRange: []
  })
}

// 显示全部记录弹窗
const showAllRecordsDialog = () => {
  allRecordsDialogVisible.value = true
}

// 显示详情弹窗
const showRecordDetailDialog = (record) => {
  // 模拟获取记录详情
  selectedRecord.value = {
    ...record,
    rewardStatus: record.status === 'converted' ? 'paid' : null,
    referrerInfo: {
      name: record.referrer,
      phone: '138****8888',
      memberLevel: 'VIP',
      totalReferrals: 12
    },
    refereeInfo: {
      name: record.referee,
      phone: '139****9999',
      registerTime: record.createTime,
      firstPurchase: record.status === 'converted' ? '2026-04-01 14:30' : null
    },
    conversionInfo: record.status === 'converted' ? {
      orderId: 'ORD' + record.id.substring(3),
      orderAmount: record.revenue,
      orderTime: '2026-04-01 14:30',
      orderStatus: '已完成'
    } : null,
    rewardInfo: record.status === 'converted' ? {
      type: '现金奖励',
      amount: record.reward,
      payTime: '2026-04-02 10:00',
      payMethod: '微信转账'
    } : null
  }
  recordDetailDialogVisible.value = true
}

// 搜索记录
const searchRecords = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询成功')
  }, 500)
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedRecords.value = selection
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
.referral-overview {
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

.ranking-container {
  margin-top: 10px;
}

.recent-section {
  margin-bottom: 20px;
}

.recent-records {
  margin-top: 10px;
}

.all-records {
  .filter-bar {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
}

.record-detail {
  padding: 20px 0;
}

.referrer-info,
.referee-info,
.conversion-info,
.reward-info {
  margin-top: 30px;
}

.referrer-info h3,
.referee-info h3,
.conversion-info h3,
.reward-info h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
