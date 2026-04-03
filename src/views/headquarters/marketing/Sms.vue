<template>
  <div class="headquarters-marketing-sms">
    <div class="page-header">
      <h1>短信通道管理</h1>
      <el-button type="primary" @click="addChannel">添加通道</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索通道名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="channelStatus" placeholder="选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="启用"></el-option>
              <el-option label="禁用" value="禁用"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 通道列表 -->
    <div class="sms-list">
      <el-card shadow="hover">
        <el-table :data="filteredChannels" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="通道ID" width="80"></el-table-column>
          <el-table-column prop="name" label="通道名称"></el-table-column>
          <el-table-column prop="provider" label="服务商" width="120"></el-table-column>
          <el-table-column prop="apiKey" label="API Key" width="200"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewChannel(scope.row)">查看</el-button>
              <el-button type="primary" size="small" @click="editChannel(scope.row)">编辑</el-button>
              <el-button :type="getStatusType(scope.row.status) === 'success' ? 'warning' : 'success'" size="small" @click="toggleStatus(scope.row)">
                {{ scope.row.status === '启用' ? '禁用' : '启用' }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteChannel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    
    <!-- 短信发送记录 -->
    <div class="sms-records">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>短信发送记录</span>
            <el-button type="primary" @click="sendSms">发送短信</el-button>
          </div>
        </template>
        <el-table :data="smsRecords" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="记录ID" width="80"></el-table-column>
          <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
          <el-table-column prop="content" label="短信内容"></el-table-column>
          <el-table-column prop="channel" label="发送通道" width="120"></el-table-column>
          <el-table-column prop="status" label="发送状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sendTime" label="发送时间" width="180"></el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            layout="prev, pager, next"
            :total="recordsTotal"
            :page-size="pageSize"
            :current-page="recordsCurrentPage"
            @current-change="handleRecordsCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    
    <!-- 通道详情弹窗 -->
    <el-dialog
      v-model="channelDetailVisible"
      title="通道详情"
      width="600px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="通道信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="通道ID">
                <el-input v-model="currentChannel.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通道名称">
                <el-input v-model="currentChannel.name" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="服务商">
                <el-input v-model="currentChannel.provider" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="API Key">
                <el-input v-model="currentChannel.apiKey" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态">
                <el-input v-model="currentChannel.status" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间">
                <el-input v-model="currentChannel.createTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="通道描述">
          <el-input
            v-model="currentChannel.description"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="channelDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑通道弹窗 -->
    <el-dialog
      v-model="channelFormDialogVisible"
      :title="isEdit ? '编辑通道' : '添加通道'"
      width="600px"
    >
      <el-form
        :model="channelForm"
        :rules="channelFormRules"
        ref="channelFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="通道信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="通道名称" prop="name">
                <el-input v-model="channelForm.name" placeholder="请输入通道名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务商" prop="provider">
                <el-select v-model="channelForm.provider" placeholder="请选择服务商">
                  <el-option label="阿里云" value="阿里云"></el-option>
                  <el-option label="腾讯云" value="腾讯云"></el-option>
                  <el-option label="华为云" value="华为云"></el-option>
                  <el-option label="其他" value="其他"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="API Key" prop="apiKey">
                <el-input v-model="channelForm.apiKey" placeholder="请输入API Key"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="channelForm.status" placeholder="请选择状态">
                  <el-option label="启用" value="启用"></el-option>
                  <el-option label="禁用" value="禁用"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="通道描述" prop="description">
          <el-input
            v-model="channelForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入通道描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="channelFormDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitChannelForm">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 发送短信弹窗 -->
    <el-dialog
      v-model="sendSmsDialogVisible"
      title="发送短信"
      width="600px"
    >
      <el-form
        :model="smsForm"
        :rules="smsFormRules"
        ref="smsFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="短信信息">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="smsForm.phone" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="短信内容" prop="content">
                <el-input
                  v-model="smsForm.content"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入短信内容"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="发送通道" prop="channel">
                <el-select v-model="smsForm.channel" placeholder="请选择发送通道">
                  <el-option
                    v-for="channel in smsChannels"
                    :key="channel.id"
                    :label="channel.name"
                    :value="channel.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sendSmsDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitSmsForm">发送</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索和筛选
const searchKeyword = ref('')
const channelStatus = ref('')

// 加载状态
const loading = ref(false)

// 通道数据
const smsChannels = ref([
  { id: 1, name: '阿里云短信通道', provider: '阿里云', apiKey: 'AK*************123', status: '启用', createTime: '2026-04-01 10:30', description: '阿里云短信通道，用于发送验证码和通知短信' },
  { id: 2, name: '腾讯云短信通道', provider: '腾讯云', apiKey: 'SK*************456', status: '启用', createTime: '2026-03-31 14:20', description: '腾讯云短信通道，用于发送营销短信' },
  { id: 3, name: '华为云短信通道', provider: '华为云', apiKey: 'HW*************789', status: '禁用', createTime: '2026-03-30 09:15', description: '华为云短信通道，备用通道' }
])

// 短信记录数据
const smsRecords = ref([
  { id: 1, phone: '138****1234', content: '您的验证码是：123456，有效期5分钟', channel: '阿里云短信通道', status: '成功', sendTime: '2026-04-01 10:30:25' },
  { id: 2, phone: '139****5678', content: '您的订单已发货，物流单号：SF1234567890', channel: '腾讯云短信通道', status: '成功', sendTime: '2026-04-01 09:15:42' },
  { id: 3, phone: '137****9012', content: '活动提醒：春季促销活动已开始，点击查看详情', channel: '阿里云短信通道', status: '失败', sendTime: '2026-03-31 16:45:18' }
])

// 分页
const total = ref(3)
const pageSize = ref(10)
const currentPage = ref(1)
const recordsTotal = ref(3)
const recordsCurrentPage = ref(1)

// 弹窗状态
const channelDetailVisible = ref(false)
const channelFormDialogVisible = ref(false)
const sendSmsDialogVisible = ref(false)
const isEdit = ref(false)

// 当前通道
const currentChannel = ref({})

// 通道表单
const channelForm = ref({
  name: '',
  provider: '',
  apiKey: '',
  status: '启用',
  description: ''
})

// 短信表单
const smsForm = ref({
  phone: '',
  content: '',
  channel: ''
})

// 表单验证规则
const channelFormRules = {
  name: [{ required: true, message: '请输入通道名称', trigger: 'blur' }],
  provider: [{ required: true, message: '请选择服务商', trigger: 'change' }],
  apiKey: [{ required: true, message: '请输入API Key', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  description: [{ required: true, message: '请输入通道描述', trigger: 'blur' }]
}

const smsFormRules = {
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
  content: [{ required: true, message: '请输入短信内容', trigger: 'blur' }],
  channel: [{ required: true, message: '请选择发送通道', trigger: 'change' }]
}

// 表单引用
const channelFormRef = ref(null)
const smsFormRef = ref(null)

// 获取状态类型
const getStatusType = (status) => {
  return status === '启用' || status === '成功' ? 'success' : 'danger'
}

// 过滤后的通道列表
const filteredChannels = computed(() => {
  let result = [...smsChannels.value]
  
  // 搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(channel => channel.name.toLowerCase().includes(keyword))
  }
  
  // 状态过滤
  if (channelStatus.value) {
    result = result.filter(channel => channel.status === channelStatus.value)
  }
  
  return result
})

// 搜索
const search = () => {
  loading.value = true
  // 模拟搜索逻辑
  setTimeout(() => {
    // 实际项目中这里应该调用API获取数据
    console.log(`搜索通道：${searchKeyword.value}，状态：${channelStatus.value}`)
    ElMessage.success('搜索成功')
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  channelStatus.value = ''
  ElMessage.info('搜索条件已重置')
}

// 查看通道
const viewChannel = (channel) => {
  loading.value = true
  // 模拟API调用获取通道详情
  setTimeout(() => {
    currentChannel.value = { ...channel }
    channelDetailVisible.value = true
    loading.value = false
  }, 500)
}

// 编辑通道
const editChannel = (channel) => {
  isEdit.value = true
  channelForm.value = { ...channel }
  channelFormDialogVisible.value = true
}

// 删除通道
const deleteChannel = (channelId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该通道吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除逻辑
    setTimeout(() => {
      const index = smsChannels.value.findIndex(c => c.id === channelId)
      if (index !== -1) {
        smsChannels.value.splice(index, 1)
        total.value--
        ElMessage.success('通道删除成功')
      }
      loading.value = false
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 切换通道状态
const toggleStatus = (channel) => {
  loading.value = true
  // 模拟状态切换逻辑
  setTimeout(() => {
    channel.status = channel.status === '启用' ? '禁用' : '启用'
    ElMessage.success(`通道已${channel.status}`)
    loading.value = false
  }, 500)
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 实际项目中这里应该调用API获取对应页的数据
  console.log(`切换到第 ${page} 页`)
  ElMessage.info(`切换到第 ${page} 页`)
}

// 记录分页变化
const handleRecordsCurrentChange = (page) => {
  recordsCurrentPage.value = page
  // 实际项目中这里应该调用API获取对应页的数据
  console.log(`切换到第 ${page} 页`)
  ElMessage.info(`切换到第 ${page} 页`)
}

// 添加通道
const addChannel = () => {
  isEdit.value = false
  channelForm.value = {
    name: '',
    provider: '',
    apiKey: '',
    status: '启用',
    description: ''
  }
  channelFormDialogVisible.value = true
}

// 提交通道表单
const submitChannelForm = () => {
  if (!channelFormRef.value) return
  
  channelFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        if (isEdit.value) {
          // 编辑通道
          const index = smsChannels.value.findIndex(c => c.id === channelForm.value.id)
          if (index !== -1) {
            smsChannels.value[index] = { ...channelForm.value }
            ElMessage.success('通道编辑成功')
          }
        } else {
          // 添加通道
          const newChannel = {
            ...channelForm.value,
            id: smsChannels.value.length + 1,
            createTime: new Date().toLocaleString('zh-CN')
          }
          smsChannels.value.unshift(newChannel)
          total.value++
          ElMessage.success('通道添加成功')
        }
        channelFormDialogVisible.value = false
        loading.value = false
      }, 500)
    }
  })
}

// 发送短信
const sendSms = () => {
  smsForm.value = {
    phone: '',
    content: '',
    channel: ''
  }
  sendSmsDialogVisible.value = true
}

// 提交短信表单
const submitSmsForm = () => {
  if (!smsFormRef.value) return
  
  smsFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟发送短信逻辑
      setTimeout(() => {
        // 模拟发送结果
        const status = Math.random() > 0.2 ? '成功' : '失败'
        const newRecord = {
          id: smsRecords.value.length + 1,
          phone: smsForm.value.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
          content: smsForm.value.content,
          channel: smsForm.value.channel,
          status,
          sendTime: new Date().toLocaleString('zh-CN')
        }
        smsRecords.value.unshift(newRecord)
        recordsTotal.value++
        ElMessage.success(`短信${status === '成功' ? '发送成功' : '发送失败'}`)
        sendSmsDialogVisible.value = false
        loading.value = false
      }, 1000)
    }
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('短信通道数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-marketing-sms {
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

.search-filter {
  margin-bottom: 20px;
}

.sms-list {
  margin-bottom: 20px;
}

.sms-records {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>