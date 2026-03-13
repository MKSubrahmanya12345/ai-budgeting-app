import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useBudgetOutlet } from "./useBudgetOutlet";
import api from "../../lib/api";
import { Loader2, Settings, Trash2, Coins, ShieldAlert, Zap, ChevronRight } from "lucide-react";

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const { notify, refreshData } = useBudgetOutlet();

  const [currency, setCurrency] = useState(user?.currency || "INR");
  const [isBusy, setIsBusy] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (currency === user?.currency) {
      notify("info", "No changes detected.");
      return;
    }

    if (!window.confirm("Convert currency? This will re-calculate your budget in the new currency base.")) {
      return;
    }

    setIsBusy(true);
    try {
      const { data } = await api.post("/api/settings/convert-currency", { newCurrency: currency });
      setUser(data.user);
      notify("success", "Currency converted!");
    } catch {
      notify("error", "Conversion failed.");
    } finally {
      setIsBusy(false);
    }
  };

  const clearAllData = async () => {
    if (!window.confirm("DANGER: This will delete ALL transactions forever. Are you absolutely sure?")) {
      return;
    }
    
    setIsClearing(true);
    try {
      await api.delete("/api/transactions");
      await refreshData();
      notify("success", "Everything has been wiped clean.");
    } catch {
      notify("error", "Wipe failed.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 lg:pb-0">
      <header className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Settings size={22} />
        </div>
        <div>
           <h2 className="text-xl font-black text-white">App Settings</h2>
           <p className="text-xs text-slate-500 font-medium">Configure your Pocket Genie experience</p>
        </div>
      </header>

      <section className="rounded-3xl border border-white/5 bg-slate-900 shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Coins size={18} className="text-amber-400" />
            <h3 className="font-bold text-white">Financial Preferences</h3>
          </div>
          
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Native Currency</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 outline-none focus:border-indigo-500 text-sm font-bold text-white transition-all appearance-none"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-2 px-1 italic">Note: Changing this will auto-convert your set budget limit.</p>
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isBusy ? <Loader2 size={16} className="animate-spin" /> : "Apply Conversion"}
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 bg-slate-900 shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={18} className="text-indigo-400" />
            <h3 className="font-bold text-white">Project Showcase</h3>
          </div>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">Want to see the startup pitch page again? View our landing page to see what Pocket Genie is all about.</p>
          <button
            onClick={() => window.open("/hero-preview", "_blank")}
            className="w-full rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 py-3.5 text-xs font-black text-white transition-all flex items-center justify-center gap-2 group"
          >
            Launch Hero Page <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-red-500/10 bg-red-500/5 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-red-500/10">
          <div className="flex items-center gap-3">
            <ShieldAlert size={18} className="text-red-400" />
            <h3 className="font-bold text-red-100">Danger Zone</h3>
          </div>
        </div>
        <div className="p-6 bg-slate-900/40">
           <p className="text-xs text-slate-400 mb-4 leading-relaxed">Deletes all transactions and resets your budget progress. This action is <span className="text-red-400 font-bold uppercase tracking-tighter">irreversible</span>.</p>
           <button
            onClick={clearAllData}
            disabled={isClearing}
            className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 py-3.5 text-xs font-black text-red-300 transition-all flex items-center justify-center gap-2"
          >
            {isClearing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Wipe Everything
          </button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
