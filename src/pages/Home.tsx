import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  Upload,
  BarChart3,
  Users,
  Lightbulb,
  Share2,
  Sparkles,
  Calendar,
  ChevronRight,
  FilePlus,
  LineChart,
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useProjectStore } from '@/store/useProjectStore';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/utils/helpers';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

const statusMap: Record<Project['status'], { label: string; color: 'primary' | 'success' | 'gray' }> = {
  draft: { label: '进行中', color: 'primary' },
  completed: { label: '已完成', color: 'success' },
  archived: { label: '已归档', color: 'gray' },
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const navigate = useNavigate();
  const { planList, initStore, createNewPlan, loadPlan } = useProjectStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [trendData, setTrendData] = useState<Array<{ date: string; count: number }>>([]);

  useEffect(() => {
    initStore();
  }, [initStore]);

  useEffect(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date, 'MM-dd');
      const count = planList.filter((p) => {
        const created = new Date(p.createdAt);
        return created.toDateString() === date.toDateString();
      }).length;
      data.push({ date: dateStr, count });
    }
    setTrendData(data);
  }, [planList]);

  const stats = useMemo(() => {
    const total = planList.length;
    const inProgress = planList.filter((p) => p.status === 'draft').length;
    const completed = planList.filter((p) => p.status === 'completed').length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent7Days = planList.filter((p) => new Date(p.createdAt) >= sevenDaysAgo).length;

    return { total, inProgress, completed, recent7Days };
  }, [planList]);

  const recentPlans = useMemo(() => {
    return [...planList]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [planList]);

  const handleCreateNew = () => {
    const plan = createNewPlan();
    loadPlan(plan.project.id);
    navigate(`/project/${plan.project.id}/brand`);
  };

  const handlePlanClick = (id: string) => {
    loadPlan(id);
    navigate(`/project/${id}/preview`);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          console.log('导入文件:', event.target?.result);
        } catch (err) {
          console.error('导入失败:', err);
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const statCards = [
    {
      title: '方案总数',
      value: stats.total,
      icon: FileText,
      gradient: 'from-primary-500 to-primary-700',
      bgGradient: 'from-primary-50 to-transparent',
      iconBg: 'bg-primary-500',
      delay: 0,
    },
    {
      title: '进行中',
      value: stats.inProgress,
      icon: Clock,
      gradient: 'from-accent-500 to-accent-700',
      bgGradient: 'from-accent-50 to-transparent',
      iconBg: 'bg-accent-500',
      delay: 0.1,
    },
    {
      title: '已完成',
      value: stats.completed,
      icon: CheckCircle2,
      gradient: 'from-success-500 to-success-700',
      bgGradient: 'from-success-50 to-transparent',
      iconBg: 'bg-success-500',
      delay: 0.2,
    },
    {
      title: '近7天新增',
      value: stats.recent7Days,
      icon: TrendingUp,
      gradient: 'from-violet-500 to-violet-700',
      bgGradient: 'from-violet-50 to-transparent',
      iconBg: 'bg-violet-500',
      delay: 0.3,
    },
  ];

  const features = [
    {
      icon: BarChart3,
      title: '品牌分析',
      description: '深入洞察品牌定位、竞品分析与市场机会',
      color: 'text-primary-500',
      bgColor: 'bg-primary-50',
    },
    {
      icon: Users,
      title: '人群画像',
      description: '精准描绘目标受众特征与行为偏好',
      color: 'text-accent-500',
      bgColor: 'bg-accent-50',
    },
    {
      icon: Lightbulb,
      title: '策略生成',
      description: '智能生成营销创意与传播策略方案',
      color: 'text-success-500',
      bgColor: 'bg-success-50',
    },
    {
      icon: Share2,
      title: '渠道规划',
      description: '全渠道媒体矩阵配置与内容策略',
      color: 'text-violet-500',
      bgColor: 'bg-violet-50',
    },
  ];

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-3xl mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 bg-size-200 animate-gradient-shift" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI 驱动的智能营销策划</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-serif-sc leading-tight">
              营销策划辅助系统
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              融合品牌分析、人群画像、策略生成与渠道规划，
              <br className="hidden sm:block" />
              一站式智能营销方案生成平台，助力高效决策。
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                leftIcon={<Plus className="w-5 h-5" />}
                onClick={handleCreateNew}
                className="bg-white text-primary-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
              >
                新建方案
              </Button>
              <Button
                size="lg"
                variant="outline"
                leftIcon={<Upload className="w-5 h-5" />}
                onClick={handleImport}
                className="border-white/30 text-white hover:bg-white/10"
              >
                导入方案
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
      >
        {statCards.map((card) => (
          <motion.div key={card.title} variants={fadeInUp} transition={{ delay: card.delay }}>
            <Card className="relative overflow-hidden group">
              <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500', card.bgGradient)} />
              <CardBody className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-background-500 font-medium mb-1">{card.title}</p>
                    <p className="text-3xl sm:text-4xl font-bold text-background-900">{card.value}</p>
                  </div>
                  <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg', card.iconBg)}>
                    <card.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-background-100">
                  <div className="flex items-center text-xs text-background-500">
                    <LineChart className="w-3.5 h-3.5 mr-1.5" />
                    <span>实时更新</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Trend Chart Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-8"
      >
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-background-900">创建趋势</h3>
                  <p className="text-sm text-background-500">最近7天方案创建数量</p>
                </div>
              </div>
            }
          />
          <CardBody>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9AA3B3' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9AA3B3' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(30, 58, 95, 0.12)',
                      padding: '8px 12px',
                    }}
                    labelStyle={{ color: '#3C3F47', fontWeight: 600, fontSize: '13px' }}
                    itemStyle={{ color: '#1E3A5F', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1E3A5F"
                    strokeWidth={3}
                    dot={{ fill: '#1E3A5F', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#1E3A5F', stroke: '#fff', strokeWidth: 2 }}
                    fill="url(#colorCount)"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </motion.section>

      {/* Recent Plans Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-background-900">最近方案</h2>
              <p className="text-sm text-background-500">快速访问最近编辑的营销方案</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="text-primary-500"
          >
            查看全部
          </Button>
        </div>

        {recentPlans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {recentPlans.map((plan, index) => {
              const status = statusMap[plan.status];
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                >
                  <Card
                    clickable
                    onClick={() => handlePlanClick(plan.id)}
                    className="h-full group"
                  >
                    <CardBody className="h-full flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center',
                          plan.status === 'completed' ? 'bg-success-100' :
                          plan.status === 'archived' ? 'bg-background-100' : 'bg-primary-100'
                        )}>
                          <FileText className={cn(
                            'w-5 h-5',
                            plan.status === 'completed' ? 'text-success-600' :
                            plan.status === 'archived' ? 'text-background-500' : 'text-primary-600'
                          )} />
                        </div>
                        <Badge color={status.color} size="sm">
                          {status.label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-background-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {plan.name}
                      </h3>
                      <div className="flex items-center text-xs text-background-500 mt-auto">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        <span>{formatDate(plan.createdAt, 'yyyy-MM-dd')}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-background-100 flex items-center justify-between">
                        <span className="text-xs text-background-400">点击查看详情</span>
                        <ChevronRight className="w-4 h-4 text-background-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon={<FilePlus className="w-8 h-8" />}
              title="还没有方案"
              description="创建您的第一个营销方案，开始智能策划之旅"
              action={{
                label: '新建方案',
                onClick: handleCreateNew,
              }}
            />
          </Card>
        )}
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mb-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-background-900 mb-2 font-serif-sc">核心功能</h2>
          <p className="text-background-500">全方位营销策划能力，助力高效决策</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full text-center group cursor-pointer">
                <CardBody className="h-full">
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110',
                    feature.bgColor
                  )}>
                    <feature.icon className={cn('w-7 h-7', feature.color)} />
                  </div>
                  <h3 className="font-semibold text-background-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-background-500 leading-relaxed">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Bottom CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50">
            <CardBody>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-background-900">
                      开启您的智能营销策划之旅
                    </h3>
                    <p className="text-sm text-background-500">
                      高效创建专业营销方案，提升策划效率与质量
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={handleCreateNew}
                    size="lg"
                  >
                    新建方案
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<Upload className="w-4 h-4" />}
                    onClick={handleImport}
                    size="lg"
                  >
                    导入方案
                  </Button>
                </div>
              </div>
            </CardBody>
          </div>
        </Card>
      </motion.section>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
