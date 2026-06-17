import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  Users,
  Megaphone,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  MessageCircle,
  Building2,
  Mic2,
  PartyPopper,
  Radio,
  AlertTriangle,
  Clock,
  TrendingUp,
  Heart,
  Share2,
  Camera,
  Video,
  FileText,
  Award,
  Star,
  Zap,
  Layers,
  MapPin,
  Gift,
  Shield,
  Newspaper,
  Tv2,
  BookOpen,
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useProjectStore } from '@/store/useProjectStore';
import { generateChannelMatrix } from '@/engine/channelPlanner';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import StepIndicator from '@/components/ui/StepIndicator';
import { cn } from '@/lib/utils';
import type { ChannelMatrix } from '@/types';

const steps = [
  { id: 1, label: '品牌信息' },
  { id: 2, label: '人群画像' },
  { id: 3, label: '传播策略' },
  { id: 4, label: '渠道矩阵' },
  { id: 5, label: 'KPI设置' },
  { id: 6, label: '执行方案' },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

const CHANNEL_COLORS = {
  socialMedia: {
    primary: 'bg-indigo-500',
    light: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
  },
  kolMarketing: {
    primary: 'bg-pink-500',
    light: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-200',
  },
  offlineEvents: {
    primary: 'bg-amber-500',
    light: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
  },
  prRelations: {
    primary: 'bg-emerald-500',
    light: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
  },
};

const channelOverviewData = [
  {
    id: 'socialMedia',
    name: '社交媒体',
    description: '通过社交平台与用户建立连接，打造品牌社群',
    icon: <Share2 className="w-7 h-7" />,
    budgetRatio: '35%',
    importance: '高',
  },
  {
    id: 'kolMarketing',
    name: 'KOL营销',
    description: '借助意见领袖影响力，快速触达目标人群',
    icon: <Users className="w-7 h-7" />,
    budgetRatio: '30%',
    importance: '高',
  },
  {
    id: 'offlineEvents',
    name: '线下活动',
    description: '沉浸式体验活动，深化品牌认知与好感',
    icon: <PartyPopper className="w-7 h-7" />,
    budgetRatio: '20%',
    importance: '中',
  },
  {
    id: 'prRelations',
    name: 'PR公关',
    description: '媒体矩阵传播，建立品牌权威性与公信力',
    icon: <Newspaper className="w-7 h-7" />,
    budgetRatio: '15%',
    importance: '中',
  },
];

function getPlatformIcon(name: string) {
  const icons: Record<string, React.ReactNode> = {
    '微信': <MessageCircle className="w-5 h-5" />,
    '微博': <Megaphone className="w-5 h-5" />,
    '抖音': <Video className="w-5 h-5" />,
    '小红书': <BookOpen className="w-5 h-5" />,
    'B站': <Tv2 className="w-5 h-5" />,
    '知乎': <FileText className="w-5 h-5" />,
    '快手': <Zap className="w-5 h-5" />,
    '视频号': <Camera className="w-5 h-5" />,
  };
  return icons[name] || <Share2 className="w-5 h-5" />;
}

export default function ChannelsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPlan, loadPlan, updateChannelMatrix, saveCurrentPlan } = useProjectStore();

  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      loadPlan(id);
    }
  }, [id, loadPlan]);

  const channelMatrix = currentPlan?.channelMatrix;

  useEffect(() => {
    if (
      currentPlan &&
      currentPlan.brandInfo.brandName &&
      currentPlan.targetAudience.name &&
      currentPlan.strategy.coreIdea &&
      (!channelMatrix?.socialMedia.platforms.length || !channelMatrix?.kolMarketing.kolTiers.length)
    ) {
      generateAndSaveMatrix();
    }
  }, [currentPlan]);

  const generateAndSaveMatrix = () => {
    if (!currentPlan) return;
    setIsGenerating(true);
    try {
      const matrix = generateChannelMatrix(
        currentPlan.brandInfo,
        currentPlan.targetAudience,
        currentPlan.strategy
      );
      updateChannelMatrix(matrix);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    saveCurrentPlan();
  };

  const handlePrev = () => {
    saveCurrentPlan();
    const planId = currentPlan?.project.id || 'new';
    navigate(`/project/${planId}/strategy`);
  };

  const handleNext = () => {
    saveCurrentPlan();
    const planId = currentPlan?.project.id || 'new';
    navigate(`/project/${planId}/kpi`);
  };

  const toggleChannel = (channelId: string) => {
    setExpandedChannel(expandedChannel === channelId ? null : channelId);
  };

  const kolPieData = useMemo(() => {
    if (!channelMatrix?.kolMarketing.kolTiers.length) return [];
    return channelMatrix.kolMarketing.kolTiers.map((tier) => ({
      name: tier.tier,
      value: parseInt(tier.budgetRatio) || 0,
    }));
  }, [channelMatrix?.kolMarketing.kolTiers]);

  const kolBarData = useMemo(() => {
    if (!channelMatrix?.kolMarketing.kolTiers.length) return [];
    return channelMatrix.kolMarketing.kolTiers.map((tier) => ({
      name: tier.tier,
      数量: tier.quantity,
    }));
  }, [channelMatrix?.kolMarketing.kolTiers]);

  const calendarData = useMemo(() => {
    const weeks = ['第1周', '第2周', '第3周', '第4周'];
    const channels = [
      { id: 'socialMedia', name: '社交媒体', color: '#6366f1' },
      { id: 'kolMarketing', name: 'KOL营销', color: '#ec4899' },
      { id: 'offlineEvents', name: '线下活动', color: '#f59e0b' },
      { id: 'prRelations', name: 'PR公关', color: '#10b981' },
    ];

    return weeks.map((week, weekIndex) => ({
      week,
      channels: channels.map((channel) => ({
        ...channel,
        intensity: Math.floor(Math.random() * 3) + 1 + (weekIndex === 1 ? 1 : 0),
      })),
    }));
  }, []);

  if (!channelMatrix) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-background-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50">
      <div className="sticky top-0 z-50 bg-white border-b border-background-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-background-900">渠道内容矩阵</h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="md" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
                保存草稿
              </Button>
              <Button variant="primary" size="md" rightIcon={<ChevronRight className="w-4 h-4" />} onClick={handleNext}>
                下一步
              </Button>
            </div>
          </div>
          <StepIndicator steps={steps} currentStep={3} showLabels={true} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-background-900">渠道总览</h3>
                      <p className="text-sm text-background-500 mt-0.5">
                        四大渠道协同发力，构建全方位传播矩阵
                      </p>
                    </div>
                  </div>
                }
              />
              <CardBody>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {channelOverviewData.map((channel, index) => {
                    const colors = CHANNEL_COLORS[channel.id as keyof typeof CHANNEL_COLORS];
                    const isExpanded = expandedChannel === channel.id;
                    return (
                      <motion.div
                        key={channel.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.08 }}
                      >
                        <div
                          onClick={() => toggleChannel(channel.id)}
                          className={cn(
                            'relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden',
                            'hover:shadow-lg hover:-translate-y-1',
                            isExpanded
                              ? `${colors.border} ${colors.light} shadow-md`
                              : 'border-background-200 bg-white hover:border-background-300'
                          )}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div
                              className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center',
                                colors.primary,
                                'text-white'
                              )}
                            >
                              {channel.icon}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Tag color="primary" size="sm">
                                {channel.budgetRatio}
                              </Tag>
                              <span className="text-xs text-background-500">预算占比</span>
                            </div>
                          </div>
                          <h4 className={cn('font-semibold mb-1.5', isExpanded ? colors.text : 'text-background-900')}>
                            {channel.name}
                          </h4>
                          <p className="text-xs text-background-500 line-clamp-2 mb-3">{channel.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-background-600">
                              重要程度：{channel.importance}
                            </span>
                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                              <ChevronDown className="w-4 h-4 text-background-400" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-background-100">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-background-700 mb-2">渠道预算分布</p>
                      <div className="flex h-3 rounded-full overflow-hidden bg-background-100">
                        {channelOverviewData.map((channel, index) => {
                          const colors = CHANNEL_COLORS[channel.id as keyof typeof CHANNEL_COLORS];
                          const ratio = parseInt(channel.budgetRatio) || 0;
                          return (
                            <motion.div
                              key={channel.id}
                              initial={{ width: 0 }}
                              animate={{ width: `${ratio}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              className={cn(colors.primary, 'h-full')}
                              title={`${channel.name}: ${channel.budgetRatio}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {channelOverviewData.map((channel) => {
                      const colors = CHANNEL_COLORS[channel.id as keyof typeof CHANNEL_COLORS];
                      return (
                        <div key={channel.id} className="flex items-center gap-2">
                          <div className={cn('w-3 h-3 rounded-full', colors.primary)} />
                          <span className="text-xs text-background-600">{channel.name}</span>
                          <span className="text-xs font-medium text-background-700">{channel.budgetRatio}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <AnimatePresence mode="wait">
            {expandedChannel === 'socialMedia' && (
              <motion.div
                key="socialMedia"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader
                    title={
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                          <Share2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-background-900">社交媒体渠道</h3>
                          <p className="text-sm text-background-500 mt-0.5">
                            推荐平台、内容策略与运营建议
                          </p>
                        </div>
                      </div>
                    }
                  />
                  <CardBody>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-background-700 mb-4 flex items-center gap-2">
                          <Target className="w-4 h-4 text-indigo-500" />
                          推荐平台列表
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {channelMatrix.socialMedia.platforms.map((platform, index) => (
                            <motion.div
                              key={platform.name}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.08 }}
                              className="p-4 rounded-xl bg-indigo-50 border border-indigo-100"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                                  {getPlatformIcon(platform.name)}
                                </div>
                                <div>
                                  <h5 className="font-semibold text-background-900">{platform.name}</h5>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={cn(
                                          'w-3 h-3',
                                          star <= 5 - index ? 'text-amber-400 fill-amber-400' : 'text-background-200'
                                        )}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs text-background-500 mb-1">内容类型</p>
                                  <div className="flex flex-wrap gap-1">
                                    {platform.contentTypes.map((type) => (
                                      <Tag key={type} color="primary" size="sm">
                                        {type}
                                      </Tag>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                  <span className="text-xs text-background-600">
                                    发布频率：{platform.postingFrequency}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-5 h-5 text-indigo-600" />
                            <h5 className="font-semibold text-indigo-900">内容策略</h5>
                          </div>
                          <p className="text-sm text-indigo-800 leading-relaxed">
                            {channelMatrix.socialMedia.contentStrategy}
                          </p>
                        </div>
                        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-purple-600" />
                            <h5 className="font-semibold text-purple-900">社区管理</h5>
                          </div>
                          <p className="text-sm text-purple-800 leading-relaxed">
                            {channelMatrix.socialMedia.communityManagement}
                          </p>
                        </div>
                        <div className="p-5 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-pink-600" />
                            <h5 className="font-semibold text-pink-900">广告投放</h5>
                          </div>
                          <p className="text-sm text-pink-800 leading-relaxed">
                            {channelMatrix.socialMedia.advertisingPlan}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            )}

            {expandedChannel === 'kolMarketing' && (
              <motion.div
                key="kolMarketing"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader
                    title={
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-background-900">KOL营销</h3>
                          <p className="text-sm text-background-500 mt-0.5">
                            KOL层级分布、合作模式与筛选标准
                          </p>
                        </div>
                      </div>
                    }
                  />
                  <CardBody>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-background-700 mb-4 flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-pink-500" />
                            预算分布
                          </h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPie>
                                <Pie
                                  data={kolPieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={80}
                                  paddingAngle={2}
                                  dataKey="value"
                                  label={({ name, value }) => `${name}: ${value}%`}
                                  labelLine={false}
                                >
                                  {kolPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}%`} />
                              </RechartsPie>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-background-700 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-pink-500" />
                            数量分布
                          </h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={kolBarData} layout="vertical">
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="数量" fill="#ec4899" radius={[0, 4, 4, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {channelMatrix.kolMarketing.kolTiers.map((tier, index) => (
                          <motion.div
                            key={tier.tier}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-5 rounded-xl border border-background-200 bg-white hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-background-900">{tier.tier}</h5>
                                <p className="text-xs text-background-500 mt-0.5">{tier.description}</p>
                              </div>
                              <Tag color="primary" size="sm">
                                {tier.budgetRatio}
                              </Tag>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-background-400" />
                                <span className="text-background-600">
                                  {tier.quantity} <span className="text-xs">位</span>
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 rounded-xl bg-gradient-to-br from-pink-50 to-rose-100">
                          <div className="flex items-center gap-2 mb-3">
                            <Handshake className="w-5 h-5 text-pink-600" />
                            <h5 className="font-semibold text-pink-900">合作类型</h5>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {channelMatrix.kolMarketing.cooperationTypes.map((type) => (
                              <Tag key={type} color="accent" size="sm">
                                {type}
                              </Tag>
                            ))}
                          </div>
                        </div>
                        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-violet-100">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-5 h-5 text-purple-600" />
                            <h5 className="font-semibold text-purple-900">内容方向</h5>
                          </div>
                          <p className="text-sm text-purple-800 leading-relaxed">
                            {channelMatrix.kolMarketing.contentDirection}
                          </p>
                        </div>
                        <div className="p-5 rounded-xl bg-gradient-to-br from-fuchsia-50 to-pink-100">
                          <div className="flex items-center gap-2 mb-3">
                            <Filter className="w-5 h-5 text-fuchsia-600" />
                            <h5 className="font-semibold text-fuchsia-900">筛选标准</h5>
                          </div>
                          <p className="text-sm text-fuchsia-800 leading-relaxed">
                            {channelMatrix.kolMarketing.selectionCriteria}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            )}

            {expandedChannel === 'offlineEvents' && (
              <motion.div
                key="offlineEvents"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader
                    title={
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                          <PartyPopper className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-background-900">线下活动</h3>
                          <p className="text-sm text-background-500 mt-0.5">
                            活动类型、场地选择与现场设计
                          </p>
                        </div>
                      </div>
                    }
                  />
                  <CardBody>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-background-700 mb-4 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-500" />
                          推荐活动类型
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {channelMatrix.offlineEvents.eventTypes.map((eventType, index) => (
                            <motion.div
                              key={eventType}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                                  <Award className="w-5 h-5" />
                                </div>
                                <h5 className="font-semibold text-background-900">{eventType}</h5>
                              </div>
                              <p className="text-sm text-background-600">
                                沉浸式品牌体验，深度触达目标用户
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-5 rounded-xl bg-amber-50 border border-amber-100">
                            <div className="flex items-center gap-2 mb-3">
                              <BarChart3 className="w-5 h-5 text-amber-600" />
                              <h5 className="font-semibold text-amber-900">活动规模</h5>
                            </div>
                            <p className="text-sm text-amber-800">{channelMatrix.offlineEvents.scale}</p>
                          </div>
                          <div className="p-5 rounded-xl bg-orange-50 border border-orange-100">
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-5 h-5 text-orange-600" />
                              <h5 className="font-semibold text-orange-900">场地选择</h5>
                            </div>
                            <p className="text-sm text-orange-800">
                              {channelMatrix.offlineEvents.venueSuggestions}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-100">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="w-5 h-5 text-yellow-600" />
                              <h5 className="font-semibold text-yellow-900">现场互动</h5>
                            </div>
                            <p className="text-sm text-yellow-800">
                              {channelMatrix.offlineEvents.onsiteActivities}
                            </p>
                          </div>
                          <div className="p-5 rounded-xl bg-red-50 border border-red-100">
                            <div className="flex items-center gap-2 mb-3">
                              <Users className="w-5 h-5 text-red-600" />
                              <h5 className="font-semibold text-red-900">参与人数</h5>
                            </div>
                            <p className="text-sm text-red-800">
                              {channelMatrix.offlineEvents.expectedAttendance}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Gift className="w-6 h-6 text-amber-600" />
                          <h5 className="text-lg font-semibold text-amber-900">活动亮点设计</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-white/70 backdrop-blur-sm">
                            <p className="text-sm font-medium text-amber-900 mb-1">沉浸式体验</p>
                            <p className="text-xs text-amber-700">
                              打造品牌专属互动空间，让用户全方位感受品牌魅力
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-white/70 backdrop-blur-sm">
                            <p className="text-sm font-medium text-amber-900 mb-1">打卡传播</p>
                            <p className="text-xs text-amber-700">
                              设计高颜值拍照点，鼓励用户社交分享，形成二次传播
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-white/70 backdrop-blur-sm">
                            <p className="text-sm font-medium text-amber-900 mb-1">限时福利</p>
                            <p className="text-xs text-amber-700">
                              线下专属优惠和礼品，提升参与热情和转化效果
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            )}

            {expandedChannel === 'prRelations' && (
              <motion.div
                key="prRelations"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader
                    title={
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <Newspaper className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-background-900">PR公关</h3>
                          <p className="text-sm text-background-500 mt-0.5">
                            媒体矩阵、内容规划与危机预案
                          </p>
                        </div>
                      </div>
                    }
                  />
                  <CardBody>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-background-700 mb-4 flex items-center gap-2">
                          <Radio className="w-4 h-4 text-emerald-500" />
                          媒体矩阵
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {channelMatrix.prRelations.mediaMatrix.map((media, index) => (
                            <motion.div
                              key={media}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2, delay: index * 0.03 }}
                            >
                              <Tag color="success" size="md">
                                {media}
                              </Tag>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-background-700 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-500" />
                            内容规划
                          </h4>
                          <div className="space-y-3">
                            {channelMatrix.prRelations.contentPlan.map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100"
                              >
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                                  {index + 1}
                                </div>
                                <p className="text-sm text-emerald-900">{item}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100">
                            <div className="flex items-center gap-2 mb-3">
                              <Clock className="w-5 h-5 text-emerald-600" />
                              <h5 className="font-semibold text-emerald-900">发布节奏</h5>
                            </div>
                            <p className="text-sm text-emerald-800">
                              {channelMatrix.prRelations.publishingRhythm}
                            </p>
                          </div>
                          <div className="p-5 rounded-xl bg-red-50 border border-red-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Shield className="w-5 h-5 text-red-600" />
                              <h5 className="font-semibold text-red-900">危机预案</h5>
                            </div>
                            <p className="text-sm text-red-800">
                              {channelMatrix.prRelations.crisisPlan}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="w-6 h-6 text-emerald-600" />
                          <h5 className="text-lg font-semibold text-emerald-900">三级危机响应机制</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                            <p className="text-sm font-semibold text-yellow-800 mb-2">一级危机</p>
                            <p className="text-xs text-yellow-700">
                              轻微负面舆情，24小时内响应，常规公关处理
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                            <p className="text-sm font-semibold text-orange-800 mb-2">二级危机</p>
                            <p className="text-xs text-orange-700">
                              中度负面传播，12小时内响应，公关总监牵头处理
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-sm font-semibold text-red-800 mb-2">三级危机</p>
                            <p className="text-xs text-red-700">
                              重大品牌危机，2小时内响应，CEO牵头危机小组
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-background-900">内容日历</h3>
                      <p className="text-sm text-background-500 mt-0.5">
                        各渠道内容发布节奏与时间规划
                      </p>
                    </div>
                  </div>
                }
              />
              <CardBody>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-3 text-sm">
                    <div className="text-center font-medium text-background-500">渠道</div>
                    {calendarData.map((week) => (
                      <div key={week.week} className="text-center font-medium text-background-700">
                        {week.week}
                      </div>
                    ))}
                  </div>

                  {channelOverviewData.map((channel, channelIndex) => {
                    const colors = CHANNEL_COLORS[channel.id as keyof typeof CHANNEL_COLORS];
                    const channelCalendar = calendarData.map((week) =>
                      week.channels.find((c) => c.name === channel.name)
                    );

                    return (
                      <motion.div
                        key={channel.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: channelIndex * 0.1 }}
                        className="grid grid-cols-5 gap-3 items-center"
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white', colors.primary)}>
                            {channel.icon && <span className="w-4 h-4">{channel.icon}</span>}
                          </div>
                          <span className="text-sm font-medium text-background-700">{channel.name}</span>
                        </div>
                        {channelCalendar.map((weekData, weekIndex) => (
                          <div key={weekIndex} className="flex justify-center">
                            <div
                              className="h-8 rounded-lg flex items-center justify-center gap-1 px-2"
                              style={{
                                backgroundColor: weekData
                                  ? `${weekData.color}${Math.floor((weekData.intensity / 4) * 255).toString(16).padStart(2, '0')}`
                                  : 'transparent',
                                width: '100%',
                              }}
                            >
                              {weekData &&
                                Array.from({ length: weekData.intensity }).map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: weekData.color }}
                                  />
                                ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-background-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-background-500">强度说明：</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary-300" />
                        <span className="text-xs text-background-500">低</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                        <span className="text-xs text-background-500">中</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-primary-700" />
                        <span className="text-xs text-background-500">高</span>
                      </div>
                    </div>
                    <p className="text-xs text-background-400">
                      * 第二周为集中爆发期，各渠道发布强度提升
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
            <Button variant="outline" size="lg" leftIcon={<ChevronLeft className="w-5 h-5" />} onClick={handlePrev}>
              上一步：传播策略
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg" leftIcon={<Save className="w-5 h-5" />} onClick={handleSave}>
                保存草稿
              </Button>
              <Button variant="primary" size="lg" rightIcon={<ChevronRight className="w-5 h-5" />} onClick={handleNext}>
                下一步：KPI设置
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lightbulb(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

function Handshake(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88" />
      <path d="m9.5 11.5 5-5a1 1 0 1 1 3 3l-1.5 1.5" />
      <path d="m19 10-1.5 1.5" />
      <path d="M12 12 9.5 9.5a1 1 0 1 0-3 3l1.5 1.5" />
      <path d="M5 14l1.5-1.5" />
      <path d="m11 8 2.5 2.5" />
      <path d="m10 16-3.5-3.5" />
    </svg>
  );
}

function Filter(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
