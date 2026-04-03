<template>
  <div class="headquarters-materials">
    <div class="page-header">
      <h1>营销素材库管理</h1>
      <el-button type="primary" @click="uploadMaterial">上传素材</el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchKeyword" placeholder="搜索素材名称" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-select v-model="materialType" placeholder="选择素材类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="图片" value="image"></el-option>
              <el-option label="视频" value="video"></el-option>
              <el-option label="文档" value="document"></el-option>
              <el-option label="其他" value="other"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 素材列表 -->
    <div class="material-list">
      <el-card shadow="hover">
        <el-table :data="materials" style="width: 100%">
          <el-table-column prop="id" label="素材ID" width="80"></el-table-column>
          <el-table-column prop="name" label="素材名称"></el-table-column>
          <el-table-column prop="type" label="素材类型" width="100">
            <template #default="scope">
              <el-tag :type="getTypeType(scope.row.type)">{{ scope.row.typeText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="文件大小" width="100"></el-table-column>
          <el-table-column prop="uploader" label="上传人" width="120"></el-table-column>
          <el-table-column prop="uploadTime" label="上传时间" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewMaterial(scope.row)">查看</el-button>
              <el-button type="danger" size="small" @click="deleteMaterial(scope.row.id)">删除</el-button>
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
    
    <!-- 上传素材弹窗 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传素材"
      width="500px"
    >
      <el-form :model="uploadForm" label-width="80px">
        <el-form-item label="素材名称">
          <el-input v-model="uploadForm.name" placeholder="请输入素材名称"></el-input>
        </el-form-item>
        <el-form-item label="素材类型">
          <el-select v-model="uploadForm.type" placeholder="选择素材类型">
            <el-option label="图片" value="image"></el-option>
            <el-option label="视频" value="video"></el-option>
            <el-option label="文档" value="document"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            class="upload-demo"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              <span>点击上传</span>
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                请上传文件，支持图片、视频、文档等格式
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="uploadForm.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="禁用">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看素材弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="viewForm.name || '查看素材'"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="素材名称">{{ viewForm.name }}</el-descriptions-item>
        <el-descriptions-item label="素材类型">{{ viewForm.typeText }}</el-descriptions-item>
        <el-descriptions-item label="文件大小">{{ viewForm.size }}</el-descriptions-item>
        <el-descriptions-item label="上传人">{{ viewForm.uploader }}</el-descriptions-item>
        <el-descriptions-item label="上传时间">{{ viewForm.uploadTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ viewForm.status }}</el-descriptions-item>
        <el-descriptions-item label="预览">
          <div v-if="viewForm.type === 'image'" class="preview-image">
            <img :src="`https://neeko-copilot.bytedance.net/api/text2image?prompt=${encodeURIComponent(viewForm.name)}&size=400x300`" alt="预览图片" />
          </div>
          <div v-else-if="viewForm.type === 'video'" class="preview-video">
            <video width="400" height="300" controls>
              <source src="" type="video/mp4">
              您的浏览器不支持视频播放
            </video>
          </div>
          <div v-else-if="viewForm.type === 'document'" class="preview-document">
            <el-button type="primary">下载文档</el-button>
          </div>
          <div v-else class="preview-other">
            <el-button type="primary">下载文件</el-button>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElUpload, ElButton, ElIcon, ElLoading } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

// 搜索和筛选
const searchKeyword = ref('')
const materialType = ref('')

// 素材数据
const materials = ref([
  { id: 1, name: '产品宣传海报', type: 'image', typeText: '图片', size: '2.5MB', uploader: '管理员', uploadTime: '2026-04-01 10:30', status: '启用' },
  { id: 2, name: '品牌介绍视频', type: 'video', typeText: '视频', size: '56.8MB', uploader: '张三', uploadTime: '2026-03-31 14:20', status: '启用' },
  { id: 3, name: '产品手册', type: 'document', typeText: '文档', size: '8.2MB', uploader: '李四', uploadTime: '2026-03-30 09:15', status: '启用' },
  { id: 4, name: '活动策划方案', type: 'document', typeText: '文档', size: '12.5MB', uploader: '王五', uploadTime: '2026-03-29 16:45', status: '禁用' },
  { id: 5, name: '节日促销图片', type: 'image', typeText: '图片', size: '1.8MB', uploader: '管理员', uploadTime: '2026-03-28 11:00', status: '启用' }
])

// 分页
const total = ref(5)
const pageSize = ref(10)
const currentPage = ref(1)

// 弹窗相关
const uploadDialogVisible = ref(false)
const viewDialogVisible = ref(false)

// 上传表单
const uploadForm = ref({
  name: '',
  type: '',
  status: '启用'
})

// 查看表单
const viewForm = ref({
  id: null,
  name: '',
  type: '',
  typeText: '',
  size: '',
  uploader: '',
  uploadTime: '',
  status: ''
})

// 文件列表
const fileList = ref([])

// 获取素材类型样式
const getTypeType = (type) => {
  switch (type) {
    case 'image':
      return 'success'
    case 'video':
      return 'warning'
    case 'document':
      return 'info'
    default:
      return 'info'
  }
}

// 搜索
const search = () => {
  // 模拟搜索逻辑
  const keyword = searchKeyword.value.toLowerCase()
  const type = materialType.value
  
  // 模拟搜索过程
  const loading = ElLoading.service({ text: '正在搜索素材...' })
  
  // 模拟API调用延迟
  setTimeout(() => {
    // 过滤数据
    const filteredMaterials = materials.value.filter(m => {
      const nameMatch = m.name.toLowerCase().includes(keyword)
      const typeMatch = !type || m.type === type
      return nameMatch && typeMatch
    })
    
    // 更新显示数据
    total.value = filteredMaterials.length
    
    if (filteredMaterials.length > 0) {
      ElMessage.success(`找到 ${filteredMaterials.length} 个素材`)
    } else {
      ElMessage.info('未找到匹配的素材')
    }
    loading.close()
  }, 500)
}

// 重置
const reset = () => {
  searchKeyword.value = ''
  materialType.value = ''
  ElMessage.info('搜索条件已重置')
}

// 查看素材
const viewMaterial = (material) => {
  // 填充查看表单数据
  viewForm.value = {
    id: material.id,
    name: material.name,
    type: material.type,
    typeText: material.typeText,
    size: material.size,
    uploader: material.uploader,
    uploadTime: material.uploadTime,
    status: material.status
  }
  viewDialogVisible.value = true
}

// 删除素材
const deleteMaterial = (materialId) => {
  // 确认删除
  ElMessageBox.confirm('确定要删除该素材吗？删除后将无法恢复。', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除过程
    const loading = ElLoading.service({ text: '正在删除素材...' })
    
    // 模拟API调用延迟
    setTimeout(() => {
      // 模拟删除逻辑
      const index = materials.value.findIndex(m => m.id === materialId)
      if (index !== -1) {
        materials.value.splice(index, 1)
        total.value--
        ElMessage.success('素材删除成功')
      } else {
        ElMessage.error('素材不存在或已被删除')
      }
      loading.close()
    }, 500)
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除操作')
  })
}

// 分页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  // 模拟API调用延迟
  const loading = ElLoading.service({ text: '正在加载数据...' })
  
  setTimeout(() => {
    // 实际项目中这里应该调用API获取对应页的数据
    ElMessage.success(`切换到第 ${page} 页`)
    loading.close()
  }, 300)
}

// 上传素材
const uploadMaterial = () => {
  // 重置表单
  uploadForm.value = {
    name: '',
    type: '',
    status: '启用'
  }
  fileList.value = []
  uploadDialogVisible.value = true
}

// 提交上传
const submitUpload = () => {
  // 表单验证
  if (!uploadForm.value.name) {
    ElMessage.error('请输入素材名称')
    return
  }
  if (!uploadForm.value.type) {
    ElMessage.error('请选择素材类型')
    return
  }
  if (fileList.value.length === 0) {
    ElMessage.error('请上传文件')
    return
  }
  
  // 模拟上传过程
  const loading = ElLoading.service({ text: '正在上传素材...' })
  
  // 模拟API调用延迟
  setTimeout(() => {
    const typeTextMap = {
      image: '图片',
      video: '视频',
      document: '文档',
      other: '其他'
    }
    
    // 添加新素材
    const newMaterial = {
      id: materials.value.length + 1,
      name: uploadForm.value.name,
      type: uploadForm.value.type,
      typeText: typeTextMap[uploadForm.value.type] || '其他',
      size: '1.0MB', // 模拟文件大小
      uploader: '当前用户', // 模拟上传人
      uploadTime: new Date().toLocaleString('zh-CN'), // 模拟上传时间
      status: uploadForm.value.status
    }
    
    materials.value.push(newMaterial)
    total.value++
    ElMessage.success('素材上传成功')
    
    uploadDialogVisible.value = false
    loading.close()
  }, 1000)
}

// 处理文件预览
const handlePreview = (file) => {
  console.log('预览文件:', file)
}

// 处理文件移除
const handleRemove = (file, fileList) => {
  console.log('移除文件:', file, fileList)
}

// 组件挂载
onMounted(() => {
  // 模拟获取数据
  setTimeout(() => {
    // 数据加载完成
    console.log('素材数据加载完成')
  }, 500)
})
</script>

<style scoped>
.headquarters-materials {
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

.material-list {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>