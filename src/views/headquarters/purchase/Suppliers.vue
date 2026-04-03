<template>
  <div class="headquarters-purchase-suppliers">
    <div class="page-header">
      <h1>供应商管理</h1>
      <el-button type="primary" @click="addSupplier">添加供应商</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover" class="card transition-all">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索供应商名称或联系人" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="supplierStatus" placeholder="选择状态" class="w-full">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="enabled"></el-option>
              <el-option label="禁用" value="disabled"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 供应商列表 -->
    <div class="supplier-list">
      <el-card shadow="hover" class="card transition-all">
        <el-table :data="filteredSuppliers" style="width: 100%" class="suppliers-table" @row-click="viewSupplierDetail">
          <el-table-column prop="id" label="供应商ID" width="80"></el-table-column>
          <el-table-column prop="name" label="供应商名称"></el-table-column>
          <el-table-column prop="contact" label="联系人" width="120"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status === 'enabled' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click.stop="viewSupplierDetail(scope.row)">查看</el-button>
              <el-button size="small" type="primary" @click.stop="editSupplier(scope.row)">编辑</el-button>
              <el-button size="small" :type="scope.row.status === 'enabled' ? 'danger' : 'success'" @click.stop="toggleStatus(scope.row)">
                {{ scope.row.status === 'enabled' ? '禁用' : '启用' }}
              </el-button>
              <el-button size="small" type="danger" @click.stop="confirmDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    
    <!-- 供应商详情弹窗 -->
    <el-dialog
      v-model="supplierDetailVisible"
      :title="`供应商详情 - ${currentSupplier.name || ''}`"
      width="800px"
    >
      <div class="supplier-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form :model="currentSupplier" label-width="100px">
              <el-form-item label="供应商ID">
                <span>{{ currentSupplier.id }}</span>
              </el-form-item>
              <el-form-item label="供应商名称">
                <span>{{ currentSupplier.name }}</span>
              </el-form-item>
              <el-form-item label="联系人">
                <span>{{ currentSupplier.contact }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ currentSupplier.phone }}</span>
              </el-form-item>
              <el-form-item label="地址">
                <span>{{ currentSupplier.address }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <el-tag :type="getStatusType(currentSupplier.status)">{{ currentSupplier.status === 'enabled' ? '启用' : '禁用' }}</el-tag>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ currentSupplier.createTime || '暂无' }}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="mb-4">
              <template #header>
                <div class="card-header">
                  <span>供应商简介</span>
                </div>
              </template>
              <div class="supplier-description">
                {{ currentSupplier.description || '暂无简介' }}
              </div>
            </el-card>
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>主要产品</span>
                </div>
              </template>
              <div class="supplier-products">
                <div v-if="currentSupplier.products && currentSupplier.products.length > 0">
                  <el-tag v-for="(product, index) in currentSupplier.products" :key="index" class="mb-2 mr-2">
                    {{ product }}
                  </el-tag>
                </div>
                <div v-else class="no-products">
                  暂无产品信息
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="supplierDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新增/编辑供应商弹窗 -->
    <el-dialog
      v-model="supplierDialogVisible"
      :title="isEdit ? '编辑供应商' : '新增供应商'"
      width="600px"
    >
      <el-form :model="supplierForm" label-width="120px" :rules="supplierRules" ref="supplierFormRef">
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="supplierForm.name" placeholder="请输入供应商名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="supplierForm.contact" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="supplierForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="supplierForm.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="supplierForm.status" active-value="enabled" inactive-value="disabled"></el-switch>
        </el-form-item>
        <el-form-item label="供应商简介" prop="description">
          <el-input v-model="supplierForm.description" type="textarea" :rows="3" placeholder="请输入供应商简介"></el-input>
        </el-form-item>
        <el-form-item label="主要产品" prop="products">
          <el-input v-model="supplierForm.products" placeholder="请输入主要产品，多个产品用逗号分隔"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="supplierDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveSupplier">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 删除确认弹窗 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="删除确认"
      width="400px"
    >
      <p>确定要删除供应商 <span class="font-semibold">{{ currentSupplier.name }}</span> 吗？</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteSupplier">确定删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const supplierStatus = ref('')

// 供应商数据
const suppliers = ref([
  {
    id: 1, 
    name: '广东橱柜厂', 
    contact: '张三', 
    phone: '138****1234', 
    address: '广东省佛山市顺德区', 
    status: 'enabled',
    description: '专业生产橱柜的厂家，拥有20年生产经验',
    products: ['橱柜门板', '橱柜柜体', '整体橱柜'],
    createTime: '2026-01-01 10:00'
  },
  {
    id: 2, 
    name: '浙江五金厂', 
    contact: '李四', 
    phone: '139****5678', 
    address: '浙江省温州市乐清市', 
    status: 'enabled',
    description: '专业生产五金配件的厂家，产品质量可靠',
    products: ['铰链', '拉手', '螺丝', '螺母'],
    createTime: '2026-01-02 14:30'
  },
  {
    id: 3, 
    name: '上海板材厂', 
    contact: '王五', 
    phone: '137****9012', 
    address: '上海市浦东新区', 
    status: 'enabled',
    description: '专业生产各种板材的厂家，环保达标',
    products: ['密度板', '刨花板', '实木板'],
    createTime: '2026-01-03 09:15'
  },
  {
    id: 4, 
    name: '广东玻璃厂', 
    contact: '赵六', 
    phone: '136****3456', 
    address: '广东省广州市白云区', 
    status: 'enabled',
    description: '专业生产玻璃制品的厂家，支持定制',
    products: ['钢化玻璃', '中空玻璃', '艺术玻璃'],
    createTime: '2026-01-04 11:20'
  },
  {
    id: 5, 
    name: '江苏配件厂', 
    contact: '孙七', 
    phone: '135****7890', 
    address: '江苏省苏州市昆山市', 
    status: 'disabled',
    description: '生产各种配件的厂家',
    products: ['螺丝', '螺母', '垫片'],
    createTime: '2026-01-05 16:45'
  }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const supplierDetailVisible = ref(false)
const supplierDialogVisible = ref(false)
const deleteDialogVisible = ref(false)

// 是否编辑
const isEdit = ref(false)

// 当前供应商
const currentSupplier = ref({})

// 供应商表单
const supplierForm = ref({
  name: '',
  contact: '',
  phone: '',
  address: '',
  status: 'enabled',
  description: '',
  products: ''
})

// 供应商表单验证规则
const supplierRules = {
  name: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' },
    { min: 2, max: 50, message: '供应商名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系人', trigger: 'blur' },
    { min: 2, max: 20, message: '联系人长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' },
    { min: 5, max: 100, message: '地址长度在 5 到 100 个字符', trigger: 'blur' }
  ]
}

// 表单引用
const supplierFormRef = ref(null)

// 过滤后的供应商列表
const filteredSuppliers = computed(() => {
  let result = [...suppliers.value]
  
  // 搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(supplier => 
      supplier.name.toLowerCase().includes(keyword) || 
      supplier.contact.toLowerCase().includes(keyword)
    )
  }
  
  // 状态过滤
  if (supplierStatus.value) {
    result = result.filter(supplier => supplier.status === supplierStatus.value)
  }
  
  return result
})

// 获取状态类型
const getStatusType = (status) => {
  return status === 'enabled' ? 'success' : 'danger'
}

// 搜索
const search = () => {
  // 模拟搜索
  ElMessage.success('搜索成功')
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  supplierStatus.value = ''
}

// 查看供应商详情
const viewSupplierDetail = (row) => {
  Object.assign(currentSupplier.value, row)
  supplierDetailVisible.value = true
}

// 添加供应商
const addSupplier = () => {
  isEdit.value = false
  resetSupplierForm()
  supplierDialogVisible.value = true
}

// 编辑供应商
const editSupplier = (row) => {
  isEdit.value = true
  Object.assign(currentSupplier.value, row)
  Object.assign(supplierForm.value, {
    name: row.name,
    contact: row.contact,
    phone: row.phone,
    address: row.address,
    status: row.status,
    description: row.description,
    products: row.products ? row.products.join(', ') : ''
  })
  supplierDialogVisible.value = true
}

// 切换供应商状态
const toggleStatus = (row) => {
  const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
  const confirmMessage = row.status === 'enabled' ? `确定要禁用供应商「${row.name}」吗？` : `确定要启用供应商「${row.name}」吗？`
  
  ElMessageBox.confirm(
    confirmMessage,
    '状态切换',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: row.status === 'enabled' ? 'warning' : 'success'
    }
  ).then(() => {
    const loading = ElLoading.service({
      lock: true,
      text: '处理中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      row.status = newStatus
      ElMessage.success(`供应商已${newStatus === 'enabled' ? '启用' : '禁用'}`)
      loading.close()
    }, 1000)
  }).catch(() => {
    // 取消操作
  })
}

// 确认删除
const confirmDelete = (row) => {
  Object.assign(currentSupplier.value, row)
  deleteDialogVisible.value = true
}

// 删除供应商
const deleteSupplier = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '删除中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  // 模拟API调用
  setTimeout(() => {
    const index = suppliers.value.findIndex(item => item.id === currentSupplier.value.id)
    if (index !== -1) {
      suppliers.value.splice(index, 1)
      total.value--
    }
    ElMessage.success('供应商删除成功')
    loading.close()
    deleteDialogVisible.value = false
  }, 1000)
}

// 保存供应商
const saveSupplier = async () => {
  if (!supplierFormRef.value) return
  
  try {
    await supplierFormRef.value.validate()
    
    const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      if (isEdit.value) {
        // 编辑现有供应商
        const index = suppliers.value.findIndex(item => item.id === currentSupplier.value.id)
        if (index !== -1) {
          suppliers.value[index] = {
            ...suppliers.value[index],
            name: supplierForm.value.name,
            contact: supplierForm.value.contact,
            phone: supplierForm.value.phone,
            address: supplierForm.value.address,
            status: supplierForm.value.status,
            description: supplierForm.value.description,
            products: supplierForm.value.products ? supplierForm.value.products.split(',').map(p => p.trim()) : []
          }
        }
        ElMessage.success('供应商编辑成功')
      } else {
        // 新增供应商
        const newSupplier = {
          id: suppliers.value.length + 1,
          name: supplierForm.value.name,
          contact: supplierForm.value.contact,
          phone: supplierForm.value.phone,
          address: supplierForm.value.address,
          status: supplierForm.value.status,
          description: supplierForm.value.description,
          products: supplierForm.value.products ? supplierForm.value.products.split(',').map(p => p.trim()) : [],
          createTime: new Date().toLocaleString('zh-CN')
        }
        suppliers.value.unshift(newSupplier)
        total.value++
        ElMessage.success('供应商添加成功')
      }
      
      loading.close()
      supplierDialogVisible.value = false
      resetSupplierForm()
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 重置供应商表单
const resetSupplierForm = () => {
  if (supplierFormRef.value) {
    supplierFormRef.value.resetFields()
  }
  Object.assign(supplierForm.value, {
    name: '',
    contact: '',
    phone: '',
    address: '',
    status: 'enabled',
    description: '',
    products: ''
  })
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
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
.headquarters-purchase-suppliers {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.page-header h1 {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--text-title);
  margin: 0;
}

.search-filter {
  margin-bottom: var(--spacing-md);
}

.supplier-list {
  margin-bottom: var(--spacing-md);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: flex-end;
}

.suppliers-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

/* 供应商详情弹窗样式 */
.supplier-detail {
  padding: var(--spacing-sm);
}

.supplier-description {
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.no-products {
  text-align: center;
  color: var(--text-secondary);
  padding: var(--spacing-md);
  font-size: var(--font-size-sm);
  background: var(--bg-light);
  border-radius: var(--border-radius-sm);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .search-filter .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .headquarters-purchase-suppliers {
    padding: var(--spacing-sm);
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .search-filter .el-col {
    --el-col-span: 24;
  }
  
  .supplier-detail .el-col {
    --el-col-span: 24;
  }
}
</style>