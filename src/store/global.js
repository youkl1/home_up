import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    loading: false,
    message: {
      show: false,
      content: '',
      type: 'info' // success, warning, error, info
    },
    theme: 'light'
  }),
  
  actions: {
    // 设置加载状态
    setLoading(loading) {
      this.loading = loading
    },
    
    // 显示消息
    showMessage(content, type = 'info') {
      this.message = {
        show: true,
        content,
        type
      }
      
      // 3秒后自动关闭
      setTimeout(() => {
        this.message.show = false
      }, 3000)
    },
    
    // 切换主题
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      // 存储主题设置
      localStorage.setItem('theme', this.theme)
    },
    
    // 初始化全局状态
    initGlobalState() {
      const theme = localStorage.getItem('theme')
      if (theme) {
        this.theme = theme
      }
    }
  }
})