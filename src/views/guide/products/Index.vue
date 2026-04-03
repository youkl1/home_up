<template>
  <div class="guide-products">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <h1 class="text-lg font-bold text-white">产品库</h1>
      <div class="nav-icons">
        <div class="nav-icon order" @click="navigateTo('订单')"></div>
        <div class="nav-icon form" @click="navigateTo('表单')"></div>
        <div class="nav-icon search" @click="showSearch = !showSearch"></div>
      </div>
    </div>
    
    <!-- 搜索框 -->
    <div class="search-bar" v-show="showSearch">
      <div class="search-input">
        <div class="search-icon"></div>
        <input 
          type="text" 
          v-model="searchValue" 
          placeholder="搜索产品"
          class="search-input-field"
          @keyup.enter="onSearch"
        />
        <button class="search-cancel" @click="onCancel">取消</button>
      </div>
    </div>
    
    <!-- 分类导航 -->
    <div class="category-nav sticky-top">
      <div class="category-tabs">
        <div 
          v-for="(category, index) in categories" 
          :key="category.id" 
          class="category-tab"
          :class="{ active: activeCategory === index }"
          @click="onCategoryChange(index)"
        >
          {{ category.name }}
          <div class="category-tab-active" v-if="activeCategory === index"></div>
        </div>
      </div>
    </div>
    
    <!-- 产品列表 -->
    <div class="product-list">
      <div class="products">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-item card mb-4 mx-4"
          @click="viewProductDetail(product.id)"
        >
          <div class="product-content flex">
            <img :src="product.image" :alt="product.name" class="product-image" />
            <div class="product-info ml-4 flex-1">
              <h3 class="product-name font-semibold text-title">{{ product.name }}</h3>
              <p class="product-description text-secondary mt-1">{{ product.description }}</p>
              <div class="product-price flex-between mt-2">
                <span class="price font-bold text-danger">{{ product.price }}</span>
                <button class="add-button" @click.stop="addToPlan(product)">
                  加入方案
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="filteredProducts.length === 0" class="no-data">暂无产品</div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-if="finished" class="finished">没有更多了</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索值
const searchValue = ref('')
// 当前分类
const activeCategory = ref(0)
// 加载状态
const loading = ref(false)
const finished = ref(false)
// 是否显示搜索框
const showSearch = ref(false)

// 分类数据
const categories = ref([
  { id: 0, name: '全部' },
  { id: 1, name: '橱柜' },
  { id: 2, name: '衣柜' },
  { id: 3, name: '卫浴' },
  { id: 4, name: '五金' }
])

// 产品数据
const products = ref([
  {
    id: 1,
    name: '现代简约橱柜',
    description: '环保材质，现代简约风格',
    price: '¥12,800',
    category: '橱柜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20kitchen%20cabinet&image_size=square'
  },
  {
    id: 2,
    name: '欧式衣柜',
    description: '实木材质，欧式古典风格',
    price: '¥18,600',
    category: '衣柜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=european%20style%20wardrobe&image_size=square'
  },
  {
    id: 3,
    name: '智能卫浴柜',
    description: '智能感应，防潮防水',
    price: '¥8,900',
    category: '卫浴',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20bathroom%20cabinet&image_size=square'
  },
  {
    id: 4,
    name: '不锈钢五金件',
    description: '304不锈钢，耐用 corrosion-resistant',
    price: '¥1,200',
    category: '五金',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stainless%20steel%20hardware%20parts&image_size=square'
  },
  {
    id: 5,
    name: '现代简约餐桌',
    description: '环保材质，现代简约风格',
    price: '¥5,800',
    category: '橱柜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20dining%20table&image_size=square'
  },
  {
    id: 6,
    name: '欧式沙发',
    description: '真皮材质，欧式古典风格',
    price: '¥12,600',
    category: '衣柜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=european%20style%20sofa&image_size=square'
  }
])

// 过滤后的产品列表
const filteredProducts = computed(() => {
  let result = products.value
  
  // 按分类过滤
  if (activeCategory.value > 0) {
    const categoryName = categories.value[activeCategory.value].name
    result = result.filter(product => product.category === categoryName)
  }
  
  // 按搜索词过滤
  if (searchValue.value) {
    const searchLower = searchValue.value.toLowerCase()
    result = result.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    )
  }
  
  return result
})

// 搜索
const onSearch = () => {
  // 搜索逻辑已在filteredProducts中实现
  showSearch.value = false
}

// 取消搜索
const onCancel = () => {
  searchValue.value = ''
  showSearch.value = false
}

// 分类切换
const onCategoryChange = (index) => {
  activeCategory.value = index
}

// 查看产品详情
const viewProductDetail = (productId) => {
  router.push(`/guide/products/detail/${productId}`)
}

// 加入方案
const addToPlan = (product) => {
  // 模拟加入方案功能
  const planItems = JSON.parse(localStorage.getItem('planItems') || '[]')
  const existingItem = planItems.find(item => item.id === product.id)
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1
  } else {
    planItems.push({ ...product, quantity: 1 })
  }
  
  localStorage.setItem('planItems', JSON.stringify(planItems))
  alert(`已将 ${product.name} 加入方案`)
}

// 导航到对应页面
const navigateTo = (path) => {
  const pathMap = {
    '订单': '/guide/payment/records',
    '表单': '/guide/forms/templates'
  }
  router.push(pathMap[path] || '/guide/products')
}

// 加载更多
const onLoad = () => {
  // 模拟加载
  setTimeout(() => {
    // 模拟加载更多数据
    const newProducts = [
      {
        id: 7,
        name: '北欧风格床',
        description: '实木材质，北欧简约风格',
        price: '¥9,800',
        category: '衣柜',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nordic%20style%20bed&image_size=square'
      },
      {
        id: 8,
        name: '现代简约书桌',
        description: '环保材质，现代简约风格',
        price: '¥3,600',
        category: '橱柜',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20desk&image_size=square'
      }
    ]
    products.value.push(...newProducts)
    loading.value = false
    finished.value = true
  }, 1000)
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
.guide-products {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
  overflow-x: hidden;
}

.top-nav {
  width: 375px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
  margin: 0 auto;
}

.nav-icons {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* 导航图标 */
.nav-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.nav-icon.search {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>');
}

.nav-icon.order {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>');
}

.nav-icon.form {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>');
}

.search-bar {
  width: 375px;
  background-color: var(--white);
  padding: var(--spacing-xs) var(--spacing-sm);
  animation: slide-down 0.3s ease-out;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 50px;
  z-index: 9;
  margin: 0 auto;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #F5F7FA;
  border-radius: var(--border-radius-md);
  height: 36px;
  padding: 0 var(--spacing-sm);
}

.search-icon {
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#969799"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 8px;
}

.search-input-field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  outline: none;
}

.search-input-field::placeholder {
  color: var(--text-secondary);
}

.search-cancel {
  margin-left: var(--spacing-sm);
  background: none;
  border: none;
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  cursor: pointer;
  padding: 0;
}

.category-nav {
  width: 375px;
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
  z-index: 8;
  margin-top: 1px;
  margin: 0 auto;
}

.category-tabs {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  height: 44px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  flex: 1;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.category-tab.active {
  color: var(--primary-color);
  font-weight: 500;
}

.category-tab-active {
  position: absolute;
  bottom: 0;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 1.5px;
  transition: all var(--transition-fast);
}

.add-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  padding: 0 var(--spacing-sm);
  height: 28px;
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.add-button:hover {
  background-color: var(--primary-color-dark);
}

.loading,
.finished {
  text-align: center;
  padding: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.product-list {
  padding-top: var(--spacing-sm);
  animation: slide-up 0.5s ease-out;
}

.products {
  --van-list-padding: 0;
}

.product-item {
  transition: all var(--transition-normal);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.product-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.product-content {
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
}

.product-image {
  width: 88px;
  height: 88px;
  border-radius: var(--border-radius-md);
  object-fit: cover;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: var(--font-size-base);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-description {
  font-size: var(--font-size-sm);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  font-size: var(--font-size-lg);
}

.add-button {
  --van-button-font-size: var(--font-size-xs);
  --van-button-padding: 0 var(--spacing-sm);
  --van-button-height: 28px;
}

/* 动画 */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .product-image {
    width: 72px;
    height: 72px;
  }
  
  .product-name {
    font-size: var(--font-size-sm);
  }
  
  .price {
    font-size: var(--font-size-base);
  }
}
</style>