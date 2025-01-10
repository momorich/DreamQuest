import { generateDreamImage } from '../../services/dreamImage.service'

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {
    title: '',
    content: '',
    currentDate: '',
    canSave: false,
    isGeneratingImage: false
  },

  lifetimes: {
    attached() {
      // 设置当前日期
      const now = new Date()
      const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
      this.setData({ currentDate: date })
    }
  },

  observers: {
    'title, content': function(title: string, content: string) {
      // 当标题和内容都有值时才能保存
      this.setData({
        canSave: !!(title.trim() && content.trim())
      })
    }
  },

  methods: {
    onTitleInput(e: any) {
      this.setData({ title: e.detail.value })
    },

    onContentInput(e: any) {
      this.setData({ content: e.detail.value })
    },

    async onSave() {
      if (!this.data.canSave) {
        console.warn('无法保存：标题或内容为空')
        return
      }
      
      const { title, content, currentDate } = this.data
      console.warn('\n=== 开始保存梦境记录 ===')
      console.warn('标题:', title)
      console.warn('内容:', content)
      console.warn('日期:', currentDate)
      
      // 显示加载状态
      this.setData({ isGeneratingImage: true })
      wx.showLoading({
        title: '正在生成图片...',
        mask: true
      })
      console.warn('显示加载状态')

      try {
        console.warn('\n开始生成图片...')
        console.warn('调用 generateDreamImage 函数')
        // 生成图片
        const imageUrl = await generateDreamImage(content.trim())
        console.warn('图片生成成功:', imageUrl)
        
        const dreamData = {
          id: Date.now(),
          title: title.trim(),
          content: content.trim(),
          date: currentDate,
          image: imageUrl
        }
        console.warn('\n准备保存的数据:', JSON.stringify(dreamData, null, 2))

        // 保存到本地存储
        console.warn('保存到本地存储...')
        wx.setStorageSync('currentDream', dreamData)
        console.warn('已保存到本地存储')

        // 触发保存事件
        console.warn('触发保存事件...')
        this.triggerEvent('save', dreamData)
        console.warn('已触发保存事件')
        
        // 清空输入
        console.warn('清空输入框...')
        this.setData({
          title: '',
          content: ''
        })
        console.warn('已清空输入框')

        // 跳转到分析页面
        console.warn('准备跳转到分析页面...')
        wx.navigateTo({
          url: '/pages/analysis/analysis',
          success: () => console.warn('成功跳转到分析页面'),
          fail: (error) => console.error('跳转失败:', error)
        })
      } catch (error) {
        console.error('\n图片生成失败:', error)
        console.error('错误详情:', JSON.stringify(error, null, 2))
        wx.showToast({
          title: '图片生成失败',
          icon: 'error',
          duration: 2000
        })
        
        // 使用默认图片
        const dreamData = {
          id: Date.now(),
          title: title.trim(),
          content: content.trim(),
          date: currentDate,
          image: '/assets/images/default_dream.png'
        }
        console.warn('\n使用默认图片:', JSON.stringify(dreamData, null, 2))
        
        // 保存到本地存储
        console.warn('保存到本地存储（使用默认图片）...')
        wx.setStorageSync('currentDream', dreamData)
        console.warn('已保存到本地存储')

        // 触发保存事件
        console.warn('触发保存事件（使用默认图片）...')
        this.triggerEvent('save', dreamData)
        console.warn('已触发保存事件（使用默认图片）')
        
        // 清空输入
        console.warn('清空输入框...')
        this.setData({
          title: '',
          content: ''
        })
        console.warn('已清空输入框')

        // 跳转到分析页面
        console.warn('准备跳转到分析页面...')
        wx.navigateTo({
          url: '/pages/analysis/analysis',
          success: () => console.warn('成功跳转到分析页面'),
          fail: (error) => console.error('跳转失败:', error)
        })
      } finally {
        this.setData({ isGeneratingImage: false })
        wx.hideLoading()
        console.warn('=== 保存梦境记录完成 ===\n')
      }
    },

    hideDreamInput() {
      this.triggerEvent('close')
    },

    stopPropagation() {
      // 阻止事件冒泡
    }
  }
}) 