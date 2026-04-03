<template>
  <div class="terminal-select bg-gradient">
    <div class="container">
      <div class="logo text-center mb-5">
        <h1 class="text-3xl font-bold text-white">泛家居营销SAAS平台</h1>
        <p class="text-white text-opacity-80 mt-2">专业的泛家居门店营销管理系统</p>
      </div>
      <div class="terminal-list">
        <div
          v-for="terminal in terminals"
          :key="terminal.id"
          class="terminal-card card mb-4"
          @click="selectTerminal(terminal.id)"
        >
          <div class="terminal-content flex items-center p-4">
            <div class="terminal-icon" :class="terminal.id">
              <van-icon :name="terminal.icon" size="24" />
            </div>
            <div class="terminal-info ml-4 flex-1">
              <h3 class="text-xl font-semibold text-title">{{ terminal.name }}</h3>
              <p class="text-secondary mt-1">{{ terminal.desc }}</p>
            </div>
            <van-icon name="arrow" size="20" color="#909399" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Setting, Shop, User } from '@element-plus/icons-vue'

const router = useRouter()

const terminals = ref([
  {
    id: 'headquarters',
    name: '总部运营端',
    desc: '总部管理、数据统计、系统配置',
    icon: 'setting-o'
  },
  {
    id: 'store',
    name: '门店管理端',
    desc: '门店运营、员工管理、业绩分析',
    icon: 'shop-o'
  },
  {
    id: 'guide',
    name: '导购移动端',
    desc: '客户管理、产品展示、销售工具',
    icon: 'user-o'
  },
])

const selectTerminal = (terminalId) => {
  // 存储选择的终端类型
  localStorage.setItem('selectedTerminal', terminalId)
  // 跳转到登录页面
  router.push('/login')
}
</script>

<style scoped>
.terminal-select {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: var(--spacing-xl) 0;
}

.container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.terminal-card {
  transition: all var(--transition-normal);
  cursor: pointer;
  overflow: hidden;
}

.terminal-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.terminal-content {
  transition: all var(--transition-fast);
}

.terminal-card:hover .terminal-content {
  background-color: #F9FAFC;
}

.terminal-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.terminal-icon.headquarters {
  background-color: var(--info-color);
}

.terminal-icon.store {
  background-color: var(--success-color);
}

.terminal-icon.guide {
  background-color: var(--warning-color);
}

.terminal-info {
  flex: 1;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .terminal-select {
    padding: var(--spacing-lg) 0;
  }
  
  .container {
    padding: 0 var(--spacing-sm);
  }
  
  .logo h1 {
    font-size: var(--font-size-2xl);
  }
  
  .terminal-icon {
    width: 48px;
    height: 48px;
  }
}
</style>