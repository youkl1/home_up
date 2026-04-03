<template>
  <div class="headquarters-settings-platform">
    <div class="page-header">
      <h1>平台信息管理</h1>
    </div>
    
    <!-- 平台信息表单 -->
    <div class="platform-form">
      <el-card shadow="hover">
        <el-form :model="platformInfo" label-width="120px">
          <el-form-item label="平台名称">
            <el-input v-model="platformInfo.name" placeholder="请输入平台名称"></el-input>
          </el-form-item>
          <el-form-item label="平台域名">
            <el-input v-model="platformInfo.domain" placeholder="请输入平台域名"></el-input>
          </el-form-item>
          <el-form-item label="平台Logo">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :on-change="handleLogoUpload"
              accept="image/*"
            >
              <img v-if="platformInfo.logo" :src="platformInfo.logo" class="avatar">
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="平台简介">
            <el-input
              v-model="platformInfo.description"
              type="textarea"
              :rows="4"
              placeholder="请输入平台简介"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="platformInfo.phone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="联系邮箱">
            <el-input v-model="platformInfo.email" placeholder="请输入联系邮箱"></el-input>
          </el-form-item>
          <el-form-item label="版权信息">
            <el-input v-model="platformInfo.copyright" placeholder="请输入版权信息"></el-input>
          </el-form-item>
          <el-form-item label="备案号">
            <el-input v-model="platformInfo.icp" placeholder="请输入备案号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="savePlatformInfo">保存修改</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 平台信息
const platformInfo = ref({
  name: 'HomeUp 泛家居 SaaS 平台',
  domain: 'https://homeup.com',
  logo: '',
  description: 'HomeUp 是一款专为泛家居行业打造的 SaaS 平台，提供门店管理、客户管理、营销工具等一体化解决方案。',
  phone: '400-123-4567',
  email: 'contact@homeup.com',
  copyright: '© 2026 HomeUp. All rights reserved.',
  icp: '京ICP备12345678号'
})

// 处理Logo上传
const handleLogoUpload = (file) => {
  // 模拟上传
  ElMessage.success('Logo上传功能开发中')
}

// 保存平台信息
const savePlatformInfo = () => {
  ElMessage.success('平台信息保存成功')
}

// 重置表单
const resetForm = () => {
  platformInfo.value = {
    name: 'HomeUp 泛家居 SaaS 平台',
    domain: 'https://homeup.com',
    logo: '',
    description: 'HomeUp 是一款专为泛家居行业打造的 SaaS 平台，提供门店管理、客户管理、营销工具等一体化解决方案。',
    phone: '400-123-4567',
    email: 'contact@homeup.com',
    copyright: '© 2026 HomeUp. All rights reserved.',
    icp: '京ICP备12345678号'
  }
  ElMessage.info('表单已重置')
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
  }, 500)
})
</script>

<style scoped>
.headquarters-settings-platform {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.platform-form {
  margin-bottom: 20px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.avatar-uploader-icon:hover {
  border-color: #409eff;
}
</style>