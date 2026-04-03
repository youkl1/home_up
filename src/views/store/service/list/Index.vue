<template>
  <div class="service-list">
    <div class="page-header">
      <h1>售后工单列表</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="工单状态">
          <el-select v-model="filterForm.status" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待处理" value="pending"></el-option>
            <el-option label="处理中" value="processing"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已关闭" value="closed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单类型">
          <el-select v-model="filterForm.type" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="安装问题" value="installation"></el-option>
            <el-option label="产品质量" value="quality"></el-option>
            <el-option label="退款申请" value="refund"></el-option>
            <el-option label="投诉" value="complaint"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="filterForm.customer" size="small" placeholder="请输入客户名称"></el-input>
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
          <el-button type="primary" size="small" @click="searchTickets">查询</el-button>
          <el-button size="small" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 工单表格 -->
    <div class="table-section">
      <el-card shadow="hover">
        <el-table :data="tickets" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="工单号" width="180"></el-table-column>
          <el-table-column prop="customer" label="客户"></el-table-column>
          <el-table-column prop="type" label="工单类型" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="handler" label="处理人" width="120"></el-table-column>
          <el-table-column prop="deadline" label="处理时效" width="120"></el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button size="small" @click="showDetailDialog(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" v-if="scope.row.status === 'pending'" @click="assignHandler(scope.row)">分配处理人</el-button>
              <el-button size="small" type="success" v-if="scope.row.status === 'pending'" @click="setDeadline(scope.row)">设置时效</el-button>
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
    
    <!-- 工单详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="工单详情"
      width="800px"
    >
      <div class="ticket-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单号">{{ selectedTicket.id }}</el-descriptions-item>
          <el-descriptions-item label="工单类型">{{ selectedTicket.type }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ selectedTicket.customer }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusText(selectedTicket.status) }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedTicket.createTime }}</el-descriptions-item>
          <el-descriptions-item label="处理人">{{ selectedTicket.handler || '未分配' }}</el-descriptions-item>
          <el-descriptions-item label="处理时效">{{ selectedTicket.deadline || '未设置' }}</el-descriptions-item>
          <el-descriptions-item label="优先级">{{ selectedTicket.priority || '普通' }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="ticket-content">
          <h3>工单内容</h3>
          <div class="content-box">
            {{ selectedTicket.content }}
          </div>
        </div>
        
        <div class="processing-history">
          <h3>处理历史</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(history, index) in selectedTicket.history"
              :key="index"
              :timestamp="history.time"
            >
              <div class="timeline-content">
                <div class="operator">{{ history.operator }}</div>
                <div class="action">{{ history.action }}</div>
                <div class="description" v-if="history.description">{{ history.description }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
        
        <div class="process-form" v-if="selectedTicket.status !== 'completed' && selectedTicket.status !== 'closed'">
          <h3>处理进度</h3>
          <el-form :model="processForm" label-width="100px">
            <el-form-item label="处理状态">
              <el-select v-model="processForm.status" placeholder="选择处理状态">
                <el-option label="待处理" value="pending" />
                <el-option label="处理中" value="processing" />
                <el-option label="已完成" value="completed" />
                <el-option label="已关闭" value="closed" />
              </el-select>
            </el-form-item>
            <el-form-item label="处理内容">
              <el-input v-model="processForm.content" type="textarea" :rows="3" placeholder="请输入处理内容" />
            </el-form-item>
            <el-form-item label="处理结果">
              <el-select v-model="processForm.result" placeholder="选择处理结果">
                <el-option label="问题已解决" value="solved" />
                <el-option label="问题部分解决" value="partially_solved" />
                <el-option label="问题未解决" value="unsolved" />
                <el-option label="需要进一步处理" value="need_more" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button v-if="selectedTicket.status !== 'completed' && selectedTicket.status !== 'closed'" type="primary" @click="submitProcess">提交处理</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 分配处理人弹窗 -->
    <el-dialog
      v-model="assignDialogVisible"
      title="分配处理人"
      width="600px"
    >
      <div class="assign-form">
        <el-form ref="assignFormRef" :model="assignForm" :rules="assignRules" label-width="100px">
          <el-form-item label="工单号">
            <el-input v-model="assignForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="处理人" prop="handlerId">
            <el-select v-model="assignForm.handlerId" placeholder="请选择处理人" style="width: 100%">
              <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分配原因">
            <el-input v-model="assignForm.reason" type="textarea" :rows="2" placeholder="请输入分配原因" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAssign" :loading="submitting">提交分配</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 设置处理时效弹窗 -->
    <el-dialog
      v-model="deadlineDialogVisible"
      title="设置处理时效"
      width="600px"
    >
      <div class="deadline-form">
        <el-form ref="deadlineFormRef" :model="deadlineForm" :rules="deadlineRules" label-width="100px">
          <el-form-item label="工单号">
            <el-input v-model="deadlineForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="处理时效" prop="deadline">
            <el-select v-model="deadlineForm.deadline" placeholder="请选择处理时效" style="width: 100%">
              <el-option label="24小时" value="24h"></el-option>
              <el-option label="48小时" value="48h"></el-option>
              <el-option label="72小时" value="72h"></el-option>
              <el-option label="7天" value="7d"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设置原因">
            <el-input v-model="deadlineForm.reason" type="textarea" :rows="2" placeholder="请输入设置原因" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deadlineDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDeadline" :loading="submitting">提交设置</el-button>
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
  status: '',
  type: '',
  customer: '',
  dateRange: []
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(156)
const loading = ref(false)
const submitting = ref(false)

// 已选工单
const selectedTickets = ref([])

// 工单列表
const tickets = ref([
  { id: 'SRV20260401001', customer: '张女士', type: '安装问题', status: 'processing', createTime: '2026-04-01 10:30', handler: '李师傅', deadline: '48小时' },
  { id: 'SRV20260401002', customer: '李先生', type: '产品质量', status: 'pending', createTime: '2026-04-01 09:15', handler: '', deadline: '' },
  { id: 'SRV20260331001', customer: '王女士', type: '退款申请', status: 'completed', createTime: '2026-03-31 16:45', handler: '赵经理', deadline: '24小时' },
  { id: 'SRV20260331002', customer: '赵先生', type: '安装问题', status: 'completed', createTime: '2026-03-31 14:20', handler: '李师傅', deadline: '48小时' },
  { id: 'SRV20260330001', customer: '刘女士', type: '产品质量', status: 'processing', createTime: '2026-03-30 11:00', handler: '赵经理', deadline: '72小时' }
])

// 处理人列表
const users = ref([
  { id: '1', name: '李师傅' },
  { id: '2', name: '赵经理' },
  { id: '3', name: '王客服' }
])

// 工单详情
const detailDialogVisible = ref(false)
const selectedTicket = ref({
  id: '',
  type: '',
  customer: '',
  status: '',
  createTime: '',
  handler: '',
  deadline: '',
  priority: '',
  content: '',
  history: []
})

// 处理进度表单
const processForm = reactive({
  status: '',
  content: '',
  result: ''
})

// 分配处理人弹窗
const assignDialogVisible = ref(false)
const assignForm = reactive({
  id: '',
  handlerId: '',
  reason: ''
})
const assignRules = {
  handlerId: [{ required: true, message: '请选择处理人', trigger: 'change' }]
}
const assignFormRef = ref(null)

// 设置处理时效弹窗
const deadlineDialogVisible = ref(false)
const deadlineForm = reactive({
  id: '',
  deadline: '',
  reason: ''
})
const deadlineRules = {
  deadline: [{ required: true, message: '请选择处理时效', trigger: 'change' }]
}
const deadlineFormRef = ref(null)

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    processing: 'info',
    completed: 'success',
    closed: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    closed: '已关闭'
  }
  return textMap[status] || status
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedTickets.value = selection
}

// 查询工单
const searchTickets = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询成功')
  }, 500)
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterForm.value, {
    status: '',
    type: '',
    customer: '',
    dateRange: []
  })
}

// 显示详情弹窗
const showDetailDialog = (row) => {
  // 模拟获取工单详情
  selectedTicket.value = {
    id: row.id,
    type: row.type,
    customer: row.customer,
    status: row.status,
    createTime: row.createTime,
    handler: row.handler,
    deadline: row.deadline,
    priority: '普通',
    content: '客户反馈安装的橱柜门开关不顺畅，需要师傅上门调整。',
    history: [
      {
        time: '2026-04-01 10:30',
        operator: '系统',
        action: '工单创建',
        description: '客户通过在线客服提交工单'
      },
      {
        time: '2026-04-01 10:45',
        operator: '赵经理',
        action: '分配处理人',
        description: '分配给李师傅处理'
      },
      {
        time: '2026-04-01 11:00',
        operator: '李师傅',
        action: '开始处理',
        description: '已联系客户，约定明天上门处理'
      }
    ]
  }
  Object.assign(processForm, {
    status: row.status,
    content: '',
    result: ''
  })
  detailDialogVisible.value = true
}

// 提交处理
const submitProcess = () => {
  if (!processForm.content) {
    ElMessage.warning('请输入处理内容')
    return
  }
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    detailDialogVisible.value = false
    ElMessage.success('处理提交成功')
  }, 500)
}

// 分配处理人
const assignHandler = (row) => {
  Object.assign(assignForm, {
    id: row.id,
    handlerId: '',
    reason: ''
  })
  assignDialogVisible.value = true
}

// 提交分配
const submitAssign = async () => {
  const valid = await assignFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    assignDialogVisible.value = false
    ElMessage.success('分配成功')
  }, 500)
}

// 设置处理时效
const setDeadline = (row) => {
  Object.assign(deadlineForm, {
    id: row.id,
    deadline: '',
    reason: ''
  })
  deadlineDialogVisible.value = true
}

// 提交设置
const submitDeadline = async () => {
  const valid = await deadlineFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    deadlineDialogVisible.value = false
    ElMessage.success('设置成功')
  }, 500)
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
.service-list {
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.ticket-detail {
  padding: 20px 0;
}

.ticket-content {
  margin-top: 20px;
  
  h3 {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  
  .content-box {
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;
    line-height: 1.6;
  }
}

.processing-history {
  margin-top: 20px;
  
  h3 {
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: bold;
  }
  
  .timeline-content {
    .operator {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .action {
      color: #606266;
      margin-bottom: 5px;
    }
    
    .description {
      color: #909399;
      font-size: 14px;
      margin-top: 5px;
    }
  }
}

.process-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  
  h3 {
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: bold;
  }
}

.assign-form,
.deadline-form {
  padding: 20px 0;
}
</style>
