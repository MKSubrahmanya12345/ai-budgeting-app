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
    <nav className="fixed bottom-6 left-6 right-6 z-50 lg:hidden">
      <div className="neo-glass neo-shadow rounded-[2rem] px-2 py-2.5 border-none">
        <div className="flex justify-between items-center max-w-md mx-auto relative px-2">
          {items.map((item) => {
            const isAI = item.to === "/dashboard/affordability" || item.to === "/dashboard/moneybuddy";
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center transition-all duration-500 ${
                    isActive ? "text-white" : "text-slate-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <div className={`p-3 rounded-2xl transition-all duration-500 relative ${
                    isActive 
                      ? "bg-indigo-600 shadow-lg shadow-indigo-600/30 scale-110 -translate-y-1.5" 
                      : "hover:bg-white/5"
                  }`}>
                    <item.icon size={22} strokeWidth={isActive ? 3 : 2} className={isActive ? "animate-pulse" : ""} />
                    {isActive && (
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-white rounded-full blur-[1px]" />
                    )}
                  </div>
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
