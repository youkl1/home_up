<template>
  <div class="headquarters-system-users">
    <div class="page-header">
      <h1>用户管理</h1>
      <el-button type="primary" @click="addUser">添加用户</el-button>
    </div>
    
    <!-- 用户筛选 -->
    <div class="user-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="filter.username" placeholder="用户名" @keyup.enter="search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="filter.realName" placeholder="真实姓名" @keyup.enter="search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="filter.status" placeholder="选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="启用"></el-option>
              <el-option label="禁用" value="禁用"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 15px;">
          <el-col :span="8">
            <el-select v-model="filter.role" placeholder="选择角色">
              <el-option label="全部" value=""></el-option>
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="管理员" value="管理员"></el-option>
              <el-option label="运营人员" value="运营人员"></el-option>
              <el-option label="财务人员" value="财务人员"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 用户列表 -->
    <div class="user-list">
      <el-card shadow="hover">
        <el-table :data="filteredUsers" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="用户ID" width="100"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="realName" label="真实姓名" width="120"></el-table-column>
          <el-table-column prop="role" label="角色" width="120"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
          <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewUser(scope.row)">查看</el-button>
              <el-button type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>
              <el-button :type="scope.row.status === '启用' ? 'danger' : 'success'" size="small" @click="toggleStatus(scope.row)">
                {{ scope.row.status === '启用' ? '禁用' : '启用' }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
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
    
    <!-- 用户详情弹窗 -->
    <el-dialog
      v-model="userDetailVisible"
      title="用户详情"
      width="600px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="用户信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户ID">
                <el-input v-model="currentUser.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名">
                <el-input v-model="currentUser.username" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="真实姓名">
                <el-input v-model="currentUser.realName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色">
                <el-input v-model="currentUser.role" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="邮箱">
                <el-input v-model="currentUser.email" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号">
                <el-input v-model="currentUser.phone" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态">
                <el-input v-model="currentUser.status" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间">
                <el-input v-model="currentUser.createTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑用户弹窗 -->
    <el-dialog
      v-model="userFormDialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="600px"
    >
      <el-form
        :model="userForm"
        :rules="userFormRules"
        ref="userFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="用户信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="userForm.realName" placeholder="请输入真实姓名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="密码" prop="password" v-if="!isEdit">
                <el-input v-model="userForm.password" type="password" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword" v-if="!isEdit">
                <el-input v-model="userForm.confirmPassword" type="password" placeholder="请确认密码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色" prop="role">
                <el-select v-model="userForm.role" placeholder="请选择角色">
                  <el-option label="超级管理员" value="超级管理员"></el-option>
                  <el-option label="管理员" value="管理员"></el-option>
                  <el-option label="运营人员" value="运营人员"></el-option>
                  <el-option label="财务人员" value="财务人员"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="userForm.phone" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="userForm.status" placeholder="请选择状态">
                  <el-option label="启用" value="启用"></el-option>
                  <el-option label="禁用" value="禁用"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userFormDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUserForm">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 加载状态
const loading = ref(false)

// 用户筛选
const filter = ref({
  username: '',
  realName: '',
  status: '',
  role: ''
})

// 用户数据
const users = ref([
  { id: 1, username: 'admin', realName: '管理员', role: '超级管理员', email: 'admin@example.com', phone: '138****1234', status: '启用', createTime: '2026-01-01 00:00:00' },
  { id: 2, username: 'user1', realName: '用户1', role: '管理员', email: 'user1@example.com', phone: '139****5678', status: '启用', createTime: '2026-01-02 00:00:00' },
  { id: 3, username: 'user2', realName: '用户2', role: '运营人员', email: 'user2@example.com', phone: '137****9012', status: '禁用', createTime: '2026-01-03 00:00:00' },
  { id: 4, username: 'user3', realName: '用户3', role: '财务人员', email: 'user3@example.com', phone: '136****3456', status: '启用', createTime: '2026-01-04 00:00:00' },
  { id: 5, username: 'user4', realName: '用户4', role: '运营人员', email: 'user4@example.com', phone: '135****7890', status: '启用', createTime: '2026-01-05 00:00:00' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const userDetailVisible = ref(false)
const userFormDialogVisible = ref(false)
const isEdit = ref(false)

// 当前用户
const currentUser = ref({})

// 用户表单
const userForm = ref({
  username: '',
  realName: '',
  password: '',
  confirmPassword: '',
  role: '',
  email: '',
  phone: '',
  status: '启用'
})

// 表单验证规则
const userFormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码长度至少为6位', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请确认密码', trigger: 'blur' }, {
    validator: (rule, value, callback) => {
      if (value !== userForm.value.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 表单引用
const userFormRef = ref(null)

// 过滤后的用户列表
const filteredUsers = computed(() => {
  let result = [...users.value]
  
  // 用户名过滤
  if (filter.value.username) {
    const keyword = filter.value.username.toLowerCase()
    result = result.filter(user => user.username.toLowerCase().includes(keyword))
  }
  
  // 真实姓名过滤
  if (filter.value.realName) {
    const keyword = filter.value.realName.toLowerCase()
    result = result.filter(user => user.realName.toLowerCase().includes(keyword))
  }
  
  // 状态过滤
  if (filter.value.status) {
    result = result.filter(user => user.status === filter.value.status)
  }
  
  // 角色过滤
  if (filter.value.role) {
    result = result.filter(user => user.role === filter.value.role)
  }
  
  return result
})

// 获取状态类型
const getStatusType = (status) => {
  return status === '启用' ? 'success' : 'danger'
}

// 搜索
const search = () => {
  loading.value = true
  // 模拟搜索逻辑
  setTimeout(() => {
    // 实际项目中这里应该调用API获取数据
    console.log(`搜索用户：用户名=${filter.value.username}，真实姓名=${filter.value.realName}，状态=${filter.value.status}，角色=${filter.value.role}`)
    ElMessage.success('搜索成功')
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  filter.value = {
    username: '',
    realName: '',
    status: '',
    role: ''
  }
  ElMessage.info('搜索条件已重置')
}

// 查看用户
const viewUser = (user) => {
  loading.value = true
  // 模拟获取用户详情
  setTimeout(() => {
    currentUser.value = { ...user }
    userDetailVisible.value = true
    loading.value = false
  }, 500)
}

// 编辑用户
const editUser = (user) => {
  isEdit.value = true
  userForm.value = {
    ...user,
    password: '',
    confirmPassword: ''
  }
  userFormDialogVisible.value = true
}

// 删除用户
const deleteUser = (userId) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除用户
    setTimeout(() => {
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value.splice(index, 1)
        total.value--
        ElMessage.success('用户删除成功')
      }
      loading.value = false
    }, 500)
  }).catch(() => {
    ElMessage.info('取消删除操作')
  })
}

// 切换用户状态
const toggleStatus = (user) => {
  loading.value = true
  // 模拟状态切换
  setTimeout(() => {
    user.status = user.status === '启用' ? '禁用' : '启用'
    ElMessage.success(`用户已${user.status}`)
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

// 添加用户
const addUser = () => {
  isEdit.value = false
  userForm.value = {
    username: '',
    realName: '',
    password: '',
    confirmPassword: '',
    role: '',
    email: '',
    phone: '',
    status: '启用'
  }
  userFormDialogVisible.value = true
}

// 提交用户表单
const submitUserForm = () => {
  if (!userFormRef.value) return
  
  userFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟提交数据
      setTimeout(() => {
        if (isEdit.value) {
          // 编辑用户
          const index = users.value.findIndex(u => u.id === userForm.value.id)
          if (index !== -1) {
            users.value[index] = {
              ...users.value[index],
              username: userForm.value.username,
              realName: userForm.value.realName,
              role: userForm.value.role,
              email: userForm.value.email,
              phone: userForm.value.phone,
              status: userForm.value.status
            }
            ElMessage.success('用户编辑成功')
          }
        } else {
          // 添加用户
          const newUser = {
            ...userForm.value,
            id: users.value.length + 1,
            createTime: new Date().toLocaleString('zh-CN')
          }
          users.value.unshift(newUser)
          total.value++
          ElMessage.success('用户添加成功')
        }
        userFormDialogVisible.value = false
        loading.value = false
      }, 1000)
    }
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取用户数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('用户数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-system-users {
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

.user-filter {
  margin-bottom: 20px;
}

.user-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>