import type { BrandInfo, TargetAudience, Strategy } from '../types'
import { brandTones, coreValues } from '../data/brandTemplates'

/**
 * 创意框架类型定义
 */
export type CreativeFramework =
  | 'pain-solution-proof'
  | 'emotional-resonance'
  | 'lifestyle-advocate'
  | 'problem-solving'
  | 'value-proposition'
  | 'storytelling'
  | 'contrast-differentiation'
  | 'scenario-immersion'

/**
 * 创意框架配置
 */
export interface FrameworkConfig {
  id: CreativeFramework
  name: string
  description: string
  coreLogic: string
  suitableIndustries: string[]
  suitableTones: string[]
  ideaTemplates: string[]
  themeTemplates: string[]
  messageTemplates: string[]
}

/**
 * 内置创意框架库
 */
export const creativeFrameworks: FrameworkConfig[] = [
  {
    id: 'pain-solution-proof',
    name: '痛点-方案-证明',
    description: '直击用户痛点，提出解决方案，用证据支撑',
    coreLogic: '痛点放大 → 方案呈现 → 信任背书',
    suitableIndustries: ['科技', '医疗', '金融', '教育', '企业服务'],
    suitableTones: ['专业的', '可信赖的', '科技感的', '严谨的'],
    ideaTemplates: [
      '告别{痛点}，{品牌}用{核心优势}重新定义{品类}',
      '还在为{痛点}烦恼？{品牌}带来{解决方案}，让{美好结果}触手可及',
      '{痛点}的终极解决方案：{品牌}以{核心技术/方法}，实现{突破性成果}',
      '终结{痛点}时代，{品牌}用{创新方式}，让{用户收益}成为可能'
    ],
    themeTemplates: [
      '解决{痛点}，{品牌}在行',
      '{痛点}终结者：{品牌}的{核心优势}之道',
      '从{痛点}到{美好结果}，{品牌}如何做到？'
    ],
    messageTemplates: [
      '直击{痛点}根源，{品牌}以{核心优势}提供系统化解决方案',
      '数据说话：{品牌}帮助{用户数量}用户解决了{痛点}问题',
      '用户真实反馈：使用{品牌}后，{痛点}改善率达到{数据比例}',
      '三大核心技术/优势，让{痛点}不再是问题'
    ]
  },
  {
    id: 'emotional-resonance',
    name: '情感共鸣',
    description: '触动用户情感，建立深度情感连接',
    coreLogic: '情感唤醒 → 品牌共情 → 情感归属',
    suitableIndustries: ['快消', '母婴', '家居', '公益', '文旅'],
    suitableTones: ['温暖的', '亲民的', '文艺的', '真诚的'],
    ideaTemplates: [
      '懂你的{情感/状态}，{品牌}用{方式}温暖每一个{人群身份}',
      '每一个{情感瞬间}，都有{品牌}陪伴在身边',
      '{品牌}：不只是{产品/服务}，更是{情感价值}',
      '致每一位{人群身份}：{品牌}懂你的{情感诉求}'
    ],
    themeTemplates: [
      '{品牌}，懂你的{情感关键词}',
      '因为{情感价值}，所以{品牌}',
      '{品牌}：让{情感关键词}发生'
    ],
    messageTemplates: [
      '在{生活场景}里，{品牌}是你最温暖的陪伴',
      '我们相信，{情感价值}是最珍贵的力量',
      '每一份{产品/服务}，都承载着{品牌}的温度与用心',
      '与{用户数量}用户一起，感受{品牌}带来的{情感体验}'
    ]
  },
  {
    id: 'lifestyle-advocate',
    name: '生活方式倡导者',
    description: '品牌代表一种生活态度和生活方式',
    coreLogic: '生活态度 → 价值认同 → 品牌象征',
    suitableIndustries: ['时尚', '美妆', '家居', '运动', '文创'],
    suitableTones: ['时尚的', '高端的', '年轻的', '个性的', '极简的'],
    ideaTemplates: [
      '{生活态度}的生活方式，{品牌}与你共同诠释',
      '不只是{产品/服务}，更是{生活理念}的生活态度',
      '{品牌}：{生活态度}生活方式的定义者',
      '选择{品牌}，选择{生活理念}的生活方式'
    ],
    themeTemplates: [
      '{品牌}，{生活态度}生活方式',
      '生活本该{生活态度}，{品牌}与你同行',
      '{品牌}式生活：{生活理念}'
    ],
    messageTemplates: [
      '真正的{生活态度}，藏在每一个细节里',
      '{品牌}相信，好的{产品/服务}应该成为生活的一部分',
      '与{品牌}一起，把日子过成想要的样子',
      '全球{用户数量}用户的共同选择：{生活态度}生活方式'
    ]
  },
  {
    id: 'problem-solving',
    name: '问题解决型',
    description: '聚焦具体问题，提供清晰可行的解决方案',
    coreLogic: '问题定义 → 路径拆解 → 方案落地',
    suitableIndustries: ['企业服务', '教育', '金融', '科技', '医疗'],
    suitableTones: ['专业的', '严谨的', '可靠的', '高效的'],
    ideaTemplates: [
      '{具体问题}怎么破？{品牌}用{方法论}给出答案',
      '三步解决{具体问题}，{品牌}的{解决方案}了解一下',
      '面对{具体问题}，{品牌}有一套完整的解决方案',
      '{具体问题}的{数量}大痛点，{品牌}一次性解决'
    ],
    themeTemplates: [
      '{品牌}：{具体问题}解决专家',
      '搞定{具体问题}，有{品牌}就够了',
      '{具体问题}？{品牌}有办法'
    ],
    messageTemplates: [
      '经过{数量}年深耕，{品牌}形成了独特的{方法论}',
      '我们的解决方案已帮助{用户数量}企业/个人解决了{具体问题}',
      '{步骤数量}步落地法，让{具体问题}不再是难题',
      '专业团队+成熟方法论，为您的{目标}保驾护航'
    ]
  },
  {
    id: 'value-proposition',
    name: '价值主张型',
    description: '清晰传达品牌独特价值和核心优势',
    coreLogic: '价值定位 → 差异化优势 → 利益承诺',
    suitableIndustries: ['全行业适用'],
    suitableTones: ['专业的', '高端的', '可靠的', '科技感的'],
    ideaTemplates: [
      '{品牌}：{核心价值}的{品类}领导者',
      '为什么选择{品牌}？因为{核心差异化优势}',
      '{品牌}重新定义{品类}：{核心价值}才是关键',
      '不只是{品类}，更是{核心价值}的承诺'
    ],
    themeTemplates: [
      '{核心价值}，就是{品牌}',
      '{品牌}：{核心价值}的代名词',
      '选择{品牌}，选择{核心价值}'
    ],
    messageTemplates: [
      '坚持{核心价值}年，{品牌}始终如一',
      '从{起点}到{成就}，{品牌}用{核心价值}赢得{用户数量}用户信赖',
      '三大核心优势，奠定{品牌}的{核心价值}地位',
      '我们相信，{核心价值}是{品类}的根本'
    ]
  },
  {
    id: 'storytelling',
    name: '故事叙事型',
    description: '通过品牌故事或用户故事传递品牌理念',
    coreLogic: '故事引入 → 情感共鸣 → 品牌融入',
    suitableIndustries: ['文创', '时尚', '美妆', '食品', '公益'],
    suitableTones: ['文艺的', '温暖的', '真诚的', '高端的'],
    ideaTemplates: [
      '从{起点故事}到{今天成就}，{品牌}的{关键词}之路',
      '一个关于{主题}的故事：{品牌}的诞生与坚持',
      '{品牌}背后的故事：{核心价值}的力量',
      '他们的故事，也是{品牌}的故事'
    ],
    themeTemplates: [
      '{品牌}的故事：{主题关键词}',
      '每个{产品/服务}背后，都有一个故事',
      '听{品牌}讲一个关于{主题}的故事'
    ],
    messageTemplates: [
      '品牌创始于{年份}，源于一个{动机}的想法',
      '多年来，我们只做一件事：{品牌使命}',
      '用户故事：{典型用户场景}中，{品牌}如何改变了什么',
      '每一个细节的背后，都是{品牌}对{核心价值}的坚持'
    ]
  },
  {
    id: 'contrast-differentiation',
    name: '对比反差型',
    description: '通过与传统/竞品的对比，凸显品牌差异化',
    coreLogic: '传统痛点 → 对比差异 → 品牌优势',
    suitableIndustries: ['科技', '互联网', '创新品牌', '颠覆型产品'],
    suitableTones: ['大胆的', '科技感的', '年轻的', '创新的'],
    ideaTemplates: [
      '当别人还在{传统做法}，{品牌}已经{创新做法}',
      '告别{传统方式}，{品牌}带你进入{新时代}',
      '{传统做法} vs {创新做法}：{品牌}如何重新定义{品类}',
      '你还在{传统方式}？{品牌}已经{突破性成果}'
    ],
    themeTemplates: [
      '不一样的{品类}：{品牌}',
      '{品牌}：重新定义{品类}',
      '这才是{品类}该有的样子'
    ],
    messageTemplates: [
      '不同于传统{品类}，{品牌}从根本上重新思考产品',
      '别人做加法，我们做减法；别人追求{传统目标}，我们追求{创新目标}',
      '三大差异化优势，让{品牌}脱颖而出',
      '为什么说{品牌}是{品类}的革命者？答案在这里'
    ]
  },
  {
    id: 'scenario-immersion',
    name: '场景沉浸型',
    description: '将产品/服务融入具体生活场景，让用户产生代入感',
    coreLogic: '场景构建 → 需求唤起 → 产品融入',
    suitableIndustries: ['快消', '家居', '食品', '美妆', '本地生活'],
    suitableTones: ['亲民的', '温暖的', '年轻的', '生活方式'],
    ideaTemplates: [
      '{具体场景}中，{品牌}是你最贴心的伙伴',
      '无论是{场景1}还是{场景2}，{品牌}都懂你',
      '{场景}里的小确幸，{品牌}为你创造',
      '一天{数量}个场景，{品牌}陪伴你的每一刻'
    ],
    themeTemplates: [
      '{品牌}，每个{场景关键词}的好伙伴',
      '生活的每个瞬间，都有{品牌}',
      '{场景关键词}，从{品牌}开始'
    ],
    messageTemplates: [
      '清晨的{场景}，{品牌}开启美好的一天',
      '忙碌的{场景}，{品牌}让一切变得简单',
      '周末的{场景}，{品牌}陪你享受慢时光',
      '{数量}个生活场景，{品牌}全方位融入你的生活'
    ]
  }
]

/**
 * 随机工具：从数组中随机选择一个元素
 */
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 随机工具：从数组中随机选择指定数量的不重复元素
 */
function randomPickMultiple<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/**
 * 根据品牌调性匹配创意框架
 */
function matchFrameworksByTone(brandTone: string): FrameworkConfig[] {
  const toneLower = brandTone.toLowerCase()
  return creativeFrameworks.filter(fw =>
    fw.suitableTones.some(tone => toneLower.includes(tone) || tone.includes(toneLower))
  )
}

/**
 * 根据行业匹配创意框架
 */
function matchFrameworksByIndustry(industry: string): FrameworkConfig[] {
  return creativeFrameworks.filter(fw =>
    fw.suitableIndustries.some(ind => industry.includes(ind) || ind.includes(industry))
  )
}

/**
 * 智能选择创意框架
 */
function selectCreativeFramework(brandInfo: BrandInfo, targetAudience: TargetAudience): FrameworkConfig {
  const toneMatches = matchFrameworksByTone(brandInfo.brandTone)
  const industryMatches = matchFrameworksByIndustry(brandInfo.industry)

  const matchedSet = new Set([...toneMatches, ...industryMatches])
  const matchedFrameworks = Array.from(matchedSet)

  if (matchedFrameworks.length === 0) {
    return randomPick(creativeFrameworks)
  }

  const hasPainPoints = targetAudience.painPoints && targetAudience.painPoints.length > 0
  const hasMotivations = targetAudience.motivations && targetAudience.motivations.length > 0

  let weightedFrameworks = [...matchedFrameworks]

  if (hasPainPoints) {
    const painFramework = creativeFrameworks.find(fw => fw.id === 'pain-solution-proof')
    if (painFramework) {
      weightedFrameworks.push(painFramework, painFramework)
    }
  }

  if (hasMotivations) {
    const emotionFramework = creativeFrameworks.find(fw => fw.id === 'emotional-resonance')
    if (emotionFramework) {
      weightedFrameworks.push(emotionFramework)
    }
  }

  return randomPick(weightedFrameworks)
}

/**
 * 提取品牌核心关键词
 */
function extractBrandKeywords(brandInfo: BrandInfo): {
  brandName: string
  coreValue: string
  coreAdvantage: string
  industry: string
} {
  const coreValue = brandInfo.coreValues?.[0] || '卓越品质'
  const coreAdvantage = brandInfo.coreValues?.[1] || coreValue

  return {
    brandName: brandInfo.brandName,
    coreValue,
    coreAdvantage,
    industry: brandInfo.industry
  }
}

/**
 * 提取人群关键词
 */
function extractAudienceKeywords(targetAudience: TargetAudience): {
  audienceName: string
  painPoint: string
  motivation: string
  identity: string
  lifeScene: string
} {
  const painPoint = targetAudience.painPoints || '生活中的小困扰'
  const motivation = targetAudience.motivations || '追求更好的生活'

  const identities = targetAudience.demographics.occupation || '都市人群'
  const identity = Array.isArray(identities) ? identities[0] : identities

  const lifeScenes = [
    '日常工作',
    '周末休闲',
    '朋友聚会',
    '家庭时光',
    '独处时刻',
    '通勤路上'
  ]
  const lifeScene = randomPick(lifeScenes)

  return {
    audienceName: targetAudience.name,
    painPoint,
    motivation,
    identity,
    lifeScene
  }
}

/**
 * 模板替换：将模板中的占位符替换为实际内容
 */
function fillTemplate(
  template: string,
  brandKeywords: ReturnType<typeof extractBrandKeywords>,
  audienceKeywords: ReturnType<typeof extractAudienceKeywords>
): string {
  const replacements: Record<string, string> = {
    '{品牌}': brandKeywords.brandName,
    '{品牌名称}': brandKeywords.brandName,
    '{核心价值}': brandKeywords.coreValue,
    '{核心优势}': brandKeywords.coreAdvantage,
    '{核心技术/方法}': brandKeywords.coreAdvantage,
    '{品类}': brandKeywords.industry.split('-').pop() || '产品',
    '{品类/产品}': brandKeywords.industry.split('-').pop() || '产品',
    '{痛点}': audienceKeywords.painPoint,
    '{痛点问题}': audienceKeywords.painPoint,
    '{解决方案}': brandKeywords.coreAdvantage,
    '{美好结果}': audienceKeywords.motivation,
    '{突破性成果}': audienceKeywords.motivation,
    '{用户收益}': audienceKeywords.motivation,
    '{情感/状态}': audienceKeywords.motivation,
    '{情感瞬间}': audienceKeywords.lifeScene,
    '{情感价值}': brandKeywords.coreValue,
    '{情感关键词}': brandKeywords.coreValue,
    '{情感体验}': audienceKeywords.motivation,
    '{情感诉求}': audienceKeywords.motivation,
    '{人群身份}': audienceKeywords.identity,
    '{产品/服务}': brandKeywords.industry.split('-').pop() || '产品',
    '{生活态度}': brandKeywords.coreValue,
    '{生活理念}': brandKeywords.coreValue,
    '{具体问题}': audienceKeywords.painPoint,
    '{方法论}': brandKeywords.coreValue + '方法论',
    '{步骤数量}': String(Math.floor(Math.random() * 3) + 3),
    '{数量}': String(Math.floor(Math.random() * 9) + 3),
    '{用户数量}': Math.floor(Math.random() * 900 + 100) + '万',
    '{数据比例}': Math.floor(Math.random() * 30 + 60) + '%',
    '{起点故事}': '一个小小的梦想',
    '{今天成就}': '行业领先地位',
    '{关键词}': brandKeywords.coreValue,
    '{核心差异化优势}': brandKeywords.coreAdvantage,
    '{传统做法}': '传统方式',
    '{创新做法}': '创新方式',
    '{传统方式}': '传统模式',
    '{新时代}': '全新时代',
    '{传统目标}': '表面功夫',
    '{创新目标}': '本质突破',
    '{具体场景}': audienceKeywords.lifeScene,
    '{场景1}': '工作日清晨',
    '{场景2}': '周末午后',
    '{场景}': audienceKeywords.lifeScene,
    '{场景关键词}': audienceKeywords.lifeScene,
    '{生活场景}': audienceKeywords.lifeScene,
    '{年份}': String(2015 + Math.floor(Math.random() * 8)),
    '{品牌使命}': '让' + audienceKeywords.motivation + '触手可及',
    '{典型用户场景}': audienceKeywords.lifeScene,
    '{起点}': '一张办公桌',
    '{成就}': '百万用户信赖',
    '{主题}': '坚持与热爱',
    '{主题关键词}': brandKeywords.coreValue,
    '{动机}': '改变行业的'
  }

  let result = template
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value)
  }

  return result
}

/**
 * 生成核心创意概念
 */
function generateCoreIdea(
  framework: FrameworkConfig,
  brandKeywords: ReturnType<typeof extractBrandKeywords>,
  audienceKeywords: ReturnType<typeof extractAudienceKeywords>
): string {
  const template = randomPick(framework.ideaTemplates)
  return fillTemplate(template, brandKeywords, audienceKeywords)
}

/**
 * 生成传播主题
 */
function generateCampaignTheme(
  framework: FrameworkConfig,
  brandKeywords: ReturnType<typeof extractBrandKeywords>,
  audienceKeywords: ReturnType<typeof extractAudienceKeywords>
): string {
  const template = randomPick(framework.themeTemplates)
  let theme = fillTemplate(template, brandKeywords, audienceKeywords)

  const modifiers = [
    '',
    '· 全新出发',
    '· 焕新升级',
    '· 与你同行',
    '· 不止所见',
    '· 从心出发'
  ]
  const modifier = randomPick(modifiers)
  theme += modifier

  return theme
}

/**
 * 生成关键信息
 */
function generateKeyMessages(
  framework: FrameworkConfig,
  brandKeywords: ReturnType<typeof extractBrandKeywords>,
  audienceKeywords: ReturnType<typeof extractAudienceKeywords>
): string[] {
  const count = Math.floor(Math.random() * 2) + 3
  const templates = randomPickMultiple(framework.messageTemplates, count)
  return templates.map(t => fillTemplate(t, brandKeywords, audienceKeywords))
}

/**
 * 生成策略版本（多版本创意）
 */
function generateStrategyVersions(
  brandKeywords: ReturnType<typeof extractBrandKeywords>,
  audienceKeywords: ReturnType<typeof extractAudienceKeywords>
): Array<{ id: string; name: string; coreIdea: string }> {
  const versions: Array<{ id: string; name: string; coreIdea: string }> = []
  const allFrameworks = randomPickMultiple(creativeFrameworks, 3)
  const versionNames = ['情感版', '功能版', '故事版', '潮流版', '品质版', '简约版']

  allFrameworks.forEach((fw, index) => {
    const idea = generateCoreIdea(fw, brandKeywords, audienceKeywords)

    versions.push({
      id: `v${index + 1}`,
      name: versionNames[index % versionNames.length] + ' - ' + fw.name + '方向',
      coreIdea: idea
    })
  })

  return versions
}

/**
 * 主函数：生成传播策略
 * @param brandInfo 品牌信息
 * @param targetAudience 目标人群画像
 * @returns 完整的传播策略
 */
export function generateStrategy(brandInfo: BrandInfo, targetAudience: TargetAudience): Strategy {
  const framework = selectCreativeFramework(brandInfo, targetAudience)
  const brandKeywords = extractBrandKeywords(brandInfo)
  const audienceKeywords = extractAudienceKeywords(targetAudience)

  const coreIdea = generateCoreIdea(framework, brandKeywords, audienceKeywords)
  const campaignTheme = generateCampaignTheme(framework, brandKeywords, audienceKeywords)
  const keyMessages = generateKeyMessages(framework, brandKeywords, audienceKeywords)
  const versions = generateStrategyVersions(brandKeywords, audienceKeywords)

  return {
    coreIdea,
    campaignTheme,
    keyMessages,
    strategyFramework: framework.name,
    versions
  }
}

/**
 * 导出所有创意框架
 */
export { creativeFrameworks as frameworks }

/**
 * 导出工具函数（供其他引擎使用）
 */
export { randomPick, randomPickMultiple, fillTemplate }
