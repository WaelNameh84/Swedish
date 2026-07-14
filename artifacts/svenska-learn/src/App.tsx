import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import ConversationsPage from '@/pages/ConversationsPage';
import ChatPage from '@/pages/ChatPage';
import LessonsPage from '@/pages/LessonsPage';
import LessonDetailPage from '@/pages/LessonDetailPage';
import DictionaryPage from '@/pages/DictionaryPage';
import VerbsPage from '@/pages/VerbsPage';
import AiTeacherHubPage from '@/pages/AiTeacherHubPage';
import AiToolPage from '@/pages/AiToolPage';
import PronunciationPage from '@/pages/PronunciationPage';
import AudioLearningHubPage from '@/pages/AudioLearningHubPage';
import RadioPage from '@/pages/audio/RadioPage';
import SleepModePage from '@/pages/audio/SleepModePage';
import RepeatPracticePage from '@/pages/audio/RepeatPracticePage';
import AudioSpeedPage from '@/pages/audio/AudioSpeedPage';
import AutoTranslatePage from '@/pages/audio/AutoTranslatePage';
import BackgroundPlaybackPage from '@/pages/audio/BackgroundPlaybackPage';
import OfflineDownloadPage from '@/pages/audio/OfflineDownloadPage';
import BottomNav from '@/components/BottomNav';
import AppSidebar from '@/components/AppSidebar';
import VoiceTranslator from '@/components/VoiceTranslator';
import { AudioSettingsProvider } from '@/lib/audioSettings';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lessons" component={LessonsPage} />
      <Route path="/lessons/:id" component={LessonDetailPage} />
      <Route path="/dictionary" component={DictionaryPage} />
      <Route path="/verbs" component={VerbsPage} />
      <Route path="/conversations" component={ConversationsPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/ai-teacher" component={AiTeacherHubPage} />
      <Route path="/ai-teacher/pronunciation" component={PronunciationPage} />
      <Route path="/ai-teacher/:tool" component={AiToolPage} />
      <Route path="/audio-learning" component={AudioLearningHubPage} />
      <Route path="/audio-learning/radio" component={RadioPage} />
      <Route path="/audio-learning/sleep" component={SleepModePage} />
      <Route path="/audio-learning/repeat" component={RepeatPracticePage} />
      <Route path="/audio-learning/speed" component={AudioSpeedPage} />
      <Route path="/audio-learning/translate" component={AutoTranslatePage} />
      <Route path="/audio-learning/background" component={BackgroundPlaybackPage} />
      <Route path="/audio-learning/offline" component={OfflineDownloadPage} />
      <Route path="/stats" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioSettingsProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <div className="pb-[64px]">
              <Router />
            </div>
            <AppSidebar />
            <VoiceTranslator />
            <BottomNav />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AudioSettingsProvider>
    </QueryClientProvider>
  );
}

export default App;