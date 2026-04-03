<template>
  <div class="orders-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">工单总控中心</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.orderType" placeholder="工单类型" size="small" class="w-full">
                <el-option label="全部类型" value=""></el-option>
                <el-option label="安装工单" value="install"></el-option>
                <el-option label="售后工单" value="aftersales"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="工单状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="待分配" value="pending"></el-option>
                <el-option label="已分配" value="assigned"></el-option>
                <el-option label="进行中" value="processing"></el-option>
                <el-option label="已完成" value="completed"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.region" placeholder="选择区域" size="small" class="w-full">
                <el-option label="全部区域" value=""></el-option>
                <el-option label="华北区" value="north"></el-option>
                <el-option label="华东区" value="east"></el-option>
                <el-option label="华南区" value="south"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.store" placeholder="选择门店" size="small" class="w-full">
                <el-option label="全部门店" value=""></el-option>
                <el-option label="北京旗舰店" value="beijing1"></el-option>
                <el-option label="上海中心店" value="shanghai1"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mt-4">
            <el-col :span="12">
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
            <el-col :span="12">
              <div class="filter-actions flex justify-end">
                <el-button size="small" class="mr-2" @click="resetFilter">重置</el-button>
                <el-button type="primary" size="small" @click="searchOrders">查询</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    
    <!-- 工单列表 -->
    <div class="orders-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">工单列表</span>
            <span class="text-secondary">共 {{ total }} 个工单</span>
          </div>
        </template>
        <el-table :data="ordersList" style="width: 100%" class="orders-table">
          <el-table-column prop="id" label="工单编号" width="180"></el-table-column>
          <el-table-column prop="orderType" label="类型" width="100">
            <template #default="scope">
              <el-tag :type="getOrderType(scope.row.orderType)">
                {{ scope.row.orderType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="customerName" label="客户姓名" width="100"></el-table-column>
          <el-table-column prop="customerPhone" label="客户电话" width="130"></el-table-column>
          <el-table-column prop="address" label="安装地址"></el-table-column>
          <el-table-column prop="storeName" label="所属门店" width="120"></el-table-column>
          <el-table-column prop="workerName" label="分配师傅" width="100">
            <template #default="scope">
              <span v-if="scope.row.workerName">{{ scope.row.workerName }}</span>
              <el-tag v-else size="small" type="info">未分配</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewOrderDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="assignWorker(scope.row)" v-if="scope.row.status === '待分配'">分配师傅</el-button>
              <el-button size="small" type="warning" @click="interveneOrder(scope.row)" v-if="scope.row.status !== '已完成'">干预</el-button>
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
    
    <!-- 分配师傅弹窗 -->
    <el-dialog
      v-model="assignDialogVisible"
      :title="`分配师傅：${assignForm.id}`"
      width="600px"
    >
      <el-form :model="assignForm" label-width="100px">
        <el-form-item label="工单编号">
          <el-input v-model="assignForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="assignForm.customerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="安装地址">
          <el-input v-model="assignForm.address" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择师傅">
          <el-select v-model="assignForm.workerId" placeholder="选择安装师傅" class="w-full">
            <el-option v-for="worker in availableWorkers" :key="worker.id" :label="worker.name" :value="worker.id">
              <div class="flex items-center">
                <span>{{ worker.name }}</span>
                <span class="ml-2 text-secondary">({{ worker.rating }}分)</span>
                <span class="ml-2 text-success">({{ worker.completionRate }}%完成率)</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计完成时间">
          <el-date-picker
            v-model="assignForm.expectedTime"
            type="datetime"
            placeholder="选择预计完成时间"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="分配备注">
          <el-input v-model="assignForm.remark" type="textarea" :rows="3" placeholder="请输入分配备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAssign">确认分配</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 干预工单弹窗 -->
    <el-dialog
      v-model="interveneDialogVisible"
      :title="`干预工单：${interveneForm.id}`"
      width="600px"
    >
      <el-form :model="interveneForm" label-width="100px">
        <el-form-item label="工单编号">
          <el-input v-model="interveneForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-tag :type="getStatusType(interveneForm.status)">{{ interveneForm.status }}</el-tag>
        </el-form-item>
        <el-form-item label="干预类型">
          <el-select v-model="interveneForm.interveneType" placeholder="选择干预类型">
            <el-option label="更换师傅" value="change_worker"></el-option>
            <el-option label="调整时间" value="adjust_time"></el-option>
            <el-option label="问题协调" value="coordinate"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="干预备注">
          <el-input v-model="interveneForm.remark" type="textarea" :rows="3" placeholder="请输入干预备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="interveneDialogVisible = false">取消</el-button>
          <el-button type="warning" @click="submitIntervene">确认干预</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`工单详情：${detailForm.id}`"
      width="800px"
    >
      <div class="detail-header mb-4">
        <div class="flex-between items-center">
          <div>
            <h3 class="font-semibold">{{ detailForm.orderType }}</h3>
            <p class="text-secondary">工单编号：{{ detailForm.id }}</p>
            <p class="text-secondary">客户：{{ detailForm.customerName }} {{ detailForm.customerPhone }}</p>
            <p class="text-secondary">地址：{{ detailForm.address }}</p>
          </div>
          <div class="text-right">
            <p class="text-secondary">状态</p>
            <el-tag :type="getStatusType(detailForm.status)">{{ detailForm.status }}</el-tag>
            <p class="text-secondary mt-2">所属门店</p>
            <p class="font-semibold">{{ detailForm.storeName }}</p>
          </div>
        </div>
      </div>
      <div class="detail-content">
        <el-form label-width="100px">
          <el-form-item label="分配师傅">
            <el-input v-model="detailForm.workerName" disabled></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="detailForm.createTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="预计完成时间">
            <el-input v-model="detailForm.expectedTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="工单备注">
            <el-input v-model="detailForm.remark" type="textarea" :rows="3" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

// 筛选表单
const filterForm = ref({
  orderType: '',
  status: '',
  region: '',
  store: '',
  dateRange: []
})

// 弹窗相关
const assignDialogVisible = ref(false)
const interveneDialogVisible = ref(false)
const detailDialogVisible = ref(false)

// 分配师傅表单
const assignForm = ref({
  id: '',
  customerName: '',
  address: '',
  workerId: '',
  expectedTime: '',
  remark: ''
})

// 干预工单表单
const interveneForm = ref({
  id: '',
  status: '',
  interveneType: '',
  remark: ''
})

// 详情表单
const detailForm = ref({
  id: '',
  orderType: '',
  customerName: '',
  customerPhone: '',
  address: '',
  storeName: '',
  workerName: '',
  status: '',
  createTime: '',
  expectedTime: '',
  remark: ''
})

// 可用师傅列表
const availableWorkers = ref([
  { id: 'WK001', name: '张师傅', rating: '4.8', completionRate: '98' },
  { id: 'WK002', name: '李师傅', rating: '4.6', completionRate: '95' },
  { id: 'WK003', name: '王师傅', rating: '4.9', completionRate: '99' },
  { id: 'WK005', name: '刘师傅', rating: '4.7', completionRate: '96' }
])

// 工单列表
const ordersList = ref([
  {
    id: 'WO202604001',
    orderType: '安装工单',
    customerName: '张先生',
    customerPhone: '138****1234',
    address: '北京市朝阳区XX小区1号楼101室',
    storeName: '北京旗舰店',
    workerName: '张师傅',
    status: '进行中',
    createTime: '2026-04-01 09:00'
  },
  {
    id: 'WO202604002',
    orderType: '售后工单',
    customerName: '李女士',
    customerPhone: '139****5678',
    address: '上海市浦东新区XX花园2号楼202室',
    storeName: '上海中心店',
    workerName: '',
    status: '待分配',
    createTime: '2026-04-01 10:30'
  },
  {
    id: 'WO202604003',
    orderType: '安装工单',
    customerName: '王先生',
    customerPhone: '137****9012',
    address: '广州市天河区XX大厦3号楼303室',
    storeName: '广州天河店',
    workerName: '王师傅',
    status: '已完成',
    createTime: '2026-04-01 11:15'
  },
  {
    id: 'WO202604004',
    orderType: '安装工单',
    customerName: '赵先生',
    customerPhone: '136****3456',
    address: '深圳市南山区XX公寓4号楼404室',
    storeName: '深圳南山店',
    workerName: '赵师傅',
    status: '已分配',
    createTime: '2026-04-01 14:20'
  },
  {
    id: 'WO202604005',
    orderType: '售后工单',
    customerName: '刘女士',
    customerPhone: '135****7890',
    address: '成都市武侯区XX小区5号楼505室',
    storeName: '成都武侯店',
    workerName: '刘师傅',
    status: '进行中',
    createTime: '2026-04-01 15:45'
  }
])

// 分页数据
const total = ref(100)

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case '待分配': return 'info'
    case '已分配': return 'primary'
    case '进行中': return 'warning'
    case '已完成': return 'success'
    default: return ''
  }
}

// 获取工单类型
const getOrderType = (type) => {
  return type === '安装工单' ? 'primary' : 'warning'
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    orderType: '',
    status: '',
    region: '',
    store: '',
    dateRange: []
  }
  ElMessage.info('筛选条件已重置')
}

// 搜索工单
const searchOrders = () => {
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索工单...' })
  
  setTimeout(() => {
    // 过滤数据
    const filteredList = ordersList.value.filter(item => {
      const typeMatch = !filterForm.value.orderType || item.orderType === filterForm.value.orderType
      const statusMatch = !filterForm.value.status || item.status === filterForm.value.status
      return typeMatch && statusMatch
    })
    
    total.value = filteredList.length
    
    if (filteredList.length > 0) {
      ElMessage.success(`找到 ${filteredList.length} 个工单`)
    } else {
      ElMessage.info('未找到匹配的工单')
    }
    loading.close()
  }, 500)
}

// 查看详情
const viewOrderDetail = (row) => {
  // 填充详情表单
  detailForm.value = {
    id: row.id,
    orderType: row.orderType,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    address: row.address,
    storeName: row.storeName,
    workerName: row.workerName || '未分配',
    status: row.status,
    createTime: row.createTime,
    expectedTime: '2026-04-02 10:00',
    remark: '客户要求周末安装'
  }
  detailDialogVisible.value = true
}

// 分配师傅
const assignWorker = (row) => {
  // 填充分配表单
  assignForm.value = {
    id: row.id,
    customerName: row.customerName,
    address: row.address,
    workerId: '',
    expectedTime: '',
    remark: ''
  }
  assignDialogVisible.value = true
}

// 提交分配
const submitAssign = () => {
  // 表单验证
  if (!assignForm.value.workerId) {
    ElMessage.error('请选择安装师傅')
    return
  }
  if (!assignForm.value.expectedTime) {
    ElMessage.error('请选择预计完成时间')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在分配师傅...' })
  
  setTimeout(() => {
    const index = ordersList.value.findIndex(item => item.id === assignForm.value.id)
    if (index !== -1) {
      const worker = availableWorkers.value.find(w => w.id === assignForm.value.workerId)
      ordersList.value[index].workerName = worker.name
      ordersList.value[index].status = '已分配'
      ElMessage.success('师傅分配成功')
    }
    
    assignDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 干预工单
const interveneOrder = (row) => {
  // 填充干预表单
  interveneForm.value = {
    id: row.id,
    status: row.status,
    interveneType: '',
    remark: ''
  }
  interveneDialogVisible.value = true
}

// 提交干预
const submitIntervene = () => {
  // 表单验证
  if (!interveneForm.value.interveneType) {
    ElMessage.error('请选择干预类型')
    return
  }
  if (!interveneForm.value.remark) {
    ElMessage.error('请输入干预备注')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在干预工单...' })
  
  setTimeout(() => {
    ElMessage.success('工单干预成功')
    interveneDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 分页处理
const handleCurrentChange = (current) => {
  // 模拟API调用延迟
  const loading = ElLoading.service({ text: '正在加载数据...' })
  
  setTimeout(() => {
    // 实际项目中这里应该调用API获取对应页的数据
    ElMessage.success(`切换到第 ${current} 页`)
    loading.close()
  }, 300)
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
.orders-page {
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

.orders-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.orders-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .filter-form .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .orders-page {
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
}
</style>