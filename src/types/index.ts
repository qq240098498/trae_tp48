/**
 * 项目/方案基本信息
 */
export interface Project {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'completed' | 'archived'
}

/**
 * 品牌信息
 */
export interface BrandInfo {
  brandName: string
  industry: string
  coreValues: string[]
  brandTone: string
  positionStatement: string
  competitors: Array<{
    name: string
    advantage: string
    weakness: string
  }>
}

/**
 * 目标人群画像
 */
export interface TargetAudience {
  name: string
  demographics: {
    ageRange: string
    gender: string
    location: string
    income: string
    education: string
    occupation: string
  }
  behaviors: string[]
  interests: string[]
  mediaHabits: string[]
  painPoints: string
  motivations: string
}

/**
 * 传播策略
 */
export interface Strategy {
  coreIdea: string
  campaignTheme: string
  keyMessages: string[]
  strategyFramework: string
  versions?: Array<{
    id: string
    name: string
    coreIdea: string
  }>
}

/**
 * 渠道内容
 */
export interface ChannelContent {
  objectives: string[]
  contentTypes: string[]
  examples: string[]
  frequency: string
  tone: string
}

/**
 * 社交媒体渠道
 */
export interface SocialMediaChannel {
  platforms: Array<{
    name: string
    contentTypes: string[]
    postingFrequency: string
  }>
  contentStrategy: string
  communityManagement: string
  advertisingPlan: string
}

/**
 * KOL营销
 */
export interface KOLMarketing {
  kolTiers: Array<{
    tier: string
    description: string
    quantity: number
    budgetRatio: string
  }>
  cooperationTypes: string[]
  contentDirection: string
  selectionCriteria: string
}

/**
 * 线下活动
 */
export interface OfflineEvents {
  eventTypes: string[]
  scale: string
  venueSuggestions: string
  onsiteActivities: string
  expectedAttendance: string
}

/**
 * PR公关
 */
export interface PRRelations {
  mediaMatrix: string[]
  contentPlan: string[]
  publishingRhythm: string
  crisisPlan: string
}

/**
 * 渠道矩阵
 */
export interface ChannelMatrix {
  socialMedia: SocialMediaChannel
  kolMarketing: KOLMarketing
  offlineEvents: OfflineEvents
  prRelations: PRRelations
}

/**
 * KPI指标
 */
export interface KPIMetric {
  name: string
  description: string
  target: string
  unit: string
  measurementMethod: string
}

/**
 * KPI设置
 */
export interface KPISettings {
  awarenessMetrics: KPIMetric[]
  engagementMetrics: KPIMetric[]
  conversionMetrics: KPIMetric[]
  loyaltyMetrics?: KPIMetric[]
  attributionModel: string
  monitoringPlan: {
    tools: string[]
    frequency: string
    reportingFormat: string
  }
}

/**
 * 时间阶段
 */
export interface TimelinePhase {
  name: string
  duration: string
  startDate: string
  endDate: string
  keyActivities: string[]
  deliverables: string[]
}

/**
 * 资源项
 */
export interface ResourceItem {
  category: string
  item: string
  quantity: string
  budget: string
  responsible: string
}

/**
 * 风险项
 */
export interface RiskItem {
  risk: string
  probability: 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  response: string
}

/**
 * 执行方案
 */
export interface ExecutionPlan {
  timeline: TimelinePhase[]
  resources: ResourceItem[]
  totalBudget: string
  risks: RiskItem[]
  optimizationPlan: string
}

/**
 * A/B测试变量类型
 */
export type ABTestVariableType = 'title' | 'heroImage' | 'ctaButton' | 'description' | 'price'

/**
 * A/B测试变体
 */
export interface ABTestVariant {
  id: string
  name: string
  variableType: ABTestVariableType
  content: string
  description?: string
  isControl?: boolean
}

/**
 * A/B测试变量组
 */
export interface ABTestVariableGroup {
  id: string
  type: ABTestVariableType
  name: string
  description: string
  variants: ABTestVariant[]
}

/**
 * 样本量计算结果
 */
export interface SampleSizeCalculation {
  baselineConversionRate: number
  minimumDetectableEffect: number
  confidenceLevel: number
  statisticalPower: number
  requiredSampleSizePerVariant: number
  totalRequiredSampleSize: number
  explanation: string
}

/**
 * 分流配置
 */
export interface TrafficSplitConfig {
  controlGroup: number
  testGroups: Array<{
    variantId: string
    percentage: number
  }>
  totalPercentage: number
}

/**
 * 判定标准
 */
export interface ABTestCriteria {
  primaryMetric: string
  confidenceLevel: number
  minimumLift: number
  statisticalPower: number
  winningCondition: string
  stoppingRules: string[]
}

/**
 * A/B测试方案
 */
export interface ABTestPlan {
  id: string
  name: string
  description: string
  status: 'draft' | 'running' | 'completed' | 'paused'
  materialType: string
  hypothesis: string
  variableGroups: ABTestVariableGroup[]
  sampleSize: SampleSizeCalculation
  trafficSplit: TrafficSplitConfig
  criteria: ABTestCriteria
  expectedDuration: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * 数值区间（乐观/保守）
 */
export interface ValueRange {
  conservative: number
  optimistic: number
  unit: string
}

/**
 * 单个渠道的ROI预估指标
 */
export interface ChannelROIEstimate {
  channelId: string
  channelName: string
  channelType: 'socialMedia' | 'kolMarketing' | 'offlineEvents' | 'prRelations'
  allocatedBudget: number
  budgetRatio: number
  impressions: ValueRange
  clicks: ValueRange
  ctr: ValueRange
  conversions: ValueRange
  cvr: ValueRange
  cac: ValueRange
  roi: ValueRange
  confidence: number
  dataSource: string[]
}

/**
 * 整体ROI预估汇总
 */
export interface ROIOverallEstimate {
  totalBudget: number
  totalImpressions: ValueRange
  totalClicks: ValueRange
  overallCTR: ValueRange
  totalConversions: ValueRange
  overallCVR: ValueRange
  overallCAC: ValueRange
  overallROI: ValueRange
  channelBreakdown: ChannelROIEstimate[]
}

/**
 * 历史投放基准数据
 */
export interface HistoricalBenchmark {
  id: string
  industry: string
  channelType: string
  channelName: string
  audienceSegment: string
  sampleSize: number
  avgImpressionsPerYuan: number
  stdImpressionsPerYuan: number
  avgCTR: number
  stdCTR: number
  avgCVR: number
  stdCVR: number
  avgCAC: number
  stdCAC: number
  avgROI: number
  stdROI: number
  dataTimestamp: string
  notes?: string
}

/**
 * 渠道预算分配方案
 */
export interface ChannelBudgetAllocation {
  channelId: string
  channelName: string
  channelType: 'socialMedia' | 'kolMarketing' | 'offlineEvents' | 'prRelations'
  budget: number
}

/**
 * ROI预估输入参数
 */
export interface ROIEstimationParams {
  industry: string
  totalBudget: number
  budgetAllocations: ChannelBudgetAllocation[]
  audienceTags: string[]
  historicalConfidenceLevel?: 'high' | 'medium' | 'low'
}

/**
 * ROI预估结果
 */
export interface ROIEstimationResult {
  id: string
  params: ROIEstimationParams
  estimate: ROIOverallEstimate
  assumptions: string[]
  limitations: string[]
  generatedAt: string
  dataPointsCount: number
}

/**
 * 社媒平台类型
 */
export type SocialPlatform = 'weibo' | 'douyin' | 'xiaohongshu' | 'zhihu' | 'bilibili'

/**
 * 热点话题
 */
export interface HotTopic {
  id: string
  title: string
  platform: SocialPlatform
  platformRank: number
  heatIndex: number
  heatLevel: 'explosive' | 'boiling' | 'hot' | 'warm' | 'rising'
  category: string
  tags: string[]
  summary: string
  keyKeywords: string[]
  audienceDemographics: {
    ageRange: string
    genderRatio: string
    coreCities: string[]
  }
  startedAt: string
  peakDurationHours: number
  estimatedLifecycleHours: number
  sentimentScore: number
  brandSafetyScore: number
  contentExamples: string[]
}

/**
 * 切入角度建议
 */
export interface LeverageAngle {
  id: string
  title: string
  description: string
  fitLevel: 'perfect' | 'high' | 'medium' | 'low'
  difficulty: 'easy' | 'medium' | 'hard'
  riskLevel: 'low' | 'medium' | 'high'
  exampleHook: string
  keyTalkingPoints: string[]
}

/**
 * 内容形式推荐
 */
export interface ContentFormatSuggestion {
  format: string
  formatType: 'shortVideo' | 'longVideo' | 'longArticle' | 'shortPost' | 'imageSet' | 'liveStream' | 'interactive'
  platform: SocialPlatform
  suitability: number
  productionTimeEstimate: string
  engagementPotential: 'veryHigh' | 'high' | 'medium' | 'low'
  example: string
  bestPractices: string[]
}

/**
 * 热度预估周期
 */
export interface HeatCycleEstimate {
  currentPhase: 'rising' | 'peak' | 'declining' | 'cooling'
  peakTime: string
  goldenWindowStart: string
  goldenWindowEnd: string
  remainingHours: number
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low'
  explanation: string
}

/**
 * 单个热点的借势推荐方案
 */
export interface HotTopicRecommendation {
  id: string
  topic: HotTopic
  brandRelevanceScore: number
  audienceOverlapScore: number
  overallFitScore: number
  priorityLevel: 's-tier' | 'a-tier' | 'b-tier' | 'c-tier'
  leverageAngles: LeverageAngle[]
  contentSuggestions: ContentFormatSuggestion[]
  heatCycle: HeatCycleEstimate
  targetAudienceMatch: string[]
  brandValueAlignment: string[]
  cautions: string[]
  callToActionSuggestions: string[]
}

/**
 * 热点借势推荐结果集
 */
export interface HotTopicRecommendationResult {
  id: string
  generatedAt: string
  monitoredPlatforms: SocialPlatform[]
  totalTopicsScanned: number
  recommendations: HotTopicRecommendation[]
  trendingCategories: string[]
  marketInsights: string[]
  generalGuidelines: string[]
}

/**
 * 完整营销方案
 */
export interface MarketingPlan {
  project: Project
  brandInfo: BrandInfo
  targetAudience: TargetAudience
  strategy: Strategy
  channelMatrix: ChannelMatrix
  kpiSettings: KPISettings
  executionPlan: ExecutionPlan
  abTestPlans?: ABTestPlan[]
  roiEstimation?: ROIEstimationResult
  hotTopicRecommendations?: HotTopicRecommendationResult
}
