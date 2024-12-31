// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  data: {
    dateInfo: {
      date: '2024.12.24',
      weekday: '周二',
      lunar: '腊月廿四'
    },
    dreamTheory: {
      title: '弗洛伊德的梦境理论',
      content: '弗洛伊德认为，梦境是潜意识欲望和冲突的表现，尤其是那些被压抑的欲望。昨晚的梦，是不是某种未实现的渴望？'
    },
    hasSelectedZodiac: false,
    zodiacIndex: -1,
    zodiacs: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', 
              '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
    isFortuneExpanded: false,
    fortune: {
      overall: '',
      career: '',
      love: '',
      luckyNumber: '',
      luckyColor: '',
      luckyDirection: ''
    },
    weeklyReport: {
      image: '', // 将由AI生成的图片URL
      keywords: '本周你的梦境中出现最多的是【自由】【压力】【探索】，这些关键词可能与你近期的情绪或生活事件有关。',
      analysis: '重复出现的场景或人物，可能反映了你内心未解决的问题。梦中追逐或迷路的情节，或许是内心对方向感缺失的隐喻。如果梦里充满新奇事物，这可能是你潜意识在激发创造力。',
      emotionTrend: '本周梦境情绪呈现【波动】的特点，建议关注梦境带来的情绪变化，这会帮助你更好地了解自己的内心需求。',
      aiSuggestion: '试着记录梦中细节，特别是让你印象深刻的画面，或许能挖掘出潜藏的灵感或答案！'
    },
    isReportExpanded: false,
  },

  lifetimes: {
    attached() {
      this.updateDateInfo()
      this.fetchDreamTheory()
    }
  },

  methods: {
    updateDateInfo() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const weekdays = ['日', '一', '二', '三', '四', '五', '六']
      
      this.setData({
        dateInfo: {
          date: `${year}.${month}.${day}`,
          weekday: `周${weekdays[now.getDay()]}`,
          lunar: '腊月廿四' // TODO: 需要集成农历转换库
        }
      })
    },

    async fetchDreamTheory() {
      // TODO: 调用接口获取每日梦境知识
      // const response = await api.getDreamTheory();
      // this.setData({
      //   dreamTheory: response.data
      // })
      
      // 临时测试数据
      this.setData({
        dreamTheory: {
          title: '弗洛伊德的梦境理论',
          content: '弗洛伊德认为，梦境是潜意识欲望和冲突的表现，尤其是那些被压抑的欲望。昨晚的梦，是不是某种未实现的渴望？'
        }
      })
    },

    handleZodiacChange(e: any) {
      const index = e.detail.value;
      this.setData({ 
        zodiacIndex: index,
        hasSelectedZodiac: true
      });
      this.fetchFortune(this.data.zodiacs[index]);
    },

    toggleFortune() {
      this.setData({
        isFortuneExpanded: !this.data.isFortuneExpanded
      });
    },

    async fetchFortune(zodiac: string) {
      // TODO: 调用接口获取运势数据
      // const response = await api.getFortune(zodiac);
      // this.setData({ fortune: response.data });
      
      // 临时测试数据
      this.setData({
        fortune: {
          overall: '今天的你充满自信与创造力，适合在工作或生活中大胆表达自己的想法。',
          career: '你的领导能力在团队中显得尤为突出，关键时刻的果断决策会让你脱颖而出。',
          love: '单身的你可能会遇到意想不到的缘分，已有伴侣的你们感情会更进一步。',
          luckyNumber: '6',
          luckyColor: '紫色',
          luckyDirection: '东北'
        }
      });
    },

    toggleReport() {
      this.setData({
        isReportExpanded: !this.data.isReportExpanded
      });
    },

    async fetchWeeklyReport() {
      try {
        // TODO: 调用接口获取周报数据
        // const reportData = await api.getWeeklyReport();
        // const dreamImage = await api.generateDreamImage(keywords, prompt);
        // this.setData({
        //   weeklyReport: {
        //     image: dreamImage,
        //     ...reportData
        //   }
        // });
      } catch (error) {
        console.error('获取周报失败：', error);
      }
    },
  }
})
