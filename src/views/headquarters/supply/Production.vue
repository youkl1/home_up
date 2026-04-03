<template>
  <div class="production-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">工厂生产进度管理</h1>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="生产状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="待生产" value="pending"></el-option>
                <el-option label="生产中" value="producing"></el-option>
                <el-option label="待质检" value="qc_pending"></el-option>
                <el-option label="质检中" value="qc_processing"></el-option>
                <el-option label="待发货" value="ship_pending"></el-option>
                <el-option label="已发货" value="shipped"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.store" placeholder="所属门店" size="small" class="w-full">
                <el-option label="全部门店" value=""></el-option>
                <el-option label="北京旗舰店" value="beijing1"></el-option>
                <el-option label="上海中心店" value="shanghai1"></el-option>
                <el-option label="广州天河店" value="guangzhou1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="filterForm.orderNo" placeholder="订单编号" size="small" class="w-full">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                class="w-full"
              />
            </el-col>
          </el-row>
          <div class="filter-actions mt-4 flex justify-end">
            <el-button size="small" class="mr-2" @click="resetFilter">重置</el-button>
            <el-button type="primary" size="small" @click="searchProduction">查询</el-button>
            <el-button type="success" size="small" class="ml-2" @click="syncProgress">同步进度</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 生产订单列表 -->
    <div class="production-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">生产订单列表</span>
            <span class="text-secondary">共 {{ total }} 个订单</span>
          </div>
        </template>
        <el-table :data="productionList" style="width: 100%" class="production-table">
          <el-table-column prop="id" label="订单编号" width="180"></el-table-column>
          <el-table-column prop="productName" label="产品名称"></el-table-column>
          <el-table-column prop="storeName" label="所属门店" width="150"></el-table-column>
          <el-table-column prop="customerName" label="客户姓名" width="100"></el-table-column>
          <el-table-column prop="status" label="生产状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="progress" label="进度" width="200">
            <template #default="scope">
              <el-progress :percentage="scope.row.progress" :status="scope.row.progress === 100 ? 'success' : ''"></el-progress>
            </template>
          </el-table-column>
          <el-table-column prop="currentNode" label="当前节点" width="120"></el-table-column>
          <el-table-column prop="estimatedDelivery" label="预计交付" width="150"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewOrderDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="syncToStore(scope.row)">同步门店</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination mt-4 flex justify-center">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="10"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
  
  <!-- 查看订单详情弹窗 -->
  <el-dialog
    v-model="detailDialogVisible"
    title="订单详情"
    width="600px"
  >
    <div class="order-detail">
      <div class="detail-item">
        <span class="label">订单编号：</span>
        <span class="value">{{ currentOrder.id }}</span>
      </div>
      <div class="detail-item">
        <span class="label">产品名称：</span>
        <span class="value">{{ currentOrder.productName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">所属门店：</span>
        <span class="value">{{ currentOrder.storeName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">客户姓名：</span>
        <span class="value">{{ currentOrder.customerName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">生产状态：</span>
        <el-tag :type="getStatusType(currentOrder.status)">{{ currentOrder.status }}</el-tag>
      </div>
      <div class="detail-item">
        <span class="label">当前进度：</span>
        <el-progress :percentage="currentOrder.progress" :status="currentOrder.progress === 100 ? 'success' : ''" class="w-full"></el-progress>
      </div>
      <div class="detail-item">
        <span class="label">当前节点：</span>
        <span class="value">{{ currentOrder.currentNode }}</span>
      </div>
      <div class="detail-item">
        <span class="label">预计交付：</span>
        <span class="value">{{ currentOrder.estimatedDelivery }}</span>
      </div>
      <div class="detail-item">
        <span class="label">创建时间：</span>
        <span class="value">{{ currentOrder.createTime }}</span>
      </div>
    </div>
  </el-dialog>
  
  <!-- 同步门店弹窗 -->
  <el-dialog
    v-model="syncDialogVisible"
    title="同步到门店"
    width="400px"
  >
    <div class="sync-content">
      <p>确定要同步订单进度到门店吗？</p>
      <p class="text-secondary">同步后门店将收到最新的生产进度信息</p>
      <div class="mt-4">
        <el-checkbox v-model="syncOptions.includeDetails">包含详细进度信息</el-checkbox>
        <el-checkbox v-model="syncOptions.sendNotification">发送通知给门店</el-checkbox>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="syncDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSync">确认同步</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 筛选表单
const filterForm = ref({
  status: '',
  store: '',
  orderNo: '',
  dateRange: []
})

// 生产订单列表
const productionList = ref([
  {
    id: 'PD202604001',
    productName: '现代简约橱柜-白色',
    storeName: '北京旗舰店',
    customerName: '张先生',
    status: '生产中',
    progress: 65,
    currentNode: '板材加工',
    estimatedDelivery: '2026-04-15',
    createTime: '2026-04-01 09:00'
  },
  {
    id: 'PD202604002',
    productName: '欧式古典橱柜-红木',
    storeName: '上海中心店',
    customerName: '李女士',
    status: '待质检',
    progress: 90,
    currentNode: '成品组装完成',
    estimatedDelivery: '2026-04-10',
    createTime: '2026-04-01 10:30'
  },
  {
    id: 'PD202604003',
    productName: '推拉门衣柜-镜面',
    storeName: '广州天河店',
    customerName: '王先生',
    status: '已发货',
    progress: 100,
    currentNode: '物流配送中',
    estimatedDelivery: '2026-04-08',
    createTime: '2026-04-01 11:15'
  },
  {
    id: 'PD202604004',
    productName: '全屋定制套餐',
    storeName: '深圳南山店',
    customerName: '赵先生',
    status: '待生产',
    progress: 0,
    currentNode: '等待排产',
    estimatedDelivery: '2026-04-20',
    createTime: '2026-04-01 14:20'
  },
  {
    id: 'PD202604005',
    productName: '平开门衣柜-实木',
    storeName: '成都武侯店',
    customerName: '刘女士',
    status: '质检中',
    progress: 95,
    currentNode: '质量检验',
    estimatedDelivery: '2026-04-12',
    createTime: '2026-04-01 15:45'
  }
])

// 分页数据
const total = ref(100)

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case '待生产': return 'info'
    case '生产中': return 'primary'
    case '待质检': return 'warning'
    case '质检中': return 'warning'
    case '待发货': return 'success'
    case '已发货': return 'success'
    default: return ''
  }
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    status: '',
    store: '',
    orderNo: '',
    dateRange: []
  }
}

// 搜索生产订单
const searchProduction = () => {
  console.log('搜索生产订单:', filterForm.value)
  // 这里可以调用接口搜索生产订单
}

// 同步进度
const syncProgress = () => {
  console.log('同步生产进度')
  // 这里可以调用接口同步生产进度
}

// 弹窗相关
const detailDialogVisible = ref(false)
const syncDialogVisible = ref(false)
const currentOrder = ref({})
const syncOptions = ref({
  includeDetails: true,
  sendNotification: true
})

// 查看订单详情
const viewOrderDetail = (row) => {
  currentOrder.value = { ...row }
  detailDialogVisible.value = true
}

// 同步到门店
const syncToStore = (row) => {
  currentOrder.value = { ...row }
  syncOptions.value = {
    includeDetails: true,
    sendNotification: true
  }
  syncDialogVisible.value = true
}

// 确认同步
const confirmSync = () => {
  console.log('同步到门店:', currentOrder.value, syncOptions.value)
  // 这里可以调用接口同步生产进度到门店
  syncDialogVisible.value = false
}

// 分页处理
const handleCurrentChange = (current) => {
  console.log('当前页码:', current)
  // 这里可以调用接口获取对应页码的数据
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
.production-page {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.filter-section {
  margin-bottom: var(--spacing-md);
}

.filter-form {
  padding: var(--spacing-sm);
}

.production-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.production-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

/* 弹窗样式 */
.order-detail {
  padding: var(--spacing-sm);
}

.detail-item {
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: flex-start;
}

.detail-item .label {
  width: 100px;
  font-weight: bold;
  color: var(--text-secondary);
}

.detail-item .value {
  flex: 1;
  color: var(--text-primary);
}

.sync-content {
  padding: var(--spacing-sm);
}

.sync-content p {
  margin-bottom: var(--spacing-xs);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .filter-form .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .production-page {
    padding: var(--spacing-sm);
  }

  .filter-form .el-col {
    --el-col-span: 24;
  }

  .filter-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-item .label {
    width: 100%;
    margin-bottom: var(--spacing-xs);
  }
}
</style>