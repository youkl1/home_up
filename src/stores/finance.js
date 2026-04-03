import { defineStore } from 'pinia'

// 财务对账管理 store
export const useFinanceStore = defineStore('finance', {
  state: () => ({
    // 财务总览数据
    financeOverview: {
      totalRevenue: 0,
      paidAmount: 0,
      pendingAmount: 0,
      reconciliationAmount: 0,
      rebateAmount: 0,
      depositBalance: 0
    },
    // 对账列表
    reconciliationList: [],
    // 收款记录列表
    receivablesList: [],
    // 发票申请列表
    invoiceList: [],
    // 加载状态
    loading: false,
    // 错误信息
    error: null
  }),
  
  getters: {
    // 获取待收款金额
    pendingReceivables: (state) => state.financeOverview.pendingAmount,
    // 获取总营收
    totalRevenue: (state) => state.financeOverview.totalRevenue
  },
  
  actions: {
    // 获取财务总览数据
    async getFinanceOverview(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/finance/overview', { params })
        // this.financeOverview = response.data
        
        // 模拟数据
        this.financeOverview = {
          totalRevenue: 2580000,
          paidAmount: 2200000,
          pendingAmount: 380000,
          reconciliationAmount: 2000000,
          rebateAmount: 150000,
          depositBalance: 500000
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取对账列表
    async getReconciliationList(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/finance/reconciliation', { params })
        // this.reconciliationList = response.data
        
        // 模拟数据
        this.reconciliationList = [
          { id: 'REC20260301', period: '2026-03', amount: 850000, status: 'completed', createTime: '2026-04-01' },
          { id: 'REC20260201', period: '2026-02', amount: 750000, status: 'completed', createTime: '2026-03-01' },
          { id: 'REC20260101', period: '2026-01', amount: 400000, status: 'completed', createTime: '2026-02-01' }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取收款记录列表
    async getReceivablesList(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/finance/receivables', { params })
        // this.receivablesList = response.data
        
        // 模拟数据
        this.receivablesList = [
          { id: 'REC20260401001', orderId: 'ORD20260331001', customer: '张女士', amount: 8900, status: 'paid', createTime: '2026-04-01 10:30' },
          { id: 'REC20260401002', orderId: 'ORD20260331002', customer: '李先生', amount: 6500, status: 'pending', createTime: '2026-04-01 09:15' },
          { id: 'REC20260331001', orderId: 'ORD20260330001', customer: '王女士', amount: 12000, status: 'paid', createTime: '2026-03-31 16:45' }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取发票申请列表
    async getInvoiceList(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/finance/invoices', { params })
        // this.invoiceList = response.data
        
        // 模拟数据
        this.invoiceList = [
          { id: 'INV20260401001', amount: 8900, status: 'approved', createTime: '2026-04-01 10:30' },
          { id: 'INV20260401002', amount: 6500, status: 'pending', createTime: '2026-04-01 09:15' },
          { id: 'INV20260331001', amount: 12000, status: 'approved', createTime: '2026-03-31 16:45' }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 确认对账
    async confirmReconciliation(reconciliationId) {
      this.loading = true
      try {
        // 模拟API请求
        // await axios.post(`/api/finance/reconciliation/confirm/${reconciliationId}`)
        
        // 更新本地数据
        const reconciliation = this.reconciliationList.find(item => item.id === reconciliationId)
        if (reconciliation) {
          reconciliation.status = 'completed'
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 标记收款状态
    async updateReceivablesStatus(receivablesId, status) {
      this.loading = true
      try {
        // 模拟API请求
        // await axios.put(`/api/finance/receivables/status/${receivablesId}`, { status })
        
        // 更新本地数据
        const receivable = this.receivablesList.find(item => item.id === receivablesId)
        if (receivable) {
          receivable.status = status
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 提交发票申请
    async submitInvoiceApplication(data) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.post('/api/finance/invoices', data)
        // this.invoiceList.unshift(response.data)
        
        // 模拟数据
        const newInvoice = {
          id: `INV${Date.now()}`,
          amount: data.amount,
          status: 'pending',
          createTime: new Date().toISOString()
        }
        this.invoiceList.unshift(newInvoice)
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})