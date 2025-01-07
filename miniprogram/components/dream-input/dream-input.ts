Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },

  data: {
    title: '',
    content: '',
    currentDate: ''
  },

  lifetimes: {
    attached() {
      this.updateDate();
    }
  },

  methods: {
    updateDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      
      this.setData({
        currentDate: `${year}.${month}.${day} 周${weekdays[now.getDay()]}`
      });
    },

    onTitleInput(e: any) {
      this.setData({
        title: e.detail.value
      });
    },

    onContentInput(e: any) {
      this.setData({
        content: e.detail.value
      });
    },

    saveDream() {
      const { title, content, currentDate } = this.data;
      if (!title.trim() || !content.trim()) {
        wx.showToast({
          title: '请填写完整内容',
          icon: 'none'
        });
        return;
      }

      const dreamData = {
        title: title.trim(),
        content: content.trim(),
        date: currentDate
      };

      // 保存梦境数据到本地存储
      wx.setStorageSync('currentDream', dreamData);

      // 关闭输入浮层
      this.triggerEvent('close');

      // 跳转到分析页面
      wx.navigateTo({
        url: '/pages/analysis/analysis'
      });

      // 清空输入
      this.setData({
        title: '',
        content: ''
      });
    },

    // 点击遮罩关闭
    onModalTap() {
      this.triggerEvent('close');
    },

    // 阻止冒泡
    onContentTap(e: any) {
      e.stopPropagation();
    }
  }
}); 