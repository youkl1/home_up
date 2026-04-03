<template>
  <div class="headquarters-system-menu">
    <div class="page-header">
      <h1>菜单管理</h1>
      <el-button type="primary" @click="addMenu">添加菜单</el-button>
    </div>
    
    <!-- 菜单树 -->
    <div class="menu-tree">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>菜单结构</span>
            <el-button size="small" @click="expandAll">全部展开</el-button>
            <el-button size="small" @click="collapseAll">全部折叠</el-button>
          </div>
        </template>
        <el-tree
          :data="menuTree"
          :props="defaultProps"
          :expand-on-click-node="false"
          node-key="id"
          ref="menuTreeRef"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <span class="tree-node">
              <span>{{ data.title }}</span>
              <span class="node-actions">
                <el-button size="mini" @click.stop="editMenu(data)">编辑</el-button>
                <el-button size="mini" type="success" @click.stop="addSubMenu(data)">添加子菜单</el-button>
                <el-button size="mini" type="danger" @click.stop="deleteMenu(data)">删除</el-button>
              </span>
            </span>
          </template>
        </el-tree>
      </el-card>
    </div>
    
    <!-- 菜单详情 -->
    <div class="menu-detail" v-if="selectedMenu">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>菜单详情</span>
          </div>
        </template>
        <el-descriptions :column="1">
          <el-descriptions-item label="菜单ID">{{ selectedMenu.id }}</el-descriptions-item>
          <el-descriptions-item label="菜单名称">{{ selectedMenu.title }}</el-descriptions-item>
          <el-descriptions-item label="菜单路径">{{ selectedMenu.path }}</el-descriptions-item>
          <el-descriptions-item label="组件路径">{{ selectedMenu.component }}</el-descriptions-item>
          <el-descriptions-item label="菜单图标">{{ selectedMenu.icon }}</el-descriptions-item>
          <el-descriptions-item label="排序">{{ selectedMenu.sort }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ selectedMenu.status === 1 ? '启用' : '禁用' }}</el-descriptions-item>
          <el-descriptions-item label="权限标识">{{ selectedMenu.permission }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedMenu.createTime }}</el-descriptions-item>
          <el-descriptions-item label="最后更新">{{ selectedMenu.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    
    <!-- 添加/编辑菜单弹窗 -->
    <el-dialog
      v-model="menuDialogVisible"
      :title="isEdit ? '编辑菜单' : '添加菜单'"
      width="600px"
    >
      <el-form
        :model="menuForm"
        :rules="menuFormRules"
        ref="menuFormRef"
        label-position="top"
        v-loading="loading"
      >
        <el-form-item label="菜单信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="title">
                <el-input v-model="menuForm.title" placeholder="请输入菜单名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单路径" prop="path">
                <el-input v-model="menuForm.path" placeholder="请输入菜单路径"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="组件路径" prop="component">
                <el-input v-model="menuForm.component" placeholder="请输入组件路径"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单图标" prop="icon">
                <el-input v-model="menuForm.icon" placeholder="请输入菜单图标"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="排序" prop="sort">
                <el-input-number v-model="menuForm.sort" :min="0" :step="1"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-switch v-model="menuForm.status" active-value="1" inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="权限标识" prop="permission">
                <el-input v-model="menuForm.permission" placeholder="请输入权限标识"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="menuDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitMenuForm">保存</el-button>
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

// 菜单树数据
const menuTree = ref([
  {
    id: 1,
    title: '系统管理',
    path: '/system',
    component: 'Layout',
    icon: 'Setting',
    sort: 1,
    status: 1,
    permission: 'system:manage',
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00',
    children: [
      {
        id: 2,
        title: '系统总览',
        path: 'overview',
        component: 'system/Overview',
        icon: 'View',
        sort: 1,
        status: 1,
        permission: 'system:overview',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      },
      {
        id: 3,
        title: '平台信息',
        path: 'platform',
        component: 'system/Platform',
        icon: 'Platform',
        sort: 2,
        status: 1,
        permission: 'system:platform',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      },
      {
        id: 4,
        title: '用户管理',
        path: 'users',
        component: 'system/Users',
        icon: 'User',
        sort: 3,
        status: 1,
        permission: 'system:users',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      },
      {
        id: 5,
        title: '角色管理',
        path: 'roles',
        component: 'system/Roles',
        icon: 'UserFilled',
        sort: 4,
        status: 1,
        permission: 'system:roles',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      },
      {
        id: 6,
        title: '菜单管理',
        path: 'menu',
        component: 'system/Menu',
        icon: 'Menu',
        sort: 5,
        status: 1,
        permission: 'system:menu',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      },
      {
        id: 7,
        title: '字典配置',
        path: 'dictionary',
        component: 'system/Dictionary',
        icon: 'Document',
        sort: 6,
        status: 1,
        permission: 'system:dictionary',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      },
      {
        id: 8,
        title: '日志管理',
        path: 'log',
        component: 'system/Log',
        icon: 'DocumentCopy',
        sort: 7,
        status: 1,
        permission: 'system:log',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      }
    ]
  },
  {
    id: 9,
    title: '营销工具',
    path: '/marketing',
    component: 'Layout',
    icon: 'Promotion',
    sort: 2,
    status: 1,
    permission: 'marketing:manage',
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00',
    children: [
      {
        id: 10,
        title: '工具配置',
        path: 'tools',
        component: 'marketing/Tools',
        icon: 'Tool',
        sort: 1,
        status: 1,
        permission: 'marketing:tools',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      },
      {
        id: 11,
        title: '活动管理',
        path: 'activities',
        component: 'marketing/Activities',
        icon: 'Calendar',
        sort: 2,
        status: 1,
        permission: 'marketing:activities',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      },
      {
        id: 12,
        title: '社群管控',
        path: 'community',
        component: 'marketing/Community',
        icon: 'ChatLineSquare',
        sort: 3,
        status: 1,
        permission: 'marketing:community',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      },
      {
        id: 13,
        title: '短信通道',
        path: 'sms',
        component: 'marketing/Sms',
        icon: 'Message',
        sort: 4,
        status: 1,
        permission: 'marketing:sms',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      }
    ]
  },
  {
    id: 14,
    title: '数据运营',
    path: '/data',
    component: 'Layout',
    icon: 'DataAnalysis',
    sort: 3,
    status: 1,
    permission: 'data:manage',
    createTime: '2026-01-01 00:00:00',
    updateTime: '2026-01-01 00:00:00',
    children: [
      {
        id: 15,
        title: '数据分析',
        path: 'analysis',
        component: 'data/Analysis',
        icon: 'DataLine',
        sort: 1,
        status: 1,
        permission: 'data:analysis',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      },
      {
        id: 16,
        title: '自定义报表',
        path: 'reports',
        component: 'data/Reports',
        icon: 'DataBoard',
        sort: 2,
        status: 1,
        permission: 'data:reports',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      },
      {
        id: 17,
        title: '异常预警',
        path: 'alerts',
        component: 'data/Alerts',
        icon: 'Warning',
        sort: 3,
        status: 1,
        permission: 'data:alerts',
        createTime: '2026-01-01 00:00:00',
        updateTime: '2026-01-01 00:00:00'
      }
    ]
  }
])

// 菜单树配置
const defaultProps = {
  children: 'children',
  label: 'title'
}

// 菜单树引用
const menuTreeRef = ref(null)

// 选中的菜单
const selectedMenu = ref(null)

// 弹窗状态
const menuDialogVisible = ref(false)

// 是否编辑
const isEdit = ref(false)

// 菜单表单
const menuForm = ref({
  id: '',
  title: '',
  path: '',
  component: '',
  icon: '',
  sort: 0,
  status: 1,
  permission: '',
  parentId: ''
})

// 表单验证规则
const menuFormRules = {
  title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  permission: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
}

// 表单引用
const menuFormRef = ref(null)

// 处理节点点击
const handleNodeClick = (data) => {
  selectedMenu.value = { ...data }
}

// 展开全部
const expandAll = () => {
  menuTreeRef.value?.store?.expandAll()
}

// 折叠全部
const collapseAll = () => {
  menuTreeRef.value?.store?.collapseAll()
}

// 添加菜单
const addMenu = () => {
  isEdit.value = false
  menuForm.value = {
    id: '',
    title: '',
    path: '',
    component: '',
    icon: '',
    sort: 0,
    status: 1,
    permission: '',
    parentId: ''
  }
  menuDialogVisible.value = true
}

// 添加子菜单
const addSubMenu = (parentMenu) => {
  isEdit.value = false
  menuForm.value = {
    id: '',
    title: '',
    path: '',
    component: '',
    icon: '',
    sort: 0,
    status: 1,
    permission: '',
    parentId: parentMenu.id
  }
  menuDialogVisible.value = true
}

// 编辑菜单
const editMenu = (menu) => {
  isEdit.value = true
  menuForm.value = { ...menu }
  menuDialogVisible.value = true
}

// 删除菜单
const deleteMenu = (menu) => {
  ElMessageBox.confirm(`确定要删除菜单 "${menu.title}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true
    // 模拟删除菜单
    setTimeout(() => {
      // 实际项目中这里应该调用API删除菜单
      ElMessage.success('菜单删除成功')
      loading.value = false
    }, 500)
  }).catch(() => {
    ElMessage.info('取消删除操作')
  })
}

// 提交菜单表单
const submitMenuForm = () => {
  if (!menuFormRef.value) return
  
  menuFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟提交数据
      setTimeout(() => {
        // 实际项目中这里应该调用API保存菜单
        if (isEdit.value) {
          ElMessage.success('菜单编辑成功')
        } else {
          ElMessage.success('菜单添加成功')
        }
        menuDialogVisible.value = false
        loading.value = false
      }, 1000)
    }
  })
}

// 组件挂载
onMounted(() => {
  // 模拟获取菜单数据
  loading.value = true
  setTimeout(() => {
    // 数据加载完成
    console.log('菜单数据加载完成')
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.headquarters-system-menu {
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

.menu-tree {
  margin-bottom: 20px;
}

.menu-detail {
  margin-bottom: 20px;
}

.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.node-actions {
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tree-node:hover .node-actions {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>