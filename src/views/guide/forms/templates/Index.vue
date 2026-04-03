<template>
  <div class="forms-templates">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">表单模板</h1>
      <div class="header-right"></div>
    </div>
    
    <!-- 筛选器 -->
    <div class="filter-section">
      <van-dropdown-menu>
        <van-dropdown-item v-model="formType" :options="formTypeOptions" placeholder="表单类型" />
      </van-dropdown-menu>
    </div>
    
    <!-- 模板列表 -->
    <div class="templates-list">
      <div 
        v-for="template in templates" 
        :key="template.id"
        class="template-item"
        @click="selectTemplate(template.id)"
      >
        <div class="template-info">
          <h3 class="template-title">{{ template.name }}</h3>
          <p class="template-desc">{{ template.description }}</p>
          <div class="template-meta">
            <span class="template-type">{{ template.type }}</span>
            <span class="template-count">{{ template.useCount }}次使用</span>
          </div>
        </div>
        <div class="template-action">
          <van-button size="small" type="primary" @click.stop="createFromTemplate(template.id)">
            选用
          </van-button>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="templates.length === 0" class="empty-state">
      <img src="../../../assets/images/placeholder.png" alt="空状态" class="empty-image" />
      <p class="empty-text">暂无表单模板</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单类型选项
const formTypeOptions = [
  { text: '全部', value: 'all' },
  { text: '量房信息表', value: 'measurement' },
  { text: '客户需求调研表', value: 'survey' },
  { text: '订单确认表', value: 'order' },
  { text: '其他', value: 'other' }
]

// 当前选中的表单类型
const formType = ref('all')

// 表单模板数据
const templates = ref([
  {
    id: 1,
    name: '标准量房信息表',
    description: '包含房屋基本信息、尺寸数据、户型图上传等字段',
    type: '量房信息表',
    useCount: 156
  },
  {
    id: 2,
    name: '客户需求调研表',
    description: '了解客户装修需求、风格偏好、预算范围等信息',
    type: '客户需求调研表',
    useCount: 234
  },
  {
    id: 3,
    name: '订单确认表',
    description: '确认订单详情、产品信息、价格等内容',
    type: '订单确认表',
    useCount: 189
  },
  {
    id: 4,
    name: '客户满意度调查表',
    description: '收集客户对服务的满意度评价',
    type: '其他',
    useCount: 98
  }
])

// 返回上一页
const goBack = () => {
  router.back()
}

// 选择模板
const selectTemplate = (templateId) => {
  // 这里可以实现查看模板详情的功能
  console.log('选择模板', templateId)
}

// 从模板创建表单
const createFromTemplate = (templateId) => {
  router.push(`/guide/forms/create?templateId=${templateId}`)
}
</script>

<style scoped>
.forms-templates {
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
  width: 40px;
}

.filter-section {
  background-color: white;
  padding: 10px 15px;
  margin-bottom: 10px;
}

.templates-list {
  padding: 0 15px;
}

.template-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.template-info {
  flex: 1;
  margin-right: 15px;
}

.template-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.template-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.template-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.template-type {
  font-size: 12px;
  color: #667eea;
  background-color: #f0f0ff;
  padding: 2px 8px;
  border-radius: 10px;
}

.template-count {
  font-size: 12px;
  color: #999;
}

.template-action {
  min-width: 60px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-image {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin: 0;
}
</style>