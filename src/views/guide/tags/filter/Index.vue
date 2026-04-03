<template>
  <div class="tags-filter">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">标签筛选</h1>
      <div class="header-right">
        <van-button size="small" @click="resetFilters">重置</van-button>
      </div>
    </div>
    
    <!-- 标签分类 -->
    <div class="tag-categories">
      <van-tabs v-model="activeCategory" @change="handleCategoryChange">
        <van-tab v-for="category in tagCategories" :key="category.value" :title="category.label" />
      </van-tabs>
    </div>
    
    <!-- 标签选择 -->
    <div class="tags-section">
      <h3 class="section-title">{{ currentCategoryLabel }}标签</h3>
      <div class="tags-grid">
        <div 
          v-for="tag in currentCategoryTags" 
          :key="tag.id"
          class="tag-item"
          :class="{ active: selectedTags.includes(tag.id) }"
          @click="toggleTag(tag.id)"
        >
          <span class="tag-name">{{ tag.name }}</span>
        </div>
      </div>
    </div>
    
    <!-- 已选标签 -->
    <div v-if="selectedTags.length > 0" class="selected-tags">
      <h3 class="section-title">已选标签</h3>
      <div class="tags-list">
        <span 
          v-for="tag in selectedTagNames" 
          :key="tag.id"
          class="selected-tag"
        >
          {{ tag.name }}
          <span class="tag-remove" @click="removeTag(tag.id)">×</span>
        </span>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <van-button type="primary" class="primary-btn" @click="applyFilters">应用筛选</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 标签分类
const tagCategories = [
  { label: '意向等级', value: 'intent' },
  { label: '户型', value: 'house-type' },
  { label: '预算', value: 'budget' },
  { label: '风格', value: 'style' },
  { label: '跟进阶段', value: 'follow-stage' }
]

// 当前激活的分类
const activeCategory = ref('intent')

// 所有标签数据
const allTags = ref([
  // 意向等级
  { id: 1, name: '高意向', category: 'intent' },
  { id: 2, name: '中意向', category: 'intent' },
  { id: 3, name: '低意向', category: 'intent' },
  // 户型
  { id: 4, name: '一居室', category: 'house-type' },
  { id: 5, name: '二居室', category: 'house-type' },
  { id: 6, name: '三居室', category: 'house-type' },
  { id: 7, name: '四居室', category: 'house-type' },
  // 预算
  { id: 8, name: '50万以下', category: 'budget' },
  { id: 9, name: '50-100万', category: 'budget' },
  { id: 10, name: '100-200万', category: 'budget' },
  { id: 11, name: '200万以上', category: 'budget' },
  // 风格
  { id: 12, name: '现代风格', category: 'style' },
  { id: 13, name: '欧式风格', category: 'style' },
  { id: 14, name: '中式风格', category: 'style' },
  { id: 15, name: '简约风格', category: 'style' },
  // 跟进阶段
  { id: 16, name: '初次接触', category: 'follow-stage' },
  { id: 17, name: '正在跟进', category: 'follow-stage' },
  { id: 18, name: '已成交', category: 'follow-stage' },
  { id: 19, name: '已流失', category: 'follow-stage' }
])

// 已选择的标签
const selectedTags = ref([1, 6, 10])

// 当前分类的标签
const currentCategoryTags = computed(() => {
  return allTags.value.filter(tag => tag.category === activeCategory.value)
})

// 当前分类标签
const currentCategoryLabel = computed(() => {
  const category = tagCategories.find(c => c.value === activeCategory.value)
  return category ? category.label : ''
})

// 已选标签名称
const selectedTagNames = computed(() => {
  return allTags.value.filter(tag => selectedTags.value.includes(tag.id))
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理分类切换
const handleCategoryChange = (value) => {
  activeCategory.value = value
}

// 切换标签
const toggleTag = (tagId) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagId)
  }
}

// 移除标签
const removeTag = (tagId) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
}

// 重置筛选
const resetFilters = () => {
  selectedTags.value = []
}

// 应用筛选
const applyFilters = () => {
  // 这里可以实现应用筛选功能
  console.log('应用筛选', selectedTags.value)
  router.back()
}
</script>

<style scoped>
.tags-filter {
  width: 375px;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
  padding-bottom: 60px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: white;
  padding: 0 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #333;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-right {
  width: 60px;
}

.tag-categories {
  background-color: white;
  margin-bottom: 10px;
}

.tags-section {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.selected-tags {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background-color: #f0f0ff;
  color: #667eea;
  border-radius: 16px;
  font-size: 12px;
}

.tag-remove {
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  background-color: white;
  padding: 10px 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.primary-btn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
}
</style>