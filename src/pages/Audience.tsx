import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Users,
  Search,
  Heart,
  ShoppingBag,
  MessageCircle,
  Smartphone,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Save,
  Tag as TagIcon,
  MapPin,
  GraduationCap,
  Briefcase,
  DollarSign,
  Clock,
  Zap,
  Target,
  Music,
  BookOpen,
  Gamepad2,
} from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import Card, { CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import Input from '@/components/ui/Input';
import StepIndicator from '@/components/ui/StepIndicator';
import { cn } from '@/lib/utils';
import {
  ageRanges,
  genders,
  cityTiers,
  incomeLevels,
  educationLevels,
  occupations,
  interestTags,
  behaviorTags,
  mediaHabits,
  behaviorCategories,
  mediaHabitCategories,
} from '@/data/audienceTags';

const steps = [
  { id: 1, label: '品牌信息' },
  { id: 2, label: '人群画像' },
  { id: 3, label: '策略生成' },
  { id: 4, label: '渠道矩阵' },
  { id: 5, label: 'KPI设定' },
  { id: 6, label: '执行方案' },
];

const COLORS = ['#1E3A5F', '#FF6B35', '#2EC4B6', '#9AA3B3', '#FF8347', '#4778C3'];

const painPointSuggestions = [
  '时间紧张，没有足够的空闲时间',
  '选择困难，面对众多选项难以决策',
  '信息过载，难以辨别真伪',
  '价格敏感，希望找到高性价比产品',
  '品质担忧，担心产品不符合预期',
  '服务体验差，售后保障不足',
];

const motivationSuggestions = [
  '提升生活品质和幸福感',
  '表达自我个性和品味',
  '获得社交认同和归属感',
  '节省时间提高效率',
  '健康养生，保持良好状态',
  '追求新鲜感和刺激感',
];

export default function Audience() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPlan, loadPlan, updateTargetAudience, saveCurrentPlan } = useProjectStore();
  const [interestSearch, setInterestSearch] = useState('');
  const [activeInterestCategory, setActiveInterestCategory] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id && (!currentPlan || currentPlan.project.id !== id)) {
      loadPlan(id);
    }
  }, [id, currentPlan, loadPlan]);

  const audience = currentPlan?.targetAudience;

  const handleDemographicChange = (field: string, value: string) => {
    updateTargetAudience({
      demographics: {
        ...audience?.demographics,
        [field]: value,
      },
    });
  };

  const toggleInterest = (interest: string) => {
    const interests = audience?.interests || [];
    const newInterests = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    updateTargetAudience({ interests: newInterests });
    if (validationErrors.interests && newInterests.length > 0) {
      setValidationErrors((prev) => { const next = { ...prev }; delete next.interests; return next; });
    }
  };

  const toggleBehavior = (behavior: string) => {
    const behaviors = audience?.behaviors || [];
    const newBehaviors = behaviors.includes(behavior)
      ? behaviors.filter((b) => b !== behavior)
      : [...behaviors, behavior];
    updateTargetAudience({ behaviors: newBehaviors });
  };

  const toggleMediaHabit = (habit: string) => {
    const mediaHabitsList = audience?.mediaHabits || [];
    const newMediaHabits = mediaHabitsList.includes(habit)
      ? mediaHabitsList.filter((m) => m !== habit)
      : [...mediaHabitsList, habit];
    updateTargetAudience({ mediaHabits: newMediaHabits });
  };

  const filteredInterestTags = useMemo(() => {
    if (!interestSearch) return interestTags;
    return interestTags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(interestSearch.toLowerCase()) ||
        tag.subTags.some((sub) => sub.toLowerCase().includes(interestSearch.toLowerCase()))
    );
  }, [interestSearch]);

  const radarData = useMemo(() => {
    const interestsCount = audience?.interests?.length || 0;
    const behaviorsCount = audience?.behaviors?.length || 0;
    const mediaCount = audience?.mediaHabits?.length || 0;
    const demoScore = [
      audience?.demographics?.ageRange ? 20 : 0,
      audience?.demographics?.gender ? 20 : 0,
      audience?.demographics?.location ? 20 : 0,
      audience?.demographics?.income ? 20 : 0,
      audience?.demographics?.education ? 10 : 0,
      audience?.demographics?.occupation ? 10 : 0,
    ].reduce((a, b) => a + b, 0);

    return [
      { subject: '人口属性', score: demoScore, fullMark: 100 },
      { subject: '兴趣爱好', score: Math.min(interestsCount * 8, 100), fullMark: 100 },
      { subject: '行为特征', score: Math.min(behaviorsCount * 12, 100), fullMark: 100 },
      { subject: '触媒习惯', score: Math.min(mediaCount * 12, 100), fullMark: 100 },
      { subject: '痛点动机', score: audience?.painPoints || audience?.motivations ? 80 : 20, fullMark: 100 },
      { subject: '画像完整度', score: Math.min((interestsCount + behaviorsCount + mediaCount) * 5 + demoScore, 100), fullMark: 100 },
    ];
  }, [audience]);

  const genderDistribution = useMemo(() => {
    if (!audience?.demographics?.gender) {
      return [
        { name: '男性', value: 50 },
        { name: '女性', value: 50 },
      ];
    }
    if (audience.demographics.gender === 'male') {
      return [
        { name: '男性', value: 80 },
        { name: '女性', value: 20 },
      ];
    }
    if (audience.demographics.gender === 'female') {
      return [
        { name: '男性', value: 20 },
        { name: '女性', value: 80 },
      ];
    }
    return [
      { name: '男性', value: 50 },
      { name: '女性', value: 50 },
    ];
  }, [audience?.demographics?.gender]);

  const ageDistribution = useMemo(() => {
    const selectedAge = audience?.demographics?.ageRange;
    if (!selectedAge) {
      return ageRanges.map((age, index) => ({
        name: age.name.split(' ')[0],
        value: 100 - Math.abs(index - 3) * 10,
      }));
    }
    const selectedIndex = ageRanges.findIndex((a) => a.id === selectedAge);
    return ageRanges.map((age, index) => ({
      name: age.name.split(' ')[0],
      value: Math.max(0, 100 - Math.abs(index - selectedIndex) * 25),
    }));
  }, [audience?.demographics?.ageRange]);

  const totalSelectedTags =
    (audience?.interests?.length || 0) +
    (audience?.behaviors?.length || 0) +
    (audience?.mediaHabits?.length || 0);

  const handleSave = () => {
    saveCurrentPlan();
  };

  const validateAudience = (): boolean => {
    const errors: Record<string, string> = {};
    if (!audience?.demographics?.ageRange) {
      errors.ageRange = '请选择年龄段';
    }
    if (!audience?.demographics?.gender) {
      errors.gender = '请选择性别分布';
    }
    if (!audience?.interests || audience.interests.length === 0) {
      errors.interests = '请至少选择一个兴趣爱好标签';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateAudienceName = () => {
    if (!audience) return;
    const parts: string[] = [];
    const ageData = ageRanges.find((a) => a.id === audience.demographics?.ageRange);
    if (ageData) parts.push(ageData.name);
    const cityData = cityTiers.find((c) => c.id === audience.demographics?.location);
    if (cityData) parts.push(cityData.name);
    const occData = occupations.find((o) => o.id === audience.demographics?.occupation);
    if (occData) parts.push(occData.name);
    const name = parts.length > 0 ? parts.join('·') : '目标人群';
    updateTargetAudience({ name });
  };

  const handlePrev = () => {
    saveCurrentPlan();
    navigate(`/project/${id}/brand`);
  };

  const handleNext = () => {
    if (!validateAudience()) return;
    generateAudienceName();
    saveCurrentPlan();
    navigate(`/project/${id}/strategy`);
  };

  const groupedBehaviors = useMemo(() => {
    const groups: Record<string, typeof behaviorTags> = {};
    behaviorCategories.forEach((cat) => {
      groups[cat] = behaviorTags.filter((b) => b.category === cat);
    });
    return groups;
  }, []);

  const groupedMediaHabits = useMemo(() => {
    const groups: Record<string, typeof mediaHabits> = {};
    mediaHabitCategories.forEach((cat) => {
      groups[cat] = mediaHabits.filter((m) => m.category === cat);
    });
    return groups;
  }, []);

  const mediaIcons: Record<string, typeof Smartphone> = {
    '社交平台': MessageCircle,
    '视频平台': Zap,
    '知识平台': GraduationCap,
    '直播平台': Sparkles,
    '电商平台': ShoppingBag,
    '资讯平台': Target,
    '音频平台': Music,
    '阅读平台': BookOpen,
    '游戏平台': Gamepad2,
    '使用时段': Clock,
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
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-background-100">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} leftIcon={<ChevronLeft className="w-4 h-4" />}>
                返回首页
              </Button>
              <div className="h-6 w-px bg-background-200" />
              <h1 className="text-xl font-bold text-background-900">目标人群画像</h1>
            </div>
            <Button variant="outline" size="sm" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
              保存
            </Button>
          </div>
          <StepIndicator steps={steps} currentStep={1} />
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary-500" />
                      <span>人群基本属性</span>
                    </div>
                  }
                  subtitle="定义目标人群的人口统计学特征"
                />
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-background-700">年龄段<span className="text-red-500 ml-0.5">*</span></label>
                      <div className="flex flex-wrap gap-2">
                        {ageRanges.map((age) => (
                          <Tag
                            key={age.id}
                            color="primary"
                            size="sm"
                            selected={audience?.demographics?.ageRange === age.id}
                            onClick={() => {
                              handleDemographicChange('ageRange', age.id);
                              if (validationErrors.ageRange) setValidationErrors((prev) => { const next = { ...prev }; delete next.ageRange; return next; });
                            }}
                          >
                            {age.name}
                          </Tag>
                        ))}
                      </div>
                      {validationErrors.ageRange && <p className="mt-1.5 text-sm text-red-500">{validationErrors.ageRange}</p>}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-background-700">性别分布<span className="text-red-500 ml-0.5">*</span></label>
                      <div className="flex gap-2">
                        {genders.map((gender) => (
                          <Tag
                            key={gender.id}
                            color="primary"
                            size="md"
                            selected={audience?.demographics?.gender === gender.id}
                            onClick={() => {
                              handleDemographicChange('gender', gender.id);
                              if (validationErrors.gender) setValidationErrors((prev) => { const next = { ...prev }; delete next.gender; return next; });
                            }}
                          >
                            {gender.name}
                          </Tag>
                        ))}
                      </div>
                      {validationErrors.gender && <p className="mt-1.5 text-sm text-red-500">{validationErrors.gender}</p>}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-background-700">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        城市层级
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {cityTiers.map((city) => (
                          <Tag
                            key={city.id}
                            color="accent"
                            size="sm"
                            selected={audience?.demographics?.location === city.id}
                            onClick={() => handleDemographicChange('location', city.id)}
                          >
                            {city.name}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-background-700">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        收入水平
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {incomeLevels.map((income) => (
                          <Tag
                            key={income.id}
                            color="success"
                            size="sm"
                            selected={audience?.demographics?.income === income.id}
                            onClick={() => handleDemographicChange('income', income.id)}
                          >
                            {income.name}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-background-700">
                        <GraduationCap className="w-4 h-4 inline mr-1" />
                        教育程度
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {educationLevels.map((edu) => (
                          <Tag
                            key={edu.id}
                            color="gray"
                            size="sm"
                            selected={audience?.demographics?.education === edu.id}
                            onClick={() => handleDemographicChange('education', edu.id)}
                          >
                            {edu.name}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-background-700">
                        <Briefcase className="w-4 h-4 inline mr-1" />
                        职业选择
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {occupations.map((occ) => (
                          <Tag
                            key={occ.id}
                            color="primary"
                            size="sm"
                            selected={audience?.demographics?.occupation === occ.id}
                            onClick={() => handleDemographicChange('occupation', occ.id)}
                          >
                            {occ.name}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-background-100">
                    <div>
                      <h4 className="text-sm font-medium text-background-700 mb-3">性别分布</h4>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={genderDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={70}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {genderDistribution.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-background-700 mb-3">年龄分布</h4>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ageDistribution} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#1E3A5F" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-accent-500" />
                      <span>兴趣爱好标签<span className="text-red-500 ml-0.5">*</span></span>
                    </div>
                  }
                  subtitle="选择目标人群的兴趣爱好领域"
                  action={
                    <div className="text-sm text-background-500">
                      已选 <span className="font-semibold text-primary-500">{audience?.interests?.length || 0}</span> 个
                    </div>
                  }
                />
                <CardBody>
                  {validationErrors.interests && (
                    <p className="mb-4 text-sm text-red-500">{validationErrors.interests}</p>
                  )}
                  <div className="mb-4">
                    <Input
                      placeholder="搜索兴趣标签..."
                      size="sm"
                      prefixIcon={<Search className="w-4 h-4" />}
                      value={interestSearch}
                      onChange={(e) => setInterestSearch(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    {filteredInterestTags.map((category) => (
                      <div
                        key={category.id}
                        className={cn(
                          'p-4 rounded-xl border transition-all duration-200',
                          activeInterestCategory === category.id
                            ? 'border-primary-300 bg-primary-50/50'
                            : 'border-background-100 bg-background-50 hover:border-background-200'
                        )}
                        onClick={() => setActiveInterestCategory(activeInterestCategory === category.id ? null : category.id)}
                      >
                        <div className="flex items-center justify-between cursor-pointer">
                          <span className="font-medium text-background-900">{category.name}</span>
                          <span className="text-sm text-background-500">
                            {category.subTags.filter((t) => audience?.interests?.includes(`${category.id}-${t}`)).length}/{category.subTags.length}
                          </span>
                        </div>
                        {activeInterestCategory === category.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 flex flex-wrap gap-2"
                          >
                            {category.subTags.map((subTag) => {
                              const tagId = `${category.id}-${subTag}`;
                              const isSelected = audience?.interests?.includes(tagId);
                              return (
                                <Tag
                                  key={tagId}
                                  color="accent"
                                  size="sm"
                                  selected={isSelected}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleInterest(tagId);
                                  }}
                                >
                                  {subTag}
                                </Tag>
                              );
                            })}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-success-500" />
                      <span>行为特征</span>
                    </div>
                  }
                  subtitle="描述目标人群的消费和生活行为"
                  action={
                    <div className="text-sm text-background-500">
                      已选 <span className="font-semibold text-success-500">{audience?.behaviors?.length || 0}</span> 个
                    </div>
                  }
                />
                <CardBody>
                  <div className="space-y-6">
                    {Object.entries(groupedBehaviors).map(([category, items]) => (
                      <div key={category}>
                        <h4 className="text-sm font-semibold text-background-700 mb-3 flex items-center gap-2">
                          <TagIcon className="w-3.5 h-3.5" />
                          {category}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {items.map((behavior) => (
                            <Tag
                              key={behavior.id}
                              color="success"
                              size="sm"
                              selected={audience?.behaviors?.includes(behavior.id)}
                              onClick={() => toggleBehavior(behavior.id)}
                            >
                              {behavior.name}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-primary-500" />
                      <span>触媒习惯</span>
                    </div>
                  }
                  subtitle="目标人群常用的媒体平台和内容偏好"
                  action={
                    <div className="text-sm text-background-500">
                      已选 <span className="font-semibold text-primary-500">{audience?.mediaHabits?.length || 0}</span> 个
                    </div>
                  }
                />
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(groupedMediaHabits).map(([category, items]) => {
                      const IconComponent = mediaIcons[category] || Smartphone;
                      return (
                        <div key={category} className="p-4 rounded-xl bg-background-50 border border-background-100">
                          <h4 className="text-sm font-semibold text-background-700 mb-3 flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-primary-500" />
                            {category}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {items.map((habit) => (
                              <Tag
                                key={habit.id}
                                color="primary"
                                size="sm"
                                selected={audience?.mediaHabits?.includes(habit.id)}
                                onClick={() => toggleMediaHabit(habit.id)}
                              >
                                {habit.name}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-accent-500" />
                      <span>痛点与动机</span>
                    </div>
                  }
                  subtitle="描述目标人群的核心痛点和消费动机"
                />
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-background-700">
                        核心痛点
                      </label>
                      <Input
                        multiline
                        size="md"
                        placeholder="描述目标人群面临的主要问题和痛点..."
                        value={audience?.painPoints || ''}
                        onChange={(e) => updateTargetAudience({ painPoints: e.target.value })}
                        rows={4}
                      />
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {painPointSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const current = audience?.painPoints || '';
                              const newValue = current ? `${current}\n- ${suggestion}` : `- ${suggestion}`;
                              updateTargetAudience({ painPoints: newValue });
                            }}
                            className="text-xs px-2 py-1 rounded-md bg-background-100 text-background-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                          >
                            + {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-background-700">
                        消费动机
                      </label>
                      <Input
                        multiline
                        size="md"
                        placeholder="描述目标人群的消费动机和驱动因素..."
                        value={audience?.motivations || ''}
                        onChange={(e) => updateTargetAudience({ motivations: e.target.value })}
                        rows={4}
                      />
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {motivationSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const current = audience?.motivations || '';
                              const newValue = current ? `${current}\n- ${suggestion}` : `- ${suggestion}`;
                              updateTargetAudience({ motivations: newValue });
                            }}
                            className="text-xs px-2 py-1 rounded-md bg-background-100 text-background-600 hover:bg-accent-100 hover:text-accent-600 transition-colors"
                          >
                            + {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:sticky lg:top-32"
            >
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent-500" />
                      <span>人群画像预览</span>
                    </div>
                  }
                  subtitle="实时查看画像完整度"
                />
                <CardBody>
                  <div className="h-64 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#E6EBF2" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#5B5F6A' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar
                          name="画像得分"
                          dataKey="score"
                          stroke="#1E3A5F"
                          fill="#1E3A5F"
                          fillOpacity={0.3}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-background-600">总标签数</span>
                      <span className="font-semibold text-background-900">{totalSelectedTags} 个</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-background-600">兴趣标签</span>
                      <span className="font-semibold text-accent-500">{audience?.interests?.length || 0} 个</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-background-600">行为特征</span>
                      <span className="font-semibold text-success-500">{audience?.behaviors?.length || 0} 个</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-background-600">触媒习惯</span>
                      <span className="font-semibold text-primary-500">{audience?.mediaHabits?.length || 0} 个</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-background-100">
                    <h4 className="text-sm font-medium text-background-700 mb-2">已选标签预览</h4>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {audience?.interests?.slice(0, 10).map((interest) => {
                        const tagParts = interest.split('-');
                        const tagName = tagParts[tagParts.length - 1];
                        return (
                          <Tag key={interest} color="accent" size="sm">
                            {tagName}
                          </Tag>
                        );
                      })}
                      {audience?.behaviors?.slice(0, 5).map((behavior) => {
                        const behaviorData = behaviorTags.find((b) => b.id === behavior);
                        return (
                          <Tag key={behavior} color="success" size="sm">
                            {behaviorData?.name || behavior}
                          </Tag>
                        );
                      })}
                      {audience?.mediaHabits?.slice(0, 5).map((habit) => {
                        const habitData = mediaHabits.find((m) => m.id === habit);
                        return (
                          <Tag key={habit} color="primary" size="sm">
                            {habitData?.name || habit}
                          </Tag>
                        );
                      })}
                      {totalSelectedTags > 20 && (
                        <Tag color="gray" size="sm">
                          +{totalSelectedTags - 20} 更多
                        </Tag>
                      )}
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="w-full space-y-3">
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={handlePrev}
                      leftIcon={<ChevronLeft className="w-4 h-4" />}
                    >
                      上一步：品牌信息
                    </Button>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={handleNext}
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      下一步：生成策略
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>

        <div className="mt-6 pb-8">
          <Card>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  上一步：品牌信息
                </Button>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
                    保存草稿
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    下一步：生成策略
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
