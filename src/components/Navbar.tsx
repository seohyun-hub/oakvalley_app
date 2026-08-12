import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { TrendingUp, Building2, LayoutDashboard, Search, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Platform Title */}
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => handleTabClick('home')}>
              <div className="w-9 h-9 bg-slate-900 text-white flex items-center justify-center rounded-sm font-semibold tracking-wider text-sm shadow-xs shrink-0">
                MI
              </div>
              <div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight font-serif whitespace-nowrap">
                    Marketing Intelligence
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider shrink-0">
                    Enterprise
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans hidden sm:block">
                  AI 기반 트렌드 & 기업 마케팅 제휴 인텔리전스
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
              <button
                id="nav-tab-home"
                onClick={() => handleTabClick('home')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'home'
                    ? 'border-slate-900 text-slate-900 bg-slate-50/80'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>대시보드</span>
              </button>

              <button
                id="nav-tab-trend"
                onClick={() => handleTabClick('trend')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'trend'
                    ? 'border-slate-900 text-slate-900 bg-slate-50/80'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-slate-500" />
                <span>Trend Intelligence</span>
              </button>

              <button
                id="nav-tab-company"
                onClick={() => handleTabClick('company')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'company'
                    ? 'border-slate-900 text-slate-900 bg-slate-50/80'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>Company Intelligence</span>
              </button>
            </nav>

            {/* Desktop Right Action Button & Mobile Actions */}
            <div className="flex items-center space-x-2">
              <button
                id="quick-search-btn"
                onClick={onOpenQuickSearch}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-sm transition-colors cursor-pointer min-h-[40px] sm:min-h-0"
              >
                <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-600" />
                <span className="hidden sm:inline">빠른 분석 실행</span>
                <span className="inline sm:hidden font-semibold">검색</span>
              </button>

              {/* Mobile Hamburger Toggle Button */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-sm border border-slate-200 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="메뉴 열기"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Hamburger Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
              Navigation Menu
            </div>
            
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('home')}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Home (대시보드)</span>
              </button>

              <button
                onClick={() => handleTabClick('trend')}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'trend'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Trend Intelligence</span>
              </button>

              <button
                onClick={() => handleTabClick('company')}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'company'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Company Intelligence</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuickSearch();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-sm transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>빠른 AI 분석 시작</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl flex items-center justify-around h-16 px-2">
        <button
          id="mobile-bottom-nav-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-sm transition-colors cursor-pointer ${
            activeTab === 'home'
              ? 'text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${activeTab === 'home' ? 'text-slate-900' : 'text-slate-500'}`} />
          <span className="text-[11px] mt-0.5">Home</span>
        </button>

        <button
          id="mobile-bottom-nav-trend"
          onClick={() => setActiveTab('trend')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-sm transition-colors cursor-pointer ${
            activeTab === 'trend'
              ? 'text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className={`w-5 h-5 ${activeTab === 'trend' ? 'text-slate-900' : 'text-slate-500'}`} />
          <span className="text-[11px] mt-0.5">Trend</span>
        </button>

        <button
          id="mobile-bottom-nav-company"
          onClick={() => setActiveTab('company')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-sm transition-colors cursor-pointer ${
            activeTab === 'company'
              ? 'text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className={`w-5 h-5 ${activeTab === 'company' ? 'text-slate-900' : 'text-slate-500'}`} />
          <span className="text-[11px] mt-0.5">Company</span>
        </button>
      </div>
    </>
  );
};

