import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Sparkles,
  Eye,
  Heart,
  ShoppingCart,
  Repeat,
  BarChart3,
  Target,
  TrendingUp,
  Zap,
  Clock,
  FileBarChart,
  LayoutDashboard,
  ChevronDown,
  Check,
  Info,
  Lightbulb,
  Gauge,
  Award,
  ArrowRight,
  Star,
} from 'lucide-react';
import {
  FunnelChart,
  Funnel,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import { useProjectStore } from '@/store/useProjectStore';
import { generateKPISettings, awarenessLibrary, engagementLibrary, conversionLibrary, loyaltyLibrary, attributionModels, monitoringTools } from '@/engine/kpiGenerator';
import Card, { CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Tag from '@/components/ui/Tag';
import Badge from '@/components/ui/Badge';
import StepIndicator from '@/components/ui/StepIndicator';
import { cn } from '@/lib/utils';
import type { KPIMetric, KPISettings } from '@/types';

const steps = [
  { id: 1, label: '品牌信息' },
  { id: 2, label: '人群画像' },
  { id: 3, label: '传播策略' },
  { id: 4, label: '渠道矩阵' },
  { id: 5, label: 'KPI设置' },
  { id: 6, label: '执行方案' },
];

const funnelColors = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f97316',
];

const funnelLayerConfig = [
  { key: 'awareness', name: '认知层', icon: Eye, color: 'primary', gradient: 'from-primary-500 to-primary-600' },
  { key: 'engagement', name: '互动层', icon: Heart, color: 'accent', gradient: 'from-accent-500 to-accent-600' },
  { key: 'conversion', name: '转化层', icon: ShoppingCart, color: 'success', gradient: 'from-success-500 to-success-600' },
  { key: 'loyalty', name: '忠诚层', icon: Repeat, color: 'warning', gradient: 'from-amber-500 to-amber-600' },
];

export default function KPIPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPlan, loadPlan, updateKPISettings, saveCurrentPlan } = useProjectStore();

  const [expandedLayer, setExpandedLayer] = useState<string | null>('awareness');
  const [showAddMetricModal, setShowAddMetricModal] = useState(false);
  const [addingCategory, setAddingCategory] = useState<string>('');
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);
  const [selectedAttributionModel, setSelectedAttributionModel] = useState('');

  useEffect(() => {
    if (id) {
      loadPlan(id);
    }
  }, [id, loadPlan]);

  useEffect(() => {
    if (currentPlan?.kpiSettings) {
      const settings = currentPlan.kpiSettings;
      setLoyaltyEnabled(!!settings.loyaltyMetrics && settings.loyaltyMetrics.length > 0);
      setSelectedAttributionModel(settings.attributionModel || '');
    }
  }, [currentPlan?.kpiSettings]);

  const kpiSettings = currentPlan?.kpiSettings;
  const brandInfoData = currentPlan?.brandInfo;
  const channelMatrixData = currentPlan?.channelMatrix;

  useEffect(() => {
    if (brandInfoData && channelMatrixData && kpiSettings && 
        kpiSettings.awarenessMetrics.length === 0 && 
        kpiSettings.engagementMetrics.length === 0 &&
        kpiSettings.conversionMetrics.length === 0) {
      const generated = generateKPISettings(brandInfoData, channelMatrixData);
      updateKPISettings(generated);
    }
  }, [brandInfoData, channelMatrixData, kpiSettings, updateKPISettings]);

  const funnelData = useMemo(() => {
    if (!kpiSettings) return [];
    
    const awarenessCount = kpiSettings.awarenessMetrics.length || 4;
    const engagementCount = kpiSettings.engagementMetrics.length || 4;
    const conversionCount = kpiSettings.conversionMetrics.length || 4;
    const loyaltyCount = (kpiSettings.loyaltyMetrics?.length || 0);
    
    return [
      { name: '认知层', value: 100, metrics: kpiSettings.awarenessMetrics, count: awarenessCount, fill: '#6366f1' },
      { name: '互动层', value: 65, metrics: kpiSettings.engagementMetrics, count: engagementCount, fill: '#8b5cf6' },
      { name: '转化层', value: 35, metrics: kpiSettings.conversionMetrics, count: conversionCount, fill: '#ec4899' },
      ...(loyaltyEnabled && loyaltyCount > 0 ? [{ name: '忠诚层', value: 20, metrics: kpiSettings.loyaltyMetrics, count: loyaltyCount, fill: '#f97316' }] : []),
    ];
  }, [kpiSettings, loyaltyEnabled]);

  const handleMetricTargetChange = (category: keyof KPISettings, index: number, value: string) => {
    if (!kpiSettings) return;
    
    const metrics = [...(kpiSettings[category] as KPIMetric[])];
    metrics[index] = { ...metrics[index], target: value };
    
    updateKPISettings({ [category]: metrics } as Partial<KPISettings>);
  };

  const handleAddMetric = (category: string) => {
    setAddingCategory(category);
    setShowAddMetricModal(true);
  };

  const handleRemoveMetric = (category: keyof KPISettings, index: number) => {
    if (!kpiSettings) return;
    
    const metrics = [...(kpiSettings[category] as KPIMetric[])];
    metrics.splice(index, 1);
    
    updateKPISettings({ [category]: metrics } as Partial<KPISettings>);
  };

  const handleSelectMetricFromLibrary = (metric: KPIMetric) => {
    if (!kpiSettings || !addingCategory) return;
    
    const category = addingCategory as keyof KPISettings;
    const currentMetrics = kpiSettings[category] as KPIMetric[] || [];
    
    if (currentMetrics.some(m => m.name === metric.name)) {
      return;
    }
    
    const updatedMetrics = [...currentMetrics, { ...metric, target: '' }];
    updateKPISettings({ [category]: updatedMetrics } as Partial<KPISettings>);
    setShowAddMetricModal(false);
    setAddingCategory('');
  };

  const getAvailableMetrics = (category: string) => {
    const libraryMap: Record<string, KPIMetric[]> = {
      awarenessMetrics: awarenessLibrary,
      engagementMetrics: engagementLibrary,
      conversionMetrics: conversionLibrary,
      loyaltyMetrics: loyaltyLibrary,
    };
    
    const library = libraryMap[category] || [];
    const currentMetrics = kpiSettings?.[addingCategory as keyof KPISettings] as KPIMetric[] || [];
    const currentNames = currentMetrics.map(m => m.name);
    
    return library.filter(m => !currentNames.includes(m.name));
  };

  const handleAttributionSelect = (modelName: string) => {
    setSelectedAttributionModel(modelName);
    updateKPISettings({ attributionModel: modelName });
  };

  const handleLoyaltyToggle = (enabled: boolean) => {
    setLoyaltyEnabled(enabled);
    if (enabled && (!kpiSettings?.loyaltyMetrics || kpiSettings.loyaltyMetrics.length === 0)) {
      const defaultLoyalty = loyaltyLibrary.slice(0, 3).map(m => ({
        name: m.name,
        description: m.description,
        target: '',
        unit: m.unit,
        measurementMethod: m.measurementMethod,
      }));
      updateKPISettings({ loyaltyMetrics: defaultLoyalty });
    } else if (!enabled) {
      updateKPISettings({ loyaltyMetrics: [] });
    }
  };

  const handleSave = () => {
    saveCurrentPlan();
  };

  const handlePrev = () => {
    saveCurrentPlan();
    navigate(`/project/${currentPlan?.project.id || 'new'}/channels`);
  };

  const handleNext = () => {
    saveCurrentPlan();
    navigate(`/project/${currentPlan?.project.id || 'new'}/schedule`);
  };

  const recommendedModel = useMemo(() => {
    if (!brandInfoData) return '';
    const industry = brandInfoData.industry.toLowerCase();
    if (industry.includes('快消') || industry.includes('电商') || industry.includes('零售')) {
      return '时间衰减归因';
    } else if (industry.includes('企业服务') || industry.includes('b2b') || industry.includes('教育')) {
      return 'U型归因（位置归因）';
    }
    return '线性归因';
  }, [brandInfoData]);

  const getAttributionVisual = (modelId: string) => {
    const visuals: Record<string, React.ReactNode> = {
      'first-click': (
        <div className="flex items-center gap-1">
          <div className="flex-1 h-3 rounded-full bg-primary-500" />
          <div className="flex-1 h-3 rounded-full bg-background-200" />
          <div className="flex-1 h-3 rounded-full bg-background-200" />
          <div className="flex-1 h-3 rounded-full bg-background-200" />
        </div>
      ),
      'last-click': (
        <div className="flex items-center gap-1">
          <div className="flex-1 h-3 rounded-full bg-background-200" />
          <div className="flex-1 h-3 rounded-full bg-background-200" />
          <div className="flex-1 h-3 rounded-full bg-background-200" />
          <div className="flex-1 h-3 rounded-full bg-primary-500" />
        </div>
      ),
      'linear': (
        <div className="flex items-center gap-1">
          <div className="flex-1 h-3 rounded-full bg-primary-400" />
          <div className="flex-1 h-3 rounded-full bg-primary-400" />
          <div className="flex-1 h-3 rounded-full bg-primary-400" />
          <div className="flex-1 h-3 rounded-full bg-primary-400" />
        </div>
      ),
      'time-decay': (
        <div className="flex items-center gap-1">
          <div className="flex-1 h-3 rounded-full bg-primary-200" />
          <div className="flex-1 h-3 rounded-full bg-primary-300" />
          <div className="flex-1 h-3 rounded-full bg-primary-400" />
          <div className="flex-1 h-3 rounded-full bg-primary-600" />
        </div>
      ),
      'u-shaped': (
        <div className="flex items-center gap-1">
          <div className="flex-1 h-3 rounded-full bg-primary-600" />
          <div className="flex-1 h-3 rounded-full bg-primary-200" />
          <div className="flex-1 h-3 rounded-full bg-primary-200" />
          <div className="flex-1 h-3 rounded-full bg-primary-600" />
        </div>
      ),
      'w-shaped': (
        <div className="flex items-center gap-1">
          <div className="flex-1 h-3 rounded-full bg-primary-500" />
          <div className="flex-1 h-3 rounded-full bg-primary-300" />
          <div className="flex-1 h-3 rounded-full bg-primary-500" />
          <div className="flex-1 h-3 rounded-full bg-primary-500" />
        </div>
      ),
      'data-driven': (
        <div className="flex items-center gap-1">
          <div className="flex-1 h-3 rounded-full bg-primary-400" />
          <div className="flex-1 h-3 rounded-full bg-primary-600" />
          <div className="flex-1 h-3 rounded-full bg-primary-300" />
          <div className="flex-1 h-3 rounded-full bg-primary-500" />
        </div>
      ),
    };
    return visuals[modelId] || visuals['linear'];
  };

  if (!kpiSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-background-500">加载中...</div>
      </div>
    );
  }

  const renderMetricCard = (
    metric: KPIMetric,
    index: number,
    category: keyof KPISettings,
    color: string
  ) => (
    <motion.div
      key={metric.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="p-4 bg-background-50 rounded-xl border border-background-100 hover:border-background-200 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-background-900 truncate">{metric.name}</h4>
          <p className="text-xs text-background-500 mt-0.5 line-clamp-2">{metric.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRemoveMetric(category, index)}
          className="text-background-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0 ml-2"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-background-600 mb-1 block">目标值</label>
          <div className="flex items-center gap-2">
            <Input
              value={metric.target}
              onChange={(e) => handleMetricTargetChange(category, index, e.target.value)}
              placeholder="输入目标值"
              size="sm"
              className="flex-1"
            />
            <span className="text-sm text-background-500 flex-shrink-0 w-12">{metric.unit}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-background-100">
          <div className="flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-background-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-background-500">
              <span className="font-medium text-background-600">测量方法：</span>
              {metric.measurementMethod}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background-50">
      <div className="sticky top-0 z-50 bg-white border-b border-background-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="md"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={handlePrev}
              >
                返回
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-background-900">KPI与归因</h1>
                <p className="text-sm text-background-500 mt-0.5">设置营销效果评估指标和归因模型</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="md" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
                保存草稿
              </Button>
              <Button variant="primary" size="md" rightIcon={<ChevronRight className="w-4 h-4" />} onClick={handleNext}>
                下一步
              </Button>
            </div>
          </div>
          <StepIndicator steps={steps} currentStep={4} showLabels={true} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* KPI体系总览 - 漏斗图 */}
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
                      <BarChart3 className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-background-900">KPI体系总览</h3>
                      <p className="text-sm text-background-500 mt-0.5">四层漏斗模型，从认知到忠诚完整追踪营销效果</p>
                    </div>
                  </div>
                }
              />
              <CardBody>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <FunnelChart>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white rounded-lg shadow-lg border border-background-100 p-3">
                                  <p className="font-semibold text-background-900">{data.name}</p>
                                  <p className="text-sm text-background-500">{data.count} 个指标</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Funnel dataKey="value" isAnimationActive>
                          {funnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                          <LabelList
                            dataKey="name"
                            position="center"
                            fill="#fff"
                            stroke="none"
                            fontSize={14}
                            fontWeight={600}
                          />
                        </Funnel>
                      </FunnelChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    {funnelLayerConfig.map((layer, index) => {
                      const isExpanded = expandedLayer === layer.key;
                      const metrics = kpiSettings[`${layer.key}Metrics` as keyof KPISettings] as KPIMetric[];
                      const hasMetrics = metrics && metrics.length > 0;
                      const isLoyalty = layer.key === 'loyalty';
                      
                      if (isLoyalty && !loyaltyEnabled) return null;

                      return (
                        <motion.div
                          key={layer.key}
                          className={cn(
                            'rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden',
                            isExpanded
                              ? 'border-primary-300 bg-primary-50/50'
                              : 'border-background-200 bg-white hover:border-background-300'
                          )}
                          onClick={() => setExpandedLayer(isExpanded ? null : layer.key)}
                        >
                          <div className="flex items-center gap-3 p-4">
                            <div className={cn(
                              'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white',
                              layer.gradient
                            )}>
                              <layer.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-background-900">{layer.name}</h4>
                                {hasMetrics && (
                                  <Badge color={layer.color as any} size="sm" count={metrics.length} />
                                )}
                              </div>
                              <p className="text-xs text-background-500 mt-0.5">
                                {hasMetrics ? metrics.map(m => m.name).slice(0, 3).join('、') + (metrics.length > 3 ? '...' : '') : '暂无指标'}
                              </p>
                            </div>
                            <ChevronDown className={cn(
                              'w-5 h-5 text-background-400 transition-transform duration-300',
                              isExpanded && 'rotate-180'
                            )} />
                          </div>
                          
                          <AnimatePresence>
                            {isExpanded && hasMetrics && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 border-t border-primary-100 pt-3">
                                  <div className="space-y-2">
                                    {metrics.map((metric: KPIMetric, i: number) => (
                                      <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-background-700">{metric.name}</span>
                                        <span className="font-medium text-background-900">
                                          {metric.target || '待设置'} {metric.unit}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* 品牌认知类指标 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-background-900">品牌认知类指标</h3>
                      <p className="text-sm text-background-500 mt-0.5">衡量品牌曝光和用户认知程度</p>
                    </div>
                  </div>
                }
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => handleAddMetric('awarenessMetrics')}
                  >
                    添加指标
                  </Button>
                }
              />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kpiSettings.awarenessMetrics.map((metric, index) =>
                    renderMetricCard(metric, index, 'awarenessMetrics', 'primary')
                  )}
                </div>
                
                {kpiSettings.awarenessMetrics.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background-100 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-background-400" />
                    </div>
                    <p className="text-background-500 mb-4">还没有添加认知类指标</p>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={() => handleAddMetric('awarenessMetrics')}
                    >
                      添加第一个指标
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* 用户互动类指标 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-background-900">用户互动类指标</h3>
                      <p className="text-sm text-background-500 mt-0.5">衡量用户与品牌内容的互动程度</p>
                    </div>
                  </div>
                }
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => handleAddMetric('engagementMetrics')}
                  >
                    添加指标
                  </Button>
                }
              />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kpiSettings.engagementMetrics.map((metric, index) =>
                    renderMetricCard(metric, index, 'engagementMetrics', 'accent')
                  )}
                </div>
                
                {kpiSettings.engagementMetrics.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background-100 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-background-400" />
                    </div>
                    <p className="text-background-500 mb-4">还没有添加互动类指标</p>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={() => handleAddMetric('engagementMetrics')}
                    >
                      添加第一个指标
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* 转化效果类指标 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-background-900">转化效果类指标</h3>
                      <p className="text-sm text-background-500 mt-0.5">衡量营销带来的转化和销售效果</p>
                    </div>
                  </div>
                }
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => handleAddMetric('conversionMetrics')}
                  >
                    添加指标
                  </Button>
                }
              />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kpiSettings.conversionMetrics.map((metric, index) =>
                    renderMetricCard(metric, index, 'conversionMetrics', 'success')
                  )}
                </div>
                
                {kpiSettings.conversionMetrics.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background-100 flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-background-400" />
                    </div>
                    <p className="text-background-500 mb-4">还没有添加转化类指标</p>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={() => handleAddMetric('conversionMetrics')}
                    >
                      添加第一个指标
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* 用户忠诚类指标 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      loyaltyEnabled ? 'bg-amber-100' : 'bg-background-100'
                    )}>
                      <Repeat className={cn(
                        'w-5 h-5',
                        loyaltyEnabled ? 'text-amber-600' : 'text-background-400'
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-background-900">用户忠诚类指标</h3>
                        <Tag color="gray" size="sm">可选</Tag>
                      </div>
                      <p className="text-sm text-background-500 mt-0.5">衡量用户留存、复购和口碑传播</p>
                    </div>
                  </div>
                }
                action={
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleLoyaltyToggle(!loyaltyEnabled)}
                      className={cn(
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-300',
                        loyaltyEnabled ? 'bg-primary-500' : 'bg-background-200'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          loyaltyEnabled ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>
                }
              />
              <CardBody>
                <AnimatePresence>
                  {loyaltyEnabled ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {kpiSettings.loyaltyMetrics?.map((metric, index) =>
                          renderMetricCard(metric, index, 'loyaltyMetrics', 'warning')
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={() => handleAddMetric('loyaltyMetrics')}
                        className="border-dashed"
                      >
                        添加忠诚类指标
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background-100 flex items-center justify-center">
                        <Repeat className="w-8 h-8 text-background-400" />
                      </div>
                      <p className="text-background-500 mb-2">用户忠诚类指标未启用</p>
                      <p className="text-xs text-background-400 mb-4">
                        适用于有复购需求的品牌，如电商、订阅服务等
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleLoyaltyToggle(true)}
                      >
                        启用忠诚指标
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardBody>
            </Card>
          </motion.div>

          {/* 归因模型选择 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-background-900">归因模型选择</h3>
                        <Badge color="accent" size="sm">
                          <Star className="w-3 h-3 mr-1" />
                          推荐
                        </Badge>
                      </div>
                      <p className="text-sm text-background-500 mt-0.5">选择适合您业务的归因模型，准确评估各渠道贡献</p>
                    </div>
                  </div>
                }
                subtitle={`推荐模型：${recommendedModel}`}
              />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {attributionModels.map((model, index) => {
                    const isSelected = selectedAttributionModel === model.name;
                    const isRecommended = model.name === recommendedModel;
                    
                    return (
                      <motion.div
                        key={model.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => handleAttributionSelect(model.name)}
                        className={cn(
                          'relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300',
                          'hover:shadow-md hover:-translate-y-0.5',
                          isSelected
                            ? 'border-primary-500 bg-primary-50 shadow-primary-sm'
                            : 'border-background-200 bg-white hover:border-primary-300'
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center z-10"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                        
                        {isRecommended && !isSelected && (
                          <div className="absolute top-3 right-3">
                            <Badge color="accent" size="sm">
                              推荐
                            </Badge>
                          </div>
                        )}

                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                          isSelected ? 'bg-primary-500 text-white' : 'bg-background-100 text-background-600'
                        )}>
                          <Gauge className="w-6 h-6" />
                        </div>

                        <h4 className={cn(
                          'font-semibold mb-1.5',
                          isSelected ? 'text-primary-700' : 'text-background-900'
                        )}>
                          {model.name}
                        </h4>
                        
                        <p className="text-xs text-background-500 mb-4 line-clamp-2">
                          {model.description}
                        </p>

                        <div className="mb-4">
                          <p className="text-xs text-background-400 mb-2">原理图</p>
                          {getAttributionVisual(model.id)}
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full',
                            model.complexity === 'low' ? 'bg-green-100 text-green-700' :
                            model.complexity === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          )}>
                            复杂度: {model.complexity === 'low' ? '低' : model.complexity === 'medium' ? '中' : '高'}
                          </span>
                          <span className={cn(
                            'px-2 py-0.5 rounded-full',
                            model.accuracy === 'low' ? 'bg-gray-100 text-gray-700' :
                            model.accuracy === 'medium' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          )}>
                            准确度: {model.accuracy === 'low' ? '低' : model.accuracy === 'medium' ? '中' : '高'}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {selectedAttributionModel && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-5 bg-primary-50 rounded-xl border border-primary-100"
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary-900 mb-2">
                          {selectedAttributionModel} - 详细说明
                        </h4>
                        {(() => {
                          const model = attributionModels.find(m => m.name === selectedAttributionModel);
                          if (!model) return null;
                          return (
                            <div className="space-y-3 text-sm text-primary-800">
                              <p><span className="font-medium">工作原理：</span>{model.howItWorks}</p>
                              <p><span className="font-medium">计算公式：</span>{model.formula}</p>
                              <div>
                                <p className="font-medium mb-1">优势：</p>
                                <ul className="list-disc list-inside text-primary-700">
                                  {model.advantages.map((adv, i) => (
                                    <li key={i}>{adv}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium mb-1">适用场景：</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {model.suitableScenarios.map((scene, i) => (
                                    <Tag key={i} color="primary" size="sm">{scene}</Tag>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* 监测方案 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-background-900">监测方案</h3>
                      <p className="text-sm text-background-500 mt-0.5">推荐的监测工具和数据追踪方案</p>
                    </div>
                  </div>
                }
              />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary-600" />
                      </div>
                      <h4 className="font-semibold text-background-900">推荐监测工具</h4>
                    </div>
                    <div className="space-y-2">
                      {kpiSettings.monitoringPlan.tools.map((tool, index) => {
                        const toolInfo = monitoringTools.find(t => t.name === tool);
                        return (
                          <div
                            key={index}
                            className="p-3 bg-background-50 rounded-lg border border-background-100 hover:border-primary-200 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-primary-500" />
                              <span className="text-sm font-medium text-background-900">{tool}</span>
                            </div>
                            {toolInfo && (
                              <p className="text-xs text-background-500 mt-1 ml-6">
                                {toolInfo.description}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-accent-600" />
                      </div>
                      <h4 className="font-semibold text-background-900">监测频率</h4>
                    </div>
                    <div className="p-4 bg-background-50 rounded-lg border border-background-100">
                      <p className="text-sm text-background-700 leading-relaxed">
                        {kpiSettings.monitoringPlan.frequency || '根据具体需求确定监测频率'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center">
                        <FileBarChart className="w-4 h-4 text-success-600" />
                      </div>
                      <h4 className="font-semibold text-background-900">报表格式</h4>
                    </div>
                    <div className="p-4 bg-background-50 rounded-lg border border-background-100 mb-4">
                      <p className="text-sm text-background-700 leading-relaxed">
                        {kpiSettings.monitoringPlan.reportingFormat || '根据团队需求确定报表格式'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-warning-100 flex items-center justify-center">
                        <LayoutDashboard className="w-4 h-4 text-amber-600" />
                      </div>
                      <h4 className="font-semibold text-background-900">数据看板建议</h4>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">建议搭建实时数据看板</p>
                          <p className="text-amber-700 text-xs">
                            包含核心KPI趋势图、渠道效果对比、转化漏斗分析等模块，便于实时监控营销效果
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* 底部导航 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<ChevronLeft className="w-5 h-5" />}
              onClick={handlePrev}
            >
              上一步：渠道矩阵
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Save className="w-5 h-5" />}
                onClick={handleSave}
              >
                保存
              </Button>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ChevronRight className="w-5 h-5" />}
                onClick={handleNext}
              >
                下一步：执行排期
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 添加指标弹窗 */}
      <AnimatePresence>
        {showAddMetricModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowAddMetricModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-background-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-background-900">
                    选择{addingCategory === 'awarenessMetrics' ? '认知类' :
                         addingCategory === 'engagementMetrics' ? '互动类' :
                         addingCategory === 'conversionMetrics' ? '转化类' :
                         '忠诚类'}指标
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMetricModal(false);
                      setAddingCategory('');
                    }}
                    className="p-1 rounded-lg hover:bg-background-100 text-background-400 hover:text-background-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {getAvailableMetrics(addingCategory).map((metric, index) => {
                    const isSelected = false;
                    return (
                      <motion.div
                        key={metric.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        onClick={() => handleSelectMetricFromLibrary(metric)}
                        className={cn(
                          'p-4 rounded-xl border cursor-pointer transition-all duration-200',
                          'hover:border-primary-300 hover:bg-primary-50/50',
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-background-200 bg-white'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-background-900">{metric.name}</h4>
                            <p className="text-xs text-background-500 mt-1">{metric.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-background-400">
                                单位：{metric.unit}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-background-300" />
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {getAvailableMetrics(addingCategory).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-background-500">所有可用指标都已添加</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-background-100 bg-background-50">
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setShowAddMetricModal(false);
                      setAddingCategory('');
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
