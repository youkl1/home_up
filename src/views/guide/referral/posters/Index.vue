<template>
  <div class="referral-posters">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">生成转介绍海报</h1>
      <div class="header-right"></div>
    </div>

    <!-- 海报模板选择 -->
    <div class="template-section">
      <h3 class="section-title">选择海报模板</h3>
      <div class="template-list">
        <div
          v-for="(template, index) in posterTemplates"
          :key="index"
          :class="['template-item', { active: selectedTemplate === index }]"
          @click="selectTemplate(index)"
        >
          <img :src="template.preview" :alt="template.name" />
          <span class="template-name">{{ template.name }}</span>
        </div>
      </div>
    </div>

    <!-- 海报预览 -->
    <div class="preview-section">
      <h3 class="section-title">海报预览</h3>
      <div class="poster-preview">
        <div class="poster-container">
          <img :src="posterTemplates[selectedTemplate].preview" alt="海报预览" />
          <div class="poster-overlay">
            <div class="poster-title">{{ posterTitle }}</div>
            <div class="poster-qrcode">
              <img src="/src/assets/images/placeholder.png" alt="二维码" />
            </div>
            <div class="poster-info">
              <div class="guide-name">导购: {{ guideName }}</div>
              <div class="guide-phone">电话: {{ guidePhone }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 海报设置 -->
    <div class="settings-section">
      <h3 class="section-title">海报设置</h3>
      <van-field
        v-model="posterTitle"
        label="海报标题"
        placeholder="请输入海报标题"
      />
      <van-field
        v-model="guideName"
        label="导购姓名"
        placeholder="请输入导购姓名"
      />
      <van-field
        v-model="guidePhone"
        label="联系电话"
        placeholder="请输入联系电话"
      />
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <van-button class="secondary-btn" @click="savePoster">保存海报</van-button>
      <van-button type="primary" class="primary-btn" @click="sharePoster">分享海报</van-button>
    </div>

    <!-- 分享弹窗 -->
    <van-popup v-model:show="showSharePopup" position="bottom" round>
      <div class="popup-content">
        <h3 class="popup-title">分享海报</h3>
        <div class="share-options">
          <div class="share-option" @click="shareToWechat">
            <div class="share-icon wechat"></div>
            <span class="share-text">微信好友</span>
          </div>
          <div class="share-option" @click="shareToMoments">
            <div class="share-icon moments"></div>
            <span class="share-text">朋友圈</span>
          </div>
          <div class="share-option" @click="saveToAlbum">
            <div class="share-icon album"></div>
            <span class="share-text">保存相册</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 海报模板数据
const posterTemplates = ref([
  {
    name: '简约风格',
    preview: '../../../assets/images/placeholder.png'
  },
  {
    name: '商务风格',
    preview: '../../../assets/images/placeholder.png'
  },
  {
    name: '节日风格',
    preview: '../../../assets/images/placeholder.png'
  }
])

// 选中的模板
const selectedTemplate = ref(0)

// 海报设置
const posterTitle = ref('HomeUp家居 - 品质生活从这里开始')
const guideName = ref('张导购')
const guidePhone = ref('13800138000')

// 分享弹窗
const showSharePopup = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 选择模板
const selectTemplate = (index) => {
  selectedTemplate.value = index
}

// 保存海报
const savePoster = () => {
  // 这里可以实现保存海报功能
  console.log('保存海报')
}

// 分享海报
const sharePoster = () => {
  showSharePopup.value = true
}

// 分享到微信好友
const shareToWechat = () => {
  console.log('分享到微信好友')
  showSharePopup.value = false
}

// 分享到朋友圈
const shareToMoments = () => {
  console.log('分享到朋友圈')
  showSharePopup.value = false
}

// 保存到相册
const saveToAlbum = () => {
  console.log('保存到相册')
  showSharePopup.value = false
}
</script>

<style scoped>
.referral-posters {
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
  width: 40px;
}

.template-section {
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

.template-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.template-item {
  flex-shrink: 0;
  width: 100px;
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 5px;
  transition: all 0.3s ease;
}

.template-item.active {
  border-color: #667eea;
}

.template-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 5px;
}

.template-name {
  font-size: 12px;
  color: #666;
}

.preview-section {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.poster-preview {
  display: flex;
  justify-content: center;
}

.poster-container {
  position: relative;
  width: 200px;
  height: 350px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.poster-container > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%);
}

.poster-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.poster-qrcode {
  width: 120px;
  height: 120px;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
}

.poster-qrcode img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.poster-info {
  text-align: center;
  color: white;
}

.guide-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.guide-phone {
  font-size: 12px;
  opacity: 0.9;
}

.settings-section {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
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

.popup-content {
  padding: 20px;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
}

.share-options {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.share-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.share-icon.wechat {
  background-color: #07C160;
}

.share-icon.moments {
  background-color: #FFC107;
}

.share-icon.album {
  background-color: #1890FF;
}

.share-text {
  font-size: 12px;
  color: #666;
}
</style>