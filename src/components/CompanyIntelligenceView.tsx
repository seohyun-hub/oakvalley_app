import React, { useState } from 'react';
import { CompanyReport } from '../types';
import {
  Search, Building2, TrendingUp, Star, Award, Clock, Target,
  ArrowRight, RefreshCw, Download, Sparkles, X,
  TreePine, Flame, BadgeCheck, Compass, Zap
} from 'lucide-react';
import { exportCompanyReportToPPTX } from '../utils/pptExporter';

interface CompanyIntelligenceViewProps {
  report: CompanyReport | null;
  loading: boolean;
  onSearchCompany: (name: string) => void;
  onSearchTrend: (trendQuery: string) => void;
}

export const CompanyIntelligenceView: React.FC<CompanyIntelligenceViewProps> = ({
  report,
  loading,
  onSearchCompany,
  onSearchTrend,
}) => {
  const [companyInput, setCompanyInput] = useState(report?.companyName || '');
  const [selectedTimelineFilter, setSelectedTimelineFilter] = useState<string>('전체');
  const [showWhyOakValleyModal, setShowWhyOakValleyModal] = useState<boolean>(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const presetCompanies = [
    'Garmin',
    'Nike',
    'National Geographic',
    'K-SWISS',
    'Polaroid',
    'Snow Peak',
    'Anker',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyInput.trim()) {
      onSearchCompany(companyInput.trim());
    }
  };

  const handlePresetClick = (name: string) => {
    setCompanyInput(name);
    onSearchCompany(name);
  };

  const filteredTimeline = report?.recentActivities
    ? selectedTimelineFilter === '전체'
      ? report.recentActivities
      : report.recentActivities.filter((a) => a.type === selectedTimelineFilter)
    : [];

  const renderFitBadge = (level?: 'HIGH' | 'MEDIUM' | 'LOW') => {
    if (!level) return null;
    switch (level) {
      case 'HIGH':
        return (
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xs inline-flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>HIGH</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded-xs inline-flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            <span>MEDIUM</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300 rounded-xs inline-flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            <span>LOW</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Search Header */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-mono rounded-xs uppercase tracking-wider">
                Module 02
              </span>
              <h1 className="text-2xl font-serif font-bold text-slate-900">Company Intelligence</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              기업 브랜드 아이덴티티, 최근 마케팅 동향 및 오크밸리 리조트·골프 맞춤 파트너십 평가
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="font-mono text-slate-400">ANALYSIS ENGINE:</span>
            <span className="inline-flex items-center space-x-1 text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Oak Valley Partnership AI</span>
            </span>
          </div>
        </div>

        {/* Large Search Input */}
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="relative flex flex-col sm:block">
            <input
              type="text"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              placeholder="분석할 기업 또는 브랜드를 검색하세요."
              className="w-full pl-10 sm:pl-12 pr-4 sm:pr-32 py-3.5 text-sm sm:text-base bg-slate-50 border border-slate-300 rounded-sm focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-slate-900 placeholder:text-slate-400 font-medium shadow-2xs min-h-[48px]"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 sm:left-4 top-3.5 sm:top-4" />
            <button
              id="company-search-submit-btn"
              type="submit"
              disabled={loading}
              className="mt-2 sm:mt-0 sm:absolute sm:right-2 sm:top-2 sm:bottom-2 px-5 py-3 sm:py-0 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-1.5 cursor-pointer min-h-[44px] sm:min-h-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 sm:w-3.5 sm:h-3.5 animate-spin" />
                  <span>분석 중...</span>
                </>
              ) : (
                <>
                  <span>기업 보고서 생성</span>
                  <ArrowRight className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 font-mono">추천 브랜드:</span>
            <div className="flex flex-wrap gap-2">
              {presetCompanies.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handlePresetClick(name)}
                  className={`px-3 py-1 text-xs border rounded-xs transition-all cursor-pointer font-medium ${
                    report?.companyName?.toLowerCase() === name.toLowerCase()
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Loading View */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-sm p-8 space-y-6 text-center animate-pulse">
          <div className="inline-flex items-center space-x-2 text-slate-600 text-sm font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
            <span>AI 가 기업 마케팅 히스토리 및 파트너십 기회를 정밀 분석 중입니다...</span>
          </div>
          <div className="h-4 bg-slate-100 rounded w-2/3 mx-auto"></div>
          <div className="h-32 bg-slate-100 rounded w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-slate-100 rounded"></div>
            <div className="h-48 bg-slate-100 rounded"></div>
          </div>
        </div>
      )}

      {/* Company Report Content */}
      {!loading && report && (
        <div className="space-y-8">
          
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-blue-400">OAK VALLEY COMPANY DOSSIER</span>
                <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 border border-slate-700 rounded-xs font-mono">
                  {report.overview.marketPosition}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {report.overview.companyName}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {report.overview.summary}
              </p>
            </div>

            {/* Action Buttons: Why Oak Valley, PPT Download & Cross-Link */}
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 md:pt-0">
              <button
                id="why-oak-valley-trigger-btn"
                onClick={() => setShowWhyOakValleyModal(true)}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold text-amber-300 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 rounded-xs transition-colors shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>WHY OAK VALLEY?</span>
              </button>

              <button
                id="export-company-ppt-btn"
                onClick={() => exportCompanyReportToPPTX(report)}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xs transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>PPT 리포트 다운로드</span>
              </button>

              <button
                id="view-related-trend-btn"
                onClick={() => onSearchTrend(report.relatedTrends[0] || `${report.companyName} 관련 트렌드`)}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xs transition-colors shadow-2xs cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-slate-800" />
                <span>관련 트렌드 보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Modal / Popup: WHY OAK VALLEY? */}
          {showWhyOakValleyModal && report.whyOakValley && (
            <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white border border-slate-300 rounded-sm w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8">
                <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-amber-900 text-amber-200 text-[10px] font-mono font-bold rounded-xs uppercase">
                        Partnership Rationale
                      </span>
                      <span className="text-xs text-slate-500 font-mono">Oak Valley × {report.companyName}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center space-x-2">
                      <span>WHY OAK VALLEY?</span>
                      <span className="text-xs font-sans font-normal text-slate-500">오크밸리 협업 제휴 핵심 근거</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowWhyOakValleyModal(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xs transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 3~5 Core Reasons */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                    KEY PARTNERSHIP REASONS (핵심 협업 명분)
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {report.whyOakValley.reasons.map((r, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xs p-4 space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-mono font-bold rounded-xs">
                            {r.category}
                          </span>
                          <h5 className="text-sm font-bold text-slate-900 font-serif">
                            {r.title}
                          </h5>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pl-1">
                          {r.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Partnership Direction */}
                <div className="bg-blue-950 text-white p-5 rounded-xs space-y-2 border border-blue-900">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-mono text-blue-300 font-bold uppercase">Recommended Partnership Direction</span>
                  </div>
                  <p className="text-sm font-bold text-white leading-relaxed font-serif">
                    "{report.whyOakValley.recommendedPartnershipDirection}"
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setShowWhyOakValleyModal(false)}
                    className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xs hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OAK VALLEY × BRAND FIT Section */}
          {report.oakValleyFit && (
            <section className="bg-slate-900 text-white rounded-sm p-6 sm:p-8 space-y-6 shadow-md border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-mono font-bold rounded-xs uppercase">
                      INTELLIGENCE EVALUATION
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Brand Compatibility Index</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                    OAK VALLEY × BRAND FIT
                  </h3>
                </div>
                <div className="text-xs text-slate-400">
                  오크밸리 리조트·골프 인프라와 {report.companyName}의 정밀 적합도 산출 결과
                </div>
              </div>

              {/* Top 2 Big Score Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Brand Fit Score */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-xs p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-slate-400">BRAND FIT SCORE</span>
                    <h4 className="text-sm font-bold text-white">브랜드 결합 적합도</h4>
                    <p className="text-[11px] text-slate-400">브랜드 철학과 오크밸리 하이엔드 이미지 결합성</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-mono font-black text-amber-400">
                      {report.oakValleyFit.brandFitScore}
                      <span className="text-sm text-slate-400 font-normal"> / 100</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">HIGH COMPATIBILITY</span>
                  </div>
                </div>

                {/* Customer Fit Score */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-xs p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-slate-400">CUSTOMER FIT SCORE</span>
                    <h4 className="text-sm font-bold text-white">타깃 고객 일치도</h4>
                    <p className="text-[11px] text-slate-400">오크밸리 회원·투숙객과 상대 브랜드 타깃 간 일치율</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-mono font-black text-blue-400">
                      {report.oakValleyFit.customerFitScore}
                      <span className="text-sm text-slate-400 font-normal"> / 100</span>
                    </div>
                    <span className="text-[10px] text-blue-300 font-mono">TARGET ALIGNED</span>
                  </div>
                </div>

              </div>

              {/* 6 Dimension Fit Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  DETAILED FIT MATRIX (6대 부문 세부 적합도)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xs p-3 space-y-1 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block">Golf Fit</span>
                    <div className="py-1">{renderFitBadge(report.oakValleyFit.golfFit)}</div>
                    <span className="text-[10px] text-slate-400 block">36홀 골프장 제휴</span>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xs p-3 space-y-1 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block">Resort Fit</span>
                    <div className="py-1">{renderFitBadge(report.oakValleyFit.resortFit)}</div>
                    <span className="text-[10px] text-slate-400 block">스위트 객실·투숙</span>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xs p-3 space-y-1 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block">Wellness Fit</span>
                    <div className="py-1">{renderFitBadge(report.oakValleyFit.wellnessFit)}</div>
                    <span className="text-[10px] text-slate-400 block">참나무 숲·힐링</span>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xs p-3 space-y-1 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block">Event Fit</span>
                    <div className="py-1">{renderFitBadge(report.oakValleyFit.eventFit)}</div>
                    <span className="text-[10px] text-slate-400 block">야외 잔디·컨벤션</span>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xs p-3 space-y-1 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block">Revenue Potential</span>
                    <div className="py-1">{renderFitBadge(report.oakValleyFit.revenuePotential)}</div>
                    <span className="text-[10px] text-slate-400 block">매출 창출 잠재력</span>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-xs p-3 space-y-1 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block">Execution Difficulty</span>
                    <div className="py-1">{renderFitBadge(report.oakValleyFit.executionDifficulty)}</div>
                    <span className="text-[10px] text-slate-400 block">실행 난이도</span>
                  </div>

                </div>
              </div>

              {/* Recommended Oak Valley Assets List */}
              {report.oakValleyFit.recommendedAssets && report.oakValleyFit.recommendedAssets.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                    <TreePine className="w-4 h-4 text-emerald-400" />
                    <span>RECOMMENDED OAK VALLEY ASSETS (활용 권장 오크밸리 주요 자산)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {report.oakValleyFit.recommendedAssets.map((assetItem, idx) => (
                      <div key={idx} className="bg-slate-800/90 border border-slate-700 rounded-xs p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold rounded-xs">
                            PRIORITY {assetItem.priority}
                          </span>
                          <span className="text-xs font-bold text-white font-mono uppercase">
                            [{assetItem.asset}]
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {assetItem.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </section>
          )}

          {/* 1. Company Overview */}
          <section className="bg-white border border-slate-200 rounded-sm p-4 sm:p-8 space-y-6 shadow-2xs">
            <div 
              className="flex items-center justify-between border-b border-slate-100 pb-3 cursor-pointer sm:cursor-default"
              onClick={() => toggleSection('companyOverview')}
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-slate-800" />
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">1. Company Overview</h3>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">기업 개요 및 사업 구조</span>
              </div>
              <button className="sm:hidden text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-xs">
                {collapsedSections['companyOverview'] ? '펼치기 ▲' : '접기 ▼'}
              </button>
            </div>

            {!collapsedSections['companyOverview'] && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xs space-y-1">
                  <span className="text-slate-500 font-mono block">주요 사업</span>
                  <div className="font-semibold text-slate-900 space-y-0.5">
                    {report.overview.mainBusinesses.map((b, i) => (
                      <div key={i}>• {b}</div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xs space-y-1">
                  <span className="text-slate-500 font-mono block">주요 브랜드</span>
                  <div className="font-semibold text-slate-900 space-y-0.5">
                    {report.overview.mainBrands.map((b, i) => (
                      <div key={i}>• {b}</div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xs space-y-1">
                  <span className="text-slate-500 font-mono block">주요 상품/서비스</span>
                  <div className="font-semibold text-slate-900 space-y-0.5">
                    {report.overview.productsServices.map((p, i) => (
                      <div key={i}>• {p}</div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xs space-y-1">
                  <span className="text-slate-500 font-mono block">주요 타깃 고객</span>
                  <p className="font-semibold text-slate-900 leading-relaxed">
                    {report.overview.targetCustomers}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 2. Brand Identity */}
          <section className="bg-white border border-slate-200 rounded-sm p-4 sm:p-8 space-y-6 shadow-2xs">
            <div 
              className="flex items-center justify-between border-b border-slate-100 pb-3 cursor-pointer sm:cursor-default"
              onClick={() => toggleSection('brandIdentity')}
            >
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-slate-800" />
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">2. Brand Identity</h3>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">브랜드 정체성 & 5대 키워드</span>
              </div>
              <button className="sm:hidden text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-xs">
                {collapsedSections['brandIdentity'] ? '펼치기 ▲' : '접기 ▼'}
              </button>
            </div>

            {!collapsedSections['brandIdentity'] && (
              <>
                {/* 5 Core Keywords Pills */}
                <div className="bg-slate-900 text-white p-4 rounded-xs flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-mono text-slate-400 uppercase">Core Brand Keywords (5):</span>
                  <div className="flex flex-wrap gap-2">
                    {report.brandIdentity.keywords.map((kw, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-800 text-white font-mono text-xs font-semibold rounded-xs border border-slate-700">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  <div className="p-4 border border-slate-200 rounded-xs space-y-2">
                    <strong className="text-slate-900 block font-serif text-sm">■ Brand Positioning</strong>
                    <p className="text-slate-700 leading-relaxed font-medium">{report.brandIdentity.positioning}</p>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-xs space-y-2">
                    <strong className="text-slate-900 block font-serif text-sm">■ Core Message</strong>
                    <p className="text-slate-900 font-bold italic text-sm leading-relaxed">"{report.brandIdentity.coreMessage}"</p>
                    <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-100">Personality: {report.brandIdentity.personality}</p>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-xs space-y-2">
                    <strong className="text-slate-900 block font-serif text-sm">■ Visual Identity</strong>
                    <p className="text-slate-700 leading-relaxed font-medium">{report.brandIdentity.visualIdentity}</p>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* 3. Recent Marketing Activity (Timeline Format) */}
          <section className="bg-white border border-slate-200 rounded-sm p-4 sm:p-8 space-y-6 shadow-2xs">
            <div 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 cursor-pointer sm:cursor-default"
              onClick={() => toggleSection('recentActivity')}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-slate-800" />
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">3. Recent Marketing Activity</h3>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">타임라인</span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2">
                {/* Activity Filter Tabs */}
                <div className="flex flex-wrap gap-1 text-xs" onClick={(e) => e.stopPropagation()}>
                  {['전체', '캠페인', '콜라보레이션', '팝업스토어', '이벤트', '스폰서십', '신제품'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedTimelineFilter(type)}
                      className={`px-2 py-0.5 rounded-xs border transition-colors cursor-pointer ${
                        selectedTimelineFilter === type
                          ? 'bg-slate-900 text-white border-slate-900 font-medium'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <button className="sm:hidden text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-xs">
                  {collapsedSections['recentActivity'] ? '펼치기 ▲' : '접기 ▼'}
                </button>
              </div>
            </div>

            {!collapsedSections['recentActivity'] && (
              /* Timeline UI */
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {filteredTimeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Timeline Dot */}
                    <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-slate-900 border-2 border-white ring-2 ring-slate-200"></span>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
                        {item.yearMonth}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-blue-50 text-blue-900 border border-blue-200 rounded-xs">
                        {item.type}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 4. Marketing Direction */}
          <section className="bg-white border border-slate-200 rounded-sm p-4 sm:p-8 space-y-4 shadow-2xs">
            <div 
              className="flex items-center justify-between border-b border-slate-100 pb-3 cursor-pointer sm:cursor-default"
              onClick={() => toggleSection('marketingDirection')}
            >
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-slate-800" />
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">4. Marketing Direction</h3>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">핵심 마케팅 지향점 분석</span>
              </div>
              <button className="sm:hidden text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-xs">
                {collapsedSections['marketingDirection'] ? '펼치기 ▲' : '접기 ▼'}
              </button>
            </div>

            {!collapsedSections['marketingDirection'] && (
              <div className="bg-slate-50 border border-slate-200 rounded-xs p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 font-mono">주요 집중 분야:</span>
                  {report.marketingDirection.focusAreas.map((area, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-white text-slate-900 font-semibold border border-slate-300 rounded-xs text-xs shadow-2xs">
                      {area}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-medium pt-2 border-t border-slate-200">
                  {report.marketingDirection.strategicAnalysis}
                </p>
              </div>
            )}
          </section>

          {/* 5. Partnership Opportunity (Crucial Core Section!) */}
          <section className="bg-white border border-slate-200 rounded-sm p-4 sm:p-8 space-y-6 shadow-2xs">
            <div 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 cursor-pointer sm:cursor-default"
              onClick={() => toggleSection('partnershipOpportunities')}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-slate-900" />
                  <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">5. Partnership Opportunities</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  호텔·리조트·골프·레저 분야 맞춤 마케팅 제휴 아이디어 제안
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <span className="text-xs font-mono text-slate-400">{report.partnerships.length} IDEAS GENERATED</span>
                <button className="sm:hidden text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-xs">
                  {collapsedSections['partnershipOpportunities'] ? '펼치기 ▲' : '접기 ▼'}
                </button>
              </div>
            </div>

            {!collapsedSections['partnershipOpportunities'] && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.partnerships.map((p) => (
                  <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-xs p-4 sm:p-6 space-y-4 flex flex-col justify-between hover:border-slate-400 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-slate-900 text-white text-xs font-mono font-medium rounded-xs">
                          {p.domain}
                        </span>
                        <div className="flex items-center space-x-2 text-xs font-mono">
                          <span className="text-slate-500">난이도: <strong className="text-slate-900">{p.difficulty}</strong></span>
                          <span>•</span>
                          <span className="text-slate-500">확장성: <strong className="text-blue-900">{p.potential}</strong></span>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 font-serif leading-snug">
                        {p.idea}
                      </h4>

                    <div className="space-y-2 text-xs text-slate-700">
                      <div>
                        <strong className="text-slate-900 block mb-0.5">■ 왜 이 기업과 잘 맞는가? (Why)</strong>
                        <p className="leading-relaxed">{p.whyThisBrand}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                        <div className="bg-white p-2.5 rounded-xs border border-slate-200">
                          <strong className="text-slate-900 block text-[11px] mb-0.5">상대 기업 혜택 (Brand):</strong>
                          <p className="leading-relaxed text-[11px] text-slate-700">{p.brandBenefit}</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-xs border border-slate-200">
                          <strong className="text-slate-900 block text-[11px] mb-0.5">우리 회사 혜택 (Business):</strong>
                          <p className="leading-relaxed text-[11px] text-slate-700">{p.businessBenefit}</p>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 pt-1">
                        <span className="font-semibold text-slate-900">타깃 고객: </span>
                        {p.targetCustomer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </section>

          {/* 6. AI Recommendation */}
          <section className="bg-slate-900 text-white rounded-sm p-6 sm:p-8 space-y-6 shadow-md border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-blue-400 uppercase tracking-widest block">AI TOP RECOMMENDATIONS</span>
                <h3 className="text-xl font-serif font-bold text-white mt-0.5">6. AI 최우선 협업 제휴 추천 (Top 3)</h3>
              </div>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {report.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-800/90 border border-slate-700 rounded-xs p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-blue-900 text-blue-200 text-xs font-mono font-bold rounded-xs border border-blue-700">
                        {rec.rank}
                      </span>
                      <span className="text-[11px] text-amber-300 font-mono">{rec.badgeText}</span>
                    </div>

                    <h4 className="text-base font-bold text-white leading-snug">
                      {rec.ideaTitle}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                      {rec.reasoning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Trend Navigation Link */}
          <div className="bg-slate-100 border border-slate-200 rounded-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">관련 연관 시장 트렌드가 궁금하신가요?</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {report.companyName} 관련 트렌드로 이동하여 연관 시장 분석 보고서를 바로 확인하세요.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {report.relatedTrends.map((rt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSearchTrend(rt)}
                  className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xs transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>{rt} 보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
