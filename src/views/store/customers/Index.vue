<template>
  <div class="customer-management">
    <div class="page-header">
      <h1>客户管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          添加客户
        </el-button>
        <el-button @click="showImportDialog">
          <el-icon><Upload /></el-icon>
          批量导入
        </el-button>
        <el-button @click="showExportDialog">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="stat-card">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">客户总数</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="stat-card primary">
            <div class="stat-value">{{ stats.todayNew }}</div>
            <div class="stat-label">今日新增</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="stat-card warning">
            <div class="stat-value">{{ stats.followUp }}</div>
            <div class="stat-label">待跟进</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="stat-card success">
            <div class="stat-value">{{ stats.deals }}</div>
            <div class="stat-label">已成交</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="stat-card danger">
            <div class="stat-value">{{ stats.highValue }}</div>
            <div class="stat-label">高价值客户</div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="stat-card info">
            <div class="stat-value">{{ stats.referral }}</div>
            <div class="stat-label">转介绍客户</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索筛选 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-row :gutter="15">
          <el-col :span="4">
            <el-input v-model="searchForm.keyword" placeholder="姓名/电话" clearable />
          </el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.level" placeholder="客户等级" clearable>
              <el-option label="A级" value="A" />
              <el-option label="B级" value="B" />
              <el-option label="C级" value="C" />
              <el-option label="D级" value="D" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.source" placeholder="客户来源" clearable>
              <el-option label="自然进店" value="walkin" />
              <el-option label="电话邀约" value="phone" />
              <el-option label="线上推广" value="online" />
              <el-option label="转介绍" value="referral" />
              <el-option label="异业合作" value="partner" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.status" placeholder="跟进状态" clearable>
              <el-option label="新客资" value="new" />
              <el-option label="跟进中" value="following" />
              <el-option label="意向强烈" value="intention" />
              <el-option label="已报价" value="quoted" />
              <el-option label="已成交" value="dealed" />
              <el-option label="已流失" value="lost" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.owner" placeholder="所属导购" clearable>
              <el-option v-for="guide in guides" :key="guide.id" :label="guide.name" :value="guide.id" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.tag" placeholder="客户标签" clearable>
              <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 客户列表 -->
    <div class="customer-list">
      <el-card shadow="hover">
        <el-table :data="customers" v-loading="loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="客户信息" min-width="180">
            <template #default="{ row }">
              <div class="customer-info">
                <el-avatar :size="40" :src="row.avatar">{{ row.name?.charAt(0) }}</el-avatar>
                <div class="info-detail">
                  <div class="name">
                    {{ row.name }}
                    <el-tag v-if="row.level" :type="getLevelType(row.level)" size="small">{{ row.level }}级</el-tag>
                  </div>
                  <div class="phone">{{ row.phone }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="source" label="来源" width="100">
            <template #default="{ row }">
              <el-tag size="small">{{ getSourceText(row.source) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="标签" min-width="120">
            <template #default="{ row }">
              <div class="tags-wrapper">
                <el-tag v-for="tag in row.tags" :key="tag" size="small" class="customer-tag">{{ tag }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="ownerName" label="所属导购" width="100" />
          <el-table-column prop="followStatus" label="跟进状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.followStatus)" size="small">
                {{ getStatusText(row.followStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastFollowTime" label="最后跟进" width="140" />
          <el-table-column prop="nextFollowTime" label="下次跟进" width="140">
            <template #default="{ row }">
              <span :class="{ 'overdue': isOverdue(row.nextFollowTime) }">{{ row.nextFollowTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="budget" label="预算" width="100">
            <template #default="{ row }">
              <span v-if="row.budget">¥{{ row.budget }}万</span>
              <span v-else class="no-data">-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
              <el-button link type="primary" @click="handleFollow(row)">跟进</el-button>
              <el-button link type="primary" @click="createOrder(row)">建单</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
            @current-change="handlePageChange" />
        </div>
      </el-card>
    </div>

    <!-- 添加/编辑客户弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑客户' : '添加客户'" width="700px" destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入客户姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户性别" prop="gender">
              <el-radio-group v-model="formData.gender">
                <el-radio-button label="male">男</el-radio-button>
                <el-radio-button label="female">女</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户等级" prop="level">
              <el-select v-model="formData.level" placeholder="请选择" style="width: 100%">
                <el-option label="A级 - 重点客户" value="A" />
                <el-option label="B级 - 意向客户" value="B" />
                <el-option label="C级 - 一般客户" value="C" />
                <el-option label="D级 - 潜在客户" value="D" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="客户标签" prop="tags">
          <el-select v-model="formData.tags" multiple placeholder="请选择标签" style="width: 100%">
            <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户来源" prop="source">
              <el-select v-model="formData.source" placeholder="请选择" style="width: 100%">
                <el-option label="自然进店" value="walkin" />
                <el-option label="电话邀约" value="phone" />
                <el-option label="线上推广" value="online" />
                <el-option label="转介绍" value="referral" />
                <el-option label="异业合作" value="partner" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属导购" prop="ownerId">
              <el-select v-model="formData.ownerId" placeholder="请选择" style="width: 100%">
                <el-option v-for="guide in guides" :key="guide.id" :label="guide.name" :value="guide.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="装修预算" prop="budget">
              <el-input-number v-model="formData.budget" :min="0" :precision="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计成交" prop="expectedDealDate">
              <el-date-picker v-model="formData.expectedDealDate" type="date" placeholder="选择日期"
                style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="客户地址" prop="address">
          <el-input v-model="formData.address" type="textarea" :rows="2" placeholder="请输入客户地址" />
        </el-form-item>
        <el-form-item label="需求描述" prop="requirements">
          <el-input v-model="formData.requirements" type="textarea" :rows="3" placeholder="请描述客户需求" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="其他备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 客户详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="客户详情" width="900px">
      <div class="customer-detail" v-if="currentCustomer">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="detail-card">
              <div class="card-header">
                <el-avatar :size="60" :src="currentCustomer.avatar">{{ currentCustomer.name?.charAt(0) }}</el-avatar>
                <div class="header-info">
                  <h3>{{ currentCustomer.name }}</h3>
                  <el-tag :type="getLevelType(currentCustomer.level)">{{ currentCustomer.level }}级客户</el-tag>
                </div>
              </div>
              <el-divider />
              <div class="info-list">
                <div class="info-item">
                  <span class="label">联系电话：</span>
                  <span class="value">{{ currentCustomer.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">客户来源：</span>
                  <span class="value">{{ getSourceText(currentCustomer.source) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">所属导购：</span>
                  <span class="value">{{ currentCustomer.ownerName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">装修预算：</span>
                  <span class="value">{{ currentCustomer.budget ? '¥' + currentCustomer.budget + '万' : '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">创建时间：</span>
                  <span class="value">{{ currentCustomer.createTime }}</span>
                </div>
                <div class="info-item">
                  <span class="label">跟进状态：</span>
                  <span class="value">{{ getStatusText(currentCustomer.followStatus) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">最后跟进：</span>
                  <span class="value">{{ currentCustomer.lastFollowTime }}</span>
                </div>
                <div class="info-item">
                  <span class="label">下次跟进：</span>
                  <span class="value" :class="{ 'overdue': isOverdue(currentCustomer.nextFollowTime) }">{{ currentCustomer.nextFollowTime }}</span>
                </div>
                <div class="info-item" v-if="currentCustomer.address">
                  <span class="label">客户地址：</span>
                  <span class="value">{{ currentCustomer.address }}</span>
                </div>
                <div class="info-item" v-if="currentCustomer.requirements">
                  <span class="label">需求描述：</span>
                  <span class="value">{{ currentCustomer.requirements }}</span>
                </div>
              </div>
              <el-divider />
              <div class="action-buttons">
                <el-button type="primary" size="small" @click="handleFollow(currentCustomer)">立即跟进</el-button>
                <el-button size="small" @click="createOrder(currentCustomer)">创建订单</el-button>
                <el-button size="small" @click="editCustomer(currentCustomer)">编辑信息</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="跟进记录" name="follow">
                <div class="follow-list">
                  <el-timeline>
                    <el-timeline-item v-for="record in followRecords" :key="record.id" :type="record.type"
                      :timestamp="record.time">
                      <h4>{{ record.title }}</h4>
                      <p>{{ record.content }}</p>
                      <p class="operator">记录人：{{ record.operator }}</p>
                    </el-timeline-item>
                  </el-timeline>
                  <div v-if="followRecords.length === 0" class="empty-data">暂无跟进记录</div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="订单记录" name="orders">
                <el-table :data="customerOrders" size="small">
                  <el-table-column prop="orderNo" label="订单号" />
                  <el-table-column prop="amount" label="金额" />
                  <el-table-column prop="status" label="状态" />
                  <el-table-column prop="createTime" label="创建时间" />
                  <el-table-column label="操作" width="100">
                    <template #default="{ row }">
                      <el-button size="small" link @click="viewOrderDetail(row)">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div v-if="customerOrders.length === 0" class="empty-data">暂无订单记录</div>
              </el-tab-pane>
              <el-tab-pane label="行为轨迹" name="behavior">
                <el-timeline>
                  <el-timeline-item v-for="track in behaviorTracks" :key="track.id" :type="track.type"
                    :timestamp="track.time">
                    <p>{{ track.description }}</p>
                  </el-timeline-item>
                </el-timeline>
                <div v-if="behaviorTracks.length === 0" class="empty-data">暂无行为轨迹</div>
              </el-tab-pane>
              <el-tab-pane label="转介绍" name="referral">
                <div v-if="currentCustomer.referralInfo">
                  <p>转介绍人：{{ currentCustomer.referralInfo.referrerName }}</p>
                  <p>关系：{{ currentCustomer.referralInfo.relation }}</p>
                  <p>转介绍时间：{{ currentCustomer.referralInfo.referralTime }}</p>
                </div>
                <div v-else class="empty-data">暂无转介绍信息</div>
              </el-tab-pane>
              <el-tab-pane label="附件资料" name="attachments">
                <el-upload
                  class="upload-demo"
                  action="#"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="attachments"
                  :auto-upload="false"
                >
                  <el-button type="primary">点击上传</el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      只能上传图片文件，且不超过5MB
                    </div>
                  </template>
                </el-upload>
                <div v-if="attachments.length === 0" class="empty-data">暂无附件资料</div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 跟进弹窗 -->
    <el-dialog v-model="followDialogVisible" title="客户跟进" width="600px">
      <el-form ref="followFormRef" :model="followForm" :rules="followRules" label-width="100px">
        <el-form-item label="跟进方式" prop="method">
          <el-radio-group v-model="followForm.method">
            <el-radio-button label="phone">电话</el-radio-button>
            <el-radio-button label="wechat">微信</el-radio-button>
            <el-radio-button label="visit">到店</el-radio-button>
            <el-radio-button label="onsite">上门</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="跟进内容" prop="content">
          <el-input v-model="followForm.content" type="textarea" :rows="4" placeholder="记录跟进内容" />
        </el-form-item>
        <el-form-item label="客户意向" prop="intention">
          <el-rate v-model="followForm.intention" :max="5" show-score />
        </el-form-item>
        <el-form-item label="下次跟进" prop="nextFollowTime">
          <el-date-picker v-model="followForm.nextFollowTime" type="datetime" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="提醒设置">
          <el-checkbox v-model="followForm.needRemind">到期提醒</el-checkbox>
          <el-select v-if="followForm.needRemind" v-model="followForm.remindTime" style="margin-left: 10px; width: 150px">
            <el-option label="提前15分钟" :value="15" />
            <el-option label="提前30分钟" :value="30" />
            <el-option label="提前1小时" :value="60" />
            <el-option label="提前1天" :value="1440" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="followDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFollow" :loading="submitting">提交</el-button>
      </template>
    </el-dialog>

    <!-- 批量导入弹窗 -->
    <el-dialog v-model="importDialogVisible" title="批量导入客户" width="600px">
      <div v-if="!importResult.show" class="import-content">
        <el-alert
          title="导入说明"
          description="请下载模板文件，按模板格式填写客户信息后上传。支持Excel格式(.xlsx/.xls)，单次最多导入1000条记录。"
          type="info"
          show-icon
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-form label-width="100px">
          <el-form-item label="导入模板">
            <el-button type="primary" plain @click="downloadTemplate">
              <el-icon><Download /></el-icon>
              下载导入模板
            </el-button>
          </el-form-item>
          <el-form-item label="选择文件">
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              :file-list="importForm.fileList"
              accept=".xlsx,.xls"
              :limit="1"
            >
              <el-button type="primary">选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip">请上传Excel文件，大小不超过10MB</div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="重复处理">
            <el-radio-group v-model="importForm.override">
              <el-radio :label="false">跳过重复</el-radio>
              <el-radio :label="true">覆盖更新</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="import-result">
        <el-result
          :icon="importResult.failed > 0 ? 'warning' : 'success'"
          :title="`导入完成`"
          :sub-title="`共${importResult.total}条，成功${importResult.success}条，失败${importResult.failed}条`"
        />
        <div v-if="importResult.errors.length > 0" class="error-list">
          <div class="error-title">错误详情：</div>
          <el-table :data="importResult.errors" size="small" height="200">
            <el-table-column prop="row" label="行号" width="80" />
            <el-table-column prop="message" label="错误信息" />
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">{{ importResult.show ? '关闭' : '取消' }}</el-button>
        <el-button v-if="!importResult.show" type="primary" @click="confirmImport" :loading="submitting">开始导入</el-button>
      </template>
    </el-dialog>

    <!-- 导出弹窗 -->
    <el-dialog v-model="exportDialogVisible" title="导出客户数据" width="550px">
      <el-form label-width="100px">
        <el-form-item label="导出范围">
          <el-radio-group v-model="exportForm.range">
            <el-radio-button label="all">全部客户</el-radio-button>
            <el-radio-button label="filtered">当前筛选</el-radio-button>
            <el-radio-button label="selected">选中客户</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="导出格式">
          <el-radio-group v-model="exportForm.format">
            <el-radio-button label="excel">Excel</el-radio-button>
            <el-radio-button label="csv">CSV</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间范围" v-if="exportForm.range === 'filtered'">
          <el-date-picker
            v-model="exportForm.startDate"
            type="date"
            placeholder="开始日期"
            style="width: 140px"
          />
          <span style="margin: 0 10px">至</span>
          <el-date-picker
            v-model="exportForm.endDate"
            type="date"
            placeholder="结束日期"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="导出字段">
          <el-checkbox-group v-model="exportForm.fields">
            <el-checkbox label="name">客户姓名</el-checkbox>
            <el-checkbox label="phone">联系电话</el-checkbox>
            <el-checkbox label="level">客户等级</el-checkbox>
            <el-checkbox label="source">客户来源</el-checkbox>
            <el-checkbox label="status">跟进状态</el-checkbox>
            <el-checkbox label="ownerName">所属导购</el-checkbox>
            <el-checkbox label="createTime">创建时间</el-checkbox>
            <el-checkbox label="budget">装修预算</el-checkbox>
            <el-checkbox label="address">客户地址</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmExport">确认导出</el-button>
      </template>
    </el-dialog>

    <!-- 建单弹窗 -->
    <el-dialog v-model="orderDialogVisible" title="创建订单" width="650px">
      <el-form ref="orderFormRef" :model="orderForm" :rules="orderRules" label-width="100px">
        <el-alert
          v-if="currentCustomer"
          :title="`为客户 ${currentCustomer.name} 创建新订单`"
          type="info"
          show-icon
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-form-item label="订单类型" prop="type">
          <el-radio-group v-model="orderForm.type">
            <el-radio-button label="custom">全屋定制</el-radio-button>
            <el-radio-button label="furniture">成品家具</el-radio-button>
            <el-radio-button label="mixed">混合订单</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品信息" prop="products">
          <el-input v-model="orderForm.products" type="textarea" :rows="2" placeholder="请输入产品信息" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单金额" prop="amount">
              <el-input-number v-model="orderForm.amount" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="定金金额" prop="deposit">
              <el-input-number v-model="orderForm.deposit" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="预计交付" prop="deliveryDate">
          <el-date-picker v-model="orderForm.deliveryDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="订单备注" prop="remark">
          <el-input v-model="orderForm.remark" type="textarea" :rows="2" placeholder="请输入订单备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="orderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateOrder" :loading="submitting">创建订单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download } from '@element-plus/icons-vue'

// 统计数据
const stats = reactive({
  total: 256,
  todayNew: 8,
  followUp: 45,
  deals: 68,
  highValue: 32,
  referral: 28
})

// 搜索表单
const searchForm = reactive({
  keyword: '',
  level: '',
  source: '',
  status: '',
  owner: '',
  tag: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 256
})

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 导购列表
const guides = ref([
  { id: 1, name: '张小明' },
  { id: 2, name: '李小红' },
  { id: 3, name: '王小强' }
])

// 标签列表
const tags = ref([
  { id: 1, name: '高预算' },
  { id: 2, name: '急装修' },
  { id: 3, name: '别墅' },
  { id: 4, name: '老客户' },
  { id: 5, name: '全屋定制' }
])

// 客户列表
const customers = ref([
  {
    id: 1,
    name: '王先生',
    phone: '138****1234',
    avatar: '',
    level: 'A',
    source: 'walkin',
    tags: ['高预算', '全屋定制'],
    ownerName: '张小明',
    followStatus: 'intention',
    lastFollowTime: '2024-12-01 14:30',
    nextFollowTime: '2024-12-03 10:00',
    budget: 50,
    createTime: '2024-11-28',
    address: '北京市朝阳区建国路88号',
    requirements: '全屋定制，现代简约风格，预算50万',
    referralInfo: {
      referrerName: '李女士',
      relation: '朋友',
      referralTime: '2024-11-28 10:00'
    }
  },
  {
    id: 2,
    name: '李女士',
    phone: '139****5678',
    avatar: '',
    level: 'B',
    source: 'referral',
    tags: ['急装修'],
    ownerName: '李小红',
    followStatus: 'following',
    lastFollowTime: '2024-12-01 11:20',
    nextFollowTime: '2024-12-02 15:00',
    budget: 25,
    createTime: '2024-11-30',
    address: '北京市海淀区中关村大街1号',
    requirements: '三室一厅，需要快速装修'
  }
])

// 弹窗控制
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const followDialogVisible = ref(false)
const isEditing = ref(false)

// 当前操作对象
const currentCustomer = ref(null)
const activeTab = ref('follow')

// 表单引用
const formRef = ref(null)
const followFormRef = ref(null)

// 表单数据
const formData = reactive({
  id: null,
  name: '',
  phone: '',
  gender: 'male',
  level: '',
  tags: [],
  source: '',
  ownerId: '',
  budget: undefined,
  expectedDealDate: '',
  address: '',
  requirements: '',
  remark: ''
})

// 跟进表单
const followForm = reactive({
  method: 'phone',
  content: '',
  intention: 3,
  nextFollowTime: '',
  needRemind: true,
  remindTime: 30
})

// 表单校验规则
const formRules = {
  name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  level: [{ required: true, message: '请选择客户等级', trigger: 'change' }],
  source: [{ required: true, message: '请选择客户来源', trigger: 'change' }]
}

const followRules = {
  method: [{ required: true, message: '请选择跟进方式', trigger: 'change' }],
  content: [{ required: true, message: '请输入跟进内容', trigger: 'blur' }]
}

// 跟进记录
const followRecords = ref([
  { id: 1, type: 'primary', time: '2024-12-01 14:30', title: '电话沟通', content: '客户对全屋定制方案很满意，需要调整一下橱柜尺寸', operator: '张小明' },
  { id: 2, type: 'success', time: '2024-11-30 10:15', title: '到店参观', content: '客户到店参观了样板间，对现代简约风格比较感兴趣', operator: '张小明' }
])

// 客户订单
const customerOrders = ref([
  { orderNo: 'ORD2024001', amount: '¥35,000', status: '生产中', createTime: '2024-11-25' }
])

// 行为轨迹
const behaviorTracks = ref([
  { id: 1, type: 'primary', time: '2024-12-01 14:30', description: '电话沟通 - 确认橱柜尺寸' },
  { id: 2, type: 'success', time: '2024-11-30 10:15', description: '到店参观 - 样板间' },
  { id: 3, type: 'warning', time: '2024-11-28 16:00', description: '微信咨询 - 报价方案' }
])

// 附件资料
const attachments = ref([
  {
    name: '客户需求.pdf',
    url: '#',
    size: 1024000
  },
  {
    name: '户型图.jpg',
    url: '#',
    size: 2048000
  }
])

// 辅助方法
const getLevelType = (level) => {
  const map = { A: 'danger', B: 'warning', C: 'success', D: 'info' }
  return map[level] || 'info'
}

const getSourceText = (source) => {
  const map = { walkin: '自然进店', phone: '电话邀约', online: '线上推广', referral: '转介绍', partner: '异业合作' }
  return map[source] || source
}

const getStatusType = (status) => {
  const map = { new: 'info', following: 'primary', intention: 'warning', quoted: 'success', dealed: 'success', lost: 'danger' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { new: '新客资', following: '跟进中', intention: '意向强烈', quoted: '已报价', dealed: '已成交', lost: '已流失' }
  return map[status] || status
}

const isOverdue = (time) => {
  if (!time) return false
  return new Date(time) < new Date()
}

// 搜索和重置
const handleSearch = () => {
  loading.value = true
  setTimeout(() => { loading.value = false }, 500)
}

const handleReset = () => {
  Object.keys(searchForm).forEach(key => searchForm[key] = '')
}

// 分页
const handleSizeChange = (size) => {
  pagination.pageSize = size
  handleSearch()
}

const handlePageChange = (page) => {
  pagination.page = page
  handleSearch()
}

const handleSelectionChange = (selection) => {
  console.log('选中:', selection)
}

// 添加/编辑
const showAddDialog = () => {
  isEditing.value = false
  Object.assign(formData, {
    id: null, name: '', phone: '', gender: 'male', level: '', tags: [],
    source: '', ownerId: '', budget: undefined, expectedDealDate: '',
    address: '', requirements: '', remark: ''
  })
  dialogVisible.value = true
}

const editCustomer = (customer) => {
  isEditing.value = true
  Object.assign(formData, {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    gender: customer.gender || 'male',
    level: customer.level,
    tags: customer.tags || [],
    source: customer.source,
    ownerId: guides.value.find(g => g.name === customer.ownerName)?.id || '',
    budget: customer.budget,
    expectedDealDate: customer.expectedDealDate || '',
    address: customer.address || '',
    requirements: customer.requirements || '',
    remark: customer.remark || ''
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    dialogVisible.value = false
    ElMessage.success(isEditing.value ? '编辑成功' : '添加成功')
  }, 500)
}

// 详情
const viewDetail = (row) => {
  currentCustomer.value = row
  detailDialogVisible.value = true
}

// 跟进
const handleFollow = (row) => {
  currentCustomer.value = row
  Object.assign(followForm, {
    method: 'phone', content: '', intention: 3,
    nextFollowTime: '', needRemind: true, remindTime: 30
  })
  followDialogVisible.value = true
}

const submitFollow = async () => {
  const valid = await followFormRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    followDialogVisible.value = false
    ElMessage.success('跟进记录已保存')
  }, 500)
}

// 建单弹窗
const orderDialogVisible = ref(false)
const orderForm = reactive({
  type: 'custom',
  products: '',
  amount: 0,
  deposit: 0,
  deliveryDate: '',
  remark: ''
})
const orderRules = {
  type: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
  products: [{ required: true, message: '请输入产品信息', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入订单金额', trigger: 'blur' }]
}
const orderFormRef = ref(null)

// 建单
const createOrder = (row) => {
  currentCustomer.value = row
  Object.assign(orderForm, {
    type: 'custom',
    products: '',
    amount: row.budget ? row.budget * 10000 : 0,
    deposit: 0,
    deliveryDate: '',
    remark: ''
  })
  orderDialogVisible.value = true
}

// 确认创建订单
const confirmCreateOrder = async () => {
  const valid = await orderFormRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    orderDialogVisible.value = false
    ElMessage.success('订单创建成功')
  }, 500)
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除客户 ${row.name} 吗？`, '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

// 导入导出弹窗控制
const importDialogVisible = ref(false)
const exportDialogVisible = ref(false)
const importForm = reactive({
  file: null,
  fileList: [],
  override: false,
  template: 'standard'
})
const exportForm = reactive({
  range: 'all',
  format: 'excel',
  fields: ['name', 'phone', 'level', 'source', 'status', 'ownerName', 'createTime'],
  startDate: '',
  endDate: ''
})
const importResult = reactive({
  show: false,
  total: 0,
  success: 0,
  failed: 0,
  errors: []
})

// 显示导入弹窗
const showImportDialog = () => {
  importForm.file = null
  importForm.fileList = []
  importForm.override = false
  importForm.template = 'standard'
  importResult.show = false
  importDialogVisible.value = true
}

// 处理文件上传
const handleFileChange = (file) => {
  const isExcel = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                  file.raw.type === 'application/vnd.ms-excel'
  if (!isExcel) {
    ElMessage.error('请上传Excel文件')
    return false
  }
  importForm.file = file.raw
}

// 下载模板
const downloadTemplate = () => {
  ElMessage.success('模板下载中...')
  // TODO: 调用API下载模板
}

// 确认导入
const confirmImport = async () => {
  if (!importForm.file) {
    ElMessage.warning('请选择要导入的文件')
    return
  }
  
  // 模拟导入过程
  importResult.show = true
  importResult.total = 100
  importResult.success = 95
  importResult.failed = 5
  importResult.errors = [
    { row: 3, message: '手机号格式不正确' },
    { row: 8, message: '客户等级不能为空' },
    { row: 15, message: '客户姓名重复' },
    { row: 23, message: '所属导购不存在' },
    { row: 31, message: '创建时间格式错误' }
  ]
  
  ElMessage.success('导入完成，成功95条，失败5条')
}

// 显示导出弹窗
const showExportDialog = () => {
  exportForm.range = 'all'
  exportForm.format = 'excel'
  exportForm.fields = ['name', 'phone', 'level', 'source', 'status', 'ownerName', 'createTime']
  exportForm.startDate = ''
  exportForm.endDate = ''
  exportDialogVisible.value = true
}

// 确认导出
const confirmExport = () => {
  const fieldCount = exportForm.fields.length
  const rangeText = exportForm.range === 'all' ? '全部' : exportForm.range === 'selected' ? '选中' : '当前筛选'
  
  ElMessageBox.confirm(
    `即将导出${rangeText}客户数据，包含${fieldCount}个字段，格式为${exportForm.format === 'excel' ? 'Excel' : 'CSV'}，是否继续？`,
    '导出确认',
    {
      confirmButtonText: '确认导出',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    exportDialogVisible.value = false
    ElMessage.success('客户数据导出中，请稍候...')
    // TODO: 调用API导出数据
  })
}

// 查看订单详情
const viewOrderDetail = (order) => {
  ElMessage.info('查看订单详情：' + order.orderNo)
  // TODO: 打开订单详情弹窗
}

// 上传附件预览
const handlePreview = (file) => {
  console.log('预览文件:', file)
}

// 上传附件移除
const handleRemove = (file, fileList) => {
  console.log('移除文件:', file, fileList)
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped lang="scss">
.customer-management {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      margin: 0;
      font-size: 24px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      background: #fff;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #409eff;
        margin-bottom: 5px;
      }

      .stat-label {
        font-size: 13px;
        color: #909399;
      }

      &.primary .stat-value {
        color: #409eff;
      }

      &.success .stat-value {
        color: #67c23a;
      }

      &.warning .stat-value {
        color: #e6a23c;
      }

      &.danger .stat-value {
        color: #f56c6c;
      }

      &.info .stat-value {
        color: #909399;
      }
    }
  }

  .search-filter {
    margin-bottom: 20px;
  }

  .customer-list {
    .customer-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .info-detail {
        .name {
          font-weight: 500;
          color: #303133;
          margin-bottom: 4px;

          .el-tag {
            margin-left: 8px;
          }
        }

        .phone {
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .tags-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .customer-tag {
      margin-right: 0;
    }

    .overdue {
      color: #f56c6c;
    }

    .no-data {
      color: #909399;
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .customer-detail {
    .detail-card {
      background: #f5f7fa;
      border-radius: 8px;
      padding: 20px;

      .card-header {
        display: flex;
        align-items: center;
        gap: 15px;

        .header-info {
          h3 {
            margin: 0 0 8px 0;
          }
        }
      }

      .info-list {
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #ebeef5;

          &:last-child {
            border-bottom: none;
          }

          .label {
            color: #909399;
          }

          .value {
            color: #303133;
            font-weight: 500;
          }
        }
      }

      .action-buttons {
        display: flex;
        gap: 10px;
        margin-top: 15px;
      }
    }

    .follow-list {
      .operator {
        color: #909399;
        font-size: 12px;
      }
    }

    .empty-data {
      text-align: center;
      color: #909399;
      padding: 40px 0;
    }
  }

  .import-content {
    padding: 10px 0;
  }

  .import-result {
    .error-list {
      margin-top: 20px;

      .error-title {
        font-weight: bold;
        margin-bottom: 10px;
        color: #f56c6c;
      }
    }
  }
}
</style>
