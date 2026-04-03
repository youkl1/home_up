<template>
  <div class="referral-records">
    <div class="page-header">
      <h1>转介绍记录管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="转介绍人">
          <el-input v-model="filterForm.referrer" size="small" placeholder="请输入转介绍人姓名"></el-input>
        </el-form-item>
        <el-form-item label="成单状态">
          <el-select v-model="filterForm.status" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="已转化" value="converted"></el-option>
            <el-option label="待转化" value="pending"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small">查询</el-button>
          <el-button size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 转介绍记录列表 -->
    <div class="table-section">
      <el-card shadow="hover">
        <div class="table-header">
          <el-button size="small" type="primary" @click="exportRecords">导出记录</el-button>
        </div>
        <el-table :data="records" style="width: 100%">
          <el-table-column prop="id" label="记录ID" width="120"></el-table-column>
          <el-table-column prop="referrer" label="转介绍人"></el-table-column>
          <el-table-column prop="referee" label="被介绍人"></el-table-column>
          <el-table-column prop="refereePhone" label="被介绍人电话" width="150"></el-table-column>
          <el-table-column prop="createTime" label="转介绍时间" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'converted' ? 'success' : 'info'">
                {{ scope.row.status === 'converted' ? '已转化' : '待转化' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="orderId" label="关联订单" width="180"></el-table-column>
          <el-table-column prop="rewardStatus" label="奖励状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.rewardStatus)">
                {{ getStatusText(scope.row.rewardStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
              <el-button size="small" type="primary" @click="viewCustomer(scope.row.refereeId)">客户信息</el-button>
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
    
    <!-- 转介绍详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="转介绍详情"
      width="800px"
    >
      <div class="record-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="记录ID">{{ selectedRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="转介绍人">{{ selectedRecord.referrer }}</el-descriptions-item>
          <el-descriptions-item label="被介绍人">{{ selectedRecord.referee }}</el-descriptions-item>
          <el-descriptions-item label="被介绍人电话">{{ selectedRecord.refereePhone }}</el-descriptions-item>
          <el-descriptions-item label="转介绍时间">{{ selectedRecord.createTime }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ selectedRecord.status === 'converted' ? '已转化' : '待转化' }}</el-descriptions-item>
          <el-descriptions-item label="关联订单" :span="2">
            <span v-if="selectedRecord.orderId">{{ selectedRecord.orderId }}</span>
            <span v-else>无</span>
          </el-descriptions-item>
          <el-descriptions-item label="奖励状态" :span="2">
            <el-tag :type="getStatusType(selectedRecord.rewardStatus)">
              {{ getStatusText(selectedRecord.rewardStatus) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="follow-up-section">
          <h3>跟进记录</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(record, index) in selectedRecord.followUpRecords"
              :key="index"
              :timestamp="record.time"
            >
              <div class="follow-up-content">
                <div class="follow-up-operator">{{ record.operator }}</div>
                <div class="follow-up-text">{{ record.content }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
        
        <div class="conversion-section" v-if="selectedRecord.status === 'converted'">
          <h3>成单情况</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单金额">{{ selectedRecord.orderAmount }}</el-descriptions-item>
            <el-descriptions-item label="成单时间">{{ selectedRecord.conversionTime }}</el-descriptions-item>
            <el-descriptions-item label="奖励金额" :span="2">{{ selectedRecord.rewardAmount }}</el-descriptions-item>
          </el-descriptions>
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
  referrer: '',
  status: '',
  dateRange: []
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(120)

// 转介绍记录列表
const records = ref([
  { id: 'REF20260401001', referrer: '张女士', referee: '陈女士', refereePhone: '138****8888', refereeId: 'CUST001', createTime: '2026-04-01 10:30', status: 'converted', orderId: 'ORD20260401001', rewardStatus: 'issued' },
  { id: 'REF20260401002', referrer: '李先生', referee: '周先生', refereePhone: '139****9999', refereeId: 'CUST002', createTime: '2026-04-01 09:15', status: 'pending', orderId: '', rewardStatus: 'pending' },
  { id: 'REF20260331001', referrer: '王女士', referee: '吴女士', refereePhone: '137****7777', refereeId: 'CUST003', createTime: '2026-03-31 16:45', status: 'converted', orderId: 'ORD20260331001', rewardStatus: 'issued' },
  { id: 'REF20260331002', referrer: '赵先生', referee: '郑先生', refereePhone: '136****6666', refereeId: 'CUST004', createTime: '2026-03-31 14:20', status: 'pending', orderId: '', rewardStatus: 'pending' },
  { id: 'REF20260330001', referrer: '刘女士', referee: '孙女士', refereePhone: '135****5555', refereeId: 'CUST005', createTime: '2026-03-30 11:00', status: 'converted', orderId: 'ORD20260330001', rewardStatus: 'processing' }
])

// 详情弹窗
const detailDialogVisible = ref(false)
const selectedRecord = ref({
  id: '',
  referrer: '',
  referee: '',
  refereePhone: '',
  createTime: '',
  status: '',
  orderId: '',
  rewardStatus: '',
  orderAmount: '',
  conversionTime: '',
  rewardAmount: '',
  followUpRecords: []
})

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    processing: 'info',
    issued: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待发放',
    processing: '处理中',
    issued: '已发放'
  }
  return textMap[status] || status
}

// 导出记录
const exportRecords = () => {
  // 导出转介绍记录
  console.log('导出转介绍记录')
}

// 查看详情
const viewDetail = (id) => {
  // 模拟获取转介绍详情
  selectedRecord.value = {
    id: id,
    referrer: '张女士',
    referee: '陈女士',
    refereePhone: '138****8888',
    createTime: '2026-04-01 10:30',
    status: 'converted',
    orderId: 'ORD20260401001',
    rewardStatus: 'issued',
    orderAmount: '¥8,900',
    conversionTime: '2026-04-02 14:30',
    rewardAmount: '¥500',
    followUpRecords: [
      { time: '2026-04-01 10:30', operator: '系统', content: '转介绍记录创建' },
      { time: '2026-04-01 11:00', operator: '赵经理', content: '联系被介绍人陈女士，了解需求' },
      { time: '2026-04-02 14:30', operator: '赵经理', content: '客户下单成功，订单号：ORD20260401001' }
    ]
  }
  detailDialogVisible.value = true
}

// 查看客户信息
const viewCustomer = (id) => {
  // 查看被介绍客户信息
  console.log('查看客户信息:', id)
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
.referral-records {
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

.table-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.record-detail {
  padding: 20px 0;
}

.follow-up-section {
  margin-top: 20px;
}

.follow-up-section h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.conversion-section {
  margin-top: 20px;
}

.conversion-section h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}

.follow-up-content {
  margin-top: 5px;
}

.follow-up-operator {
  font-weight: bold;
  margin-bottom: 5px;
}

.follow-up-text {
  margin-bottom: 10px;
}
</style>