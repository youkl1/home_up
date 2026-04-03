<template>
  <div class="service-processing">
    <div class="page-header">
      <h1>工单处理管理</h1>
      <div class="header-actions">
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>
    
    <!-- 工单基础信息 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>工单基础信息</span>
            <el-button size="small" type="primary" @click="showDetailDialog">查看详情</el-button>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="工单号">{{ ticket.id }}</el-descriptions-item>
          <el-descriptions-item label="工单类型">{{ ticket.type }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ ticket.createTime }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ ticket.customer }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ ticket.phone }}</el-descriptions-item>
          <el-descriptions-item label="处理状态">{{ ticket.status }}</el-descriptions-item>
          <el-descriptions-item label="处理人">{{ ticket.handler }}</el-descriptions-item>
          <el-descriptions-item label="处理时效">{{ ticket.deadline }}</el-descriptions-item>
          <el-descriptions-item label="优先级">{{ ticket.priority }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    
    <!-- 客户诉求 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>客户诉求</span>
          </div>
        </template>
        <div class="appeal-content">
          {{ ticket.appeal }}
        </div>
      </el-card>
    </div>
    
    <!-- 对应订单信息 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>对应订单信息</span>
            <el-button size="small" @click="viewOrder">查看订单</el-button>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ ticket.order.id }}</el-descriptions-item>
          <el-descriptions-item label="订单金额">{{ ticket.order.amount }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ ticket.order.createTime }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">{{ ticket.order.status }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    
    <!-- 处理记录 -->
    <div class="info-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>处理记录</span>
            <el-button size="small" type="primary" @click="addRecord">添加记录</el-button>
            <el-button size="small" @click="showProgressDialog">查看进度</el-button>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in ticket.records"
            :key="index"
            :timestamp="record.time"
          >
            <div class="record-content">
              <div class="record-operator">{{ record.operator }}</div>
              <div class="record-text">{{ record.content }}</div>
              <div v-if="record.attachment" class="record-attachment">
                <el-button size="small" @click="viewAttachment(record.attachment)">查看附件</el-button>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
    
    <!-- 处理操作 -->
    <div class="action-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>处理操作</span>
          </div>
        </template>
        <div class="action-buttons">
          <el-button type="primary" @click="updateStatus">更新状态</el-button>
          <el-button type="success" @click="uploadVoucher">上传凭证</el-button>
          <el-button @click="contactCustomer">联系客户</el-button>
          <el-button type="danger" @click="closeTicket">关闭工单</el-button>
        </div>
      </el-card>
    </div>
    
    <!-- 工单详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="工单详情"
      width="800px"
    >
      <div class="ticket-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单号">{{ ticket.id }}</el-descriptions-item>
          <el-descriptions-item label="工单类型">{{ ticket.type }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ ticket.createTime }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ ticket.customer }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ ticket.phone }}</el-descriptions-item>
          <el-descriptions-item label="处理状态">{{ ticket.status }}</el-descriptions-item>
          <el-descriptions-item label="处理人">{{ ticket.handler }}</el-descriptions-item>
          <el-descriptions-item label="处理时效">{{ ticket.deadline }}</el-descriptions-item>
          <el-descriptions-item label="优先级">{{ ticket.priority }}</el-descriptions-item>
          <el-descriptions-item label="工单来源">{{ ticket.source || '在线客服' }}</el-descriptions-item>
          <el-descriptions-item label="服务地址" span="2">{{ ticket.address || '北京市朝阳区' }}</el-descriptions-item>
          <el-descriptions-item label="备注" span="2">{{ ticket.remark || '暂无' }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="ticket-content">
          <h3>客户诉求</h3>
          <div class="content-box">{{ ticket.appeal }}</div>
        </div>
        
        <div class="order-info">
          <h3>订单信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单号">{{ ticket.order.id }}</el-descriptions-item>
            <el-descriptions-item label="订单金额">{{ ticket.order.amount }}</el-descriptions-item>
            <el-descriptions-item label="下单时间">{{ ticket.order.createTime }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">{{ ticket.order.status }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看进度弹窗 -->
    <el-dialog
      v-model="progressDialogVisible"
      title="处理进度"
      width="800px"
    >
      <div class="progress-dialog">
        <div class="progress-status">
          <h3>当前状态：<el-tag :type="getStatusType(ticket.status)">{{ ticket.status }}</el-tag></h3>
          <p class="status-time">更新时间：{{ ticket.lastUpdateTime || '2026-04-01 11:00' }}</p>
        </div>
        
        <div class="progress-timeline">
          <h3>处理流程</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(record, index) in ticket.records"
              :key="index"
              :timestamp="record.time"
              :type="index === 0 ? 'primary' : 'info'"
              :icon="index === 0 ? 'el-icon-s-finished' : 'el-icon-time'"
            >
              <div class="timeline-content">
                <div class="timeline-operator">{{ record.operator }}</div>
                <div class="timeline-action">{{ record.content }}</div>
              </div>
            </el-timeline-item>
            <el-timeline-item
              v-if="ticket.records.length < 5"
              timestamp="待处理"
              type="warning"
              icon="el-icon-loading"
            >
              <div class="timeline-content">
                <div class="timeline-operator">系统</div>
                <div class="timeline-action">等待下一步处理</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
        
        <div class="progress-meta">
          <h3>处理信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="预计完成时间">{{ ticket.expectedCompleteTime || '2026-04-02 18:00' }}</el-descriptions-item>
            <el-descriptions-item label="已用时间">{{ ticket.usedTime || '0.5小时' }}</el-descriptions-item>
            <el-descriptions-item label="处理人">{{ ticket.handler }}</el-descriptions-item>
            <el-descriptions-item label="联系方式">{{ ticket.handlerPhone || '139****9999' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="progressDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="updateStatus">更新状态</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加处理记录弹窗 -->
    <el-dialog
      v-model="addRecordDialogVisible"
      title="添加处理记录"
      width="800px"
    >
      <div class="add-record-form">
        <el-form ref="recordFormRef" :model="recordForm" :rules="recordRules" label-width="100px">
          <el-form-item label="处理内容" prop="content">
            <el-input type="textarea" v-model="recordForm.content" :rows="4" placeholder="请输入处理内容"></el-input>
          </el-form-item>
          <el-form-item label="处理结果" prop="result">
            <el-select v-model="recordForm.result" placeholder="请选择处理结果" style="width: 100%">
              <el-option label="问题已解决" value="solved" />
              <el-option label="问题部分解决" value="partially_solved" />
              <el-option label="问题未解决" value="unsolved" />
              <el-option label="需要进一步处理" value="need_more" />
            </el-select>
          </el-form-item>
          <el-form-item label="处理附件">
            <el-upload
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="recordForm.attachments"
              :auto-upload="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传图片文件，且不超过5MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addRecordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRecord" :loading="submitting">提交记录</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 更新状态弹窗 -->
    <el-dialog
      v-model="updateStatusDialogVisible"
      title="更新处理状态"
      width="600px"
    >
      <div class="update-status-form">
        <el-form ref="statusFormRef" :model="statusForm" :rules="statusRules" label-width="100px">
          <el-form-item label="处理状态" prop="status">
            <el-select v-model="statusForm.status" placeholder="请选择处理状态">
              <el-option label="待处理" value="待处理"></el-option>
              <el-option label="处理中" value="处理中"></el-option>
              <el-option label="已完成" value="已完成"></el-option>
              <el-option label="已关闭" value="已关闭"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理说明" prop="remark">
            <el-input type="textarea" v-model="statusForm.remark" :rows="3" placeholder="请输入处理说明"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updateStatusDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitStatus" :loading="submitting">提交更新</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟工单数据
const ticket = ref({
  id: 'SRV20260401001',
  type: '安装问题',
  createTime: '2026-04-01 10:30',
  customer: '张女士',
  phone: '138****8888',
  status: '处理中',
  handler: '李师傅',
  deadline: '48小时',
  priority: '普通',
  appeal: '客户反映沙发安装后有异响，需要师傅上门检查处理。',
  order: {
    id: 'ORD20260331001',
    amount: '¥8,900',
    createTime: '2026-03-31 16:45',
    status: '已交付'
  },
  records: [
    { time: '2026-04-01 10:30', operator: '系统', content: '工单创建' },
    { time: '2026-04-01 10:35', operator: '赵经理', content: '分配给李师傅处理' },
    { time: '2026-04-01 11:00', operator: '李师傅', content: '已联系客户，约定明天上门检查' }
  ]
})

// 弹窗状态
const detailDialogVisible = ref(false)
const progressDialogVisible = ref(false)
const addRecordDialogVisible = ref(false)
const updateStatusDialogVisible = ref(false)
const submitting = ref(false)

// 记录表单
const recordForm = reactive({
  content: '',
  result: '',
  attachments: []
})
const recordRules = {
  content: [{ required: true, message: '请输入处理内容', trigger: 'blur' }],
  result: [{ required: true, message: '请选择处理结果', trigger: 'change' }]
}
const recordFormRef = ref(null)

// 状态表单
const statusForm = reactive({
  status: '',
  remark: ''
})
const statusRules = {
  status: [{ required: true, message: '请选择处理状态', trigger: 'change' }],
  remark: [{ required: true, message: '请输入处理说明', trigger: 'blur' }]
}
const statusFormRef = ref(null)

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

// 返回
const goBack = () => {
  // 返回到工单列表
  console.log('返回工单列表')
}

// 查看订单
const viewOrder = () => {
  // 查看对应订单
  console.log('查看订单:', ticket.value.order.id)
}

// 显示详情弹窗
const showDetailDialog = () => {
  detailDialogVisible.value = true
}

// 显示进度弹窗
const showProgressDialog = () => {
  progressDialogVisible.value = true
}

// 添加记录
const addRecord = () => {
  Object.assign(recordForm, {
    content: '',
    result: '',
    attachments: []
  })
  addRecordDialogVisible.value = true
}

// 提交记录
const submitRecord = async () => {
  const valid = await recordFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    addRecordDialogVisible.value = false
    ElMessage.success('处理记录提交成功')
  }, 500)
}

// 更新状态
const updateStatus = () => {
  Object.assign(statusForm, {
    status: ticket.value.status,
    remark: ''
  })
  updateStatusDialogVisible.value = true
}

// 提交状态更新
const submitStatus = async () => {
  const valid = await statusFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    updateStatusDialogVisible.value = false
    ticket.value.status = statusForm.status
    ElMessage.success('状态更新成功')
  }, 500)
}

// 上传凭证
const uploadVoucher = () => {
  // 上传处理凭证
  console.log('上传处理凭证')
}

// 联系客户
const contactCustomer = () => {
  // 联系客户
  console.log('联系客户:', ticket.value.phone)
}

// 关闭工单
const closeTicket = () => {
  ElMessageBox.confirm(
    '确定要关闭此工单吗？',
    '关闭工单',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      ticket.value.status = '已关闭'
      ElMessage.success('工单已关闭')
    }, 500)
  }).catch(() => {
    // 取消操作
  })
}

// 查看附件
const viewAttachment = (attachment) => {
  // 查看附件
  console.log('查看附件:', attachment)
}

// 上传预览
const handlePreview = (file) => {
  console.log(file)
}

// 上传移除
const handleRemove = (file, fileList) => {
  console.log(file, fileList)
}

// 组件挂载
onMounted(() => {
  // 模拟获取工单详情数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.service-processing {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.info-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.appeal-content {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
}

.action-section {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  padding: 20px 0;
}

.add-record-form {
  padding: 20px 0;
}

.update-status-form {
  padding: 20px 0;
}

.upload-demo {
  margin-top: 10px;
}

.record-content {
  margin-top: 5px;
}

.record-operator {
  font-weight: bold;
  margin-bottom: 5px;
}

.record-text {
  margin-bottom: 10px;
}

.record-attachment {
  margin-top: 5px;
}

.ticket-detail {
  padding: 20px 0;
}

.ticket-content {
  margin-top: 20px;
}

.ticket-content h3 {
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

.order-info {
  margin-top: 20px;
}

.order-info h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.progress-dialog {
  padding: 20px 0;
}

.progress-status {
  margin-bottom: 30px;
}

.progress-status h3 {
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.status-time {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.progress-timeline {
  margin-bottom: 30px;
}

.progress-timeline h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.timeline-content {
  .timeline-operator {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .timeline-action {
    margin-bottom: 10px;
  }
}

.progress-meta {
  margin-top: 20px;
}

.progress-meta h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
