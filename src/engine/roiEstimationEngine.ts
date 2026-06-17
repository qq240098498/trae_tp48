import type {
  ROIEstimationParams,
  ROIEstimationResult,
  ROIOverallEstimate,
  ChannelROIEstimate,
  ValueRange,
  HistoricalBenchmark,
  ChannelBudgetAllocation,
} from '../types'
import { historicalBenchmarks } from '../data/historicalBenchmarks'
import { generateId, formatDateTime } from '../utils/helpers'

const CONFIDENCE_FACTOR: Record<'high' | 'medium' | 'low', number> = {
  high: 0.8,
  medium: 1.0,
  low: 1.3,
}

function createValueRange(
  avg: number,
  std: number,
  unit: string,
  confidenceFactor: number,
  isRate: boolean = false
): ValueRange {
  const conservative = isRate
    ? Math.max(0, avg - std * confidenceFactor)
    : Math.max(0, Math.round((avg - std * confidenceFactor) * 100) / 100)
  const optimistic = isRate
    ? avg + std * confidenceFactor
    : Math.round((avg + std * confidenceFactor) * 100) / 100

  return {
    conservative: isRate ? Math.round(conservative * 10000) / 10000 : conservative,
    optimistic: isRate ? Math.round(optimistic * 10000) / 10000 : optimistic,
    unit,
  }
}

function findMatchingBenchmarks(
  industry: string,
  channelType: string,
  channelName: string
): HistoricalBenchmark[] {
  const industryLower = industry.toLowerCase()

  let matches = historicalBenchmarks.filter((b) => {
    const benchIndustry = b.industry.toLowerCase()
    const matchesIndustry =
      industryLower.includes(benchIndustry) ||
      benchIndustry.includes(industryLower) ||
      benchIndustry === '全行业'
    const matchesChannelType = b.channelType === channelType
    const matchesChannelName =
      b.channelName === channelName ||
      channelName.includes(b.channelName) ||
      b.channelName.includes(channelName)

    return matchesIndustry && matchesChannelType && matchesChannelName
  })

  if (matches.length === 0) {
    matches = historicalBenchmarks.filter((b) => {
      const benchIndustry = b.industry.toLowerCase()
      const matchesIndustry =
        industryLower.includes(benchIndustry) ||
        benchIndustry.includes(industryLower) ||
        benchIndustry === '全行业'
      return matchesIndustry && b.channelType === channelType
    })
  }

  if (matches.length === 0) {
    matches = historicalBenchmarks.filter((b) => b.industry === '全行业')
  }

  return matches
}

function aggregateBenchmarks(benchmarks: HistoricalBenchmark[]): HistoricalBenchmark {
  if (benchmarks.length === 0) {
    return {
      id: 'fallback',
      industry: '全行业',
      channelType: 'socialMedia',
      channelName: '通用',
      audienceSegment: '通用',
      sampleSize: 1,
      avgImpressionsPerYuan: 15,
      stdImpressionsPerYuan: 6,
      avgCTR: 0.015,
      stdCTR: 0.006,
      avgCVR: 0.02,
      stdCVR: 0.008,
      avgCAC: 100,
      stdCAC: 40,
      avgROI: 2.5,
      stdROI: 1.0,
      dataTimestamp: new Date().toISOString().split('T')[0],
    }
  }

  const totalSampleSize = benchmarks.reduce((sum, b) => sum + b.sampleSize, 0)

  const weightedAvg = (key: keyof HistoricalBenchmark) => {
    return benchmarks.reduce((sum, b) => {
      const val = b[key] as number
      return sum + (val * b.sampleSize) / totalSampleSize
    }, 0)
  }

  const avgStd = (key: keyof HistoricalBenchmark) => {
    return benchmarks.reduce((sum, b) => {
      const val = b[key] as number
      return sum + (val * b.sampleSize) / totalSampleSize
    }, 0)
  }

  return {
    ...benchmarks[0],
    id: 'aggregated',
    sampleSize: totalSampleSize,
    avgImpressionsPerYuan: weightedAvg('avgImpressionsPerYuan'),
    stdImpressionsPerYuan: avgStd('stdImpressionsPerYuan'),
    avgCTR: weightedAvg('avgCTR'),
    stdCTR: avgStd('stdCTR'),
    avgCVR: weightedAvg('avgCVR'),
    stdCVR: avgStd('stdCVR'),
    avgCAC: weightedAvg('avgCAC'),
    stdCAC: avgStd('stdCAC'),
    avgROI: weightedAvg('avgROI'),
    stdROI: avgStd('stdROI'),
    dataTimestamp: benchmarks[0].dataTimestamp,
  }
}

function estimateChannelROI(
  allocation: ChannelBudgetAllocation,
  industry: string,
  audienceTags: string[],
  confidenceFactor: number
): ChannelROIEstimate {
  const benchmarks = findMatchingBenchmarks(industry, allocation.channelType, allocation.channelName)
  const aggregated = aggregateBenchmarks(benchmarks)

  const budget = allocation.budget

  const avgImpressions = budget * aggregated.avgImpressionsPerYuan
  const stdImpressions = budget * aggregated.stdImpressionsPerYuan

  const avgClicks = avgImpressions * aggregated.avgCTR
  const stdClicks =
    avgClicks *
    Math.sqrt(
      Math.pow(aggregated.stdImpressionsPerYuan / aggregated.avgImpressionsPerYuan, 2) +
        Math.pow(aggregated.stdCTR / aggregated.avgCTR, 2)
    )

  const avgConversions = avgClicks * aggregated.avgCVR
  const stdConversions =
    avgConversions *
    Math.sqrt(
      Math.pow(aggregated.stdCTR / aggregated.avgCTR, 2) +
        Math.pow(aggregated.stdCVR / aggregated.avgCVR, 2)
    )

  const avgCAC = budget / Math.max(avgConversions, 1)
  const stdCAC =
    avgCAC *
    Math.sqrt(
      Math.pow(aggregated.stdImpressionsPerYuan / aggregated.avgImpressionsPerYuan, 2) +
        Math.pow(aggregated.stdCTR / aggregated.avgCTR, 2) +
        Math.pow(aggregated.stdCVR / aggregated.avgCVR, 2)
    )

  return {
    channelId: allocation.channelId,
    channelName: allocation.channelName,
    channelType: allocation.channelType,
    allocatedBudget: budget,
    budgetRatio: 0,
    impressions: createValueRange(avgImpressions, stdImpressions, '次', confidenceFactor),
    clicks: createValueRange(avgClicks, stdClicks, '次', confidenceFactor),
    ctr: createValueRange(aggregated.avgCTR, aggregated.stdCTR, '%', confidenceFactor, true),
    conversions: createValueRange(avgConversions, stdConversions, '人', confidenceFactor),
    cvr: createValueRange(aggregated.avgCVR, aggregated.stdCVR, '%', confidenceFactor, true),
    cac: createValueRange(avgCAC, stdCAC, '元/人', confidenceFactor),
    roi: createValueRange(aggregated.avgROI, aggregated.stdROI, '倍', confidenceFactor),
    confidence: Math.min(1, aggregated.sampleSize / 100),
    dataSource: benchmarks.map((b) => `${b.industry}-${b.channelName}`),
  }
}

function sumValueRanges(ranges: ValueRange[]): ValueRange {
  if (ranges.length === 0) {
    return { conservative: 0, optimistic: 0, unit: '' }
  }
  return {
    conservative: ranges.reduce((sum, r) => sum + r.conservative, 0),
    optimistic: ranges.reduce((sum, r) => sum + r.optimistic, 0),
    unit: ranges[0].unit,
  }
}

function weightedAverageRanges(ranges: ValueRange[], weights: number[]): ValueRange {
  if (ranges.length === 0) {
    return { conservative: 0, optimistic: 0, unit: '倍' }
  }
  const totalWeight = weights.reduce((sum, w) => sum + w, 0) || 1
  let conservative = 0
  let optimistic = 0
  ranges.forEach((r, i) => {
    conservative += r.conservative * weights[i]
    optimistic += r.optimistic * weights[i]
  })
  return {
    conservative: Math.round((conservative / totalWeight) * 100) / 100,
    optimistic: Math.round((optimistic / totalWeight) * 100) / 100,
    unit: ranges[0].unit,
  }
}

export function estimateROI(params: ROIEstimationParams): ROIEstimationResult {
  const confidenceLevel = params.historicalConfidenceLevel || 'medium'
  const confidenceFactor = CONFIDENCE_FACTOR[confidenceLevel]

  const channelBreakdown = params.budgetAllocations.map((allocation) =>
    estimateChannelROI(allocation, params.industry, params.audienceTags, confidenceFactor)
  )

  const totalBudget = params.budgetAllocations.reduce((sum, a) => sum + a.budget, 0)

  channelBreakdown.forEach((c) => {
    c.budgetRatio = totalBudget > 0 ? Math.round((c.allocatedBudget / totalBudget) * 10000) / 10000 : 0
  })

  const budgets = channelBreakdown.map((c) => c.allocatedBudget)

  const totalImpressions = sumValueRanges(channelBreakdown.map((c) => c.impressions))
  const totalClicks = sumValueRanges(channelBreakdown.map((c) => c.clicks))
  const totalConversions = sumValueRanges(channelBreakdown.map((c) => c.conversions))

  const overallCTR = {
    conservative:
      totalImpressions.optimistic > 0
        ? Math.round((totalClicks.conservative / totalImpressions.optimistic) * 10000) / 10000
        : 0,
    optimistic:
      totalImpressions.conservative > 0
        ? Math.round((totalClicks.optimistic / totalImpressions.conservative) * 10000) / 10000
        : 0,
    unit: '%',
  }

  const overallCVR = {
    conservative:
      totalClicks.optimistic > 0
        ? Math.round((totalConversions.conservative / totalClicks.optimistic) * 10000) / 10000
        : 0,
    optimistic:
      totalClicks.conservative > 0
        ? Math.round((totalConversions.optimistic / totalClicks.conservative) * 10000) / 10000
        : 0,
    unit: '%',
  }

  const overallCAC = {
    conservative:
      totalConversions.optimistic > 0
        ? Math.round((totalBudget / totalConversions.optimistic) * 100) / 100
        : 0,
    optimistic:
      totalConversions.conservative > 0
        ? Math.round((totalBudget / totalConversions.conservative) * 100) / 100
        : 0,
    unit: '元/人',
  }

  const overallROI = weightedAverageRanges(channelBreakdown.map((c) => c.roi), budgets)

  const estimate: ROIOverallEstimate = {
    totalBudget,
    totalImpressions,
    totalClicks,
    overallCTR,
    totalConversions,
    overallCVR,
    overallCAC,
    overallROI,
    channelBreakdown,
  }

  const dataPointsCount = channelBreakdown.reduce((sum, c) => sum + c.dataSource.length, 0)

  const assumptions = [
    `预估基于${dataPointsCount}组历史投放数据，涵盖${params.industry}行业同类产品投放案例`,
    `置信度设置为「${confidenceLevel === 'high' ? '高' : confidenceLevel === 'medium' ? '中' : '低'}」，区间宽度相应${confidenceLevel === 'high' ? '收窄' : confidenceLevel === 'medium' ? '适中' : '放宽'}`,
    '保守值为均值减去1个标准差 × 置信系数，乐观值为均值加上1个标准差 × 置信系数',
    '实际效果受创意质量、投放时机、市场竞争等因素影响，本预估仅供参考',
    '获客成本(CAC)和ROI假设转化率为从曝光到最终购买/留资的全链路转化',
  ]

  const limitations = [
    '历史数据不代表未来表现，市场环境变化可能导致实际效果偏离预估',
    '数据样本有限，部分细分渠道可能缺乏充足历史数据支撑',
    '预估未考虑创意内容质量、落地页体验、运营执行力等人为因素',
    '渠道间的协同效应和交叉贡献未在本模型中单独计算',
    '建议结合A/B测试和小预算试投对预估结果进行验证',
  ]

  return {
    id: generateId(),
    params,
    estimate,
    assumptions,
    limitations,
    generatedAt: formatDateTime(new Date()),
    dataPointsCount,
  }
}

export { findMatchingBenchmarks, aggregateBenchmarks, CONFIDENCE_FACTOR }
