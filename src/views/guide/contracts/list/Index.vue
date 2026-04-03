<template>
  <div class="contracts-list">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">合同模板</h1>
      <div class="header-right"></div>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section animate-slide-up">
      <div class="filter-row">
        <van-dropdown-menu>
          <van-dropdown-item v-model="contractType" :options="contractTypeOptions" placeholder="合同类型" />
          <van-dropdown-item v-model="productCategory" :options="productCategoryOptions" placeholder="产品类目" />
        </van-dropdown-menu>
      </div>
    </div>
    
    <!-- 模板列表 -->
    <div class="template-list">
      <div 
        v-for="(template, index) in templates" 
        :key="template.id"
        class="template-item animate-slide-up"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="selectTemplate(template.id)"
      >
        <div class="template-info">
          <h3 class="template-title">{{ template.name }}</h3>
          <p class="template-desc">{{ template.description }}</p>
          <div class="template-meta">
            <span class="meta-tag">{{ template.type }}</span>
            <span class="meta-tag">{{ template.category }}</span>
          </div>
        </div>
        <div class="template-action">
          <van-button type="primary" size="small" class="select-btn">选用</van-button>
        </div>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-action animate-slide-up">
      <van-button type="primary" class="primary-btn" @click="createContract">创建合同</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选条件
const contractType = ref('')
const productCategory = ref('')

// 筛选选项
const contractTypeOptions = [
  { text: '销售合同', value: 'sales' },
  { text: '服务合同', value: 'service' },
  { text: '安装合同', value: 'installation' }
]

const productCategoryOptions = [
  { text: '全屋定制', value: 'custom' },
  { text: '成品家具', value: 'ready-made' },
  { text: '软装搭配', value: 'decoration' }
]

// 模拟合同模板数据
const templates = ref([
  {
    id: 1,
    name: '标准销售合同',
    description: '适用于常规产品销售，包含完整的权利义务条款',
    type: '销售合同',
    category: '全屋定制'
  },
  {
    id: 2,
    name: '服务协议',
    description: '适用于售后服务、安装服务等场景',
    type: '服务合同',
    category: '全屋定制'
  },
  {
    id: 3,
    name: '成品家具购买合同',
    description: '适用于成品家具的销售场景',
    type: '销售合同',
    category: '成品家具'
  }
])

// 返回上一页
const goBack = () => {
  router.back()
}

// 选用模板
const selectTemplate = (templateId) => {
  router.push(`/guide/contracts/create?templateId=${templateId}`)
}

// 创建合同
const createContract = () => {
  router.push('/guide/contracts/create')
}
</script>

<style scoped>
.contracts-list {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
  padding-bottom: 80px;
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
  width: 44px;
}

.filter-section {
  background-color: var(--white);
  padding: var(--spacing-sm);
  margin: var(--spacing-sm);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.template-list {
  padding: 0 var(--spacing-sm);
}

.template-item {
  background-color: var(--white);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all var(--transition-normal);
  cursor: pointer;
}

.template-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.template-info {
  flex: 1;
  margin-right: var(--spacing-sm);
}

.template-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.template-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: var(--line-height-relaxed);
}

.template-meta {
  display: flex;
  gap: var(--spacing-xs);
}

.meta-tag {
  font-size: var(--font-size-xs);
  color: var(--primary-color);
  background-color: rgba(102, 126, 234, 0.1);
  padding: 2px 8px;
  border-radius: var(--border-radius-full);
  font-weight: var(--font-weight-medium);
}

.template-action {
  flex-shrink: 0;
}

.select-btn {
  border-radius: var(--border-radius-full);
  padding: 6px 16px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.select-btn:hover {
  transform: scale(1.05);
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 375px;
  margin: 0 auto;
  background-color: var(--white);
  padding: var(--spacing-sm);
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.08);
  z-index: 101;
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
}

.primary-btn {
  width: 100%;
  height: 48px;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 动画效果 */
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

.animate-slide-up {
  animation: slide-up 0.5s ease-out forwards;
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .contracts-list {
    width: 100%;
  }
  
  .bottom-action {
    width: 100%;
  }
  
  .template-item {
    padding: var(--spacing-sm);
  }
  
  .template-title {
    font-size: var(--font-size-sm);
  }
  
  .template-desc {
    font-size: var(--font-size-xs);
  }
}

/* 无障碍 */
@media (prefers-reduced-motion: reduce) {
  .animate-slide-up {
    animation: none;
  }
}
</style>