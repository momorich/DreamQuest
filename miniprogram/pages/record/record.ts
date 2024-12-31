Page({
  data: {
    currentTab: 'list', // 当前选中的 tab：list 或 calendar
    searchKeyword: '', // 搜索关键词
    dreamList: [
      {
        month: '11',
        dreams: [
          {
            id: 1,
            title: '此处是标题',
            date: '2024.11.12',
            weekday: '周三',
            image: '/assets/images/default_dream.png',
            content: '此处是本次梦境记录的正文，这个水晶球设计简洁且富有梦幻感，月亮与星星的组合突出梦境主题，同时配色柔和，容易吸引用户注意。展示3行文字，多余的去详情页查看......',
            tags: ['工作', '工作', '工作', '工作']
          },
          {
            id: 2,
            title: '此处是标题',
            date: '2024.11.10',
            weekday: '周一',
            image: '/assets/images/default_dream.png',
            content: '此处是本次梦境记录的正文，这个水晶球设计简洁且富有梦幻感，月亮与星星的组合突出梦境主题，同时配色柔和，容易吸引用户注意。展示3行文字，多余的去详情页查看......',
            tags: ['工作', '工作', '工作', '工作']
          }
        ]
      },
      {
        month: '10',
        dreams: [
          {
            id: 3,
            title: '此处是标题',
            date: '2024.10.10',
            weekday: '周二',
            image: '/assets/images/default_dream.png',
            content: '此处是本次梦境记录的正文，这个水晶球设计简洁且富有梦幻感，月亮与星星的组合突出梦境主题，同时配色柔和，容易吸引用户注意。展示3行文字，多余的去详情页查看......',
            tags: ['工作', '工作', '工作', '工作']
          }
        ]
      }
    ]
  },

  onLoad() {
    // TODO: 获取梦境记录列表
  },

  // 切换 tab
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    
    if (tab === 'calendar') {
      // TODO: 加载日历视图数据
    }
  },

  // 搜索输入
  onSearchInput(e: any) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 开始语音搜索
  startVoiceSearch() {
    // TODO: 实现语音搜索
    wx.showToast({
      title: '语音搜索功能开发中',
      icon: 'none'
    });
  },

  // 执行搜索
  search() {
    const keyword = this.data.searchKeyword;
    if (!keyword.trim()) {
      return wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      });
    }
    
    // TODO: 实现搜索功能
    console.log('搜索关键词：', keyword);
  },

  // 查看梦境详情
  viewDreamDetail(e: any) {
    const dreamId = e.currentTarget.dataset.id;
    // TODO: 跳转到详情页
    console.log('查看梦境详情：', dreamId);
  }
}); 