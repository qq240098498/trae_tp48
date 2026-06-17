export interface SocialMediaPlatform {
  id: string
  name: string
  description: string
  userProfile: string
  coreFeatures: string[]
  contentTypes: string[]
  brandToneFit: string[]
  postingFrequency: string
  bestPostingTimes: string[]
  advantages: string[]
  challenges: string[]
  suitableIndustries: string[]
  typicalBudgetRange: string
}

export interface KOLTier {
  id: string
  name: string
  fanCountRange: string
  description: string
  characteristics: string[]
  priceRange: string
  engagementRate: string
  suitableFor: string[]
  advantages: string[]
  disadvantages: string[]
  typicalCooperationTypes: string[]
}

export interface OfflineEventType {
  id: string
  name: string
  description: string
  typicalScale: string
  duration: string
  costLevel: string
  objectives: string[]
  suitableIndustries: string[]
  keyElements: string[]
  advantages: string[]
  challenges: string[]
}

export interface PRMediaCategory {
  id: string
  name: string
  description: string
  mediaExamples: string[]
  audienceProfile: string
  contentTypes: string[]
  credibility: 'high' | 'medium' | 'low'
  costLevel: string
  suitableFor: string[]
  advantages: string[]
  disadvantages: string[]
}

export const socialMediaPlatforms: SocialMediaPlatform[] = [
  {
    id: 'wechat',
    name: '微信',
    description: '国民级社交平台，月活超13亿，覆盖全年龄段',
    userProfile: '全年龄段、全阶层覆盖，一二线城市渗透率极高',
    coreFeatures: ['公众号', '视频号', '小程序', '朋友圈', '社群', '微信支付'],
    contentTypes: ['长图文', '短视频', '直播', 'H5互动', '小程序活动', '社群运营'],
    brandToneFit: ['专业的', '温暖的', '亲民的', '高端的'],
    postingFrequency: '公众号：每周2-5篇；视频号：每日1-3条',
    bestPostingTimes: ['早8:00-9:00', '午12:00-13:00', '晚18:00-22:00'],
    advantages: ['用户基数大', '信任度高', '私域运营能力强', '生态闭环完整', '支付转化便捷'],
    challenges: ['内容打开率下降', '算法推荐不透明', '竞争激烈', '涨粉难度大'],
    suitableIndustries: ['全行业适用', '特别适合品牌官方阵地建设'],
    typicalBudgetRange: '内容运营：5-20万/月；广告投放：10-100万/月'
  },
  {
    id: 'weibo',
    name: '微博',
    description: '国内最大的公共社交舆论平台，热点事件首发地',
    userProfile: '年轻用户为主，一二线城市，女性偏多，娱乐属性强',
    coreFeatures: ['热搜', '话题', '超话', '短视频', '直播', '粉丝通'],
    contentTypes: ['短图文', '短视频', '话题营销', '热搜运营', 'KOL联动', '直播带货'],
    brandToneFit: ['年轻的', '活力的', '有趣的', '时尚的'],
    postingFrequency: '每日5-10条，结合热点实时发布',
    bestPostingTimes: ['午11:00-13:00', '晚20:00-23:00', '热点事件即时'],
    advantages: ['传播速度快', '话题爆发力强', '热点营销首选', '明星KOL资源丰富', '舆论影响力大'],
    challenges: ['信息碎片化', '负面风险高', '用户留存弱', '营销噪音大'],
    suitableIndustries: ['快消', '时尚', '娱乐', '美妆', '3C数码'],
    typicalBudgetRange: '内容运营：3-15万/月；话题营销：50-500万/次'
  },
  {
    id: 'douyin',
    name: '抖音',
    description: '国民级短视频平台，日活超7亿，算法推荐强大',
    userProfile: '全年龄段覆盖，下沉市场渗透率高，娱乐属性强',
    coreFeatures: ['短视频', '直播', '抖音商城', '本地生活', '挑战赛', 'DOU+'],
    contentTypes: ['短视频种草', '剧情类', '知识类', '直播带货', '挑战赛', '品牌自播'],
    brandToneFit: ['年轻的', '有趣的', '活力的', '科技感的'],
    postingFrequency: '每日1-3条，直播可每日进行',
    bestPostingTimes: ['午12:00-14:00', '晚18:00-22:00', '周末全天'],
    advantages: ['流量巨大', '算法精准', '转化链路短', '电商生态成熟', '内容形式丰富'],
    challenges: ['内容同质化严重', '用户注意力短', '算法不可控', '竞争白热化'],
    suitableIndustries: ['快消', '美妆', '服饰', '食品', '本地生活', '3C数码'],
    typicalBudgetRange: '内容制作：5-30万/月；投放：20-200万/月'
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    description: '年轻人的生活方式平台和消费决策入口',
    userProfile: '一二线城市年轻女性为主，高学历高消费，种草属性强',
    coreFeatures: ['笔记种草', '短视频', '直播', '商城', '搜索', '品牌号'],
    contentTypes: ['种草笔记', '测评体验', '攻略教程', '生活分享', '好物推荐', '品牌故事'],
    brandToneFit: ['时尚的', '精致的', '年轻的', '高端的', '生活方式'],
    postingFrequency: '每周3-7篇笔记，持续稳定输出',
    bestPostingTimes: ['早8:00-10:00', '午12:00-14:00', '晚19:00-22:00'],
    advantages: ['种草能力强', '用户信任度高', '消费决策影响力大', '女性用户价值高', '长尾流量好'],
    challenges: ['男性用户少', '商业化程度高', '笔记审核严格', 'KOL价格上涨快'],
    suitableIndustries: ['美妆个护', '时尚穿搭', '美食', '旅行', '家居生活', '母婴'],
    typicalBudgetRange: '内容运营：5-20万/月；KOL投放：20-100万/月'
  },
  {
    id: 'bilibili',
    name: 'B站',
    description: 'Z世代聚集地，以视频为核心的综合性社区',
    userProfile: 'Z世代为主，学生和年轻白领，男性略多，高粘性高互动',
    coreFeatures: ['PUGC视频', '直播', '番剧', '专栏', '弹幕', '充电计划'],
    contentTypes: ['知识科普', '测评体验', '鬼畜', '生活记录', '游戏解说', '品牌植入'],
    brandToneFit: ['年轻的', '有趣的', '科技感的', '有梗的', '专业的'],
    postingFrequency: '每周1-3个视频，深度内容为主',
    bestPostingTimes: ['午12:00-14:00', '晚18:00-24:00', '周末全天'],
    advantages: ['用户粘性极高', '内容深度强', '社区氛围好', '弹幕文化独特', '年轻人影响力大'],
    challenges: ['用户圈层化严重', '品牌合作门槛高', '内容制作成本高', '转化链路长'],
    suitableIndustries: ['科技数码', '游戏', '动漫', '学习教育', '快消', '汽车'],
    typicalBudgetRange: '内容合作：10-50万/月；UP主投放：30-150万/月'
  },
  {
    id: 'zhihu',
    name: '知乎',
    description: '国内最大的知识问答社区，高质量内容平台',
    userProfile: '一二线城市高学历人群，白领和专业人士居多，男性略多',
    coreFeatures: ['问答', '专栏', '盐选会员', '直播', '圆桌', '品牌提问'],
    contentTypes: ['深度回答', '专栏文章', '品牌提问', 'Live讲座', '测评分析', '行业洞察'],
    brandToneFit: ['专业的', '严谨的', '科技感的', '高端的'],
    postingFrequency: '每周2-5个回答或文章',
    bestPostingTimes: ['工作日全天', '晚20:00-22:00'],
    advantages: ['内容可信度高', '长尾流量强', '决策影响力大', '用户质量高', 'SEO效果好'],
    challenges: ['用户增长放缓', '商业化程度有限', '内容门槛高', '见效周期长'],
    suitableIndustries: ['科技', '金融', '教育', '汽车', '医疗健康', '企业服务'],
    typicalBudgetRange: '内容运营：3-10万/月；知+投放：10-50万/月'
  },
  {
    id: 'kuaishou',
    name: '快手',
    description: '下沉市场短视频龙头，老铁文化浓厚',
    userProfile: '下沉市场为主，三四线城市，年龄偏大，男性偏多',
    coreFeatures: ['短视频', '直播', '快手电商', '本地生活', '快接单'],
    contentTypes: ['生活记录', '才艺展示', '直播带货', '乡土内容', '实用技能'],
    brandToneFit: ['亲民的', '实在的', '接地气的', '活力的'],
    postingFrequency: '每日1-5条，直播可高频次',
    bestPostingTimes: ['晚19:00-23:00', '周末全天'],
    advantages: ['下沉市场渗透率高', '老铁信任强', '直播带货转化高', '私域价值大'],
    challenges: ['品牌调性偏低', '一二线渗透弱', '内容质量参差', '用户消费力有限'],
    suitableIndustries: ['快消', '农产品', '家电', '服饰', '本地生活服务'],
    typicalBudgetRange: '内容运营：3-15万/月；投放：10-80万/月'
  },
  {
    id: 'videoaccount',
    name: '视频号',
    description: '微信生态内的短视频平台，社交裂变能力强',
    userProfile: '微信全用户，年龄层偏高，下沉市场渗透好',
    coreFeatures: ['短视频', '直播', '公众号联动', '朋友圈分享', '小商店'],
    contentTypes: ['短视频', '直播', '知识分享', '生活记录', '企业宣传片'],
    brandToneFit: ['专业的', '温暖的', '亲民的', '可信赖的'],
    postingFrequency: '每日1-3条',
    bestPostingTimes: ['早7:00-9:00', '午12:00-13:00', '晚19:00-21:00'],
    advantages: ['社交传播强', '微信生态闭环', '私域转化好', '中老年用户多', '获客成本低'],
    challenges: ['内容生态尚在发展', '算法推荐不如抖音', '年轻用户少', '商业化待完善'],
    suitableIndustries: ['全行业', '特别适合品牌官方和私域运营'],
    typicalBudgetRange: '内容运营：3-15万/月；投放：5-50万/月'
  }
]

export const kolTiers: KOLTier[] = [
  {
    id: 'head-kol',
    name: '头部KOL',
    fanCountRange: '500万粉丝以上',
    description: '行业顶级影响力，知名度高，相当于明星级别',
    characteristics: ['国民级知名度', '粉丝基数大', '内容质量高', '制作团队专业', '商业价值高'],
    priceRange: '50-500万/条',
    engagementRate: '互动率1%-3%，相对较低但绝对值大',
    suitableFor: ['品牌声量提升', '新品发布', '重大营销活动', '品牌代言'],
    advantages: ['曝光量巨大', '品牌背书强', '话题效应明显', '媒体关注度高'],
    disadvantages: ['费用极高', '合作门槛高', '档期紧张', '互动率相对低', '粉丝精准度一般'],
    typicalCooperationTypes: ['品牌代言', '新品发布', '重大活动', '话题营销']
  },
  {
    id: 'waist-kol',
    name: '腰部KOL',
    fanCountRange: '50万-500万粉丝',
    description: '在垂直领域有较强影响力，性价比最高',
    characteristics: ['垂直领域专家', '内容质量稳定', '粉丝粘性较高', '有一定知名度', '价格适中'],
    priceRange: '5-50万/条',
    engagementRate: '互动率3%-8%，表现较好',
    suitableFor: ['种草转化', '垂直领域渗透', '产品深度测评', '圈层营销'],
    advantages: ['性价比高', '垂直影响力强', '粉丝精准度高', '内容质量有保障', '合作灵活度高'],
    disadvantages: ['声量不如头部', '破圈能力有限', '需要矩阵投放', '筛选成本较高'],
    typicalCooperationTypes: ['产品测评', '种草推荐', '深度内容', '圈层营销']
  },
  {
    id: 'tail-kol',
    name: '尾部KOL',
    fanCountRange: '10万-50万粉丝',
    description: '细分领域达人，粉丝量不大但活跃度高',
    characteristics: ['细分领域深耕', '粉丝互动性强', '内容更真实', '价格亲民', '数量众多'],
    priceRange: '5000-5万/条',
    engagementRate: '互动率8%-15%，相对较高',
    suitableFor: ['真实口碑营造', '铺量种草', '长尾流量', '新品冷启动'],
    advantages: ['互动率高', '真实感强', '投放灵活', '性价比高', '粉丝信任度高'],
    disadvantages: ['单条曝光有限', '内容质量不稳定', '管理成本高', '需要大规模投放'],
    typicalCooperationTypes: ['产品试用', '真实测评', '生活分享', '口碑推荐']
  },
  {
    id: 'koc',
    name: 'KOC（关键意见消费者）',
    fanCountRange: '1万-10万粉丝或素人',
    description: '普通消费者中的意见领袖，真实体验分享者',
    characteristics: ['真实用户身份', '粉丝基数小', '内容更真实', '互动性极强', '价格低廉'],
    priceRange: '500-5000元/条，或产品置换',
    engagementRate: '互动率15%-30%，非常高',
    suitableFor: ['口碑铺设', '真实评价', '社交证明', '转化铺垫'],
    advantages: ['真实感最强', '互动率极高', '成本极低', '信任感强', '数量庞大'],
    disadvantages: ['曝光量很小', '内容质量参差', '需要大量投放', '效果难以量化'],
    typicalCooperationTypes: ['产品置换', '真实体验', '社交分享', '口碑传播']
  },
  {
    id: 'celebrity',
    name: '明星艺人',
    fanCountRange: '千万级粉丝，顶流级别',
    description: '影视歌明星，公众人物，品牌代言级别',
    characteristics: ['国民度高', '商业价值大', '话题性强', '粉丝忠诚度高', '代言费高昂'],
    priceRange: '代言费：百万到上亿；单次合作：50-500万',
    engagementRate: '互动率波动大，铁粉活跃度高',
    suitableFor: ['品牌代言', '重大活动', '新品首发', '品牌升级'],
    advantages: ['品牌影响力巨大', '媒体曝光多', '粉丝购买力强', '话题热度高'],
    disadvantages: ['费用极高', '风险也高', '合作限制多', '粉丝可能与品牌不匹配'],
    typicalCooperationTypes: ['品牌代言', '活动出席', '广告拍摄', '社交媒体推广']
  }
]

export const kolCooperationTypes = [
  { id: 'product-review', name: '产品测评', description: 'KOL深度体验产品，发布真实测评内容' },
  { id: 'brand-endorsement', name: '品牌代言', description: 'KOL作为品牌代言人，长期合作' },
  { id: 'live-streaming', name: '直播带货', description: 'KOL通过直播推荐和销售产品' },
  { id: 'storytelling', name: '品牌故事', description: 'KOL以故事形式融入品牌理念' },
  { id: 'tutorial', name: '教程/攻略', description: 'KOL制作教程类内容，软性植入产品' },
  { id: 'challenge', name: '话题挑战', description: 'KOL发起或参与品牌话题挑战' },
  { id: 'event-attendance', name: '线下活动', description: 'KOL出席品牌线下活动' },
  { id: 'giveaway', name: '抽奖互动', description: 'KOL发布抽奖活动，增加互动和曝光' },
  { id: 'series-cooperation', name: '系列内容', description: 'KOL持续产出系列合作内容' },
  { id: 'co-creation', name: '内容共创', description: '品牌与KOL共同策划创作内容' }
]

export const offlineEventTypes: OfflineEventType[] = [
  {
    id: 'press-conference',
    name: '发布会',
    description: '新品发布、品牌升级等重大事件的官方发布活动',
    typicalScale: '100-1000人',
    duration: '半天-1天',
    costLevel: '高',
    objectives: ['品牌声量', '产品发布', '媒体曝光', '行业影响力'],
    suitableIndustries: ['科技', '汽车', '时尚', '快消', '互联网'],
    keyElements: ['主题演讲', '产品展示', '媒体采访', '启动仪式', '嘉宾分享'],
    advantages: ['官方权威性强', '媒体关注度高', '品牌势能强', '行业影响力大'],
    challenges: ['成本高', '筹备周期长', '对内容要求高', '效果难以量化']
  },
  {
    id: 'pop-up-store',
    name: '快闪店',
    description: '短期限时开设的体验店，制造话题和体验感',
    typicalScale: '每日数百-数千人次',
    duration: '数天-数月',
    costLevel: '中高',
    objectives: ['品牌体验', '话题营销', '产品试用', '用户互动'],
    suitableIndustries: ['时尚', '美妆', '快消', '科技', '文创'],
    keyElements: ['沉浸式体验', '互动装置', '限定产品', '打卡拍照', '社交传播'],
    advantages: ['话题性强', '用户体验好', '社交传播广', '形式灵活'],
    challenges: ['成本较高', '选址重要', '时间短', '需要持续运营话题']
  },
  {
    id: 'roadshow',
    name: '路演',
    description: '在商场、街头等地进行的流动式推广活动',
    typicalScale: '多城市、多站点，覆盖广泛人群',
    duration: '数周-数月，多站巡展',
    costLevel: '中',
    objectives: ['产品体验', '促销转化', '品牌曝光', '用户获取'],
    suitableIndustries: ['快消', '汽车', '家电', '金融', '互联网'],
    keyElements: ['互动游戏', '产品体验', '现场售卖', '扫码关注', '礼品赠送'],
    advantages: ['覆盖面广', '直接触达用户', '可实地体验', '转化效果直接'],
    challenges: ['执行难度大', '各地协调复杂', '效果参差不齐', '人力成本高']
  },
  {
    id: 'tasting-session',
    name: '品鉴会',
    description: '邀请目标用户深度体验产品的高端小型活动',
    typicalScale: '20-100人，精准邀请',
    duration: '2-4小时',
    costLevel: '中高',
    objectives: ['深度体验', '口碑传播', '意见领袖运营', '品牌好感度'],
    suitableIndustries: ['美妆', '食品酒水', '奢侈品', '高端服务', '科技新品'],
    keyElements: ['产品品鉴', '专家讲解', '互动交流', '精美茶歇', '伴手礼'],
    advantages: ['体验深度强', '用户精准', '口碑效果好', '品牌调性高'],
    challenges: ['覆盖人数少', '单客成本高', '组织难度大', '需要精准邀约']
  },
  {
    id: 'salon',
    name: '沙龙/分享会',
    description: '小型主题分享交流活动，圈层营销为主',
    typicalScale: '20-50人，垂直领域人群',
    duration: '2-3小时',
    costLevel: '低中',
    objectives: ['圈层渗透', '用户运营', '内容共创', '社区建设'],
    suitableIndustries: ['教育', '金融', '科技', '文化艺术', '生活方式'],
    keyElements: ['主题分享', '圆桌讨论', '人脉交流', '茶歇互动', '内容沉淀'],
    advantages: ['精准圈层', '深度互动', '成本可控', '社区粘性强'],
    challenges: ['规模有限', '覆盖面小', '对内容要求高', '见效周期长']
  },
  {
    id: 'exhibition',
    name: '展会/博览会',
    description: '参加行业大型展会，展示品牌和产品',
    typicalScale: '数万-数十万人次参观',
    duration: '2-5天',
    costLevel: '高',
    objectives: ['行业曝光', 'B端合作', '品牌展示', '商机拓展'],
    suitableIndustries: ['科技', '制造业', '贸易', '医疗', '房地产'],
    keyElements: ['特装展位', '产品展示', '商务洽谈', '发布会', '媒体采访'],
    advantages: ['行业影响力强', 'B端转化好', '专业观众多', '品牌展示充分'],
    challenges: ['成本高', '竞争激烈', '效果依赖筹备', '周期长']
  },
  {
    id: 'sponsorship',
    name: '赛事/活动赞助',
    description: '赞助体育赛事、音乐节、电影节等大型活动',
    typicalScale: '数千-数万人现场，数百万线上曝光',
    duration: '1天-数天，激活周期可长达数月',
    costLevel: '高',
    objectives: ['品牌曝光', '形象提升', '目标人群触达', '品牌年轻化'],
    suitableIndustries: ['运动品牌', '饮料', '汽车', '手机', '快消'],
    keyElements: ['品牌冠名', '现场展位', '互动体验', '明星出席', '媒体传播'],
    advantages: ['曝光量大', '品牌调性提升', '人群精准', '话题性强'],
    challenges: ['费用高', '效果难量化', '依赖活动本身影响力', '激活工作复杂']
  },
  {
    id: 'flash-mob',
    name: '快闪/行为艺术',
    description: '创意性的街头表演或艺术装置，制造传播话题',
    typicalScale: '现场数百人，线上传播可达数百万',
    duration: '数分钟-数小时',
    costLevel: '中',
    objectives: ['话题营销', '品牌年轻化', '社交传播', '创意表达'],
    suitableIndustries: ['快消', '时尚', '互联网', '文旅', '文创'],
    keyElements: ['创意装置', '表演艺术', '惊喜感', '打卡传播', '社交话题'],
    advantages: ['话题性强', '传播度高', '创意感强', '品牌记忆点深'],
    challenges: ['效果不可控', '对创意要求高', '容易跑偏', '风险较大']
  }
]

export const prMediaTypes: PRMediaCategory[] = [
  {
    id: 'mainstream-media',
    name: '主流媒体',
    description: '国家级、省级主流新闻媒体，权威性高',
    mediaExamples: ['新华社', '人民日报', '央视新闻', '光明日报', '经济日报', '各省级党报/卫视'],
    audienceProfile: '全年龄段，社会各阶层，公信力高',
    contentTypes: ['新闻通稿', '深度报道', '专访', '专题策划'],
    credibility: 'high',
    costLevel: '中高',
    suitableFor: ['品牌背书', '重大事件', '危机公关', '政府关系'],
    advantages: ['权威性极高', '公信力强', '品牌背书效果好', '政治正确保障'],
    disadvantages: ['审核严格', '发布周期长', '内容限制多', '费用较高']
  },
  {
    id: 'industry-media',
    name: '行业媒体',
    description: '垂直行业的专业媒体，受众精准专业',
    mediaExamples: ['36氪', '虎嗅', '钛媒体', '亿欧', '第一财经', '界面新闻', '各行业垂直媒体'],
    audienceProfile: '行业从业者、专业人士、投资人、企业决策层',
    contentTypes: ['行业报道', '企业专访', '深度分析', '行业榜单', '案例研究'],
    credibility: 'high',
    costLevel: '中',
    suitableFor: ['行业影响力', 'B端获客', '投资关系', '人才招聘'],
    advantages: ['受众精准', '专业度高', '行业背书', '转化率高'],
    disadvantages: ['受众面窄', '破圈能力弱', '对内容要求高', '影响范围有限']
  },
  {
    id: 'self-media',
    name: '自媒体',
    description: '个人或小团队运营的自媒体账号，形式多样',
    mediaExamples: ['微信公众号大号', '今日头条号', '百家号', '搜狐号', '网易号', '各行业KOL'],
    audienceProfile: '取决于具体账号，覆盖各类人群',
    contentTypes: ['软文', '测评', '观点评论', '行业分析', '故事化内容'],
    credibility: 'medium',
    costLevel: '低中',
    suitableFor: ['内容种草', '品牌曝光', '搜索占位', 'SEO优化'],
    advantages: ['数量众多', '形式灵活', '价格多样', '传播速度快'],
    disadvantages: ['质量参差', '可信度不一', '效果难把控', '需要筛选']
  },
  {
    id: 'video-media',
    name: '视频媒体',
    description: '以视频形式为主的媒体平台和视频创作者',
    mediaExamples: ['B站UP主', '视频博主', '视频新闻账号', '短视频大号'],
    audienceProfile: '年轻用户为主，接受度高，互动性强',
    contentTypes: ['视频新闻', '深度解读', '事件报道', '调查报道', '观点分享'],
    credibility: 'medium',
    costLevel: '中高',
    suitableFor: ['年轻人群', '视频内容', '深度解读', '情感共鸣'],
    advantages: ['传播力强', '年轻用户多', '内容感染力强', '互动性好'],
    disadvantages: ['制作成本高', '周期较长', '效果不稳定', '优质账号少']
  },
  {
    id: 'financial-media',
    name: '财经媒体',
    description: '财经类专业媒体，关注商业和资本市场',
    mediaExamples: ['财新', '第一财经', '每日经济新闻', '华尔街见闻', '证券时报', '中国证券报'],
    audienceProfile: '投资者、企业高管、金融从业者、高净值人群',
    contentTypes: ['财经新闻', '公司报道', '行业分析', '财报解读', '资本动态'],
    credibility: 'high',
    costLevel: '高',
    suitableFor: ['上市公司', '融资消息', '品牌价值', '投资者关系'],
    advantages: ['商业影响力大', '高端受众', '资本价值高', '专业性强'],
    disadvantages: ['受众有限', '对内容要求高', '费用昂贵', '负面风险大']
  },
  {
    id: 'lifestyle-media',
    name: '生活方式媒体',
    description: '关注生活品质、时尚潮流的消费类媒体',
    mediaExamples: ['时尚芭莎', 'GQ', 'ELLE', '三联生活周刊', '新世相', '一条'],
    audienceProfile: '中高收入人群，品质生活追求者，女性偏多',
    contentTypes: ['生活方式', '品牌故事', '好物推荐', '人物专访', '趋势报道'],
    credibility: 'medium',
    costLevel: '中高',
    suitableFor: ['高端品牌', '生活方式品牌', '美妆时尚', '品质消费'],
    advantages: ['品牌调性高', '目标用户精准', '内容质量好', '传播效果佳'],
    disadvantages: ['费用较高', '受众面窄', '对品牌调性要求高', '竞争激烈']
  },
  {
    id: 'tech-media',
    name: '科技媒体',
    description: '专注科技领域的专业媒体，报道创新和产品',
    mediaExamples: ['爱范儿', '极客公园', '品玩', 'Engadget中国', '数码多', 'ZEALER'],
    audienceProfile: '科技爱好者、数码发烧友、产品经理、技术人员',
    contentTypes: ['产品测评', '科技新闻', '行业分析', '技术解读', '发布会报道'],
    credibility: 'high',
    costLevel: '中',
    suitableFor: ['科技品牌', '智能硬件', '互联网产品', '技术创新'],
    advantages: ['专业度高', '科技爱好者集中', '产品反馈真实', '早期用户获取'],
    disadvantages: ['受众有限', '对产品要求高', '负面评价风险', '专业性强']
  }
]

export const cooperationModes = [
  '品牌代言',
  '产品植入',
  '内容定制',
  '直播带货',
  '话题挑战',
  '线下活动',
  '系列栏目',
  '产品试用'
]

export const prContentTypes = [
  '新闻通稿',
  '深度专访',
  '行业评论',
  '案例分析',
  '数据报告',
  '人物故事',
  '产品测评',
  '趋势解读'
]
