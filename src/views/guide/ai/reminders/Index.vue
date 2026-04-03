<template>
  <div class="ai-reminders">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">智能跟进提醒</h1>
      <div class="header-right"></div>
    </div>
    
    <!-- 提醒列表 -->
    <div class="reminder-list">
      <div 
        v-for="(reminder, index) in reminders" 
        :key="index"
        class="reminder-item"
      >
        <div class="reminder-header">
          <h3 class="customer-name">{{ reminder.customerName }}</h3>
          <span :class="['priority-badge', reminder.priority]">{{ reminder.priorityText }}</span>
        </div>
        <div class="reminder-content">
          <p class="reminder-text">{{ reminder.content }}</p>
          <div class="reminder-meta">
            <span class="reminder-time">{{ reminder.remindTime }}</span>
            <span class="reminder-reason">{{ reminder.reason }}</span>
          </div>
        </div>
        <div class="reminder-actions">
          <van-button size="small" @click="setFollowPlan(reminder.id)">设置计划</van-button>
          <van-button size="small" type="primary" @click="contactCustomer(reminder.id)">联系客户</van-button>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="reminders.length === 0" class="empty-state">
      <img src="/src/assets/images/placeholder.png" alt="空状态" class="empty-image" />
      <p class="empty-text">暂无跟进提醒</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 提醒数据
const reminders = ref([
  {
    id: 1,
    customerName: '张三',
    content: '客户已3天未联系，建议主动跟进，上次关注的沙发有新优惠',
    priority: 'high',
    priorityText: '高优先级',
    remindTime: '今天 14:30',
    reason: '浏览频次高'
  },
  {
    id: 2,
    customerName: '李四',
    content: '客户上周咨询了定制衣柜，建议跟进具体需求',
    priority: 'medium',
    priorityText: '中优先级',
    remindTime: '明天 10:00',
    reason: '近期有浏览'
  },
  {
    id: 3,
    customerName: '王五',
    content: '客户对美式风格家具感兴趣，建议发送相关案例',
    priority: 'low',
    priorityText: '低优先级',
    remindTime: '后天 09:00',
    reason: '风格匹配'
  }
])

// 返回上一页
const goBack = () => {
  router.back()
}

// 设置跟进计划
const setFollowPlan = (id) => {
  // 这里可以实现设置跟进计划功能
  console.log('设置跟进计划', id)
}

// 联系客户
const contactCustomer = (id) => {
  // 这里可以实现联系客户功能
  console.log('联系客户', id)
}
</script>

<style scoped>
.ai-reminders {
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
  width: 40px;
}

.reminder-list {
  padding: 0 15px;
}

.reminder-item {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.reminder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.customer-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.priority-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.priority-badge.high {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.priority-badge.medium {
  background-color: #fff2e8;
  color: #fa8c16;
}

.priority-badge.low {
  background-color: #f6ffed;
  color: #52c41a;
}

.reminder-content {
  margin-bottom: 12px;
}

.reminder-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin: 0 0 8px 0;
}

.reminder-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.reminder-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
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
  margin: 0;
}
</style>