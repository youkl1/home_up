<template>
  <div class="purchase-products">
    <div class="page-header">
      <h1>采购商城</h1>
      <el-badge :value="cartCount" class="cart-badge">
        <el-button type="primary" @click="goToCart">
          <el-icon><ShoppingCart /></el-icon>
          采购车
        </el-button>
      </el-badge>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="searchKeyword" placeholder="搜索商品名称" prefix-icon="Search"></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="selectedCategory" placeholder="商品分类" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="沙发" value="sofa"></el-option>
              <el-option label="茶几" value="table"></el-option>
              <el-option label="床" value="bed"></el-option>
              <el-option label="衣柜" value="wardrobe"></el-option>
              <el-option label="餐桌" value="dining"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="sortBy" placeholder="排序方式">
              <el-option label="默认排序" value="default"></el-option>
              <el-option label="价格从低到高" value="price-asc"></el-option>
              <el-option label="价格从高到低" value="price-desc"></el-option>
              <el-option label="销量优先" value="sales"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 商品列表 -->
    <div class="products-grid">
      <el-row :gutter="20">
        <el-col :span="6" v-for="product in products" :key="product.id">
          <el-card shadow="hover" class="product-card">
            <div class="product-image">
              <el-image :src="product.image" fit="cover" :alt="product.name" @error="handleImageError">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-category">{{ product.category }}</p>
              <div class="product-price">
                <span class="price">¥{{ product.price }}</span>
                <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
              </div>
              <div class="product-sales">销量: {{ product.sales }}</div>
              <div class="product-actions">
                <el-input-number v-model="product.quantity" :min="1" :max="99" size="small"></el-input-number>
                <el-button type="primary" size="small" @click="addToCart(product)">加入采购车</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getImageUrl, handleImageError } from '../../../../utils/imageUtils'

const router = useRouter()
const searchKeyword = ref('')
const selectedCategory = ref('')
const sortBy = ref('default')
const cartCount = ref(3)

const products = ref([
  { id: 'PROD001', name: '现代简约沙发', category: '沙发', price: 2999, originalPrice: 3999, sales: 156, quantity: 1, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20minimalist%20sofa%20living%20room%20furniture&image_size=square_hd' },
  { id: 'PROD002', name: '实木茶几', category: '茶几', price: 899, sales: 89, quantity: 1, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=solid%20wood%20coffee%20table%20modern%20living%20room&image_size=square_hd' },
  { id: 'PROD003', name: '北欧风格双人床', category: '床', price: 1899, originalPrice: 2299, sales: 234, quantity: 1, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nordic%20style%20double%20bed%20modern%20bedroom&image_size=square_hd' },
  { id: 'PROD004', name: '四门衣柜', category: '衣柜', price: 1599, sales: 67, quantity: 1, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=four%20door%20wardrobe%20modern%20bedroom%20storage&image_size=square_hd' },
  { id: 'PROD005', name: '实木餐桌', category: '餐桌', price: 1299, originalPrice: 1599, sales: 123, quantity: 1, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=solid%20wood%20dining%20table%20modern%20dining%20room&image_size=square_hd' },
  { id: 'PROD006', name: '布艺沙发', category: '沙发', price: 1999, sales: 198, quantity: 1, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fabric%20sofa%20comfortable%20living%20room&image_size=square_hd' },
  { id: 'PROD007', name: '玻璃茶几', category: '茶几', price: 599, sales: 45, quantity: 1, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=glass%20coffee%20table%20modern%20minimalist&image_size=square_hd' },
  { id: 'PROD008', name: '儿童床', category: '床', price: 999, sales: 78, quantity: 1, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=children%20bed%20colorful%20kids%20bedroom&image_size=square_hd' }
])

const total = ref(24)
const pageSize = ref(8)
const currentPage = ref(1)

const search = () => {
  ElMessage.success('搜索功能开发中')
}

const reset = () => {
  searchKeyword.value = ''
  selectedCategory.value = ''
  sortBy.value = 'default'
}

const addToCart = (product) => {
  // 模拟添加到采购车的逻辑
  console.log('添加到采购车:', product)
  
  // 显示成功消息
  ElMessage.success({
    message: `已将 ${product.name} x${product.quantity} 加入采购车`,
    duration: 2000,
    showClose: true
  })
  
  // 更新采购车数量
  cartCount.value += product.quantity
  
  // 模拟存储到本地存储
  const cartItems = JSON.parse(localStorage.getItem('purchaseCart') || '[]')
  const existingItemIndex = cartItems.findIndex(item => item.id === product.id)
  
  if (existingItemIndex > -1) {
    // 如果商品已存在，更新数量
    cartItems[existingItemIndex].quantity += product.quantity
  } else {
    // 如果商品不存在，添加新商品
    cartItems.push({ ...product })
  }
  
  localStorage.setItem('purchaseCart', JSON.stringify(cartItems))
}

const goToCart = () => {
  router.push('/store/purchase/cart')
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

onMounted(() => {
  console.log('[PurchaseProducts] 组件挂载')
})
</script>

<style scoped>
.purchase-products {
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

.cart-badge {
  margin-right: 10px;
}

.filter-section {
  margin-bottom: 20px;
}

.products-grid {
  margin-bottom: 20px;
}

.product-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  height: 180px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 15px;
}

.product-image .el-image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 40px;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.product-category {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.product-price {
  margin-bottom: 10px;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
  margin-right: 10px;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.product-sales {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
