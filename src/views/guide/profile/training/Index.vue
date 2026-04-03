<template>
  <div class="training-page">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <div class="nav-icon back" @click="goBack"></div>
      <h1 class="text-lg font-bold text-white">我的培训</h1>
      <div class="nav-icon ai" @click="navigateTo('AI话术')"></div>
    </div>
    
    <!-- 培训统计 -->
    <div class="training-stats card mt-4 px-4">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ trainingStats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ trainingStats.inProgress }}</div>
          <div class="stat-label">进行中</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ trainingStats.totalHours }}</div>
          <div class="stat-label">总学时</div>
        </div>
      </div>
    </div>
    
    <!-- 培训分类标签 -->
    <div class="training-tabs card mt-4 px-4">
      <div class="tab-items">
        <div 
          v-for="tab in tabs" 
          :key="tab.id" 
          class="tab-item" 
          :class="{ active: activeTab === tab.id }"
          @click="switchTab(tab.id)"
        >
          {{ tab.name }}
        </div>
      </div>
    </div>
    
    <!-- 培训列表 -->
    <div class="training-list card mt-4 px-4">
      <div class="training-items">
        <div v-for="training in filteredTrainings" :key="training.id" class="training-item" @click="startTraining(training.id)">
          <div class="training-image">
            <img :src="training.image" :alt="training.title">
            <div class="training-duration">{{ training.duration }}</div>
          </div>
          <div class="training-info">
            <div class="training-title">{{ training.title }}</div>
            <div class="training-desc">{{ training.description }}</div>
            <div class="training-progress" v-if="training.progress > 0">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: training.progress + '%' }"></div>
              </div>
              <div class="progress-text">已学习 {{ training.progress }}%</div>
            </div>
            <div class="training-status" :class="training.status">{{ training.statusText }}</div>
          </div>
        </div>
        <div v-if="filteredTrainings.length === 0" class="no-training">暂无培训课程</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前激活的标签
const activeTab = ref('all')

// 标签数据
const tabs = [
  { id: 'all', name: '全部' },
  { id: 'product', name: '产品知识' },
  { id: 'sales', name: '销售技巧' },
  { id: 'service', name: '服务规范' }
]

// 培训统计数据
const trainingStats = ref({
  completed: 12,
  inProgress: 3,
  totalHours: 48
})

// 培训列表
const trainingList = ref([
  {
    id: 1,
    title: '金牌厨柜产品体系介绍',
    description: '全面了解金牌厨柜的产品线、材质、工艺和设计理念',
    category: 'product',
    duration: '45分钟',
    progress: 100,
    status: 'completed',
    statusText: '已完成',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kitchen%20cabinet%20product%20training&image_size=landscape_4_3'
  },
  {
    id: 2,
    title: '全屋定制销售技巧',
    description: '掌握全屋定制方案的销售话术和客户沟通技巧',
    category: 'sales',
    duration: '60分钟',
    progress: 65,
    status: 'inProgress',
    statusText: '学习中',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sales%20training%20meeting&image_size=landscape_4_3'
  },
  {
    id: 3,
    title: '客户服务标准流程',
    description: '学习标准化的客户服务流程和沟通礼仪',
    category: 'service',
    duration: '30分钟',
    progress: 0,
    status: 'notStarted',
    statusText: '未开始',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=customer%20service%20training&image_size=landscape_4_3'
  },
  {
    id: 4,
    title: '智能卫浴产品知识',
    description: '深入了解智能卫浴产品的功能特点和技术优势',
    category: 'product',
    duration: '40分钟',
    progress: 30,
    status: 'inProgress',
    statusText: '学习中',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20bathroom%20product%20training&image_size=landscape_4_3'
  },
  {
    id: 5,
    title: '高端客户接待技巧',
    description: '学习如何接待和服务高端别墅客户',
    category: 'sales',
    duration: '50分钟',
    progress: 0,
    status: 'notStarted',
    statusText: '未开始',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20customer%20service&image_size=landscape_4_3'
  }
])

// 过滤后的培训列表
const filteredTrainings = computed(() => {
  if (activeTab.value === 'all') {
    return trainingList.value
  }
  return trainingList.value.filter(training => training.category === activeTab.value)
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 切换标签
const switchTab = (tabId) => {
  activeTab.value = tabId
}

// 开始学习
const startTraining = (trainingId) => {
  const training = trainingList.value.find(t => t.id === trainingId)
  if (training) {
    alert(`开始学习: ${training.title}`)
  }
}

// 导航到AI话术建议
const navigateTo = (path) => {
  if (path === 'AI话术') {
    router.push('/guide/ai/suggestions')
  }
}
</script>

<style scoped>
.training-page {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
  overflow-x: hidden;
  padding-bottom: 20px;
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

.nav-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

.nav-icon.back {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>');
}

.nav-icon.ai {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
}

.training-stats,
.training-tabs,
.training-list {
  padding: var(--spacing-md);
  margin: 0 auto;
  width: 375px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.stat-item {
  text-align: center;
  padding: var(--spacing-md);
  background-color: #F9FAFC;
  border-radius: var(--border-radius-md);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.tab-items {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding-bottom: var(--spacing-xs);
}

.tab-item {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: #F9FAFC;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-item.active {
  background-color: var(--primary-color);
  color: white;
}

.training-items {
  padding-top: var(--spacing-sm);
}

.training-item {
  display: flex;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  background-color: #F9FAFC;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.training-item:hover {
  background-color: #F0F2FF;
}

.training-item:last-child {
  margin-bottom: 0;
}

.training-image {
  position: relative;
  width: 100px;
  height: 75px;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.training-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.training-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: 4px;
}

.training-info {
  flex: 1;
  min-width: 0;
}

.training-title {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.3;
}

.training-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.training-progress {
  margin-bottom: var(--spacing-xs);
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: var(--border-color);
  border-radius: 2px;
  margin-bottom: 2px;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: var(--font-size-xs);
  color: var(--primary-color);
}

.training-status {
  display: inline-block;
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: 10px;
  color: white;
}

.training-status.completed {
  background-color: var(--success-color);
}

.training-status.inProgress {
  background-color: var(--primary-color);
}

.training-status.notStarted {
  background-color: var(--text-secondary);
}

.no-training {
  text-align: center;
  padding: var(--spacing-xl);
  font-size: var(--font-size-base);
  color: var(--text-secondary);
}

@media screen and (max-width: 375px) {
  .training-stats,
  .training-tabs,
  .training-list {
    width: 100%;
  }
}
</style>