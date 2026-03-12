import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CreditCard, 
  Loader2, 
  RefreshCcw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  ShieldCheck, 
  BarChart3,
  Flame,
  PieChart as PieIcon,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../../lib/api';
import { useBudgetOutlet } from "../budget/useBudgetOutlet";

const TrendAnalysisPage = () => {
  const { money, entryMode } = useBudgetOutlet();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    monthlyReport: null,
    prediction: null,
    leaks: [],
    subscriptions: []
  });

  useEffect(() => {
    const fetchAllTrends = async () => {
      try {
        setLoading(true);
        const [report, pred, leaks, subs] = await Promise.all([
          api.get(`/api/ai/report/monthly?mode=\${entryMode}`),
          api.get(`/api/ai/prediction/end-month?mode=\${entryMode}`),
          api.get(`/api/ai/insights/leaks?mode=\${entryMode}`),
          api.get(`/api/ai/insights/subscriptions?mode=\${entryMode}`)
        ]);

        setData({
          monthlyReport: report.data,
          prediction: pred.data,
          leaks: leaks.data.leaks || [],
          subscriptions: subs.data.subscriptions || []
        });
      } catch (err) {
        console.error("Failed to load trend data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTrends();
  }, [entryMode]);

  const COLORS = ['#22d3ee', '#818cf8', '#f472b6', '#fbbf24', '#34d399'];

  const categoryData = useMemo(() => {
    if (!data.monthlyReport?.metrics?.categoryBreakdown) return [];
    return Object.entries(data.monthlyReport.metrics.categoryBreakdown).map(([name, value]) => ({
      name,
      value
    })).sort((a, b) => b.value - a.value);
  }, [data.monthlyReport]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <Loader2 size={40} className="text-cyan-500 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Running AI Trend Analysis...</p>
      </div>
    );
  }

  const riskColor = data.prediction?.riskLevel === 'high' ? 'text-red-400' : data.prediction?.riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400';
  const riskBg = data.prediction?.riskLevel === 'high' ? 'bg-red-500/10 border-red-500/20' : data.prediction?.riskLevel === 'medium' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20';

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap size={14} className="fill-cyan-400" /> AI Spending Insights
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Trend Analysis</h1>
          <p className="text-slate-400 leading-relaxed max-w-xl">
            {data.monthlyReport?.aiInsights?.summary || "Your spending patterns are being analyzed to help you save more and spend smarter."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto relative z-10">
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Monthly Peak</p>
            <p className="text-xl font-black text-white">{money(data.monthlyReport?.metrics?.totalExpenses || 0)}</p>
          </div>
          <div className={`p-4 rounded-2xl border ${riskBg}`}>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Risk Level</p>
            <p className={`text-xl font-black capitalize \${riskColor}`}>{data.prediction?.riskLevel || "Low"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bad Habits / Spending Leaks */}
        <div className="lg:col-span-2 bg-slate-900/50 rounded-3xl border border-slate-800 flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-orange-500" />
              <h3 className="text-white font-bold">Spending Leaks & Habits</h3>
            </div>
            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 font-bold uppercase">Leak Protection</span>
          </div>
          
          <div className="flex-grow p-6">
             {data.leaks.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Clear of Leaks!</h4>
                    <p className="text-slate-400 text-sm mt-1">No repetitive minor spending habits detected this month.</p>
                  </div>
               </div>
             ) : (
               <div className="space-y-4">
                  {data.leaks.map((leak, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center hover:bg-slate-900/50 transition-colors group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800 group-hover:border-orange-500/30 transition-colors">
                             <TrendingUp size={18} />
                          </div>
                          <div>
                             <p className="text-white font-bold capitalize">{leak.category}</p>
                             <p className="text-slate-500 text-xs">{leak.frequency} times frequency detected</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-orange-400 font-bold">-{money(leak.totalSpent)}</p>
                          <p className="text-[10px] text-slate-500 font-medium">Monthly Leak</p>
                       </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Zap size={20} />
                     </div>
                     <p className="text-sm text-indigo-200 leading-snug">
                       AI Insight: <b>{data.leaks.length} habits</b> are currently draining your balance. Focus on small reductions in these categories.
                     </p>
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon size={20} className="text-purple-400" />
            <h3 className="text-white font-bold">Expense Mix</h3>
          </div>
          
          <div className="flex-grow flex items-center justify-center min-h-[250px] relative">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <p className="text-slate-500 text-[10px] font-bold uppercase">Top Spend</p>
               <p className="text-lg font-black text-white">{categoryData[0]?.name || '---'}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {categoryData.slice(0, 3).map((cat, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-400 truncate max-w-[120px]">{cat.name}</span>
                </div>
                <span className="text-white font-bold">{money(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction Card */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <BarChart3 size={20} className="text-indigo-400" />
            <h3 className="text-white font-bold">End of Month Outlook</h3>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Predicted Surplus</p>
                <p className={`text-4xl font-black \${data.prediction?.predictedEndBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                   {money(data.prediction?.predictedEndBalance || 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Burn Rate</p>
                <p className="text-xl font-bold text-white">{money(data.prediction?.avgDailySpend || 0)}<span className="text-slate-500 text-xs">/day</span></p>
              </div>
            </div>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
               <div 
                 className={`h-full \${data.prediction?.predictedEndBalance >= 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}
                 style={{ width: `\${Math.min(100, Math.max(0, (data.monthlyReport?.metrics?.totalIncome - data.monthlyReport?.metrics?.totalExpenses) / (data.monthlyReport?.metrics?.totalIncome || 1) * 100))}%` }}
               />
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
               <p className="text-xs text-slate-400 flex items-center gap-2">
                 <RefreshCcw size={14} className="text-cyan-400" /> 
                 {data.prediction?.daysRemaining} days remaining in current cycle
               </p>
               <div className="space-y-2">
                  {data.monthlyReport?.aiInsights?.insights?.map((ins, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                       <span className="text-cyan-400 mt-0.5">•</span> {ins}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Active Subscriptions / Phantom Subs Reimagined */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6 flex flex-col h-full">
           <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
               <CreditCard size={20} className="text-cyan-400" />
               <h3 className="text-white font-bold">Auto-Pay Radar</h3>
             </div>
             <p className="text-slate-500 text-xs font-medium">{data.subscriptions.length} detected</p>
           </div>

           <div className="space-y-3 flex-grow overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {data.subscriptions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                   <CreditCard size={40} className="text-slate-600 mb-2" />
                   <p className="text-slate-400 text-sm italic">No recurring payments detected</p>
                </div>
              ) : (
                data.subscriptions.map((sub, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/30 transition-all">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-cyan-400 border border-slate-800">
                           <ShieldCheck size={18} />
                        </div>
                        <div>
                           <p className="text-white text-sm font-bold capitalize">{sub.merchant}</p>
                           <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Recurring AI Confirmed</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-white font-black text-sm">{money(sub.avgAmount)}</p>
                        <p className="text-[10px] text-slate-500 font-bold">/ MONTH</p>
                     </div>
                  </div>
                ))
              )}
           </div>

           <button className="w-full mt-6 py-3 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 text-sm font-black hover:bg-cyan-600 hover:text-white transition-all flex items-center justify-center gap-2">
             Verify Security Block <ChevronRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysisPage;
