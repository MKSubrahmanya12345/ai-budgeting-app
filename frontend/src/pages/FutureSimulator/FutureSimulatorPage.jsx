import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, Bot, Calculator } from 'lucide-react';
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
    <div className="space-y-8 pb-24 animate-neo-slide">
      {/* Premium Intelligence Header */}
      <section className="rounded-[3rem] neo-glass neo-shadow p-10 border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 blur-[120px] -mr-64 -mt-64" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-fuchsia-600 shadow-lg shadow-fuchsia-600/30">
                <Sparkles size={24} className="text-white fill-current" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Wealth Trajectory Simulator</h2>
            </div>
            <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
              &quot;Precision modeling for your financial destiny. We&apos;ve pinpointed <span className="text-fuchsia-400 font-black">{formatCurrency(leaksAmount)}/mo</span> in structural leaks. Visualize the power of reallocation.&quot;
            </p>
          </div>
          
          <div className="p-8 rounded-[2.5rem] bg-fuchsia-500/10 border border-fuchsia-500/20 text-center min-w-[280px] group hover:bg-fuchsia-500/20 transition-all">
            <p className="text-[10px] text-fuchsia-400 font-black uppercase tracking-[0.3em] mb-3">Opportunity Cost</p>
            <p className="text-5xl font-black text-white tracking-tighter mb-2">+{formatCurrency(rawDifference)}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">Net Gain in {years} Years</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Scenario Controls */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="neo-glass neo-shadow rounded-[2.5rem] p-8 h-full border-none">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Calculator size={20} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Scenario Matrix</h3>
            </div>
            
            <div className="space-y-10">
              {[
                { label: "Starting Capital", val: startingCapital, set: setStartingCapital, min: 0, max: 100000, step: 1000, format: formatCurrency },
                { label: "Monthly Contribution", val: monthlyContribution, set: setMonthlyContribution, min: 0, max: 20000, step: 100, format: formatCurrency },
                { label: "Expected Return (%)", val: expectedReturn, set: setExpectedReturn, min: 1, max: 15, step: 0.5, format: (v) => `${v}%` },
                { label: "Execution Horizon", val: years, set: setYears, min: 1, max: 50, step: 1, format: (v) => `${v} Years` }
              ].map((input) => (
                <div key={input.label} className="group">
                  <div className="flex justify-between items-end mb-4 px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{input.label}</label>
                    <span className="text-lg font-black text-white tracking-tight">{input.format(input.val)}</span>
                  </div>
                  <input 
                    type="range" 
                    min={input.min} max={input.max} step={input.step} 
                    value={input.val} 
                    onChange={e => input.set(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-fuchsia-500 transition-all"
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Bot size={20} />
                 </div>
                 <div>
                    <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-2">Genie Intelligence</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                      &quot;The <strong>Optimized path</strong> factors in your 7-day action protocol, assuming all detected leaks are reinvested.&quot;
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Projection Visualization */}
        <section className="lg:col-span-8">
           <div className="neo-glass neo-shadow rounded-[2.5rem] p-8 h-full border-none flex flex-col">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Projected Trajectory</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Growth Differential Modeling</p>
                  </div>
                </div>
                <div className="text-left sm:text-right px-6 py-3 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Final Portfolio</p>
                   <p className="text-3xl font-black text-cyan-400 tracking-tighter">{formatCurrency(rawFinalOptimized)}</p>
                </div>
              </div>

              <div className="flex-grow min-h-[450px] relative">
                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorNormalSim" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#475569" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOptimizedSim" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      stroke="#475569" 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }} 
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#475569" 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }}
                      tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="normal" 
                      stroke="#475569" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorNormalSim)" 
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="optimized" 
                      stroke="#22d3ee" 
                      strokeWidth={5} 
                      fillOpacity={1} 
                      fill="url(#colorOptimizedSim)" 
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 4, stroke: '#22d3ee' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 flex items-center justify-center gap-10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-1 bg-slate-600 rounded-full" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Trajectory</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Genically Optimized</span>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default FutureSimulatorPage;
