import React, { useState } from 'react';
import { ActiveTab, TrendReport, CompanyReport, TrendFilter } from './types';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { TrendIntelligenceView } from './components/TrendIntelligenceView';
import { CompanyIntelligenceView } from './components/CompanyIntelligenceView';
import { QuickSearchModal } from './components/QuickSearchModal';
import { SAMPLE_TREND_REPORTS, SAMPLE_COMPANY_REPORTS } from './data/sampleData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  
  // Pre-load default benchmark reports for instant exploration
  const [trendReport, setTrendReport] = useState<TrendReport | null>(
    SAMPLE_TREND_REPORTS['2026 웰니스 트렌드'] || null
  );
  const [companyReport, setCompanyReport] = useState<CompanyReport | null>(
    SAMPLE_COMPANY_REPORTS['Garmin'] || null
  );

  const [loadingTrend, setLoadingTrend] = useState<boolean>(false);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState<boolean>(false);

  // Search Trend
  const handleSearchTrend = async (query: string, filters?: Partial<TrendFilter>) => {
    setActiveTab('trend');
    setLoadingTrend(true);

    try {
      const res = await fetch('/api/analyze-trend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          period: filters?.period || '최근 1년',
          region: filters?.region || '한국',
          category: filters?.category || 'Wellness',
        }),
      });

      const data = await res.json();
      if (data.success && data.report) {
        setTrendReport(data.report);
      } else if (SAMPLE_TREND_REPORTS[query]) {
        setTrendReport(SAMPLE_TREND_REPORTS[query]);
      }
    } catch (err) {
      console.error('Error fetching trend report:', err);
      if (SAMPLE_TREND_REPORTS[query]) {
        setTrendReport(SAMPLE_TREND_REPORTS[query]);
      }
    } finally {
      setLoadingTrend(false);
    }
  };

  // Search Company
  const handleSearchCompany = async (companyName: string) => {
    setActiveTab('company');
    setLoadingCompany(true);

    try {
      const res = await fetch('/api/analyze-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });

      const data = await res.json();
      if (data.success && data.report) {
        setCompanyReport(data.report);
      } else {
        const cachedKey = Object.keys(SAMPLE_COMPANY_REPORTS).find(
          (k) => k.toLowerCase() === companyName.toLowerCase()
        );
        if (cachedKey) {
          setCompanyReport(SAMPLE_COMPANY_REPORTS[cachedKey]);
        }
      }
    } catch (err) {
      console.error('Error fetching company report:', err);
      const cachedKey = Object.keys(SAMPLE_COMPANY_REPORTS).find(
        (k) => k.toLowerCase() === companyName.toLowerCase()
      );
      if (cachedKey) {
        setCompanyReport(SAMPLE_COMPANY_REPORTS[cachedKey]);
      }
    } finally {
      setLoadingCompany(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
      
      {/* Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickSearch={() => setQuickSearchOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <HomeDashboard
            onNavigateTab={setActiveTab}
            onSearchTrend={handleSearchTrend}
            onSearchCompany={handleSearchCompany}
          />
        )}

        {activeTab === 'trend' && (
          <TrendIntelligenceView
            report={trendReport}
            loading={loadingTrend}
            onSearch={handleSearchTrend}
            onAnalyzeCompany={handleSearchCompany}
          />
        )}

        {activeTab === 'company' && (
          <CompanyIntelligenceView
            report={companyReport}
            loading={loadingCompany}
            onSearchCompany={handleSearchCompany}
            onSearchTrend={handleSearchTrend}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
          <div>
            © 2026 Marketing Intelligence Platform. Enterprise Edition.
          </div>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Trend Intelligence</span>
            <span>•</span>
            <span>Company Intelligence</span>
            <span>•</span>
            <span>Gemini AI Driven</span>
          </div>
        </div>
      </footer>

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        onSearchTrend={handleSearchTrend}
        onSearchCompany={handleSearchCompany}
      />

    </div>
  );
}
