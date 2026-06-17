import type {
  BrandInfo,
  TargetAudience,
  HotTopic,
  HotTopicRecommendation,
  HotTopicRecommendationResult,
  LeverageAngle,
  ContentFormatSuggestion,
  HeatCycleEstimate,
  SocialPlatform,
  Strategy,
} from '../types'
import { hotTopicsPool, platformInfoList } from '../data/hotTopicsPool'
import { generateId, formatDateTime } from '../utils/helpers'

const INDUSTRY_CATEGORY_MAP: Record<string, string[]> = {
  '美妆': ['美妆护肤', '时尚穿搭'],
  '美妆护肤': ['美妆护肤', '时尚穿搭'],
  '护肤': ['美妆护肤', '时尚穿搭'],
  '时尚': ['时尚穿搭', '美妆护肤', '生活方式'],
  '服装': ['时尚穿搭', '生活方式'],
  '服饰': ['时尚穿搭', '生活方式'],
  '食品': ['美食餐饮', '运动健康', '电商促销'],
  '餐饮': ['美食餐饮', '生活方式'],
  '快消': ['美食餐饮', '美妆护肤', '电商促销', '运动健康'],
  '快消品': ['美食餐饮', '美妆护肤', '电商促销', '运动健康'],
  '3C': ['科技数码', '游戏动漫'],
  '数码': ['科技数码', '游戏动漫'],
  '科技': ['科技数码', '投资理财', '社会民生'],
  '电子产品': ['科技数码', '游戏动漫'],
  '教育': ['社会民生', '投资理财'],
  '培训': ['社会民生'],
  '金融': ['投资理财', '社会民生'],
  '理财': ['投资理财'],
  '医疗': ['运动健康', '社会民生'],
  '健康': ['运动健康', '美妆护肤'],
  '保健品': ['运动健康'],
  '家居': ['家居生活', '生活方式'],
  '家具': ['家居生活'],
  '家电': ['家居生活', '科技数码'],
  '文旅': ['文旅出行', '生活方式'],
  '旅游': ['文旅出行', '生活方式'],
  '出行': ['文旅出行'],
  '酒店': ['文旅出行'],
  '运动': ['运动健康', '时尚穿搭'],
  '健身': ['运动健康'],
  '母婴': ['美妆护肤', '家居生活', '社会民生'],
  '宠物': ['萌宠动物', '生活方式'],
  '游戏': ['游戏动漫', '科技数码'],
  '动漫': ['游戏动漫'],
  '电商': ['电商促销', '生活方式'],
  '零售': ['电商促销', '生活方式'],
  '全行业': ['电商促销', '生活方式', '社会民生'],
}

const TONE_ANGLE_MAP: Record<string, string[]> = {
  '专业': ['专业解读角度', '行业洞察角度'],
  '专业的': ['专业解读角度', '行业洞察角度'],
  '可信赖': ['权威背书角度', '数据实证角度'],
  '可信赖的': ['权威背书角度', '数据实证角度'],
  '温暖': ['情感共鸣角度', '生活场景角度'],
  '温暖的': ['情感共鸣角度', '生活场景角度'],
  '亲民': ['用户体验角度', '趣味互动角度'],
  '亲民的': ['用户体验角度', '趣味互动角度'],
  '年轻': ['潮流趋势角度', '趣味互动角度'],
  '年轻的': ['潮流趋势角度', '趣味互动角度'],
  '时尚': ['潮流趋势角度', '生活方式角度'],
  '时尚的': ['潮流趋势角度', '生活方式角度'],
  '高端': ['品质生活角度', '价值主张角度'],
  '高端的': ['品质生活角度', '价值主张角度'],
  '科技感': ['黑科技角度', '创新思维角度'],
  '科技感的': ['黑科技角度', '创新思维角度'],
  '文艺': ['故事叙事角度', '情感共鸣角度'],
  '文艺的': ['故事叙事角度', '情感共鸣角度'],
  '真诚': ['真实分享角度', '情感共鸣角度'],
  '真诚的': ['真实分享角度', '情感共鸣角度'],
  '个性': ['反差萌角度', '态度表达角度'],
  '个性的': ['反差萌角度', '态度表达角度'],
  '极简': ['生活方式角度', '品质生活角度'],
  '极简的': ['生活方式角度', '品质生活角度'],
  '大胆': ['态度表达角度', '话题讨论角度'],
  '大胆的': ['态度表达角度', '话题讨论角度'],
  '创新': ['创新思维角度', '黑科技角度'],
  '创新的': ['创新思维角度', '黑科技角度'],
  '严谨': ['专业解读角度', '数据实证角度'],
  '严谨的': ['专业解读角度', '数据实证角度'],
  '高效': ['效率提升角度', '解决方案角度'],
  '高效的': ['效率提升角度', '解决方案角度'],
  '可靠': ['权威背书角度', '真实分享角度'],
  '可靠的': ['权威背书角度', '真实分享角度'],
}

const PLATFORM_CONTENT_PRIORITY: Record<SocialPlatform, Array<ContentFormatSuggestion['formatType']>> = {
  weibo: ['shortPost', 'shortVideo', 'imageSet', 'interactive', 'longArticle'],
  douyin: ['shortVideo', 'liveStream', 'interactive', 'imageSet', 'shortPost'],
  xiaohongshu: ['imageSet', 'shortVideo', 'longArticle', 'shortPost', 'interactive'],
  zhihu: ['longArticle', 'shortPost', 'longVideo', 'interactive', 'imageSet'],
  bilibili: ['longVideo', 'shortVideo', 'longArticle', 'interactive', 'liveStream'],
}

function calculateIndustryRelevance(industry: string, topicCategory: string): number {
  const industryLower = industry.toLowerCase()
  let bestMatch = 0

  for (const [key, categories] of Object.entries(INDUSTRY_CATEGORY_MAP)) {
    if (industryLower.includes(key.toLowerCase()) || key.toLowerCase().includes(industryLower)) {
      if (categories.includes(topicCategory)) {
        bestMatch = Math.max(bestMatch, 0.95)
      } else {
        bestMatch = Math.max(bestMatch, 0.3)
      }
    }
  }

  if (bestMatch === 0) {
    bestMatch = 0.2 + Math.random() * 0.2
  }

  return Math.min(1, bestMatch)
}

function calculateKeywordOverlap(brandInfo: BrandInfo, topic: HotTopic): number {
  const brandTerms = [
    brandInfo.brandName,
    brandInfo.industry,
    brandInfo.brandTone,
    brandInfo.positionStatement,
    ...(brandInfo.coreValues || []),
  ].filter(Boolean).map(t => t.toLowerCase())

  const topicTerms = [
    topic.title,
    topic.summary,
    topic.category,
    ...topic.tags,
    ...topic.keyKeywords,
  ].map(t => t.toLowerCase())

  let matchCount = 0
  for (const brandTerm of brandTerms) {
    for (const topicTerm of topicTerms) {
      if (topicTerm.includes(brandTerm) || brandTerm.includes(topicTerm)) {
        matchCount++
        break
      }
    }
  }

  const baseScore = matchCount / Math.max(brandTerms.length, 1)
  return Math.min(1, baseScore * 1.5 + 0.2)
}

function calculateAudienceOverlap(targetAudience: TargetAudience, topic: HotTopic): number {
  let score = 0

  const topicAge = topic.audienceDemographics.ageRange
  const userAge = targetAudience.demographics.ageRange
  if (topicAge && userAge) {
    const extractNums = (s: string) => s.match(/\d+/g)?.map(Number) || []
    const topicNums = extractNums(topicAge)
    const userNums = extractNums(userAge)
    if (topicNums.length >= 2 && userNums.length >= 2) {
      const overlapStart = Math.max(topicNums[0], userNums[0])
      const overlapEnd = Math.min(topicNums[1], userNums[1])
      const overlap = Math.max(0, overlapEnd - overlapStart)
      const totalRange = Math.min(topicNums[1] - topicNums[0], userNums[1] - userNums[0])
      score += totalRange > 0 ? (overlap / totalRange) * 0.4 : 0.1
    } else {
      score += 0.2
    }
  } else {
    score += 0.15
  }

  const userInterests = (targetAudience.interests || []).map(i => i.toLowerCase())
  const topicTags = topic.tags.map(t => t.toLowerCase())
  const topicKeywords = topic.keyKeywords.map(k => k.toLowerCase())
  let interestMatch = 0
  for (const interest of userInterests) {
    if (topicTags.some(tag => tag.includes(interest) || interest.includes(tag)) ||
        topicKeywords.some(kw => kw.includes(interest) || interest.includes(kw))) {
      interestMatch++
    }
  }
  score += Math.min(0.35, (interestMatch / Math.max(userInterests.length, 1)) * 0.5)

  const userMediaHabits = (targetAudience.mediaHabits || []).map(h => h.toLowerCase())
  const platformNameMap: Record<SocialPlatform, string[]> = {
    weibo: ['微博', 'weibo', '热搜'],
    douyin: ['抖音', 'douyin', '短视频'],
    xiaohongshu: ['小红书', 'xiaohongshu', '种草', '笔记'],
    zhihu: ['知乎', 'zhihu', '问答'],
    bilibili: ['b站', 'bilibili', '哔哩哔哩', '弹幕'],
  }
  const platformKeywords = platformNameMap[topic.platform] || []
  let mediaMatch = 0
  for (const habit of userMediaHabits) {
    if (platformKeywords.some(kw => habit.includes(kw.toLowerCase()))) {
      mediaMatch++
    }
  }
  score += Math.min(0.25, (mediaMatch / Math.max(userMediaHabits.length, 1)) * 0.4)

  return Math.min(1, score + 0.1)
}

function generateLeverageAngles(
  brandInfo: BrandInfo,
  topic: HotTopic,
  strategy: Strategy | undefined
): LeverageAngle[] {
  const angles: LeverageAngle[] = []
  const tone = brandInfo.brandTone || ''
  const coreValue = brandInfo.coreValues?.[0] || '品质'
  const strategyIdea = strategy?.coreIdea || ''

  const angleTemplates = [
    {
      id: 'angle-1',
      title: '场景植入角度',
      description: `将${brandInfo.brandName || '品牌'}产品/服务自然融入「${topic.title}」的典型场景中，让用户在热点场景中感知品牌价值。`,
      difficulty: 'easy' as const,
      riskLevel: 'low' as const,
      exampleHook: `当「${topic.title}」遇上${brandInfo.brandName || '品牌'}，原来可以这样！`,
      keyTalkingPoints: [
        `在${topic.title}的场景中展示产品使用方式`,
        `突出${coreValue}带来的体验提升`,
        `结合热点话题标签增加曝光`,
      ],
    },
    {
      id: 'angle-2',
      title: '观点态度角度',
      description: `基于品牌调性，针对「${topic.title}」话题发表独特观点或态度，引发讨论和认同。`,
      difficulty: 'medium' as const,
      riskLevel: 'medium' as const,
      exampleHook: `关于「${topic.title}」，${brandInfo.brandName || '我们'}想说...`,
      keyTalkingPoints: [
        `从${coreValue}理念出发发表观点`,
        `呼应${tone}的品牌调性`,
        `鼓励用户参与讨论，形成UGC`,
      ],
    },
    {
      id: 'angle-3',
      title: '知识科普角度',
      description: `结合「${topic.title}」话题，输出专业知识和实用技巧，建立品牌专业形象。`,
      difficulty: 'medium' as const,
      riskLevel: 'low' as const,
      exampleHook: `${topic.title}火了，但你知道背后的这些知识吗？`,
      keyTalkingPoints: [
        `拆解与${topic.category}相关的专业知识`,
        `植入产品/服务的专业优势`,
        `提供可操作的实用建议`,
      ],
    },
    {
      id: 'angle-4',
      title: '用户故事角度',
      description: `征集或讲述用户在「${topic.title}」背景下与品牌相关的真实故事，引发情感共鸣。`,
      difficulty: 'hard' as const,
      riskLevel: 'low' as const,
      exampleHook: `因为「${topic.title}」，他们与${brandInfo.brandName || '我们'}的故事开始了...`,
      keyTalkingPoints: [
        `征集用户真实故事或案例`,
        `突出用户使用产品后的真实改变`,
        `结合${topic.title}话题增强代入感`,
      ],
    },
    {
      id: 'angle-5',
      title: '趣味挑战角度',
      description: `基于「${topic.title}」发起品牌专属挑战或互动玩法，激发用户参与和传播。`,
      difficulty: 'medium' as const,
      riskLevel: 'medium' as const,
      exampleHook: `#${brandInfo.brandName || '品牌'}${topic.tags[0] || '挑战'}# 敢不敢来战？`,
      keyTalkingPoints: [
        `设计简单易参与的挑战规则`,
        `设置激励机制促使用户UGC`,
        `品牌官方带头示范降低门槛`,
      ],
    },
  ]

  const toneLower = tone.toLowerCase()
  let prioritizedAngles = [...angleTemplates]
  for (const [toneKey, angleNames] of Object.entries(TONE_ANGLE_MAP)) {
    if (toneLower.includes(toneKey.toLowerCase())) {
      prioritizedAngles.sort((a, b) => {
        const aMatch = angleNames.some(name => a.title.includes(name.slice(0, 2))) ? -1 : 0
        const bMatch = angleNames.some(name => b.title.includes(name.slice(0, 2))) ? -1 : 0
        return aMatch - bMatch
      })
      break
    }
  }

  const selectedAngles = prioritizedAngles.slice(0, 3 + Math.floor(Math.random() * 2))

  return selectedAngles.map((angle, index) => {
    const fitLevels: Array<LeverageAngle['fitLevel']> = ['perfect', 'high', 'high', 'medium', 'medium']
    if (strategyIdea) {
      angle.description += ` 可结合传播策略「${strategyIdea.slice(0, 20)}...」深化表达。`
    }
    return {
      ...angle,
      id: `${topic.id}-${angle.id}`,
      fitLevel: fitLevels[index] || 'medium',
    }
  })
}

function generateContentSuggestions(
  topic: HotTopic,
  brandInfo: BrandInfo
): ContentFormatSuggestion[] {
  const suggestions: ContentFormatSuggestion[] = []
  const priorityFormats = PLATFORM_CONTENT_PRIORITY[topic.platform] || []
  const brandName = brandInfo.brandName || '品牌'

  const formatConfigMap: Record<ContentFormatSuggestion['formatType'], {
    name: string
    estimate: string
    example: string
    practices: string[]
  }> = {
    shortVideo: {
      name: '短视频',
      estimate: '1-3天',
      example: `15秒${topic.title}话题视频｜${brandName}带你解锁新玩法`,
      practices: ['前3秒黄金钩子抓住注意力', '配热门BGM增强传播性', '结尾引导互动点赞评论', '竖屏9:16最佳观看比例'],
    },
    longVideo: {
      name: '长视频/纪录片',
      estimate: '5-10天',
      example: `深度解读「${topic.title}」｜${brandName}视角下的观察`,
      practices: ['深度内容要有明确叙事结构', '加入专业数据或采访增强可信度', '分段式剪辑保持观看兴趣', '横屏16:9适合B站等平台'],
    },
    longArticle: {
      name: '深度长文/图文',
      estimate: '3-5天',
      example: `${topic.title}现象深度分析｜${brandName}行业观察`,
      practices: ['标题要有信息量和吸引力', '分段落小标题提升可读性', '配图和数据图表增强说服力', '文末引导互动和讨论'],
    },
    shortPost: {
      name: '短文案/话题帖',
      estimate: '半天-1天',
      example: `#${topic.tags[0] || topic.title}# ${brandName}觉得...你们怎么看？`,
      practices: ['话题标签放在开头或结尾', '字数控制在140字以内最佳', '问句结尾引导评论', '配图提升点击率30%以上'],
    },
    imageSet: {
      name: '图集/九宫格',
      estimate: '1-2天',
      example: `${topic.title}｜${brandName}的${topic.category.slice(0, 2)}灵感清单`,
      practices: ['统一视觉风格保持品牌感', '首图要有足够吸引力', '第3/6/9张设置惊喜点', '每张图配简短文字说明'],
    },
    liveStream: {
      name: '直播/连麦',
      estimate: '3-7天筹备',
      example: `「${topic.title}」专题直播｜${brandName}和你聊一聊`,
      practices: ['提前3天预告直播时间', '准备直播脚本和互动环节', '邀请KOL或专家连麦增加热度', '直播中植入产品不生硬'],
    },
    interactive: {
      name: '互动玩法/投票',
      estimate: '1-3天',
      example: `${topic.title}你选A还是B？｜${brandName}投票挑战`,
      practices: ['选项设计要有争议性', '结合抽奖激励参与', '结果公布制造二次传播', '评论区置顶品牌观点'],
    },
  }

  priorityFormats.forEach((formatType, index) => {
    const config = formatConfigMap[formatType]
    if (!config) return

    const baseSuitability = 1 - index * 0.15
    const categoryBoost = calculateIndustryRelevance(brandInfo.industry, topic.category)
    const suitability = Math.round(Math.min(0.98, (baseSuitability * 0.7 + categoryBoost * 0.3)) * 100) / 100

    const engagementLevels: Array<ContentFormatSuggestion['engagementPotential']> = ['veryHigh', 'high', 'high', 'medium', 'medium', 'low']

    suggestions.push({
      format: config.name,
      formatType,
      platform: topic.platform,
      suitability,
      productionTimeEstimate: config.estimate,
      engagementPotential: engagementLevels[index] || 'medium',
      example: config.example,
      bestPractices: config.practices,
    })
  })

  return suggestions.slice(0, 4)
}

function calculateHeatCycle(topic: HotTopic): HeatCycleEstimate {
  const now = new Date()
  const startedAt = new Date(topic.startedAt)
  const hoursSinceStart = (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60)
  const progress = hoursSinceStart / topic.estimatedLifecycleHours

  let currentPhase: HeatCycleEstimate['currentPhase']
  let urgencyLevel: HeatCycleEstimate['urgencyLevel']

  if (progress < 0.2) {
    currentPhase = 'rising'
    urgencyLevel = 'high'
  } else if (progress < 0.45) {
    currentPhase = 'peak'
    urgencyLevel = 'critical'
  } else if (progress < 0.7) {
    currentPhase = 'declining'
    urgencyLevel = 'medium'
  } else {
    currentPhase = 'cooling'
    urgencyLevel = 'low'
  }

  const peakTime = new Date(startedAt.getTime() + (topic.peakDurationHours * 0.5) * 3600 * 1000)
  const goldenStart = new Date(startedAt.getTime() + Math.max(0, hoursSinceStart - 1) * 3600 * 1000)
  const goldenEnd = new Date(startedAt.getTime() + Math.min(topic.estimatedLifecycleHours * 0.5, hoursSinceStart + topic.peakDurationHours) * 3600 * 1000)
  const remainingHours = Math.max(0, topic.estimatedLifecycleHours - hoursSinceStart)

  const phaseExplainMap: Record<HeatCycleEstimate['currentPhase'], string> = {
    rising: `话题正在快速升温，距离热度峰值还有约${Math.round(topic.peakDurationHours * 0.5)}小时，此时切入可搭乘上升期流量红利。`,
    peak: `话题正处于热度爆发期！建议立即行动，黄金窗口期约${Math.round(topic.peakDurationHours)}小时，错过即进入衰退期。`,
    declining: `话题热度已过峰值，目前在缓慢下降中，剩余曝光量约为峰值的${Math.round((1 - progress) * 100)}%，适合低成本的长尾内容布局。`,
    cooling: `话题已进入冷却期，热度剩余不足20%，建议谨慎评估投入产出比，除非内容极具差异化否则不建议追。`,
  }

  return {
    currentPhase,
    peakTime: formatDateTime(peakTime),
    goldenWindowStart: formatDateTime(goldenStart),
    goldenWindowEnd: formatDateTime(goldenEnd),
    remainingHours: Math.round(remainingHours),
    urgencyLevel,
    explanation: phaseExplainMap[currentPhase],
  }
}

function getPriorityLevel(overallScore: number): HotTopicRecommendation['priorityLevel'] {
  if (overallScore >= 0.85) return 's-tier'
  if (overallScore >= 0.7) return 'a-tier'
  if (overallScore >= 0.55) return 'b-tier'
  return 'c-tier'
}

function generateAudienceMatch(
  targetAudience: TargetAudience,
  topic: HotTopic
): string[] {
  const matches: string[] = []
  const topicDemo = topic.audienceDemographics

  if (targetAudience.demographics.ageRange && topicDemo.ageRange) {
    matches.push(`年龄层高度匹配：目标人群${targetAudience.demographics.ageRange} ↔ 话题受众${topicDemo.ageRange}`)
  }

  if (targetAudience.demographics.location && topicDemo.coreCities.length > 0) {
    const cityOverlap = topicDemo.coreCities.filter(city =>
      targetAudience.demographics.location?.includes(city)
    )
    if (cityOverlap.length > 0) {
      matches.push(`核心城市重合：${cityOverlap.join('、')}`)
    } else {
      matches.push(`话题核心城市覆盖：${topicDemo.coreCities.slice(0, 3).join('、')}等`)
    }
  }

  const interestOverlap = (targetAudience.interests || []).filter(interest =>
    topic.tags.some(tag => tag.includes(interest) || interest.includes(tag)) ||
    topic.keyKeywords.some(kw => kw.includes(interest) || interest.includes(kw))
  )
  if (interestOverlap.length > 0) {
    matches.push(`兴趣标签契合：${interestOverlap.join('、')}`)
  }

  if (matches.length === 0) {
    matches.push(`话题受众规模可观，可拓展品牌触达范围`)
  }

  return matches.slice(0, 3)
}

function generateBrandValueAlignment(
  brandInfo: BrandInfo,
  topic: HotTopic
): string[] {
  const alignments: string[] = []
  const coreValues = brandInfo.coreValues || []

  if (topic.sentimentScore >= 0.8) {
    alignments.push(`话题正向情感强烈（${Math.round(topic.sentimentScore * 100)}%），与品牌${coreValues[0] || '正面'}形象契合`)
  } else if (topic.sentimentScore >= 0.6) {
    alignments.push(`话题整体情感偏正面，适合品牌软性植入`)
  }

  if (topic.brandSafetyScore >= 0.9) {
    alignments.push(`品牌安全系数高（${Math.round(topic.brandSafetyScore * 100)}分），低舆情风险`)
  }

  if (coreValues.length > 0 && topic.tags.length > 0) {
    alignments.push(`${coreValues[0]}的品牌理念可在${topic.category}话题中自然传递`)
  }

  return alignments.slice(0, 3)
}

function generateCautions(topic: HotTopic): string[] {
  const cautions: string[] = []

  if (topic.sentimentScore < 0.6) {
    cautions.push('话题存在一定负面情绪争议，品牌发声需谨慎评估立场')
  }

  if (topic.heatLevel === 'explosive' || topic.heatLevel === 'boiling') {
    cautions.push('顶级热点竞争激烈，建议差异化切入避免同质化')
  }

  if (topic.estimatedLifecycleHours < 48) {
    cautions.push('话题生命周期较短，需快速响应，建议提前备好多版本内容')
  }

  if (topic.category === '社会民生' || topic.category === '投资理财') {
    cautions.push('敏感类话题需严格审核内容，避免触碰监管红线')
  }

  if (cautions.length === 0) {
    cautions.push('整体风险可控，仍需避免过度营销和硬广植入')
  }

  return cautions
}

function generateCTASuggestions(
  topic: HotTopic,
  brandInfo: BrandInfo
): string[] {
  const brandName = brandInfo.brandName || '品牌'
  return [
    `评论区互动：带话题tag+${brandName}关键词回复评论`,
    `转化引导：「点击主页了解更多${topic.category.slice(0, 2)}好物」`,
    `UGC激励：发起「我与${topic.tags[0] || topic.title}的故事」征集活动`,
  ]
}

export interface HotTopicGenerationOptions {
  platforms?: SocialPlatform[]
  maxRecommendations?: number
  minBrandSafetyScore?: number
  includeDecliningTopics?: boolean
}

export function generateHotTopicRecommendations(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience,
  strategy?: Strategy,
  options?: HotTopicGenerationOptions
): HotTopicRecommendationResult {
  const platforms = options?.platforms || ['weibo', 'douyin', 'xiaohongshu', 'zhihu', 'bilibili']
  const maxRecs = options?.maxRecommendations || 6
  const minSafety = options?.minBrandSafetyScore || 0.75
  const includeDeclining = options?.includeDecliningTopics ?? true

  let candidates = hotTopicsPool.filter(topic =>
    platforms.includes(topic.platform) &&
    topic.brandSafetyScore >= minSafety
  )

  const recommendations: HotTopicRecommendation[] = candidates.map(topic => {
    const industryRelevance = calculateIndustryRelevance(brandInfo.industry, topic.category)
    const keywordOverlap = calculateKeywordOverlap(brandInfo, topic)
    const brandRelevance = (industryRelevance * 0.5 + keywordOverlap * 0.5)

    const audienceOverlap = calculateAudienceOverlap(targetAudience, topic)

    const heatFactor = Math.min(1, topic.heatIndex / 8000000)
    const safetyFactor = topic.brandSafetyScore
    const sentimentFactor = topic.sentimentScore

    const overallFit = Math.round((
      brandRelevance * 0.35 +
      audienceOverlap * 0.3 +
      heatFactor * 0.15 +
      safetyFactor * 0.12 +
      sentimentFactor * 0.08
    ) * 100) / 100

    const heatCycle = calculateHeatCycle(topic)

    if (!includeDeclining && (heatCycle.currentPhase === 'cooling')) {
      return null
    }

    return {
      id: generateId(),
      topic,
      brandRelevanceScore: Math.round(brandRelevance * 100) / 100,
      audienceOverlapScore: Math.round(audienceOverlap * 100) / 100,
      overallFitScore: overallFit,
      priorityLevel: getPriorityLevel(overallFit),
      leverageAngles: generateLeverageAngles(brandInfo, topic, strategy),
      contentSuggestions: generateContentSuggestions(topic, brandInfo),
      heatCycle,
      targetAudienceMatch: generateAudienceMatch(targetAudience, topic),
      brandValueAlignment: generateBrandValueAlignment(brandInfo, topic),
      cautions: generateCautions(topic),
      callToActionSuggestions: generateCTASuggestions(topic, brandInfo),
    } as HotTopicRecommendation
  }).filter(Boolean) as HotTopicRecommendation[]

  recommendations.sort((a, b) => b.overallFitScore - a.overallFitScore)

  const topRecommendations = recommendations.slice(0, maxRecs)

  const categorySet = new Set<string>()
  topRecommendations.forEach(rec => categorySet.add(rec.topic.category))
  const trendingCategories = Array.from(categorySet)

  const marketInsights = [
    `当前${platforms.map(p => platformInfoList.find(pi => pi.id === p)?.name).filter(Boolean).join('、')}平台共监测到${candidates.length}个有效热点话题`,
    `「${topRecommendations[0]?.topic.category || '综合'}」类话题表现最为突出，建议重点关注`,
    `品牌${brandInfo.industry}行业与${trendingCategories.slice(0, 2).join('、')}类话题关联度较高，可优先布局`,
    `建议建立24小时热点响应机制，S/A级话题需在黄金窗口期内快速产出内容`,
  ]

  const generalGuidelines = [
    '热点借势三原则：快（速度）、准（关联）、巧（角度）',
    '内容植入要自然，避免硬广式营销引发用户反感',
    '每个热点建议准备A/B两套内容方案，降低风险',
    '热点内容需经过法务/品牌审核，规避舆情风险',
    '建立热点效果追踪机制，复盘数据优化下次借势策略',
  ]

  return {
    id: generateId(),
    generatedAt: formatDateTime(new Date()),
    monitoredPlatforms: platforms,
    totalTopicsScanned: candidates.length,
    recommendations: topRecommendations,
    trendingCategories,
    marketInsights,
    generalGuidelines,
  }
}

export { calculateIndustryRelevance, calculateKeywordOverlap, calculateAudienceOverlap, calculateHeatCycle }
