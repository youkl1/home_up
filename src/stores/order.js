import { defineStore } from 'pinia'

// 订单管理 store
export const useOrderStore = defineStore('order', {
  state: () => ({
    // 订单列表
    orderList: [],
    // 订单详情
    orderDetail: null,
    // 订单总览数据
    orderOverview: {
      totalOrders: 0,
      totalAmount: 0,
      statusCounts: {
        pending: 0,
        processing: 0,
        shipping: 0,
        installing: 0,
        completed: 0
      }
    },
    // 加载状态
    loading: false,
    // 错误信息
    error: null
  }),
  
  getters: {
    // 获取待处理订单数
    pendingOrders: (state) => state.orderOverview.statusCounts.pending,
    // 获取已完成订单数
    completedOrders: (state) => state.orderOverview.statusCounts.completed,
    // 获取订单总金额
    totalOrderAmount: (state) => state.orderOverview.totalAmount
  },
  
  actions: {
    // 获取订单总览数据
    async getOrderOverview(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/order/overview', { params })
        // this.orderOverview = response.data
        
        // 模拟数据
        this.orderOverview = {
          totalOrders: 120,
          totalAmount: 1580000,
          statusCounts: {
            pending: 15,
            processing: 25,
            shipping: 20,
            installing: 30,
            completed: 30
          }
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取订单列表
    async getOrderList(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/order/list', { params })
        // this.orderList = response.data
        
        // 模拟数据
        this.orderList = [
          { id: 'ORD20260401001', customer: '张女士', amount: 8900, status: 'completed', createTime: '2026-04-01 10:30' },
          { id: 'ORD20260401002', customer: '李先生', amount: 6500, status: 'processing', createTime: '2026-04-01 09:15' },
          { id: 'ORD20260331001', customer: '王女士', amount: 12000, status: 'shipping', createTime: '2026-03-31 16:45' }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取订单详情
    async getOrderDetail(orderId) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get(`/api/order/detail/${orderId}`)
        // this.orderDetail = response.data
        
        // 模拟数据
        this.orderDetail = {
          id: orderId,
          customer: '张女士',
          amount: 8900,
          status: 'completed',
          createTime: '2026-04-01 10:30',
          products: [
            { id: 'PROD001', name: '沙发', quantity: 1, price: 6900 },
            { id: 'PROD002', name: '茶几', quantity: 1, price: 2000 }
          ],
          production: {
            status: 'completed',
            progress: 100,
            estimatedDelivery: '2026-04-10'
          },
          logistics: {
            trackingNumber: 'SF1234567890',
            status: 'delivered',
            deliveryTime: '2026-04-12'
          },
          installation: {
            status: 'completed',
            installer: '李师傅',
            installTime: '2026-04-13 14:00'
          }
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 更新订单状态
    async updateOrderStatus(orderId, status) {
      this.loading = true
      try {
        // 模拟API请求
        // await axios.put(`/api/order/status/${orderId}`, { status })
        
        // 更新本地数据
        const order = this.orderList.find(item => item.id === orderId)
        if (order) {
          order.status = status
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 取消订单
    async cancelOrder(orderId) {
      this.loading = true
      try {
        // 模拟API请求
        // await axios.post(`/api/order/cancel/${orderId}`)
        
        // 更新本地数据
        const order = this.orderList.find(item => item.id === orderId)
        if (order) {
          order.status = 'cancelled'
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})