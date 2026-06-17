import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  Save,
  Target,
  CheckCircle2,
  ChevronDown,
  Plus,
  BarChart3,
  Users,
  PieChart,
  AlertTriangle,
  Shield,
  Lightbulb,
  TrendingUp,
  Zap,
  FileText,
  Package,
  Megaphone,
  Star,
  ArrowRight,
  Flame,
  Sparkles,
  RefreshCw,
  Gauge,
  RotateCcw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
} from 'recharts';
import { useProjectStore } from '@/store/useProjectStore';
import { generateExecutionPlan } from '@/engine/scheduleBuilder';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import Badge from '@/components/ui/Badge';
import StepIndicator from '@/components/ui/StepIndicator';
import ProgressBar from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';
import type { TimelinePhase } from '@/types';

const steps = [
  { id: 1, label: '品牌信息' },
  { id: 2, label: '人群画像' },
  { id: 3, label: '传播策略' },
  { id: 4, label: '渠道矩阵' },
  { id: 5, label: 'KPI设置' },
  { id: 6, label: '执行排期' },
];

type LabelColor = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'gray';

interface PhaseColorConfig {
  primary: LabelColor;
  bg: string;
  border: string;
  text: string;
  gradient: string;
  bar: string;
}

const phaseColors: Record<string, PhaseColorConfig> = {
  '预热期': {
    primary: 'primary',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    text: 'text-primary-600',
    gradient: 'from-primary-500 to-primary-600',
    bar: '#4778C3',
  },
  '引爆期': {
    primary: 'accent',
    bg: 'bg-accent-50',
    border: 'border-accent-200',
    text: 'text-accent-600',
    gradient: 'from-accent-500 to-accent-600',
    bar: '#FF6B35',
  },
  '延续期': {
    primary: 'success',
    bg: 'bg-success-50',
    border: 'border-success-200',
    text: 'text-success-600',
    gradient: 'from-success-500 to-success-600',
    bar: '#2EC4B6',
  },
};

const probabilityLabels: Record<string, { label: string; color: LabelColor }> = {
  high: { label: '高', color: 'danger' },
  medium: { label: '中', color: 'warning' },
  low: { label: '低', color: 'success' },
};

const impactLabels: Record<string, { label: string; color: LabelColor }> = {
  high: { label: '高', color: 'danger' },
  medium: { label: '中', color: 'warning' },
  low: { label: '低', color: 'success' },
};

const categoryIcons: Record<string, typeof FileText> = {
  '内容制作': FileText,
  '广告投放': Megaphone,
  'KOL合作': Star,
  '公关传播': Megaphone,
  '线下活动': Package,
  '数据监测': BarChart3,
  '项目管理': Users,
};

export default function SchedulePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPlan, loadPlan, updateExecutionPlan, saveCurrentPlan } = useProjectStore();

  const [expandedPhase, setExpandedPhase] = useState<string | null>('预热期');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resourceCategory, setResourceCategory] = useState<string>('全部');

  useEffect(() => {
    if (id && (!currentPlan || currentPlan.project.id !== id)) {
      loadPlan(id);
    }
  }, [id, currentPlan, loadPlan]);

  const executionPlan = currentPlan?.executionPlan;
  const strategy = currentPlan?.strategy;
  const channelMatrix = currentPlan?.channelMatrix;
  const kpiSettings = currentPlan?.kpiSettings;

  const handleGenerate = useCallback(async () => {
    if (!strategy || !channelMatrix || !kpiSettings) return;

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const plan = generateExecutionPlan(strategy, channelMatrix, kpiSettings);
    updateExecutionPlan(plan);
    setIsGenerating(false);
  }, [strategy, channelMatrix, kpiSettings, updateExecutionPlan]);

  useEffect(() => {
    if (strategy && channelMatrix && kpiSettings && 
        executionPlan && executionPlan.timeline.length === 0) {
      handleGenerate();
    }
  }, [strategy, channelMatrix, kpiSettings, executionPlan, handleGenerate]);

  const handleRegenerate = async () => {
    await handleGenerate();
  };

  const handleSave = () => {
    saveCurrentPlan();
  };

  const handlePrev = () => {
    saveCurrentPlan();
    navigate(`/project/${id}/kpi`);
  };

  const handleComplete = () => {
    saveCurrentPlan();
    if (currentPlan) {
      navigate(`/project/${currentPlan.project.id}/preview`);
    }
  };

  const sortedRisks = useMemo(() => {
    if (!executionPlan?.risks) return [];
    const impactOrder = { high: 3, medium: 2, low: 1 };
    return [...executionPlan.risks].sort(
      (a, b) => impactOrder[b.impact] - impactOrder[a.impact]
    );
  }, [executionPlan?.risks]);

  const budgetData = useMemo(() => {
    if (!executionPlan?.resources) return [];
    const categoryMap = new Map<string, number>();
    
    executionPlan.resources.forEach((resource) => {
      const match = resource.budget.match(/占总预算\s*(\d+)%?[-~到至]?(\d+)?%/);
      let value = 0;
      if (match) {
        value = parseInt(match[1]);
        if (match[2]) {
          value = (parseInt(match[1]) + parseInt(match[2])) / 2;
        }
      } else {
        value = 5;
      }
      
      const current = categoryMap.get(resource.category) || 0;
      categoryMap.set(resource.category, current + value);
    });

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }, [executionPlan?.resources]);

  const pieColors = ['#4778C3', '#FF6B35', '#2EC4B6', '#8B5CF6', '#F59E0B', '#EC4899', '#64748B'];

  const resourceCategories = useMemo(() => {
    if (!executionPlan?.resources) return ['全部'];
    const categories = [...new Set(executionPlan.resources.map((r) => r.category))];
    return ['全部', ...categories];
  }, [executionPlan?.resources]);

  const filteredResources = useMemo(() => {
    if (!executionPlan?.resources) return [];
    if (resourceCategory === '全部') return executionPlan.resources;
    return executionPlan.resources.filter((r) => r.category === resourceCategory);
  }, [executionPlan?.resources, resourceCategory]);

  const timelineTotalDays = useMemo(() => {
    if (!executionPlan?.timeline || executionPlan.timeline.length === 0) return 0;
    const start = new Date(executionPlan.timeline[0].startDate);
    const end = new Date(executionPlan.timeline[executionPlan.timeline.length - 1].endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, [executionPlan?.timeline]);

  if (!currentPlan || !executionPlan) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
          <p className="text-background-500">加载中...</p>
        </div>
      </div>
    );
  }

  const renderPhaseCard = (phase: TimelinePhase, index: number) => {
    const colors = phaseColors[phase.name as keyof typeof phaseColors] || phaseColors['预热期'];
    const isExpanded = expandedPhase === phase.name;
    const IconComponent = phase.name === '预热期' ? Sparkles : phase.name === '引爆期' ? Flame : TrendingUp;

    return (
      <motion.div
        key={phase.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <Card
          className={cn(
            'cursor-pointer transition-all duration-300',
            isExpanded ? 'ring-2 ring-offset-2 ring-primary-300' : ''
          )}
          onClick={() => setExpandedPhase(isExpanded ? null : phase.name)}
        >
          <CardHeader
            title={
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white', colors.gradient)}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-background-900">{phase.name}</h3>
                    <Badge color={colors.primary} size="sm">
                      {phase.duration}
                    </Badge>
                  </div>
                  <p className="text-sm text-background-500 mt-0.5">
                    {phase.startDate} ~ {phase.endDate}
                  </p>
                </div>
              </div>
            }
            action={
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-background-400 transition-transform duration-300',
                  isExpanded && 'rotate-180'
                )}
              />
            }
          />
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <CardBody className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-primary-500" />
                        <h4 className="font-semibold text-background-900">阶段目标</h4>
                      </div>
                      <p className="text-sm text-background-600 leading-relaxed pl-6">
                        {phase.name === '预热期' && '建立品牌认知，营造话题氛围，积累种子用户，为引爆期做好准备'}
                        {phase.name === '引爆期' && '集中资源火力全开，制造话题爆点，快速触达目标人群，实现转化突破'}
                        {phase.name === '延续期' && '持续运营沉淀用户，打造品牌口碑，转化为品牌资产，实现长效价值'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-success-500" />
                        <h4 className="font-semibold text-background-900">关键活动</h4>
                      </div>
                      <ul className="space-y-2 pl-6">
                        {phase.keyActivities.map((activity, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                            className="flex items-start gap-2 text-sm text-background-600"
                          >
                            <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', `bg-${colors.primary}-500`)} />
                            {activity}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-4 h-4 text-accent-500" />
                        <h4 className="font-semibold text-background-900">交付物</h4>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {phase.deliverables.map((deliverable, i) => (
                          <Tag key={i} color={colors.primary} size="md">
                            {deliverable}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background-50">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-background-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="md"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={handlePrev}
              >
                返回上一步
              </Button>
              <div className="h-6 w-px bg-background-200" />
              <div>
                <h1 className="text-xl font-bold text-background-900">执行排期</h1>
                <p className="text-sm text-background-500 mt-0.5">制定详细的执行计划和资源分配方案</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={handleRegenerate}
                disabled={isGenerating}
              >
                重新生成
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleComplete}
              >
                完成并查看方案
              </Button>
            </div>
          </div>
          <StepIndicator steps={steps} currentStep={5} showLabels={true} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isGenerating ? (
          <div className="py-20">
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-200"
              >
                <Calendar className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-background-900 mb-2">正在生成执行排期...</h3>
              <p className="text-background-500 mb-8">根据策略和渠道配置，智能生成详细的执行方案</p>
              <div className="max-w-md mx-auto">
                <ProgressBar value={60} color="primary" size="lg" striped animated showLabel />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-background-900">项目时间轴</h3>
                        <p className="text-sm text-background-500 mt-0.5">
                          总周期：{timelineTotalDays} 天 · 三阶段推进
                        </p>
                      </div>
                    </div>
                  }
                  action={
                    <Badge color="success" size="md">
                      已规划
                    </Badge>
                  }
                />
                <CardBody>
                  <div className="relative">
                    <div className="overflow-x-auto pb-4">
                      <div className="min-w-[600px]">
                        <div className="relative h-24 flex items-center">
                          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-background-200 rounded-full">
                            <div className="absolute inset-0 flex">
                              {executionPlan.timeline.map((phase, index) => {
                                const colors = phaseColors[phase.name as keyof typeof phaseColors];
                                const days = Math.ceil(
                                  (new Date(phase.endDate).getTime() - new Date(phase.startDate).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                );
                                const width = (days / timelineTotalDays) * 100;

                                return (
                                  <motion.div
                                    key={phase.name}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${width}%` }}
                                    transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                                    className={cn(
                                      'h-full relative bg-gradient-to-r',
                                      colors?.gradient || 'from-primary-500 to-primary-600'
                                    )}
                                    style={{ borderRadius: index === 0 ? '9999px 0 0 9999px' : index === executionPlan.timeline.length - 1 ? '0 9999px 9999px 0' : '0' }}
                                  >
                                    <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-white border-2" style={{ borderColor: colors?.bar }} />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border-2" style={{ borderColor: colors?.bar }} />
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="absolute inset-x-0 flex">
                            {executionPlan.timeline.map((phase) => {
                              const colors = phaseColors[phase.name as keyof typeof phaseColors];
                              const days = Math.ceil(
                                (new Date(phase.endDate).getTime() - new Date(phase.startDate).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              );
                              const width = (days / timelineTotalDays) * 100;

                              return (
                                <div
                                  key={phase.name}
                                  className="relative"
                                  style={{ width: `${width}%` }}
                                >
                                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <div className={cn('text-sm font-bold', colors?.text)}>{phase.name}</div>
                                  </div>
                                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <div className="text-xs text-background-500">{phase.duration}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mt-16 grid grid-cols-3 gap-4">
                          {executionPlan.timeline.map((phase, index) => {
                            const colors = phaseColors[phase.name as keyof typeof phaseColors];
                            return (
                              <motion.div
                                key={phase.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                className={cn('p-4 rounded-xl', colors?.bg, colors?.border, 'border')}
                              >
                                <div className="text-sm font-medium text-background-900 mb-1">{phase.startDate}</div>
                                <div className="text-xs text-background-500">启动</div>
                              </motion.div>
                            );
                          })}
                        </div>

                        <div className="mt-6 flex justify-center">
                          <div className="flex items-center gap-6">
                            {executionPlan.timeline.map((phase) => {
                              const colors = phaseColors[phase.name as keyof typeof phaseColors];
                              const IconComponent = phase.name === '预热期' ? Sparkles : phase.name === '引爆期' ? Flame : TrendingUp;
                              return (
                                <div key={phase.name} className="flex items-center gap-2">
                                  <div className={cn('w-3 h-3 rounded-full', `bg-${colors?.primary}-500`)} style={{ backgroundColor: colors?.bar }} />
                                  <span className="text-sm text-background-600">{phase.name}</span>
                                  <IconComponent className="w-4 h-4" style={{ color: colors?.bar }} />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {executionPlan.timeline.map((phase, index) => renderPhaseCard(phase, index))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-accent-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-background-900">资源分配</h3>
                        <p className="text-sm text-background-500 mt-0.5">预算和人力资源的合理分配</p>
                      </div>
                    </div>
                  }
                  action={
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">{executionPlan.totalBudget}</div>
                      <div className="text-xs text-background-500">总预算</div>
                    </div>
                  }
                />
                <CardBody>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-background-900 mb-4 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-primary-500" />
                        预算分配占比
                      </h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={budgetData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                              animationDuration={800}
                            >
                              {budgetData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white rounded-lg shadow-lg border border-background-100 p-3">
                                      <p className="font-semibold text-background-900">{data.name}</p>
                                      <p className="text-sm text-background-500">约 {data.value}%</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend
                              formatter={(value: string) => (
                                <span className="text-sm text-background-600">{value}</span>
                              )}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-background-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-accent-500" />
                        各类别预算对比
                      </h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={budgetData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#E6EBF2" horizontal={false} />
                            <XAxis type="number" tick={{ fill: '#9AA3B3', fontSize: 12 }} />
                            <YAxis
                              dataKey="name"
                              type="category"
                              tick={{ fill: '#9AA3B3', fontSize: 12 }}
                              width={80}
                            />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white rounded-lg shadow-lg border border-background-100 p-3">
                                      <p className="font-semibold text-background-900">{data.name}</p>
                                      <p className="text-sm text-background-500">约 {data.value}%</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={800}>
                              {budgetData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-background-100">
                    <h4 className="font-semibold text-background-900 mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-success-500" />
                      人力资源分配
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: '内容运营团队', count: '3-5人', icon: FileText, color: 'primary' },
                        { name: '设计创意团队', count: '2-3人', icon: Sparkles, color: 'accent' },
                        { name: '媒介投放团队', count: '2-3人', icon: Megaphone, color: 'success' },
                        { name: '项目经理', count: '1人', icon: Users, color: 'warning' },
                      ].map((team, index) => {
                        const Icon = team.icon;
                        return (
                          <motion.div
                            key={team.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                            className="p-4 bg-background-50 rounded-xl border border-background-100 text-center"
                          >
                            <div className={cn('w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center', `bg-${team.color}-100`)}>
                              <Icon className={cn('w-5 h-5', `text-${team.color}-600`)} />
                            </div>
                            <div className="text-sm font-medium text-background-900">{team.name}</div>
                            <div className="text-xs text-background-500 mt-1">{team.count}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-success-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-background-900">资源清单</h3>
                        <p className="text-sm text-background-500 mt-0.5">详细的资源项目和预算明细</p>
                      </div>
                    </div>
                  }
                />
                <CardBody>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {resourceCategories.map((category) => {
                      const isActive = resourceCategory === category;
                      return (
                        <Tag
                          key={category}
                          color={isActive ? 'primary' : 'gray'}
                          selected={isActive}
                          size="md"
                          onClick={() => setResourceCategory(category)}
                          className="cursor-pointer"
                        >
                          {category}
                        </Tag>
                      );
                    })}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-background-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-background-600">类别</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-background-600">项目</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-background-600">数量</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-background-600">预算</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-background-600">负责人</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources.map((resource, index) => {
                          const IconComponent = categoryIcons[resource.category] || FileText;
                          return (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="border-b border-background-100 hover:bg-background-50 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <IconComponent className="w-4 h-4 text-primary-600" />
                                  </div>
                                  <span className="text-sm text-background-700">{resource.category}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm font-medium text-background-900">{resource.item}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-sm text-background-600">{resource.quantity}</span>
                              </td>
                              <td className="py-3 px-4">
                                <Badge color="accent" size="sm">
                                  {resource.budget}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-medium">
                                    {resource.responsible.charAt(0)}
                                  </div>
                                  <span className="text-sm text-background-600">{resource.responsible}</span>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      className="border-dashed"
                    >
                      添加资源项
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-background-900">风险预案</h3>
                        <p className="text-sm text-background-500 mt-0.5">识别潜在风险并制定应对方案</p>
                      </div>
                    </div>
                  }
                  action={
                    <Tag color="danger" size="sm">
                      共 {sortedRisks.length} 项
                    </Tag>
                  }
                />
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedRisks.map((risk, index) => {
                      const probInfo = probabilityLabels[risk.probability];
                      const impactInfo = impactLabels[risk.impact];
                      const riskLevel =
                        risk.impact === 'high' && risk.probability === 'high'
                          ? 'high'
                          : risk.impact === 'high' || risk.probability === 'high'
                          ? 'medium'
                          : 'low';
                      const riskColors = {
                        high: 'border-red-300 bg-red-50/50',
                        medium: 'border-amber-300 bg-amber-50/50',
                        low: 'border-green-300 bg-green-50/50',
                      };

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
                          className={cn('p-5 rounded-xl border-2', riskColors[riskLevel])}
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                                riskLevel === 'high' ? 'bg-red-100' : riskLevel === 'medium' ? 'bg-amber-100' : 'bg-green-100'
                              )}>
                                <Shield className={cn(
                                  'w-4 h-4',
                                  riskLevel === 'high' ? 'text-red-600' : riskLevel === 'medium' ? 'text-amber-600' : 'text-green-600'
                                )} />
                              </div>
                              <h4 className="font-semibold text-background-900 pt-0.5">{risk.risk}</h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3 pl-11">
                            <Tag color={probInfo.color} size="sm">
                              概率：{probInfo.label}
                            </Tag>
                            <Tag color={impactInfo.color} size="sm">
                              影响：{impactInfo.label}
                            </Tag>
                          </div>

                          <div className="pl-11">
                            <div className="flex items-start gap-2">
                              <Zap className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-background-600 mb-1">应对方案</p>
                                <p className="text-sm text-background-700 leading-relaxed">{risk.response}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-background-900">优化建议</h3>
                        <p className="text-sm text-background-500 mt-0.5">数据驱动的持续优化策略</p>
                      </div>
                    </div>
                  }
                />
                <CardBody>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 via-accent-50/50 to-success-50 border border-primary-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-background-900 mb-2">智能优化方案</h4>
                        <p className="text-sm text-background-700 leading-relaxed">
                          {executionPlan.optimizationPlan}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {[
                      {
                        icon: TrendingUp,
                        title: '数据驱动优化',
                        desc: '以数据为核心依据，持续追踪各渠道效果，动态调整资源分配，最大化投资回报率',
                        color: 'primary',
                      },
                      {
                        icon: Gauge,
                        title: 'A/B测试建议',
                        desc: '对创意素材、投放人群、落地页等进行A/B测试，基于数据选择最优方案',
                        color: 'accent',
                      },
                      {
                        icon: RotateCcw,
                        title: '定期复盘机制',
                        desc: '建立周度和月度复盘机制，总结经验教训，持续优化营销策略和执行方法',
                        color: 'success',
                      },
                      {
                        icon: Zap,
                        title: '敏捷调整方案',
                        desc: '保持方案灵活性，建立快速响应机制，根据市场变化及时调整策略方向',
                        color: 'warning',
                      },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                          className="p-5 bg-white rounded-xl border border-background-100 hover:border-primary-200 hover:shadow-card-hover transition-all"
                        >
                          <div className={cn('w-10 h-10 rounded-xl mb-4 flex items-center justify-center', `bg-${item.color}-100`)}>
                            <Icon className={cn('w-5 h-5', `text-${item.color}-600`)} />
                          </div>
                          <h5 className="font-semibold text-background-900 mb-2">{item.title}</h5>
                          <p className="text-sm text-background-600 leading-relaxed">{item.desc}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<ChevronLeft className="w-5 h-5" />}
                onClick={handlePrev}
              >
                上一步：KPI设置
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<Save className="w-5 h-5" />}
                  onClick={handleSave}
                >
                  保存
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={handleComplete}
                >
                  完成并查看方案
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
