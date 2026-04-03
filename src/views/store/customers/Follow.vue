<template>
  <div class="customer-follow">
    <div class="page-header">
      <h1>跟进监管</h1>
    </div>
    <el-card>
      <el-table :data="followRecords">
        <el-table-column prop="customerName" label="客户姓名" />
        <el-table-column prop="content" label="跟进内容" />
        <el-table-column prop="operator" label="跟进人" />
        <el-table-column prop="time" label="跟进时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const followRecords = ref([
  { id: 1, customerName: '客户A', content: '电话沟通需求', operator: '张小明', time: '2024-12-01 14:30' },
  { id: 2, customerName: '客户B', content: '微信发送报价', operator: '李小红', time: '2024-12-01 11:20' }
])
</script>

<style scoped lang="scss">
.customer-follow {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;

    h1 {
      margin: 0;
      font-size: 24px;
    }
  }
}
</style>
