<template>
  <div class="ticket-follow">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">工单跟进</h1>
      <div class="header-right"></div>
    </div>
    
    <!-- 跟进记录列表 -->
    <div class="follow-records">
      <div 
        v-for="(record, index) in followRecords" 
        :key="index"
        class="follow-item"
      >
        <div class="follow-header">
          <span class="follow-time">{{ record.time }}</span>
          <span class="follow-operator">{{ record.operator }}</span>
        </div>
        <div class="follow-content">
          {{ record.content }}
        </div>
        <div v-if="record.images && record.images.length > 0" class="follow-images">
          <div 
            v-for="(image, imgIndex) in record.images" 
            :key="imgIndex"
            class="image-item"
            @click="previewImage(image)"
          >
            <img :src="image" alt="跟进图片" class="follow-image" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加跟进记录 -->
    <div class="add-follow">
      <van-field
        v-model="followForm.content"
        type="textarea"
        placeholder="请输入跟进内容"
        rows="3"
        required
      />
      <div class="image-upload">
        <van-uploader
          v-model="followForm.images"
          :max-count="3"
          accept="image/*"
        />
      </div>
      <div class="submit-btn">
        <van-button type="primary" class="primary-btn" @click="submitFollow">提交跟进</van-button>
      </div>
    </div>
    
    <!-- 图片预览 -->
    <van-image-preview
      v-model:show="showImagePreview"
      :images="previewImages"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 图片预览
const showImagePreview = ref(false)
const previewImages = ref([])

// 跟进表单数据
const followForm = ref({
  content: '',
  images: []
})

// 模拟跟进记录数据
const followRecords = ref([
  {
    time: '2024-01-01 10:00',
    operator: '系统',
    content: '工单创建成功，等待分配师傅',
    images: []
  },
  {
    time: '2024-01-01 11:00',
    operator: '张导购',
    content: '已联系客户确认安装时间，客户确认1月5日下午14:00可以安装',
    images: []
  }
])

// 返回上一页
const goBack = () => {
  router.back()
}

// 预览图片
const previewImage = (image) => {
  previewImages.value = [image]
  showImagePreview.value = true
}

// 提交跟进
const submitFollow = () => {
  if (!followForm.value.content) {
    return
  }
  
  // 这里可以实现提交跟进记录功能
  const newRecord = {
    time: new Date().toLocaleString(),
    operator: '当前导购',
    content: followForm.value.content,
    images: followForm.value.images.map(img => img.url)
  }
  
  followRecords.value.unshift(newRecord)
  
  // 清空表单
  followForm.value.content = ''
  followForm.value.images = []
  
  console.log('提交跟进记录', newRecord)
}
</script>

<style scoped>
.ticket-follow {
  width: 375px;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
  padding-bottom: 20px;
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

.follow-records {
  background-color: white;
  margin: 10px 0;
  padding: 15px;
}

.follow-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.follow-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.follow-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.follow-time {
  font-size: 12px;
  color: #999;
}

.follow-operator {
  font-size: 12px;
  color: #667eea;
}

.follow-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 10px;
}

.follow-images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.image-item {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.follow-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.add-follow {
  background-color: white;
  padding: 15px;
  margin-top: 10px;
}

.image-upload {
  margin: 15px 0;
}

.submit-btn {
  margin-top: 15px;
}

.primary-btn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
}
</style>