import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Scissors,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIStylistModal: React.FC = () => {
  const { isAIStylistOpen, setIsAIStylistOpen } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `**Assalam-o-Alaikum! Welcome to the Stitch & Unstitched Atelier Concierge.**

I am your personal Pakistani fashion & fabric consultant based in Karachi. How may I assist you today?
• Styling advice for Karachi summer lawn vs festive velvet
• Recommended stitching cuts, necklines & sleeve styles for unstitched suits
• Sizing & fabric care tips for pure Pima lawn & silk chiffon`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'Best fabric for Karachi summer wedding?',
    'How should I get an unstitched 3-piece tailored?',
    'Care instructions for luxury lawn with silk dupatta',
    'What is trending in Men\'s Kurta & Shalwar Kameez for Eid?',
  ];

  if (!isAIStylistOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const reply = await api.askAIStylist(query.trim());
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'Our stylist concierge is currently assisting high volume Karachi clients. For immediate custom stitching queries, please WhatsApp +92 300 1234567.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAIStylistOpen(false)}
      />

      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#e5dfd3] z-10 flex flex-col h-[600px] max-h-[90vh] animate-fadeIn">
        {/* Header */}
        <div className="p-4 bg-[#1c1917] text-white flex items-center justify-between border-b border-[#292524]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ea580c] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-sm tracking-wide text-white">
                STITCH &amp; UNSTITCHED STYLIST AI
              </h3>
              <p className="text-[10px] text-[#fed7aa]">Karachi Fashion, Fabric &amp; Tailoring Advisor</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIStylistOpen(false)}
            className="p-1 text-[#a8a29e] hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf8f5]">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#ea580c] text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-[#292524] border border-[#e5dfd3] rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line prose-xs">{msg.text}</div>
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-orange-200' : 'text-[#a8a29e]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#292524] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-[#78716c]">
              <div className="w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center shrink-0 animate-pulse">
                <Scissors className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#e5dfd3] shadow-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ea580c]" />
                <span>Consulting Karachi fashion stylists...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#f5f2eb] border-t border-[#e5dfd3] overflow-x-auto flex gap-2 no-scrollbar">
          {quickPrompts.map(prompt => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="bg-white hover:bg-orange-50 hover:text-[#ea580c] text-[#44403c] text-[11px] font-medium px-3 py-1.5 rounded-full border border-[#d6cfc4] shrink-0 transition-colors whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#f0ece1]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about lawn fabric, stitching ideas, neckline styles..."
              className="flex-1 bg-[#faf8f5] border border-[#d6cfc4] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ea580c] text-[#1c1917]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shrink-0"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
