import { format } from 'date-fns'
import type { MarketingPlan } from '@/types'

export function generateId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 10)
  return `${timestamp}-${random}`
}

export function formatDate(date: Date | string, formatStr: string = 'yyyy-MM-dd'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, formatStr)
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'yyyy-MM-dd HH:mm:ss')
}

export function randomPick<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error('数组不能为空')
  }
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function randomSample<T>(arr: T[], count: number): T[] {
  if (count <= 0) return []
  if (count >= arr.length) return [...arr]
  return shuffleArray(arr).slice(0, count)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T
  }
  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  return obj
}

export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength - suffix.length) + suffix
}

export function exportPlanAsJSON(plan: MarketingPlan): string {
  return JSON.stringify(plan, null, 2)
}

export function exportPlanAsText(plan: MarketingPlan): string {
  const lines: string[] = []

  lines.push('=== 营销策划方案 ===')
  lines.push('')
  lines.push(`方案名称: ${plan.project.name}`)
  lines.push(`创建时间: ${plan.project.createdAt}`)
  lines.push(`更新时间: ${plan.project.updatedAt}`)
  lines.push(`状态: ${plan.project.status}`)
  lines.push('')

  lines.push('--- 品牌信息 ---')
  lines.push(`品牌名称: ${plan.brandInfo.brandName}`)
  lines.push(`所属行业: ${plan.brandInfo.industry}`)
  lines.push(`核心价值: ${plan.brandInfo.coreValues.join('、')}`)
  lines.push(`品牌调性: ${plan.brandInfo.brandTone}`)
  lines.push(`定位陈述: ${plan.brandInfo.positionStatement}`)
  if (plan.brandInfo.competitors.length > 0) {
    lines.push('竞品分析:')
    plan.brandInfo.competitors.forEach((comp, idx) => {
      lines.push(`  ${idx + 1}. ${comp.name}`)
      lines.push(`     优势: ${comp.advantage}`)
      lines.push(`     劣势: ${comp.weakness}`)
    })
  }
  lines.push('')

  lines.push('--- 目标人群画像 ---')
  lines.push(`人群名称: ${plan.targetAudience.name}`)
  lines.push(`年龄范围: ${plan.targetAudience.demographics.ageRange}`)
  lines.push(`性别: ${plan.targetAudience.demographics.gender}`)
  lines.push(`地域: ${plan.targetAudience.demographics.location}`)
  lines.push(`收入: ${plan.targetAudience.demographics.income}`)
  lines.push(`学历: ${plan.targetAudience.demographics.education}`)
  lines.push(`职业: ${plan.targetAudience.demographics.occupation}`)
  lines.push(`行为特征: ${plan.targetAudience.behaviors.join('、')}`)
  lines.push(`兴趣爱好: ${plan.targetAudience.interests.join('、')}`)
  lines.push(`媒体习惯: ${plan.targetAudience.mediaHabits.join('、')}`)
  lines.push(`痛点: ${plan.targetAudience.painPoints}`)
  lines.push(`动机: ${plan.targetAudience.motivations}`)
  lines.push('')

  lines.push('--- 传播策略 ---')
  lines.push(`核心创意: ${plan.strategy.coreIdea}`)
  lines.push(`活动主题: ${plan.strategy.campaignTheme}`)
  lines.push(`关键信息: ${plan.strategy.keyMessages.join('、')}`)
  lines.push(`策略框架: ${plan.strategy.strategyFramework}`)
  lines.push('')

  lines.push('--- 渠道矩阵 ---')
  lines.push('社交媒体:')
  lines.push(`  内容策略: ${plan.channelMatrix.socialMedia.contentStrategy}`)
  lines.push(`  社区管理: ${plan.channelMatrix.socialMedia.communityManagement}`)
  lines.push(`  广告计划: ${plan.channelMatrix.socialMedia.advertisingPlan}`)
  lines.push('KOL营销:')
  lines.push(`  合作类型: ${plan.channelMatrix.kolMarketing.cooperationTypes.join('、')}`)
  lines.push(`  内容方向: ${plan.channelMatrix.kolMarketing.contentDirection}`)
  lines.push(`  甄选标准: ${plan.channelMatrix.kolMarketing.selectionCriteria}`)
  lines.push('线下活动:')
  lines.push(`  活动类型: ${plan.channelMatrix.offlineEvents.eventTypes.join('、')}`)
  lines.push(`  规模: ${plan.channelMatrix.offlineEvents.scale}`)
  lines.push(`  场地建议: ${plan.channelMatrix.offlineEvents.venueSuggestions}`)
  lines.push(`  现场活动: ${plan.channelMatrix.offlineEvents.onsiteActivities}`)
  lines.push(`  预计参与: ${plan.channelMatrix.offlineEvents.expectedAttendance}`)
  lines.push('PR公关:')
  lines.push(`  媒体矩阵: ${plan.channelMatrix.prRelations.mediaMatrix.join('、')}`)
  lines.push(`  发布节奏: ${plan.channelMatrix.prRelations.publishingRhythm}`)
  lines.push(`  危机预案: ${plan.channelMatrix.prRelations.crisisPlan}`)
  lines.push('')

  lines.push('--- KPI设置 ---')
  lines.push(`归因模型: ${plan.kpiSettings.attributionModel}`)
  lines.push('监测计划:')
  lines.push(`  工具: ${plan.kpiSettings.monitoringPlan.tools.join('、')}`)
  lines.push(`  频率: ${plan.kpiSettings.monitoringPlan.frequency}`)
  lines.push(`  报告格式: ${plan.kpiSettings.monitoringPlan.reportingFormat}`)
  lines.push('')

  lines.push('--- 执行方案 ---')
  lines.push(`总预算: ${plan.executionPlan.totalBudget}`)
  lines.push(`优化方案: ${plan.executionPlan.optimizationPlan}`)
  lines.push('时间线:')
  plan.executionPlan.timeline.forEach((phase, idx) => {
    lines.push(`  ${idx + 1}. ${phase.name} (${phase.duration})`)
    lines.push(`     时间: ${phase.startDate} - ${phase.endDate}`)
    lines.push(`     关键活动: ${phase.keyActivities.join('、')}`)
    lines.push(`     交付物: ${phase.deliverables.join('、')}`)
  })
  if (plan.executionPlan.risks.length > 0) {
    lines.push('风险项:')
    plan.executionPlan.risks.forEach((risk, idx) => {
      lines.push(`  ${idx + 1}. ${risk.risk}`)
      lines.push(`     概率: ${risk.probability} | 影响: ${risk.impact}`)
      lines.push(`     应对措施: ${risk.response}`)
    })
  }

  return lines.join('\n')
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
