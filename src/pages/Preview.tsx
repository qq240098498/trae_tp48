import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Calendar,
  Clock,
  Download,
  Share2,
  Printer,
  Edit3,
  Copy,
  Check,
  ArrowLeft,
  Building2,
  Users,
  Lightbulb,
  Share2 as ShareIcon,
  Target,
  Calendar as CalendarIcon,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  X,
  FileJson,
  FileDown,
  Link2,
  BarChart3,
  TrendingUp,
  Eye,
  MessageSquare,
  ShoppingCart,
  Heart,
  Megaphone,
  Mic2,
  MapPin,
  Newspaper,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle2,
  Clock as ClockIcon,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useProjectStore } from '@/store/useProjectStore';
import { formatDateTime, exportPlanAsJSON, downloadFile } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import Badge from '@/components/ui/Badge';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { MarketingPlan, KPIMetric, RiskItem, ResourceItem, TimelinePhase } from '@/types';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const sections: Section[] = [
  { id: 'brand', title: '品牌信息', icon: <Building2 className="w-4 h-4" /> },
  { id: 'audience', title: '目标人群', icon: <Users className="w-4 h-4" /> },
  { id: 'strategy', title: '传播策略', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'channels', title: '渠道矩阵', icon: <ShareIcon className="w-4 h-4" /> },
  { id: 'kpi', title: 'KPI体系', icon: <Target className="w-4 h-4" /> },
  { id: 'timeline', title: '执行排期', icon: <CalendarIcon className="w-4 h-4" /> },
  { id: 'budget', title: '资源预算', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'risks', title: '风险预案', icon: <AlertTriangle className="w-4 h-4" /> },
];

const CHART_COLORS = ['#1E3A5F', '#FF6B35', '#2EC4B6', '#8B5CF6', '#F59E0B', '#EF4444'];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function Preview() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPlan, loadPlan, isLoading, error } = useProjectStore();
  const [activeSection, setActiveSection] = useState<string>('brand');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (id) {
      loadPlan(id);
    }
  }, [id, loadPlan]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const scrollPosition = contentRef.current.scrollTop + 120;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = sectionRefs.current[section.id];
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    const contentEl = contentRef.current;
    if (contentEl) {
      contentEl.addEventListener('scroll', handleScroll);
      return () => contentEl.removeEventListener('scroll', handleScroll);
    }
  }, [currentPlan]);

  const scrollToSection = useCallback((sectionId: string) => {
    const sectionEl = sectionRefs.current[sectionId];
    if (sectionEl && contentRef.current) {
      contentRef.current.scrollTo({
        top: sectionEl.offsetTop - 20,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleExportPDF = () => {
    window.print();
    setExportMenuOpen(false);
  };

  const handleExportJSON = () => {
    if (!currentPlan) return;
    const json = exportPlanAsJSON(currentPlan);
    downloadFile(json, `${currentPlan.project.name}.json`, 'application/json');
    setExportMenuOpen(false);
  };

  const handleExportMarkdown = () => {
    if (!currentPlan) return;
    const markdown = generateMarkdown(currentPlan);
    downloadFile(markdown, `${currentPlan.project.name}.md`, 'text/markdown');
    setExportMenuOpen(false);
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
    setShareMenuOpen(false);
  };

  const handleEdit = () => {
    if (currentPlan) {
      navigate(`/project/${currentPlan.project.id}/brand`);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-background-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !currentPlan) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardBody className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-background-900 mb-2">方案不存在</h3>
            <p className="text-background-500 mb-6">{error || '无法找到该方案，请检查链接是否正确'}</p>
            <Button onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              返回首页
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50 print:bg-white">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-background-100 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                返回
              </Button>
              <div className="h-6 w-px bg-background-200" />
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-background-900 truncate font-serif-sc">
                  {currentPlan.project.name}
                </h1>
                <div className="flex items-center gap-3 text-xs text-background-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    创建于 {formatDateTime(currentPlan.project.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    更新于 {formatDateTime(currentPlan.project.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Download className="w-4 h-4" />}
                  rightIcon={<ChevronDown className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setExportMenuOpen(!exportMenuOpen);
                    setShareMenuOpen(false);
                  }}
                >
                  导出
                </Button>
                <AnimatePresence>
                  {exportMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-background-100 overflow-hidden z-50"
                    >
                      <div className="p-1.5">
                        <button
                          onClick={handleExportPDF}
                          className="w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-background-50 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Printer className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-background-900">导出 PDF</p>
                            <p className="text-xs text-background-500">使用浏览器打印功能</p>
                          </div>
                        </button>
                        <button
                          onClick={handleExportJSON}
                          className="w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-background-50 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-lg bg-accent-100 flex items-center justify-center">
                            <FileJson className="w-4 h-4 text-accent-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-background-900">导出 JSON</p>
                            <p className="text-xs text-background-500">结构化数据文件</p>
                          </div>
                        </button>
                        <button
                          onClick={handleExportMarkdown}
                          className="w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-background-50 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-lg bg-success-100 flex items-center justify-center">
                            <FileDown className="w-4 h-4 text-success-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-background-900">导出 Markdown</p>
                            <p className="text-xs text-background-500">纯文本文档格式</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Share2 className="w-4 h-4" />}
                  rightIcon={<ChevronDown className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setShareMenuOpen(!shareMenuOpen);
                    setExportMenuOpen(false);
                  }}
                >
                  分享
                </Button>
                <AnimatePresence>
                  {shareMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-background-100 overflow-hidden z-50"
                    >
                      <div className="p-1.5">
                        <button
                          onClick={handleCopyLink}
                          className="w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-background-50 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
                            {copied ? (
                              <Check className="w-4 h-4 text-violet-600" />
                            ) : (
                              <Link2 className="w-4 h-4 text-violet-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-background-900">
                              {copied ? '已复制！' : '复制链接'}
                            </p>
                            <p className="text-xs text-background-500">复制方案分享链接</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="outline"
                size="md"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={handleExportPDF}
              >
                打印
              </Button>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Edit3 className="w-4 h-4" />}
                onClick={handleEdit}
              >
                编辑
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        <aside className="hidden lg:block w-60 flex-shrink-0 print:hidden">
          <div className="sticky top-24">
            <nav className="bg-white rounded-2xl shadow-card p-3">
              <p className="px-3 py-2 text-xs font-semibold text-background-400 uppercase tracking-wider">
                目录导航
              </p>
              <ul className="space-y-0.5">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-background-600 hover:bg-background-50 hover:text-background-900'
                      )}
                    >
                      <span className={cn(
                        'flex items-center justify-center w-6 h-6 rounded-md',
                        activeSection === section.id
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-background-100 text-background-500'
                      )}>
                        {section.icon}
                      </span>
                      <span>{section.title}</span>
                      {activeSection === section.id && (
                        <motion.div
                          layoutId="activeSectionIndicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <main
          ref={contentRef}
          className="flex-1 min-w-0 overflow-y-auto max-h-[calc(100vh-10rem)] scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="space-y-6 pb-20">
            <motion.section
              ref={(el) => { sectionRefs.current['brand'] = el; }}
              id="brand"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SectionHeader
                icon={<Building2 className="w-5 h-5" />}
                title="品牌信息"
                subtitle="Brand Information"
                color="primary"
              />
              <Card>
                <CardBody className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoItem label="品牌名称" value={currentPlan.brandInfo.brandName || '-'} />
                    <InfoItem label="所属行业" value={currentPlan.brandInfo.industry || '-'} />
                    <InfoItem label="品牌调性" value={currentPlan.brandInfo.brandTone || '-'} />
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-3">品牌定位语</h4>
                    <p className="text-background-700 leading-relaxed bg-background-50 rounded-xl p-4">
                      {currentPlan.brandInfo.positionStatement || '暂无品牌定位语'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-3">核心价值观</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPlan.brandInfo.coreValues.length > 0 ? (
                        currentPlan.brandInfo.coreValues.map((value, index) => (
                          <Tag key={index} color="primary" size="md">
                            {value}
                          </Tag>
                        ))
                      ) : (
                        <span className="text-background-400 text-sm">暂无核心价值观</span>
                      )}
                    </div>
                  </div>

                  {currentPlan.brandInfo.competitors.length > 0 && (
                    <div className="pt-4 border-t border-background-100">
                      <h4 className="text-sm font-semibold text-background-900 mb-4">竞品分析</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentPlan.brandInfo.competitors.map((comp, index) => (
                          <div key={index} className="p-4 bg-background-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-6 h-6 rounded-lg bg-accent-100 text-accent-600 text-xs font-medium flex items-center justify-center">
                                {index + 1}
                              </span>
                              <span className="font-medium text-background-900">{comp.name || '竞品'}</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex gap-2">
                                <span className="text-success-600 font-medium flex-shrink-0">优势：</span>
                                <span className="text-background-600">{comp.advantage || '-'}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-red-500 font-medium flex-shrink-0">劣势：</span>
                                <span className="text-background-600">{comp.weakness || '-'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.section>

            <motion.section
              ref={(el) => { sectionRefs.current['audience'] = el; }}
              id="audience"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SectionHeader
                icon={<Users className="w-5 h-5" />}
                title="目标人群"
                subtitle="Target Audience"
                color="accent"
              />
              <Card>
                <CardBody className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-background-900">
                        {currentPlan.targetAudience.name || '未命名人群'}
                      </h4>
                      <p className="text-sm text-background-500">目标人群画像概览</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <InfoItem label="年龄范围" value={currentPlan.targetAudience.demographics.ageRange || '-'} />
                    <InfoItem label="性别" value={currentPlan.targetAudience.demographics.gender || '-'} />
                    <InfoItem label="地域" value={currentPlan.targetAudience.demographics.location || '-'} />
                    <InfoItem label="收入水平" value={currentPlan.targetAudience.demographics.income || '-'} />
                    <InfoItem label="学历" value={currentPlan.targetAudience.demographics.education || '-'} />
                    <InfoItem label="职业" value={currentPlan.targetAudience.demographics.occupation || '-'} />
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-3">兴趣爱好</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPlan.targetAudience.interests.length > 0 ? (
                        currentPlan.targetAudience.interests.map((interest, index) => (
                          <Tag key={index} color="accent" size="md">
                            {interest}
                          </Tag>
                        ))
                      ) : (
                        <span className="text-background-400 text-sm">暂无兴趣爱好标签</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-3">行为特征</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPlan.targetAudience.behaviors.length > 0 ? (
                        currentPlan.targetAudience.behaviors.map((behavior, index) => (
                          <Tag key={index} color="success" size="md">
                            {behavior}
                          </Tag>
                        ))
                      ) : (
                        <span className="text-background-400 text-sm">暂无行为特征标签</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-3">触媒习惯</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPlan.targetAudience.mediaHabits.length > 0 ? (
                        currentPlan.targetAudience.mediaHabits.map((habit, index) => (
                          <Tag key={index} color="primary" size="md">
                            {habit}
                          </Tag>
                        ))
                      ) : (
                        <span className="text-background-400 text-sm">暂无触媒习惯标签</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-background-100">
                    <div className="p-4 bg-red-50 rounded-xl">
                      <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        痛点
                      </h4>
                      <p className="text-sm text-red-600">
                        {currentPlan.targetAudience.painPoints || '暂无痛点描述'}
                      </p>
                    </div>
                    <div className="p-4 bg-success-50 rounded-xl">
                      <h4 className="text-sm font-semibold text-success-700 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        动机
                      </h4>
                      <p className="text-sm text-success-600">
                        {currentPlan.targetAudience.motivations || '暂无动机描述'}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.section>

            <motion.section
              ref={(el) => { sectionRefs.current['strategy'] = el; }}
              id="strategy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SectionHeader
                icon={<Lightbulb className="w-5 h-5" />}
                title="传播策略"
                subtitle="Communication Strategy"
                color="success"
              />
              <Card>
                <CardBody className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl text-white">
                    <div className="flex items-center gap-2 mb-2 text-white/80">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-sm font-medium">核心创意概念</span>
                    </div>
                    <h3 className="text-xl font-bold font-serif-sc leading-relaxed">
                      {currentPlan.strategy.coreIdea || '暂无核心创意概念'}
                    </h3>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-semibold text-background-900 mb-3">传播主题</h4>
                    <div className="p-4 bg-background-50 rounded-xl">
                      <p className="text-background-800 font-medium">
                        {currentPlan.strategy.campaignTheme || '暂无传播主题'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-4">关键信息</h4>
                    {currentPlan.strategy.keyMessages.length > 0 ? (
                      <div className="space-y-3">
                        {currentPlan.strategy.keyMessages.map((msg, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-medium flex items-center justify-center mt-0.5">
                              {index + 1}
                            </span>
                            <p className="text-background-700">{msg}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-background-400 text-sm">暂无关键信息</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-3">策略框架说明</h4>
                    <div className="p-4 bg-background-50 rounded-xl">
                      <p className="text-background-700 leading-relaxed whitespace-pre-wrap">
                        {currentPlan.strategy.strategyFramework || '暂无策略框架说明'}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.section>

            <motion.section
              ref={(el) => { sectionRefs.current['channels'] = el; }}
              id="channels"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SectionHeader
                icon={<ShareIcon className="w-5 h-5" />}
                title="渠道矩阵"
                subtitle="Channel Matrix"
                color="violet"
              />
              <Card>
                <CardBody className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ChannelOverviewCard
                      icon={<Megaphone className="w-5 h-5" />}
                      title="社交媒体"
                      count={currentPlan.channelMatrix.socialMedia.platforms.length}
                      color="primary"
                    />
                    <ChannelOverviewCard
                      icon={<Mic2 className="w-5 h-5" />}
                      title="KOL营销"
                      count={currentPlan.channelMatrix.kolMarketing.kolTiers.length}
                      color="accent"
                    />
                    <ChannelOverviewCard
                      icon={<MapPin className="w-5 h-5" />}
                      title="线下活动"
                      count={currentPlan.channelMatrix.offlineEvents.eventTypes.length}
                      color="success"
                    />
                    <ChannelOverviewCard
                      icon={<Newspaper className="w-5 h-5" />}
                      title="PR公关"
                      count={currentPlan.channelMatrix.prRelations.mediaMatrix.length}
                      color="violet"
                    />
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-4 flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-primary-500" />
                      社交媒体
                    </h4>
                    <div className="space-y-4">
                      {currentPlan.channelMatrix.socialMedia.platforms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {currentPlan.channelMatrix.socialMedia.platforms.map((platform, index) => (
                            <div key={index} className="p-3 bg-background-50 rounded-xl">
                              <p className="font-medium text-background-900 mb-1">{platform.name}</p>
                              <p className="text-xs text-background-500">
                                发布频率：{platform.postingFrequency || '-'}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {platform.contentTypes.map((type, i) => (
                                  <span key={i} className="text-xs px-2 py-0.5 bg-primary-100 text-primary-600 rounded-full">
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-background-400 text-sm">暂无社交媒体平台配置</p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <InfoItem label="内容策略" value={currentPlan.channelMatrix.socialMedia.contentStrategy || '-'} />
                        <InfoItem label="社区管理" value={currentPlan.channelMatrix.socialMedia.communityManagement || '-'} />
                        <InfoItem label="广告计划" value={currentPlan.channelMatrix.socialMedia.advertisingPlan || '-'} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-4 flex items-center gap-2">
                      <Mic2 className="w-4 h-4 text-accent-500" />
                      KOL营销
                    </h4>
                    {currentPlan.channelMatrix.kolMarketing.kolTiers.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {currentPlan.channelMatrix.kolMarketing.kolTiers.map((tier, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-background-50 rounded-xl">
                            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center font-bold text-sm">
                              {tier.tier}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-background-900">{tier.description}</p>
                              <p className="text-xs text-background-500">
                                数量：{tier.quantity} 位 | 预算占比：{tier.budgetRatio}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-background-400 text-sm mb-4">暂无KOL层级配置</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-background-500 mb-2">合作类型</p>
                        <div className="flex flex-wrap gap-1.5">
                          {currentPlan.channelMatrix.kolMarketing.cooperationTypes.length > 0 ? (
                            currentPlan.channelMatrix.kolMarketing.cooperationTypes.map((type, i) => (
                              <Tag key={i} color="accent" size="sm">
                                {type}
                              </Tag>
                            ))
                          ) : (
                            <span className="text-background-400 text-sm">-</span>
                          )}
                        </div>
                      </div>
                      <InfoItem label="内容方向" value={currentPlan.channelMatrix.kolMarketing.contentDirection || '-'} />
                      <InfoItem label="甄选标准" value={currentPlan.channelMatrix.kolMarketing.selectionCriteria || '-'} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-success-500" />
                      线下活动
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-background-500 mb-2">活动类型</p>
                        <div className="flex flex-wrap gap-1.5">
                          {currentPlan.channelMatrix.offlineEvents.eventTypes.length > 0 ? (
                            currentPlan.channelMatrix.offlineEvents.eventTypes.map((type, i) => (
                              <Tag key={i} color="success" size="sm">
                                {type}
                              </Tag>
                            ))
                          ) : (
                            <span className="text-background-400 text-sm">-</span>
                          )}
                        </div>
                      </div>
                      <InfoItem label="活动规模" value={currentPlan.channelMatrix.offlineEvents.scale || '-'} />
                      <InfoItem label="场地建议" value={currentPlan.channelMatrix.offlineEvents.venueSuggestions || '-'} />
                      <InfoItem label="预计参与" value={currentPlan.channelMatrix.offlineEvents.expectedAttendance || '-'} />
                    </div>
                    <div className="mt-4 p-4 bg-background-50 rounded-xl">
                      <p className="text-xs font-medium text-background-500 mb-2">现场活动</p>
                      <p className="text-sm text-background-700">
                        {currentPlan.channelMatrix.offlineEvents.onsiteActivities || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-4 flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-violet-500" />
                      PR公关
                    </h4>
                    <div className="mb-4">
                      <p className="text-xs font-medium text-background-500 mb-2">媒体矩阵</p>
                      <div className="flex flex-wrap gap-1.5">
                        {currentPlan.channelMatrix.prRelations.mediaMatrix.length > 0 ? (
                          currentPlan.channelMatrix.prRelations.mediaMatrix.map((media, i) => (
                            <Tag key={i} color="gray" size="sm">
                              {media}
                            </Tag>
                          ))
                        ) : (
                          <span className="text-background-400 text-sm">-</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoItem label="发布节奏" value={currentPlan.channelMatrix.prRelations.publishingRhythm || '-'} />
                      <InfoItem label="危机预案" value={currentPlan.channelMatrix.prRelations.crisisPlan || '-'} />
                    </div>
                    {currentPlan.channelMatrix.prRelations.contentPlan.length > 0 && (
                      <div className="mt-4 p-4 bg-background-50 rounded-xl">
                        <p className="text-xs font-medium text-background-500 mb-2">内容计划</p>
                        <ul className="space-y-1.5">
                          {currentPlan.channelMatrix.prRelations.contentPlan.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-background-700">
                              <span className="text-violet-500 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.section>

            <motion.section
              ref={(el) => { sectionRefs.current['kpi'] = el; }}
              id="kpi"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <SectionHeader
                icon={<Target className="w-5 h-5" />}
                title="KPI体系"
                subtitle="KPI System"
                color="primary"
              />
              <Card>
                <CardBody className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-background-900 mb-4">四层漏斗模型</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getFunnelData(currentPlan)}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {getFunnelData(currentPlan).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-background-900 mb-4">各层指标数量</h4>
                      <FunnelLevelBadge
                        color="primary"
                        name="认知层"
                        count={currentPlan.kpiSettings.awarenessMetrics.length}
                      />
                      <FunnelLevelBadge
                        color="accent"
                        name="参与层"
                        count={currentPlan.kpiSettings.engagementMetrics.length}
                      />
                      <FunnelLevelBadge
                        color="success"
                        name="转化层"
                        count={currentPlan.kpiSettings.conversionMetrics.length}
                      />
                      <FunnelLevelBadge
                        color="violet"
                        name="忠诚层"
                        count={currentPlan.kpiSettings.loyaltyMetrics?.length || 0}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-4 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary-500" />
                      认知层指标
                    </h4>
                    <KPIMetricsList metrics={currentPlan.kpiSettings.awarenessMetrics} color="primary" />
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-accent-500" />
                      参与层指标
                    </h4>
                    <KPIMetricsList metrics={currentPlan.kpiSettings.engagementMetrics} color="accent" />
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-4 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-success-500" />
                      转化层指标
                    </h4>
                    <KPIMetricsList metrics={currentPlan.kpiSettings.conversionMetrics} color="success" />
                  </div>

                  {currentPlan.kpiSettings.loyaltyMetrics && currentPlan.kpiSettings.loyaltyMetrics.length > 0 && (
                    <div className="pt-4 border-t border-background-100">
                      <h4 className="text-sm font-semibold text-background-900 mb-4 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-violet-500" />
                        忠诚层指标
                      </h4>
                      <KPIMetricsList metrics={currentPlan.kpiSettings.loyaltyMetrics} color="violet" />
                    </div>
                  )}

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-3">归因模型</h4>
                    <div className="p-4 bg-primary-50 rounded-xl">
                      <p className="text-primary-700">
                        {currentPlan.kpiSettings.attributionModel || '暂无归因模型说明'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-background-100">
                    <h4 className="text-sm font-semibold text-background-900 mb-4">监测方案</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-medium text-background-500 mb-2">监测工具</p>
                        <div className="flex flex-wrap gap-1.5">
                          {currentPlan.kpiSettings.monitoringPlan.tools.length > 0 ? (
                            currentPlan.kpiSettings.monitoringPlan.tools.map((tool, i) => (
                              <Tag key={i} color="primary" size="sm">
                                {tool}
                              </Tag>
                            ))
                          ) : (
                            <span className="text-background-400 text-sm">-</span>
                          )}
                        </div>
                      </div>
                      <InfoItem label="监测频率" value={currentPlan.kpiSettings.monitoringPlan.frequency || '-'} />
                      <InfoItem label="报告格式" value={currentPlan.kpiSettings.monitoringPlan.reportingFormat || '-'} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.section>

            <motion.section
              ref={(el) => { sectionRefs.current['timeline'] = el; }}
              id="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <SectionHeader
                icon={<CalendarIcon className="w-5 h-5" />}
                title="执行排期"
                subtitle="Execution Timeline"
                color="accent"
              />
              <Card>
                <CardBody className="space-y-6">
                  {currentPlan.executionPlan.timeline.length > 0 ? (
                    <div className="relative">
                      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-background-200" />
                      <div className="space-y-6">
                        {currentPlan.executionPlan.timeline.map((phase, index) => (
                          <TimelinePhaseItem key={index} phase={phase} index={index} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-background-400 text-center py-8">暂无执行排期</p>
                  )}
                </CardBody>
              </Card>
            </motion.section>

            <motion.section
              ref={(el) => { sectionRefs.current['budget'] = el; }}
              id="budget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <SectionHeader
                icon={<DollarSign className="w-5 h-5" />}
                title="资源预算"
                subtitle="Resource Budget"
                color="success"
              />
              <Card>
                <CardBody className="space-y-6">
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-success-50 to-primary-50 rounded-2xl">
                    <div>
                      <p className="text-sm text-background-500 mb-1">总预算</p>
                      <p className="text-3xl font-bold text-background-900 font-serif-sc">
                        {currentPlan.executionPlan.totalBudget || '-'}
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success-400 to-primary-500 flex items-center justify-center shadow-lg">
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {currentPlan.executionPlan.resources.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-background-200">
                            <th className="text-left py-3 px-2 font-medium text-background-500">类别</th>
                            <th className="text-left py-3 px-2 font-medium text-background-500">项目</th>
                            <th className="text-left py-3 px-2 font-medium text-background-500">数量</th>
                            <th className="text-left py-3 px-2 font-medium text-background-500">预算</th>
                            <th className="text-left py-3 px-2 font-medium text-background-500">负责人</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentPlan.executionPlan.resources.map((resource, index) => (
                            <tr key={index} className="border-b border-background-100 hover:bg-background-50">
                              <td className="py-3 px-2">
                                <Tag color="primary" size="sm">{resource.category}</Tag>
                              </td>
                              <td className="py-3 px-2 text-background-900">{resource.item}</td>
                              <td className="py-3 px-2 text-background-600">{resource.quantity}</td>
                              <td className="py-3 px-2 font-medium text-success-600">{resource.budget}</td>
                              <td className="py-3 px-2 text-background-600">{resource.responsible}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-background-400 text-center py-8">暂无资源预算明细</p>
                  )}
                </CardBody>
              </Card>
            </motion.section>

            <motion.section
              ref={(el) => { sectionRefs.current['risks'] = el; }}
              id="risks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <SectionHeader
                icon={<AlertTriangle className="w-5 h-5" />}
                title="风险预案"
                subtitle="Risk Management"
                color="warning"
              />
              <Card>
                <CardBody className="space-y-6">
                  {currentPlan.executionPlan.risks.length > 0 ? (
                    <div className="space-y-4">
                      {currentPlan.executionPlan.risks.map((risk, index) => (
                        <RiskCard key={index} risk={risk} index={index} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-background-400 text-center py-8">暂无风险项</p>
                  )}

                  {currentPlan.executionPlan.optimizationPlan && (
                    <div className="pt-4 border-t border-background-100">
                      <h4 className="text-sm font-semibold text-background-900 mb-3">优化方案</h4>
                      <div className="p-4 bg-background-50 rounded-xl">
                        <p className="text-background-700 leading-relaxed whitespace-pre-wrap">
                          {currentPlan.executionPlan.optimizationPlan}
                        </p>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.section>
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-background-100 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Button variant="outline" size="md" onClick={handleEdit} leftIcon={<Edit3 className="w-4 h-4" />}>
            返回编辑
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md" onClick={handleCopyLink} leftIcon={<Copy className="w-4 h-4" />}>
              复制分享
            </Button>
            <Button variant="primary" size="md" onClick={() => setExportMenuOpen(!exportMenuOpen)} rightIcon={<ChevronDown className="w-3.5 h-3.5" />}>
              导出方案
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          main {
            max-height: none !important;
            overflow: visible !important;
          }
          section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .shadow-card {
            box-shadow: none !important;
            border: 1px solid #e6ebf2;
          }
        }
      `}</style>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: 'primary' | 'accent' | 'success' | 'warning' | 'violet';
}) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary-100 text-primary-600',
    accent: 'bg-accent-100 text-accent-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-amber-100 text-amber-600',
    violet: 'bg-violet-100 text-violet-600',
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorClasses[color])}>
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-background-900 font-serif-sc">{title}</h2>
        <p className="text-xs text-background-400 uppercase tracking-wider">{subtitle}</p>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-background-500 mb-1">{label}</p>
      <p className="text-sm text-background-900 font-medium truncate" title={value}>
        {value}
      </p>
    </div>
  );
}

function ChannelOverviewCard({
  icon,
  title,
  count,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: 'primary' | 'accent' | 'success' | 'violet';
}) {
  const colorClasses: Record<string, { bg: string; text: string; light: string }> = {
    primary: { bg: 'bg-primary-500', text: 'text-primary-600', light: 'bg-primary-50' },
    accent: { bg: 'bg-accent-500', text: 'text-accent-600', light: 'bg-accent-50' },
    success: { bg: 'bg-success-500', text: 'text-success-600', light: 'bg-success-50' },
    violet: { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50' },
  };

  const c = colorClasses[color];

  return (
    <div className={cn('p-4 rounded-xl', c.light)}>
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-white', c.bg)}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-background-900">{count}</p>
          <p className={cn('text-xs font-medium', c.text)}>{title}</p>
        </div>
      </div>
    </div>
  );
}

function FunnelLevelBadge({
  color,
  name,
  count,
}: {
  color: 'primary' | 'accent' | 'success' | 'violet';
  name: string;
  count: number;
}) {
  const colorClasses: Record<string, { bg: string; text: string; bar: string }> = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-700', bar: 'bg-primary-500' },
    accent: { bg: 'bg-accent-50', text: 'text-accent-700', bar: 'bg-accent-500' },
    success: { bg: 'bg-success-50', text: 'text-success-700', bar: 'bg-success-500' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', bar: 'bg-violet-500' },
  };

  const c = colorClasses[color];

  return (
    <div className={cn('p-3 rounded-xl', c.bg)}>
      <div className="flex items-center justify-between mb-2">
        <span className={cn('font-medium', c.text)}>{name}</span>
        <span className={cn('text-lg font-bold', c.text)}>{count}</span>
      </div>
      <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', c.bar)}
          style={{ width: `${Math.min(count * 10, 100)}%` }}
        />
      </div>
    </div>
  );
}

function KPIMetricsList({
  metrics,
  color,
}: {
  metrics: KPIMetric[];
  color: 'primary' | 'accent' | 'success' | 'violet';
}) {
  if (metrics.length === 0) {
    return <p className="text-background-400 text-sm">暂无指标</p>;
  }

  const colorClasses: Record<string, string> = {
    primary: 'bg-primary-100 text-primary-600',
    accent: 'bg-accent-100 text-accent-600',
    success: 'bg-success-100 text-success-600',
    violet: 'bg-violet-100 text-violet-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {metrics.map((metric, index) => (
        <div key={index} className="p-4 bg-background-50 rounded-xl">
          <div className="flex items-start justify-between mb-2">
            <h5 className="font-medium text-background-900">{metric.name}</h5>
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', colorClasses[color])}>
              {metric.target} {metric.unit}
            </span>
          </div>
          <p className="text-xs text-background-500 mb-2">{metric.description}</p>
          <p className="text-xs text-background-400">
            测量方式：{metric.measurementMethod}
          </p>
        </div>
      ))}
    </div>
  );
}

function TimelinePhaseItem({ phase, index }: { phase: TimelinePhase; index: number }) {
  const colors = ['primary', 'accent', 'success'];
  const color = colors[index % colors.length];

  const colorClasses: Record<string, { bg: string; text: string; dot: string }> = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500' },
    accent: { bg: 'bg-accent-50', text: 'text-accent-700', dot: 'bg-accent-500' },
    success: { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500' },
  };

  const c = colorClasses[color];

  return (
    <div className="relative pl-10">
      <div className={cn(
        'absolute left-2 top-1 w-5 h-5 rounded-full border-4 border-white shadow-md flex items-center justify-center',
        c.dot
      )}>
        <span className="text-white text-[10px] font-bold">{index + 1}</span>
      </div>
      <div className={cn('p-5 rounded-2xl', c.bg)}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className={cn('font-bold text-lg', c.text)}>{phase.name}</h4>
            <p className="text-sm text-background-500 mt-1">{phase.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-background-500">时间范围</p>
            <p className="text-sm font-medium text-background-700">
              {phase.startDate} - {phase.endDate}
            </p>
          </div>
        </div>

        {phase.keyActivities.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-background-500 mb-2">关键活动</p>
            <div className="flex flex-wrap gap-1.5">
              {phase.keyActivities.map((activity, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-white/80 text-background-700 rounded-lg">
                  {activity}
                </span>
              ))}
            </div>
          </div>
        )}

        {phase.deliverables.length > 0 && (
          <div>
            <p className="text-xs font-medium text-background-500 mb-2">交付物</p>
            <ul className="space-y-1">
              {phase.deliverables.map((deliverable, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-background-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success-500 flex-shrink-0" />
                  <span>{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function RiskCard({ risk, index }: { risk: RiskItem; index: number }) {
  const probabilityColors: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-red-100', text: 'text-red-700', label: '高概率' },
    medium: { bg: 'bg-amber-100', text: 'text-amber-700', label: '中概率' },
    low: { bg: 'bg-green-100', text: 'text-green-700', label: '低概率' },
  };

  const impactColors: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-red-100', text: 'text-red-700', label: '高影响' },
    medium: { bg: 'bg-amber-100', text: 'text-amber-700', label: '中影响' },
    low: { bg: 'bg-green-100', text: 'text-green-700', label: '低影响' },
  };

  const prob = probabilityColors[risk.probability];
  const imp = impactColors[risk.impact];

  return (
    <div className="p-5 bg-background-50 rounded-xl">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
            {index + 1}
          </span>
          <h4 className="font-medium text-background-900">{risk.risk}</h4>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', prob.bg, prob.text)}>
            {prob.label}
          </span>
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', imp.bg, imp.text)}>
            {imp.label}
          </span>
        </div>
      </div>
      <div className="pl-11">
        <p className="text-xs font-medium text-background-500 mb-1">应对措施</p>
        <p className="text-sm text-background-700">{risk.response}</p>
      </div>
    </div>
  );
}

function getFunnelData(plan: MarketingPlan) {
  const awareness = plan.kpiSettings.awarenessMetrics.length;
  const engagement = plan.kpiSettings.engagementMetrics.length;
  const conversion = plan.kpiSettings.conversionMetrics.length;
  const loyalty = plan.kpiSettings.loyaltyMetrics?.length || 0;

  const total = awareness + engagement + conversion + loyalty || 1;

  return [
    { name: '认知层', value: awareness || 0.1, count: awareness },
    { name: '参与层', value: engagement || 0.1, count: engagement },
    { name: '转化层', value: conversion || 0.1, count: conversion },
    { name: '忠诚层', value: loyalty || 0.1, count: loyalty },
  ];
}

function generateMarkdown(plan: MarketingPlan): string {
  const lines: string[] = [];

  lines.push(`# ${plan.project.name}`);
  lines.push('');
  lines.push(`> 创建时间：${plan.project.createdAt}`);
  lines.push(`> 更新时间：${plan.project.updatedAt}`);
  lines.push('');

  lines.push('## 一、品牌信息');
  lines.push('');
  lines.push(`- **品牌名称**：${plan.brandInfo.brandName || '-'}  `);
  lines.push(`- **所属行业**：${plan.brandInfo.industry || '-'}  `);
  lines.push(`- **品牌调性**：${plan.brandInfo.brandTone || '-'}  `);
  lines.push('');
  lines.push('### 品牌定位语');
  lines.push('');
  lines.push(`> ${plan.brandInfo.positionStatement || '暂无'}`);
  lines.push('');
  lines.push('### 核心价值观');
  lines.push('');
  if (plan.brandInfo.coreValues.length > 0) {
    plan.brandInfo.coreValues.forEach((v) => {
      lines.push(`- ${v}`);
    });
  } else {
    lines.push('暂无');
  }
  lines.push('');

  if (plan.brandInfo.competitors.length > 0) {
    lines.push('### 竞品分析');
    lines.push('');
    plan.brandInfo.competitors.forEach((comp, idx) => {
      lines.push(`**${idx + 1}. ${comp.name || '竞品'}**  `);
      lines.push(`- 优势：${comp.advantage || '-'}  `);
      lines.push(`- 劣势：${comp.weakness || '-'}  `);
      lines.push('');
    });
  }

  lines.push('## 二、目标人群');
  lines.push('');
  lines.push(`### ${plan.targetAudience.name || '未命名人群'}`);
  lines.push('');
  lines.push('| 属性 | 值 |');
  lines.push('|------|-----|');
  lines.push(`| 年龄范围 | ${plan.targetAudience.demographics.ageRange || '-'} |`);
  lines.push(`| 性别 | ${plan.targetAudience.demographics.gender || '-'} |`);
  lines.push(`| 地域 | ${plan.targetAudience.demographics.location || '-'} |`);
  lines.push(`| 收入水平 | ${plan.targetAudience.demographics.income || '-'} |`);
  lines.push(`| 学历 | ${plan.targetAudience.demographics.education || '-'} |`);
  lines.push(`| 职业 | ${plan.targetAudience.demographics.occupation || '-'} |`);
  lines.push('');

  lines.push('### 兴趣爱好');
  lines.push('');
  if (plan.targetAudience.interests.length > 0) {
    plan.targetAudience.interests.forEach((i) => lines.push(`- ${i}`));
  } else {
    lines.push('暂无');
  }
  lines.push('');

  lines.push('### 行为特征');
  lines.push('');
  if (plan.targetAudience.behaviors.length > 0) {
    plan.targetAudience.behaviors.forEach((b) => lines.push(`- ${b}`));
  } else {
    lines.push('暂无');
  }
  lines.push('');

  lines.push('### 触媒习惯');
  lines.push('');
  if (plan.targetAudience.mediaHabits.length > 0) {
    plan.targetAudience.mediaHabits.forEach((m) => lines.push(`- ${m}`));
  } else {
    lines.push('暂无');
  }
  lines.push('');

  lines.push('### 痛点与动机');
  lines.push('');
  lines.push(`**痛点**：${plan.targetAudience.painPoints || '暂无'}  `);
  lines.push('');
  lines.push(`**动机**：${plan.targetAudience.motivations || '暂无'}  `);
  lines.push('');

  lines.push('## 三、传播策略');
  lines.push('');
  lines.push('### 核心创意概念');
  lines.push('');
  lines.push(`> ${plan.strategy.coreIdea || '暂无'}`);
  lines.push('');
  lines.push('### 传播主题');
  lines.push('');
  lines.push(`${plan.strategy.campaignTheme || '暂无'}`);
  lines.push('');

  lines.push('### 关键信息');
  lines.push('');
  if (plan.strategy.keyMessages.length > 0) {
    plan.strategy.keyMessages.forEach((msg, idx) => {
      lines.push(`${idx + 1}. ${msg}`);
    });
  } else {
    lines.push('暂无');
  }
  lines.push('');

  lines.push('### 策略框架说明');
  lines.push('');
  lines.push(plan.strategy.strategyFramework || '暂无');
  lines.push('');

  lines.push('## 四、渠道矩阵');
  lines.push('');
  lines.push('### 社交媒体');
  lines.push('');
  if (plan.channelMatrix.socialMedia.platforms.length > 0) {
    plan.channelMatrix.socialMedia.platforms.forEach((p) => {
      lines.push(`- **${p.name}**：发布频率 ${p.postingFrequency || '-'}  `);
      if (p.contentTypes.length > 0) {
        lines.push(`  内容类型：${p.contentTypes.join('、')}`);
      }
    });
  } else {
    lines.push('暂无');
  }
  lines.push('');
  lines.push(`- **内容策略**：${plan.channelMatrix.socialMedia.contentStrategy || '-'}  `);
  lines.push(`- **社区管理**：${plan.channelMatrix.socialMedia.communityManagement || '-'}  `);
  lines.push(`- **广告计划**：${plan.channelMatrix.socialMedia.advertisingPlan || '-'}  `);
  lines.push('');

  lines.push('### KOL营销');
  lines.push('');
  if (plan.channelMatrix.kolMarketing.kolTiers.length > 0) {
    plan.channelMatrix.kolMarketing.kolTiers.forEach((tier) => {
      lines.push(`- **${tier.tier}层**：${tier.description}  `);
      lines.push(`  数量：${tier.quantity}位 | 预算占比：${tier.budgetRatio}`);
    });
  } else {
    lines.push('暂无');
  }
  lines.push('');
  lines.push(`- **合作类型**：${plan.channelMatrix.kolMarketing.cooperationTypes.join('、') || '-'}  `);
  lines.push(`- **内容方向**：${plan.channelMatrix.kolMarketing.contentDirection || '-'}  `);
  lines.push(`- **甄选标准**：${plan.channelMatrix.kolMarketing.selectionCriteria || '-'}  `);
  lines.push('');

  lines.push('### 线下活动');
  lines.push('');
  lines.push(`- **活动类型**：${plan.channelMatrix.offlineEvents.eventTypes.join('、') || '-'}  `);
  lines.push(`- **活动规模**：${plan.channelMatrix.offlineEvents.scale || '-'}  `);
  lines.push(`- **场地建议**：${plan.channelMatrix.offlineEvents.venueSuggestions || '-'}  `);
  lines.push(`- **预计参与**：${plan.channelMatrix.offlineEvents.expectedAttendance || '-'}  `);
  lines.push(`- **现场活动**：${plan.channelMatrix.offlineEvents.onsiteActivities || '-'}  `);
  lines.push('');

  lines.push('### PR公关');
  lines.push('');
  lines.push(`- **媒体矩阵**：${plan.channelMatrix.prRelations.mediaMatrix.join('、') || '-'}  `);
  lines.push(`- **发布节奏**：${plan.channelMatrix.prRelations.publishingRhythm || '-'}  `);
  lines.push(`- **危机预案**：${plan.channelMatrix.prRelations.crisisPlan || '-'}  `);
  lines.push('');
  if (plan.channelMatrix.prRelations.contentPlan.length > 0) {
    lines.push('**内容计划**：');
    lines.push('');
    plan.channelMatrix.prRelations.contentPlan.forEach((item) => {
      lines.push(`- ${item}`);
    });
    lines.push('');
  }

  lines.push('## 五、KPI体系');
  lines.push('');
  lines.push('### 认知层指标');
  lines.push('');
  if (plan.kpiSettings.awarenessMetrics.length > 0) {
    plan.kpiSettings.awarenessMetrics.forEach((m) => {
      lines.push(`- **${m.name}**：目标 ${m.target}${m.unit}  `);
      lines.push(`  ${m.description}  `);
      lines.push(`  测量方式：${m.measurementMethod}`);
    });
  } else {
    lines.push('暂无');
  }
  lines.push('');

  lines.push('### 参与层指标');
  lines.push('');
  if (plan.kpiSettings.engagementMetrics.length > 0) {
    plan.kpiSettings.engagementMetrics.forEach((m) => {
      lines.push(`- **${m.name}**：目标 ${m.target}${m.unit}  `);
      lines.push(`  ${m.description}  `);
      lines.push(`  测量方式：${m.measurementMethod}`);
    });
  } else {
    lines.push('暂无');
  }
  lines.push('');

  lines.push('### 转化层指标');
  lines.push('');
  if (plan.kpiSettings.conversionMetrics.length > 0) {
    plan.kpiSettings.conversionMetrics.forEach((m) => {
      lines.push(`- **${m.name}**：目标 ${m.target}${m.unit}  `);
      lines.push(`  ${m.description}  `);
      lines.push(`  测量方式：${m.measurementMethod}`);
    });
  } else {
    lines.push('暂无');
  }
  lines.push('');

  if (plan.kpiSettings.loyaltyMetrics && plan.kpiSettings.loyaltyMetrics.length > 0) {
    lines.push('### 忠诚层指标');
    lines.push('');
    plan.kpiSettings.loyaltyMetrics.forEach((m) => {
      lines.push(`- **${m.name}**：目标 ${m.target}${m.unit}  `);
      lines.push(`  ${m.description}  `);
      lines.push(`  测量方式：${m.measurementMethod}`);
    });
    lines.push('');
  }

  lines.push('### 归因模型');
  lines.push('');
  lines.push(plan.kpiSettings.attributionModel || '暂无');
  lines.push('');

  lines.push('### 监测方案');
  lines.push('');
  lines.push(`- **监测工具**：${plan.kpiSettings.monitoringPlan.tools.join('、') || '-'}  `);
  lines.push(`- **监测频率**：${plan.kpiSettings.monitoringPlan.frequency || '-'}  `);
  lines.push(`- **报告格式**：${plan.kpiSettings.monitoringPlan.reportingFormat || '-'}  `);
  lines.push('');

  lines.push('## 六、执行排期');
  lines.push('');
  if (plan.executionPlan.timeline.length > 0) {
    plan.executionPlan.timeline.forEach((phase, idx) => {
      lines.push(`### ${idx + 1}. ${phase.name}`);
      lines.push('');
      lines.push(`- **时长**：${phase.duration}  `);
      lines.push(`- **时间**：${phase.startDate} - ${phase.endDate}  `);
      lines.push('');
      if (phase.keyActivities.length > 0) {
        lines.push('**关键活动**：');
        phase.keyActivities.forEach((a) => lines.push(`- ${a}`));
        lines.push('');
      }
      if (phase.deliverables.length > 0) {
        lines.push('**交付物**：');
        phase.deliverables.forEach((d) => lines.push(`- ${d}`));
        lines.push('');
      }
    });
  } else {
    lines.push('暂无');
    lines.push('');
  }

  lines.push('## 七、资源预算');
  lines.push('');
  lines.push(`**总预算**：${plan.executionPlan.totalBudget || '-'}  `);
  lines.push('');
  if (plan.executionPlan.resources.length > 0) {
    lines.push('| 类别 | 项目 | 数量 | 预算 | 负责人 |');
    lines.push('|------|------|------|------|--------|');
    plan.executionPlan.resources.forEach((r) => {
      lines.push(`| ${r.category} | ${r.item} | ${r.quantity} | ${r.budget} | ${r.responsible} |`);
    });
  } else {
    lines.push('暂无明细');
  }
  lines.push('');

  lines.push('## 八、风险预案');
  lines.push('');
  if (plan.executionPlan.risks.length > 0) {
    plan.executionPlan.risks.forEach((risk, idx) => {
      lines.push(`### ${idx + 1}. ${risk.risk}`);
      lines.push('');
      lines.push(`- **概率**：${risk.probability}  `);
      lines.push(`- **影响**：${risk.impact}  `);
      lines.push(`- **应对措施**：${risk.response}  `);
      lines.push('');
    });
  } else {
    lines.push('暂无');
    lines.push('');
  }

  if (plan.executionPlan.optimizationPlan) {
    lines.push('### 优化方案');
    lines.push('');
    lines.push(plan.executionPlan.optimizationPlan);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(`*本方案由营销策划辅助系统生成，最后更新于 ${plan.project.updatedAt}*`);

  return lines.join('\n');
}
