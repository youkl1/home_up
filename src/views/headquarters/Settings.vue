<template>
  <div class="headquarters-settings">
    <div class="page-header">
      <h1>系统设置</h1>
    </div>
    
    <!-- 设置选项卡 -->
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本设置" name="basic">
        <el-card shadow="hover">
          <el-form :model="basicForm" label-width="100px">
            <el-form-item label="系统名称">
              <el-input v-model="basicForm.systemName"></el-input>
            </el-form-item>
            <el-form-item label="系统版本">
              <el-input v-model="basicForm.version" disabled></el-input>
            </el-form-item>
            <el-form-item label="联系邮箱">
              <el-input v-model="basicForm.contactEmail"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="basicForm.contactPhone"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="用户管理" name="users">
        <UsersComponent />
      </el-tab-pane>
      
      <el-tab-pane label="权限管理" name="permissions">
        <RolesComponent />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import UsersComponent from './system/Users.vue'
import RolesComponent from './system/Roles.vue'

// 当前激活的选项卡
const activeTab = ref('basic')

// 基本设置表单
const basicForm = ref({
  systemName: '泛家居营销SAAS平台',
  version: 'v1.0.0',
  contactEmail: 'support@example.com',
  contactPhone: '400-123-4567'
})

// 保存基本设置
const saveBasicSettings = () => {
  ElMessage.success('保存成功')
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
.headquarters-settings {
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

.user-management,
.permission-management {
  padding: 20px 0;
}
</style>