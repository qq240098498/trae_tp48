export interface Industry {
  id: string
  name: string
  subCategories: string[]
  typicalTones: string[]
  typicalValues: string[]
}

export interface BrandTone {
  id: string
  name: string
  description: string
  keywords: string[]
  visualStyle: string
  copyStyle: string
}

export interface CoreValue {
  id: string
  name: string
  description: string
  category: '品质' | '创新' | '服务' | '社会责任' | '文化' | '效率' | '个性' | '情感'
}

export interface PositionTemplate {
  id: string
  template: string
  variables: string[]
  example: string
  applicableIndustries: string[]
}

export const industries: Industry[] = [
  {
    id: 'tech-software',
    name: '科技-互联网软件',
    subCategories: ['SaaS服务', '社交平台', '电商平台', '工具软件', '游戏', '人工智能'],
    typicalTones: ['科技感的', '专业的', '创新的', '年轻的'],
    typicalValues: ['创新驱动', '用户至上', '技术卓越', '开放共享']
  },
  {
    id: 'tech-hardware',
    name: '科技-智能硬件',
    subCategories: ['智能手机', '智能家居', '可穿戴设备', '汽车科技', '机器人', '无人机'],
    typicalTones: ['科技感的', '高端的', '品质的', '创新的'],
    typicalValues: ['技术领先', '极致体验', '品质保障', '设计美学']
  },
  {
    id: 'fmcg-food',
    name: '快消-食品饮料',
    subCategories: ['休闲零食', '饮品', '乳制品', '方便食品', '调味品', '健康食品'],
    typicalTones: ['亲民的', '年轻的', '活力的', '温暖的'],
    typicalValues: ['健康美味', '品质安全', '新鲜美味', '快乐分享']
  },
  {
    id: 'fmcg-beauty',
    name: '快消-美妆个护',
    subCategories: ['护肤', '彩妆', '香水', '洗护', '口腔护理', '美容仪器'],
    typicalTones: ['高端的', '精致的', '年轻的', '时尚的'],
    typicalValues: ['美丽自信', '天然安全', '科技护肤', '个性表达']
  },
  {
    id: 'fashion-apparel',
    name: '时尚-服饰鞋包',
    subCategories: ['男装', '女装', '运动服饰', '童装', '鞋履', '箱包配饰'],
    typicalTones: ['时尚的', '年轻的', '高端的', '个性的'],
    typicalValues: ['时尚潮流', '品质工艺', '个性表达', '舒适体验']
  },
  {
    id: 'fashion-luxury',
    name: '时尚-奢侈品',
    subCategories: ['高级珠宝', '腕表', '高级成衣', '皮具', '香水美妆', '生活艺术'],
    typicalTones: ['高端的', '奢华的', '经典的', '优雅的'],
    typicalValues: ['传承工艺', '卓越品质', '尊贵体验', '文化艺术']
  },
  {
    id: 'finance-banking',
    name: '金融-银行保险',
    subCategories: ['商业银行', '投资银行', '保险', '财富管理', '消费金融', '支付结算'],
    typicalTones: ['专业的', '可信赖的', '稳重的', '严谨的'],
    typicalValues: ['稳健可靠', '专业服务', '诚信合规', '客户至上']
  },
  {
    id: 'finance-investment',
    name: '金融-投资理财',
    subCategories: ['基金', '股票', '债券', '信托', '私募股权', '数字资产'],
    typicalTones: ['专业的', '理性的', '高端的', '科技感的'],
    typicalValues: ['专业洞察', '价值投资', '风险管控', '财富增长']
  },
  {
    id: 'education-training',
    name: '教育-培训辅导',
    subCategories: ['K12教育', '职业教育', '语言培训', '兴趣爱好', '学历提升', '企业培训'],
    typicalTones: ['专业的', '温暖的', '激励的', '严谨的'],
    typicalValues: ['因材施教', '激发潜能', '终身学习', '成长陪伴']
  },
  {
    id: 'health-medical',
    name: '医疗-健康养生',
    subCategories: ['综合医院', '专科医院', '体检中心', '保健品', '中医养生', '心理健康'],
    typicalTones: ['专业的', '可信赖的', '温暖的', '关爱的'],
    typicalValues: ['生命至上', '专业医疗', '人文关怀', '预防为先']
  },
  {
    id: 'real-estate',
    name: '房地产-建筑家居',
    subCategories: ['住宅开发', '商业地产', '长租公寓', '家装建材', '家居家具', '物业服务'],
    typicalTones: ['品质的', '温馨的', '高端的', '可信赖的'],
    typicalValues: ['匠心品质', '美好生活', '家的温度', '社区共建']
  },
  {
    id: 'auto-vehicle',
    name: '汽车-交通出行',
    subCategories: ['乘用车', '商用车', '新能源汽车', '出行服务', '汽车后市场', '自动驾驶'],
    typicalTones: ['科技感的', '品质的', '高端的', '动感的'],
    typicalValues: ['安全可靠', '创新科技', '驾驭乐趣', '绿色出行']
  },
  {
    id: 'retail-ecommerce',
    name: '零售-电商平台',
    subCategories: ['综合电商', '垂直电商', '社交电商', '直播电商', '社区团购', '跨境电商'],
    typicalTones: ['年轻的', '活力的', '亲民的', '便捷的'],
    typicalValues: ['好物低价', '极致体验', '信任保障', '发现乐趣']
  },
  {
    id: 'media-entertainment',
    name: '文娱-传媒娱乐',
    subCategories: ['影视制作', '音乐娱乐', '游戏动漫', '出版传媒', '演出活动', '主题乐园'],
    typicalTones: ['年轻的', '创意的', '活力的', '有趣的'],
    typicalValues: ['创意内容', '快乐体验', '文化传播', '梦想连接']
  },
  {
    id: 'business-services',
    name: '企业服务-B2B',
    subCategories: ['咨询服务', '法律服务', '人力资源', '办公软件', '物流供应链', '营销服务'],
    typicalTones: ['专业的', '可信赖的', '高效的', '严谨的'],
    typicalValues: ['专业赋能', '高效协作', '价值创造', '长期伙伴']
  },
  {
    id: 'travel-hospitality',
    name: '旅游-酒店餐饮',
    subCategories: ['酒店住宿', '旅行社', '航空出行', '餐饮连锁', '景区目的地', '民宿短租'],
    typicalTones: ['温暖的', '品质的', '高端的', '放松的'],
    typicalValues: ['宾至如归', '美好体验', '探索发现', '品质服务']
  },
  {
    id: 'sports-outdoor',
    name: '运动-户外健身',
    subCategories: ['运动品牌', '健身服务', '户外装备', '赛事运营', '体育培训', '健康管理'],
    typicalTones: ['活力的', '阳光的', '专业的', '坚持的'],
    typicalValues: ['运动精神', '突破自我', '健康生活', '团队协作']
  },
  {
    id: 'public-welfare',
    name: '公益-非营利组织',
    subCategories: ['环保公益', '教育公益', '扶贫济困', '动物保护', '文化保护', '社区发展'],
    typicalTones: ['温暖的', '真诚的', '有力量的', '希望的'],
    typicalValues: ['爱与关怀', '社会价值', '可持续发展', '人人参与']
  }
]

export const brandTones: BrandTone[] = [
  {
    id: 'professional',
    name: '专业的',
    description: '权威可信，专业严谨，适合B2B、金融、医疗等行业',
    keywords: ['权威', '专业', '严谨', '可信赖', '高品质', '行业领先'],
    visualStyle: '简洁商务配色，规整布局，大量留白，专业字体',
    copyStyle: '数据支撑，逻辑清晰，专业术语，客观陈述'
  },
  {
    id: 'young',
    name: '年轻的',
    description: '活力时尚，有趣好玩，适合快消、时尚、文娱等行业',
    keywords: ['活力', '潮流', '有趣', '个性', '热血', '敢玩'],
    visualStyle: '鲜艳撞色，动感排版，潮流元素，年轻化插画',
    copyStyle: '网络热词，轻松幽默，短句节奏，情感共鸣'
  },
  {
    id: 'premium',
    name: '高端的',
    description: '奢华精致，品质卓越，适合奢侈品、高端酒店、豪车等行业',
    keywords: ['奢华', '尊贵', '品质', '匠心', '传承', '限量'],
    visualStyle: '高级质感配色，大面积留白，精致细节，材质纹理',
    copyStyle: '优雅辞藻，故事叙述，稀缺感营造，品质细节描写'
  },
  {
    id: 'approachable',
    name: '亲民的',
    description: '亲切温暖，平易近人，适合大众消费、社区服务等行业',
    keywords: ['亲切', '温暖', '贴心', '实在', '接地气', '陪伴'],
    visualStyle: '柔和暖色调，生活化场景，亲切人物形象',
    copyStyle: '口语化表达，生活场景，情感共鸣，实用信息'
  },
  {
    id: 'tech',
    name: '科技感的',
    description: '前沿创新，未来感强，适合科技、互联网、智能硬件等行业',
    keywords: ['创新', '未来', '智能', '黑科技', '突破', '极致'],
    visualStyle: '科技蓝/紫色调，几何图形，发光效果，渐变质感',
    copyStyle: '技术术语，数据说话，未来愿景，功能亮点'
  },
  {
    id: 'artistic',
    name: '文艺的',
    description: '有情怀有格调，文化底蕴深厚，适合文创、书店、艺术品牌等',
    keywords: ['文艺', '情怀', '诗意', '格调', '匠人', '故事'],
    visualStyle: '莫兰迪色系，手写字，质感纸张，艺术摄影',
    copyStyle: '诗意表达，故事叙述，哲理思考，细腻情感'
  },
  {
    id: 'humorous',
    name: '幽默的',
    description: '轻松有趣，自嘲玩梗，适合年轻化品牌、互联网产品等',
    keywords: ['搞笑', '玩梗', '有趣', '沙雕', '魔性', '洗脑'],
    visualStyle: '夸张表情，魔性配色，表情包元素，反差感设计',
    copyStyle: '段子手风格，网络热梗，夸张比喻，互动感强'
  },
  {
    id: 'warm',
    name: '温暖的',
    description: '充满人情味，治愈系，适合母婴、家居、公益等行业',
    keywords: ['温暖', '治愈', '陪伴', '关爱', '家', '人情味'],
    visualStyle: '暖色调，柔和光影，生活场景，人物微笑',
    copyStyle: '温暖治愈，情感细腻，生活细节，走心故事'
  },
  {
    id: 'bold',
    name: '大胆的',
    description: '特立独行，敢于挑战，适合潮牌、运动、个性品牌等',
    keywords: ['敢性', '突破', '不羁', '态度', '反叛', '真我'],
    visualStyle: '强烈对比色，大胆排版，冲击性视觉，个性字体',
    copyStyle: '态度宣言，反问句式，强烈情感，挑战传统'
  },
  {
    id: 'minimalist',
    name: '极简的',
    description: '简约不简单，少即是多，适合设计品牌、极简生活方式等',
    keywords: ['极简', '纯粹', '本质', '留白', '匠心', '高级'],
    visualStyle: '黑白灰主调，大面积留白，简洁线条，无多余装饰',
    copyStyle: '精炼文字，留白思考，哲学意味，品质描述'
  },
  {
    id: 'energetic',
    name: '活力的',
    description: '充满能量，积极向上，适合运动、饮料、年轻品牌等',
    keywords: ['活力', '热血', '激情', '能量', '冲劲', '阳光'],
    visualStyle: '高饱和度色彩，动感图形，速度线条，活力人物',
    copyStyle: '短句子，动词开头，节奏感强，口号式表达'
  },
  {
    id: 'reliable',
    name: '可靠的',
    description: '稳重踏实，值得信赖，适合金融、保险、工业品牌等',
    keywords: ['可靠', '稳健', '踏实', '安全', '保障', '坚持'],
    visualStyle: '稳重蓝/灰色调，对称布局，扎实图形，质感厚重',
    copyStyle: '数据事实，承诺保障，历史传承，稳健表达'
  }
]

export const coreValues: CoreValue[] = [
  {
    id: 'quality-excellence',
    name: '卓越品质',
    description: '对产品/服务品质的极致追求，精益求精',
    category: '品质'
  },
  {
    id: 'craftsmanship',
    name: '匠心精神',
    description: '专注细节，打磨精品，传承工艺之美',
    category: '品质'
  },
  {
    id: 'safety-reliability',
    name: '安全可靠',
    description: '产品安全有保障，性能稳定值得信赖',
    category: '品质'
  },
  {
    id: 'authentic-raw',
    name: '天然纯粹',
    description: '天然成分，原汁原味，无添加更健康',
    category: '品质'
  },
  {
    id: 'technological-innovation',
    name: '科技创新',
    description: '以技术驱动创新，引领行业发展方向',
    category: '创新'
  },
  {
    id: 'creative-thinking',
    name: '创意无限',
    description: '打破常规，不断创造新的可能',
    category: '创新'
  },
  {
    id: 'breakthrough-limits',
    name: '突破边界',
    description: '挑战不可能，不断突破自我和行业边界',
    category: '创新'
  },
  {
    id: 'continuous-improvement',
    name: '持续进化',
    description: '永不满足，持续迭代优化产品和服务',
    category: '创新'
  },
  {
    id: 'customer-first',
    name: '用户至上',
    description: '以用户需求为中心，全心全意为用户服务',
    category: '服务'
  },
  {
    id: 'heartfelt-service',
    name: '用心服务',
    description: '真诚用心，关注细节，提供有温度的服务',
    category: '服务'
  },
  {
    id: 'professional-guidance',
    name: '专业护航',
    description: '以专业能力为用户提供可靠的指导和支持',
    category: '服务'
  },
  {
    id: 'whole-process-care',
    name: '全程守护',
    description: '全流程服务，从售前到售后持续关怀',
    category: '服务'
  },
  {
    id: 'social-responsibility',
    name: '社会责任',
    description: '积极承担社会责任，回馈社会',
    category: '社会责任'
  },
  {
    id: 'environmental-protection',
    name: '绿色环保',
    description: '践行环保理念，推动可持续发展',
    category: '社会责任'
  },
  {
    id: 'public-welfare-heart',
    name: '公益之心',
    description: '热心公益事业，用行动传递温暖',
    category: '社会责任'
  },
  {
    id: 'inclusive-development',
    name: '包容发展',
    description: '尊重多元，促进公平，让更多人受益',
    category: '社会责任'
  },
  {
    id: 'cultural-heritage',
    name: '文化传承',
    description: '传承和弘扬优秀传统文化',
    category: '文化'
  },
  {
    id: 'artistic-aesthetic',
    name: '艺术审美',
    description: '追求艺术之美，提升生活品质',
    category: '文化'
  },
  {
    id: 'storytelling',
    name: '故事温度',
    description: '用故事传递情感，连接人心',
    category: '文化'
  },
  {
    id: 'lifestyle',
    name: '生活方式',
    description: '倡导和代表一种独特的生活态度',
    category: '文化'
  },
  {
    id: 'efficient-convenience',
    name: '高效便捷',
    description: '提升效率，让生活和工作更便捷',
    category: '效率'
  },
  {
    id: 'time-saving',
    name: '节省时间',
    description: '为用户节省宝贵时间，创造更大价值',
    category: '效率'
  },
  {
    id: 'simple-and-easy',
    name: '简单易用',
    description: '化繁为简，让复杂变简单',
    category: '效率'
  },
  {
    id: 'cost-effective',
    name: '物超所值',
    description: '高性价比，为用户创造更多价值',
    category: '效率'
  },
  {
    id: 'personality-expression',
    name: '个性表达',
    description: '彰显独特个性，做真实的自己',
    category: '个性'
  },
  {
    id: 'daring-to-be-different',
    name: '敢于不同',
    description: '不随波逐流，坚持独立态度',
    category: '个性'
  },
  {
    id: 'youth-vitality',
    name: '年轻活力',
    description: '保持年轻心态，充满活力与激情',
    category: '个性'
  },
  {
    id: 'free-spirit',
    name: '自由精神',
    description: '追求自由，不受束缚，探索无限可能',
    category: '个性'
  },
  {
    id: 'emotional-connection',
    name: '情感连接',
    description: '建立深度情感连接，温暖人心',
    category: '情感'
  },
  {
    id: 'companionship-growth',
    name: '陪伴成长',
    description: '长期陪伴，见证用户每一步成长',
    category: '情感'
  },
  {
    id: 'sense-of-belonging',
    name: '归属感',
    description: '营造家的感觉，让用户找到归属',
    category: '情感'
  },
  {
    id: 'happy-sharing',
    name: '快乐分享',
    description: '传递快乐，分享美好，让幸福加倍',
    category: '情感'
  }
]

export const positionTemplates: PositionTemplate[] = [
  {
    id: 'classical-3c',
    template: '为{目标人群}提供{核心价值}的{品类/产品}，让{美好结果}成为可能',
    variables: ['目标人群', '核心价值', '品类/产品', '美好结果'],
    example: '为追求品质生活的都市年轻白领提供高性价比的智能穿戴设备，让健康管理变得简单有趣',
    applicableIndustries: ['科技-智能硬件', '快消-美妆个护', '时尚-服饰鞋包']
  },
  {
    id: 'problem-solution',
    template: '{目标人群}的{痛点问题}专家，以{核心优势}，让用户{获得的改变}',
    variables: ['目标人群', '痛点问题', '核心优势', '获得的改变'],
    example: '职场人士的压力管理专家，以科学的心理学方法，让用户找回内心的平静与力量',
    applicableIndustries: ['医疗-健康养生', '教育-培训辅导', '企业服务-B2B']
  },
  {
    id: 'aspiration-driven',
    template: '助{目标人群}实现{理想愿景}的{品牌角色}，以{核心特质}陪伴每一步成长',
    variables: ['目标人群', '理想愿景', '品牌角色', '核心特质'],
    example: '助每一位创业者实现商业梦想的成长伙伴，以专业的企业服务陪伴每一步成长',
    applicableIndustries: ['企业服务-B2B', '教育-培训辅导', '金融-投资理财']
  },
  {
    id: 'differentiation',
    template: '不同于{竞品类型}的{差异化定位}，我们专注于{核心聚焦}，为{目标人群}带来{独特价值}',
    variables: ['竞品类型', '差异化定位', '核心聚焦', '目标人群', '独特价值'],
    example: '不同于传统银行的数字金融科技品牌，我们专注于用户体验升级，为年轻一代带来更便捷的金融服务',
    applicableIndustries: ['金融-银行保险', '科技-互联网软件', '零售-电商平台']
  },
  {
    id: 'emotional-resonance',
    template: '懂{目标人群}的{情感诉求}，用{表达方式}传递{品牌温度}，让每个人都能{情感获得}',
    variables: ['目标人群', '情感诉求', '表达方式', '品牌温度', '情感获得'],
    example: '懂年轻人的孤独与热爱，用有温度的内容陪伴每个夜晚，让每个人都能找到心灵的栖息地',
    applicableIndustries: ['文娱-传媒娱乐', '快消-食品饮料', '教育-培训辅导']
  },
  {
    id: 'mission-driven',
    template: '致力于{宏大使命}，以{核心能力}推动{行业/社会改变}，让{美好愿景}照进现实',
    variables: ['宏大使命', '核心能力', '行业/社会改变', '美好愿景'],
    example: '致力于用科技推动教育公平，以人工智能技术推动个性化学习，让每个孩子都能获得优质教育',
    applicableIndustries: ['教育-培训辅导', '科技-互联网软件', '公益-非营利组织']
  },
  {
    id: 'lifestyle-advocate',
    template: '{生活态度}的生活方式倡导者，以{产品/服务}承载{生活理念}，与{目标人群}一起{共同追求}',
    variables: ['生活态度', '产品/服务', '生活理念', '目标人群', '共同追求'],
    example: '简约不简单的生活方式倡导者，以极简设计的家居产品承载品质生活理念，与都市精英一起探索生活的本质',
    applicableIndustries: ['时尚-服饰鞋包', '房地产-建筑家居', '快消-美妆个护']
  },
  {
    id: 'expert-authority',
    template: '{领域}的{身份/角色}，{专业积累}的专业沉淀，为{目标人群}提供{专业价值}',
    variables: ['领域', '身份/角色', '专业积累', '目标人群', '专业价值'],
    example: '财富管理领域的行业领导者，20年的专业沉淀，为高净值人群提供全方位的资产配置方案',
    applicableIndustries: ['金融-银行保险', '医疗-健康养生', '企业服务-B2B']
  },
  {
    id: 'rebellious-innovator',
    template: '打破{传统规则}的{颠覆者角色}，用{创新方式}重新定义{品类}，让{目标人群}享受{全新体验}',
    variables: ['传统规则', '颠覆者角色', '创新方式', '品类', '目标人群', '全新体验'],
    example: '打破传统手机行业边界的创新者，用极致的用户体验重新定义智能手机，让科技爱好者享受未来科技的魅力',
    applicableIndustries: ['科技-智能硬件', '科技-互联网软件', '汽车-交通出行']
  },
  {
    id: 'value-for-money',
    template: '{目标人群}的{品类}首选，以{价格/品质优势}提供{价值主张}，让{美好体验}触手可及',
    variables: ['目标人群', '品类', '价格/品质优势', '价值主张', '美好体验'],
    example: '年轻家庭的母婴用品首选，以工厂直供的价格优势提供安全优质的产品，让高品质育儿触手可及',
    applicableIndustries: ['零售-电商平台', '快消-食品饮料', '快消-美妆个护']
  }
]

export const brandToneCategories = [
  {
    id: 'professional-serious',
    name: '专业稳重',
    tones: ['professional', 'reliable']
  },
  {
    id: 'young-fashion',
    name: '年轻时尚',
    tones: ['young', 'energetic', 'humorous', 'bold']
  },
  {
    id: 'premium-luxury',
    name: '高端奢华',
    tones: ['premium', 'minimalist']
  },
  {
    id: 'warm-approachable',
    name: '温暖亲民',
    tones: ['approachable', 'warm']
  },
  {
    id: 'tech-innovative',
    name: '科技创新',
    tones: ['tech']
  },
  {
    id: 'artistic-literary',
    name: '文艺情怀',
    tones: ['artistic']
  }
]

export const coreValueCategories = [
  '品质',
  '创新',
  '服务',
  '社会责任',
  '文化',
  '效率',
  '个性',
  '情感'
]
