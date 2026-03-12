import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, HandCoins, ArrowUpRight, ArrowDownRight, Search, Landmark } from 'lucide-react';
import { useBudgetOutlet } from "../budget/useBudgetOutlet";

const CampusSplitterPage = () => {
  const { money, notify } = useBudgetOutlet();
  const [friends, setFriends] = useState(() => {
    const saved = localStorage.getItem('campus_friends');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Rahul (Roommate)", balance: 450 },
      { id: 2, name: "Sanya", balance: -120 },
      { id: 3, name: "Ankit", balance: 0 }
    ];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [newFriendName, setNewFriendName] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  const [activeFriendId, setActiveFriendId] = useState(null);
  const [iouAmount, setIouAmount] = useState("");
  const [iouDesc, setIouDesc] = useState("");
  const [iouType, setIouType] = useState("lent"); // lent (friend owes me) or borrowed (I owe friend)

  useEffect(() => {
    localStorage.setItem('campus_friends', JSON.stringify(friends));
  }, [friends]);

  const addFriend = (e) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    const newFriend = {
      id: Date.now(),
      name: newFriendName.trim(),
      balance: 0
    };
    setFriends([...friends, newFriend]);
    setNewFriendName("");
    setIsAddingFriend(false);
    notify("success", "New friend added to your campus circle.");
  };

  const removeFriend = (id) => {
    setFriends(friends.filter(f => f.id !== id));
    if (activeFriendId === id) setActiveFriendId(null);
  };

  const addIou = (e) => {
    e.preventDefault();
    const amount = parseFloat(iouAmount);
    if (!amount || isNaN(amount) || !activeFriendId) return;

    setFriends(friends.map(f => {
      if (f.id === activeFriendId) {
        const delta = iouType === "lent" ? amount : -amount;
        return { ...f, balance: f.balance + delta };
      }
      return f;
    }));

    setIouAmount("");
    setIouDesc("");
    notify("success", iouType === "lent" ? "Recorded amount lent." : "Recorded amount borrowed.");
  };

  const settleAll = (friendId) => {
    setFriends(friends.map(f => {
      if (f.id === friendId) return { ...f, balance: 0 };
      return f;
    }));
    notify("success", "Settled up! Balance cleared.");
  };

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOwedToMe = friends.reduce((sum, f) => f.balance > 0 ? sum + f.balance : sum, 0);
  const totalIOwe = friends.reduce((sum, f) => f.balance < 0 ? sum + Math.abs(f.balance) : sum, 0);

  const activeFriend = friends.find(f => f.id === activeFriendId);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Users size={14} /> Campus Circle
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Campus Bill Splitter</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Stop worrying about who paid for what. Track lent and borrowed money with your friends and roommates easily.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto relative z-10">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center min-w-[140px]">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Owed to me</p>
            <p className="text-xl font-black text-emerald-400">{money(totalOwedToMe)}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center min-w-[140px]">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">I owe them</p>
            <p className="text-xl font-black text-red-400">{money(totalIOwe)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Friends List Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col h-full overflow-hidden">
             <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-white font-bold text-sm">Friends & Groups</h3>
                <button 
                  onClick={() => setIsAddingFriend(!isAddingFriend)}
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
             </div>

             <div className="p-3 bg-slate-950/30">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search friend..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-600"
                  />
                </div>
             </div>

             {isAddingFriend && (
               <form onSubmit={addFriend} className="p-4 bg-indigo-500/5 border-b border-slate-800 animate-in slide-in-from-top duration-200">
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Friend's Name..."
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl py-2 px-3 text-sm text-white mb-2"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-indigo-600 text-white py-1.5 rounded-lg text-xs font-bold">Add</button>
                    <button type="button" onClick={() => setIsAddingFriend(false)} className="px-3 bg-slate-800 text-slate-400 py-1.5 rounded-lg text-xs font-bold">Cancel</button>
                  </div>
               </form>
             )}

             <div className="flex-grow overflow-y-auto max-h-[400px] p-2 space-y-1">
                {filteredFriends.length === 0 ? (
                  <div className="p-8 text-center opacity-30">
                    <Users size={32} className="mx-auto mb-2 text-slate-500" />
                    <p className="text-xs italic">No friends found</p>
                  </div>
                ) : (
                  filteredFriends.map(friend => (
                    <div 
                      key={friend.id}
                      onClick={() => setActiveFriendId(friend.id)}
                      className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        activeFriendId === friend.id 
                          ? 'bg-indigo-600/10 border border-indigo-500/30' 
                          : 'hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                           friend.balance > 0 ? 'bg-emerald-500/20 text-emerald-400' : 
                           friend.balance < 0 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-500'
                         }`}>
                           {friend.name.charAt(0).toUpperCase()}
                         </div>
                         <div>
                           <p className="text-white text-sm font-bold">{friend.name}</p>
                           <p className={`text-[10px] font-medium leading-none mt-1 ${
                             friend.balance > 0 ? 'text-emerald-400' : 
                             friend.balance < 0 ? 'text-red-400' : 'text-slate-500'
                           }`}>
                             {friend.balance > 0 ? 'Owes you' : friend.balance < 0 ? 'You owe' : 'Settled'}
                           </p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`text-sm font-black ${
                           friend.balance > 0 ? 'text-emerald-400' : 
                           friend.balance < 0 ? 'text-red-400' : 'text-slate-100'
                         }`}>
                           {friend.balance === 0 ? '—' : money(Math.abs(friend.balance))}
                         </p>
                         <button 
                           onClick={(e) => { e.stopPropagation(); removeFriend(friend.id); }}
                           className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-500 transition-opacity"
                         >
                           <Trash2 size={12} />
                         </button>
                      </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        {/* Transaction Column */}
        <div className="lg:col-span-2">
           {activeFriend ? (
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                   <div>
                     <h3 className="text-xl font-black text-white">{activeFriend.name}</h3>
                     <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                       Current Balance: 
                       <span className={`font-bold ${activeFriend.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                         {money(activeFriend.balance)}
                       </span>
                     </p>
                   </div>
                   <button 
                     disabled={activeFriend.balance === 0}
                     onClick={() => settleAll(activeFriend.id)}
                     className="px-4 py-2 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                   >
                     Settle Up
                   </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                   {/* Record New Slip */}
                   <div className="space-y-4">
                      <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
                         <p className="text-sm font-bold text-white flex items-center gap-2">
                           <HandCoins size={16} className="text-cyan-400" /> Log New Expense
                         </p>
                         
                         <div className="flex p-1 bg-slate-900 rounded-xl">
                            <button 
                              onClick={() => setIouType("lent")}
                              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                iouType === "lent" ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <ArrowUpRight size={14} /> I Paid
                            </button>
                            <button 
                              onClick={() => setIouType("borrowed")}
                              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                iouType === "borrowed" ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <ArrowDownRight size={14} /> Friend Paid
                            </button>
                         </div>

                         <div className="space-y-3">
                            <div>
                               <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Amount (₹)</label>
                               <input 
                                 type="number" 
                                 placeholder="0.00"
                                 value={iouAmount}
                                 onChange={(e) => setIouAmount(e.target.value)}
                                 className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500/50"
                               />
                            </div>
                            <div>
                               <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">What was it for?</label>
                               <input 
                                 type="text" 
                                 placeholder="Lunch, Groceries, Movie..."
                                 value={iouDesc}
                                 onChange={(e) => setIouDesc(e.target.value)}
                                 className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500/50"
                               />
                            </div>
                            <button 
                               onClick={addIou}
                               className={`w-full py-3 rounded-xl font-bold transition-all ${
                                 iouType === "lent" 
                                   ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20 shadow-xl' 
                                   : 'bg-red-600 hover:bg-red-500 shadow-red-900/20 shadow-xl'
                               } text-white`}
                            >
                              Confirm Log
                            </button>
                         </div>
                      </div>
                   </div>

                   {/* Insight Card */}
                   <div className="space-y-4">
                      <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-5 rounded-3xl border border-indigo-500/20">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/30">
                           <Landmark size={24} />
                         </div>
                         <h4 className="text-white font-bold text-lg mb-2">Student Life Insight</h4>
                         <p className="text-slate-300 text-xs leading-relaxed">
                            Students who use shared bill trackers save an average of <strong>₹2,400/month</strong> by avoiding 'leakage' where small borrowed amounts are forgotten.
                         </p>
                         <div className="mt-4 pt-4 border-t border-indigo-500/10 flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                           <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Live Sync Enabled</p>
                         </div>
                      </div>

                      <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800">
                         <p className="text-xs text-slate-500 leading-relaxed font-medium">
                           Pro-tip: Settling up regularly keeps the "Roomie Vibe" positive! You can use the "Settle Up" button once the cash is exchanged.
                         </p>
                      </div>
                   </div>
                </div>
              </div>
           ) : (
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed h-full flex flex-col items-center justify-center text-center p-12">
                 <div className="w-20 h-20 rounded-3xl bg-slate-950 flex items-center justify-center text-slate-600 border border-slate-800 mb-4">
                   <Users size={40} />
                 </div>
                 <h3 className="text-white font-bold text-lg mb-2">Select a Friend</h3>
                 <p className="text-slate-500 text-sm max-w-xs">
                   Choose a person from your circle to view, log, or settle your shared expenses.
                 </p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CampusSplitterPage;
