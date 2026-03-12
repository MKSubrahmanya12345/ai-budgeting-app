import React from 'react';
import { BookOpen, TrendingUp, ShieldCheck, PieChart, PlayCircle, Clock, Star } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: "The 50/30/20 Rule: Mastering Your Budget",
    description: "Learn the foundational rule of personal finance. Discover how to allocate your income towards needs, wants, and savings effectively.",
    duration: "15 min",
    level: "Beginner",
    rating: 4.8,
    icon: PieChart,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    progress: 100,
  },
  {
    id: 2,
    title: "Debt Avalanche vs. Snowball",
    description: "Struggling with debt? Compare the top two strategies for paying off loans and credit cards to find out which psychological approach works best for you.",
    duration: "25 min",
    level: "Intermediate",
    rating: 4.9,
    icon: TrendingUp,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    progress: 45,
  },
  {
    id: 3,
    title: "Emergency Funds 101: Your Safety Net",
    description: "Why you need one, exactly how much you should save, and the best places to store your emergency cash so it grows safely.",
    duration: "20 min",
    level: "Beginner",
    rating: 4.7,
    icon: ShieldCheck,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    progress: 0,
  },
  {
    id: 4,
    title: "Investing for Beginners",
    description: "Unlock the power of compound interest. A jargon-free guide to index funds, ETFs, and getting started with your first investment.",
    duration: "45 min",
    level: "Advanced",
    rating: 5.0,
    icon: BookOpen,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    progress: 0,
  }
];

const CoursesPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-2xl relative z-10">
          <h1 className="text-3xl font-black text-white mb-3">Money Courses</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Level up your financial literacy with bite-sized, actionable courses. Learn the strategies used by the wealthy to grow and protect their money.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 hover:bg-slate-900/80 transition-all duration-300 group flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${course.bgColor} ${course.color} ${course.borderColor}`}>
                <course.icon size={24} className="stroke-[1.5]" />
              </div>
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 shadow-sm">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-semibold text-slate-300">{course.rating}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{course.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-grow">{course.description}</p>
            
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5 border border-slate-800 bg-slate-950 px-2.5 py-1.5 rounded-lg">
                  <Clock size={14} className="text-slate-400" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1.5 border border-slate-800 bg-slate-950 px-2.5 py-1.5 rounded-lg">
                  <span className={`w-2 h-2 rounded-full ${
                    course.level === 'Beginner' ? 'bg-emerald-500' : 
                    course.level === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  {course.level}
                </div>
              </div>

              {course.progress > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-cyan-400">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700 hover:border-slate-600">
                  <PlayCircle size={18} /> Start Course
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
