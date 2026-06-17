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

export default function StrategyPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPlan, loadPlan, updateStrategy, saveCurrentPlan } = useProjectStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [activeVersion, setActiveVersion] = useState(0);
  const [editingCoreIdea, setEditingCoreIdea] = useState(false);
  const [editingTheme, setEditingTheme] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [localKeyMessages, setLocalKeyMessages] = useState<KeyMessage[]>([]);

  useEffect(() => {
    if (id && (!currentPlan || currentPlan.project.id !== id)) {
      loadPlan(id);
    }
  }, [id, currentPlan, loadPlan]);

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
    setGenerationStep(0);

    for (let i = 0; i < generationSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));
      setGenerationStep(i);
    }

    const newStrategy = generateStrategy(brandInfo, targetAudience);
    updateStrategy(newStrategy);
    setActiveVersion(0);
    setIsGenerating(false);
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
          <p className="text-background-500">加载中...</p>
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
