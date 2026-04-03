<template>
  <div class="sms-marketing">
    <div class="page-header">
      <h1>短信群发</h1>
      <el-button type="primary" @click="createSmsTask">新建短信任务</el-button>
    </div>
    
    <!-- 短信任务列表 -->
    <div class="sms-list">
      <el-card shadow="hover">
        <div class="filter-section">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input v-model="searchKeyword" placeholder="搜索任务名称" prefix-icon="Search"></el-input>
            </el-col>
            <el-col :span="8">
              <el-select v-model="taskStatus" placeholder="任务状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="待发送" value="pending"></el-option>
                <el-option label="发送中" value="sending"></el-option>
                <el-option label="已完成" value="completed"></el-option>
                <el-option label="失败" value="failed"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </div>
        
        <el-table :data="smsTasks" style="width: 100%">
          <el-table-column prop="id" label="任务ID" width="120"></el-table-column>
          <el-table-column prop="name" label="任务名称"></el-table-column>
          <el-table-column prop="template" label="短信模板" width="200">
            <template #default="scope">
              <el-tooltip :content="scope.row.template" placement="top">
                <span class="template-preview">{{ scope.row.template }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="recipientCount" label="发送人数" width="100"></el-table-column>
          <el-table-column prop="sentCount" label="已发送" width="100"></el-table-column>
          <el-table-column prop="successRate" label="成功率" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.successRate >= 90 ? 'success' : 'warning'">{{ scope.row.successRate }}%</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row.id)">查看</el-button>
              <el-button size="small" type="primary" v-if="scope.row.status === 'pending'" @click="sendNow(scope.row.id)">立即发送</el-button>
              <el-button size="small" type="danger" v-if="scope.row.status === 'pending'" @click="cancelTask(scope.row.id)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
        
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
    
    <!-- 新建短信任务弹窗 -->
    <el-dialog v-model="dialogVisible" title="新建短信任务" width="800px">
      <el-form :model="smsForm" label-width="120px">
        <el-form-item label="任务名称" required>
          <el-input v-model="smsForm.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="选择模板" required>
          <el-select v-model="smsForm.templateId" placeholder="请选择短信模板" @change="handleTemplateChange">
            <el-option label="活动推广模板" value="TPL001"></el-option>
            <el-option label="订单提醒模板" value="TPL002"></el-option>
            <el-option label="客户关怀模板" value="TPL003"></el-option>
            <el-option label="自定义模板" value="custom"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信内容" required>
          <el-input type="textarea" v-model="smsForm.content" :rows="4" placeholder="请输入短信内容" maxlength="500" show-word-limit></el-input>
          <div class="sms-tips">
            <el-alert title="短信内容提示" type="info" :closable="false">
              <template #default>
                <div>1. 短信内容长度不超过500字</div>
                <div>2. 每条短信按70字计费，超过按多条计费</div>
                <div>3. 内容需符合相关法律法规</div>
              </template>
            </el-alert>
          </div>
        </el-form-item>
        <el-form-item label="发送对象" required>
          <el-radio-group v-model="smsForm.recipientType">
            <el-radio label="all">全部客户</el-radio>
            <el-radio label="tag">按标签筛选</el-radio>
            <el-radio label="custom">自定义导入</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择标签" v-if="smsForm.recipientType === 'tag'">
          <el-select v-model="smsForm.tags" multiple placeholder="请选择客户标签">
            <el-option label="VIP客户" value="vip"></el-option>
            <el-option label="新客户" value="new"></el-option>
            <el-option label="老客户" value="old"></el-option>
            <el-option label="高意向" value="high"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入文件" v-if="smsForm.recipientType === 'custom'">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持 Excel 文件，需包含手机号和姓名两列
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-radio-group v-model="smsForm.sendType">
            <el-radio label="now">立即发送</el-radio>
            <el-radio label="schedule">定时发送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="定时时间" v-if="smsForm.sendType === 'schedule'">
          <el-date-picker
            v-model="smsForm.scheduleTime"
            type="datetime"
            placeholder="选择发送时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitSmsTask">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 短信任务详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="短信任务详情" width="800px">
      <div class="sms-detail">
        <el-descriptions :column="2" border class="mb-4">
          <el-descriptions-item label="任务ID">{{ selectedTask.id }}</el-descriptions-item>
          <el-descriptions-item label="任务名称">{{ selectedTask.name }}</el-descriptions-item>
          <el-descriptions-item label="短信模板">{{ selectedTask.template }}</el-descriptions-item>
          <el-descriptions-item label="发送状态">
            <el-tag :type="getStatusType(selectedTask.status)">{{ getStatusText(selectedTask.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发送人数">{{ selectedTask.recipientCount }}</el-descriptions-item>
          <el-descriptions-item label="已发送">{{ selectedTask.sentCount }}</el-descriptions-item>
          <el-descriptions-item label="成功率">{{ selectedTask.successRate }}%</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedTask.createTime }}</el-descriptions-item>
        </el-descriptions>

        <div class="sms-content">
          <h3>短信内容</h3>
          <el-card shadow="hover" class="content-card">
            <p>{{ selectedTask.content }}</p>
          </el-card>
        </div>

        <div class="sms-recipients">
          <h3>发送对象</h3>
          <div class="recipient-info">
            <el-tag v-for="(recipient, index) in selectedTask.recipients" :key="index" class="recipient-tag">
              {{ recipient }}
            </el-tag>
          </div>
        </div>

        <div class="sms-stats">
          <h3>发送统计</h3>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="成功数">{{ selectedTask.stats?.success || 0 }}</el-descriptions-item>
            <el-descriptions-item label="失败数">{{ selectedTask.stats?.failed || 0 }}</el-descriptions-item>
            <el-descriptions-item label="费用">{{ selectedTask.stats?.cost || '¥0' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="sms-logs">
          <h3>发送日志</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(log, index) in selectedTask.logs"
              :key="index"
              :timestamp="log.time"
              :type="log.type"
            >
              <div class="timeline-content">
                <div class="timeline-title">{{ log.title }}</div>
                <div class="timeline-desc">{{ log.description }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
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
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const taskStatus = ref('')
const smsTasks = ref([
  { id: 'SMS001', name: '春季家装节推广', template: '【HomeUp】春季家装节活动开始啦！全场家具8折起，满10000减1000，快来选购吧！退订回T', recipientCount: 5000, sentCount: 5000, successRate: 98.5, status: 'completed', createTime: '2026-04-01 10:00' },
  { id: 'SMS002', name: '订单发货提醒', template: '【HomeUp】尊敬的客户，您的订单已发货，订单号：ORD20260401001，请注意查收。', recipientCount: 150, sentCount: 0, successRate: 0, status: 'pending', createTime: '2026-04-02 09:30' },
  { id: 'SMS003', name: '客户关怀短信', template: '【HomeUp】尊敬的客户，感谢您选择HomeUp，我们为您提供免费上门量尺服务，欢迎预约。退订回T', recipientCount: 2000, sentCount: 1200, successRate: 95.2, status: 'sending', createTime: '2026-04-02 14:00' }
])

const total = ref(3)
const pageSize = ref(10)
const currentPage = ref(1)
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const smsForm = ref({
  name: '',
  templateId: '',
  content: '',
  recipientType: 'all',
  tags: [],
  sendType: 'now',
  scheduleTime: ''
})

const selectedTask = ref({
  id: '',
  name: '',
  template: '',
  content: '',
  recipientCount: 0,
  sentCount: 0,
  successRate: 0,
  status: '',
  createTime: '',
  recipients: [],
  stats: {
    success: 0,
    failed: 0,
    cost: '¥0'
  },
  logs: []
})

const templateMap = {
  TPL001: '【HomeUp】春季家装节活动开始啦！全场家具8折起，满10000减1000，快来选购吧！退订回T',
  TPL002: '【HomeUp】尊敬的客户，您的订单已发货，订单号：{orderNo}，请注意查收。',
  TPL003: '【HomeUp】尊敬的客户，感谢您选择HomeUp，我们为您提供免费上门量尺服务，欢迎预约。退订回T'
}

const getStatusType = (status) => {
  const typeMap = { pending: 'warning', sending: 'primary', completed: 'success', failed: 'danger' }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = { pending: '待发送', sending: '发送中', completed: '已完成', failed: '失败' }
  return textMap[status] || status
}

const search = () => {
  ElMessage.success('搜索功能开发中')
}

const reset = () => {
  searchKeyword.value = ''
  taskStatus.value = ''
}

const createSmsTask = () => {
  smsForm.value = {
    name: '',
    templateId: '',
    content: '',
    recipientType: 'all',
    tags: [],
    sendType: 'now',
    scheduleTime: ''
  }
  dialogVisible.value = true
}

const handleTemplateChange = (value) => {
  if (value !== 'custom' && templateMap[value]) {
    smsForm.value.content = templateMap[value]
  }
}

const handleFileChange = (file) => {
  ElMessage.success(`文件已选择：${file.name}`)
}

const submitSmsTask = () => {
  ElMessage.success('短信任务创建成功')
  dialogVisible.value = false
}

const viewDetail = (id) => {
  // 模拟获取短信任务详情
  selectedTask.value = {
    id: id,
    name: '春季家装节推广',
    template: '【HomeUp】春季家装节活动开始啦！全场家具8折起，满10000减1000，快来选购吧！退订回T',
    content: '【HomeUp】春季家装节活动开始啦！全场家具8折起，满10000减1000，快来选购吧！退订回T',
    recipientCount: 5000,
    sentCount: 5000,
    successRate: 98.5,
    status: 'completed',
    createTime: '2026-04-01 10:00',
    recipients: [
      '全部客户',
      'VIP客户',
      '新客户'
    ],
    stats: {
      success: 4925,
      failed: 75,
      cost: '¥1,500'
    },
    logs: [
      {
        time: '2026-04-01 10:00:00',
        type: 'primary',
        title: '任务创建',
        description: '短信任务创建成功'
      },
      {
        time: '2026-04-01 10:01:00',
        type: 'info',
        title: '开始发送',
        description: '开始发送短信，目标人数：5000'
      },
      {
        time: '2026-04-01 10:30:00',
        type: 'success',
        title: '发送完成',
        description: '短信发送完成，成功：4925，失败：75，成功率：98.5%'
      }
    ]
  }
  detailDialogVisible.value = true
}

const sendNow = (id) => {
  ElMessageBox.confirm('确定要立即发送该短信任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('短信发送中')
  }).catch(() => {})
}

const cancelTask = (id) => {
  ElMessageBox.confirm('确定要取消该短信任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('任务已取消')
  }).catch(() => {})
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

onMounted(() => {
  console.log('[SmsMarketing] 组件挂载')
})
</script>

<style scoped>
.sms-marketing {
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

.filter-section {
  margin-bottom: 20px;
}

.template-preview {
  display: inline-block;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.sms-tips {
  margin-top: 10px;
}

/* 短信任务详情样式 */
.sms-detail {
  padding: 10px 0;
}

.mb-4 {
  margin-bottom: 20px;
}

.sms-content,
.sms-recipients,
.sms-stats,
.sms-logs {
  margin-top: 20px;
}

.sms-content h3,
.sms-recipients h3,
.sms-stats h3,
.sms-logs h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.content-card {
  margin-top: 5px;
}

.recipient-info {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.recipient-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.timeline-content {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top: 5px;
}

.timeline-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.timeline-desc {
  color: #666;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .el-descriptions {
    :deep(.el-descriptions__body) {
      display: flex;
      flex-direction: column;
    }
    :deep(.el-descriptions__row) {
      flex-direction: column;
    }
    :deep(.el-descriptions__cell) {
      width: 100% !important;
    }
  }
  
  .recipient-info {
    flex-direction: column;
  }
  
  .recipient-tag {
    width: 100%;
    text-align: center;
  }
}
</style>
