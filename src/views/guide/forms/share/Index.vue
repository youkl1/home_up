<template>
  <div class="form-share">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">分享表单</h1>
      <div class="header-right"></div>
    </div>
    
    <!-- 表单信息 -->
    <div class="form-info">
      <h3 class="form-title">{{ formInfo.title }}</h3>
      <p class="form-desc">{{ formInfo.description }}</p>
      <div class="form-meta">
        <span class="form-status">{{ formInfo.status }}</span>
        <span class="form-count">{{ formInfo.submissionCount }}次提交</span>
      </div>
    </div>
    
    <!-- 二维码 -->
    <div class="qrcode-section">
      <div class="qrcode-container">
        <div class="qrcode-placeholder">
          <img src="/src/assets/images/placeholder.png" alt="表单二维码" class="qrcode-image" />
        </div>
        <p class="qrcode-desc">扫描二维码填写表单</p>
      </div>
      <van-button size="small" @click="refreshQrcode">刷新二维码</van-button>
    </div>
    
    <!-- 分享方式 -->
    <div class="share-options">
      <h3 class="section-title">分享方式</h3>
      <div class="share-buttons">
        <div class="share-button" @click="shareToWechat">
          <div class="share-icon wechat"></div>
          <span class="share-text">微信好友</span>
        </div>
        <div class="share-button" @click="shareToMoments">
          <div class="share-icon moments"></div>
          <span class="share-text">朋友圈</span>
        </div>
        <div class="share-button" @click="copyLink">
          <div class="share-icon link"></div>
          <span class="share-text">复制链接</span>
        </div>
        <div class="share-button" @click="saveQrcode">
          <div class="share-icon save"></div>
          <span class="share-text">保存二维码</span>
        </div>
      </div>
    </div>
    
    <!-- 分享设置 -->
    <div class="share-settings">
      <h3 class="section-title">分享设置</h3>
      <van-cell-group>
        <van-cell
          title="设置截止时间"
          :value="formInfo.expireTime || '永久有效'"
          is-link
          @click="setExpireTime"
        />
        <van-cell
          title="开启通知提醒"
          :value="formInfo.notification ? '已开启' : '已关闭'"
          is-link
          @click="toggleNotification"
        />
        <van-cell
          title="设置填写次数"
          :value="formInfo.maxSubmissions || '无限制'"
          is-link
          @click="setMaxSubmissions"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 表单信息
const formInfo = ref({
  title: '客户需求调研表',
  description: '了解客户装修需求、风格偏好、预算范围等信息',
  status: '已发布',
  submissionCount: 23,
  expireTime: '2026-12-31',
  notification: true,
  maxSubmissions: '无限制'
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 刷新二维码
const refreshQrcode = () => {
  // 这里可以实现刷新二维码功能
  console.log('刷新二维码')
}

// 分享到微信好友
const shareToWechat = () => {
  // 这里可以实现分享到微信好友功能
  console.log('分享到微信好友')
}

// 分享到朋友圈
const shareToMoments = () => {
  // 这里可以实现分享到朋友圈功能
  console.log('分享到朋友圈')
}

// 复制链接
const copyLink = () => {
  // 这里可以实现复制链接功能
  console.log('复制链接')
}

// 保存二维码
const saveQrcode = () => {
  // 这里可以实现保存二维码功能
  console.log('保存二维码')
}

// 设置截止时间
const setExpireTime = () => {
  // 这里可以实现设置截止时间功能
  console.log('设置截止时间')
}

// 切换通知提醒
const toggleNotification = () => {
  formInfo.value.notification = !formInfo.value.notification
  console.log('切换通知提醒', formInfo.value.notification)
}

// 设置最大填写次数
const setMaxSubmissions = () => {
  // 这里可以实现设置最大填写次数功能
  console.log('设置最大填写次数')
}
</script>

<style scoped>
.form-share {
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

.form-info {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.form-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.form-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.form-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-status {
  font-size: 12px;
  color: #52c41a;
  background-color: #f6ffed;
  padding: 2px 8px;
  border-radius: 10px;
}

.form-count {
  font-size: 12px;
  color: #999;
}

.qrcode-section {
  background-color: white;
  padding: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.qrcode-image {
  width: 180px;
  height: 180px;
  opacity: 0.5;
}

.qrcode-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.share-options {
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

.share-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.share-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.share-button:hover {
  transform: translateY(-2px);
}

.share-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-icon.wechat {
  background-color: #07C160;
}

.share-icon.moments {
  background-color: #FFC107;
}

.share-icon.link {
  background-color: #667EEA;
}

.share-icon.save {
  background-color: #1890FF;
}

.share-text {
  font-size: 12px;
  color: #666;
}

.share-settings {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}
</style>