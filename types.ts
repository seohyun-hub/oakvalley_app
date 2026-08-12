export type ActiveTab = 'home' | 'trend' | 'company';

export interface TrendFilter {
  period: '최근 1개월' | '최근 3개월' | '최근 6개월' | '최근 1년';
  region: '한국' | '글로벌' | '미국' | '일본' | '유럽';
  category: 'Marketing' | 'Travel' | 'Hospitality' | 'Golf' | 'Wellness' | 'Sports' | 'F&B' | 'Fashion' | 'Beauty' | 'Retail' | 'Technology' | 'Entertainment' | '전체';
}

export type OakValleyAsset = 'Golf' | 'Stay' | 'Wellness' | 'F&B' | 'Event' | 'Outdoor' | 'Check-in' | 'Membership' | 'Digital';
export type OakValleyLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface RecommendedOakValleyAsset {
  asset: OakValleyAsset;
  priority: number;
  reason: string;
}

export interface OakValleyFit {
  brandFitScore: number; // 0~100
  customerFitScore: number; // 0~100
  golfFit: OakValleyLevel;
  resortFit: OakValleyLevel;
  wellnessFit: OakValleyLevel;
  eventFit: OakValleyLevel;
  revenuePotential: OakValleyLevel;
  executionDifficulty: OakValleyLevel;
  recommendedAssets: RecommendedOakValleyAsset[];
}

export interface WhyOakValleyReason {
  category: 'Customer' | 'Brand Experience' | 'Business' | 'Marketing' | 'Long-term Expansion';
  title: string;
  detail: string;
}

export interface WhyOakValley {
  reasons: WhyOakValleyReason[];
  recommendedPartnershipDirection: string;
}

export interface OakValleyOpportunity {
  opportunityScore: number; // 0~100
  recommendedAssets: OakValleyAsset[];
  targetCustomer: string;
  recommendedProgram: string;
  potentialPartnerCategory: string;
  businessModel: string;
  quickWin: string;
  longTermOpportunity: string;
  spaceAndTouchpoints: string;
}

export interface KeyTrend {
  id: string;
  title: string;
  description: string;
  whyGrowing: string;
  consumerBehavior: string;
  corporateUsage: string;
  futureOutlook: string;
  tags: string[];
  oakValleyOpportunity?: OakValleyOpportunity;
}

export interface MetricChartPoint {
  year: string;
  value: number;
}

export interface SignalMetric {
  label: string;
  currentValue: string;
  yoyChange: string;
  forecast: string;
  unit: string;
  chartData?: MetricChartPoint[];
}

export interface BrandCase {
  id: string;
  brandName: string;
  projectTitle: string;
  action: string;
  whyNotable: string;
  takeaway: string;
}

export interface EmergingSignal {
  title: string;
  description: string;
  potentialImpact: string;
}

export interface BusinessOpportunity {
  id: string;
  opportunity: string;
  targetCustomer: string;
  possiblePartner: string;
  businessModel: string;
  expectedBenefit: string;
}

export interface TrendReport {
  query: string;
  filters: TrendFilter;
  generatedAt: string;
  executiveSummary: string[];
  keyTrends: KeyTrend[];
  metrics: SignalMetric[];
  brandCases: BrandCase[];
  emergingSignals: EmergingSignal[];
  opportunities: BusinessOpportunity[];
}

export interface CompanyOverview {
  companyName: string;
  englishName?: string;
  summary: string;
  mainBusinesses: string[];
  mainBrands: string[];
  productsServices: string[];
  targetCustomers: string;
  marketPosition: string;
}

export interface BrandIdentity {
  positioning: string;
  targetCustomer: string;
  personality: string;
  coreMessage: string;
  keywords: string[]; // Exact 5 core keywords
  visualIdentity: string;
}

export interface MarketingTimelineItem {
  yearMonth: string;
  type: '캠페인' | '콜라보레이션' | '팝업스토어' | '이벤트' | '스폰서십' | '신제품' | '콘텐츠';
  title: string;
  description: string;
}

export interface MarketingDirection {
  focusAreas: string[];
  strategicAnalysis: string;
}

export type DomainCategory = 
  | 'Brand Experience'
  | 'Event'
  | 'Golf'
  | 'Wellness'
  | 'Accommodation'
  | 'F&B'
  | 'Pop-up'
  | 'Content'
  | 'Membership'
  | 'VIP'
  | 'Product Experience'
  | 'Package'
  | 'Community';

export interface PartnershipOpportunity {
  id: string;
  domain: DomainCategory;
  idea: string;
  whyThisBrand: string;
  brandBenefit: string;
  businessBenefit: string;
  targetCustomer: string;
  difficulty: '상' | '중' | '하';
  potential: '높음' | '중간';
}

export interface AIRecommendation {
  rank: 'BEST 1' | 'BEST 2' | 'BEST 3';
  badgeText: string;
  ideaTitle: string;
  reasoning: string;
}

export interface CompanyReport {
  companyName: string;
  generatedAt: string;
  overview: CompanyOverview;
  brandIdentity: BrandIdentity;
  recentActivities: MarketingTimelineItem[];
  marketingDirection: MarketingDirection;
  partnerships: PartnershipOpportunity[];
  recommendations: AIRecommendation[];
  relatedTrends: string[];
  oakValleyFit?: OakValleyFit;
  whyOakValley?: WhyOakValley;
}
