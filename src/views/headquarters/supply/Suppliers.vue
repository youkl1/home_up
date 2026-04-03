<template>
  <div class="suppliers-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold text-title">供应商协同管理</h1>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section mb-6">
      <el-card shadow="hover" class="card transition-all">
        <div class="filter-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-select v-model="filterForm.type" placeholder="供应商类型" size="small" class="w-full">
                <el-option label="全部类型" value=""></el-option>
                <el-option label="原材料供应商" value="material"></el-option>
                <el-option label="生产工厂" value="factory"></el-option>
                <el-option label="物流服务商" value="logistics"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterForm.status" placeholder="合作状态" size="small" class="w-full">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="合作中" value="active"></el-option>
                <el-option label="暂停合作" value="suspended"></el-option>
                <el-option label="终止合作" value="terminated"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="filterForm.keyword" placeholder="搜索供应商名称" size="small" class="w-full">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <div class="filter-actions flex justify-end">
                <el-button size="small" class="mr-2" @click="resetFilter">重置</el-button>
                <el-button type="primary" size="small" @click="searchSuppliers">查询</el-button>
                <el-button type="success" size="small" class="ml-2" @click="addSupplier">新增供应商</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    
    <!-- 供应商列表 -->
    <div class="suppliers-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <template #header>
          <div class="card-header flex-between items-center">
            <span class="font-semibold text-title">供应商列表</span>
            <span class="text-secondary">共 {{ total }} 家供应商</span>
          </div>
        </template>
        <el-table :data="suppliersList" style="width: 100%" class="suppliers-table">
          <el-table-column prop="id" label="供应商编号" width="150"></el-table-column>
          <el-table-column prop="name" label="供应商名称"></el-table-column>
          <el-table-column prop="type" label="类型" width="130">
            <template #default="scope">
              <el-tag>{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="contact" label="对接人" width="120"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="140"></el-table-column>
          <el-table-column prop="cooperationTime" label="合作时长" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="rating" label="评分" width="100">
            <template #default="scope">
              <div class="flex items-center">
                <el-icon class="text-warning mr-1"><StarFilled /></el-icon>
                <span class="font-semibold">{{ scope.row.rating }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="editSupplier(scope.row)">编辑</el-button>
              <el-button size="small" :type="scope.row.status === '合作中' ? 'danger' : 'success'" @click="toggleStatus(scope.row)">
                {{ scope.row.status === '合作中' ? '暂停' : '启用' }}
              </el-button>
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
  
  <!-- 查看详情弹窗 -->
  <el-dialog
    v-model="detailDialogVisible"
    title="供应商详情"
    width="600px"
  >
    <div class="supplier-detail">
      <div class="detail-item">
        <span class="label">供应商编号：</span>
        <span class="value">{{ currentSupplier.id }}</span>
      </div>
      <div class="detail-item">
        <span class="label">供应商名称：</span>
        <span class="value">{{ currentSupplier.name }}</span>
      </div>
      <div class="detail-item">
        <span class="label">类型：</span>
        <el-tag>{{ currentSupplier.type }}</el-tag>
      </div>
      <div class="detail-item">
        <span class="label">对接人：</span>
        <span class="value">{{ currentSupplier.contact }}</span>
      </div>
      <div class="detail-item">
        <span class="label">联系电话：</span>
        <span class="value">{{ currentSupplier.phone }}</span>
      </div>
      <div class="detail-item">
        <span class="label">合作时长：</span>
        <span class="value">{{ currentSupplier.cooperationTime }}</span>
      </div>
      <div class="detail-item">
        <span class="label">状态：</span>
        <el-tag :type="getStatusType(currentSupplier.status)">{{ currentSupplier.status }}</el-tag>
      </div>
      <div class="detail-item">
        <span class="label">评分：</span>
        <div class="flex items-center">
          <el-icon class="text-warning mr-1"><StarFilled /></el-icon>
          <span class="font-semibold">{{ currentSupplier.rating }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
  
  <!-- 新增/编辑供应商弹窗 -->
  <el-dialog
    v-model="formDialogVisible"
    :title="isEditMode ? '编辑供应商' : '新增供应商'"
    width="500px"
  >
    <el-form :model="supplierForm" label-width="100px">
      <el-form-item label="供应商名称" required>
        <el-input v-model="supplierForm.name" placeholder="请输入供应商名称" />
      </el-form-item>
      <el-form-item label="类型" required>
        <el-select v-model="supplierForm.type" placeholder="请选择供应商类型" class="w-full">
          <el-option label="原材料供应商" value="原材料供应商"></el-option>
          <el-option label="生产工厂" value="生产工厂"></el-option>
          <el-option label="物流服务商" value="物流服务商"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对接人" required>
        <el-input v-model="supplierForm.contact" placeholder="请输入对接人" />
      </el-form-item>
      <el-form-item label="联系电话" required>
        <el-input v-model="supplierForm.phone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="合作状态">
        <el-select v-model="supplierForm.status" placeholder="请选择合作状态" class="w-full">
          <el-option label="合作中" value="合作中"></el-option>
          <el-option label="暂停合作" value="暂停合作"></el-option>
          <el-option label="终止合作" value="终止合作"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSupplier">保存</el-button>
      </span>
    </template>
  </el-dialog>
  
  <!-- 切换状态弹窗 -->
  <el-dialog
    v-model="statusDialogVisible"
    title="切换合作状态"
    width="400px"
  >
    <div class="status-content">
      <p>确定要{{ currentSupplier.status === '合作中' ? '暂停' : '启用' }}与{{ currentSupplier.name }}的合作吗？</p>
      <p class="text-secondary mt-2">{{ currentSupplier.status === '合作中' ? '暂停后将无法继续下单' : '启用后可以正常下单' }}</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button :type="currentSupplier.status === '合作中' ? 'danger' : 'success'" @click="confirmStatusChange">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, StarFilled } from '@element-plus/icons-vue'

const filterForm = ref({
  type: '',
  status: '',
  keyword: ''
})

const suppliersList = ref([
  {
    id: 'SUP001',
    name: '北京优质板材有限公司',
    type: '原材料供应商',
    contact: '张经理',
    phone: '138****1234',
    cooperationTime: '3年',
    status: '合作中',
    rating: '4.8'
  },
  {
    id: 'SUP002',
    name: '上海精密五金制造厂',
    type: '原材料供应商',
    contact: '李主管',
    phone: '139****5678',
    cooperationTime: '2年',
    status: '合作中',
    rating: '4.6'
  },
  {
    id: 'SUP003',
    name: '广州现代家居生产厂',
    type: '生产工厂',
    contact: '王厂长',
    phone: '137****9012',
    cooperationTime: '4年',
    status: '合作中',
    rating: '4.9'
  },
  {
    id: 'SUP004',
    name: '成都西南物流中心',
    type: '物流服务商',
    contact: '赵经理',
    phone: '136****3456',
    cooperationTime: '1年',
    status: '暂停合作',
    rating: '4.2'
  },
  {
    id: 'SUP005',
    name: '深圳创新材料科技',
    type: '原材料供应商',
    contact: '刘总监',
    phone: '135****7890',
    cooperationTime: '2年',
    status: '合作中',
    rating: '4.7'
  }
])

const total = ref(50)

const getStatusType = (status) => {
  const map = { '合作中': 'success', '暂停合作': 'warning', '终止合作': 'danger' }
  return map[status] || ''
}

const resetFilter = () => {
  filterForm.value = { type: '', status: '', keyword: '' }
}

// 弹窗相关
const detailDialogVisible = ref(false)
const formDialogVisible = ref(false)
const statusDialogVisible = ref(false)
const currentSupplier = ref({})
const supplierForm = ref({
  name: '',
  type: '',
  contact: '',
  phone: '',
  status: '合作中'
})
const isEditMode = ref(false)

const searchSuppliers = () => {
  console.log('搜索供应商:', filterForm.value)
}

const addSupplier = () => {
  isEditMode.value = false
  supplierForm.value = {
    name: '',
    type: '',
    contact: '',
    phone: '',
    status: '合作中'
  }
  formDialogVisible.value = true
}

const viewDetail = (row) => {
  currentSupplier.value = { ...row }
  detailDialogVisible.value = true
}

const editSupplier = (row) => {
  isEditMode.value = true
  currentSupplier.value = { ...row }
  supplierForm.value = {
    name: row.name,
    type: row.type,
    contact: row.contact,
    phone: row.phone,
    status: row.status
  }
  formDialogVisible.value = true
}

const toggleStatus = (row) => {
  currentSupplier.value = { ...row }
  statusDialogVisible.value = true
}

const saveSupplier = () => {
  if (!supplierForm.value.name || !supplierForm.value.type || !supplierForm.value.contact || !supplierForm.value.phone) {
    return
  }
  console.log('保存供应商:', supplierForm.value)
  // 这里可以调用接口保存供应商
  formDialogVisible.value = false
}

const confirmStatusChange = () => {
  console.log('切换状态:', currentSupplier.value)
  // 这里可以调用接口切换供应商状态
  statusDialogVisible.value = false
}

const handleCurrentChange = (current) => {
  console.log('当前页码:', current)
}

onMounted(() => setTimeout(() => {}, 500))
</script>

<style scoped>
.suppliers-page { padding: var(--spacing-md); background-color: var(--bg-color); min-height: 100vh; }
.page-header { margin-bottom: var(--spacing-md); }
.filter-section { margin-bottom: var(--spacing-md); }
.filter-form { padding: var(--spacing-sm); }
.suppliers-list { margin-bottom: var(--spacing-md); }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.suppliers-table { --el-table-header-bg-color: var(--bg-light); --el-table-header-color: var(--text-secondary); --el-table-row-hover-bg-color: var(--bg-light); }
.pagination { margin-top: var(--spacing-md); display: flex; justify-content: center; }
.text-warning { color: var(--warning-color); }
@media screen and (max-width: 1200px) { .filter-form .el-col { --el-col-span: 12; } }
/* 弹窗样式 */
.supplier-detail {
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

.status-content {
  padding: var(--spacing-sm);
}

.status-content p {
  margin-bottom: var(--spacing-xs);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

@media screen and (max-width: 768px) { 
  .suppliers-page { padding: var(--spacing-sm); } 
  .filter-form .el-col { --el-col-span: 24; } 
  .filter-actions { flex-direction: column; align-items: flex-start; gap: var(--spacing-sm); }
  .card-header { flex-direction: column; align-items: flex-start; gap: var(--spacing-sm); }
  .detail-item { flex-direction: column; align-items: flex-start; }
  .detail-item .label { width: 100%; margin-bottom: var(--spacing-xs); }
}

</style>