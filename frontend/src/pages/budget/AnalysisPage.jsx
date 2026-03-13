import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Brain, CheckCircle2, Loader2, Sparkles, PieChartIcon } from "lucide-react";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import api from "../../lib/api";
import { useBudgetOutlet } from "./useBudgetOutlet";

const COLORS = ['#22d3ee', '#818cf8', '#f472b6', '#fbbf24', '#34d399', '#f87171', '#c084fc', '#fb923c'];

const AnalysisPage = () => {
  const { currentMonth, money, notify } = useBudgetOutlet();
  const [loading, setLoading] = useState(true);
  const [brief, setBrief] = useState(null);
  const [categorySummary, setCategorySummary] = useState([]);

  const monthParam = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }, [currentMonth]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const [briefRes, summaryRes] = await Promise.all([
          api.get("/api/transactions/ai-brief", { params: { month: monthParam, mode: "actual" } }),
          api.get("/api/analysis/summary", { params: { month: monthParam, mode: "actual" } })
        ]);
        setBrief(briefRes.data);
        setCategorySummary(summaryRes.data || []);
      } catch (error) {
        notify("error", error.response?.data?.message || "Could not load AI analysis.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [monthParam, notify]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-300 flex items-center gap-2">
        <Loader2 size={18} className="animate-spin" /> Loading AI analysis...
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-300">
        AI analysis is currently unavailable.
      </div>
    );
  }

  const scoreTiles = [
    { label: "Overall", value: brief.scorecard?.overall || 0 },
    { label: "Spending Discipline", value: brief.scorecard?.spendingDiscipline || 0 },
    { label: "Savings Stability", value: brief.scorecard?.savingsStability || 0 },
    { label: "Goal Momentum", value: brief.scorecard?.goalMomentum || 0 },
  ];

  return (
    <div className="space-y-6 pb-20 animate-neo-slide">
      <section className="rounded-[3rem] neo-glass neo-shadow p-8 border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[100px] -mr-48 -mt-48" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
               <Sparkles size={20} className="text-white fill-current" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">AI Budget Intelligence</h2>
          </div>
          
          <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 mb-8">
            <p className="text-indigo-100 text-lg font-medium leading-relaxed italic">&quot;{brief.coach?.summary || "Analyzing your patterns..."}&quot;</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {scoreTiles.map((tile) => (
              <article key={tile.label} className="rounded-3xl bg-white/5 p-6 flex flex-col items-center justify-center border border-white/5 group hover:bg-white/10 transition-colors">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest text-center truncate w-full mb-2">{tile.label}</p>
                <p className="text-4xl font-black text-white tracking-tighter">{Number(tile.value).toFixed(0)}</p>
                <div className="mt-4 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 group-hover:scale-x-110 transition-transform origin-left" style={{ width: `${Math.max(5, Math.min(100, tile.value))}%` }} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <article className="rounded-[2.5rem] neo-glass neo-shadow p-8 border-none relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[60px] -mr-24 -mb-24" />
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-cyan-400 rounded-full" /> Top Spend Categories
          </h3>
          <div className="h-72 w-full relative">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              <BarChart data={brief.topCategories || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="category" 
                  stroke="#475569" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{fontSize: 10, fontWeight: 800}}
                />
                <YAxis 
                  stroke="#475569" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{fontSize: 10, fontWeight: 800}}
                />
                <RechartsTooltip
                  formatter={(value) => money(value)}
                  contentStyle={{ 
                    backgroundColor: "rgba(15, 23, 42, 0.9)", 
                    border: "1px solid rgba(255,255,255,0.05)", 
                    borderRadius: "15px",
                    backdropFilter: "blur(20px)"
                  }}
                  itemStyle={{ fontWeight: 900, color: '#fff', fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Bar dataKey="amount" fill="#818cf8" radius={[12, 12, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        
        <article className="rounded-[2.5rem] neo-glass neo-shadow p-8 border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 blur-[60px] -mr-24 -mt-24" />
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-purple-400 rounded-full" /> Category Breakdown
          </h3>
          <div className="h-64 mt-3 w-full relative">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              <PieChart>
                <Pie
                  data={categorySummary}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="total"
                  nameKey="category"
                  stroke="none"
                >
                  {categorySummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value) => money(value)}
                  contentStyle={{ 
                    backgroundColor: "rgba(15, 23, 42, 0.9)", 
                    border: "1px solid rgba(255,255,255,0.05)", 
                    borderRadius: "15px",
                    backdropFilter: "blur(20px)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {categorySummary.map((entry, index) => (
              <div key={entry.category} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 bg-white/5 py-1.5 px-3 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{entry.category}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <article className="rounded-[2.5rem] neo-glass p-8 border-none bg-emerald-500/5">
          <h3 className="text-lg font-black text-emerald-400 uppercase tracking-tight mb-6 flex items-center gap-3">
            <CheckCircle2 size={24} /> Financial Wins
          </h3>
          <ul className="space-y-4">
            {(brief.coach?.wins || []).map((line, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-200 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[2.5rem] neo-glass p-8 border-none bg-red-500/5">
          <h3 className="text-lg font-black text-red-400 uppercase tracking-tight mb-6 flex items-center gap-3">
            <AlertTriangle size={24} /> Risk Factors
          </h3>
          <ul className="space-y-4">
            {(brief.coach?.risks || []).map((line, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-200 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <section className="rounded-[3rem] neo-glass neo-shadow p-10 border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] -mr-64 -mt-64" />
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/30">
               <Brain size={24} className="text-white fill-current" />
            </div>
            7-Day Action Protocol
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(brief.coach?.actionPlan || []).map((step, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mb-3">Phase 0{i+1}</p>
                <p className="text-sm text-slate-200 font-bold leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          {brief.coach?.challenge && (
            <div className="mt-10 p-8 rounded-[2rem] bg-gradient-to-br from-violet-600 to-indigo-700 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-inner">
                   <Sparkles size={32} />
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <p className="text-[10px] font-black text-violet-200 uppercase tracking-[0.4em] mb-1">Weekly Challenge</p>
                    <p className="text-xl font-black text-white">{brief.coach.challenge}</p>
                 </div>
               </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AnalysisPage;
