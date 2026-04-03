<template>
  <div class="invoice-management">
    <div class="page-header">
      <h1>发票申请管理</h1>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-section">
      <el-button type="primary" @click="addInvoice">新增发票申请</el-button>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="申请状态">
          <el-select v-model="filterForm.status" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待处理" value="pending"></el-option>
            <el-option label="已开票" value="issued"></el-option>
            <el-option label="已拒绝" value="rejected"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票类型">
          <el-select v-model="filterForm.type" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="增值税普通发票" value="normal"></el-option>
            <el-option label="增值税专用发票" value="special"></el-option>
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
    
    <!-- 发票申请列表 -->
    <div class="table-section">
      <el-card shadow="hover">
        <el-table :data="invoices" style="width: 100%">
          <el-table-column prop="id" label="申请单号" width="180"></el-table-column>
          <el-table-column prop="invoiceType" label="发票类型" width="150"></el-table-column>
          <el-table-column prop="amount" label="申请金额" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间" width="180"></el-table-column>
          <el-table-column prop="issueTime" label="开票时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
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
    
    <!-- 新增发票申请弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增发票申请"
      width="800px"
    >
      <div class="add-form">
        <el-form :model="addForm" label-width="120px">
          <el-form-item label="发票类型">
            <el-select v-model="addForm.invoiceType" placeholder="请选择发票类型">
              <el-option label="增值税普通发票" value="normal"></el-option>
              <el-option label="增值税专用发票" value="special"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请金额">
            <el-input v-model="addForm.amount" placeholder="请输入申请金额"></el-input>
          </el-form-item>
          <el-form-item label="抬头">
            <el-input v-model="addForm.title" placeholder="请输入发票抬头"></el-input>
          </el-form-item>
          <el-form-item label="税号" v-if="addForm.invoiceType === 'special'">
            <el-input v-model="addForm.taxNumber" placeholder="请输入税号"></el-input>
          </el-form-item>
          <el-form-item label="地址电话" v-if="addForm.invoiceType === 'special'">
            <el-input v-model="addForm.addressPhone" placeholder="请输入地址电话"></el-input>
          </el-form-item>
          <el-form-item label="开户行及账号" v-if="addForm.invoiceType === 'special'">
            <el-input v-model="addForm.bankInfo" placeholder="请输入开户行及账号"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="addForm.remark" :rows="3" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="addForm.attachments"
              :auto-upload="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传PDF文件，且不超过5MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAdd">提交申请</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 发票详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="发票详情"
      width="800px"
    >
      <div class="invoice-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请单号">{{ selectedInvoice.id }}</el-descriptions-item>
          <el-descriptions-item label="发票类型">{{ selectedInvoice.invoiceType }}</el-descriptions-item>
          <el-descriptions-item label="申请金额">{{ selectedInvoice.amount }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusText(selectedInvoice.status) }}</el-descriptions-item>
          <el-descriptions-item label="抬头">{{ selectedInvoice.title }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ selectedInvoice.createTime }}</el-descriptions-item>
          <el-descriptions-item label="开票时间">{{ selectedInvoice.issueTime || '未开票' }}</el-descriptions-item>
          <el-descriptions-item label="发票号码">{{ selectedInvoice.invoiceNumber || '未开票' }}</el-descriptions-item>
        </el-descriptions>
        <div v-if="selectedInvoice.status === 'issued'" class="invoice-file">
          <h3>发票文件</h3>
          <el-button type="primary" @click="downloadInvoice">下载发票</el-button>
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
  status: '',
  type: '',
  dateRange: []
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(30)

// 发票申请列表
const invoices = ref([
  { id: 'INV20260401001', invoiceType: '增值税普通发票', amount: '¥12,800', status: 'issued', createTime: '2026-04-01 10:30', issueTime: '2026-04-02 14:30' },
  { id: 'INV20260401002', invoiceType: '增值税专用发票', amount: '¥18,600', status: 'pending', createTime: '2026-04-01 09:15', issueTime: '' },
  { id: 'INV20260331001', invoiceType: '增值税普通发票', amount: '¥8,900', status: 'issued', createTime: '2026-03-31 16:45', issueTime: '2026-04-01 10:00' },
  { id: 'INV20260331002', invoiceType: '增值税普通发票', amount: '¥25,000', status: 'rejected', createTime: '2026-03-31 14:20', issueTime: '' },
  { id: 'INV20260330001', invoiceType: '增值税专用发票', amount: '¥15,600', status: 'issued', createTime: '2026-03-30 11:00', issueTime: '2026-03-31 09:00' }
])

// 新增弹窗
const addDialogVisible = ref(false)
const addForm = ref({
  invoiceType: '',
  amount: '',
  title: '',
  taxNumber: '',
  addressPhone: '',
  bankInfo: '',
  remark: '',
  attachments: []
})

// 详情弹窗
const detailDialogVisible = ref(false)
const selectedInvoice = ref({
  id: '',
  invoiceType: '',
  amount: '',
  status: '',
  title: '',
  createTime: '',
  issueTime: '',
  invoiceNumber: ''
})

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    issued: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待处理',
    issued: '已开票',
    rejected: '已拒绝'
  }
  return textMap[status] || status
}

// 新增发票申请
const addInvoice = () => {
  addForm.value = {
    invoiceType: '',
    amount: '',
    title: '',
    taxNumber: '',
    addressPhone: '',
    bankInfo: '',
    remark: '',
    attachments: []
  }
  addDialogVisible.value = true
}

// 提交申请
const submitAdd = () => {
  // 提交发票申请
  console.log('提交发票申请:', addForm.value)
  addDialogVisible.value = false
}

// 查看详情
const viewDetail = (id) => {
  // 模拟获取发票详情
  selectedInvoice.value = {
    id: id,
    invoiceType: '增值税普通发票',
    amount: '¥12,800',
    status: 'issued',
    title: '北京某某公司',
    createTime: '2026-04-01 10:30',
    issueTime: '2026-04-02 14:30',
    invoiceNumber: '12345678'
  }
  detailDialogVisible.value = true
}

// 下载发票
const downloadInvoice = () => {
  // 下载发票
  console.log('下载发票')
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
.invoice-management {
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

.action-section {
  margin-bottom: 20px;
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

.add-form {
  padding: 20px 0;
}

.upload-demo {
  margin-top: 10px;
}

.invoice-detail {
  padding: 20px 0;
}

.invoice-file {
  margin-top: 20px;
}

.invoice-file h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}
</style>