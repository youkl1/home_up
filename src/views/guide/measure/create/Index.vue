<template>
  <div class="measure-create">
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <h1 class="header-title">{{ isEdit ? '编辑量房' : '新建量房' }}</h1>
      <div class="header-right">
        <van-button size="small" @click="saveMeasure">保存</van-button>
      </div>
    </div>
    
    <!-- 客户信息 -->
    <div class="section">
      <h3 class="section-title">客户信息</h3>
      <van-field
        v-model="measureForm.customerName"
        label="客户姓名"
        placeholder="请输入客户姓名"
        required
      />
      <van-field
        v-model="measureForm.customerPhone"
        label="联系电话"
        placeholder="请输入联系电话"
        required
      />
    </div>
    
    <!-- 量房信息 -->
    <div class="section">
      <h3 class="section-title">量房信息</h3>
      <van-field
        v-model="measureForm.address"
        label="量房地址"
        placeholder="请输入量房地址"
        required
      />
      <van-field
        v-model="measureForm.appointmentTime"
        label="预约时间"
        placeholder="请选择预约时间"
        required
        is-link
        @click="showDateTimePicker = true"
      />
      <van-field
        v-model="measureForm.houseType"
        label="户型"
        placeholder="请输入户型"
      />
      <van-field
        v-model="measureForm.area"
        label="房屋面积"
        placeholder="请输入房屋面积"
      />
    </div>
    
    <!-- 图片上传 -->
    <div class="section">
      <h3 class="section-title">图片上传</h3>
      <div class="upload-section">
        <div class="upload-item">
          <span class="upload-label">户型图</span>
          <van-uploader
            v-model="measureForm.images.housePlan"
            :max-count="3"
            :preview-size="80"
            @delete="handleDelete"
          />
        </div>
        <div class="upload-item">
          <span class="upload-label">量房草图</span>
          <van-uploader
            v-model="measureForm.images.sketches"
            :max-count="3"
            :preview-size="80"
            @delete="handleDelete"
          />
        </div>
        <div class="upload-item">
          <span class="upload-label">现场照片</span>
          <van-uploader
            v-model="measureForm.images.photos"
            :max-count="5"
            :preview-size="80"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>
    
    <!-- 需求备注 -->
    <div class="section">
      <h3 class="section-title">需求备注</h3>
      <van-field
        v-model="measureForm.notes"
        label="备注"
        placeholder="请输入备注信息"
        type="textarea"
        :rows="4"
      />
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <van-button type="primary" class="primary-btn" @click="saveMeasure">保存并提交</van-button>
    </div>
    
    <!-- 日期时间选择器 -->
    <van-datetime-picker
      v-model="dateTimeValue"
      type="datetime"
      :min-date="minDate"
      :max-date="maxDate"
      v-model:show="showDateTimePicker"
      @confirm="handleDateTimeConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 编辑模式
const isEdit = ref(!!route.query.id)

// 表单数据
const measureForm = ref({
  customerName: '',
  customerPhone: '',
  address: '',
  appointmentTime: '',
  houseType: '',
  area: '',
  images: {
    housePlan: [],
    sketches: [],
    photos: []
  },
  notes: ''
})

// 日期时间选择器
const showDateTimePicker = ref(false)
const dateTimeValue = ref(new Date())
const minDate = ref(new Date())
const maxDate = ref(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)) // 90天后

// 返回上一页
const goBack = () => {
  router.back()
}

// 保存量房信息
const saveMeasure = () => {
  // 这里可以实现保存量房信息功能
  console.log('保存量房信息', measureForm.value)
  router.push('/guide/measure/list')
}

// 处理图片删除
const handleDelete = (file, detail) => {
  console.log('删除图片', file, detail)
}

// 处理日期时间确认
const handleDateTimeConfirm = (value) => {
  measureForm.value.appointmentTime = value.toLocaleString()
}

// 初始化数据
onMounted(() => {
  if (isEdit.value) {
    // 这里可以根据ID加载量房数据
    console.log('加载量房数据', route.query.id)
    // 模拟加载数据
    measureForm.value = {
      customerName: '张三',
      customerPhone: '13800138000',
      address: '北京市朝阳区某某小区1号楼2单元301',
      appointmentTime: '2026-04-05 14:00',
      houseType: '三居室',
      area: '120㎡',
      images: {
        housePlan: [],
        sketches: [],
        photos: []
      },
      notes: '客户希望尽快安排量房'
    }
  }
})
</script>

<style scoped>
.measure-create {
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

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upload-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.upload-label {
  font-size: 14px;
  color: #666;
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