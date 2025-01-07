interface Message {
  type: 'ai' | 'user';
  content: string;
}

Page({
  data: {
    dreamData: null as any,
    messages: [] as Message[],
    inputMessage: ''
  },

  onLoad(options) {
    // 从页面参数中获取梦境数据
    const dreamData = wx.getStorageSync('currentDream')
    if (dreamData) {
      this.setData({ dreamData })
      this.startAnalysis()
    }
  },

  startAnalysis() {
    // TODO: 调用AI接口进行分析
    // 这里先模拟一些消息
    setTimeout(() => {
      this.addMessage('ai', '我注意到你的梦境中包含了一些有趣的元素...')
    }, 1000)
  },

  addMessage(type: 'ai' | 'user', content: string) {
    const messages = [...this.data.messages]
    messages.push({ type, content })
    this.setData({ messages })

    // 滚动到最新消息
    setTimeout(() => {
      wx.createSelectorQuery()
        .select('.messages')
        .node()
        .exec((res) => {
          res[0]?.node?.scrollTo({
            top: res[0].node.scrollHeight,
            behavior: 'smooth'
          })
        })
    }, 100)
  },

  onMessageInput(e: any) {
    this.setData({
      inputMessage: e.detail.value
    })
  },

  sendMessage() {
    const { inputMessage } = this.data
    if (!inputMessage.trim()) return

    // 添加用户消息
    this.addMessage('user', inputMessage.trim())
    
    // 清空输入框
    this.setData({ inputMessage: '' })

    // TODO: 调用AI接口获取回复
    setTimeout(() => {
      this.addMessage('ai', '这是一个AI的模拟回复，稍后会替换为真实的AI回复。')
    }, 1000)
  }
}) 