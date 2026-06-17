import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Save,
  RefreshCw,
  Wand2,
  Lightbulb,
  MessageSquare,
  Target,
  Check,
  Plus,
  Trash2,
  Edit3,
  Zap,
  BookOpen,
  Layers,
  ArrowRight,
  Copy,
  Flame,
  TrendingUp,
  Clock,
  AlertTriangle,
  BarChart3,
  Info,
  Shield,
  Users,
  Video,
  FileText,
  Image,
  Radio,
  Vote,
  PlayCircle,
  ChevronDown,
} from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { generateStrategy, creativeFrameworks } from '@/engine/strategyEngine';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Tag from '@/components/ui/Tag';
import StepIndicator from '@/components/ui/StepIndicator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, label: '品牌信息' },
  { id: 2, label: '人群画像' },
  { id: 3, label: '传播策略' },
  { id: 4, label: '渠道矩阵' },
  { id: 5, label: 'KPI设置' },
  { id: 6, label: '执行方案' },
];

const generationSteps = [
  { id: 'analyze', label: '分析品牌', icon: Zap },
  { id: 'insight', label: '洞察人群', icon: Target },
  { id: 'strategy', label: '构建策略', icon: Lightbulb },
  { id: 'creative', label: '生成创意', icon: Sparkles },
];

interface KeyMessage {
  id: string;
  title: string;
  description: string;
}

const heatLevelConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  explosive: { label: '爆', color: 'text-red-600', bgColor: 'bg-red-100' },
  boiling: { label: '沸', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  hot: { label: '热', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  warm: { label: '温', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  rising: { label: '升', color: 'text-green-600', bgColor: 'bg-green-100' },
};

const priorityLevelConfig: Record<string, { label: string; color: string; ringColor: string }> = {
  's-tier': { label: 'S级', color: 'text-red-600 bg-red-50', ringColor: 'ring-red-200' },
  'a-tier': { label: 'A级', color: 'text-orange-600 bg-orange-50', ringColor: 'ring-orange-200' },
  'b-tier': { label: 'B级', color: 'text-amber-600 bg-amber-50', ringColor: 'ring-amber-200' },
  'c-tier': { label: 'C级', color: 'text-gray-600 bg-gray-50', ringColor: 'ring-gray-200' },
};

const platformConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  weibo: { label: '微博', color: 'text-red-600 bg-red-50', icon: <Flame className="w-3.5 h-3.5" /> },
  douyin: { label: '抖音', color: 'text-pink-600 bg-pink-50', icon: <Video className="w-3.5 h-3.5" /> },
  xiaohongshu: { label: '小红书', color: 'text-rose-600 bg-rose-50', icon: <BookOpen className="w-3.5 h-3.5" /> },
  zhihu: { label: '知乎', color: 'text-blue-600 bg-blue-50', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  bilibili: { label: 'B站', color: 'text-sky-600 bg-sky-50', icon: <PlayCircle className="w-3.5 h-3.5" /> },
};

const urgencyConfig: Record<string, { label: string; textColor: string; dotColor: string }> = {
  critical: { label: '紧急', textColor: 'text-red-600', dotColor: 'bg-red-500' },
  high: { label: '较高', textColor: 'text-orange-600', dotColor: 'bg-orange-500' },
  medium: { label: '中等', textColor: 'text-amber-600', dotColor: 'bg-amber-500' },
  low: { label: '较低', textColor: 'text-gray-500', dotColor: 'bg-gray-400' },
};

const phaseConfig: Record<string, { label: string; color: string }> = {
  rising: { label: '上升期', color: 'text-green-600 bg-green-50' },
  peak: { label: '爆发期', color: 'text-red-600 bg-red-50' },
  declining: { label: '衰退期', color: 'text-amber-600 bg-amber-50' },
  cooling: { label: '冷却期', color: 'text-gray-500 bg-gray-50' },
};

const formatTypeIcon: Record<string, React.ReactNode> = {
  shortVideo: <Video className="w-4 h-4" />,
  longVideo: <PlayCircle className="w-4 h-4" />,
  longArticle: <FileText className="w-4 h-4" />,
  shortPost: <MessageSquare className="w-4 h-4" />,
  imageSet: <Image className="w-4 h-4" />,
  liveStream: <Radio className="w-4 h-4" />,
  interactive: <Vote className="w-4 h-4" />,
};

interface ExpandedTopics {
  [key: string]: { angles: boolean; content: boolean };
}

export default function StrategyPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPlan, loadPlan, updateStrategy, saveCurrentPlan, generateHotTopicRecommendations, error } = useProjectStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [activeVersion, setActiveVersion] = useState(0);
  const [editingCoreIdea, setEditingCoreIdea] = useState(false);
  const [editingTheme, setEditingTheme] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [localKeyMessages, setLocalKeyMessages] = useState<KeyMessage[]>([]);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<ExpandedTopics>({});
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (id && (!currentPlan || currentPlan.project.id !== id)) {
      loadPlan(id);
    }
  }, [id, currentPlan, loadPlan]);

  useEffect(() => {
    if (error && !currentPlan && id) {
      navigate('/', { replace: true });
    }
  }, [error, currentPlan, id, navigate]);

  useEffect(() => {
    if (currentPlan?.strategy?.keyMessages) {
      const messages = currentPlan.strategy.keyMessages.map((msg, index) => ({
        id: `msg-${index}`,
        title: `核心信息 ${index + 1}`,
        description: msg,
      }));
      setLocalKeyMessages(messages);
    }
  }, [currentPlan?.strategy?.keyMessages]);

  const strategy = currentPlan?.strategy;
  const brandInfo = currentPlan?.brandInfo;
  const targetAudience = currentPlan?.targetAudience;

  const hasStrategy = strategy?.coreIdea && strategy.coreIdea.length > 0;

  const missingInfo = useMemo(() => {
    const missing: string[] = [];
    if (!brandInfo?.brandName?.trim()) missing.push('品牌名称');
    if (!brandInfo?.industry) missing.push('所属行业');
    if (!brandInfo?.brandTone) missing.push('品牌调性');
    if (!targetAudience?.demographics?.ageRange) missing.push('年龄段');
    if (!targetAudience?.demographics?.gender) missing.push('性别分布');
    if (!targetAudience?.interests || targetAudience.interests.length === 0) missing.push('兴趣爱好');
    return missing;
  }, [brandInfo, targetAudience]);

  const canGenerate = missingInfo.length === 0;

  const currentFramework = useMemo(() => {
    if (!strategy?.strategyFramework) return null;
    return creativeFrameworks.find((fw) => fw.name === strategy.strategyFramework);
  }, [strategy?.strategyFramework]);

  const handleGenerate = async () => {
    if (!brandInfo || !targetAudience || !canGenerate) return;

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationStep(0);

    try {
      for (let i = 0; i < generationSteps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));
        setGenerationStep(i);
      }

      const newStrategy = generateStrategy(brandInfo, targetAudience);
      updateStrategy(newStrategy);
      setActiveVersion(0);
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : '策略生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    await handleGenerate();
  };

  const handleNewVersion = () => {
    if (!brandInfo || !targetAudience || !strategy?.versions) return;

    const newStrategy = generateStrategy(brandInfo, targetAudience);
    const updatedVersions = [...(strategy.versions || [])];
    if (updatedVersions.length >= 3) {
      updatedVersions[activeVersion] = {
        id: `v${Date.now()}`,
        name: newStrategy.strategyFramework + '方向',
        coreIdea: newStrategy.coreIdea,
      };
    } else {
      updatedVersions.push({
        id: `v${Date.now()}`,
        name: newStrategy.strategyFramework + '方向',
        coreIdea: newStrategy.coreIdea,
      });
    }

    updateStrategy({
      ...newStrategy,
      versions: updatedVersions,
    });
  };

  const handleUseVersion = (index: number) => {
    if (!strategy?.versions || !strategy.versions[index]) return;

    const version = strategy.versions[index];
    const framework = creativeFrameworks.find((fw) => version.name.includes(fw.name));

    updateStrategy({
      coreIdea: version.coreIdea,
      strategyFramework: framework?.name || strategy.strategyFramework,
    });
    setActiveVersion(index);
  };

  const handleCoreIdeaChange = (value: string) => {
    updateStrategy({ coreIdea: value });
  };

  const handleThemeChange = (value: string) => {
    updateStrategy({ campaignTheme: value });
  };

  const handleAddMessage = () => {
    const newId = `msg-${Date.now()}`;
    const newMessage: KeyMessage = {
      id: newId,
      title: `核心信息 ${localKeyMessages.length + 1}`,
      description: '',
    };
    const updated = [...localKeyMessages, newMessage];
    setLocalKeyMessages(updated);
    updateStrategy({ keyMessages: updated.map((m) => m.description) });
    setEditingMessageId(newId);
  };

  const handleRemoveMessage = (id: string) => {
    const updated = localKeyMessages.filter((m) => m.id !== id);
    setLocalKeyMessages(updated);
    updateStrategy({ keyMessages: updated.map((m) => m.description) });
  };

  const handleMessageChange = (id: string, field: 'title' | 'description', value: string) => {
    const updated = localKeyMessages.map((m) =>
      m.id === id ? { ...m, [field]: value } : m
    );
    setLocalKeyMessages(updated);
    if (field === 'description') {
      updateStrategy({ keyMessages: updated.map((m) => m.description) });
    }
  };

  const hotTopicRecs = currentPlan?.hotTopicRecommendations;
  const hasHotTopics = hotTopicRecs && hotTopicRecs.recommendations.length > 0;

  const handleGenerateHotTopics = async () => {
    if (!brandInfo?.brandName || !brandInfo?.industry) return;

    setIsGeneratingTopics(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      generateHotTopicRecommendations({
        maxRecommendations: 6,
      });
    } catch (err) {
      console.error('热点借势推荐生成失败:', err);
    } finally {
      setIsGeneratingTopics(false);
    }
  };

  const handleRefreshHotTopics = async () => {
    await handleGenerateHotTopics();
  };

  const toggleTopicSection = (topicId: string, section: 'angles' | 'content') => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: {
        angles: section === 'angles' ? !prev[topicId]?.angles : (prev[topicId]?.angles ?? false),
        content: section === 'content' ? !prev[topicId]?.content : (prev[topicId]?.content ?? false),
      },
    }));
  };

  const formatHeatIndex = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  const handleSave = () => {
    saveCurrentPlan();
  };

  const handlePrev = () => {
    saveCurrentPlan();
    navigate(`/project/${id}/audience`);
  };

  const handleNext = () => {
    saveCurrentPlan();
    navigate(`/project/${id}/channels`);
  };

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
          <p className="text-background-500 mb-4">加载中...</p>
          <Button variant="outline" onClick={() => navigate('/', { replace: true })}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-background-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                返回首页
              </Button>
              <div className="h-6 w-px bg-background-200" />
              <h1 className="text-xl font-bold text-background-900">传播策略</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              leftIcon={<Save className="w-4 h-4" />}
            >
              保存
            </Button>
          </div>
          <StepIndicator steps={steps} currentStep={2} showLabels={true} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden">
              <CardBody className="py-8">
                <div className="flex flex-col items-center justify-center">
                  {isGenerating ? (
                    <div className="w-full max-w-lg">
                      <div className="text-center mb-8">
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
                          className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-200"
                        >
                          <Sparkles className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-background-900 mb-2">
                          正在生成传播策略...
                        </h3>
                        <p className="text-background-500">
                          我们正在根据您的品牌和人群信息，精心打造专属传播策略
                        </p>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {generationSteps.map((step, index) => {
                          const Icon = step.icon;
                          const isActive = index === generationStep;
                          const isCompleted = index < generationStep;

                          return (
                            <div key={step.id} className="flex flex-col items-center">
                              <motion.div
                                animate={
                                  isActive
                                    ? {
                                        scale: [1, 1.1, 1],
                                        boxShadow: [
                                          '0 0 0 0 rgba(59, 130, 246, 0.4)',
                                          '0 0 0 10px rgba(59, 130, 246, 0)',
                                          '0 0 0 0 rgba(59, 130, 246, 0)',
                                        ],
                                      }
                                    : {}
                                }
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                }}
                                className={cn(
                                  'w-14 h-14 rounded-xl flex items-center justify-center mb-2 transition-all duration-300',
                                  isCompleted
                                    ? 'bg-success-100 text-success-600'
                                    : isActive
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-300'
                                    : 'bg-background-100 text-background-400'
                                )}
                              >
                                {isCompleted ? (
                                  <Check className="w-6 h-6" />
                                ) : (
                                  <Icon className="w-6 h-6" />
                                )}
                              </motion.div>
                              <span
                                className={cn(
                                  'text-sm font-medium',
                                  isActive
                                    ? 'text-primary-600'
                                    : isCompleted
                                    ? 'text-success-600'
                                    : 'text-background-400'
                                )}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-8 h-2 bg-background-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ) : hasStrategy ? (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-success-400 to-primary-500 flex items-center justify-center shadow-lg shadow-success-200">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-background-900 mb-2">
                        策略已生成
                      </h3>
                      <p className="text-background-500 mb-6">
                        基于品牌信息和人群画像，为您生成了专属传播策略
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          leftIcon={<RefreshCw className="w-5 h-5" />}
                          onClick={handleRegenerate}
                        >
                          重新生成
                        </Button>
                        <Button
                          variant="primary"
                          size="lg"
                          leftIcon={<Wand2 className="w-5 h-5" />}
                          onClick={handleNewVersion}
                        >
                          换一个版本
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-primary-500" />
                      </div>
                      <h3 className="text-xl font-bold text-background-900 mb-2">
                        生成传播策略
                      </h3>
                      <p className="text-background-500 mb-6 max-w-md">
                        基于您的品牌信息和目标人群画像，智能生成专属的传播策略方案
                      </p>
                      <Button
                        variant="primary"
                        size="lg"
                        leftIcon={<Wand2 className="w-5 h-5" />}
                        onClick={handleGenerate}
                        disabled={!canGenerate}
                      >
                        生成策略
                      </Button>
                      {!canGenerate && (
                        <div className="mt-3">
                          <p className="text-sm text-amber-600 mb-1.5">
                            请先完成以下必填项：
                          </p>
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {missingInfo.map((item) => (
                              <span key={item} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {generationError && (
                        <div className="mt-4 p-4 bg-red-50 rounded-xl">
                          <p className="text-sm text-red-700">{generationError}</p>
                          <Button variant="outline" size="sm" className="mt-2" onClick={handleGenerate}>
                            重试
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <AnimatePresence>
            {hasStrategy && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="overflow-hidden border-0 shadow-xl">
                    <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-8 md:p-10">
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-accent-400/20 rounded-full blur-3xl" />
                      </div>

                      <div className="relative">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-white/80" />
                            <span className="text-white/80 text-sm font-medium">核心创意概念</span>
                          </div>
                          {currentFramework && (
                            <Tag
                              color="gray"
                              size="sm"
                              className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                            >
                              {currentFramework.name}
                            </Tag>
                          )}
                        </div>

                        {editingCoreIdea ? (
                          <div>
                            <textarea
                              value={strategy?.coreIdea || ''}
                              onChange={(e) => handleCoreIdeaChange(e.target.value)}
                              onBlur={() => setEditingCoreIdea(false)}
                              autoFocus
                              className="w-full text-2xl md:text-3xl font-bold text-white bg-white/10 border-2 border-white/30 rounded-xl p-4 focus:outline-none focus:border-white/50 placeholder:text-white/50 resize-none min-h-[120px]"
                            />
                            <p className="mt-2 text-white/60 text-sm">点击外部区域完成编辑</p>
                          </div>
                        ) : (
                          <div
                            onClick={() => setEditingCoreIdea(true)}
                            className="cursor-pointer group"
                          >
                            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight group-hover:text-white/90 transition-colors">
                              {strategy?.coreIdea}
                            </h2>
                            <div className="mt-3 flex items-center gap-1 text-white/60 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <Edit3 className="w-4 h-4" />
                              <span>点击编辑</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader
                      title={
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-accent-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-background-900">传播主题</h3>
                            <p className="text-sm text-background-500 mt-0.5">本次传播活动的核心主题和口号</p>
                          </div>
                        </div>
                      }
                    />
                    <CardBody>
                      {editingTheme ? (
                        <div className="space-y-4">
                          <Input
                            label="主标题"
                            size="lg"
                            value={strategy?.campaignTheme || ''}
                            onChange={(e) => handleThemeChange(e.target.value)}
                            onBlur={() => setEditingTheme(false)}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingTheme(true)}
                          className="cursor-pointer group p-6 rounded-xl bg-background-50 border-2 border-dashed border-transparent hover:border-primary-200 hover:bg-primary-50/30 transition-all"
                        >
                          <h4 className="text-xl font-bold text-background-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {strategy?.campaignTheme || '暂无传播主题'}
                          </h4>
                          <div className="flex items-center gap-1 text-background-400 text-sm">
                            <Edit3 className="w-4 h-4" />
                            <span>点击编辑传播主题</span>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader
                      title={
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
                            <Target className="w-5 h-5 text-success-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-background-900">关键信息</h3>
                            <p className="text-sm text-background-500 mt-0.5">传播中需要传递的核心信息点</p>
                          </div>
                        </div>
                      }
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Plus className="w-4 h-4" />}
                          onClick={handleAddMessage}
                        >
                          添加信息
                        </Button>
                      }
                    />
                    <CardBody>
                      <div className="space-y-4">
                        {localKeyMessages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="relative p-5 rounded-xl border border-background-200 bg-white hover:border-primary-200 hover:shadow-sm transition-all group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 text-white text-sm font-bold flex items-center justify-center">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  {editingMessageId === message.id ? (
                                    <div className="space-y-3">
                                      <Input
                                        size="sm"
                                        value={message.title}
                                        onChange={(e) =>
                                          handleMessageChange(message.id, 'title', e.target.value)
                                        }
                                        placeholder="信息标题"
                                      />
                                      <Input
                                        multiline
                                        size="md"
                                        value={message.description}
                                        onChange={(e) =>
                                          handleMessageChange(message.id, 'description', e.target.value)
                                        }
                                        onBlur={() => setEditingMessageId(null)}
                                        placeholder="信息详细说明..."
                                        autoFocus
                                        rows={3}
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => setEditingMessageId(message.id)}
                                      className="cursor-pointer"
                                    >
                                      <h4 className="font-semibold text-background-900 mb-1 group-hover:text-primary-600 transition-colors">
                                        {message.title}
                                      </h4>
                                      <p className="text-sm text-background-600 leading-relaxed">
                                        {message.description || '点击编辑关键信息...'}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMessage(message.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}

                        {localKeyMessages.length === 0 && (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background-100 flex items-center justify-center">
                              <MessageSquare className="w-8 h-8 text-background-400" />
                            </div>
                            <p className="text-background-500 mb-4">还没有添加关键信息</p>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Plus className="w-4 h-4" />}
                              onClick={handleAddMessage}
                            >
                              添加第一条关键信息
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>

                {currentFramework && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Card>
                      <CardHeader
                        title={
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-background-900">策略框架说明</h3>
                              <p className="text-sm text-background-500 mt-0.5">了解策略背后的逻辑和执行方式</p>
                            </div>
                          </div>
                        }
                      />
                      <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-5 rounded-xl bg-primary-50/50 border border-primary-100">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                              <Layers className="w-5 h-5 text-primary-600" />
                            </div>
                            <h4 className="font-semibold text-background-900 mb-2">使用框架</h4>
                            <p className="text-lg font-bold text-primary-600 mb-2">
                              {currentFramework.name}
                            </p>
                            <p className="text-sm text-background-600">
                              {currentFramework.description}
                            </p>
                          </div>

                          <div className="p-5 rounded-xl bg-accent-50/50 border border-accent-100">
                            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                              <Lightbulb className="w-5 h-5 text-accent-600" />
                            </div>
                            <h4 className="font-semibold text-background-900 mb-2">核心逻辑</h4>
                            <p className="text-sm text-background-600 leading-relaxed">
                              {currentFramework.coreLogic}
                            </p>
                          </div>

                          <div className="p-5 rounded-xl bg-success-50/50 border border-success-100">
                            <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center mb-4">
                              <Zap className="w-5 h-5 text-success-600" />
                            </div>
                            <h4 className="font-semibold text-background-900 mb-2">如何执行</h4>
                            <p className="text-sm text-background-600 leading-relaxed">
                              围绕核心创意概念，通过多渠道触达目标人群，
                              持续强化关键信息，建立品牌认知和情感连接。
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}

                {strategy?.versions && strategy.versions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Card>
                      <CardHeader
                        title={
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                              <Copy className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-background-900">创意版本</h3>
                              <p className="text-sm text-background-500 mt-0.5">多个方向的创意方案，选择最适合的版本</p>
                            </div>
                          </div>
                        }
                      />
                      <CardBody>
                        <Tabs defaultValue="0" onValueChange={(v) => setActiveVersion(Number(v))}>
                          <TabsList className="mb-6">
                            {strategy.versions.map((version, index) => (
                              <TabsTrigger key={version.id} value={String(index)}>
                                版本 {index + 1}
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {strategy.versions.map((version, index) => (
                            <TabsContent key={version.id} value={String(index)}>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-6 rounded-xl bg-gradient-to-br from-background-50 to-background-100 border border-background-200"
                              >
                                <div className="flex items-start justify-between gap-6">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Tag color="accent" size="sm">
                                        {version.name}
                                      </Tag>
                                      {activeVersion === index && strategy?.coreIdea === version.coreIdea && (
                                        <Tag color="success" size="sm">
                                          当前使用
                                        </Tag>
                                      )}
                                    </div>
                                    <p className="text-lg font-semibold text-background-900 leading-relaxed">
                                      {version.coreIdea}
                                    </p>
                                  </div>
                                  <Button
                                    variant={strategy?.coreIdea === version.coreIdea ? 'secondary' : 'primary'}
                                    size="md"
                                    onClick={() => handleUseVersion(index)}
                                    rightIcon={<ArrowRight className="w-4 h-4" />}
                                    disabled={strategy?.coreIdea === version.coreIdea}
                                  >
                                    {strategy?.coreIdea === version.coreIdea ? '已选择' : '使用此版本'}
                                  </Button>
                                </div>
                              </motion.div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Card>
                    <CardHeader
                      title={
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200">
                            <Flame className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-background-900">热点借势推荐</h3>
                            <p className="text-sm text-background-500 mt-0.5">实时监测社媒热点，智能筛选可借势话题</p>
                          </div>
                        </div>
                      }
                      action={
                        hasHotTopics ? (
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<RefreshCw className={cn("w-4 h-4", isGeneratingTopics && "animate-spin")} />}
                            onClick={handleRefreshHotTopics}
                            disabled={isGeneratingTopics || !hasStrategy}
                          >
                            刷新热点
                          </Button>
                        ) : null
                      }
                    />
                    <CardBody>
                      {!hasStrategy ? (
                        <div className="text-center py-10">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background-100 flex items-center justify-center">
                            <Flame className="w-8 h-8 text-background-400" />
                          </div>
                          <p className="text-background-500 mb-3">请先生成传播策略后再获取热点借势推荐</p>
                        </div>
                      ) : isGeneratingTopics ? (
                        <div className="text-center py-12">
                          <div className="relative w-20 h-20 mx-auto mb-5">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 rounded-full border-4 border-orange-200 border-t-orange-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <TrendingUp className="w-8 h-8 text-orange-500" />
                            </div>
                          </div>
                          <h4 className="font-semibold text-background-900 mb-1">正在扫描全网热点...</h4>
                          <p className="text-sm text-background-500">实时监测微博、抖音、小红书等平台热点</p>
                        </div>
                      ) : !hasHotTopics ? (
                        <div className="text-center py-10">
                          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            <Flame className="w-10 h-10 text-orange-500" />
                          </div>
                          <h4 className="text-xl font-bold text-background-900 mb-2">
                            发现社媒借势机会
                          </h4>
                          <p className="text-background-500 mb-6 max-w-md mx-auto">
                            智能监测微博热搜、抖音挑战榜、小红书趋势，筛选与品牌高度关联的热点话题，
                            提供切入角度建议和内容形式推荐
                          </p>
                          <Button
                            variant="primary"
                            size="lg"
                            leftIcon={<Wand2 className="w-5 h-5" />}
                            onClick={handleGenerateHotTopics}
                          >
                            生成热点推荐
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
                              <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-medium text-orange-600">扫描话题</span>
                              </div>
                              <p className="text-2xl font-bold text-background-900">{hotTopicRecs.totalTopicsScanned}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-primary-500" />
                                <span className="text-xs font-medium text-primary-600">推荐数量</span>
                              </div>
                              <p className="text-2xl font-bold text-background-900">{hotTopicRecs.recommendations.length}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-medium text-green-600">热门分类</span>
                              </div>
                              <p className="text-sm font-bold text-background-900 truncate">{hotTopicRecs.trendingCategories.slice(0, 2).join('、')}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-violet-500" />
                                <span className="text-xs font-medium text-violet-600">生成时间</span>
                              </div>
                              <p className="text-sm font-bold text-background-900 truncate">{hotTopicRecs.generatedAt.split(' ')[1]}</p>
                            </div>
                          </div>

                          {hotTopicRecs.marketInsights.length > 0 && (
                            <div className="p-4 rounded-xl bg-background-50 border border-background-200">
                              <h4 className="text-sm font-semibold text-background-900 mb-3 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-500" />
                                市场洞察
                              </h4>
                              <ul className="space-y-2">
                                {hotTopicRecs.marketInsights.map((insight, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-background-600">
                                    <span className="text-primary-500 mt-0.5">•</span>
                                    <span>{insight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="space-y-4">
                            {hotTopicRecs.recommendations.map((rec, idx) => {
                              const topic = rec.topic;
                              const heatCfg = heatLevelConfig[topic.heatLevel];
                              const priorityCfg = priorityLevelConfig[rec.priorityLevel];
                              const platformCfg = platformConfig[topic.platform];
                              const urgencyCfg = urgencyConfig[rec.heatCycle.urgencyLevel];
                              const phaseCfg = phaseConfig[rec.heatCycle.currentPhase];
                              const isAnglesExpanded = expandedTopics[rec.id]?.angles ?? false;
                              const isContentExpanded = expandedTopics[rec.id]?.content ?? false;

                              return (
                                <motion.div
                                  key={rec.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                                  className={cn(
                                    'relative rounded-2xl border overflow-hidden transition-all bg-white hover:shadow-lg',
                                  )}
                                  style={{ borderWidth: '1px' }}
                                >
                                  <div
                                    className={cn(
                                      'absolute left-0 top-0 bottom-0 w-1.5',
                                      rec.priorityLevel === 's-tier' ? 'bg-gradient-to-b from-red-400 to-red-600' :
                                      rec.priorityLevel === 'a-tier' ? 'bg-gradient-to-b from-orange-400 to-orange-600' :
                                      rec.priorityLevel === 'b-tier' ? 'bg-gradient-to-b from-amber-400 to-amber-500' :
                                      'bg-gradient-to-b from-gray-300 to-gray-400'
                                    )}
                                  />

                                  <div className="p-5 pl-6">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                          <span className={cn(
                                            'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold',
                                            priorityCfg.color
                                          )}>
                                            {priorityCfg.label}推荐
                                          </span>
                                          <span className={cn(
                                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium',
                                            platformCfg.color
                                          )}>
                                            {platformCfg.icon}
                                            {platformCfg.label} · #{topic.platformRank}
                                          </span>
                                          <span className={cn(
                                            'inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold',
                                            heatCfg.bgColor, heatCfg.color
                                          )}>
                                            {heatCfg.label}
                                          </span>
                                          <span className={cn(
                                            'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
                                            phaseCfg.color
                                          )}>
                                            {phaseCfg.label}
                                          </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-background-900 mb-1.5 leading-tight">
                                          {topic.title}
                                        </h4>
                                        <p className="text-sm text-background-500 leading-relaxed mb-3">
                                          {topic.summary}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                          {topic.tags.slice(0, 5).map((tag, i) => (
                                            <Tag key={i} color="gray" size="sm">
                                              #{tag}
                                            </Tag>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="md:w-52 flex-shrink-0 space-y-2">
                                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-background-50">
                                          <div className="flex items-center gap-2">
                                            <Flame className="w-4 h-4 text-orange-500" />
                                            <span className="text-xs text-background-500">热度指数</span>
                                          </div>
                                          <span className="font-bold text-orange-600">{formatHeatIndex(topic.heatIndex)}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-background-50">
                                          <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-primary-500" />
                                            <span className="text-xs text-background-500">综合匹配度</span>
                                          </div>
                                          <span className="font-bold text-primary-600">{Math.round(rec.overallFitScore * 100)}%</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-background-50">
                                          <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-green-500" />
                                            <span className="text-xs text-background-500">品牌安全</span>
                                          </div>
                                          <span className="font-bold text-green-600">{Math.round(topic.brandSafetyScore * 100)}分</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-background-50">
                                          <div className="flex items-center gap-2">
                                            <span className={cn('w-2 h-2 rounded-full', urgencyCfg.dotColor)} />
                                            <span className="text-xs text-background-500">时效性</span>
                                          </div>
                                          <span className={cn('font-bold', urgencyCfg.textColor)}>
                                            {urgencyCfg.label}·{rec.heatCycle.remainingHours}h
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                      <div className="p-3 rounded-xl bg-primary-50/50 border border-primary-100">
                                        <div className="flex items-center gap-2 mb-1.5">
                                          <BarChart3 className="w-3.5 h-3.5 text-primary-500" />
                                          <span className="text-xs font-medium text-primary-600">品牌关联度</span>
                                        </div>
                                        <div className="h-1.5 bg-primary-100 rounded-full overflow-hidden">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.round(rec.brandRelevanceScore * 100)}%` }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                                          />
                                        </div>
                                        <p className="text-right text-xs text-background-500 mt-1">{Math.round(rec.brandRelevanceScore * 100)}%</p>
                                      </div>
                                      <div className="p-3 rounded-xl bg-accent-50/50 border border-accent-100">
                                        <div className="flex items-center gap-2 mb-1.5">
                                          <Users className="w-3.5 h-3.5 text-accent-500" />
                                          <span className="text-xs font-medium text-accent-600">人群重叠度</span>
                                        </div>
                                        <div className="h-1.5 bg-accent-100 rounded-full overflow-hidden">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.round(rec.audienceOverlapScore * 100)}%` }}
                                            transition={{ duration: 0.6, delay: 0.3 }}
                                            className="h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full"
                                          />
                                        </div>
                                        <p className="text-right text-xs text-background-500 mt-1">{Math.round(rec.audienceOverlapScore * 100)}%</p>
                                      </div>
                                      <div className="p-3 rounded-xl bg-violet-50/50 border border-violet-100">
                                        <div className="flex items-center gap-2 mb-1.5">
                                          <Clock className="w-3.5 h-3.5 text-violet-500" />
                                          <span className="text-xs font-medium text-violet-600">黄金窗口期</span>
                                        </div>
                                        <p className="text-sm font-semibold text-background-900 leading-tight">
                                          {rec.heatCycle.goldenWindowStart.split(' ')[1]} ~ {rec.heatCycle.goldenWindowEnd.split(' ')[1]}
                                        </p>
                                        <p className="text-xs text-violet-600 mt-0.5 truncate">{rec.heatCycle.explanation.slice(0, 25)}...</p>
                                      </div>
                                    </div>

                                    {rec.brandValueAlignment.length > 0 && (
                                      <div className="mb-3">
                                        <div className="flex flex-wrap gap-1.5">
                                          {rec.brandValueAlignment.map((align, i) => (
                                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-100">
                                              <Check className="w-3 h-3" />
                                              {align}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {rec.targetAudienceMatch.length > 0 && (
                                      <div className="mb-4 p-3 rounded-xl bg-accent-50/40 border border-accent-100">
                                        <h5 className="text-xs font-semibold text-accent-700 mb-2 flex items-center gap-1.5">
                                          <Users className="w-3.5 h-3.5" />
                                          目标人群匹配
                                        </h5>
                                        <ul className="space-y-1">
                                          {rec.targetAudienceMatch.map((match, i) => (
                                            <li key={i} className="text-xs text-accent-800 flex items-start gap-1.5">
                                              <span className="text-accent-500 mt-0.5">✓</span>
                                              {match}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    <button
                                      onClick={() => toggleTopicSection(rec.id, 'angles')}
                                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-background-50 transition-colors mb-2 group"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4 text-amber-500" />
                                        <span className="font-semibold text-background-900 text-sm">
                                          切入角度建议（{rec.leverageAngles.length}个方向）
                                        </span>
                                      </div>
                                      <ChevronDown className={cn(
                                        "w-4 h-4 text-background-400 transition-transform duration-200",
                                        isAnglesExpanded && "rotate-180"
                                      )} />
                                    </button>

                                    <AnimatePresence>
                                      {isAnglesExpanded && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.25 }}
                                          className="overflow-hidden mb-3"
                                        >
                                          <div className="space-y-2.5 pb-1">
                                            {rec.leverageAngles.map((angle, ai) => (
                                              <div key={angle.id} className="p-3.5 rounded-xl border border-background-200 bg-white hover:border-primary-200 hover:shadow-sm transition-all">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                  <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                      <h5 className="font-semibold text-background-900 text-sm">{angle.title}</h5>
                                                      <span className={cn(
                                                        'text-xs px-1.5 py-0.5 rounded',
                                                        angle.fitLevel === 'perfect' ? 'bg-green-100 text-green-700' :
                                                        angle.fitLevel === 'high' ? 'bg-primary-100 text-primary-700' :
                                                        angle.fitLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-gray-100 text-gray-600'
                                                      )}>
                                                        {angle.fitLevel === 'perfect' ? '完美契合' : angle.fitLevel === 'high' ? '高度契合' : angle.fitLevel === 'medium' ? '中度契合' : '一般契合'}
                                                      </span>
                                                    </div>
                                                    <p className="text-xs text-background-500 leading-relaxed">{angle.description}</p>
                                                  </div>
                                                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                    <span className={cn(
                                                      'text-xs px-1.5 py-0.5 rounded',
                                                      angle.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                      angle.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                      'bg-red-100 text-red-700'
                                                    )}>
                                                      {angle.difficulty === 'easy' ? '易执行' : angle.difficulty === 'medium' ? '中等难度' : '高难度'}
                                                    </span>
                                                    <span className={cn(
                                                      'text-xs px-1.5 py-0.5 rounded',
                                                      angle.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                                                      angle.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                      'bg-red-100 text-red-700'
                                                    )}>
                                                      {angle.riskLevel === 'low' ? '低风险' : angle.riskLevel === 'medium' ? '中风险' : '高风险'}
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="p-2.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 mb-2.5">
                                                  <p className="text-xs text-amber-800 font-medium">💡 标题示例：{angle.exampleHook}</p>
                                                </div>
                                                <div>
                                                  <p className="text-xs font-medium text-background-500 mb-1">核心传播要点：</p>
                                                  <ul className="space-y-0.5">
                                                    {angle.keyTalkingPoints.map((point, pi) => (
                                                      <li key={pi} className="text-xs text-background-600 flex items-start gap-1.5">
                                                        <span className="text-primary-500 mt-0.5">·</span>
                                                        {point}
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>

                                    <button
                                      onClick={() => toggleTopicSection(rec.id, 'content')}
                                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-background-50 transition-colors mb-2 group"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Video className="w-4 h-4 text-primary-500" />
                                        <span className="font-semibold text-background-900 text-sm">
                                          内容形式推荐（追热点做短视频or长文？）
                                        </span>
                                      </div>
                                      <ChevronDown className={cn(
                                        "w-4 h-4 text-background-400 transition-transform duration-200",
                                        isContentExpanded && "rotate-180"
                                      )} />
                                    </button>

                                    <AnimatePresence>
                                      {isContentExpanded && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.25 }}
                                          className="overflow-hidden mb-3"
                                        >
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pb-1">
                                            {rec.contentSuggestions.map((suggestion, si) => {
                                              const engLevel = {
                                                veryHigh: { label: '极高', color: 'text-red-600 bg-red-50' },
                                                high: { label: '较高', color: 'text-orange-600 bg-orange-50' },
                                                medium: { label: '中等', color: 'text-amber-600 bg-amber-50' },
                                                low: { label: '较低', color: 'text-gray-500 bg-gray-50' },
                                              }[suggestion.engagementPotential];

                                              return (
                                                <div key={si} className="p-3.5 rounded-xl border border-background-200 bg-gradient-to-br from-white to-background-50">
                                                  <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-2">
                                                      <span className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center",
                                                        suggestion.formatType === 'shortVideo' ? 'bg-pink-100 text-pink-600' :
                                                        suggestion.formatType === 'longVideo' ? 'bg-purple-100 text-purple-600' :
                                                        suggestion.formatType === 'longArticle' ? 'bg-blue-100 text-blue-600' :
                                                        suggestion.formatType === 'shortPost' ? 'bg-cyan-100 text-cyan-600' :
                                                        suggestion.formatType === 'imageSet' ? 'bg-rose-100 text-rose-600' :
                                                        suggestion.formatType === 'liveStream' ? 'bg-red-100 text-red-600' :
                                                        'bg-violet-100 text-violet-600'
                                                      )}>
                                                        {formatTypeIcon[suggestion.formatType]}
                                                      </span>
                                                      <div>
                                                        <h5 className="font-semibold text-background-900 text-sm">{suggestion.format}</h5>
                                                        <span className="text-xs text-background-400">{platformConfig[suggestion.platform].label}平台推荐</span>
                                                      </div>
                                                    </div>
                                                    <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', engLevel.color)}>
                                                      互动潜力{engLevel.label}
                                                    </span>
                                                  </div>

                                                  <div className="flex items-center gap-3 mb-2 text-xs">
                                                    <span className="flex items-center gap-1 text-primary-600">
                                                      <Target className="w-3 h-3" />
                                                      适配度 {Math.round(suggestion.suitability * 100)}%
                                                    </span>
                                                    <span className="flex items-center gap-1 text-background-500">
                                                      <Clock className="w-3 h-3" />
                                                      {suggestion.productionTimeEstimate}
                                                    </span>
                                                  </div>

                                                  <div className="p-2.5 rounded-lg bg-primary-50/50 border border-primary-100 mb-2">
                                                    <p className="text-xs text-primary-800">📝 示例：{suggestion.example}</p>
                                                  </div>

                                                  <div>
                                                    <p className="text-xs font-medium text-background-500 mb-1">执行建议：</p>
                                                    <ul className="space-y-0.5">
                                                      {suggestion.bestPractices.map((bp, bi) => (
                                                        <li key={bi} className="text-xs text-background-600 flex items-start gap-1.5">
                                                          <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                          {bp}
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>

                                    {rec.cautions.length > 0 && (
                                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 mb-3">
                                        <h5 className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
                                          <AlertTriangle className="w-3.5 h-3.5" />
                                          注意事项
                                        </h5>
                                        <ul className="space-y-1">
                                          {rec.cautions.map((caution, i) => (
                                            <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                                              <span>⚠️</span>
                                              {caution}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {rec.callToActionSuggestions.length > 0 && (
                                      <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                                        <h5 className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1.5">
                                          <Zap className="w-3.5 h-3.5" />
                                          CTA行动建议
                                        </h5>
                                        <ul className="space-y-1">
                                          {rec.callToActionSuggestions.map((cta, i) => (
                                            <li key={i} className="text-xs text-green-700 flex items-start gap-1.5">
                                              <span>👉</span>
                                              {cta}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>

                          {hotTopicRecs.generalGuidelines.length > 0 && (
                            <div className="p-4 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
                              <h4 className="text-sm font-semibold text-background-900 mb-3 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary-600" />
                                借势营销通用准则
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {hotTopicRecs.generalGuidelines.map((guide, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-sm text-background-700">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white text-primary-600 text-xs font-bold flex items-center justify-center shadow-sm">
                                      {idx + 1}
                                    </span>
                                    <span>{guide}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<ChevronLeft className="w-5 h-5" />}
              onClick={handlePrev}
            >
              上一步：人群画像
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Save className="w-5 h-5" />}
                onClick={handleSave}
              >
                保存草稿
              </Button>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ChevronRight className="w-5 h-5" />}
                onClick={handleNext}
                disabled={!hasStrategy}
              >
                下一步：渠道矩阵
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
