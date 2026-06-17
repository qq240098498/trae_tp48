import type {
  ABTestPlan,
  ABTestVariant,
  ABTestVariableGroup,
  ABTestVariableType,
  SampleSizeCalculation,
  TrafficSplitConfig,
  ABTestCriteria,
  BrandInfo,
  TargetAudience,
  Strategy,
} from '../types'
import { generateId, randomPick, randomSample } from '../utils/helpers'

interface TitleTemplate {
  template: string
  style: string
  tone: string
}

interface HeroImageConcept {
  id: string
  name: string
  description: string
  visualStyle: string
  mood: string
}

interface CTAButtonVariant {
  text: string
  style: string
  urgency: string
}

const titleTemplatesByTone: Record<string, TitleTemplate[]> = {
  '专业的': [
    { template: '专业{品类}解决方案：{核心价值}之选', style: '专业权威', tone: '专业的' },
    { template: '{品牌}·{核心价值}·值得信赖', style: '品牌背书', tone: '专业的' },
    { template: '行业领先的{品类}，来自{品牌}', style: '行业地位', tone: '专业的' },
  ],
  '温暖的': [
    { template: '懂你的{品类}，温暖每一刻', style: '情感共鸣', tone: '温暖的' },
    { template: '{品牌}，陪你走过{生活场景}', style: '陪伴感', tone: '温暖的' },
    { template: '让{美好结果}触手可及', style: '利益承诺', tone: '温暖的' },
  ],
  '年轻的': [
    { template: '这就是{核心价值}！{品牌}全新出发', style: '活力宣言', tone: '年轻的' },
    { template: '不只是{品类}，更是{生活态度}', style: '生活方式', tone: '年轻的' },
    { template: '{品牌}·敢不一样', style: '个性主张', tone: '年轻的' },
  ],
  '科技感的': [
    { template: '重新定义{品类}：{核心技术}的力量', style: '技术驱动', tone: '科技感的' },
    { template: '{品牌}黑科技，让{美好结果}成为可能', style: '创新突破', tone: '科技感的' },
    { template: '下一代{品类}，已来', style: '未来感', tone: '科技感的' },
  ],
  '高端的': [
    { template: '尊享{核心价值}，{品牌}品质之选', style: '尊贵感', tone: '高端的' },
    { template: '{品牌}·{核心价值}的艺术', style: '艺术感', tone: '高端的' },
    { template: '为懂得品质的你，{品牌}', style: '甄选感', tone: '高端的' },
  ],
  '亲民的': [
    { template: '人人都爱的{品类}，{品牌}懂你', style: '亲和力', tone: '亲民的' },
    { template: '好品质，不用贵', style: '性价比', tone: '亲民的' },
    { template: '{品牌}，你身边的{品类}专家', style: '邻家感', tone: '亲民的' },
  ],
}

const heroImageConcepts: HeroImageConcept[] = [
  { id: 'product-focus', name: '产品聚焦', description: '产品为主角，清晰展示产品外观和细节', visualStyle: '干净简约', mood: '专业可信' },
  { id: 'lifestyle', name: '生活场景', description: '产品融入真实生活场景，引发用户代入感', visualStyle: '生活化', mood: '温暖亲切' },
  { id: 'problem-solution', name: '问题解决', description: '前后对比，展现产品带来的改变', visualStyle: '对比强烈', mood: '激励人心' },
  { id: 'emotional', name: '情感共鸣', description: '人物情感表达，传递品牌情感价值', visualStyle: '人文纪实', mood: '温暖感动' },
  { id: 'aspirational', name: '向往生活', description: '展现用户渴望的理想生活状态', visualStyle: '精致唯美', mood: '憧憬向往' },
  { id: 'minimalist', name: '极简美学', description: '极简构图，突出产品核心卖点', visualStyle: '极简主义', mood: '高级质感' },
]

const ctaButtonVariants: CTAButtonVariant[] = [
  { text: '立即了解', style: '标准按钮', urgency: '常规' },
  { text: '免费试用', style: '行动导向', urgency: '中等' },
  { text: '马上抢购', style: '紧迫感', urgency: '高' },
  { text: '了解更多', style: '信息导向', urgency: '低' },
  { text: '立即注册', style: '行动导向', urgency: '中等' },
  { text: '限时优惠', style: '紧迫感', urgency: '高' },
  { text: '开始体验', style: '体验导向', urgency: '中等' },
  { text: '查看详情', style: '信息导向', urgency: '低' },
]

const materialTypes = [
  { type: 'social-media-ad', name: '社交媒体广告', description: '适用于微信、微博、抖音等社交平台的投放物料' },
  { type: 'display-ad', name: '展示广告', description: '适用于网站Banner、信息流广告等展示类投放' },
  { type: 'landing-page', name: '落地页', description: '广告点击后跳转的着陆页面' },
  { type: 'email-marketing', name: '邮件营销', description: 'EDM营销邮件的主题和内容' },
  { type: 'app-store', name: '应用商店', description: 'App Store或应用商店的素材' },
]

function extractKeywords(brandInfo: BrandInfo, targetAudience: TargetAudience, strategy: Strategy) {
  const brandName = brandInfo.brandName || '品牌'
  const coreValue = brandInfo.coreValues?.[0] || '卓越品质'
  const coreAdvantage = brandInfo.coreValues?.[1] || coreValue
  const industry = brandInfo.industry || '产品'
  const category = industry.split('-').pop() || '产品'
  const painPoint = targetAudience.painPoints || '生活中的小困扰'
  const motivation = targetAudience.motivations || '追求更好的生活'
  const lifeScene = targetAudience.interests?.[0] || '日常生活'
  const coreIdea = strategy.coreIdea || ''

  return {
    brandName,
    coreValue,
    coreAdvantage,
    industry,
    category,
    painPoint,
    motivation,
    lifeScene,
    coreIdea,
  }
}

function fillTemplate(template: string, keywords: ReturnType<typeof extractKeywords>): string {
  return template
    .replace(/\{品牌\}/g, keywords.brandName)
    .replace(/\{核心价值\}/g, keywords.coreValue)
    .replace(/\{核心优势\}/g, keywords.coreAdvantage)
    .replace(/\{品类\}/g, keywords.category)
    .replace(/\{品类\/产品\}/g, keywords.category)
    .replace(/\{痛点\}/g, keywords.painPoint)
    .replace(/\{美好结果\}/g, keywords.motivation)
    .replace(/\{生活场景\}/g, keywords.lifeScene)
    .replace(/\{生活态度\}/g, keywords.coreValue)
    .replace(/\{核心技术\}/g, keywords.coreAdvantage)
}

function generateTitleVariants(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience,
  strategy: Strategy
): ABTestVariant[] {
  const keywords = extractKeywords(brandInfo, targetAudience, strategy)
  const brandTone = brandInfo.brandTone || '专业的'

  const toneKeys = Object.keys(titleTemplatesByTone)
  const matchedTone = toneKeys.find((tone) => brandTone.includes(tone) || tone.includes(brandTone))
  const templates = matchedTone
    ? titleTemplatesByTone[matchedTone]
    : titleTemplatesByTone['专业的']

  const selectedTemplates = randomSample(templates, 3)
  const variants: ABTestVariant[] = []

  selectedTemplates.forEach((template, index) => {
    variants.push({
      id: generateId(),
      name: `标题变体 ${index + 1}（${template.style}）`,
      variableType: 'title',
      content: fillTemplate(template.template, keywords),
      description: `风格：${template.style}，调性：${template.tone}`,
      isControl: index === 0,
    })
  })

  if (strategy.campaignTheme) {
    variants.unshift({
      id: generateId(),
      name: '主标题（对照组）',
      variableType: 'title',
      content: strategy.campaignTheme,
      description: '基于传播主题的官方标题，作为对照组',
      isControl: true,
    })
  }

  return variants
}

function generateHeroImageVariants(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience,
  strategy: Strategy
): ABTestVariant[] {
  const keywords = extractKeywords(brandInfo, targetAudience, strategy)
  const selectedConcepts = randomSample(heroImageConcepts, 3)

  const variants: ABTestVariant[] = selectedConcepts.map((concept, index) => ({
    id: generateId(),
    name: `首图变体 ${index + 1}（${concept.name}）`,
    variableType: 'heroImage',
    content: concept.name,
    description: `${concept.description}。视觉风格：${concept.visualStyle}，情绪基调：${concept.mood}。核心元素：${keywords.category}、${keywords.coreValue}`,
    isControl: index === 0,
  }))

  return variants
}

function generateCTAButtonVariants(): ABTestVariant[] {
  const selectedCTAs = randomSample(ctaButtonVariants, 3)

  const variants: ABTestVariant[] = selectedCTAs.map((cta, index) => ({
    id: generateId(),
    name: `CTA变体 ${index + 1}（${cta.style}）`,
    variableType: 'ctaButton',
    content: cta.text,
    description: `风格：${cta.style}，紧迫感：${cta.urgency}`,
    isControl: index === 0,
  }))

  return variants
}

function generateDescriptionVariants(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience,
  strategy: Strategy
): ABTestVariant[] {
  const keywords = extractKeywords(brandInfo, targetAudience, strategy)

  const descriptions = [
    {
      text: `${keywords.brandName}致力于为${targetAudience.demographics.occupation || '用户'}提供${keywords.coreValue}的${keywords.category}解决方案。凭借${keywords.coreAdvantage}的核心优势，帮助用户解决${keywords.painPoint}，实现${keywords.motivation}。`,
      style: '利益导向',
    },
    {
      text: `还在为${keywords.painPoint}而烦恼吗？${keywords.brandName}带来全新${keywords.category}体验，${keywords.coreAdvantage}让一切变得简单。立即体验，感受${keywords.coreValue}的力量。`,
      style: '问题解决',
    },
    {
      text: `在${keywords.lifeScene}的每一刻，${keywords.brandName}都懂你。不只是${keywords.category}，更是${keywords.coreValue}的生活态度。选择${keywords.brandName}，选择不一样的生活方式。`,
      style: '情感共鸣',
    },
  ]

  const variants: ABTestVariant[] = descriptions.map((desc, index) => ({
    id: generateId(),
    name: `描述变体 ${index + 1}（${desc.style}）`,
    variableType: 'description',
    content: desc.text,
    description: `文案风格：${desc.style}`,
    isControl: index === 0,
  }))

  return variants
}

function createVariableGroup(
  type: ABTestVariableType,
  name: string,
  description: string,
  variants: ABTestVariant[]
): ABTestVariableGroup {
  return {
    id: generateId(),
    type,
    name,
    description,
    variants,
  }
}

function calculateSampleSize(
  baselineConversionRate: number = 0.03,
  minimumDetectableEffect: number = 0.2,
  confidenceLevel: number = 0.95,
  statisticalPower: number = 0.8
): SampleSizeCalculation {
  const p1 = baselineConversionRate
  const p2 = p1 * (1 + minimumDetectableEffect)
  const pBar = (p1 + p2) / 2
  const zAlpha = confidenceLevel === 0.95 ? 1.96 : confidenceLevel === 0.9 ? 1.645 : 2.576
  const zBeta = statisticalPower === 0.8 ? 0.84 : statisticalPower === 0.9 ? 1.28 : 0.52

  const sampleSizePerVariant = Math.ceil(
    ((zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2) /
      ((p2 - p1) ** 2)
  )

  const explanation = `
    基于以下参数计算得出：
    • 基准转化率：${(baselineConversionRate * 100).toFixed(1)}%
    • 最小可检测效应：${(minimumDetectableEffect * 100).toFixed(0)}%
    • 置信水平：${(confidenceLevel * 100).toFixed(0)}%
    • 统计功效：${(statisticalPower * 100).toFixed(0)}%
    
    每个变体需要至少 ${sampleSizePerVariant.toLocaleString()} 样本，
    才能在 ${(confidenceLevel * 100).toFixed(0)}% 的置信度下，
    检测出 ${(minimumDetectableEffect * 100).toFixed(0)}% 的转化率差异。
  `.trim()

  return {
    baselineConversionRate,
    minimumDetectableEffect,
    confidenceLevel,
    statisticalPower,
    requiredSampleSizePerVariant: sampleSizePerVariant,
    totalRequiredSampleSize: sampleSizePerVariant * 3,
    explanation,
  }
}

function generateTrafficSplit(variants: ABTestVariant[]): TrafficSplitConfig {
  const testVariants = variants.filter((v) => !v.isControl)

  const controlPercentage = 50
  const remainingPercentage = 100 - controlPercentage
  const testGroupPercentage = Math.floor(remainingPercentage / testVariants.length)

  const testGroups = testVariants.map((variant) => ({
    variantId: variant.id,
    percentage: testGroupPercentage,
  }))

  return {
    controlGroup: controlPercentage,
    testGroups,
    totalPercentage: controlPercentage + testGroupPercentage * testVariants.length,
  }
}

function generateCriteria(): ABTestCriteria {
  return {
    primaryMetric: '转化率',
    confidenceLevel: 0.95,
    minimumLift: 0.02,
    statisticalPower: 0.8,
    winningCondition: '置信度95%下转化率差异≥2%为胜出',
    stoppingRules: [
      '达到预设样本量后停止测试',
      '某变体显著优于对照组（p < 0.05）时可提前结束',
      '测试运行超过2周仍无显著差异时考虑终止',
      '发现严重负面效应时立即停止测试',
    ],
  }
}

function generateHypothesis(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience,
  strategy: Strategy
): string {
  const keywords = extractKeywords(brandInfo, targetAudience, strategy)

  const hypotheses = [
    `我们认为，通过优化${keywords.category}的标题和首图展示，能够提升目标用户的点击率和转化率，因为更精准的信息传达能够更好地匹配用户需求。`,
    `我们假设，采用${keywords.coreValue}的核心信息作为主视觉，结合不同的CTA按钮文案，可以有效提升用户行动意愿，因为情感共鸣和清晰的行动号召能够降低决策门槛。`,
    `我们预测，针对${targetAudience.demographics.occupation || '目标用户'}的痛点和动机设计的物料变体，将比通用版本获得更高的参与度和转化率，因为个性化的内容更能引发用户共鸣。`,
  ]

  return randomPick(hypotheses)
}

function estimateDuration(sampleSize: SampleSizeCalculation, dailyTraffic?: number): string {
  const traffic = dailyTraffic || 1000
  const days = Math.ceil(sampleSize.totalRequiredSampleSize / traffic)

  if (days <= 7) {
    return `约 ${days} 天（按日均 ${traffic.toLocaleString()} 流量估算）`
  } else if (days <= 30) {
    const weeks = Math.ceil(days / 7)
    return `约 ${weeks} 周（按日均 ${traffic.toLocaleString()} 流量估算）`
  } else {
    const months = (days / 30).toFixed(1)
    return `约 ${months} 个月（按日均 ${traffic.toLocaleString()} 流量估算）`
  }
}

export interface ABTestGenerationOptions {
  materialType?: string
  includeVariables?: ABTestVariableType[]
  baselineConversionRate?: number
  minimumDetectableEffect?: number
  confidenceLevel?: number
  statisticalPower?: number
  dailyTraffic?: number
}

export function generateABTestPlan(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience,
  strategy: Strategy,
  options?: ABTestGenerationOptions
): ABTestPlan {
  const {
    materialType: customMaterialType,
    includeVariables = ['title', 'heroImage', 'ctaButton'],
    baselineConversionRate = 0.03,
    minimumDetectableEffect = 0.2,
    confidenceLevel = 0.95,
    statisticalPower = 0.8,
    dailyTraffic,
  } = options || {}

  const material = customMaterialType
    ? materialTypes.find((m) => m.type === customMaterialType) || materialTypes[0]
    : materialTypes[0]

  const variableGroups: ABTestVariableGroup[] = []

  if (includeVariables.includes('title')) {
    const titleVariants = generateTitleVariants(brandInfo, targetAudience, strategy)
    variableGroups.push(
      createVariableGroup('title', '标题', '主标题/广告语的不同版本，测试哪种表述更能吸引用户点击', titleVariants)
    )
  }

  if (includeVariables.includes('heroImage')) {
    const heroImageVariants = generateHeroImageVariants(brandInfo, targetAudience, strategy)
    variableGroups.push(
      createVariableGroup(
        'heroImage',
        '首图',
        '主视觉图片的不同风格和构图，测试哪种视觉更能吸引用户注意力',
        heroImageVariants
      )
    )
  }

  if (includeVariables.includes('ctaButton')) {
    const ctaVariants = generateCTAButtonVariants()
    variableGroups.push(
      createVariableGroup('ctaButton', 'CTA按钮', '行动号召按钮的不同文案和风格，测试哪种更能促使用户转化', ctaVariants)
    )
  }

  if (includeVariables.includes('description')) {
    const descVariants = generateDescriptionVariants(brandInfo, targetAudience, strategy)
    variableGroups.push(
      createVariableGroup('description', '描述文案', '产品/服务描述的不同文案风格，测试哪种更能说服用户', descVariants)
    )
  }

  const sampleSize = calculateSampleSize(
    baselineConversionRate,
    minimumDetectableEffect,
    confidenceLevel,
    statisticalPower
  )

  const allVariants = variableGroups.flatMap((g) => g.variants)
  const trafficSplit = generateTrafficSplit(allVariants.slice(0, 3))
  const criteria = generateCriteria()
  const hypothesis = generateHypothesis(brandInfo, targetAudience, strategy)
  const expectedDuration = estimateDuration(sampleSize, dailyTraffic)

  return {
    id: generateId(),
    name: `${material.name}A/B测试方案`,
    description: material.description,
    status: 'draft',
    materialType: material.type,
    hypothesis,
    variableGroups,
    sampleSize,
    trafficSplit,
    criteria,
    expectedDuration,
    notes: '本方案基于品牌信息和目标人群画像智能生成，建议根据实际业务情况进行调整。',
  }
}

export { materialTypes, heroImageConcepts, ctaButtonVariants }
export { calculateSampleSize }
