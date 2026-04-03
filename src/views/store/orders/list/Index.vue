<template>
  <div class="orders-list">
    <div class="page-header">
      <h1>订单列表</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="订单状态">
          <el-select v-model="filterForm.status" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待生产" value="pendingProduction"></el-option>
            <el-option label="生产中" value="inProduction"></el-option>
            <el-option label="待发货" value="pendingDelivery"></el-option>
            <el-option label="待安装" value="pendingInstallation"></el-option>
            <el-option label="已交付" value="completed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="filterForm.customer" size="small" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="导购">
          <el-input v-model="filterForm.sales" size="small" placeholder="请输入导购姓名"></el-input>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="filterForm.type" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="标准订单" value="standard"></el-option>
            <el-option label="定制订单" value="custom"></el-option>
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
          <el-button type="primary" size="small" @click="searchOrders">查询</el-button>
          <el-button size="small" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-section">
      <el-button type="primary" @click="showCreateOrderDialog">新增订单</el-button>
      <el-button @click="showExportDialog">导出订单</el-button>
    </div>
    
    <!-- 订单表格 -->
    <div class="table-section">
      <el-card shadow="hover">
        <el-table :data="orders" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="订单号" width="180"></el-table-column>
          <el-table-column prop="customer" label="客户"></el-table-column>
          <el-table-column prop="sales" label="导购" width="120"></el-table-column>
          <el-table-column prop="amount" label="金额" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row.id)">查看</el-button>
              <el-button size="small" type="primary" @click="showEditOrderDialog(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="showCancelOrderDialog(scope.row)">取消</el-button>
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

    <!-- 新增订单弹窗 -->
    <el-dialog v-model="createDialogVisible" title="新增订单" width="700px">
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="100px">
        <el-form-item label="客户信息" prop="customerId">
          <el-select v-model="createForm.customerId" placeholder="选择客户" style="width: 100%">
            <el-option v-for="customer in customers" :key="customer.id" :label="customer.name" :value="customer.id">
              <div style="display: flex; justify-content: space-between;">
                <span>{{ customer.name }}</span>
                <span style="color: #909399; font-size: 12px;">{{ customer.phone }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型" prop="type">
          <el-radio-group v-model="createForm.type">
            <el-radio-button label="standard">标准订单</el-radio-button>
            <el-radio-button label="custom">定制订单</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品信息" prop="products">
          <el-input v-model="createForm.products" type="textarea" :rows="3" placeholder="请输入产品信息" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单金额" prop="amount">
              <el-input-number v-model="createForm.amount" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="定金金额" prop="deposit">
              <el-input-number v-model="createForm.deposit" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="预计交付" prop="deliveryDate">
          <el-date-picker v-model="createForm.deliveryDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="订单备注" prop="remark">
          <el-input v-model="createForm.remark" type="textarea" :rows="2" placeholder="请输入订单备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreateOrder" :loading="submitting">创建订单</el-button>
      </template>
    </el-dialog>

    <!-- 编辑订单弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑订单" width="700px">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="订单号">
          <el-input v-model="editForm.id" disabled />
        </el-form-item>
        <el-form-item label="客户信息" prop="customerId">
          <el-select v-model="editForm.customerId" placeholder="选择客户" style="width: 100%">
            <el-option v-for="customer in customers" :key="customer.id" :label="customer.name" :value="customer.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型" prop="type">
          <el-radio-group v-model="editForm.type">
            <el-radio-button label="standard">标准订单</el-radio-button>
            <el-radio-button label="custom">定制订单</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品信息" prop="products">
          <el-input v-model="editForm.products" type="textarea" :rows="3" placeholder="请输入产品信息" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单金额" prop="amount">
              <el-input-number v-model="editForm.amount" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="定金金额" prop="deposit">
              <el-input-number v-model="editForm.deposit" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="预计交付" prop="deliveryDate">
          <el-date-picker v-model="editForm.deliveryDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="订单备注" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" :rows="2" placeholder="请输入订单备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditOrder" :loading="submitting">保存修改</el-button>
      </template>
    </el-dialog>

    <!-- 取消订单弹窗 -->
    <el-dialog v-model="cancelDialogVisible" title="取消订单" width="500px">
      <div class="cancel-order-dialog">
        <el-alert
          :title="`确定要取消订单 ${currentOrder?.id} 吗？`"
          type="warning"
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-form label-width="80px">
          <el-form-item label="取消原因" required>
            <el-select v-model="cancelReason" placeholder="选择取消原因" style="width: 100%">
              <el-option label="客户主动取消" value="customer_cancel" />
              <el-option label="产品缺货" value="out_of_stock" />
              <el-option label="价格变动" value="price_change" />
              <el-option label="其他原因" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="详细说明">
            <el-input v-model="cancelDescription" type="textarea" :rows="3" placeholder="请输入详细说明" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="cancelDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmCancelOrder" :loading="submitting">确认取消</el-button>
      </template>
    </el-dialog>

    <!-- 导出订单弹窗 -->
    <el-dialog v-model="exportDialogVisible" title="导出订单" width="550px">
      <el-form label-width="100px">
        <el-form-item label="导出范围">
          <el-radio-group v-model="exportForm.range">
            <el-radio-button label="all">全部订单</el-radio-button>
            <el-radio-button label="filtered">当前筛选</el-radio-button>
            <el-radio-button label="selected">选中订单</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="导出格式">
          <el-radio-group v-model="exportForm.format">
            <el-radio-button label="excel">Excel</el-radio-button>
            <el-radio-button label="csv">CSV</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间范围" v-if="exportForm.range === 'filtered'">
          <el-date-picker
            v-model="exportForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="导出字段">
          <el-checkbox-group v-model="exportForm.fields">
            <el-checkbox label="id">订单号</el-checkbox>
            <el-checkbox label="customer">客户信息</el-checkbox>
            <el-checkbox label="sales">导购</el-checkbox>
            <el-checkbox label="amount">金额</el-checkbox>
            <el-checkbox label="status">状态</el-checkbox>
            <el-checkbox label="createTime">创建时间</el-checkbox>
            <el-checkbox label="deliveryDate">交付日期</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmExport">确认导出</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选表单
const filterForm = ref({
  status: '',
  customer: '',
  sales: '',
  type: '',
  dateRange: []
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(128)
const loading = ref(false)
const submitting = ref(false)

// 已选订单
const selectedOrders = ref([])

// 模拟订单数据
const orders = ref([
  { id: 'ORD20260401001', customer: '张女士', sales: '李导购', amount: '¥12,800', status: 'completed', createTime: '2026-04-01 10:30' },
  { id: 'ORD20260401002', customer: '李先生', sales: '王导购', amount: '¥18,600', status: 'inProduction', createTime: '2026-04-01 09:15' },
  { id: 'ORD20260331001', customer: '王女士', sales: '李导购', amount: '¥8,900', status: 'completed', createTime: '2026-03-31 16:45' },
  { id: 'ORD20260331002', customer: '赵先生', sales: '王导购', amount: '¥25,000', status: 'pendingDelivery', createTime: '2026-03-31 14:20' },
  { id: 'ORD20260330001', customer: '刘女士', sales: '李导购', amount: '¥15,600', status: 'pendingInstallation', createTime: '2026-03-30 11:00' }
])

// 模拟客户数据
const customers = ref([
  { id: 1, name: '张女士', phone: '138****1234' },
  { id: 2, name: '李先生', phone: '139****5678' },
  { id: 3, name: '王女士', phone: '137****9012' },
  { id: 4, name: '赵先生', phone: '136****3456' },
  { id: 5, name: '刘女士', phone: '135****7890' }
])

// 弹窗控制
const createDialogVisible = ref(false)
const editDialogVisible = ref(false)
const cancelDialogVisible = ref(false)
const exportDialogVisible = ref(false)

// 当前操作订单
const currentOrder = ref(null)

// 新增订单表单
const createForm = reactive({
  customerId: '',
  type: 'standard',
  products: '',
  amount: 0,
  deposit: 0,
  deliveryDate: '',
  remark: ''
})

// 编辑订单表单
const editForm = reactive({
  id: '',
  customerId: '',
  type: 'standard',
  products: '',
  amount: 0,
  deposit: 0,
  deliveryDate: '',
  remark: ''
})

// 取消订单
const cancelReason = ref('')
const cancelDescription = ref('')

// 导出表单
const exportForm = reactive({
  range: 'all',
  format: 'excel',
  dateRange: [],
  fields: ['id', 'customer', 'sales', 'amount', 'status', 'createTime']
})

// 表单校验规则
const createRules = {
  customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  type: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
  products: [{ required: true, message: '请输入产品信息', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入订单金额', trigger: 'blur' }]
}

const editRules = {
  customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  type: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
  products: [{ required: true, message: '请输入产品信息', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入订单金额', trigger: 'blur' }]
}

// 表单引用
const createFormRef = ref(null)
const editFormRef = ref(null)

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pendingProduction: 'info',
    inProduction: 'warning',
    pendingDelivery: 'warning',
    pendingInstallation: 'warning',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pendingProduction: '待生产',
    inProduction: '生产中',
    pendingDelivery: '待发货',
    pendingInstallation: '待安装',
    completed: '已交付'
  }
  return textMap[status] || status
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedOrders.value = selection
}

// 查询订单
const searchOrders = () => {
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
    customer: '',
    sales: '',
    type: '',
    dateRange: []
  })
}

// 显示新增订单弹窗
const showCreateOrderDialog = () => {
  Object.assign(createForm, {
    customerId: '',
    type: 'standard',
    products: '',
    amount: 0,
    deposit: 0,
    deliveryDate: '',
    remark: ''
  })
  createDialogVisible.value = true
}

// 提交新增订单
const submitCreateOrder = async () => {
  const valid = await createFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    createDialogVisible.value = false
    ElMessage.success('订单创建成功')
  }, 500)
}

// 查看详情
const viewDetail = (id) => {
  router.push(`/store/orders/detail/${id}`)
}

// 显示编辑订单弹窗
const showEditOrderDialog = (row) => {
  currentOrder.value = row
  Object.assign(editForm, {
    id: row.id,
    customerId: 1, // 模拟数据
    type: 'standard',
    products: '全屋定制家具',
    amount: 12800,
    deposit: 3000,
    deliveryDate: '2026-05-01',
    remark: '客户要求月底交付'
  })
  editDialogVisible.value = true
}

// 提交编辑订单
const submitEditOrder = async () => {
  const valid = await editFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    editDialogVisible.value = false
    ElMessage.success('订单编辑成功')
  }, 500)
}

// 显示取消订单弹窗
const showCancelOrderDialog = (row) => {
  currentOrder.value = row
  cancelReason.value = ''
  cancelDescription.value = ''
  cancelDialogVisible.value = true
}

// 确认取消订单
const confirmCancelOrder = () => {
  if (!cancelReason.value) {
    ElMessage.warning('请选择取消原因')
    return
  }
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    cancelDialogVisible.value = false
    ElMessage.success('订单取消成功')
  }, 500)
}

// 显示导出弹窗
const showExportDialog = () => {
  Object.assign(exportForm, {
    range: 'all',
    format: 'excel',
    dateRange: [],
    fields: ['id', 'customer', 'sales', 'amount', 'status', 'createTime']
  })
  exportDialogVisible.value = true
}

// 确认导出
const confirmExport = () => {
  const fieldCount = exportForm.fields.length
  const rangeText = exportForm.range === 'all' ? '全部' : exportForm.range === 'filtered' ? '当前筛选' : '选中'
  
  ElMessageBox.confirm(
    `即将导出${rangeText}订单数据，包含${fieldCount}个字段，格式为${exportForm.format === 'excel' ? 'Excel' : 'CSV'}，是否继续？`,
    '导出确认',
    {
      confirmButtonText: '确认导出',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    exportDialogVisible.value = false
    ElMessage.success('订单数据导出中，请稍候...')
  })
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
.orders-list {
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

.action-section {
  margin-bottom: 20px;
}

.table-section {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.cancel-order-dialog {
  .el-alert {
    margin-bottom: 20px;
  }
}
</style>
