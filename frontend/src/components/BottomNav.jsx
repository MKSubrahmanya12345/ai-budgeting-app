import { NavLink } from "react-router-dom";
import { LayoutDashboard, ReceiptText, Zap, Bot, Sparkles } from "lucide-react";

const BottomNav = () => {
  const items = [
    { to: "/dashboard/overview", label: "Home", icon: LayoutDashboard },
    { to: "/dashboard/transactions", label: "History", icon: ReceiptText },
    { to: "/dashboard/smart-spend", label: "Scout", icon: Zap },
    { to: "/dashboard/moneybuddy", label: "Buddy", icon: Bot },
    { to: "/dashboard/affordability", label: "AI", icon: Sparkles },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/50 px-2 py-2">
        <div className="flex justify-between items-center max-w-md mx-auto relative px-2">
          {items.map((item, idx) => {
            const isCenter = idx === 2; // Zap or Buddy? Let's make "Buddy" (Bot) the center
            const isBuddy = item.icon === Bot;
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 min-w-[50px] transition-all duration-300 ${
                    isActive ? "text-indigo-300" : "text-slate-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-2.5 rounded-2xl transition-all duration-500 relative ${
                      isActive 
                        ? (isBuddy ? "bg-indigo-500 text-white scale-110 -translate-y-2 shadow-lg shadow-indigo-500/40" : "bg-indigo-500/20 scale-105") 
                        : "hover:bg-slate-800/50"
                    }`}>
                      <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                      {isActive && !isBuddy && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
