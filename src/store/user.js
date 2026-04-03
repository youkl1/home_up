import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: null,
    permissions: [],
    selectedTerminal: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission)
    },
    currentTerminal: (state) => state.selectedTerminal
  },
  
  actions: {
    // 登录
    login(userInfo, token) {
      this.userInfo = userInfo
      this.token = token
      this.selectedTerminal = userInfo.terminal
      
      // 根据用户角色设置权限
      this.setPermissions(userInfo.role)
      
      // 存储到本地存储
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      localStorage.setItem('token', token)
      localStorage.setItem('selectedTerminal', userInfo.terminal)
    },
    
    // 登出
    logout() {
      this.userInfo = null
      this.token = null
      this.permissions = []
      this.selectedTerminal = null
      
      // 清除本地存储
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      localStorage.removeItem('selectedTerminal')
    },
    
    // 设置权限
    setPermissions(role) {
      // 基于角色设置权限
      const permissionMap = {
        admin: ['dashboard', 'products', 'cases', 'customers', 'settings', 'users', 'profile', 'finance', 'service', 'compliance', 'supply', 'franchise', 'purchase', 'training', 'stores', 'logs', 'scripts', 'materials', 'ocean', 'transfer', 'marketing', 'data', 'orders', 'installers', 'referral', 'contracts', 'payment', 'tickets', 'tags', 'forms', 'measure', 'ai', 'share', 'todo'],
        storeManager: ['dashboard', 'products', 'cases', 'customers', 'users', 'profile', 'finance', 'service', 'orders', 'installers', 'referral', 'marketing', 'purchase', 'training', 'settings', 'contracts', 'payment', 'tickets', 'tags', 'forms', 'measure', 'ai', 'share', 'todo'],
        guide: ['dashboard', 'products', 'cases', 'customers', 'profile', 'contracts', 'payment', 'tickets', 'tags', 'forms', 'measure', 'ai', 'referral', 'share', 'todo']
      }
      
      this.permissions = permissionMap[role] || []
    },
    
    // 初始化用户状态
    initUserState() {
      const userInfo = localStorage.getItem('userInfo')
      const token = localStorage.getItem('token')
      const selectedTerminal = localStorage.getItem('selectedTerminal')
      
      if (userInfo && token) {
        this.userInfo = JSON.parse(userInfo)
        this.token = token
        this.selectedTerminal = selectedTerminal
        this.setPermissions(this.userInfo.role)
      }
    }
  }
})