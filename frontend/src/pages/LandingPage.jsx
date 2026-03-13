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
  PieChart
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <Bot className="text-indigo-400" size={24} />,
      title: "Money Buddy AI",
      desc: "A proactive financial coach that understands student life. It doesn't just track; it advises."
    },
    {
      icon: <Camera className="text-fuchsia-400" size={24} />,
      title: "Magic OCR Scan",
      desc: "Snap a receipt, and Gemini AI does the rest. Mercant, amount, and category—filled in seconds."
    },
    {
      icon: <Users className="text-cyan-400" size={24} />,
      title: "Campus Splitter",
      desc: "Splitting bills with roommates? We handle the IOUs so you don't have to have 'the talk'."
    },
    {
      icon: <BrainCircuit className="text-emerald-400" size={24} />,
      title: "Affordability AI",
      desc: "Thinking of buying that new console? Our AI analyzes your history to tell you if you actually can."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <span className="text-xl font-black tracking-tighter">Pocket Genie</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">How it Works</a>
            <a href="https://github.com" className="hover:text-white transition-colors flex items-center gap-2"><Github size={16} /> Open Source</a>
          </div>

          <button 
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 rounded-2xl bg-white text-slate-950 text-sm font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            {...fadeIn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles size={14} /> Built for the Modern Student
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8"
          >
            Your money, <br />
            <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">levelled up.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium"
          >
            Pocket Genie is the AI-first financial assistant that actually understands student life. Track, split, and grow—all in one place.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-4 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg shadow-2xl shadow-indigo-500/40 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              Get Started for Free <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-3xl border border-slate-700 bg-slate-900/50 text-slate-300 font-black text-lg hover:border-slate-500 transition-all active:scale-95">
              Watch Demo
            </button>
          </motion.div>

          {/* Abstract App Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            className="mt-24 relative"
          >
            <div className="relative mx-auto max-w-4xl rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-3 sm:p-4 backdrop-blur-3xl shadow-[0_0_100px_rgba(79,70,229,0.15)] overflow-hidden group">
              <div className="rounded-[1.8rem] border border-white/5 bg-slate-950 overflow-hidden aspect-[16/9] flex flex-col">
                {/* Simulated UI */}
                <div className="h-12 border-b border-white/5 flex items-center px-6 justify-between bg-slate-900/50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Pocket Genie Dashboard</div>
                  <div className="w-6 h-6 rounded-full bg-slate-800" />
                </div>
                <div className="flex-1 p-8 grid grid-cols-12 gap-6 bg-slate-950">
                  <div className="col-span-8 space-y-6">
                    <div className="h-40 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 border border-white/5 flex items-center justify-center">
                      <Zap size={40} className="text-white opacity-20" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-slate-900 border border-white/5" />)}
                    </div>
                  </div>
                  <div className="col-span-4 space-y-6">
                    <div className="flex-1 rounded-3xl bg-slate-900 border border-white/5 p-6 space-y-4">
                      <div className="h-4 w-1/2 bg-slate-800 rounded" />
                      <div className="h-2 w-full bg-slate-800 rounded" />
                      <div className="h-2 w-3/4 bg-slate-800 rounded" />
                      <div className="h-2 w-1/2 bg-slate-800 rounded" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Element */}
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-64 h-80 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 backdrop-blur-xl p-6 hidden lg:block shadow-2xl">
                 <Bot size={32} className="text-indigo-400 mb-4" />
                 <div className="space-y-3">
                   <div className="h-2 w-3/4 bg-indigo-400/20 rounded-full" />
                   <div className="h-2 w-full bg-indigo-400/20 rounded-full" />
                   <div className="h-2 w-1/2 bg-indigo-400/20 rounded-full" />
                 </div>
                 <div className="mt-8 pt-8 border-t border-indigo-500/10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">AI Buddy Insight</p>
                   <p className="text-xs text-indigo-100/60 mt-2 font-medium">"You've spent 20% less on Food than average this month! Keep it up."</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 border-t border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Everything you need <br /> to <span className="text-indigo-400">master</span> your money.</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">Built by students, for students. No corporate jargon, just real tools that work.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="p-8 rounded-[2rem] border border-white/5 bg-slate-950 hover:bg-slate-900 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-900 group-hover:bg-slate-800 flex items-center justify-center mb-6 transition-colors shadow-inner">
                  {f.icon}
                </div>
                <h3 className="text-xl font-black mb-3 text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
           <div className="flex justify-center gap-12 flex-wrap opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-1 text-2xl font-black italic tracking-tighter"><Zap size={24} /> CANARA</div>
             <div className="flex items-center gap-1 text-2xl font-black italic tracking-tighter underline decoration-indigo-500">CAMPUS</div>
             <div className="flex items-center gap-1 text-2xl font-black italic tracking-tighter underline decoration-fuchsia-500">BUDGET</div>
             <div className="flex items-center gap-1 text-2xl font-black italic tracking-tighter">AI GENIE</div>
           </div>
           <p className="mt-12 text-sm font-bold text-slate-500 uppercase tracking-[0.4em]">Trusted by thousands of students nationwide</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto rounded-[3rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-12 sm:p-24 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] -mr-48 -mt-48" />
           <div className="relative z-10">
             <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">Stop guessing. <br /> Start knowing.</h2>
             <button 
              onClick={() => navigate("/login")}
              className="px-12 py-5 rounded-3xl bg-white text-indigo-600 font-black text-xl hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-black/10"
             >
               Launch Pocket Genie Now
             </button>
             <p className="text-indigo-200 mt-8 text-sm font-bold">Free for forever. No credit card required.</p>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
             <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-600 shadow-md">
                   <Zap size={14} className="text-white fill-current" />
                </div>
                <span className="text-white text-lg font-black tracking-tight">Pocket Genie</span>
             </div>
             <p className="text-xs text-center md:text-left">© 2026 Pocket Genie AI. <br /> All rights reserved. Made with ❤️ for Students.</p>
          </div>

          <div className="flex items-center gap-8">
             <a href="#" className="hover:text-white transition-colors"><ShieldCheck className="mx-auto block mb-1" size={18} /> Privacy</a>
             <a href="#" className="hover:text-white transition-colors"><Twitter className="mx-auto block mb-1" size={18} /> Threads</a>
             <a href="#" className="hover:text-white transition-colors"><Github className="mx-auto block mb-1" size={18} /> Source</a>
             <a href="#" className="hover:text-white transition-colors"><PieChart className="mx-auto block mb-1" size={18} /> Stats</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
