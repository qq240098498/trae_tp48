import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles,
  Lightbulb,
  Heart,
  Shield,
  Zap,
  Palette,
  Users,
  Target,
  Building2,
  Tag as TagIcon,
  X,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { industries, brandTones, coreValues, coreValueCategories } from '@/data/brandTemplates';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Tag from '@/components/ui/Tag';
import StepIndicator from '@/components/ui/StepIndicator';
import { cn } from '@/lib/utils';
import type { BrandInfo as BrandInfoType } from '@/types';

const steps = [
  { id: 1, label: '品牌信息' },
  { id: 2, label: '人群画像' },
  { id: 3, label: '传播策略' },
  { id: 4, label: '渠道矩阵' },
  { id: 5, label: 'KPI设置' },
  { id: 6, label: '执行方案' },
];

const toneIcons: Record<string, React.ReactNode> = {
  professional: <Shield className="w-6 h-6" />,
  young: <Sparkles className="w-6 h-6" />,
  premium: <Gem className="w-6 h-6" />,
  approachable: <Heart className="w-6 h-6" />,
  tech: <Zap className="w-6 h-6" />,
  artistic: <Palette className="w-6 h-6" />,
  humorous: <Lightbulb className="w-6 h-6" />,
  warm: <Heart className="w-6 h-6" />,
  bold: <Zap className="w-6 h-6" />,
  minimalist: <Target className="w-6 h-6" />,
  energetic: <Sparkles className="w-6 h-6" />,
  reliable: <Shield className="w-6 h-6" />,
};

function Gem(props: any) {
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
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M11 3 8 9l4 13 4-13-3-6" />
      <path d="M2 9h20" />
    </svg>
  );
}

export default function BrandInfoPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPlan, createNewPlan, loadPlan, updateBrandInfo, saveCurrentPlan } = useProjectStore();

  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(coreValueCategories[0]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id === 'new') {
      createNewPlan('未命名方案');
    } else if (id) {
      loadPlan(id);
    }
  }, [id, createNewPlan, loadPlan]);

  const brandInfo = currentPlan?.brandInfo;

  const handleFieldChange = (field: keyof BrandInfoType, value: any) => {
    updateBrandInfo({ [field]: value });
  };

  const handleSave = () => {
    saveCurrentPlan();
  };

  const validateBrandInfo = (): boolean => {
    const errors: Record<string, string> = {};
    if (!brandInfo?.brandName?.trim()) {
      errors.brandName = '请输入品牌名称';
    }
    if (!brandInfo?.industry) {
      errors.industry = '请选择所属行业';
    }
    if (!brandInfo?.brandTone) {
      errors.brandTone = '请选择品牌调性';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateBrandInfo()) return;
    saveCurrentPlan();
    const planId = currentPlan?.project.id || 'new';
    navigate(`/project/${planId}/audience`);
  };

  const handleToneSelect = (toneId: string) => {
    handleFieldChange('brandTone', toneId);
    if (validationErrors.brandTone) setValidationErrors((prev) => { const next = { ...prev }; delete next.brandTone; return next; });
  };

  const handleValueToggle = (valueId: string) => {
    if (!brandInfo) return;
    const values = brandInfo.coreValues.includes(valueId)
      ? brandInfo.coreValues.filter((v) => v !== valueId)
      : [...brandInfo.coreValues, valueId];
    handleFieldChange('coreValues', values);
  };

  const handleAddCustomValue = () => {
    if (!customValue.trim() || !brandInfo) return;
    const values = [...brandInfo.coreValues, customValue.trim()];
    handleFieldChange('coreValues', values);
    setCustomValue('');
  };

  const handleAddCompetitor = () => {
    if (!brandInfo) return;
    const competitors = [
      ...brandInfo.competitors,
      { name: '', advantage: '', weakness: '' },
    ];
    handleFieldChange('competitors', competitors);
  };

  const handleRemoveCompetitor = (index: number) => {
    if (!brandInfo) return;
    const competitors = brandInfo.competitors.filter((_, i) => i !== index);
    handleFieldChange('competitors', competitors);
  };

  const handleCompetitorChange = (index: number, field: string, value: string) => {
    if (!brandInfo) return;
    const competitors = [...brandInfo.competitors];
    (competitors[index] as any)[field] = value;
    handleFieldChange('competitors', competitors);
  };

  const selectedIndustry = useMemo(() => {
    return industries.find((ind) => ind.name === brandInfo?.industry);
  }, [brandInfo?.industry]);

  const filteredValues = useMemo(() => {
    return coreValues.filter((v) => v.category === activeCategory);
  }, [activeCategory]);

  if (!brandInfo) {
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
            <h1 className="text-2xl font-bold text-background-900">品牌信息</h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="md" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
                保存草稿
              </Button>
              <Button variant="primary" size="md" rightIcon={<ChevronRight className="w-4 h-4" />} onClick={handleNext}>
                下一步
              </Button>
            </div>
          </div>
          <StepIndicator steps={steps} currentStep={0} showLabels={true} />
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
                      <Building2 className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-background-900">品牌基础信息</h3>
                      <p className="text-sm text-background-500 mt-0.5">填写品牌的基本信息，帮助我们更好地了解您的品牌</p>
                    </div>
                  </div>
                }
              />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-1">
                    <Input
                      label="品牌名称"
                      required
                      placeholder="请输入品牌名称"
                      size="lg"
                      value={brandInfo.brandName}
                      onChange={(e) => {
                        handleFieldChange('brandName', e.target.value);
                        if (validationErrors.brandName) setValidationErrors((prev) => { const next = { ...prev }; delete next.brandName; return next; });
                      }}
                      error={validationErrors.brandName}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block mb-1.5 text-sm font-medium text-background-700">
                      所属行业<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)}
                        className={cn(
                          'w-full h-12 text-left rounded-lg border border-background-200 bg-white text-background-900 px-4 flex items-center justify-between transition-all duration-200',
                          'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400',
                          'hover:border-background-300'
                        )}
                      >
                        <span className={brandInfo.industry ? 'text-background-900' : 'text-background-400'}>
                          {brandInfo.industry || '请选择所属行业'}
                        </span>
                        <ChevronDown className={cn('w-5 h-5 text-background-400 transition-transform duration-200', industryDropdownOpen && 'rotate-180')} />
                      </button>
                      <AnimatePresence>
                        {industryDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-background-100 max-h-80 overflow-y-auto z-50"
                          >
                            {industries.map((industry) => (
                              <button
                                key={industry.id}
                                type="button"
                                onClick={() => {
                                  handleFieldChange('industry', industry.name);
                                  setIndustryDropdownOpen(false);
                                  if (validationErrors.industry) setValidationErrors((prev) => { const next = { ...prev }; delete next.industry; return next; });
                                }}
                                className={cn(
                                  'w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-150 flex items-center justify-between',
                                  brandInfo.industry === industry.name && 'bg-primary-50 text-primary-600'
                                )}
                              >
                                <span className="font-medium">{industry.name}</span>
                                {brandInfo.industry === industry.name && (
                                  <Check className="w-4 h-4 text-primary-600" />
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {validationErrors.industry && (
                      <p className="mt-1.5 text-sm text-red-500">{validationErrors.industry}</p>
                    )}
                    {selectedIndustry && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 bg-primary-50 rounded-lg"
                      >
                        <p className="text-xs text-primary-700">
                          <span className="font-medium">推荐调性：</span>
                          {selectedIndustry.typicalTones.join('、')}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Input
                      label="品牌定位语"
                      placeholder="一句话描述您的品牌定位，例如：为年轻白领提供高性价比的智能穿戴设备"
                      size="lg"
                      multiline
                      value={brandInfo.positionStatement}
                      onChange={(e) => handleFieldChange('positionStatement', e.target.value)}
                      wrapperClassName="mb-2"
                    />
                    <p className="text-xs text-background-500 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />
                      <span>品牌定位语是品牌的核心主张，建议用简洁有力的一句话表达品牌为谁、提供什么价值。</span>
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-background-900">品牌调性<span className="text-red-500 ml-0.5">*</span></h3>
                      <p className="text-sm text-background-500 mt-0.5">选择最符合您品牌气质的调性风格</p>
                    </div>
                  </div>
                }
              />
              <CardBody>
                {validationErrors.brandTone && (
                  <p className="mb-4 text-sm text-red-500">{validationErrors.brandTone}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {brandTones.map((tone, index) => (
                    <motion.div
                      key={tone.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => handleToneSelect(tone.id)}
                      className={cn(
                        'relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300',
                        'hover:shadow-md hover:-translate-y-0.5',
                        brandInfo.brandTone === tone.id
                          ? 'border-primary-500 bg-primary-50 shadow-primary-sm'
                          : 'border-background-200 bg-white hover:border-primary-300'
                      )}
                    >
                      {brandInfo.brandTone === tone.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                          brandInfo.brandTone === tone.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-background-100 text-background-600'
                        )}
                      >
                        {toneIcons[tone.id] || <Sparkles className="w-6 h-6" />}
                      </div>
                      <h4 className={cn('font-semibold mb-1.5', brandInfo.brandTone === tone.id ? 'text-primary-700' : 'text-background-900')}>
                        {tone.name}
                      </h4>
                      <p className="text-xs text-background-500 line-clamp-2">{tone.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center">
                      <TagIcon className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-background-900">核心价值观</h3>
                      <p className="text-sm text-background-500 mt-0.5">选择品牌的核心价值观，可多选，也可以自定义添加</p>
                    </div>
                  </div>
                }
              />
              <CardBody>
                <div className="flex flex-wrap gap-2 mb-6">
                  {coreValueCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        activeCategory === category
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-background-100 text-background-600 hover:bg-background-200'
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2.5 mb-6">
                  {filteredValues.map((value) => {
                    const isSelected = brandInfo.coreValues.includes(value.id);
                    return (
                      <Tag
                        key={value.id}
                        color="primary"
                        size="md"
                        selected={isSelected}
                        onClick={() => handleValueToggle(value.id)}
                        className="cursor-pointer"
                      >
                        {value.name}
                      </Tag>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="输入自定义价值观"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomValue();
                        }
                      }}
                    />
                  </div>
                  <Button variant="primary" onClick={handleAddCustomValue} leftIcon={<Plus className="w-4 h-4" />}>
                    添加
                  </Button>
                </div>

                {brandInfo.coreValues.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t border-background-100"
                  >
                    <p className="text-sm font-medium text-background-700 mb-3">
                      已选择 {brandInfo.coreValues.length} 个核心价值观
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {brandInfo.coreValues.map((valueId) => {
                        const value = coreValues.find((v) => v.id === valueId);
                        const name = value?.name || valueId;
                        return (
                          <Tag key={valueId} color="primary" size="md" selected closable onClose={() => handleValueToggle(valueId)}>
                            {name}
                          </Tag>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-warning-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-warning-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-background-900">竞品分析</h3>
                      <p className="text-sm text-background-500 mt-0.5">添加主要竞争对手，分析其优劣势</p>
                    </div>
                  </div>
                }
                action={
                  <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleAddCompetitor}>
                    添加竞品
                  </Button>
                }
              />
              <CardBody>
                {brandInfo.competitors.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-background-100 flex items-center justify-center">
                      <Users className="w-8 h-8 text-background-400" />
                    </div>
                    <p className="text-background-500 mb-4">还没有添加竞品</p>
                    <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleAddCompetitor}>
                      添加第一个竞品
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {brandInfo.competitors.map((competitor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-5 bg-background-50 rounded-xl border border-background-100"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-600 text-sm font-medium flex items-center justify-center">
                                {index + 1}
                              </span>
                              <span className="font-medium text-background-900">竞品 {index + 1}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCompetitor(index)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Input
                                label="竞品名称"
                                placeholder="请输入竞品名称"
                                value={competitor.name}
                                onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)}
                              />
                            </div>
                            <div>
                              <Input
                                label="优势"
                                placeholder="竞品的主要优势"
                                multiline
                                value={competitor.advantage}
                                onChange={(e) => handleCompetitorChange(index, 'advantage', e.target.value)}
                              />
                            </div>
                            <div>
                              <Input
                                label="劣势"
                                placeholder="竞品的主要劣势"
                                multiline
                                value={competitor.weakness}
                                onChange={(e) => handleCompetitorChange(index, 'weakness', e.target.value)}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <Button
                      variant="outline"
                      size="md"
                      fullWidth
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={handleAddCompetitor}
                      className="border-dashed"
                    >
                      添加竞品
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
            <Button variant="outline" size="lg" leftIcon={<Save className="w-5 h-5" />} onClick={handleSave}>
              保存草稿
            </Button>
            <Button variant="primary" size="lg" rightIcon={<ChevronRight className="w-5 h-5" />} onClick={handleNext}>
              下一步：人群画像
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
