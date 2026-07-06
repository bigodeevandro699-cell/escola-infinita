import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ProfessorMentor } from '../services/professorMentor';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'mentor';
  content: string;
}

export function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'mentor',
      content: 'Olá! Sou seu Professor Mentor. Como posso ajudar nos seus estudos hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await ProfessorMentor.perguntar(userMessage);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'mentor', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'mentor', 
        content: 'Desculpe, tive um problema ao processar sua dúvida. Pode tentar novamente?' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      <div className="premium-card p-6 flex flex-col h-full overflow-hidden border border-[var(--card-border)] shadow-xl relative">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--card-border)] relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
            <Bot className="w-6 h-6 text-indigo-400 relative z-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Professor Mentor AI</h1>
            <p className="text-[var(--text-muted)] text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Online e pronto para ajudar
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 space-y-6 relative z-10 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'mentor' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-[var(--surface-hover)] text-white'
              }`}>
                {msg.role === 'mentor' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl p-5 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-sm shadow-lg shadow-indigo-500/20' 
                  : 'bg-[var(--surface-hover)] text-[var(--text-muted)] rounded-tl-sm border border-[var(--card-border)]'
              }`}>
                {msg.role === 'mentor' ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                ) : (
                  <p className="leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="bg-[var(--surface-hover)] border border-[var(--card-border)] rounded-2xl rounded-tl-sm p-5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[var(--text-muted)] text-sm ml-2 font-medium">Professor está digitando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--card-border)] relative z-10">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-end gap-2"
          >
            <div className="relative flex-1">
              <div className="absolute top-3.5 left-4">
                <Sparkles className="w-5 h-5 text-indigo-400/50" />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte qualquer coisa sobre seus estudos..."
                className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none custom-scrollbar transition-all"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                style={{ minHeight: '52px', maxHeight: '150px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex-shrink-0 group"
            >
              <Send className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </form>
          <p className="text-center text-xs text-[var(--text-muted)] mt-4">
            A IA pode cometer erros. Considere verificar informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
