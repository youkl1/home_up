<template>
  <div class="headquarters-settings-menu">
    <div class="page-header">
      <h1>菜单管理</h1>
      <el-button type="primary">添加菜单</el-button>
    </div>
    
    <!-- 菜单树 -->
    <div class="menu-tree">
      <el-card shadow="hover">
        <el-tree
          :data="menuList"
          :props="menuProps"
          node-key="id"
          default-expand-all
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <span class="menu-node">
              <span>{{ node.label }}</span>
              <span class="menu-actions">
                <el-button type="primary" size="small" @click.stop="editMenu(data.id)">编辑</el-button>
                <el-button type="danger" size="small" @click.stop="deleteMenu(data.id)">删除</el-button>
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
            <el-button type="primary" size="small" @click="saveMenu">保存修改</el-button>
          </div>
        </template>
        <el-form :model="selectedMenu" label-width="120px">
          <el-form-item label="菜单名称">
            <el-input v-model="selectedMenu.name" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径">
            <el-input v-model="selectedMenu.path" placeholder="请输入菜单路径"></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="selectedMenu.icon" placeholder="请输入图标名称"></el-input>
          </el-form-item>
          <el-form-item label="父菜单">
            <el-select v-model="selectedMenu.parentId" placeholder="选择父菜单">
              <el-option label="根菜单" value="0"></el-option>
              <el-option v-for="menu in menuList" :key="menu.id" :label="menu.name" :value="menu.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="selectedMenu.sort" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="selectedMenu.status"></el-switch>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 菜单数据
const menuList = ref([
  {
    id: 1,
    name: '仪表盘',
    path: '/headquarters/home',
    icon: 'Dashboard',
    parentId: 0,
    sort: 1,
    status: true,
    children: []
  },
  {
    id: 2,
    name: '产品管理',
    path: '/headquarters/products',
    icon: 'Goods',
    parentId: 0,
    sort: 2,
    status: true,
    children: []
  },
  {
    id: 3,
    name: '客户管理',
    path: '/headquarters/customers',
    icon: 'User',
    parentId: 0,
    sort: 3,
    status: true,
    children: []
  },
  {
    id: 4,
    name: '组织管理',
    path: '',
    icon: 'UserFilled',
    parentId: 0,
    sort: 4,
    status: true,
    children: [
      {
        id: 5,
        name: '门店管理',
        path: '/headquarters/stores',
        icon: 'Shop',
        parentId: 4,
        sort: 1,
        status: true
      },
      {
        id: 6,
        name: '用户管理',
        path: '/headquarters/users',
        icon: 'Avatar',
        parentId: 4,
        sort: 2,
        status: true
      }
    ]
  }
])

// 菜单属性
const menuProps = {
  children: 'children',
  label: 'name'
}

// 选中的菜单
const selectedMenu = ref(null)

// 处理节点点击
const handleNodeClick = (data) => {
  selectedMenu.value = { ...data }
}

// 编辑菜单
const editMenu = (menuId) => {
  const menu = menuList.value.find(m => m.id === menuId) || menuList.value.flatMap(m => m.children || []).find(m => m.id === menuId)
  if (menu) {
    selectedMenu.value = { ...menu }
  }
  ElMessage.success(`编辑菜单：${menuId}`)
}

// 删除菜单
const deleteMenu = (menuId) => {
  ElMessage.success(`删除菜单：${menuId}`)
}

// 保存菜单
const saveMenu = () => {
  ElMessage.success('菜单保存成功')
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
.headquarters-settings-menu {
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

.menu-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.menu-actions {
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s;
}

.menu-node:hover .menu-actions {
  opacity: 1;
}

.menu-detail {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>