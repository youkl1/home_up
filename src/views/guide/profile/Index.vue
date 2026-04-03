<template>
  <div class="guide-profile">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <h1 class="text-lg font-bold text-white">个人中心</h1>
    </div>
    
    <!-- 用户信息 -->
    <div class="user-info card mt-4 px-4">
      <div class="user-header flex items-center">
        <div class="user-avatar">{{ userInfo.name.charAt(0) }}</div>
        <div class="user-details ml-4 flex-1">
          <h2 class="user-name font-bold">{{ userInfo.name }}</h2>
          <p class="user-phone mt-1">{{ userInfo.phone }}</p>
          <p class="user-role mt-1">{{ userInfo.role }}</p>
        </div>
      </div>
    </div>
    
    <!-- 功能列表 -->
    <div class="function-list card mt-4 px-4">
      <div class="function-items">
        <div class="function-item" @click="viewPerformance">
          <div class="function-icon performance"></div>
          <div class="function-label">我的业绩</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="viewPlans">
          <div class="function-icon plans"></div>
          <div class="function-label">我的方案</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="viewTraining">
          <div class="function-icon training"></div>
          <div class="function-label">我的培训</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="viewSettings">
          <div class="function-icon settings"></div>
          <div class="function-label">设置</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="viewHelp">
          <div class="function-icon help"></div>
          <div class="function-label">帮助与反馈</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="viewAbout">
          <div class="function-icon about"></div>
          <div class="function-label">关于我们</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="navigateTo('电子合同')">
          <div class="function-icon contract"></div>
          <div class="function-label">电子合同</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="navigateTo('工单管理')">
          <div class="function-icon ticket"></div>
          <div class="function-label">工单管理</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="navigateTo('客户标签')">
          <div class="function-icon tag"></div>
          <div class="function-label">客户标签</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="navigateTo('表单工具')">
          <div class="function-icon form"></div>
          <div class="function-label">表单工具</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="navigateTo('量房管理')">
          <div class="function-icon measure"></div>
          <div class="function-label">量房管理</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="navigateTo('AI助手')">
          <div class="function-icon ai"></div>
          <div class="function-label">AI助手</div>
          <div class="function-arrow"></div>
        </div>
        <div class="function-item" @click="navigateTo('转介绍')">
          <div class="function-icon referral"></div>
          <div class="function-label">转介绍</div>
          <div class="function-arrow"></div>
        </div>
      </div>
    </div>
    
    <!-- 退出登录按钮 -->
    <div class="logout-section px-4 mt-6">
      <button class="logout-button" @click="logout">
        退出登录
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../../store/user'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = ref({
  name: '测试用户',
  phone: '138****1234',
  role: '导购员'
})

// 查看业绩
const viewPerformance = () => {
  router.push('/guide/profile/performance')
}

// 查看方案
const viewPlans = () => {
  router.push('/guide/profile/plans')
}

// 查看培训
const viewTraining = () => {
  router.push('/guide/profile/training')
}

// 查看设置
const viewSettings = () => {
  router.push('/guide/profile/settings')
}

// 查看帮助与反馈
const viewHelp = () => {
  router.push('/guide/profile/help')
}

// 查看关于我们
const viewAbout = () => {
  router.push('/guide/profile/about')
}

// 退出登录
const logout = () => {
  userStore.logout()
  router.push('/terminal-select')
}

// 导航到新增功能
const navigateTo = (path) => {
  const pathMap = {
    '电子合同': '/guide/contracts/list',
    '工单管理': '/guide/tickets/list',
    '客户标签': '/guide/tags/manage',
    '表单工具': '/guide/forms/templates',
    '量房管理': '/guide/measure/list',
    'AI助手': '/guide/ai/suggestions',
    '转介绍': '/guide/referral/rules'
  }
  router.push(pathMap[path] || '/guide/profile')
}

// 组件挂载
onMounted(() => {
  // 从store获取用户信息
  if (userStore.userInfo) {
    userInfo.value = {
      name: userStore.userInfo.name || '测试用户',
      phone: userStore.userInfo.phone || '138****1234',
      role: userStore.userInfo.role || '导购员'
    }
  }
})
</script>

<style scoped>
.guide-profile {
  width: 375px;
  min-height: 100vh;
  background-color: var(--bg-color);
  margin: 0 auto;
  overflow-x: hidden;
}

.top-nav {
  width: 375px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
  margin: 0 auto;
}

.user-info {
  padding: var(--spacing-md);
  margin: 0 auto;
  width: 375px;
}

.user-header {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.user-details {
  flex: 1;
  margin-left: var(--spacing-md);
}

.user-name {
  font-size: var(--font-size-xl);
  margin: 0;
  color: var(--text-primary);
}

.user-phone {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin: var(--spacing-xs) 0;
}

.user-role {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.function-list {
  padding: 0;
  margin: 0 auto;
  width: 375px;
}

.function-items {
  padding: 0;
  margin: 0;
  list-style: none;
}

.function-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color-light);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.function-item:last-child {
  border-bottom: none;
}

.function-item:hover {
  background-color: #F9FAFC;
}

.function-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: var(--spacing-md);
}

.function-icon.performance {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>');
}

.function-icon.plans {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>');
}

.function-icon.training {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>');
}

.function-icon.settings {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>');
}

.function-icon.help {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>');
}

.function-icon.about {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>');
}

.function-icon.contract {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>');
}

.function-icon.ticket {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>');
}

.function-icon.tag {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h7V2H7v5z"/></svg>');
}

.function-icon.form {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>');
}

.function-icon.measure {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>');
}

.function-icon.ai {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
}

.function-icon.referral {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>');
}

.function-label {
  flex: 1;
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.function-arrow {
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23969799"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.logout-section {
  margin: 0 auto;
  width: 375px;
}

.logout-button {
  width: 100%;
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.logout-button:hover {
  background-color: var(--danger-color-dark);
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .user-info,
  .function-list,
  .logout-section {
    width: 100%;
  }
  
  .user-avatar {
    width: 56px;
    height: 56px;
    font-size: 20px;
  }
}
</style>