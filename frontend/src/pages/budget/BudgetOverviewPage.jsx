import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BadgeCheck, PiggyBank, Sparkles, TrendingDown, TrendingUp, Wallet, HandCoins, Building2, Landmark } from "lucide-react";
import { monthTitle } from "../../lib/budget";
import { useBudgetOutlet } from "./useBudgetOutlet";
import { useAuth } from "../../context/useAuth";
import MarketRates from "../../components/MarketRates";

const BudgetOverviewPage = () => {
  const { stats, calendarSummary, transactions, money, currentMonth } = useBudgetOutlet();
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
    <div className="space-y-6 pb-20 sm:pb-0">
      {/* Premium Hero Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/10 blur-[100px] -ml-32 -mb-32" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/20">
                Live Status
              </span>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" style={{animationDelay: `${i*200}ms`}} />)}
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Hey {user?.name?.split(' ')[0] || 'Genie'}! 👋
            </h1>
            <p className="text-slate-400 text-sm font-medium">Your campus expenses are looking <span className="text-emerald-400 font-bold">balanced</span> today.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-4 border border-white/10 flex items-center gap-4 w-full md:w-auto">
             <div className="p-3 rounded-2xl bg-fuchsia-500 shadow-lg shadow-fuchsia-500/20">
                <Sparkles size={24} className="text-white" />
             </div>
             <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Safe Daily Spend</p>
                <p className="text-2xl font-black text-white">{money(dailySafeSpend)}</p>
             </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Incoming", value: money(stats.totalIncome), icon: TrendingUp, color: "bg-emerald-500", shadow: "shadow-emerald-500/20" },
          { label: "Expenses", value: money(stats.totalExpenses), icon: TrendingDown, color: "bg-red-500", shadow: "shadow-red-500/20" },
          { label: "Net Assets", value: money(stats.netBalance), icon: Wallet, color: "bg-cyan-500", shadow: "shadow-cyan-500/20" },
          { label: "Remaining", value: money(budgetLeft), icon: PiggyBank, color: "bg-indigo-500", shadow: "shadow-indigo-500/20" },
        ].map((card) => (
          <article 
            key={card.label} 
            className="group rounded-3xl border border-white/5 bg-slate-900/60 p-4 sm:p-5 transition-all hover:translate-y-[-4px] hover:bg-slate-900/80 active:scale-95 shadow-xl shadow-black/20"
          >
            <div className={`w-10 h-10 rounded-2xl ${card.color} flex items-center justify-center text-white mb-4 shadow-lg ${card.shadow}`}>
              <card.icon size={18} />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">{card.label}</p>
            <p className="text-xl sm:text-2xl font-black text-white truncate">{card.value}</p>
          </article>
        ))}
      </section>

      {/* Account System Breakdown - More visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Digital / UPI", value: stats.userNetBalance, icon: Building2, gradient: "from-cyan-500 to-blue-600" },
          { label: "Physical Cash", value: stats.userCashBalance, icon: HandCoins, gradient: "from-amber-500 to-orange-600" },
          { label: "Savings Vault", value: stats.userSavingsBalance, icon: Landmark, gradient: "from-indigo-500 to-violet-600" },
        ].map((item) => (
          <div key={item.label} className="relative group overflow-hidden rounded-[2rem] border border-white/5 bg-slate-950 p-5 shadow-xl">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.gradient} opacity-5 blur-2xl transition-opacity group-hover:opacity-10`} />
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg`}>
                <item.icon size={22} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">{item.label}</p>
                <p className="text-2xl font-black text-white">{money(item.value)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="font-semibold text-white">Cashflow Trend ({monthTitle(currentMonth)})</h2>
          <p className="text-xs text-slate-400">Savings rate: {Number(stats.savingsRate || 0).toFixed(1)}%</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeFillOverview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseFillOverview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                }}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeFillOverview)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expenseFillOverview)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-300" /> Hackathon Demo Panel
        </h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-slate-300 font-medium flex items-center gap-2">
              <BadgeCheck size={14} className="text-emerald-300" /> Sample Transactions Loaded
            </p>
            <p className="text-2xl font-black text-white mt-1">{sampleCount}</p>
            <p className="text-xs text-slate-400 mt-1">Rows marked as sample are visible in Transactions.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-slate-300 font-medium">Monthly Budget</p>
            <p className="text-xl font-bold text-white mt-1">{money(stats.monthlyBudget || 0)}</p>
            <p className="text-xs text-slate-400 mt-1">Usage: {Number(stats.budgetUsagePercent || 0).toFixed(1)}%</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-slate-300 font-medium">Transaction Count</p>
            <p className="text-xl font-bold text-white mt-1">{transactions.length}</p>
            <p className="text-xs text-slate-400 mt-1">Income + expense entries for this month.</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 border border-indigo-500/20 rounded-2xl p-4 flex items-center gap-4">
         <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
           <BadgeCheck size={20} />
         </div>
         <div className="flex-1">
           <p className="text-white text-sm font-bold">Campus Perk Alert!</p>
           <p className="text-slate-400 text-xs mt-0.5">Your University ID gets you 50% off on "Money Buddy Pro" and local cafes. Check your student email!</p>
         </div>
         <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors">Claim</button>
      </section>

      <MarketRates />
    </div>
  );
};

export default BudgetOverviewPage;
