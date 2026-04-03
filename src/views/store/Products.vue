<template>
  <div class="store-products">
    <div class="page-header flex-between items-center mb-6">
      <h1 class="text-xl font-bold text-title">产品管理</h1>
      <el-button type="primary" class="add-button">添加产品</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter mb-6">
      <el-card shadow="hover" class="card transition-all">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索产品名称" prefix-icon="el-icon-search" class="search-input"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="categoryId" placeholder="选择分类" class="filter-select">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search" class="search-button">搜索</el-button>
            <el-button @click="reset" class="reset-button">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 产品列表 -->
    <div class="product-list mb-6">
      <el-card shadow="hover" class="card transition-all">
        <el-table :data="products" style="width: 100%" class="product-table">
          <el-table-column prop="id" label="产品ID" width="80"></el-table-column>
          <el-table-column prop="name" label="产品名称"></el-table-column>
          <el-table-column prop="category" label="分类" width="120"></el-table-column>
          <el-table-column prop="price" label="价格" width="100">
            <template #default="scope">
              <span class="price text-danger font-semibold">{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="80"></el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === '上架' ? 'success' : 'info'" class="status-tag">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editProduct(scope.row.id)" class="edit-button">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteProduct(scope.row.id)" class="delete-button">删除</el-button>
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
            class="pagination-component"
          ></el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

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
  { id: 1, name: '现代简约橱柜', category: '橱柜', price: '¥12,800', stock: 50, status: '上架' },
  { id: 2, name: '欧式衣柜', category: '衣柜', price: '¥18,600', stock: 30, status: '上架' },
  { id: 3, name: '智能卫浴柜', category: '卫浴', price: '¥8,900', stock: 40, status: '上架' },
  { id: 4, name: '不锈钢五金件', category: '五金', price: '¥1,200', stock: 100, status: '上架' }
])

// 分页
const total = ref(4)
const pageSize = ref(10)
const currentPage = ref(1)

// 搜索
const search = () => {
  ElMessage.success('搜索功能开发中')
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  categoryId.value = ''
}

// 编辑产品
const editProduct = (productId) => {
  ElMessage.success(`编辑产品：${productId}`)
}

// 删除产品
const deleteProduct = (productId) => {
  ElMessage.success(`删除产品：${productId}`)
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
.store-products {
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-md);
}

.search-filter {
  margin-bottom: var(--spacing-md);
}

.product-list {
  margin-bottom: var(--spacing-md);
}

.card {
  transition: all var(--transition-normal);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.product-table {
  --el-table-header-bg-color: var(--bg-light);
  --el-table-header-color: var(--text-secondary);
  --el-table-row-hover-bg-color: var(--bg-light);
}

.price {
  font-weight: 600;
}

.status-tag {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
}

.pagination {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: flex-end;
}

.pagination-component {
  --el-pagination-item-bg-color: var(--white);
  --el-pagination-item-hover-bg-color: var(--bg-light);
  --el-pagination-item-active-bg-color: var(--primary-color);
  --el-pagination-item-active-color: var(--white);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .store-products {
    padding: var(--spacing-sm);
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>