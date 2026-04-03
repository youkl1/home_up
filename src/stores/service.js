import { defineStore } from 'pinia'

// 售后服务管理 store
export const useServiceStore = defineStore('service', {
  state: () => ({
    // 工单总览数据
    serviceOverview: {
      totalTickets: 0,
      statusCounts: {
        pending: 0,
        processing: 0,
        completed: 0,
        closed: 0
      },
      complaintCount: 0
    },
    // 工单列表
    ticketList: [],
    // 工单详情
    ticketDetail: null,
    // 评价列表
    reviewList: [],
    // 加载状态
    loading: false,
    // 错误信息
    error: null
  }),
  
  getters: {
    // 获取待处理工单数
    pendingTickets: (state) => state.serviceOverview.statusCounts.pending,
    // 获取投诉工单数
    complaintTickets: (state) => state.serviceOverview.complaintCount
  },
  
  actions: {
    // 获取工单总览数据
    async getServiceOverview(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/service/overview', { params })
        // this.serviceOverview = response.data
        
        // 模拟数据
        this.serviceOverview = {
          totalTickets: 85,
          statusCounts: {
            pending: 15,
            processing: 25,
            completed: 40,
            closed: 5
          },
          complaintCount: 8
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取工单列表
    async getTicketList(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/service/tickets', { params })
        // this.ticketList = response.data
        
        // 模拟数据
        this.ticketList = [
          { id: 'SRV20260401001', customer: '张女士', type: '安装问题', status: 'processing', createTime: '2026-04-01 10:30' },
          { id: 'SRV20260401002', customer: '李先生', type: '维修问题', status: 'pending', createTime: '2026-04-01 09:15' },
          { id: 'SRV20260331001', customer: '王女士', type: '退款申请', status: 'completed', createTime: '2026-03-31 16:45' }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取工单详情
    async getTicketDetail(ticketId) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get(`/api/service/tickets/${ticketId}`)
        // this.ticketDetail = response.data
        
        // 模拟数据
        this.ticketDetail = {
          id: ticketId,
          customer: '张女士',
          type: '安装问题',
          status: 'processing',
          createTime: '2026-04-01 10:30',
          appeal: '客户反映沙发安装后有异响，需要师傅上门检查处理。',
          orderId: 'ORD20260331001',
          handler: '李师傅',
          records: [
            { time: '2026-04-01 10:30', operator: '系统', content: '工单创建' },
            { time: '2026-04-01 10:35', operator: '赵经理', content: '分配给李师傅处理' },
            { time: '2026-04-01 11:00', operator: '李师傅', content: '已联系客户，约定明天上门检查' }
          ]
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 更新工单状态
    async updateTicketStatus(ticketId, status) {
      this.loading = true
      try {
        // 模拟API请求
        // await axios.put(`/api/service/tickets/${ticketId}/status`, { status })
        
        // 更新本地数据
        const ticket = this.ticketList.find(item => item.id === ticketId)
        if (ticket) {
          ticket.status = status
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 添加处理记录
    async addProcessingRecord(ticketId, record) {
      this.loading = true
      try {
        // 模拟API请求
        // await axios.post(`/api/service/tickets/${ticketId}/records`, record)
        
        // 更新本地数据
        if (this.ticketDetail && this.ticketDetail.id === ticketId) {
          this.ticketDetail.records.push({
            time: new Date().toISOString(),
            operator: '当前用户',
            content: record.content
          })
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取评价列表
    async getReviewList(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/service/reviews', { params })
        // this.reviewList = response.data
        
        // 模拟数据
        this.reviewList = [
          { id: 'REV20260401001', customer: '张女士', ticketId: 'SRV20260331001', rating: 5, content: '师傅服务态度很好，安装专业，非常满意！', status: 'archived', createTime: '2026-04-01 10:30' },
          { id: 'REV20260401002', customer: '李先生', ticketId: 'SRV20260331002', rating: 3, content: '服务一般，安装有点慢，希望改进。', status: 'pending', createTime: '2026-04-01 09:15' },
          { id: 'REV20260331001', customer: '王女士', ticketId: 'SRV20260330001', rating: 4, content: '整体服务不错，响应及时。', status: 'followed', createTime: '2026-03-31 16:45' }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 跟进评价
    async followUpReview(reviewId, content) {
      this.loading = true
      try {
        // 模拟API请求
        // await axios.post(`/api/service/reviews/${reviewId}/follow`, { content })
        
        // 更新本地数据
        const review = this.reviewList.find(item => item.id === reviewId)
        if (review) {
          review.status = 'followed'
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})