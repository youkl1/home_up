<template>
  <div class="guide-dashboard">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <h1 class="text-lg font-bold text-white">工作台</h1>
      <div class="nav-icon scan" @click="scan"></div>
    </div>
    
    <!-- 数据概览 -->
    <div class="data-overview mt-4 px-4">
      <div class="card p-4 animate-slide-up">
        <h2 class="text-base font-semibold text-primary mb-4">数据概览</h2>
        <div class="data-row">
          <div class="data-item">
            <div class="data-icon sales"></div>
            <div class="data-value font-bold text-lg">{{ todaySales }}</div>
            <div class="data-label text-xs text-secondary">今日销售额</div>
          </div>
          <div class="data-divider"></div>
          <div class="data-item">
            <div class="data-icon customers"></div>
            <div class="data-value font-bold text-lg">{{ todayCustomers }}</div>
            <div class="data-label text-xs text-secondary">今日客户</div>
          </div>
          <div class="data-divider"></div>
          <div class="data-item">
            <div class="data-icon total"></div>
            <div class="data-value font-bold text-lg">{{ totalCustomers }}</div>
            <div class="data-label text-xs text-secondary">总客户数</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 快捷功能 -->
    <div class="quick-functions mt-4 px-4">
      <h2 class="text-base font-semibold text-primary mb-4">快捷功能</h2>
      <div class="card p-4 animate-slide-up">
        <div class="function-row">
          <div @click="navigateTo('产品库')" class="function-item">
            <div class="function-icon product">
              <div class="icon goods"></div>
            </div>
            <div class="function-label text-xs text-secondary">产品库</div>
          </div>
          <div class="function-divider"></div>
          <div @click="navigateTo('案例库')" class="function-item">
            <div class="function-icon case">
              <div class="icon picture"></div>
            </div>
            <div class="function-label text-xs text-secondary">案例库</div>
          </div>
          <div class="function-divider"></div>
          <div @click="navigateTo('客户管理')" class="function-item">
            <div class="function-icon customer">
              <div class="icon contact"></div>
            </div>
            <div class="function-label text-xs text-secondary">客户管理</div>
          </div>
        </div>
        <div class="function-row mt-4">
          <div @click="navigateTo('电子合同')" class="function-item">
            <div class="function-icon contract">
              <div class="icon contract-icon"></div>
            </div>
            <div class="function-label text-xs text-secondary">电子合同</div>
          </div>
          <div class="function-divider"></div>
          <div @click="navigateTo('工单管理')" class="function-item">
            <div class="function-icon ticket">
              <div class="icon ticket-icon"></div>
            </div>
            <div class="function-label text-xs text-secondary">工单管理</div>
          </div>
          <div class="function-divider"></div>
          <div @click="navigateTo('客户标签')" class="function-item">
            <div class="function-icon tag">
              <div class="icon tag-icon"></div>
            </div>
            <div class="function-label text-xs text-secondary">客户标签</div>
          </div>
        </div>
        <div class="function-row mt-4">
          <div @click="navigateTo('表单工具')" class="function-item">
            <div class="function-icon form">
              <div class="icon form-icon"></div>
            </div>
            <div class="function-label text-xs text-secondary">表单工具</div>
          </div>
          <div class="function-divider"></div>
          <div @click="navigateTo('量房管理')" class="function-item">
            <div class="function-icon measure">
              <div class="icon measure-icon"></div>
            </div>
            <div class="function-label text-xs text-secondary">量房管理</div>
          </div>
          <div class="function-divider"></div>
          <div @click="navigateTo('AI助手')" class="function-item">
            <div class="function-icon ai">
              <div class="icon ai-icon"></div>
            </div>
            <div class="function-label text-xs text-secondary">AI助手</div>
          </div>
        </div>
        <div class="function-row mt-4">
          <div @click="navigateTo('转介绍')" class="function-item">
            <div class="function-icon referral">
              <div class="icon referral-icon"></div>
            </div>
            <div class="function-label text-xs text-secondary">转介绍</div>
          </div>
          <div class="function-divider"></div>
          <div @click="share" class="function-item">
            <div class="function-icon share">
              <div class="icon share-icon"></div>
            </div>
            <div class="function-label text-xs text-secondary">分享</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 待办事项 -->
    <div class="todo-list mt-2 px-4 mb-6">
      <div class="card p-4 animate-slide-up">
        <div class="todo-header flex-between mb-4">
          <h2 class="text-base font-semibold text-primary">待办事项</h2>
          <a href="#" @click.prevent="viewAll" class="text-sm text-primary">查看全部</a>
        </div>
        <div class="todo-items">
          <div
            v-for="(item, index) in todoItems"
            :key="item.id"
            class="todo-item animate-slide-up"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="todo-content">
              <div class="todo-title">{{ item.title }}</div>
              <div class="todo-description">{{ item.description }}</div>
            </div>
            <div class="todo-right">
              <div class="todo-time">{{ item.time }}</div>
              <div class="todo-checkbox" :class="{ checked: item.checked }" @click="item.checked = !item.checked"></div>
            </div>
          </div>
          <div v-if="loading" class="loading">加载中...</div>
          <div v-if="finished" class="finished">没有更多了</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟数据
const todaySales = ref('¥12,345')
const todayCustomers = ref(23)
const totalCustomers = ref(156)

// 待办事项
const todoItems = ref([
  {
    id: 1,
    title: '跟进客户张女士',
    description: '确认橱柜定制需求',
    time: '10:30',
    checked: false
  },
  {
    id: 2,
    title: '整理产品资料',
    description: '更新产品价格表',
    time: '14:00',
    checked: false
  },
  {
    id: 3,
    title: '参加销售培训',
    description: '学习新的销售技巧',
    time: '16:00',
    checked: false
  }
])

// 加载状态
const loading = ref(false)
const finished = ref(false)

// 导航到对应页面
const navigateTo = (path) => {
  const pathMap = {
    '产品库': '/guide/products',
    '案例库': '/guide/cases',
    '客户管理': '/guide/customers',
    '电子合同': '/guide/contracts/list',
    '工单管理': '/guide/tickets/list',
    '客户标签': '/guide/tags/manage',
    '表单工具': '/guide/forms/templates',
    '量房管理': '/guide/measure/list',
    'AI助手': '/guide/ai/suggestions',
    '转介绍': '/guide/referral/rules',
    '分享': '/guide/share'
  }
  router.push(pathMap[path] || '/guide/dashboard')
}

// 分享功能
const share = () => {
  // 导航到分享页面
  router.push('/guide/share')
}

// 扫描功能
const scan = () => {
  // 模拟扫描功能
  alert('扫描功能已启动，请将二维码对准摄像头')
  // 模拟扫描结果
  setTimeout(() => {
    alert('扫描成功！识别到产品信息：金牌厨柜-现代简约系列')
  }, 1500)
}

// 查看全部待办
const viewAll = () => {
  // 模拟导航
  setTimeout(() => {
    router.push('/guide/todo/list')
  }, 1000)
}

// 加载更多
const onLoad = () => {
  // 模拟加载
  setTimeout(() => {
    // 模拟加载更多数据
    const newItems = [
      {
        id: 4,
        title: '跟进客户李先生',
        description: '确认衣柜定制需求',
        time: '09:30',
        checked: false
      },
      {
        id: 5,
        title: '准备销售方案',
        description: '为新客户制定销售方案',
        time: '11:00',
        checked: false
      }
    ]
    todoItems.value.push(...newItems)
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
.guide-dashboard {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
  overflow-x: hidden;
  padding-bottom: var(--spacing-lg);
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
  border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
}

.top-nav h1 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--white);
  margin: 0;
}

/* 导航图标 */
.nav-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-icon:hover {
  transform: scale(1.1);
}

.nav-icon.scan {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19.67 10.67l-4.89-4.89c.94-1.54 1.5-3.28 1.5-5.08 0-1.86-1.5-3.36-3.36-3.36-1.79 0-3.54.57-5.08 1.5L4.33 4.33C2.77 7.24 2.35 10.61 3.46 13.41l1.5 1.5c1.15-1.3 2.68-2.31 4.4-2.88.93-.3 1.93-.46 2.96-.46 1.86 0 3.54.57 5.08 1.5l2.5-2.5c1.54-.94 2.1-3.28 2.1-5.08 0-1.86-1.5-3.36-3.33-3.36zM12 18c-3.31 0-6-2.69-6-6 0-1.66 2.69-3 6-3 3.31 0 6 1.34 6 3 0 3.31-2.69 6-6 6z"/></svg>');
}

.data-overview,
.quick-functions,
.todo-list {
  margin-bottom: var(--spacing-sm);
}

/* 数据概览 */
.data-overview {
  padding: 0 var(--spacing-sm);
}

.data-overview .card {
  padding: var(--spacing-md);
}

.data-overview h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.data-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xs);
}

.data-divider {
  width: 1px;
  height: 60px;
  background-color: var(--border-color);
  margin: 0 var(--spacing-xs);
}

.data-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
  min-height: 80px;
  justify-content: center;
}

.data-item:hover {
  background-color: var(--bg-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.data-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  background-size: 16px 16px;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 4px;
}

.data-icon:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.data-icon.sales {
  background-color: var(--primary-color);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
}

.data-icon.customers {
  background-color: var(--success-color);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>');
}

.data-icon.total {
  background-color: var(--info-color);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>');
}

.data-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: 2px;
  text-align: center;
}

.data-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.1;
}

/* 快捷功能 */
.quick-functions {
  padding: 0 var(--spacing-sm);
}

.quick-functions .card {
  padding: var(--spacing-md);
}

.quick-functions h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.function-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xs);
}

.function-divider {
  width: 1px;
  height: 60px;
  background-color: var(--border-color);
  margin: 0 var(--spacing-xs);
}

.function-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  cursor: pointer;
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
  min-height: 80px;
  justify-content: center;
}

.function-item:hover {
  background-color: var(--bg-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.function-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  margin-bottom: 4px;
}

.function-icon:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.function-icon.product {
  background-color: var(--info-color);
}

.function-icon.case {
  background-color: var(--success-color);
}

.function-icon.customer {
  background-color: var(--warning-color);
}

.function-icon.contract {
  background-color: #667eea;
}

.function-icon.ticket {
  background-color: #52c41a;
}

.function-icon.tag {
  background-color: #fa8c16;
}

.function-icon.form {
  background-color: #1890ff;
}

.function-icon.measure {
  background-color: #722ed1;
}

.function-icon.ai {
  background-color: #13c2c2;
}

.function-icon.referral {
  background-color: #fa541c;
}

.function-icon.share {
  background-color: var(--danger-color);
}

.function-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  text-align: center;
  font-weight: var(--font-weight-medium);
}

/* 图标样式 */
.icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon.goods {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 12H6v-2h13v2zm0-3H6V9h13v2zm0-3H6V6h13v2z"/></svg>');
}

.icon.picture {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>');
}

.icon.contact {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
}

.icon.share-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>');
}

.icon.contract-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>');
}

.icon.ticket-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>');
}

.icon.tag-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h7V2H7v5z"/></svg>');
}

.icon.form-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>');
}

.icon.measure-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>');
}

.icon.ai-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
}

.icon.referral-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>');
}

/* 待办事项 */
.todo-list {
  padding: 0 var(--spacing-sm);
}

.todo-list .card {
  padding: var(--spacing-md);
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.todo-header h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.todo-header a {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.todo-header a:hover {
  text-decoration: underline;
  color: var(--primary-color-dark);
}

.todo-items {
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-sm) 0;
  transition: all var(--transition-fast);
}

.todo-item:hover {
  background-color: rgba(102, 126, 234, 0.05);
  border-radius: var(--border-radius-md);
  padding-left: var(--spacing-sm);
  padding-right: var(--spacing-sm);
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-content {
  flex: 1;
  padding-right: var(--spacing-sm);
}

.todo-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.todo-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
}

.todo-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
}

.todo-time {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  background-color: var(--bg-color);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
}

.todo-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
}

.todo-checkbox:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.todo-checkbox.checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.todo-checkbox.checked::after {
  content: '';
  width: 12px;
  height: 12px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.loading,
.finished {
  text-align: center;
  padding: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background-color: var(--bg-color);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-sm);
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .guide-dashboard {
    width: 100%;
  }
  
  .top-nav {
    width: 100%;
  }
  
  .data-overview,
  .quick-functions,
  .todo-list {
    padding: 0 var(--spacing-sm);
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .data-icon {
    width: 48px;
    height: 48px;
  }
  
  .function-icon {
    width: 56px;
    height: 56px;
  }
  
  .data-value {
    font-size: var(--font-size-lg);
  }
  
  .function-label {
    font-size: 11px;
  }
}

/* 无障碍 */
@media (prefers-reduced-motion: reduce) {
  .animate-slide-up {
    animation: none;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .data-item,
  .function-item {
    background-color: var(--white);
  }
  
  .data-item:hover,
  .function-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .todo-time {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .loading,
  .finished {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style>