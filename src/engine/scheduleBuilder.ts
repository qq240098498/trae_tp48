import type { Strategy, ChannelMatrix, KPISettings, ExecutionPlan, TimelinePhase, ResourceItem, RiskItem } from '../types'
import { randomPick, randomPickMultiple } from './strategyEngine'

/**
 * 生成三阶段排期
 */
function generateTimeline(strategy: Strategy, channels: ChannelMatrix, kpi: KPISettings): TimelinePhase[] {
  const today = new Date()

  const warmupDuration = randomPick(['2周', '3周', '1个月'])
  const explosionDuration = randomPick(['2周', '3周', '1个月', '6周'])
  const sustainingDuration = randomPick(['1个月', '2个月', '3个月'])

  const warmupStart = formatDate(addDays(today, 1))
  const warmupEnd = formatDate(addDays(today, durationToDays(warmupDuration)))

  const explosionStart = formatDate(addDays(today, durationToDays(warmupDuration) + 1))
  const explosionEnd = formatDate(addDays(today, durationToDays(warmupDuration) + durationToDays(explosionDuration)))

  const sustainingStart = formatDate(addDays(today, durationToDays(warmupDuration) + durationToDays(explosionDuration) + 1))
  const sustainingEnd = formatDate(addDays(today, durationToDays(warmupDuration) + durationToDays(explosionDuration) + durationToDays(sustainingDuration)))

  const warmupActivities = [
    '品牌官方账号矩阵搭建与内容铺设',
    '核心KOL沟通与内容策划',
    '预热海报/视频素材制作',
    '媒体沟通与稿件准备',
    '用户调研与种子用户招募',
    '内部培训与项目启动',
    '话题预热与悬念营造',
    'SEO/SEM基础铺设'
  ]

  const explosionActivities = [
    '核心创意内容全网发布',
    'KOL矩阵集中发声',
    '话题挑战赛上线推广',
    '主流媒体深度报道',
    '线下活动落地执行',
    '直播带货/线上发布会',
    '信息流广告集中投放',
    '用户UGC活动激励',
    '跨界合作联合推广',
    '舆情监测与危机应对'
  ]

  const sustainingActivities = [
    '长尾内容持续输出',
    '用户口碑运营与维护',
    '深度用户案例打造',
    '私域流量沉淀与运营',
    '数据复盘与策略优化',
    '后续传播节奏规划',
    '品牌资产沉淀整理',
    '用户忠诚度培养'
  ]

  const warmupDeliverables = [
    '品牌传播物料包',
    'KOL合作清单与排期',
    '预热内容发布排期表',
    '媒体合作名单',
    '项目执行手册'
  ]

  const explosionDeliverables = [
    '核心创意内容包',
    '话题数据报告',
    '媒体报道集锦',
    'KOL传播效果汇总',
    '用户增长数据报告'
  ]

  const sustainingDeliverables = [
    '项目整体复盘报告',
    '用户案例合集',
    '品牌资产沉淀清单',
    '后续优化建议方案',
    '长效运营规划文档'
  ]

  return [
    {
      name: '预热期',
      duration: warmupDuration,
      startDate: warmupStart,
      endDate: warmupEnd,
      keyActivities: randomPickMultiple(warmupActivities, 5),
      deliverables: randomPickMultiple(warmupDeliverables, 3)
    },
    {
      name: '引爆期',
      duration: explosionDuration,
      startDate: explosionStart,
      endDate: explosionEnd,
      keyActivities: randomPickMultiple(explosionActivities, 6),
      deliverables: randomPickMultiple(explosionDeliverables, 3)
    },
    {
      name: '延续期',
      duration: sustainingDuration,
      startDate: sustainingStart,
      endDate: sustainingEnd,
      keyActivities: randomPickMultiple(sustainingActivities, 5),
      deliverables: randomPickMultiple(sustainingDeliverables, 3)
    }
  ]
}

/**
 * 生成资源分配建议
 */
function generateResources(strategy: Strategy, channels: ChannelMatrix): ResourceItem[] {
  const hasSocialMedia = channels.socialMedia && channels.socialMedia.platforms.length > 0
  const hasKOL = channels.kolMarketing && channels.kolMarketing.kolTiers.length > 0
  const hasOffline = channels.offlineEvents && channels.offlineEvents.eventTypes.length > 0
  const hasPR = channels.prRelations && channels.prRelations.mediaMatrix.length > 0

  const resources: ResourceItem[] = []

  if (hasSocialMedia) {
    resources.push({
      category: '内容制作',
      item: '社交媒体内容创作',
      quantity: '按排期产出',
      budget: '占总预算 15%-20%',
      responsible: '内容运营团队'
    })
    resources.push({
      category: '广告投放',
      item: '社交媒体广告投放',
      quantity: '按阶段投放',
      budget: '占总预算 20%-30%',
      responsible: '媒介投放团队'
    })
  }

  if (hasKOL) {
    resources.push({
      category: 'KOL合作',
      item: 'KOL内容合作费用',
      quantity: '按KOL层级分配',
      budget: '占总预算 25%-35%',
      responsible: 'KOL运营团队'
    })
    resources.push({
      category: 'KOL合作',
      item: 'KOL筛选与管理',
      quantity: '全项目周期',
      budget: '占KOL预算 5%-10%',
      responsible: 'KOL运营团队'
    })
  }

  if (hasPR) {
    resources.push({
      category: '公关传播',
      item: '媒体发稿与合作',
      quantity: '按发布计划执行',
      budget: '占总预算 10%-15%',
      responsible: '公关传播团队'
    })
  }

  if (hasOffline) {
    resources.push({
      category: '线下活动',
      item: '活动场地与搭建',
      quantity: '按活动场次计',
      budget: '占总预算 15%-25%',
      responsible: '活动执行团队'
    })
    resources.push({
      category: '线下活动',
      item: '活动物料与礼品',
      quantity: '按参与人数准备',
      budget: '占活动预算 15%-20%',
      responsible: '活动执行团队'
    })
  }

  resources.push({
    category: '数据监测',
    item: '数据监测与分析工具',
    quantity: '全项目周期',
    budget: '占总预算 3%-5%',
    responsible: '数据分析团队'
  })

  resources.push({
    category: '项目管理',
    item: '项目管理与协调',
    quantity: '全项目周期',
    budget: '占总预算 5%-8%',
    responsible: '项目经理'
  })

  return resources
}

/**
 * 生成总预算估算
 */
function generateTotalBudget(strategy: Strategy, channels: ChannelMatrix): string {
  const hasKOL = channels.kolMarketing && channels.kolMarketing.kolTiers.length > 0
  const hasOffline = channels.offlineEvents && channels.offlineEvents.eventTypes.length > 0

  let budgetLevel: 'low' | 'medium' | 'high' = 'medium'

  if (hasKOL && hasOffline) {
    budgetLevel = 'high'
  } else if (!hasKOL && !hasOffline) {
    budgetLevel = 'low'
  }

  const budgetOptions: Record<string, string[]> = {
    low: [
      '50万-100万',
      '80万-150万',
      '100万-200万'
    ],
    medium: [
      '200万-500万',
      '300万-600万',
      '500万-800万'
    ],
    high: [
      '800万-1500万',
      '1000万-2000万',
      '1500万-3000万'
    ]
  }

  const totalBudget = randomPick(budgetOptions[budgetLevel])

  return totalBudget
}

/**
 * 生成风险识别与应对
 */
function generateRisks(strategy: Strategy, channels: ChannelMatrix): RiskItem[] {
  const allRisks: RiskItem[] = [
    {
      risk: '内容创意未达预期，用户反馈平淡',
      probability: 'medium',
      impact: 'medium',
      response: '准备多套创意方案，根据用户反馈快速调整；建立内容优化机制，定期迭代更新'
    },
    {
      risk: 'KOL合作效果不及预期，互动数据偏低',
      probability: 'medium',
      impact: 'medium',
      response: '严格筛选KOL，要求数据真实性；设置效果补偿条款；准备备选KOL资源可随时补位'
    },
    {
      risk: '负面舆情发酵，品牌声誉受损',
      probability: 'low',
      impact: 'high',
      response: '建立7×24小时舆情监测机制；制定危机公关预案；明确各等级危机的应对流程和责任人'
    },
    {
      risk: '活动执行出现问题，现场混乱或延期',
      probability: 'medium',
      impact: 'medium',
      response: '制定详细执行手册和应急预案；提前彩排演练；备用方案和备选供应商准备'
    },
    {
      risk: '预算超支，资源不足',
      probability: 'medium',
      impact: 'medium',
      response: '设置10%-15%的预算预留；建立预算预警机制；分阶段审批和投入，根据效果调整'
    },
    {
      risk: '竞品阻击，被模仿或恶意攻击',
      probability: 'low',
      impact: 'medium',
      response: '监控竞品动态，保持差异化优势；快速迭代升级，建立竞争壁垒；必要时法律维权'
    },
    {
      risk: '政策法规风险，内容违规或平台限制',
      probability: 'low',
      impact: 'high',
      response: '内容发布前严格审核；关注政策法规变化；与平台保持良好沟通，争取支持'
    },
    {
      risk: '转化效果差，ROI不达预期',
      probability: 'medium',
      impact: 'high',
      response: '转化路径持续优化；A/B测试不同方案；根据数据反馈及时调整投放策略'
    },
    {
      risk: '团队配合问题，执行效率低下',
      probability: 'medium',
      impact: 'medium',
      response: '明确分工和责任人；建立高效沟通机制；定期项目复盘，及时解决问题'
    },
    {
      risk: '外部环境变化，不可抗力因素',
      probability: 'low',
      impact: 'high',
      response: '制定多场景应急预案；保持方案灵活性；购买相关保险转移风险'
    }
  ]

  const riskCount = Math.floor(Math.random() * 2) + 5
  return randomPickMultiple(allRisks, riskCount)
}

/**
 * 生成优化建议
 */
function generateOptimizationPlan(strategy: Strategy, channels: ChannelMatrix, kpi: KPISettings): string {
  const options = [
    `建立数据驱动的优化机制，以${kpi.attributionModel}为核心评估模型，定期复盘各渠道效果，动态调整资源分配，持续提升ROI。重点关注转化率和用户留存，通过A/B测试不断优化转化路径和用户体验。`,

    `实施「测试-学习-优化」的敏捷运营模式，小步快跑快速迭代。预热期进行小规模测试，验证创意和渠道效果；引爆期根据数据快速加码优质渠道；延续期沉淀经验，形成可复用的方法论。`,

    `构建全链路数据监测体系，从曝光、互动、转化到留存进行全漏斗追踪。建立数据看板，实时监控核心指标，设置预警阈值，发现问题及时响应。每月进行深度分析，输出优化建议并落地执行。`,

    `采用精细化运营策略，对用户进行分层管理，针对不同层级用户制定差异化运营方案。注重私域流量沉淀，将公域流量转化为品牌自有资产，通过持续运营提升用户LTV和品牌忠诚度。`,

    `建立内容中台，实现内容的模块化生产和多平台适配。根据不同平台特性和用户偏好，定制化内容策略。通过数据反馈持续优化内容方向，形成内容生产的正向循环。`,

    `实施品效合一的营销策略，在品牌建设的同时注重效果转化。通过创意内容提升品牌好感度，通过精准投放促进转化，两者相辅相成，实现品牌价值和商业目标的双赢。`
  ]

  return randomPick(options)
}

/**
 * 辅助函数：格式化日期
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 辅助函数：日期增加天数
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * 辅助函数：持续时间字符串转换为天数
 */
function durationToDays(duration: string): number {
  if (duration.includes('周')) {
    const weeks = parseInt(duration)
    return weeks * 7
  } else if (duration.includes('个月')) {
    const months = parseInt(duration)
    return months * 30
  } else if (duration.includes('月')) {
    const months = parseInt(duration)
    return months * 30
  }
  return 30
}

/**
 * 主函数：生成执行方案
 * @param strategy 传播策略
 * @param channels 渠道矩阵
 * @param kpi KPI设置
 * @returns 完整的执行方案
 */
export function generateExecutionPlan(
  strategy: Strategy,
  channels: ChannelMatrix,
  kpi: KPISettings
): ExecutionPlan {
  const timeline = generateTimeline(strategy, channels, kpi)
  const resources = generateResources(strategy, channels)
  const totalBudget = generateTotalBudget(strategy, channels)
  const risks = generateRisks(strategy, channels)
  const optimizationPlan = generateOptimizationPlan(strategy, channels, kpi)

  return {
    timeline,
    resources,
    totalBudget,
    risks,
    optimizationPlan
  }
}

export { generateTimeline, generateResources, generateTotalBudget, generateRisks, generateOptimizationPlan }
