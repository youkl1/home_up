<template>
  <div class="ticket-apply">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">售后申请</h1>
      <div class="header-right"></div>
    </div>
    
    <!-- 售后申请表单 -->
    <div class="form-section">
      <h3 class="section-title">基本信息</h3>
      <van-form @submit="onSubmit">
        <van-field
          v-model="applyForm.customerName"
          label="客户姓名"
          placeholder="请输入客户姓名"
          required
        />
        <van-field
          v-model="applyForm.customerPhone"
          label="联系电话"
          placeholder="请输入联系电话"
          required
        />
        <van-field
          v-model="applyForm.orderNumber"
          label="订单编号"
          placeholder="请输入订单编号"
          required
        />
        <van-field
          v-model="applyForm.productName"
          label="产品名称"
          placeholder="请输入产品名称"
          required
        />
        <van-field
          v-model="applyForm.issueType"
          label="问题类型"
          placeholder="请选择问题类型"
          required
        >
          <template #input>
            <van-popup
              v-model:show="issueTypeShow"
              position="bottom"
            >
              <van-picker
                v-model="applyForm.issueType"
                :columns="issueTypeOptions"
                @confirm="issueTypeShow = false"
                @cancel="issueTypeShow = false"
              />
            </van-popup>
            <div class="field-value" @click="issueTypeShow = true">
              {{ applyForm.issueType || '请选择' }}
            </div>
          </template>
        </van-field>
        <van-field
          v-model="applyForm.description"
          label="问题描述"
          type="textarea"
          placeholder="请详细描述问题"
          rows="4"
          required
        />
        <div class="image-upload-section">
          <h4 class="upload-title">上传凭证</h4>
          <van-uploader
            v-model="applyForm.images"
            :max-count="5"
            accept="image/*"
            preview-full-image
          />
        </div>
      </van-form>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <van-button type="primary" class="primary-btn" @click="submitApply">提交申请</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 问题类型选择器显示状态
const issueTypeShow = ref(false)

// 问题类型选项
const issueTypeOptions = ['产品质量问题', '安装问题', '售后服务问题', '其他问题']

// 售后申请表单数据
const applyForm = ref({
  customerName: '',
  customerPhone: '',
  orderNumber: '',
  productName: '',
  issueType: '',
  description: '',
  images: []
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 提交申请
const submitApply = () => {
  // 这里可以实现提交售后申请功能
  console.log('提交售后申请', applyForm.value)
  router.push('/guide/tickets/list')
}

// 表单提交
const onSubmit = (values) => {
  console.log('表单提交', values)
}
</script>

<style scoped>
.ticket-apply {
  width: 375px;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin: 0 auto;
  padding-bottom: 60px;
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

.form-section {
  background-color: white;
  margin-bottom: 10px;
  padding: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.field-value {
  width: 100%;
  height: 34px;
  line-height: 34px;
  color: #999;
}

.image-upload-section {
  margin-top: 20px;
}

.upload-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 10px 0;
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
  z-index: 100;
}

.primary-btn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
}
</style>