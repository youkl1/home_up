<template>
  <div class="plans-page">
    <!-- 顶部导航 -->
    <div class="top-nav bg-gradient">
      <div class="nav-icon back" @click="goBack"></div>
      <h1 class="text-lg font-bold text-white">我的方案</h1>
      <div class="nav-icon add" @click="createPlan"></div>
    </div>
    
    <!-- 方案统计 -->
    <div class="plans-stats card mt-4 px-4">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ planStats.total }}</div>
          <div class="stat-label">方案总数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ planStats.pending }}</div>
          <div class="stat-label">待确认</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ planStats.confirmed }}</div>
          <div class="stat-label">已确认</div>
        </div>
      </div>
    </div>
    
    <!-- 方案列表 -->
    <div class="plans-list card mt-4 px-4">
      <h3 class="section-title">方案列表</h3>
      <div class="plan-items">
        <div v-for="plan in planList" :key="plan.id" class="plan-item" @click="viewPlanDetail(plan.id)">
          <div class="plan-header">
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-status" :class="plan.status">{{ plan.statusText }}</div>
          </div>
          <div class="plan-products">
            <div v-for="product in plan.products" :key="product.id" class="product-item">
              <img :src="product.image" :alt="product.name" class="product-image">
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-price">¥{{ formatNumber(product.price) }}</div>
              </div>
              <div class="product-quantity">x{{ product.quantity }}</div>
            </div>
          </div>
          <div class="plan-footer">
            <div class="plan-total">合计: <span class="total-amount">¥{{ formatNumber(plan.totalAmount) }}</span></div>
            <div class="plan-time">{{ plan.createTime }}</div>
          </div>
        </div>
        <div v-if="planList.length === 0" class="no-plans">暂无方案</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 方案统计数据
const planStats = ref({
  total: 3,
  pending: 2,
  confirmed: 1
})

// 方案列表
const planList = ref([
  {
    id: 1,
    name: '张女士-橱柜方案',
    status: 'pending',
    statusText: '待确认',
    createTime: '2026-04-01 14:30',
    totalAmount: 45800,
    products: [
      {
        id: 1,
        name: '现代简约橱柜',
        price: 12800,
        quantity: 2,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20kitchen%20cabinet&image_size=square'
      },
      {
        id: 2,
        name: '不锈钢五金件',
        price: 2300,
        quantity: 3,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stainless%20steel%20hardware%20parts&image_size=square'
      }
    ]
  },
  {
    id: 2,
    name: '李先生-全屋定制方案',
    status: 'confirmed',
    statusText: '已确认',
    createTime: '2026-03-31 10:15',
    totalAmount: 68000,
    products: [
      {
        id: 1,
        name: '现代简约橱柜',
        price: 12800,
        quantity: 1,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20simple%20kitchen%20cabinet&image_size=square'
      },
      {
        id: 2,
        name: '欧式衣柜',
        price: 18600,
        quantity: 2,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=european%20style%20wardrobe&image_size=square'
      },
      {
        id: 3,
        name: '智能卫浴柜',
        price: 8900,
        quantity: 2,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20bathroom%20cabinet&image_size=square'
      }
    ]
  },
  {
    id: 3,
    name: '王女士-衣柜方案',
    status: 'pending',
    statusText: '待确认',
    createTime: '2026-03-30 16:45',
    totalAmount: 18600,
    products: [
      {
        id: 1,
        name: '欧式衣柜',
        price: 18600,
        quantity: 1,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=european%20style%20wardrobe&image_size=square'
      }
    ]
  }
])

// 返回上一页
const goBack = () => {
  router.back()
}

// 创建新方案
const createPlan = () => {
  alert('创建新方案功能开发中')
}

// 查看方案详情
const viewPlanDetail = (planId) => {
  alert(`查看方案详情: ${planId}`)
}

// 格式化数字
const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-CN').format(num)
}

// 组件挂载
onMounted(() => {
  // 从localStorage获取方案数据
  const savedPlans = JSON.parse(localStorage.getItem('planItems') || '[]')
  if (savedPlans.length > 0) {
    // 合并本地存储的方案
    console.log('从localStorage加载方案:', savedPlans)
  }
})
</script>

<style scoped>
.plans-page {
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

.nav-icon.add {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>');
}

.plans-stats,
.plans-list {
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

.section-title {
  font-size: var(--font-size-base);
  font-weight: bold;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
}

.plan-items {
  padding-top: var(--spacing-sm);
}

.plan-item {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  background-color: #F9FAFC;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.plan-item:hover {
  background-color: #F0F2FF;
}

.plan-item:last-child {
  margin-bottom: 0;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.plan-name {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
}

.plan-status {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: 10px;
  color: white;
}

.plan-status.pending {
  background-color: var(--warning-color);
}

.plan-status.confirmed {
  background-color: var(--success-color);
}

.plan-products {
  margin-bottom: var(--spacing-md);
}

.product-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--border-color-light);
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-sm);
  object-fit: cover;
  margin-right: var(--spacing-sm);
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  margin-bottom: 2px;
}

.product-price {
  font-size: var(--font-size-sm);
  color: var(--danger-color);
  font-weight: 500;
}

.product-quantity {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.plan-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-color-light);
}

.plan-total {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.total-amount {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: var(--danger-color);
}

.plan-time {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.no-plans {
  text-align: center;
  padding: var(--spacing-xl);
  font-size: var(--font-size-base);
  color: var(--text-secondary);
}

@media screen and (max-width: 375px) {
  .plans-stats,
  .plans-list {
    width: 100%;
  }
}
</style>