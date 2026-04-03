<template>
  <div class="headquarters-marketing-community">
    <div class="page-header">
      <h1>社群管控</h1>
      <el-button type="primary" @click="addCommunity">添加社群</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索社群名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="communityType" placeholder="选择社群类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="客户群" value="客户群"></el-option>
              <el-option label="内部群" value="内部群"></el-option>
              <el-option label="合作伙伴群" value="合作伙伴群"></el-option>
              <el-option label="活动群" value="活动群"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 社群列表 -->
    <div class="community-list">
      <el-card shadow="hover">
        <el-table :data="filteredCommunities" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="社群ID" width="80"></el-table-column>
          <el-table-column prop="name" label="社群名称"></el-table-column>
          <el-table-column prop="type" label="社群类型" width="120"></el-table-column>
          <el-table-column prop="owner" label="负责人" width="120"></el-table-column>
          <el-table-column prop="memberCount" label="成员数量" width="100"></el-table-column>
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
              <el-button size="small" @click="viewCommunity(scope.row)">查看</el-button>
              <el-button type="primary" size="small" @click="editCommunity(scope.row)">编辑</el-button>
              <el-button :type="getStatusType(scope.row.status) === 'success' ? 'warning' : 'success'" size="small" @click="toggleStatus(scope.row)">
                {{ scope.row.status === '活跃' ? '禁用' : '启用' }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteCommunity(scope.row.id)">删除</el-button>
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
    
    <!-- 社群详情弹窗 -->
    <el-dialog
      v-model="communityDetailVisible"
      title="社群详情"
      width="600px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="社群信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="社群ID">
                <el-input v-model="currentCommunity.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="社群名称">
                <el-input v-model="currentCommunity.name" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="社群类型">
                <el-input v-model="currentCommunity.type" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人">
                <el-input v-model="currentCommunity.owner" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="成员数量">
                <el-input v-model="currentCommunity.memberCount" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态">
                <el-input v-model="currentCommunity.status" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="创建时间">
                <el-input v-model="currentCommunity.createTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="社群描述">
          <el-input
            v-model="currentCommunity.description"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="群公告">
          <el-input
            v-model="currentCommunity.announcement"
            type="textarea"
            :rows="4"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="communityDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑社群弹窗 -->
    <el-dialog
      v-model="communityFormDialogVisible"
      :title="isEdit ? '编辑社群' : '添加社群'"
      width="600px"
    >
      <el-form
        :model="communityForm"
        :rules="communityFormRules"
        ref="communityFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="社群信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="社群名称" prop="name">
                <el-input v-model="communityForm.name" placeholder="请输入社群名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="社群类型" prop="type">
                <el-select v-model="communityForm.type" placeholder="请选择社群类型">
                  <el-option label="客户群" value="客户群"></el-option>
                  <el-option label="内部群" value="内部群"></el-option>
                  <el-option label="合作伙伴群" value="合作伙伴群"></el-option>
                  <el-option label="活动群" value="活动群"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="负责人" prop="owner">
                <el-input v-model="communityForm.owner" placeholder="请输入负责人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成员数量" prop="memberCount">
                <el-input v-model.number="communityForm.memberCount" placeholder="请输入成员数量" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="communityForm.status" placeholder="请选择状态">
                  <el-option label="活跃" value="活跃"></el-option>
                  <el-option label="禁用" value="禁用"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="社群描述" prop="description">
          <el-input
            v-model="communityForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入社群描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="群公告" prop="announcement">
          <el-input
            v-model="communityForm.announcement"
            type="textarea"
            :rows="4"
            placeholder="请输入群公告"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="communityFormDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCommunityForm">保存</el-button>
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
const communityType = ref('')

// 加载状态
const loading = ref(false)

// 社群数据
const communities = ref([
  { id: 1, name: '北京客户交流群', type: '客户群', owner: '张三', memberCount: 256, status: '活跃', createTime: '2026-04-01 10:30', description: '北京地区客户交流群，用于客户问题解答和产品咨询', announcement: '欢迎加入北京客户交流群，本群用于交流产品使用问题和分享使用经验' },
  { id: 2, name: '上海门店工作群', type: '内部群', owner: '李四', memberCount: 45, status: '活跃', createTime: '2026-03-31 14:20', description: '上海地区门店工作群，用于门店运营管理', announcement: '请各位门店经理每日汇报销售情况，及时反馈问题' },
  { id: 3, name: '全国经销商群', type: '合作伙伴群', owner: '王五', memberCount: 128, status: '活跃', createTime: '2026-03-30 09:15', description: '全国经销商交流群，用于经销商政策传达和问题解答', announcement: '最新经销商政策已发布，请各位经销商查收' },
  { id: 4, name: '广州客户服务群', type: '客户群', owner: '赵六', memberCount: 189, status: '活跃', createTime: '2026-03-29 16:45', description: '广州地区客户服务群，用于客户服务和支持', announcement: '客服工作时间：9:00-18:00，如有问题请在此时间内咨询' },
  { id: 5, name: '深圳促销活动群', type: '活动群', owner: '孙七', memberCount: 98, status: '活跃', createTime: '2026-03-28 11:00', description: '深圳地区促销活动群，用于活动宣传和报名', announcement: '本群用于深圳地区促销活动信息发布和报名，欢迎大家积极参与' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const communityDetailVisible = ref(false)
const communityFormDialogVisible = ref(false)
const isEdit = ref(false)

// 当前社群
const currentCommunity = ref({})

// 社群表单
const communityForm = ref({
  name: '',
  type: '',
  owner: '',
  memberCount: 0,
  status: '活跃',
  description: '',
  announcement: ''
})

// 表单验证规则
const communityFormRules = {
  name: [{ required: true, message: '请输入社群名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择社群类型', trigger: 'change' }],
  owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  memberCount: [{ required: true, message: '请输入成员数量', trigger: 'blur' }, { type: 'number', message: '成员数量必须是数字', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  description: [{ required: true, message: '请输入社群描述', trigger: 'blur' }],
  announcement: [{ required: true, message: '请输入群公告', trigger: 'blur' }]
}

// 表单引用
const communityFormRef = ref(null)

// 获取状态类型
const getStatusType = (status) => {
  return status === '活跃' ? 'success' : 'danger'
}

// 过滤后的社群列表
const filteredCommunities = computed(() => {
  let result = [...communities.value]
  
  // 搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(community => community.name.toLowerCase().includes(keyword))
  }
  
  // 社群类型过滤
  if (communityType.value) {
    result = result.filter(community => community.type === communityType.value)
  }
  
  return result
})

// 搜索
const search = () => {
  loading.value = true
  // 模拟搜索逻辑
  setTimeout(() => {
    // 实际项目中这里应该调用API获取数据
    console.log(`搜索社群：${searchKeyword.value}，类型：${communityType.value}`)
    ElMessage.success('搜索成功')
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  communityType.value = ''
  ElMessage.info('搜索条件已重置')
}

// 查看社群
const viewCommunity = (community) => {
  loading.value = true
  // 模拟API调用获取社群详情
  setTimeout(() => {
    currentCommunity.value = { ...community }
    communityDetailVisible.value = true
    loading.value = false
  }, 500)
}

// 编辑社群
const editCommunity = (community) => {
  isEdit.value = true
  communityForm.value = { ...community }
  communityFormDialogVisible.value = true
}

// 删除社群
const deleteCommunity = (communityId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该社群吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除逻辑
    setTimeout(() => {
      const index = communities.value.findIndex(c => c.id === communityId)
      if (index !== -1) {
        communities.value.splice(index, 1)
        total.value--
        ElMessage.success('社群删除成功')
      }
      loading.value = false
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 切换社群状态
const toggleStatus = (community) => {
  loading.value = true
  // 模拟状态切换逻辑
  setTimeout(() => {
    community.status = community.status === '活跃' ? '禁用' : '活跃'
    ElMessage.success(`社群已${community.status}`)
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

// 添加社群
const addCommunity = () => {
  isEdit.value = false
  communityForm.value = {
    name: '',
    type: '',
    owner: '',
    memberCount: 0,
    status: '活跃',
    description: '',
    announcement: ''
  }
  communityFormDialogVisible.value = true
}

// 提交社群表单
const submitCommunityForm = () => {
  if (!communityFormRef.value) return
  
  communityFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        if (isEdit.value) {
          // 编辑社群
          const index = communities.value.findIndex(c => c.id === communityForm.value.id)
          if (index !== -1) {
            communities.value[index] = { ...communityForm.value }
            ElMessage.success('社群编辑成功')
          }
        } else {
          // 添加社群
          const newCommunity = {
            ...communityForm.value,
            id: communities.value.length + 1,
            createTime: new Date().toLocaleString('zh-CN')
          }
          communities.value.unshift(newCommunity)
          total.value++
          ElMessage.success('社群添加成功')
        }
        communityFormDialogVisible.value = false
        loading.value = false
      }, 500)
    }
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('社群数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-marketing-community {
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

.community-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>