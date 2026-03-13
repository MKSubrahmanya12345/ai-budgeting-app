import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BadgeCheck, PiggyBank, Sparkles, TrendingDown, TrendingUp, Wallet, HandCoins, Building2, Landmark, Zap, Rocket, Trash2, Calculator } from "lucide-react";
import { monthTitle } from "../../lib/budget";
import { useBudgetOutlet } from "./useBudgetOutlet";
import { useAuth } from "../../context/useAuth";
import MarketRates from "../../components/MarketRates";

import api from "../../lib/api";

const BudgetOverviewPage = () => {
  const { stats, calendarSummary, transactions, money, currentMonth, refreshData, notify, setBusyAction, busyAction, entryMode } = useBudgetOutlet();
  const { user } = useAuth();

  const chartData = useMemo(() => {
    return [...calendarSummary]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((entry) => ({
        day: entry.date.slice(-2),
        income: entry.income,
        expense: entry.expense,
      }));
  }, [calendarSummary]);

  const sampleCount = transactions.filter((txn) => txn.isSample).length;
  const budgetLeft = Math.max((stats.monthlyBudget || 0) - (stats.totalExpenses || 0), 0);
  
  const dailySafeSpend = useMemo(() => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(lastDayOfMonth - today.getDate() + 1, 1);
    return budgetLeft / daysRemaining;
  }, [budgetLeft]);
  return (
    <div className="space-y-8 pb-32 lg:pb-12 animate-neo-slide">
      {/* Intelligence Simulation Node Control */}
      {(transactions.length === 0 || entryMode === 'demo') && (
        <section className="rounded-[3rem] neo-glass neo-shadow p-10 flex flex-col lg:flex-row items-center justify-between gap-10 animate-neo-glow relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/5 blur-[80px] -ml-32 -mt-32" />
          <div className="flex items-center gap-8 relative z-10">
             <div className="relative group">
               <div className="absolute inset-0 bg-indigo-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="relative p-5 rounded-[2rem] bg-indigo-600 shadow-2xl shadow-indigo-600/40 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                 <Zap size={32} className="text-white fill-current" />
               </div>
             </div>
             <div>
               <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">Intelligence Simulation</h3>
               <p className="text-slate-400 text-base font-medium leading-relaxed max-w-md">
                 Initialize your financial ecosystem with optimized student data models or purge for a clean state. Both <span className="text-emerald-400">Income</span> and <span className="text-red-400">Expenses</span> included.
               </p>
             </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10">
            <button 
              onClick={async () => {
                try {
                  setBusyAction(true);
                  await api.post("/api/transactions/seed", { entryMode });
                  await refreshData();
                  notify("success", "Simulation data established.");
                } catch {
                  notify("error", "Failed to initialize simulation.");
                } finally {
                  setBusyAction(false);
                }
              }}
              disabled={busyAction}
              className="w-full sm:w-auto px-10 py-5 rounded-[1.8rem] bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.25em] transition-all active:scale-95 shadow-2xl shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Rocket size={18} /> Establish Demo Node
            </button>
            <button 
               onClick={async () => {
                if (!window.confirm("Purge Node state? All simulation data in this mode will be destroyed.")) return;
                try {
                  setBusyAction(true);
                  await api.delete("/api/transactions/clear", { params: { mode: entryMode } });
                  await refreshData();
                  notify("success", "Node state purged.");
                } catch {
                  notify("error", "Failed to clear state.");
                } finally {
                  setBusyAction(false);
                }
              }}
              disabled={busyAction}
              className="w-full sm:w-auto px-10 py-5 rounded-[1.8rem] bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 text-[10px] font-black uppercase tracking-[0.25em] transition-all border border-white/5 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Trash2 size={18} /> Purge Node
            </button>
          </div>
        </section>
      )}

      {/* Premium Hero Header */}
      <div className="relative overflow-hidden rounded-[3rem] neo-glass neo-shadow p-8 sm:p-12 border-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/10 blur-[120px] -ml-48 -mb-48" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Pulse
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-tight">
              Hey {user?.name?.split(' ')[0] || 'Genie'}! <span className="text-indigo-400">👋</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-md">Your campus accounts are looking <span className="text-emerald-400 font-black border-b-2 border-emerald-500/30">solid</span> today. No major leaks detected.</p>
          </div>

          <div className="neo-glass bg-white/5 p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-6 w-full md:w-auto shadow-2xl">
             <div className="p-4 rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-600/30">
                <Sparkles size={32} className="text-white fill-current" />
             </div>
             <div>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Daily Freedom</p>
                <p className="text-3xl font-black text-white">{money(dailySafeSpend)}</p>
                <p className="text-[10px] text-emerald-400 font-bold mt-1">Safe to spend today</p>
             </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {[
          { label: "Monthly Inflow", value: money(stats.totalIncome), icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Monthly Outflow", value: money(stats.totalExpenses), icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Digital Wallet", value: money(stats.userNetBalance), icon: Building2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { label: "Hard Cash", value: money(stats.userCashBalance), icon: HandCoins, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Monthly Budget", value: money(stats.monthlyBudget), icon: Calculator, color: "text-indigo-400", bg: "bg-indigo-500/10" },
        ].map((card) => (
          <article 
            key={card.label} 
            className="group rounded-[2.5rem] neo-glass neo-shadow p-6 sm:p-8 transition-all hover:translate-y-[-8px] hover:bg-white/5 active:scale-95 border-none"
          >
            <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
              <card.icon size={24} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">{card.label}</p>
            <p className="text-2xl sm:text-3xl font-black text-white truncate">{card.value}</p>
          </article>
        ))}
      </section>

      {/* Additional Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Savings Vault", value: stats.userSavingsBalance, icon: Landmark, color: "indigo", bg: "bg-indigo-500/10" },
          { label: "Daily Safe Spend", value: dailySafeSpend, icon: Sparkles, color: "emerald", bg: "bg-emerald-500/10" },
        ].map((item) => (
          <div key={item.label} className="relative group overflow-hidden rounded-[2.5rem] neo-glass neo-shadow p-6 border-none">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-500/10 blur-[80px] -mr-16 -mt-16`} />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white border border-white/5 group-hover:bg-white/10 transition-colors">
                <item.icon size={24} className={`text-${item.color}-400`} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">{item.label}</p>
                <p className="text-2xl font-black text-white">{money(item.value)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-[3rem] neo-glass neo-shadow p-8 border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[100px] -mr-48 -mt-48" />
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 relative z-10">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Financial Flow</h2>
            <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">{monthTitle(currentMonth)} Intelligence</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Efficiency Rate</p>
             <p className="text-lg font-black text-emerald-400">{Number(stats.savingsRate || 0).toFixed(1)}%</p>
          </div>
        </div>
        <div className="h-80 w-full relative">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeFillOverview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseFillOverview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#475569" 
                axisLine={false} 
                tickLine={false}
                tick={{fontSize: 10, fontWeight: 800}}
                dy={10}
              />
              <YAxis 
                stroke="#475569" 
                axisLine={false} 
                tickLine={false}
                tick={{fontSize: 10, fontWeight: 800}}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "20px",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                }}
                itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeFillOverview)" strokeWidth={4} dot={false} activeDot={{r: 6, strokeWidth: 0}} />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expenseFillOverview)" strokeWidth={4} dot={false} activeDot={{r: 6, strokeWidth: 0}} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />
         <div className="w-20 h-20 rounded-[2rem] bg-white/20 backdrop-blur-xl flex items-center justify-center text-white shadow-inner flex-shrink-0">
           <Landmark size={40} className="fill-current" />
         </div>
         <div className="flex-1 text-center md:text-left">
           <h3 className="text-white text-2xl font-black tracking-tight">Campus Elite Perks</h3>
           <p className="text-indigo-100 text-sm mt-2 font-medium">Your University ID gets you <span className="font-black underline">50% off</span> at local cafes and subscription services. We've mapped the best deals for you.</p>
         </div>
         <button className="px-10 py-4 bg-white text-indigo-600 rounded-[1.5rem] text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-xl shadow-black/10">Explore Deals</button>
      </section>

      <MarketRates />
    </div>
  );
};

export default BudgetOverviewPage;
