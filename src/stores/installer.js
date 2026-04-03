import { defineStore } from 'pinia'

// 安装师傅管理 store
export const useInstallerStore = defineStore('installer', {
  state: () => ({
    // 师傅列表
    installerList: [],
    // 师傅详情
    installerDetail: null,
    // 工单派发列表
    dispatchList: [],
    // 服务质量数据
    qualityData: {
      totalInstallers: 0,
      avgRating: 0,
      totalServiceCount: 0,
      complaintCount: 0
    },
    // 加载状态
    loading: false,
    // 错误信息
    error: null
  }),
  
  getters: {
    // 获取启用的师傅数量
    enabledInstallers: (state) => state.installerList.filter(item => item.status === 'enabled').length,
    // 获取平均好评率
    averageRating: (state) => state.qualityData.avgRating
  },
  
  actions: {
    // 获取师傅列表
    async getInstallerList(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/installers', { params })
        // this.installerList = response.data
        
        // 模拟数据
        this.installerList = [
          { id: 'INS001', name: '李师傅', phone: '138****8888', serviceType: 'furniture', serviceArea: '北京市朝阳区', rating: 98, serviceCount: 120, status: 'enabled' },
          { id: 'INS002', name: '王师傅', phone: '139****9999', serviceType: 'appliance', serviceArea: '北京市海淀区', rating: 95, serviceCount: 85, status: 'enabled' },
          { id: 'INS003', name: '张师傅', phone: '137****7777', serviceType: 'custom', serviceArea: '北京市西城区', rating: 92, serviceCount: 68, status: 'disabled' },
          { id: 'INS004', name: '赵师傅', phone: '136****6666', serviceType: 'furniture', serviceArea: '北京市东城区', rating: 97, serviceCount: 95, status: 'enabled' },
          { id: 'INS005', name: '刘师傅', phone: '135****5555', serviceType: 'appliance', serviceArea: '北京市丰台区', rating: 94, serviceCount: 72, status: 'enabled' }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取师傅详情
    async getInstallerDetail(installerId) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get(`/api/installers/${installerId}`)
        // this.installerDetail = response.data
        
        // 模拟数据
        this.installerDetail = {
          id: installerId,
          name: '李师傅',
          phone: '138****8888',
          serviceType: 'furniture',
          serviceArea: '北京市朝阳区',
          rating: 98,
          serviceCount: 120,
          status: 'enabled',
          certificates: [],
          remark: '资深家具安装师傅，从业10年'
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 新增师傅
    async addInstaller(data) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.post('/api/installers', data)
        // this.installerList.unshift(response.data)
        
        // 模拟数据
        const newInstaller = {
          id: `INS${Date.now()}`,
          ...data,
          rating: 100,
          serviceCount: 0,
          status: 'enabled'
        }
        this.installerList.unshift(newInstaller)
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 更新师傅信息
    async updateInstaller(installerId, data) {
      this.loading = true
      try {
        // 模拟API请求
        // await axios.put(`/api/installers/${installerId}`, data)
        
        // 更新本地数据
        const installer = this.installerList.find(item => item.id === installerId)
        if (installer) {
          Object.assign(installer, data)
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 切换师傅状态
    async toggleInstallerStatus(installerId) {
      this.loading = true
      try {
        // 模拟API请求
        // await axios.put(`/api/installers/${installerId}/status`)
        
        // 更新本地数据
        const installer = this.installerList.find(item => item.id === installerId)
        if (installer) {
          installer.status = installer.status === 'enabled' ? 'disabled' : 'enabled'
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取工单派发列表
    async getDispatchList(params) {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/installers/dispatch', { params })
        // this.dispatchList = response.data
        
        // 模拟数据
        this.dispatchList = [
          { id: 'WO20260401001', orderId: 'ORD20260331001', customer: '张女士', address: '北京市朝阳区建国路88号', serviceType: '家具安装', createTime: '2026-04-01 10:30', status: 'pending', installer: '' },
          { id: 'WO20260401002', orderId: 'ORD20260331002', customer: '李先生', address: '北京市海淀区中关村大街1号', serviceType: '家电安装', createTime: '2026-04-01 09:15', status: 'dispatched', installer: '李师傅' },
          { id: 'WO20260331001', orderId: 'ORD20260330001', customer: '王女士', address: '北京市西城区西单北大街120号', serviceType: '整体定制', createTime: '2026-03-31 16:45', status: 'accepted', installer: '张师傅' }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 派发工单
    async dispatchOrder(orderId, installerId, installTime, requirements) {
      this.loading = true
      try {
        // 模拟API请求
        // await axios.post(`/api/installers/dispatch/${orderId}`, { installerId, installTime, requirements })
        
        // 更新本地数据
        const order = this.dispatchList.find(item => item.id === orderId)
        if (order) {
          order.status = 'dispatched'
          order.installer = this.installerList.find(item => item.id === installerId)?.name || ''
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取服务质量数据
    async getQualityData() {
      this.loading = true
      try {
        // 模拟API请求
        // const response = await axios.get('/api/installers/quality')
        // this.qualityData = response.data
        
        // 模拟数据
        this.qualityData = {
          totalInstallers: 25,
          avgRating: 95,
          totalServiceCount: 1280,
          complaintCount: 12
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})