export interface AgeRange {
  id: string
  name: string
  description: string
  lifeStage: string
  consumptionTraits: string[]
}

export interface Gender {
  id: string
  name: string
  description: string
}

export interface CityTier {
  id: string
  name: string
  cities: string[]
  population: string
  consumptionLevel: string
  traits: string[]
}

export interface IncomeLevel {
  id: string
  name: string
  monthlyIncome: string
  description: string
  consumptionTraits: string[]
}

export interface EducationLevel {
  id: string
  name: string
  description: string
  typicalOccupations: string[]
}

export interface Occupation {
  id: string
  name: string
  category: string
  description: string
  typicalTraits: string[]
}

export interface InterestTag {
  id: string
  name: string
  subTags: string[]
  description: string
}

export interface BehaviorTag {
  id: string
  name: string
  category: string
  description: string
  examples: string[]
}

export interface MediaHabit {
  id: string
  name: string
  category: string
  description: string
  typicalPlatforms: string[]
  usageTime: string
}

export const ageRanges: AgeRange[] = [
  {
    id: 'age-0-12',
    name: '0-12岁 儿童',
    description: '学龄前及小学生群体',
    lifeStage: '儿童期',
    consumptionTraits: ['家长决策', '教育导向', '玩具娱乐', '品牌认知培养']
  },
  {
    id: 'age-13-17',
    name: '13-17岁 青少年',
    description: '初中生和高中生群体',
    lifeStage: '青春期',
    consumptionTraits: ['自我意识觉醒', '同伴影响大', '潮流敏感', '零花钱有限']
  },
  {
    id: 'age-18-24',
    name: '18-24岁 年轻群体',
    description: '大学生和初入职场的年轻人',
    lifeStage: '成年初期',
    consumptionTraits: ['尝鲜意愿强', '社交属性重', '价格敏感', '个性化追求']
  },
  {
    id: 'age-25-30',
    name: '25-30岁 职场新锐',
    description: '职场上升期的年轻白领',
    lifeStage: '事业起步期',
    consumptionTraits: ['品质升级', '品牌意识强', '投资自己', '社交消费']
  },
  {
    id: 'age-31-40',
    name: '31-40岁 中坚力量',
    description: '职场骨干和家庭支柱',
    lifeStage: '家庭成长期',
    consumptionTraits: ['家庭消费为主', '理性消费', '注重品质', '健康关注']
  },
  {
    id: 'age-41-50',
    name: '41-50岁 成熟群体',
    description: '事业稳定的中年人群',
    lifeStage: '事业成熟期',
    consumptionTraits: ['消费能力强', '品牌忠诚度高', '健康养生', '子女教育']
  },
  {
    id: 'age-51-60',
    name: '51-60岁 准退休族',
    description: '临近退休的中老年群体',
    lifeStage: '空巢期',
    consumptionTraits: ['健康养生优先', '节俭务实', '关注子女', '旅游休闲']
  },
  {
    id: 'age-61-plus',
    name: '61岁以上 银发族',
    description: '退休老年人群体',
    lifeStage: '退休期',
    consumptionTraits: ['健康医疗', '养老保障', '节俭传统', '情感需求强']
  }
]

export const genders: Gender[] = [
  {
    id: 'male',
    name: '男性',
    description: '男性消费群体'
  },
  {
    id: 'female',
    name: '女性',
    description: '女性消费群体'
  },
  {
    id: 'all',
    name: '不限性别',
    description: '男女通用消费群体'
  }
]

export const cityTiers: CityTier[] = [
  {
    id: 'tier-1',
    name: '一线城市',
    cities: ['北京', '上海', '广州', '深圳'],
    population: '约8000万',
    consumptionLevel: '高',
    traits: ['消费能力强', '品牌意识高', '潮流引领', '国际化视野', '生活节奏快']
  },
  {
    id: 'new-tier-1',
    name: '新一线城市',
    cities: ['成都', '杭州', '重庆', '武汉', '西安', '苏州', '南京', '天津', '长沙', '郑州', '东莞', '青岛', '沈阳', '宁波', '昆明'],
    population: '约1.5亿',
    consumptionLevel: '中高',
    traits: ['消费升级快', '新品牌接受度高', '生活品质追求', '商业活力强', '人才流入多']
  },
  {
    id: 'tier-2',
    name: '二线城市',
    cities: ['无锡', '大连', '厦门', '合肥', '佛山', '福州', '哈尔滨', '济南', '温州', '长春', '石家庄', '常州', '泉州', '南宁', '贵阳', '南昌', '金华', '太原', '烟台', '嘉兴'],
    population: '约2亿',
    consumptionLevel: '中等',
    traits: ['稳定增长', '性价比关注', '生活节奏适中', '家庭消费为主', '口碑影响大']
  },
  {
    id: 'tier-3',
    name: '三线城市',
    cities: ['珠海', '镇江', '海口', '扬州', '洛阳', '乌鲁木齐', '临沂', '唐山', '漳州', '赣州', '廊坊', '呼和浩特', '芜湖', '桂林', '银川', '揭阳', '三亚', '遵义', '江门', '济宁'],
    population: '约2.5亿',
    consumptionLevel: '中低',
    traits: ['价格敏感', '熟人社会', '下沉市场主力', '生活压力小', '闲暇时间多']
  },
  {
    id: 'tier-4-5',
    name: '四线及以下城市',
    cities: ['县级市', '县城', '乡镇'],
    population: '约6亿',
    consumptionLevel: '低',
    traits: ['价格高度敏感', '品牌认知弱', '熟人推荐重要', '生活成本低', '互联网渗透快']
  }
]

export const incomeLevels: IncomeLevel[] = [
  {
    id: 'income-low',
    name: '低收入',
    monthlyIncome: '3000元以下',
    description: '收入较低，基本生活消费为主',
    consumptionTraits: ['价格高度敏感', '刚需消费', '促销敏感', '品牌认知弱']
  },
  {
    id: 'income-medium-low',
    name: '中低收入',
    monthlyIncome: '3000-8000元',
    description: '收入一般，注重性价比',
    consumptionTraits: ['性价比优先', '精打细算', '促销驱动', '国货偏好']
  },
  {
    id: 'income-medium',
    name: '中等收入',
    monthlyIncome: '8000-15000元',
    description: '收入稳定，开始追求品质',
    consumptionTraits: ['品质与价格平衡', '品牌意识增强', '理性消费', '消费升级']
  },
  {
    id: 'income-medium-high',
    name: '中高收入',
    monthlyIncome: '15000-30000元',
    description: '收入较高，注重生活品质',
    consumptionTraits: ['品质优先', '品牌忠诚度高', '体验消费', '健康投资']
  },
  {
    id: 'income-high',
    name: '高收入',
    monthlyIncome: '30000-80000元',
    description: '收入丰厚，追求高端生活',
    consumptionTraits: ['高端品牌偏好', '服务体验要求高', '圈层消费', '奢侈品消费']
  },
  {
    id: 'income-ultra-high',
    name: '超高收入',
    monthlyIncome: '80000元以上',
    description: '收入极高，顶级消费群体',
    consumptionTraits: ['顶级奢侈品牌', '定制化需求', '私人服务', '身份象征消费']
  }
]

export const educationLevels: EducationLevel[] = [
  {
    id: 'edu-primary',
    name: '小学及以下',
    description: '小学教育程度或未接受正规教育',
    typicalOccupations: ['体力劳动者', '服务业基层', '农业从业者']
  },
  {
    id: 'edu-secondary',
    name: '初中/高中',
    description: '初中或高中学历',
    typicalOccupations: ['蓝领工人', '服务业人员', '个体工商户']
  },
  {
    id: 'edu-vocational',
    name: '中专/技校',
    description: '中等职业技术教育',
    typicalOccupations: ['技术工人', '技师', '服务业技术岗']
  },
  {
    id: 'edu-college',
    name: '大专',
    description: '大学专科学历',
    typicalOccupations: ['基层白领', '技术专员', '销售岗位']
  },
  {
    id: 'edu-bachelor',
    name: '本科',
    description: '大学本科学历',
    typicalOccupations: ['白领职员', '专业技术人员', '初级管理者']
  },
  {
    id: 'edu-master',
    name: '硕士',
    description: '硕士研究生学历',
    typicalOccupations: ['中高层管理', '专业资深人士', '科研人员']
  },
  {
    id: 'edu-doctor',
    name: '博士及以上',
    description: '博士研究生及更高学历',
    typicalOccupations: ['高级专家', '科研工作者', '高层管理']
  }
]

export const occupations: Occupation[] = [
  {
    id: 'occ-student',
    name: '学生',
    category: '校园群体',
    description: '在校大中小学生',
    typicalTraits: ['学习为主', '零花钱有限', '社交活跃', '潮流敏感']
  },
  {
    id: 'occ-office-worker',
    name: '企业白领',
    category: '职场人群',
    description: '企业办公室职员',
    typicalTraits: ['朝九晚五', '消费稳定', '品质追求', '职场形象']
  },
  {
    id: 'occ-manager',
    name: '企业管理者',
    category: '职场人群',
    description: '企业中高层管理人员',
    typicalTraits: ['决策力强', '时间宝贵', '高端消费', '社交圈层']
  },
  {
    id: 'occ-civil-servant',
    name: '公务员/事业单位',
    category: '公职人员',
    description: '政府机关及事业单位工作人员',
    typicalTraits: ['稳定收入', '消费保守', '注重形象', '家庭为重']
  },
  {
    id: 'occ-tech-professional',
    name: '专业技术人员',
    category: '专业人群',
    description: '工程师、设计师、医生、律师等专业人士',
    typicalTraits: ['专业素养高', '收入较高', '理性消费', '学习投入大']
  },
  {
    id: 'occ-sales',
    name: '销售/商务人员',
    category: '职场人群',
    description: '销售、市场、商务拓展人员',
    typicalTraits: ['社交能力强', '形象管理', '业绩导向', '人脉资源']
  },
  {
    id: 'occ-creative',
    name: '创意/媒体人',
    category: '创意人群',
    description: '广告、设计、媒体、内容创作者',
    typicalTraits: ['创意活跃', '审美独特', '潮流先锋', '个性表达']
  },
  {
    id: 'occ-service-worker',
    name: '服务业从业者',
    category: '服务人群',
    description: '餐饮、零售、酒店等一线服务人员',
    typicalTraits: ['作息不规律', '收入偏低', '务实消费', '社交圈窄']
  },
  {
    id: 'occ-freelancer',
    name: '自由职业者',
    category: '灵活就业',
    description: '自由职业、兼职、独立接单人士',
    typicalTraits: ['时间自由', '收入波动', '个性独立', '多元技能']
  },
  {
    id: 'occ-entrepreneur',
    name: '创业者/企业主',
    category: '创业人群',
    description: '创业者和中小企业主',
    typicalTraits: ['风险承受强', '工作时间长', '高收入潜力', '人脉广泛']
  },
  {
    id: 'occ-housewife',
    name: '全职妈妈/家庭主妇',
    category: '家庭人群',
    description: '全职照顾家庭的人群',
    typicalTraits: ['家庭消费决策者', '时间相对自由', '性价比关注', '社群活跃']
  },
  {
    id: 'occ-retired',
    name: '退休人员',
    category: '银发群体',
    description: '已退休的老年人',
    typicalTraits: ['时间充裕', '节俭消费', '健康关注', '情感需求强']
  }
]

export const interestTags: InterestTag[] = [
  {
    id: 'interest-fashion',
    name: '时尚美妆',
    subTags: ['穿搭', '美妆', '护肤', '奢侈品', '潮流品牌', '街拍', '时尚博主', '中古'],
    description: '关注时尚趋势、美妆护肤、服饰搭配的人群'
  },
  {
    id: 'interest-food',
    name: '美食烹饪',
    subTags: ['探店', '烘焙', '家常菜', '轻食', '网红美食', '酒水', '茶', '咖啡'],
    description: '热爱美食、喜欢烹饪、追求味蕾体验的人群'
  },
  {
    id: 'interest-travel',
    name: '旅行户外',
    subTags: ['国内游', '出境游', '自驾游', '露营', '徒步', '摄影旅拍', '民宿', '海岛度假'],
    description: '喜欢旅行、热爱户外活动、探索世界的人群'
  },
  {
    id: 'interest-sports',
    name: '运动健身',
    subTags: ['跑步', '健身房', '瑜伽', '球类运动', '游泳', '骑行', '滑雪', '马拉松'],
    description: '热爱运动、注重身材管理、追求健康生活的人群'
  },
  {
    id: 'interest-tech',
    name: '科技数码',
    subTags: ['手机', '电脑', '智能硬件', '数码测评', '编程', 'AI', '游戏主机', '摄影器材'],
    description: '关注科技产品、数码设备、喜欢研究新技术的人群'
  },
  {
    id: 'interest-reading',
    name: '阅读学习',
    subTags: ['文学', '商业', '心理学', '历史', '自我提升', '知识付费', '读书会', '写作'],
    description: '喜欢阅读、持续学习、追求自我成长的人群'
  },
  {
    id: 'interest-entertainment',
    name: '娱乐影视',
    subTags: ['电影', '电视剧', '综艺', '明星偶像', '粉丝应援', '音乐会', '话剧', '脱口秀'],
    description: '关注娱乐八卦、喜欢看剧看电影、追星的人群'
  },
  {
    id: 'interest-gaming',
    name: '游戏电竞',
    subTags: ['手游', '端游', '主机游戏', '电竞', '游戏直播', '二次元游戏', '卡牌游戏', '角色扮演'],
    description: '热爱游戏、关注电竞赛事、享受虚拟世界乐趣的人群'
  },
  {
    id: 'interest-anime',
    name: '动漫二次元',
    subTags: ['动漫', '漫画', '轻小说', 'Cosplay', '手办', '漫展', 'Vtuber', '同人创作'],
    description: '喜欢动漫、二次元文化、ACG爱好者人群'
  },
  {
    id: 'interest-music',
    name: '音乐艺术',
    subTags: ['流行音乐', '古典音乐', '摇滚乐', '说唱', '民族音乐', '乐器', '音乐制作', '艺术展览'],
    description: '热爱音乐、关注艺术、有审美追求的人群'
  },
  {
    id: 'interest-home',
    name: '家居生活',
    subTags: ['装修', '家居好物', '收纳', '绿植', '宠物', '手作', '智能家居', '生活仪式感'],
    description: '注重居家品质、喜欢布置家、享受生活的人群'
  },
  {
    id: 'interest-parenting',
    name: '育儿亲子',
    subTags: ['母婴用品', '早教', '亲子游', '儿童教育', '绘本', '亲子活动', '辅食', '育儿经验'],
    description: '有孩子的父母、关注育儿和亲子关系的人群'
  },
  {
    id: 'interest-health',
    name: '健康养生',
    subTags: ['中医养生', '保健品', '健康饮食', '心理健康', '睡眠', '体检', '抗衰老', '运动康复'],
    description: '关注健康、注重养生、追求身心平衡的人群'
  },
  {
    id: 'interest-finance',
    name: '理财投资',
    subTags: ['基金', '股票', '房产', '保险', '理财知识', '副业赚钱', '消费降级', '财富自由'],
    description: '关注理财、有投资意识、追求财务增长的人群'
  },
  {
    id: 'interest-cars',
    name: '汽车交通',
    subTags: ['轿车', 'SUV', '新能源汽车', '豪华车', '改装车', '摩托车', '汽车测评', '自驾旅行'],
    description: '喜欢汽车、关注车市、享受驾驶乐趣的人群'
  }
]

export const behaviorTags: BehaviorTag[] = [
  {
    id: 'behavior-impulsive-buyer',
    name: '冲动型消费者',
    category: '消费行为',
    description: '容易被营销打动，即兴购买的消费者',
    examples: ['看到直播就下单', '被种草立刻买', '促销就囤货', '喜欢尝鲜']
  },
  {
    id: 'behavior-rational-buyer',
    name: '理性型消费者',
    category: '消费行为',
    description: '做足功课再购买，决策周期长的消费者',
    examples: ['做攻略对比', '看评测再买', '等降价再入手', '只买刚需']
  },
  {
    id: 'behavior-quality-seeker',
    name: '品质追求者',
    category: '消费行为',
    description: '注重品质和品牌，愿意为高品质付费',
    examples: ['只买大牌', '关注材质工艺', '愿意为设计买单', '品牌忠诚度高']
  },
  {
    id: 'behavior-bargain-hunter',
    name: '价格敏感型',
    category: '消费行为',
    description: '对价格高度敏感，追求性价比',
    examples: ['比价小能手', '凑单满减', '找优惠券', '等大促']
  },
  {
    id: 'behavior-social-butterfly',
    name: '社交达人',
    category: '社交行为',
    description: '社交活跃，喜欢分享生活和好物',
    examples: ['朋友圈达人', '爱晒生活', '朋友聚会多', '社交平台活跃']
  },
  {
    id: 'behavior-content-creator',
    name: '内容创作者',
    category: '社交行为',
    description: '喜欢创作和分享内容，有一定影响力',
    examples: ['小红书博主', '抖音创作者', 'B站UP主', '公众号作者']
  },
  {
    id: 'behavior-opinion-leader',
    name: '意见领袖',
    category: '社交行为',
    description: '在圈子里有话语权，影响他人决策',
    examples: ['朋友圈种草达人', '社群群主', '论坛版主', '同事中的行家']
  },
  {
    id: 'behavior-early-adopter',
    name: '早期尝鲜者',
    category: '产品使用行为',
    description: '喜欢尝试新事物新产品的人群',
    examples: ['新品首发就买', '内测用户', '追新番', '新功能第一时间体验']
  },
  {
    id: 'behavior-late-majority',
    name: '后知后觉型',
    category: '产品使用行为',
    description: '等到产品成熟流行后才开始使用',
    examples: ['大家都用了才尝试', '等口碑稳定再入手', '不追热点', '稳健选择']
  },
  {
    id: 'behavior-heavy-user',
    name: '重度用户',
    category: '产品使用行为',
    description: '使用频率高、使用时长长的深度用户',
    examples: ['日均使用5小时+', '高级会员', '付费用户', '社区深度参与']
  },
  {
    id: 'behavior-light-user',
    name: '轻度用户',
    category: '产品使用行为',
    description: '偶尔使用的浅度用户',
    examples: ['偶尔打开', '基础功能够用', '不付费', '随用随走']
  },
  {
    id: 'behavior-loyal-customer',
    name: '品牌忠诚者',
    category: '品牌态度',
    description: '对品牌有高度认同感和忠诚度',
    examples: ['只买这个牌子', '会员等级高', '推荐给朋友', '捍卫品牌']
  },
  {
    id: 'behavior-brand-switcher',
    name: '品牌摇摆者',
    category: '品牌态度',
    description: '经常更换品牌，没有固定偏好',
    examples: ['哪个便宜买哪个', '喜欢尝试新品牌', '容易被吸引', '没有忠诚度']
  },
  {
    id: 'behavior-health-conscious',
    name: '健康意识强',
    category: '生活方式',
    description: '非常关注健康，有健康的生活习惯',
    examples: ['健身达人', '健康饮食', '定期体检', '保健品爱好者']
  },
  {
    id: 'behavior-sleep-disordered',
    name: '作息不规律',
    category: '生活方式',
    description: '作息混乱，经常熬夜或失眠',
    examples: ['熬夜党', '失眠人群', '倒班族', '时差党']
  },
  {
    id: 'behavior-workaholic',
    name: '工作狂',
    category: '生活方式',
    description: '工作占据生活大部分时间',
    examples: ['996工作制', '经常加班', '周末也工作', '事业至上']
  },
  {
    id: 'behavior-life-balancer',
    name: '生活工作平衡者',
    category: '生活方式',
    description: '追求工作和生活的平衡',
    examples: ['到点下班', '周末不工作', '重视生活品质', '享受当下']
  }
]

export const mediaHabits: MediaHabit[] = [
  {
    id: 'media-social',
    name: '社交媒体重度用户',
    category: '社交平台',
    description: '大量时间花在社交媒体上',
    typicalPlatforms: ['微信', '微博', '小红书', '抖音', '快手'],
    usageTime: '日均3小时以上'
  },
  {
    id: 'media-short-video',
    name: '短视频爱好者',
    category: '视频平台',
    description: '喜欢刷短视频，娱乐消遣为主',
    typicalPlatforms: ['抖音', '快手', '视频号', '西瓜视频'],
    usageTime: '日均2-4小时'
  },
  {
    id: 'media-long-video',
    name: '长视频用户',
    category: '视频平台',
    description: '喜欢看长视频、剧集、综艺',
    typicalPlatforms: ['B站', '腾讯视频', '爱奇艺', '优酷', '芒果TV'],
    usageTime: '日均1-3小时'
  },
  {
    id: 'media-zhihu',
    name: '知识内容消费者',
    category: '知识平台',
    description: '喜欢看深度内容、学习知识',
    typicalPlatforms: ['知乎', '得到', '微信读书', '豆瓣'],
    usageTime: '日均1-2小时'
  },
  {
    id: 'media-live-streaming',
    name: '直播爱好者',
    category: '直播平台',
    description: '经常看直播，包括电商直播和娱乐直播',
    typicalPlatforms: ['淘宝直播', '抖音直播', '快手直播', 'B站直播'],
    usageTime: '日均1-3小时'
  },
  {
    id: 'media-ecommerce',
    name: '购物App重度用户',
    category: '电商平台',
    description: '经常逛购物App，购物欲强',
    typicalPlatforms: ['淘宝', '京东', '拼多多', '唯品会', '得物'],
    usageTime: '日均1-2小时'
  },
  {
    id: 'media-news-reader',
    name: '新闻资讯关注者',
    category: '资讯平台',
    description: '关注时事新闻和行业资讯',
    typicalPlatforms: ['今日头条', '腾讯新闻', '网易新闻', '财新', '36氪'],
    usageTime: '日均30分钟-1小时'
  },
  {
    id: 'media-music-streaming',
    name: '音乐流媒体用户',
    category: '音频平台',
    description: '喜欢听音乐、播客、有声书',
    typicalPlatforms: ['网易云音乐', 'QQ音乐', '喜马拉雅', '小宇宙播客'],
    usageTime: '日均1-3小时'
  },
  {
    id: 'media-reading-app',
    name: '阅读学习型',
    category: '阅读平台',
    description: '喜欢阅读电子书、学习课程',
    typicalPlatforms: ['微信读书', '得到', '知乎', '极客时间'],
    usageTime: '日均1-2小时'
  },
  {
    id: 'media-gaming',
    name: '游戏玩家',
    category: '游戏平台',
    description: '喜欢玩游戏，游戏是主要娱乐方式',
    typicalPlatforms: ['王者荣耀', '原神', 'Steam', 'Taptap', 'WeGame'],
    usageTime: '日均2-5小时'
  },
  {
    id: 'media-early-morning',
    name: '早间资讯型',
    category: '使用时段',
    description: '早上起床后刷手机获取资讯',
    typicalPlatforms: ['微信', '新闻App', '音乐App'],
    usageTime: '早间7-9点高峰'
  },
  {
    id: 'media-commute',
    name: '通勤消遣型',
    category: '使用时段',
    description: '上下班通勤路上使用数字内容',
    typicalPlatforms: ['短视频', '音乐', '有声书', '游戏'],
    usageTime: '早晚通勤各1小时'
  },
  {
    id: 'media-night-owl',
    name: '夜猫子型',
    category: '使用时段',
    description: '晚上睡前长时间刷手机',
    typicalPlatforms: ['短视频', '社交平台', '阅读App', '视频平台'],
    usageTime: '晚间21-24点高峰'
  },
  {
    id: 'media-weekend-heavy',
    name: '周末重度型',
    category: '使用时段',
    description: '工作日用得少，周末大量使用',
    typicalPlatforms: ['视频平台', '游戏', '社交平台', '电商'],
    usageTime: '周末日均5小时以上'
  }
]

export const occupationCategories = [
  '校园群体',
  '职场人群',
  '公职人员',
  '专业人群',
  '创意人群',
  '服务人群',
  '灵活就业',
  '创业人群',
  '家庭人群',
  '银发群体'
]

export const behaviorCategories = [
  '消费行为',
  '社交行为',
  '产品使用行为',
  '品牌态度',
  '生活方式'
]

export const mediaHabitCategories = [
  '社交平台',
  '视频平台',
  '知识平台',
  '直播平台',
  '电商平台',
  '资讯平台',
  '音频平台',
  '阅读平台',
  '游戏平台',
  '使用时段'
]
