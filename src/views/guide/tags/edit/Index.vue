<template>
  <div class="tag-edit">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">编辑客户标签</h1>
      <div class="header-right">
        <van-button size="small" @click="saveTags">保存</van-button>
      </div>
    </div>
    
    <!-- 客户信息 -->
    <div class="customer-info">
      <h3 class="section-title">客户信息</h3>
      <div class="info-item">
        <span class="info-label">客户姓名</span>
        <span class="info-value">{{ customer.name }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">联系电话</span>
        <span class="info-value">{{ customer.phone }}</span>
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
          :class="{ active: selectedTags.includes(tag.id), disabled: tag.isSystem && !selectedTags.includes(tag.id) }"
          @click="toggleTag(tag.id, tag.isSystem)"
        >
          <span class="tag-name">{{ tag.name }}</span>
          <span v-if="tag.isSystem" class="system-tag">系统</span>
        </div>
      </div>
    </div>
    
    <!-- 智能标签 -->
    <div class="intelligent-tags">
      <h3 class="section-title">智能标签</h3>
      <div class="tags-grid">
        <div 
          v-for="tag in intelligentTags" 
          :key="tag.id"
          class="tag-item intelligent"
        >
          <span class="tag-name">{{ tag.name }}</span>
          <span class="intelligent-tag">智能</span>
        </div>
      </div>
      <p class="intelligent-desc">智能标签由系统根据客户行为自动生成，不可手动编辑</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 客户数据
const customer = ref({
  id: route.params.id || 1,
  name: '张三',
  phone: '13800138000'
})

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
  { id: 1, name: '高意向', category: 'intent', isSystem: true },
  { id: 2, name: '中意向', category: 'intent', isSystem: true },
  { id: 3, name: '低意向', category: 'intent', isSystem: true },
  // 户型
  { id: 4, name: '一居室', category: 'house-type', isSystem: false },
  { id: 5, name: '二居室', category: 'house-type', isSystem: false },
  { id: 6, name: '三居室', category: 'house-type', isSystem: false },
  { id: 7, name: '四居室', category: 'house-type', isSystem: false },
  // 预算
  { id: 8, name: '50万以下', category: 'budget', isSystem: false },
  { id: 9, name: '50-100万', category: 'budget', isSystem: false },
  { id: 10, name: '100-200万', category: 'budget', isSystem: false },
  { id: 11, name: '200万以上', category: 'budget', isSystem: false },
  // 风格
  { id: 12, name: '现代风格', category: 'style', isSystem: false },
  { id: 13, name: '欧式风格', category: 'style', isSystem: false },
  { id: 14, name: '中式风格', category: 'style', isSystem: false },
  { id: 15, name: '简约风格', category: 'style', isSystem: false },
  // 跟进阶段
  { id: 16, name: '初次接触', category: 'follow-stage', isSystem: true },
  { id: 17, name: '正在跟进', category: 'follow-stage', isSystem: true },
  { id: 18, name: '已成交', category: 'follow-stage', isSystem: true },
  { id: 19, name: '已流失', category: 'follow-stage', isSystem: true }
])

// 智能标签
const intelligentTags = ref([
  { id: 101, name: '多次浏览', category: 'intelligent' },
  { id: 102, name: '高潜力客户', category: 'intelligent' },
  { id: 103, name: '近期活跃', category: 'intelligent' }
])

// 已选择的标签
const selectedTags = ref([1, 6, 10, 12, 17])

// 当前分类的标签
const currentCategoryTags = computed(() => {
  return allTags.value.filter(tag => tag.category === activeCategory.value)
})

// 当前分类标签
const currentCategoryLabel = computed(() => {
  const category = tagCategories.find(c => c.value === activeCategory.value)
  return category ? category.label : ''
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
const toggleTag = (tagId, isSystem) => {
  if (isSystem && !selectedTags.value.includes(tagId)) {
    // 系统标签只能取消，不能添加
    return
  }
  
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagId)
  }
}

// 保存标签
const saveTags = () => {
  // 这里可以实现保存标签功能
  console.log('保存标签', selectedTags.value)
  router.back()
}
</script>

<style scoped>
.tag-edit {
  width: 375px;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
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

.customer-info {
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

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
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

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 6px;
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

.tag-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.system-tag {
  font-size: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 1px 4px;
  border-radius: 8px;
}

.intelligent-tags {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.tag-item.intelligent {
  background-color: #f0f0ff;
  color: #667eea;
  border-color: #e0e0ff;
}

.intelligent-tag {
  font-size: 10px;
  background-color: #667eea;
  color: white;
  padding: 1px 4px;
  border-radius: 8px;
}

.intelligent-desc {
  font-size: 12px;
  color: #999;
  margin: 10px 0 0 0;
  text-align: center;
}
</style>