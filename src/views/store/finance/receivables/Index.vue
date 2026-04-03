<template>
  <div class="receivables-management">
    <div class="page-header">
      <h1>客户收款管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="收款状态">
          <el-select v-model="filterForm.status" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待收款" value="pending"></el-option>
            <el-option label="已收款" value="received"></el-option>
            <el-option label="部分收款" value="partial"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="filterForm.orderId" size="small" placeholder="请输入订单号"></el-input>
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
          <el-button type="primary" size="small" @click="searchReceivables">查询</el-button>
          <el-button size="small" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 收款记录表格 -->
    <div class="table-section">
      <el-card shadow="hover">
        <el-table :data="receivables" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="收款记录号" width="180"></el-table-column>
          <el-table-column prop="orderId" label="订单号" width="180"></el-table-column>
          <el-table-column prop="customer" label="客户"></el-table-column>
          <el-table-column prop="amount" label="应收金额" width="120"></el-table-column>
          <el-table-column prop="receivedAmount" label="已收金额" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
              <el-button size="small" type="primary" v-if="scope.row.status !== 'received'" @click="uploadReceipt(scope.row)">上传凭证</el-button>
              <el-button size="small" type="success" v-if="scope.row.status !== 'received'" @click="showMarkReceivedDialog(scope.row)">标记收款</el-button>
              <el-button size="small" type="danger" @click="showRefundDialog(scope.row)">退款</el-button>
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
    
    <!-- 收款详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="收款详情"
      width="800px"
    >
      <div class="receipt-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="收款记录号">{{ selectedReceipt.id }}</el-descriptions-item>
          <el-descriptions-item label="订单号">{{ selectedReceipt.orderId }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ selectedReceipt.customer }}</el-descriptions-item>
          <el-descriptions-item label="应收金额">{{ selectedReceipt.amount }}</el-descriptions-item>
          <el-descriptions-item label="已收金额">{{ selectedReceipt.receivedAmount }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusText(selectedReceipt.status) }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedReceipt.createTime }}</el-descriptions-item>
          <el-descriptions-item label="收款时间">{{ selectedReceipt.receivedTime || '未收款' }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="payment-records">
          <h3>支付记录</h3>
          <el-table :data="selectedReceipt.payments" style="width: 100%">
            <el-table-column prop="time" label="时间" width="180"></el-table-column>
            <el-table-column prop="amount" label="金额" width="120"></el-table-column>
            <el-table-column prop="method" label="支付方式" width="120"></el-table-column>
            <el-table-column prop="status" label="状态" width="100"></el-table-column>
            <el-table-column prop="attachment" label="凭证" width="100">
              <template #default="scope">
                <el-button size="small" v-if="scope.row.attachment" @click="viewAttachment(scope.row.attachment)">查看</el-button>
                <span v-else>无</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 上传凭证弹窗 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传收款凭证"
      width="600px"
    >
      <div class="upload-form">
        <el-form ref="uploadFormRef" :model="uploadForm" :rules="uploadRules" label-width="100px">
          <el-form-item label="收款记录号">
            <el-input v-model="uploadForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="收款金额" prop="amount">
            <el-input-number v-model="uploadForm.amount" :min="0" :precision="2" style="width: 100%" />
            <span style="margin-left: 10px">元</span>
          </el-form-item>
          <el-form-item label="支付方式" prop="method">
            <el-select v-model="uploadForm.method" placeholder="请选择支付方式" style="width: 100%">
              <el-option label="微信支付" value="wechat"></el-option>
              <el-option label="支付宝" value="alipay"></el-option>
              <el-option label="银行转账" value="bank"></el-option>
              <el-option label="现金" value="cash"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款凭证" prop="attachments">
            <el-upload
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="uploadForm.attachments"
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
          <el-form-item label="备注" prop="remark">
            <el-input v-model="uploadForm.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload" :loading="submitting">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 标记收款弹窗 -->
    <el-dialog
      v-model="markReceivedDialogVisible"
      title="标记收款"
      width="500px"
    >
      <div class="mark-received-dialog">
        <el-alert
          :title="`确定要将收款记录 ${currentReceipt?.id} 标记为已收款吗？`"
          type="info"
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-form label-width="100px">
          <el-form-item label="收款时间" prop="receivedTime">
            <el-date-picker v-model="markReceivedForm.receivedTime" type="datetime" placeholder="选择收款时间" style="width: 100%" />
          </el-form-item>
          <el-form-item label="收款方式" prop="paymentMethod">
            <el-select v-model="markReceivedForm.paymentMethod" placeholder="选择收款方式" style="width: 100%">
              <el-option label="微信支付" value="wechat" />
              <el-option label="支付宝" value="alipay" />
              <el-option label="银行转账" value="bank" />
              <el-option label="现金" value="cash" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="markReceivedForm.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="markReceivedDialogVisible = false">取消</el-button>
          <el-button type="success" @click="confirmMarkReceived" :loading="submitting">确认标记</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 退款弹窗 -->
    <el-dialog
      v-model="refundDialogVisible"
      title="退款申请"
      width="600px"
    >
      <div class="refund-dialog">
        <el-alert
          :title="`为客户 ${currentReceipt?.customer} 发起退款申请`"
          type="warning"
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-form ref="refundFormRef" :model="refundForm" :rules="refundRules" label-width="100px">
          <el-form-item label="退款金额" prop="amount">
            <el-input-number v-model="refundForm.amount" :min="0" :precision="2" style="width: 100%" />
            <span style="margin-left: 10px">元</span>
          </el-form-item>
          <el-form-item label="退款原因" prop="reason">
            <el-select v-model="refundForm.reason" placeholder="选择退款原因" style="width: 100%">
              <el-option label="客户取消订单" value="customer_cancel" />
              <el-option label="产品质量问题" value="quality_issue" />
              <el-option label="服务不满意" value="service_issue" />
              <el-option label="其他原因" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="退款方式" prop="method">
            <el-select v-model="refundForm.method" placeholder="选择退款方式" style="width: 100%">
              <el-option label="原路退回" value="original" />
              <el-option label="银行转账" value="bank" />
              <el-option label="现金" value="cash" />
            </el-select>
          </el-form-item>
          <el-form-item label="详细说明" prop="description">
            <el-input v-model="refundForm.description" type="textarea" :rows="3" placeholder="请输入详细说明" />
          </el-form-item>
          <el-form-item label="退款凭证">
            <el-upload
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="refundForm.attachments"
              :auto-upload="false"
            >
              <el-button size="small" type="primary">上传凭证</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="refundDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="submitRefund" :loading="submitting">提交退款</el-button>
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
  orderId: '',
  customer: '',
  dateRange: []
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)
const loading = ref(false)
const submitting = ref(false)

// 已选收款记录
const selectedReceivables = ref([])

// 收款记录
const receivables = ref([
  { id: 'RCV20260401001', orderId: 'ORD20260401001', customer: '张女士', amount: '¥12,800', receivedAmount: '¥12,800', status: 'received', createTime: '2026-04-01 10:30' },
  { id: 'RCV20260401002', orderId: 'ORD20260401002', customer: '李先生', amount: '¥18,600', receivedAmount: '¥9,300', status: 'partial', createTime: '2026-04-01 09:15' },
  { id: 'RCV20260331001', orderId: 'ORD20260331001', customer: '王女士', amount: '¥8,900', receivedAmount: '¥8,900', status: 'received', createTime: '2026-03-31 16:45' },
  { id: 'RCV20260331002', orderId: 'ORD20260331002', customer: '赵先生', amount: '¥25,000', receivedAmount: '¥0', status: 'pending', createTime: '2026-03-31 14:20' },
  { id: 'RCV20260330001', orderId: 'ORD20260330001', customer: '刘女士', amount: '¥15,600', receivedAmount: '¥7,800', status: 'partial', createTime: '2026-03-30 11:00' }
])

// 详情弹窗
const detailDialogVisible = ref(false)
const selectedReceipt = ref({
  id: '',
  orderId: '',
  customer: '',
  amount: '',
  receivedAmount: '',
  status: '',
  createTime: '',
  receivedTime: '',
  payments: []
})

// 当前操作收款记录
const currentReceipt = ref(null)

// 上传凭证弹窗
const uploadDialogVisible = ref(false)
const uploadForm = reactive({
  id: '',
  amount: 0,
  method: '',
  attachments: [],
  remark: ''
})
const uploadRules = {
  amount: [{ required: true, message: '请输入收款金额', trigger: 'blur' }],
  method: [{ required: true, message: '请选择支付方式', trigger: 'change' }]
}
const uploadFormRef = ref(null)

// 标记收款弹窗
const markReceivedDialogVisible = ref(false)
const markReceivedForm = reactive({
  receivedTime: new Date(),
  paymentMethod: 'wechat',
  remark: ''
})

// 退款弹窗
const refundDialogVisible = ref(false)
const refundForm = reactive({
  amount: 0,
  reason: '',
  method: 'original',
  description: '',
  attachments: []
})
const refundRules = {
  amount: [{ required: true, message: '请输入退款金额', trigger: 'blur' }],
  reason: [{ required: true, message: '请选择退款原因', trigger: 'change' }],
  method: [{ required: true, message: '请选择退款方式', trigger: 'change' }],
  description: [{ required: true, message: '请输入详细说明', trigger: 'blur' }]
}
const refundFormRef = ref(null)

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    partial: 'info',
    received: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待收款',
    partial: '部分收款',
    received: '已收款'
  }
  return textMap[status] || status
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedReceivables.value = selection
}

// 查询收款记录
const searchReceivables = () => {
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
    orderId: '',
    customer: '',
    dateRange: []
  })
}

// 查看详情
const viewDetail = (id) => {
  // 模拟获取收款详情
  selectedReceipt.value = {
    id: id,
    orderId: 'ORD20260401001',
    customer: '张女士',
    amount: '¥12,800',
    receivedAmount: '¥12,800',
    status: 'received',
    createTime: '2026-04-01 10:30',
    receivedTime: '2026-04-01 10:30',
    payments: [
      { time: '2026-04-01 10:30', amount: '¥12,800', method: '微信支付', status: '已完成', attachment: 'receipt1.jpg' }
    ]
  }
  detailDialogVisible.value = true
}

// 上传凭证
const uploadReceipt = (row) => {
  currentReceipt.value = row
  Object.assign(uploadForm, {
    id: row.id,
    amount: 0,
    method: '',
    attachments: [],
    remark: ''
  })
  uploadDialogVisible.value = true
}

// 提交上传
const submitUpload = async () => {
  const valid = await uploadFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    uploadDialogVisible.value = false
    ElMessage.success('凭证上传成功')
  }, 500)
}

// 显示标记收款弹窗
const showMarkReceivedDialog = (row) => {
  currentReceipt.value = row
  Object.assign(markReceivedForm, {
    receivedTime: new Date(),
    paymentMethod: 'wechat',
    remark: ''
  })
  markReceivedDialogVisible.value = true
}

// 确认标记收款
const confirmMarkReceived = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    markReceivedDialogVisible.value = false
    ElMessage.success('标记收款成功')
  }, 500)
}

// 显示退款弹窗
const showRefundDialog = (row) => {
  currentReceipt.value = row
  Object.assign(refundForm, {
    amount: 0,
    reason: '',
    method: 'original',
    description: '',
    attachments: []
  })
  refundDialogVisible.value = true
}

// 提交退款
const submitRefund = async () => {
  const valid = await refundFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    refundDialogVisible.value = false
    ElMessage.success('退款申请提交成功')
  }, 500)
}

// 查看凭证
const viewAttachment = (attachment) => {
  ElMessageBox.alert(
    `<img src="${attachment}" style="max-width: 100%; height: auto" />`,
    '凭证查看',
    { dangerouslyUseHTMLString: true }
  )
}

// 上传预览
const handlePreview = (file) => {
  console.log(file)
}

// 上传移除
const handleRemove = (file, fileList) => {
  console.log(file, fileList)
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
.receivables-management {
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

.receipt-detail {
  padding: 20px 0;
}

.payment-records {
  margin-top: 20px;
}

.payment-records h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.upload-form {
  padding: 20px 0;
}

.upload-demo {
  margin-top: 10px;
}

.mark-received-dialog,
.refund-dialog {
  .el-alert {
    margin-bottom: 20px;
  }
}
</style>
