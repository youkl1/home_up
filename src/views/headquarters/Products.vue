<template>
  <div class="headquarters-products">
    <div class="page-header">
      <h1>产品管理</h1>
      <el-button type="primary" @click="addProduct">添加产品</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索产品名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="categoryId" placeholder="选择分类">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 产品列表 -->
    <div class="product-list">
      <el-card shadow="hover">
        <el-table :data="products" style="width: 100%">
          <el-table-column prop="id" label="产品ID" width="80"></el-table-column>
          <el-table-column prop="name" label="产品名称"></el-table-column>
          <el-table-column prop="category" label="分类" width="120"></el-table-column>
          <el-table-column prop="price" label="价格" width="100"></el-table-column>
          <el-table-column prop="stock" label="库存" width="80"></el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === '上架' ? 'success' : 'info'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="auditStatus" label="审核状态" width="100">
            <template #default="scope">
              <el-tag :type="getAuditStatusType(scope.row.auditStatus)">
                {{ scope.row.auditStatus || '未审核' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editProduct(scope.row)">编辑</el-button>
              <el-button type="warning" size="small" @click="auditProduct(scope.row)">审核</el-button>
              <el-button type="danger" size="small" @click="deleteProduct(scope.row.id)">删除</el-button>
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
    
    <!-- 添加/编辑产品弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="产品名称">
          <el-input v-model="form.name" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="选择分类">
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" placeholder="请输入价格"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="form.stock" type="number" placeholder="请输入库存"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="上架">上架</el-radio>
            <el-radio label="下架">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 审核产品弹窗 -->
    <el-dialog
      v-model="auditDialogVisible"
      title="产品审核"
      width="500px"
    >
      <el-form :model="auditForm" label-width="80px">
        <el-form-item label="产品名称">
          <el-input v-model="auditForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="auditForm.auditStatus">
            <el-radio label="已通过">通过</el-radio>
            <el-radio label="未通过">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
            v-model="auditForm.auditComment"
            type="textarea"
            :rows="3"
            placeholder="请输入审核意见"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="auditDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAudit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const categoryId = ref('')

// 分类数据
const categories = ref([
  { id: 1, name: '橱柜' },
  { id: 2, name: '衣柜' },
  { id: 3, name: '卫浴' },
  { id: 4, name: '五金' }
])

// 产品数据
const products = ref([
  { id: 1, name: '现代简约橱柜', category: '橱柜', price: '¥12,800', stock: 500, status: '上架', auditStatus: '已通过' },
  { id: 2, name: '欧式衣柜', category: '衣柜', price: '¥18,600', stock: 300, status: '上架', auditStatus: '已通过' },
  { id: 3, name: '智能卫浴柜', category: '卫浴', price: '¥8,900', stock: 400, status: '上架', auditStatus: '审核中' },
  { id: 4, name: '不锈钢五金件', category: '五金', price: '¥1,200', stock: 1000, status: '上架', auditStatus: '未审核' }
])

// 分页
const total = ref(4)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref({
  id: null,
  name: '',
  categoryId: '',
  price: '',
  stock: 0,
  status: '上架'
})

// 审核弹窗相关
const auditDialogVisible = ref(false)
const auditForm = ref({
  id: null,
  name: '',
  auditStatus: '已通过',
  auditComment: ''
})

// 搜索
const search = () => {
  // 模拟搜索逻辑
  const keyword = searchKeyword.value.toLowerCase()
  const category = categoryId.value
  
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索产品...' })
  
  // 模拟API调用延迟
  setTimeout(() => {
    // 过滤数据
    const filteredProducts = products.value.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(keyword)
      const categoryMatch = !category || p.category === categories.value.find(c => c.id == category)?.name
      return nameMatch && categoryMatch
    })
    
    // 更新显示数据
    total.value = filteredProducts.length
    
    if (filteredProducts.length > 0) {
      ElMessage.success(`找到 ${filteredProducts.length} 个产品`)
    } else {
      ElMessage.info('未找到匹配的产品')
    }
    
    // 关闭加载
    loading.close()
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  categoryId.value = ''
  ElMessage.info('搜索条件已重置')
}

// 编辑产品
const editProduct = (product) => {
  // 填充表单数据
  form.value = {
    id: product.id,
    name: product.name,
    categoryId: categories.value.find(c => c.name === product.category)?.id || '',
    price: product.price,
    stock: product.stock,
    status: product.status
  }
  dialogTitle.value = '编辑产品'
  dialogVisible.value = true
}

// 删除产品
const deleteProduct = (productId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该产品吗？删除后将无法恢复。', '删除确认', { 
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除过程
    const loading = ElLoading.service({ text: '正在删除产品...' })
    
    // 模拟API调用延迟
    setTimeout(() => {
      // 模拟删除逻辑
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value.splice(index, 1)
        total.value--
        ElMessage.success('产品删除成功')
      } else {
        ElMessage.error('产品不存在或已被删除')
      }
      loading.close()
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 模拟API调用延迟
  const loading = ElLoading.service({ text: '正在加载数据...' })
  
  setTimeout(() => {
    // 实际项目中这里应该调用API获取对应页的数据
    ElMessage.success(`切换到第 ${page} 页`)
    loading.close()
  }, 300)
}

// 获取审核状态类型
const getAuditStatusType = (status) => {
  switch (status) {
    case '已通过':
      return 'success'
    case '审核中':
      return 'warning'
    case '未通过':
      return 'danger'
    default:
      return 'info'
  }
}

// 审核产品
const auditProduct = (product) => {
  // 填充审核表单数据
  auditForm.value = {
    id: product.id,
    name: product.name,
    auditStatus: product.auditStatus || '已通过',
    auditComment: ''
  }
  auditDialogVisible.value = true
}

// 提交审核
const submitAudit = () => {
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在提交审核...' })
  
  // 模拟API调用延迟
  setTimeout(() => {
    // 模拟审核逻辑
    const index = products.value.findIndex(p => p.id === auditForm.value.id)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        auditStatus: auditForm.value.auditStatus
      }
      ElMessage.success('产品审核成功')
    } else {
      ElMessage.error('产品不存在或已被删除')
    }
    
    auditDialogVisible.value = false
    loading.close()
  }, 500)
}

// 添加产品
const addProduct = () => {
  // 重置表单
  form.value = {
    id: null,
    name: '',
    categoryId: '',
    price: '',
    stock: 0,
    status: '上架'
  }
  dialogTitle.value = '添加产品'
  dialogVisible.value = true
}

// 提交表单
const submitForm = () => {
  // 表单验证
  if (!form.value.name) {
    ElMessage.error('请输入产品名称')
    return
  }
  if (!form.value.categoryId) {
    ElMessage.error('请选择分类')
    return
  }
  if (!form.value.price) {
    ElMessage.error('请输入价格')
    return
  }
  if (form.value.stock < 0) {
    ElMessage.error('库存不能为负数')
    return
  }
  
  // 模拟提交过程
  const loading = ElLoading.service({ text: '正在保存产品...' })
  
  // 模拟API调用延迟
  setTimeout(() => {
    const categoryName = categories.value.find(c => c.id == form.value.categoryId)?.name || ''
    
    if (form.value.id) {
      // 编辑产品
      const index = products.value.findIndex(p => p.id === form.value.id)
      if (index !== -1) {
        products.value[index] = {
          ...products.value[index],
          name: form.value.name,
          category: categoryName,
          price: form.value.price,
          stock: form.value.stock,
          status: form.value.status
        }
        ElMessage.success('产品编辑成功')
      } else {
        ElMessage.error('产品不存在或已被删除')
      }
    } else {
      // 添加产品
      const newProduct = {
        id: products.value.length + 1,
        name: form.value.name,
        category: categoryName,
        price: form.value.price,
        stock: form.value.stock,
        status: form.value.status,
        auditStatus: '未审核'
      }
      products.value.push(newProduct)
      total.value++
      ElMessage.success('产品添加成功')
    }
    
    dialogVisible.value = false
    loading.close()
  }, 500)
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
    console.log('产品数据加载完成')
  }, 500)
})
</script>

<style scoped>
.headquarters-products {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.search-filter {
  margin-bottom: 20px;
}

.product-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>