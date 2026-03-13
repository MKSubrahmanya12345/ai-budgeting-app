import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
//$$$$$$
import {
  LayoutDashboard,
  PieChart,
  Sparkles,
  Zap,
  Bot,
  Rocket,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  TrendingUp,
  ReceiptText,
  CalendarDays,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  RefreshCcw,
  Loader2,
  Users,
  HandCoins,
  ShieldAlert,
  X,
  Menu,
} from "lucide-react";
import api from "../../lib/api";
import { formatMonthKey, monthTitle } from "../../lib/budget";
import { useAuth } from "../../context/useAuth";
import FloatingChatbot from "../../components/FloatingChatbot";
import BottomNav from "../../components/BottomNav";

const navItems = [
  { to: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/campus-split", label: "Campus Splitter", icon: Users },
  { to: "/dashboard/smart-spend", label: "Smart Spend", icon: Zap },
  { to: "/dashboard/analysis", label: "Analysis", icon: PieChart }, //$$$$$$
  { to: "/dashboard/affordability", label: "Affordability AI", icon: Sparkles },
  { to: "/dashboard/simulator", label: "Future Simulator", icon: Rocket },
  { to: "/dashboard/trends", label: "Trend Analysis", icon: TrendingUp },
  { to: "/dashboard/moneybuddy", label: "Money Buddy", icon: Bot },
  { to: "/dashboard/courses", label: "Money Courses", icon: BookOpen },
  { to: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/dashboard/transactions", label: "Transactions", icon: ReceiptText },
  { to: "/dashboard/system-logic", label: "System Logic", icon: ShieldAlert },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const BudgetLayout = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [entryMode, setEntryMode] = useState("actual");
  const [transactions, setTransactions] = useState([]);
  const [calendarSummary, setCalendarSummary] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    monthlyBudget: 0,
    savingsRate: 0,
    budgetUsagePercent: 0,
  });

  const [budgetInput, setBudgetInput] = useState(String(user?.monthlyBudget || 5000));
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState(false);
  const [flash, setFlash] = useState({ type: "", text: "" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const monthKey = useMemo(() => formatMonthKey(currentMonth), [currentMonth]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: user?.currency || "INR",
        maximumFractionDigits: 0,
      }),
    [user?.currency],
  );

  const money = useCallback((value) => currencyFormatter.format(Number(value) || 0), [currencyFormatter]);

  const notify = useCallback((type, text) => {
    setFlash({ type, text });
    if (flashTimeoutRef.current) {
      window.clearTimeout(flashTimeoutRef.current);
    }
    flashTimeoutRef.current = window.setTimeout(() => {
      setFlash({ type: "", text: "" });
    }, 2600);
  }, []);

  useEffect(() => {
    setBudgetInput(String(user?.monthlyBudget || 5000));
  }, [user?.monthlyBudget]);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) {
        window.clearTimeout(flashTimeoutRef.current);
      }
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = { month: monthKey, mode: entryMode };
      const [transactionsResponse, statsResponse, calendarResponse] = await Promise.all([
        api.get("/api/transactions", { params }),
        api.get("/api/transactions/stats", { params }),
        api.get("/api/transactions/calendar", { params }),
      ]);

      setTransactions(transactionsResponse.data || []);
      setStats(statsResponse.data || {});
      setCalendarSummary(calendarResponse.data?.days || []);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      notify("error", "Failed to load budget data.");
    } finally {
      setLoading(false);
    }
  }, [monthKey, navigate, notify, entryMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSeedSample = async () => {
    try {
      setBusyAction(true);
      await api.post("/api/transactions/seed", { entryMode });
      await fetchData();
      notify("success", "Sample transactions added.");
    } catch {
      notify("error", "Could not seed sample transactions.");
    } finally {
      setBusyAction(false);
    }
  };

  const handleUpdateBudget = async () => {
    const parsedBudget = Number(budgetInput);
    if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      notify("error", "Budget must be greater than zero.");
      return;
    }

    try {
      setBusyAction(true);
      const { data } = await api.patch("/api/auth/budget", { monthlyBudget: parsedBudget });
      setUser(data.user);
      await fetchData();
      notify("success", "Budget updated.");
    } catch {
      notify("error", "Could not update budget.");
    } finally {
      setBusyAction(false);
    }
  };

  const shiftMonth = (offset) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const outletContext = {
    currentMonth,
    setCurrentMonth,
    monthKey,
    stats,
    transactions,
    calendarSummary,
    refreshData: fetchData,
    money,
    notify,
    busyAction,
    setBusyAction,
    entryMode,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="w-full px-4 py-5 lg:px-6 xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-5 xl:gap-6">
          {/* Sidebar - Desktop (Sticky) / Mobile (Drawer) */}
          <>
            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            <aside className={`
              fixed top-0 left-0 z-50 h-full w-[300px] neo-glass neo-shadow p-6 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] lg:static lg:z-0 lg:w-auto lg:h-[calc(100vh-40px)] lg:rounded-[2.5rem] lg:sticky lg:top-5 lg:translate-x-0
              ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:opacity-100'}
            `}>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { navigate("/dashboard/overview"); setIsMobileMenuOpen(false); }}>
                    <div className="p-3 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/30 group-hover:rotate-12 transition-transform">
                      <Zap size={22} className="text-white fill-current" />
                    </div>
                    <div>
                      <h1 className="text-xl font-black text-white tracking-widest uppercase leading-none">Genie</h1>
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-1">Pocket AI</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white lg:hidden"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                            : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                        }`
                      }
                    >
                      <item.icon size={18} className="transition-transform group-hover:scale-110" /> 
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                  <div 
                    className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all active:scale-95" 
                    onClick={() => setEntryMode(entryMode === "actual" ? "demo" : "actual")}
                  >
                    <div>
                       <p className="text-xs font-black text-white uppercase tracking-wider">Data Mode</p>
                       <p className="text-[10px] text-slate-500 font-bold">{entryMode === 'actual' ? 'LIVE' : 'DEMO'}</p>
                    </div>
                    <div className={`${entryMode === 'demo' ? 'text-fuchsia-400' : 'text-indigo-400'}`}>
                       {entryMode === 'demo' ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-2xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 py-3.5 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>

                  <div className="mt-4 pt-6 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-3 ml-1">Daily Limit</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={budgetInput}
                      onChange={(event) => setBudgetInput(event.target.value)}
                      className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-2 px-4 text-sm font-bold text-white focus:border-indigo-500 transition-colors outline-none"
                    />
                    <button
                      onClick={handleUpdateBudget}
                      disabled={busyAction}
                      className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-black text-white transition-all active:scale-95 disabled:opacity-50"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </>

          <main className="space-y-6 min-w-0 pb-32 lg:pb-0">
            {/* Superior Mobile Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 px-4 py-3 lg:hidden flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 active:scale-90 transition-all"
                >
                  <Menu size={20} />
                </button>
                <div>
                   <h1 className="text-sm font-black text-white leading-none">Pocket Genie</h1>
                   <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">{monthTitle(currentMonth)}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-white/5">
                <button
                  onClick={() => shiftMonth(-1)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="w-[1px] h-4 bg-white/5 mx-1" />
                <button
                  onClick={() => shiftMonth(1)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </header>

            {/* Content Spacer for Fixed Mobile Header */}
            <div className="h-10 lg:hidden" />

            {/* Desktop-only Header */}
            <header className="hidden lg:flex items-center justify-between gap-6 neo-glass neo-shadow p-6 rounded-[2.5rem] sticky top-5 z-30 transition-all duration-300">
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-2.5 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
                   <Zap size={20} className="text-white fill-current" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight leading-none">Dashboard</h1>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1.5">Intel & Insights</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-[2rem] border border-white/5">
                <button
                  onClick={() => shiftMonth(-1)}
                  className="p-3 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all active:scale-90"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-sm font-black text-white min-w-[180px] text-center shadow-lg shadow-indigo-600/20 uppercase tracking-widest">
                  {monthTitle(currentMonth)}
                </div>
                <button
                  onClick={() => shiftMonth(1)}
                  className="p-3 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all active:scale-90"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </header>

            {flash.text && (
              <p
                className={`rounded-xl border px-3 py-2 text-sm ${
                  flash.type === "error"
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {flash.text}
              </p>
            )}

            {loading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 flex items-center justify-center">
                <Loader2 className="animate-spin" size={30} />
              </div>
            ) : (
              <Outlet context={outletContext} />
            )}
          </main>
        </div>
      </div>
      
      {/* Global AI Floating Chatbot - Hidden on mobile if redundant with BottomNav */}
      <div className="hidden lg:block">
        <FloatingChatbot mode={entryMode} />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default BudgetLayout;
