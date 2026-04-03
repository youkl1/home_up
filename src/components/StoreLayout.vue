<template>
  <div class="store-layout">
    <el-container>
      <el-aside width="200px">
        <div class="logo">
          <h2>门店管理</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          :default-openeds="defaultOpeneds"
          :collapse="collapse"
          class="store-menu"
          router
          @select="handleMenuSelect"
          @open="handleMenuOpen"
          @close="handleMenuClose"
        >
          <!-- 首页 -->
          <el-menu-item index="/store/home">
            <el-icon><HomeFilled /></el-icon>
            <span>工作台</span>
          </el-menu-item>

          <!-- 数据看板 -->
          <el-menu-item index="/store/dashboard" @click="handleMenuItemClick('/store/dashboard')">
            <el-icon><TrendCharts /></el-icon>
            <span>经营数据</span>
          </el-menu-item>

          <!-- 客户管理 -->
          <el-sub-menu index="customers" @click="handleSubMenuClick('customers')">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>客户管理</span>
            </template>
            <el-menu-item index="/store/customers" @click="handleMenuItemClick('/store/customers')">客户列表</el-menu-item>
            <el-menu-item index="/store/customers/assign" @click="handleMenuItemClick('/store/customers/assign')">客资分配</el-menu-item>
            <el-menu-item index="/store/customers/follow" @click="handleMenuItemClick('/store/customers/follow')">跟进监管</el-menu-item>
            <el-menu-item index="/store/customers/behavior" @click="handleMenuItemClick('/store/customers/behavior')">行为轨迹</el-menu-item>
          </el-sub-menu>

          <!-- 订单管理 -->
          <el-sub-menu index="orders" @click="handleSubMenuClick('orders')">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/store/orders/overview" @click="handleMenuItemClick('/store/orders/overview')">订单总览</el-menu-item>
            <el-menu-item index="/store/orders/list" @click="handleMenuItemClick('/store/orders/list')">订单列表</el-menu-item>
            <el-menu-item index="/store/orders/production" @click="handleMenuItemClick('/store/orders/production')">生产进度</el-menu-item>
            <el-menu-item index="/store/orders/delivery" @click="handleMenuItemClick('/store/orders/delivery')">交付管理</el-menu-item>
          </el-sub-menu>

          <!-- 售后服务 -->
          <el-sub-menu index="service" @click="handleSubMenuClick('service')">
            <template #title>
              <el-icon><Service /></el-icon>
              <span>售后服务</span>
            </template>
            <el-menu-item index="/store/service/overview" @click="handleMenuItemClick('/store/service/overview')">工单总览</el-menu-item>
            <el-menu-item index="/store/service/list" @click="handleMenuItemClick('/store/service/list')">工单列表</el-menu-item>
            <el-menu-item index="/store/service/reviews" @click="handleMenuItemClick('/store/service/reviews')">客户评价</el-menu-item>
          </el-sub-menu>

          <!-- 安装师傅 -->
          <el-sub-menu index="installers" @click="handleSubMenuClick('installers')">
            <template #title>
              <el-icon><User /></el-icon>
              <span>安装师傅</span>
            </template>
            <el-menu-item index="/store/installers/info" @click="handleMenuItemClick('/store/installers/info')">师傅信息</el-menu-item>
            <el-menu-item index="/store/installers/dispatch" @click="handleMenuItemClick('/store/installers/dispatch')">工单派发</el-menu-item>
            <el-menu-item index="/store/installers/quality" @click="handleMenuItemClick('/store/installers/quality')">服务质量</el-menu-item>
          </el-sub-menu>

          <!-- 转介绍管理 -->
          <el-sub-menu index="referral" @click="handleSubMenuClick('referral')">
            <template #title>
              <el-icon><Share /></el-icon>
              <span>转介绍管理</span>
            </template>
            <el-menu-item index="/store/referral/overview" @click="handleMenuItemClick('/store/referral/overview')">转介绍总览</el-menu-item>
            <el-menu-item index="/store/referral/records" @click="handleMenuItemClick('/store/referral/records')">记录管理</el-menu-item>
            <el-menu-item index="/store/referral/rewards" @click="handleMenuItemClick('/store/referral/rewards')">奖励核算</el-menu-item>
            <el-menu-item index="/store/referral/statistics" @click="handleMenuItemClick('/store/referral/statistics')">数据统计</el-menu-item>
          </el-sub-menu>

          <!-- 营销活动 -->
          <el-sub-menu index="marketing" @click="handleSubMenuClick('marketing')">
            <template #title>
              <el-icon><Promotion /></el-icon>
              <span>营销活动</span>
            </template>
            <el-menu-item index="/store/marketing/headquarters" @click="handleMenuItemClick('/store/marketing/headquarters')">总部活动</el-menu-item>
            <el-menu-item index="/store/marketing/store" @click="handleMenuItemClick('/store/marketing/store')">门店活动</el-menu-item>
            <el-menu-item index="/store/marketing/data" @click="handleMenuItemClick('/store/marketing/data')">营销数据</el-menu-item>
            <el-menu-item index="/store/marketing/sms" @click="handleMenuItemClick('/store/marketing/sms')">短信群发</el-menu-item>
          </el-sub-menu>

          <!-- 财务管理 -->
          <el-sub-menu index="finance" @click="handleSubMenuClick('finance')">
            <template #title>
              <el-icon><Money /></el-icon>
              <span>财务管理</span>
            </template>
            <el-menu-item index="/store/finance/overview" @click="handleMenuItemClick('/store/finance/overview')">财务总览</el-menu-item>
            <el-menu-item index="/store/finance/reconciliation" @click="handleMenuItemClick('/store/finance/reconciliation')">总部对账</el-menu-item>
            <el-menu-item index="/store/finance/receivables" @click="handleMenuItemClick('/store/finance/receivables')">客户收款</el-menu-item>
            <el-menu-item index="/store/finance/invoices" @click="handleMenuItemClick('/store/finance/invoices')">发票申请</el-menu-item>
          </el-sub-menu>

          <!-- 采购商城 -->
          <el-sub-menu index="purchase" @click="handleSubMenuClick('purchase')">
            <template #title>
              <el-icon><ShoppingCart /></el-icon>
              <span>采购商城</span>
            </template>
            <el-menu-item index="/store/purchase/products" @click="handleMenuItemClick('/store/purchase/products')">商品浏览</el-menu-item>
            <el-menu-item index="/store/purchase/cart" @click="handleMenuItemClick('/store/purchase/cart')">采购车</el-menu-item>
            <el-menu-item index="/store/purchase/orders" @click="handleMenuItemClick('/store/purchase/orders')">采购订单</el-menu-item>
            <el-menu-item index="/store/purchase/aftersales" @click="handleMenuItemClick('/store/purchase/aftersales')">售后申请</el-menu-item>
          </el-sub-menu>

          <!-- 团队管理 -->
          <el-sub-menu index="users" @click="handleSubMenuClick('users')">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>团队管理</span>
            </template>
            <el-menu-item index="/store/users" @click="handleMenuItemClick('/store/users')">员工列表</el-menu-item>
            <el-menu-item index="/store/users/guide-accounts" @click="handleMenuItemClick('/store/users/guide-accounts')">导购账号</el-menu-item>
            <el-menu-item index="/store/users/resignation" @click="handleMenuItemClick('/store/users/resignation')">离职交接</el-menu-item>
            <el-menu-item index="/store/users/operation-logs" @click="handleMenuItemClick('/store/users/operation-logs')">操作日志</el-menu-item>
          </el-sub-menu>

          <!-- 培训与业绩 -->
          <el-menu-item index="/store/training" @click="handleMenuItemClick('/store/training')">
            <el-icon><Reading /></el-icon>
            <span>培训与业绩</span>
          </el-menu-item>

          <!-- 门店配置 -->
          <el-menu-item index="/store/settings" @click="handleMenuItemClick('/store/settings')">
            <el-icon><Setting /></el-icon>
            <span>门店配置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-left">
            <el-button link @click="collapseMenu">
              <el-icon><Menu /></el-icon>
            </el-button>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user">
                <el-avatar>U</el-avatar>
                <span>测试用户</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../store/user'
import { HomeFilled, UserFilled, User, Avatar, Menu, Document, Money, Service, Share, Promotion, ShoppingCart, TrendCharts, Reading, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const collapse = ref(false)
const defaultOpeneds = ref([])

const activeMenu = computed(() => {
  console.log('[StoreLayout] 当前激活菜单:', route.path)
  return route.path
})

// 根据当前路由自动展开对应的子菜单
watch(() => route.path, (newPath) => {
  console.log('[StoreLayout] 路由变化:', newPath)
  if (newPath.includes('/store/users/')) {
    defaultOpeneds.value = ['users']
  } else if (newPath.includes('/store/customers/')) {
    defaultOpeneds.value = ['customers']
  } else if (newPath.includes('/store/orders/')) {
    defaultOpeneds.value = ['orders']
  } else if (newPath.includes('/store/finance/')) {
    defaultOpeneds.value = ['finance']
  } else if (newPath.includes('/store/service/')) {
    defaultOpeneds.value = ['service']
  } else if (newPath.includes('/store/installers/')) {
    defaultOpeneds.value = ['installers']
  } else if (newPath.includes('/store/referral/')) {
    defaultOpeneds.value = ['referral']
  } else if (newPath.includes('/store/purchase/')) {
    defaultOpeneds.value = ['purchase']
  } else if (newPath.includes('/store/marketing/')) {
    defaultOpeneds.value = ['marketing']
  } else {
    defaultOpeneds.value = []
  }
  console.log('[StoreLayout] 展开的菜单:', defaultOpeneds.value)
}, { immediate: true })

// 菜单选择事件
const handleMenuSelect = (index, indexPath) => {
  console.log('[StoreLayout] 菜单选择:', index, indexPath)
}

// 菜单展开事件
const handleMenuOpen = (index) => {
  console.log('[StoreLayout] 菜单展开:', index)
}

// 菜单关闭事件
const handleMenuClose = (index) => {
  console.log('[StoreLayout] 菜单关闭:', index)
}

// 子菜单点击事件
const handleSubMenuClick = (index) => {
  console.log('[StoreLayout] 子菜单点击:', index)
}

// 菜单项点击事件
const handleMenuItemClick = (index) => {
  console.log('[StoreLayout] 菜单项点击:', index)
}

const collapseMenu = () => {
  collapse.value = !collapse.value
}

const logout = () => {
  userStore.logout()
  router.push('/terminal-select')
}

// 组件挂载时打印日志
console.log('[StoreLayout] 组件挂载')
console.log('[StoreLayout] 当前路由:', route.path)
</script>

<style scoped>
.store-layout {
  height: 100vh;
  background-color: #f0f2f5;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #409eff;
  margin-bottom: 20px;
}

.logo h2 {
  font-size: 18px;
  margin: 0;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
}

.user {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user span {
  margin-left: 10px;
}

.el-main {
  padding: 20px;
}
</style>
