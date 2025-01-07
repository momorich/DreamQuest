interface CalendarDay {
  day: string | number;
  date: string;
  isToday?: boolean;
  isSelected?: boolean;
  hasPositiveDream?: boolean;
  hasNegativeDream?: boolean;
}

interface DreamRecord {
  id: number;
  title: string;
  date: string;
  weekday: string;
  image: string;
  content: string;
  tags: string[];
  emotion: 'positive' | 'negative';
}

interface MonthDreams {
  month: string;
  dreams: DreamRecord[];
}

interface PageData {
  currentTab: string;
  searchKeyword: string;
  weekdays: string[];
  currentYear: number;
  currentMonth: number;
  calendarDays: CalendarDay[][];
  selectedDate: string;
  selectedDateDreams: DreamRecord[];
  dreamList: MonthDreams[];
  originalDreamList?: MonthDreams[]; // 添加原始列表数据
}

Page({
  data: {
    currentTab: 'list',
    searchKeyword: '',
    // 日历相关数据
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    calendarDays: [] as CalendarDay[][],
    selectedDate: '',
    selectedDateDreams: [] as DreamRecord[],
    originalDreamList: [] as MonthDreams[], // 保存原始列表数据
    // 列表数据
    dreamList: [
      {
        month: String(new Date().getMonth() + 1),
        dreams: [
          {
            id: 1,
            title: '此处是标题',
            date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
            weekday: '周' + '日一二三四五六'[new Date().getDay()],
            image: '/assets/images/default_dream.png',
            content: '此处是本次梦境记录的正文，这个水晶球设计简洁且富有梦幻感，月亮与星星的组合突出梦境主题，同时配色柔和，容易吸引用户注意。展示3行文字，多余的去详情页查看......',
            tags: ['工作', '生活', '家庭', '朋友'],
            emotion: 'positive' as const
          }
        ]
      }
    ] as MonthDreams[]
  } as PageData,

  onLoad() {
    // 保存原始列表数据
    this.setData({
      originalDreamList: this.data.dreamList
    });
    this.initCalendar();
  },

  // 初始化日历
  initCalendar() {
    const today = new Date();
    this.setData({
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth() + 1,
      selectedDate: this.formatDate(today)
    });
    this.generateCalendarDays();
  },

  // 生成日历数据
  generateCalendarDays() {
    const { currentYear, currentMonth } = this.data;
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    
    // 获取这个月第一天是星期几（0是星期日）
    let firstDayWeek = firstDay.getDay() || 7; // 转换为星期一为1
    firstDayWeek = firstDayWeek === 1 ? 1 : 9 - firstDayWeek; // 调整起始位置
    
    const totalDays = lastDay.getDate();
    const rows = Math.ceil((totalDays + firstDayWeek - 1) / 7);
    const calendarDays = [];

    let date = 1;
    const today = this.formatDate(new Date());

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayWeek - 1) {
          row.push({ day: '', date: '' });
        } else if (date > totalDays) {
          row.push({ day: '', date: '' });
        } else {
          const currentDate = this.formatDate(new Date(currentYear, currentMonth - 1, date));
          const dreamInfo = this.getDreamInfo(currentDate);
          row.push({
            day: date,
            date: currentDate,
            isToday: currentDate === today,
            isSelected: currentDate === this.data.selectedDate,
            hasPositiveDream: dreamInfo.hasPositive,
            hasNegativeDream: dreamInfo.hasNegative
          });
          date++;
        }
      }
      calendarDays.push(row);
    }

    this.setData({ calendarDays });
    this.updateSelectedDateDreams();
  },

  // 格式化日期为 'YYYY.MM.DD' 格式
  formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  },

  // 获取指定日期的梦境信息
  getDreamInfo(date: string) {
    const dreams = this.getAllDreams().filter(dream => dream.date === date);
    return {
      hasPositive: dreams.some(dream => dream.emotion === 'positive'),
      hasNegative: dreams.some(dream => dream.emotion === 'negative')
    };
  },

  // 获取所有梦境记录
  getAllDreams() {
    return this.data.dreamList.reduce((acc, month) => {
      return acc.concat(month.dreams);
    }, [] as any[]);
  },

  // 更新选中日期的梦境记录
  updateSelectedDateDreams() {
    const selectedDateDreams = this.getAllDreams().filter(
      dream => dream.date === this.data.selectedDate
    );
    this.setData({ selectedDateDreams });
  },

  // 选择日期
  selectDate(e: any) {
    const date = e.currentTarget.dataset.date;
    if (!date) return;
    
    this.setData({ selectedDate: date });
    this.generateCalendarDays(); // 重新生成日历以更新选中状态
  },

  // 上个月
  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    if (currentMonth === 1) {
      currentYear--;
      currentMonth = 12;
    } else {
      currentMonth--;
    }
    this.setData({ currentYear, currentMonth });
    this.generateCalendarDays();
  },

  // 下个月
  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    if (currentMonth === 12) {
      currentYear++;
      currentMonth = 1;
    } else {
      currentMonth++;
    }
    this.setData({ currentYear, currentMonth });
    this.generateCalendarDays();
  },

  // 显示年月选择器
  showYearMonthPicker() {
    // TODO: 实现年月选择器
    wx.showToast({
      title: '年月选择功能开发中',
      icon: 'none'
    });
  },

  // 切换 tab
  switchTab(e: any) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    
    if (tab === 'calendar') {
      this.initCalendar();
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
    wx.showToast({
      title: '语音搜索功能开发中',
      icon: 'none'
    });
  },

  // 执行搜索
  search() {
    const keyword = this.data.searchKeyword.trim().toLowerCase();
    if (!keyword) {
      return wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      });
    }

    // 获取所有梦境记录
    const allDreams = this.getAllDreams();
    
    // 搜索结果
    const searchResults = allDreams.filter(dream => {
      // 计算匹配分数
      let score = 0;
      
      // 标题匹配（权重：3）
      if (dream.title.toLowerCase().includes(keyword)) {
        score += 3;
      }
      
      // 内容匹配（权重：2）
      if (dream.content.toLowerCase().includes(keyword)) {
        score += 2;
      }
      
      // 标签匹配（权重：1）
      if (dream.tags.some((tag: string) => tag.toLowerCase().includes(keyword))) {
        score += 1;
      }
      
      return score > 0; // 只要有匹配就显示
    }).sort((a, b) => {
      // 按日期倒序排列
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    if (searchResults.length === 0) {
      wx.showToast({
        title: '未找到相关记录',
        icon: 'none'
      });
      return;
    }

    if (this.data.currentTab === 'list') {
      // 列表视图：显示搜索结果
      this.setData({
        dreamList: [{
          month: '搜索结果',
          dreams: searchResults
        }]
      });
    } else {
      // 日历视图：跳转到第一条结果的日期
      const firstResult = searchResults[0];
      const [year, month, day] = firstResult.date.split('.');
      
      this.setData({
        currentYear: parseInt(year),
        currentMonth: parseInt(month),
        selectedDate: firstResult.date,
        selectedDateDreams: searchResults.filter(dream => dream.date === firstResult.date)
      });
      
      this.generateCalendarDays();

      // 显示搜索结果数量
      wx.showToast({
        title: `找到 ${searchResults.length} 条记录`,
        icon: 'none'
      });
    }
  },

  // 清除搜索结果，恢复原始列表
  clearSearch() {
    this.setData({
      searchKeyword: '',
      dreamList: this.data.originalDreamList || this.data.dreamList
    });

    // 如果在日历视图，恢复到当前日期
    if (this.data.currentTab === 'calendar') {
      this.initCalendar();
    }
  },

  // 查看梦境详情
  viewDreamDetail(e: any) {
    const dreamId = e.currentTarget.dataset.id;
    console.log('查看梦境详情：', dreamId);
  },

  // 处理日期选择器变化
  onDatePickerChange(e: any) {
    const value = e.detail.value; // 格式：YYYY-MM
    const [year, month] = value.split('-').map(Number);
    
    this.setData({
      currentYear: year,
      currentMonth: month
    });
    
    this.generateCalendarDays();
  }
}); 