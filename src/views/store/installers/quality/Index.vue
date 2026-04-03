<template>
  <div class="installers-quality">
    <div class="page-header">
      <h1>服务质量监管</h1>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ totalInstallers }}</div>
              <div class="stat-label">总师傅数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ avgRating }}%</div>
              <div class="stat-label">平均好评率</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ totalServiceCount }}</div>
              <div class="stat-label">总服务工单</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ complaintCount }}</div>
              <div class="stat-label">投诉工单</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 师傅评分排行 -->
    <div class="section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>师傅服务评分排行</span>
          </div>
        </template>
        <div class="ranking-list">
          <el-table :data="rankingList" style="width: 100%">
            <el-table-column type="index" label="排名" width="80"></el-table-column>
            <el-table-column prop="name" label="师傅姓名"></el-table-column>
            <el-table-column prop="rating" label="好评率" width="120">
              <template #default="scope">
                <el-progress :percentage="scope.row.rating" :format="() => `${scope.row.rating}%`"></el-progress>
              </template>
            </el-table-column>
            <el-table-column prop="serviceCount" label="服务工单" width="100"></el-table-column>
            <el-table-column prop="complaintCount" label="投诉次数" width="100"></el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" @click="showServiceDetailsDialog(scope.row)">服务明细</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    
    <!-- 工单超时预警 -->
    <div class="section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>工单超时预警</span>
          </div>
        </template>
        <div class="warning-list">
          <el-table :data="warningList" style="width: 100%">
            <el-table-column prop="id" label="工单号" width="180"></el-table-column>
            <el-table-column prop="installer" label="师傅姓名"></el-table-column>
            <el-table-column prop="customer" label="客户"></el-table-column>
            <el-table-column prop="deadline" label="截止时间" width="180"></el-table-column>
            <el-table-column prop="remaining" label="剩余时间" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.remaining.includes('超时') ? 'danger' : 'warning'">
                  {{ scope.row.remaining }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" @click="showUrgentReminderDialog(scope.row)">紧急提醒</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    
    <!-- 客户投诉列表 -->
    <div class="section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>客户投诉列表</span>
          </div>
        </template>
        <div class="complaint-list">
          <el-table :data="complaintList" style="width: 100%">
            <el-table-column prop="id" label="投诉ID" width="120"></el-table-column>
            <el-table-column prop="orderId" label="工单号" width="180"></el-table-column>
            <el-table-column prop="installer" label="师傅姓名"></el-table-column>
            <el-table-column prop="customer" label="客户"></el-table-column>
            <el-table-column prop="content" label="投诉内容"></el-table-column>
            <el-table-column prop="createTime" label="投诉时间" width="180"></el-table-column>
            <el-table-column prop="status" label="处理状态" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'pending' ? 'warning' : 'success'">
                  {{ scope.row.status === 'pending' ? '待处理' : '已处理' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" @click="showHandleComplaintDialog(scope.row)">处理投诉</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

    <!-- 服务明细弹窗 -->
    <el-dialog
      v-model="serviceDetailsDialogVisible"
      :title="`${currentInstaller?.name || ''} 服务明细`"
      width="800px"
    >
      <div class="service-details">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="师傅姓名">{{ currentInstaller?.name }}</el-descriptions-item>
          <el-descriptions-item label="服务类型">{{ currentInstaller?.serviceType || '家具安装' }}</el-descriptions-item>
          <el-descriptions-item label="服务工单">{{ currentInstaller?.serviceCount || 0 }}</el-descriptions-item>
          <el-descriptions-item label="好评率"><el-tag type="success">{{ currentInstaller?.rating || 0 }}%</el-tag></el-descriptions-item>
          <el-descriptions-item label="投诉次数"><el-tag type="danger">{{ currentInstaller?.complaintCount || 0 }}次</el-tag></el-descriptions-item>
          <el-descriptions-item label="本月服务">{{ currentInstaller?.monthlyService || 0 }}单</el-descriptions-item>
        </el-descriptions>

        <div class="service-stats">
          <h3>服务统计</h3>
          <div class="stats-grid">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-label">准时率</div>
                <div class="stat-value">{{ currentInstaller?.onTimeRate || 95 }}%</div>
              </div>
            </el-card>
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-label">平均响应时间</div>
                <div class="stat-value">{{ currentInstaller?.avgResponseTime || 30 }}分钟</div>
              </div>
            </el-card>
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-label">客户满意度</div>
                <div class="stat-value">{{ currentInstaller?.satisfaction || 96 }}%</div>
              </div>
            </el-card>
          </div>
        </div>

        <div class="recent-services">
          <h3>最近服务记录</h3>
          <el-table :data="currentInstaller?.recentServices || []" style="width: 100%" size="small">
            <el-table-column prop="orderId" label="工单号" width="150"></el-table-column>
            <el-table-column prop="customer" label="客户" width="120"></el-table-column>
            <el-table-column prop="serviceType" label="服务类型"></el-table-column>
            <el-table-column prop="rating" label="评分" width="80">
              <template #default="scope">
                <el-rate v-model="scope.row.rating" disabled :max="5" show-score></el-rate>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="服务时间" width="180"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'completed' ? 'success' : 'info'">{{ scope.row.status === 'completed' ? '已完成' : '处理中' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="serviceDetailsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 紧急提醒弹窗 -->
    <el-dialog
      v-model="urgentReminderDialogVisible"
      title="紧急提醒"
      width="600px"
    >
      <div class="urgent-reminder">
        <el-alert
          :title="`工单 ${currentWarning?.id} 即将超时`"
          type="warning"
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-form ref="reminderFormRef" :model="reminderForm" :rules="reminderRules" label-width="100px">
          <el-form-item label="提醒师傅" prop="installer">
            <el-input v-model="reminderForm.installer" disabled />
          </el-form-item>
          <el-form-item label="提醒内容" prop="content">
            <el-input type="textarea" v-model="reminderForm.content" :rows="3" placeholder="请输入提醒内容"></el-input>
          </el-form-item>
          <el-form-item label="提醒方式" prop="methods">
            <el-checkbox-group v-model="reminderForm.methods">
              <el-checkbox label="短信" />
              <el-checkbox label="电话" />
              <el-checkbox label="系统消息" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="截止时间">
            <el-input v-model="reminderForm.deadline" disabled />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="urgentReminderDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="sendUrgentReminder" :loading="submitting">发送提醒</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 处理投诉弹窗 -->
    <el-dialog
      v-model="handleComplaintDialogVisible"
      :title="`处理投诉 - ${currentComplaint?.id || ''}`"
      width="800px"
    >
      <div class="handle-complaint">
        <div class="complaint-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="投诉ID">{{ currentComplaint?.id }}</el-descriptions-item>
            <el-descriptions-item label="工单号">{{ currentComplaint?.orderId }}</el-descriptions-item>
            <el-descriptions-item label="师傅姓名">{{ currentComplaint?.installer }}</el-descriptions-item>
            <el-descriptions-item label="客户">{{ currentComplaint?.customer }}</el-descriptions-item>
            <el-descriptions-item label="投诉时间">{{ currentComplaint?.createTime }}</el-descriptions-item>
            <el-descriptions-item label="处理状态"><el-tag :type="currentComplaint?.status === 'pending' ? 'warning' : 'success'">{{ currentComplaint?.status === 'pending' ? '待处理' : '已处理' }}</el-tag></el-descriptions-item>
          </el-descriptions>
          
          <div class="complaint-content">
            <h3>投诉内容</h3>
            <div class="content-box">{{ currentComplaint?.content }}</div>
          </div>
        </div>
        
        <div class="handle-form">
          <h3>处理方案</h3>
          <el-form ref="complaintFormRef" :model="complaintForm" :rules="complaintRules" label-width="100px">
            <el-form-item label="处理结果" prop="result">
              <el-select v-model="complaintForm.result" placeholder="请选择处理结果" style="width: 100%">
                <el-option label="已解决" value="resolved" />
                <el-option label="部分解决" value="partially_resolved" />
                <el-option label="未解决" value="unresolved" />
              </el-select>
            </el-form-item>
            <el-form-item label="处理方案" prop="solution">
              <el-input type="textarea" v-model="complaintForm.solution" :rows="4" placeholder="请输入处理方案"></el-input>
            </el-form-item>
            <el-form-item label="处理人员" prop="handler">
              <el-input v-model="complaintForm.handler" placeholder="请输入处理人员"></el-input>
            </el-form-item>
            <el-form-item label="处理时间">
              <el-input v-model="complaintForm.handleTime" disabled />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleComplaintDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitComplaintHandle" :loading="submitting">提交处理</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 统计数据
const totalInstallers = ref(25)
const avgRating = ref(95)
const totalServiceCount = ref(1280)
const complaintCount = ref(12)

// 师傅评分排行
const rankingList = ref([
  { id: 'INS001', name: '李师傅', rating: 98, serviceCount: 120, complaintCount: 1 },
  { id: 'INS004', name: '赵师傅', rating: 97, serviceCount: 95, complaintCount: 0 },
  { id: 'INS002', name: '王师傅', rating: 95, serviceCount: 85, complaintCount: 2 },
  { id: 'INS005', name: '刘师傅', rating: 94, serviceCount: 72, complaintCount: 1 },
  { id: 'INS003', name: '张师傅', rating: 92, serviceCount: 68, complaintCount: 3 }
])

// 超时预警列表
const warningList = ref([
  { id: 'WO20260401003', installer: '张师傅', customer: '陈女士', deadline: '2026-04-01 18:00', remaining: '2小时' },
  { id: 'WO20260401004', installer: '刘师傅', customer: '周先生', deadline: '2026-04-01 16:00', remaining: '超时1小时' },
  { id: 'WO20260401005', installer: '王师傅', customer: '吴女士', deadline: '2026-04-01 19:00', remaining: '3小时' }
])

// 投诉列表
const complaintList = ref([
  { id: 'CP20260401001', orderId: 'WO20260331001', installer: '张师傅', customer: '王女士', content: '师傅安装不专业，导致家具损坏', createTime: '2026-04-01 10:30', status: 'pending' },
  { id: 'CP20260401002', orderId: 'WO20260330001', installer: '刘师傅', customer: '赵先生', content: '师傅迟到，服务态度差', createTime: '2026-04-01 09:15', status: 'pending' },
  { id: 'CP20260331001', orderId: 'WO20260329001', installer: '王师傅', customer: '李女士', content: '安装后有异响', createTime: '2026-03-31 16:45', status: 'success' }
])

// 弹窗状态
const serviceDetailsDialogVisible = ref(false)
const urgentReminderDialogVisible = ref(false)
const handleComplaintDialogVisible = ref(false)
const submitting = ref(false)

// 当前数据
const currentInstaller = ref(null)
const currentWarning = ref(null)
const currentComplaint = ref(null)

// 提醒表单
const reminderForm = reactive({
  installer: '',
  content: '',
  methods: [],
  deadline: ''
})
const reminderRules = {
  content: [{ required: true, message: '请输入提醒内容', trigger: 'blur' }],
  methods: [{ required: true, message: '请选择提醒方式', trigger: 'change' }]
}
const reminderFormRef = ref(null)

// 投诉处理表单
const complaintForm = reactive({
  result: '',
  solution: '',
  handler: '',
  handleTime: ''
})
const complaintRules = {
  result: [{ required: true, message: '请选择处理结果', trigger: 'change' }],
  solution: [{ required: true, message: '请输入处理方案', trigger: 'blur' }],
  handler: [{ required: true, message: '请输入处理人员', trigger: 'blur' }]
}
const complaintFormRef = ref(null)

// 显示服务明细弹窗
const showServiceDetailsDialog = (installer) => {
  // 模拟获取服务明细数据
  currentInstaller.value = {
    ...installer,
    serviceType: '家具安装',
    monthlyService: 15,
    onTimeRate: 95,
    avgResponseTime: 30,
    satisfaction: 96,
    recentServices: [
      { orderId: 'WO20260401001', customer: '张女士', serviceType: '家具安装', rating: 5, createTime: '2026-04-01 10:30', status: 'completed' },
      { orderId: 'WO20260331001', customer: '李先生', serviceType: '家具安装', rating: 4, createTime: '2026-03-31 14:20', status: 'completed' },
      { orderId: 'WO20260330001', customer: '王女士', serviceType: '家具安装', rating: 5, createTime: '2026-03-30 09:15', status: 'completed' }
    ]
  }
  serviceDetailsDialogVisible.value = true
}

// 显示紧急提醒弹窗
const showUrgentReminderDialog = (warning) => {
  currentWarning.value = warning
  Object.assign(reminderForm, {
    installer: warning.installer,
    content: `工单 ${warning.id} 即将超时，请尽快处理！`,
    methods: ['短信', '系统消息'],
    deadline: warning.deadline
  })
  urgentReminderDialogVisible.value = true
}

// 显示处理投诉弹窗
const showHandleComplaintDialog = (complaint) => {
  currentComplaint.value = complaint
  Object.assign(complaintForm, {
    result: '',
    solution: '',
    handler: '',
    handleTime: new Date().toLocaleString('zh-CN')
  })
  handleComplaintDialogVisible.value = true
}

// 发送紧急提醒
const sendUrgentReminder = async () => {
  const valid = await reminderFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    urgentReminderDialogVisible.value = false
    ElMessage.success('紧急提醒发送成功')
  }, 500)
}

// 提交投诉处理
const submitComplaintHandle = async () => {
  const valid = await complaintFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    handleComplaintDialogVisible.value = false
    // 更新投诉状态
    const complaint = complaintList.value.find(item => item.id === currentComplaint.value.id)
    if (complaint) {
      complaint.status = 'success'
    }
    ElMessage.success('投诉处理提交成功')
  }, 500)
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
.installers-quality {
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

.section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ranking-list,
.warning-list,
.complaint-list {
  margin-top: 10px;
}

.service-details {
  padding: 20px 0;
}

.service-stats {
  margin-top: 30px;
}

.service-stats h3 {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-item {
  .stat-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
    text-align: center;
  }
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    text-align: center;
  }
}

.recent-services {
  margin-top: 30px;
}

.recent-services h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.urgent-reminder {
  padding: 20px 0;
}

.handle-complaint {
  padding: 20px 0;
}

.complaint-info {
  margin-bottom: 30px;
}

.complaint-content {
  margin-top: 20px;
}

.complaint-content h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.content-box {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
}

.handle-form {
  margin-top: 30px;
}

.handle-form h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
