import type { BrandInfo, TargetAudience, Strategy, ChannelMatrix, SocialMediaChannel, KOLMarketing, OfflineEvents, PRRelations } from '../types'
import { socialMediaPlatforms, kolTiers, offlineEventTypes, prMediaTypes, kolCooperationTypes } from '../data/channelConfigs'
import { randomPick, randomPickMultiple } from './strategyEngine'

/**
 * 计算品牌与社交媒体平台的匹配度
 */
function calculatePlatformMatchScore(
  platform: typeof socialMediaPlatforms[0],
  brandInfo: BrandInfo,
  targetAudience: TargetAudience
): number {
  let score = 0

  const brandToneLower = brandInfo.brandTone.toLowerCase()
  const toneMatches = platform.brandToneFit.filter(tone =>
    brandToneLower.includes(tone) || tone.includes(brandToneLower)
  )
  score += toneMatches.length * 15

  const industryLower = brandInfo.industry.toLowerCase()
  const industryMatches = platform.suitableIndustries.filter(ind =>
    industryLower.includes(ind.toLowerCase()) || ind.toLowerCase().includes(industryLower)
  )
  score += industryMatches.length * 20

  const mediaHabits = targetAudience.mediaHabits || []
  const platformName = platform.name
  const habitMatch = mediaHabits.some(habit => {
    const habitLower = habit.toLowerCase()
    return habitLower.includes(platformName.toLowerCase()) ||
      platformName.toLowerCase().includes(habitLower)
  })
  if (habitMatch) score += 25

  const interests = targetAudience.interests || []
  const platformCoreFeatures = platform.coreFeatures.join('')
  const interestMatch = interests.some(interest => {
    const interestLower = interest.toLowerCase()
    return platformCoreFeatures.toLowerCase().includes(interestLower)
  })
  if (interestMatch) score += 10

  score += Math.random() * 15

  return score
}

/**
 * 智能选择社交媒体平台
 */
function selectSocialMediaPlatforms(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience
): typeof socialMediaPlatforms {
  const scoredPlatforms = socialMediaPlatforms.map(platform => ({
    platform,
    score: calculatePlatformMatchScore(platform, brandInfo, targetAudience)
  }))

  scoredPlatforms.sort((a, b) => b.score - a.score)

  const platformCount = Math.floor(Math.random() * 3) + 3
  return scoredPlatforms.slice(0, platformCount).map(item => item.platform)
}

/**
 * 生成社交媒体渠道规划
 */
function generateSocialMediaPlan(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience,
  strategy: Strategy
): SocialMediaChannel {
  const platforms = selectSocialMediaPlatforms(brandInfo, targetAudience)

  const platformDetails = platforms.map(platform => {
    const contentCount = Math.floor(Math.random() * 2) + 2
    const contentTypes = randomPickMultiple(platform.contentTypes, contentCount)

    return {
      name: platform.name,
      contentTypes,
      postingFrequency: platform.postingFrequency
    }
  })

  const contentStrategyOptions = [
    '以' + strategy.campaignTheme + '为核心，打造多维度内容矩阵，覆盖用户兴趣点',
    '围绕' + strategy.strategyFramework + '策略框架，产出系列化优质内容，建立品牌认知',
    '结合' + brandInfo.brandTone + '品牌调性，创作有温度、有态度的内容，与用户建立情感连接',
    '深耕垂直领域内容，打造专业品牌形象，提升用户信任感',
    '以用户为中心，产出实用价值内容，助力品牌口碑传播'
  ]
  const contentStrategy = randomPick(contentStrategyOptions)

  const communityOptions = [
    '建立用户社群，定期举办互动活动，提升用户粘性和归属感',
    '积极响应用户评论和私信，建立良好的品牌口碑和用户关系',
    '打造UGC内容生态，鼓励用户创作分享，扩大品牌影响力',
    '设立粉丝专属福利，增强用户忠诚度，培养品牌种子用户'
  ]
  const communityManagement = randomPick(communityOptions)

  const advertisingOptions = [
    '采用「内容种草+流量放大」组合策略，精准触达目标人群，提升转化效率',
    '分阶段投放策略：预热期品牌曝光、引爆期流量倾斜、延续期效果收割',
    '利用平台算法推荐机制，优化内容标签，获取更多自然流量',
    '结合KOL合作与信息流广告，形成立体化传播矩阵，扩大声量'
  ]
  const advertisingPlan = randomPick(advertisingOptions)

  return {
    platforms: platformDetails,
    contentStrategy,
    communityManagement,
    advertisingPlan
  }
}

/**
 * 生成KOL营销策略
 */
function generateKOLMarketing(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience,
  strategy: Strategy
): KOLMarketing {
  const industryLower = brandInfo.industry.toLowerCase()
  const isB2B = industryLower.includes('企业服务') || industryLower.includes('b2b')
  const isLuxury = industryLower.includes('奢侈品') || industryLower.includes('高端')
  const isFMCG = industryLower.includes('快消') || industryLower.includes('零售')

  let kolTiersConfig: KOLMarketing['kolTiers']

  if (isLuxury) {
    kolTiersConfig = [
      { tier: '头部KOL', description: '品牌代言级合作，打造高端品牌形象', quantity: 2, budgetRatio: '40%' },
      { tier: '腰部KOL', description: '垂直领域深度种草，影响精准人群', quantity: 10, budgetRatio: '35%' },
      { tier: '尾部KOL', description: '圈层渗透，扩大影响力范围', quantity: 20, budgetRatio: '15%' },
      { tier: 'KOC', description: '真实口碑营造，增强品牌信任感', quantity: 50, budgetRatio: '10%' }
    ]
  } else if (isFMCG) {
    kolTiersConfig = [
      { tier: '头部KOL', description: '品牌引爆，快速提升知名度', quantity: 3, budgetRatio: '25%' },
      { tier: '腰部KOL', description: '垂直领域种草，提升转化率', quantity: 15, budgetRatio: '35%' },
      { tier: '尾部KOL', description: '铺量推广，扩大覆盖面', quantity: 30, budgetRatio: '25%' },
      { tier: 'KOC', description: '海量真实评价，打造口碑矩阵', quantity: 100, budgetRatio: '15%' }
    ]
  } else if (isB2B) {
    kolTiersConfig = [
      { tier: '头部KOL', description: '行业专家背书，建立专业权威', quantity: 2, budgetRatio: '30%' },
      { tier: '腰部KOL', description: '垂直领域深度内容，影响决策层', quantity: 8, budgetRatio: '40%' },
      { tier: '尾部KOL', description: '行业从业者分享，增强可信度', quantity: 15, budgetRatio: '20%' },
      { tier: 'KOC', description: '真实用户体验，促进口碑传播', quantity: 30, budgetRatio: '10%' }
    ]
  } else {
    kolTiersConfig = [
      { tier: '头部KOL', description: '品牌声量提升，扩大知名度', quantity: 2, budgetRatio: '30%' },
      { tier: '腰部KOL', description: '垂直种草，带动转化', quantity: 12, budgetRatio: '35%' },
      { tier: '尾部KOL', description: '圈层扩散，增加曝光', quantity: 25, budgetRatio: '20%' },
      { tier: 'KOC', description: '真实口碑，建立信任', quantity: 60, budgetRatio: '15%' }
    ]
  }

  const coopCount = Math.floor(Math.random() * 2) + 3
  const cooperationTypes = randomPickMultiple(kolCooperationTypes.map(c => c.name), coopCount)

  const contentDirectionOptions = [
    '围绕' + strategy.campaignTheme + '主题，结合KOL个人风格，创作自然不生硬的种草内容',
    '以' + strategy.coreIdea + '为核心，通过KOL真实体验分享，传递品牌价值',
    '深度产品测评+使用场景展示，让用户直观感受产品价值',
    '故事化内容创作，将品牌融入KOL的生活，实现情感共鸣'
  ]
  const contentDirection = randomPick(contentDirectionOptions)

  const selectionCriteriaOptions = [
    '优先选择与' + brandInfo.brandTone + '调性匹配的KOL，确保品牌形象统一',
    '综合考量粉丝画像、内容质量、互动数据，选择高性价比合作对象',
    '注重KOL的垂直领域影响力和粉丝忠诚度，而非单纯看粉丝量',
    '建立KOL资源库，分级管理，长期合作培养品牌代言人'
  ]
  const selectionCriteria = randomPick(selectionCriteriaOptions)

  return {
    kolTiers: kolTiersConfig,
    cooperationTypes,
    contentDirection,
    selectionCriteria
  }
}

/**
 * 生成线下活动建议
 */
function generateOfflineEvents(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience,
  strategy: Strategy
): OfflineEvents {
  const industryLower = brandInfo.industry.toLowerCase()

  let suitableEvents = offlineEventTypes.filter(event => {
    return event.suitableIndustries.some(ind =>
      industryLower.includes(ind.toLowerCase()) || ind.toLowerCase().includes(industryLower)
    )
  })

  if (suitableEvents.length === 0) {
    suitableEvents = randomPickMultiple(offlineEventTypes, 3)
  }

  const eventCount = Math.min(3, suitableEvents.length)
  const selectedEvents = randomPickMultiple(suitableEvents, eventCount)
  const eventTypes = selectedEvents.map(e => e.name)

  const scaleOptions = [
    '中型活动，覆盖精准目标人群，注重参与深度',
    '大型活动，覆盖面广，打造品牌势能',
    '小型精品活动，邀请精准用户，提升体验感',
    '多城联动，扩大地域覆盖范围'
  ]
  const scale = randomPick(scaleOptions)

  const venueOptions = [
    '选择城市核心商圈或地标性场所，提升品牌调性和曝光度',
    '结合目标人群活动轨迹，选择交通便利、人流量大的场地',
    '根据活动主题选择特色场地，增强沉浸感和记忆点',
    '线上线下联动，扩大活动影响力和覆盖范围'
  ]
  const venueSuggestions = randomPick(venueOptions)

  const onsiteOptions = [
    '设置' + strategy.campaignTheme + '主题互动区，搭配品牌打卡点，鼓励用户拍照分享',
    '产品体验区+专业讲解，让用户深度了解产品价值',
    '游戏互动+礼品赠送，提升参与感和活跃度',
    '邀请KOL到场互动，带动现场气氛和线上传播'
  ]
  const onsiteActivities = randomPick(onsiteOptions)

  const attendanceOptions = [
    '预计覆盖人数：500-2000人/场，精准邀约+自然客流',
    '预计参与人数：1000-5000人，多渠道引流推广',
    '预计到场人数：200-500人，定向邀约高质量用户',
    '预计触达人数：线上+线下超10万人次'
  ]
  const expectedAttendance = randomPick(attendanceOptions)

  return {
    eventTypes,
    scale,
    venueSuggestions,
    onsiteActivities,
    expectedAttendance
  }
}

/**
 * 生成PR公关方案
 */
function generatePRRelations(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience,
  strategy: Strategy
): PRRelations {
  const industryLower = brandInfo.industry.toLowerCase()

  let selectedMediaTypes: typeof prMediaTypes = []

  if (industryLower.includes('科技') || industryLower.includes('互联网')) {
    selectedMediaTypes = prMediaTypes.filter(m =>
      m.id === 'tech-media' || m.id === 'industry-media' || m.id === 'mainstream-media' || m.id === 'self-media'
    )
  } else if (industryLower.includes('金融')) {
    selectedMediaTypes = prMediaTypes.filter(m =>
      m.id === 'financial-media' || m.id === 'mainstream-media' || m.id === 'industry-media'
    )
  } else if (industryLower.includes('时尚') || industryLower.includes('美妆') || industryLower.includes('奢侈品')) {
    selectedMediaTypes = prMediaTypes.filter(m =>
      m.id === 'lifestyle-media' || m.id === 'mainstream-media' || m.id === 'self-media' || m.id === 'video-media'
    )
  } else if (industryLower.includes('医疗') || industryLower.includes('教育')) {
    selectedMediaTypes = prMediaTypes.filter(m =>
      m.id === 'mainstream-media' || m.id === 'industry-media' || m.id === 'self-media'
    )
  } else {
    selectedMediaTypes = randomPickMultiple(prMediaTypes, 4)
  }

  const mediaMatrix: string[] = []
  selectedMediaTypes.forEach(media => {
    media.mediaExamples.forEach(example => {
      if (Math.random() > 0.4) {
        mediaMatrix.push(example)
      }
    })
  })

  if (mediaMatrix.length < 5) {
    const allMedia = prMediaTypes.flatMap(m => m.mediaExamples)
    const additional = randomPickMultiple(allMedia, 5 - mediaMatrix.length)
    mediaMatrix.push(...additional)
  }

  const contentPlanOptions = [
    [
      '发布' + strategy.campaignTheme + '主题新闻通稿，覆盖主流媒体',
      '深度专访品牌创始人，传递品牌理念和故事',
      '行业趋势分析稿件，建立品牌专业形象',
      '用户案例/成功故事分享，增强品牌说服力'
    ],
    [
      strategy.campaignTheme + '项目启动新闻稿，官宣活动信息',
      '行业专家观点背书，提升品牌权威性',
      '产品/服务深度解析，让用户全面了解价值',
      '阶段性成果发布，持续保持品牌声量'
    ],
    [
      '品牌战略布局深度报道，展现品牌格局',
      '用户真实故事征集与传播，引发情感共鸣',
      '数据报告/白皮书发布，奠定行业地位',
      '危机公关预案，及时应对负面舆情'
    ]
  ]
  const contentPlan = randomPick(contentPlanOptions)

  const rhythmOptions = [
    '预热期：每周2-3篇稿件，循序渐进铺垫；引爆期：集中发布，形成媒体矩阵传播；延续期：每周1-2篇，持续保持声量',
    '分三波传播：第一波品牌官宣，第二波深度解读，第三波口碑扩散',
    '以月度为周期，月初重磅发布，月中持续跟进，月末总结复盘',
    '节奏型传播，保持稳定曝光量的同时，配合重要节点集中发力'
  ]
  const publishingRhythm = randomPick(rhythmOptions)

  const crisisOptions = [
    '建立舆情监测机制，7×24小时监测品牌相关舆情，及时发现和处理负面信息',
    '制定三级危机响应预案，明确不同级别危机的处理流程和责任人',
    '准备危机公关话术模板，确保在第一时间能够专业、妥善地回应',
    '定期进行危机演练，提升团队应急处理能力，防患于未然'
  ]
  const crisisPlan = randomPick(crisisOptions)

  return {
    mediaMatrix,
    contentPlan,
    publishingRhythm,
    crisisPlan
  }
}

/**
 * 主函数：生成渠道矩阵
 * @param brandInfo 品牌信息
 * @param targetAudience 目标人群画像
 * @param strategy 传播策略
 * @returns 完整的渠道矩阵
 */
export function generateChannelMatrix(
  brandInfo: BrandInfo,
  targetAudience: TargetAudience,
  strategy: Strategy
): ChannelMatrix {
  const socialMedia = generateSocialMediaPlan(brandInfo, targetAudience, strategy)
  const kolMarketing = generateKOLMarketing(brandInfo, targetAudience, strategy)
  const offlineEvents = generateOfflineEvents(brandInfo, targetAudience, strategy)
  const prRelations = generatePRRelations(brandInfo, targetAudience, strategy)

  return {
    socialMedia,
    kolMarketing,
    offlineEvents,
    prRelations
  }
}

export { socialMediaPlatforms, kolTiers, offlineEventTypes, prMediaTypes }
