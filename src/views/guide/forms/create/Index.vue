<template>
  <div class="form-create">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">创建表单</h1>
      <div class="header-right">
        <van-button size="small" @click="previewForm">预览</van-button>
      </div>
    </div>
    
    <!-- 表单基本信息 -->
    <div class="form-basic-info">
      <h3 class="section-title">基本信息</h3>
      <van-field
        v-model="formInfo.title"
        label="表单标题"
        placeholder="请输入表单标题"
        required
      />
      <van-field
        v-model="formInfo.description"
        label="表单说明"
        placeholder="请输入表单说明（选填）"
        type="textarea"
        :rows="3"
      />
    </div>
    
    <!-- 表单项管理 -->
    <div class="form-items">
      <div class="section-header">
        <h3 class="section-title">表单项</h3>
        <van-button size="small" type="primary" @click="addFormItem">
          添加表单项
        </van-button>
      </div>
      
      <!-- 表单项列表 -->
      <div class="form-items-list">
        <div 
          v-for="(item, index) in formItems" 
          :key="item.id"
          class="form-item-card"
        >
          <div class="form-item-header">
            <div class="form-item-type">
              {{ getItemTypeName(item.type) }}
            </div>
            <div class="form-item-actions">
              <van-icon name="drag" class="drag-icon" />
              <van-icon name="edit" class="action-icon" @click="editFormItem(index)" />
              <van-icon name="delete" class="action-icon delete" @click="deleteFormItem(index)" />
            </div>
          </div>
          <div class="form-item-content">
            <van-field
              v-model="item.label"
              placeholder="请输入字段名称"
              :required="item.required"
            />
            <div class="form-item-settings">
              <van-checkbox v-model="item.required">必填</van-checkbox>
              <div v-if="item.type === 'select' || item.type === 'radio' || item.type === 'checkbox'" class="options-section">
                <div class="options-header">
                  <span>选项</span>
                  <van-button size="small" @click="addOption(index)">添加选项</van-button>
                </div>
                <div v-for="(option, optionIndex) in item.options" :key="optionIndex" class="option-item">
                  <van-field
                    v-model="option.label"
                    placeholder="请输入选项名称"
                  />
                  <van-icon name="delete" class="option-delete" @click="deleteOption(index, optionIndex)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <van-button type="primary" class="primary-btn" @click="saveForm">保存表单</van-button>
      <van-button class="secondary-btn" @click="shareForm">分享表单</van-button>
    </div>
    
    <!-- 添加表单项弹窗 -->
    <van-popup v-model:show="showAddItemPopup" position="bottom" round>
      <div class="popup-content">
        <h3 class="popup-title">选择表单项类型</h3>
        <div class="form-item-types">
          <div 
            v-for="type in formItemTypes" 
            :key="type.value"
            class="form-item-type-option"
            @click="selectFormItemType(type.value)"
          >
            <span class="type-name">{{ type.label }}</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 表单基本信息
const formInfo = ref({
  title: '新建表单',
  description: ''
})

// 表单项类型
const formItemTypes = [
  { label: '单行文本', value: 'text' },
  { label: '多行文本', value: 'textarea' },
  { label: '数字', value: 'number' },
  { label: '单选', value: 'radio' },
  { label: '多选', value: 'checkbox' },
  { label: '下拉选择', value: 'select' },
  { label: '日期', value: 'date' },
  { label: '图片上传', value: 'image' }
]

// 表单项列表
const formItems = ref([
  {
    id: 1,
    type: 'text',
    label: '姓名',
    required: true,
    options: []
  },
  {
    id: 2,
    type: 'text',
    label: '联系电话',
    required: true,
    options: []
  },
  {
    id: 3,
    type: 'select',
    label: '户型',
    required: false,
    options: [
      { label: '一居室' },
      { label: '二居室' },
      { label: '三居室' },
      { label: '四居室及以上' }
    ]
  }
])

// 弹窗状态
const showAddItemPopup = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 预览表单
const previewForm = () => {
  // 这里可以实现表单预览功能
  console.log('预览表单', formInfo.value, formItems.value)
}

// 添加表单项
const addFormItem = () => {
  showAddItemPopup.value = true
}

// 选择表单项类型
const selectFormItemType = (type) => {
  const newItem = {
    id: Date.now(),
    type: type,
    label: '',
    required: false,
    options: type === 'select' || type === 'radio' || type === 'checkbox' ? [{ label: '' }] : []
  }
  formItems.value.push(newItem)
  showAddItemPopup.value = false
}

// 编辑表单项
const editFormItem = (index) => {
  // 这里可以实现表单项编辑功能
  console.log('编辑表单项', index)
}

// 删除表单项
const deleteFormItem = (index) => {
  formItems.value.splice(index, 1)
}

// 添加选项
const addOption = (index) => {
  formItems.value[index].options.push({ label: '' })
}

// 删除选项
const deleteOption = (index, optionIndex) => {
  formItems.value[index].options.splice(optionIndex, 1)
}

// 获取表单项类型名称
const getItemTypeName = (type) => {
  const itemType = formItemTypes.find(t => t.value === type)
  return itemType ? itemType.label : type
}

// 保存表单
const saveForm = () => {
  // 这里可以实现保存表单功能
  console.log('保存表单', formInfo.value, formItems.value)
  router.push('/guide/forms/statistics')
}

// 分享表单
const shareForm = () => {
  // 这里可以实现分享表单功能
  console.log('分享表单')
  router.push('/guide/forms/share/1')
}

// 初始化表单数据
onMounted(() => {
  const templateId = route.query.templateId
  if (templateId) {
    // 这里可以根据模板ID加载模板数据
    console.log('加载模板', templateId)
  }
})
</script>

<style scoped>
.form-create {
  width: 375px;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
  padding-bottom: 70px;
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
  width: 80px;
}

.form-basic-info {
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

.form-items {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.form-items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-item-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  background-color: #f9f9f9;
}

.form-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.form-item-type {
  font-size: 12px;
  color: #667eea;
  background-color: #f0f0ff;
  padding: 2px 8px;
  border-radius: 10px;
}

.form-item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.drag-icon {
  color: #999;
  font-size: 16px;
}

.action-icon {
  color: #666;
  font-size: 16px;
  cursor: pointer;
}

.action-icon.delete {
  color: #ff4d4f;
}

.form-item-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-item-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
}

.options-section {
  margin-top: 10px;
}

.options-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.options-header span {
  font-size: 14px;
  color: #666;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.option-item .van-field {
  flex: 1;
}

.option-delete {
  color: #ff4d4f;
  font-size: 16px;
  cursor: pointer;
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
  display: flex;
  gap: 10px;
  z-index: 100;
}

.primary-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
}

.secondary-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
}

.popup-content {
  padding: 20px;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
}

.form-item-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.form-item-type-option {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-item-type-option:hover {
  background-color: #e6e6ff;
}

.type-name {
  font-size: 14px;
  color: #333;
}
</style>