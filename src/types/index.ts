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
}
