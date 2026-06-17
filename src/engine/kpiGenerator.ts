import type { BrandInfo, ChannelMatrix, KPISettings, KPIMetric } from '../types'
import { awarenessMetrics, engagementMetrics, conversionMetrics, loyaltyMetrics, attributionModels, monitoringTools, benchmarkDatas } from '../data/kpiLibraries'
import { randomPick, randomPickMultiple } from './strategyEngine'

/**
 * 根据行业获取基准数据
 */
function getIndustryBenchmark(industry: string): typeof benchmarkDatas {
  const industryLower = industry.toLowerCase()
  return benchmarkDatas.filter(b => {
    const benchIndustry = b.industry.toLowerCase()
    return industryLower.includes(benchIndustry) || benchIndustry.includes(industryLower)
  })
}

/**
 * 根据指标名称从基准数据中获取目标值
 */
function getTargetValue(metricName: string, industry: string, level: 'conservative' | 'moderate' | 'aggressive'): string {
  const benchmarks = getIndustryBenchmark(industry)
  const matched = benchmarks.find(b => b.metric === metricName)

  if (matched) {
    switch (level) {
      case 'conservative':
        return matched.average
      case 'moderate':
        return matched.good
      case 'aggressive':
        return matched.excellent
    }
  }

  return ''
}

/**
 * 智能选择认知类指标
 */
function selectAwarenessMetrics(brandInfo: BrandInfo, channels: ChannelMatrix): KPIMetric[] {
  const industry = brandInfo.industry
  const level = randomPick(['conservative', 'moderate', 'aggressive'] as const)

  const coreMetrics = [
    '曝光量',
    '触达人数',
    '品牌提及量',
    '品牌搜索量',
    '媒体报道量'
  ]

  const selectedNames = randomPickMultiple(coreMetrics, 4)
  const metrics: KPIMetric[] = []

  selectedNames.forEach(name => {
    const metric = awarenessMetrics.find(m => m.name === name)
    if (metric) {
      const target = getTargetValue(name, industry, level)
      metrics.push({
        name: metric.name,
        description: metric.description,
        target: target || '根据具体投放预算确定',
        unit: metric.unit,
        measurementMethod: metric.measurementMethod
      })
    }
  })

  if (metrics.length < 3) {
    const additional = awarenessMetrics.slice(0, 3 - metrics.length)
    additional.forEach(m => {
      metrics.push({
        name: m.name,
        description: m.description,
        target: '',
        unit: m.unit,
        measurementMethod: m.measurementMethod
      })
    })
  }

  return metrics
}

/**
 * 智能选择互动类指标
 */
function selectEngagementMetrics(brandInfo: BrandInfo, channels: ChannelMatrix): KPIMetric[] {
  const industry = brandInfo.industry
  const level = randomPick(['conservative', 'moderate', 'aggressive'] as const)

  const coreMetrics = [
    '点赞数',
    '评论数',
    '转发/分享数',
    '收藏数',
    '互动率',
    'UGC内容数',
    '完读率/完播率'
  ]

  const selectedNames = randomPickMultiple(coreMetrics, 4)
  const metrics: KPIMetric[] = []

  selectedNames.forEach(name => {
    const metric = engagementMetrics.find(m => m.name === name)
    if (metric) {
      const target = getTargetValue(name, industry, level)
      metrics.push({
        name: metric.name,
        description: metric.description,
        target: target || '根据平台和内容质量确定',
        unit: metric.unit,
        measurementMethod: metric.measurementMethod
      })
    }
  })

  if (metrics.length < 3) {
    const additional = engagementMetrics.slice(0, 3 - metrics.length)
    additional.forEach(m => {
      metrics.push({
        name: m.name,
        description: m.description,
        target: '',
        unit: m.unit,
        measurementMethod: m.measurementMethod
      })
    })
  }

  return metrics
}

/**
 * 智能选择转化类指标
 */
function selectConversionMetrics(brandInfo: BrandInfo, channels: ChannelMatrix): KPIMetric[] {
  const industry = brandInfo.industry
  const level = randomPick(['conservative', 'moderate', 'aggressive'] as const)

  const industryLower = industry.toLowerCase()
  let coreMetrics: string[]

  if (industryLower.includes('电商') || industryLower.includes('快消') || industryLower.includes('零售')) {
    coreMetrics = [
      '点击量',
      '点击率（CTR）',
      '网站访问量',
      '转化率（CVR）',
      '订单量',
      '成交金额（GMV）',
      '客单价',
      '投入产出比（ROI）',
      '加购数'
    ]
  } else if (industryLower.includes('企业服务') || industryLower.includes('b2b') || industryLower.includes('教育')) {
    coreMetrics = [
      '点击量',
      '网站访问量',
      '独立访客数（UV）',
      '注册/留资数',
      '转化率（CVR）',
      '获客成本（CAC）',
      '线索转化率'
    ]
  } else {
    coreMetrics = [
      '点击量',
      '点击率（CTR）',
      '新增粉丝数',
      '转化率（CVR）',
      '获客成本（CAC）',
      '投入产出比（ROI）'
    ]
  }

  const selectedNames = randomPickMultiple(coreMetrics, 4)
  const metrics: KPIMetric[] = []

  selectedNames.forEach(name => {
    const metric = conversionMetrics.find(m => m.name === name)
    if (metric) {
      const target = getTargetValue(name, industry, level)
      metrics.push({
        name: metric.name,
        description: metric.description,
        target: target || '根据行业基准和目标确定',
        unit: metric.unit,
        measurementMethod: metric.measurementMethod
      })
    }
  })

  if (metrics.length < 3) {
    const additional = conversionMetrics.slice(0, 3 - metrics.length)
    additional.forEach(m => {
      metrics.push({
        name: m.name,
        description: m.description,
        target: '',
        unit: m.unit,
        measurementMethod: m.measurementMethod
      })
    })
  }

  return metrics
}

/**
 * 智能选择忠诚类指标
 */
function selectLoyaltyMetrics(brandInfo: BrandInfo, channels: ChannelMatrix): KPIMetric[] {
  const industry = brandInfo.industry
  const level = randomPick(['conservative', 'moderate', 'aggressive'] as const)

  const industryLower = industry.toLowerCase()
  let coreMetrics: string[]

  if (industryLower.includes('电商') || industryLower.includes('快消') || industryLower.includes('零售')) {
    coreMetrics = [
      '复购率',
      '用户留存率',
      '客户终身价值（LTV）',
      '会员活跃度',
      'NPS净推荐值',
      '流失率'
    ]
  } else if (industryLower.includes('服务') || industryLower.includes('订阅')) {
    coreMetrics = [
      '用户留存率',
      '30日留存率',
      '会员活跃度',
      'NPS净推荐值',
      '用户满意度',
      '流失率'
    ]
  } else {
    coreMetrics = [
      '复购率',
      '用户留存率',
      'NPS净推荐值',
      '品牌好感度',
      '用户满意度'
    ]
  }

  const selectedNames = randomPickMultiple(coreMetrics, 3)
  const metrics: KPIMetric[] = []

  selectedNames.forEach(name => {
    const metric = loyaltyMetrics.find(m => m.name === name)
    if (metric) {
      const target = getTargetValue(name, industry, level)
      metrics.push({
        name: metric.name,
        description: metric.description,
        target: target || '根据行业平均水平确定',
        unit: metric.unit,
        measurementMethod: metric.measurementMethod
      })
    }
  })

  return metrics
}

/**
 * 推荐归因模型
 */
function recommendAttributionModel(brandInfo: BrandInfo, channels: ChannelMatrix): string {
  const industry = brandInfo.industry
  const industryLower = industry.toLowerCase()

  let recommendedModel: string

  if (industryLower.includes('快消') || industryLower.includes('电商') || industryLower.includes('零售')) {
    const models = ['时间衰减归因', '末次点击归因', 'U型归因（位置归因）']
    recommendedModel = randomPick(models)
  } else if (industryLower.includes('企业服务') || industryLower.includes('b2b') || industryLower.includes('教育') || industryLower.includes('金融')) {
    const models = ['W型归因', 'U型归因（位置归因）', '线性归因']
    recommendedModel = randomPick(models)
  } else if (industryLower.includes('品牌') || industryLower.includes('奢侈品') || industryLower.includes('高端')) {
    const models = ['首次点击归因', 'U型归因（位置归因）', '线性归因']
    recommendedModel = randomPick(models)
  } else {
    const models = attributionModels.map(m => m.name)
    recommendedModel = randomPick(models)
  }

  return recommendedModel
}

/**
 * 生成监测方案
 */
function generateMonitoringPlan(brandInfo: BrandInfo, channels: ChannelMatrix): {
  tools: string[]
  frequency: string
  reportingFormat: string
} {
  const industryLower = brandInfo.industry.toLowerCase()

  let recommendedTools: string[] = []

  if (channels.socialMedia && channels.socialMedia.platforms.length > 0) {
    const platformNames = channels.socialMedia.platforms.map(p => p.name)
    if (platformNames.some(p => p.includes('微信'))) {
      recommendedTools.push('微信公众平台')
    }
    if (platformNames.some(p => p.includes('抖音') || p.includes('小红书'))) {
      recommendedTools.push('千瓜数据')
    }
    recommendedTools.push('新榜/新抖/新红')
  }

  if (industryLower.includes('电商') || industryLower.includes('零售')) {
    recommendedTools.push('生意参谋/商智')
  }

  if (industryLower.includes('科技') || industryLower.includes('互联网') || industryLower.includes('企业服务')) {
    recommendedTools.push('百度统计')
  }

  if (channels.prRelations && channels.prRelations.mediaMatrix.length > 0) {
    recommendedTools.push('舆情监测工具（鹰眼/识微）')
  }

  if (recommendedTools.length < 3) {
    const allTools = monitoringTools.map(t => t.name)
    const additional = randomPickMultiple(allTools, 3 - recommendedTools.length)
    additional.forEach(t => {
      if (!recommendedTools.includes(t)) {
        recommendedTools.push(t)
      }
    })
  }

  const frequencyOptions = [
    '日常监测日更，周报汇总，月度复盘，季度战略评估',
    '实时数据监测，每日数据简报，每周深度分析，月度整体报告',
    '工作日每日监测，周末数据汇总，每周数据分析，月度战略回顾'
  ]
  const frequency = randomPick(frequencyOptions)

  const formatOptions = [
    '数据仪表盘（实时）+ 日报（摘要）+ 周报（深度）+ 月报（战略）',
    '可视化数据看板 + 自动化数据报表 + 定期分析会议',
    'Excel数据报表 + PPT分析报告 + 数据可视化大屏'
  ]
  const reportingFormat = randomPick(formatOptions)

  return {
    tools: recommendedTools,
    frequency,
    reportingFormat
  }
}

/**
 * 主函数：生成KPI设置
 * @param brandInfo 品牌信息
 * @param channels 渠道矩阵
 * @returns 完整的KPI设置
 */
export function generateKPISettings(brandInfo: BrandInfo, channels: ChannelMatrix): KPISettings {
  const awarenessMetrics = selectAwarenessMetrics(brandInfo, channels)
  const engagementMetrics = selectEngagementMetrics(brandInfo, channels)
  const conversionMetrics = selectConversionMetrics(brandInfo, channels)
  const loyaltyMetrics = selectLoyaltyMetrics(brandInfo, channels)
  const attributionModel = recommendAttributionModel(brandInfo, channels)
  const monitoringPlan = generateMonitoringPlan(brandInfo, channels)

  return {
    awarenessMetrics,
    engagementMetrics,
    conversionMetrics,
    loyaltyMetrics,
    attributionModel,
    monitoringPlan
  }
}

export { awarenessMetrics as awarenessLibrary, engagementMetrics as engagementLibrary, conversionMetrics as conversionLibrary, loyaltyMetrics as loyaltyLibrary, attributionModels, monitoringTools }
