<template>
  <div class="guide-layout">
    <div class="main-content">
      <router-view />
    </div>
    <div class="bottom-nav">
      <div 
        class="nav-item" 
        :class="{ active: $route.path === '/guide/dashboard' }"
        @click="navigateTo('/guide/dashboard')"
      >
        <div class="nav-icon home"></div>
        <span class="nav-text">工作台</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: $route.path === '/guide/products' }"
        @click="navigateTo('/guide/products')"
      >
        <div class="nav-icon products"></div>
        <span class="nav-text">产品库</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: $route.path === '/guide/cases' }"
        @click="navigateTo('/guide/cases')"
      >
        <div class="nav-icon cases"></div>
        <span class="nav-text">案例库</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: $route.path === '/guide/customers' }"
        @click="navigateTo('/guide/customers')"
      >
        <div class="nav-icon customers"></div>
        <span class="nav-text">客户</span>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: $route.path === '/guide/profile' }"
        @click="navigateTo('/guide/profile')"
      >
        <div class="nav-icon profile"></div>
        <span class="nav-text">我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.guide-layout {
  width: 375px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  margin: 0 auto;
  overflow-x: hidden;
  position: relative;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 50px;
}

/* 底部导航栏 */
.bottom-nav {
  width: 375px;
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: #969799;
  transition: all 0.3s ease;
}

.nav-item.active {
  color: #667eea;
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* 图标样式 */
.nav-icon.home {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9l-3-1.62L12 3z"/></svg>');
}

.nav-icon.products {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 12H6v-2h13v2zm0-3H6V9h13v2zm0-3H6V6h13v2z"/></svg>');
}

.nav-icon.cases {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>');
}

.nav-icon.customers {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
}

.nav-icon.profile {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
}

.nav-text {
  font-size: 12px;
}
</style>