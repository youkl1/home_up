<template>
  <div class="headquarters-layout">
    <el-container>
      <el-aside width="200px">
        <div class="logo">
          <h2>总部运营</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          router
        >
          <el-menu-item index="/headquarters/home">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-sub-menu index="resources">
            <template #title>
              <el-icon><GoodsFilled /></el-icon>
              <span>资源管理</span>
            </template>
            <el-menu-item index="/headquarters/products">
              <el-icon><GoodsFilled /></el-icon>
              <span>产品管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/cases">
              <el-icon><Camera /></el-icon>
              <span>案例管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/scripts">
              <el-icon><Message /></el-icon>
              <span>话术库</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/materials">
              <el-icon><Camera /></el-icon>
              <span>素材库</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="customer">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>客户管理</span>
            </template>
            <el-menu-item index="/headquarters/customers">
              <el-icon><UserFilled /></el-icon>
              <span>客户列表</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/ocean">
              <el-icon><DataAnalysis /></el-icon>
              <span>公海客资</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/transfer">
              <el-icon><User /></el-icon>
              <span>资产交接</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="organization">
            <template #title>
              <el-icon><User /></el-icon>
              <span>组织管理</span>
            </template>
            <el-menu-item index="/headquarters/users">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/stores">
              <el-icon><HomeFilled /></el-icon>
              <span>门店管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/logs">
              <el-icon><Document /></el-icon>
              <span>操作日志</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="finance">
            <template #title>
              <el-icon><Money /></el-icon>
              <span>财务结算</span>
            </template>
            <el-menu-item index="/headquarters/finance">
              <el-icon><PieChart /></el-icon>
              <span>财务总览</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/finance/reconciliation">
              <el-icon><DataAnalysis /></el-icon>
              <span>门店对账</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/finance/rebate">
              <el-icon><DataAnalysis /></el-icon>
              <span>返利核算</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/finance/deposit">
              <el-icon><WarningFilled /></el-icon>
              <span>保证金管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/finance/invoice">
              <el-icon><Document /></el-icon>
              <span>发票管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="service">
            <template #title>
              <el-icon><Tools /></el-icon>
              <span>安装服务</span>
            </template>
            <el-menu-item index="/headquarters/service">
              <el-icon><PieChart /></el-icon>
              <span>服务总览</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/service/workers">
              <el-icon><UserFilled /></el-icon>
              <span>师傅库管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/service/orders">
              <el-icon><Ticket /></el-icon>
              <span>工单总控</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/service/quality">
              <el-icon><WarningFilled /></el-icon>
              <span>质量监管</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/service/reviews">
              <el-icon><Star /></el-icon>
              <span>评价管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="compliance">
            <template #title>
              <el-icon><WarningFilled /></el-icon>
              <span>品牌合规</span>
            </template>
            <el-menu-item index="/headquarters/compliance">
              <el-icon><Document /></el-icon>
              <span>内容审核</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/compliance/pricing">
              <el-icon><Money /></el-icon>
              <span>价格体系</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/compliance/warnings">
              <el-icon><WarningFilled /></el-icon>
              <span>合规预警</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="supply">
            <template #title>
              <el-icon><Box /></el-icon>
              <span>供应链</span>
            </template>
            <el-menu-item index="/headquarters/supply">
              <el-icon><PieChart /></el-icon>
              <span>供应链总览</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/supply/production">
              <el-icon><Clock /></el-icon>
              <span>生产进度</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/supply/inventory">
              <el-icon><Box /></el-icon>
              <span>库存管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/supply/logistics">
              <el-icon><Message /></el-icon>
              <span>物流跟踪</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/supply/suppliers">
              <el-icon><UserFilled /></el-icon>
              <span>供应商</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="franchise">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>加盟商</span>
            </template>
            <el-menu-item index="/headquarters/franchise">
              <el-icon><PieChart /></el-icon>
              <span>招商总览</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/franchise/intents">
              <el-icon><Message /></el-icon>
              <span>意向管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/franchise/process">
              <el-icon><Calendar /></el-icon>
              <span>流程配置</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/franchise/contracts">
              <el-icon><Document /></el-icon>
              <span>签约管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/franchise/policies">
              <el-icon><Promotion /></el-icon>
              <span>扶持政策</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="purchase">
            <template #title>
              <el-icon><ShoppingCart /></el-icon>
              <span>采购商城</span>
            </template>
            <el-menu-item index="/headquarters/purchase">
              <el-icon><PieChart /></el-icon>
              <span>采购总览</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/purchase/products">
              <el-icon><GoodsFilled /></el-icon>
              <span>商品管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/purchase/orders">
              <el-icon><Ticket /></el-icon>
              <span>订单管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/purchase/suppliers">
              <el-icon><UserFilled /></el-icon>
              <span>供应商管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="training">
            <template #title>
              <el-icon><Reading /></el-icon>
              <span>培训赋能</span>
            </template>
            <el-menu-item index="/headquarters/training">
              <el-icon><PieChart /></el-icon>
              <span>培训总览</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/training/courses">
              <el-icon><Reading /></el-icon>
              <span>线上课程</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/training/system">
              <el-icon><School /></el-icon>
              <span>培训体系</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/training/activities">
              <el-icon><Calendar /></el-icon>
              <span>线下活动</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="marketing">
            <template #title>
              <el-icon><Promotion /></el-icon>
              <span>营销工具</span>
            </template>
            <el-menu-item index="/headquarters/marketing/tools">
              <el-icon><Tools /></el-icon>
              <span>工具配置</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/marketing/activities">
              <el-icon><Calendar /></el-icon>
              <span>活动管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/marketing/community">
              <el-icon><Message /></el-icon>
              <span>社群管控</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/marketing/sms">
              <el-icon><Cellphone /></el-icon>
              <span>短信通道</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="data">
            <template #title>
              <el-icon><DataAnalysis /></el-icon>
              <span>数据运营</span>
            </template>
            <el-menu-item index="/headquarters/data/analysis">
              <el-icon><DataAnalysis /></el-icon>
              <span>数据分析</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/data/reports">
              <el-icon><Document /></el-icon>
              <span>自定义报表</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/data/alerts">
              <el-icon><WarningFilled /></el-icon>
              <span>异常预警</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="settings">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </template>
            <el-menu-item index="/headquarters/settings">
              <el-icon><View /></el-icon>
              <span>系统总览</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/settings/platform">
              <el-icon><Platform /></el-icon>
              <span>平台信息</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/settings/menu">
              <el-icon><Menu /></el-icon>
              <span>菜单管理</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/settings/dictionary">
              <el-icon><Document /></el-icon>
              <span>字典配置</span>
            </el-menu-item>
            <el-menu-item index="/headquarters/settings/log">
              <el-icon><DocumentCopy /></el-icon>
              <span>日志管理</span>
            </el-menu-item>
          </el-sub-menu>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { HomeFilled, GoodsFilled, UserFilled, User, Menu, Setting, Money, Tools, WarningFilled, Box, ShoppingCart, Reading, Promotion, DataAnalysis, View, Platform, Document, DocumentCopy, Folder, Message, Ticket, Star, Camera, PieChart, Calendar, Cellphone, Clock, School } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const collapse = ref(false)

const activeMenu = computed(() => {
  return router.currentRoute.value.path
})

const collapseMenu = () => {
  collapse.value = !collapse.value
}

const logout = () => {
  userStore.logout()
  router.push('/terminal-select')
}
</script>

<style scoped>
.headquarters-layout {
  height: 100vh;
  background-color: #f0f2f5;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #67c23a;
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