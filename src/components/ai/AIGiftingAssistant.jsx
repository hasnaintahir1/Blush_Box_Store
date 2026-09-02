import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Gift, ShoppingBag, ArrowRight, Bot, User, RefreshCw } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

const SUGGESTED_PROMPTS = [
  "Find a birthday gift for mom under $50",
  "Romantic anniversary gift for my wife",
  "Luxury corporate appreciation hamper",
  "Engraved heirloom gift for him",
  "Wedding gift for a couple under $100"
];

export default function AIGiftingAssistant() {
  const { isAIModalOpen, setIsAIModalOpen, addToCart, navigate } = useStore();
  
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "assistant",
      text: "Greetings. I am your Lumière Gifting Concierge. Whether celebrating a milestone anniversary, searching for a bespoke personalized heirloom, or curating a corporate hamper, tell me who you are honoring and I will hand-select the perfect gift from our collection.",
      recommendedProducts: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIModalOpen) {
      scrollToBottom();
    }
  }, [messages, isAIModalOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      recommendedProducts: []
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          chatHistory: messages.slice(-4)
        })
      });

      const data = await res.json();
      
      const assistantMsg = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I have curated these exceptional options tailored to your request:",
        recommendedProducts: data.recommendedProducts || []
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: "I apologize for the momentary delay. I warmly invite you to explore our signature curated hampers and fine jewelry collections.",
          recommendedProducts: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAIModalOpen) {
    return (
      <button
        onClick={() => setIsAIModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-stone-900 to-stone-800 dark:from-amber-600 dark:to-amber-700 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2.5 border border-amber-400/40 cursor-pointer group"
        aria-label="Open AI Gifting Assistant"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-serif font-bold tracking-wide pr-1">AI Gift Concierge</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full sm:max-w-lg h-[90vh] sm:h-[650px] bg-white dark:bg-stone-900 sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Assistant Header */}
        <div className="p-4 sm:p-5 bg-stone-950 text-white flex items-center justify-between border-b border-amber-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-white tracking-wide">
                  Lumière AI Concierge
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                  Gifting Specialist
                </span>
              </div>
              <p className="text-[11px] text-stone-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                Connected to Luxury Inventory
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAIModalOpen(false)}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-50/50 dark:bg-stone-950/30">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-stone-900 dark:bg-amber-600/30 border border-amber-500/30 text-amber-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Gift className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-amber-600 text-white rounded-br-none shadow-sm' 
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Recommended Product Cards inside Chat */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="space-y-2 pt-1 w-full">
                    <p className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                      Recommended Gifts:
                    </p>
                    {msg.recommendedProducts.map((p) => (
                      <div
                        key={p._id}
                        className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-amber-200 dark:border-stone-700 shadow-sm flex items-center gap-3 hover:border-amber-400 transition-colors"
                      >
                        <img 
                          src={p.images?.[0]} 
                          alt={p.name} 
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-xs font-bold text-stone-900 dark:text-white truncate">
                            {p.name}
                          </h4>
                          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                            ${p.discountPrice || p.price}
                          </p>
                          <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                            {p.shortDescription || p.category}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              setIsAIModalOpen(false);
                              navigate('product-details', { slug: p.slug, id: p._id });
                            }}
                            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-amber-600 hover:text-white text-[10px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="p-1.5 rounded-lg bg-stone-900 dark:bg-amber-600 text-white hover:bg-amber-600 text-[10px] font-semibold flex items-center justify-center transition-colors"
                            title="Add to cart"
                          >
                            <ShoppingBag className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-stone-900 dark:bg-amber-600/30 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Curating bespoke gift recommendations...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-stone-100/80 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 flex gap-1.5 overflow-x-auto pb-2">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 text-[11px] rounded-full bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything about gifts, budgets, occasions, recipients..."
            className="flex-1 px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-2.5 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded-xl transition-colors flex items-center justify-center cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
