import React, { useState } from 'react';
import { TrendingUp, Building2, ArrowRight, Search, Clock, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';

interface HomeDashboardProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onSearchTrend: (query: string) => void;
  onSearchCompany: (name: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigateTab,
  onSearchTrend,
  onSearchCompany,
}) => {
  const [trendInput, setTrendInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [mobileSearchTab, setMobileSearchTab] = useState<'trend' | 'company'>('trend');

  const handleTrendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trendInput.trim()) {
      onSearchTrend(trendInput.trim());
    } else {
      onNavigateTab('trend');
    }
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyInput.trim()) {
      onSearchCompany(companyInput.trim());
    } else {
      onNavigateTab('company');
    }
  };

  const recentTrends = [
    { title: '2026 웰니스 트렌드', category: 'Wellness', period: '최근 1년', date: '2026.08.11' },
    { title: '호텔·리조트 마케팅 트렌드', category: 'Hospitality', period: '최근 6개월', date: '2026.08.10' },
    { title: '최근 골프 산업 트렌드', category: 'Golf', period: '최근 3개월', date: '2026.08.09' },
    { title: '시니어 시장 트렌드', category: 'Retail', period: '최근 1년', date: '2026.08.08' },
  ];

  const recentCompanies = [
    { name: 'Garmin', englishName: 'Garmin Ltd.', industry: 'Sports Wearable & GPS', keywords: ['Performance', 'Golf', 'Bio-Data'] },
    { name: 'Nike', englishName: 'Nike, Inc.', industry: 'Athletic Footwear & Apparel', keywords: ['Community', 'Running', 'NRC'] },
    { name: 'Snow Peak', englishName: 'Snow Peak Inc.', industry: 'Outdoor & Glamping Luxury', keywords: ['Outdoor', 'Sauna', 'Nature'] },
    { name: 'National Geographic', englishName: 'National Geographic', industry: 'Outdoor Apparel & Media', keywords: ['Eco-Explore', 'Kids', 'Lifestyle'] },
  ];

  return (
    <div className="space-y-6 sm:space-y-10 pb-16">

      {/* MOBILE QUICK SEARCH (Shown prominently at the top on mobile screens) */}
      <div className="block sm:hidden bg-white border border-slate-300 rounded-sm p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wide">
              Mobile Quick Search
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">이동 중 빠른 분석</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex border border-slate-200 rounded-xs bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobileSearchTab('trend')}
            className={`flex-1 py-2 text-center rounded-xs transition-all cursor-pointer min-h-[40px] flex items-center justify-center space-x-1 ${
              mobileSearchTab === 'trend'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>트렌드 검색</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileSearchTab('company')}
            className={`flex-1 py-2 text-center rounded-xs transition-all cursor-pointer min-h-[40px] flex items-center justify-center space-x-1 ${
              mobileSearchTab === 'company'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>기업/브랜드 검색</span>
          </button>
        </div>

        {/* Quick Search Inputs */}
        {mobileSearchTab === 'trend' ? (
          <form onSubmit={handleTrendSubmit} className="space-y-2.5">
            <div className="relative">
              <input
                type="text"
                value={trendInput}
                onChange={(e) => setTrendInput(e.target.value)}
                placeholder="트렌드 키워드 (예: 2026 웰니스 트렌드)"
                className="w-full pl-10 pr-20 py-3 text-sm bg-slate-50 border border-slate-300 rounded-sm focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-slate-900 text-white text-xs font-bold rounded-xs min-h-[36px] flex items-center justify-center cursor-pointer"
              >
                분석
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs text-slate-500 pt-0.5">
              <span className="text-[11px] text-slate-400">추천:</span>
              <button
                type="button"
                onClick={() => onSearchTrend('2026 웰니스 트렌드')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xs text-[11px] font-medium text-slate-800"
              >
                2026 웰니스
              </button>
              <button
                type="button"
                onClick={() => onSearchTrend('최근 골프 산업 트렌드')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xs text-[11px] font-medium text-slate-800"
              >
                골프 산업
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCompanySubmit} className="space-y-2.5">
            <div className="relative">
              <input
                type="text"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                placeholder="기업/브랜드명 (예: Garmin, Nike)"
                className="w-full pl-10 pr-20 py-3 text-sm bg-slate-50 border border-slate-300 rounded-sm focus:outline-none focus:border-slate-900 focus:bg-white text-slate-900 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-slate-900 text-white text-xs font-bold rounded-xs min-h-[36px] flex items-center justify-center cursor-pointer"
              >
                분석
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs text-slate-500 pt-0.5">
              <span className="text-[11px] text-slate-400">추천:</span>
              <button
                type="button"
                onClick={() => onSearchCompany('Garmin')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xs text-[11px] font-medium text-slate-800"
              >
                Garmin
              </button>
              <button
                type="button"
                onClick={() => onSearchCompany('Snow Peak')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xs text-[11px] font-medium text-slate-800"
              >
                Snow Peak
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Top Welcome Header */}
      <div className="bg-slate-900 text-white rounded-sm p-6 sm:p-10 border border-slate-800 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-xs bg-slate-800 text-slate-300 text-xs font-mono uppercase tracking-wider border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Executive Intelligence Platform</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-snug">
            마케팅 & 브랜드 제휴 인텔리전스
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-sans">
            지속 가능한 마케팅 전략 수립과 브랜드 제휴 기회를 수집·분석합니다.
            시장 트렌드 변화부터 타깃 기업의 브랜드 파트너십 기회까지 한눈에 탐색하세요.
          </p>
        </div>
      </div>

      {/* Two Core Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* 1. Trend Intelligence Card */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xs bg-slate-100 text-slate-900 flex items-center justify-center border border-slate-200">
                  <TrendingUp className="w-5 h-5 text-slate-800" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">Trend Intelligence</h2>
                  <p className="text-xs text-slate-500">시장 트렌드 및 소비자 변화 분석</p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">MODULE 01</span>
            </div>

            <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xs border border-slate-100">
              "지금 시장에서 무엇이 변하고 있는지 발견하세요."
            </p>

            <form onSubmit={handleTrendSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={trendInput}
                  onChange={(e) => setTrendInput(e.target.value)}
                  placeholder="예: 2026 웰니스 트렌드, 최근 골프 산업 트렌드"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 placeholder:text-slate-400 text-slate-900"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs text-slate-500 pt-1">
                <span className="text-slate-400">추천 검색:</span>
                <button
                  type="button"
                  onClick={() => onSearchTrend('2026 웰니스 트렌드')}
                  className="hover:text-slate-900 hover:underline cursor-pointer"
                >
                  2026 웰니스 트렌드
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onSearchTrend('호텔·리조트 마케팅 트렌드')}
                  className="hover:text-slate-900 hover:underline cursor-pointer"
                >
                  호텔·리조트 마케팅
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onSearchTrend('최근 골프 산업 트렌드')}
                  className="hover:text-slate-900 hover:underline cursor-pointer"
                >
                  골프 산업
                </button>
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">Exec Summary / Signals / Cases</span>
            <button
              id="start-trend-btn"
              onClick={() => {
                if (trendInput.trim()) onSearchTrend(trendInput.trim());
                else onNavigateTab('trend');
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-sm transition-colors shadow-2xs"
            >
              <span>트렌드 분석 시작</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Company Intelligence Card */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xs bg-slate-100 text-slate-900 flex items-center justify-center border border-slate-200">
                  <Building2 className="w-5 h-5 text-slate-800" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-slate-900">Company Intelligence</h2>
                  <p className="text-xs text-slate-500">기업 분석 및 파트너십 아이디어 제안</p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">MODULE 02</span>
            </div>

            <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xs border border-slate-100">
              "기업과 브랜드를 분석하고 새로운 협업 기회를 발견하세요."
            </p>

            <form onSubmit={handleCompanySubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  placeholder="예: Garmin, Nike, Snow Peak, National Geographic"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 placeholder:text-slate-400 text-slate-900"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs text-slate-500 pt-1">
                <span className="text-slate-400">추천 기업:</span>
                <button
                  type="button"
                  onClick={() => onSearchCompany('Garmin')}
                  className="hover:text-slate-900 hover:underline cursor-pointer font-medium"
                >
                  Garmin
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onSearchCompany('Nike')}
                  className="hover:text-slate-900 hover:underline cursor-pointer font-medium"
                >
                  Nike
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onSearchCompany('Snow Peak')}
                  className="hover:text-slate-900 hover:underline cursor-pointer font-medium"
                >
                  Snow Peak
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onSearchCompany('National Geographic')}
                  className="hover:text-slate-900 hover:underline cursor-pointer font-medium"
                >
                  National Geographic
                </button>
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">Overview / Identity / Partnerships</span>
            <button
              id="start-company-btn"
              onClick={() => {
                if (companyInput.trim()) onSearchCompany(companyInput.trim());
                else onNavigateTab('company');
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-sm transition-colors shadow-2xs"
            >
              <span>기업 분석 시작</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Analyzed Reports Cards */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <h3 className="text-lg font-bold font-serif text-slate-900">최근 분석 리포트</h3>
            <span className="text-xs text-slate-500 font-sans">(바로 클릭하여 인텔리전스 보고서 확인)</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">UPDATED REALTIME</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recent Trend Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">Trending Topics</span>
              <button
                onClick={() => onNavigateTab('trend')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                전체보기 &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {recentTrends.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSearchTrend(item.title)}
                  className="bg-white border border-slate-200 rounded-sm p-4 hover:border-slate-400 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-600 border border-slate-200 rounded-xs">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">기간: {item.period} 기준 인텔리전스</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono text-slate-400">{item.date}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Company Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">Target Companies</span>
              <button
                onClick={() => onNavigateTab('company')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                전체보기 &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {recentCompanies.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onSearchCompany(item.name)}
                  className="bg-white border border-slate-200 rounded-sm p-4 hover:border-slate-400 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">({item.englishName})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.keywords.map((kw, kidx) => (
                        <span key={kidx} className="text-[10px] px-1.5 py-0.2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xs">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-slate-500 hidden sm:inline">{item.industry}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
