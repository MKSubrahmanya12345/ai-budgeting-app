import { useEffect, useMemo, useState } from "react";
import { Camera, Loader2, Sparkles, Wand2 } from "lucide-react";
import api from "../lib/api";

const categoryMap = {
  expense: ["Food", "Transport", "Rent", "Utilities", "Shopping", "Health", "Entertainment", "Education", "Savings", "Other"],
  income: ["Salary", "Freelance", "Investments", "Refund", "Gift", "Other"],
};

const getToday = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const SmartInput = ({ onTransactionAdded, entryMode }) => {
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categoryMap.expense[0]);
  const [transactionDate, setTransactionDate] = useState(getToday());
  const [note, setNote] = useState("");
  const [paymentMode, setPaymentMode] = useState("upi");
  const [useAi, setUseAi] = useState(true);
  const [isEssential, setIsEssential] = useState(true);

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);

  useEffect(() => {
    setCategory(categoryMap[type][0]);
    setIsEssential(type === "expense");
  }, [type]);

  const categoryOptions = useMemo(() => categoryMap[type], [type]);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setCategory(categoryMap[type][0]);
    setNote("");
    setAiSuggestion(null);
  };

  const handleAiSuggest = async () => {
    setErrorMessage("");
    const parsedAmount = Number(amount);
    if (!description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Add description and amount before AI suggest.");
      return;
    }

    try {
      setAiLoading(true);
      const { data } = await api.post("/api/transactions/ai-suggest", {
        description,
        amount: parsedAmount,
        transactionDate,
        type,
      });

      setAiSuggestion(data);
      setType(data.type === "income" ? "income" : "expense");
      setCategory(data.category || "Other");
      setNote(data.note || "");
      setIsEssential(Boolean(data.isEssential));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "AI suggestion failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleScanReceipt = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setErrorMessage("");
    setScanLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await api.post("/api/transactions/scan-receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDescription(data.description || "");
      setAmount(String(data.amount || ""));
      setCategory(data.category || categoryMap[type][0]);
      setType(data.type === "income" ? "income" : "expense");
      setIsEssential(data.isEssential !== undefined ? data.isEssential : true);
      if (data.transactionDate) setTransactionDate(data.transactionDate);
      if (data.note) setNote(data.note);
      
      setAiSuggestion({
        type: data.type,
        category: data.category,
        nudge: "Extracted perfectly from your receipt! 📸",
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to scan receipt. Please try a clearer photo.");
    } finally {
      setScanLoading(false);
      // Reset input value so same file can be selected again
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const parsedAmount = Number(amount);
    if (!description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Enter a valid description and amount.");
      return;
    }

    try {
      setLoading(true);

      if (useAi) {
        await api.post("/api/transactions/ai-add", {
          description,
          amount: parsedAmount,
          transactionDate,
          type,
          paymentMode,
          entryMode: entryMode || "actual",
        });
      } else {
        await api.post("/api/transactions", {
          description,
          amount: parsedAmount,
          transactionDate,
          type,
          category,
          note,
          paymentMode,
          isEssential: type === "expense" ? isEssential : true,
          entryMode: entryMode || "actual",
        });
      }

      resetForm();
      onTransactionAdded?.();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Could not save transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/5 bg-slate-900/60 backdrop-blur-md p-4 sm:p-6 shadow-xl relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-fuchsia-500/10 blur-[80px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-black text-white tracking-tight">Smart Entry</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 sm:ml-10 font-medium">Scan receipts or use AI to auto-categorize.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <label className={`flex-1 sm:flex-none px-4 py-2.5 rounded-2xl border transition-all active:scale-95 flex items-center justify-center gap-2 font-bold text-xs cursor-pointer shadow-lg ${
            scanLoading 
              ? 'bg-slate-800 border-slate-700 text-slate-500' 
              : 'bg-fuchsia-600/20 border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-600/30 shadow-fuchsia-500/10 border-fuchsia-400/40'
          }`}>
             <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScanReceipt} disabled={scanLoading} />
             {scanLoading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} className="shrink-0" />}
             <span>Scan Receipt</span>
          </label>

          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={aiLoading || scanLoading}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl border border-cyan-500/30 bg-cyan-600/10 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-cyan-500/10"
          >
            {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} className="shrink-0" />}
            <span>Magic Fill</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Primary Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-3">
          <div className="md:col-span-2 lg:col-span-3">
             <label className="text-[10px] uppercase font-bold text-slate-500 ml-3 mb-1 block tracking-widest">Description</label>
             <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did we spend on?"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition-all placeholder:text-slate-600"
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-3 mb-1 block tracking-widest">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-8 pr-4 text-sm text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-3 mb-1 block tracking-widest">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition-all appearance-none"
              disabled={loading || (useAi && aiSuggestion)}
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-3 mb-1 block tracking-widest">Date & Options</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="flex-1 bg-slate-950/50 border border-slate-800 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setType(type === 'expense' ? 'income' : 'expense')}
                className={`px-4 rounded-2xl border font-bold text-[10px] uppercase tracking-tighter transition-all ${
                  type === 'income' 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                    : 'bg-red-500/20 border-red-500/40 text-red-300'
                }`}
              >
                {type}
              </button>
            </div>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <label className="text-[10px] opacity-0 mb-1 block">Save</label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 rounded-2xl py-3 px-4 text-sm font-black text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="currentColor" />}
              <span>{loading ? "Processing..." : "Save Entry"}</span>
            </button>
          </div>
        </div>

        {/* Extended Options - Auto-collapsed look */}
        <div className="pt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative group/sel">
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full bg-slate-950/30 border border-slate-800 rounded-xl py-2 px-3 text-[10px] font-bold text-slate-400 outline-none hover:border-slate-700 transition-all appearance-none"
              disabled={loading}
            >
              <option value="upi">UPI / Bank Account</option>
              <option value="cash">Cash in Hand</option>
              <option value="savings">Savings Vault</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-hover/sel:text-slate-400">
               <Zap size={10} />
            </div>
          </div>

          <label className={`flex items-center justify-center gap-2 bg-slate-950/30 border rounded-xl py-2 px-3 text-[10px] font-bold cursor-pointer transition-all ${
            isEssential ? 'border-indigo-500/30 text-indigo-300 bg-indigo-500/5' : 'border-slate-800 text-slate-500'
          }`}>
            <input
              type="checkbox"
              checked={isEssential}
              onChange={(e) => setIsEssential(e.target.checked)}
              disabled={loading || (useAi && aiSuggestion) || type !== "expense"}
              className="accent-indigo-500 rounded-lg"
            />
            {isEssential ? "Mandatory Spending" : "Optional / Fun"}
          </label>

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a quick note..."
            className="col-span-2 md:col-span-2 bg-slate-950/30 border border-slate-800 rounded-xl py-2 px-3 text-[10px] text-slate-400 outline-none focus:border-indigo-500/30 transition-all"
            disabled={loading || (useAi && aiSuggestion)}
          />
        </div>
      </form>

      {/* AI Success Feedback */}
      {aiSuggestion && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
               <Sparkles size={14} />
            </div>
            <div className="min-w-0">
               <p className="text-xs text-cyan-100 font-bold">AI Insight</p>
               <p className="text-[10px] text-cyan-300/80 truncate">{aiSuggestion.nudge}</p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 animate-in shake duration-300">
          <p className="text-[10px] font-bold text-red-400 border border-red-500/20 bg-red-500/5 rounded-2xl px-4 py-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {errorMessage}
          </p>
        </div>
      )}
    </section>
  );
};

export default SmartInput;
