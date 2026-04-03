<template>
  <div class="installers-dispatch">
    <div class="page-header">
      <h1>工单派发管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="订单号">
          <el-input v-model="filterForm.orderId" size="small" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model="filterForm.customer" size="small" placeholder="请输入客户姓名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待派发" value="pending"></el-option>
            <el-option label="已派发" value="dispatched"></el-option>
            <el-option label="已接单" value="accepted"></el-option>
            <el-option label="已完成" value="completed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="searchWorkOrders">查询</el-button>
          <el-button size="small" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 工单列表 -->
    <div class="table-section">
      <el-card shadow="hover">
        <el-table :data="workOrders" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="工单号" width="180"></el-table-column>
          <el-table-column prop="orderId" label="订单号" width="180"></el-table-column>
          <el-table-column prop="customer" label="客户"></el-table-column>
          <el-table-column prop="address" label="安装地址"></el-table-column>
          <el-table-column prop="serviceType" label="服务类型" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="installer" label="安装师傅" width="120"></el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button size="small" @click="showDetailDialog(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" v-if="scope.row.status === 'pending'" @click="dispatchOrder(scope.row)">派发工单</el-button>
              <el-button size="small" type="success" v-if="scope.row.status === 'dispatched' || scope.row.status === 'accepted' || scope.row.status === 'completed'" @click="showProgressDialog(scope.row)">查看进度</el-button>
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
    
    <!-- 派发工单弹窗 -->
    <el-dialog
      v-model="dispatchDialogVisible"
      title="派发工单"
      width="800px"
    >
      <div class="dispatch-form">
        <el-form ref="dispatchFormRef" :model="dispatchForm" :rules="dispatchRules" label-width="120px">
          <el-form-item label="工单号">
            <el-input v-model="dispatchForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="dispatchForm.orderId" disabled></el-input>
          </el-form-item>
          <el-form-item label="客户">
            <el-input v-model="dispatchForm.customer" disabled></el-input>
          </el-form-item>
          <el-form-item label="安装地址">
            <el-input v-model="dispatchForm.address" disabled></el-input>
          </el-form-item>
          <el-form-item label="服务类型">
            <el-input v-model="dispatchForm.serviceType" disabled></el-input>
          </el-form-item>
          <el-form-item label="选择师傅" prop="installerId">
            <el-select v-model="dispatchForm.installerId" placeholder="请选择安装师傅" style="width: 100%">
              <el-option
                v-for="installer in availableInstallers"
                :key="installer.id"
                :label="installer.name"
                :value="installer.id"
              >
                {{ installer.name }} - {{ installer.serviceType }} - {{ installer.serviceArea }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="安装时间" prop="installTime">
            <el-date-picker
              v-model="dispatchForm.installTime"
              type="datetime"
              placeholder="选择安装时间"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="安装要求" prop="requirements">
            <el-input type="textarea" v-model="dispatchForm.requirements" :rows="3" placeholder="请输入安装要求"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dispatchDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDispatch" :loading="submitting">提交派发</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="工单详情"
      width="800px"
    >
      <div class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单号">{{ selectedOrder?.id }}</el-descriptions-item>
          <el-descriptions-item label="订单号">{{ selectedOrder?.orderId }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ selectedOrder?.customer }}</el-descriptions-item>
          <el-descriptions-item label="服务类型">{{ selectedOrder?.serviceType }}</el-descriptions-item>
          <el-descriptions-item label="安装地址">{{ selectedOrder?.address }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedOrder?.createTime }}</el-descriptions-item>
          <el-descriptions-item label="状态"><el-tag :type="getStatusType(selectedOrder?.status)">{{ getStatusText(selectedOrder?.status) }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="安装师傅">{{ selectedOrder?.installer || '未指派' }}</el-descriptions-item>
          <el-descriptions-item label="安装时间" v-if="selectedOrder?.installTime">{{ selectedOrder?.installTime }}</el-descriptions-item>
          <el-descriptions-item label="安装要求" v-if="selectedOrder?.requirements" span="2">{{ selectedOrder?.requirements }}</el-descriptions-item>
        </el-descriptions>

        <div class="order-info" v-if="selectedOrder?.orderInfo">
          <h3>订单信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单金额">{{ selectedOrder?.orderInfo.amount }}</el-descriptions-item>
            <el-descriptions-item label="下单时间">{{ selectedOrder?.orderInfo.orderTime }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">{{ selectedOrder?.orderInfo.orderStatus }}</el-descriptions-item>
            <el-descriptions-item label="支付方式">{{ selectedOrder?.orderInfo.paymentMethod }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="customer-info" v-if="selectedOrder?.customerInfo">
          <h3>客户信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="姓名">{{ selectedOrder?.customerInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ selectedOrder?.customerInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="电子邮箱" v-if="selectedOrder?.customerInfo.email">{{ selectedOrder?.customerInfo.email }}</el-descriptions-item>
            <el-descriptions-item label="会员等级" v-if="selectedOrder?.customerInfo.memberLevel">{{ selectedOrder?.customerInfo.memberLevel }}</el-descriptions-item>
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
      title="安装进度"
      width="800px"
    >
      <div class="progress-dialog">
        <div class="progress-status">
          <h3>当前状态：<el-tag :type="getStatusType(selectedOrder?.status)">{{ getStatusText(selectedOrder?.status) }}</el-tag></h3>
          <p class="status-time" v-if="selectedOrder?.lastUpdateTime">更新时间：{{ selectedOrder?.lastUpdateTime }}</p>
        </div>

        <div class="progress-timeline">
          <h3>处理流程</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(step, index) in selectedOrder?.progressSteps"
              :key="index"
              :timestamp="step.time"
              :type="step.type"
              :icon="step.icon"
            >
              <div class="timeline-content">
                <div class="timeline-title">{{ step.title }}</div>
                <div class="timeline-description">{{ step.description }}</div>
                <div class="timeline-operator" v-if="step.operator">操作人：{{ step.operator }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>

        <div class="progress-meta" v-if="selectedOrder?.progressMeta">
          <h3>进度信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="预计完成时间">{{ selectedOrder?.progressMeta.expectedCompleteTime }}</el-descriptions-item>
            <el-descriptions-item label="实际完成时间" v-if="selectedOrder?.progressMeta.actualCompleteTime">{{ selectedOrder?.progressMeta.actualCompleteTime }}</el-descriptions-item>
            <el-descriptions-item label="安装师傅">{{ selectedOrder?.installer }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ selectedOrder?.progressMeta.installerPhone }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="progressDialogVisible = false">关闭</el-button>
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
  orderId: '',
  customer: '',
  status: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(80)
const loading = ref(false)
const submitting = ref(false)

// 已选工单
const selectedOrders = ref([])

// 工单列表
const workOrders = ref([
  { id: 'WO20260401001', orderId: 'ORD20260331001', customer: '张女士', address: '北京市朝阳区建国路88号', serviceType: '家具安装', createTime: '2026-04-01 10:30', status: 'pending', installer: '' },
  { id: 'WO20260401002', orderId: 'ORD20260331002', customer: '李先生', address: '北京市海淀区中关村大街1号', serviceType: '家电安装', createTime: '2026-04-01 09:15', status: 'dispatched', installer: '李师傅' },
  { id: 'WO20260331001', orderId: 'ORD20260330001', customer: '王女士', address: '北京市西城区西单北大街120号', serviceType: '整体定制', createTime: '2026-03-31 16:45', status: 'accepted', installer: '张师傅' },
  { id: 'WO20260331002', orderId: 'ORD20260329001', customer: '赵先生', address: '北京市东城区东直门外大街42号', serviceType: '家具安装', createTime: '2026-03-31 14:20', status: 'completed', installer: '赵师傅' },
  { id: 'WO20260330001', orderId: 'ORD20260328001', customer: '刘女士', address: '北京市丰台区丰台路66号', serviceType: '家电安装', createTime: '2026-03-30 11:00', status: 'pending', installer: '' }
])

// 可用师傅列表
const availableInstallers = ref([
  { id: 'INS001', name: '李师傅', serviceType: '家具安装', serviceArea: '北京市朝阳区' },
  { id: 'INS002', name: '王师傅', serviceType: '家电安装', serviceArea: '北京市海淀区' },
  { id: 'INS004', name: '赵师傅', serviceType: '家具安装', serviceArea: '北京市东城区' },
  { id: 'INS005', name: '刘师傅', serviceType: '家电安装', serviceArea: '北京市丰台区' }
])

// 弹窗状态
const dispatchDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const progressDialogVisible = ref(false)

// 当前选中工单
const selectedOrder = ref(null)

// 派发表单
const dispatchForm = reactive({
  id: '',
  orderId: '',
  customer: '',
  address: '',
  serviceType: '',
  installerId: '',
  installTime: '',
  requirements: ''
})
const dispatchRules = {
  installerId: [{ required: true, message: '请选择安装师傅', trigger: 'change' }],
  installTime: [{ required: true, message: '请选择安装时间', trigger: 'change' }]
}
const dispatchFormRef = ref(null)

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    dispatched: 'info',
    accepted: 'primary',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待派发',
    dispatched: '已派发',
    accepted: '已接单',
    completed: '已完成'
  }
  return textMap[status] || status
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedOrders.value = selection
}

// 查询工单
const searchWorkOrders = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询成功')
  }, 500)
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterForm.value, {
    orderId: '',
    customer: '',
    status: ''
  })
}

// 显示详情弹窗
const showDetailDialog = (order) => {
  // 模拟获取工单详情
  selectedOrder.value = {
    ...order,
    installTime: order.status !== 'pending' ? '2026-04-02 14:00' : null,
    requirements: order.status !== 'pending' ? '客户要求下午2点后上门安装' : null,
    orderInfo: {
      amount: '¥8,900',
      orderTime: '2026-03-31 16:45',
      orderStatus: '已支付',
      paymentMethod: '微信支付'
    },
    customerInfo: {
      name: order.customer,
      phone: '138****8888',
      email: 'customer@example.com',
      memberLevel: 'VIP'
    }
  }
  detailDialogVisible.value = true
}

// 派发工单
const dispatchOrder = (order) => {
  Object.assign(dispatchForm, {
    id: order.id,
    orderId: order.orderId,
    customer: order.customer,
    address: order.address,
    serviceType: order.serviceType,
    installerId: '',
    installTime: '',
    requirements: ''
  })
  dispatchDialogVisible.value = true
}

// 显示进度弹窗
const showProgressDialog = (order) => {
  // 模拟获取工单进度
  selectedOrder.value = {
    ...order,
    lastUpdateTime: '2026-04-01 15:30',
    progressSteps: [
      {
        time: order.createTime,
        title: '工单创建',
        description: '系统自动创建工单',
        operator: '系统',
        type: 'primary',
        icon: 'el-icon-s-finished'
      },
      {
        time: '2026-04-01 11:00',
        title: '工单派发',
        description: '指派给' + order.installer + '处理',
        operator: '系统',
        type: 'info',
        icon: 'el-icon-s-flag'
      },
      ...(order.status !== 'dispatched' ? [{
        time: '2026-04-01 12:00',
        title: '师傅接单',
        description: order.installer + '已确认接单',
        operator: order.installer,
        type: 'info',
        icon: 'el-icon-s-check'
      }] : []),
      ...(order.status === 'completed' ? [{
        time: '2026-04-01 14:30',
        title: '安装完成',
        description: '师傅已完成安装并验收',
        operator: order.installer,
        type: 'success',
        icon: 'el-icon-s-success'
      }] : [])
    ],
    progressMeta: {
      expectedCompleteTime: '2026-04-01 15:00',
      actualCompleteTime: order.status === 'completed' ? '2026-04-01 14:30' : null,
      installerPhone: '139****9999'
    }
  }
  progressDialogVisible.value = true
}

// 提交派发
const submitDispatch = async () => {
  const valid = await dispatchFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    dispatchDialogVisible.value = false
    // 更新工单状态
    const order = workOrders.value.find(item => item.id === dispatchForm.id)
    if (order) {
      order.status = 'dispatched'
      order.installer = availableInstallers.value.find(i => i.id === dispatchForm.installerId)?.name || ''
    }
    ElMessage.success('工单派发成功')
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
.installers-dispatch {
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

.dispatch-form {
  padding: 20px 0;
}

.order-detail {
  padding: 20px 0;
}

.order-info,
.customer-info {
  margin-top: 30px;
}

.order-info h3,
.customer-info h3 {
  margin-bottom: 15px;
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
  .timeline-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .timeline-description {
    margin-bottom: 5px;
    color: #666;
  }
  .timeline-operator {
    font-size: 14px;
    color: #909399;
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
