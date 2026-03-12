import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../lib/api";
import { Send, Bot, User, Loader2, Sparkles, Plus, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";

const MoneyBuddyPage = () => {
  const { user } = useAuth();
  const defaultWelcome = { role: 'buddy', text: `Hey ${user?.name || 'there'}! I'm your **Money Buddy**. \n\nAsk me anything about your spending, goals, or budget and I'll help you out. Let's make your money work for you! 💪` };
  
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([defaultWelcome]);
  
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const chatContainerRef = useRef(null);

  // Fetch all chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get('/api/ai/chats');
        if (response.data.chats && response.data.chats.length > 0) {
          setChats(response.data.chats);
          setActiveChatId(response.data.chats[0]._id);
        } else {
          setIsInitialLoading(false);
        }
      } catch (error) {
        console.error("Failed to load chats", error);
        setIsInitialLoading(false);
      }
    };
    fetchChats();
  }, []);

  // Fetch history when activeChatId changes
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!activeChatId) {
        setChatHistory([defaultWelcome]);
        setIsInitialLoading(false);
        return;
      }
      setIsInitialLoading(true);
      try {
        const response = await api.get(`/api/ai/chats/${activeChatId}`);
        if (response.data.messages && response.data.messages.length > 0) {
          setChatHistory(response.data.messages);
        } else {
          setChatHistory([defaultWelcome]);
        }
      } catch (error) {
        console.error("Failed to load chat history", error);
        setChatHistory([defaultWelcome]);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [activeChatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userMsg.trim() || isLoading) return;

    const newUserMessage = { role: 'user', text: userMsg };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserMsg("");
    setIsLoading(true);

    try {
      const response = await api.post('/api/ai/chats', { message: userMsg, chatId: activeChatId });
      const data = response.data;
      setChatHistory(prev => [...prev, { role: 'buddy', text: data.reply }]);
      
      if (!activeChatId && data.chatId) {
        setActiveChatId(data.chatId);
        setChats(prev => [{ _id: data.chatId, title: data.title || "New Chat" }, ...prev]);
      }
    } catch (error) {
      const errorText = error.response?.data?.error || "Oops! I'm having a little trouble connecting right now. Please try again in a moment.";
      setChatHistory(prev => [...prev, { role: 'buddy', text: errorText }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setActiveChatId(null);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);



  return (
    <div className="flex h-[calc(100vh-140px)] w-full max-w-6xl mx-auto gap-4">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-800">
          <button 
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 rounded-xl font-medium transition-colors border border-cyan-500/20"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.map(chat => (
            <button
              key={chat._id}
              onClick={() => setActiveChatId(chat._id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${activeChatId === chat._id ? 'bg-slate-800 text-white' : 'hover:bg-slate-900 text-slate-400'}`}
            >
              <MessageSquare size={16} className="shrink-0" />
              <span className="truncate text-sm font-medium pr-2">{chat.title}</span>
            </button>
          ))}
          {chats.length === 0 && (
            <div className="text-center p-4 text-sm text-slate-500">No previous chats.</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl shadow-cyan-900/10 overflow-hidden relative">
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <Bot size={22} className="stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base m-0 leading-tight flex items-center gap-1.5">
                Money Buddy
                <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-400 m-0">AI Financial Coach</p>
            </div>
          </div>
          <div className="md:hidden">
             <button onClick={startNewChat} className="p-2 text-cyan-400 bg-cyan-500/10 rounded-full">
               <Plus size={18} />
             </button>
          </div>
        </div>

        {isInitialLoading ? (
          <div className="flex-grow flex items-center justify-center bg-slate-950">
            <div className="flex flex-col items-center gap-2 text-cyan-400">
              <Loader2 size={32} className="animate-spin" />
              <span className="text-sm font-medium">Loading chat...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950" ref={chatContainerRef}>
              {chatHistory.map((message, index) => {
            const isBuddy = message.role === 'buddy';
            return (
              <div key={index} className={`flex gap-3 ${isBuddy ? 'items-start' : 'items-start flex-row-reverse'}`}>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                  isBuddy 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                }`}>
                  {isBuddy ? <Bot size={18} /> : <User size={18} />}
                </div>

                <div className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isBuddy 
                    ? 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-sm' 
                    : 'bg-indigo-600 border border-indigo-500 text-white rounded-tr-sm'
                }`}>
                  {isBuddy ? (
                    <div className="text-slate-300">
                      <ReactMarkdown 
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold text-cyan-300" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-white font-semibold mt-3 mb-1 text-sm" {...props} />,
                          h4: ({node, ...props}) => <h4 className="text-white font-medium mt-2 mb-1 text-sm" {...props} />
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div>{message.text}</div>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-3 items-start animate-pulse">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-cyan-400" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>
        </>
        )}

        {/* Input Form */}
        <form onSubmit={sendMessage} className="shrink-0 p-4 bg-slate-900/50 backdrop-blur-md border-t border-slate-800">
          <div className="relative flex items-center">
            <input
              type="text"
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              placeholder="Ask your buddy anything..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 rounded-full py-3.5 pl-6 pr-14 text-sm text-white placeholder-slate-500 transition-all outline-none"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="absolute right-2 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:bg-slate-700" 
              disabled={isLoading || !userMsg.trim()}
            >
              <Send size={18} className="translate-x-[1px] translate-y-[-1px]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoneyBuddyPage;
