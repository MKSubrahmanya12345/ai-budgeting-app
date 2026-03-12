import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, Bot } from 'lucide-react';
import api from '../../lib/api';

const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-400 mb-2 font-medium">Year {label}</p>
        <div className="space-y-1 text-sm">
          <p className="text-cyan-400 font-bold flex justify-between gap-4">
            <span>Optimized:</span> 
            <span>{formatCurrency(payload[1].value)}</span>
          </p>
          <p className="text-slate-300 flex justify-between gap-4">
            <span>Current Path:</span> 
            <span>{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const FutureSimulatorPage = () => {
  const [startingCapital, setStartingCapital] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [years, setYears] = useState(10);
  
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

  const leaksAmount = useMemo(() => {
    return Math.round(leaks.reduce((sum, leak) => sum + leak.totalSpent, 0));
  }, [leaks]);

  const chartData = useMemo(() => {
    let data = [];
    const r = expectedReturn / 100 / 12; // monthly rate
    
    let normalWorth = Number(startingCapital);
    let optimizedWorth = Number(startingCapital);
    
    // Fallback normal math to strict interest if rate is 0
    for (let yr = 0; yr <= years; yr++) {
      if (yr === 0) {
        data.push({
          year: 'Year 0',
          normal: Math.round(normalWorth),
          optimized: Math.round(optimizedWorth),
        });
        continue;
      }

      for (let m = 0; m < 12; m++) {
        if (r === 0) {
          normalWorth += Number(monthlyContribution);
          optimizedWorth += Number(monthlyContribution) + Number(leaksAmount);
        } else {
          normalWorth = normalWorth * (1 + r) + Number(monthlyContribution);
          optimizedWorth = optimizedWorth * (1 + r) + (Number(monthlyContribution) + Number(leaksAmount));
        }
      }

      data.push({
        year: `Year ${yr}`,
        normal: Math.round(normalWorth),
        optimized: Math.round(optimizedWorth),
      });
    }
    return data;
  }, [startingCapital, monthlyContribution, expectedReturn, years, leaksAmount]);

  const rawFinalNormal = chartData[chartData.length - 1]?.normal || 0;
  const rawFinalOptimized = chartData[chartData.length - 1]?.optimized || 0;
  const rawDifference = rawFinalOptimized - rawFinalNormal;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} /> AI Wealth Engine
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Future Wealth Simulator</h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            See how your current habits project into the future. We detected <strong className="text-fuchsia-400">{formatCurrency(leaksAmount)}/mo</strong> in spending leaks. See what happens if you invest it instead!
          </p>
        </div>
        
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0 relative z-10 text-center w-full md:w-auto">
          <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1">Opportunity Cost</p>
          <p className="text-2xl font-black text-fuchsia-400">+{formatCurrency(rawDifference)}</p>
          <p className="text-slate-500 text-xs mt-1">in <strong>{years}</strong> years</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col gap-6">
            <h3 className="text-white font-bold flex items-center gap-2 mb-2"><Calculator size={18} className="text-cyan-400" /> Scenario Variables</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1 flex justify-between">
                  Starting Capital <span>{formatCurrency(startingCapital)}</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="100000" step="1000" 
                  value={startingCapital} 
                  onChange={e => setStartingCapital(e.target.value)}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1 flex justify-between">
                  Monthly Contribution <span>{formatCurrency(monthlyContribution)}</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="20000" step="100" 
                  value={monthlyContribution} 
                  onChange={e => setMonthlyContribution(e.target.value)}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1 flex justify-between">
                  Expected Annual Return <span>{expectedReturn}%</span>
                </label>
                <input 
                  type="range" 
                  min="1" max="15" step="0.5" 
                  value={expectedReturn} 
                  onChange={e => setExpectedReturn(e.target.value)}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1 flex justify-between">
                  Time Horizon <span>{years} Years</span>
                </label>
                <input 
                  type="range" 
                  min="1" max="40" step="1" 
                  value={years} 
                  onChange={e => setYears(e.target.value)}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
            
            <div className="mt-4 pt-6 border-t border-slate-800">
               <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl p-4">
                 <div className="flex items-start gap-3">
                   <AlertTriangle size={20} className="text-fuchsia-400 shrink-0 mt-0.5" />
                   <div>
                     <p className="text-sm font-bold text-fuchsia-400 mb-1">AI Waste Detector Active</p>
                     <p className="text-xs text-slate-300 leading-relaxed">
                       We found {formatCurrency(leaksAmount)}/mo in non-essential recurring leaks. The <strong>Optimized path</strong> assumes you cut this waste and invest it.
                     </p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2">
           <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-white font-bold flex items-center gap-2"><TrendingUp size={18} className="text-cyan-400" /> Projection Graph</h3>
                   <p className="text-xs text-slate-400 mt-1">Growth of standard vs optimized trajectory</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Projected Portfolio</p>
                   <p className="text-2xl font-black text-cyan-400">{formatCurrency(rawFinalOptimized)}</p>
                </div>
              </div>

              <div className="flex-grow min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4b5563" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4b5563" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      stroke="#475569" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      tickLine={false}
                      axisLine={false}
                      minTickGap={30}
                    />
                    <YAxis 
                      stroke="#475569" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="normal" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#colorNormal)" />
                    <Area type="monotone" dataKey="optimized" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorOptimized)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FutureSimulatorPage;
