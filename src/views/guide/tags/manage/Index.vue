<template>
  <div class="tags-manage">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">标签管理</h1>
      <div class="header-right">
        <van-button size="small" @click="addTag">新增</van-button>
      </div>
    </div>
    
    <!-- 标签分类 -->
    <div class="tag-categories">
      <van-tabs v-model="activeCategory" @change="handleCategoryChange">
        <van-tab v-for="category in tagCategories" :key="category.value" :title="category.label" />
      </van-tabs>
    </div>
    
    <!-- 标签列表 -->
    <div class="tags-list">
      <div 
        v-for="tag in currentTags" 
        :key="tag.id"
        class="tag-item"
      >
        <div class="tag-info">
          <span class="tag-name">{{ tag.name }}</span>
          <span v-if="tag.isSystem" class="system-tag">系统标签</span>
        </div>
        <div class="tag-actions">
          <van-button 
            size="small" 
            @click="editTag(tag)"
            :disabled="tag.isSystem"
          >
            编辑
          </van-button>
          <van-button 
            size="small" 
            type="danger" 
            @click="deleteTag(tag.id)"
            :disabled="tag.isSystem"
          >
            删除
          </van-button>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="currentTags.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        </svg>
        <p class="empty-text">暂无标签</p>
      </div>
    </div>
    
    <!-- 新增标签弹窗 -->
    <van-popup v-model:show="addTagPopupShow" position="bottom" round>
      <div class="add-tag-popup">
        <h3 class="popup-title">新增标签</h3>
        <van-form @submit="submitAddTag">
          <van-field
            v-model="newTag.name"
            label="标签名称"
            placeholder="请输入标签名称"
            required
          />
          <van-field
            v-model="newTag.category"
            label="标签分类"
            placeholder="请选择标签分类"
            required
          >
            <template #input>
              <van-popup
                v-model:show="categoryPickerShow"
                position="bottom"
              >
                <van-picker
                  v-model="newTagCategoryIndex"
                  :columns="categoryOptions"
                  @confirm="handleNewCategoryConfirm"
                  @cancel="categoryPickerShow = false"
                />
              </van-popup>
              <div class="field-value" @click="categoryPickerShow = true">
                {{ newTag.category || '请选择' }}
              </div>
            </template>
          </van-field>
        </van-form>
        <div class="popup-actions">
          <van-button type="default" class="cancel-btn" @click="addTagPopupShow = false">取消</van-button>
          <van-button type="primary" class="confirm-btn" @click="submitAddTag">确认</van-button>
        </div>
      </div>
    </van-popup>
    
    <!-- 编辑标签弹窗 -->
    <van-popup v-model:show="editTagPopupShow" position="bottom" round>
      <div class="add-tag-popup">
        <h3 class="popup-title">编辑标签</h3>
        <van-form @submit="submitEditTag">
          <van-field
            v-model="editTagData.name"
            label="标签名称"
            placeholder="请输入标签名称"
            required
          />
          <van-field
            v-model="editTagData.category"
            label="标签分类"
            placeholder="请选择标签分类"
            required
          >
            <template #input>
              <van-popup
                v-model:show="editCategoryPickerShow"
                position="bottom"
              >
                <van-picker
                  v-model="editTagCategoryIndex"
                  :columns="categoryOptions"
                  @confirm="handleEditCategoryConfirm"
                  @cancel="editCategoryPickerShow = false"
                />
              </van-popup>
              <div class="field-value" @click="editCategoryPickerShow = true">
                {{ editTagData.category || '请选择' }}
              </div>
            </template>
          </van-field>
        </van-form>
        <div class="popup-actions">
          <van-button type="default" class="cancel-btn" @click="editTagPopupShow = false">取消</van-button>
          <van-button type="primary" class="confirm-btn" @click="submitEditTag">确认</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 标签分类
const tagCategories = [
  { label: '全部', value: 'all' },
  { label: '意向等级', value: 'intent' },
  { label: '户型', value: 'house-type' },
  { label: '预算', value: 'budget' },
  { label: '风格', value: 'style' },
  { label: '跟进阶段', value: 'follow-stage' }
]

// 分类选项
const categoryOptions = [
  '意向等级', '户型', '预算', '风格', '跟进阶段'
]

// 当前激活的分类
const activeCategory = ref('all')

// 新增标签弹窗显示状态
const addTagPopupShow = ref(false)
// 分类选择器显示状态
const categoryPickerShow = ref(false)

// 编辑标签弹窗显示状态
const editTagPopupShow = ref(false)
// 编辑分类选择器显示状态
const editCategoryPickerShow = ref(false)

// 新增标签数据
const newTag = ref({
  name: '',
  category: ''
})

// 新增标签分类索引
const newTagCategoryIndex = ref(0)

// 编辑标签数据
const editTagData = ref({
  id: '',
  name: '',
  category: ''
})

// 编辑标签分类索引
const editTagCategoryIndex = ref(0)

// 模拟标签数据
const tags = ref([
  { id: 1, name: '高意向', category: 'intent', isSystem: true },
  { id: 2, name: '中意向', category: 'intent', isSystem: true },
  { id: 3, name: '低意向', category: 'intent', isSystem: true },
  { id: 4, name: '三居室', category: 'house-type', isSystem: false },
  { id: 5, name: '四居室', category: 'house-type', isSystem: false },
  { id: 6, name: '100-200万', category: 'budget', isSystem: false },
  { id: 7, name: '现代风格', category: 'style', isSystem: false },
  { id: 8, name: '正在跟进', category: 'follow-stage', isSystem: true },
  { id: 9, name: '已成交', category: 'follow-stage', isSystem: true }
])

// 当前分类的标签
const currentTags = computed(() => {
  if (activeCategory.value === 'all') {
    return tags.value
  }
  return tags.value.filter(tag => tag.category === activeCategory.value)
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理分类切换
const handleCategoryChange = (value) => {
  activeCategory.value = value
}

// 新增标签
const addTag = () => {
  newTag.value = {
    name: '',
    category: ''
  }
  newTagCategoryIndex.value = 0
  addTagPopupShow.value = true
}

// 处理新增标签分类确认
const handleNewCategoryConfirm = () => {
  newTag.value.category = categoryOptions[newTagCategoryIndex.value]
  categoryPickerShow.value = false
}

// 处理编辑标签分类确认
const handleEditCategoryConfirm = () => {
  editTagData.value.category = categoryOptions[editTagCategoryIndex.value]
  editCategoryPickerShow.value = false
}

// 编辑标签
const editTag = (tag) => {
  // 填充编辑数据
  const categoryMap = {
    'intent': '意向等级',
    'house-type': '户型',
    'budget': '预算',
    'style': '风格',
    'follow-stage': '跟进阶段'
  }
  
  const categoryName = categoryMap[tag.category]
  editTagData.value = {
    id: tag.id,
    name: tag.name,
    category: categoryName
  }
  
  // 设置编辑标签分类索引
  editTagCategoryIndex.value = categoryOptions.indexOf(categoryName)
  
  // 打开编辑弹窗
  editTagPopupShow.value = true
}

// 删除标签
const deleteTag = (tagId) => {
  // 这里可以实现删除标签功能
  console.log('删除标签', tagId)
  tags.value = tags.value.filter(tag => tag.id !== tagId)
}

// 提交新增标签
const submitAddTag = () => {
  if (!newTag.value.name || !newTag.value.category) {
    return
  }
  
  // 这里可以实现提交新增标签功能
  const categoryMap = {
    '意向等级': 'intent',
    '户型': 'house-type',
    '预算': 'budget',
    '风格': 'style',
    '跟进阶段': 'follow-stage'
  }
  
  const newTagData = {
    id: Date.now(),
    name: newTag.value.name,
    category: categoryMap[newTag.value.category],
    isSystem: false
  }
  
  tags.value.push(newTagData)
  addTagPopupShow.value = false
  
  console.log('新增标签', newTagData)
}

// 提交编辑标签
const submitEditTag = () => {
  if (!editTagData.value.name || !editTagData.value.category) {
    return
  }
  
  // 这里可以实现提交编辑标签功能
  const categoryMap = {
    '意向等级': 'intent',
    '户型': 'house-type',
    '预算': 'budget',
    '风格': 'style',
    '跟进阶段': 'follow-stage'
  }
  
  const index = tags.value.findIndex(tag => tag.id === editTagData.value.id)
  if (index !== -1) {
    tags.value[index] = {
      ...tags.value[index],
      name: editTagData.value.name,
      category: categoryMap[editTagData.value.category]
    }
  }
  
  editTagPopupShow.value = false
  
  console.log('编辑标签', editTagData.value)
}
</script>

<style scoped>
.tags-manage {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  background-color: var(--white);
  padding: 0 var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
}

.header-left {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-full);
  transition: all var(--transition-fast);
}

.header-left:hover {
  background-color: var(--bg-color);
}

.back-icon {
  width: 24px;
  height: 24px;
  color: var(--text-primary);
}

.header-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.header-right {
  width: 60px;
}

.tag-categories {
  background-color: var(--white);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  margin: 0 var(--spacing-sm) var(--spacing-sm) var(--spacing-sm);
}

.tags-list {
  background-color: var(--white);
  padding: var(--spacing-md);
  margin: 0 var(--spacing-sm);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.tag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--border-color);
  transition: all var(--transition-fast);
}

.tag-item:hover {
  background-color: var(--bg-color);
  padding-left: var(--spacing-sm);
  padding-right: var(--spacing-sm);
  border-radius: var(--border-radius-md);
}

.tag-item:last-child {
  border-bottom: none;
}

.tag-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.tag-name {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.system-tag {
  font-size: var(--font-size-xs);
  color: var(--primary-color);
  background-color: rgba(102, 126, 234, 0.1);
  padding: 2px 8px;
  border-radius: var(--border-radius-full);
  font-weight: var(--font-weight-medium);
}

.tag-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.empty-state {
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
}

.empty-icon {
  width: 60px;
  height: 60px;
  color: var(--text-disabled);
  margin-bottom: var(--spacing-sm);
}

.empty-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.add-tag-popup {
  padding: var(--spacing-md);
}

.popup-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  text-align: center;
}

.field-value {
  width: 100%;
  height: 34px;
  line-height: 34px;
  color: var(--text-secondary);
}

.popup-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.cancel-btn {
  flex: 1;
  height: 44px;
  border-radius: var(--border-radius-full);
}

.confirm-btn {
  flex: 1;
  height: 44px;
  border-radius: var(--border-radius-full);
}
</style>