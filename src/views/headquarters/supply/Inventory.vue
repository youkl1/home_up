<template>
  <div class="inventory-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">全国库存管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.category" placeholder="产品类目" size="small" class="w-full">
                <el-option label="全部类目" value=""></el-option>
                <el-option label="橱柜" value="cabinet"></el-option>
                <el-option label="衣柜" value="wardrobe"></el-option>
                <el-option label="全屋定制" value="wholehouse"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.warehouse" placeholder="仓库" size="small" class="w-full">
                <el-option label="全部仓库" value=""></el-option>
                <el-option label="北京总仓" value="beijing"></el-option>
                <el-option label="上海分仓" value="shanghai"></el-option>
                <el-option label="广州分仓" value="guangzhou"></el-option>
                <el-option label="成都分仓" value="chengdu"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="库存状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="正常" value="normal"></el-option>
                <el-option label="预警" value="warning"></el-option>
                <el-option label="缺货" value="outofstock"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="filterForm.keyword" placeholder="搜索产品名称/编号" size="small" class="w-full">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
          </el-row>
          <div class="filter-actions mt-4 flex justify-end">
            <el-button size="small" class="mr-2" @click="resetFilter">重置</el-button>
            <el-button type="primary" size="small" @click="searchInventory">查询</el-button>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 库存列表 -->
    <div class="inventory-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">库存列表</span>
            <div>
              <el-button type="primary" size="small" class="mr-2" @click="setThreshold">设置预警阈值</el-button>
              <el-button type="success" size="small" @click="exportInventory">导出库存</el-button>
            </div>
          </div>
        </template>
        <el-table :data="inventoryList" style="width: 100%" class="inventory-table">
          <el-table-column prop="productCode" label="产品编号" width="150"></el-table-column>
          <el-table-column prop="productName" label="产品名称"></el-table-column>
          <el-table-column prop="category" label="类目" width="120">
            <template #default="scope">
              <el-tag>{{ scope.row.category }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="warehouse" label="仓库" width="120"></el-table-column>
          <el-table-column prop="stock" label="当前库存" width="120">
            <template #default="scope">
              <span :class="getStockClass(scope.row)">{{ scope.row.stock }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="threshold" label="预警阈值" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row)">{{ getStatusText(scope.row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastUpdate" label="最后更新" width="180"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row)">查看明细</el-button>
              <el-button size="small" type="primary" @click="viewRecords(scope.row)">出入库记录</el-button>
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
  
  <!-- 查看明细弹窗 -->
  <el-dialog
    v-model="detailDialogVisible"
    title="库存明细"
    width="600px"
  >
    <div class="inventory-detail">
      <div class="detail-item">
        <span class="label">产品编号：</span>
        <span class="value">{{ currentInventory.productCode }}</span>
      </div>
      <div class="detail-item">
        <span class="label">产品名称：</span>
        <span class="value">{{ currentInventory.productName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">类目：</span>
        <el-tag>{{ currentInventory.category }}</el-tag>
      </div>
      <div class="detail-item">
        <span class="label">仓库：</span>
        <span class="value">{{ currentInventory.warehouse }}</span>
      </div>
      <div class="detail-item">
        <span class="label">当前库存：</span>
        <span :class="getStockClass(currentInventory)">{{ currentInventory.stock }}</span>
      </div>
      <div class="detail-item">
        <span class="label">预警阈值：</span>
        <span class="value">{{ currentInventory.threshold }}</span>
      </div>
      <div class="detail-item">
        <span class="label">状态：</span>
        <el-tag :type="getStatusType(currentInventory)">{{ getStatusText(currentInventory) }}</el-tag>
      </div>
      <div class="detail-item">
        <span class="label">最后更新：</span>
        <span class="value">{{ currentInventory.lastUpdate }}</span>
      </div>
    </div>
  </el-dialog>
  
  <!-- 出入库记录弹窗 -->
  <el-dialog
    v-model="recordsDialogVisible"
    title="出入库记录"
    width="600px"
  >
    <div class="records-content">
      <el-table :data="inventoryRecords" style="width: 100%">
        <el-table-column prop="id" label="记录编号" width="150"></el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === '入库' ? 'success' : 'danger'">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
        <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
        <el-table-column prop="time" label="操作时间" width="180"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
    </div>
  </el-dialog>
  
  <!-- 设置预警阈值弹窗 -->
  <el-dialog
    v-model="thresholdDialogVisible"
    title="设置预警阈值"
    width="400px"
  >
    <el-form :model="thresholdForm" label-width="100px">
      <el-form-item label="预警阈值" required>
        <el-input v-model.number="thresholdForm.threshold" placeholder="请输入预警阈值" type="number" min="0" />
      </el-form-item>
      <el-form-item label="适用范围">
        <el-radio-group v-model="thresholdForm.scope">
          <el-radio label="当前产品">当前产品</el-radio>
          <el-radio label="同类产品">同类产品</el-radio>
          <el-radio label="所有产品">所有产品</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="thresholdDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmThreshold">确认设置</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 筛选表单
const filterForm = ref({
  category: '',
  warehouse: '',
  status: '',
  keyword: ''
})

// 库存列表
const inventoryList = ref([
  {
    productCode: 'SKU001',
    productName: '现代简约橱柜-白色',
    category: '橱柜',
    warehouse: '北京总仓',
    stock: 156,
    threshold: 100,
    lastUpdate: '2026-04-01 09:00'
  },
  {
    productCode: 'SKU002',
    productName: '欧式古典橱柜-红木',
    category: '橱柜',
    warehouse: '上海分仓',
    stock: 45,
    threshold: 80,
    lastUpdate: '2026-04-01 10:30'
  },
  {
    productCode: 'SKU003',
    productName: '推拉门衣柜-镜面',
    category: '衣柜',
    warehouse: '广州分仓',
    stock: 23,
    threshold: 50,
    lastUpdate: '2026-04-01 11:15'
  },
  {
    productCode: 'SKU004',
    productName: '平开门衣柜-实木',
    category: '衣柜',
    warehouse: '成都分仓',
    stock: 189,
    threshold: 100,
    lastUpdate: '2026-04-01 14:20'
  },
  {
    productCode: 'SKU005',
    productName: '全屋定制套餐-标准版',
    category: '全屋定制',
    warehouse: '北京总仓',
    stock: 67,
    threshold: 50,
    lastUpdate: '2026-04-01 15:45'
  }
])

// 分页数据
const total = ref(100)

// 获取库存样式
const getStockClass = (row) => {
  if (row.stock === 0) return 'text-danger font-semibold'
  if (row.stock < row.threshold) return 'text-warning font-semibold'
  return 'text-success font-semibold'
}

// 获取状态类型
const getStatusType = (row) => {
  if (row.stock === 0) return 'danger'
  if (row.stock < row.threshold) return 'warning'
  return 'success'
}

// 获取状态文本
const getStatusText = (row) => {
  if (row.stock === 0) return '缺货'
  if (row.stock < row.threshold) return '预警'
  return '正常'
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    category: '',
    warehouse: '',
    status: '',
    keyword: ''
  }
}

// 搜索库存
const searchInventory = () => {
  console.log('搜索库存:', filterForm.value)
}

// 弹窗相关
const detailDialogVisible = ref(false)
const recordsDialogVisible = ref(false)
const thresholdDialogVisible = ref(false)
const currentInventory = ref({})
const thresholdForm = ref({
  threshold: 0,
  scope: '当前产品'
})

// 出入库记录
const inventoryRecords = ref([
  {
    id: 'RC202604001',
    type: '入库',
    quantity: 100,
    operator: '管理员',
    time: '2026-04-01 09:00',
    remark: '常规补货'
  },
  {
    id: 'RC2026033001',
    type: '出库',
    quantity: 20,
    operator: '张三',
    time: '2026-03-30 14:30',
    remark: '北京旗舰店订单'
  },
  {
    id: 'RC2026032801',
    type: '入库',
    quantity: 50,
    operator: '管理员',
    time: '2026-03-28 10:00',
    remark: '补充库存'
  }
])

// 设置预警阈值
const setThreshold = () => {
  thresholdForm.value = {
    threshold: 50,
    scope: '当前产品'
  }
  thresholdDialogVisible.value = true
}

// 导出库存
const exportInventory = () => {
  console.log('导出库存')
}

// 查看明细
const viewDetail = (row) => {
  currentInventory.value = { ...row }
  detailDialogVisible.value = true
}

// 查看出入库记录
const viewRecords = (row) => {
  currentInventory.value = { ...row }
  recordsDialogVisible.value = true
}

// 确认设置预警阈值
const confirmThreshold = () => {
  if (!thresholdForm.value.threshold) {
    return
  }
  console.log('设置预警阈值:', thresholdForm.value)
  // 这里可以调用接口设置预警阈值
  thresholdDialogVisible.value = false
}

// 分页处理
const handleCurrentChange = (current) => {
  console.log('当前页码:', current)
}

onMounted(() => {
  setTimeout(() => {}, 500)
})
</script>

<style scoped>
.inventory-page {
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

.inventory-list {
  margin-bottom: var(--spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inventory-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

.text-danger {
  color: var(--danger-color);
}

.text-warning {
  color: var(--warning-color);
}

.text-success {
  color: var(--success-color);
}

@media screen and (max-width: 1200px) {
  .filter-form .el-col {
    --el-col-span: 12;
  }
}

/* 弹窗样式 */
.inventory-detail {
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

.records-content {
  padding: var(--spacing-sm);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

@media screen and (max-width: 768px) {
  .inventory-page {
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