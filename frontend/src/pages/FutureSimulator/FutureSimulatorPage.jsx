import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  Sparkles, 
  Clock, 
  Zap, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Rocket,
  ShieldCheck,
  Flame,
  Coffee,
  ShoppingBag,
  Gamepad
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { useBudgetOutlet } from '../budget/useBudgetOutlet';

const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { 
  style: 'currency', 
  currency: 'INR', 
  maximumFractionDigits: 0 
}).format(val);

const FutureSimulatorPage = () => {
  const { stats, money } = useBudgetOutlet();
  const [activeTab, setActiveTab] = useState('runway'); // runway, accelerator, legacy
  
  // States for Runway / Projection
  const [extraMonthlyIncome, setExtraMonthlyIncome] = useState(0);
  const [expenseCutPercent, setExpenseCutPercent] = useState(0);
  const [wealthGoal, setWealthGoal] = useState(1000000); // 10 Lakhs default

  // States for Accelerator
  const [targetPrice, setTargetPrice] = useState(50000);
  const [habitPrice, setHabitPrice] = useState(250);
  const [habitFrequency, setHabitFrequency] = useState(20); // per month

  const [leaks, setLeaks] = useState([]);

  useEffect(() => {
    const fetchLeaks = async () => {
      try {
        const { data } = await api.get('/api/ai/insights/leaks');
        setLeaks(data.leaks || []);
      } catch (e) {
        console.error("Failed to load leaks", e);
      }
    };
    fetchLeaks();
  }, []);

  // --- PROJECTOR / RUNWAY LOGIC ---
  const runwayData = useMemo(() => {
    const currentBalance = (stats.userNetBalance || 0) + (stats.userCashBalance || 0) + (stats.userSavingsBalance || 0);
    const monthlyBurn = (stats.totalExpenses || 0) * (1 - expenseCutPercent / 100);
    const monthlyIncome = (stats.totalIncome || 0) + Number(extraMonthlyIncome);
    
    const delta = monthlyIncome - monthlyBurn;
    
    if (delta > 0) {
      // Accumulating mode
      const needed = Math.max(0, wealthGoal - currentBalance);
      const months = needed / delta;
      const years = months / 12;
      return { 
        mode: 'growth', 
        months: Math.round(months), 
        years: Math.round(years * 10) / 10,
        totalMonths: months,
        delta
      };
    } else if (delta < 0) {
      // Burning mode
      const months = currentBalance / Math.abs(delta);
      const years = months / 12;
      return { 
        mode: 'burn', 
        months: Math.round(months % 12), 
        years: Math.floor(years),
        totalMonths: months,
        days: Math.round(months * 30.4),
        delta
      };
    } else {
      return { mode: 'stagnant', months: Infinity, years: Infinity, delta: 0 };
    }
  }, [stats, extraMonthlyIncome, expenseCutPercent, wealthGoal]);

  // --- ACCELERATOR LOGIC ---
  const acceleratorData = useMemo(() => {
    const monthlySavingsBase = (stats.totalIncome || 0) - (stats.totalExpenses || 0);
    const actualMonthlySavings = Math.max(0, monthlySavingsBase);
    
    const habitTotalMonthly = habitPrice * habitFrequency;
    const monthsWithoutCut = actualMonthlySavings > 0 ? targetPrice / actualMonthlySavings : Infinity;
    const monthsWithCut = (actualMonthlySavings + habitTotalMonthly) > 0 
      ? targetPrice / (actualMonthlySavings + habitTotalMonthly) 
      : Infinity;
    
    const daysSaved = (monthsWithoutCut - monthsWithCut) * 30.4;
    
    return {
      monthsWithoutCut: Math.round(monthsWithoutCut * 10) / 10,
      monthsWithCut: Math.round(monthsWithCut * 10) / 10,
      daysSaved: monthsWithoutCut === Infinity ? 0 : Math.round(daysSaved),
      monthlyHabitCost: habitTotalMonthly
    };
  }, [stats, targetPrice, habitPrice, habitFrequency]);

  return (
    <div className="space-y-8 pb-32 animate-neo-slide">
      {/* Simulation Engine Selector */}
      <nav className="flex flex-wrap gap-4 p-2 bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-white/5 w-fit mx-auto lg:mx-0">
        {[
          { id: 'runway', label: 'Survival Runway', icon: Flame },
          { id: 'accelerator', label: 'Dream Accelerator', icon: Rocket },
          { id: 'habit', label: 'Habit Compounder', icon: Zap },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 active:scale-95' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        {activeTab === 'runway' && (
          <motion.div 
            key="runway"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Runway Main Display */}
            <div className="lg:col-span-8">
              <div className="h-full rounded-[3rem] neo-glass neo-shadow p-8 lg:p-12 border-none relative overflow-hidden flex flex-col justify-between">
                <div className={`absolute top-0 right-0 w-96 h-96 blur-[100px] -mr-48 -mt-48 transition-colors duration-1000 ${
                  runwayData.infinite ? 'bg-emerald-600/10' : runwayData.months < 3 ? 'bg-red-600/20' : 'bg-amber-600/10'
                }`} />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`p-3 rounded-2xl shadow-lg border border-white/10 ${
                       runwayData.mode === 'growth' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {runwayData.mode === 'growth' ? <TrendingUp size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                        {runwayData.mode === 'growth' ? 'The Freedom Projection' : 'The Survival Clock'}
                      </h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                        {runwayData.mode === 'growth' ? 'Time until your next major milestone' : 'Time until absolute zero liquidity'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 text-center">
                    {runwayData.mode === 'growth' ? (
                      <div className="space-y-6">
                        <div className="text-6xl lg:text-9xl font-black text-emerald-400 tracking-tighter tabular-nums flex items-baseline justify-center gap-4">
                           {runwayData.years >= 1 ? (
                             <>
                               {runwayData.years} <span className="text-2xl text-slate-500 tracking-normal uppercase">Years</span>
                             </>
                           ) : (
                             <>
                               {runwayData.months} <span className="text-2xl text-slate-500 tracking-normal uppercase">Months</span>
                             </>
                           )}
                        </div>
                        <p className="text-xl font-bold text-slate-300 uppercase tracking-widest">Target: {formatCurrency(wealthGoal)}</p>
                        
                        {/* Growth Visualization */}
                        <div className="h-32 w-full mt-8 opacity-60">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={Array.from({length: 12}, (_, i) => ({ 
                                x: i, 
                                y: (stats.userNetBalance || 0) + (i * runwayData.delta * (runwayData.totalMonths / 12)) 
                              }))}>
                                 <Area type="monotone" dataKey="y" stroke="#10b981" strokeWidth={3} fill="url(#growthGradient)" />
                                 <defs>
                                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                 </defs>
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                        
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                          At your current saving rate of <span className="text-emerald-400 font-bold">{formatCurrency(runwayData.delta)}/mo</span>, you'll hit your goal in {runwayData.years} years.
                        </p>
                      </div>
                    ) : runwayData.mode === 'burn' ? (
                      <div className="space-y-6">
                        <div className="text-6xl lg:text-9xl font-black text-white tracking-tighter tabular-nums flex items-baseline justify-center gap-4">
                           {runwayData.totalMonths >= 24 ? (
                             <>
                               {Math.floor(runwayData.totalMonths / 12)} <span className="text-2xl text-slate-500 tracking-normal uppercase">Years</span>
                             </>
                           ) : runwayData.totalMonths >= 1 ? (
                             <>
                               {Math.round(runwayData.totalMonths)} <span className="text-2xl text-slate-500 tracking-normal uppercase">Months</span>
                             </>
                           ) : (
                              <>
                                {runwayData.days} <span className="text-2xl text-slate-500 tracking-normal uppercase">Days</span>
                              </>
                           )}
                        </div>
                        
                        {/* Runway Decay Visualization */}
                        <div className="h-32 w-full mt-8 opacity-50">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={Array.from({length: 10}, (_, i) => ({ 
                                x: i, 
                                y: Math.max(0, 100 - (i * (100 / (runwayData.totalMonths || 1)))) 
                              }))}>
                                 <Area type="monotone" dataKey="y" stroke="#ef4444" strokeWidth={2} fill="url(#runwayGradient)" />
                                 <defs>
                                    <linearGradient id="runwayGradient" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                       <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                 </defs>
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>

                        <p className="text-xl font-bold text-red-400 uppercase tracking-[0.2em]">Depletion Node Alert</p>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">At your current burn rate of {formatCurrency(Math.abs(runwayData.delta))}, you will be broke in {runwayData.totalMonths >= 24 ? `${(runwayData.totalMonths/12).toFixed(1)} years` : `${Math.round(runwayData.totalMonths)} months`}.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-8xl lg:text-9xl font-black text-slate-700 tracking-tighter">--</div>
                        <p className="text-xl font-bold text-slate-500 uppercase tracking-widest">Stagnant Flow</p>
                        <p className="text-sm text-slate-500">Your income perfectly matches your expenses. No growth, no decay.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative z-10 mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-md">
                   {[
                     { label: 'Combined Balance', val: formatCurrency((stats.userNetBalance || 0) + (stats.userCashBalance || 0) + (stats.userSavingsBalance || 0)), icon: ShieldCheck, color: 'text-cyan-400' },
                     { label: 'Monthly Outflow', val: formatCurrency(stats.totalExpenses), icon: Flame, color: 'text-red-400' },
                     { label: 'Monthly Inflow', val: formatCurrency(stats.totalIncome), icon: TrendingUp, color: 'text-emerald-400' },
                     { label: 'Monthly Delta', val: formatCurrency(stats.totalIncome - stats.totalExpenses), icon: Zap, color: 'text-indigo-400' },
                   ].map((m) => (
                     <div key={m.label}>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><m.icon size={10} className={m.color} /> {m.label}</p>
                       <p className="text-sm font-black text-white">{m.val}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Controls for Survival */}
            <aside className="lg:col-span-4 space-y-6">
               <div className="rounded-[2.5rem] neo-glass neo-shadow p-8 border-none h-full">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-8">Alter Reality</h3>
                  <div className="space-y-12 mt-4">
                    <div className="group">
                      <div className="flex justify-between items-end mb-4 px-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Wealth Milestone (Goal)</label>
                        <span className="text-lg font-black text-emerald-400 tracking-tight">{formatCurrency(wealthGoal)}</span>
                      </div>
                      <input 
                        type="range" min="100000" max="5000000" step="100000" 
                        value={wealthGoal} 
                        onChange={e => setWealthGoal(e.target.value)}
                        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500 transition-all"
                      />
                    </div>

                    <div className="group">
                      <div className="flex justify-between items-end mb-4 px-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly Side Hustle</label>
                        <span className="text-lg font-black text-white tracking-tight">+{formatCurrency(extraMonthlyIncome)}</span>
                      </div>
                      <input 
                        type="range" min="0" max="150000" step="1000" 
                        value={extraMonthlyIncome} 
                        onChange={e => setExtraMonthlyIncome(e.target.value)}
                        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500 transition-all"
                      />
                    </div>

                    <div className="group">
                      <div className="flex justify-between items-end mb-4 px-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Burn Reduction (%)</label>
                        <span className="text-lg font-black text-white tracking-tight">{expenseCutPercent}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="80" step="1" 
                        value={expenseCutPercent} 
                        onChange={e => setExpenseCutPercent(e.target.value)}
                        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-red-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-12 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                     <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3">Coach Protocol</p>
                     <p className="text-xs text-slate-400 leading-relaxed italic">
                        &quot;Increasing your side hustle by even 5k can instantly flip a negative runway into an infinite growth loop.&quot;
                     </p>
                  </div>
               </div>
            </aside>
          </motion.div>
        )}

        {activeTab === 'accelerator' && (
          <motion.div 
            key="accelerator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-8">
              <div className="h-full rounded-[3rem] neo-glass neo-shadow p-10 border-none relative overflow-hidden flex flex-col justify-center text-center">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5" />
                 
                 <div className="relative z-10 space-y-12">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/30">
                       <Rocket size={14} /> Accelerator Engaged
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                        Save <span className="text-cyan-400">{acceleratorData.daysSaved} Days</span>
                      </h2>
                      <p className="text-xl font-medium text-slate-400">By sacrificing one specific habit, you get your item {Math.round(acceleratorData.daysSaved / 30.4)} months sooner.</p>
                      
                      {/* Acceleration Comparison View */}
                      <div className="h-40 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={Array.from({length: 12}, (_, i) => ({
                            m: i,
                            base: i * 2,
                            accel: i * 3.5
                          }))}>
                            <Area type="monotone" dataKey="accel" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.1} strokeWidth={3} />
                            <Area type="monotone" dataKey="base" stroke="#475569" fill="#475569" fillOpacity={0.1} strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-10 rounded-[3rem] bg-slate-900 shadow-2xl border border-white/5">
                        <div className="space-y-2">
                           <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Base Date</p>
                           <p className="text-3xl font-black text-white">{acceleratorData.monthsWithoutCut === Infinity ? 'Never' : `${acceleratorData.monthsWithoutCut} Mo`}</p>
                           <p className="text-[10px] text-slate-600 font-bold uppercase">Standard Savings Path</p>
                        </div>
                        <div className="space-y-2 border-l border-white/5">
                           <p className="text-[10px] uppercase font-black text-cyan-500 tracking-widest">New Date</p>
                           <p className="text-3xl font-black text-cyan-400">{acceleratorData.monthsWithCut === Infinity ? 'Never' : `${acceleratorData.monthsWithCut} Mo`}</p>
                           <p className="text-[10px] text-cyan-900 font-bold uppercase">After Sacrifice Engine</p>
                        </div>
                    </div>
                 </div>
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-6">
               <div className="rounded-[2.5rem] neo-glass neo-shadow p-8 border-none h-full">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-8">Dream Paramaters</h3>
                  <div className="space-y-10">
                    <div className="group">
                      <div className="flex justify-between items-end mb-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Item Price</label>
                        <span className="text-lg font-black text-white">{formatCurrency(targetPrice)}</span>
                      </div>
                      <input 
                        type="range" min="1000" max="200000" step="1000" 
                        value={targetPrice} 
                        onChange={e => setTargetPrice(e.target.value)}
                        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500 transition-all"
                      />
                    </div>

                    <div className="group">
                      <div className="flex justify-between items-end mb-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Habit (Price/ea)</label>
                        <span className="text-lg font-black text-white">{formatCurrency(habitPrice)}</span>
                      </div>
                      <input 
                        type="range" min="50" max="5000" step="50" 
                        value={habitPrice} 
                        onChange={e => setHabitPrice(e.target.value)}
                        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500 transition-all"
                      />
                    </div>

                    <div className="group">
                        <div className="flex justify-between items-end mb-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Frequency (x/mo)</label>
                          <span className="text-lg font-black text-white">{habitFrequency}x</span>
                        </div>
                        <div className="flex gap-2">
                           {[5, 10, 20, 30].map(val => (
                             <button
                                key={val}
                                onClick={() => setHabitFrequency(val)}
                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black transition-all ${
                                   habitFrequency === val ? 'bg-cyan-600 text-white' : 'bg-white/5 text-slate-500 hover:text-slate-300'
                                }`}
                             >
                               {val}x
                             </button>
                           ))}
                        </div>
                    </div>
                  </div>
               </div>
            </aside>
          </motion.div>
        )}

        {activeTab === 'habit' && (
          <motion.div 
            key="habit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
             <div className="lg:col-span-8">
               <div className="rounded-[3rem] neo-glass neo-shadow p-12 border-none">
                  <div className="flex items-center gap-4 mb-12">
                     <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500">
                        <Zap size={24} />
                     </div>
                     <h2 className="text-2xl font-black text-white uppercase tracking-tight">The 5-Year Mirror</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     {[
                       { cat: 'Dining Out', price: 600, freq: 8, icon: Coffee, color: 'text-orange-400' },
                       { cat: 'Subscriptions', price: 999, freq: 4, icon: Zap, color: 'text-indigo-400' },
                       { cat: 'Impulse Buys', price: 2500, freq: 2, icon: ShoppingBag, color: 'text-fuchsia-400' },
                       { cat: 'Gaming Skins', price: 400, freq: 5, icon: Gamepad, color: 'text-cyan-400' },
                     ].map((h) => {
                       const yrCost = h.price * h.freq * 12;
                       const fiveYrCost = yrCost * 5;
                       return (
                         <div key={h.cat} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 group hover:bg-white/10 transition-all relative overflow-hidden">
                            <h.icon className={`absolute -right-4 -bottom-4 w-32 h-32 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform ${h.color}`} />
                            <div className="relative z-10 flex items-center justify-between mb-8">
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{h.cat}</p>
                               <p className="text-lg font-black text-white">{formatCurrency(h.price)}/ea</p>
                            </div>
                            <div className="relative z-10 space-y-1">
                               <p className="text-3xl font-black text-white tabular-nums">{formatCurrency(fiveYrCost)}</p>
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Waste potential in 5 years</p>
                            </div>
                         </div>
                       );
                     })}
                  </div>
               </div>
             </div>

             <aside className="lg:col-span-4">
                <div className="rounded-[3rem] neo-glass neo-shadow p-10 h-full border-none bg-indigo-600 shadow-indigo-600/30">
                   <div className="flex flex-col h-full justify-between text-white">
                      <div>
                        <Target size={40} className="mb-8" />
                        <h3 className="text-3xl font-black leading-tight mb-4 uppercase tracking-tighter italic">The 1% Rule</h3>
                        <p className="text-indigo-100 font-medium leading-relaxed">
                          Investing just ₹1,000 extra starting today would compound to <span className="text-indigo-900 bg-white px-2 py-0.5 rounded font-black">₹4.2 Lakhs</span> by the time you graduate with a masters degree.
                        </p>
                      </div>
                      
                      <div className="mt-auto pt-10">
                         <div className="p-5 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-4">
                            <Sparkles size={20} className="text-amber-300" />
                            <p className="text-xs font-bold italic">Genie suggests: Cut your Dining Out by 15% to hit your &apos;MacBook&apos; goal by July.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FutureSimulatorPage;
