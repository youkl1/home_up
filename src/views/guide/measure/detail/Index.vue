<template>
  <div class="measure-detail">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">量房详情</h1>
      <div class="header-right">
        <van-button size="small" @click="editMeasure">编辑</van-button>
      </div>
    </div>
    
    <!-- 基本信息 -->
    <div class="section">
      <h3 class="section-title">基本信息</h3>
      <div class="info-item">
        <span class="info-label">客户姓名:</span>
        <span class="info-value">{{ measureInfo.customerName }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">联系电话:</span>
        <span class="info-value">{{ measureInfo.customerPhone }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">量房地址:</span>
        <span class="info-value">{{ measureInfo.address }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">预约时间:</span>
        <span class="info-value">{{ measureInfo.appointmentTime }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">户型:</span>
        <span class="info-value">{{ measureInfo.houseType }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">房屋面积:</span>
        <span class="info-value">{{ measureInfo.area }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">量房师傅:</span>
        <span class="info-value">{{ measureInfo.installerName }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">状态:</span>
        <span :class="['status-badge', measureInfo.status]">{{ measureInfo.statusText }}</span>
      </div>
    </div>
    
    <!-- 图片展示 -->
    <div class="section">
      <h3 class="section-title">图片资料</h3>
      <div class="image-section">
        <div class="image-group">
          <h4 class="image-group-title">户型图</h4>
          <div class="image-grid">
            <div 
              v-for="(image, index) in measureInfo.images.housePlan" 
              :key="index"
              class="image-item"
              @click="previewImage(index, 'housePlan')"
            >
              <img :src="image.url || '../../../assets/images/placeholder.png'" :alt="'户型图' + (index + 1)" />
            </div>
            <div v-if="measureInfo.images.housePlan.length === 0" class="empty-image">
              <img src="../../../assets/images/placeholder.png" alt="暂无图片" />
            </div>
          </div>
        </div>
        
        <div class="image-group">
          <h4 class="image-group-title">量房草图</h4>
          <div class="image-grid">
            <div 
              v-for="(image, index) in measureInfo.images.sketches" 
              :key="index"
              class="image-item"
              @click="previewImage(index, 'sketches')"
            >
              <img :src="image.url || '../../../assets/images/placeholder.png'" :alt="'草图' + (index + 1)" />
            </div>
            <div v-if="measureInfo.images.sketches.length === 0" class="empty-image">
              <img src="../../../assets/images/placeholder.png" alt="暂无图片" />
            </div>
          </div>
        </div>
        
        <div class="image-group">
          <h4 class="image-group-title">现场照片</h4>
          <div class="image-grid">
            <div 
              v-for="(image, index) in measureInfo.images.photos" 
              :key="index"
              class="image-item"
              @click="previewImage(index, 'photos')"
            >
              <img :src="image.url || '../../../assets/images/placeholder.png'" :alt="'照片' + (index + 1)" />
            </div>
            <div v-if="measureInfo.images.photos.length === 0" class="empty-image">
              <img src="../../../assets/images/placeholder.png" alt="暂无图片" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 需求备注 -->
    <div class="section">
      <h3 class="section-title">需求备注</h3>
      <div class="notes-content">
        {{ measureInfo.notes || '无备注信息' }}
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <van-button class="secondary-btn" @click="viewFollowRecords">跟进记录</van-button>
      <van-button type="primary" class="primary-btn" @click="generateReport">生成报告</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 量房信息
const measureInfo = ref({
  id: 1,
  customerName: '张三',
  customerPhone: '13800138000',
  address: '北京市朝阳区某某小区1号楼2单元301',
  appointmentTime: '2026-04-05 14:00',
  houseType: '三居室',
  area: '120㎡',
  installerName: '李师傅',
  status: 'pending',
  statusText: '待量房',
  images: {
    housePlan: [],
    sketches: [],
    photos: []
  },
  notes: '客户希望尽快安排量房，重点关注客厅和主卧室的空间规划'
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 编辑量房
const editMeasure = () => {
  router.push(`/guide/measure/create?id=${measureInfo.value.id}`)
}

// 查看跟进记录
const viewFollowRecords = () => {
  router.push(`/guide/measure/follow/${measureInfo.value.id}`)
}

// 生成报告
const generateReport = () => {
  // 这里可以实现生成报告功能
  console.log('生成报告', measureInfo.value.id)
}

// 预览图片
const previewImage = (index, type) => {
  // 这里可以实现图片预览功能
  console.log('预览图片', index, type)
}

// 初始化数据
onMounted(() => {
  const id = route.params.id
  if (id) {
    // 这里可以根据ID加载量房详情数据
    console.log('加载量房详情', id)
  }
})
</script>

<style scoped>
.measure-detail {
  width: 375px;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
  padding-bottom: 70px;
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
  width: 60px;
}

.section {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
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

.image-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.image-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.image-group-title {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin: 0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.image-item {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f5f5f5;
  cursor: pointer;
}

.image-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-image img {
  width: 60%;
  height: 60%;
  object-fit: contain;
  opacity: 0.5;
}

.notes-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  white-space: pre-wrap;
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  background-color: white;
  padding: 10px 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 10px;
  z-index: 100;
}

.secondary-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
}

.primary-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
}
</style>