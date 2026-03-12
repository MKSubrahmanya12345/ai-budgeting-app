import React, { useState } from 'react';
import { BookOpen, TrendingUp, ShieldCheck, PieChart, PlayCircle, Clock, Star, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
    content: `
# Mastering the 50/30/20 Rule

The 50/30/20 rule is an intuitive and highly effective budgeting method that can help you manage your money simply and sustainably. It was popularized by Senator Elizabeth Warren in her book *All Your Worth: The Ultimate Lifetime Money Plan*.

## How It Works

The core idea is to divide your after-tax income (your take-home pay) into three distinct categories:

### 1. 50% for NEEDS 🏠
Needs are the bills that you absolutely must pay and the things necessary for survival. These include:
- Rent or mortgage payments
- Groceries (basic food, not dining out)
- Basic utilities (electricity, water, internet)
- Transportation (gas, car payment, transit pass)
- Essential minimum debt payments
- Insurance and healthcare

*If your needs take up more than 50% of your income, it might be time to look for ways to reduce your fixed costs or increase your income.*

### 2. 30% for WANTS ✈️
Wants are all the little (and big) extras that make life enjoyable. This is your "fun money".
- Dining out and ordering delivery
- Entertainment, concerts, and movies
- Hobbies and subscriptions (Netflix, Spotify, gym memberships)
- Vacations
- Upgraded clothing and electronics

*Remember: Upgrading a basic need (like buying a luxury car instead of a reliable used one) falls into the 'wants' category!*

### 3. 20% for SAVINGS & DEBT PAYDOWN 📈
This is the most critical category for building long-term wealth.
- Building an emergency fund
- Investing for retirement (401k, IRA, Index Funds)
- Paying off toxic, high-interest debt (like credit cards) faster than the minimum payment
- Saving for a down payment on a home

## Action Step
Take a look at your AI Budget Analysis tool right here in the app. Compare your current spend ratios to the 50/30/20 ideal. Where can you make adjustments this month?
    `
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
    content: `
# Conquering Debt: Avalanche vs Snowball

Debt can feel overwhelming, but attacking it randomly won't get you out as efficiently as having a dedicated mathematical strategy. The two most recommended psychological frameworks are the **Debt Snowball** and the **Debt Avalanche**.

## The Debt Snowball Method ⛄
This method is built on behavioral psychology. It focuses on gaining momentum through quick wins.

**How to do it:**
1. List all your debts from smallest total balance to largest total balance (ignore interest rates).
2. Make minimum payments on all debts except the smallest one.
3. Throw every extra dollar you have at the smallest debt until it is completely gone.
4. Once the smallest debt is paid, roll that payment amount into the next smallest debt.

**Pros:** Incredible psychological motivation. Seeing a debt completely zeroed out gives you a dopamine hit that keeps you focused.

## The Debt Avalanche Method 🏔️
This method is purely mathematical. It focuses on saving you the absolute most money in interest over time.

**How to do it:**
1. List your debts from highest interest rate to lowest interest rate.
2. Make minimum payments on all debts except the one with the highest interest rate.
3. Throw every extra dollar at the highest interest rate debt.
4. Once paid off, move to the debt with the next highest interest rate.

**Pros:** Mathematically optimal. Saves you hundreds or thousands of dollars in interest and pays off debt faster overall.

## Which Should You Choose?
- **Choose the Snowball** if you get easily discouraged and need to see accounts close quickly to stay motivated.
- **Choose the Avalanche** if you are disciplined, analytical, and hate the idea of giving banks extra money in interest.
    `
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
    content: `
# Building Your Financial Fortress

An emergency fund is your financial shock absorber. Without one, a sudden car repair, medical emergency, or unexpected job loss can force you into toxic, high-interest debt that ruins your wealth-building trajectory.

## Step 1: The Starter Emergency Fund
Before you start aggressively paying down debt or investing in the stock market, you need a basic buffer.

**Goal: $1,000 to $2,000 (or equivalent in your currency)**
This prevents you from putting common emergencies on a credit card. It’s not enough to survive job loss, but it's enough to keep the lights on and fix a sudden breakdown.

## Step 2: The Fully-Funded Safety Net
Once high-interest debt is gone, you should build your full safety net.

**Goal: 3 to 6 months of absolute living expenses.**
*Note: This is based on expenses, not income. Calculate only your essential NEEDS (rent, groceries, utilities, minimum payments).*

- **Aim for 3 Months if:** You are single, have a highly stable job in an in-demand field, and have low fixed expenses.
- **Aim for 6 Months if:** You have dependents, own a home, work in a volatile industry, or are an independent contractor/freelancer.

## Step 3: Where to Keep It
Your emergency fund should NEVER be invested in risky assets like stocks or cryptocurrency. It must be strictly liquid. However, leaving it in a 0.01% checking account loses you money due to inflation.

**Best Place:** A High-Yield Savings Account (HYSA). Let the bank pay you 4-5% interest while keeping the money totally safe and easily accessible within 2-3 business days.
    `
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
    content: `
# Investing Doesn't Have to Be Hard

The biggest lie in finance is that you need to be a wall street expert to build wealth. In reality, the passive investor almost always beats the active trader in the long run.

## The Magic of Compound Interest
Einstein reputedly called compound interest the "Eighth Wonder of the World." It simply means earning interest on your previously earned interest.

If you invest $300 a month into an account earning 8% annually from age 25 to 65:
- **Total money you put in:** $144,000
- **Total money you end up with:** Over $1.04 Million
- The remaining $900,000+ is purely growth. Time in the market is more important than timing the market.

## Forget Individual Stocks. Buy The Whole Farm.
Trying to pick the next Apple or Tesla is notoriously difficult and risky. Instead of buying individual stocks, you should heavily consider **Index Funds or ETFs**.

An Index Fund (like an S&P 500 ETF) allows you to buy a tiny slice of all 500 of the largest companies in America with a single purchase. If one company goes bankrupt, you don't lose all your money because you own 499 others. It provides instant diversification and traditionally returns around 7-10% annually over long decades.

## How To Start
1. **Open a Brokerage Account:** Look for reputable brokers with zero commission fees (e.g., Vanguard, Fidelity, Charles Schwab, Kuvera/Groww in India).
2. **Utilize Tax-Advantaged Accounts:** In the US, look at 401(k)s with an employer match, and Roth IRAs. In India, look at ELSS or PPF.
3. **Automate It:** Set up an automatic transfer every time you get paid so you invest your money before you have the chance to spend it.
    `
  }
];

const CoursesPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (selectedCourse) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors bg-slate-900/50 hover:bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-700 w-fit"
        >
          <ArrowLeft size={18} /> Back to Library
        </button>

        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Header section with course styling */}
          <div className={`p-8 md:p-12 border-b border-slate-800 relative overflow-hidden ${selectedCourse.bgColor}`}>
             <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none opacity-50 bg-current ${selectedCourse.color}`} />
             
             <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border bg-slate-950 ${selectedCourse.color} ${selectedCourse.borderColor}`}>
                  <selectedCourse.icon size={40} className="stroke-[1.5]" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{selectedCourse.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-300">
                    <div className="flex items-center gap-1.5"><Clock size={16} className={selectedCourse.color} /> {selectedCourse.duration} read</div>
                    <div className="flex items-center gap-1.5"><Star size={16} className="text-yellow-400 fill-yellow-400" /> {selectedCourse.rating} Rating</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-400" /> Lesson 1 of 1</div>
                  </div>
                </div>
             </div>
          </div>

          {/* Actual Markdown Content Area */}
          <div className="p-8 md:p-12 lg:px-24">
            <div className="prose prose-invert prose-lg max-w-none 
                prose-headings:text-white prose-headings:font-bold 
                prose-h1:text-3xl prose-h1:mb-8 prose-h1:border-b prose-h1:border-slate-800 prose-h1:pb-4
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-cyan-400
                prose-h3:text-xl prose-h3:mt-8 
                prose-p:text-slate-300 prose-p:leading-loose prose-p:mb-6
                prose-li:text-slate-300 prose-li:marker:text-cyan-500
                prose-strong:text-white prose-strong:font-semibold">
              <ReactMarkdown>{selectedCourse.content}</ReactMarkdown>
            </div>
            
            <div className="mt-16 pt-8 border-t border-slate-800 flex justify-end">
               <button 
                  onClick={() => setSelectedCourse(null)}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-900/20"
                >
                  <CheckCircle2 size={20} /> Complete Course
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div key={course.id} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 hover:bg-slate-900/80 transition-all duration-300 group flex flex-col h-full cursor-pointer" onClick={() => setSelectedCourse(course)}>
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
                  <div className="flex justify-between text-xs font-medium cursor-pointer">
                    <span className="text-slate-400 hover:text-cyan-400 transition-colors">Continue Course →</span>
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
