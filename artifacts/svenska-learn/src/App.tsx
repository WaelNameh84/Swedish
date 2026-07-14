import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import ConversationsPage from '@/pages/ConversationsPage';
import ChatPage from '@/pages/ChatPage';
import LessonsPage from '@/pages/LessonsPage';
import LessonDetailPage from '@/pages/LessonDetailPage';
import BottomNav from '@/components/BottomNav';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lessons" component={LessonsPage} />
      <Route path="/lessons/:id" component={LessonDetailPage} />
      <Route path="/conversations" component={ConversationsPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/stats" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <div className="pb-[64px]">
            <Router />
          </div>
          <BottomNav />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;