<template>
  <div class="headquarters-system-roles">
    <div class="page-header">
      <h1>角色管理</h1>
      <el-button type="primary" @click="addRole">添加角色</el-button>
    </div>
    
    <!-- 角色筛选 -->
    <div class="role-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="filter.roleName" placeholder="角色名称" @keyup.enter="search"></el-input>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 角色列表 -->
    <div class="role-list">
      <el-card shadow="hover">
        <el-table :data="filteredRoles" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="角色ID" width="100"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="description" label="角色描述"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="viewRole(scope.row)">查看</el-button>
              <el-button type="primary" size="small" @click="editRole(scope.row)">编辑</el-button>
              <el-button :type="scope.row.status === '启用' ? 'danger' : 'success'" size="small" @click="toggleStatus(scope.row)">
                {{ scope.row.status === '启用' ? '禁用' : '启用' }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteRole(scope.row.id)">删除</el-button>
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
    
    <!-- 角色详情弹窗 -->
    <el-dialog
      v-model="roleDetailVisible"
      title="角色详情"
      width="600px"
    >
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="角色信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="角色ID">
                <el-input v-model="currentRole.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色名称">
                <el-input v-model="currentRole.roleName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态">
                <el-input v-model="currentRole.status" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间">
                <el-input v-model="currentRole.createTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="角色描述">
                <el-input
                  v-model="currentRole.description"
                  type="textarea"
                  :rows="4"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="权限设置">
          <el-tree
            :data="permissionTree"
            :props="defaultProps"
            :default-expanded-keys="expandedKeys"
            show-checkbox
            node-key="id"
            :check-strictly="true"
            :default-checked-keys="currentRole.permissions || []"
            disabled
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑角色弹窗 -->
    <el-dialog
      v-model="roleFormDialogVisible"
      :title="isEdit ? '编辑角色' : '添加角色'"
      width="600px"
    >
      <el-form
        :model="roleForm"
        :rules="roleFormRules"
        ref="roleFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="角色信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="roleForm.status" placeholder="请选择状态">
                  <el-option label="启用" value="启用"></el-option>
                  <el-option label="禁用" value="禁用"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="角色描述" prop="description">
                <el-input
                  v-model="roleForm.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入角色描述"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="权限设置" prop="permissions">
          <el-tree
            :data="permissionTree"
            :props="defaultProps"
            :default-expanded-keys="expandedKeys"
            show-checkbox
            node-key="id"
            :check-strictly="true"
            v-model:checkedKeys="roleForm.permissions"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleFormDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRoleForm">保存</el-button>
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

// 角色筛选
const filter = ref({
  roleName: ''
})

// 角色数据
const roles = ref([
  { id: 1, roleName: '超级管理员', description: '拥有系统所有权限', status: '启用', createTime: '2026-01-01 00:00:00', permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: 2, roleName: '管理员', description: '拥有系统大部分权限', status: '启用', createTime: '2026-01-02 00:00:00', permissions: [1, 2, 3, 4, 5, 6] },
  { id: 3, roleName: '运营人员', description: '拥有运营相关权限', status: '启用', createTime: '2026-01-03 00:00:00', permissions: [1, 2, 3, 7, 8] },
  { id: 4, roleName: '财务人员', description: '拥有财务相关权限', status: '启用', createTime: '2026-01-04 00:00:00', permissions: [1, 4, 5, 9, 10] }
])

// 权限树
const permissionTree = ref([
  { id: 1, label: '系统管理', children: [
    { id: 2, label: '用户管理' },
    { id: 3, label: '角色管理' },
    { id: 4, label: '菜单管理' },
    { id: 5, label: '字典管理' }
  ]},
  { id: 6, label: '营销管理', children: [
    { id: 7, label: '营销工具' },
    { id: 8, label: '活动管理' }
  ]},
  { id: 9, label: '财务管理', children: [
    { id: 10, label: '财务报表' }
  ]}
])

// 树节点属性
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 默认展开的节点
const expandedKeys = ref([1, 6, 9])

// 分页
const total = ref(4)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗状态
const roleDetailVisible = ref(false)
const roleFormDialogVisible = ref(false)
const isEdit = ref(false)

// 当前角色
const currentRole = ref({})

// 角色表单
const roleForm = ref({
  roleName: '',
  description: '',
  status: '启用',
  permissions: []
})

// 表单验证规则
const roleFormRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  permissions: [{ required: true, message: '请选择至少一个权限', trigger: 'change' }]
}

// 表单引用
const roleFormRef = ref(null)

// 过滤后的角色列表
const filteredRoles = computed(() => {
  let result = [...roles.value]
  
  // 角色名称过滤
  if (filter.value.roleName) {
    const keyword = filter.value.roleName.toLowerCase()
    result = result.filter(role => role.roleName.toLowerCase().includes(keyword))
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
    console.log(`搜索角色：${filter.value.roleName}`)
    ElMessage.success('搜索成功')
    loading.value = false
  }, 500)
}

// 重置
const reset = () => {
  filter.value = {
    roleName: ''
  }
  ElMessage.info('搜索条件已重置')
}

// 查看角色
const viewRole = (role) => {
  loading.value = true
  // 模拟获取角色详情
  setTimeout(() => {
    currentRole.value = { ...role }
    roleDetailVisible.value = true
    loading.value = false
  }, 500)
}

// 编辑角色
const editRole = (role) => {
  isEdit.value = true
  roleForm.value = {
    ...role
  }
  roleFormDialogVisible.value = true
}

// 删除角色
const deleteRole = (roleId) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除角色
    setTimeout(() => {
      const index = roles.value.findIndex(r => r.id === roleId)
      if (index !== -1) {
        roles.value.splice(index, 1)
        total.value--
        ElMessage.success('角色删除成功')
      }
      loading.value = false
    }, 500)
  }).catch(() => {
    ElMessage.info('取消删除操作')
  })
}

// 切换角色状态
const toggleStatus = (role) => {
  loading.value = true
  // 模拟状态切换
  setTimeout(() => {
    role.status = role.status === '启用' ? '禁用' : '启用'
    ElMessage.success(`角色已${role.status}`)
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

// 添加角色
const addRole = () => {
  isEdit.value = false
  roleForm.value = {
    roleName: '',
    description: '',
    status: '启用',
    permissions: []
  }
  roleFormDialogVisible.value = true
}

// 提交角色表单
const submitRoleForm = () => {
  if (!roleFormRef.value) return
  
  roleFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟提交数据
      setTimeout(() => {
        if (isEdit.value) {
          // 编辑角色
          const index = roles.value.findIndex(r => r.id === roleForm.value.id)
          if (index !== -1) {
            roles.value[index] = {
              ...roleForm.value
            }
            ElMessage.success('角色编辑成功')
          }
        } else {
          // 添加角色
          const newRole = {
            ...roleForm.value,
            id: roles.value.length + 1,
            createTime: new Date().toLocaleString('zh-CN')
          }
          roles.value.unshift(newRole)
          total.value++
          ElMessage.success('角色添加成功')
        }
        roleFormDialogVisible.value = false
        loading.value = false
      }, 1000)
    }
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取角色数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('角色数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-system-roles {
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

.role-filter {
  margin-bottom: 20px;
}

.role-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>