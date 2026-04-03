import { defineStore } from 'pinia'

// 客户转介绍裂变管理 store
export const useReferralStore = defineStore('referral', {
  state: () => ({
    // 转介绍总览数据
    referralOverview: {
      totalReferrals: 0,
      totalConversions: 0,
      totalRevenue: 0,
      conversionRate: 0
    },
    // 转介绍记录列表
    referralList: [],
    // 奖励列表
    rewardList: [],
    // 统计数据
    statistics: {
      channelDistribution: [],
      conversionTrend: [],
      costData: []
    },
    // 加载状态
    loading: false,
    // 错误信息
    error: null
  }),
  
  getters: {
    // 获取转介绍总量
    totalReferralCount: (state) => state.referralOverview.totalReferrals,
    // 获取成单转化率
    conversionRate: (state) => state.referralOverview.conversionRate
  },
  
  actions: {
    // 获取转介绍总览数据
    async getReferralOverview(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/referral/overview', { params })
        // this.referralOverview = response.data
        
        // 模拟数据
        this.referralOverview = {
          totalReferrals: 156,
          totalConversions: 89,
          totalRevenue: 1250000,
          conversionRate: 57
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取转介绍记录列表
    async getReferralList(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/referral/records', { params })
        // this.referralList = response.data
        
        // 模拟数据
        this.referralList = [
          { id: 'REF20260401001', referrer: '张女士', referee: '陈女士', refereePhone: '138****8888', createTime: '2026-04-01 10:30', status: 'converted', orderId: 'ORD20260401001', rewardStatus: 'issued' },
          { id: 'REF20260401002', referrer: '李先生', referee: '周先生', refereePhone: '139****9999', createTime: '2026-04-01 09:15', status: 'pending', orderId: '', rewardStatus: 'pending' },
          { id: 'REF20260331001', referrer: '王女士', referee: '吴女士', refereePhone: '137****7777', createTime: '2026-03-31 16:45', status: 'converted', orderId: 'ORD20260331001', rewardStatus: 'issued' }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取奖励列表
    async getRewardList(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/referral/rewards', { params })
        // this.rewardList = response.data
        
        // 模拟数据
        this.rewardList = [
          { id: 'REW20260401001', referrer: '张女士', referee: '陈女士', orderId: 'ORD20260401001', orderAmount: 8900, rewardAmount: 445, rewardType: 'commission', status: 'pending', createTime: '2026-04-02 14:30' },
          { id: 'REW20260401002', referrer: '李先生', referee: '周先生', orderId: 'ORD20260401002', orderAmount: 6500, rewardAmount: 325, rewardType: 'commission', status: 'processing', createTime: '2026-04-02 10:15' },
          { id: 'REW20260331001', referrer: '王女士', referee: '吴女士', orderId: 'ORD20260331001', orderAmount: 12000, rewardAmount: 600, rewardType: 'commission', status: 'issued', createTime: '2026-03-31 16:45' }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 标记奖励发放
    async markRewardIssued(rewardId, data) {
      this.loading = true
      try {
        // 模拟API请求
        // await axios.put(`/api/referral/rewards/${rewardId}/issue`, data)
        
        // 更新本地数据
        const reward = this.rewardList.find(item => item.id === rewardId)
        if (reward) {
          reward.status = 'issued'
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取统计数据
    async getStatistics(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/referral/statistics', { params })
        // this.statistics = response.data
        
        // 模拟数据
        this.statistics = {
          channelDistribution: [
            { channel: '微信', percentage: 40 },
            { channel: '短信', percentage: 30 },
            { channel: '线下', percentage: 20 },
            { channel: '其他', percentage: 10 }
          ],
          conversionTrend: [
            { month: '1月', rate: 30 },
            { month: '2月', rate: 45 },
            { month: '3月', rate: 60 },
            { month: '4月', rate: 55 },
            { month: '5月', rate: 70 },
            { month: '6月', rate: 85 }
          ],
          costData: [
            { period: '2026-01', rewardCount: 20, commissionCost: 4500, giftCost: 1200, totalCost: 5700, returnRate: 320 },
            { period: '2026-02', rewardCount: 18, commissionCost: 3800, giftCost: 900, totalCost: 4700, returnRate: 310 },
            { period: '2026-03', rewardCount: 25, commissionCost: 5200, giftCost: 1500, totalCost: 6700, returnRate: 330 },
            { period: '2026-04', rewardCount: 30, commissionCost: 6800, giftCost: 1800, totalCost: 8600, returnRate: 350 }
          ]
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})