<template>
  <div class="headquarters-purchase-products">
    <div class="page-header">
      <h1>商品管理</h1>
      <el-button type="primary" @click="addProduct">添加商品</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover" class="card transition-all">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索商品名称或编号" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="categoryId" placeholder="选择分类" class="w-full">
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
    
    <!-- 商品列表 -->
    <div class="product-list">
      <el-card shadow="hover" class="card transition-all">
        <el-table :data="filteredProducts" style="width: 100%" class="products-table" @row-click="viewProductDetail">
          <el-table-column prop="id" label="商品ID" width="80"></el-table-column>
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="code" label="商品编号" width="120"></el-table-column>
          <el-table-column prop="category" label="分类" width="100"></el-table-column>
          <el-table-column prop="price" label="价格" width="100"></el-table-column>
          <el-table-column prop="stock" label="库存" width="80"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click.stop="viewProductDetail(scope.row)">查看</el-button>
              <el-button size="small" type="primary" @click.stop="editProduct(scope.row)">编辑</el-button>
              <el-button size="small" :type="scope.row.status === '上架' ? 'warning' : 'success'" @click.stop="toggleStatus(scope.row)">
                {{ scope.row.status === '上架' ? '下架' : '上架' }}
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
    
    <!-- 商品详情弹窗 -->
    <el-dialog
      v-model="productDetailVisible"
      :title="`商品详情 - ${currentProduct.name || ''}`"
      width="800px"
    >
      <div class="product-detail">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form :model="currentProduct" label-width="100px">
              <el-form-item label="商品ID">
                <span>{{ currentProduct.id }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ currentProduct.name }}</span>
              </el-form-item>
              <el-form-item label="商品编号">
                <span>{{ currentProduct.code }}</span>
              </el-form-item>
              <el-form-item label="商品分类">
                <span>{{ currentProduct.category }}</span>
              </el-form-item>
              <el-form-item label="商品价格">
                <span class="font-semibold">{{ currentProduct.price }}</span>
              </el-form-item>
              <el-form-item label="库存数量">
                <span>{{ currentProduct.stock }}</span>
              </el-form-item>
              <el-form-item label="商品状态">
                <el-tag :type="getStatusType(currentProduct.status)">{{ currentProduct.status }}</el-tag>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ currentProduct.createTime || '暂无' }}</span>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="mb-4">
              <template #header>
                <div class="card-header">
                  <span>商品描述</span>
                </div>
              </template>
              <div class="product-description">
                {{ currentProduct.description || '暂无描述' }}
              </div>
            </el-card>
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>商品图片</span>
                </div>
              </template>
              <div class="product-images">
                <div v-if="currentProduct.image" class="image-container">
                  <img :src="currentProduct.image" alt="商品图片" class="product-image">
                </div>
                <div v-else class="no-image">
                  暂无商品图片
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="productDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新增/编辑商品弹窗 -->
    <el-dialog
      v-model="productDialogVisible"
      :title="isEdit ? '编辑商品' : '新增商品'"
      width="600px"
    >
      <el-form :model="productForm" label-width="120px" :rules="productRules" ref="productFormRef">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="code">
          <el-input v-model="productForm.code" placeholder="请输入商品编号"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="productForm.categoryId" placeholder="选择商品分类" class="w-full">
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="productForm.price" type="number" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input v-model="productForm.stock" type="number" placeholder="请输入库存数量"></el-input>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-switch v-model="productForm.status" active-value="上架" inactive-value="下架"></el-switch>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="productForm.description" type="textarea" :rows="4" placeholder="请输入商品描述"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleImageChange"
            :limit="1"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="productDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProduct">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 删除确认弹窗 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="删除确认"
      width="400px"
    >
      <p>确定要删除商品 <span class="font-semibold">{{ currentProduct.name }}</span> 吗？</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteProduct">确定删除</el-button>
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
const categoryId = ref('')

// 分类数据
const categories = ref([
  { id: 1, name: '原材料' },
  { id: 2, name: '半成品' },
  { id: 3, name: '成品' },
  { id: 4, name: '配件' }
])

// 商品数据
const products = ref([
  {
    id: 1, 
    name: '优质板材', 
    code: 'M001', 
    category: '原材料', 
    categoryId: 1,
    price: '¥200', 
    stock: 500, 
    status: '上架',
    description: '优质环保板材，适用于各种家具制作',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=high%20quality%20wood%20板材%20material&image_size=square',
    createTime: '2026-01-01 10:00'
  },
  {
    id: 2, 
    name: '五金配件', 
    code: 'A001', 
    category: '配件', 
    categoryId: 4,
    price: '¥50', 
    stock: 1000, 
    status: '上架',
    description: '高品质五金配件，耐用可靠',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hardware%20parts%20五金配件&image_size=square',
    createTime: '2026-01-02 14:30'
  },
  {
    id: 3, 
    name: '柜门', 
    code: 'S001', 
    category: '半成品', 
    categoryId: 2,
    price: '¥300', 
    stock: 300, 
    status: '上架',
    description: '精美的柜门，多种款式可选',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cabinet%20door%20柜门%20furniture&image_size=square',
    createTime: '2026-01-03 09:15'
  },
  {
    id: 4, 
    name: '抽屉', 
    code: 'S002', 
    category: '半成品', 
    categoryId: 2,
    price: '¥150', 
    stock: 400, 
    status: '上架',
    description: '顺滑的抽屉，质量保证',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=drawer%20抽屉%20furniture&image_size=square',
    createTime: '2026-01-04 11:20'
  },
  {
    id: 5, 
    name: '成品衣柜', 
    code: 'F001', 
    category: '成品', 
    categoryId: 3,
    price: '¥2000', 
    stock: 100, 
    status: '上架',
    description: '高品质成品衣柜，美观实用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wardrobe%20成品衣柜%20furniture&image_size=square',
    createTime: '2026-01-05 16:45'
  }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const productDetailVisible = ref(false)
const productDialogVisible = ref(false)
const deleteDialogVisible = ref(false)

// 是否编辑
const isEdit = ref(false)

// 当前商品
const currentProduct = ref({})

// 商品表单
const productForm = ref({
  name: '',
  code: '',
  categoryId: '',
  price: '',
  stock: '',
  status: '上架',
  description: '',
  image: ''
})

// 商品表单验证规则
const productRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '商品名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入商品编号', trigger: 'blur' },
    { min: 3, max: 20, message: '商品编号长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '商品价格必须大于等于 0', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存数量必须大于等于 0', trigger: 'blur' }
  ]
}

// 表单引用
const productFormRef = ref(null)

// 文件列表
const fileList = ref([])

// 过滤后的商品列表
const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // 搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(product => 
      product.name.toLowerCase().includes(keyword) || 
      product.code.toLowerCase().includes(keyword)
    )
  }
  
  // 分类过滤
  if (categoryId.value) {
    result = result.filter(product => product.categoryId === parseInt(categoryId.value))
  }
  
  return result
})

// 获取状态类型
const getStatusType = (status) => {
  return status === '上架' ? 'success' : 'info'
}

// 搜索
const search = () => {
  // 模拟搜索
  ElMessage.success('搜索成功')
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  categoryId.value = ''
}

// 查看商品详情
const viewProductDetail = (row) => {
  Object.assign(currentProduct.value, row)
  productDetailVisible.value = true
}

// 添加商品
const addProduct = () => {
  isEdit.value = false
  resetProductForm()
  fileList.value = []
  productDialogVisible.value = true
}

// 编辑商品
const editProduct = (row) => {
  isEdit.value = true
  Object.assign(currentProduct, row)
  Object.assign(productForm.value, {
    name: row.name,
    code: row.code,
    categoryId: row.categoryId,
    price: row.price.replace('¥', ''),
    stock: row.stock,
    status: row.status,
    description: row.description,
    image: row.image
  })
  fileList.value = row.image ? [{ url: row.image }] : []
  productDialogVisible.value = true
}

// 切换商品状态
const toggleStatus = (row) => {
  const newStatus = row.status === '上架' ? '下架' : '上架'
  const confirmMessage = row.status === '上架' ? `确定要下架商品「${row.name}」吗？` : `确定要上架商品「${row.name}」吗？`
  
  ElMessageBox.confirm(
    confirmMessage,
    '状态切换',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: row.status === '上架' ? 'warning' : 'success'
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
      ElMessage.success(`商品已${newStatus}`)
      loading.close()
    }, 1000)
  }).catch(() => {
    // 取消操作
  })
}

// 确认删除
const confirmDelete = (row) => {
  Object.assign(currentProduct, row)
  deleteDialogVisible.value = true
}

// 删除商品
const deleteProduct = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '删除中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  // 模拟API调用
  setTimeout(() => {
    const index = products.value.findIndex(item => item.id === currentProduct.value.id)
    if (index !== -1) {
      products.value.splice(index, 1)
      total.value--
    }
    ElMessage.success('商品删除成功')
    loading.close()
    deleteDialogVisible.value = false
  }, 1000)
}

// 保存商品
const saveProduct = async () => {
  if (!productFormRef.value) return
  
  try {
    await productFormRef.value.validate()
    
    const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    // 模拟API调用
    setTimeout(() => {
      if (isEdit.value) {
        // 编辑现有商品
        const index = products.value.findIndex(item => item.id === currentProduct.value.id)
        if (index !== -1) {
          products.value[index] = {
            ...products.value[index],
            name: productForm.value.name,
            code: productForm.value.code,
            category: categories.value.find(c => c.id === productForm.value.categoryId).name,
            categoryId: productForm.value.categoryId,
            price: `¥${productForm.value.price}`,
            stock: productForm.value.stock,
            status: productForm.value.status,
            description: productForm.value.description,
            image: productForm.value.image
          }
        }
        ElMessage.success('商品编辑成功')
      } else {
        // 新增商品
        const newProduct = {
          id: products.value.length + 1,
          name: productForm.value.name,
          code: productForm.value.code,
          category: categories.value.find(c => c.id === productForm.value.categoryId).name,
          categoryId: productForm.value.categoryId,
          price: `¥${productForm.value.price}`,
          stock: productForm.value.stock,
          status: productForm.value.status,
          description: productForm.value.description,
          image: productForm.value.image,
          createTime: new Date().toLocaleString('zh-CN')
        }
        products.value.unshift(newProduct)
        total.value++
        ElMessage.success('商品添加成功')
      }
      
      loading.close()
      productDialogVisible.value = false
      resetProductForm()
      fileList.value = []
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 处理图片上传
const handleImageChange = (file) => {
  // 模拟图片上传，实际项目中应该调用真实的上传接口
  productForm.value.image = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=product%20image%20商品图片&image_size=square'
  fileList.value = [{ url: productForm.value.image }]
}

// 重置商品表单
const resetProductForm = () => {
  if (productFormRef.value) {
    productFormRef.value.resetFields()
  }
  Object.assign(productForm.value, {
    name: '',
    code: '',
    categoryId: '',
    price: '',
    stock: '',
    status: '上架',
    description: '',
    image: ''
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
.headquarters-purchase-products {
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

.product-list {
  margin-bottom: var(--spacing-md);
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: flex-end;
}

.products-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

/* 商品详情弹窗样式 */
.product-detail {
  padding: var(--spacing-sm);
}

.product-description {
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.product-images {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.image-container {
  max-width: 100%;
  max-height: 200px;
  overflow: hidden;
}

.product-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.no-image {
  text-align: center;
  color: var(--text-secondary);
  padding: var(--spacing-md);
  font-size: var(--font-size-sm);
  background: var(--bg-light);
  border-radius: var(--border-radius-sm);
  width: 100%;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .search-filter .el-col {
    --el-col-span: 12;
  }
}

@media screen and (max-width: 768px) {
  .headquarters-purchase-products {
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
  
  .product-detail .el-col {
    --el-col-span: 24;
  }
  
  .product-images {
    margin-top: var(--spacing-md);
  }
}
</style>