<template>
  <div class="order-delivery">
    <div class="page-header">
      <h1>订单交付管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="订单号">
          <el-input v-model="filterForm.orderId" size="small" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="filterForm.customer" size="small" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="交付状态">
          <el-select v-model="filterForm.status" size="small" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="待发货" value="pendingDelivery"></el-option>
            <el-option label="已发货" value="shipped"></el-option>
            <el-option label="待安装" value="pendingInstallation"></el-option>
            <el-option label="已交付" value="completed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small">查询</el-button>
          <el-button size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 交付管理表格 -->
    <div class="table-section">
      <el-card shadow="hover">
        <el-table :data="deliveryList" style="width: 100%">
          <el-table-column prop="orderId" label="订单号" width="180"></el-table-column>
          <el-table-column prop="customer" label="客户"></el-table-column>
          <el-table-column prop="amount" label="金额" width="120"></el-table-column>
          <el-table-column prop="deliveryStatus" label="交付状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.deliveryStatus)">
                {{ scope.row.deliveryStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="shippingTime" label="发货时间" width="180"></el-table-column>
          <el-table-column prop="installationTime" label="安装时间" width="180"></el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button size="small" @click="viewLogistics(scope.row.orderId)">物流跟踪</el-button>
              <el-button size="small" type="primary" @click="assignInstaller(scope.row.orderId)">派发安装</el-button>
              <el-button size="small" type="success" @click="confirmDelivery(scope.row.orderId)">确认交付</el-button>
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
    
    <!-- 物流跟踪弹窗 -->
    <el-dialog
      v-model="logisticsDialogVisible"
      title="物流跟踪"
      width="800px"
    >
      <div class="logistics-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ selectedOrder.orderId }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ selectedOrder.customer }}</el-descriptions-item>
          <el-descriptions-item label="物流公司">{{ selectedOrder.logistics.company }}</el-descriptions-item>
          <el-descriptions-item label="物流单号">{{ selectedOrder.logistics.trackingNumber }}</el-descriptions-item>
          <el-descriptions-item label="发货时间">{{ selectedOrder.logistics.shippingTime }}</el-descriptions-item>
          <el-descriptions-item label="预计到达">{{ selectedOrder.logistics.estimatedArrival }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="logistics-timeline">
          <h3>物流轨迹</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(track, index) in selectedOrder.logistics.tracks"
              :key="index"
              :timestamp="track.time"
            >
              {{ track.status }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="logisticsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 派发安装弹窗 -->
    <el-dialog
      v-model="assignDialogVisible"
      title="派发安装工单"
      width="600px"
    >
      <div class="assign-form">
        <el-form :model="assignForm" label-width="100px">
          <el-form-item label="订单号">
            <el-input v-model="assignForm.orderId" disabled></el-input>
          </el-form-item>
          <el-form-item label="安装师傅">
            <el-select v-model="assignForm.installerId" placeholder="请选择安装师傅">
              <el-option v-for="installer in installers" :key="installer.id" :label="installer.name" :value="installer.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预约时间">
            <el-date-picker v-model="assignForm.scheduledTime" type="datetime" placeholder="请选择预约时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="安装要求">
            <el-input type="textarea" v-model="assignForm.requirements" :rows="3" placeholder="请输入安装要求"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAssign">提交派发</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 确认交付弹窗 -->
    <el-dialog
      v-model="deliveryDialogVisible"
      title="确认交付"
      width="600px"
    >
      <div class="delivery-form">
        <el-form :model="deliveryForm" label-width="100px">
          <el-form-item label="订单号">
            <el-input v-model="deliveryForm.orderId" disabled></el-input>
          </el-form-item>
          <el-form-item label="交付时间">
            <el-date-picker v-model="deliveryForm.deliveryTime" type="datetime" placeholder="请选择交付时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="交付凭证">
            <el-upload
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="deliveryForm.attachments"
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
          <el-form-item label="客户签收">
            <el-checkbox v-model="deliveryForm.signed">客户已签收</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deliveryDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDelivery">确认交付</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 筛选表单
const filterForm = ref({
  orderId: '',
  customer: '',
  status: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

// 交付管理列表
const deliveryList = ref([
  { orderId: 'ORD20260401001', customer: '张女士', amount: '¥12,800', deliveryStatus: '待安装', shippingTime: '2026-04-12 10:00', installationTime: '' },
  { orderId: 'ORD20260401002', customer: '李先生', amount: '¥18,600', deliveryStatus: '已发货', shippingTime: '2026-04-10 09:00', installationTime: '' },
  { orderId: 'ORD20260331001', customer: '王女士', amount: '¥8,900', deliveryStatus: '已交付', shippingTime: '2026-03-28 14:00', installationTime: '2026-03-30 10:00' },
  { orderId: 'ORD20260331002', customer: '赵先生', amount: '¥25,000', deliveryStatus: '待发货', shippingTime: '', installationTime: '' },
  { orderId: 'ORD20260330001', customer: '刘女士', amount: '¥15,600', deliveryStatus: '待安装', shippingTime: '2026-04-01 16:00', installationTime: '' }
])

// 物流跟踪弹窗
const logisticsDialogVisible = ref(false)
const selectedOrder = ref({
  orderId: '',
  customer: '',
  logistics: {
    company: '',
    trackingNumber: '',
    shippingTime: '',
    estimatedArrival: '',
    tracks: []
  }
})

// 派发安装弹窗
const assignDialogVisible = ref(false)
const assignForm = ref({
  orderId: '',
  installerId: '',
  scheduledTime: '',
  requirements: ''
})

// 安装师傅列表
const installers = ref([
  { id: '1', name: '王师傅' },
  { id: '2', name: '李师傅' },
  { id: '3', name: '张师傅' }
])

// 确认交付弹窗
const deliveryDialogVisible = ref(false)
const deliveryForm = ref({
  orderId: '',
  deliveryTime: '',
  attachments: [],
  signed: false
})

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pendingDelivery: 'info',
    shipped: 'warning',
    pendingInstallation: 'warning',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

// 查看物流
const viewLogistics = (orderId) => {
  // 模拟获取物流信息
  selectedOrder.value = {
    orderId: orderId,
    customer: '张女士',
    logistics: {
      company: '顺丰速运',
      trackingNumber: 'SF1234567890',
      shippingTime: '2026-04-12 10:00',
      estimatedArrival: '2026-04-14',
      tracks: [
        { status: '【北京】快件已发出', time: '2026-04-12 10:00' },
        { status: '【天津】快件已到达', time: '2026-04-12 18:00' },
        { status: '【北京】快件已到达', time: '2026-04-13 08:00' },
        { status: '【北京】快件已派送', time: '2026-04-14 09:00' }
      ]
    }
  }
  logisticsDialogVisible.value = true
}

// 派发安装
const assignInstaller = (orderId) => {
  assignForm.value.orderId = orderId
  assignDialogVisible.value = true
}

// 提交派发
const submitAssign = () => {
  // 提交安装工单
  console.log('提交安装工单:', assignForm.value)
  assignDialogVisible.value = false
}

// 确认交付
const confirmDelivery = (orderId) => {
  deliveryForm.value.orderId = orderId
  deliveryDialogVisible.value = true
}

// 提交交付
const submitDelivery = () => {
  // 提交交付确认
  console.log('提交交付确认:', deliveryForm.value)
  deliveryDialogVisible.value = false
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
.order-delivery {
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

.logistics-detail {
  padding: 20px 0;
}

.logistics-timeline {
  margin-top: 20px;
}

.logistics-timeline h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.assign-form {
  padding: 20px 0;
}

.delivery-form {
  padding: 20px 0;
}

.upload-demo {
  margin-top: 10px;
}
</style>