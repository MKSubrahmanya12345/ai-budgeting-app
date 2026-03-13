import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Zap, 
  Bot, 
  Sparkles, 
  Camera, 
  Users, 
  ChevronRight, 
  Github, 
  Twitter, 
  ShieldCheck, 
  BrainCircuit,
  PieChart,
  Globe,
  Lock,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Target
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Why Genie?", href: "#why" },
    { name: "Economics", href: "#economics" },
  ];

  const features = [
    {
      icon: <Bot className="text-indigo-400" size={24} />,
      title: "Money Buddy AI",
      desc: "A proactive financial coach that understands student life. It doesn't just track; it advises you on every swipe.",
      color: "from-indigo-500/20 to-transparent"
    },
    {
      icon: <Camera className="text-fuchsia-400" size={24} />,
      title: "Magic OCR Scan",
      desc: "Snap a receipt, and Gemini AI does the rest. Merchant, amount, and category—filled in milliseconds.",
      color: "from-fuchsia-500/20 to-transparent"
    },
    {
      icon: <Users className="text-cyan-400" size={24} />,
      title: "Campus Splitter",
      desc: "Splitting bills with roommates? We handle the IOUs so you don't have to have 'the talk' ever again.",
      color: "from-cyan-500/20 to-transparent"
    },
    {
      icon: <BrainCircuit className="text-emerald-400" size={24} />,
      title: "Affordability AI",
      desc: "Thinking of buying that new console? Our AI analyzes your history to tell you if you truly can afford it.",
      color: "from-emerald-500/20 to-transparent"
    }
  ];

  const stats = [
    { label: "Active Students", value: "10k+" },
    { label: "Daily Transactions", value: "50k+" },
    { label: "Savings Generated", value: "$2M+" },
    { label: "Uptime", value: "99.9%" }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* Modern Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="p-2.5 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/30 group-hover:rotate-12 transition-all">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <span className="text-xl font-black tracking-tightest uppercase italic">Genie</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="hover:text-indigo-400 transition-colors">{link.name}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="px-8 py-3 rounded-full bg-white text-slate-950 text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl shadow-white/5 border border-white/10"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 text-center">
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="inline-flex items-center gap-3 px-6 py-2 rounded-full neo-glass border border-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-2xl"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Intelligence for Student Economics
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-12 text-white"
            >
              Own your <br />
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">financial future.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 font-medium leading-relaxed"
            >
              The AI-first operating system for the next generation of students. <br className="hidden md:block" />
              Automated tracking, proactive splits, and true affordability.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button 
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/40 transition-all active:scale-95 flex items-center justify-center gap-3 group"
              >
                Launch Application <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
              </button>
              <button className="w-full sm:w-auto px-12 py-6 rounded-[2rem] neo-glass border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95 shadow-2xl">
                Explore Features
              </button>
            </motion.div>
          </div>

          {/* Premium Showcase */}
          <motion.div 
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-32 max-w-5xl mx-auto perspective-1000"
          >
            <div className="relative p-2 rounded-[3.5rem] neo-glass border border-white/10 shadow-[0_0_120px_rgba(79,70,229,0.2)] group transition-all duration-700 hover:scale-[1.02]">
              <div className="rounded-[3rem] border border-white/5 bg-slate-950 overflow-hidden aspect-[16/10] sm:aspect-[16/8] flex flex-col relative">
                {/* Abstract Dashboard UI */}
                <div className="h-14 border-b border-white/5 flex items-center px-8 justify-between bg-slate-900/50">
                  <div className="flex gap-2">
                    {[1,2,3].map(i => <div key={i} className="w-3 h-3 rounded-full bg-indigo-500/20" />)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase">Intelligence Node v1.0</div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10" />
                </div>
                <div className="flex-1 p-10 grid grid-cols-12 gap-8 bg-slate-950">
                  <div className="col-span-12 md:col-span-8 space-y-8">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="h-32 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5 p-6 animate-pulse">
                           <TrendingUp className="text-indigo-400 mb-4" size={24} />
                           <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                        </div>
                        <div className="h-32 rounded-[2rem] bg-gradient-to-br from-fuchsia-500/10 to-transparent border border-white/5 p-6 animate-pulse" style={{ animationDelay: '0.5s' }}>
                           <CreditCard className="text-fuchsia-400 mb-4" size={24} />
                           <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                        </div>
                     </div>
                     <div className="h-48 rounded-[2.5rem] bg-white/5 border border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl" />
                        <div className="flex justify-between items-end h-full">
                           {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                             <div key={i} className="w-4 rounded-full bg-indigo-500/20 hover:bg-indigo-500 transition-all cursor-crosshair" style={{ height: `${h}%` }} />
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="hidden md:block col-span-4 space-y-8">
                     <div className="h-full rounded-[2.5rem] bg-slate-900/80 border border-white/5 p-8 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                           <Target size={24} />
                        </div>
                        <div className="space-y-4">
                           <div className="h-3 w-1/2 bg-white/10 rounded-full" />
                           <div className="h-2 w-full bg-white/5 rounded-full" />
                           <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                           <div className="h-2 w-5/6 bg-white/5 rounded-full" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -right-12 top-1/2 -translate-y-1/2 w-72 p-8 rounded-[2.5rem] neo-glass-dark border border-white/10 shadow-2xl hidden lg:block z-20 backdrop-blur-3xl"
              >
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                       <ShieldCheck size={28} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security</p>
                       <p className="text-sm font-black text-white">AES-256 Enabled</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-3/4 bg-indigo-500" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Your data is yours. We never sell student information to third parties.</p>
                 </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-40 px-6 border-y border-white/5 bg-slate-950/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-32">
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Capabilities</span>
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white">Engineered for <br className="hidden md:block" /> student economics.</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">Built from the ground up to solve the specific complexities of modern University life.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  {...fadeIn}
                  whileHover={{ y: -10 }}
                  className={`p-10 rounded-[3rem] neo-glass border border-white/5 transition-all group overflow-hidden relative`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.color} blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center mb-10 transition-all duration-500 shadow-inner group-hover:rotate-6">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Genie Section */}
        <section id="why" className="py-40 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
             <div className="text-left">
                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">The Advantage</span>
                <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-none text-white">Why students <br /> choose Genie.</h2>
                <div className="space-y-10">
                   {[
                      { icon: <Globe size={20} />, title: "Hyper-Local Insights", text: "Get alerts on campus deals, secret student discounts, and budget hacks specific to your University." },
                      { icon: <Lock size={20} />, title: "Anonymous Mode", text: "Track split expenses without making it awkward. We handle the notifications, you stay the friend." },
                      { icon: <PieChart size={20} />, title: "Generative Insights", text: "Gemini AI doesn't just show graphs; it writes a 7-day action protocol to save you 15% minimum." }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-6 group">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:scale-110">
                           {item.icon}
                        </div>
                        <div>
                           <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{item.title}</h4>
                           <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.text}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="relative">
                <div className="absolute inset-0 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="relative rounded-[3rem] border border-white/10 neo-glass p-12 shadow-2xl overflow-hidden group">
                   <div className="flex justify-between items-center mb-12">
                      <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Monthly Growth</h3>
                      <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">+24.5%</div>
                   </div>
                   <div className="space-y-6">
                      {[1,2,3,4].map(w => (
                        <div key={w} className="h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center px-4 justify-between group-hover:bg-white/10 transition-all">
                           <div className="h-2 w-1/3 bg-white/10 rounded-full" />
                           <div className="h-2 w-1/4 bg-white/20 rounded-full" />
                        </div>
                      ))}
                   </div>
                   <div className="mt-12 p-8 rounded-[2rem] bg-indigo-600 shadow-2xl">
                      <p className="text-white text-sm font-black mb-2 uppercase tracking-[0.2em]">Genie Advice</p>
                      <p className="text-indigo-100 text-xs font-medium italic">&quot;By skipping the third coffee of the day, you've saved enough for your flight home!&quot;</p>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 border-y border-white/5 bg-white/5">
           <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map(s => (
                <div key={s.label} className="text-center group">
                   <p className="text-4xl md:text-6xl font-black text-white tracking-widest group-hover:scale-110 transition-transform">{s.value}</p>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.4em] mt-4">{s.label}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Final CTA Showcase */}
        <section className="py-40 px-6">
           <div className="max-w-6xl mx-auto rounded-[4rem] bg-gradient-to-br from-indigo-700 via-violet-800 to-indigo-900 p-16 sm:p-24 text-center relative overflow-hidden shadow-2xl group border border-white/10">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[140px] -mr-64 -mt-64 group-hover:scale-150 transition-transform duration-1000" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/10 blur-[140px] -ml-64 -mb-64 animate-pulse" />
              
              <div className="relative z-10">
                 <h2 className="text-5xl md:text-8xl font-black text-white mb-12 tracking-tighter leading-none uppercase">Scale your <br /> lifestyle.</h2>
                 <p className="text-indigo-100 text-xl font-medium max-w-xl mx-auto mb-16">Join thousands of students building their financial intelligence with Pocket Genie.</p>
                 <button 
                  onClick={() => navigate("/login")}
                  className="px-16 py-7 rounded-[2.5rem] bg-white text-slate-950 font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-100 transition-all active:scale-95 shadow-2xl"
                 >
                   Establish Your Node Now
                 </button>
                 <div className="mt-12 flex items-center justify-center gap-8 text-indigo-300 font-black text-[10px] uppercase tracking-[0.3em]">
                    <div className="flex items-center gap-2"><Globe size={14} /> Available Worldwide</div>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="flex items-center gap-2"><Lock size={14} /> Zero Log Policy</div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Futuristic Footer */}
      <footer className="py-24 px-6 border-t border-white/5 bg-[#020617] relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-24">
           <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-2 rounded-xl bg-indigo-600">
                    <Zap size={20} className="text-white fill-current" />
                 </div>
                 <span className="text-2xl font-black italic tracking-tighter uppercase text-white">Genie Intelligence</span>
              </div>
              <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">
                 Solving student economics via autonomous intelligence and local data models. We build tools that make money feel like a solved game.
              </p>
           </div>
           
           <div>
              <p className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">Ecosystem</p>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                 <li><a href="#" className="hover:text-white transition-colors">Core Interface</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Campus SDK</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Merchant Portal</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Open Data</a></li>
              </ul>
           </div>

           <div>
              <p className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">Connect</p>
              <div className="flex gap-4">
                 {[Twitter, Github, Globe].map((Icon, i) => (
                   <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                      <Icon size={20} />
                   </a>
                 ))}
              </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
           <p>© 2026 Genie Intelligence Protocol. All Rights Reserved.</p>
           <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Status</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
