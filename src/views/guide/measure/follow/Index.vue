<template>
  <div class="measure-follow">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">量房跟进记录</h1>
      <div class="header-right">
        <van-button size="small" @click="addFollowRecord">添加记录</van-button>
      </div>
    </div>

    <!-- 量房基本信息 -->
    <div class="measure-info">
      <h3 class="customer-name">{{ measureInfo.customerName }}</h3>
      <div class="info-row">
        <span class="info-label">量房地址:</span>
        <span class="info-value">{{ measureInfo.address }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">预约时间:</span>
        <span class="info-value">{{ measureInfo.appointmentTime }}</span>
      </div>
    </div>

    <!-- 跟进记录列表 -->
    <div class="follow-list">
      <div
        v-for="(record, index) in followRecords"
        :key="index"
        class="follow-item"
      >
        <div class="follow-header">
          <div class="follow-time">{{ record.createTime }}</div>
          <span :class="['follow-type', record.type]">{{ record.typeText }}</span>
        </div>
        <div class="follow-content">
          <p class="follow-text">{{ record.content }}</p>
          <div v-if="record.images && record.images.length > 0" class="follow-images">
            <div
              v-for="(image, imgIndex) in record.images"
              :key="imgIndex"
              class="image-item"
              @click="previewImage(record.images, imgIndex)"
            >
              <img :src="image" alt="跟进图片" />
            </div>
          </div>
        </div>
        <div class="follow-footer">
          <span class="follow-author">{{ record.author }}</span>
          <van-button size="small" @click="setReminder(record.id)">设置提醒</van-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="followRecords.length === 0" class="empty-state">
      <img src="/src/assets/images/placeholder.png" alt="空状态" class="empty-image" />
      <p class="empty-text">暂无跟进记录</p>
    </div>

    <!-- 添加跟进记录弹窗 -->
    <van-popup v-model:show="showAddPopup" position="bottom" round :style="{ height: '70%' }">
      <div class="popup-content">
        <h3 class="popup-title">添加跟进记录</h3>
        <van-field
          v-model="newRecord.content"
          type="textarea"
          :rows="4"
          placeholder="请输入跟进内容"
        />
        <div class="upload-section">
          <span class="upload-label">上传图片</span>
          <van-uploader
            v-model="newRecord.images"
            :max-count="3"
            :preview-size="80"
          />
        </div>
        <van-field
          v-model="newRecord.reminderTime"
          label="设置提醒"
          placeholder="请选择提醒时间"
          is-link
          readonly
          @click="showReminderPicker = true"
        />
        <div class="popup-actions">
          <van-button class="cancel-btn" @click="showAddPopup = false">取消</van-button>
          <van-button type="primary" class="confirm-btn" @click="confirmAddRecord">确认</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 提醒时间选择器 -->
    <van-popup v-model:show="showReminderPicker" position="bottom" round>
      <van-datetime-picker
        v-model="currentTime"
        type="datetime"
        :min-date="minDate"
        @confirm="confirmReminderTime"
        @cancel="showReminderPicker = false"
      />
    </van-popup>
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
  address: '北京市朝阳区某某小区1号楼2单元301',
  appointmentTime: '2026-04-05 14:00'
})

// 跟进记录数据
const followRecords = ref([
  {
    id: 1,
    type: 'phone',
    typeText: '电话沟通',
    content: '与客户电话确认量房时间，客户表示可以按时到达',
    createTime: '2026-04-03 10:30',
    author: '张导购',
    images: []
  },
  {
    id: 2,
    type: 'visit',
    typeText: '现场量房',
    content: '已完成现场量房，房屋面积为120㎡，三居室户型，客户对客厅空间规划有特殊要求',
    createTime: '2026-04-05 16:00',
    author: '李师傅',
    images: ['../../../assets/images/placeholder.png']
  },
  {
    id: 3,
    type: 'follow',
    typeText: '跟进记录',
    content: '已上传量房草图和现场照片，等待设计师出方案',
    createTime: '2026-04-06 09:00',
    author: '张导购',
    images: []
  }
])

// 弹窗状态
const showAddPopup = ref(false)
const showReminderPicker = ref(false)

// 新记录数据
const newRecord = ref({
  content: '',
  images: [],
  reminderTime: ''
})

// 时间选择器
const currentTime = ref(new Date())
const minDate = ref(new Date())

// 返回上一页
const goBack = () => {
  router.back()
}

// 添加跟进记录
const addFollowRecord = () => {
  showAddPopup.value = true
}

// 确认添加记录
const confirmAddRecord = () => {
  if (!newRecord.value.content.trim()) {
    alert('请输入跟进内容')
    return
  }

  const record = {
    id: Date.now(),
    type: 'follow',
    typeText: '跟进记录',
    content: newRecord.value.content,
    createTime: new Date().toLocaleString(),
    author: '当前用户',
    images: newRecord.value.images.map(img => img.url || img)
  }

  followRecords.value.unshift(record)
  showAddPopup.value = false

  // 重置表单
  newRecord.value = {
    content: '',
    images: [],
    reminderTime: ''
  }
}

// 设置提醒
const setReminder = (id) => {
  console.log('设置提醒', id)
}

// 确认提醒时间
const confirmReminderTime = (value) => {
  newRecord.value.reminderTime = value.toLocaleString()
  showReminderPicker.value = false
}

// 预览图片
const previewImage = (images, index) => {
  console.log('预览图片', images, index)
}

// 初始化数据
onMounted(() => {
  const id = route.params.id
  if (id) {
    console.log('加载量房跟进记录', id)
  }
})
</script>

<style scoped>
.measure-follow {
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

.measure-info {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.customer-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.info-row {
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

.follow-list {
  padding: 0 15px;
}

.follow-item {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.follow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.follow-time {
  font-size: 12px;
  color: #999;
}

.follow-type {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.follow-type.phone {
  background-color: #e6f7ff;
  color: #1890ff;
}

.follow-type.visit {
  background-color: #f6ffed;
  color: #52c41a;
}

.follow-type.follow {
  background-color: #fff2e8;
  color: #fa8c16;
}

.follow-content {
  margin-bottom: 10px;
}

.follow-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin: 0 0 10px 0;
}

.follow-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.image-item {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.follow-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.follow-author {
  font-size: 12px;
  color: #999;
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

.popup-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
}

.upload-section {
  margin: 15px 0;
}

.upload-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.popup-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
  padding-top: 20px;
}

.cancel-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
}

.confirm-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
}
</style>
