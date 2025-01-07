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
    canSave: false
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

    onSave() {
      if (!this.data.canSave) return
      
      const { title, content, currentDate } = this.data
      const dreamData = {
        title: title.trim(),
        content: content.trim(),
        date: currentDate
      }

      // 触发保存事件
      this.triggerEvent('save', dreamData)
      
      // 清空输入
      this.setData({
        title: '',
        content: ''
      })
    },

    hideDreamInput() {
      this.triggerEvent('close')
    },

    stopPropagation() {
      // 阻止事件冒泡
    }
  }
}) 