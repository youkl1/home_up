<template>
  <div class="forms-statistics">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">表单数据</h1>
      <div class="header-right">
        <van-button size="small" @click="exportData">导出数据</van-button>
      </div>
    </div>
    
    <!-- 筛选器 -->
    <div class="filter-section">
      <van-dropdown-menu>
        <van-dropdown-item v-model="selectedForm" :options="formOptions" placeholder="选择表单" />
        <van-dropdown-item v-model="dateRange" :options="dateOptions" placeholder="选择时间" />
      </van-dropdown-menu>
    </div>
    
    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="stat-item">
        <div class="stat-value">{{ totalSubmissions }}</div>
        <div class="stat-label">总提交数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ todaySubmissions }}</div>
        <div class="stat-label">今日提交</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ totalForms }}</div>
        <div class="stat-label">表单数量</div>
      </div>
    </div>
    
    <!-- 数据列表 -->
    <div class="data-list">
      <div 
        v-for="item in formData" 
        :key="item.id"
        class="data-item"
        @click="viewDetails(item.id)"
      >
        <div class="data-header">
          <h3 class="form-name">{{ item.formName }}</h3>
          <span class="submit-time">{{ item.submitTime }}</span>
        </div>
        <div class="data-content">
          <div class="data-field" v-for="(field, index) in item.fields.slice(0, 3)" :key="index">
            <span class="field-label">{{ field.label }}:</span>
            <span class="field-value">{{ field.value }}</span>
          </div>
          <div v-if="item.fields.length > 3" class="more-fields">
            还有 {{ item.fields.length - 3 }} 项内容
          </div>
        </div>
        <div class="data-footer">
          <span class="customer-info">{{ item.customerName }} {{ item.customerPhone }}</span>
          <van-button size="small" @click.stop="syncToCustomer(item.id)">
            同步客户
          </van-button>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="formData.length === 0" class="empty-state">
      <img src="../../../assets/images/placeholder.png" alt="空状态" class="empty-image" />
      <p class="empty-text">暂无表单数据</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单选项
const formOptions = [
  { text: '全部表单', value: 'all' },
  { text: '客户需求调研表', value: 'survey' },
  { text: '标准量房信息表', value: 'measurement' },
  { text: '订单确认表', value: 'order' }
]

// 日期选项
const dateOptions = [
  { text: '全部时间', value: 'all' },
  { text: '今日', value: 'today' },
  { text: '本周', value: 'week' },
  { text: '本月', value: 'month' },
  { text: '自定义', value: 'custom' }
]

// 当前选中的表单
const selectedForm = ref('all')

// 当前选中的日期范围
const dateRange = ref('all')

// 统计数据
const totalSubmissions = ref(156)
const todaySubmissions = ref(12)
const totalForms = ref(4)

// 表单数据
const formData = ref([
  {
    id: 1,
    formName: '客户需求调研表',
    submitTime: '2026-04-03 14:30',
    customerName: '张三',
    customerPhone: '138****8000',
    fields: [
      { label: '姓名', value: '张三' },
      { label: '联系电话', value: '13800138000' },
      { label: '户型', value: '三居室' },
      { label: '装修风格', value: '现代风格' },
      { label: '预算范围', value: '100-200万' }
    ]
  },
  {
    id: 2,
    formName: '标准量房信息表',
    submitTime: '2026-04-03 10:15',
    customerName: '李四',
    customerPhone: '139****9000',
    fields: [
      { label: '姓名', value: '李四' },
      { label: '联系电话', value: '13900139000' },
      { label: '量房地址', value: '北京市朝阳区某某小区' },
      { label: '房屋面积', value: '120㎡' }
    ]
  },
  {
    id: 3,
    formName: '订单确认表',
    submitTime: '2026-04-02 16:45',
    customerName: '王五',
    customerPhone: '137****7000',
    fields: [
      { label: '姓名', value: '王五' },
      { label: '联系电话', value: '13700137000' },
      { label: '订单编号', value: 'ORD20260402001' },
      { label: '产品名称', value: '现代风格沙发' },
      { label: '订单金额', value: '8999元' }
    ]
  }
])

// 返回上一页
const goBack = () => {
  router.back()
}

// 导出数据
const exportData = () => {
  // 这里可以实现导出数据功能
  console.log('导出数据')
}

// 查看详情
const viewDetails = (id) => {
  // 这里可以实现查看详情功能
  console.log('查看详情', id)
}

// 同步到客户
const syncToCustomer = (id) => {
  // 这里可以实现同步到客户功能
  console.log('同步到客户', id)
}
</script>

<style scoped>
.forms-statistics {
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

.stats-overview {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.data-list {
  padding: 0 15px;
}

.data-item {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.data-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.data-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.form-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.submit-time {
  font-size: 12px;
  color: #999;
}

.data-content {
  margin-bottom: 10px;
}

.data-field {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.field-label {
  color: #666;
  margin-right: 8px;
  min-width: 60px;
}

.field-value {
  color: #333;
  flex: 1;
}

.more-fields {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.data-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.customer-info {
  font-size: 14px;
  color: #666;
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