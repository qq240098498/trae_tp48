import type { KPIMetric } from '../types'

export interface AwarenessMetric extends KPIMetric {
  category: '曝光' | '认知' | '记忆'
  measurementDifficulty: 'easy' | 'medium' | 'hard'
}

export interface EngagementMetric extends KPIMetric {
  category: '互动' | '参与' | '传播'
  interactionType: '主动' | '被动'
}

export interface ConversionMetric extends KPIMetric {
  category: '获客' | '转化' | '营收'
  conversionStage: 'top' | 'middle' | 'bottom'
}

export interface LoyaltyMetric extends KPIMetric {
  category: '留存' | '复购' | '口碑'
  timeHorizon: 'short' | 'medium' | 'long'
}

export interface AttributionModel {
  id: string
  name: string
  description: string
  howItWorks: string
  formula: string
  advantages: string[]
  disadvantages: string[]
  suitableScenarios: string[]
  complexity: 'low' | 'medium' | 'high'
  accuracy: 'low' | 'medium' | 'high'
  visualDescription: string
}

export interface MonitoringTool {
  id: string
  name: string
  category: '社交媒体监测' | '网站分析' | '电商数据' | '舆情监测' | '广告效果' | 'CRM系统'
  description: string
  coreFeatures: string[]
  pricing: string
  suitableFor: string[]
  advantages: string[]
  limitations: string[]
  dataSources: string[]
}

export interface BenchmarkData {
  industry: string
  metric: string
  average: string
  good: string
  excellent: string
  unit: string
  notes: string
}

export const awarenessMetrics: AwarenessMetric[] = [
  {
    name: '曝光量',
    description: '品牌内容被展示的总次数',
    target: '',
    unit: '次',
    measurementMethod: '通过平台后台数据统计展示次数',
    category: '曝光',
    measurementDifficulty: 'easy'
  },
  {
    name: '触达人数',
    description: '看到品牌内容的独立用户数量',
    target: '',
    unit: '人',
    measurementMethod: '平台去重统计，独立访客数',
    category: '曝光',
    measurementDifficulty: 'easy'
  },
  {
    name: '品牌提及量',
    description: '在社交媒体、新闻、论坛中提及品牌的次数',
    target: '',
    unit: '次',
    measurementMethod: '通过舆情监测工具抓取品牌关键词提及',
    category: '认知',
    measurementDifficulty: 'medium'
  },
  {
    name: '品牌搜索量',
    description: '用户主动搜索品牌名称的次数',
    target: '',
    unit: '次',
    measurementMethod: '通过百度指数、微信指数等工具统计',
    category: '认知',
    measurementDifficulty: 'easy'
  },
  {
    name: '品牌认知度',
    description: '目标人群中知道该品牌的比例',
    target: '',
    unit: '%',
    measurementMethod: '通过市场调研问卷，提示前/提示后认知度',
    category: '认知',
    measurementDifficulty: 'hard'
  },
  {
    name: '品牌回忆率',
    description: '用户在没有提示情况下能回忆起品牌的比例',
    target: '',
    unit: '%',
    measurementMethod: '通过市场调研，无提示回忆测试',
    category: '记忆',
    measurementDifficulty: 'hard'
  },
  {
    name: '媒体报道量',
    description: '品牌获得的新闻媒体报道篇数',
    target: '',
    unit: '篇',
    measurementMethod: '通过新闻监测工具统计报道数量',
    category: '认知',
    measurementDifficulty: 'medium'
  },
  {
    name: '话题阅读量',
    description: '品牌相关话题的总阅读/浏览次数',
    target: '',
    unit: '次',
    measurementMethod: '社交媒体话题页数据统计',
    category: '曝光',
    measurementDifficulty: 'easy'
  },
  {
    name: '广告回想度',
    description: '看过广告的用户中能回忆起广告的比例',
    target: '',
    unit: '%',
    measurementMethod: '通过广告效果调研测试回想率',
    category: '记忆',
    measurementDifficulty: 'hard'
  },
  {
    name: '品牌第一提及率',
    description: '提到某品类时第一个想到的品牌占比',
    target: '',
    unit: '%',
    measurementMethod: '通过市场调研，第一提及率测试',
    category: '记忆',
    measurementDifficulty: 'hard'
  }
]

export const engagementMetrics: EngagementMetric[] = [
  {
    name: '点赞数',
    description: '内容获得的点赞数量',
    target: '',
    unit: '次',
    measurementMethod: '平台后台统计点赞数',
    category: '互动',
    interactionType: '被动'
  },
  {
    name: '评论数',
    description: '内容获得的评论数量',
    target: '',
    unit: '条',
    measurementMethod: '平台后台统计评论数',
    category: '互动',
    interactionType: '主动'
  },
  {
    name: '转发/分享数',
    description: '内容被用户转发分享的次数',
    target: '',
    unit: '次',
    measurementMethod: '平台后台统计转发/分享数',
    category: '传播',
    interactionType: '主动'
  },
  {
    name: '收藏数',
    description: '内容被用户收藏的次数',
    target: '',
    unit: '次',
    measurementMethod: '平台后台统计收藏数',
    category: '参与',
    interactionType: '主动'
  },
  {
    name: '互动率',
    description: '互动行为总数占曝光量的比例',
    target: '',
    unit: '%',
    measurementMethod: '（点赞+评论+转发+收藏）/ 曝光量 × 100%',
    category: '互动',
    interactionType: '被动'
  },
  {
    name: '互动深度',
    description: '平均每个互动用户产生的互动次数',
    target: '',
    unit: '次/人',
    measurementMethod: '总互动次数 / 互动用户数',
    category: '参与',
    interactionType: '主动'
  },
  {
    name: '评论情感倾向',
    description: '评论中正负面评价的比例分布',
    target: '',
    unit: '%',
    measurementMethod: '通过NLP语义分析评论情感',
    category: '互动',
    interactionType: '主动'
  },
  {
    name: 'UGC内容数',
    description: '用户自发创作的与品牌相关内容数量',
    target: '',
    unit: '篇/条',
    measurementMethod: '通过话题监测统计用户自发内容',
    category: '参与',
    interactionType: '主动'
  },
  {
    name: '参与人数',
    description: '参与品牌活动/互动的独立用户数',
    target: '',
    unit: '人',
    measurementMethod: '活动参与数据统计',
    category: '参与',
    interactionType: '主动'
  },
  {
    name: '完读率/完播率',
    description: '用户完整阅读/观看内容的比例',
    target: '',
    unit: '%',
    measurementMethod: '完整阅读/观看人数 / 内容触达人数',
    category: '参与',
    interactionType: '被动'
  },
  {
    name: '平均观看时长',
    description: '用户观看视频内容的平均时长',
    target: '',
    unit: '秒',
    measurementMethod: '视频平台数据统计',
    category: '参与',
    interactionType: '被动'
  },
  {
    name: '私信/咨询数',
    description: '用户主动私信或咨询品牌的次数',
    target: '',
    unit: '次',
    measurementMethod: '客服后台/私信统计',
    category: '互动',
    interactionType: '主动'
  }
]

export const conversionMetrics: ConversionMetric[] = [
  {
    name: '点击量',
    description: '用户点击推广链接/CTA按钮的次数',
    target: '',
    unit: '次',
    measurementMethod: '广告平台/网站分析工具统计',
    category: '获客',
    conversionStage: 'top'
  },
  {
    name: '点击率（CTR）',
    description: '点击次数占曝光量的比例',
    target: '',
    unit: '%',
    measurementMethod: '点击量 / 曝光量 × 100%',
    category: '获客',
    conversionStage: 'top'
  },
  {
    name: '网站访问量',
    description: '品牌官网/落地页的访问次数',
    target: '',
    unit: '次',
    measurementMethod: 'Google Analytics/百度统计等工具',
    category: '获客',
    conversionStage: 'top'
  },
  {
    name: '独立访客数（UV）',
    description: '访问网站/落地页的独立用户数',
    target: '',
    unit: '人',
    measurementMethod: '网站分析工具统计去重访客数',
    category: '获客',
    conversionStage: 'top'
  },
  {
    name: '新增粉丝数',
    description: '社交媒体账号新增的粉丝数量',
    target: '',
    unit: '人',
    measurementMethod: '平台后台粉丝增长数据',
    category: '获客',
    conversionStage: 'middle'
  },
  {
    name: '注册/留资数',
    description: '用户完成注册或留下联系方式的数量',
    target: '',
    unit: '人',
    measurementMethod: '注册表单/留资表单提交数据',
    category: '转化',
    conversionStage: 'middle'
  },
  {
    name: '转化率（CVR）',
    description: '完成目标行为的用户占访问用户的比例',
    target: '',
    unit: '%',
    measurementMethod: '转化人数 / 访问人数 × 100%',
    category: '转化',
    conversionStage: 'middle'
  },
  {
    name: '获客成本（CAC）',
    description: '获取一个新客户所需的平均成本',
    target: '',
    unit: '元/人',
    measurementMethod: '总营销费用 / 新增客户数',
    category: '获客',
    conversionStage: 'middle'
  },
  {
    name: '订单量',
    description: '产生的订单总数',
    target: '',
    unit: '单',
    measurementMethod: '电商后台/销售系统统计',
    category: '转化',
    conversionStage: 'bottom'
  },
  {
    name: '成交金额（GMV）',
    description: '总成交金额，包含退款',
    target: '',
    unit: '元',
    measurementMethod: '电商平台/销售系统统计',
    category: '营收',
    conversionStage: 'bottom'
  },
  {
    name: '实际销售额',
    description: '扣除退款后的实际销售收入',
    target: '',
    unit: '元',
    measurementMethod: '财务系统实际到账金额',
    category: '营收',
    conversionStage: 'bottom'
  },
  {
    name: '客单价',
    description: '平均每个订单的金额',
    target: '',
    unit: '元/单',
    measurementMethod: '总销售额 / 订单数',
    category: '营收',
    conversionStage: 'bottom'
  },
  {
    name: '投入产出比（ROI）',
    description: '营销投入带来的销售回报倍数',
    target: '',
    unit: '倍',
    measurementMethod: '新增销售额 / 营销投入',
    category: '营收',
    conversionStage: 'bottom'
  },
  {
    name: '加购数',
    description: '用户将商品加入购物车的数量',
    target: '',
    unit: '次',
    measurementMethod: '电商平台后台统计',
    category: '转化',
    conversionStage: 'middle'
  },
  {
    name: '加购转化率',
    description: '加购用户中最终下单的比例',
    target: '',
    unit: '%',
    measurementMethod: '下单人数 / 加购人数 × 100%',
    category: '转化',
    conversionStage: 'bottom'
  }
]

export const loyaltyMetrics: LoyaltyMetric[] = [
  {
    name: '复购率',
    description: '购买一次以上的用户占总用户的比例',
    target: '',
    unit: '%',
    measurementMethod: '复购用户数 / 总购买用户数 × 100%',
    category: '复购',
    timeHorizon: 'medium'
  },
  {
    name: '复购频次',
    description: '用户在一定时间内的平均购买次数',
    target: '',
    unit: '次/人/年',
    measurementMethod: '总订单数 / 活跃用户数',
    category: '复购',
    timeHorizon: 'medium'
  },
  {
    name: '用户留存率',
    description: '一段时间后仍然活跃的用户比例',
    target: '',
    unit: '%',
    measurementMethod: '（期末活跃用户数 / 期初用户数）× 100%',
    category: '留存',
    timeHorizon: 'medium'
  },
  {
    name: '次日留存率',
    description: '新用户在第二天仍然活跃的比例',
    target: '',
    unit: '%',
    measurementMethod: '次日活跃新用户 / 当日新增用户 × 100%',
    category: '留存',
    timeHorizon: 'short'
  },
  {
    name: '7日留存率',
    description: '新用户在第7天仍然活跃的比例',
    target: '',
    unit: '%',
    measurementMethod: '7日后活跃新用户 / 当日新增用户 × 100%',
    category: '留存',
    timeHorizon: 'short'
  },
  {
    name: '30日留存率',
    description: '新用户在第30天仍然活跃的比例',
    target: '',
    unit: '%',
    measurementMethod: '30日后活跃新用户 / 当日新增用户 × 100%',
    category: '留存',
    timeHorizon: 'medium'
  },
  {
    name: '客户终身价值（LTV）',
    description: '客户在整个生命周期内为企业带来的总价值',
    target: '',
    unit: '元/人',
    measurementMethod: '平均客单价 × 复购频次 × 客户生命周期',
    category: '复购',
    timeHorizon: 'long'
  },
  {
    name: '会员活跃度',
    description: '会员用户中活跃用户的比例',
    target: '',
    unit: '%',
    measurementMethod: '活跃会员数 / 总会员数 × 100%',
    category: '留存',
    timeHorizon: 'medium'
  },
  {
    name: 'NPS净推荐值',
    description: '用户愿意推荐品牌给他人的程度',
    target: '',
    unit: '分',
    measurementMethod: '推荐者占比 - 贬损者占比（0-10分制调研）',
    category: '口碑',
    timeHorizon: 'medium'
  },
  {
    name: '品牌好感度',
    description: '用户对品牌的正面评价比例',
    target: '',
    unit: '%',
    measurementMethod: '通过用户调研统计品牌好感度',
    category: '口碑',
    timeHorizon: 'medium'
  },
  {
    name: '用户满意度',
    description: '用户对产品/服务的满意程度',
    target: '',
    unit: '%',
    measurementMethod: '通过CSAT满意度调研问卷统计',
    category: '口碑',
    timeHorizon: 'short'
  },
  {
    name: '流失率',
    description: '一段时间内停止使用/购买的用户比例',
    target: '',
    unit: '%',
    measurementMethod: '流失用户数 / 期初用户数 × 100%',
    category: '留存',
    timeHorizon: 'medium'
  },
  {
    name: '口碑传播系数',
    description: '每个用户平均带来的新用户数',
    target: '',
    unit: '人/人',
    measurementMethod: '通过用户推荐带来的新用户数 / 总用户数',
    category: '口碑',
    timeHorizon: 'long'
  }
]

export const attributionModels: AttributionModel[] = [
  {
    id: 'first-click',
    name: '首次点击归因',
    description: '将全部功劳归于用户第一次接触的渠道',
    howItWorks: '用户转化路径中，第一次点击的渠道获得100%的转化功劳',
    formula: '首次渠道权重 = 100%',
    advantages: ['计算简单', '便于评估拉新渠道效果', '适合关注获客的场景'],
    disadvantages: ['忽略了后续渠道的作用', '可能高估首次接触渠道', '不适合长决策周期产品'],
    suitableScenarios: ['新品牌冷启动', '关注品牌曝光和拉新', '短决策周期产品'],
    complexity: 'low',
    accuracy: 'low',
    visualDescription: '一条路径上，只有第一个触点被点亮，权重100%'
  },
  {
    id: 'last-click',
    name: '末次点击归因',
    description: '将全部功劳归于用户最后一次接触的渠道',
    howItWorks: '用户转化路径中，最后一次点击的渠道获得100%的转化功劳',
    formula: '末次渠道权重 = 100%',
    advantages: ['计算最简单', '便于评估临门一脚的渠道', '数据容易获取'],
    disadvantages: ['完全忽略之前的渠道贡献', '可能高估转化型渠道', '低估品牌建设价值'],
    suitableScenarios: ['直接转化型营销', '电商促销活动', '短路径转化'],
    complexity: 'low',
    accuracy: 'low',
    visualDescription: '一条路径上，只有最后一个触点被点亮，权重100%'
  },
  {
    id: 'linear',
    name: '线性归因',
    description: '将功劳平均分配给用户接触过的所有渠道',
    howItWorks: '用户转化路径中，每个渠道获得相等的转化功劳',
    formula: '每个渠道权重 = 100% / 渠道数量',
    advantages: ['公平对待所有渠道', '计算简单', '考虑了全路径接触点'],
    disadvantages: ['无法区分渠道的不同作用', '平均主义可能不符合实际', '重要渠道价值被低估'],
    suitableScenarios: ['多渠道配合营销', '用户路径较长', '初期探索阶段'],
    complexity: 'low',
    accuracy: 'medium',
    visualDescription: '一条路径上，所有触点被均匀点亮，每个权重相同'
  },
  {
    id: 'time-decay',
    name: '时间衰减归因',
    description: '越接近转化时间的渠道获得的权重越高',
    howItWorks: '根据渠道接触时间与转化时间的距离分配权重，距离越近权重越高',
    formula: '权重 = 1 / (1 + 时间衰减系数 × 时间间隔)',
    advantages: ['更符合用户决策心理', '重视临门一脚的渠道', '逻辑上更合理'],
    disadvantages: ['可能低估早期认知渠道', '衰减系数需要调试', '计算相对复杂'],
    suitableScenarios: ['决策周期适中', '渠道多样性高', '促销驱动型产品'],
    complexity: 'medium',
    accuracy: 'medium',
    visualDescription: '一条路径上，触点从左到右亮度逐渐增强，越靠右越亮'
  },
  {
    id: 'u-shaped',
    name: 'U型归因（位置归因）',
    description: '首次和末次接触获得更多权重，中间渠道平分剩余权重',
    howItWorks: '第一个渠道和最后一个渠道各获得40%权重，中间渠道平分剩下的20%',
    formula: '首末渠道各40%，中间渠道平分20%（也可调为首30%末40%等）',
    advantages: ['同时重视首次和末次渠道', '兼顾品牌建设和转化', '比线性更合理'],
    disadvantages: ['中间渠道权重可能偏低', '权重分配比例主观', '对中间环节不友好'],
    suitableScenarios: ['品牌与效果并重', '多触点转化路径', '认知型产品'],
    complexity: 'medium',
    accuracy: 'medium',
    visualDescription: '一条路径上，第一个和最后一个触点最亮，中间触点亮度较低'
  },
  {
    id: 'w-shaped',
    name: 'W型归因',
    description: '首次接触、兴趣产生、转化三个关键节点各占主要权重',
    howItWorks: '首次接触、关键互动触点、末次转化各获得30%权重，其余触点平分10%',
    formula: '首中末三个关键节点各30%，其余平分10%',
    advantages: ['识别关键节点', '更符合用户决策漏斗', '重视关键时刻'],
    disadvantages: ['关键节点识别困难', '模型更复杂', '需要更多数据支持'],
    suitableScenarios: ['长决策周期', '高客单价产品', 'B2B营销'],
    complexity: 'high',
    accuracy: 'medium',
    visualDescription: '一条路径上，有三个高亮点（开头、中间关键节点、结尾），形成W形状'
  },
  {
    id: 'data-driven',
    name: '数据驱动归因（算法归因）',
    description: '基于大量历史数据通过算法计算每个渠道的真实贡献',
    howItWorks: '运用马尔可夫链、Shapley值等算法，基于数据分析计算各渠道的边际贡献',
    formula: '基于算法模型动态计算，不同渠道权重不同',
    advantages: ['最科学准确', '基于真实数据', '能发现隐性价值'],
    disadvantages: ['需要大量数据积累', '算法复杂难以理解', '实施成本高'],
    suitableScenarios: ['数据积累充足', '营销预算大', '精细化运营阶段'],
    complexity: 'high',
    accuracy: 'high',
    visualDescription: '一条路径上，各触点亮度不同，由算法根据实际贡献度动态分配'
  }
]

export const monitoringTools: MonitoringTool[] = [
  {
    id: 'wechat-backend',
    name: '微信公众平台',
    category: '社交媒体监测',
    description: '微信公众号和视频号官方后台数据',
    coreFeatures: ['粉丝数据', '内容阅读数据', '互动数据', '用户画像', '消息数据'],
    pricing: '免费',
    suitableFor: ['所有微信运营的品牌', '公众号和视频号数据'],
    advantages: ['数据最准确', '官方数据', '免费', '功能全面'],
    limitations: ['只能看自己账号', '数据深度有限', '缺少竞品分析'],
    dataSources: ['微信官方数据']
  },
  {
    id: 'weibo-backend',
    name: '微博后台',
    category: '社交媒体监测',
    description: '微博官方账号数据后台',
    coreFeatures: ['粉丝增长', '内容数据', '互动数据', '转评赞分析', '粉丝画像'],
    pricing: '基础功能免费，高级功能付费',
    suitableFor: ['所有微博运营的品牌'],
    advantages: ['官方数据准确', '实时性强', '话题数据丰富'],
    limitations: ['数据分析深度有限', '缺少跨平台对比'],
    dataSources: ['微博官方数据']
  },
  {
    id: 'xinpianchang',
    name: '新榜/新抖/新红',
    category: '社交媒体监测',
    description: '新媒体内容数据分析平台，覆盖微信、抖音、小红书等',
    coreFeatures: ['账号数据分析', '内容监测', '竞品分析', '热榜趋势', 'KOL筛选'],
    pricing: '基础版免费，专业版数千到数万元/年',
    suitableFor: ['多平台运营', 'KOL营销', '竞品监测'],
    advantages: ['覆盖平台多', '数据维度丰富', '竞品分析强', 'KOL资源库'],
    limitations: ['部分数据估算', '高级功能费用高', '数据有延迟'],
    dataSources: ['公开数据爬取', '平台合作数据', '算法估算']
  },
  {
    id: 'qian-gua',
    name: '千瓜数据',
    category: '社交媒体监测',
    description: '小红书和抖音专业数据分析工具',
    coreFeatures: ['小红书数据分析', 'KOL筛选', '竞品监测', '热门内容', '品牌投放分析'],
    pricing: '专业版数千到上万元/年',
    suitableFor: ['小红书营销', '种草营销', 'KOL投放'],
    advantages: ['小红书数据专业', 'KOL画像详细', '投放效果追踪'],
    limitations: ['价格较高', '主要覆盖小红书和抖音', '数据为估算值'],
    dataSources: ['公开数据爬取', '算法估算', 'KOL合作数据']
  },
  {
    id: 'baidu-tongji',
    name: '百度统计',
    category: '网站分析',
    description: '百度推出的免费网站流量分析工具',
    coreFeatures: ['流量统计', '来源分析', '用户行为', '转化分析', '页面分析'],
    pricing: '免费',
    suitableFor: ['所有有网站的企业', 'SEO/SEM效果追踪'],
    advantages: ['免费', '中文支持好', '与百度搜索打通', '功能全面'],
    limitations: ['数据准确度一般', '高级分析不足', '界面较旧'],
    dataSources: ['网站JS埋点', '百度搜索数据']
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics (GA4)',
    category: '网站分析',
    description: 'Google推出的专业网站和APP分析工具',
    coreFeatures: ['用户分析', '获客分析', '行为分析', '转化分析', '自定义报告'],
    pricing: '基础版免费，企业版付费',
    suitableFor: ['有网站/APP的企业', '精细化运营', '出海品牌'],
    advantages: ['功能强大', '数据分析深度高', '免费版够用', '行业标准'],
    limitations: ['学习成本高', '国内访问有问题', '隐私合规问题'],
    dataSources: ['网站/APP埋点', 'Google广告数据']
  },
  {
    id: 'growing-io',
    name: 'GrowingIO',
    category: '网站分析',
    description: '国内领先的用户行为数据分析平台',
    coreFeatures: ['无埋点采集', '用户行为分析', '漏斗分析', '留存分析', '分群运营'],
    pricing: '按使用量收费，数千元到数十万元/年',
    suitableFor: ['互联网产品', '精细化运营', '用户增长'],
    advantages: ['无埋点技术', '用户分析深入', '产品增长友好', '本地化服务好'],
    limitations: ['价格较高', '需要技术接入', '学习成本高'],
    dataSources: ['SDK埋点', '无埋点采集']
  },
  {
    id: 'shence',
    name: '神策数据',
    category: '网站分析',
    description: '专业的用户行为分析和营销科技平台',
    coreFeatures: ['用户行为分析', '用户画像', '精细化运营', 'A/B测试', '营销自动化'],
    pricing: '按使用量收费，中大型企业级价格',
    suitableFor: ['中大型企业', '数据驱动运营', '增长团队'],
    advantages: ['功能强大全面', '数据能力强', '私有化部署', '服务专业'],
    limitations: ['价格昂贵', '实施周期长', '需要专业团队使用'],
    dataSources: ['多端埋点', '业务数据对接', '第三方数据']
  },
  {
    id: 'crm-system',
    name: 'CRM系统（销售易/纷享销客）',
    category: 'CRM系统',
    description: '客户关系管理系统，追踪销售转化全流程',
    coreFeatures: ['客户管理', '销售漏斗', '线索追踪', '商机管理', '销售报表'],
    pricing: '按用户数收费，数百到数千元/人/年',
    suitableFor: ['B2B企业', '销售驱动型企业', '长决策周期产品'],
    advantages: ['销售转化追踪准确', '客户全生命周期管理', '销售效率提升'],
    limitations: ['实施成本高', '需要销售团队配合', '数据质量依赖录入'],
    dataSources: ['销售人工录入', '营销系统对接', '客户互动数据']
  },
  {
    id: 'dianping-data',
    name: '生意参谋/商智',
    category: '电商数据',
    description: '淘宝/京东等电商平台官方数据分析工具',
    coreFeatures: ['店铺数据', '流量分析', '转化分析', '商品分析', '市场行情'],
    pricing: '基础版免费，高级版付费',
    suitableFor: ['电商品牌', '天猫/京东店铺运营'],
    advantages: ['官方数据准确', '电商维度专业', '与平台打通'],
    limitations: ['只能看店铺内数据', '跨平台分析弱', '高级功能贵'],
    dataSources: ['电商平台官方数据']
  },
  {
    id: 'yuqing-monitor',
    name: '舆情监测工具（鹰眼/识微）',
    category: '舆情监测',
    description: '全网品牌舆情监测和分析工具',
    coreFeatures: ['全网舆情监测', '负面预警', '品牌声量', '竞品对比', '情感分析'],
    pricing: '数万元到数十万元/年',
    suitableFor: ['品牌公关', '危机公关', '品牌知名度监测'],
    advantages: ['全网覆盖', '实时预警', '情感分析', '竞品对比'],
    limitations: ['价格较高', '数据准确性依赖算法', '需要专业解读'],
    dataSources: ['新闻媒体', '社交平台', '论坛博客', '视频平台']
  }
]

export const metricCategories = [
  { id: 'awareness', name: '品牌认知类', description: '衡量品牌曝光和用户认知程度的指标' },
  { id: 'engagement', name: '用户互动类', description: '衡量用户与品牌内容互动程度的指标' },
  { id: 'conversion', name: '转化效果类', description: '衡量营销带来的转化和销售效果的指标' },
  { id: 'loyalty', name: '用户忠诚类', description: '衡量用户留存、复购和口碑的指标' }
]

export const funnelStages = [
  { id: 'awareness', name: '认知阶段', description: '用户首次接触和了解品牌', typicalMetrics: ['曝光量', '触达人数', '品牌搜索量'] },
  { id: 'interest', name: '兴趣阶段', description: '用户产生兴趣并开始关注', typicalMetrics: ['内容阅读/观看', '收藏', '粉丝增长'] },
  { id: 'desire', name: '欲望阶段', description: '用户产生购买意愿和需求', typicalMetrics: ['详情页浏览', '加购', '咨询', '留资'] },
  { id: 'action', name: '行动阶段', description: '用户完成购买或转化行为', typicalMetrics: ['下单量', '成交额', '转化率', '客单价'] },
  { id: 'loyalty', name: '忠诚阶段', description: '用户重复购买并推荐他人', typicalMetrics: ['复购率', '留存率', 'NPS', 'LTV'] }
]

export const benchmarkDatas: BenchmarkData[] = [
  { industry: '美妆护肤', metric: '微博互动率', average: '0.5%', good: '1%', excellent: '2%', unit: '%', notes: '不同层级KOL差异大' },
  { industry: '美妆护肤', metric: '抖音完播率', average: '30%', good: '45%', excellent: '60%', unit: '%', notes: '视频时长影响大' },
  { industry: '美妆护肤', metric: '小红书互动率', average: '3%', good: '5%', excellent: '8%', unit: '%', notes: '素人笔记互动率更高' },
  { industry: '快消食品', metric: '电商转化率', average: '2%', good: '4%', excellent: '6%', unit: '%', notes: '不同品类差异较大' },
  { industry: '快消食品', metric: '复购率', average: '20%', good: '35%', excellent: '50%', unit: '%', notes: '年度复购率参考' },
  { industry: '3C数码', metric: '品牌搜索占比', average: '15%', good: '25%', excellent: '40%', unit: '%', notes: '品牌力强的品牌更高' },
  { industry: '3C数码', metric: '详情页转化率', average: '8%', good: '12%', excellent: '18%', unit: '%', notes: '高客单价产品偏低' },
  { industry: '教育培训', metric: '获客成本', average: '500元', good: '300元', excellent: '150元', unit: '元/人', notes: '客单价高的品类CAC更高' },
  { industry: '教育培训', metric: '线索转化率', average: '5%', good: '10%', excellent: '15%', unit: '%', notes: '从留资到付费的转化率' },
  { industry: '电商零售', metric: '投放ROI', average: '1:3', good: '1:5', excellent: '1:8', unit: '倍', notes: '不同品类差异很大' },
  { industry: '电商零售', metric: '加购转化率', average: '10%', good: '15%', excellent: '20%', unit: '%', notes: '加购到下单的转化' }
]
