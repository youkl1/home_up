<template>
  <div class="guide-cases">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <h1 class="text-lg font-bold text-white">案例库</h1>
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
          placeholder="搜索案例"
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
    
    <!-- 案例列表 -->
    <div class="case-list px-4 pt-4">
      <div class="case-grid" v-if="filteredCases.length > 0">
        <div
          v-for="caseItem in filteredCases"
          :key="caseItem.id"
          class="case-item card"
          @click="viewCaseDetail(caseItem.id)"
        >
          <img :src="caseItem.image" :alt="caseItem.title" class="case-image" />
          <div class="case-content p-3">
            <h3 class="case-title font-semibold text-title">{{ caseItem.title }}</h3>
            <p class="case-description text-secondary mt-1">{{ caseItem.description }}</p>
            <div class="case-tags mt-2">
              <span v-for="tag in caseItem.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-data text-center py-8">
        <p class="text-secondary">暂无案例</p>
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
// 是否显示搜索框
const showSearch = ref(false)

// 分类数据
const categories = ref([
  { id: 0, name: '全部' },
  { id: 1, name: '现代简约' },
  { id: 2, name: '欧式古典' },
  { id: 3, name: '中式风格' },
  { id: 4, name: '北欧风格' }
])

// 案例数据
const cases = ref([
  {
    id: 1,
    title: '现代简约三居室',
    description: '89㎡现代简约风格装修案例',
    style: '现代简约',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20three%20bedroom%20apartment&image_size=landscape_4_3',
    tags: ['现代简约', '三居室', '89㎡']
  },
  {
    id: 2,
    title: '欧式古典别墅',
    description: '200㎡欧式古典风格装修案例',
    style: '欧式古典',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=european%20classical%20villa&image_size=landscape_4_3',
    tags: ['欧式古典', '别墅', '200㎡']
  },
  {
    id: 3,
    title: '中式风格复式',
    description: '150㎡中式风格装修案例',
    style: '中式风格',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20style%20duplex%20apartment&image_size=landscape_4_3',
    tags: ['中式风格', '复式', '150㎡']
  },
  {
    id: 4,
    title: '北欧风格两居室',
    description: '60㎡北欧风格装修案例',
    style: '北欧风格',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nordic%20style%20two%20bedroom%20apartment&image_size=landscape_4_3',
    tags: ['北欧风格', '两居室', '60㎡']
  },
  {
    id: 5,
    title: '现代简约公寓',
    description: '45㎡现代简约风格装修案例',
    style: '现代简约',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20apartment&image_size=landscape_4_3',
    tags: ['现代简约', '公寓', '45㎡']
  },
  {
    id: 6,
    title: '北欧风格别墅',
    description: '180㎡北欧风格装修案例',
    style: '北欧风格',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nordic%20style%20villa&image_size=landscape_4_3',
    tags: ['北欧风格', '别墅', '180㎡']
  }
])

// 过滤后的案例列表
const filteredCases = computed(() => {
  let result = cases.value
  
  // 按分类过滤
  if (activeCategory.value > 0) {
    const categoryName = categories.value[activeCategory.value].name
    result = result.filter(caseItem => caseItem.style === categoryName)
  }
  
  // 按搜索词过滤
  if (searchValue.value) {
    const searchLower = searchValue.value.toLowerCase()
    result = result.filter(caseItem => 
      caseItem.title.toLowerCase().includes(searchLower) ||
      caseItem.description.toLowerCase().includes(searchLower) ||
      caseItem.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }
  
  return result
})

// 搜索
const onSearch = () => {
  // 搜索逻辑已在filteredCases中实现
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

// 查看案例详情
const viewCaseDetail = (caseId) => {
  router.push(`/guide/cases/detail/${caseId}`)
}

// 导航到对应页面
const navigateTo = (path) => {
  const pathMap = {
    '订单': '/guide/payment/records',
    '表单': '/guide/forms/templates'
  }
  router.push(pathMap[path] || '/guide/cases')
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
.guide-cases {
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

.case-list {
  animation: slide-up 0.5s ease-out;
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.case-item {
  transition: all var(--transition-normal);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}

.case-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.case-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
}

.case-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.case-title {
  font-size: var(--font-size-sm);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.case-description {
  font-size: var(--font-size-xs);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.case-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: auto;
  padding-top: var(--spacing-xs);
}

.tag {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  background-color: #F0F2FF;
  border-radius: 10px;
  color: var(--primary-color);
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
  .case-image {
    height: 100px;
  }
  
  .case-title {
    font-size: var(--font-size-xs);
  }
  
  .case-description {
    font-size: 10px;
  }
}
</style>