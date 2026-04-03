<template>
  <div class="payment-create">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">发起收款</h1>
      <div class="header-right"></div>
    </div>
    
    <!-- 收款信息 -->
    <div class="form-section">
      <h3 class="section-title">收款信息</h3>
      <van-form @submit="onSubmit">
        <van-field
          v-model="paymentForm.customerName"
          label="客户姓名"
          placeholder="请输入客户姓名"
          required
        />
        <van-field
          v-model="paymentForm.customerPhone"
          label="联系电话"
          placeholder="请输入联系电话"
          required
        />
        <van-field
          v-model="paymentForm.orderNumber"
          label="订单编号"
          placeholder="请输入订单编号"
          required
        />
        <van-field
          v-model="paymentForm.amount"
          label="收款金额"
          placeholder="请输入收款金额"
          type="number"
          required
        />
        <van-field
          v-model="paymentForm.description"
          label="收款事由"
          placeholder="请输入收款事由"
          required
        />
        <van-field
          v-model="paymentForm.paymentMethod"
          label="支付方式"
          placeholder="请选择支付方式"
          required
        >
          <template #input>
            <van-popup
              v-model:show="paymentMethodShow"
              position="bottom"
            >
              <van-picker
                v-model="paymentForm.paymentMethod"
                :columns="paymentMethodOptions"
                @confirm="paymentMethodShow = false"
                @cancel="paymentMethodShow = false"
              />
            </van-popup>
            <div class="field-value" @click="paymentMethodShow = true">
              {{ paymentForm.paymentMethod || '请选择' }}
            </div>
          </template>
        </van-field>
      </van-form>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <van-button type="primary" class="primary-btn" @click="generatePayment">生成收款单</van-button>
    </div>
    
    <!-- 分享弹窗 -->
    <van-popup v-model:show="sharePopupShow" position="bottom" round>
      <div class="share-popup">
        <h3 class="popup-title">分享收款单</h3>
        <div class="share-options">
          <div class="share-item" @click="shareToWechat">
            <div class="share-icon wechat"></div>
            <span>微信好友</span>
          </div>
          <div class="share-item" @click="copyLink">
            <div class="share-icon copy"></div>
            <span>复制链接</span>
          </div>
          <div class="share-item" @click="showQRCode">
            <div class="share-icon qrcode"></div>
            <span>二维码</span>
          </div>
        </div>
        <van-button type="default" class="cancel-btn" @click="sharePopupShow = false">取消</van-button>
      </div>
    </van-popup>
    
    <!-- 二维码弹窗 -->
    <van-popup v-model:show="qrcodePopupShow" position="center" round>
      <div class="qrcode-popup">
        <h3 class="popup-title">收款二维码</h3>
        <div class="qrcode-container">
          <!-- 这里应该生成实际的二维码 -->
          <div class="qrcode-placeholder">
            <svg class="qrcode-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h4v1h-4zm0 2h4v1h-4zm0 2h4v1h-4zm3-6h2v1h-2zm0 2h2v1h-2zm0 2h2v1h-2zm3-6h4v1h-4zm0 2h4v1h-4zm0 2h4v1h-4z"/>
            </svg>
          </div>
          <p class="qrcode-desc">请让客户扫描二维码支付</p>
        </div>
        <van-button type="default" class="confirm-btn" @click="qrcodePopupShow = false">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 支付方式选择器显示状态
const paymentMethodShow = ref(false)
// 分享弹窗显示状态
const sharePopupShow = ref(false)
// 二维码弹窗显示状态
const qrcodePopupShow = ref(false)

// 支付方式选项
const paymentMethodOptions = ['微信支付', '支付宝', '银行卡', '现金']

// 收款表单数据
const paymentForm = ref({
  customerName: '',
  customerPhone: '',
  orderNumber: '',
  amount: '',
  description: '',
  paymentMethod: ''
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 生成收款单
const generatePayment = () => {
  // 这里可以实现生成收款单功能
  console.log('生成收款单', paymentForm.value)
  sharePopupShow.value = true
}

// 分享到微信
const shareToWechat = () => {
  // 这里可以实现分享到微信功能
  console.log('分享到微信')
  sharePopupShow.value = false
}

// 复制链接
const copyLink = () => {
  // 这里可以实现复制链接功能
  console.log('复制链接')
  sharePopupShow.value = false
}

// 显示二维码
const showQRCode = () => {
  sharePopupShow.value = false
  qrcodePopupShow.value = true
}

// 表单提交
const onSubmit = (values) => {
  console.log('表单提交', values)
}
</script>

<style scoped>
.payment-create {
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

.share-popup {
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
  margin-bottom: 30px;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.share-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: center;
}

.share-icon.wechat {
  background-color: #07C160;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
}

.share-icon.copy {
  background-color: #667eea;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>');
}

.share-icon.qrcode {
  background-color: #ff6b6b;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h4v1h-4zm0 2h4v1h-4zm0 2h4v1h-4zm3-6h2v1h-2zm0 2h2v1h-2zm0 2h2v1h-2zm3-6h4v1h-4zm0 2h4v1h-4zm0 2h4v1h-4z"/></svg>');
}

.share-item span {
  font-size: 12px;
  color: #666;
}

.cancel-btn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
}

.qrcode-popup {
  padding: 30px 20px;
  width: 280px;
  text-align: center;
}

.qrcode-container {
  margin: 20px 0;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
}

.qrcode-icon {
  width: 60px;
  height: 60px;
  color: #999;
}

.qrcode-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.confirm-btn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  margin-top: 20px;
}
</style>