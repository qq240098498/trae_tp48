import { create } from 'zustand'
import type {
  MarketingPlan,
  Project,
  BrandInfo,
  TargetAudience,
  Strategy,
  ChannelMatrix,
  KPISettings,
  ExecutionPlan,
  ABTestPlan,
  ROIEstimationParams,
  ROIEstimationResult,
  ChannelBudgetAllocation,
} from '@/types'
import { savePlan, getPlan, deletePlan, getPlanList } from '@/utils/storage'
import { generateId, deepClone, formatDateTime } from '@/utils/helpers'
import { generateABTestPlan, generateMultipleABTestPlans, type ABTestGenerationOptions, type BatchABTestGenerationOptions } from '@/engine/abTestEngine'
import { estimateROI } from '@/engine/roiEstimationEngine'

interface ProjectStore {
  currentPlan: MarketingPlan | null
  planList: Project[]
  isLoading: boolean
  error: string | null

  initStore: () => void
  createNewPlan: (name?: string) => MarketingPlan
  loadPlan: (id: string) => void
  saveCurrentPlan: () => void
  deletePlanById: (id: string) => void
  duplicatePlan: (id: string, newName?: string) => MarketingPlan | null
  loadPlanList: () => void

  updateBrandInfo: (brandInfo: Partial<BrandInfo>) => void
  updateTargetAudience: (targetAudience: Partial<TargetAudience>) => void
  updateStrategy: (strategy: Partial<Strategy>) => void
  updateChannelMatrix: (channelMatrix: Partial<ChannelMatrix>) => void
  updateKPISettings: (kpiSettings: Partial<KPISettings>) => void
  updateExecutionPlan: (executionPlan: Partial<ExecutionPlan>) => void

  generateABTestPlan: (options?: ABTestGenerationOptions) => ABTestPlan | null
  generateMultipleABTestPlans: (options?: BatchABTestGenerationOptions) => ABTestPlan[]
  addABTestPlan: (abTestPlan: ABTestPlan) => void
  updateABTestPlan: (id: string, updates: Partial<ABTestPlan>) => void
  deleteABTestPlan: (id: string) => void
  getABTestPlanById: (id: string) => ABTestPlan | undefined

  estimateROI: (allocations: ChannelBudgetAllocation[], confidenceLevel?: 'high' | 'medium' | 'low') => ROIEstimationResult | null
  updateROIEstimation: (result: ROIEstimationResult) => void
  clearROIEstimation: () => void

  setCurrentPlan: (plan: MarketingPlan | null) => void
  clearError: () => void
}

function createEmptyPlan(name: string = '未命名方案'): MarketingPlan {
  const now = formatDateTime(new Date())
  const id = generateId()

  return {
    project: {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      status: 'draft',
    },
    brandInfo: {
      brandName: '',
      industry: '',
      coreValues: [],
      brandTone: '',
      positionStatement: '',
      competitors: [],
    },
    targetAudience: {
      name: '',
      demographics: {
        ageRange: '',
        gender: '',
        location: '',
        income: '',
        education: '',
        occupation: '',
      },
      behaviors: [],
      interests: [],
      mediaHabits: [],
      painPoints: '',
      motivations: '',
    },
    strategy: {
      coreIdea: '',
      campaignTheme: '',
      keyMessages: [],
      strategyFramework: '',
      versions: [],
    },
    channelMatrix: {
      socialMedia: {
        platforms: [],
        contentStrategy: '',
        communityManagement: '',
        advertisingPlan: '',
      },
      kolMarketing: {
        kolTiers: [],
        cooperationTypes: [],
        contentDirection: '',
        selectionCriteria: '',
      },
      offlineEvents: {
        eventTypes: [],
        scale: '',
        venueSuggestions: '',
        onsiteActivities: '',
        expectedAttendance: '',
      },
      prRelations: {
        mediaMatrix: [],
        contentPlan: [],
        publishingRhythm: '',
        crisisPlan: '',
      },
    },
    kpiSettings: {
      awarenessMetrics: [],
      engagementMetrics: [],
      conversionMetrics: [],
      loyaltyMetrics: [],
      attributionModel: '',
      monitoringPlan: {
        tools: [],
        frequency: '',
        reportingFormat: '',
      },
    },
    executionPlan: {
      timeline: [],
      resources: [],
      totalBudget: '',
      risks: [],
      optimizationPlan: '',
    },
    abTestPlans: [],
    roiEstimation: undefined,
  }
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentPlan: null,
  planList: [],
  isLoading: false,
  error: null,

  initStore: () => {
    try {
      const planList = getPlanList()
      set({ planList })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '初始化失败' })
    }
  },

  createNewPlan: (name?: string): MarketingPlan => {
    const plan = createEmptyPlan(name)
    set({ currentPlan: plan })
    return plan
  },

  loadPlan: (id: string) => {
    try {
      set({ isLoading: true, error: null })
      const plan = getPlan(id)
      if (plan) {
        set({ currentPlan: plan })
      } else {
        set({ error: '方案不存在' })
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载方案失败' })
    } finally {
      set({ isLoading: false })
    }
  },

  saveCurrentPlan: () => {
    try {
      const { currentPlan } = get()
      if (!currentPlan) {
        throw new Error('没有可保存的方案')
      }

      const updatedPlan = {
        ...currentPlan,
        project: {
          ...currentPlan.project,
          updatedAt: formatDateTime(new Date()),
        },
      }

      savePlan(updatedPlan)
      set({ currentPlan: updatedPlan })
      get().loadPlanList()
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '保存方案失败' })
    }
  },

  deletePlanById: (id: string) => {
    try {
      deletePlan(id)
      const { currentPlan } = get()
      if (currentPlan?.project.id === id) {
        set({ currentPlan: null })
      }
      get().loadPlanList()
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '删除方案失败' })
    }
  },

  duplicatePlan: (id: string, newName?: string): MarketingPlan | null => {
    try {
      const plan = getPlan(id)
      if (!plan) return null

      const cloned = deepClone(plan)
      const newId = generateId()
      const now = formatDateTime(new Date())
      const name = newName || `${plan.project.name} - 副本`

      const duplicatedPlan: MarketingPlan = {
        ...cloned,
        project: {
          ...cloned.project,
          id: newId,
          name,
          createdAt: now,
          updatedAt: now,
          status: 'draft',
        },
      }

      savePlan(duplicatedPlan)
      get().loadPlanList()
      return duplicatedPlan
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '复制方案失败' })
      return null
    }
  },

  loadPlanList: () => {
    try {
      const planList = getPlanList()
      set({ planList })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '加载方案列表失败' })
    }
  },

  updateBrandInfo: (brandInfo: Partial<BrandInfo>) => {
    const { currentPlan } = get()
    if (!currentPlan) return

    set({
      currentPlan: {
        ...currentPlan,
        brandInfo: {
          ...currentPlan.brandInfo,
          ...brandInfo,
        },
      },
    })
  },

  updateTargetAudience: (targetAudience: Partial<TargetAudience>) => {
    const { currentPlan } = get()
    if (!currentPlan) return

    set({
      currentPlan: {
        ...currentPlan,
        targetAudience: {
          ...currentPlan.targetAudience,
          ...targetAudience,
          demographics: {
            ...currentPlan.targetAudience.demographics,
            ...(targetAudience.demographics || {}),
          },
        },
      },
    })
  },

  updateStrategy: (strategy: Partial<Strategy>) => {
    const { currentPlan } = get()
    if (!currentPlan) return

    set({
      currentPlan: {
        ...currentPlan,
        strategy: {
          ...currentPlan.strategy,
          ...strategy,
        },
      },
    })
  },

  updateChannelMatrix: (channelMatrix: Partial<ChannelMatrix>) => {
    const { currentPlan } = get()
    if (!currentPlan) return

    set({
      currentPlan: {
        ...currentPlan,
        channelMatrix: {
          ...currentPlan.channelMatrix,
          ...channelMatrix,
          socialMedia: {
            ...currentPlan.channelMatrix.socialMedia,
            ...(channelMatrix.socialMedia || {}),
          },
          kolMarketing: {
            ...currentPlan.channelMatrix.kolMarketing,
            ...(channelMatrix.kolMarketing || {}),
          },
          offlineEvents: {
            ...currentPlan.channelMatrix.offlineEvents,
            ...(channelMatrix.offlineEvents || {}),
          },
          prRelations: {
            ...currentPlan.channelMatrix.prRelations,
            ...(channelMatrix.prRelations || {}),
          },
        },
      },
    })
  },

  updateKPISettings: (kpiSettings: Partial<KPISettings>) => {
    const { currentPlan } = get()
    if (!currentPlan) return

    set({
      currentPlan: {
        ...currentPlan,
        kpiSettings: {
          ...currentPlan.kpiSettings,
          ...kpiSettings,
          monitoringPlan: {
            ...currentPlan.kpiSettings.monitoringPlan,
            ...(kpiSettings.monitoringPlan || {}),
          },
        },
      },
    })
  },

  updateExecutionPlan: (executionPlan: Partial<ExecutionPlan>) => {
    const { currentPlan } = get()
    if (!currentPlan) return

    set({
      currentPlan: {
        ...currentPlan,
        executionPlan: {
          ...currentPlan.executionPlan,
          ...executionPlan,
        },
      },
    })
  },

  generateABTestPlan: (options?: ABTestGenerationOptions): ABTestPlan | null => {
    const { currentPlan } = get()
    if (!currentPlan) return null

    const { brandInfo, targetAudience, strategy } = currentPlan

    if (!brandInfo.brandName || !strategy.coreIdea) {
      return null
    }

    const abTestPlan = generateABTestPlan(brandInfo, targetAudience, strategy, options)

    const updatedPlan = {
      ...currentPlan,
      abTestPlans: [...(currentPlan.abTestPlans || []), abTestPlan],
    }

    set({ currentPlan: updatedPlan })

    return abTestPlan
  },

  generateMultipleABTestPlans: (options?: BatchABTestGenerationOptions): ABTestPlan[] => {
    const { currentPlan } = get()
    if (!currentPlan) return []

    const { brandInfo, targetAudience, strategy } = currentPlan

    if (!brandInfo.brandName || !strategy.coreIdea) {
      return []
    }

    const abTestPlans = generateMultipleABTestPlans(brandInfo, targetAudience, strategy, options)

    const updatedPlan = {
      ...currentPlan,
      abTestPlans: [...(currentPlan.abTestPlans || []), ...abTestPlans],
    }

    set({ currentPlan: updatedPlan })

    return abTestPlans
  },

  addABTestPlan: (abTestPlan: ABTestPlan) => {
    const { currentPlan } = get()
    if (!currentPlan) return

    const updatedPlan = {
      ...currentPlan,
      abTestPlans: [...(currentPlan.abTestPlans || []), abTestPlan],
    }

    set({ currentPlan: updatedPlan })
  },

  updateABTestPlan: (id: string, updates: Partial<ABTestPlan>) => {
    const { currentPlan } = get()
    if (!currentPlan || !currentPlan.abTestPlans) return

    const updatedPlans = currentPlan.abTestPlans.map((plan) =>
      plan.id === id ? { ...plan, ...updates, updatedAt: formatDateTime(new Date()) } : plan
    )

    set({
      currentPlan: {
        ...currentPlan,
        abTestPlans: updatedPlans,
      },
    })
  },

  deleteABTestPlan: (id: string) => {
    const { currentPlan } = get()
    if (!currentPlan || !currentPlan.abTestPlans) return

    const updatedPlans = currentPlan.abTestPlans.filter((plan) => plan.id !== id)

    set({
      currentPlan: {
        ...currentPlan,
        abTestPlans: updatedPlans,
      },
    })
  },

  getABTestPlanById: (id: string): ABTestPlan | undefined => {
    const { currentPlan } = get()
    if (!currentPlan || !currentPlan.abTestPlans) return undefined

    return currentPlan.abTestPlans.find((plan) => plan.id === id)
  },

  estimateROI: (allocations: ChannelBudgetAllocation[], confidenceLevel?: 'high' | 'medium' | 'low'): ROIEstimationResult | null => {
    const { currentPlan } = get()
    if (!currentPlan) return null

    const { brandInfo, targetAudience } = currentPlan
    const audienceTags = [
      targetAudience.demographics.ageRange,
      targetAudience.demographics.gender,
      ...targetAudience.behaviors,
      ...targetAudience.interests,
    ].filter(Boolean)

    const totalBudget = allocations.reduce((sum, a) => sum + a.budget, 0)

    const params: ROIEstimationParams = {
      industry: brandInfo.industry || '全行业',
      totalBudget,
      budgetAllocations: allocations,
      audienceTags,
      historicalConfidenceLevel: confidenceLevel || 'medium',
    }

    const result = estimateROI(params)

    const updatedPlan = {
      ...currentPlan,
      roiEstimation: result,
    }

    set({ currentPlan: updatedPlan })

    return result
  },

  updateROIEstimation: (result: ROIEstimationResult) => {
    const { currentPlan } = get()
    if (!currentPlan) return

    const updatedPlan = {
      ...currentPlan,
      roiEstimation: result,
    }

    set({ currentPlan: updatedPlan })
  },

  clearROIEstimation: () => {
    const { currentPlan } = get()
    if (!currentPlan) return

    const updatedPlan = {
      ...currentPlan,
      roiEstimation: undefined,
    }

    set({ currentPlan: updatedPlan })
  },

  setCurrentPlan: (plan: MarketingPlan | null) => {
    set({ currentPlan: plan })
  },

  clearError: () => {
    set({ error: null })
  },
}))
