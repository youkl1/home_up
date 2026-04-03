<template>
  <div class="tickets-list">
    <!-- 顶部导航 -->
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">我的工单</h1>
      <div class="header-right">
        <button class="create-button" @click="createTicket">新建</button>
      </div>
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-row">
        <van-dropdown-menu>
          <van-dropdown-item v-model="ticketStatus" :options="statusOptions" placeholder="工单状态" />
          <van-dropdown-item v-model="ticketType" :options="typeOptions" placeholder="工单类型" />
        </van-dropdown-menu>
      </div>
      <div class="search-bar">
        <van-search
          v-model="searchKeyword"
          placeholder="搜索客户姓名"
          @search="onSearch"
        />
      </div>
    </div>
    
    <!-- 工单列表 -->
    <div class="tickets-container">
      <div 
        v-for="(ticket, index) in tickets" 
        :key="ticket.id"
        class="ticket-item animate-slide-up"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="viewTicketDetail(ticket.id)"
      >
        <div class="ticket-info">
          <div class="ticket-header">
            <h3 class="ticket-title">{{ ticket.customerName }}</h3>
            <span class="ticket-status" :class="ticketStatusClass(ticket.status)">
              {{ ticket.status }}
            </span>
          </div>
          <div class="ticket-meta">
            <span class="meta-item type">{{ ticket.type }}</span>
            <span class="meta-item number">工单号: {{ ticket.ticketNumber }}</span>
          </div>
          <div class="ticket-time">预计完成时间: {{ ticket.expectedTime }}</div>
        </div>
        <div class="ticket-arrow">
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="tickets.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h2V9h2v2h2v2h-2v4z"/>
          </svg>
        </div>
        <p class="empty-text">暂无工单</p>
        <div class="empty-action" @click="createTicket">新建工单</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选条件
const ticketStatus = ref('')
const ticketType = ref('')
const searchKeyword = ref('')

// 筛选选项
const statusOptions = [
  { text: '待处理', value: 'pending' },
  { text: '处理中', value: 'processing' },
  { text: '已完成', value: 'completed' },
  { text: '已取消', value: 'cancelled' }
]

const typeOptions = [
  { text: '安装工单', value: 'installation' },
  { text: '售后工单', value: 'aftersales' }
]

// 模拟工单数据
const tickets = ref([
  {
    id: 1,
    ticketNumber: 'TK20240101001',
    customerName: '张三',
    type: '安装工单',
    status: '待处理',
    expectedTime: '2024-01-05 14:00'
  },
  {
    id: 2,
    ticketNumber: 'TK20240101002',
    customerName: '李四',
    type: '售后工单',
    status: '处理中',
    expectedTime: '2024-01-04 10:00'
  },
  {
    id: 3,
    ticketNumber: 'TK20240101003',
    customerName: '王五',
    type: '安装工单',
    status: '已完成',
    expectedTime: '2024-01-03 16:00'
  }
])

// 工单状态样式
const ticketStatusClass = (status) => {
  switch (status) {
    case '待处理':
      return 'status-pending'
    case '处理中':
      return 'status-processing'
    case '已完成':
      return 'status-completed'
    case '已取消':
      return 'status-cancelled'
    default:
      return ''
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 新建工单
const createTicket = () => {
  router.push('/guide/tickets/apply')
}

// 查看工单详情
const viewTicketDetail = (ticketId) => {
  router.push(`/guide/tickets/detail/${ticketId}`)
}

// 搜索
const onSearch = (keyword) => {
  console.log('搜索', keyword)
  // 这里可以实现搜索功能
}
</script>

<style scoped>
.tickets-list {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
  padding-bottom: var(--spacing-xl);
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.create-button {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.create-button:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.filter-section {
  background-color: var(--white);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-lg);
  margin: var(--spacing-sm);
}

.filter-row {
  margin-bottom: var(--spacing-sm);
}

.search-bar {
  margin-top: var(--spacing-xs);
}

.tickets-container {
  padding: 0 var(--spacing-sm);
}

.ticket-item {
  display: flex;
  align-items: center;
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.ticket-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.ticket-info {
  flex: 1;
  padding-right: var(--spacing-sm);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.ticket-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.ticket-status {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  margin-left: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #cce7ff;
  color: #004085;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.ticket-meta {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-xs);
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.meta-item {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  background-color: var(--bg-color);
}

.meta-item.type {
  background-color: rgba(102, 126, 234, 0.1);
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
}

.ticket-time {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.ticket-arrow {
  display: flex;
  align-items: center;
  margin-left: var(--spacing-sm);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.ticket-item:hover .arrow-icon {
  color: var(--primary-color);
  transform: translateX(2px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  margin: var(--spacing-sm);
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: var(--text-disabled);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 48px;
  height: 48px;
}

.empty-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
}

.empty-action {
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--primary-color);
  color: var(--white);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.empty-action:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 动画 */
.animate-slide-up {
  animation: slide-up 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slide-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .tickets-list {
    width: 100%;
  }
  
  .filter-section {
    margin: var(--spacing-xs);
    padding: var(--spacing-sm);
  }
  
  .tickets-container {
    padding: 0 var(--spacing-xs);
  }
  
  .ticket-item {
    padding: var(--spacing-sm);
  }
}

/* 无障碍 */
@media (prefers-reduced-motion: reduce) {
  .ticket-item:hover {
    transform: none;
  }
  
  .create-button:hover,
  .empty-action:hover {
    transform: none;
  }
  
  .ticket-item:hover .arrow-icon {
    transform: none;
  }
  
  .animate-slide-up {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .tickets-list {
    background-color: var(--bg-color);
  }
  
  .page-header,
  .filter-section,
  .ticket-item,
  .empty-state {
    background-color: var(--white);
  }
  
  .meta-item {
    background-color: var(--bg-color);
  }
}
</style>