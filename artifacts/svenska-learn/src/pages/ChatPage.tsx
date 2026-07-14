import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Loader2, Sparkles } from "lucide-react";
import { 
  useGetChatMessages, 
  getGetChatMessagesQueryKey, 
  useSendChatMessage 
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let currentSession = localStorage.getItem("svenska_chat_session");
    if (!currentSession) {
      currentSession = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      localStorage.setItem("svenska_chat_session", currentSession);
    }
    setSessionId(currentSession);
  }, []);

  const { data: messages, isLoading } = useGetChatMessages(sessionId, {
    query: {
      enabled: !!sessionId,
      queryKey: getGetChatMessagesQueryKey(sessionId)
    }
  });

  const sendMutation = useSendChatMessage();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMutation.isPending]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || sendMutation.isPending || !sessionId) return;

    const messageContent = input.trim();
    setInput("");

    const queryKey = getGetChatMessagesQueryKey(sessionId);
    const prevMessages = queryClient.getQueryData<any[]>(queryKey) || [];
    
    const tempMessage = {
      id: Date.now(),
      sessionId,
      role: "user" as const,
      content: messageContent,
      createdAt: new Date().toISOString()
    };
    
    queryClient.setQueryData(queryKey, [...prevMessages, tempMessage]);

    sendMutation.mutate(
      { sessionId, data: { content: messageContent } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey });
        },
        onError: () => {
          queryClient.setQueryData(queryKey, prevMessages);
          setInput(messageContent);
        }
      }
    );
  };

  const renderMessageContent = (text: string, role: string) => {
    if (role === 'user') return <span>{text}</span>;
    
    // Simple parser to highlight Swedish/Latin text
    const parts = text.split(/([a-zA-ZäöåÄÖÅ][a-zA-ZäöåÄÖÅ\s\.,!?'-]*[a-zA-ZäöåÄÖÅ]|[a-zA-ZäöåÄÖÅ]+)/g);
    return parts.map((part, i) => {
      if (/[a-zA-ZäöåÄÖÅ]/.test(part)) {
        return (
          <span key={i} dir="ltr" className="inline-block text-left font-bold text-primary dark:text-blue-400 bg-primary/10 px-1.5 py-0.5 rounded-md mx-0.5 font-sans shadow-sm">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto flex flex-col relative bg-secondary/20">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-foreground leading-tight">المعلم الذكي</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground font-medium">متصل الآن</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 pb-32 flex flex-col gap-4 overflow-y-auto">
        {!isLoading && (!messages || messages.length === 0) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center my-auto py-12 px-4 gap-4"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2 shadow-inner border border-primary/10">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">مرحباً بك في مساحة التدريب!</h2>
            <p className="text-muted-foreground text-[15px] max-w-[280px] leading-relaxed">
              أنا مساعدك الذكي لتعلم السويدية. يمكنك التحدث معي باللغة السويدية للتدرب، أو سؤالي باللغة العربية عن أي قاعدة أو كلمة.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-xs bg-card border shadow-sm px-3 py-1.5 rounded-full text-muted-foreground font-medium">كيف أقول "شكراً"؟</span>
              <span className="text-xs bg-card border shadow-sm px-3 py-1.5 rounded-full text-muted-foreground font-medium">Hej, hur mår du?</span>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className={`flex w-[80%] ${i % 2 === 0 ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <Skeleton className={`h-16 w-full rounded-2xl ${i % 2 === 0 ? 'rounded-tl-none' : 'rounded-tr-none'}`} />
             </div>
          ))
        ) : (
          messages?.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex w-full max-w-[85%] gap-2.5 ${isUser ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                {!isUser && (
                  <div className="shrink-0 flex flex-col items-center justify-end">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm overflow-hidden text-[11px] font-bold text-blue-800 tracking-wider">
                      SV
                    </div>
                  </div>
                )}
                
                <div className={`flex flex-col gap-1 p-3.5 shadow-sm text-[15px] leading-relaxed ${
                  isUser 
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm shadow-primary/10' 
                    : 'bg-card border border-card-border rounded-2xl rounded-tl-sm text-foreground'
                }`}>
                  {renderMessageContent(msg.content, msg.role)}
                </div>
              </motion.div>
            );
          })
        )}

        {sendMutation.isPending && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full max-w-[85%] gap-2.5 self-end flex-row-reverse"
          >
            <div className="shrink-0 flex flex-col items-center justify-end">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm text-[11px] font-bold text-blue-800 tracking-wider">
                SV
              </div>
            </div>
            <div className="bg-card border border-card-border rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1.5 h-12">
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-[64px] md:bottom-0 left-0 w-full bg-background/95 backdrop-blur-md border-t border-border p-3 z-40">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSend} className="flex items-center gap-2 bg-card border border-card-border rounded-2xl p-1.5 shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب بالسويدية... أو اسأل عن أي شيء"
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 shadow-none text-[15px] h-11 px-3"
              autoComplete="off"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || sendMutation.isPending}
              className="shrink-0 rounded-xl h-11 w-11 bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm"
            >
              {sendMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 transform -scale-x-100 mr-0.5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}