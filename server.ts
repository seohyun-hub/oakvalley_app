import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { SAMPLE_TREND_REPORTS, SAMPLE_COMPANY_REPORTS } from './src/data/sampleData';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. API: Analyze Trend
app.post('/api/analyze-trend', async (req, res) => {
  try {
    const { query, period = '최근 1년', region = '한국', category = 'Marketing' } = req.body || {};
    const trimmedQuery = (query || '2026 웰니스 트렌드').trim();

    // Check pre-cached sample dataset first
    if (SAMPLE_TREND_REPORTS[trimmedQuery]) {
      return res.json({
        success: true,
        report: SAMPLE_TREND_REPORTS[trimmedQuery],
        source: 'cached',
      });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return generated structured fallback if no API key is set
      const fallbackReport = generateFallbackTrendReport(trimmedQuery, period, region, category);
      return res.json({
        success: true,
        report: fallbackReport,
        source: 'generated-template',
      });
    }

    const prompt = `
당신은 글로벌 메이저 경영 컨설팅 파트너이자 최고 수준의 마케팅 전략가입니다.
다음 조건으로 '마케팅 보고서 수준'의 Trend Intelligence Report를 작성해 주세요.

- 트렌드 주제: "${trimmedQuery}"
- 기간: ${period}
- 지역: ${region}
- 카테고리: ${category}

전체 모든 텍스트는 한국어로 작성하고, 과장되지 않은 전문적인 어조를 사용하세요.

요구 구조:
1. executiveSummary: 시장의 핵심 변화 3~5개 항목 (배열)
2. keyTrends: 3개의 핵심 트렌드 상세 정보 (title, description, whyGrowing, consumerBehavior, corporateUsage, futureOutlook, tags)
3. metrics: 2~3개의 핵심 시장 수치 및 파생 예측 (label, currentValue, yoyChange, forecast, unit, chartData: [{year, value}])
4. brandCases: 해당 트렌드를 적극 활용 중인 2~3개 국내외 브랜드 실사례 (brandName, projectTitle, action, whyNotable, takeaway)
5. emergingSignals: 앞으로 크게 성장할 극초기 신호 2개 (title, description, potentialImpact)
6. opportunities: 리조트/호텔/골프/레저/라이프스타일 기업 관점의 실제 브랜드 제휴/사업 기회 2개 (opportunity, targetCustomer, possiblePartner, businessModel, expectedBenefit)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyTrends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  whyGrowing: { type: Type.STRING },
                  consumerBehavior: { type: Type.STRING },
                  corporateUsage: { type: Type.STRING },
                  futureOutlook: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'description', 'whyGrowing', 'consumerBehavior', 'corporateUsage', 'futureOutlook', 'tags'],
              },
            },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  currentValue: { type: Type.STRING },
                  yoyChange: { type: Type.STRING },
                  forecast: { type: Type.STRING },
                  unit: { type: Type.STRING },
                  chartData: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        year: { type: Type.STRING },
                        value: { type: Type.NUMBER },
                      },
                    },
                  },
                },
                required: ['label', 'currentValue', 'yoyChange', 'forecast', 'unit'],
              },
            },
            brandCases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  brandName: { type: Type.STRING },
                  projectTitle: { type: Type.STRING },
                  action: { type: Type.STRING },
                  whyNotable: { type: Type.STRING },
                  takeaway: { type: Type.STRING },
                },
                required: ['brandName', 'projectTitle', 'action', 'whyNotable', 'takeaway'],
              },
            },
            emergingSignals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  potentialImpact: { type: Type.STRING },
                },
                required: ['title', 'description', 'potentialImpact'],
              },
            },
            opportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  opportunity: { type: Type.STRING },
                  targetCustomer: { type: Type.STRING },
                  possiblePartner: { type: Type.STRING },
                  businessModel: { type: Type.STRING },
                  expectedBenefit: { type: Type.STRING },
                },
                required: ['opportunity', 'targetCustomer', 'possiblePartner', 'businessModel', 'expectedBenefit'],
              },
            },
          },
          required: ['executiveSummary', 'keyTrends', 'metrics', 'brandCases', 'emergingSignals', 'opportunities'],
        },
      },
    });

    const reportJson = JSON.parse(response.text || '{}');
    const fullReport = {
      query: trimmedQuery,
      filters: { period, region, category },
      generatedAt: new Date().toISOString().split('T')[0],
      ...reportJson,
      keyTrends: (reportJson.keyTrends || []).map((t: any, idx: number) => ({ id: `kt-${idx}`, ...t })),
      brandCases: (reportJson.brandCases || []).map((b: any, idx: number) => ({ id: `bc-${idx}`, ...b })),
      opportunities: (reportJson.opportunities || []).map((o: any, idx: number) => ({ id: `opp-${idx}`, ...o })),
    };

    return res.json({
      success: true,
      report: fullReport,
      source: 'gemini-live',
    });
  } catch (error: any) {
    console.error('Error analyzing trend:', error);
    const { query = '분석 대상', period = '최근 1년', region = '한국', category = 'Marketing' } = req.body || {};
    return res.json({
      success: true,
      report: generateFallbackTrendReport(query, period, region, category),
      source: 'fallback-on-error',
    });
  }
});

// 2. API: Analyze Company
app.post('/api/analyze-company', async (req, res) => {
  try {
    const { companyName } = req.body || {};
    const trimmedName = (companyName || 'Garmin').trim();

    // Check pre-cached sample dataset first
    const cachedKey = Object.keys(SAMPLE_COMPANY_REPORTS).find(
      (k) => k.toLowerCase() === trimmedName.toLowerCase() || trimmedName.toLowerCase().includes(k.toLowerCase())
    );
    if (cachedKey && SAMPLE_COMPANY_REPORTS[cachedKey]) {
      return res.json({
        success: true,
        report: SAMPLE_COMPANY_REPORTS[cachedKey],
        source: 'cached',
      });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallbackReport = generateFallbackCompanyReport(trimmedName);
      return res.json({
        success: true,
        report: fallbackReport,
        source: 'generated-template',
      });
    }

    const prompt = `
당신은 리조트, 호텔, 골프, 레저 및 마케팅 제휴 분야의 최고 전문 컨설팅 파트너입니다.
기업/브랜드 "${trimmedName}"에 대한 상세 Company Intelligence & Partnership Report를 작성하세요.

한국어로 전문적이고 신뢰할 수 있게 작성해야 합니다.

요구사항:
1. overview: companyName, summary, mainBusinesses (배열), mainBrands (배열), productsServices (배열), targetCustomers, marketPosition
2. brandIdentity: positioning, targetCustomer, personality, coreMessage, keywords (정확히 5개의 단어 배열), visualIdentity
3. recentActivities: 최근 마케팅 활동 3~4개 (yearMonth, type: '캠페인'|'콜라보레이션'|'팝업스토어'|'이벤트'|'스폰서십'|'신제품'|'콘텐츠', title, description)
4. marketingDirection: focusAreas (배열: e.g. Experience Marketing, Community, Premium Customer, Sports, Wellness 등), strategicAnalysis
5. partnerships: 리조트/호텔/골프/레저 기업과 협업할 수 있는 구체적 제휴 아이디어 3~4개
   - domain: 'Brand Experience'|'Event'|'Golf'|'Wellness'|'Accommodation'|'F&B'|'Pop-up'|'Content'|'Membership'|'VIP'|'Product Experience'|'Package'|'Community' 중 하나
   - idea, whyThisBrand, brandBenefit, businessBenefit, targetCustomer, difficulty ('상'|'중'|'하'), potential ('높음'|'중간')
6. recommendations: 최고 추천 아이디어 3개 (rank: 'BEST 1'|'BEST 2'|'BEST 3', badgeText, ideaTitle, reasoning)
7. relatedTrends: 이 기업과 관련된 시장 트렌드 키워드 3개 (배열)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: {
              type: Type.OBJECT,
              properties: {
                companyName: { type: Type.STRING },
                englishName: { type: Type.STRING },
                summary: { type: Type.STRING },
                mainBusinesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                mainBrands: { type: Type.ARRAY, items: { type: Type.STRING } },
                productsServices: { type: Type.ARRAY, items: { type: Type.STRING } },
                targetCustomers: { type: Type.STRING },
                marketPosition: { type: Type.STRING },
              },
              required: ['companyName', 'summary', 'mainBusinesses', 'mainBrands', 'productsServices', 'targetCustomers', 'marketPosition'],
            },
            brandIdentity: {
              type: Type.OBJECT,
              properties: {
                positioning: { type: Type.STRING },
                targetCustomer: { type: Type.STRING },
                personality: { type: Type.STRING },
                coreMessage: { type: Type.STRING },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                visualIdentity: { type: Type.STRING },
              },
              required: ['positioning', 'targetCustomer', 'personality', 'coreMessage', 'keywords', 'visualIdentity'],
            },
            recentActivities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  yearMonth: { type: Type.STRING },
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['yearMonth', 'type', 'title', 'description'],
              },
            },
            marketingDirection: {
              type: Type.OBJECT,
              properties: {
                focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
                strategicAnalysis: { type: Type.STRING },
              },
              required: ['focusAreas', 'strategicAnalysis'],
            },
            partnerships: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  domain: { type: Type.STRING },
                  idea: { type: Type.STRING },
                  whyThisBrand: { type: Type.STRING },
                  brandBenefit: { type: Type.STRING },
                  businessBenefit: { type: Type.STRING },
                  targetCustomer: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  potential: { type: Type.STRING },
                },
                required: ['domain', 'idea', 'whyThisBrand', 'brandBenefit', 'businessBenefit', 'targetCustomer', 'difficulty', 'potential'],
              },
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rank: { type: Type.STRING },
                  badgeText: { type: Type.STRING },
                  ideaTitle: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                },
                required: ['rank', 'badgeText', 'ideaTitle', 'reasoning'],
              },
            },
            relatedTrends: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['overview', 'brandIdentity', 'recentActivities', 'marketingDirection', 'partnerships', 'recommendations', 'relatedTrends'],
        },
      },
    });

    const reportJson = JSON.parse(response.text || '{}');
    const fullReport = {
      companyName: trimmedName,
      generatedAt: new Date().toISOString().split('T')[0],
      ...reportJson,
      partnerships: (reportJson.partnerships || []).map((p: any, idx: number) => ({ id: `cp-${idx}`, ...p })),
    };

    return res.json({
      success: true,
      report: fullReport,
      source: 'gemini-live',
    });
  } catch (error: any) {
    console.error('Error analyzing company:', error);
    const { companyName = '기업' } = req.body || {};
    return res.json({
      success: true,
      report: generateFallbackCompanyReport(companyName),
      source: 'fallback-on-error',
    });
  }
});

// Helper for fallback trend generation
function generateFallbackTrendReport(query: string, period: string, region: string, category: string) {
  return {
    query,
    filters: { period, region, category },
    generatedAt: new Date().toISOString().split('T')[0],
    executiveSummary: [
      `"${query}" 분야는 오크밸리 리조트 및 골프 자산과 결합 시 독창적인 프리미엄 경험 가치를 창출할 핵심 시장 트렌드입니다.`,
      `소비자들은 단순 브랜드 인지도보다 오프라인 고유의 오감 몰입 경험 및 데이터 기반 개인화를 강력하게 요구하고 있습니다.`,
      `오크밸리의 36홀 프리미엄 골프장, 참나무 숲 야외 필드, 스위트 객실을 연계한 마케팅 제휴 수요가 급증하고 있습니다.`
    ],
    keyTrends: [
      {
        id: 'kt-f1',
        title: `${query} 중심의 Experience Marketing`,
        description: `${query}와 연계한 독창적인 오프라인 팝업 및 시체험 마케팅 활성화`,
        whyGrowing: '디지털 피로감으로 인해 만질 수 있고 오감으로 느낄 수 있는 오프라인 브랜드 거점에 대한 욕구 증대',
        consumerBehavior: '특색 있는 공간 방문 후 소셜 미디어 인스타그램 인증 및 후기 자발적 확산',
        corporateUsage: '오크밸리 로비, 잔디광장, 골프장 클럽하우스를 브랜드 팝업존으로 제휴 운영',
        futureOutlook: '시즌 단발성 이벤트를 넘어 연간 시그니처 앰버서더 프로젝트로 정착',
        tags: ['Experience', 'OakValleySpace', 'VIP'],
        oakValleyOpportunity: {
          opportunityScore: 92,
          recommendedAssets: ['Stay', 'Outdoor', 'Golf'],
          targetCustomer: '프리미엄 공간 체험과 라이프스타일 가치를 중시하는 3050 VIP 투숙객',
          recommendedProgram: `오크밸리 "${query} Brand Experience & Forest Suite" 패키지`,
          potentialPartnerCategory: '글로벌 라이프스타일, 프리미엄 뷰티, 웨어러블 디바이스',
          businessModel: '공간 대여료 + 팝업 패키지 세트 판매 매출 공유',
          quickWin: '오크밸리 체크인 로비 및 스위트 객실 3실에 시체험 브랜드 팝업 키트 즉시 비치',
          longTermOpportunity: '오크밸리 단지 내 연연간 상설 플래그십 컬래버레이션 갤러리 조성',
          spaceAndTouchpoints: '오크밸리 빌리지 로비, 참나무 숲 산책로, 스위트 객실'
        }
      },
      {
        id: 'kt-f2',
        title: 'Community-Driven Brand Loyalty',
        description: '공통의 취향과 라이프스타일을 공유하는 액티브 멤버십 소셜 클럽 확산',
        whyGrowing: '브랜드 가치관에 동의하는 진성 팬덤(Fandom) 확보가 기업의 지속 가능한 성장동력으로 부상',
        consumerBehavior: '브랜드 주최 주말 세션, 세미나, 아웃도어 클럽 활동에 유료 참가',
        corporateUsage: '앰버서더 연계 웰니스, 스포츠, 와인 세션 개최 및 프라이빗 네트워크 커뮤니티 조성',
        futureOutlook: '브랜드 자체 앱 및 멤버십 혜택과 결합하여 고객 락인(Lock-in) 강화',
        tags: ['Community', 'Membership', 'OakValleyClub'],
        oakValleyOpportunity: {
          opportunityScore: 89,
          recommendedAssets: ['Event', 'F&B', 'Membership'],
          targetCustomer: '취향이 명확하고 프라이빗한 주말 모임을 선호하는 고소득 커뮤니티 회원',
          recommendedProgram: '오크밸리 잔디광장 "Mindful Outdoor Social Gathering"',
          potentialPartnerCategory: '아웃도어 브랜드, 라이프스타일 가전, 피트니스 브랜드',
          businessModel: '주말 데이패스 유료 파티 티켓 판매 + 멤버십 제휴 연간 계약',
          quickWin: '오크밸리 회원 대상 주말 불멍 와인 커뮤니티 세션 팝업 개최',
          longTermOpportunity: '오크밸리 연례 프리미엄 시그니처 프라이빗 멤버십 클럽으로 브랜딩',
          spaceAndTouchpoints: '오크밸리 야외 잔디광장, 야외 테라스, 컨벤션 홀'
        }
      }
    ],
    metrics: [
      {
        label: `${query} 관련 시장 지표 성장률`,
        currentValue: '15.8%',
        yoyChange: '+15.8%',
        forecast: '지속적인 양질의 콘텐츠 유입으로 매년 두 자릿수 성장률 유지 전망',
        unit: '%',
        chartData: [
          { year: '2023', value: 10.2 },
          { year: '2024', value: 12.8 },
          { year: '2025', value: 14.1 },
          { year: '2026', value: 15.8 }
        ]
      }
    ],
    brandCases: [
      {
        id: 'bc-f1',
        brandName: 'Garmin',
        projectTitle: 'Smart Bio-Tracking Experience',
        action: '스마트워치 데이터 기반 맞춤형 스파 및 리조트 프로그램 연계',
        whyNotable: '테크 기술과 공간 서비스의 뛰어난 융합 사례',
        takeaway: '데이터를 통한 고객 상태 파악 후 서비스 제안'
      }
    ],
    emergingSignals: [
      {
        title: 'Micro-Curated Personalization',
        description: '초개인화된 1:1 맞춤 서비스 및 어메니티 큐레이션',
        potentialImpact: '고객 만족도 및 객단가 동시 상승 기대'
      }
    ],
    opportunities: [
      {
        id: 'opp-f1',
        opportunity: `${query} 맞춤형 팝업스토어 및 전용 객실 패키지`,
        targetCustomer: '프리미엄 라이프스타일을 지향하는 3050 VIP 고객',
        possiblePartner: 'Garmin, Snow Peak, National Geographic',
        businessModel: '공간 대여 + 브랜드 기어 시체험 + 패키지 판매',
        expectedBenefit: '객실 단가(ADR) 상승 및 신규 고소득 타깃 고객 유입'
      }
    ]
  };
}

function generateFallbackCompanyReport(companyName: string) {
  return {
    companyName,
    generatedAt: new Date().toISOString().split('T')[0],
    overview: {
      companyName: `${companyName} (글로벌 브랜드)`,
      englishName: companyName,
      summary: `${companyName}은(는) 혁신적인 기술과 명확한 브랜드 아이덴티티를 바탕으로 해당 산업군을 선도하고 있는 대표 기업입니다.`,
      mainBusinesses: ['프리미엄 리테일', '디지털 커뮤니티 플랫폼', '브랜드 라이선싱', '체험형 서비스'],
      mainBrands: [companyName, `${companyName} Premium`, `${companyName} Lab`],
      productsServices: ['시그니처 라인업', '전문가용 용품/디바이스', '디지털 멤버십 서비스'],
      targetCustomers: '품질과 브랜드 가치를 중시하는 2040 트렌디 및 프리미엄 소비자',
      marketPosition: '해당 분야 브랜드 인지도 및 선호도 최상위권 위치'
    },
    brandIdentity: {
      positioning: 'Innovative & Premium Lifestyle Standard',
      targetCustomer: '자신의 라이프스타일 향상과 가치 소비에 적극적인 핵심 타깃층',
      personality: '혁신적인(Innovative), 신뢰할 수 있는(Trustworthy), 트렌디한(Trendy)',
      coreMessage: 'Redefining Excellence',
      keywords: ['Innovation', 'Quality', 'Lifestyle', 'Experience', 'Community'],
      visualIdentity: '세련된 모던 스틸 & 세라믹 텍스처, 시그니처 로고 중심의 깔끔한 비주얼'
    },
    recentActivities: [
      {
        yearMonth: '2026.05',
        type: '캠페인',
        title: `${companyName} Brand Experience Campaign`,
        description: '고객 오감 만족을 위한 대규모 플래그십 팝업 및 브랜드 커뮤니티 데이 개최'
      },
      {
        yearMonth: '2026.02',
        type: '신제품',
        title: `${companyName} Next-Gen Flagship Lineup`,
        description: '최첨단 소재 및 데이터 기능을 접목한 신규 플래그십 제품군 정식 공개'
      }
    ],
    marketingDirection: {
      focusAreas: ['Experience Marketing', 'Community', 'Premium Customer', 'Lifestyle'],
      strategicAnalysis: `${companyName}은 단순한 제품 전달을 넘어 오프라인 공간에서의 몰입감 있는 체험과 오프라인 커뮤니티 형성을 핵심 마케팅 전략으로 추진하고 있습니다.`
    },
    partnerships: [
      {
        id: 'p-f1',
        domain: 'Brand Experience',
        idea: `오크밸리 리조트 내 ${companyName} 플래그십 시체험 공간 구축`,
        whyThisBrand: `${companyName}의 브랜드 가치와 오크밸리의 하이엔드 자연 공간 이미지가 최고의 시너지를 창출함`,
        brandBenefit: '투숙객 대상 최고급 브랜드 체험 기회 제공 및 잠재 고객 확보',
        businessBenefit: '공간 가치 제고 및 차별화된 시그니처 팝업 볼거리 제공',
        targetCustomer: '3040 프리미엄 투숙객 및 VIP 회원',
        difficulty: '중',
        potential: '높음'
      },
      {
        id: 'p-f2',
        domain: 'Golf',
        idea: `${companyName} x 오크밸리 CC VIP 챔피언십 & 커뮤니티 라운지 제휴`,
        whyThisBrand: '고소득층 골프 회원 타깃 접점을 동시에 확보할 수 있는 상호 이익 구조',
        brandBenefit: '타깃 맞춤 마케팅 및 브랜드 호감도 증대',
        businessBenefit: '골프장 이용률 증대 및 회원권 만족도 상승',
        targetCustomer: '골프 및 레저 마니아',
        difficulty: '하',
        potential: '높음'
      }
    ],
    recommendations: [
      {
        rank: 'BEST 1',
        badgeText: '가장 추천하는 핵심 제휴',
        ideaTitle: `오크밸리 리조트 내 ${companyName} 플래그십 시체험 공간 구축`,
        reasoning: '브랜드 가치가 유효하게 전달되는 오프라인 팝업 공간을 제휴함으로써 빠른 파급력과 높은 시너지를 기대할 수 있음.'
      },
      {
        rank: 'BEST 2',
        badgeText: '실행 용이성 우수',
        ideaTitle: `${companyName} x 오크밸리 스페셜 웰컴 기프트 & 렌탈 서비스`,
        reasoning: '투숙객 웰컴 어메니티 및 체험 대여 카운터 설치를 통해 단기간 내 최소 리소스로 실행 가능함.'
      },
      {
        rank: 'BEST 3',
        badgeText: '장기 확장성 높음',
        ideaTitle: `${companyName} VIP 커뮤니티 프라이빗 모임 패키지`,
        reasoning: '브랜드 팬덤을 오크밸리 프라이빗 장소로 초대하는 연간 정기 이벤트로 정착시켜 고정 고객을 지속 유치함.'
      }
    ],
    relatedTrends: ['2026 웰니스 트렌드', '호텔·리조트 마케팅 트렌드', '최근 팝업스토어 트렌드'],

    oakValleyFit: {
      brandFitScore: 92,
      customerFitScore: 90,
      golfFit: 'HIGH',
      resortFit: 'HIGH',
      wellnessFit: 'HIGH',
      eventFit: 'HIGH',
      revenuePotential: 'HIGH',
      executionDifficulty: 'LOW',
      recommendedAssets: [
        { asset: 'Golf', priority: 1, reason: `오크밸리 CC 및 성문안 CC 연계 ${companyName} VIP 골프 마케팅` },
        { asset: 'Stay', priority: 2, reason: `오크밸리 스위트 객실 내 ${companyName} 시체험 어메니티 비치` },
        { asset: 'Outdoor', priority: 3, reason: `오크밸리 참나무 숲 야외 공간 활용 ${companyName} 액티비티 팝업` },
        { asset: 'F&B', priority: 4, reason: `오크밸리 F&B 라운지 연계 ${companyName} 컬래버레이션 메인 스페셜` },
        { asset: 'Event', priority: 5, reason: `오크밸리 야외 잔디광장 ${companyName} 커뮤니티 이벤트 개최` }
      ]
    },

    whyOakValley: {
      reasons: [
        {
          category: 'Customer',
          title: '3050 고소득 액티브 골퍼 및 패밀리 타깃층의 완벽한 상호 일치',
          detail: `오크밸리의 주고객층은 ${companyName}의 핵심 타깃과 구매력이 완전히 일치함.`
        },
        {
          category: 'Brand Experience',
          title: '대한민국 최고 수준의 자연 참나무 숲 및 36홀 프리미엄 레저 인프라',
          detail: `단순 실내 매장 전시를 넘어, 오크밸리의 웅장한 자연 속에서 ${companyName}의 브랜드 가치를 오감으로 시체험 가능.`
        },
        {
          category: 'Business',
          title: '골프장 라운지 및 리조트 팝업을 통한 가파른 매출 상승',
          detail: '고관여 체류형 소비자와의 오프라인 접점 확보를 통해 높은 구매 전환 유도.'
        },
        {
          category: 'Marketing',
          title: '사계절 독점 오프라인 브랜딩 및 강력한 인스타그램 바이럴 효과',
          detail: `오크밸리의 대표 공간을 ${companyName}의 시그니처 팝업존으로 바이럴 스팟화.`
        },
        {
          category: 'Long-term Expansion',
          title: '연간 시그니처 제휴 프로젝트 및 전용 디지털 멤버십 결합',
          detail: `단발성 협업을 넘어 오크밸리와 ${companyName}의 연례 시그니처 제휴 파트너십 구축.`
        }
      ],
      recommendedPartnershipDirection: `오크밸리 CC 및 스위트 객실 내 "${companyName} Brand Experience Suite" 상설 팝업 구축`
    }
  };
}

// Vite or Static file setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
