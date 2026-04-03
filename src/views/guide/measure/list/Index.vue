<template>
  <div class="measure-list">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">我的量房</h1>
      <div class="header-right">
        <van-button size="small" @click="createMeasure">新建量房</van-button>
      </div>
    </div>
    
    <!-- 筛选器 -->
    <div class="filter-section">
      <van-dropdown-menu>
        <van-dropdown-item v-model="status" :options="statusOptions" placeholder="状态" />
        <van-dropdown-item v-model="dateRange" :options="dateOptions" placeholder="时间" />
      </van-dropdown-menu>
      <van-search
        v-model="searchQuery"
        placeholder="搜索客户名称"
        @search="handleSearch"
      />
    </div>
    
    <!-- 量房列表 -->
    <div class="measure-items">
      <div 
        v-for="item in measureList" 
        :key="item.id"
        class="measure-item"
        @click="viewDetail(item.id)"
      >
        <div class="measure-header">
          <h3 class="customer-name">{{ item.customerName }}</h3>
          <span :class="['status-badge', item.status]">{{ item.statusText }}</span>
        </div>
        <div class="measure-info">
          <div class="info-item">
            <span class="info-label">量房地址:</span>
            <span class="info-value">{{ item.address }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">预约时间:</span>
            <span class="info-value">{{ item.appointmentTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">量房师傅:</span>
            <span class="info-value">{{ item.installerName }}</span>
          </div>
        </div>
        <div class="measure-footer">
          <span class="create-time">{{ item.createTime }}</span>
          <div class="action-buttons">
            <van-button size="small" @click.stop="editMeasure(item.id)">编辑</van-button>
            <van-button size="small" type="primary" @click.stop="shareReport(item.id)">分享报告</van-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="measureList.length === 0" class="empty-state">
      <img src="/src/assets/images/placeholder.png" alt="空状态" class="empty-image" />
      <p class="empty-text">暂无量房任务</p>
      <van-button type="primary" @click="createMeasure">新建量房</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态选项
const statusOptions = [
  { text: '全部', value: 'all' },
  { text: '待量房', value: 'pending' },
  { text: '已完成', value: 'completed' },
  { text: '已取消', value: 'cancelled' }
]

// 日期选项
const dateOptions = [
  { text: '全部时间', value: 'all' },
  { text: '今日', value: 'today' },
  { text: '本周', value: 'week' },
  { text: '本月', value: 'month' }
]

// 当前筛选条件
const status = ref('all')
const dateRange = ref('all')
const searchQuery = ref('')

// 量房列表数据
const measureList = ref([
  {
    id: 1,
    customerName: '张三',
    address: '北京市朝阳区某某小区1号楼2单元301',
    appointmentTime: '2026-04-05 14:00',
    installerName: '李师傅',
    createTime: '2026-04-03 10:00',
    status: 'pending',
    statusText: '待量房'
  },
  {
    id: 2,
    customerName: '李四',
    address: '北京市海淀区某某大厦5层',
    appointmentTime: '2026-04-04 09:30',
    installerName: '王师傅',
    createTime: '2026-04-02 16:00',
    status: 'completed',
    statusText: '已完成'
  },
  {
    id: 3,
    customerName: '王五',
    address: '北京市西城区某某胡同10号',
    appointmentTime: '2026-04-06 10:00',
    installerName: '赵师傅',
    createTime: '2026-04-01 14:30',
    status: 'pending',
    statusText: '待量房'
  }
])

// 返回上一页
const goBack = () => {
  router.back()
}

// 新建量房
const createMeasure = () => {
  router.push('/guide/measure/create')
}

// 查看详情
const viewDetail = (id) => {
  router.push(`/guide/measure/detail/${id}`)
}

// 编辑量房
const editMeasure = (id) => {
  router.push(`/guide/measure/create?id=${id}`)
}

// 分享报告
const shareReport = (id) => {
  // 这里可以实现分享报告功能
  console.log('分享报告', id)
}

// 搜索
const handleSearch = (value) => {
  // 这里可以实现搜索功能
  console.log('搜索', value)
}
</script>

<style scoped>
.measure-list {
  width: 375px;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: white;
  padding: 0 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 20px;
  height: 20px;
  color: #333;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-right {
  width: 80px;
}

.filter-section {
  background-color: white;
  padding: 10px 15px;
  margin-bottom: 10px;
}

.measure-items {
  padding: 0 15px;
}

.measure-item {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.measure-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.measure-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.customer-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.status-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.status-badge.pending {
  background-color: #fff2e8;
  color: #fa8c16;
}

.status-badge.completed {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-badge.cancelled {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.measure-info {
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-label {
  color: #666;
  margin-right: 8px;
  min-width: 70px;
}

.info-value {
  color: #333;
  flex: 1;
}

.measure-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.create-time {
  font-size: 12px;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-image {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin: 0 0 20px 0;
}
</style>