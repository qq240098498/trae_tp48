import type { MarketingPlan, Project } from '@/types'

const STORAGE_KEYS = {
  PLAN_LIST: 'marketing_plan_list',
  PLAN_PREFIX: 'marketing_plan_',
  THEME: 'marketing_theme',
} as const

const STORAGE_LIMIT = 5 * 1024 * 1024

export function serializeData<T>(data: T): string {
  try {
    return JSON.stringify(data)
  } catch (error) {
    console.error('序列化数据失败:', error)
    throw new Error('数据序列化失败')
  }
}

export function deserializeData<T>(data: string): T | null {
  try {
    return JSON.parse(data) as T
  } catch (error) {
    console.error('反序列化数据失败:', error)
    return null
  }
}

export function getStorageUsage(): number {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const value = localStorage.getItem(key)
      total += key.length + (value?.length || 0)
    }
  }
  return total
}

export function checkStorageCapacity(size: number): boolean {
  const usage = getStorageUsage()
  return usage + size <= STORAGE_LIMIT
}

export function savePlan(plan: MarketingPlan): void {
  const data = serializeData(plan)
  const dataSize = data.length

  if (!checkStorageCapacity(dataSize)) {
    throw new Error('存储空间不足，请删除部分方案后再试')
  }

  const key = STORAGE_KEYS.PLAN_PREFIX + plan.project.id
  localStorage.setItem(key, data)

  const planList = getPlanList()
  const existingIndex = planList.findIndex((p) => p.id === plan.project.id)

  const projectInfo: Project = {
    id: plan.project.id,
    name: plan.project.name,
    createdAt: plan.project.createdAt,
    updatedAt: plan.project.updatedAt,
    status: plan.project.status,
  }

  if (existingIndex >= 0) {
    planList[existingIndex] = projectInfo
  } else {
    planList.push(projectInfo)
  }

  localStorage.setItem(STORAGE_KEYS.PLAN_LIST, serializeData(planList))
}

export function getPlan(id: string): MarketingPlan | null {
  const key = STORAGE_KEYS.PLAN_PREFIX + id
  const data = localStorage.getItem(key)
  if (!data) return null
  return deserializeData<MarketingPlan>(data)
}

export function deletePlan(id: string): void {
  const key = STORAGE_KEYS.PLAN_PREFIX + id
  localStorage.removeItem(key)

  const planList = getPlanList()
  const filteredList = planList.filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEYS.PLAN_LIST, serializeData(filteredList))
}

export function getPlanList(): Project[] {
  const data = localStorage.getItem(STORAGE_KEYS.PLAN_LIST)
  if (!data) return []
  const list = deserializeData<Project[]>(data)
  return list || []
}

export function savePlanList(list: Project[]): void {
  localStorage.setItem(STORAGE_KEYS.PLAN_LIST, serializeData(list))
}

export function clearAllPlans(): void {
  const planList = getPlanList()
  planList.forEach((plan) => {
    const key = STORAGE_KEYS.PLAN_PREFIX + plan.id
    localStorage.removeItem(key)
  })
  localStorage.removeItem(STORAGE_KEYS.PLAN_LIST)
}

export function saveTheme(theme: string): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme)
}

export function getTheme(): string | null {
  return localStorage.getItem(STORAGE_KEYS.THEME)
}
