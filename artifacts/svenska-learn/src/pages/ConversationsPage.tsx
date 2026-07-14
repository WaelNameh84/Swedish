import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ChevronRight, Volume2, Search, PlayCircle } from "lucide-react";
import { useGetConversations, useGetConversation, getGetConversationQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ConversationsPage() {
  const { data: conversations, isLoading } = useGetConversations();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="min-h-[100dvh] w-full max-w-2xl mx-auto pb-24 flex flex-col relative bg-background">
      <AnimatePresence mode="wait">
        {!selectedId ? (
          <motion.div 
            key="list"
            className="flex flex-col gap-6 w-full px-4 pt-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                المحادثات
              </h1>
              <p className="text-muted-foreground text-sm">
                تدرب على المحادثات اليومية باللغة السويدية
              </p>
            </div>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="ابحث عن محادثة..." 
                className="pl-4 pr-10 bg-card rounded-xl border-card-border shadow-sm h-12"
              />
            </div>

            <div className="flex flex-col gap-3 pb-8">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                ))
              ) : conversations && conversations.length > 0 ? (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className="bg-card border border-card-border p-4 rounded-2xl flex flex-col gap-3 text-right hover:border-primary/40 active:scale-[0.98] transition-all shadow-sm group"
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-primary bg-primary/10 w-max px-2.5 py-1 rounded-md">
                          {conv.category}
                        </span>
                        <h3 className="text-[17px] font-bold text-foreground">{conv.titleAr}</h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shrink-0 ${
                        conv.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        conv.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {conv.difficulty === 'beginner' ? 'مبتدئ' : 
                         conv.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[15px] font-medium text-muted-foreground" dir="ltr">{conv.title}</p>
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                 <div className="text-center p-8 bg-card border border-card-border rounded-2xl flex flex-col items-center gap-3">
                   <MessageSquare className="w-12 h-12 text-muted-foreground/50" />
                   <p className="text-muted-foreground font-medium">لا توجد محادثات متاحة حالياً.</p>
                 </div>
              )}
            </div>
          </motion.div>
        ) : (
          <ConversationDetailView key="detail" id={selectedId} onBack={() => setSelectedId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ConversationDetailView({ id, onBack }: { id: number; onBack: () => void }) {
  const { data, isLoading } = useGetConversation(id, {
    query: {
      enabled: !!id,
      queryKey: getGetConversationQueryKey(id)
    }
  });

  return (
    <motion.div 
      className="absolute top-0 left-0 w-full min-h-[100dvh] bg-background z-20 flex flex-col pb-24"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 -mr-2 text-muted-foreground hover:text-foreground">
          <ChevronRight className="w-6 h-6" />
        </Button>
        <div className="flex-1 truncate">
          {isLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : (
             <h2 className="text-base font-bold truncate text-foreground">{data?.titleAr}</h2>
          )}
        </div>
        <Button variant="secondary" size="sm" className="shrink-0 gap-1.5 h-8 text-xs font-semibold rounded-full bg-primary/10 text-primary hover:bg-primary/20">
          <PlayCircle className="w-4 h-4" />
          استمع للكل
        </Button>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`flex flex-col w-[85%] ${i % 2 === 0 ? 'self-start' : 'self-end items-end'}`}>
              <Skeleton className={`h-24 w-full rounded-2xl ${i % 2 === 0 ? 'rounded-tr-none' : 'rounded-tl-none'}`} />
            </div>
          ))
        ) : data?.lines ? (
          data.lines.map((line) => {
            const isA = line.speaker === "A";
            return (
              <div 
                key={line.id} 
                className={`flex w-full max-w-[90%] gap-2.5 ${isA ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                <div className="shrink-0 flex flex-col items-center gap-1 mt-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isA ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-secondary text-secondary-foreground border border-border'
                  }`}>
                    {line.speaker}
                  </div>
                </div>
                
                <div className={`flex flex-col gap-2.5 p-3.5 shadow-sm ${
                  isA 
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm shadow-primary/10' 
                    : 'bg-card border border-card-border rounded-2xl rounded-tl-sm'
                }`}>
                  <div className="flex flex-col" dir="ltr">
                    <span className="text-[16px] font-bold">{line.textSv}</span>
                    {line.phonetic && (
                      <span className={`text-[12px] mt-0.5 font-mono ${isA ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        /{line.phonetic}/
                      </span>
                    )}
                  </div>
                  
                  <div className={`h-px w-full ${isA ? 'bg-primary-foreground/20' : 'bg-border'}`} />
                  
                  <div className="flex justify-between items-end gap-3" dir="rtl">
                    <p className={`text-[14px] leading-relaxed font-medium ${isA ? 'text-primary-foreground/90' : 'text-foreground/90'}`}>
                      {line.textAr}
                    </p>
                    <button className={`shrink-0 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
                      isA ? 'text-primary-foreground' : 'text-primary'
                    }`}>
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : null}
      </div>
    </motion.div>
  );
}