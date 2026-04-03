<template>
  <div class="headquarters-system-platform">
    <div class="page-header">
      <h1>平台信息</h1>
      <el-button type="primary" @click="editPlatformInfo">编辑信息</el-button>
    </div>
    
    <!-- 平台基本信息 -->
    <div class="platform-info">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <el-descriptions :column="1">
          <el-descriptions-item label="平台名称">{{ platformInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="平台域名">{{ platformInfo.domain }}</el-descriptions-item>
          <el-descriptions-item label="平台地址">{{ platformInfo.address }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ platformInfo.phone }}</el-descriptions-item>
          <el-descriptions-item label="联系邮箱">{{ platformInfo.email }}</el-descriptions-item>
          <el-descriptions-item label="平台描述">{{ platformInfo.description }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ platformInfo.createTime }}</el-descriptions-item>
          <el-descriptions-item label="最后更新">{{ platformInfo.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    
    <!-- 平台配置 -->
    <div class="platform-config">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>平台配置</span>
          </div>
        </template>
        <el-descriptions :column="1">
          <el-descriptions-item label="系统语言">{{ platformConfig.language }}</el-descriptions-item>
          <el-descriptions-item label="时区设置">{{ platformConfig.timezone }}</el-descriptions-item>
          <el-descriptions-item label="日期格式">{{ platformConfig.dateFormat }}</el-descriptions-item>
          <el-descriptions-item label="货币单位">{{ platformConfig.currency }}</el-descriptions-item>
          <el-descriptions-item label="文件存储方式">{{ platformConfig.storage }}</el-descriptions-item>
          <el-descriptions-item label="短信服务">{{ platformConfig.smsService }}</el-descriptions-item>
          <el-descriptions-item label="邮件服务">{{ platformConfig.emailService }}</el-descriptions-item>
          <el-descriptions-item label="第三方登录">{{ platformConfig.thirdPartyLogin }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    
    <!-- 平台状态 -->
    <div class="platform-status">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>平台状态</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="status-item">
              <div class="status-value">{{ platformStatus.users }}</div>
              <div class="status-label">注册用户</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="status-item">
              <div class="status-value">{{ platformStatus.stores }}</div>
              <div class="status-label">加盟店</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="status-item">
              <div class="status-value">{{ platformStatus.products }}</div>
              <div class="status-label">商品数量</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="status-item">
              <div class="status-value">{{ platformStatus.orders }}</div>
              <div class="status-label">订单数量</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 编辑平台信息弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑平台信息"
      width="800px"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="基本信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="平台名称" prop="name">
                <el-input v-model="editForm.name" placeholder="请输入平台名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="平台域名" prop="domain">
                <el-input v-model="editForm.domain" placeholder="请输入平台域名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="editForm.phone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系邮箱" prop="email">
                <el-input v-model="editForm.email" placeholder="请输入联系邮箱"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="平台地址" prop="address">
                <el-input v-model="editForm.address" placeholder="请输入平台地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="平台描述" prop="description">
                <el-input
                  v-model="editForm.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入平台描述"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="平台配置">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="系统语言" prop="language">
                <el-select v-model="editForm.language" placeholder="选择系统语言">
                  <el-option label="简体中文" value="zh-CN"></el-option>
                  <el-option label="English" value="en-US"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时区设置" prop="timezone">
                <el-select v-model="editForm.timezone" placeholder="选择时区">
                  <el-option label="中国标准时间" value="Asia/Shanghai"></el-option>
                  <el-option label="美国东部时间" value="America/New_York"></el-option>
                  <el-option label="格林威治标准时间" value="GMT"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="日期格式" prop="dateFormat">
                <el-select v-model="editForm.dateFormat" placeholder="选择日期格式">
                  <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
                  <el-option label="DD/MM/YYYY" value="DD/MM/YYYY"></el-option>
                  <el-option label="MM/DD/YYYY" value="MM/DD/YYYY"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货币单位" prop="currency">
                <el-select v-model="editForm.currency" placeholder="选择货币单位">
                  <el-option label="人民币 (¥)" value="CNY"></el-option>
                  <el-option label="美元 ($)" value="USD"></el-option>
                  <el-option label="欧元 (€)" value="EUR"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="文件存储方式" prop="storage">
                <el-select v-model="editForm.storage" placeholder="选择存储方式">
                  <el-option label="本地存储" value="local"></el-option>
                  <el-option label="阿里云OSS" value="aliyun"></el-option>
                  <el-option label="腾讯云COS" value="tencent"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="短信服务" prop="smsService">
                <el-select v-model="editForm.smsService" placeholder="选择短信服务">
                  <el-option label="阿里云短信" value="aliyun-sms"></el-option>
                  <el-option label="腾讯云短信" value="tencent-sms"></el-option>
                  <el-option label="华为云短信" value="huawei-sms"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="邮件服务" prop="emailService">
                <el-select v-model="editForm.emailService" placeholder="选择邮件服务">
                  <el-option label="SMTP" value="smtp"></el-option>
                  <el-option label="阿里云邮件" value="aliyun-email"></el-option>
                  <el-option label="腾讯云邮件" value="tencent-email"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="第三方登录" prop="thirdPartyLogin">
                <el-select v-model="editForm.thirdPartyLogin" placeholder="选择第三方登录">
                  <el-option label="微信" value="wechat"></el-option>
                  <el-option label="QQ" value="qq"></el-option>
                  <el-option label="支付宝" value="alipay"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm">保存修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 加载状态
const loading = ref(false)

// 平台基本信息
const platformInfo = ref({
  name: '智能家居管理平台',
  domain: 'https://www.smart-home.com',
  address: '北京市朝阳区建国路88号',
  phone: '400-123-4567',
  email: 'contact@smart-home.com',
  description: '专业的智能家居管理平台，提供全方位的智能家居解决方案',
  createTime: '2026-01-01 00:00:00',
  updateTime: '2026-03-15 10:30:00'
})

// 平台配置
const platformConfig = ref({
  language: '简体中文',
  timezone: '中国标准时间',
  dateFormat: 'YYYY-MM-DD',
  currency: '人民币 (¥)',
  storage: '本地存储',
  smsService: '阿里云短信',
  emailService: 'SMTP',
  thirdPartyLogin: '微信'
})

// 平台状态
const platformStatus = ref({
  users: 12345,
  stores: 567,
  products: 8901,
  orders: 23456
})

// 弹窗状态
const editDialogVisible = ref(false)

// 编辑表单
const editForm = ref({
  name: '',
  domain: '',
  address: '',
  phone: '',
  email: '',
  description: '',
  language: '',
  timezone: '',
  dateFormat: '',
  currency: '',
  storage: '',
  smsService: '',
  emailService: '',
  thirdPartyLogin: ''
})

// 表单验证规则
const editFormRules = {
  name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  domain: [{ required: true, message: '请输入平台域名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  email: [{ required: true, message: '请输入联系邮箱', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
  address: [{ required: true, message: '请输入平台地址', trigger: 'blur' }],
  description: [{ required: true, message: '请输入平台描述', trigger: 'blur' }],
  language: [{ required: true, message: '请选择系统语言', trigger: 'change' }],
  timezone: [{ required: true, message: '请选择时区', trigger: 'change' }],
  dateFormat: [{ required: true, message: '请选择日期格式', trigger: 'change' }],
  currency: [{ required: true, message: '请选择货币单位', trigger: 'change' }],
  storage: [{ required: true, message: '请选择文件存储方式', trigger: 'change' }],
  smsService: [{ required: true, message: '请选择短信服务', trigger: 'change' }],
  emailService: [{ required: true, message: '请选择邮件服务', trigger: 'change' }],
  thirdPartyLogin: [{ required: true, message: '请选择第三方登录', trigger: 'change' }]
}

// 表单引用
const editFormRef = ref(null)

// 编辑平台信息
const editPlatformInfo = () => {
  // 填充表单数据
  editForm.value = {
    name: platformInfo.value.name,
    domain: platformInfo.value.domain,
    address: platformInfo.value.address,
    phone: platformInfo.value.phone,
    email: platformInfo.value.email,
    description: platformInfo.value.description,
    language: platformConfig.value.language,
    timezone: platformConfig.value.timezone,
    dateFormat: platformConfig.value.dateFormat,
    currency: platformConfig.value.currency,
    storage: platformConfig.value.storage,
    smsService: platformConfig.value.smsService,
    emailService: platformConfig.value.emailService,
    thirdPartyLogin: platformConfig.value.thirdPartyLogin
  }
  editDialogVisible.value = true
}

// 提交编辑表单
const submitEditForm = () => {
  if (!editFormRef.value) return
  
  editFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟提交数据
      setTimeout(() => {
        // 更新平台信息
        platformInfo.value = {
          ...platformInfo.value,
          name: editForm.value.name,
          domain: editForm.value.domain,
          address: editForm.value.address,
          phone: editForm.value.phone,
          email: editForm.value.email,
          description: editForm.value.description,
          updateTime: new Date().toLocaleString('zh-CN')
        }
        
        // 更新平台配置
        platformConfig.value = {
          language: editForm.value.language,
          timezone: editForm.value.timezone,
          dateFormat: editForm.value.dateFormat,
          currency: editForm.value.currency,
          storage: editForm.value.storage,
          smsService: editForm.value.smsService,
          emailService: editForm.value.emailService,
          thirdPartyLogin: editForm.value.thirdPartyLogin
        }
        
        ElMessage.success('平台信息更新成功')
        editDialogVisible.value = false
        loading.value = false
      }, 1000)
    }
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取平台信息
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('平台信息数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-system-platform {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.platform-info {
  margin-bottom: 20px;
}

.platform-config {
  margin-bottom: 20px;
}

.platform-status {
  margin-bottom: 20px;
}

.status-item {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background-color: #f5f7fa;
}

.status-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.status-label {
  font-size: 14px;
  color: #606266;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>